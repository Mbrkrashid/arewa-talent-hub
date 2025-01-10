import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { title, description, video_url } = await req.json()

    // Initialize TikTok API client
    const tiktokApiUrl = 'https://open.tiktokapis.com/v2/video/upload/'
    const tiktokAccessToken = await getTiktokAccessToken()

    // Upload to TikTok
    const response = await fetch(tiktokApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tiktokAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        video_url,
        title,
        description,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to upload to TikTok')
    }

    const result = await response.json()

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function getTiktokAccessToken() {
  const clientKey = Deno.env.get('TIKTOK_CLIENT_KEY')
  const clientSecret = Deno.env.get('TIKTOK_CLIENT_SECRET')
  
  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get TikTok access token')
  }

  const data = await response.json()
  return data.access_token
}