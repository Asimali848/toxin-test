import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RiskLevel } from "@/lib/analysis";

interface DustQualityChartProps {
  dustAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>;
}

export function DustQualityChart({ dustAnalysis }: DustQualityChartProps) {
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

  const dustChartData = [
    {
      name: "Floor Dust",
      value: dustAnalysis.floorDust?.value || 0,
      level: dustAnalysis.floorDust?.level,
      fill: getRiskColor(dustAnalysis.floorDust?.level || "normal"),
      threshold: "<10 µg/ft²",
      reference: "EPA Clearance Standard",
    },
    {
      name: "Window Sill",
      value: dustAnalysis.windowSill?.value || 0,
      level: dustAnalysis.windowSill?.level,
      fill: getRiskColor(dustAnalysis.windowSill?.level || "normal"),
      threshold: "<100 µg/ft²",
      reference: "EPA Clearance Standard",
    },
    {
      name: "Window Trough",
      value: dustAnalysis.windowTrough?.value || 0,
      level: dustAnalysis.windowTrough?.level,
      fill: getRiskColor(dustAnalysis.windowTrough?.level || "normal"),
      threshold: "<400 µg/ft²",
      reference: "EPA Clearance Standard",
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
        <BarChart data={dustChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
          <YAxis stroke="hsl(var(--muted-foreground))" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))">
            {dustChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || "hsl(var(--primary))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
