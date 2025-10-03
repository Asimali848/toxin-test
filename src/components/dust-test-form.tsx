"use client";

import { Save, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTestStore } from "@/lib/store";
import { CancelModal } from "./cancel-modal";

export function DustTestForm() {
  const { data, updateDustData, resetData, setShowResults } = useTestStore();
  const dustData = data.dust;
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    resetData();
    setShowCancelModal(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
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
            <div className="space-y-2">
              <Label htmlFor="leadDust">Lead Dust (μg/ft²)</Label>
              <Input
                id="leadDust"
                type="number"
                step="0.01"
                placeholder="Enter lead dust level"
                value={dustData.leadDust}
                onChange={(e) => updateDustData({ leadDust: e.target.value })}
                className="bg-background"
              />
            </div>

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
