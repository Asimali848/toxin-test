import { useState } from "react";
import { Download, Mail, Send } from "lucide-react";
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
import { toast } from "sonner";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimpleDownload: () => void;
  onEmailDownload: (email: string) => void;
  isGeneratingPDF: boolean;
}

export function DownloadDialog({
  open,
  onOpenChange,
  onSimpleDownload,
  onEmailDownload,
  isGeneratingPDF,
}: DownloadDialogProps) {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleSimpleDownload = () => {
    onSimpleDownload();
    onOpenChange(false);
  };

  const handleEmailDownload = () => {
    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }
    onEmailDownload(email);
    onOpenChange(false);
    setEmail("");
    setIsEmailValid(false);
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
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Simple Download</div>
                <div className="text-sm text-muted-foreground">
                  Download PDF directly to your device
                </div>
              </div>
            </Button>

            <div className="space-y-3">
              <Button
                onClick={handleEmailDownload}
                disabled={isGeneratingPDF || !isEmailValid}
                className="w-full justify-start gap-3 h-12"
                variant="outline"
              >
                <Send className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Email + Download</div>
                  <div className="text-sm text-muted-foreground">
                    Send PDF to email and download
                  </div>
                </div>
              </Button>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
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
                  <Mail className="h-4 w-4 text-muted-foreground mt-2" />
                </div>
                {email && !isEmailValid && (
                  <p className="text-sm text-red-500">Please enter a valid email address</p>
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
