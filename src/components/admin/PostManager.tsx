'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useForm, Controller } from 'react-hook-form';
import { Plus, Pencil, Trash, X, Eye, EyeOff, Image as ImageIcon, Loader2 } from 'lucide-react';
import TiptapEditor from './TiptapEditor';

type Post = {
  id: number;
  title: string;
  slug: string;
  content: any;
  is_published: boolean;
  published_at: string;
  image_url: string;
};

const STORAGE_BUCKET = 'portfolio-assets';

export default function PostManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, reset, setValue, control, watch } = useForm<Post>();
  const watchedImageUrl = watch('image_url');
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editingPost) {
      setValue('title', editingPost.title);
      setValue('slug', editingPost.slug);
      setValue('content', editingPost.content);
      setValue('is_published', editingPost.is_published);
      
      // Extract YYYY-MM-DD from the timestamp for the date input
      let dateStr = '';
      if (editingPost.published_at) {
        dateStr = new Date(editingPost.published_at).toISOString().split('T')[0];
      }
      setValue('published_at', dateStr);
      setValue('image_url', editingPost.image_url);
    } else {
      // Default to today for new posts
      const today = new Date().toISOString().split('T')[0];
      reset({ is_published: true, published_at: today });
    }
  }, [editingPost, setValue, reset]);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error && data) setPosts(data);
  };

  const togglePublish = async (post: Post) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_published: !post.is_published })
      .eq('id', post.id);
    if (!error) fetchPosts();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileName = `images/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
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

      setValue('image_url', publicUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = '';
  };

  const onSubmit = async (data: Post) => {
    setLoading(true);
    
    // Ensure published_at is formatted properly, or null if empty
    const postData = {
      ...data,
      published_at: data.published_at ? new Date(data.published_at).toISOString() : null
    };
    
    if (editingPost) {
      const { error } = await supabase.from('posts').update(postData).eq('id', editingPost.id);
      if (!error) {
        setIsFormOpen(false);
        setEditingPost(null);
        fetchPosts();
      } else alert('Error updating post');
    } else {
      const { error } = await supabase.from('posts').insert([postData]);
      if (!error) {
        setIsFormOpen(false);
        reset();
        fetchPosts();
      } else alert('Error creating post');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Blog Posts</h2>
        <button 
          onClick={() => { setEditingPost(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3ECF8E] text-[#0A0A0A] rounded-lg text-sm font-medium hover:bg-[#249169] transition-colors"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111111] border border-[#2E2E2E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center p-6 border-b border-[#2E2E2E] sticky top-0 bg-[#111111] z-10">
               <h3 className="text-lg font-bold">{editingPost ? 'Edit Post' : 'New Post'}</h3>
               <button onClick={() => setIsFormOpen(false)} className="text-[#666666] hover:text-[#EDEDED]"><X size={20}/></button>
             </div>
             
             <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm text-[#A1A1A1] mb-1.5">Title</label>
                   <input {...register('title', { required: true })} className="form-input" />
                 </div>
                 <div>
                   <label className="block text-sm text-[#A1A1A1] mb-1.5">Slug</label>
                   <input {...register('slug', { required: true })} className="form-input" />
                 </div>
               </div>
               
               <div>
                  <label className="block text-sm text-[#A1A1A1] mb-1.5">Content</label>
                  <div className="border border-[#2E2E2E] rounded-lg overflow-hidden">
                    <Controller
                      name="content"
                      control={control}
                      // Use a key to force Tiptap to remount when editing a different post, 
                      // solving the bug where old content doesn't load
                      key={editingPost ? editingPost.id : 'new-post'}
                      render={({ field }) => (
                        <TiptapEditor content={field.value} onChange={field.onChange} />
                      )}
                    />
                  </div>
               </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cover Image Upload */}
                  <div>
                    <label className="block text-sm text-[#A1A1A1] mb-1.5">Cover Image</label>
                    <input ref={imageInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    
                    <div className="flex gap-2">
                      <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploading} className="btn-secondary">
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                      <input {...register('image_url')} placeholder="Or paste URL" className="form-input flex-1" />
                    </div>
                    {watchedImageUrl && <img src={watchedImageUrl} className="mt-2 h-20 rounded object-cover border border-[#2E2E2E]" alt="Cover preview" />}
                  </div>

                  {/* Publish Date */}
                  <div>
                    <label className="block text-sm text-[#A1A1A1] mb-1.5">Publish Date</label>
                    <input type="date" {...register('published_at')} className="form-input dark:[color-scheme:dark]" />
                  </div>
                </div>

               <label className="flex items-center gap-3 p-4 bg-[#3ECF8E]/5 border border-[#3ECF8E]/20 rounded-lg cursor-pointer">
                 <input type="checkbox" {...register('is_published')} className="w-4 h-4 accent-[#3ECF8E]" />
                 <div>
                    <div className="text-sm font-medium text-[#EDEDED]">Publish this article</div>
                    <div className="text-xs text-[#A1A1A1]">If unchecked, the article is saved as a draft.</div>
                 </div>
               </label>

               <div className="flex justify-end gap-3 pt-4 border-t border-[#2E2E2E]">
                 <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary">Cancel</button>
                 <button type="submit" disabled={loading || uploading} className="btn-primary">
                   {loading && <Loader2 size={16} className="animate-spin" />}
                   {loading ? 'Saving...' : 'Save Post'}
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {posts.map((post) => (
          <div key={post.id} className="flex justify-between items-center p-4 bg-[#111111] border border-[#2E2E2E] rounded-lg hover:border-[#3ECF8E30] transition-colors">
            
            <div className="flex items-center gap-4">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-12 h-12 rounded object-cover border border-[#2E2E2E]" />
              ) : (
                <div className="w-12 h-12 rounded bg-[#1A1A1A] border border-[#2E2E2E] flex items-center justify-center text-[#666666]">
                  <ImageIcon size={18} />
                </div>
              )}
              
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {post.title}
                  {!post.is_published && (
                    <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Draft</span>
                  )}
                </h3>
                <p className="text-xs text-[#666666]">
                  /blog/{post.slug} • {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'No date'}
                </p>
              </div>
            </div>

            <div className="flex gap-1 items-center">
              <button
                onClick={() => togglePublish(post)}
                className={`p-2 rounded-lg transition-colors ${post.is_published ? 'text-[#3ECF8E] hover:bg-[#3ECF8E]/10' : 'text-[#666666] hover:bg-white/5'}`}
                title={post.is_published ? "Unpublish" : "Publish"}
              >
                {post.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="w-px h-6 bg-[#2E2E2E] mx-1" />
              <button 
                onClick={() => { setEditingPost(post); setIsFormOpen(true); }}
                className="p-2 rounded-lg text-[#A1A1A1] hover:text-[#EDEDED] hover:bg-white/5 transition-colors"
              >
                <Pencil size={16} />
              </button>
              <button 
                onClick={() => { if (confirm('Are you sure?')) supabase.from('posts').delete().eq('id', post.id).then(fetchPosts) }}
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
