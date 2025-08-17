import { mergeUpdatesV2 } from 'yjs';
import { eq } from 'drizzle-orm';

import { createDatabase, pads } from '@/app/lib/db';

export class WritePadQueryBuilder {
    private root: string | null = null;
    private document: string | null = null;
    private clientData: Uint8Array<ArrayBufferLike> | null = null;
    private transaction: number | null = null;
    private maxFileSize: number | null = null;
    private serverContent: number[] | null = null;
    private serverLastUpdate: number | null = null;

    static create() {
        return new WritePadQueryBuilder();
    }

    withRoot(root: string) {
        this.root = root;
        return this;
    }

    withDocument(document: string) {
        this.document = document;
        return this;
    }

    withClientData(clientData: Uint8Array<ArrayBufferLike>) {
        this.clientData = clientData;
        return this;
    }

    withServerData(serverContent: number[] | null, serverLastUpdate: number | null) {
        this.serverContent = serverContent;
        this.serverLastUpdate = serverLastUpdate;
        return this;
    }

    withTransaction(transaction: number) {
        this.transaction = transaction;
        return this;
    }

    withMaxFileSize(maxSize: number) {
        this.maxFileSize = maxSize;
        return this;
    }

    async execute(): Promise<{ error: string | null; result: number | null }> {
        if (!this.root) {
            return { error: 'Root is required for write operation', result: null };
        }

        if (!this.document) {
            return { error: 'Document is required for write operation', result: null };
        }

        if (!this.clientData) {
            return { error: 'Client data is required for write operation', result: null };
        }

        if (this.transaction === null) {
            return { error: 'Transaction is required for write operation', result: null };
        }

        let buffer = this.clientData;

        if (this.serverContent && this.serverContent.length > 0) {
            buffer = this.prepareMergedContent(this.clientData, this.serverContent);
        }

        if (this.maxFileSize && buffer.byteLength > this.maxFileSize) {
            return { error: `File size exceeds maximum limit of ${this.maxFileSize} bytes`, result: null };
        }

        const mergedContent = this.stringifyBuffer(buffer);

        const updateTimestamp = Date.now();

        const normalizedRoot = '/' + this.root;

        const database = createDatabase();

        const conflictCondition = this.buildConflictCondition(this.serverLastUpdate);

        const _ = await database
            .insert(pads)
            .values({
                id: this.document,
                content: mergedContent,
                root: normalizedRoot,
                lastUpdate: updateTimestamp,
                lastTransaction: this.transaction,
            })
            .onConflictDoUpdate({
                target: pads.id,
                set: {
                    content: mergedContent,
                    root: normalizedRoot,
                    lastUpdate: updateTimestamp,
                    lastTransaction: this.transaction,
                },
                where: conflictCondition,
            });

        return { error: null, result: updateTimestamp };
    }

    private stringifyBuffer(mergedBuffer: Uint8Array<ArrayBufferLike>): string {
        return mergedBuffer.join(',');
    }

    private prepareMergedContent(
        clientData: Uint8Array<ArrayBufferLike>,
        serverContent: number[],
    ): Uint8Array<ArrayBufferLike> {
        const serverBuffer = new Uint8Array(Array.from(serverContent));
        const clientBuffer = new Uint8Array(Array.from(clientData));

        return mergeUpdatesV2([serverBuffer, clientBuffer]);
    }

    private buildConflictCondition(serverLastUpdate: number | null) {
        if (serverLastUpdate === null) {
            return undefined;
        }

        return eq(pads.lastUpdate, serverLastUpdate);
    }
}
