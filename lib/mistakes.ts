import { supabase } from './supabase';
import { getUserIdByPhone } from './user';

export type SavedMistake = {
  id: string;
  user_id: string;
  question: string;
  user_answer: string | null;
  correct_answer: string | null;
  grammar: string | null;
  created_at: string;
  analysis_cache: unknown;
};

export async function updateMistakeAnalysisCache(
  id: string,
  cache: unknown
): Promise<void> {
  const { error } = await supabase
    .from('mistakes')
    .update({ analysis_cache: cache })
    .eq('id', id);
  if (error) throw error;
}

export async function getMistakesByUserId(phone: string): Promise<SavedMistake[]> {
  const userId = await getUserIdByPhone(phone);
  if (!userId) return [];
  const { data, error } = await supabase
    .from('mistakes')
    .select('id, user_id, question, user_answer, correct_answer, grammar, created_at, analysis_cache')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as SavedMistake[]) || [];
}

export async function getMistakeById(id: string): Promise<SavedMistake | null> {
  const { data, error } = await supabase
    .from('mistakes')
    .select('id, user_id, question, user_answer, correct_answer, grammar, created_at, analysis_cache')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as SavedMistake | null;
}
