'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import Editor, { Monaco } from '@monaco-editor/react';

import { editor } from 'monaco-editor';

import { Doc, applyUpdateV2 } from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

import { handleServerDateTime } from '@/app/utils/datetime';

import { lastUpdate } from '@/app/actions/pad';

import Header from '@/app/components/header';
import MarkdownRenderer from '@/app/components/markdown-renderer';
import StatusBar from '@/app/components/status-bar';
import { Badge } from '@/app/components/badge';
import { CommandDialog } from '@/app/components/command';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/app/components/resizable';
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/command';

interface IPadProps {
    pathname: string;
    initialContent: Array<number> | null;
    initialLastUpdate: number | null;
    related: string[];
}

export default function Pad({ pathname, initialContent, initialLastUpdate, related }: IPadProps) {
    const monacoRef = useRef<editor.IStandaloneCodeEditor>();
    const bindingRef = useRef<MonacoBinding>();
    const documentRef = useRef<Doc>();

    const { setTheme, resolvedTheme } = useTheme();

    const [localLastUpdate, setLocalLastUpdate] = useState<string>(handleServerDateTime(initialLastUpdate));

    const [concurrentConnections, setConcurrentConnections] = useState<number>(1);

    const [hasModification, setHasModification] = useState<boolean>(false);

    const [content, setContent] = useState<string>('');

    const [loaded, setLoaded] = useState<boolean>(false);

    const [openCommand, setOpenCommand] = useState<boolean>(false);

    const [layout, setLayout] = useState<'editor' | 'preview' | 'default'>('default');

    const [explorerOpen, setExplorerOpen] = useState<boolean>(false);

    const { push } = useRouter();

    useEffect(() => {
        return () => {
            bindingRef.current?.destroy();
            documentRef.current?.destroy();
            monacoRef.current?.dispose();
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            const serverLastUpdate = await lastUpdate(pathname);

            setLocalLastUpdate(handleServerDateTime(serverLastUpdate));
        }, 3_000);

        return () => clearInterval(interval);
    }, [pathname]);

    useEffect(() => {
        const handleCommandOpen = (event: globalThis.KeyboardEvent) => {
            if (!event.ctrlKey || event.key !== 'j') return;

            event.preventDefault();

            setOpenCommand(openCommand => !openCommand);
        };

        window.addEventListener('keydown', handleCommandOpen);

        return () => {
            window.removeEventListener('keydown', handleCommandOpen);
        };
    }, []);

    useEffect(() => {
        const handleExplorerOpen = (event: globalThis.KeyboardEvent) => {
            if (!event.ctrlKey || event.key !== 'b') return;

            event.preventDefault();

            setExplorerOpen(explorerOpen => !explorerOpen);
        };

        window.addEventListener('keydown', handleExplorerOpen);

        return () => {
            window.removeEventListener('keydown', handleExplorerOpen);
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

            if (initialContent) {
                const buffer = new Uint8Array(initialContent);

                applyUpdateV2(ydocument, buffer);

                setContent(ydocument.getText('monaco').toString());
            }

            const signalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

            const provider = new WebsocketProvider(signalingServer, pathname, ydocument);

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

    const handleFiles = () => {
        setExplorerOpen(true);
        setOpenCommand(openCommand => !openCommand);
    };

    const handleNavigation = (pad: string) => {
        push(pad);
    };

    const handleLayout = (layout: 'editor' | 'preview' | 'default') => {
        setLayout(layout);
        setOpenCommand(openCommand => !openCommand);
    };

    const handleTheme = (theme: 'light' | 'dark') => {
        setTheme(theme);
        setOpenCommand(openCommand => !openCommand);
    };

    const handleModification = (text: string | undefined) => {
        setHasModification(true);
        setContent(text || '');
    };

    return (
        <main className="grid h-svh w-svw grid-cols-1 grid-rows-[.2fr,9.6fr,.2fr] gap-2 bg-background p-2">
            <div onClick={() => setOpenCommand(openCommand => !openCommand)}>
                <Header />
            </div>

            {/* Since we can't dynamically create the editor, we need this hidden hack to make sure that we have a proper loading screen */}
            <div className={`${loaded && 'hidden'} flex items-center justify-center`}>
                <h1 className="background-animate bg-gradient-to-r  from-purple-600 via-sky-600 to-blue-600 text-9xl">Mpad</h1>
            </div>

            <ResizablePanelGroup className={`${!loaded && 'hidden'}`} direction={windowSize.width >= 768 ? 'horizontal' : 'vertical'}>
                <ResizablePanel className={`${layout === 'preview' && 'hidden'}`} defaultSize={50}>
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
                        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                        onChange={handleModification}
                        loading={false}
                    />
                </ResizablePanel>

                <ResizableHandle className={`${layout !== 'default' && 'hidden'} bg-muted-accent`} />

                <ResizablePanel className={`${(!loaded || layout === 'editor') && 'hidden'}`} defaultSize={50}>
                    <div className="markdown-body h-full overflow-y-scroll p-4">
                        <MarkdownRenderer content={content} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            <StatusBar pathname={pathname} hasModification={hasModification} lastUpdate={localLastUpdate} spectators={concurrentConnections} />

            <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
                <CommandInput placeholder="Type a command or search..." />

                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Files">
                        <CommandItem onSelect={() => handleFiles()}>
                            <div className="space-y-5">
                                <h1 className="font-bold">📁 Explorer</h1>
                                <span className="text-xs">{"View this pad's file structure."}</span>
                            </div>
                        </CommandItem>
                    </CommandGroup>

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

                    <CommandGroup heading="Themes">
                        <CommandItem onSelect={() => handleTheme('dark')}>
                            <div className="space-y-5">
                                <h1 className="font-bold">🌙 Dark</h1>
                                <span className="text-xs">Changes Mpad to dark mode.</span>
                            </div>
                        </CommandItem>

                        <CommandItem onSelect={() => handleTheme('light')}>
                            <div className="space-y-5">
                                <h1 className="font-bold">☀️ Light</h1>
                                <span className="text-xs">Changes Mpad to light mode.</span>
                            </div>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            <CommandDialog open={explorerOpen} onOpenChange={open => setExplorerOpen(open)}>
                <CommandInput placeholder="Search for a Pad..." />

                <CommandGroup heading="Pads">
                    {related.map((related, index) => {
                        const paths = related.split('/').filter(path => path);
                        const lastPath = paths.pop();

                        return (
                            <CommandItem key={index} onSelect={() => handleNavigation(related)}>
                                <div key={index} className="flex flex-row space-x-2 truncate text-sm">
                                    {/* Search seems to be based on inner elements. I added this hidden span so the search works with the full path */}
                                    <span hidden>{related}</span>

                                    {paths.map((path, index) => (
                                        <Badge key={index}>{path}</Badge>
                                    ))}

                                    <p key={index}>{lastPath}</p>
                                </div>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandDialog>
        </main>
    );
}
