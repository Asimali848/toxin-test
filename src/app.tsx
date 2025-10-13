import { AirTestForm } from "@/components/air-test-form";
import { DustTestForm } from "@/components/dust-test-form";
import { TabNavigation } from "@/components/tab-navigation";
import { UserInfoForm } from "@/components/user-info-form";
import { useTestStore } from "@/lib/store";
import Navbar from "./components/landing/navbar";
import { ResultsDashboard } from "./components/results-dashboard";
import { SurfaceTestForm } from "./components/surface-text-form";
import { WaterTestForm } from "./components/water-test-form";

function App() {
  const { currentStep, currentTab, showResults, setCurrentStep } = useTestStore();

  if (showResults) {
    return <ResultsDashboard />;
  }

  if (currentStep === "user-info") {
    return (
      <div className="min-h-screen w-full bg-background">
        <Navbar />
        <div className="pt-16">
          <UserInfoForm onNext={() => setCurrentStep("tests")} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background p-4 md:p-8">
      <Navbar />
      <div className="mx-auto max-w-screen-lg">
        <header className="flex flex-col items-center justify-center pt-4 pb-5">
          <h1 className="mb-2 font-bold text-3xl text-foreground">Environmental Testing</h1>
          <p className="text-muted-foreground">Complete all test categories to generate your comprehensive report</p>
        </header>

        <TabNavigation />

        <div className="mt-6">
          {currentTab === "air" && <AirTestForm />}
          {currentTab === "water" && <WaterTestForm />}
          {currentTab === "surface" && <SurfaceTestForm />}
          {currentTab === "dust" && <DustTestForm />}
        </div>
      </div>
    </div>
  );
}

export default App;
