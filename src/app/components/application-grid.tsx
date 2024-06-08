'use client';

import React, { useContext, useEffect } from 'react';

import { lastUpdate } from '@/app/actions/pad';

import { ApplicationContext } from '@/app/context/context';

import { handleServerDateTime } from '@/app/utils/datetime';

import { onCtrlKeyPressed, onInterval, onWindowResize } from '@/app/utils/events';

import Header from '@/app/components/header';
import MarkdownRenderer from '@/app/components/markdown-renderer';
import StatusBar from '@/app/components/status-bar';
import { CommandBar } from '@/app/components/command-bar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/app/components/resizable';
import { Explorer } from '@/app/components/explorer';
import { MarkdownEditor } from '@/app/components/markdown-editor';

import { IApplicationGrid } from '@/app/models/application-grid';

export default function ApplicationGrid({ pathname, content: serverContent, updated: serverUpdated, related }: IApplicationGrid) {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => onInterval(3_000, async () => setContext({ updated: handleServerDateTime(await lastUpdate(pathname)) })), [pathname]);

    useEffect(() => setContext({ updated: handleServerDateTime(serverUpdated) }), []);

    useEffect(() => onCtrlKeyPressed(',', () => setContext({ command: !context.command })), []);

    useEffect(() => onCtrlKeyPressed('.', () => setContext({ explorer: !context.explorer })), []);

    useEffect(() => onWindowResize(() => setContext({ window: { width: window.innerWidth, height: window.innerHeight } })), []);

    return (
        <main className="grid h-svh w-svw grid-cols-1 grid-rows-[.2fr,9.6fr,.2fr] gap-2 bg-background p-2">
            <div onClick={() => setContext({ command: !context.command })}>
                <Header />
            </div>

            {/* Since we can't dynamically create the editor, we need this hidden hack to make sure that we have a proper loading screen */}
            <div className={`${context.loaded && 'hidden'} flex items-center justify-center`}>
                <h1 className="background-animate bg-gradient-to-r  from-purple-600 via-sky-600 to-blue-600 text-9xl">Mpad</h1>
            </div>

            <ResizablePanelGroup className={`${!context.loaded && 'hidden'}`} direction={context.window.width >= 768 ? 'horizontal' : 'vertical'}>
                <ResizablePanel className={`${context.layout === 'preview' && 'hidden'}`} defaultSize={50}>
                    <MarkdownEditor pathname={pathname} serverContent={serverContent} />
                </ResizablePanel>

                <ResizableHandle className={`${context.layout !== 'default' && 'hidden'} bg-muted-accent`} />

                <ResizablePanel className={`${(!context.loaded || context.layout === 'editor') && 'hidden'}`} defaultSize={50}>
                    <div className="markdown-body h-full overflow-y-scroll p-4">
                        <MarkdownRenderer content={context.content} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            <StatusBar pathname={pathname} hasModification={context.modified} lastUpdate={context.updated} spectators={context.connections} />

            <CommandBar />

            <Explorer related={related} />
        </main>
    );
}
