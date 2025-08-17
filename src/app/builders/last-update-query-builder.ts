import { eq } from 'drizzle-orm';

import { createDatabase, pads } from '@/app/lib/db';

export class LastUpdateQueryBuilder {
    private document: string | null = null;

    static create() {
        return new LastUpdateQueryBuilder();
    }

    withDocument(document: string) {
        this.document = document;
        return this;
    }

    async execute(): Promise<{ error: string | null; result: number | null }> {
        if (!this.document) {
            return { error: 'Document is required for last update operation', result: null };
        }

        const database = createDatabase();

        const [pad] = await database
            .select({
                lastUpdate: pads.lastUpdate,
            })
            .from(pads)
            .where(eq(pads.id, this.document))
            .limit(1);

        if (!pad) {
            return { error: null, result: null };
        }

        return { error: null, result: pad.lastUpdate };
    }
}
