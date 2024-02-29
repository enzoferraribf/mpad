import React from 'react';

import dynamic from 'next/dynamic';

import { content, lastUpdated, searchRoot } from '@/app/actions/pad';

const Pad = dynamic(() => import('@/app/components/pad'), { ssr: true });

interface IPageProps {
    params: { slug: string[] };
}

function joinSlug(slug: string[]) {
    return '/' + slug.join('/');
}

export default async function Page({ params }: IPageProps) {
    const [root] = params.slug;

    const document = joinSlug(params.slug);

    const [buffer, lastUpdate, related] = await Promise.all([content(document), lastUpdated(document), searchRoot('/' + root)]);

    return <Pad pathname={document} initialContent={buffer} initialLastUpdate={lastUpdate} related={related} />;
}
