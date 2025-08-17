import { eq } from 'drizzle-orm';

import { IPadSnapshot } from '@/app/models/pad';

import { createDatabase, pads } from '@/app/lib/db';

export class ReadPadQueryBuilder {
    private document: string | null = null;

    static create() {
        return new ReadPadQueryBuilder();
    }

    withDocument(document: string) {
        this.document = document;
        return this;
    }

    async execute(): Promise<{ error: string | null; result: IPadSnapshot | null }> {
        if (!this.document) {
            return { error: 'Document is required for initial operation', result: null };
        }

        const database = createDatabase();

        const [pad] = await database
            .select({
                content: pads.content,
                lastUpdate: pads.lastUpdate,
            })
            .from(pads)
            .where(eq(pads.id, this.document))
            .limit(1);

        if (!pad) {
            return { error: null, result: { content: null, lastUpdate: null } };
        }

        let buffer = null;

        if (pad.content) {
            buffer = this.bufferize(pad.content);
        }

        return {
            error: null,
            result: {
                content: buffer,
                lastUpdate: pad.lastUpdate,
            },
        };
    }

    private bufferize(data: string): number[] {
        if (!data) {
            return [];
        }

        return data
            .split(',')
            .map(char => parseInt(char, 10))
            .filter(num => !isNaN(num));
    }
}
