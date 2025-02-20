import { createClient } from '@supabase/supabase-js'

class SupabaseClient {
  private static instance: ReturnType<typeof createClient>
  private static initializationError: Error | null = null

  private static validateEnvironmentVariables(): void {
    const requiredVars = {
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
    }

    const missingVars = Object.entries(requiredVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      )
    }
  }

  public static getClient() {
    if (this.initializationError) {
      throw this.initializationError
    }

    if (!this.instance) {
      try {
        this.validateEnvironmentVariables()

        this.instance = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY,
          {
            auth: {
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: true
            },
            // Add request retrying
            global: {
              fetch: (url, options) => {
                return fetch(url, {
                  ...options,
                  // Add retry logic for failed requests
                  signal: options?.signal
                }).catch(async error => {
                  console.error('Fetch error:', error)
                  // Implement retry logic here if needed
                  throw error
                })
              }
            }
          }
        )
      } catch (error) {
        this.initializationError = error as Error
        throw error
      }
    }

    return this.instance
  }
}

// Export a singleton instance
export const supabase = SupabaseClient.getClient()

// Helper function for Google OAuth
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) {
      console.error('Google sign-in error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Unexpected error during Google sign-in:', error)
    throw error
  }
}