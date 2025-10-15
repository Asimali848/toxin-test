// import { Download} from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// interface DownloadDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onSimpleDownload: () => void;
//   isGeneratingPDF: boolean;
// }

// export function DownloadDialog({ open, onOpenChange, onSimpleDownload, isGeneratingPDF }: DownloadDialogProps) {

//   const handleSimpleDownload = () => {
//     onSimpleDownload();
//     onOpenChange(false);
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

import { Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserInfo } from "@/lib/types";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSimpleDownload: () => void;
  // onEmailReport will be called by the parent to send the report (no args required)
  onEmailReport: () => void | Promise<void>;
  isGeneratingPDF: boolean;
  userInfo?: UserInfo;
}

export function DownloadDialog({
  open,
  onOpenChange,
  onSimpleDownload,
  onEmailReport,
  isGeneratingPDF,
}: DownloadDialogProps) {
  const handleSimpleDownload = () => {
    onSimpleDownload();
    onOpenChange(false);
  };

  const handleEmailReport = () => {
    onEmailReport();
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Report
          </DialogTitle>
          <DialogDescription>Choose how you would like to receive your environmental test report.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Simple Download */}
          <Button
            onClick={handleSimpleDownload}
            disabled={isGeneratingPDF}
            className="h-12 w-full justify-start gap-3"
            variant="outline"
          >
            <Download className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Simple Download</div>
              <div className="text-muted-foreground text-sm">Download PDF directly to your device</div>
            </div>
          </Button>

          {/* Email Report */}
          <Button
            onClick={handleEmailReport}
            disabled={isGeneratingPDF}
            className="h-12 w-full justify-start gap-3"
            variant="outline"
          >
            <Mail className="h-5 w-5" />
            <div className="text-left">
              <div className="font-medium">Email Report</div>
              <div className="text-muted-foreground text-sm">Send PDF report to your email address</div>
            </div>
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isGeneratingPDF}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
