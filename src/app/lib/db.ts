import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import * as schema from './schema';

export function createDatabase() {
    const client = createClient({
        url: process.env.TURSO_DB!,
        authToken: process.env.TURSO_TOKEN!,
    });

    return drizzle(client, { schema });
}
