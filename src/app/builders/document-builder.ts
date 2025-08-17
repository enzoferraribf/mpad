import { Doc, applyUpdateV2 } from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export class DocumentBuilder {
    private ydocument: Doc | null = null;
    private provider: WebrtcProvider | null = null;
    private pathname: string = '';
    private signaling: string = '';
    private peerOptions: any = undefined;
    private serverContent: Array<number> | null = null;
    private awarenessCallback: ((connections: number) => void) | null = null;
    private bindCallback: ((doc: Doc, provider: WebrtcProvider) => void) | null = null;
    private bufferTransform: ((content: Array<number>) => Uint8Array) | null = null;

    static create() {
        return new DocumentBuilder();
    }

    withPathname(pathname: string) {
        this.pathname = pathname;
        return this;
    }

    withSignaling(signaling: string) {
        this.signaling = signaling;
        return this;
    }

    withPeerOptions(peerOptions: any) {
        this.peerOptions = peerOptions;
        return this;
    }

    withServerContent(serverContent: Array<number> | null) {
        this.serverContent = serverContent;
        return this;
    }

    withOnAwarenessChange(callback: (connections: number) => void) {
        this.awarenessCallback = callback;
        return this;
    }

    withBind(callback: (doc: Doc, provider: WebrtcProvider) => void) {
        this.bindCallback = callback;
        return this;
    }

    withBufferTransform(transform: (content: Array<number>) => Uint8Array) {
        this.bufferTransform = transform;
        return this;
    }

    build() {
        this.ydocument = new Doc();
        this.loadServerContent();

        this.provider = this.createWebRTCProvider(this.pathname);

        if (this.awarenessCallback) {
            this.provider.awareness.on('change', () =>
                this.awarenessCallback!(this.provider!.awareness.states.size || 1),
            );
        }

        if (this.bindCallback) {
            this.bindCallback(this.ydocument, this.provider);
        }

        return this;
    }

    getDocument() {
        return this.ydocument;
    }

    getProvider() {
        return this.provider;
    }

    destroy() {
        this.ydocument?.destroy();
    }

    private loadServerContent() {
        if (!this.serverContent || this.serverContent.length === 0 || !this.ydocument) {
            return;
        }

        const buffer = this.bufferTransform
            ? this.bufferTransform(this.serverContent)
            : new Uint8Array(this.serverContent);

        applyUpdateV2(this.ydocument, buffer);
    }

    private createWebRTCProvider(pathname: string) {
        if (!this.ydocument) {
            throw new Error('Y.js document must exist before creating provider');
        }

        return new WebrtcProvider(pathname, this.ydocument, {
            signaling: [this.signaling],
            peerOpts: this.peerOptions,
        });
    }
}
