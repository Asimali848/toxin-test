"use client";

import { Download, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  analyzeAirQuality,
  analyzeDustQuality,
  analyzeSurfaceQuality,
  analyzeWaterQuality,
  getRiskBadgeClass,
  type RiskLevel,
} from "@/lib/analysis";
import { generatePDF } from "@/lib/pdf-export";
import { useTestStore } from "@/lib/store";
import { toast } from "sonner";

export function ResultsDashboard() {
  const { data, resetData } = useTestStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const airChartRef = useRef<HTMLDivElement>(null);
  const waterChartRef = useRef<HTMLDivElement>(null);
  const surfaceChartRef = useRef<HTMLDivElement>(null);
  const summaryChartRef = useRef<HTMLDivElement>(null);
  //@ts-ignore
  const airAnalysis = analyzeAirQuality(data.air);
  //@ts-ignore
  const waterAnalysis = analyzeWaterQuality(data.water);
  //@ts-ignore
  const surfaceAnalysis = analyzeSurfaceQuality(data.surface);
  //@ts-ignore
  const dustAnalysis = analyzeDustQuality(data.dust);

  const airChartData = [
    {
      name: "CO₂",
      value: airAnalysis.carbonDioxide?.value || 0,
      level: airAnalysis.carbonDioxide?.level,
    },
    {
      name: "CO",
      value: airAnalysis.carbonMonoxide?.value || 0,
      level: airAnalysis.carbonMonoxide?.level,
    },
    {
      name: "PM 2.5",
      value: airAnalysis.pm25?.value || 0,
      level: airAnalysis.pm25?.level,
    },
  ];

  const waterChartData = [
    {
      name: "Lead",
      value: waterAnalysis.leadInWater?.value || 0,
      level: waterAnalysis.leadInWater?.level,
    },
    {
      name: "Arsenic",
      value: waterAnalysis.arsenic?.value || 0,
      level: waterAnalysis.arsenic?.level,
    },
    {
      name: "PFAS",
      value: waterAnalysis.pfas?.value || 0,
      level: waterAnalysis.pfas?.level,
    },
  ];

  const surfaceChartData = [
    {
      name: "Lead Room 1",
      value: surfaceAnalysis.leadPaintRoom1?.value || 0,
      level: surfaceAnalysis.leadPaintRoom1?.level,
    },
    {
      name: "Lead Room 2",
      value: surfaceAnalysis.leadPaintRoom2?.value || 0,
      level: surfaceAnalysis.leadPaintRoom2?.level,
    },
    {
      name: "Mold",
      value: surfaceAnalysis.mold?.value || 0,
      level: surfaceAnalysis.mold?.level,
    },
  ];

  const summaryData = [
    {
      category: "Air Quality",
      score: calculateCategoryScore(airAnalysis),
    },
    {
      category: "Water Quality",
      score: calculateCategoryScore(waterAnalysis),
    },
    {
      category: "Surface Quality",
      score: calculateCategoryScore(surfaceAnalysis),
    },
    {
      category: "Dust Quality",
      score: calculateCategoryScore(dustAnalysis),
    },
  ];

  const handleDownload = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      await generatePDF(
        data,
        airAnalysis,
        waterAnalysis,
        surfaceAnalysis,
        dustAnalysis,
        //@ts-ignore
        {
          airChart: airChartRef.current,
          waterChart: waterChartRef.current,
          surfaceChart: surfaceChartRef.current,
          summaryChart: summaryChartRef.current,
        }
      );
    } catch (_error) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [data, airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis]);

  const handleReset = () => {
    resetData();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl text-foreground">
              Environmental Test Results
            </h1>
            <p className="text-muted-foreground">
              Comprehensive analysis of all test categories
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              New Test
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </header>

        <div className="mb-6 grid gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Air Quality Analysis
              </CardTitle>
              <CardDescription>
                Key air contaminants and their risk levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={airChartRef}>
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
                    <BarChart data={airChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--primary))"
                      />
                      <XAxis dataKey="name" stroke="hsl(var(--primary))" />
                      <YAxis stroke="hsl(var(--primary))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--chart-2))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(airAnalysis).map(([key, result]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <span className="font-medium text-foreground text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {result.message}
                      </span>
                      <Badge className={getRiskBadgeClass(result.level)}>
                        {result.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Water Quality Analysis
              </CardTitle>
              <CardDescription>
                Key water contaminants and their risk levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={waterChartRef}>
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--primary))"
                      />
                      <XAxis dataKey="name" stroke="hsl(var(--primary))" />
                      <YAxis stroke="hsl(var(--primary))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--chart-4))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(waterAnalysis).map(([key, result]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <span className="font-medium text-foreground text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {result.message}
                      </span>
                      <Badge className={getRiskBadgeClass(result.level)}>
                        {result.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Surface Quality Analysis
              </CardTitle>
              <CardDescription>
                Surface contaminants and their risk levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={surfaceChartRef}>
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--chart-1))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(surfaceAnalysis).map(([key, result]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <span className="font-medium text-foreground text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {result.message}
                      </span>
                      <Badge className={getRiskBadgeClass(result.level)}>
                        {result.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Dust Quality Analysis
              </CardTitle>
              <CardDescription>
                Dust contaminants and their risk levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(dustAnalysis).map(([key, result]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <span className="font-medium text-foreground text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">
                        {result.message}
                      </span>
                      <Badge className={getRiskBadgeClass(result.level)}>
                        {result.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Overall Environmental Health Summary
              </CardTitle>
              <CardDescription>
                Comprehensive view of all test categories (100 = optimal)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div ref={summaryChartRef}>
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
                    <RadarChart data={summaryData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="category"
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Radar
                        name="Health Score"
                        dataKey="score"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.6}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Care Notes & Recommendations
              </CardTitle>
              <CardDescription>
                Important safety information based on your results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <CareNote
                  level="normal"
                  title="Normal Levels"
                  description="Parameters within normal range require routine monitoring. Continue regular maintenance and testing schedules."
                />
                <CareNote
                  level="warning"
                  title="Warning Levels"
                  description="Elevated parameters require attention. Investigate sources, improve ventilation, and consider professional assessment. Retest within 30 days."
                />
                <CareNote
                  level="high"
                  title="High Risk Levels"
                  description="Immediate action required. Contact environmental health professionals for remediation. Limit exposure until levels are reduced. Follow all safety protocols."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CareNote({
  level,
  title,
  description,
}: {
  level: RiskLevel;
  title: string;
  description: string;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        level === "normal"
          ? "border-green-500/20 bg-green-500/5"
          : level === "warning"
          ? "border-yellow-500/20 bg-yellow-500/5"
          : "border-red-500/20 bg-red-500/5"
      }`}
    >
      <div className="flex items-start gap-3">
        <Badge className={getRiskBadgeClass(level)}>{level}</Badge>
        <div>
          <h4 className="mb-1 font-semibold text-foreground">{title}</h4>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}

function calculateCategoryScore(
  analysis: Record<string, { level: RiskLevel }>
): number {
  const levels = Object.values(analysis).map((a) => a.level);
  const scores = levels.map((level) => {
    switch (level) {
      case "normal":
        return 100;
      case "warning":
        return 60;
      case "high":
        return 20;
      default:
        return 0;
    }
  });
  //@ts-ignore
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
