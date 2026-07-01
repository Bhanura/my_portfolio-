'use client';

import { Briefcase } from 'lucide-react';
import TiptapRenderer from '@/components/TiptapRenderer';
import FadeIn from '@/components/FadeIn';

type Experience = {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  logo_url: string;
};

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className="relative border-l border-[#2E2E2E] ml-4 md:ml-6 space-y-12">
      {experiences.map((exp, index) => {
        // Stagger animation
        const delayMs = Math.min(index * 150, 600);
        
        // Format dates
        const startDate = new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        const endDate = exp.end_date 
          ? new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          : 'Present';

        return (
          <FadeIn 
            key={exp.id} 
            delay={delayMs / 1000} // converting delayMs to seconds for FadeIn
            className="relative pl-8 md:pl-12 group"
          >
            
            {/* Timeline dot / Logo */}
            <div className="absolute left-0 top-0 -translate-x-1/2 bg-[#0A0A0A] border-4 border-[#0A0A0A]">
              {exp.logo_url ? (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-white border border-[#2E2E2E] shadow-lg group-hover:border-[#3ECF8E] transition-colors p-1">
                  <img src={exp.logo_url} alt={exp.company} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#666666] group-hover:border-[#3ECF8E] group-hover:text-[#3ECF8E] transition-colors shadow-lg">
                  <Briefcase size={20} />
                </div>
              )}
            </div>

            {/* Experience Content */}
            <div className="glass-card p-6 md:p-8 hover:border-[#3ECF8E30] transition-colors duration-300">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-[#EDEDED]">{exp.role}</h3>
                  <div className="text-[#3ECF8E] font-medium text-lg">{exp.company}</div>
                </div>
                <div className="inline-flex items-center text-xs font-medium text-[#666666] bg-[#111111] border border-[#2E2E2E] px-3 py-1.5 rounded-full tracking-wide">
                  {startDate} — {endDate}
                </div>
              </div>
              
              {/* Divider */}
              <div className="w-12 h-px bg-[#2E2E2E] mb-6" />

              {/* Description (Rich Text) */}
              <div className="
                prose prose-invert max-w-none
                prose-p:text-[#A1A1A1] prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
                prose-a:text-[#3ECF8E] hover:prose-a:underline
                prose-strong:text-[#EDEDED]
                prose-ul:text-[#A1A1A1] prose-ul:my-2 prose-li:my-1
                prose-ol:text-[#A1A1A1]
              ">
                {exp.description ? (
                  <TiptapRenderer content={exp.description} />
                ) : (
                  <p className="italic text-[#666666]">Details coming soon.</p>
                )}
              </div>

            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
