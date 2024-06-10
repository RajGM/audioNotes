import { Database } from './supabase';

export type TypeAudio = Database['public']['Tables']['voice_transcriptions']['Row'];
