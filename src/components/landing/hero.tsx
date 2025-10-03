import { ArrowRight } from "lucide-react";
import Bg from "@/assets/img/hero-bg.svg";
// import BackgroundPattern from "../background-pattern";
import MaxWidthWrapper from "../max-width-wrapper";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <MaxWidthWrapper className="relative mt-16 px-6 py-16 lg:px-8 lg:py-24">
      {/* <BackgroundPattern className="-translate-x-1/2 absolute top-0 left-1/2 z-0 opacity-15 dark:invert" /> 
      {/* <div className="absolute top-1/2 left-1/2 z-0 size-72 rounded-full bg-primary/20 blur-[50px]" />
      <div className="absolute top-1/3 left-1/3 z-0 size-36 rounded-full bg-[#FFBB1E]/50 blur-[50px] dark:bg-[#FFBB1E]/25" /> */}
      <img src={Bg} alt="hero" className="-translate-x-1/2 -translate-y-1/3 absolute top-1/2 left-1/2 z-0" />
      <div className="relative z-[1] mx-auto max-w-4xl text-center">
        <h1 className="mb-6 font-bold text-5xl text-black lg:text-7xl dark:text-white/60">
          Find Your Perfect
          <br />
          <span className="bg-gradient-to-r from-violet-700 to-pink-500 bg-clip-text text-transparent">
            Cultural Match
          </span>
        </h1>
        <p className="mb-8 text-black text-xl leading-relaxed lg:text-2xl dark:text-white/60">
          Revolutionize your hiring process with AI-driven culture-fit assessments. Align candidates with your company
          values like never before.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" variant="default">
            Start with Demo <ArrowRight />
          </Button>
          <Button size="lg" className="bg-[#ff9e1ef5] font-semibold text-black hover:bg-[#ff9e1ef5]/85">
            Hire Us
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Hero;
