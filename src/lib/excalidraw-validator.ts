export function isValidExcalidrawUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname === 'excalidraw.com' && parsedUrl.hash.startsWith('#json=');
    } catch {
        return false;
    }
}
