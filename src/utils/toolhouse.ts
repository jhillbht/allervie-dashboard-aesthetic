import { supabase } from "@/integrations/supabase/client";

interface ToolHouseApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

export async function callToolHouseApi({ endpoint, method = 'GET', data }: ToolHouseApiOptions) {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Failed to get session');
    }

    if (!sessionData.session?.access_token) {
      console.error('No access token found');
      throw new Error('No access token available');
    }

    // Ensure endpoint starts with a forward slash
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const { data: response, error } = await supabase.functions.invoke('toolhouse-api', {
      body: { 
        endpoint: formattedEndpoint,
        method, 
        data 
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