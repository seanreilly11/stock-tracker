// server/actions/auth.ts
import { createClient } from "@/lib/supabase/client"

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithMagicLink(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
}

export async function signOutUser() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  window.location.assign("/")
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}
