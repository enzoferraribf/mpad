'use server';

import { ICEServersQueryBuilder } from '@/app/builders/ice-servers-query-builder';

export async function getICEServers() {
    const key = process.env.OPEN_RELAY_API_KEY!;

    return await ICEServersQueryBuilder.create().withApiKey(key).withTimeout(2000).execute();
}
