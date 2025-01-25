import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('TOOLHOUSE_API_KEY')
    if (!apiKey) {
      throw new Error('ToolHouse API key not found')
    }

    const { endpoint, method = 'GET', data } = await req.json()

    const response = await fetch(`https://api.toolhouse.com${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined,
    })

    const result = await response.json()
    console.log('ToolHouse API Response:', result)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in toolhouse-api function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})