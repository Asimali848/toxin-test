import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RiskLevel } from "@/lib/analysis";

interface AirQualityChartProps {
  airAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>;
}

export function AirQualityChart({ airAnalysis }: AirQualityChartProps) {
  const getRiskColor = (level: RiskLevel): string => {
    switch (level) {
      case "normal":
        return "#22c55e"; // Green
      case "warning":
        return "#f59e0b"; // Orange
      case "high":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray
    }
  };

  const airChartData = [
    {
      name: "CO₂",
      value: airAnalysis.carbonDioxide?.value || 0,
      level: airAnalysis.carbonDioxide?.level,
      fill: getRiskColor(airAnalysis.carbonDioxide?.level || "normal"),
      threshold: "≤1000 ppm",
      reference: "EPA indoor guideline",
    },
    {
      name: "CO",
      value: airAnalysis.carbonMonoxide?.value || 0,
      level: airAnalysis.carbonMonoxide?.level,
      fill: getRiskColor(airAnalysis.carbonMonoxide?.level || "normal"),
      threshold: "≤9 ppm",
      reference: "EPA indoor CO guideline",
    },
    {
      name: "PM 2.5",
      value: airAnalysis.pm25?.value || 0,
      level: airAnalysis.pm25?.level,
      fill: getRiskColor(airAnalysis.pm25?.level || "normal"),
      threshold: "≤12 µg/m³",
      reference: "EPA daily standard",
    },
    {
      name: "RH",
      value: airAnalysis.relativeHumidity?.value || 0,
      level: airAnalysis.relativeHumidity?.level,
      fill: getRiskColor(airAnalysis.relativeHumidity?.level || "normal"),
      threshold: "40-55%",
      reference: "Optimal range",
    },
  ];

  return (
    <ChartContainer
      config={{
        value: {
          label: "Value",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={airChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#8884d8">
            {airChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} strokeWidth={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
