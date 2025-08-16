export function debounce(milliseconds: number, action: () => void) {
    const timeout = setTimeout(action, milliseconds);
    return () => clearTimeout(timeout);
}