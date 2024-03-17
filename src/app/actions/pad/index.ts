'use server';

import { createClient } from '@libsql/client';

import { Pad } from '@/app/models/Pad';

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
    const { rows } = await turso.execute({ sql: 'SELECT last_update FROM pads WHERE id = ? LIMIT 1', args: [document] });

    if (!rows || rows.length === 0) return null;

    const [pad] = rows;

    const lastUpdate = pad['last_update'] as number;

    return lastUpdate;
}

export async function searchRoot(root: string): Promise<string[]> {
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
