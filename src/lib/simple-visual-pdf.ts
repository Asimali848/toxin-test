import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { UserInfo } from "./types";

// Helper function to convert oklch/oklab colors by setting inline styles
function convertOklchColors(element: HTMLElement): Map<HTMLElement, string> {
  const originalStyles = new Map<HTMLElement, string>();
  const allElements = [element, ...Array.from(element.querySelectorAll("*"))];

  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const computed = window.getComputedStyle(htmlEl);

    // Store original inline style
    originalStyles.set(htmlEl, htmlEl.getAttribute("style") || "");

    // Force inline styles for all color properties to override oklch
    const properties = [
      "color",
      "backgroundColor",
      "borderColor",
      "borderTopColor",
      "borderRightColor",
      "borderBottomColor",
      "borderLeftColor",
      "fill",
      "stroke",
    ];

    properties.forEach((prop) => {
      const value = computed.getPropertyValue(prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`));
      if (value && (value.includes("oklch") || value.includes("oklab"))) {
        // Extract RGB values from computed style
        const rgb = value.match(/\d+(\.\d+)?/g);
        if (rgb && rgb.length >= 3) {
          const r = Math.round(Number.parseFloat(rgb[0]));
          const g = Math.round(Number.parseFloat(rgb[1]));
          const b = Math.round(Number.parseFloat(rgb[2]));
          const a = rgb[3] ? Number.parseFloat(rgb[3]) : 1;

          // Set as inline style with !important to override
          if (a < 1) {
            htmlEl.style.setProperty(
              prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
              `rgba(${r}, ${g}, ${b}, ${a})`,
              "important",
            );
          } else {
            htmlEl.style.setProperty(
              prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
              `rgb(${r}, ${g}, ${b})`,
              "important",
            );
          }
        }
      }
    });
  });

  return originalStyles;
}

// Helper function to restore original styles
function restoreOriginalStyles(originalStyles: Map<HTMLElement, string>) {
  originalStyles.forEach((originalStyle, element) => {
    if (originalStyle) {
      element.setAttribute("style", originalStyle);
    } else {
      element.removeAttribute("style");
    }
  });
}

export async function generateSimpleVisualPDF(
  dashboardElement: HTMLElement,
  userInfo: UserInfo,
): Promise<{ pdfData: string; fileName: string; save: () => void }> {
  try {
    // Wait a bit for everything to render
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const originalStyles = convertOklchColors(dashboardElement);

    // Wait a bit for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Simple html2canvas with minimal options and onclone callback
    const canvas = await html2canvas(dashboardElement, {
      scale: 0.75,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc) => {
        // Hide unwanted UI elements
        const navbar = clonedDoc.querySelector("nav");
        if (navbar) navbar.style.display = "none";

        // Remove any buttons or interactive elements
        const buttons = clonedDoc.querySelectorAll("button");
        buttons.forEach((btn) => {
          if (btn.textContent?.includes("New Test") || btn.textContent?.includes("Generating")) {
            btn.style.display = "none";
          }
        });

        // Convert oklch colors and fix chart rendering in the cloned document
        const clonedElements = clonedDoc.querySelectorAll("*");
        clonedElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          const computed = window.getComputedStyle(htmlEl);

          // Fix all backgrounds to be white or transparent
          if (
            htmlEl.classList.contains("recharts-wrapper") ||
            htmlEl.classList.contains("recharts-surface") ||
            htmlEl.classList.contains("recharts-responsive-container") ||
            htmlEl.tagName === "svg" ||
            htmlEl.classList.contains("chart-container")
          ) {
            htmlEl.style.backgroundColor = "#ffffff";
            htmlEl.style.setProperty("background-color", "#ffffff", "important");
          }

          // Fix ALL black backgrounds aggressively
          const bgColor = computed.backgroundColor;
          if (
            bgColor === "rgb(0, 0, 0)" ||
            bgColor === "black" ||
            bgColor.includes("black") ||
            bgColor === "#000000" ||
            bgColor === "#000" ||
            bgColor === "rgba(0, 0, 0, 1)" ||
            bgColor === "rgba(0, 0, 0, 0)"
          ) {
            htmlEl.style.backgroundColor = "#ffffff";
            htmlEl.style.setProperty("background-color", "#ffffff", "important");
          }

          // Also check for any dark backgrounds and convert to white
          if ((bgColor && bgColor.match(/rgb\(0,\s*0,\s*0\)/)) || (bgColor && bgColor.match(/rgba\(0,\s*0,\s*0/))) {
            htmlEl.style.backgroundColor = "#ffffff";
            htmlEl.style.setProperty("background-color", "#ffffff", "important");
          }

          // Convert oklch colors
          const colorProps = [
            "color",
            "backgroundColor",
            "borderColor",
            "borderTopColor",
            "borderRightColor",
            "borderBottomColor",
            "borderLeftColor",
            "fill",
            "stroke",
          ];

          colorProps.forEach((prop) => {
            const cssProperty = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
            const value = computed.getPropertyValue(cssProperty);

            if (value && (value.includes("oklch") || value.includes("oklab"))) {
              // Extract RGB values
              const rgb = value.match(/\d+(\.\d+)?/g);
              if (rgb && rgb.length >= 3) {
                const r = Math.round(Number.parseFloat(rgb[0]));
                const g = Math.round(Number.parseFloat(rgb[1]));
                const b = Math.round(Number.parseFloat(rgb[2]));
                const a = rgb[3] ? Number.parseFloat(rgb[3]) : 1;

                const rgbValue = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
                htmlEl.style.setProperty(cssProperty, rgbValue, "important");
              }
            }
          });
        });

        // Force chart re-rendering by adding a comprehensive style element
        const style = clonedDoc.createElement("style");
        style.textContent = `
          nav { display: none !important; }
          button[class*="new-test"], button[class*="generating"] { display: none !important; }
          
          /* Force white backgrounds on everything except chart elements */
          *, *::before, *::after {
            background-color: #ffffff !important;
          }
          
          /* Exception: Don't override chart fill colors */
          .recharts-bar-rectangle, .recharts-bar, rect[fill], path[fill] {
            background-color: transparent !important;
          }
          
          /* Chart specific styling */
          .recharts-wrapper, .recharts-surface, .recharts-responsive-container, svg, .chart-container {
            background-color: #ffffff !important;
          }
          .recharts-bar-rectangle, .recharts-bar {
            background-color: transparent !important;
          }
          
          /* Preserve chart colors but fix backgrounds */
          .recharts-bar-rectangle[fill="#22c55e"] { fill: #22c55e !important; }
          .recharts-bar-rectangle[fill="#f59e0b"] { fill: #f59e0b !important; }
          .recharts-bar-rectangle[fill="#ef4444"] { fill: #ef4444 !important; }
          .recharts-bar-rectangle[fill="#6b7280"] { fill: #6b7280 !important; }
          
          /* Aggressive black background removal */
          *[style*="background-color: black"], 
          *[style*="background-color: rgb(0,0,0)"],
          *[style*="background-color: #000000"],
          *[style*="background-color: #000"],
          *[style*="background-color: rgba(0,0,0"],
          *[style*="background: black"],
          *[style*="background: rgb(0,0,0)"],
          *[style*="background: #000000"],
          *[style*="background: #000"],
          *[style*="background: rgba(0,0,0"] {
            background-color: #ffffff !important;
            background: #ffffff !important;
          }
          
          /* Body and root elements */
          body, html, #root, .min-h-screen {
            background-color: #ffffff !important;
          }
          
            /* Any remaining dark backgrounds */
            div, section, article, main, header, footer {
              background-color: #ffffff !important;
            }
            
            /* Target specific problematic elements */
            .space-y-2, .space-y-4, .space-y-6, .space-y-8,
            .gap-2, .gap-4, .gap-6, .gap-8,
            .mb-2, .mb-4, .mb-6, .mb-8,
            .mt-2, .mt-4, .mt-6, .mt-8,
            .p-2, .p-4, .p-6, .p-8,
            .rounded-lg, .rounded-md, .rounded-sm,
            .bg-muted, .bg-muted-foreground,
            .bg-card, .bg-popover, .bg-primary,
            .bg-secondary, .bg-accent, .bg-destructive {
              background-color: #ffffff !important;
            }
            
            /* Force white on any element with spacing classes */
            [class*="space-"], [class*="gap-"], [class*="mb-"], [class*="mt-"], [class*="p-"] {
              background-color: #ffffff !important;
            }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    // Restore original styles
    restoreOriginalStyles(originalStyles);

    const imgData = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG for smaller file size

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add bottom padding (60mm for very visible padding)
    const bottomPadding = 60;
    const availableHeight = pdfHeight - bottomPadding;

    // Calculate scaling with bottom padding
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scaleX = pdfWidth / imgWidth;
    const scaleY = availableHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    const x = (pdfWidth - scaledWidth) / 2;
    const y = 10; // Top margin

    pdf.addImage(imgData, "JPEG", x, y, scaledWidth, scaledHeight);

    // Generate filename
    const clientName = userInfo.name ? userInfo.name.replace(/\s+/g, "-").toLowerCase() : "client";
    const fileName = `environmental-report-${clientName}-${new Date().toISOString().split("T")[0]}.pdf`;
    return {
      pdfData: pdf.output("datauristring"),
      fileName: fileName,
      save: () => pdf.save(fileName),
    };
  } catch (error) {
    throw new Error(
      `Failed to generate simple visual PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
