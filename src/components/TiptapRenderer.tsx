'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

export default function TiptapRenderer({ content }: { content: any }) {
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
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      // editor.commands.setContent(content); // Only if content changes dynamically
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
