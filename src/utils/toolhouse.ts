import { supabase } from "@/integrations/supabase/client";

interface ToolHouseApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

export async function callToolHouseApi({ endpoint, method = 'GET', data }: ToolHouseApiOptions) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const { data: response, error } = await supabase.functions.invoke('toolhouse-api', {
      body: { endpoint, method, data },
      headers: {
        Authorization: `Bearer ${sessionData.session?.access_token || ''}`
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