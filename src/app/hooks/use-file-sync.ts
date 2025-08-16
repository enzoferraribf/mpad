import { useContext, useEffect } from 'react';
import { ApplicationContext, FileInfo } from '@/app/context/context';
import { persistDocumentToLocalStorage, loadDocumentFromLocalStorage } from '@/app/lib/file-sync';
import { debounce } from '@/app/utils/debounce';

export const useFileSync = (pathname: string) => {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        const { loaded, fileDocument } = context;

        if (!pathname || !loaded || !fileDocument) return;

        loadDocumentFromLocalStorage(fileDocument, pathname);

        const arr = fileDocument.getArray<FileInfo>('files');

        arr.observe(() => {
            const files = arr.toArray();
            setContext({ files });
        });

        const files = arr.toArray();
        setContext({ files });

        fileDocument.on('afterAllTransactions', stateChangedDocument => {
            debounce(1000, () => persistDocumentToLocalStorage(stateChangedDocument, pathname));
        });
    }, [pathname, context.loaded, context.fileDocument]);
};
