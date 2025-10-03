export type RiskLevel = "normal" | "warning" | "high";

export interface AnalysisResult {
  value: number;
  level: RiskLevel;
  message: string;
}

// Air quality thresholds
export function analyzeAirQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Carbon Dioxide (ppm) - Normal: <1000, Warning: 1000-2000, High: >2000
  const co2 = Number.parseFloat(data.carbonDioxide) || 0;
  results.carbonDioxide = {
    value: co2,
    level: co2 < 1000 ? "normal" : co2 < 2000 ? "warning" : "high",
    message:
      co2 < 1000
        ? "Normal indoor air quality"
        : co2 < 2000
          ? "Moderate - improve ventilation"
          : "High - immediate ventilation needed",
  };

  // Carbon Monoxide (ppm) - Normal: <9, Warning: 9-35, High: >35
  const co = Number.parseFloat(data.carbonMonoxide) || 0;
  results.carbonMonoxide = {
    value: co,
    level: co < 9 ? "normal" : co < 35 ? "warning" : "high",
    message: co < 9 ? "Safe levels" : co < 35 ? "Elevated - check sources" : "Dangerous - evacuate and ventilate",
  };

  // PM 2.5 (μg/m³) - Normal: <12, Warning: 12-35, High: >35
  const pm25 = Number.parseFloat(data.pm25) || 0;
  results.pm25 = {
    value: pm25,
    level: pm25 < 12 ? "normal" : pm25 < 35 ? "warning" : "high",
    message: pm25 < 12 ? "Good air quality" : pm25 < 35 ? "Moderate - sensitive groups affected" : "Unhealthy",
  };

  return results;
}

// Water quality thresholds
export function analyzeWaterQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Lead in Water (ppb) - Normal: <5, Warning: 5-15, High: >15
  const lead = Number.parseFloat(data.leadInWater) || 0;
  results.leadInWater = {
    value: lead,
    level: lead < 5 ? "normal" : lead < 15 ? "warning" : "high",
    message: lead < 5 ? "Safe levels" : lead < 15 ? "Action recommended" : "Unsafe - do not drink",
  };

  // Arsenic (ppb) - Normal: <5, Warning: 5-10, High: >10
  const arsenic = Number.parseFloat(data.arsenic) || 0;
  results.arsenic = {
    value: arsenic,
    level: arsenic < 5 ? "normal" : arsenic < 10 ? "warning" : "high",
    message: arsenic < 5 ? "Safe levels" : arsenic < 10 ? "Monitor closely" : "Exceeds EPA standards",
  };

  // PFAS (ppt) - Normal: <4, Warning: 4-20, High: >20
  const pfas = Number.parseFloat(data.pfas) || 0;
  results.pfas = {
    value: pfas,
    level: pfas < 4 ? "normal" : pfas < 20 ? "warning" : "high",
    message: pfas < 4 ? "Below EPA limits" : pfas < 20 ? "Elevated levels" : "Exceeds safety limits",
  };

  return results;
}

// Surface quality thresholds
export function analyzeSurfaceQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Lead Paint (mg/cm²) - Normal: <1.0, Warning: 1.0-5.0, High: >5.0
  const leadRoom1 = Number.parseFloat(data.leadPaintRoom1) || 0;
  results.leadPaintRoom1 = {
    value: leadRoom1,
    level: leadRoom1 < 1.0 ? "normal" : leadRoom1 < 5.0 ? "warning" : "high",
    message:
      leadRoom1 < 1.0 ? "Safe levels" : leadRoom1 < 5.0 ? "Lead present - monitor" : "Hazardous - remediation needed",
  };

  const leadRoom2 = Number.parseFloat(data.leadPaintRoom2) || 0;
  results.leadPaintRoom2 = {
    value: leadRoom2,
    level: leadRoom2 < 1.0 ? "normal" : leadRoom2 < 5.0 ? "warning" : "high",
    message:
      leadRoom2 < 1.0 ? "Safe levels" : leadRoom2 < 5.0 ? "Lead present - monitor" : "Hazardous - remediation needed",
  };

  // Mold (CFU/cm²) - Normal: <10, Warning: 10-100, High: >100
  const mold = Number.parseFloat(data.mold) || 0;
  results.mold = {
    value: mold,
    level: mold < 10 ? "normal" : mold < 100 ? "warning" : "high",
    message: mold < 10 ? "Normal levels" : mold < 100 ? "Elevated - investigate source" : "High contamination",
  };

  return results;
}

// Dust quality thresholds
export function analyzeDustQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Lead Dust (μg/ft²) - Normal: <10, Warning: 10-40, High: >40
  const leadDust = Number.parseFloat(data.leadDust) || 0;
  results.leadDust = {
    value: leadDust,
    level: leadDust < 10 ? "normal" : leadDust < 40 ? "warning" : "high",
    message:
      leadDust < 10
        ? "Safe levels"
        : leadDust < 40
          ? "Elevated - clean surfaces"
          : "Hazardous - professional cleaning needed",
  };

  return results;
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "normal":
      return "hsl(var(--chart-2))"; // Green
    case "warning":
      return "hsl(var(--chart-4))"; // Yellow
    case "high":
      return "hsl(var(--chart-5))"; // Red
  }
}

export function getRiskBadgeClass(level: RiskLevel): string {
  switch (level) {
    case "normal":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "warning":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "high":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}
