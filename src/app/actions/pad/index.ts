'use server';

import { CosmosClient } from '@azure/cosmos';

import { Pad } from '@/app/models/Pad';

const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING!);

const database = client.database('mpad');

const container = database.container('pads');

export async function content(document: string): Promise<Array<number> | null> {
    const sql = 'SELECT c.content FROM c WHERE c.document = @document';

    const query = {
        query: sql,
        parameters: [
            {
                name: '@document',
                value: document,
            },
        ],
    };

    type ContentContainer = Pick<Pad, 'content'>;

    const feed = await container.items.query<ContentContainer>(query).fetchAll();

    if (!feed.resources || feed.resources.length === 0) {
        return null;
    }

    const [{ content }] = feed.resources;

    return content;
}

export async function lastUpdated(document: string): Promise<number | null> {
    const sql = 'SELECT c._ts FROM c WHERE c.document = @document';

    const query = {
        query: sql,
        parameters: [
            {
                name: '@document',
                value: document,
            },
        ],
    };

    type LastUpdatedContainer = Pick<Pad, '_ts'>;

    const feed = await container.items.query<LastUpdatedContainer>(query).fetchAll();

    if (!feed.resources || feed.resources.length === 0) {
        return null;
    }

    const [{ _ts }] = feed.resources;

    return _ts * 1_000;
}

export async function searchRoot(root: string): Promise<string[]> {
    const sql = 'SELECT c.document FROM c WHERE c.root = @root';

    const query = {
        query: sql,
        parameters: [
            {
                name: '@root',
                value: root,
            },
        ],
    };

    type DocumentContainer = Pick<Pad, 'document'>;

    const feed = await container.items.query<DocumentContainer>(query).fetchAll();

    if (!feed.resources || feed.resources.length === 0) {
        return [];
    }

    return feed.resources.map(container => container.document);
}
