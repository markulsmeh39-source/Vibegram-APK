import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JWT } from "https://esm.sh/google-auth-library@9";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const FIREBASE_SERVICE_ACCOUNT = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Обработка CORS preflight (OPTIONS запрос)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!FIREBASE_SERVICE_ACCOUNT) {
      throw new Error('Missing FIREBASE_SERVICE_ACCOUNT env var');
    }

    const authHeader = req.headers.get('Authorization');
    
    const supabaseOptions = authHeader ? { global: { headers: { Authorization: authHeader } } } : {};
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      supabaseOptions
    );

    const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);
    
    // Авторизация для FCM v1 API
    const jwtClient = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const tokens = await jwtClient.getAccessToken();
    const accessToken = tokens.token;

    // Читаем тело из вызова с клиента
    const payload = await req.json();
    
    // Делаем обработку гибкой (иногда CapacitorHttp или разные версии supabase-js оборачивают body)
    let reqData = payload;
    if (payload && !payload.token && !payload.tokens && payload.body) {
         if (typeof payload.body === 'string') {
             try { reqData = JSON.parse(payload.body); } catch(e) {}
         } else {
             reqData = payload.body;
         }
    }
    
    let title = reqData.title || "Vibegram";
    let bodyText = reqData.body || "Новое сообщение";
    const { chat_id, text, sender_name } = reqData;

    // Серверная логика форматирования (как в ТГ), если клиент передал нужные данные
    if (chat_id && text) {
       // Получаем информацию о чате
       const { data: chatData } = await supabase.from('chats').select('type, title').eq('id', chat_id).single();
       
       // Идентифицируем реального отправителя по JWT
       let realSenderName = sender_name;
       if (authHeader) {
           const token = authHeader.replace('Bearer ', '');
           const { data: { user } } = await supabase.auth.getUser(token);
           if (user) {
               const { data: profile } = await supabase.from('profiles').select('display_name, username').eq('id', user.id).single();
               if (profile) {
                   realSenderName = profile.display_name || profile.username || sender_name;
               }
           }
       }
       
       if (realSenderName === "Vibegram" || !realSenderName) {
           realSenderName = "Пользователь";
       }

       if (chatData) {
           if (chatData.type === 'channel') {
               // Канал: Заголовок = Название канала, Текст = Сообщение
               title = chatData.title || title;
               bodyText = text;
           } else if (chatData.type === 'group') {
               // Группа: Заголовок = Название группы, Текст = Имя: Сообщение
               title = chatData.title || title;
               bodyText = `${realSenderName}: ${text}`;
           } else {
               // Личный чат: Заголовок = Имя, Текст = Сообщение
               title = realSenderName;
               bodyText = text;
           }
       }
    }
    
    // FCM v1 строго требует, чтобы ВСЕ значения внутри объекта "data" были строками
    const pushData: Record<string, string> = {};
    if (reqData.data && typeof reqData.data === 'object') {
      for (const [key, value] of Object.entries(reqData.data)) {
        pushData[key] = String(value);
      }
    }

    // Поддержка как одного токена (ЛС) так и массива (Группы)
    const targetTokens = reqData.tokens || (reqData.token ? [reqData.token] : []);

    if (targetTokens.length === 0) {
      return new Response(JSON.stringify({ error: "No tokens provided" }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400
      });
    }

    const projectId = serviceAccount.project_id;
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    // Отправляем пуши на каждый токен Android устройства
    const sendResults = await Promise.all(targetTokens.map(async (token: string) => {
      const fcmMessage = {
        message: {
          token: token,
          notification: {
            title: title,
            body: bodyText
          },
          data: pushData
        }
      };

      const response = await fetch(fcmUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fcmMessage)
      });
      return await response.json();
    }));

    return new Response(JSON.stringify({ success: true, results: sendResults }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500
    });
  }
});
