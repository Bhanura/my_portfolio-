'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function TiptapEditor({ content, onChange }: { content: any, onChange: (content: any) => void }) {
  // If the content is a JSON string (from Supabase text column), parse it first
  let parsedContent = content;
  try {
    if (typeof content === 'string' && content.trim().startsWith('{')) {
      parsedContent = JSON.parse(content);
    }
  } catch (e) {
    console.error('Error parsing Tiptap content', e);
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: parsedContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] border p-4 rounded dark:prose-invert dark:border-gray-700',
      },
    },
  });

  // Handle content updates from parent if strictly needed (e.g. reset)
  // But be careful of loops. Usually only initial content matters.
  useEffect(() => {
      // If content is null (reset), clear editor
      if (!content && editor && !editor.isEmpty) {
          editor.commands.clearContent();
      }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded dark:border-gray-700">
      <div className="bg-gray-100 p-2 border-b flex gap-2 dark:bg-gray-800 dark:border-gray-700">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Bold
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Italic
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleCodeBlock().run() }}
          className={`px-2 py-1 rounded ${editor.isActive('codeBlock') ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          Code
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run() }}
          className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          • Bullet List
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run() }}
          className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          1. Numbered List
        </button>
        {/* Add more toolbar items as needed */}
      </div>
      <EditorContent editor={editor} className="p-2" />
    </div>
  );
}
