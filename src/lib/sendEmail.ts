// lib/sendEmail.ts
export async function sendEmailWithPDF(
  email: string,
  pdfBlob: Blob,
  fileName: string,
  userInfo: any
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("subject", "Your Environmental Test Report");
    formData.append("message", `
      Hello ${userInfo.name || "Client"},
      <br/><br/>
      Please find attached your Environmental Test Report.
      <br/><br/>
      Regards,<br/>Toxin Testers Team
    `);
    formData.append("attachment", pdfBlob, fileName);

    // Example API route — replace with your actual backend or n8n webhook URL
    const response = await fetch("https://your-n8n-webhook-url.com/send-email", {
      method: "POST",
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
}
