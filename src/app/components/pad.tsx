"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { usePathname } from "next/navigation";

import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

import { handleServerSidePersistence, rebuildPageContent } from "@/app/actions";

export default function Pad() {
  const monacoRef = useRef<editor.IStandaloneCodeEditor>();
  const bindingRef = useRef<MonacoBinding>();
  const documentRef = useRef<Doc>();

  const pathname = usePathname();

  const [hasModification, setHasModification] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy();
      documentRef.current?.destroy();
      monacoRef.current?.dispose();
    };
  }, []);

  const handleMonacoMount = async (
    editor: editor.IStandaloneCodeEditor,
    _: Monaco
  ) => {
    if (typeof window !== "undefined") {
      const ydocument = new Doc();

      const changeSet = await rebuildPageContent(pathname);

      if (changeSet) {
        const buffer = new Uint8Array(changeSet);

        applyUpdateV2(ydocument, buffer);
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
  };

  const handleSave = async (event: KeyboardEvent<HTMLDivElement>) => {
    if (!documentRef.current) return;

    if (!event.ctrlKey || event.key !== "s") return;

    event.preventDefault();

    const buffer = encodeStateAsUpdateV2(documentRef.current);

    await handleServerSidePersistence(pathname, Array.from(buffer));

    setHasModification(false);
  };

  return (
    <main className="grid grid-rows-15 grid-cols-8 gap-6 h-svh w-svw overflow-hidden p-4">
      <div className="flex col-span-8 row-span-3 text-center bg-[#1e1e1e] justify-center items-center">
        <h2>Missopad 👀</h2>
      </div>

      <div className="flex w-fit h-10 bg-[#1e1e1e] items-center pl-12 pr-12 rounded-md">
        <span>
          {pathname} {hasModification && "•"}
        </span>
      </div>

      <div className="col-span-8 row-span-12" onKeyDown={handleSave}>
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
          onChange={() => !hasModification && setHasModification(true)}
        />
      </div>
    </main>
  );
}
