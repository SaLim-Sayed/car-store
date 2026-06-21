"use client"

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
 ssr: false,
 loading: () => <div className="h-40 w-full animate-pulse bg-muted rounded-md" />,
});

interface RichTextEditorProps {
 value: string;
 onChange: (value: string) => void;
 placeholder?: string;
}

const modules = {
 toolbar: [
 [{ header: [1, 2, 3, false] }],
 ['bold', 'italic', 'underline', 'strike'],
 [{ color: [] }, { background: [] }],
 [{ list: 'ordered' }, { list: 'bullet' }],
 ['link', 'clean'],
 ],
};

const formats = [
 'header',
 'bold',
 'italic',
 'underline',
 'strike',
 'color',
 'background',
 'list',
 'link',
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
 return (
 <div className="bg-background rounded-md overflow-hidden border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
 <ReactQuill
 theme="snow"
 value={value}
 onChange={onChange}
 modules={modules}
 formats={formats}
 placeholder={placeholder}
 className="min-h-[200px]"
 />
 <style jsx global>{`
 .ql-container {
 font-family: inherit;
 font-size: 14px;
 }
 .ql-editor {
 min-h: 200px;
 direction: rtl;
 text-align: right;
 }
 .ql-toolbar.ql-snow {
 border: none;
 border-bottom: 1px solid hsl(var(--input));
 background: hsl(var(--muted) / 0.5);
 direction: ltr;
 }
 .ql-container.ql-snow {
 border: none;
 }
 `}</style>
 </div>
 );
}
