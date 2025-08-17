import { eq } from 'drizzle-orm';

import { createDatabase, pads } from '@/app/lib/db';

export class ExpandRootQueryBuilder {
    private root: string | null = null;

    static create() {
        return new ExpandRootQueryBuilder();
    }

    withRoot(root: string) {
        this.root = root;
        return this;
    }

    async execute(): Promise<{ error: string | null; result: string[] | null }> {
        if (!this.root) {
            return { error: 'Root is required for expand root operation', result: null };
        }

        const database = createDatabase();

        const result = await database
            .select({
                id: pads.id,
            })
            .from(pads)
            .where(eq(pads.root, this.root));

        return { error: null, result: result.map(({ id }) => id) };
    }
}
