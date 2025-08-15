export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
};

export const formatUploadDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
};