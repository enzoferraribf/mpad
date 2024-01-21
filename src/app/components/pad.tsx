'use client';

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';

import Editor, { Monaco } from '@monaco-editor/react';

import { editor } from 'monaco-editor';

import { toast } from 'sonner';

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { MonacoBinding } from 'y-monaco';

import { handleServerSidePersistence } from '@/app/actions';

import { handleServerDateTime } from '@/app/utils/datetime';

import Header from '@/app/components/header';
import MarkdownRenderer from '@/app/components/markdown-renderer';
import StatusBar from '@/app/components/status-bar';
import { CommandDialog } from '@/app/components/command';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/app/components/resizable';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/command';

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

    const [loaded, setLoaded] = useState<boolean>(false);

    const [openCommand, setOpenCommand] = useState<boolean>(false);

    const [layout, setLayout] = useState<'editor' | 'preview' | 'default'>('default');

    useEffect(() => {
        return () => {
            bindingRef.current?.destroy();
            documentRef.current?.destroy();
            monacoRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        const handleCommandOpen = (event: globalThis.KeyboardEvent) => {
            if (!event.ctrlKey || event.key !== 'j') return;

            event.preventDefault();

            setOpenCommand((openCommand) => !openCommand);
        };

        window.addEventListener('keydown', handleCommandOpen);

        return () => {
            window.removeEventListener('keydown', handleCommandOpen);
        };
    }, []);

    const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

        const handleWindowResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
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

            setLoaded(true);
        }
    };

    const handleSaveFromKeyboard = async (event: KeyboardEvent<HTMLElement>) => {
        if (!event.ctrlKey || event.key !== 's') return;

        event.preventDefault();

        await handleSave();
    };

    const handleSaveFromCommand = async () => {
        await handleSave();

        setOpenCommand((openCommand) => !openCommand);
    };

    const handleSave = async () => {
        if (!documentRef.current) return;

        const buffer = encodeStateAsUpdateV2(documentRef.current);

        const { lastUpdate } = await handleServerSidePersistence(pathname, Array.from(buffer));

        const localizedUpdate = handleServerDateTime(lastUpdate);

        setHasModification(false);
        setLastUpdate(localizedUpdate);

        toast('Pad saved successfully ✅', {
            description: localizedUpdate,
            duration: 3000,
        });
    };

    const handleLayout = (layout: 'editor' | 'preview' | 'default') => {
        setLayout(layout);
        setOpenCommand((openCommand) => !openCommand);
    };

    const handleModification = (text: string | undefined) => {
        setHasModification(true);
        setContent(text || '');
    };

    return (
        <main
            className="grid h-svh w-svw grid-cols-1 grid-rows-[.2fr,9.6fr,.2fr] gap-2 bg-background p-2"
            onKeyDown={handleSaveFromKeyboard}
        >
            <Header />

            {/* Since we can't dynamically create the editor, we need this hidden hack to make sure that we have a proper loading screen */}
            <div className={`${loaded && 'hidden'} flex items-center justify-center`}>
                <h1 className="background-animate bg-gradient-to-r  from-purple-600 via-sky-600 to-blue-600 text-9xl">
                    Mpad
                </h1>
            </div>

            <ResizablePanelGroup
                className={`${!loaded && 'hidden'}`}
                direction={windowSize.width >= 768 ? 'horizontal' : 'vertical'}
            >
                <ResizablePanel className={`${layout === 'preview' && 'hidden'}`}>
                    <Editor
                        defaultLanguage="markdown"
                        onMount={handleMonacoMount}
                        options={{
                            minimap: { enabled: false },
                            lineHeight: 1.8,
                            fontFamily: 'JetBrains Mono',
                            cursorStyle: 'block-outline',
                            padding: { top: 32, bottom: 32 },
                            fontSize: 14,
                        }}
                        theme="vs-dark"
                        onChange={handleModification}
                        loading={false}
                    />
                </ResizablePanel>

                <ResizableHandle className={`${layout !== 'default' && 'hidden'} bg-muted-accent`} />

                <ResizablePanel className={`${(!loaded || layout === 'editor') && 'hidden'}`}>
                    <div className="markdown-body h-full overflow-y-scroll p-4">
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

            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="Type a command or search..." />

                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Layout">
                        <CommandItem onSelect={() => handleLayout('editor')}>
                            <div className="space-y-5">
                                <h1 className="font-bold">✏️ Editor</h1>
                                <span className="text-xs">Changes the Mpad view to edit-only.</span>
                            </div>
                        </CommandItem>

                        <CommandItem onSelect={() => handleLayout('preview')}>
                            <div className="space-y-5">
                                <h1 className="font-bold">📄 Preview</h1>
                                <span className="text-xs">Changes the Mpad view to preview-only.</span>
                            </div>
                        </CommandItem>

                        <CommandItem onSelect={() => handleLayout('default')}>
                            <div className="space-y-5">
                                <h1 className="font-bold">✏️📄 Editor+Preview</h1>
                                <span className="text-xs">Changes the Mpad view to default.</span>
                            </div>
                        </CommandItem>
                    </CommandGroup>

                    <CommandGroup heading="Actions">
                        <CommandItem onSelect={handleSaveFromCommand}>
                            <div className="space-y-5">
                                <h1 className="font-bold">💾 Save</h1>
                                <span className="text-xs">Persists the pad content on the remote storage.</span>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </main>
    );
}
