import { useContext, useEffect } from 'react';
import { ApplicationContext, EphemeralFile } from '@/app/context/context';
import { persistDocumentToLocalStorage, loadDocumentFromLocalStorage } from '@/app/lib/file-sync';
import { debounce } from '@/app/utils/debounce';

export const useFileSync = (pathname: string) => {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        const { loaded, fileDocument } = context;

        if (!pathname || !loaded || !fileDocument) return;

        loadDocumentFromLocalStorage(fileDocument, pathname);

        const yarray = fileDocument.getArray<EphemeralFile>('files');

        const updateContext = () => {
            const files = yarray.toArray();
            setContext({ files });
        };

        yarray.observe(updateContext);
        updateContext();

        fileDocument.on('afterAllTransactions', stateChangedDocument => {
            debounce(1000, () => persistDocumentToLocalStorage(stateChangedDocument, pathname));
        });
    }, [pathname, context.loaded, context.fileDocument]);
};
