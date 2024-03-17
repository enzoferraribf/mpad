import React from 'react';

import dynamic from 'next/dynamic';

import { initial, searchRoot } from '@/app/actions/pad';

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

    console.time('init');
    const [initialContent, related] = await Promise.all([initial(document), searchRoot('/' + root)]);
    console.timeEnd('init');

    return <Pad pathname={document} initialContent={initialContent.content} initialLastUpdate={initialContent.lastUpdate} related={related} />;
}
