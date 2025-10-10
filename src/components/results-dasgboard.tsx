import { Download, RotateCcw, User, Mail, MapPin, Phone } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
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
import { DownloadDialog } from "@/components/download-dialog";
import {
  analyzeAirQuality,
  analyzeDustQuality,
  analyzeSurfaceQuality,
  analyzeWaterQuality,
  getRiskBadgeClass,
  type RiskLevel,
} from "@/lib/analysis";
import { generatePDF, sendEmailWithPDF } from "@/lib/pdf-export";
import { useTestStore } from "@/lib/store";
import Navbar from "./landing/navbar";

export function ResultsDashboard() {
  const { data, userInfo, resetData } = useTestStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const airChartRef = useRef<HTMLDivElement>(null);
  const dustChartRef = useRef<HTMLDivElement>(null);
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

  const getRiskColor = (level: RiskLevel): string => {
    switch (level) {
      case "normal":
        return "oklch(var(--chart-2))"; // Blue
      case "warning":
        return "oklch(var(--chart-5))"; // Orange
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
    },
    {
      name: "CO",
      value: airAnalysis.carbonMonoxide?.value || 0,
      level: airAnalysis.carbonMonoxide?.level,
      fill: getRiskColor(airAnalysis.carbonMonoxide?.level || "normal"),
    },
    {
      name: "PM 2.5",
      value: airAnalysis.pm25?.value || 0,
      level: airAnalysis.pm25?.level,
      fill: getRiskColor(airAnalysis.pm25?.level || "normal"),
    },
  ];

  const waterChartData = [
    {
      name: "Lead",
      value: waterAnalysis.leadInWater?.value || 0,
      level: waterAnalysis.leadInWater?.level,
      fill: getRiskColor(waterAnalysis.leadInWater?.level || "normal"),
    },
    {
      name: "Arsenic",
      value: waterAnalysis.arsenic?.value || 0,
      level: waterAnalysis.arsenic?.level,
      fill: getRiskColor(waterAnalysis.arsenic?.level || "normal"),
    },
    {
      name: "PFAS",
      value: waterAnalysis.pfas?.value || 0,
      level: waterAnalysis.pfas?.level,
      fill: getRiskColor(waterAnalysis.pfas?.level || "normal"),
    },
  ];

  const surfaceChartData = [
    {
      name: "Lead Room 1",
      value: surfaceAnalysis.leadPaintRoom1?.value || 0,
      level: surfaceAnalysis.leadPaintRoom1?.level,
      fill: getRiskColor(surfaceAnalysis.leadPaintRoom1?.level || "normal"),
    },
    {
      name: "Lead Room 2",
      value: surfaceAnalysis.leadPaintRoom2?.value || 0,
      level: surfaceAnalysis.leadPaintRoom2?.level,
      fill: getRiskColor(surfaceAnalysis.leadPaintRoom2?.level || "normal"),
    },
    {
      name: "Mold",
      value: surfaceAnalysis.mold?.value || 0,
      level: surfaceAnalysis.mold?.level,
      fill: getRiskColor(surfaceAnalysis.mold?.level || "normal"),
    },
  ];

  const dustChartData = [
    {
      name: "PM 2.5",
      value: dustAnalysis.pm25?.value || 0,
      level: dustAnalysis.pm25?.level,
      fill: getRiskColor(dustAnalysis.pm25?.level || "normal"),
    },
    {
      name: "PM 10",
      value: dustAnalysis.pm10?.value || 0,
      level: dustAnalysis.pm10?.level,
      fill: getRiskColor(dustAnalysis.pm10?.level || "normal"),
    },
  ];

  const getSummaryColor = (score: number): string => {
    if (score >= 80) return "#3b82f6"; // Blue for good scores
    if (score >= 50) return "#f97316"; // Orange for moderate scores
    return "#ef4444"; // Red for poor scores
  };

  const summaryData = [
    {
      category: "Air Quality",
      score: calculateCategoryScore(airAnalysis),
      fill: getSummaryColor(calculateCategoryScore(airAnalysis)),
    },
    {
      category: "Water Quality",
      score: calculateCategoryScore(waterAnalysis),
      fill: getSummaryColor(calculateCategoryScore(waterAnalysis)),
    },
    {
      category: "Surface Quality",
      score: calculateCategoryScore(surfaceAnalysis),
      fill: getSummaryColor(calculateCategoryScore(surfaceAnalysis)),
    },
    {
      category: "Dust Quality",
      score: calculateCategoryScore(dustAnalysis),
      fill: getSummaryColor(calculateCategoryScore(dustAnalysis)),
    },
  ];

  const captureChartAsImage = useCallback(
    (ref: React.RefObject<HTMLDivElement>): Promise<string> => {
      return new Promise((resolve) => {
        if (!ref.current) {
          resolve("");
          return;
        }

        // Use html2canvas to capture the chart
        import("html2canvas")
          .then((html2canvas) => {
            html2canvas
              .default(ref.current!, {
                backgroundColor: "#ffffff",
                scale: 2,
                useCORS: true,
              })
              .then((canvas) => {
                const imageData = canvas.toDataURL("image/png");
                resolve(imageData);
              })
              .catch(() => {
                resolve("");
              });
          })
          .catch(() => {
            resolve("");
          });
      });
    },
    []
  );

  const generatePDFData = useCallback(async () => {
    // Capture all chart images
    const [airChart, waterChart, surfaceChart, dustChart, summaryChart] =
      await Promise.all([
        //@ts-ignore
        captureChartAsImage(airChartRef),
        //@ts-ignore
        captureChartAsImage(waterChartRef),
        //@ts-ignore
        captureChartAsImage(surfaceChartRef),
        //@ts-ignore
        captureChartAsImage(dustChartRef),
        //@ts-ignore
        captureChartAsImage(summaryChartRef),
      ]);

    const chartImages = {
      airChart,
      waterChart,
      surfaceChart,
      dustChart,
      summaryChart,
    };

    return generatePDF(
      airAnalysis,
      waterAnalysis,
      surfaceAnalysis,
      dustAnalysis,
      userInfo,
      chartImages
    );
  }, [
    airAnalysis,
    waterAnalysis,
    surfaceAnalysis,
    dustAnalysis,
    userInfo,
    captureChartAsImage,
  ]);

  const handleSimpleDownload = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      const pdfResult = await generatePDFData();
      pdfResult.save();
      toast.success("PDF downloaded successfully!");
    } catch (_error) {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [generatePDFData]);

  const handleEmailDownload = useCallback(async (email: string) => {
    setIsGeneratingPDF(true);
    try {
      const pdfResult = await generatePDFData();
      
      // Send email with PDF attachment
      const emailSent = await sendEmailWithPDF(
        email,
        pdfResult.pdfData,
        pdfResult.fileName,
        userInfo
      );

      if (emailSent) {
        // Also download the PDF locally
        pdfResult.save();
        toast.success(`PDF sent to ${email} and downloaded successfully!`);
      } else {
        toast.error("Failed to send email. PDF downloaded instead.");
        pdfResult.save();
      }
    } catch (_error) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [generatePDFData, userInfo]);

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const handleReset = () => {
    resetData();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Navbar />
      <div className="mx-auto max-w-7xl pt-16">
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
               onClick={handleDownloadClick}
               disabled={isGeneratingPDF}
               className="gap-2"
             >
               <Download className="h-4 w-4" />
               {isGeneratingPDF ? "Generating..." : "Download PDF"}
             </Button>
          </div>
        </header>

        {/* User Information Section */}
        {userInfo.name && (
          <Card className="mb-6 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="h-5 w-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Name</p>
                    <p className="text-muted-foreground text-sm">
                      {userInfo.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground text-sm">
                      {userInfo.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Address
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {userInfo.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground text-sm">
                      {userInfo.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
              {/* <div className="space-y-2">
                {Object.entries(dustAnalysis).map(([key, result]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="font-medium text-foreground text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm">{result.message}</span>
                      <Badge className={getRiskBadgeClass(result.level)}>{result.level}</Badge>
                    </div>
                  </div>
                ))}
              </div> */}
              <div ref={dustChartRef}>
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
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="mt-4 space-y-2">
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
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={summaryData.map((item) => ({
                            name: item.category,
                            value: item.score,
                            fill: item.fill,
                          }))}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={120}
                          stroke="hsl(var(--border))"
                          label
                        />
                      </PieChart>
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

        {/* Download Dialog */}
        <DownloadDialog
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          onSimpleDownload={handleSimpleDownload}
          onEmailDownload={handleEmailDownload}
          isGeneratingPDF={isGeneratingPDF}
        />
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
