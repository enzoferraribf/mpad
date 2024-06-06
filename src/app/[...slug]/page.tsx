import React from 'react';

import dynamic from 'next/dynamic';

import { initial, searchRoot } from '@/app/actions/pad';

import ApplicationContextProvider from '@/app/context/context';
import { IMainApplication } from '@/app/models/main-application';

const ApplicationGrid = dynamic(() => import('@/app/components/application-grid'), { ssr: true });

function joinSlug(slug: string[]) {
    return '/' + slug.join('/');
}

export default async function MainApplication({ params }: IMainApplication) {
    const [root] = params.slug;

    const document = joinSlug(params.slug);

    const [initialContent, related] = await Promise.all([initial(document), searchRoot('/' + root)]);

    return (
        <ApplicationContextProvider>
            <ApplicationGrid pathname={document} content={initialContent.content} updated={initialContent.lastUpdate} related={related} />
        </ApplicationContextProvider>
    );
}
