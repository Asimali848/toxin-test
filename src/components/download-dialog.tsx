// import { Download, Mail, Send } from "lucide-react";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface DownloadDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSimpleDownload: () => void;
//   isGeneratingPDF: boolean;
// }

// export function DownloadDialog({
//   open,
//   onOpenChange,
//   onSimpleDownload,
//   isGeneratingPDF,
// }: DownloadDialogProps) {
//   const [email, setEmail] = useState("");
//   const [isEmailValid, setIsEmailValid] = useState(false);

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const handleEmailChange = (value: string) => {
//     setEmail(value);
//     setIsEmailValid(validateEmail(value));
//   };

//   const handleSimpleDownload = () => {
//     onSimpleDownload();
//     onOpenChange(false);
//   };

//   const handleEmailDownload = () => {
//     if (!isEmailValid) {
//       toast.error("Please enter a valid email address");
//       return;
//     }
//     onOpenChange(false);
//     setEmail("");
//     setIsEmailValid(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Download className="h-5 w-5" />
//             Download Report
//           </DialogTitle>
//           <DialogDescription>Choose how you would like to receive your environmental test report.</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           <div className="space-y-3">
//             <Button
//               onClick={handleSimpleDownload}
//               disabled={isGeneratingPDF}
//               className="h-12 w-full justify-start gap-3"
//               variant="outline"
//             >
//               <Download className="h-5 w-5" />
//               <div className="text-left">
//                 <div className="font-medium">Simple Download</div>
//                 <div className="text-muted-foreground text-sm">Download PDF directly to your device</div>
//               </div>
//             </Button>

//             <div className="space-y-3">
//               <Button
//                 onClick={handleEmailDownload}
//                 disabled={isGeneratingPDF || !isEmailValid}
//                 className="h-12 w-full justify-start gap-3"
//                 variant="outline"
//               >
//                 <Send className="h-5 w-5" />
//                 <div className="text-left">
//                   <div className="font-medium">Email + Download</div>
//                   <div className="text-muted-foreground text-sm">Send PDF to email and download</div>
//                 </div>
//               </Button>

//               <div className="space-y-2">
//                 <Label htmlFor="email" className="font-medium text-sm">
//                   Email Address
//                 </Label>
//                 <div className="flex gap-2">
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter email address"
//                     value={email}
//                     onChange={(e) => handleEmailChange(e.target.value)}
//                     className="flex-1"
//                   />
//                   <Mail className="mt-2 h-4 w-4 text-muted-foreground" />
//                 </div>
//                 {email && !isEmailValid && <p className="text-red-500 text-sm">Please enter a valid email address</p>}
//               </div>
//             </div>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGeneratingPDF}>
//             Cancel
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { Download, Mail, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimpleDownload: () => void;
  isGeneratingPDF: boolean;
  pdfData?: string; // optional base64 PDF if you want to send it
  fileName?: string;
}

export function DownloadDialog({
  open,
  onOpenChange,
  onSimpleDownload,
  isGeneratingPDF,
  pdfData,
  fileName,
}: DownloadDialogProps) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleSimpleDownload = () => {
    onSimpleDownload();
    onOpenChange(false);
  };

  const handleEmailDownload = async () => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }

    onOpenChange(false);
    toast.loading("Sending report to your email...");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          subject: "Your Environmental Test Report",
          message: "Please find attached your requested environmental test report.",
          fileName: fileName || "report.pdf",
          pdfData, // optional: if you want to send base64 data to n8n
        }),
      });

      if (response.ok) {
        toast.success("Report sent successfully to your email!");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending the email.");
    } finally {
      setEmail("");
      setIsEmailValid(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Report
          </DialogTitle>
          <DialogDescription>
            Choose how you would like to receive your environmental test report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleSimpleDownload}
              disabled={isGeneratingPDF}
              className="h-12 w-full justify-start gap-3"
              variant="outline"
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Simple Download</div>
                <div className="text-muted-foreground text-sm">
                  Download PDF directly to your device
                </div>
              </div>
            </Button>

            <div className="space-y-3">
              <Button
                onClick={handleEmailDownload}
                disabled={isGeneratingPDF || !isEmailValid}
                className="h-12 w-full justify-start gap-3"
                variant="outline"
              >
                <Send className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Email + Download</div>
                  <div className="text-muted-foreground text-sm">
                    Send PDF to email and download
                  </div>
                </div>
              </Button>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-sm">
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    className="flex-1"
                  />
                  <Mail className="mt-2 h-4 w-4 text-muted-foreground" />
                </div>
                {email && !isEmailValid && (
                  <p className="text-red-500 text-sm">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGeneratingPDF}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}