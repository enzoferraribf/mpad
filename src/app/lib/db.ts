import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const pads = sqliteTable('pads', {
    id: text('id').primaryKey(),
    content: text('content'),
    root: text('root'),
    lastUpdate: integer('last_update'),
    lastTransaction: integer('last_transaction'),
});

const schema = { pads };

export function createDatabase() {
    if (!process.env.TURSO_DB) {
        throw new Error('Missing required database environment variable: TURSO_DB');
    }

    const isLocalFile = process.env.TURSO_DB.startsWith('file:');

    const clientConfig: any = {
        url: process.env.TURSO_DB,
    };

    if (!isLocalFile) {
        if (!process.env.TURSO_TOKEN) {
            throw new Error('TURSO_TOKEN is required for remote Turso databases');
        }
        clientConfig.authToken = process.env.TURSO_TOKEN;
    }

    const client = createClient(clientConfig);

    return drizzle(client, { schema });
}
