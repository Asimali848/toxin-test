import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTestStore } from "@/lib/store";
import GuidanceBlock from "@/components/ui/guidance-block";

export function AirTestForm() {
  const { data, updateAirData, setCurrentTab } = useTestStore();
  const airData = data.air;

  const handleNext = () => {
    setCurrentTab("water");
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Air Quality Tests</CardTitle>
        <CardDescription>Enter measurements for air quality parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          className="space-y-6"
        >
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="carbonDioxide">Carbon Dioxide (ppm)</Label>
              <Input
                id="carbonDioxide"
                type="number"
                step="0.01"
                placeholder="Enter CO₂ level"
                value={airData.carbonDioxide}
                onChange={(e) => updateAirData({ carbonDioxide: e.target.value })}
                className="bg-background"
              />
              <GuidanceBlock metricKey="carbonDioxide" value={airData.carbonDioxide} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="carbonMonoxide">Carbon Monoxide (ppm)</Label>
              <Input
                id="carbonMonoxide"
                type="number"
                step="0.01"
                placeholder="Enter CO level"
                value={airData.carbonMonoxide}
                onChange={(e) => updateAirData({ carbonMonoxide: e.target.value })}
                className="bg-background"
              />
              <GuidanceBlock metricKey="carbonMonoxide" value={airData.carbonMonoxide} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nitrogenDioxide">Nitrogen Dioxide (ppb)</Label>
              <Input
                id="nitrogenDioxide"
                type="number"
                step="0.01"
                placeholder="Enter NO₂ level"
                value={airData.nitrogenDioxide}
                onChange={(e) => updateAirData({ nitrogenDioxide: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pm25">PM 2.5 (μg/m³)</Label>
              <Input
                id="pm25"
                type="number"
                step="0.01"
                placeholder="Enter PM 2.5 level"
                value={airData.pm25}
                onChange={(e) => updateAirData({ pm25: e.target.value })}
                className="bg-background"
              />
              <GuidanceBlock metricKey="pm25" value={airData.pm25} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pm10">PM 10 (μg/m³)</Label>
              <Input
                id="pm10"
                type="number"
                step="0.01"
                placeholder="Enter PM 10 level"
                value={airData.pm10}
                onChange={(e) => updateAirData({ pm10: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relativeHumidity">Relative Humidity (%)</Label>
              <Input
                id="relativeHumidity"
                type="number"
                step="0.01"
                placeholder="Enter humidity level"
                value={airData.relativeHumidity}
                onChange={(e) => updateAirData({ relativeHumidity: e.target.value })}
                className="bg-background"
              />
              <GuidanceBlock metricKey="relativeHumidity" value={airData.relativeHumidity} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="formaldehyde">Formaldehyde (ppb)</Label>
              <Input
                id="formaldehyde"
                type="number"
                step="0.01"
                placeholder="Enter formaldehyde level"
                value={airData.formaldehyde}
                onChange={(e) => updateAirData({ formaldehyde: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tvocs">TVOCs (ppb)</Label>
              <Input
                id="tvocs"
                type="number"
                step="0.01"
                placeholder="Enter TVOCs level"
                value={airData.tvocs}
                onChange={(e) => updateAirData({ tvocs: e.target.value })}
                className="bg-background"
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="pcbs">PCBs (ng/m³)</Label>
              <Input
                id="pcbs"
                type="number"
                step="0.01"
                placeholder="Enter PCBs level"
                value={airData.pcbs}
                onChange={(e) => updateAirData({ pcbs: e.target.value })}
                className="bg-background"
              />
            </div> */}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2">
              Next: Water Tests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
