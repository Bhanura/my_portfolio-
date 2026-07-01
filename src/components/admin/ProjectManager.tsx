'use client';

/**
 * ProjectManager.tsx — Admin: Create, edit, and delete projects
 *
 * Key features:
 *   - Multiple Repositories (JSON array)
 *   - Multiple Media items (Images/Videos in a JSON array)
 *   - Start/End dates
 *   - Visibility toggle (is_published)
 */

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash, X, Upload, Loader2, ExternalLink, Image as ImageIcon, Film, Eye, EyeOff, GripVertical } from 'lucide-react';

// ── TypeScript types ────────────────────────────────────────────────────────
type Repository = {
  name: string;
  url: string;
};

type MediaItem = {
  type: 'image' | 'video';
  url: string;
};

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  tech_stack: string[] | string;
  demo_url: string;
  is_published: boolean;
  start_date: string | null;
  end_date: string | null;
  repositories: Repository[];
  media: MediaItem[];
};

const STORAGE_BUCKET = 'portfolio-assets';

export default function ProjectManager() {
  const [projects,       setProjects]       = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isFormOpen,     setIsFormOpen]     = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [uploading,      setUploading]      = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<Project>();

  // Watch arrays so we can render dynamic lists
  const currentRepos = watch('repositories') || [];
  const currentMedia = watch('media') || [];
  
  // Watch dates for "Present" checkbox logic
  const watchedEndDate = watch('end_date');

  // Hidden file input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (editingProject) {
      setValue('title',        editingProject.title);
      setValue('slug',         editingProject.slug);
      setValue('description',  editingProject.description);
      setValue('demo_url',     editingProject.demo_url);
      setValue('is_published', editingProject.is_published);
      setValue('start_date',   editingProject.start_date || '');
      setValue('end_date',     editingProject.end_date || '');
      setValue('repositories', editingProject.repositories || []);
      setValue('media',        editingProject.media || []);
      
      setValue('tech_stack',
        Array.isArray(editingProject.tech_stack)
          ? editingProject.tech_stack.join(', ')
          : editingProject.tech_stack || ''
      );
    } else {
      reset({ is_published: true, repositories: [], media: [] });
    }
  }, [editingProject, setValue, reset]);

  // ── Fetch Projects ──────────────────────────────────────────────────────────
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProjects(data);
  };

  // ── Toggle Publish Status Directly ──────────────────────────────────────────
  const togglePublish = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !project.is_published })
      .eq('id', project.id);
    if (!error) fetchProjects();
  };

  // ── File Upload ─────────────────────────────────────────────────────────────
  const uploadFile = async (file: File, type: 'image' | 'video') => {
    setUploading(true);
    try {
      const folder = type === 'image' ? 'images' : 'videos';
      const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

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

      // Add to media array
      setValue('media', [...currentMedia, { type, url: publicUrl }]);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file, type);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  // ── Dynamic Form Helpers ──────────────────────────────────────────────────
  const addRepo = () => setValue('repositories', [...currentRepos, { name: '', url: '' }]);
  const removeRepo = (index: number) => setValue('repositories', currentRepos.filter((_, i) => i !== index));
  const updateRepo = (index: number, field: 'name' | 'url', value: string) => {
    const newRepos = [...currentRepos];
    newRepos[index][field] = value;
    setValue('repositories', newRepos);
  };

  const removeMedia = (index: number) => setValue('media', currentMedia.filter((_, i) => i !== index));

  // ── Form Submit ─────────────────────────────────────────────────────────────
  const onSubmit = async (data: Project) => {
    setSaving(true);
    const techStackArray = typeof data.tech_stack === 'string'
      ? data.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
      : data.tech_stack;

    const projectData = {
      ...data,
      tech_stack: techStackArray,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
    };

    if (editingProject) {
      const { error } = await supabase.from('projects').update(projectData).eq('id', editingProject.id);
      if (!error) {
        setIsFormOpen(false);
        fetchProjects();
      } else alert(`Error updating: ${error.message}`);
    } else {
      const { error } = await supabase.from('projects').insert([projectData]);
      if (!error) {
        setIsFormOpen(false);
        fetchProjects();
      } else alert(`Error creating: ${error.message}`);
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={() => { setEditingProject(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3ECF8E] text-[#0A0A0A] rounded-lg text-sm font-medium hover:bg-[#249169] transition-colors"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* ── Modal Form ────────────────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-[#2E2E2E] sticky top-0 bg-[#111111] z-10">
              <h3 className="text-lg font-bold">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-[#666666] hover:text-[#EDEDED]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#A1A1A1] mb-1.5">Title *</label>
                    <input {...register('title', { required: true })} className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#A1A1A1] mb-1.5">Slug *</label>
                    <input {...register('slug', { required: true })} className="form-input" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#A1A1A1] mb-1.5">Description</label>
                  <textarea {...register('description')} rows={3} className="form-input resize-none" />
                </div>

                <div>
                  <label className="block text-sm text-[#A1A1A1] mb-1.5">Tech Stack <span className="text-[#666666]">(comma separated)</span></label>
                  <input {...register('tech_stack')} className="form-input" />
                </div>
              </div>

              {/* Dates */}
              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#2E2E2E]">
                <h4 className="text-sm font-semibold text-[#EDEDED] mb-3">Time Period</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#A1A1A1] mb-1.5">Start Date</label>
                    <input type="date" {...register('start_date')} className="form-input w-full dark:[color-scheme:dark]" />
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
                        Present (Ongoing)
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

              {/* Links & Repos */}
              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#2E2E2E]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-[#EDEDED]">Repositories & Links</h4>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-[#A1A1A1] mb-1.5">Live Demo URL</label>
                  <input {...register('demo_url')} type="url" placeholder="https://" className="form-input" />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm text-[#A1A1A1]">Code Repositories</label>
                  {currentRepos.map((repo, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        value={repo.name}
                        onChange={(e) => updateRepo(index, 'name', e.target.value)}
                        placeholder="Name (e.g. Frontend)"
                        className="form-input w-1/3"
                      />
                      <input
                        value={repo.url}
                        onChange={(e) => updateRepo(index, 'url', e.target.value)}
                        placeholder="https://github.com/..."
                        className="form-input flex-1"
                      />
                      <button type="button" onClick={() => removeRepo(index)} className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addRepo} className="text-sm text-[#3ECF8E] hover:underline flex items-center gap-1">
                    <Plus size={14} /> Add Repository
                  </button>
                </div>
              </div>

              {/* Media Gallery */}
              <div className="p-4 bg-[#1A1A1A] rounded-lg border border-[#2E2E2E]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-[#EDEDED]">Media Gallery</h4>
                </div>
                
                {/* Hidden inputs */}
                <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'image')} className="hidden" />
                <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" />

                <div className="flex gap-2 mb-4">
                  <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading} className="btn-secondary text-xs py-1.5 px-3">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />} Add Image
                  </button>
                  <button type="button" onClick={() => videoInputRef.current?.click()} disabled={uploading} className="btn-secondary text-xs py-1.5 px-3">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Film size={14} />} Add Video
                  </button>
                </div>

                {/* Media Preview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {currentMedia.map((item, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-[#2E2E2E] bg-black">
                      {item.type === 'image' ? (
                        <img src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Gallery item" />
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      )}
                      
                      {/* Overlay controls */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white">
                           <ExternalLink size={14} />
                         </a>
                         <button type="button" onClick={() => removeMedia(index)} className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded text-white">
                           <Trash size={14} />
                         </button>
                      </div>
                      <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white uppercase tracking-wider">
                        {item.type}
                      </div>
                    </div>
                  ))}
                  {currentMedia.length === 0 && (
                    <div className="col-span-full py-8 text-center text-sm text-[#666666] border border-dashed border-[#2E2E2E] rounded-lg">
                      No media items. Add images or videos to create a gallery.
                    </div>
                  )}
                </div>
              </div>

              {/* Publish Toggle */}
              <label className="flex items-center gap-3 p-4 bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-lg cursor-pointer">
                <input type="checkbox" {...register('is_published')} className="w-4 h-4 accent-[#3ECF8E]" />
                <div>
                  <div className="text-sm font-medium text-[#EDEDED]">Publish this project</div>
                  <div className="text-xs text-[#A1A1A1]">If unchecked, the project will be hidden from your public portfolio.</div>
                </div>
              </label>

              {/* Submit / Cancel */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#2E2E2E]">
                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={saving || uploading} className="btn-primary">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Projects List ──────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {projects.length === 0 && (
          <p className="text-[#666666] text-center py-8">No projects yet. Add your first one!</p>
        )}
        {projects.map((project) => (
          <div key={project.id} className="flex justify-between items-center p-4 bg-[#111111] border border-[#2E2E2E] rounded-lg hover:border-[#3ECF8E30] transition-colors">
            
            <div className="flex items-center gap-4">
              {/* Thumbnail (first media item) */}
              {project.media?.[0] ? (
                project.media[0].type === 'image' ? (
                  <img src={project.media[0].url} alt={project.title} className="w-14 h-14 rounded-lg object-cover border border-[#2E2E2E]" />
                ) : (
                  <video src={project.media[0].url} className="w-14 h-14 rounded-lg object-cover border border-[#2E2E2E]" />
                )
              ) : (
                <div className="w-14 h-14 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#666666]">
                  <ImageIcon size={20} />
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-[#EDEDED] flex items-center gap-2">
                  {project.title}
                  {!project.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Draft</span>
                  )}
                </h3>
                <p className="text-xs text-[#666666]">/projects/{project.slug} • {project.media?.length || 0} media</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1 items-center">
              <button
                onClick={() => togglePublish(project)}
                className={`p-2 rounded-lg transition-colors ${project.is_published ? 'text-[#3ECF8E] hover:bg-[#3ECF8E]/10' : 'text-[#666666] hover:bg-white/5'}`}
                title={project.is_published ? "Unpublish" : "Publish"}
              >
                {project.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="w-px h-6 bg-[#2E2E2E] mx-1" />
              <button onClick={() => { setEditingProject(project); setIsFormOpen(true); }} className="p-2 rounded-lg text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-white/5 transition-colors">
                <Pencil size={16} />
              </button>
              <button onClick={() => { if(confirm('Delete project?')) supabase.from('projects').delete().eq('id', project.id).then(fetchProjects) }} className="p-2 rounded-lg text-[#A1A1A1] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
