'use server';

import { mergeUpdatesV2 } from 'yjs';
import { createClient } from '@libsql/client';
import { cookies } from 'next/headers';

import { Pad } from '@/app/models/pad';

const turso = createClient({ url: process.env.TURSO_DB!, authToken: process.env.TURSO_TOKEN! });

type EssentialContainer = Pick<Pad, 'content' | 'lastUpdate'>;

export async function initial(document: string): Promise<EssentialContainer> {
    const { rows } = await turso.execute({ sql: 'SELECT content, last_update FROM pads WHERE id = ? LIMIT 1', args: [document] });

    if (!rows || rows.length === 0) return { content: null, lastUpdate: null };

    const [pad] = rows;

    const content = pad['content'] as string;
    const lastUpdate = pad['last_update'] as number;

    return { content: stringToBuffer(content), lastUpdate: lastUpdate };
}

export async function lastUpdate(document: string): Promise<number | null> {
    const _ = cookies();

    const { rows } = await turso.execute({ sql: 'SELECT last_update FROM pads WHERE id = ? LIMIT 1', args: [document] });

    if (!rows || rows.length === 0) return null;

    const [pad] = rows;

    const lastUpdate = pad['last_update'] as number;

    return lastUpdate;
}

export async function write(root: string, document: string, data: string, transaction: number) {
    const { content: serverContent, lastUpdate: serverLastUpdate } = await initial(document);

    let toStore = data;

    if (serverContent && serverContent.length > 0) {
        const buffer1 = new Uint8Array(Array.from(serverContent));

        const buffer2 = new Uint8Array(Array.from(stringToBuffer(data)));

        const merged = mergeUpdatesV2([buffer1, buffer2]);

        toStore = merged.join(',');
    }

    const update = Date.now();

    const statement = `
        INSERT INTO pads (id, content, root, last_update, last_transaction) VALUES ($id, $content, $root, $update, $transaction)
        ON CONFLICT DO UPDATE SET content = $content, last_update = $update, last_transaction = $transaction
        WHERE NOT EXISTS (
            SELECT 1 FROM pads WHERE id = $id AND (last_update > $serverLastUpdate OR last_transaction > $transaction)
        )
    `;

    const { rowsAffected } = await turso.execute({
        sql: statement,
        args: {
            id: document,
            content: toStore,
            root,
            update,
            serverLastUpdate,
            transaction,
        },
    });

    return rowsAffected > 0 ? update : null;
}

export async function expandRoot(root: string): Promise<string[]> {
    const _ = cookies();
    
    const { rows } = await turso.execute({ sql: 'SELECT id FROM pads WHERE root = ?', args: [root] });

    if (!rows || rows.length === 0) return [];

    return rows.map(row => row['id'] as string);
}

const stringToBuffer = (change: string) => {
    const array: number[] = [];

    for (const char of change.split(',')) {
        array.push(Number.parseInt(char));
    }

    const buffer = new Uint8Array(array);

    return Array.from(buffer);
};
