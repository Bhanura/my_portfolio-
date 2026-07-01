'use client';

/**
 * admin/login/page.tsx — Admin Login Page
 *
 * Uses Supabase Auth (Email + Password) to sign in.
 * On success → redirects to /admin/dashboard
 * On failure → shows the Supabase error message (e.g., "Invalid login credentials")
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TO CREATE YOUR ADMIN ACCOUNT (do this once in Supabase Dashboard):
 *   1. Go to Supabase Dashboard → Authentication → Users
 *   2. Click "Add user" → "Create new user"
 *   3. Enter your email (e.g., bhanuwaduge@gmail.com) and a strong password
 *   4. Click "Create User"
 *   5. Then in SQL Editor, run:
 *      INSERT INTO profiles (id, role)
 *      VALUES ('<paste-your-user-uuid-here>', 'admin')
 *      ON CONFLICT (id) DO UPDATE SET role = 'admin';
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Show the Supabase error message directly (e.g., "Invalid login credentials")
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
  };

  return (
    // Full-screen centered layout
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A0A] px-4">
      <div className="w-full max-w-md">

        {/* ── Logo / brand ────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#3ECF8E] items-center justify-center mb-4">
            <Lock size={24} className="text-[#0A0A0A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#EDEDED]">Admin Login</h1>
          <p className="text-sm text-[#666666] mt-1">Bhanura Waduge — Portfolio CMS</p>
        </div>

        {/* ── Login card ──────────────────────────────────────────────── */}
        <div className="glass-card p-8">

          {/* ── Error message ────────────────────────────────────────── */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-sm">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-0.5">Login failed</p>
                <p className="text-red-400/80">{error}</p>
                {error.toLowerCase().includes('invalid') && (
                  <p className="mt-2 text-red-400/60 text-xs">
                    Make sure you created a user in Supabase Auth → Authentication → Users
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Form ─────────────────────────────────────────────────── */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email field */}
            <div>
              <label htmlFor="admin-email" className="block text-sm text-[#A1A1A1] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bhanuwaduge@gmail.com"
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="admin-password" className="block text-sm text-[#A1A1A1] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input pl-10"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* ── Help text ────────────────────────────────────────────────── */}
        <p className="text-center text-xs text-[#666666] mt-6">
          Access the admin at{' '}
          <span className="text-[#A1A1A1]">localhost:3000/admin/login</span>
          {' '}or click the logo 5 times rapidly
        </p>
      </div>
    </div>
  );
}
