import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RiskLevel } from "@/lib/analysis";

interface WaterQualityChartProps {
  waterAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>;
}

export function WaterQualityChart({ waterAnalysis }: WaterQualityChartProps) {
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

  const waterChartData = [
    {
      name: "Lead",
      value: waterAnalysis.lead?.value || 0,
      level: waterAnalysis.lead?.level,
      fill: getRiskColor(waterAnalysis.lead?.level || "normal"),
      mcl: "15 ppb",
      reference: "EPA MCL",
    },
    {
      name: "Arsenic",
      value: waterAnalysis.arsenic?.value || 0,
      level: waterAnalysis.arsenic?.level,
      fill: getRiskColor(waterAnalysis.arsenic?.level || "normal"),
      mcl: "10 ppb",
      reference: "EPA MCL",
    },
    {
      name: "PFAS",
      value: waterAnalysis.pfas?.value || 0,
      level: waterAnalysis.pfas?.level,
      fill: getRiskColor(waterAnalysis.pfas?.level || "normal"),
      mcl: "4 ppt",
      reference: "EPA MCL",
    },
  ];

  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={waterChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary))" />
          <XAxis dataKey="name" stroke="hsl(var(--primary))" />
          <YAxis stroke="hsl(var(--primary))" />
          <ChartTooltip content={<ChartTooltipContent />} />
          {/* Default bar fill uses the primary color; individual cells fall back to their risk fill if present */}
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))">
            {waterChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill || "hsl(var(--primary))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
