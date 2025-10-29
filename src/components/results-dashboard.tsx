import html2canvas from "html2canvas";
import { Download, Loader2, Mail, MapPin, Phone, RotateCcw, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { DownloadDialog } from "@/components/download-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  analyzeAirQuality,
  analyzeDustQuality,
  analyzeSurfaceQuality,
  analyzeWaterQuality,
  getRiskBadgeClass,
  type RiskLevel,
} from "@/lib/analysis";
import { generatePDF } from "@/lib/pdf-export";
import { generateSimpleVisualPDF } from "@/lib/simple-visual-pdf";
import { useTestStore } from "@/lib/store";
import { generateVisualPDFWithCharts } from "@/lib/visual-pdf-export";
import { AirQualityChart } from "./air-quality-chart";
import { DustQualityChart } from "./dust-quality-chart";
import Navbar from "./landing/navbar";
import { SummaryChart } from "./summary-chart";
import { SurfaceQualityChart } from "./surface-quality-chart";
import Thermometer from "./ui/thermometer";
import { WaterQualityChart } from "./water-quality-chart";

export function ResultsDashboard() {
  // markdown sending handled inline in this component
  const { data, userInfo, resetData } = useTestStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  const airChartRef = useRef<HTMLDivElement>(null);
  const dustChartRef = useRef<HTMLDivElement>(null);
  const waterChartRef = useRef<HTMLDivElement>(null);
  const surfaceChartRef = useRef<HTMLDivElement>(null);
  const summaryChartRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  //@ts-expect-error - Type mismatch in analysis functions
  const airAnalysis = analyzeAirQuality(data.air);
  //@ts-expect-error - Type mismatch in analysis functions
  const waterAnalysis = analyzeWaterQuality(data.water);
  //@ts-expect-error - Type mismatch in analysis functions
  const surfaceAnalysis = analyzeSurfaceQuality(data.surface);
  //@ts-expect-error - Type mismatch in analysis functions
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

  const dustChartData = [
    {
      name: "Floor Dust",
      value: dustAnalysis.floorDust?.value || 0,
      level: dustAnalysis.floorDust?.level,
      fill: getRiskColor(dustAnalysis.floorDust?.level || "normal"),
      surfaceType: "Floor",
      threshold: "<10 µg/ft²",
      reference: "EPA Clearance Standard",
    },
    {
      name: "Window Sill",
      value: dustAnalysis.windowSill?.value || 0,
      level: dustAnalysis.windowSill?.level,
      fill: getRiskColor(dustAnalysis.windowSill?.level || "normal"),
      surfaceType: "Sill",
      threshold: "<100 µg/ft²",
      reference: "EPA Clearance Standard",
    },
    {
      name: "Window Trough",
      value: dustAnalysis.windowTrough?.value || 0,
      level: dustAnalysis.windowTrough?.level,
      fill: getRiskColor(dustAnalysis.windowTrough?.level || "normal"),
      surfaceType: "Trough",
      threshold: "<400 µg/ft²",
      reference: "EPA Clearance Standard",
    },
  ];

  const getSummaryColor = (score: number): string => {
    if (score >= 80) return "#3b82f6"; // Blue for good scores
    if (score >= 50) return "#f97316"; // Orange for moderate scores
    return "#ef4444"; // Red for poor scores
  };

  // Per-metric thermometer scales (min/max). Values chosen as sensible defaults.
  const metricScales: Record<string, { min: number; max: number }> = {
    // Air metrics
    carbonDioxide: { min: 400, max: 999 },
    carbonMonoxide: { min: 0, max: 1 },
    pm25: { min: 0, max: 30 },
    relativeHumidity: { min: 0, max: 50 },
    // Water metrics
    lead: { min: 0, max: 5 }, // ppb
    arsenic: { min: 0, max: 5 },
    pfas: { min: 0, max: 2 },
    // Surface metrics
    leadPaintXRF: { min: 0, max: 0.4 }, // mg/cm²
    surfaceMold: { min: 0, max: 100 }, // CFU/cm²
    // Dust metrics
    floorDust: { min: 0, max: 10 },
    windowSill: { min: 0, max: 100 },
    windowTrough: { min: 0, max: 400 },
  };

  // Helper to detect whether any meaningful data was entered for a category
  const hasAnalysisData = (analysis: Record<string, { value?: number }>) => {
    // Consider a category has data when at least one value is non-zero and defined
    return Object.values(analysis).some((v) => {
      if (!v) return false;
      const val = v.value;
      return val !== undefined && val !== null && !Number.isNaN(val) && val !== 0;
    });
  };

  const hasAirData = hasAnalysisData(airAnalysis);
  const hasWaterData = hasAnalysisData(waterAnalysis);
  const hasSurfaceData = hasAnalysisData(surfaceAnalysis);
  const hasDustData = hasAnalysisData(dustAnalysis);

  const summaryData = [
    // Only include categories that have data
    ...(hasAirData
      ? [
          {
            category: "Air Quality",
            score: calculateCategoryScore(airAnalysis),
            fill: getSummaryColor(calculateCategoryScore(airAnalysis)),
          },
        ]
      : []),
    ...(hasWaterData
      ? [
          {
            category: "Water Quality",
            score: calculateCategoryScore(waterAnalysis),
            fill: getSummaryColor(calculateCategoryScore(waterAnalysis)),
          },
        ]
      : []),
    ...(hasSurfaceData
      ? [
          {
            category: "Surface Quality",
            score: calculateCategoryScore(surfaceAnalysis),
            fill: getSummaryColor(calculateCategoryScore(surfaceAnalysis)),
          },
        ]
      : []),
    ...(hasDustData
      ? [
          {
            category: "Dust Quality",
            score: calculateCategoryScore(dustAnalysis),
            fill: getSummaryColor(calculateCategoryScore(dustAnalysis)),
          },
        ]
      : []),
  ];

  const generateVisualPDFData = useCallback(async () => {
    if (!dashboardRef.current) {
      throw new Error("Dashboard element not found");
    }

    // Add a small delay to ensure charts are fully rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return generateVisualPDFWithCharts(dashboardRef.current, userInfo);
  }, [userInfo]);

  const captureElement = useCallback(async (el: HTMLElement | null): Promise<string | undefined> => {
    if (!el) return undefined;
    try {
      // Clone element and force Helvetica font-family + normal weight and white background
      const clone = el.cloneNode(true) as HTMLElement;
      // Apply styles to clone container
      clone.style.background = "#ffffff";
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0px";
      // Recursively force helvetica font and normal weight
      const forceFont = (node: HTMLElement | Element) => {
        try {
          if (node instanceof HTMLElement) {
            node.style.fontFamily = "Helvetica, Arial, sans-serif";
            node.style.fontWeight = "normal";
            // Ensure text color stays readable
            if (!node.style.backgroundColor) node.style.backgroundColor = "transparent";
          }
          node.childNodes.forEach((c) => {
            if (c && c.nodeType === Node.ELEMENT_NODE) {
              forceFont(c as HTMLElement);
            }
          });
        } catch (_e) {
          // ignore
        }
      };
      forceFont(clone);

      document.body.appendChild(clone);
      const canvas = await html2canvas(clone as HTMLElement, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true,
      });
      document.body.removeChild(clone);
      return canvas.toDataURL("image/png", 1.0);
    } catch {
      return undefined;
    }
  }, []);

  const captureChartSvg = useCallback(async (container: HTMLElement | null): Promise<string | undefined> => {
    if (!container) return undefined;
    const svg = container.querySelector("svg");
    if (!svg) return undefined;
    try {
      // Clone the SVG to avoid mutating original
      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      // Ensure xmlns is present
      if (!clonedSvg.getAttribute("xmlns")) {
        clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      }
      // Force Helvetica font for SVG text elements so exported image uses it
      try {
        clonedSvg.style.fontFamily = "Helvetica, Arial, sans-serif";
        clonedSvg.style.fontWeight = "normal";
        const texts = clonedSvg.querySelectorAll("text");
        texts.forEach((t) => {
          (t as SVGElement).setAttribute("font-family", "Helvetica, Arial, sans-serif");
          (t as SVGElement).setAttribute("font-weight", "normal");
        });
      } catch (_e) {
        // ignore
      }
      // Compute export dimensions
      const rect = (svg as SVGSVGElement).getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width || Number(svg.getAttribute("width")) || 600));
      const height = Math.max(1, Math.round(rect.height || Number(svg.getAttribute("height")) || 300));
      clonedSvg.setAttribute("width", String(width));
      clonedSvg.setAttribute("height", String(height));

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      try {
        const dataUrl: string = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              canvas.width = width * 2; // scale for sharper image
              canvas.height = height * 2;
              const ctx = canvas.getContext("2d");
              if (!ctx) return reject(new Error("No canvas context"));
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              resolve(canvas.toDataURL("image/png", 1.0));
            } catch (e) {
              reject(e);
            }
          };
          img.onerror = () => reject(new Error("SVG to image load failed"));
          img.src = url;
        });
        return dataUrl;
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
      return undefined;
    }
  }, []);

  const getChartImages = useCallback(async () => {
    // small delay to ensure charts are painted
    await new Promise((r) => setTimeout(r, 500));
    // Try SVG capture first, then fall back to html2canvas per chart
    const airChart = hasAirData
      ? (await captureChartSvg(airChartRef.current)) || (await captureElement(airChartRef.current))
      : undefined;
    const waterChart = hasWaterData
      ? (await captureChartSvg(waterChartRef.current)) || (await captureElement(waterChartRef.current))
      : undefined;
    const surfaceChart = hasSurfaceData
      ? (await captureChartSvg(surfaceChartRef.current)) || (await captureElement(surfaceChartRef.current))
      : undefined;
    const dustChart = hasDustData
      ? (await captureChartSvg(dustChartRef.current)) || (await captureElement(dustChartRef.current))
      : undefined;
    const summaryChart =
      summaryChartRef.current && (hasAirData || hasWaterData || hasSurfaceData || hasDustData)
        ? (await captureChartSvg(summaryChartRef.current)) || (await captureElement(summaryChartRef.current))
        : undefined;
    return { airChart, waterChart, surfaceChart, dustChart, summaryChart };
  }, [captureChartSvg, captureElement, hasAirData, hasWaterData, hasSurfaceData, hasDustData]);

  const handleSimpleDownload = useCallback(async () => {
    setIsGeneratingPDF(true);
    try {
      let pdfResult;

      try {
        // Try simple approach first
        if (!dashboardRef.current || !userInfo) {
          throw new Error("Dashboard element or user info not available");
        }
        pdfResult = await generateSimpleVisualPDF(dashboardRef.current, userInfo);
      } catch {
        // Fallback to complex approach
        try {
          pdfResult = await generateVisualPDFData();
        } catch {
          // Final fallback: build the text PDF but embed chart screenshots if available
          const chartImages = await getChartImages();

          const basicPdf = await generatePDF(
            airAnalysis,
            waterAnalysis,
            surfaceAnalysis,
            dustAnalysis,
            userInfo,
            chartImages,
          );
          basicPdf.save();
          toast.success("PDF downloaded successfully!");
          return;
        }
      }
      pdfResult.save();
      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  }, [generateVisualPDFData, getChartImages, userInfo, airAnalysis, dustAnalysis, surfaceAnalysis, waterAnalysis]);

  // const handleEmailReport = async () => {
  //   try {
  //     setIsGeneratingPDF(true);

  //     // Get the PDF blob
  //     const res = await fetch("/api/report/download");
  //     const blob = await res.blob();

  //     // Convert blob to base64
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onloadend = async () => {
  //       const base64PDF = reader.result as string;

  //       const templateParams = {
  //         to_email: userInfo.email,
  //         to_name: userInfo.name,
  //         message: "Your environmental test report is attached below.",
  //         file: base64PDF, // base64-encoded PDF
  //         file_name: "Environmental_Report.pdf",
  //       };

  //       const result = await emailjs.send("service_9w5trja", "template_xgqb1qu", templateParams, "pWy_1lvvyxQ2tto4T");

  //       if (result.status === 200) {
  //         toast.success("Email sent successfully!");
  //       }
  //     };
  //   } catch {
  //     toast.error("Failed to send email");
  //   } finally {
  //     setIsGeneratingPDF(false);
  //   }
  // };

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const buildDashboardMarkdown = () => {
    const lines: string[] = [];
    lines.push(`Environmental Test Report`);
    lines.push(``);
    lines.push(`**Client:** ${userInfo.name || "N/A"}`);
    lines.push(`**Email:** ${userInfo.email || "N/A"}`);
    lines.push(`**Address:** ${userInfo.address || "N/A"}`);
    lines.push(`**Inspector:** ${userInfo.inspector || "N/A"}`);
    lines.push(`**Inspection Date:** ${userInfo.inspectionDate || new Date().toLocaleDateString()}`);
    lines.push(``);
    lines.push(`## Air Quality`);
    Object.entries(airAnalysis).forEach(([k, v]) => {
      lines.push(`- ${k.replace(/([A-Z])/g, " $1").trim()}: ${v.value} (${v.level.toUpperCase()}) - ${v.message}`);
    });
    lines.push(``);
    lines.push(`## Water Quality`);
    Object.entries(waterAnalysis).forEach(([k, v]) => {
      lines.push(`- ${k.replace(/([A-Z])/g, " $1").trim()}: ${v.value} (${v.level.toUpperCase()}) - ${v.message}`);
    });
    lines.push(``);
    lines.push(`## Surface Quality`);
    Object.entries(surfaceAnalysis).forEach(([k, v]) => {
      lines.push(`- ${k.replace(/([A-Z])/g, " $1").trim()}: ${v.value} (${v.level.toUpperCase()}) - ${v.message}`);
    });
    lines.push(``);
    lines.push(`## Dust Quality`);
    Object.entries(dustAnalysis).forEach(([k, v]) => {
      lines.push(`- ${k.replace(/([A-Z])/g, " $1").trim()}: ${v.value} (${v.level.toUpperCase()}) - ${v.message}`);
    });

    // Category summary
    lines.push(``);
    lines.push(`## Summary`);
    lines.push(`### Category Scores`);
    summaryData.forEach((item) => {
      lines.push(`- ${item.category}: ${Math.round(item.score)}/100`);
    });

    const overall = Math.round(
      calculateWeightedEnvironmentalScore(airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis),
    );
    lines.push(``);
    lines.push(`**Overall Environmental Health Score:** ${overall}/100`);

    return lines.join("\n");
  };

  const handleEmailReport = useCallback(async () => {
    const webhook = "https://scintia.app.n8n.cloud/webhook/91439925-955d-4b27-ba3f-300aec964cf8";
    const markdown = buildDashboardMarkdown();

    try {
      const form = new FormData();
      form.append("email", userInfo.email || "");
      form.append("subject", `Environmental Test Report - ${userInfo.name || "Client"}`);
      form.append("markdown", markdown);

      const res = await fetch(webhook, { method: "POST", body: form });
      if (res.ok) {
        toast.success("Report markdown sent to webhook");
      } else {
        toast.error("Failed to send report to webhook");
      }
    } catch (_err) {
      toast.error("Error sending report to webhook");
    }
  }, [userInfo, buildDashboardMarkdown]);

  const handleReset = () => {
    resetData();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Navbar />
      <div ref={dashboardRef} className="mx-auto max-w-7xl pt-16">
        <header className="mb-8 flex items-start justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center gap-4">
              <div>
                <h1 className="mb-2 font-bold text-3xl text-foreground">Environmental Test Results</h1>
                <p className="text-muted-foreground">Comprehensive analysis of all test categories</p>
              </div>
            </div>

            {/* Report Header Block */}
            <div className="space-y-2 rounded-lg bg-muted/30 p-4 text-sm">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <span className="font-medium text-foreground">Property:</span>
                  <span className="ml-2 text-muted-foreground">{userInfo.address || "Not specified"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Inspection Date:</span>
                  <span className="ml-2 text-muted-foreground">
                    {userInfo.inspectionDate
                      ? new Date(userInfo.inspectionDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                        })
                      : new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Inspector:</span>
                  <span className="ml-2 text-muted-foreground">{userInfo.inspector || "M. Eckstein"}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Report ID:</span>
                  <span className="ml-2 text-muted-foreground">TT-2025-{Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              New Test
            </Button>
            <Button onClick={handleDownloadClick} disabled={isGeneratingPDF} className="gap-2">
              {isGeneratingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isGeneratingPDF ? "" : "Download PDF"}
            </Button>
            <Button
              onClick={() => {
                // Open the user's default mail client with prefilled subject and body
                const subject = encodeURIComponent(`Environmental Test Report - ${userInfo.name || "Client"}`);
                // Convert markdown to plain text for mail body by stripping markdown
                const markdown = buildDashboardMarkdown();
                const plain = markdown
                  .replace(/\n### /g, "\n")
                  .replace(/\n## /g, "\n")
                  .replace(/\n# /g, "\n")
                  .replace(/\*\*(.*?)\*\*/g, "$1")
                  .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)")
                  .replace(/\*|`/g, "")
                  .trim();
                const body = encodeURIComponent(
                  `Hello ${userInfo.name || ""},\n\nPlease find the environmental test summary below:\n\n${plain}\n\n`,
                );
                const mailto = `mailto:${userInfo.email || ""}?subject=${subject}&body=${body}`;
                window.location.href = mailto;
              }}
              type="button"
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Send result via Email
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
                    <p className="font-medium text-foreground text-sm">Name</p>
                    <p className="text-muted-foreground text-sm">{userInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Email</p>
                    <p className="text-muted-foreground text-sm">{userInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Address</p>
                    <p className="text-muted-foreground text-sm">{userInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground text-sm">Phone</p>
                    <p className="text-muted-foreground text-sm">{userInfo.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 grid gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Air Quality Analysis</CardTitle>
              <CardDescription>Key air contaminants and their risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              {hasAirData ? (
                <div ref={airChartRef}>
                  <AirQualityChart airAnalysis={airAnalysis} />
                </div>
              ) : (
                <div className="rounded-lg bg-muted/20 p-6 text-center text-muted-foreground text-sm">
                  No air test data entered — chart will appear after you submit air test values.
                </div>
              )}
              <div className="mt-4 space-y-2">
                {Object.entries(airAnalysis).map(([key, result]) => {
                  const chartItem = airChartData.find(
                    (item) =>
                      item.name ===
                      key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace("Carbon Dioxide", "CO₂")
                        .replace("Carbon Monoxide", "CO")
                        .replace("PM 2.5", "PM 2.5")
                        .replace("Relative Humidity", "RH"),
                  );

                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && <span className="text-muted-foreground text-xs">({chartItem.threshold})</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">{result.message}</span>
                          {metricScales[key] && (
                            <div className="mt-1">
                              <Thermometer
                                value={result.value || 0}
                                min={metricScales[key].min}
                                max={metricScales[key].max}
                                width={140}
                                height={12}
                              />
                            </div>
                          )}
                        </div>
                        <Badge className={getRiskBadgeClass(result.level)}>{result.level}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Water Quality Analysis</CardTitle>
              <CardDescription>Key water contaminants and their risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              {hasWaterData ? (
                <div ref={waterChartRef}>
                  <WaterQualityChart waterAnalysis={waterAnalysis} />
                </div>
              ) : (
                <div className="rounded-lg bg-muted/20 p-6 text-center text-muted-foreground text-sm">
                  No water test data entered — chart will appear after you submit water test values.
                </div>
              )}
              <div className="mt-4 space-y-2">
                {Object.entries(waterAnalysis).map(([key, result]) => {
                  const chartItem = waterChartData.find(
                    (item) =>
                      item.name.toLowerCase() ===
                      key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .toLowerCase(),
                  );

                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && <span className="text-muted-foreground text-xs">MCL: {chartItem.mcl}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">{result.message}</span>
                          {metricScales[key] && (
                            <div className="mt-1">
                              <Thermometer
                                value={result.value || 0}
                                min={metricScales[key].min}
                                max={metricScales[key].max}
                                width={140}
                                height={12}
                              />
                            </div>
                          )}
                        </div>
                        <Badge className={getRiskBadgeClass(result.level)}>{result.level}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EPA Compliance Statement */}
              <div className="mt-4 rounded-lg border border-blue-200 bg-primary/10 p-3">
                <p className="text-blue-800 text-sm dark:text-blue-300">
                  <strong>EPA Compliance:</strong> Lead and Arsenic exceed safe limits established by EPA MCLs (40 CFR
                  141). Immediate corrective action is advised.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Surface Quality Analysis</CardTitle>
              <CardDescription>Surface contaminants and their risk levels</CardDescription>
            </CardHeader>
            <CardContent>
              {hasSurfaceData ? (
                <div ref={surfaceChartRef}>
                  <SurfaceQualityChart surfaceAnalysis={surfaceAnalysis} />
                </div>
              ) : (
                <div className="rounded-lg bg-muted/20 p-6 text-center text-muted-foreground text-sm">
                  No surface test data entered — chart will appear after you submit surface test values.
                </div>
              )}
              <div className="mt-4 space-y-2">
                {Object.entries(surfaceAnalysis).map(([key, result]) => {
                  const chartItem = surfaceChartData.find(
                    (item) =>
                      item.name.toLowerCase().replace(/\s+/g, "") ===
                      key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, ""),
                  );

                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && (
                          <span className="text-muted-foreground text-xs">
                            {chartItem.reference}: {chartItem.threshold}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">{result.message}</span>
                          {metricScales[key] && (
                            <div className="mt-1">
                              <Thermometer
                                value={result.value || 0}
                                min={metricScales[key].min}
                                max={metricScales[key].max}
                                width={140}
                                height={12}
                              />
                            </div>
                          )}
                        </div>
                        <Badge className={getRiskBadgeClass(result.level)}>{result.level}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lead Paint Thermometer Visualization */}
              {surfaceAnalysis.leadPaintXRF && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <h4 className="mb-3 font-medium text-foreground">Lead Paint Levels (Thermometer Scale)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm">
                        Current Reading: {surfaceAnalysis.leadPaintXRF.value} mg/cm²
                      </span>
                      <div className="flex items-center gap-2">
                        <Thermometer
                          value={surfaceAnalysis.leadPaintXRF.value}
                          min={0}
                          max={10}
                          width={220}
                          height={18}
                        />
                        <span className="text-muted-foreground text-xs">0-10 mg/cm²</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-xs">
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
              <CardTitle className="text-foreground">Dust Quality Analysis</CardTitle>
              <CardDescription>Dust contaminants and their risk levels</CardDescription>
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
              {hasDustData ? (
                <div ref={dustChartRef}>
                  <DustQualityChart dustAnalysis={dustAnalysis} />
                </div>
              ) : (
                <div className="rounded-lg bg-muted/20 p-6 text-center text-muted-foreground text-sm">
                  No dust test data entered — chart will appear after you submit dust test values.
                </div>
              )}
              <div className="mt-4 space-y-2">
                {Object.entries(dustAnalysis).map(([key, result]) => {
                  const chartItem = dustChartData.find(
                    (item) =>
                      item.name.toLowerCase().replace(/\s+/g, "") ===
                      key
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, ""),
                  );

                  const isPass = result.level === "normal";
                  const passFailIcon = isPass ? "🟢" : "🔴";
                  const passFailText = isPass ? "Pass" : "Fail";

                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground text-sm capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        {chartItem && (
                          <Badge variant="outline" className="text-xs">
                            {chartItem.surfaceType}
                          </Badge>
                        )}
                        {chartItem && <span className="text-muted-foreground text-xs">{chartItem.threshold}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">{result.message}</span>
                          {metricScales[key] && (
                            <div className="mt-1">
                              <Thermometer
                                value={result.value || 0}
                                min={metricScales[key].min}
                                max={metricScales[key].max}
                                width={140}
                                height={12}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {passFailIcon} {passFailText}
                          </span>
                          <Badge className={getRiskBadgeClass(result.level)}>{result.level}</Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* EPA Clearance Standards Summary */}
              <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  <strong>EPA Clearance Standards:</strong> Floor dust levels above 10 µg/ft² and window sill levels
                  above 100 µg/ft² exceed EPA clearance standards and require professional cleaning or abatement.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Overall Environmental Health Summary</CardTitle>
              <CardDescription>Comprehensive view of all test categories with weighted scoring</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Environmental Health Score */}
              <div className="mb-6 rounded-lg border bg-gradient-to-r p-4">
                <div className="text-center">
                  <h3 className="mb-2 font-bold text-2xl text-foreground">Environmental Health Score</h3>
                  <div className="mb-2 font-bold text-4xl text-blue-600">
                    {Math.round(
                      calculateWeightedEnvironmentalScore(airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis),
                    )}
                    /100
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Weighted average: Air & Water (30% each), Surface & Dust (20% each)
                  </p>
                </div>
              </div>

              {hasAirData || hasWaterData || hasSurfaceData || hasDustData ? (
                <div ref={summaryChartRef}>
                  <SummaryChart summaryData={summaryData} />
                </div>
              ) : (
                <div className="rounded-lg bg-muted/20 p-6 text-center text-muted-foreground text-sm">
                  No category data available yet — summary chart will appear after tests are entered.
                </div>
              )}

              {/* Category Breakdown */}
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {summaryData.map((item) => (
                  <div key={item.category} className="rounded-lg bg-muted/30 p-3 text-center">
                    <div className="font-medium text-foreground text-sm">{item.category}</div>
                    <div className="font-bold text-lg" style={{ color: item.fill }}>
                      {Math.round(item.score)}
                    </div>
                    <div className="text-muted-foreground text-xs">/100</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Care Notes & Recommendations</CardTitle>
              <CardDescription>Important safety information based on your results</CardDescription>
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

              <div className="mt-6 rounded-lg p-4">
                <h4 className="mb-3 font-semibold text-blue-900">Next Steps</h4>
                <div className="space-y-2 light:text-blue-800 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-red-500">🚨 High Risk:</span>
                    <span>You may want to consider contacting a certified abatement contractor.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-yellow-600">⚠️ Warning:</span>
                    <span>Re-test in 3 months; ensure windows remain closed during test period.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-green-600">✅ Normal:</span>
                    <span>Continue regular monitoring and maintenance schedules.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DownloadDialog
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          onSimpleDownload={handleSimpleDownload}
          onEmailReport={handleEmailReport}
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

function calculateCategoryScore(analysis: Record<string, { level: RiskLevel }>): number {
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
  //@ts-expect-error - Array reduce type inference issue
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function calculateWeightedEnvironmentalScore(
  airAnalysis: Record<string, { level: RiskLevel }>,
  waterAnalysis: Record<string, { level: RiskLevel }>,
  surfaceAnalysis: Record<string, { level: RiskLevel }>,
  dustAnalysis: Record<string, { level: RiskLevel }>,
): number {
  const airScore = calculateCategoryScore(airAnalysis);
  const waterScore = calculateCategoryScore(waterAnalysis);
  const surfaceScore = calculateCategoryScore(surfaceAnalysis);
  const dustScore = calculateCategoryScore(dustAnalysis);
  // Weighted formula: Air & Water (30% each), Surface & Dust (20% each)
  return airScore * 0.3 + waterScore * 0.3 + surfaceScore * 0.2 + dustScore * 0.2;
}
