import { Doc, encodeStateAsUpdateV2 } from 'yjs';
import { toast } from 'sonner';

import { write } from '@/app/actions/pad';

export class TransactionBuilder {
    private document: Doc | null = null;
    private root: string | null = null;
    private pathname: string | null = null;
    private transactionId: number | null = null;
    private onSuccess: ((timestamp: number) => void) | null = null;
    private onError: ((error: Error) => void) | null = null;

    static create() {
        return new TransactionBuilder();
    }

    withDocument(document: Doc) {
        this.document = document;
        return this;
    }

    withRoot(root: string) {
        this.root = root;
        return this;
    }

    withPathname(pathname: string) {
        this.pathname = pathname;
        return this;
    }

    withTransactionId(transactionId: number) {
        this.transactionId = transactionId;
        return this;
    }

    withOnSuccess(callback: (timestamp: number) => void) {
        this.onSuccess = callback;
        return this;
    }

    withOnError(callback: (error: Error) => void) {
        this.onError = callback;
        return this;
    }

    async execute(): Promise<number | null> {
        if (!this.document) {
            throw new Error('Document is required for transaction');
        }
        if (!this.root) {
            throw new Error('Root is required for transaction');
        }
        if (!this.pathname) {
            throw new Error('Pathname is required for transaction');
        }
        if (this.transactionId === null) {
            throw new Error('Transaction ID is required for transaction');
        }

        try {
            const buffer = this.defaultEncoder(this.document);

            const lastUpdated = await write(this.root, this.pathname, buffer, this.transactionId);

            if (lastUpdated) {
                this.handleSuccess(lastUpdated);
                return lastUpdated;
            }

            return null;
        } catch (error) {
            this.handleError(error as Error);
            return null;
        }
    }

    private defaultEncoder(document: Doc): Uint8Array<ArrayBufferLike> {
        return encodeStateAsUpdateV2(document);
    }

    private handleSuccess(timestamp: number): void {
        if (this.onSuccess) {
            this.onSuccess(timestamp);
        }
    }

    private handleError(error: Error): void {
        if (this.onError) {
            this.onError(error);
        }
    }
}
