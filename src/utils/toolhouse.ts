import { supabase } from "@/integrations/supabase/client";

interface ToolHouseApiOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

export async function callToolHouseApi({ endpoint, method = 'GET', data }: ToolHouseApiOptions) {
  try {
    // Ensure we're using the proper invoke method with authorization
    const { data: response, error } = await supabase.functions.invoke('toolhouse-api', {
      body: { endpoint, method, data },
      headers: {
        Authorization: `Bearer ${supabase.auth.getSession()}`
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