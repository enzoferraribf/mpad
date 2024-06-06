export const handleServerDateTime = (timestamp: number | null) => {
    return timestamp ? new Date(timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }) : '';
};
