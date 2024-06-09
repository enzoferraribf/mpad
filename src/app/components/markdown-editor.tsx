import { useEffect, useRef, useContext } from 'react';

import { useTheme } from 'next-themes';

import { editor } from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';

import { Doc, applyUpdateV2, encodeStateAsUpdateV2 } from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebrtcProvider } from 'y-webrtc';

import { ApplicationContext } from '@/app/context/context';

import { debounce } from '@/app/utils/debounce';
import { handleServerDateTime } from '@/app/utils/datetime';

import { write } from '@/app/actions/pad';

export function MarkdownEditor({ pathname, root, serverContent }: { pathname: string; root: string; serverContent: Array<number> | null }) {
    const monacoRef = useRef<editor.IStandaloneCodeEditor>();
    const bindingRef = useRef<MonacoBinding>();
    const documentRef = useRef<Doc>();

    const { resolvedTheme } = useTheme();

    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        return () => {
            bindingRef.current?.destroy();
            documentRef.current?.destroy();
            monacoRef.current?.dispose();
        };
    }, []);

    useEffect(() => debounce(500, async () => transact(context.transaction)), [context.transaction]);

    async function transact(transaction: number) {
        if (!context.loaded) return;

        const document = documentRef.current!;

        const buffer = encodeStateAsUpdateV2(document);

        const csv = buffer.join(',');

        const lastUpdated = await write(root, pathname, csv, transaction);

        if (lastUpdated) setContext({ updated: handleServerDateTime(lastUpdated), modified: false });
    }

    const handleModification = (text: string | undefined) => {
        setContext({ content: text || '', modified: true });
    };

    const handleMonacoMount = async (editor: editor.IStandaloneCodeEditor, _: Monaco) => {
        if (typeof window !== 'undefined') {
            const ydocument = new Doc();

            if (serverContent && serverContent.length > 0) {
                const buffer = new Uint8Array(serverContent);

                applyUpdateV2(ydocument, buffer);

                const documentText = ydocument.getText('monaco').toString();

                setContext({ content: documentText });
            }

            const signaling = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

            const provider = new WebrtcProvider(pathname, ydocument, { signaling: [signaling] });

            provider.awareness.on('change', () => setContext({ connections: provider.awareness.states.size || 1 }));

            const type = ydocument.getText('monaco');

            const model = editor.getModel()!;

            const editors = new Set([editor]);

            const binding = new MonacoBinding(type, model, editors, provider.awareness);

            binding.doc.on('afterAllTransactions', () => setContext({ transaction: Date.now() }));

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

            setContext({ loaded: true });
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
