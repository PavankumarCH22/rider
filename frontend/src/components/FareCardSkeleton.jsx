export default function FareCardSkeleton({ delay = 0 }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-panelLine bg-panel px-5 py-4 animate-shimmer"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-2.5 w-2.5 rounded-full bg-panelLine" />
      <div className="flex-1 grid gap-2">
        <div className="h-3.5 w-24 rounded bg-panelLine" />
        <div className="h-2.5 w-32 rounded bg-panelLine" />
      </div>
      <div className="h-5 w-14 rounded bg-panelLine" />
    </div>
  );
}
