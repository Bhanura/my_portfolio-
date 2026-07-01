'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Pencil, Trash, X, Eye, EyeOff, Loader2, Image as ImageIcon, Briefcase } from 'lucide-react';
import TiptapEditor from './TiptapEditor';

type Experience = {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  logo_url: string;
  is_published: boolean;
};

const STORAGE_BUCKET = 'portfolio-assets';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, control, watch } = useForm<Experience>();
  const watchedEndDate = watch('end_date');
  const watchedLogoUrl = watch('logo_url');
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    if (editingExp) {
      setValue('company', editingExp.company);
      setValue('role', editingExp.role);
      setValue('start_date', editingExp.start_date);
      setValue('end_date', editingExp.end_date || '');
      setValue('description', editingExp.description);
      setValue('logo_url', editingExp.logo_url);
      setValue('is_published', editingExp.is_published);
    } else {
      reset({ is_published: true, description: '' });
    }
  }, [editingExp, setValue, reset]);

  const fetchExperiences = async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('start_date', { ascending: false });
    if (!error && data) setExperiences(data);
  };

  const togglePublish = async (exp: Experience) => {
    const { error } = await supabase
      .from('experiences')
      .update({ is_published: !exp.is_published })
      .eq('id', exp.id);
    if (!error) fetchExperiences();
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    try {
      const fileName = `logos/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName);

      setValue('logo_url', publicUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
    e.target.value = '';
  };

  const onSubmit = async (data: Experience) => {
    setLoading(true);
    
    const expData = {
      ...data,
      end_date: data.end_date || null
    };
    
    if (editingExp) {
      const { error } = await supabase.from('experiences').update(expData).eq('id', editingExp.id);
      if (!error) {
        setIsFormOpen(false);
        setEditingExp(null);
        fetchExperiences();
      } else alert('Error updating experience');
    } else {
      const { error } = await supabase.from('experiences').insert([expData]);
      if (!error) {
        setIsFormOpen(false);
        reset();
        fetchExperiences();
      } else alert('Error adding experience');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Professional Experience</h2>
        <button 
          onClick={() => { setEditingExp(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3ECF8E] text-[#0A0A0A] rounded-lg text-sm font-medium hover:bg-[#249169] transition-colors"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center p-6 border-b border-[#2E2E2E] sticky top-0 bg-[#111111] z-10">
               <h3 className="text-lg font-bold">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
               <button onClick={() => setIsFormOpen(false)} className="text-[#666666] hover:text-[#EDEDED]"><X size={20}/></button>
             </div>
             
             <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm text-[#A1A1A1] mb-1.5">Company Name *</label>
                   <input {...register('company', { required: true })} className="form-input" placeholder="e.g. Google" />
                 </div>
                 <div>
                   <label className="block text-sm text-[#A1A1A1] mb-1.5">Role / Job Title *</label>
                   <input {...register('role', { required: true })} className="form-input" placeholder="e.g. Senior Software Engineer" />
                 </div>
               </div>
               
               <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#2E2E2E]">
                 <h4 className="text-sm font-semibold text-[#EDEDED] mb-3">Time Period</h4>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm text-[#A1A1A1] mb-1.5">Start Date *</label>
                     <input type="date" {...register('start_date', { required: true })} className="form-input w-full dark:[color-scheme:dark]" />
                   </div>
                   <div>
                     <div className="flex justify-between items-end mb-1.5">
                       <label className="block text-sm text-[#A1A1A1]">End Date</label>
                       <label className="flex items-center gap-1.5 text-xs text-[#A1A1A1] cursor-pointer hover:text-[#3ECF8E]">
                         <input
                           type="checkbox"
                           checked={!watchedEndDate}
                           onChange={(e) => setValue('end_date', e.target.checked ? null : '')}
                           className="accent-[#3ECF8E]"
                         />
                         Present
                       </label>
                     </div>
                     <input 
                       type="date" 
                       {...register('end_date')} 
                       disabled={!watchedEndDate && watchedEndDate !== ''}
                       className="form-input w-full dark:[color-scheme:dark] disabled:opacity-50" 
                     />
                   </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm text-[#A1A1A1] mb-1.5">Company Logo (Optional)</label>
                 <input ref={logoInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                 
                 <div className="flex gap-2">
                   <button type="button" onClick={() => logoInputRef.current?.click()} disabled={uploading} className="btn-secondary">
                     {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                     {uploading ? 'Uploading...' : 'Upload Logo'}
                   </button>
                   <input {...register('logo_url')} placeholder="Or paste URL" className="form-input flex-1" />
                 </div>
                 {watchedLogoUrl && <img src={watchedLogoUrl} className="mt-2 h-16 w-16 rounded-xl object-cover border border-[#2E2E2E] bg-white p-1" alt="Logo preview" />}
               </div>

               <div>
                  <label className="block text-sm text-[#A1A1A1] mb-1.5">Description & Achievements</label>
                  <div className="border border-[#2E2E2E] rounded-lg overflow-hidden">
                    <Controller
                      name="description"
                      control={control}
                      key={editingExp ? editingExp.id : 'new-exp'}
                      render={({ field }) => (
                        <TiptapEditor content={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
               </div>

               <label className="flex items-center gap-3 p-4 bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-lg cursor-pointer">
                 <input type="checkbox" {...register('is_published')} className="w-4 h-4 accent-[#3ECF8E]" />
                 <div>
                    <div className="text-sm font-medium text-[#EDEDED]">Publish this experience</div>
                    <div className="text-xs text-[#A1A1A1]">If unchecked, it will be hidden from your timeline.</div>
                 </div>
               </label>

               <div className="flex justify-end gap-3 pt-4 border-t border-[#2E2E2E]">
                 <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">Cancel</button>
                 <button type="submit" disabled={loading || uploading} className="btn-primary">
                   {loading && <Loader2 size={16} className="animate-spin" />}
                   {loading ? 'Saving...' : 'Save Experience'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {experiences.length === 0 && (
          <p className="text-[#666666] text-center py-8">No experiences added yet.</p>
        )}
        
        {experiences.map((exp) => (
          <div key={exp.id} className="flex justify-between items-center p-4 bg-[#111111] border border-[#2E2E2E] rounded-lg hover:border-[#3ECF8E30] transition-colors">
            
            <div className="flex items-center gap-4">
              {exp.logo_url ? (
                <img src={exp.logo_url} alt={exp.company} className="w-12 h-12 rounded-lg object-contain bg-white p-1 border border-[#2E2E2E]" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#666666]">
                  <Briefcase size={20} />
                </div>
              )}
              
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {exp.role} at {exp.company}
                  {!exp.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Hidden</span>
                  )}
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  {new Date(exp.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — 
                  {exp.end_date ? ' ' + new Date(exp.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                </p>
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <button
                onClick={() => togglePublish(exp)}
                className={`p-2 rounded-lg transition-colors ${exp.is_published ? 'text-[#3ECF8E] hover:bg-[#3ECF8E]/10' : 'text-[#666666] hover:bg-white/5'}`}
                title={exp.is_published ? "Hide" : "Show"}
              >
                {exp.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="w-px h-6 bg-[#2E2E2E] mx-1" />
              <button 
                onClick={() => { setEditingExp(exp); setIsFormOpen(true); }}
                className="p-2 rounded-lg text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-white/5 transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => { if (confirm('Delete this experience?')) supabase.from('experiences').delete().eq('id', exp.id).then(fetchExperiences) }}
                className="p-2 rounded-lg text-[#A1A1A1] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
