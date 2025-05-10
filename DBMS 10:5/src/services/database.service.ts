import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Report-specific queries
export const reportService = {
  async getEventRegistrationStats() {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        event_id,
        registration_status,
        events (
          name,
          category
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTeamParticipationStats() {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_members (
          user_id
        ),
        events (
          name,
          category
        )
      `);

    if (error) throw error;
    return data;
  },

  async getPaymentStats() {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        amount,
        payment_status,
        created_at,
        registrations (
          event_id,
          events (
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getUserParticipationStats(userId: string) {
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (
          name,
          category,
          event_date
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getEventPerformanceStats(eventId: string) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        registrations (
          registration_status,
          user_id,
          team_id
        ),
        feedback (
          rating,
          comments
        )
      `)
      .eq('id', eventId)
      .single();

    if (error) throw error;
    return data;
  }
};