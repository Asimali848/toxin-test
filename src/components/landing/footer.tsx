import Logo from "@/assets/img/Toxin.jpg";
import MaxWidthWrapper from "../max-width-wrapper";

const Footer = () => {
  return (
    <footer className="flex h-16 w-full items-center justify-center border-t">
      <MaxWidthWrapper className="flex w-full items-center justify-between p-3.5">
        <div className="flex items-center justify-center gap-2.5">
          <img src={Logo} alt="logo" className="rounded-sm" />
        </div>
        <p className="text-right text-muted-foreground text-xs">&copy; 2025 Toxin-Testers. All rights reserved.</p>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
