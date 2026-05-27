import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json();

    // Determine if this is a direct invocation with title/body or a database webhook
    let title = payload.title;
    let body = payload.body;
    let data = payload.data || {};
    let targetTokens = payload.tokens || (payload.token ? [payload.token] : []);

    // If it's a Supabase Webhook from 'messages' table
    if (payload.type === 'INSERT' && payload.table === 'messages' && payload.record) {
      const msg = payload.record;
      data.chatId = msg.chat_id;
      
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (supabaseUrl && supabaseKey) {
          // Fetch chat details
          const chatRes = await fetch(`${supabaseUrl}/rest/v1/chats?id=eq.${msg.chat_id}&select=*,profiles:chat_members(user_id,profiles!inner(*))`, {
              headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
          });
          const chats = await chatRes.json();
          const chat = chats?.[0];
          
          // Fetch sender details
          const senderRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${msg.sender_id}&select=*`, {
              headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
          });
          const senders = await senderRes.json();
          const sender = senders?.[0];
          
          if (chat && sender) {
              const senderName = sender.display_name || sender.username || 'Vibegram';
              const textContent = msg.text || (msg.media_urls?.length ? 'Медиа' : 'Новое сообщение');
              
              if (chat.type === 'channel') {
                  title = chat.name || 'Канал';
                  body = textContent;
              } else if (chat.type === 'group') {
                  title = chat.name || 'Группа';
                  body = `${senderName}: ${textContent}`;
              } else {
                  title = senderName;
                  body = textContent;
              }
              
              // Get tokens of other members
              const memberIds = chat.profiles?.map(p => p.profiles.id).filter(id => id !== msg.sender_id) || [];
              if (memberIds.length > 0) {
                  const targetProfilesRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=in.(${memberIds.join(',')})&select=push_token`, {
                      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
                  });
                  const targetProfiles = await targetProfilesRes.json();
                  targetTokens = targetProfiles?.map(p => p.push_token).filter(t => t) || [];
              }
          }
      }
    }

    if (targetTokens.length === 0) {
      throw new Error("No tokens provided or found");
    }

    const projectId = Deno.env.get("FIREBASE_PROJECT_ID");
    const serviceAccountClientEmail = Deno.env.get("FIREBASE_CLIENT_EMAIL");
    const serviceAccountPrivateKeyStr = Deno.env.get("FIREBASE_PRIVATE_KEY");

    if (!projectId || !serviceAccountClientEmail || !serviceAccountPrivateKeyStr) {
      throw new Error("Missing Firebase credentials.");
    }

    const serviceAccountPrivateKey = serviceAccountPrivateKeyStr.replace(/\\n/g, '\n');

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      extractPemKey(serviceAccountPrivateKey),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const jwtHeader = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = btoa(JSON.stringify({
      iss: serviceAccountClientEmail,
      scope: "https://www.googleapis.com/auth/firebase.messaging",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }));

    const unsignedJwt = `${jwtHeader}.${jwtPayload}`;
    const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, new TextEncoder().encode(unsignedJwt));
    const signedJwt = `${unsignedJwt}.${btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${signedJwt}`,
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
    let successCount = 0;
    
    for (const t of targetTokens) {
      const fcmPayload = {
        message: {
          token: t,
          notification: {
            title: title || "Vibegram", 
            body: body || "Новое сообщение"
          },
          data: {
             ...data,
             chatId: data?.chatId || ""
          }
        }
      };

      const res = await fetch(fcmUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fcmPayload)
      });
      
      if (res.ok) successCount++;
    }

    return new Response(
      JSON.stringify({ success: true, count: successCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

function extractPemKey(pem: string) {
  const lines = pem.split('\n').filter(line => line.trim().length > 0 && !line.includes('---'));
  const b64 = lines.join('');
  const binString = atob(b64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes.buffer;
}
