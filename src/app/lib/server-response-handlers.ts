import { toast } from 'sonner';

export function handleInitialResponse(response: { error: string | null; result: any }) {
    if (response.error) {
        toast.error('Error when fetching pad', { description: response.error });
        return { serverContent: null, serverLastUpdate: null };
    }

    const result = response.result || { content: null, lastUpdate: null };
    return {
        serverContent: result.content,
        serverLastUpdate: result.lastUpdate,
    };
}

export function handleRelatedResponse(response: { error: string | null; result: string[] | null }) {
    if (response.error) {
        toast.error('Error fetching related pads', { description: response.error });
        return [];
    }
    return response.result || [];
}

export function handleICEResponse(response: { error: string | null; result: any }) {
    if (response.error) {
        toast.error('Error fetching STUN servers', { description: response.error });
        return null;
    }
    return response.result;
}
