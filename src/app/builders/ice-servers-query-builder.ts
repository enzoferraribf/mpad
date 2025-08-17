export class ICEServersQueryBuilder {
    private apiKey: string | null = null;
    private timeout: number = 2000;

    static create() {
        return new ICEServersQueryBuilder();
    }

    withApiKey(apiKey: string) {
        this.apiKey = apiKey;
        return this;
    }

    withTimeout(timeout: number) {
        this.timeout = timeout;
        return this;
    }

    async execute(): Promise<{
        error: string | null;
        result: { urls: string; username?: string; credential?: string }[] | null;
    }> {
        if (!this.apiKey) {
            return { error: 'API key is required for ICE servers operation', result: null };
        }

        let configuration: { urls: string; username?: string; credential?: string }[] = [];

        try {
            const response = await fetch(
                `https://missopad.metered.live/api/v1/turn/credentials?apiKey=${this.apiKey}`,
                {
                    signal: AbortSignal.timeout(this.timeout),
                },
            );

            if (response.ok) {
                configuration = await response.json();
            }
        } catch (error) {
            console.log('failed fetching stun servers');
        }

        const result = [
            ...configuration,
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:freeturn.net:5349' },
            { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' },
        ];

        return { error: null, result };
    }
}
