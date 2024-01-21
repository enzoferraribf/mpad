'use server';

import { kv } from '@vercel/kv';

import { createClient } from '@libsql/client';

import { diffUpdateV2, mergeUpdatesV2 } from 'yjs';

const client = createClient({
    url: process.env.TURSO_DB!,
    authToken: process.env.TURSO_TOKEN,
});

export async function handleServerSidePersistence(pad: string, buffer: number[]) {
    const transaction = await client.transaction('write');

    const set = await transaction.execute({
        sql: 'SELECT change FROM pad_history WHERE id = ? ORDER BY created_at DESC LIMIT 1',
        args: [pad],
    });

    let diff: Uint8Array = new Uint8Array(buffer);

    if (set.rows && set.rows[0]) {
        const remote = set.rows[0]['change'] as string;

        const remoteBuffer = stringToBuffer(remote);

        diff = diffUpdateV2(diff, remoteBuffer);
    }

    const commaSeparatedArray = diff.join(',');

    const resultSet = await transaction.execute({
        sql: 'INSERT INTO pad_history (id, change) VALUES (?, ?) RETURNING created_at',
        args: [pad, commaSeparatedArray],
    });

    const lastUpdate = resultSet.rows[0]['created_at'] as number;

    const utcLastUpdate = lastUpdate ? lastUpdate + 'Z' : '';

    await kv.set(pad, { buffer, utcLastUpdate }, { ex: 86400 * 7 });

    await transaction.commit();

    return {
        lastUpdate: utcLastUpdate,
    };
}

export async function getInitialPageContent(pad: string) {
    const cached = await kv.get<{ buffer: number[]; utcLastUpdate: string }>(pad);

    if (cached) return { buffer: cached.buffer, lastUpdate: cached.utcLastUpdate };

    const set = await client.execute({
        sql: 'SELECT change, created_at FROM pad_history WHERE id = ? ORDER BY created_at ASC',
        args: [pad],
    });

    if (!set.rows)
        return {
            buffer: null,
            lastUpdate: null,
        };

    const changeSet = new Array<Uint8Array>();

    let lastUpdate: number | null = null;

    for (const row of set.rows) {
        if (!row) continue;

        const change = row['change'] as string;

        lastUpdate = row['created_at'] as number;

        const buffer = stringToBuffer(change);

        changeSet.push(buffer);
    }

    const buffer = Array.from(mergeUpdatesV2(changeSet));

    const utcLastUpdate = lastUpdate ? lastUpdate + 'Z' : '';

    await kv.set(pad, { buffer, utcLastUpdate }, { ex: 86400 * 7 });

    return {
        buffer,
        lastUpdate: utcLastUpdate,
    };
}

function stringToBuffer(change: string) {
    const array: number[] = [];

    for (const char of change.split(',')) {
        array.push(Number.parseInt(char));
    }

    const buffer = new Uint8Array(array);

    return buffer;
}
