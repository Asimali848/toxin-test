import { Save, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTestStore } from "@/lib/store";
import { CancelModal } from "./cancel-modal";

export function DustTestForm() {
  const { data, updateDustData, resetData, setShowResults } = useTestStore();
  const dustData = data.dust;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [surfaceType, setSurfaceType] = useState(dustData.surfaceType || "");
  const [customSurface, setCustomSurface] = useState(dustData.customSurface || "");
  const [leadDust, setLeadDust] = useState(dustData.leadDust || "");
  const [result, setResult] = useState(dustData.result || "");

  // --- Auto-calculate Pass/Fail based on rules ---
  useEffect(() => {
    const value = parseFloat(leadDust);
    if (!surfaceType || isNaN(value)) {
      setResult("");
      return;
    }

    if (surfaceType === "Floor" && value >= 10) {
      setResult("Fail");
    } else if (surfaceType === "Window Sill" && value >= 100) {
      setResult("Fail");
    } else if (surfaceType === "Window Trough" && value >= 100) {
      // optional: same as sill, can adjust
      setResult("Fail");
    } else if (surfaceType === "Other" && value >= 100) {
      // default threshold for 'Other'
      setResult("Fail");
    } else {
      setResult("Pass");
    }
  }, [surfaceType, leadDust]);

  const handleCancel = () => setShowCancelModal(true);

  const handleConfirmCancel = () => {
    resetData();
    setShowCancelModal(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSurface = surfaceType === "Other" ? customSurface.trim() || "Other" : surfaceType;

    updateDustData({
      surfaceType: selectedSurface,
      customSurface: surfaceType === "Other" ? customSurface : "",
      leadDust,
      result,
    });

    setShowResults(true);
  };

  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Dust Tests</CardTitle>
          <CardDescription>Enter measurements for dust contaminants - Final step</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Surface Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="surfaceType">Surface Type</Label>
              <Select value={surfaceType} onValueChange={(value) => setSurfaceType(value)}>
                <SelectTrigger id="surfaceType" className="bg-background">
                  <SelectValue placeholder="Select surface type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Floor">Floor</SelectItem>
                  <SelectItem value="Window Sill">Window Sill</SelectItem>
                  <SelectItem value="Window Trough">Window Trough</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              {surfaceType === "Other" && (
                <div className="mt-2">
                  <Input
                    type="text"
                    placeholder="Enter custom surface type"
                    value={customSurface}
                    onChange={(e) => setCustomSurface(e.target.value)}
                    className="bg-background"
                  />
                </div>
              )}
            </div>

            {/* Lead Dust Input */}
            <div className="space-y-2">
              <Label htmlFor="leadDust">Lead Dust (μg/ft²)</Label>
              <Input
                id="leadDust"
                type="number"
                step="0.01"
                placeholder="Enter lead dust level"
                value={leadDust}
                onChange={(e) => setLeadDust(e.target.value)}
                className="bg-background"
              />
            </div>

            {/* Auto Pass/Fail Field */}
            <div className="space-y-2">
              <Label htmlFor="result">Pass/Fail</Label>
              <Input
                id="result"
                type="text"
                value={result}
                readOnly
                className={`bg-background font-semibold ${
                  result === "Fail" ? "text-red-600" : result === "Pass" ? "text-green-600" : "text-muted-foreground"
                }`}
              />
              <p className="text-muted-foreground text-sm">Logic: Floor ≥ 10 or Sill ≥ 100 → Fail; below → Pass</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Save & View Results
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <CancelModal open={showCancelModal} onOpenChange={setShowCancelModal} onConfirm={handleConfirmCancel} />
    </>
  );
}
