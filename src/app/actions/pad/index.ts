'use server';

import { mergeUpdatesV2 } from 'yjs';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

import { IPadSnapshot } from '@/app/models/pad';
import { createDatabase, pads } from '@/app/lib/db';

export async function initial(document: string): Promise<IPadSnapshot> {
    const _ = cookies();

    const database = createDatabase();

    const [pad] = await database
        .select({
            content: pads.content,
            lastUpdate: pads.lastUpdate,
        })
        .from(pads)
        .where(eq(pads.id, document))
        .limit(1);

    if (!pad) {
        return { content: null, lastUpdate: null };
    }

    let buffer = null;

    if (pad.content) {
        buffer = bufferize(pad.content);
    }

    return {
        content: buffer,
        lastUpdate: pad.lastUpdate,
    };
}

export async function lastUpdate(document: string): Promise<number | null> {
    const _ = cookies();

    const database = createDatabase();

    const [pad] = await database
        .select({
            lastUpdate: pads.lastUpdate,
        })
        .from(pads)
        .where(eq(pads.id, document))
        .limit(1);

    if (!pad) {
        return null;
    }

    return pad.lastUpdate;
}

export async function write(root: string, document: string, data: Uint8Array<ArrayBufferLike>, transaction: number) {
    const { content: serverContent, lastUpdate: serverLastUpdate } = await initial(document);

    let buffer = data;

    if (serverContent && serverContent.length > 0) {
        buffer = prepareMergedContent(data, serverContent);
    }

    // We accept a maximum of 100kB file
    if (buffer.byteLength > 100000) {
        return null;
    }

    const mergedContent = stringifyBuffer(buffer);

    const updateTimestamp = Date.now();
    const normalizedRoot = '/' + root;

    const database = createDatabase();

    const conflictCondition = buildConflictCondition(serverLastUpdate);

    const result = await database
        .insert(pads)
        .values({
            id: document,
            content: mergedContent,
            root: normalizedRoot,
            lastUpdate: updateTimestamp,
            lastTransaction: transaction,
        })
        .onConflictDoUpdate({
            target: pads.id,
            set: {
                content: mergedContent,
                root: normalizedRoot,
                lastUpdate: updateTimestamp,
                lastTransaction: transaction,
            },
            where: conflictCondition,
        });

    const updateSucceeded = result.rowsAffected > 0;

    if (updateSucceeded) {
        return updateTimestamp;
    }

    return null;
}

export async function expandRoot(root: string): Promise<string[]> {
    const _ = cookies();

    const database = createDatabase();

    const result = await database
        .select({
            id: pads.id,
        })
        .from(pads)
        .where(eq(pads.root, root));

    return result.map(({ id }) => id);
}

function bufferize(data: string): number[] {
    if (!data) {
        return [];
    }

    return data
        .split(',')
        .map(char => parseInt(char, 10))
        .filter(num => !isNaN(num));
}

function stringifyBuffer(mergedBuffer: Uint8Array<ArrayBufferLike>): string {
    return mergedBuffer.join(',');
}

function prepareMergedContent(
    clientData: Uint8Array<ArrayBufferLike>,
    serverContent: number[],
): Uint8Array<ArrayBufferLike> {
    const serverBuffer = new Uint8Array(Array.from(serverContent));
    const clientBuffer = new Uint8Array(Array.from(clientData));

    return mergeUpdatesV2([serverBuffer, clientBuffer]);
}

function buildConflictCondition(serverLastUpdate: number | null) {
    if (serverLastUpdate === null) {
        return undefined;
    }

    return eq(pads.lastUpdate, serverLastUpdate);
}
