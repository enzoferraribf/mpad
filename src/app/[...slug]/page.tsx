import React from 'react';

import dynamic from 'next/dynamic';

import { getPadsWithPrefix, getInitialPageContent } from '@/app/actions';

const Pad = dynamic(() => import('@/app/components/pad'), { ssr: true });

interface IPageProps {
    params: { slug: string[] };
}

function joinSlug(slug: string[]) {
    return '/' + slug.join('/');
}

export default async function Page({ params }: IPageProps) {
    const slug = joinSlug(params.slug);

    const { buffer, lastUpdate } = await getInitialPageContent(slug);

    const relatedPads = await getPadsWithPrefix(params.slug[0]);

    return <Pad pathname={slug} initialChangeSet={buffer} initialLastUpdate={lastUpdate} relatedPads={relatedPads} />;
}
