export const handleServerDateTime = (datetime: string | null) => {
    return datetime ? new Date(datetime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }) : '';
};
