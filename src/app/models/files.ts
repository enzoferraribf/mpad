export type IEphemeralFile = {
    id: string;
    name: string;
    size: number;
    type: string;
    data: string;
    uploadedAt: number;
};

export type IFileList = {
    files: IEphemeralFile[];
};
