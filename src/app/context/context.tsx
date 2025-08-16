'use client';

import { ReactNode, createContext, useState } from 'react';
import { Doc } from 'yjs';

import { IEphemeralFile } from '@/app/models/files';

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
    transaction: number;
    files: IEphemeralFile[];
    storage: boolean;
    fileDocument: Doc | null;
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
    transaction: 0,
    files: [],
    storage: false,
    fileDocument: null,
};

export const ApplicationContext = createContext({ context: DEFAULT_STATE, setContext: (_: Partial<State>) => {} });

export default function ApplicationContextProvider({ children }: { children: ReactNode }) {
    const [connections, setConnections] = useState(DEFAULT_STATE.connections);
    const [content, setContent] = useState(DEFAULT_STATE.content);
    const [loaded, setLoaded] = useState(DEFAULT_STATE.loaded);
    const [layout, setLayout] = useState(DEFAULT_STATE.layout);
    const [explorer, setExplorer] = useState(DEFAULT_STATE.explorer);
    const [command, setCommand] = useState(DEFAULT_STATE.command);
    const [modified, setModified] = useState(DEFAULT_STATE.modified);
    const [updated, setUpdated] = useState(DEFAULT_STATE.updated);
    const [window, setWindow] = useState(DEFAULT_STATE.window);
    const [transaction, setTransaction] = useState(DEFAULT_STATE.transaction);
    const [files, setFiles] = useState(DEFAULT_STATE.files);
    const [storage, setStorage] = useState(DEFAULT_STATE.storage);
    const [fileDocument, setFileDocument] = useState(DEFAULT_STATE.fileDocument);

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
        transaction,
        files,
        storage,
        fileDocument,
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
        context.transaction !== undefined && setTransaction(context.transaction);
        context.files !== undefined && setFiles(context.files);
        context.storage !== undefined && setStorage(context.storage);
        context.fileDocument !== undefined && setFileDocument(context.fileDocument);
    };

    return <ApplicationContext.Provider value={{ context: state, setContext }}>{children}</ApplicationContext.Provider>;
}
