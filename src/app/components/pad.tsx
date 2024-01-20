"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

import { handleServerSidePersistence } from "@/app/actions";

import { handleServerDateTime } from "@/app/utils/datetime";

import StatusBar from "@/app/components/status-bar";
import MarkdownRenderer from "./markdown-renderer";

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

  const [concurrentConnections, setConcurrentConnections] = useState<number>(1);

  const [hasModification, setHasModification] = useState<boolean>(false);

  const [content, setContent] = useState<string>("");

  useEffect(() => {
    return () => {
      bindingRef.current?.awareness?.destroy();
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

        setContent(ydocument.getText("monaco").toString());
      }

      const signalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

      const options = { signaling: [signalingServer] };

      const provider = new WebrtcProvider(pathname, ydocument, options);

      provider.awareness.on("change", () =>
        setConcurrentConnections(provider.awareness.states.size || 1)
      );

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

      // Y.js doesn't notify awareness for connection and focus... So, we need this lil hack.
      editor.setSelection({
        startColumn: 1,
        endColumn: 2,
        startLineNumber: 1,
        endLineNumber: 1,
      });

      editor.setSelection({
        startColumn: 0,
        endColumn: 0,
        startLineNumber: 0,
        endLineNumber: 0,
      });
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

  const handleModification = (text: string | undefined) => {
    setHasModification(true);
    setContent(text || "");
  };

  return (
    <div className="h-full" onKeyDown={handleSave}>
      <div className="grid grid-cols-2 grid-rows-1 gap-2 h-[90svh]">
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
          onChange={handleModification}
        />

        <div className="p-4 bg-[#1e1e1e] markdown-body overflow-y-scroll">
          <MarkdownRenderer content={content} />
        </div>
      </div>

      <StatusBar
        pathname={pathname}
        hasModification={hasModification}
        lastUpdate={lastUpdate}
        spectators={concurrentConnections}
      />
    </div>
  );
}
