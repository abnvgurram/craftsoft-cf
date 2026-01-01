/* ============================================
   Supabase Website Configuration
   Public Module - Craft Soft
   ============================================ */

(function () {
    'use strict';

    const SUPABASE_URL = 'https://afocbygdakyqtmmrjvmy.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmb2NieWdkYWt5cXRtbXJqdm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Mzc5MjksImV4cCI6MjA4MjUxMzkyOX0.L7YerK7umlQ0H9WOCfGzY6AcKVjHs7aDKvXLYcCj-f0';

    if (window.supabase) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
})();
