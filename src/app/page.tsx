"use client";

import { useEffect, useRef } from "react";

import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { Doc } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

export default function Home() {
  const monacoRef = useRef<editor.IStandaloneCodeEditor>();
  const bindingRef = useRef<MonacoBinding>();

  useEffect(() => {
    bindingRef.current?.destroy();
    monacoRef.current?.dispose();
  }, []);

  function handleMonacoMount(editor: editor.IStandaloneCodeEditor, _: Monaco) {
    if (typeof window !== "undefined") {
      monacoRef.current = editor;

      const ydocument = new Doc();

      const type = ydocument.getText("monaco");

      const provider = new WebrtcProvider("/foo", ydocument, {
        signaling: ["ws://localhost:4000"],
      });

      const binding = new MonacoBinding(
        type,
        monacoRef.current.getModel()!,
        new Set([monacoRef.current]),
        provider.awareness
      );

      bindingRef.current = binding;
    }
  }

  return (
    <main className="flex min-h-svh w-svw">
      <Editor
        className="min-h-svh w-svw"
        defaultLanguage="markdown"
        onMount={handleMonacoMount}
        options={{
          minimap: { enabled: false },
          lineHeight: 1.8,
          fontFamily: "JetBrains Mono",
        }}
      />
    </main>
  );
}
