export interface WebhookRequest {
  report_type: "environmental_report";
  report_data: {
    userInfo: any;
    airAnalysis: any;
    waterAnalysis: any;
    surfaceAnalysis: any;
    dustAnalysis: any;
    summaryData: any;
  };
}

export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const callWebhook = async (
  reportData: {
    userInfo: any;
    airAnalysis: any;
    waterAnalysis: any;
    surfaceAnalysis: any;
    dustAnalysis: any;
    summaryData: any;
  }
): Promise<WebhookResponse> => {
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