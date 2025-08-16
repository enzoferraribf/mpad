import { useContext, useEffect } from 'react';

import { ApplicationContext } from '@/app/context/context';

import { IEphemeralFile } from '@/app/models/files';

export const useFileSync = (pathname: string) => {
    const { context, setContext } = useContext(ApplicationContext);

    useEffect(() => {
        const { loaded, fileDocument } = context;

        if (!pathname || !loaded || !fileDocument) return;

        const yarray = fileDocument.getArray<IEphemeralFile>('files');

        const updateContext = () => {
            const files = yarray.toArray();
            setContext({ files });
        };

        yarray.observe(updateContext);
        updateContext();
    }, [pathname, context.loaded, context.fileDocument]);
};
