import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface SummaryChartProps {
  summaryData: { category: string; score: number; fill: string }[];
}

export function SummaryChart({ summaryData }: SummaryChartProps) {
  return (
    <ChartContainer
      config={{
        score: {
          label: "Health Score",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={summaryData.map((item) => ({ name: item.category, value: item.score, fill: item.fill }))}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={120}
            stroke="hsl(var(--border))"
            label={({ name, value }) => `${name}: ${Math.round(value)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
