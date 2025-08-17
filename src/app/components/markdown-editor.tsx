import { useEffect, useRef, useCallback } from 'react';

import { useTheme } from 'next-themes';

import { editor } from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';
import { Doc } from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebrtcProvider } from 'y-webrtc';

import { useDocumentStore } from '@/app/stores/document-store';
import { useConnectionStore } from '@/app/stores/connection-store';
import { useFileStore } from '@/app/stores/file-store';

import { debounce } from '@/app/lib/debounce';
import { handleServerDateTime } from '@/app/lib/datetime';

import { DocumentBuilder } from '@/app/builders/document-builder';
import { TransactionBuilder } from '@/app/builders/transaction-builder';

import { IMarkdownEditor } from '@/app/models/markdown-editor';

export function MarkdownEditor({ pathname, root, serverContent, ice }: IMarkdownEditor) {
    const monacoRef = useRef<editor.IStandaloneCodeEditor>(null);
    const documentBuilderRef = useRef<DocumentBuilder>(null);
    const fileDocumentBuilderRef = useRef<DocumentBuilder>(null);

    const { resolvedTheme } = useTheme();

    const { textDocument, setTextDocument, setTextModified, setTextUpdated } = useDocumentStore();

    const { transaction, setConnections, setTransaction } = useConnectionStore();

    const { setFileDocument } = useFileStore();

    useEffect(() => {
        return () => {
            documentBuilderRef.current?.destroy();
            fileDocumentBuilderRef.current?.destroy();
            monacoRef.current?.dispose();
        };
    }, []);

    const transact = useCallback(
        async (transactionId: number) => {
            if (!textDocument) return;

            await TransactionBuilder.create()
                .withDocument(textDocument)
                .withRoot(root)
                .withPathname(pathname)
                .withMaxDocumentSize(15000)
                .withTransactionId(transactionId)
                .withOnSuccess((timestamp: number) => {
                    setTextUpdated(handleServerDateTime(timestamp));
                    setTextModified(false);
                })
                .execute();
        },
        [textDocument, root, pathname, setTextUpdated, setTextModified],
    );

    useEffect(() => debounce(500, async () => transact(transaction)), [transact, transaction]);

    const handleModification = (_: string | undefined) => {
        setTextModified(true);
    };

    const handleMonacoMount = async (monacoEditor: editor.IStandaloneCodeEditor, _: Monaco) => {
        if (typeof window !== 'undefined') {
            const signaling = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;
            const peerOptions = ice ? { config: { iceServers: ice } } : undefined;

            const documentBuilder = DocumentBuilder.create()
                .withPathname(pathname)
                .withSignaling(signaling)
                .withPeerOptions(peerOptions)
                .withServerContent(serverContent)
                .withOnAwarenessChange(setConnections)
                .withBind((doc: Doc, provider: WebrtcProvider) => {
                    const type = doc.getText('monaco');
                    const model = monacoEditor.getModel()!;
                    const editors = new Set([monacoEditor]);
                    const binding = new MonacoBinding(type, model, editors, provider.awareness);
                    binding.doc.on('afterAllTransactions', () => setTransaction(Date.now()));
                })
                .build();

            const fileDocumentBuilder = DocumentBuilder.create()
                .withPathname(`${pathname}-files`)
                .withSignaling(signaling)
                .withPeerOptions(peerOptions)
                .build();

            setTextDocument(documentBuilder.getDocument()!);
            setFileDocument(fileDocumentBuilder.getDocument()!);

            monacoRef.current = monacoEditor;
            documentBuilderRef.current = documentBuilder;
            fileDocumentBuilderRef.current = fileDocumentBuilder;

            monacoEditor.setSelection({
                startColumn: 1,
                endColumn: 2,
                startLineNumber: 1,
                endLineNumber: 1,
            });

            monacoEditor.setSelection({
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
