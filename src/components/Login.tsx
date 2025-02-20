import React from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        console.error('Error:', error.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Sign in with Google
      </button>
    </div>
  )
}