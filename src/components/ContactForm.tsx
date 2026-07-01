'use client';

/**
 * ContactForm.tsx
 *
 * A glassmorphism-styled contact form with:
 *   - Animated input focus states (brand-green glow)
 *   - Loading spinner on submit
 *   - Smooth success/error state transitions
 *   - Currently simulates a submission (replace with real API call when ready)
 *
 * To wire up a real backend:
 *   Replace the setTimeout block in onSubmit with:
 *   await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Github, Linkedin, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Form field types ──────────────────────────────────────────────────────────
type FormData = {
  name:    string;
  email:   string;
  message: string;
};

// ── Submission status type ────────────────────────────────────────────────────
type Status = 'idle' | 'submitting' | 'success' | 'error';

// ── Quick contact info cards shown beside the form ────────────────────────────
const CONTACT_INFO = [
  {
    icon:  Github,
    label: 'GitHub',
    value: 'github.com/Bhanura',
    href:  'https://github.com/Bhanura',
  },
  {
    icon:  Linkedin,
    label: 'LinkedIn',
    value: 'Bhanura Waduge',
    href:  'https://www.linkedin.com/in/bhanura-waduge-44b7611a7',
  },
  {
    icon:  Mail,
    label: 'Email',
    value: 'bhanuwaduge@gmail.com',
    href:  'mailto:bhanuwaduge@gmail.com',
  },
];

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [status, setStatus] = useState<Status>('idle');

  // ── Form submit handler ───────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    setStatus('submitting');
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name,
          email: data.email,
          message: data.message,
          is_read: false
        }]);

      if (error) throw error;
      
      setStatus('success');
      reset(); // Clear the form fields
    } catch {
      setStatus('error');
    }
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* ── Left: Contact info cards (2 columns wide) ──────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Quick-link contact cards */}
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="
                glass-card p-4 flex items-center gap-4
                hover:border-[#3ECF8E30] hover:bg-[#3ECF8E05]
                transition-all duration-200 group
              "
            >
              {/* Icon box */}
              <div className="
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                bg-[#3ECF8E10] text-[#3ECF8E]
                group-hover:bg-[#3ECF8E20] transition-colors
              ">
                <Icon size={18} />
              </div>
              {/* Label + value */}
              <div>
                <p className="text-xs text-[#666666] mb-0.5">{label}</p>
                <p className="text-sm text-[#EDEDED] font-medium">{value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* ── Right: Contact Form (3 columns wide) ───────────────────────── */}
        <div className="lg:col-span-3">
          <div className="glass-card p-8">

            {/* ── Success state ─────────────────────────────────────────── */}
            {status === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="text-[#3ECF8E] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#EDEDED] mb-2">
                  Message Sent!
                </h3>
                <p className="text-[#A1A1A1] mb-6">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-secondary text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              // ── Form ────────────────────────────────────────────────────
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Name field */}
                  <div>
                    <label htmlFor="contact-name" className="block text-sm text-[#A1A1A1] mb-2">
                      Name <span className="text-[#3ECF8E]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      {...register('name', { required: 'Name is required' })}
                      placeholder="Your name"
                      className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label htmlFor="contact-email" className="block text-sm text-[#A1A1A1] mb-2">
                      Email <span className="text-[#3ECF8E]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern:  { value: /^\S+@\S+$/, message: 'Invalid email address' },
                      })}
                      placeholder="your@email.com"
                      className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-[#A1A1A1] mb-2">
                    Message <span className="text-[#3ECF8E]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    {...register('message', { required: 'Message is required' })}
                    placeholder="Tell me about your project or just say hi..."
                    rows={5}
                    className={`form-input resize-none ${errors.message ? 'border-red-500' : ''}`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    // Loading spinner
                    <>
                      <div className="w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Send Message
                    </>
                  )}
                </button>

                {/* Error message */}
                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again or email me directly.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
  );
}
