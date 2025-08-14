export type Pad = {
    id: string | null;
    root: string | null;
    content: Array<number> | null;
    lastUpdate: number | null;
};

export type PadSnapshot = Pick<Pad, 'content' | 'lastUpdate'>;
