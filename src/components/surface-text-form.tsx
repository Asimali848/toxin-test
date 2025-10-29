import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TooltipDemo } from "@/components/ui/guidance-block";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
              <h3 className="font-semibold text-foreground text-sm">Lead Paint Testing</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="leadPaintRoom1">Room 1 - Lead Paint (mg/cm²)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="leadPaintRoom1"
                      type="number"
                      step="0.01"
                      placeholder="Enter lead paint level"
                      value={surfaceData.leadPaintRoom1}
                      onChange={(e) => updateSurfaceData({ leadPaintRoom1: e.target.value })}
                      className="bg-background"
                    />
                    <TooltipDemo metricKey="leadPaintXRF" value={surfaceData.leadPaintRoom1} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadPaintRoom2">Room 2 - Lead Paint (mg/cm²)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="leadPaintRoom2"
                      type="number"
                      step="0.01"
                      placeholder="Enter lead paint level"
                      value={surfaceData.leadPaintRoom2}
                      onChange={(e) => updateSurfaceData({ leadPaintRoom2: e.target.value })}
                      className="bg-background"
                    />
                    <TooltipDemo metricKey="leadPaintXRF" value={surfaceData.leadPaintRoom2} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mold">Mold (Surface Sampling) (CFU/cm²)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="mold"
                  type="number"
                  step="0.01"
                  placeholder="Enter mold count"
                  value={surfaceData.mold}
                  onChange={(e) => updateSurfaceData({ mold: e.target.value })}
                  className="bg-background"
                />
                <TooltipDemo metricKey="surfaceMold" value={surfaceData.mold} />
              </div>
            </div>
            {/* Additional surface/location fields (optional) */}
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Location Details (optional)</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    type="text"
                    id="roomName"
                    placeholder="e.g., Living Room"
                    value={surfaceData.roomName}
                    onChange={(e) => updateSurfaceData({ roomName: e.target.value })}
                    className="bg-background"
                  />

                  <Label htmlFor="wallA">Wall A</Label>
                  <Input
                    type="text"
                    id="wallA"
                    placeholder="Enter reading or note"
                    value={surfaceData.wallA}
                    onChange={(e) => updateSurfaceData({ wallA: e.target.value })}
                    className="bg-background"
                  />

                  <Label htmlFor="wallB">Wall B</Label>
                  <Input
                    type="text"
                    id="wallB"
                    placeholder="Enter reading or note"
                    value={surfaceData.wallB}
                    onChange={(e) => updateSurfaceData({ wallB: e.target.value })}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallC">Wall C</Label>
                  <Input
                    type="text"
                    id="wallC"
                    placeholder="Enter reading or note"
                    value={surfaceData.wallC}
                    onChange={(e) => updateSurfaceData({ wallC: e.target.value })}
                    className="bg-background"
                  />

                  <Label htmlFor="wallD">Wall D</Label>
                  <Input
                    type="text"
                    id="wallD"
                    placeholder="Enter reading or note"
                    value={surfaceData.wallD}
                    onChange={(e) => updateSurfaceData({ wallD: e.target.value })}
                    className="bg-background"
                  />

                  <Label htmlFor="windowSill">Window Sill</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      id="windowSill"
                      placeholder="Enter reading or note"
                      value={surfaceData.windowSill}
                      onChange={(e) => updateSurfaceData({ windowSill: e.target.value })}
                      className="bg-background"
                    />
                    {/* <TooltipDemo
                      metricKey="windowSill"
                      value={surfaceData.windowSill}
                    /> */}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-start justify-center gap-3">
                  <Label className="">Additional Surface Locations</Label>
                  <Input
                    type="text"
                    id="windowCasing"
                    placeholder="Window Casing"
                    value={surfaceData.windowCasing}
                    onChange={(e) => updateSurfaceData({ windowCasing: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-3">
                  <Label className="">Additional Surface Locations</Label>
                  <Input
                    type="text"
                    id="windowSash"
                    placeholder="Window Sash"
                    value={surfaceData.windowSash}
                    onChange={(e) => updateSurfaceData({ windowSash: e.target.value })}
                    className="bg-background"
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-3">
                  <Label className="">Additional Surface Locations</Label>
                  <Input
                    type="text"
                    id="doorPanel"
                    placeholder="Door Panel"
                    value={surfaceData.doorPanel}
                    onChange={(e) => updateSurfaceData({ doorPanel: e.target.value })}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" className="gap-2">
              Next: Dust Tests
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {/* Additional detailed fields (optional, collapsible/scrollable) */}
          <div className="mt-4 rounded-lg border border-border bg-muted/10 p-3">
            <h4 className="mb-2 font-medium text-foreground">More Locations (optional)</h4>
            <div className="grid max-h-64 grid-cols-1 gap-3 overflow-auto sm:grid-cols-2">
              <Input
                type="text"
                id="doorJamb"
                placeholder="Door Jamb"
                value={surfaceData.doorJamb}
                onChange={(e) => updateSurfaceData({ doorJamb: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="doorCasing"
                placeholder="Door Casing"
                value={surfaceData.doorCasing}
                onChange={(e) => updateSurfaceData({ doorCasing: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="closetDoor"
                placeholder="Closet Door"
                value={surfaceData.closetDoor}
                onChange={(e) => updateSurfaceData({ closetDoor: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="closetJamb"
                placeholder="Closet Jamb"
                value={surfaceData.closetJamb}
                onChange={(e) => updateSurfaceData({ closetJamb: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="closetCasing"
                placeholder="Closet Casing"
                value={surfaceData.closetCasing}
                onChange={(e) => updateSurfaceData({ closetCasing: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="closetInsideWall"
                placeholder="Closet Inside Wall"
                value={surfaceData.closetInsideWall}
                onChange={(e) => updateSurfaceData({ closetInsideWall: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="closetShelf"
                placeholder="Closet Shelf"
                value={surfaceData.closetShelf}
                onChange={(e) => updateSurfaceData({ closetShelf: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="shelfSupport"
                placeholder="Shelf Support"
                value={surfaceData.shelfSupport}
                onChange={(e) => updateSurfaceData({ shelfSupport: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="roomBaseboard"
                placeholder="Room Baseboard"
                value={surfaceData.roomBaseboard}
                onChange={(e) => updateSurfaceData({ roomBaseboard: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="molding"
                placeholder="Molding"
                value={surfaceData.molding}
                onChange={(e) => updateSurfaceData({ molding: e.target.value })}
                className="bg-background"
              />
              <Input
                type="text"
                id="radiator"
                placeholder="Radiator"
                value={surfaceData.radiator}
                onChange={(e) => updateSurfaceData({ radiator: e.target.value })}
                className="bg-background"
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
