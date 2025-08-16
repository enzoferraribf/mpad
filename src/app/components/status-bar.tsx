import { IStatusBar } from '@/app/models/status-bar';

export function StatusBar({ pathname, hasModification, lastUpdate, spectators }: IStatusBar) {
    return (
        <div className="fill-container flex-between surface-secondary container-padding align-middle">
            <span className="status-text item-spacing">
                {hasModification ? '✏️' : '✅'} {pathname}
            </span>

            {lastUpdate && <span className="status-text">{lastUpdate} 📅</span>}

            {spectators && <span className="status-text">👀 {spectators}</span>}
        </div>
    );
}
