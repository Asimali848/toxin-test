import jsPDF from "jspdf";

import type { RiskLevel } from "./analysis";
import type { UserInfo } from "./types";

// type RiskLevel = "normal" | "warning" | "high";
// type UserInfo = {
//   name?: string;
//   email?: string;
//   phoneNumber?: string;
//   address?: string;
//   inspectionDate?: string;
//   inspector?: string;
// };

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
  let yPosition = 20;

  // Header with Toxin Testers branding
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 130, 246); // Blue color
  pdf.text("Toxin Testers", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 8;
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Environmental Test Results", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 6;
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text("Comprehensive analysis of all test categories", pageWidth / 2, yPosition, { align: "center" });

  yPosition += 15;

  // Report Header Block
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  // Draw header box
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(248, 249, 250);
  pdf.rect(15, yPosition, pageWidth - 30, 25, "FD");

  yPosition += 5;
  pdf.setFont("helvetica", "bold");
  pdf.text("Property:", 20, yPosition);
  pdf.setFont("helvetica", "normal");
  pdf.text(userInfo.address || "Not specified", 45, yPosition);

  pdf.text("Date:", 20, yPosition + 4);
  pdf.text(
    userInfo.inspectionDate
      ? new Date(userInfo.inspectionDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    45,
    yPosition + 4,
  );

  pdf.text("Inspector:", 20, yPosition + 8);
  pdf.text(userInfo.inspector || "M. Eckstein", 45, yPosition + 8);

  pdf.text("Report ID:", 20, yPosition + 12);
  pdf.text(`TT-2025-${Math.floor(Math.random() * 9000) + 1000}`, 45, yPosition + 12);

  yPosition += 30;

  // Client Information Section
  if (userInfo.name) {
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Client Information", 15, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Name: ${userInfo.name}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Email: ${userInfo.email}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Address: ${userInfo.address}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Phone: ${userInfo.phoneNumber}`, 20, yPosition);
    yPosition += 10;
  }

  // Report Date
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Report Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" });
  yPosition += 15;

  // Client Message
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Dear Valued Client,", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const clientMessage = pdf.splitTextToSize(
    "Thank you for choosing our environmental testing services. We are pleased to present your comprehensive environmental health report. This detailed analysis provides insights into the air quality, water safety, surface conditions, and dust levels in your environment. Our team of certified environmental professionals has conducted thorough testing to ensure your health and safety.",
    pageWidth - 30,
  );
  pdf.text(clientMessage, 15, yPosition);
  yPosition += clientMessage.length * 4 + 10;

  // Add page break if needed
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = 20;
  }

  // Add sections with charts
  await addSectionWithChart("Air Quality Analysis", airAnalysis, chartImages?.airChart);
  await addSectionWithChart("Water Quality Analysis", waterAnalysis, chartImages?.waterChart);
  await addSectionWithChart("Surface Quality Analysis", surfaceAnalysis, chartImages?.surfaceChart);
  await addSectionWithChart("Dust Quality Analysis", dustAnalysis, chartImages?.dustChart);

  // Summary Chart
  if (chartImages?.summaryChart) {
    if (yPosition > pageHeight - 120) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Environmental Health Summary", 15, yPosition);
    yPosition += 8;

    // Environmental Health Score
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(59, 130, 246);
    pdf.text("Environmental Health Score", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;

    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    const weightedScore = calculateWeightedScore(airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis);
    pdf.text(`${Math.round(weightedScore)}/100`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Weighted average: Air & Water (30% each), Surface & Dust (20% each)", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text("Overall environmental health scores across all test categories", 15, yPosition);
    yPosition += 10;

    try {
      const fitted = await loadImageAndFit(chartImages.summaryChart, pageWidth - 50, 80);
      pdf.addImage(chartImages.summaryChart, "PNG", 25, yPosition, fitted.width, fitted.height);
      yPosition += fitted.height + 10;
    } catch (_error) {
      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text("Summary chart could not be displayed", 25, yPosition);
      pdf.setTextColor(0, 0, 0);
      yPosition += 30;
    }
  }

  async function addSectionWithChart(
    title: string,
    data: Record<string, { value: number; level: RiskLevel; message: string }>,
    chartImage?: string,
  ) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, 15, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    // Add threshold references based on section
    if (title.includes("Air Quality")) {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Thresholds: CO₂ ≤1000 ppm, CO ≤9 ppm, PM 2.5 ≤12 µg/m³, RH 40-55%", 20, yPosition);
      yPosition += 5;
      pdf.setTextColor(0, 0, 0);
    } else if (title.includes("Water Quality")) {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("MCL Standards: Lead 15 ppb, Arsenic 10 ppb, PFAS 4 ppt", 20, yPosition);
      yPosition += 5;
      pdf.setTextColor(0, 0, 0);
    } else if (title.includes("Surface Quality")) {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Thresholds: Lead Paint ≥0.5 mg/cm² (NYC Local Law 31), Mold >500 CFU/cm²", 20, yPosition);
      yPosition += 5;
      pdf.setTextColor(0, 0, 0);
    } else if (title.includes("Dust Quality")) {
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("EPA Clearance: Floor <10 µg/ft², Sill <100 µg/ft², Trough <400 µg/ft²", 20, yPosition);
      yPosition += 5;
      pdf.setTextColor(0, 0, 0);
    }

    Object.entries(data).forEach(([key, result]) => {
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

    // Add chart if available
    if (chartImage) {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("Visual Analysis:", 28, yPosition);
      yPosition += 12;

      try {
        const fitted = await loadImageAndFit(chartImage, pageWidth - 50, 60);
        pdf.addImage(chartImage, "PNG", 25, yPosition, fitted.width, fitted.height);
        yPosition += fitted.height + 10;
      } catch (_error) {
        pdf.setFontSize(12);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont("helvetica", "normal");
        pdf.text("Chart could not be displayed", 25, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 20;
      }
    } else {
      // Add a simple text-based chart representation
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      yPosition += 5;
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("Data Summary:", 20, yPosition);
      yPosition += 8;

      // Create a simple text-based representation
      Object.entries(data).forEach(([key, result]) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        const label = key.replace(/([A-Z])/g, " $1").trim();
        const color = getRiskColorRGB(result.level);
        pdf.setTextColor(color.r, color.g, color.b);
        pdf.setFont("helvetica", "normal");
        pdf.text(`• ${label}: ${result.value} (${result.level.toUpperCase()})`, 25, yPosition);
        pdf.setTextColor(0, 0, 0);
        yPosition += 5;
      });
      yPosition += 10;
    }

    yPosition += 5;
  }

  // Recommendations Page
  pdf.addPage();
  yPosition = 20;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Care Notes & Recommendations", 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 197, 94);
  pdf.text("✅ Normal Levels:", 20, yPosition);
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
  pdf.setTextColor(234, 179, 8);
  pdf.text("⚠️ Warning Levels:", 20, yPosition);
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
  pdf.setTextColor(239, 68, 68);
  pdf.text("🚨 High Risk Levels:", 20, yPosition);
  yPosition += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const highText = pdf.splitTextToSize(
    "Immediate action required. Contact environmental health professionals for remediation. Limit exposure until levels are reduced. Follow all safety protocols.",
    pageWidth - 40,
  );
  pdf.text(highText, 20, yPosition);
  yPosition += highText.length * 5 + 15;

  // Next Steps Section
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(59, 130, 246);
  pdf.text("Next Steps", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(239, 68, 68);
  pdf.text("🚨 High Risk:", 20, yPosition);
  yPosition += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const highRiskSteps = pdf.splitTextToSize(
    "You may want to consider contacting a certified abatement contractor.",
    pageWidth - 40,
  );
  pdf.text(highRiskSteps, 20, yPosition);
  yPosition += highRiskSteps.length * 4 + 6;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(234, 179, 8);
  pdf.text("⚠️ Warning:", 20, yPosition);
  yPosition += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const warningSteps = pdf.splitTextToSize(
    "Re-test in 3 months; ensure windows remain closed during test period.",
    pageWidth - 40,
  );
  pdf.text(warningSteps, 20, yPosition);
  yPosition += warningSteps.length * 4 + 6;

  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(34, 197, 94);
  pdf.text("✅ Normal:", 20, yPosition);
  yPosition += 5;
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0, 0, 0);
  const normalSteps = pdf.splitTextToSize("Continue regular monitoring and maintenance schedules.", pageWidth - 40);
  pdf.text(normalSteps, 20, yPosition);
  yPosition += normalSteps.length * 4 + 15;

  // Thank You Message
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Thank You for Your Trust", 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const thankYouMessage = pdf.splitTextToSize(
    "We appreciate your commitment to environmental health and safety. Our team is dedicated to providing accurate, reliable testing services to help you maintain a healthy living environment. If you have any questions about this report or need additional testing services, please don't hesitate to contact us. We look forward to continuing to serve your environmental health needs.",
    pageWidth - 30,
  );
  pdf.text(thankYouMessage, 15, yPosition);
  yPosition += thankYouMessage.length * 4 + 15;

  // Contact Information
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Contact Information:", 15, yPosition);
  yPosition += 6;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text("Toxin Testers", 15, yPosition);
  yPosition += 4;
  pdf.text("Email:  info@toxintesters.com", 15, yPosition);
  yPosition += 4;
  pdf.text("Website: www.toxintesters.com", 15, yPosition);

  // Footer
  yPosition = pageHeight - 20;
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(128, 128, 128);
  pdf.text("This report is confidential and intended solely for the client named above.", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 4;
  pdf.text("© 2024 Toxin Testers. All rights reserved.", pageWidth / 2, yPosition, { align: "center" });

  // Generate filename with client name
  const clientName = userInfo.name ? userInfo.name.replace(/\s+/g, "-").toLowerCase() : "client";
  const fileName = `environmental-report-${clientName}-${new Date().toISOString().split("T")[0]}.pdf`;

  // Return PDF data for email sending
  return {
    pdfData: pdf.output("datauristring"),
    fileName: fileName,
    save: () => pdf.save(fileName),
  };
}

// export async function generatePDF(
//   airAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   waterAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   surfaceAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   dustAnalysis: Record<string, { value: number; level: RiskLevel; message: string }>,
//   userInfo: UserInfo,
//   chartImages?: {
//     airChart?: string;
//     waterChart?: string;
//     surfaceChart?: string;
//     dustChart?: string;
//     summaryChart?: string;
//   },
// ) {
//   const pdf = new jsPDF("p", "mm", "a4");
//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();
//   let yPosition = 20;

//   // === 🟦 HEADER / BRANDING ===
//   pdf.setDrawColor(59, 130, 246);
//   pdf.setLineWidth(1);
//   pdf.line(15, yPosition - 10, pageWidth - 15, yPosition - 10);

//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(28);
//   pdf.setTextColor(59, 130, 246);
//   pdf.text("TOXIN TESTERS", pageWidth / 2, yPosition, { align: "center" });

//   yPosition += 10;
//   pdf.setFontSize(16);
//   pdf.setTextColor(0, 0, 0);
//   pdf.text("Environmental Health Analysis Report", pageWidth / 2, yPosition, { align: "center" });

//   yPosition += 5;
//   pdf.setFontSize(10);
//   pdf.setTextColor(120, 120, 120);
//   pdf.text("Comprehensive Testing & Evaluation", pageWidth / 2, yPosition, { align: "center" });

//   yPosition += 15;

//   // === 📋 REPORT HEADER BLOCK ===
//   pdf.setDrawColor(220, 220, 220);
//   pdf.setFillColor(248, 249, 250);
//   pdf.roundedRect(15, yPosition, pageWidth - 30, 28, 3, 3, "FD");
//   yPosition += 7;

//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "bold");
//   pdf.setTextColor(0, 0, 0);
//   pdf.text("Property:", 20, yPosition);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(userInfo.address || "Not specified", 45, yPosition);

//   yPosition += 5;
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Inspector:", 20, yPosition);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(userInfo.inspector || "M. Eckstein", 45, yPosition);

//   yPosition += 5;
//   pdf.setFont("helvetica", "bold");
//   pdf.text("Date:", 20, yPosition);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(
//     userInfo.inspectionDate
//       ? new Date(userInfo.inspectionDate).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         })
//       : new Date().toLocaleDateString("en-US"),
//     45,
//     yPosition,
//   );

//   yPosition += 10;

//   // === 👤 CLIENT DETAILS CARD ===
//   if (userInfo.name) {
//     pdf.setDrawColor(200, 200, 200);
//     pdf.setFillColor(255, 255, 255);
//     pdf.roundedRect(15, yPosition, pageWidth - 30, 30, 3, 3, "FD");
//     yPosition += 7;

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(12);
//     pdf.text("Client Information", 20, yPosition);
//     yPosition += 5;

//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(10);
//     pdf.text(`Name: ${userInfo.name}`, 25, yPosition);
//     yPosition += 5;
//     pdf.text(`Email: ${userInfo.email}`, 25, yPosition);
//     yPosition += 5;
//     pdf.text(`Phone: ${userInfo.phoneNumber}`, 25, yPosition);
//     yPosition += 5;
//     pdf.text(`Address: ${userInfo.address}`, 25, yPosition);
//     yPosition += 10;
//   }

//   // === 💬 INTRO MESSAGE ===
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(12);
//   pdf.text("Dear Valued Client,", 15, yPosition);
//   yPosition += 6;
//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(10);
//   pdf.setTextColor(60, 60, 60);
//   const introText = pdf.splitTextToSize(
//     "We are pleased to share your comprehensive environmental health report, covering key environmental parameters—air, water, surface, and dust. This analysis highlights potential risks, ensures compliance with EPA guidelines, and promotes safer living and working spaces.",
//     pageWidth - 30,
//   );
//   pdf.text(introText, 15, yPosition);
//   yPosition += introText.length * 5 + 10;

//   // === 📊 CATEGORY SECTIONS ===
//   const sections = [
//     { title: "Air Quality Analysis", data: airAnalysis, chart: chartImages?.airChart },
//     { title: "Water Quality Analysis", data: waterAnalysis, chart: chartImages?.waterChart },
//     { title: "Surface Quality Analysis", data: surfaceAnalysis, chart: chartImages?.surfaceChart },
//     { title: "Dust Quality Analysis", data: dustAnalysis, chart: chartImages?.dustChart },
//   ];

//   for (const section of sections) {
//     await addSection(section.title, section.data, section.chart);
//   }

//   // === 🌍 SUMMARY PAGE ===
//   pdf.addPage();
//   yPosition = 20;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(14);
//   pdf.setTextColor(59, 130, 246);
//   pdf.text("Environmental Health Summary", 15, yPosition);
//   yPosition += 8;

//   const score = calculateWeightedScore(airAnalysis, waterAnalysis, surfaceAnalysis, dustAnalysis);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(30);
//   pdf.setTextColor(34, 197, 94);
//   pdf.text(`${Math.round(score)}/100`, pageWidth / 2, yPosition, { align: "center" });
//   yPosition += 15;

//   pdf.setFontSize(10);
//   pdf.setTextColor(80, 80, 80);
//   pdf.text("Weighted score: Air & Water (30%), Surface & Dust (20%)", pageWidth / 2, yPosition, { align: "center" });
//   yPosition += 10;

//   if (chartImages?.summaryChart) {
//     const fitted = await loadImageAndFit(chartImages.summaryChart, pageWidth - 50, 80);
//     pdf.addImage(chartImages.summaryChart, "PNG", 25, yPosition, fitted.width, fitted.height);
//     yPosition += fitted.height + 10;
//   }

//   // === 🧠 RECOMMENDATIONS ===
//   pdf.addPage();
//   yPosition = 20;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(14);
//   pdf.text("Recommendations & Care Notes", 15, yPosition);
//   yPosition += 10;
//   //@ts-ignore
//   addRecommendation("✅ Normal Levels", "34,197,94", "Maintain regular cleaning, ventilation, and yearly re-testing.");
//   //@ts-ignore
//   addRecommendation(
//     "⚠️ Warning Levels",
//     "234,179,8",
//     "Investigate possible contamination sources. Increase ventilation and schedule re-test within 30 days."
//   );
//   //@ts-ignore
//   addRecommendation(
//     "🚨 High Risk Levels",
//     "239,68,68",
//     "Immediate remediation required. Contact a certified environmental health specialist for urgent action."
//   );

//   // === 📞 CONTACT FOOTER ===
//   yPosition = pageHeight - 25;
//   pdf.setFontSize(8);
//   pdf.setTextColor(100, 100, 100);
//   pdf.text("Toxin Testers • www.toxintesters.com • info@toxintesters.com", pageWidth / 2, yPosition, { align: "center" });
//   yPosition += 5;
//   pdf.text("© 2025 Toxin Testers. All rights reserved.", pageWidth / 2, yPosition, { align: "center" });

//   // === 🧾 FILE NAME ===
//   const clientName = userInfo.name ? userInfo.name.replace(/\s+/g, "-").toLowerCase() : "client";
//   const fileName = `environmental-report-${clientName}-${new Date().toISOString().split("T")[0]}.pdf`;

//   return {
//     pdfData: pdf.output("datauristring"),
//     fileName,
//     save: () => pdf.save(fileName),
//   };

//   // --- Helper Functions ---
//   async function addSection(title: string, data: any, chartImage?: string) {
//     if (yPosition > pageHeight - 80) {
//       pdf.addPage();
//       yPosition = 20;
//     }

//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(13);
//     pdf.setTextColor(59, 130, 246);
//     pdf.text(title, 15, yPosition);
//     yPosition += 6;

//     pdf.setFont("helvetica", "normal");
//     pdf.setTextColor(0, 0, 0);
//     pdf.setFontSize(10);
//     // Object.entries(data).forEach(([key, val]) => {
//     //   const color = getRiskColorRGB(val.level);
//     //   pdf.setTextColor(color.r, color.g, color.b);
//     //   pdf.text(`${key}: ${val.value} (${val.level.toUpperCase()})`, 20, yPosition);
//     //   pdf.setFontSize(9);
//     //   pdf.setTextColor(60, 60, 60);
//     //   pdf.text(`↳ ${val.message}`, 25, yPosition + 4);
//     //   yPosition += 8;
//     //   pdf.setFontSize(10);
//     // });
//     for (const [key, val] of Object.entries(data)) {
//       const label = key.replace(/([A-Z])/g, " $1").trim();
//       //@ts-ignore
//       const color = getRiskColorRGB(val.level);
//       pdf.setTextColor(color.r, color.g, color.b);
//       //@ts-ignore
//       pdf.text(`${label}: ${val.value} - ${val.level.toUpperCase()}`, 20, yPosition);
//       pdf.setTextColor(0, 0, 0);
//       yPosition += 5;
//       pdf.setFontSize(9);
//       //@ts-ignore
//       pdf.text(`  ${val.message}`, 20, yPosition);

//     if (chartImage) {
//       const fitted = await loadImageAndFit(chartImage, pageWidth - 50, 60);
//       pdf.addImage(chartImage, "PNG", 25, yPosition, fitted.width, fitted.height);
//       yPosition += fitted.height + 8;
//     }
//   }

//   function _addRecommendation(title: string, color: string, text: string) {
//     const [r, g, b] = color.split(",").map(Number);
//     pdf.setFont("helvetica", "bold");
//     pdf.setTextColor(r, g, b);
//     pdf.setFontSize(11);
//     pdf.text(title, 20, yPosition);
//     yPosition += 5;

//     pdf.setFont("helvetica", "normal");
//     pdf.setTextColor(0, 0, 0);
//     pdf.setFontSize(9);
//     const split = pdf.splitTextToSize(text, pageWidth - 40);
//     pdf.text(split, 25, yPosition);
//     yPosition += split.length * 5 + 6;
//   }

//   function getRiskColorRGB(level: RiskLevel) {
//     switch (level) {
//       case "high":
//         return { r: 239, g: 68, b: 68 };
//       case "warning":
//         return { r: 234, g: 179, b: 8 };
//       default:
//         return { r: 34, g: 197, b: 94 };
//     }
//   }

//   async function loadImageAndFit(image: string, maxWidth: number, maxHeight: number) {
//     const img = new Image();
//     img.src = image;
//     await img.decode();
//     const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
//     return { width: img.width * ratio, height: img.height * ratio };
//   }

//   function _calculateWeightedScore(
//     air: Record<string, any>,
//     water: Record<string, any>,
//     surface: Record<string, any>,
//     dust: Record<string, any>,
//   ) {
//     const avg = (obj: any) =>
//       // Object.values(obj).reduce((sum: any, val: any) => sum + val.value, 0) / Object.keys(obj).length || 0;
//       Object.values(obj)
//         .map((a: any) => {
//           switch (a.level) {
//             case "normal":
//               return 100;
//             case "warning":
//               return 60;
//             case "high":
//               return 20;
//             default:
//               return 0;
//           }
//         })
//         .reduce((a: number, b: number) => a + b, 0) / Object.keys(obj).length || 0;
//     return avg(air) * 0.3 + avg(water) * 0.3 + avg(surface) * 0.2 + avg(dust) * 0.2;
//   }
// }

async function _sendEmailWithPDF(
  email: string,
  pdfData: string,
  fileName: string,
  userInfo: UserInfo,
): Promise<boolean> {
  try {
    // Convert data URI to blob
    const response = await fetch(pdfData);
    const blob = await response.blob();

    // Create FormData for email service
    const formData = new FormData();
    formData.append("email", email);
    formData.append("subject", `Environmental Test Report - ${userInfo.name || "Client"}`);
    formData.append(
      "body",
      `
Dear ${userInfo.name || "Valued Client"},

Thank you for using our environmental testing services. Please find attached your comprehensive environmental health report.

This report contains detailed analysis of:
- Air Quality Tests
- Water Quality Tests  
- Surface Quality Tests
- Dust Quality Tests

If you have any questions about this report, please don't hesitate to contact us.

Best regards,
Toxin Testers Team
    `,
    );
    formData.append("attachment", blob, fileName);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return true;
  } catch (_error) {
    return false;
  }
}

export function getRiskColorRGB(level: RiskLevel): { r: number; g: number; b: number } {
  switch (level) {
    case "normal":
      return { r: 34, g: 197, b: 94 };
    case "warning":
      return { r: 234, g: 179, b: 8 };
    case "high":
      return { r: 239, g: 68, b: 68 };
  }
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
  return scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
}

function calculateWeightedScore(
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

export function getRiskColor(level: RiskLevel): string {
  return `rgb(${getRiskColorRGB(level).r}, ${getRiskColorRGB(level).g}, ${getRiskColorRGB(level).b})`;
}

// Helper: load an image data URL and compute fitted width/height in mm preserving aspect ratio
async function loadImageAndFit(
  dataUrl: string | undefined,
  maxWidthMm: number,
  maxHeightMm: number,
): Promise<{ width: number; height: number }> {
  if (!dataUrl) throw new Error("No image data");
  // Create image element to measure natural size
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = (e) => reject(e);
    i.src = dataUrl;
  });

  // jsPDF uses mm units here. Convert px to mm using 96 DPI (px per inch) and 25.4 mm per inch
  const pxToMm = (px: number) => (px / 96) * 25.4;
  const naturalW = pxToMm(img.naturalWidth || img.width);
  const naturalH = pxToMm(img.naturalHeight || img.height);

  // Compute scale to fit inside maxWidthMm x maxHeightMm while preserving aspect
  const scale = Math.min(maxWidthMm / naturalW, maxHeightMm / naturalH, 1);
  return { width: naturalW * scale, height: naturalH * scale };
}
