interface IStatusBarProps {
    pathname: string;
    hasModification: boolean;
    lastUpdate?: string;
    spectators?: number;
}

export default function StatusBar({ pathname, hasModification, lastUpdate, spectators }: IStatusBarProps) {
    return (
        <div className="flex h-full w-full flex-row justify-between bg-accent p-4 align-middle mobile:text-sm">
            <span className="mr-1">
                {hasModification ? '✏️' : '✅'} {pathname}
            </span>

            {lastUpdate && <span>{lastUpdate} 📅</span>}

            {spectators && <span>👀 {spectators}</span>}
        </div>
    );
}
