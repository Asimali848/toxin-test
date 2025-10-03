import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTestStore } from "@/lib/store";

export function SurfaceTestForm() {
  const { data, updateSurfaceData, setCurrentTab } = useTestStore();
  const surfaceData = data.surface;

  const handleNext = () => {
    setCurrentTab("dust");
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Wall/Surface Tests</CardTitle>
        <CardDescription>Enter measurements for surface contaminants</CardDescription>
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
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Lead Paint Testing (2 Rooms)</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="leadPaintRoom1">Room 1 - Lead Paint (mg/cm²)</Label>
                  <Input
                    id="leadPaintRoom1"
                    type="number"
                    step="0.01"
                    placeholder="Enter lead paint level"
                    value={surfaceData.leadPaintRoom1}
                    onChange={(e) => updateSurfaceData({ leadPaintRoom1: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadPaintRoom2">Room 2 - Lead Paint (mg/cm²)</Label>
                  <Input
                    id="leadPaintRoom2"
                    type="number"
                    step="0.01"
                    placeholder="Enter lead paint level"
                    value={surfaceData.leadPaintRoom2}
                    onChange={(e) => updateSurfaceData({ leadPaintRoom2: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asbestos">Asbestos Detection</Label>
              <Select
                value={surfaceData.asbestos}
                onValueChange={(value: string) => updateSurfaceData({ asbestos: value })}
              >
                <SelectTrigger id="asbestos" className="bg-background">
                  <SelectValue placeholder="Select detection result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-detected">Not Detected</SelectItem>
                  <SelectItem value="detected">Detected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mold">Mold (Surface Sampling) (CFU/cm²)</Label>
              <Input
                id="mold"
                type="number"
                step="0.01"
                placeholder="Enter mold count"
                value={surfaceData.mold}
                onChange={(e) => updateSurfaceData({ mold: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2">
              Next: Dust Tests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
