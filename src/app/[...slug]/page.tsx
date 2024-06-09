import React from 'react';

import dynamic from 'next/dynamic';

import { initial, expandRoot } from '@/app/actions/pad';

import ApplicationContextProvider from '@/app/context/context';

import { IMainApplication } from '@/app/models/main-application';

const ApplicationGrid = dynamic(() => import('@/app/components/application-grid'), { ssr: true });

export default async function MainApplication({ params }: IMainApplication) {
    const [root] = params.slug;

    const document = '/' + params.slug.join('/');

    const [initialContent, related] = await Promise.all([initial(document), expandRoot('/' + root)]);

    return (
        <ApplicationContextProvider>
            <ApplicationGrid pathname={document} root={root} content={initialContent.content} updated={initialContent.lastUpdate} related={related} />
        </ApplicationContextProvider>
    );
}
