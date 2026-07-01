'use client';

/**
 * admin/dashboard/page.tsx — Admin Dashboard
 *
 * Protected page — redirects to login if no active session.
 * Tabs:
 *   - Projects → ProjectManager (create/edit/delete projects + upload images/videos)
 *   - Blog Posts → PostManager (create/edit/delete blog posts)
 *   - Site Settings → SiteSettingsManager (edit hero text, headshot URL, etc.)
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProjectManager from '@/components/admin/ProjectManager';
import PostManager from '@/components/admin/PostManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import EducationManager from '@/components/admin/EducationManager';
import MessageManager from '@/components/admin/MessageManager';
import { LogOut, FolderGit2, PenTool, Settings, Loader2, Briefcase, GraduationCap, Inbox } from 'lucide-react';

// Tab definitions
const TABS = [
  { id: 'experiences', label: 'Experiences',   icon: Briefcase },
  { id: 'education',   label: 'Education',     icon: GraduationCap },
  { id: 'projects',    label: 'Projects',      icon: FolderGit2 },
  { id: 'posts',       label: 'Blog Posts',    icon: PenTool   },
  { id: 'messages',    label: 'Inbox',         icon: Inbox     },
  { id: 'settings',    label: 'Site Settings', icon: Settings  },
] as const;

type TabId = typeof TABS[number]['id'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('projects');
  const [loading,   setLoading]   = useState(true);
  const router = useRouter();

  // ── Auth guard — redirect to login if not authenticated ─────────────────
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // ── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0A]">
        <div className="flex items-center gap-3 text-[#A1A1A1]">
          <Loader2 size={20} className="animate-spin text-[#3ECF8E]" />
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Admin Top Bar ─────────────────────────────────────────────── */}
      <div className="border-b border-[#2E2E2E] bg-[#111111] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo badge */}
          <div className="w-8 h-8 rounded-lg bg-[#3ECF8E] flex items-center justify-center text-[#0A0A0A] font-bold text-sm">
            BW
          </div>
          <div>
            <h1 className="font-semibold text-[#EDEDED] text-sm">Admin Dashboard</h1>
            <p className="text-xs text-[#666666]">Bhanura Waduge — Portfolio CMS</p>
          </div>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-[#666666] hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-500/10"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>

      {/* ── Tab navigation ───────────────────────────────────────────── */}
      <div className="border-b border-[#2E2E2E] bg-[#111111] px-6">
        <div className="flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === id
                  ? 'border-[#3ECF8E] text-[#3ECF8E]'
                  : 'border-transparent text-[#666666] hover:text-[#A1A1A1]'
                }
              `}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'experiences' && <ExperienceManager />}
        {activeTab === 'education'   && <EducationManager />}
        {activeTab === 'projects'    && <ProjectManager />}
        {activeTab === 'posts'       && <PostManager />}
        {activeTab === 'messages'    && <MessageManager />}
        {activeTab === 'settings'    && <SiteSettingsManager />}
      </div>
    </div>
  );
}
