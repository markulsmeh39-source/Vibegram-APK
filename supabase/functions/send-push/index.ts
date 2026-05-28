import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    let payload = await req.json();
    let { token, tokens, title, body, data, chat_id, text, sender_name } = payload.body || payload;
    
    // Server-side formatting logic mimicking Telegram
    if (chat_id && text && sender_name) {
       const { data: chatData } = await supabase.from('chats').select('type, title').eq('id', chat_id).single();
       if (chatData) {
           if (chatData.type === 'channel') {
               title = chatData.title;
               body = text;
           } else if (chatData.type === 'group') {
               title = chatData.title;
               body = `${sender_name}: ${text}`;
           } else {
               title = sender_name;
               body = text;
           }
       }
    }

    const pushEndpoint = 'https://ais-pre-sr5rmtt2slx6w7n7rjsflu-621526051979.europe-west2.run.app/api/send-push';
    const fcmRes = await fetch(pushEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, tokens, title, body, data })
    });
    
    const fcmData = await fcmRes.json();
    
    return new Response(JSON.stringify(fcmData), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      status: 400,
    });
  }
});
