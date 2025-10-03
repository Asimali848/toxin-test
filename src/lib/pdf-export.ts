import jsPDF from "jspdf";
import type { RiskLevel } from "./analysis";
import type { TestData } from "./types";

export async function generatePDF(
  data: TestData,
  airAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  waterAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  surfaceAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
  dustAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("Environmental Test Results", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Air Quality Section
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Air Quality Tests", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  Object.entries(airAnalysis).forEach(([key, result]) => {
    const label = key.replace(/([A-Z])/g, " $1").trim();
    const color = getRiskColorRGB(result.level);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    pdf.setFontSize(9);
    pdf.text(`  ${result.message}`, 20, yPosition);
    pdf.setFontSize(10);
    yPosition += 7;
  });

  yPosition += 5;

  // Water Quality Section
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Water Quality Tests", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  Object.entries(waterAnalysis).forEach(([key, result]) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    const label = key.replace(/([A-Z])/g, " $1").trim();
    const color = getRiskColorRGB(result.level);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    pdf.setFontSize(9);
    pdf.text(`  ${result.message}`, 20, yPosition);
    pdf.setFontSize(10);
    yPosition += 7;
  });

  yPosition += 5;

  // Surface Quality Section
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Surface Quality Tests", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  Object.entries(surfaceAnalysis).forEach(([key, result]) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    const label = key.replace(/([A-Z])/g, " $1").trim();
    const color = getRiskColorRGB(result.level);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    pdf.setFontSize(9);
    pdf.text(`  ${result.message}`, 20, yPosition);
    pdf.setFontSize(10);
    yPosition += 7;
  });

  // Asbestos
  if (data.surface.asbestos) {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(`Asbestos: ${data.surface.asbestos}`, 20, yPosition);
    yPosition += 7;
  }

  yPosition += 5;

  // Dust Quality Section
  if (yPosition > pageHeight - 40) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Dust Quality Tests", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  Object.entries(dustAnalysis).forEach(([key, result]) => {
    const label = key.replace(/([A-Z])/g, " $1").trim();
    const color = getRiskColorRGB(result.level);
    pdf.setTextColor(color.r, color.g, color.b);
    pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
    pdf.setTextColor(0, 0, 0);
    yPosition += 5;
    pdf.setFontSize(9);
    pdf.text(`  ${result.message}`, 20, yPosition);
    pdf.setFontSize(10);
    yPosition += 7;
  });

  // Add new page for recommendations
  pdf.addPage();
  yPosition = 20;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Care Notes & Recommendations", 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 197, 94); // Green
  pdf.text("Normal Levels:", 20, yPosition);
  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const normalText = pdf.splitTextToSize(
    "Parameters within normal range require routine monitoring. Continue regular maintenance and testing schedules.",
    pageWidth - 40,
  );
  pdf.text(normalText, 20, yPosition);
  yPosition += normalText.length * 5 + 8;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(234, 179, 8); // Yellow
  pdf.text("Warning Levels:", 20, yPosition);
  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const warningText = pdf.splitTextToSize(
    "Elevated parameters require attention. Investigate sources, improve ventilation, and consider professional assessment. Retest within 30 days.",
    pageWidth - 40,
  );
  pdf.text(warningText, 20, yPosition);
  yPosition += warningText.length * 5 + 8;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(239, 68, 68); // Red
  pdf.text("High Risk Levels:", 20, yPosition);
  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const highText = pdf.splitTextToSize(
    "Immediate action required. Contact environmental health professionals for remediation. Limit exposure until levels are reduced. Follow all safety protocols.",
    pageWidth - 40,
  );
  pdf.text(highText, 20, yPosition);

  // Save the PDF
  pdf.save(`environmental-test-results-${new Date().toISOString().split("T")[0]}.pdf`);
}

function getRiskColorRGB(level: RiskLevel): { r: number; g: number; b: number } {
  switch (level) {
    case "normal":
      return { r: 34, g: 197, b: 94 }; // Green
    case "warning":
      return { r: 234, g: 179, b: 8 }; // Yellow
    case "high":
      return { r: 239, g: 68, b: 68 }; // Red
  }
}

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import type { RiskLevel } from "./analysis";
// import type { TestData } from "./types";
// import { toast } from "sonner";

