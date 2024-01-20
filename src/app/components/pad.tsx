'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';

import { handleServerSidePersistence } from '@/app/actions';

import { handleServerDateTime } from '@/app/utils/datetime';

import Header from '@/app/components/header';
import MarkdownRenderer from '@/app/components/markdown-renderer';
import StatusBar from '@/app/components/status-bar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/app/components/resizable';

interface IPadProps {
    pathname: string;
    initialChangeSet: number[] | null;
    initialLastUpdate: string | null;
}

export default function Pad({ pathname, initialChangeSet, initialLastUpdate }: IPadProps) {
    const monacoRef = useRef<editor.IStandaloneCodeEditor>();
    const bindingRef = useRef<MonacoBinding>();
    const documentRef = useRef<Doc>();

    const [lastUpdate, setLastUpdate] = useState<string>(handleServerDateTime(initialLastUpdate));

    const [concurrentConnections, setConcurrentConnections] = useState<number>(1);

    const [hasModification, setHasModification] = useState<boolean>(false);

    const [content, setContent] = useState<string>('');

    useEffect(() => {
        return () => {
            bindingRef.current?.destroy();
            documentRef.current?.destroy();
            monacoRef.current?.dispose();
        };
    }, []);

    const handleMonacoMount = async (editor: editor.IStandaloneCodeEditor, _: Monaco) => {
        if (typeof window !== 'undefined') {
            const ydocument = new Doc();

            if (initialChangeSet) {
                const buffer = new Uint8Array(initialChangeSet);

                applyUpdateV2(ydocument, buffer);

                setContent(ydocument.getText('monaco').toString());
            }

            const signalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

            const options = { signaling: [signalingServer] };

            const provider = new WebrtcProvider(pathname, ydocument, options);

            provider.awareness.on('change', () => setConcurrentConnections(provider.awareness.states.size || 1));

            const type = ydocument.getText('monaco');

            const model = editor.getModel()!;

            const editors = new Set([editor]);

            const binding = new MonacoBinding(type, model, editors, provider.awareness);

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

        if (!event.ctrlKey || event.key !== 's') return;

        event.preventDefault();

        const buffer = encodeStateAsUpdateV2(documentRef.current);

        const { lastUpdate } = await handleServerSidePersistence(pathname, Array.from(buffer));

        setHasModification(false);
        setLastUpdate(handleServerDateTime(lastUpdate));
    };

    const handleModification = (text: string | undefined) => {
        setHasModification(true);
        setContent(text || '');
    };

    return (
        <main
            className="grid-rows-[.2fr 9.6fr,.2fr] grid h-svh w-svw grid-cols-1 gap-2 bg-black p-2"
            onKeyDown={handleSave}
        >
            <Header />

            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel>
                    <Editor
                        defaultLanguage="markdown"
                        onMount={handleMonacoMount}
                        options={{
                            minimap: { enabled: false },
                            lineHeight: 1.8,
                            fontFamily: 'JetBrains Mono',
                            cursorStyle: 'block-outline',
                            padding: { top: 32, bottom: 32 },
                        }}
                        theme="vs-dark"
                        onChange={handleModification}
                    />
                </ResizablePanel>

                <ResizableHandle className="bg-[#2c2c2c]" />

                <ResizablePanel>
                    <div className="markdown-body h-full overflow-y-scroll bg-[#1e1e1e] p-4">
                        <MarkdownRenderer content={content} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            <StatusBar
                pathname={pathname}
                hasModification={hasModification}
                lastUpdate={lastUpdate}
                spectators={concurrentConnections}
            />
        </main>
    );
}
