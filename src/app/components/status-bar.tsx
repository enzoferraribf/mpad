interface IStatusBarProps {
  pathname: string;
  hasModification: boolean;
  lastUpdate?: string;
  spectators?: number;
}

export default function StatusBar({
  pathname,
  hasModification,
  lastUpdate,
  spectators,
}: IStatusBarProps) {
  return (
    <div className="flex flex-row justify-between align-middle p-3 mt-2 bg-[#1e1e1e]">
      <span className="mr-1">
        {hasModification ? "✏️" : "✅"} {pathname}
      </span>

      {lastUpdate && <span>{lastUpdate} 📅</span>}

      {spectators && <span>👀 {spectators}</span>}
    </div>
  );
}
