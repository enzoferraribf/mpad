import { useContext, useEffect } from 'react';
import { ApplicationContext } from '@/app/context/context';
import { setupFileObserver } from '@/app/lib/file-sync';

export const useFileSync = (pathname: string) => {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        const { loaded, document } = context;

        if (!pathname || !loaded || !document) return;

        const cleanup = setupFileObserver(document, files => {
            setContext({ files });
        });

        return cleanup;
    }, [pathname, context.loaded, context.document]);
};
