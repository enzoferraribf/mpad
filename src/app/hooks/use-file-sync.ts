import { useContext, useEffect } from 'react';
import { ApplicationContext, EphemeralFile } from '@/app/context/context';

export const useFileSync = (pathname: string) => {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        const { loaded, fileDocument } = context;

        if (!pathname || !loaded || !fileDocument) return;

        const yarray = fileDocument.getArray<EphemeralFile>('files');

        const updateContext = () => {
            const files = yarray.toArray();
            setContext({ files });
        };

        yarray.observe(updateContext);
        updateContext();
    }, [pathname, context.loaded, context.fileDocument]);
};
