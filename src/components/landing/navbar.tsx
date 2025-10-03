import Logo from "@/assets/img/Toxin.jpg";
import MaxWidthWrapper from "../max-width-wrapper";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-[2] flex h-14 w-full items-center justify-center backdrop-blur-sm">
      <MaxWidthWrapper className="flex items-center justify-between p-3.5 pr-16">
        <div className="w-[100px]">
          <img src={Logo} alt="logo" className="rounded-xs" />
        </div>

        <div className="hidden items-center justify-center gap-2.5 md:flex">
          <ModeToggle />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
