"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon,
  Quote, Code, Undo, Redo, Maximize2
} from "lucide-react";
import { useCallback } from "react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  children,
  title
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all hover:bg-zinc-100 ${
      isActive ? "bg-primary/10 text-primary" : "text-zinc-600"
    }`}
  >
    {children}
  </button>
);

export default function Editor({ content, onChange, onImageUpload }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto border border-zinc-200 shadow-sm my-8',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline font-medium',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-zinc prose-invert max-w-none focus:outline-none min-h-[400px] p-8 font-sans leading-relaxed text-zinc-900',
      },
    },
  });

  const addImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length && onImageUpload) {
        const file = input.files[0];
        try {
          const url = await onImageUpload(file);
          editor?.chain().focus().setImage({ src: url }).run();
        } catch (error) {
          console.error('Image upload failed', error);
          alert('Failed to upload image');
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-zinc-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-zinc-50 border-b border-zinc-100 p-2 flex flex-wrap gap-1 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <MenuButton 
            title="Heading 1"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
        >
            <Heading1 size={18} />
        </MenuButton>
        <MenuButton 
            title="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
        >
            <Heading2 size={18} />
        </MenuButton>
        <MenuButton 
            title="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
        >
            <Heading3 size={18} />
        </MenuButton>
        
        <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />
        
        <MenuButton 
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
        >
            <Bold size={18} />
        </MenuButton>
        <MenuButton 
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
        >
            <Italic size={18} />
        </MenuButton>
        <MenuButton 
            title="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
        >
            <UnderlineIcon size={18} />
        </MenuButton>
        
        <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />

        <MenuButton 
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
        >
            <List size={18} />
        </MenuButton>
        <MenuButton 
            title="Ordered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
        >
            <ListOrdered size={18} />
        </MenuButton>
        
        <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />

        <MenuButton 
            title="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
        >
            <Quote size={18} />
        </MenuButton>
        <MenuButton 
            title="Code Block"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
        >
            <Code size={18} />
        </MenuButton>

        <div className="w-px h-6 bg-zinc-200 mx-1 self-center" />

        <MenuButton title="Add Link" onClick={setLink} isActive={editor.isActive('link')}>
            <LinkIcon size={18} />
        </MenuButton>
        <MenuButton title="Add Image" onClick={addImage}>
            <ImageIcon size={18} />
        </MenuButton>

        <div className="ml-auto flex gap-1">
            <MenuButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <Undo size={18} />
            </MenuButton>
            <MenuButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <Redo size={18} />
            </MenuButton>
        </div>
      </div>
      
      <div className="bg-white min-h-[400px]">
        <EditorContent editor={editor} />
      </div>
      
      <div className="bg-zinc-50 border-t border-zinc-100 px-6 py-2 flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
        <div className="flex gap-4">
            <span>{editor.storage.characterCount?.words?.() || 0} Words</span>
            <span>{editor.storage.characterCount?.characters?.() || 0} Characters</span>
        </div>
        <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Auto-saving...
        </div>
      </div>
    </div>
  );
}
