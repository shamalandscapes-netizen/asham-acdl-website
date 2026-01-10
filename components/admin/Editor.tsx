'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { useEffect, useRef, useState } from 'react';
import { uploadImage } from '@/lib/supabase/storage';
import { toast } from 'react-hot-toast';
import { 
  Bold, Italic, List, ListOrdered, Heading1, 
  Heading2, Quote, Undo, Redo, Image as ImageIcon, Loader2 
} from 'lucide-react';

const UnderlineIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const MenuBar = ({ editor }: { editor: any }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const toastId = toast.loading('Uploading image to architectural vault...');

    try {
      const publicUrl = await uploadImage(file, 'blog-images');
      editor.chain().focus().setImage({ src: publicUrl }).run();
      toast.success('Visual added to draft', { id: toastId });
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message, { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const btnClass = (isActive: boolean) => 
    `p-2 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-[#06392F] text-white shadow-md' 
        : 'text-gray-400 hover:bg-gray-100 hover:text-[#06392F]'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-100 bg-gray-50/50">
      <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />

      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><Bold size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><Italic size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><UnderlineIcon size={18} /></button>
      
      <div className="w-[1px] h-6 bg-gray-200 mx-2" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}><Heading1 size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}><Heading2 size={18} /></button>
      
      <div className="w-[1px] h-6 bg-gray-200 mx-2" />
      
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}><List size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}><ListOrdered size={18} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}><Quote size={18} /></button>
      
      <button type="button" disabled={uploading} onClick={() => fileInputRef.current?.click()} className={btnClass(false)}>
        {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
      </button>

      <div className="flex-grow" />
      
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-2 text-gray-400 hover:text-[#C75B39]"><Undo size={18} /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-2 text-gray-400 hover:text-[#C75B39]"><Redo size={18} /></button>
      </div>
    </div>
  );
};

// Added initialContent to interface
export default function Editor({ onChange, initialContent }: { onChange: (html: string) => void, initialContent?: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-[2rem] shadow-xl border border-gray-50 my-12 mx-auto block max-w-[90%]',
        },
      }),
      Placeholder.configure({ 
        placeholder: 'Start writing your architectural masterpiece...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    // 1. Set the initial state
    content: initialContent || '', 
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-stone lg:prose-lg max-w-none focus:outline-none min-h-[500px] p-8 md:p-12 blog-editor-canvas',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 2. Critical: Update editor content if initialContent arrives late (e.g. from a database fetch)
  useEffect(() => {
    if (editor && initialContent && editor.isEmpty) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  useEffect(() => {
    return () => { editor?.destroy(); };
  }, [editor]);

  return (
    <div className="border border-gray-100 rounded-b-[2.5rem] bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; color: #adb5bd; pointer-events: none; height: 0;
        }
        .blog-editor-canvas ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.2rem; }
        .blog-editor-canvas ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.2rem; }
        .blog-editor-canvas blockquote { border-left: 4px solid #C75B39; padding-left: 1.5rem; font-style: italic; color: #4b5563; margin: 2rem 0; }
        .blog-editor-canvas img.prose-img { margin: 3rem auto; }
      `}</style>
    </div>
  );
}