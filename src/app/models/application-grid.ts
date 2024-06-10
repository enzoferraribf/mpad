export type IApplicationGrid = {
    pathname: string;
    root: string;
    content: Array<number> | null;
    updated: number | null;
    related: string[];
    ice: any;
};
