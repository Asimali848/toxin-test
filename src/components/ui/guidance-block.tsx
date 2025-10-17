import { getGuidance } from "@/lib/guidance";

export default function GuidanceBlock({ metricKey, value }: { metricKey: string; value?: string | number }) {
  const g = getGuidance(metricKey, value);
  if (!g.avgForNY && !g.causes && !g.actions) return null;
  return (
    <div className="mt-2 rounded-md border border-border bg-muted/5 p-3 text-sm">
      {g.avgForNY && (
        <div className="mb-1">
          <strong>Avg for a NY home:</strong> <span className="text-muted-foreground">{g.avgForNY}</span>
        </div>
      )}
      {g.causes && (
        <div className="mb-1">
          <strong>What might cause this result:</strong> <span className="text-muted-foreground">{g.causes}</span>
        </div>
      )}
      {g.actions && (
        <div>
          <strong>Potential action to take:</strong> <span className="text-muted-foreground">{g.actions}</span>
        </div>
      )}
    </div>
  );
}
