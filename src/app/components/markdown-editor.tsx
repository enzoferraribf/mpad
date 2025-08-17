import { useEffect, useRef } from 'react';

import { useTheme } from 'next-themes';

import { editor } from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebrtcProvider } from 'y-webrtc';

import { write } from '@/app/actions/pad';

import { useDocumentStore } from '@/app/stores/document-store';
import { useConnectionStore } from '@/app/stores/connection-store';
import { useFileStore } from '@/app/stores/file-store';

import { debounce } from '@/app/lib/debounce';
import { handleServerDateTime } from '@/app/lib/datetime';

import { IMarkdownEditor } from '@/app/models/markdown-editor';

export function MarkdownEditor({ pathname, root, serverContent, ice }: IMarkdownEditor) {
    const monacoRef = useRef<editor.IStandaloneCodeEditor>(null);
    const bindingRef = useRef<MonacoBinding>(null);
    const documentRef = useRef<Doc>(null);
    const fileDocumentRef = useRef<Doc>(null);

    const { resolvedTheme } = useTheme();

    const { getTextLoaded, setTextDocument, setTextModified, setTextUpdated } = useDocumentStore();

    const { transaction, setConnections, setTransaction } = useConnectionStore();

    const { setFileDocument } = useFileStore();

    const loaded = getTextLoaded();

    useEffect(() => {
        return () => {
            bindingRef.current?.destroy();
            documentRef.current?.destroy();
            fileDocumentRef.current?.destroy();
            monacoRef.current?.dispose();
        };
    }, []);

    useEffect(() => debounce(500, async () => transact(transaction)), [transaction]);

    async function transact(transaction: number) {
        if (!loaded) return;

        const document = documentRef.current!;

        const buffer = encodeStateAsUpdateV2(document);

        const csv = buffer.join(',');

        const lastUpdated = await write(root, pathname, csv, transaction);

        if (lastUpdated) {
            setTextUpdated(handleServerDateTime(lastUpdated));
            setTextModified(false);
        }
    }

    const handleModification = (_: string | undefined) => {
        setTextModified(true);
    };

    const loadServerContent = (ydocument: Doc) => {
        if (!serverContent || serverContent.length === 0) {
            return;
        }

        const buffer = new Uint8Array(serverContent);

        applyUpdateV2(ydocument, buffer);
    };

    const createWebRTCProvider = (pad: string, ydocument: Doc, signaling: string, peerOptions: any) => {
        return new WebrtcProvider(pad, ydocument, { signaling: [signaling], peerOpts: peerOptions });
    };

    const setupMonacoBinding = (editor: editor.IStandaloneCodeEditor, ydocument: Doc, provider: WebrtcProvider) => {
        const type = ydocument.getText('monaco');
        const model = editor.getModel()!;
        const editors = new Set([editor]);
        const binding = new MonacoBinding(type, model, editors, provider.awareness);

        binding.doc.on('afterAllTransactions', () => setTransaction(Date.now()));

        monacoRef.current = editor;
        documentRef.current = ydocument;
        bindingRef.current = binding;
    };

    const initializeTextDocumentWebRTC = (editor: editor.IStandaloneCodeEditor, signaling: string, peerOptions: any) => {
        const ydocument = new Doc();

        loadServerContent(ydocument);

        const provider = createWebRTCProvider(pathname, ydocument, signaling, peerOptions);

        provider.awareness.on('change', () => setConnections(provider.awareness.states.size || 1));

        setupMonacoBinding(editor, ydocument, provider);

        setTextDocument(ydocument);
    };

    const initializeFileDocumentWebRTC = (signaling: string, peerOptions: any) => {
        const fileDocument = new Doc();

        const _ = createWebRTCProvider(`${pathname}-files`, fileDocument, signaling, peerOptions);

        setFileDocument(fileDocument);

        fileDocumentRef.current = fileDocument;
    };

    const handleMonacoMount = async (editor: editor.IStandaloneCodeEditor, _: Monaco) => {
        if (typeof window !== 'undefined') {
            const signaling = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

            let peerOptions = undefined;

            if (ice) {
                peerOptions = {
                    config: {
                        iceServers: ice,
                    },
                };
            }

            initializeTextDocumentWebRTC(editor, signaling, peerOptions);
            initializeFileDocumentWebRTC(signaling, peerOptions);

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

    return (
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
    );
}