// export async function generatePDF(
//   data: TestData,
//   airAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   waterAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   surfaceAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   dustAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   chartRefs: {
//     airChart: HTMLElement | null;
//     waterChart: HTMLElement | null;
//     surfaceChart: HTMLElement | null;
//     summaryChart: HTMLElement | null;
//   },
// ) {
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   let yPosition = 20;

//   // Title
//   pdf.setFontSize(20);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Environmental Test Results", pageWidth / 2, yPosition, { align: "center" });

//   yPosition += 10;
//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });

//   yPosition += 15;

//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Air Quality Tests", 15, yPosition);
//   yPosition += 8;

//   if (chartRefs.airChart) {
//     try {
//       const canvas = await html2canvas(chartRefs.airChart, {
//         backgroundColor: "#ffffff",
//         scale: 2,
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = pageWidth - 30;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 15, yPosition, imgWidth, imgHeight);
//       yPosition += imgHeight + 10;
//     } catch (_error) {
//       toast.error("Failed to generate air quality chart");
//     }
//   }

//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "normal");
//   Object.entries(airAnalysis).forEach(([key, result]) => {
//     if (yPosition > pageHeight - 20) {
//       pdf.addPage();
//       yPosition = 20;
//     }
//     const label = key.replace(/([A-Z])/g, " $1").trim();
//     const color = getRiskColorRGB(result.level);
//     pdf.setTextColor(color.r, color.g, color.b);
//     pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
//     pdf.setTextColor(0, 0, 0);
//     yPosition += 5;
//     pdf.setFontSize(9);
//     pdf.text(`  ${result.message}`, 20, yPosition);
//     pdf.setFontSize(10);
//     yPosition += 7;
//   });

//   yPosition += 5;

//   if (yPosition > pageHeight - 100) {
//     pdf.addPage();
//     yPosition = 20;
//   }

//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Water Quality Tests", 15, yPosition);
//   yPosition += 8;

