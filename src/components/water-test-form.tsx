"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTestStore } from "@/lib/store";

export function WaterTestForm() {
  const { data, updateWaterData, setCurrentTab } = useTestStore();
  const waterData = data.water;

  const handleNext = () => {
    setCurrentTab("surface");
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Water Quality Tests</CardTitle>
        <CardDescription>Enter measurements for drinking water contaminants</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
          className="space-y-6"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leadInWater">Lead in Water (ppb)</Label>
              <Input
                id="leadInWater"
                type="number"
                step="0.01"
                placeholder="Enter lead level"
                value={waterData.leadInWater}
                onChange={(e) => updateWaterData({ leadInWater: e.target.value })}
                className="bg-background"
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Metals in Drinking Water (ppb)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="silver">Silver (Ag)</Label>
                  <Input
                    id="silver"
                    type="number"
                    step="0.01"
                    placeholder="Enter Ag level"
                    value={waterData.silver}
                    onChange={(e) => updateWaterData({ silver: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arsenic">Arsenic (As)</Label>
                  <Input
                    id="arsenic"
                    type="number"
                    step="0.01"
                    placeholder="Enter As level"
                    value={waterData.arsenic}
                    onChange={(e) => updateWaterData({ arsenic: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barium">Barium (Ba)</Label>
                  <Input
                    id="barium"
                    type="number"
                    step="0.01"
                    placeholder="Enter Ba level"
                    value={waterData.barium}
                    onChange={(e) => updateWaterData({ barium: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cadmium">Cadmium (Cd)</Label>
                  <Input
                    id="cadmium"
                    type="number"
                    step="0.01"
                    placeholder="Enter Cd level"
                    value={waterData.cadmium}
                    onChange={(e) => updateWaterData({ cadmium: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chromium">Chromium (Cr)</Label>
                  <Input
                    id="chromium"
                    type="number"
                    step="0.01"
                    placeholder="Enter Cr level"
                    value={waterData.chromium}
                    onChange={(e) => updateWaterData({ chromium: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mercury">Mercury (Hg)</Label>
                  <Input
                    id="mercury"
                    type="number"
                    step="0.01"
                    placeholder="Enter Hg level"
                    value={waterData.mercury}
                    onChange={(e) => updateWaterData({ mercury: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lead">Lead (Pb)</Label>
                  <Input
                    id="lead"
                    type="number"
                    step="0.01"
                    placeholder="Enter Pb level"
                    value={waterData.lead}
                    onChange={(e) => updateWaterData({ lead: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="selenium">Selenium (Se)</Label>
                  <Input
                    id="selenium"
                    type="number"
                    step="0.01"
                    placeholder="Enter Se level"
                    value={waterData.selenium}
                    onChange={(e) => updateWaterData({ selenium: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pfas">PFAS in Drinking Water (ppt)</Label>
                <Input
                  id="pfas"
                  type="number"
                  step="0.01"
                  placeholder="Enter PFAS level"
                  value={waterData.pfas}
                  onChange={(e) => updateWaterData({ pfas: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="microplastics">Microplastics (particles/L)</Label>
                <Input
                  id="microplastics"
                  type="number"
                  step="0.01"
                  placeholder="Enter microplastics count"
                  value={waterData.microplastics}
                  onChange={(e) => updateWaterData({ microplastics: e.target.value })}
                  className="bg-background"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2">
              Next: Wall/Surface Tests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
