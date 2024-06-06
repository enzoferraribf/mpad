export function onCtrlKeyPressed(key: string, action: () => void) {
    const callback = (event: globalThis.KeyboardEvent) => {
        if (!event.ctrlKey || event.key != key) return;

        event.preventDefault;

        action();
    };

    window.addEventListener('keydown', callback);

    return () => {
        window.removeEventListener('keydown', callback);
    };
}

export function onInterval(milliseconds: number, action: () => void) {
    const interval = setInterval(action, milliseconds);
    return () => clearInterval(interval);
}

export function onWindowResize(action: () => void) {
    window.addEventListener('resize', action);

    return () => {
        window.removeEventListener('resize', action);
    };
}
