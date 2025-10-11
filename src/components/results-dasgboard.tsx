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
      threshold: "≤1000 ppm",
      reference: "EPA indoor guideline"
    },
    {
      name: "CO",
      value: airAnalysis.carbonMonoxide?.value || 0,
      level: airAnalysis.carbonMonoxide?.level,
      fill: getRiskColor(airAnalysis.carbonMonoxide?.level || "normal"),
      threshold: "≤9 ppm",
      reference: "EPA indoor CO guideline"
    },
    {
      name: "PM 2.5",
      value: airAnalysis.pm25?.value || 0,
      level: airAnalysis.pm25?.level,
      fill: getRiskColor(airAnalysis.pm25?.level || "normal"),
      threshold: "≤12 µg/m³",
      reference: "EPA daily standard"
    },
    {
      name: "RH",
      value: airAnalysis.relativeHumidity?.value || 0,
      level: airAnalysis.relativeHumidity?.level,
      fill: getRiskColor(airAnalysis.relativeHumidity?.level || "normal"),
      threshold: "40-55%",
      reference: "Optimal range"
    },
  ];

  const waterChartData = [
    {
      name: "Lead",
      value: waterAnalysis.lead?.value || 0,
      level: waterAnalysis.lead?.level,
      fill: getRiskColor(waterAnalysis.lead?.level || "normal"),
      mcl: "15 ppb",
      reference: "EPA MCL"
    },
    {
      name: "Arsenic",
      value: waterAnalysis.arsenic?.value || 0,
      level: waterAnalysis.arsenic?.level,
      fill: getRiskColor(waterAnalysis.arsenic?.level || "normal"),
      mcl: "10 ppb",
      reference: "EPA MCL"
    },
    {
      name: "PFAS",
      value: waterAnalysis.pfas?.value || 0,
      level: waterAnalysis.pfas?.level,
      fill: getRiskColor(waterAnalysis.pfas?.level || "normal"),
      mcl: "4 ppt",
      reference: "EPA MCL"
    },
  ];

  const surfaceChartData = [
    {
      name: "Lead Paint",
      value: surfaceAnalysis.leadPaintXRF?.value || 0,
      level: surfaceAnalysis.leadPaintXRF?.level,
      fill: getRiskColor(surfaceAnalysis.leadPaintXRF?.level || "normal"),
      threshold: "≥0.5 mg/cm²",
      reference: "NYC Local Law 31"
    },
    {
      name: "Mold",
      value: surfaceAnalysis.surfaceMold?.value || 0,
      level: surfaceAnalysis.surfaceMold?.level,
      fill: getRiskColor(surfaceAnalysis.surfaceMold?.level || "normal"),
      threshold: ">500 CFU/cm²",
      reference: "Threshold for concern"
    },
  ];

  const dustChartData = [
    {
      name: "Floor Dust",
      value: dustAnalysis.floorDust?.value || 0,
      level: dustAnalysis.floorDust?.level,
      fill: getRiskColor(dustAnalysis.floorDust?.level || "normal"),
      surfaceType: "Floor",
      threshold: "<10 µg/ft²",
      reference: "EPA Clearance Standard"
    },
    {
      name: "Window Sill",
      value: dustAnalysis.windowSill?.value || 0,
      level: dustAnalysis.windowSill?.level,
      fill: getRiskColor(dustAnalysis.windowSill?.level || "normal"),
      surfaceType: "Sill",
      threshold: "<100 µg/ft²",
      reference: "EPA Clearance Standard"
    },
    {
      name: "Window Trough",
      value: dustAnalysis.windowTrough?.value || 0,
      level: dustAnalysis.windowTrough?.level,
      fill: getRiskColor(dustAnalysis.windowTrough?.level || "normal"),
      surfaceType: "Trough",
      threshold: "<400 µg/ft²",
      reference: "EPA Clearance Standard"
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
        <header className="mb-8 flex items-start justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center gap-4 ">
              <img 
                src="/Toxin.jpg" 
                alt="Toxin Testers Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="mb-2 font-bold text-3xl text-foreground">
                  Environmental Test Results
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive analysis of all test categories
                </p>
              </div>
            </div>
            
            {/* Report Header Block */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-foreground">Property:</span>
                  <span className="text-muted-foreground ml-2">{userInfo.address || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Inspection Date:</span>
                  <span className="text-muted-foreground ml-2">{userInfo.inspectionDate ? new Date(userInfo.inspectionDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short'
                  }) : new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Inspector:</span>
                  <span className="text-muted-foreground ml-2">{userInfo.inspector || "M. Eckstein"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Report ID:</span>
                  <span className="text-muted-foreground ml-2">TT-2025-{Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
              </div>
            </div>
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
                {Object.entries(airAnalysis).map(([key, result]) => {
                  const chartItem = airChartData.find(item => 
                    item.name === key.replace(/([A-Z])/g, " $1").trim().replace('Carbon Dioxide', 'CO₂').replace('Carbon Monoxide', 'CO').replace('PM 2.5', 'PM 2.5').replace('Relative Humidity', 'RH')
                  );
                  
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && (
                          <span className="text-xs text-muted-foreground">
                            ({chartItem.threshold})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                          {result.message}
                        </span>
                        <Badge className={getRiskBadgeClass(result.level)}>
                          {result.level}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
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
                {Object.entries(waterAnalysis).map(([key, result]) => {
                  const chartItem = waterChartData.find(item => 
                    item.name.toLowerCase() === key.replace(/([A-Z])/g, " $1").trim().toLowerCase()
                  );
                  
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && (
                          <span className="text-xs text-muted-foreground">
                            MCL: {chartItem.mcl}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                          {result.message}
                        </span>
                        <Badge className={getRiskBadgeClass(result.level)}>
                          {result.level}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* EPA Compliance Statement */}
              <div className="mt-4 p-3 bg-primary/10 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>EPA Compliance:</strong> Lead and Arsenic exceed safe limits established by EPA MCLs (40 CFR 141). 
                  Immediate corrective action is advised.
                </p>
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
                {Object.entries(surfaceAnalysis).map(([key, result]) => {
                  const chartItem = surfaceChartData.find(item => 
                    item.name.toLowerCase().replace(/\s+/g, '') === key.replace(/([A-Z])/g, " $1").trim().toLowerCase().replace(/\s+/g, '')
                  );
                  
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && (
                          <span className="text-xs text-muted-foreground">
                            {chartItem.reference}: {chartItem.threshold}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                          {result.message}
                        </span>
                        <Badge className={getRiskBadgeClass(result.level)}>
                          {result.level}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Lead Paint Thermometer Visualization */}
              {surfaceAnalysis.leadPaintXRF && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium text-foreground mb-3">Lead Paint Levels (Thermometer Scale)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Current Reading: {surfaceAnalysis.leadPaintXRF.value} mg/cm²</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full relative">
                          <div 
                            className="absolute top-0 h-4 w-1 bg-black rounded-full"
                            style={{ left: `${Math.min((surfaceAnalysis.leadPaintXRF.value / 10) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">0-10 mg/cm²</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>🟢 Safe (0-0.1)</span>
                      <span>🟡 Caution (0.2-0.4)</span>
                      <span>🔴 Hazard (≥0.5)</span>
                    </div>
                  </div>
                </div>
              )}
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
                {Object.entries(dustAnalysis).map(([key, result]) => {
                  const chartItem = dustChartData.find(item => 
                    item.name.toLowerCase().replace(/\s+/g, '') === key.replace(/([A-Z])/g, " $1").trim().toLowerCase().replace(/\s+/g, '')
                  );
                  
                  const isPass = result.level === "normal";
                  const passFailIcon = isPass ? "🟢" : "🔴";
                  const passFailText = isPass ? "Pass" : "Fail";
                  
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && (
                          <Badge variant="outline" className="text-xs">
                            {chartItem.surfaceType}
                          </Badge>
                        )}
                        {chartItem && (
                          <span className="text-xs text-muted-foreground">
                            {chartItem.threshold}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm">
                          {result.message}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{passFailIcon} {passFailText}</span>
                          <Badge className={getRiskBadgeClass(result.level)}>
                            {result.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* EPA Clearance Standards Summary */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>EPA Clearance Standards:</strong> Floor dust levels above 10 µg/ft² and window sill levels above 100 µg/ft² 
                  exceed EPA clearance standards and require professional cleaning or abatement.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card ">
            <CardHeader>
              <CardTitle className="text-foreground">
                Overall Environmental Health Summary
              </CardTitle>
              <CardDescription>
                Comprehensive view of all test categories with weighted scoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Environmental Health Score */}
              <div className="mb-6 p-4 bg-gradient-to-r rounded-lg border">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Environmental Health Score</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {Math.round(calculateWeightedEnvironmentalScore(airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis))}/100
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Weighted average: Air & Water (30% each), Surface & Dust (20% each)
                  </p>
                </div>
              </div>
              
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
                        label={({ name, value }) => `${name}: ${Math.round(value)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              {/* Category Breakdown */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {summaryData.map((item) => (
                  <div key={item.category} className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-sm font-medium text-foreground">{item.category}</div>
                    <div className="text-lg font-bold" style={{ color: item.fill }}>
                      {Math.round(item.score)}
                    </div>
                    <div className="text-xs text-muted-foreground">/100</div>
                  </div>
                ))}
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
                  icon="✅"
                />
                <CareNote
                  level="warning"
                  title="Warning Levels"
                  description="Elevated parameters require attention. Investigate sources, improve ventilation, and consider professional assessment. Retest within 30 days."
                  icon="⚠️"
                />
                <CareNote
                  level="high"
                  title="High Risk Levels"
                  description="Immediate action required. Contact environmental health professionals for remediation. Limit exposure until levels are reduced. Follow all safety protocols."
                  icon="🚨"
                />
              </div>
              
              {/* Next Steps Section */}
              <div className="mt-6 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">Next Steps</h4>
                <div className="space-y-2 text-sm light:text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">🚨 High Risk:</span>
                    <span>You may want to consider contacting a certified abatement contractor.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">⚠️ Warning:</span>
                    <span>Re-test in 3 months; ensure windows remain closed during test period.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✅ Normal:</span>
                    <span>Continue regular monitoring and maintenance schedules.</span>
                  </div>
                </div>
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
  icon,
}: {
  level: RiskLevel;
  title: string;
  description: string;
  icon: string;
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
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <Badge className={getRiskBadgeClass(level)}>{level}</Badge>
        </div>
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

function calculateWeightedEnvironmentalScore(
  airAnalysis: Record<string, { level: RiskLevel }>,
  waterAnalysis: Record<string, { level: RiskLevel }>,
  surfaceAnalysis: Record<string, { level: RiskLevel }>,
  dustAnalysis: Record<string, { level: RiskLevel }>
): number {
  const airScore = calculateCategoryScore(airAnalysis);
  const waterScore = calculateCategoryScore(waterAnalysis);
  const surfaceScore = calculateCategoryScore(surfaceAnalysis);
  const dustScore = calculateCategoryScore(dustAnalysis);
  // Weighted formula: Air & Water (30% each), Surface & Dust (20% each)
  return (airScore * 0.3) + (waterScore * 0.3) + (surfaceScore * 0.2) + (dustScore * 0.2);
}
