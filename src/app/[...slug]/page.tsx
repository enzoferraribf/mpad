"use client";

import { useCallback, useEffect, useRef } from "react";

import { usePathname } from "next/navigation";

import Editor, { Monaco, useMonaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

import { loadPageContent, savePageContent } from "@/app/actions";
import { debounced } from "@/app/utils";

export default function Pad() {
  const monacoRef = useRef<editor.IStandaloneCodeEditor>();
  const bindingRef = useRef<MonacoBinding>();
  const documentRef = useRef<Doc>();

  const pathname = usePathname();
  const monaco = useMonaco();

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      documentRef.current?.destroy();
      monacoRef.current?.dispose();
    };
  }, []);

  async function handleMonacoMount(
    editor: editor.IStandaloneCodeEditor,
    _: Monaco
  ) {
    if (typeof window !== "undefined") {
      const ydocument = new Doc();

      const previous = await loadPageContent(pathname);

      if (previous) {
        applyUpdateV2(ydocument, new Uint8Array(previous));
      }

      const signalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

      const options = { signaling: [signalingServer] };

      const provider = new WebrtcProvider(pathname, ydocument, options);

      const type = ydocument.getText("monaco");

      const model = editor.getModel()!;

      const editors = new Set([editor]);

      const binding = new MonacoBinding(
        type,
        model,
        editors,
        provider.awareness
      );

      monacoRef.current = editor;
      documentRef.current = ydocument;
      bindingRef.current = binding;
    }
  }

  // TODO: remove in favor of server-side persistence.
  const handleUpdate = useCallback(
    () =>
      debounced(async () => {
        if (documentRef.current) {
          await savePageContent(
            pathname,
            encodeStateAsUpdateV2(documentRef.current!)
          );
        }
      }, 500),
    [documentRef, pathname]
  );

  return (
    <main className="grid h-svh w-svw overflow-hidden">
      <div className="p-5">
        <Editor
          defaultLanguage="markdown"
          onMount={handleMonacoMount}
          options={{
            minimap: { enabled: false },
            lineHeight: 1.8,
            fontFamily: "JetBrains Mono",
            cursorStyle: "block-outline",
            padding: { top: 20, bottom: 20 },
          }}
          theme="vs-dark"
          onChange={handleUpdate}
        />
      </div>
    </main>
  );
}
