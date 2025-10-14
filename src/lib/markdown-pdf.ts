import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { marked } from "marked";

export async function downloadMarkdownAsPDF(markdown: string, filename: string = "document"): Promise<void> {
  try {
    const html = marked.parse(markdown) as string;

    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-99999px";
    iframe.style.top = "-99999px";
    iframe.style.width = "210mm";
    iframe.style.height = "297mm";
    iframe.style.border = "none";
    iframe.style.visibility = "hidden";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.zIndex = "-9999";

    document.body.appendChild(iframe);

    await new Promise((resolve) => {
      iframe.onload = resolve as () => void;
      iframe.src = "about:blank";
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Failed to access iframe document");
    }

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              margin: 0;
              padding: 20mm;
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000000;
              background-color: white;
            }
            * { color: #000000 !important; background-color: transparent !important; }
            img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
            h1 { font-size: 24pt; margin-top: 20px; margin-bottom: 10px; }
            h2 { font-size: 20pt; margin-top: 16px; margin-bottom: 8px; }
            h3 { font-size: 16pt; margin-top: 12px; margin-bottom: 6px; }
            table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
            table th, table td { border: 1px solid #000000; padding: 8px; }
            table th { background-color: #f0f0f0; font-weight: bold; }
          </style>
        </head>
        <body>${html}</body>
      </html>
    `);
    iframeDoc.close();

    await new Promise((resolve) => setTimeout(resolve, 200));

    const canvas = await html2canvas(iframeDoc.body as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      foreignObjectRendering: false,
    });

    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  } catch {
    throw new Error("Failed to convert markdown to PDF");
  }
}


