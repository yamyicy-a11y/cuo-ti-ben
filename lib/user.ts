import { supabase, type UserProfile } from './supabase';

export async function getUserByPhone(phone: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, phone, stage, grade, textbook_version, created_at')
    .eq('phone', phone)
    .maybeSingle();
  if (error) throw error;
  return data as UserProfile | null;
}

export async function createUser(phone: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .insert({ phone })
    .select('id, phone, stage, grade, textbook_version, created_at')
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function updateUserProfile(
  phone: string,
  updates: { stage?: string; grade?: string; textbook_version?: string }
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('phone', phone)
    .select('id, phone, stage, grade, textbook_version, created_at')
    .single();
  if (error) throw error;
  return data as UserProfile;
}

export async function getUserIdByPhone(phone: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();
  if (error) throw error;
  return data?.id ?? null;
}
