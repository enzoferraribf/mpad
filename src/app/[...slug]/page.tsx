import dynamic from 'next/dynamic';

import { initial, expandRoot } from '@/app/actions/pad';
import { getICEServers } from '@/app/actions/web-rtc';

import { getRandomPhrase } from '@/app/components/loading-phrases';

import { handleInitialResponse, handleRelatedResponse, handleICEResponse } from '@/app/lib/server-response-handlers';

import { IMainApplication } from '@/app/models/main-application';

const ApplicationGrid = dynamic(() => import('@/app/components/application-grid'), { ssr: true });

export default async function MainApplication({ params }: IMainApplication) {
    const resolved = await params;

    const [root] = resolved.slug;

    const document = '/' + resolved.slug.join('/');

    const loadingPhrase = getRandomPhrase();

    const [initialx, relatedx, icex] = await Promise.all([initial(document), expandRoot('/' + root), getICEServers()]);

    const initialr = handleInitialResponse(initialx);
    const related = handleRelatedResponse(relatedx);
    const ice = handleICEResponse(icex);

    return (
        <ApplicationGrid
            pathname={document}
            root={root}
            content={initialr.serverContent}
            updated={initialr.serverLastUpdate}
            related={related}
            ice={ice}
            loadingPhrase={loadingPhrase}
        />
    );
}