//   if (chartRefs.waterChart) {
//     try {
//       const canvas = await html2canvas(chartRefs.waterChart, {
//         backgroundColor: "#ffffff",
//         scale: 2,
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = pageWidth - 30;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       if (yPosition + imgHeight > pageHeight - 20) {
//         pdf.addPage();
//         yPosition = 20;
//       }

//       pdf.addImage(imgData, "PNG", 15, yPosition, imgWidth, imgHeight);
//       yPosition += imgHeight + 10;
//     } catch (_error) {
//       toast.error("Failed to generate water quality chart");
//     }
//   }

//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "normal");
//   Object.entries(waterAnalysis).forEach(([key, result]) => {
//     if (yPosition > pageHeight - 20) {
//       pdf.addPage();
//       yPosition = 20;
//     }
//     const label = key.replace(/([A-Z])/g, " $1").trim();
//     const color = getRiskColorRGB(result.level);
//     pdf.setTextColor(color.r, color.g, color.b);
//     pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
//     pdf.setTextColor(0, 0, 0);
//     yPosition += 5;
//     pdf.setFontSize(9);
//     pdf.text(`  ${result.message}`, 20, yPosition);
//     pdf.setFontSize(10);
//     yPosition += 7;
//   });

//   yPosition += 5;

//   if (yPosition > pageHeight - 100) {
//     pdf.addPage();
//     yPosition = 20;
//   }

//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Surface Quality Tests", 15, yPosition);
//   yPosition += 8;

//   if (chartRefs.surfaceChart) {
//     try {
//       const canvas = await html2canvas(chartRefs.surfaceChart, {
//         backgroundColor: "#ffffff",
//         scale: 2,
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = pageWidth - 30;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       if (yPosition + imgHeight > pageHeight - 20) {
//         pdf.addPage();
//         yPosition = 20;
//       }

//       pdf.addImage(imgData, "PNG", 15, yPosition, imgWidth, imgHeight);
//       yPosition += imgHeight + 10;
//     } catch (_error) {
//       toast.error("Failed to generate surface quality chart");
//     }
//   }

//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "normal");
//   Object.entries(surfaceAnalysis).forEach(([key, result]) => {
//     if (yPosition > pageHeight - 20) {
//       pdf.addPage();
//       yPosition = 20;
//     }
//     const label = key.replace(/([A-Z])/g, " $1").trim();
//     const color = getRiskColorRGB(result.level);
//     pdf.setTextColor(color.r, color.g, color.b);
//     pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
//     pdf.setTextColor(0, 0, 0);
//     yPosition += 5;
//     pdf.setFontSize(9);
//     pdf.text(`  ${result.message}`, 20, yPosition);
//     pdf.setFontSize(10);
//     yPosition += 7;
//   });

//   // Asbestos
//   if (data.surface.asbestos) {
//     if (yPosition > pageHeight - 20) {
//       pdf.addPage();
//       yPosition = 20;
//     }
//     pdf.text(`Asbestos: ${data.surface.asbestos}`, 20, yPosition);
//     yPosition += 7;
//   }

//   yPosition += 5;

//   // Dust Quality Section
//   if (yPosition > pageHeight - 40) {
//     pdf.addPage();
//     yPosition = 20;
//   }

//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Dust Quality Tests", 15, yPosition);
//   yPosition += 8;

//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "normal");
//   Object.entries(dustAnalysis).forEach(([key, result]) => {
//     const label = key.replace(/([A-Z])/g, " $1").trim();
//     const color = getRiskColorRGB(result.level);
//     pdf.setTextColor(color.r, color.g, color.b);
//     pdf.text(`${label}: ${result.value} - ${result.level.toUpperCase()}`, 20, yPosition);
//     pdf.setTextColor(0, 0, 0);
//     yPosition += 5;
//     pdf.setFontSize(9);
//     pdf.text(`  ${result.message}`, 20, yPosition);
//     pdf.setFontSize(10);
//     yPosition += 7;
//   });

//   pdf.addPage();
//   yPosition = 20;

//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Overall Environmental Health Summary", 15, yPosition);
//   yPosition += 8;

//   if (chartRefs.summaryChart) {
//     try {
//       const canvas = await html2canvas(chartRefs.summaryChart, {
//         backgroundColor: "#ffffff",
//         scale: 2,
//       });
//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = pageWidth - 30;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 15, yPosition, imgWidth, imgHeight);
//       yPosition += imgHeight + 10;
//     } catch (_error) {
//       toast.error("Failed to generate summary chart");
//     }
//   }

//   // Add new page for recommendations
//   pdf.addPage();
//   yPosition = 20;

//   pdf.setFontSize(14);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Care Notes & Recommendations", 15, yPosition);
//   yPosition += 10;

//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "bold");
//   pdf.setTextColor(34, 197, 94); // Green
//   pdf.text("Normal Levels:", 20, yPosition);
//   yPosition += 6;
//   pdf.setFont("helvetica", "normal");
//   pdf.setTextColor(0, 0, 0);
//   const normalText = pdf.splitTextToSize(
//     "Parameters within normal range require routine monitoring. Continue regular maintenance and testing schedules.",
//     pageWidth - 40,
//   );
//   pdf.text(normalText, 20, yPosition);
//   yPosition += normalText.length * 5 + 8;

//   pdf.setFont("helvetica", "bold");
//   pdf.setTextColor(234, 179, 8); // Yellow
//   pdf.text("Warning Levels:", 20, yPosition);
//   yPosition += 6;
//   pdf.setFont("helvetica", "normal");
//   pdf.setTextColor(0, 0, 0);
//   const warningText = pdf.splitTextToSize(
//     "Elevated parameters require attention. Investigate sources, improve ventilation, and consider professional assessment. Retest within 30 days.",
//     pageWidth - 40,
//   );
//   pdf.text(warningText, 20, yPosition);
//   yPosition += warningText.length * 5 + 8;

//   pdf.setFont("helvetica", "bold");
//   pdf.setTextColor(239, 68, 68); // Red
//   pdf.text("High Risk Levels:", 20, yPosition);
//   yPosition += 6;
//   pdf.setFont("helvetica", "normal");
//   pdf.setTextColor(0, 0, 0);
//   const highText = pdf.splitTextToSize(
//     "Immediate action required. Contact environmental health professionals for remediation. Limit exposure until levels are reduced. Follow all safety protocols.",
//     pageWidth - 40,
//   );
//   pdf.text(highText, 20, yPosition);

//   // Save the PDF
//   pdf.save(`environmental-test-results-${new Date().toISOString().split("T")[0]}.pdf`);
// }

// function getRiskColorRGB(level: RiskLevel): { r: number; g: number; b: number } {
//   switch (level) {
//     case "normal":
//       return { r: 34, g: 197, b: 94 }; // Green
//     case "warning":
//       return { r: 234, g: 179, b: 8 }; // Yellow
//     case "high":
//       return { r: 239, g: 68, b: 68 }; // Red
//   }
// }
