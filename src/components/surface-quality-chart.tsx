import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RiskLevel } from "@/lib/analysis";

interface SurfaceQualityChartProps {
  surfaceAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>;
}

export function SurfaceQualityChart({ surfaceAnalysis }: SurfaceQualityChartProps) {
  const getRiskColor = (level: RiskLevel): string => {
    switch (level) {
      case "normal":
        return "#22c55e";
      case "warning":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const surfaceChartData = [
    {
      name: "Lead Paint",
      value: surfaceAnalysis.leadPaintXRF?.value || 0,
      level: surfaceAnalysis.leadPaintXRF?.level,
      fill: getRiskColor(surfaceAnalysis.leadPaintXRF?.level || "normal"),
      threshold: "≥0.5 mg/cm²",
      reference: "NYC Local Law 31",
    },
    {
      name: "Mold",
      value: surfaceAnalysis.surfaceMold?.value || 0,
      level: surfaceAnalysis.surfaceMold?.level,
      fill: getRiskColor(surfaceAnalysis.surfaceMold?.level || "normal"),
      threshold: ">500 CFU/cm²",
      reference: "Threshold for concern",
    },
  ];

  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={surfaceChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))">
            {surfaceChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || "hsl(var(--primary))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
