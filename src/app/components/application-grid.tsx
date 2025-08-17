'use client';

import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { useUIStore } from '@/app/stores/ui-store';
import { useDocumentStore } from '@/app/stores/document-store';
import { useConnectionStore } from '@/app/stores/connection-store';
import { useWindowStore } from '@/app/stores/window-store';

import { Header } from '@/app/components/header';
import { MarkdownRenderer } from '@/app/components/markdown-renderer';
import { StatusBar } from '@/app/components/status-bar';
import { CommandBar } from '@/app/components/command-bar';
import { Explorer } from '@/app/components/explorer';
import { Storage } from '@/app/components/storage';
import { Excalidraw } from '@/app/components/excalidraw';
import { ExcalidrawList } from '@/app/components/excalidraw-list';
import { LoadingPhrases } from '@/app/components/loading-phrases';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/app/components/shadcn/resizable';

import { handleServerDateTime } from '@/app/lib/datetime';
import { onCtrlKeyPressed, onWindowResize } from '@/app/lib/events';

import { IApplicationGrid } from '@/app/models/application-grid';

const MarkdownEditor = dynamic(
    () => import('@/app/components/markdown-editor').then(mod => ({ default: mod.MarkdownEditor })),
    { ssr: false },
);

export default function ApplicationGrid({
    pathname,
    root,
    content: serverContent,
    updated: serverUpdated,
    related,
    ice,
    loadingPhrase,
}: IApplicationGrid) {
    const { layout, command, explorer, storage, setCommand, setExplorer, setStorage } = useUIStore();

    const { textModified, textUpdated, setTextUpdated, getTextContent, getTextLoaded } = useDocumentStore();

    const { connections } = useConnectionStore();

    const { window: windowDimensions, setWindow } = useWindowStore();

    const content = getTextContent();

    const loaded = getTextLoaded();

    useEffect(() => setTextUpdated(handleServerDateTime(serverUpdated)), [setTextUpdated, serverUpdated]);

    useEffect(() => onCtrlKeyPressed(',', () => setCommand(!command)), [setCommand, command]);

    useEffect(() => onCtrlKeyPressed('.', () => setExplorer(!explorer)), [setExplorer, explorer]);

    useEffect(() => onCtrlKeyPressed(';', () => setStorage(!storage)), [setStorage, storage]);

    useEffect(
        () => onWindowResize(() => setWindow({ width: window.innerWidth, height: window.innerHeight })),
        [setWindow],
    );

    useEffect(() => setWindow({ width: window.innerWidth, height: window.innerHeight }), [setWindow]);

    return (
        <main className="main-grid">
            <Header />

            {/* Since we can't dynamically create the editor, we need this hidden hack to make sure that we have a proper loading screen */}
            <div className={`${loaded && 'hidden'} center-column`}>
                <h1 className="brand-title">Mpad</h1>
                <LoadingPhrases phrase={loadingPhrase} />
            </div>

            <ResizablePanelGroup
                className={`${!loaded && 'hidden'}`}
                direction={windowDimensions.width >= 768 ? 'horizontal' : 'vertical'}
            >
                <ResizablePanel className={`${layout === 'preview' && 'hidden'}`} defaultSize={50}>
                    <MarkdownEditor pathname={pathname} root={root} serverContent={serverContent} ice={ice} />
                </ResizablePanel>

                <ResizableHandle className={`${layout !== 'default' && 'hidden'} bg-border`} />

                <ResizablePanel className={`${(!loaded || layout === 'editor') && 'hidden'}`} defaultSize={50}>
                    <div className="markdown-body container-padding h-full overflow-y-scroll">
                        <MarkdownRenderer content={content} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            <StatusBar
                pathname={pathname}
                hasModification={textModified}
                lastUpdate={textUpdated}
                spectators={connections}
            />

            <CommandBar />

            <Explorer related={related} />

            <Storage />

            <Excalidraw />

            <ExcalidrawList />
        </main>
    );
}
