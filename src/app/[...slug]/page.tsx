import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import { initial, expandRoot } from '@/app/actions/pad';
import { getICEServers } from '@/app/actions/web-rtc';

import { getRandomPhrase } from '@/app/components/loading-phrases';

import { IMainApplication } from '@/app/models/main-application';

const ApplicationGrid = dynamic(() => import('@/app/components/application-grid'), { ssr: true });

export default async function MainApplication({ params }: IMainApplication) {
    const resolved = await params;

    const [root] = resolved.slug;

    const document = '/' + resolved.slug.join('/');

    const loadingPhrase = getRandomPhrase();

    const [initialx, relatedx, ice] = await Promise.all([initial(document), expandRoot('/' + root), getICEServers()]);

    if (initialx.error) {
        toast.error('Error when fetching pad', { description: initialx.error });
    }

    let serverContent = null;
    let serverLastUpdate = null;

    if (initialx.result) {
        const { content, lastUpdate } = initialx.result;
        serverContent = content;
        serverLastUpdate = lastUpdate;
    }

    if (relatedx.error) {
        toast.error('Error fetching related pads', { description: relatedx.error });
    }

    let related: string[] = [];

    if (relatedx.result) {
        related = relatedx.result;
    }

    return (
        <ApplicationGrid
            pathname={document}
            root={root}
            content={serverContent}
            updated={serverLastUpdate}
            related={related}
            ice={ice}
            loadingPhrase={loadingPhrase}
        />
    );
}
