import { createClient } from '@libsql/client';

const database = createClient({ url: process.env.TURSO_DB! });

await database.executeMultiple(`
    CREATE TABLE IF NOT EXISTS pads (
        id TEXT PRIMARY KEY,
        root TEXT,
        content TEXT,
        last_update TEXT
    );

    CREATE UNIQUE INDEX IF NOT EXISTS root_index ON pads(root);
`)