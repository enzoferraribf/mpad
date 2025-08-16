export const handleServerDateTime = (timestamp: number | null) => {
    return timestamp ? new Date(timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : '';
};

export const formatUploadDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
};
