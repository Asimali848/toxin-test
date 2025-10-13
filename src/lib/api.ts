import type { AnalysisResult } from "./analysis";
import type { UserInfo } from "./types";

export interface SummaryDataItem {
  category: string;
  score: number;
  fill: string;
}

export interface WebhookRequest {
  report_type: "environmental_report";
  report_data: {
    userInfo: UserInfo;
    airAnalysis: Record<string, AnalysisResult>;
    waterAnalysis: Record<string, AnalysisResult>;
    surfaceAnalysis: Record<string, AnalysisResult>;
    dustAnalysis: Record<string, AnalysisResult>;
    summaryData: SummaryDataItem[];
  };
}

export interface WebhookResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export const callWebhook = async (reportData: {
  userInfo: UserInfo;
  airAnalysis: Record<string, AnalysisResult>;
  waterAnalysis: Record<string, AnalysisResult>;
  surfaceAnalysis: Record<string, AnalysisResult>;
  dustAnalysis: Record<string, AnalysisResult>;
  summaryData: SummaryDataItem[];
}): Promise<WebhookResponse> => {
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Webhook URL not configured");
  }

  const requestBody = {
    report_type: "environmental_report",
    report_data: reportData,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send webhook",
    };
  }
};
