import { supabase } from "@/integrations/supabase/client";

export async function callToolHouseApi({ endpoint, method = 'GET', data }: {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}) {
  try {
    // For chat endpoints, we don't need authentication
    if (endpoint.startsWith('/vapi')) {
      const response = await fetch(`https://api.vapi.ai${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-80c5433f1eda4faf978585129fc28f2c`
        },
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      return await response.json();
    }

    // For other endpoints that require authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Failed to get session');
    }

    if (!sessionData.session?.access_token) {
      console.error('No access token found');
      throw new Error('No access token available');
    }

    const { data: response, error } = await supabase.functions.invoke('toolhouse-api', {
      body: { 
        endpoint: endpoint.startsWith('/') ? endpoint : `/${endpoint}`,
        method, 
        data,
        model: 'deepseek',
        apiKey: 'sk-80c5433f1eda4faf978585129fc28f2c'
      },
      headers: {
        Authorization: `Bearer ${sessionData.session.access_token}`
      }
    });

    if (error) {
      console.error('Error calling ToolHouse API:', error);
      throw error;
    }

    return response;
  } catch (error) {
    console.error('Error in callToolHouseApi:', error);
    throw error;
  }
}