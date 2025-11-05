// Supabase Client Integration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

class SupabaseService {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.participant = null;
        this.initialize();
    }

    initialize() {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase credentials not found');
            return;
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.setupAuthListener();
        this.checkUser();
    }

    setupAuthListener() {
        if (!this.supabase) return;

        this.supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session?.user || null;
                this.loadParticipantData();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.participant = null;
                this.updateAuthUI();
            }
        });
    }

    async checkUser() {
        if (!this.supabase) return;

        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            await this.loadParticipantData();
        }
        this.updateAuthUI();
    }

    async signUp(email, password) {
        if (!this.supabase) return { error: 'Supabase not initialized' };

        const { data, error } = await this.supabase.auth.signUp({
            email,
            password
        });

        if (!error && data.user) {
            this.currentUser = data.user;
        }

        return { data, error };
    }

    async signIn(email, password) {
        if (!this.supabase) return { error: 'Supabase not initialized' };

        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (!error && data.user) {
            this.currentUser = data.user;
            await this.loadParticipantData();
        }

        return { data, error };
    }

    async signOut() {
        if (!this.supabase) return;

        await this.supabase.auth.signOut();
        this.currentUser = null;
        this.participant = null;
        this.updateAuthUI();
    }

    async loadParticipantData() {
        if (!this.supabase || !this.currentUser) return;

        const { data, error } = await this.supabase
            .from('challenge_participants')
            .select('*')
            .eq('user_id', this.currentUser.id)
            .maybeSingle();

        if (data) {
            this.participant = data;
        }

        this.updateAuthUI();
    }

    async joinChallenge() {
        if (!this.supabase || !this.currentUser) {
            return { error: 'Must be logged in to join challenge' };
        }

        if (this.participant) {
            return { error: 'Already joined challenge' };
        }

        const { data, error } = await this.supabase
            .from('challenge_participants')
            .insert([{
                user_id: this.currentUser.id,
                email: this.currentUser.email,
                started_at: new Date().toISOString(),
                current_day: 1,
                completed: false
            }])
            .select()
            .single();

        if (!error) {
            this.participant = data;
            await this.initializeProgress();
        }

        return { data, error };
    }

    async initializeProgress() {
        if (!this.supabase || !this.participant) return;

        const progressEntries = Array.from({ length: 30 }, (_, i) => ({
            participant_id: this.participant.id,
            day_number: i + 1,
            completed: false
        }));

        await this.supabase
            .from('challenge_progress')
            .insert(progressEntries);
    }

    async getProgress() {
        if (!this.supabase || !this.participant) return [];

        const { data, error } = await this.supabase
            .from('challenge_progress')
            .select('*')
            .eq('participant_id', this.participant.id)
            .order('day_number');

        return data || [];
    }

    async completeDay(dayNumber, notes = '') {
        if (!this.supabase || !this.participant) return { error: 'Not authorized' };

        const { data, error } = await this.supabase
            .from('challenge_progress')
            .update({
                completed: true,
                completed_at: new Date().toISOString(),
                notes
            })
            .eq('participant_id', this.participant.id)
            .eq('day_number', dayNumber)
            .select()
            .single();

        if (!error) {
            await this.updateCurrentDay();
        }

        return { data, error };
    }

    async updateCurrentDay() {
        if (!this.supabase || !this.participant) return;

        const progress = await this.getProgress();
        const completedDays = progress.filter(p => p.completed).length;
        const nextDay = Math.min(completedDays + 1, 30);

        await this.supabase
            .from('challenge_participants')
            .update({
                current_day: nextDay,
                completed: completedDays === 30
            })
            .eq('id', this.participant.id);

        this.participant.current_day = nextDay;
        this.participant.completed = completedDays === 30;
    }

    async getWorkouts() {
        if (!this.supabase) return [];

        const { data, error } = await this.supabase
            .from('challenge_workouts')
            .select('*')
            .order('day_number');

        return data || [];
    }

    async getWorkout(dayNumber) {
        if (!this.supabase) return null;

        const { data, error } = await this.supabase
            .from('challenge_workouts')
            .select('*')
            .eq('day_number', dayNumber)
            .maybeSingle();

        return data;
    }

    updateAuthUI() {
        const authButtons = document.querySelectorAll('.auth-required');
        const guestButtons = document.querySelectorAll('.guest-only');
        const userInfo = document.querySelectorAll('.user-info');

        if (this.currentUser) {
            authButtons.forEach(el => el.style.display = 'block');
            guestButtons.forEach(el => el.style.display = 'none');
            userInfo.forEach(el => {
                el.textContent = this.currentUser.email;
                el.style.display = 'block';
            });
        } else {
            authButtons.forEach(el => el.style.display = 'none');
            guestButtons.forEach(el => el.style.display = 'block');
            userInfo.forEach(el => el.style.display = 'none');
        }
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    hasJoinedChallenge() {
        return !!this.participant;
    }
}

window.supabaseService = new SupabaseService();
