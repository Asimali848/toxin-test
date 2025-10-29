import { type ClassValue, clsx } from "clsx";
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { twMerge } from "tailwind-merge";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf: PDFDocumentProxy = await loadingTask.promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    fullText += `${pageText}\n\n`;
  }

  return fullText.trim();
}
