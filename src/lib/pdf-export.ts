import jsPDF from "jspdf";
import type { RiskLevel } from "./analysis";
import type { UserInfo } from "./types";

export async function generatePDF(
  airAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  waterAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  surfaceAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  dustAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  userInfo: UserInfo,
  chartImages?: {
    airChart?: string;
    waterChart?: string;
    surfaceChart?: string;
    dustChart?: string;
    summaryChart?: string;
  },
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let y = 25;

  // === HEADER ===
  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 25, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("TOXIN TESTERS REPORT", pageWidth / 2, 17, { align: "center" });

  // === CLIENT INFO BOX ===
  pdf.setTextColor(0, 0, 0);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  y += 10;
  pdf.text(`Inspector: ${userInfo.inspector || "M. Eckstein"}`, 15, y);
  pdf.text(`Client: ${userInfo.name || "N/A"}`, 100, y);
  y += 6;
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 15, y);
  //@ts-ignore
  pdf.text(`Location: ${userInfo?.location || "Not specified"}`, 100, y);
  y += 10;

  drawDivider();

  // === CATEGORY SECTIONS ===
  const sections = [
    { title: "Air Quality Analysis", data: airAnalysis, chart: chartImages?.airChart },
    { title: "Water Quality Analysis", data: waterAnalysis, chart: chartImages?.waterChart },
    { title: "Surface Quality Analysis", data: surfaceAnalysis, chart: chartImages?.surfaceChart },
    { title: "Dust Quality Analysis", data: dustAnalysis, chart: chartImages?.dustChart },
  ];

  for (const section of sections) {
    y = await addSection(section.title, section.data, section.chart, y);
  }

  // === SUMMARY PAGE ===
  pdf.addPage();
  y = 30;
  pdf.setFontSize(16);
  pdf.setTextColor(59, 130, 246);
  pdf.text("Environmental Health Summary", pageWidth / 2, y, { align: "center" });
  y += 10;
  drawDivider(y - 5);

  const score = calculateWeightedScore(airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis);
  pdf.setFontSize(26);
  pdf.setTextColor(34, 197, 94);
  pdf.text(`${Math.round(score)} / 100`, pageWidth / 2, y + 15, { align: "center" });

  if (chartImages?.summaryChart) {
    const { width, height } = await loadImageAndFit(chartImages.summaryChart, pageWidth - 40, 90);
    pdf.addImage(chartImages.summaryChart, "PNG", 20, y + 30, width, height);
  }

  // === CARE NOTES & RECOMMENDATIONS ===
  pdf.addPage();
  let careY = 20;

  pdf.setFontSize(16);
  pdf.setTextColor(59, 130, 246);
  pdf.setFont("helvetica", "bold");
  pdf.text("Care Notes & Recommendations", 15, careY);
  careY += 10;

  pdf.setFontSize(11);
  pdf.setTextColor(80, 80, 80);
  pdf.setFont("helvetica", "normal");
  pdf.text("Important safety information based on your results", 15, careY);
  careY += 12;

  // ✅ Normal
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 197, 94);
  pdf.text("Normal Levels", 15, careY);
  careY += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  pdf.text(
    "Parameters within normal range require routine monitoring. Continue regular maintenance and testing schedules.",
    20,
    careY,
    { maxWidth: 170 },
  );
  careY += 18;

  // ⚠️ Warning
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(234, 179, 8);
  pdf.text("Warning Levels", 15, careY);
  careY += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  pdf.text(
    "Elevated parameters require attention. Investigate sources, improve ventilation, and consider professional assessment. Retest within 30 days.",
    20,
    careY,
    { maxWidth: 170 },
  );
  careY += 18;

  // 🚨 High
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(239, 68, 68);
  pdf.text("High Risk Levels", 15, careY);
  careY += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(60, 60, 60);
  pdf.text(
    "Immediate action required. Contact environmental health professionals for remediation. Limit exposure until levels are reduced. Follow all safety protocols.",
    20,
    careY,
    { maxWidth: 170 },
  );
  careY += 18;

  // === NEXT STEPS ===
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(59, 130, 246);
  pdf.text("Next Steps", 15, careY);
  careY += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(239, 68, 68);
  pdf.text("High Risk:", 15, careY);
  pdf.setTextColor(60, 60, 60);
  pdf.text("You may want to consider contacting a certified abatement contractor.", 40, careY, { maxWidth: 150 });
  careY += 8;

  pdf.setTextColor(234, 179, 8);
  pdf.text("Warning:", 15, careY);
  pdf.setTextColor(60, 60, 60);
  pdf.text("Re-test in 3 months; ensure windows remain closed during test period.", 40, careY, { maxWidth: 150 });
  careY += 8;

  pdf.setTextColor(34, 197, 94);
  pdf.text("Normal:", 15, careY);
  pdf.setTextColor(60, 60, 60);
  pdf.text("Continue regular monitoring and maintenance schedules.", 40, careY, { maxWidth: 150 });
  careY += 20;

  // === FOOTER ===
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.text("© 2025 Toxin Testers — www.toxintesters.com", pageWidth / 2, pageHeight - 10, { align: "center" });

  // === DOWNLOAD ===
  const fileName = `toxin-report-${userInfo.name?.replace(/\s+/g, "-") || "client"}.pdf`;
  pdf.save(fileName);

  // --- Helper Functions ---
  function drawDivider(yPos = y) {
    pdf.setDrawColor(230, 230, 230);
    pdf.line(15, yPos, pageWidth - 15, yPos);
  }
  //@ts-ignore
  async function addSection(title: string, data: any, chart?: string, startY: number) {
    let y = startY + 10;

    // Section title background
    pdf.setFillColor(243, 244, 246);
    pdf.rect(0, y - 6, pageWidth, 10, "F");
    pdf.setFontSize(13);
    pdf.setTextColor(59, 130, 246);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, 15, y);

    y += 6;
    drawDivider(y);

    // Table-style layout
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    y += 8;

    const entries = Object.entries(data);
    for (let i = 0; i < entries.length; i++) {
      const [key, val] = entries[i];
      const label = key.replace(/([A-Z])/g, " $1").trim();

      if (y > pageHeight - 40) {
        pdf.addPage();
        y = 25;
      }

      // Alternate row shading
      if (i % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(10, y - 4, pageWidth - 20, 9, "F");
      }
      //@ts-ignore
      const riskColor = getRiskColor(val.level);
      pdf.setTextColor(riskColor.r, riskColor.g, riskColor.b);
      pdf.text(`${label.toUpperCase()}`, 15, y);
      //@ts-ignore
      pdf.text(`${val.value} (${val.level.toUpperCase()})`, 100, y, { align: "left" });

      pdf.setFontSize(9);
      pdf.setTextColor(90, 90, 90);
      //@ts-ignore
      pdf.text(val.message, 20, y + 5);
      pdf.setFontSize(10);
      y += 10;
    }

    // Chart
    if (chart) {
      y += 5;
      const { width, height } = await loadImageAndFit(chart, pageWidth - 50, 70);
      pdf.addImage(chart, "PNG", 25, y, width, height);
      y += height + 10;
    }

    drawDivider(y);
    return y;
  }

  async function loadImageAndFit(image: string, maxWidth: number, maxHeight: number) {
    const img = new Image();
    img.src = image;
    await img.decode();
    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
    return { width: img.width * ratio, height: img.height * ratio };
  }

  function getRiskColor(level: RiskLevel) {
    switch (level) {
      case "high":
        return { r: 239, g: 68, b: 68 };
      case "warning":
        return { r: 234, g: 179, b: 8 };
      default:
        return { r: 34, g: 197, b: 94 };
    }
  }

  function calculateCategoryScore(analysis: Record<string, { level: RiskLevel }>): number {
    const levels = Object.values(analysis).map((a) => a.level);
    const scores = levels.map((l) => (l === "normal" ? 100 : l === "warning" ? 60 : 20));
    return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }

  function calculateWeightedScore(
    air: Record<string, { level: RiskLevel }>,
    water: Record<string, { level: RiskLevel }>,
    surface: Record<string, { level: RiskLevel }>,
    dust: Record<string, { level: RiskLevel }>,
  ) {
    const airScore = calculateCategoryScore(air);
    const waterScore = calculateCategoryScore(water);
    const surfaceScore = calculateCategoryScore(surface);
    const dustScore = calculateCategoryScore(dust);
    return airScore * 0.3 + waterScore * 0.3 + surfaceScore * 0.2 + dustScore * 0.2;
  }
}
