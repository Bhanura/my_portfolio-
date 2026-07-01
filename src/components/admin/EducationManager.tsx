'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Pencil, Trash, X, Eye, EyeOff, Loader2, GraduationCap } from 'lucide-react';
import TiptapEditor from './TiptapEditor';

type Education = {
  id: number;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string | null;
  description: string;
  is_published: boolean;
};

export default function EducationManager() {
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, control, watch } = useForm<Education>();
  const watchedEndDate = watch('end_date');

  useEffect(() => {
    fetchEducation();
  }, []);

  useEffect(() => {
    if (editingEdu) {
      setValue('institution', editingEdu.institution);
      setValue('degree', editingEdu.degree);
      setValue('start_date', editingEdu.start_date);
      setValue('end_date', editingEdu.end_date || '');
      setValue('description', editingEdu.description);
      setValue('is_published', editingEdu.is_published);
    } else {
      reset({ is_published: true, description: '' });
    }
  }, [editingEdu, setValue, reset]);

  const fetchEducation = async () => {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('start_date', { ascending: false });
    if (!error && data) setEducationList(data);
  };

  const togglePublish = async (edu: Education) => {
    const { error } = await supabase
      .from('education')
      .update({ is_published: !edu.is_published })
      .eq('id', edu.id);
    if (!error) fetchEducation();
  };

  const onSubmit = async (data: Education) => {
    setLoading(true);
    
    const eduData = {
      ...data,
      end_date: data.end_date || null
    };
    
    if (editingEdu) {
      const { error } = await supabase.from('education').update(eduData).eq('id', editingEdu.id);
      if (!error) {
        setIsFormOpen(false);
        setEditingEdu(null);
        fetchEducation();
      } else alert('Error updating education');
    } else {
      const { error } = await supabase.from('education').insert([eduData]);
      if (!error) {
        setIsFormOpen(false);
        reset();
        fetchEducation();
      } else alert('Error adding education');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Education & Milestones</h2>
        <button 
          onClick={() => { setEditingEdu(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3ECF8E] text-[#0A0A0A] rounded-lg text-sm font-medium hover:bg-[#249169] transition-colors"
        >
          <Plus size={16} /> Add Milestone
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center p-6 border-b border-[#2E2E2E] sticky top-0 bg-[#111111] z-10">
               <h3 className="text-lg font-bold">{editingEdu ? 'Edit Milestone' : 'New Milestone'}</h3>
               <button onClick={() => setIsFormOpen(false)} className="text-[#666666] hover:text-[#EDEDED]"><X size={20}/></button>
             </div>
             
             <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm text-[#A1A1A1] mb-1.5">Institution / School *</label>
                   <input {...register('institution', { required: true })} className="form-input" placeholder="e.g. University of Moratuwa" />
                 </div>
                 <div>
                   <label className="block text-sm text-[#A1A1A1] mb-1.5">Degree / Certification *</label>
                   <input {...register('degree', { required: true })} className="form-input" placeholder="e.g. BSc Software Engineering / G.C.E. A/L" />
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
                         Present / Expected
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
                  <label className="block text-sm text-[#A1A1A1] mb-1.5">Description (Grades, Activities, Honors)</label>
                  <div className="border border-[#2E2E2E] rounded-lg overflow-hidden">
                    <Controller
                      name="description"
                      control={control}
                      key={editingEdu ? editingEdu.id : 'new-edu'}
                      render={({ field }) => (
                        <TiptapEditor content={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
               </div>

               <label className="flex items-center gap-3 p-4 bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-lg cursor-pointer">
                 <input type="checkbox" {...register('is_published')} className="w-4 h-4 accent-[#3ECF8E]" />
                 <div>
                    <div className="text-sm font-medium text-[#EDEDED]">Publish this milestone</div>
                    <div className="text-xs text-[#A1A1A1]">If unchecked, it will be hidden from your timeline.</div>
                 </div>
               </label>

               <div className="flex justify-end gap-3 pt-4 border-t border-[#2E2E2E]">
                 <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">Cancel</button>
                 <button type="submit" disabled={loading} className="btn-primary">
                   {loading && <Loader2 size={16} className="animate-spin" />}
                   {loading ? 'Saving...' : 'Save Milestone'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {educationList.length === 0 && (
          <p className="text-[#666666] text-center py-8">No education milestones added yet.</p>
        )}
        
        {educationList.map((edu) => (
          <div key={edu.id} className="flex justify-between items-center p-4 bg-[#111111] border border-[#2E2E2E] rounded-lg hover:border-[#3ECF8E30] transition-colors">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#666666]">
                <GraduationCap size={20} />
              </div>
              
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {edu.degree} at {edu.institution}
                  {!edu.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Hidden</span>
                  )}
                </h3>
                <p className="text-xs text-[#666666] mt-0.5">
                  {new Date(edu.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} — 
                  {edu.end_date ? ' ' + new Date(edu.end_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : ' Present'}
                </p>
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <button
                onClick={() => togglePublish(edu)}
                className={`p-2 rounded-lg transition-colors ${edu.is_published ? 'text-[#3ECF8E] hover:bg-[#3ECF8E]/10' : 'text-[#666666] hover:bg-white/5'}`}
                title={edu.is_published ? "Hide" : "Show"}
              >
                {edu.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="w-px h-6 bg-[#2E2E2E] mx-1" />
              <button 
                onClick={() => { setEditingEdu(edu); setIsFormOpen(true); }}
                className="p-2 rounded-lg text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-white/5 transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => { if (confirm('Delete this milestone?')) supabase.from('education').delete().eq('id', edu.id).then(fetchEducation) }}
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
