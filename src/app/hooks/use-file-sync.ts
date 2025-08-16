import { useContext, useEffect } from 'react';
import { ApplicationContext } from '@/app/context/context';
import { setupFileObserver } from '@/app/lib/file-sync';

export const useFileSync = (pathname: string) => {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        const { loaded, fileDocument } = context;

        if (!pathname || !loaded || !fileDocument) return;

        const cleanup = setupFileObserver(fileDocument, files => {
            setContext({ files });
        });

        return cleanup;
    }, [pathname, context.loaded, context.fileDocument]);
};
