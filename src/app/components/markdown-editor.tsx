import { useEffect, useRef, useContext } from 'react';

import { useTheme } from 'next-themes';

import { editor } from 'monaco-editor';
import Editor, { Monaco } from '@monaco-editor/react';

import { Doc, applyUpdateV2 } from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';

import { ApplicationContext } from '@/app/context/context';

export function MarkdownEditor({ pathname, serverContent }: { pathname: string; serverContent: Array<number> | null }) {
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

    const handleModification = (text: string | undefined) => {
        setContext({ content: text || '', modified: true });
    };

    const handleMonacoMount = async (editor: editor.IStandaloneCodeEditor, _: Monaco) => {
        if (typeof window !== 'undefined') {
            const ydocument = new Doc();

            if (serverContent) {
                const buffer = new Uint8Array(serverContent);

                applyUpdateV2(ydocument, buffer);

                const documentText = ydocument.getText('monaco').toString();

                setContext({ content: documentText });
            }

            const signalingServer = process.env.NEXT_PUBLIC_SIGNALING_SERVER!;

            const provider = new WebsocketProvider(signalingServer, pathname, ydocument);

            provider.awareness.on('change', () => setContext({ connections: provider.awareness.states.size || 1 }));

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
