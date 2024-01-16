"use client";

import { useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { Doc, applyUpdateV2 } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

import { loadPageContent } from "@/app/actions";

export default function Pad() {
  const monacoRef = useRef<editor.IStandaloneCodeEditor>();
  const bindingRef = useRef<MonacoBinding>();
  const documentRef = useRef<Doc>();

  const pathname = usePathname();

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      documentRef.current?.destroy();
      monacoRef.current?.dispose();
    };
  }, []);

  async function createInitializedDocument() {
    const ydocument = new Doc();

    const previous = await loadPageContent(pathname);

    if (previous) {
      applyUpdateV2(ydocument, new Uint8Array(previous));
    }

    return ydocument;
  }

  function createRTCProvider(ydocument: Doc) {
    const signalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

    const options = { signaling: [signalingServer] };

    return new WebrtcProvider(pathname, ydocument, options);
  }

  function bindMonacoToRTCProvider(
    ydocument: Doc,
    editor: editor.IStandaloneCodeEditor,
    provider: WebrtcProvider
  ) {
    const type = ydocument.getText("monaco");

    const model = editor.getModel()!;

    const editors = new Set([editor]);

    return new MonacoBinding(type, model, editors, provider.awareness);
  }

  async function handleMonacoMount(
    editor: editor.IStandaloneCodeEditor,
    _: Monaco
  ) {
    if (typeof window !== "undefined") {
      const ydocument = await createInitializedDocument();

      const provider = createRTCProvider(ydocument);

      const binding = bindMonacoToRTCProvider(ydocument, editor, provider);

      monacoRef.current = editor;
      documentRef.current = ydocument;
      bindingRef.current = binding;
    }
  }

  return (
    <main className="grid grid-rows-15 grid-cols-8 gap-6 h-svh w-svw overflow-hidden p-4">
      <div className="flex col-span-8 row-span-3 text-center bg-[#1e1e1e] justify-center items-center">
        <h2>Missopad 👀</h2>
      </div>

      <div className="col-span-8 row-span-12">
        <Editor
          defaultLanguage="markdown"
          onMount={handleMonacoMount}
          options={{
            minimap: { enabled: false },
            lineHeight: 1.8,
            fontFamily: "JetBrains Mono",
            cursorStyle: "block-outline",
            padding: { top: 32, bottom: 32 },
          }}
          theme="vs-dark"
        />
      </div>
    </main>
  );
}
