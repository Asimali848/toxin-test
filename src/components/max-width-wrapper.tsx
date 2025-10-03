import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({ id, children, className }: { id?: string; className?: string; children: ReactNode }) => {
  return (
    <div
      id={id}
      className={cn("mx-auto flex h-full w-full max-w-screen-xl items-center justify-between p-3.5", className)}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
