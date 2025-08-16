'use client';

import React, { useContext, useEffect } from 'react';

import dynamic from 'next/dynamic';

import { ApplicationContext } from '@/app/context/context';

import { Header } from '@/app/components/header';
import { MarkdownRenderer } from '@/app/components/markdown-renderer';
import { StatusBar } from '@/app/components/status-bar';
import { CommandBar } from '@/app/components/command-bar';
import { Explorer } from '@/app/components/explorer';
import { Storage } from '@/app/components/storage';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/app/components/shadcn/resizable';

import { handleServerDateTime } from '@/app/lib/datetime';
import { onCtrlKeyPressed, onWindowResize } from '@/app/lib/events';

import { IApplicationGrid } from '@/app/models/application-grid';

const MarkdownEditor = dynamic(() => import('@/app/components/markdown-editor').then(mod => ({ default: mod.MarkdownEditor })), { ssr: false });

export default function ApplicationGrid({ pathname, root, content: serverContent, updated: serverUpdated, related, ice }: IApplicationGrid) {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => setContext({ updated: handleServerDateTime(serverUpdated) }), []);

    useEffect(() => onCtrlKeyPressed(',', () => setContext({ command: !context.command })), []);

    useEffect(() => onCtrlKeyPressed('.', () => setContext({ explorer: !context.explorer })), []);

    useEffect(() => onCtrlKeyPressed(';', () => setContext({ storage: !context.storage })), []);

    useEffect(() => onWindowResize(() => setContext({ window: { width: window.innerWidth, height: window.innerHeight } })), []);

    useEffect(() => setContext({ window: { width: window.innerWidth, height: window.innerHeight } }), []);

    return (
        <main className="main-grid">
            <div onClick={() => setContext({ command: !context.command })}>
                <Header />
            </div>

            {/* Since we can't dynamically create the editor, we need this hidden hack to make sure that we have a proper loading screen */}
            <div className={`${context.loaded && 'hidden'} center-content`}>
                <h1 className="brand-title">Mpad</h1>
            </div>

            <ResizablePanelGroup className={`${!context.loaded && 'hidden'}`} direction={context.window.width >= 768 ? 'horizontal' : 'vertical'}>
                <ResizablePanel className={`${context.layout === 'preview' && 'hidden'}`} defaultSize={50}>
                    <MarkdownEditor pathname={pathname} root={root} serverContent={serverContent} ice={ice} />
                </ResizablePanel>

                <ResizableHandle className={`${context.layout !== 'default' && 'hidden'} bg-border`} />

                <ResizablePanel className={`${(!context.loaded || context.layout === 'editor') && 'hidden'}`} defaultSize={50}>
                    <div className="markdown-body container-padding h-full overflow-y-scroll">
                        <MarkdownRenderer content={context.content} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            <StatusBar pathname={pathname} hasModification={context.modified} lastUpdate={context.updated} spectators={context.connections} />

            <CommandBar />

            <Explorer related={related} />

            <Storage />
        </main>
    );
}
