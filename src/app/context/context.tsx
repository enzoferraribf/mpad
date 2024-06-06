'use client';

import { ReactNode, createContext, useState } from 'react';

interface Window {
    width: number;
    height: number;
}

interface State {
    connections: number;
    content: string;
    loaded: boolean;
    layout: 'editor' | 'preview' | 'default';
    explorer: boolean;
    command: boolean;
    modified: boolean;
    updated: string;
    window: Window;
}

const DEFAULT_STATE: State = {
    connections: 1,
    content: '',
    loaded: false,
    layout: 'default',
    explorer: false,
    command: false,
    modified: false,
    updated: '',
    window: { width: 0, height: 0 },
};

export const ApplicationContext = createContext({ context: DEFAULT_STATE, setContext: (_: Partial<State>) => {} });

export default function ApplicationContextProvider({ children }: { children: ReactNode }) {
    const [connections, setConnections] = useState<State['connections']>(DEFAULT_STATE.connections);
    const [content, setContent] = useState<State['content']>(DEFAULT_STATE.content);
    const [loaded, setLoaded] = useState<State['loaded']>(DEFAULT_STATE.loaded);
    const [layout, setLayout] = useState<State['layout']>(DEFAULT_STATE.layout);
    const [explorer, setExplorer] = useState<State['explorer']>(DEFAULT_STATE.explorer);
    const [command, setCommand] = useState<State['command']>(DEFAULT_STATE.command);
    const [modified, setModified] = useState<State['modified']>(DEFAULT_STATE.modified);
    const [updated, setUpdated] = useState<State['updated']>(DEFAULT_STATE.updated);
    const [window, setWindow] = useState<State['window']>(DEFAULT_STATE.window);

    const state = {
        connections,
        content,
        loaded,
        layout,
        explorer,
        command,
        modified,
        updated,
        window,
    };

    const setContext = (context: Partial<State>) => {
        context.connections !== undefined && setConnections(context.connections);
        context.content !== undefined && setContent(context.content);
        context.loaded !== undefined && setLoaded(context.loaded);
        context.layout !== undefined && setLayout(context.layout);
        context.explorer !== undefined && setExplorer(context.explorer);
        context.command !== undefined && setCommand(context.command);
        context.modified !== undefined && setModified(context.modified);
        context.updated !== undefined && setUpdated(context.updated);
        context.window !== undefined && setWindow(context.window);
    };

    return <ApplicationContext.Provider value={{ context: state, setContext }}>{children}</ApplicationContext.Provider>;
}
