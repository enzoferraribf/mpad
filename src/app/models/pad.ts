export type IPad = {
    id: string | null;
    root: string | null;
    content: Array<number> | null;
    lastUpdate: number | null;
};

export type IPadSnapshot = Pick<IPad, 'content' | 'lastUpdate'>;
