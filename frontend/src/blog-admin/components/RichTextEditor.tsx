import React, { useEffect, useCallback, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { UploadCloud, Loader2, Link as LinkIcon, X as CloseIcon } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  label,
  onUploadImage,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => (t + 1) % 1000000), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
          HTMLAttributes: {
            target: "_blank",
            rel: "noopener noreferrer",
          },
        },
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md max-w-full my-4 border border-slate-200 shadow-sm",
        },
      }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      forceUpdate();
    },
    onSelectionUpdate() {
      forceUpdate();
    },
    onTransaction() {
      forceUpdate();
    },
    editorProps: {
      attributes: {
        class: "rte-editor",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  });

  // Sync external value on first load or when changed from outside
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  // Intercept paste to format 'name: message' patterns (bolding only the label before the colon)
  useEffect(() => {
    if (!editor) return;

    const handlePasteEvent = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text/plain");
      if (!text || !text.includes(":")) return;

      const lines = text.split("\n");
      let hasPattern = false;
      const htmlParts = lines.map((line) => {
        const match = line.match(/^([^:]{1,30}):(.*)$/);
        if (match) {
          hasPattern = true;
          return `<strong>${match[1]}:</strong>${match[2]}`;
        }
        // HTML escape non-matching text to prevent layout breaks
        return line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      });

      if (hasPattern) {
        event.preventDefault();
        event.stopPropagation();
        const htmlContent = htmlParts.map((p) => `<p>${p}</p>`).join("");
        editor.commands.insertContent(htmlContent);
      }
    };

    const element = editor.view.dom;
    element.addEventListener("paste", handlePasteEvent, true);
    return () => {
      element.removeEventListener("paste", handlePasteEvent, true);
    };
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl.trim() })
        .run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const removeLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowLinkInput(false);
  }, [editor]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor || !onUploadImage) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setIsUploadingImg(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url, alt: file.name || "Blog image" }).run();
      }
    } catch (err: any) {
      alert(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImg(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!editor) return null;

  const btn = (active: boolean, extra = "") =>
    `px-2.5 py-1 rounded-sm text-xs font-bold transition cursor-pointer select-none ${extra} ${
      active
        ? "bg-[#155DFC] text-white border border-[#155DFC] shadow-xs"
        : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-2xs"
    }`;

  const textContent = editor.getText();
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="flex flex-col flex-1">
      {/* Editor Styles — Clean White Theme with #155DFC Accents */}
      <style>{`
        .rte-editor {
          min-height: 260px;
          max-height: 48vh;
          overflow-y: auto;
          outline: none;
          color: #0f172a;
          font-size: 0.925rem;
          line-height: 1.7;
          padding: 16px 18px;
          background-color: #ffffff;
        }
        .rte-editor p { margin: 0 0 0.75rem 0; color: #1e293b; }
        .rte-editor strong { font-weight: 700; color: #0f172a; }
        .rte-editor em { font-style: italic; }
        .rte-editor u { text-decoration: underline; }
        .rte-editor a { color: #155DFC; text-decoration: underline; cursor: pointer; font-weight: 600; }
        .rte-editor a:hover { color: #1048c7; }
        .rte-editor ul { list-style: disc; padding-left: 1.35rem; margin: 0.5rem 0; color: #1e293b; }
        .rte-editor ol { list-style: decimal; padding-left: 1.35rem; margin: 0.5rem 0; color: #1e293b; }
        .rte-editor li { margin-bottom: 0.35rem; }
        .rte-editor h1, .rte-editor h2, .rte-editor h3, .rte-editor h4, .rte-editor h5, .rte-editor h6 {
          font-weight: 700;
          color: #0f172a;
          margin: 1.15rem 0 0.4rem;
        }
        .rte-editor h1 { font-size: 1.65rem; }
        .rte-editor h2 { font-size: 1.4rem; }
        .rte-editor h3 { font-size: 1.2rem; }
        .rte-editor h4 { font-size: 1.05rem; }
        .rte-editor h5 { font-size: 0.95rem; }
        .rte-editor h6 { font-size: 0.875rem; color: #64748b; }
        .rte-editor blockquote {
          border-left: 3px solid #155DFC;
          padding: 8px 14px;
          background-color: #edf2fe;
          color: #155DFC;
          margin: 0.85rem 0;
          border-radius: 0 4px 4px 0;
          font-style: italic;
        }
        .rte-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 1rem 0;
          display: block;
          border: 1px solid #e2e8f0;
        }
        .rte-editor[data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        .rte-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>

      {label && (
        <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}

      {/* Main Editor Card Container — Light / White Theme */}
      <div className="border border-slate-200 rounded-sm overflow-hidden bg-white shadow-xs focus-within:border-[#155DFC] focus-within:ring-1 focus-within:ring-[#155DFC]/20 transition-all">
        
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-50/90 border-b border-slate-200 px-3 py-2 shrink-0">
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              title="Bold"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={btn(editor.isActive("bold"), "font-bold")}
            >
              B
            </button>

            <button
              type="button"
              title="Italic"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={btn(editor.isActive("italic"), "italic")}
            >
              I
            </button>

            <button
              type="button"
              title="Underline"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={btn(editor.isActive("underline"), "underline")}
            >
              U
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            {/* Headings H1 - H6 */}
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <button
                key={level}
                type="button"
                title={`Heading ${level}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as any })
                    .run()
                }
                className={btn(
                  editor.isActive("heading", { level }),
                  "font-bold",
                )}
              >
                H{level}
              </button>
            ))}

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              title="Bullet List"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={btn(editor.isActive("bulletList"))}
            >
              • List
            </button>

            <button
              type="button"
              title="Ordered List"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={btn(editor.isActive("orderedList"))}
            >
              1. List
            </button>

            <span className="w-px h-4 bg-slate-300 mx-1" />

            {/* 🔗 Link button */}
            <button
              type="button"
              title="Add Link — select text first, then click this"
              onClick={() => setShowLinkInput((v) => !v)}
              className={btn(editor.isActive("link"), "inline-flex items-center gap-1")}
            >
              <LinkIcon className="w-3 h-3" />
              Link
            </button>

            {editor.isActive("link") && (
              <button
                type="button"
                onClick={removeLink}
                className="px-2 py-1 rounded-sm text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition cursor-pointer inline-flex items-center gap-1 bg-white"
              >
                <CloseIcon className="w-3 h-3" />
                Remove Link
              </button>
            )}

            {/* Device Image Upload Button */}
            {onUploadImage && (
              <>
                <span className="w-px h-4 bg-slate-300 mx-1" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  disabled={isUploadingImg}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-sm text-xs font-bold bg-[#155DFC]/10 text-[#155DFC] hover:bg-[#155DFC]/15 hover:text-[#1048c7] border border-[#155DFC]/30 transition cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                  title="Upload image from device and insert into content"
                >
                  {isUploadingImg ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#155DFC]" />
                  ) : (
                    <UploadCloud className="w-3.5 h-3.5 text-[#155DFC]" />
                  )}
                  <span>{isUploadingImg ? "Uploading..." : "+ Insert Image"}</span>
                </button>
              </>
            )}

            <span className="w-px h-4 bg-slate-300 mx-1" />

            <button
              type="button"
              title="Clear all formatting"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              className={btn(false)}
            >
              Clear
            </button>
          </div>

          {/* Word count & Read time */}
          <div className="text-xs text-slate-500 font-bold px-1 shrink-0">
            {wordCount} words • {readTime} min read
          </div>
        </div>

        {/* Link URL input panel — White Theme */}
        {showLinkInput && (
          <div className="flex gap-2 items-center bg-[#155DFC]/5 border-b border-slate-200 px-3.5 py-2.5 animate-in fade-in duration-100">
            <span className="text-slate-600 text-xs shrink-0 font-bold">Link URL:</span>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                }
              }}
              placeholder="https://example.com or /services"
              autoFocus
              className="flex-1 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-[#155DFC] focus:ring-1 focus:ring-[#155DFC]/20"
            />
            <button
              type="button"
              onClick={applyLink}
              className="shrink-0 px-3 py-1.5 rounded-sm bg-[#155DFC] text-white text-xs font-bold hover:bg-[#1048c7] transition cursor-pointer shadow-xs"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              className="shrink-0 px-3 py-1.5 rounded-sm bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Editor content area — Pure White Background */}
        <div className="bg-white">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Helper hint */}
      <p className="text-slate-400 text-[11.5px] mt-1.5">
        💡 To add a link: <strong className="text-slate-600 font-semibold">select text</strong> → click Link → enter URL → Apply. To insert an image from your device, click <strong className="text-slate-600 font-semibold">+ Insert Image</strong>.
      </p>
    </div>
  );
}
