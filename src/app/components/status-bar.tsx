interface IStatusBarProps {
    pathname: string;
    hasModification: boolean;
    lastUpdate?: string;
    spectators?: number;
}

export default function StatusBar({ pathname, hasModification, lastUpdate, spectators }: IStatusBarProps) {
    return (
        <div className="mobile:text-sm flex h-full w-full flex-row justify-between bg-[#1e1e1e] p-4 align-middle">
            <span className="mr-1">
                {hasModification ? '✏️' : '✅'} {pathname}
            </span>

            {lastUpdate && <span>{lastUpdate} 📅</span>}

            {spectators && <span>👀 {spectators}</span>}
        </div>
    );
}
