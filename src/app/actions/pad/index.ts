'use server';

import { cookies } from 'next/headers';

import { WritePadQueryBuilder } from '@/app/builders/write-pad-query-builder';
import { ReadPadQueryBuilder } from '@/app/builders/read-pad-query-builder';
import { LastUpdateQueryBuilder } from '@/app/builders/last-update-query-builder';
import { ExpandRootQueryBuilder } from '@/app/builders/expand-root-query-builder';

export async function initial(document: string) {
    const _ = cookies();

    return await ReadPadQueryBuilder.create().withDocument(document).execute();
}

export async function lastUpdate(document: string) {
    const _ = cookies();

    return await LastUpdateQueryBuilder.create().withDocument(document).execute();
}

export async function write(root: string, document: string, data: Uint8Array<ArrayBufferLike>, transaction: number) {
    const { error: initialError, result: initialResult } = await initial(document);

    if (initialError || !initialResult) {
        return { error: initialError || 'Failed to get initial document state', result: null };
    }

    return await WritePadQueryBuilder.create()
        .withRoot(root)
        .withDocument(document)
        .withServerData(initialResult.content, initialResult.lastUpdate)
        .withClientData(data)
        .withTransaction(transaction)
        .withMaxFileSize(100000)
        .execute();
}

export async function expandRoot(root: string) {
    const _ = cookies();

    return await ExpandRootQueryBuilder.create().withRoot(root).execute();
}
