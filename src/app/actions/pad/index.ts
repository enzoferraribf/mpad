'use server';

import { mergeUpdatesV2 } from 'yjs';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

import { IPadSnapshot } from '@/app/models/pad';
import { createDatabase, pads } from '@/app/lib/db';

function bufferize(data: string): number[] {
    if (!data) {
        return [];
    }

    return data
        .split(',')
        .map(char => parseInt(char, 10))
        .filter(num => !isNaN(num));
}

export async function initial(document: string): Promise<IPadSnapshot> {
    const preventCaching = cookies();

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
    const preventCaching = cookies();

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

export async function write(root: string, document: string, data: string, transaction: number) {
    const serverSnapshot = await initial(document);

    const mergedContent = prepareMergedContent(data, serverSnapshot.content);

    const updateTimestamp = Date.now();
    const normalizedRoot = '/' + root;

    const database = createDatabase();

    const conflictCondition = buildConflictCondition(serverSnapshot.lastUpdate);

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
    const preventCaching = cookies();

    const database = createDatabase();

    const result = await database
        .select({
            id: pads.id,
        })
        .from(pads)
        .where(eq(pads.root, root));

    return result.map(({ id }) => id);
}

function prepareMergedContent(clientData: string, serverContent: number[] | null): string {
    if (!serverContent || serverContent.length === 0) {
        return clientData;
    }

    const serverBuffer = new Uint8Array(Array.from(serverContent));
    const clientBuffer = new Uint8Array(Array.from(bufferize(clientData)));
    const mergedBuffer = mergeUpdatesV2([serverBuffer, clientBuffer]);

    return mergedBuffer.join(',');
}

function buildConflictCondition(serverLastUpdate: number | null) {
    if (serverLastUpdate === null) {
        return undefined;
    }

    return eq(pads.lastUpdate, serverLastUpdate);
}
