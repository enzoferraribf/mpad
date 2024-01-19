"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

import { handleServerSidePersistence } from "@/app/actions";

import { handleServerDateTime } from "@/app/utils/datetime";
import StatusBar from "./status-bar";

interface IPadProps {
  pathname: string;
  initialChangeSet: number[] | null;
  initialLastUpdate: string | null;
}

export default function Pad({
  pathname,
  initialChangeSet,
  initialLastUpdate,
}: IPadProps) {
  const monacoRef = useRef<editor.IStandaloneCodeEditor>();
  const bindingRef = useRef<MonacoBinding>();
  const documentRef = useRef<Doc>();

  const [lastUpdate, setLastUpdate] = useState<string>(
    handleServerDateTime(initialLastUpdate)
  );

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

      if (initialChangeSet) {
        const buffer = new Uint8Array(initialChangeSet);

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

    const { lastUpdate } = await handleServerSidePersistence(
      pathname,
      Array.from(buffer)
    );

    setHasModification(false);
    setLastUpdate(handleServerDateTime(lastUpdate));
  };

  const handleModification = (_: string | undefined) => {
    setHasModification(true);
  };

  return (
    <div className="h-full" onKeyDown={handleSave}>
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
        height="95%"
        onChange={handleModification}
      />

      <StatusBar
        pathname={pathname}
        hasModification={hasModification}
        lastUpdate={lastUpdate}
      />
    </div>
  );
}
