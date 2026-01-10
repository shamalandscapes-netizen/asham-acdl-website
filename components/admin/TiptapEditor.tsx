'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { 
  Bold, Italic, List, ListOrdered, Heading1, 
  Heading2, Quote, Undo, Redo 
} from 'lucide-react';

const UnderlineIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBold().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Bold size={18} />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleItalic().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Italic size={18} />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleUnderline().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('underline') ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <UnderlineIcon size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-gray-200 mx-1" />
      
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Heading1 size={18} />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Heading2 size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-gray-200 mx-1" />
      
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBulletList().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <List size={18} />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('orderedList') ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <ListOrdered size={18} />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        className={`p-2 rounded-lg transition-colors ${editor.isActive('blockquote') ? 'bg-white shadow-sm text-[#C75B39]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Quote size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-gray-200 mx-1 flex-grow" />
      
      <button 
        type="button" 
        onClick={() => editor.chain().focus().undo().run()} 
        className="p-2 text-gray-400 hover:text-[#06392F]"
      >
        <Undo size={18} />
      </button>
      <button 
        type="button" 
        onClick={() => editor.chain().focus().redo().run()} 
        className="p-2 text-gray-400 hover:text-[#06392F]"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export default function TiptapEditor({ onChange }: { onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ 
        placeholder: 'Start writing your architectural masterpiece...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '',
    // CRITICAL: Set this to false to fix the "SSR has been detected" error
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-stone lg:prose-lg max-w-none focus:outline-none min-h-[450px] p-8 blog-editor-field',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Cleanup editor on unmount
  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      
      {/* Small style tag for placeholder support */}
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}