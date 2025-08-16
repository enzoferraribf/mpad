import React from 'react';

import dynamic from 'next/dynamic';

import { initial, expandRoot } from '@/app/actions/pad';
import { getICEServers } from '@/app/actions/web-rtc';

import { getRandomPhrase } from '@/app/components/loading-phrases';

import ApplicationContextProvider from '@/app/context/context';

import { IMainApplication } from '@/app/models/main-application';

const ApplicationGrid = dynamic(() => import('@/app/components/application-grid'), { ssr: true });

export default async function MainApplication({ params }: IMainApplication) {
    const resolved = await params;

    const [root] = resolved.slug;

    const document = '/' + resolved.slug.join('/');

    const loadingPhrase = getRandomPhrase();

    const [initialContent, related, ice] = await Promise.all([initial(document), expandRoot('/' + root), getICEServers()]);

    return (
        <ApplicationContextProvider>
            <ApplicationGrid pathname={document} root={root} content={initialContent.content} updated={initialContent.lastUpdate} related={related} ice={ice} loadingPhrase={loadingPhrase} />
        </ApplicationContextProvider>
    );
}
