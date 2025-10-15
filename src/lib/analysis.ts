// export type RiskLevel = "normal" | "warning" | "high";

// export interface AnalysisResult {
//   value: number;
//   level: RiskLevel;
//   message: string;
// }

// // Air quality thresholds
// export function analyzeAirQuality(data: Record<string, string>): Record<string, AnalysisResult> {
//   const results: Record<string, AnalysisResult> = {};

//   // Carbon Dioxide (ppm) - Normal: <1000, Warning: 1000-2000, High: >2000
//   const co2 = Number.parseFloat(data.carbonDioxide) || 0;
//   results.carbonDioxide = {
//     value: co2,
//     level: co2 < 1000 ? "normal" : co2 < 2000 ? "warning" : "high",
//     message:
//       co2 < 1000
//         ? "Normal indoor air quality"
//         : co2 < 2000
//           ? "Moderate - improve ventilation"
//           : "High - immediate ventilation needed",
//   };

//   // Carbon Monoxide (ppm) - Normal: <9, Warning: 9-35, High: >35
//   const co = Number.parseFloat(data.carbonMonoxide) || 0;
//   results.carbonMonoxide = {
//     value: co,
//     level: co < 1 ? "normal" : co < 35 ? "warning" : "high",
//     message: co < 9 ? "Safe levels" : co < 35 ? "Elevated - check sources" : "Dangerous - evacuate and ventilate",
//   };

//   // PM 2.5 (μg/m³) - Normal: <12, Warning: 12-35, High: >35
//   const pm25 = Number.parseFloat(data.pm25) || 0;
//   results.pm25 = {
//     value: pm25,
//     level: pm25 < 12 ? "normal" : pm25 < 35 ? "warning" : "high",
//     message: pm25 < 12 ? "Good air quality" : pm25 < 35 ? "Moderate - sensitive groups affected" : "Unhealthy",
//   };

//   return results;
// }

// // Water quality thresholds
// export function analyzeWaterQuality(data: Record<string, string>): Record<string, AnalysisResult> {
//   const results: Record<string, AnalysisResult> = {};

//   // Lead in Water (ppb) - Normal: <5, Warning: 5-15, High: >15
//   const lead = Number.parseFloat(data.leadInWater) || 0;
//   results.leadInWater = {
//     value: lead,
//     level: lead < 5 ? "normal" : lead < 15 ? "warning" : "high",
//     message: lead < 5 ? "Safe levels" : lead < 15 ? "Action recommended" : "Unsafe - do not drink",
//   };

//   // Arsenic (ppb) - Normal: <5, Warning: 5-10, High: >10
//   const arsenic = Number.parseFloat(data.arsenic) || 0;
//   results.arsenic = {
//     value: arsenic,
//     level: arsenic < 5 ? "normal" : arsenic < 10 ? "warning" : "high",
//     message: arsenic < 5 ? "Safe levels" : arsenic < 10 ? "Monitor closely" : "Exceeds EPA standards",
//   };

//   // PFAS (ppt) - Normal: <4, Warning: 4-20, High: >20
//   const pfas = Number.parseFloat(data.pfas) || 0;
//   results.pfas = {
//     value: pfas,
//     level: pfas < 4 ? "normal" : pfas < 20 ? "warning" : "high",
//     message: pfas < 4 ? "Below EPA limits" : pfas < 20 ? "Elevated levels" : "Exceeds safety limits",
//   };

//   return results;
// }

// // Surface quality thresholds
// export function analyzeSurfaceQuality(data: Record<string, string>): Record<string, AnalysisResult> {
//   const results: Record<string, AnalysisResult> = {};

//   // Lead Paint (mg/cm²) - Normal: <1.0, Warning: 1.0-5.0, High: >5.0
//   const leadRoom1 = Number.parseFloat(data.leadPaintRoom1) || 0;
//   results.leadPaintRoom1 = {
//     value: leadRoom1,
//     level: leadRoom1 < 1.0 ? "normal" : leadRoom1 < 5.0 ? "warning" : "high",
//     message:
//       leadRoom1 < 1.0 ? "Safe levels" : leadRoom1 < 5.0 ? "Lead present - monitor" : "Hazardous - remediation needed",
//   };

//   const leadRoom2 = Number.parseFloat(data.leadPaintRoom2) || 0;
//   results.leadPaintRoom2 = {
//     value: leadRoom2,
//     level: leadRoom2 < 1.0 ? "normal" : leadRoom2 < 5.0 ? "warning" : "high",
//     message:
//       leadRoom2 < 1.0 ? "Safe levels" : leadRoom2 < 5.0 ? "Lead present - monitor" : "Hazardous - remediation needed",
//   };

//   // Mold (CFU/cm²) - Normal: <10, Warning: 10-100, High: >100
//   const mold = Number.parseFloat(data.mold) || 0;
//   results.mold = {
//     value: mold,
//     level: mold < 10 ? "normal" : mold < 100 ? "warning" : "high",
//     message: mold < 10 ? "Normal levels" : mold < 100 ? "Elevated - investigate source" : "High contamination",
//   };

//   return results;
// }

// // Dust quality thresholds
// export function analyzeDustQuality(data: Record<string, string>): Record<string, AnalysisResult> {
//   const results: Record<string, AnalysisResult> = {};

//   // Lead Dust (μg/ft²) - Normal: <10, Warning: 10-40, High: >40
//   const leadDust = Number.parseFloat(data.leadDust) || 0;
//   results.leadDust = {
//     value: leadDust,
//     level: leadDust < 10 ? "normal" : leadDust < 40 ? "warning" : "high",
//     message:
//       leadDust < 10
//         ? "Safe levels"
//         : leadDust < 40
//           ? "Elevated - clean surfaces"
//           : "Hazardous - professional cleaning needed",
//   };

//   return results;
// }

// export function getRiskColor(level: RiskLevel): string {
//   switch (level) {
//     case "normal":
//       return "hsl(var(--chart-2))"; // Green
//     case "warning":
//       return "hsl(var(--chart-4))"; // Yellow
//     case "high":
//       return "hsl(var(--chart-5))"; // Red
//   }
// }

// export function getRiskBadgeClass(level: RiskLevel): string {
//   switch (level) {
//     case "normal":
//       return "bg-green-500/10 text-green-500 border-green-500/20";
//     case "warning":
//       return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
//     case "high":
//       return "bg-red-500/10 text-red-500 border-red-500/20";
//   }
// }

export type RiskLevel = "normal" | "warning" | "high";

export interface AnalysisResult {
  value: number;
  level: RiskLevel;
  message: string;
}

// ---------------- AIR QUALITY ----------------
export function analyzeAirQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Carbon Dioxide (ppm) - Normal: 400–1000, Warning: 1000–2000, High: >2000
  const co2 = Number.parseFloat(data.carbonDioxide) || 0;
  results.carbonDioxide = {
    value: co2,
    level: co2 <= 1000 ? "normal" : co2 <= 2000 ? "warning" : "high",
    message:
      co2 <= 1000
        ? "Within healthy indoor range."
        : co2 <= 2000
          ? "Elevated levels — improve ventilation."
          : "High CO₂ — poor ventilation, take action immediately.",
  };

  // Carbon Monoxide (ppm) - Normal: 0–1, Warning: 2–8, High: >9
  const co = Number.parseFloat(data.carbonMonoxide) || 0;
  results.carbonMonoxide = {
    value: co,
    level: co <= 1 ? "normal" : co <= 8 ? "warning" : "high",
    message:
      co <= 1
        ? "Safe CO levels."
        : co <= 8
          ? "Slightly elevated — check gas appliances."
          : "Dangerous CO concentration — evacuate and ventilate!",
  };

  // Nitrogen Dioxide (ppb) - Normal: 0–30, Warning: 31–100, High: >100
  const no2 = Number.parseFloat(data.nitrogenDioxide) || 0;
  results.nitrogenDioxide = {
    value: no2,
    level: no2 <= 30 ? "normal" : no2 <= 100 ? "warning" : "high",
    message:
      no2 <= 30
        ? "Normal range."
        : no2 <= 100
          ? "Elevated — possible gas stove or boiler emissions."
          : "High — check combustion sources immediately.",
  };

  // PM 2.5 (µg/m³) - Normal: 0–12, Warning: 13–35, High: >35
  const pm25 = Number.parseFloat(data.pm25) || 0;
  results.pm25 = {
    value: pm25,
    level: pm25 <= 12 ? "normal" : pm25 <= 35 ? "warning" : "high",
    message:
      pm25 <= 12
        ? "Good air quality."
        : pm25 <= 35
          ? "Moderate — may affect sensitive groups."
          : "Unhealthy — reduce exposure.",
  };

  // PM 10 (µg/m³) - Normal: 0–50, Warning: 51–150, High: >150
  const pm10 = Number.parseFloat(data.pm10) || 0;
  results.pm10 = {
    value: pm10,
    level: pm10 <= 50 ? "normal" : pm10 <= 150 ? "warning" : "high",
    message:
      pm10 <= 50
        ? "Clean air."
        : pm10 <= 150
          ? "Elevated particulate matter — ventilate."
          : "Very high dust — investigate source.",
  };

  // Relative Humidity (%) - Normal: 40–55, Warning: 30–39 or 56–65, High: <30 or >65
  const rh = Number.parseFloat(data.relativeHumidity) || 0;
  results.relativeHumidity = {
    value: rh,
    level: rh >= 40 && rh <= 55 ? "normal" : (rh >= 30 && rh <= 39) || (rh >= 56 && rh <= 65) ? "warning" : "high",
    message:
      rh >= 40 && rh <= 55
        ? "Optimal humidity range."
        : (rh >= 30 && rh <= 39) || (rh >= 56 && rh <= 65)
          ? "Slightly outside comfort zone — monitor."
          : "Risk of mold or dryness — adjust humidity.",
  };

  // Formaldehyde (ppb) - Normal: 0–30, Warning: 31–80, High: >80
  const form = Number.parseFloat(data.formaldehyde) || 0;
  results.formaldehyde = {
    value: form,
    level: form <= 30 ? "normal" : form <= 80 ? "warning" : "high",
    message:
      form <= 30
        ? "Normal indoor level."
        : form <= 80
          ? "Elevated — check for off-gassing from furniture or flooring."
          : "High — improve ventilation immediately.",
  };

  // TVOCs (ppb) - Normal: 0–500, Warning: 501–1000, High: >1000
  const tvoc = Number.parseFloat(data.tvoc) || 0;
  results.tvoc = {
    value: tvoc,
    level: tvoc <= 500 ? "normal" : tvoc <= 1000 ? "warning" : "high",
    message:
      tvoc <= 500
        ? "Normal air quality."
        : tvoc <= 1000
          ? "Elevated VOCs — ventilate."
          : "High VOCs — possible chemical contamination.",
  };

  return results;
}

// ---------------- WATER QUALITY ----------------
export function analyzeWaterQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Lead (ppb) - Normal: 0–5, Warning: 6–14, High: ≥15
  const lead = Number.parseFloat(data.lead) || 0;
  results.lead = {
    value: lead,
    level: lead <= 5 ? "normal" : lead <= 14 ? "warning" : "high",
    message:
      lead <= 5
        ? "Safe for daily consumption."
        : lead <= 14
          ? "Concerning — re-test soon."
          : "Hazardous — stop consumption, investigate plumbing.",
  };

  // Arsenic (ppb) - Normal: 0–5, Warning: 6–9, High: ≥10
  const arsenic = Number.parseFloat(data.arsenic) || 0;
  results.arsenic = {
    value: arsenic,
    level: arsenic <= 5 ? "normal" : arsenic <= 9 ? "warning" : "high",
    message:
      arsenic <= 5 ? "Safe levels." : arsenic <= 9 ? "Slightly elevated — re-test." : "Exceeds safe limit — unsafe.",
  };

  // Cadmium (ppb) - Normal: 0–2, Warning: 3–4, High: ≥5
  const cadmium = Number.parseFloat(data.cadmium) || 0;
  results.cadmium = {
    value: cadmium,
    level: cadmium <= 2 ? "normal" : cadmium <= 4 ? "warning" : "high",
    message:
      cadmium <= 2
        ? "Normal range."
        : cadmium <= 4
          ? "Elevated — monitor source."
          : "Hazardous — check pipes or fittings.",
  };

  // Chromium (ppb) - Normal: 0–50, Warning: 51–99, High: ≥100
  const chromium = Number.parseFloat(data.chromium) || 0;
  results.chromium = {
    value: chromium,
    level: chromium <= 50 ? "normal" : chromium <= 99 ? "warning" : "high",
    message:
      chromium <= 50 ? "Safe levels." : chromium <= 99 ? "Moderate — monitor levels." : "High — requires filtration.",
  };

  // Mercury (ppb) - Normal: 0–1, Warning: 1.1–1.9, High: ≥2
  const mercury = Number.parseFloat(data.mercury) || 0;
  results.mercury = {
    value: mercury,
    level: mercury <= 1 ? "normal" : mercury <= 1.9 ? "warning" : "high",
    message:
      mercury <= 1 ? "Safe levels." : mercury <= 1.9 ? "Slightly elevated — re-test." : "Hazardous mercury levels.",
  };

  // PFAS (ppt) - Normal: 0–2, Warning: 3–3.9, High: ≥4
  const pfas = Number.parseFloat(data.pfas) || 0;
  results.pfas = {
    value: pfas,
    level: pfas <= 2 ? "normal" : pfas <= 3.9 ? "warning" : "high",
    message:
      pfas <= 2 ? "Below EPA limit." : pfas <= 3.9 ? "Near limit — re-test." : "Exceeds limit — consider filtration.",
  };

  // Microplastics (particles/L) - Normal: 0–100, Warning: 101–500, High: >500
  const microplastics = Number.parseFloat(data.microplastics) || 0;
  results.microplastics = {
    value: microplastics,
    level: microplastics <= 100 ? "normal" : microplastics <= 500 ? "warning" : "high",
    message:
      microplastics <= 100
        ? "Normal range."
        : microplastics <= 500
          ? "Elevated — possible plastic residue."
          : "High — contamination likely.",
  };

  return results;
}

// ---------------- SURFACE / DUST QUALITY ----------------
export function analyzeDustQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // The forms/store previously used different keys (leadDust + surfaceType),
  // while chart/analysis expects floorDust/windowSill/windowTrough. Support
  // both shapes so a single measurement (from the DustTestForm) maps into
  // the correct analysis slot.
  const rawLeadDust = Number.parseFloat(data.leadDust ?? "") || 0;
  const surfaceType = (data.surfaceType || "").toLowerCase();

  // Compute values for each slot: prefer explicit fields (floorDust, windowSill, windowTrough)
  // but if they're missing, map leadDust + surfaceType into the appropriate slot.
  const floor = Number.parseFloat(data.floorDust ?? "") || (surfaceType === "floor" ? rawLeadDust : 0);
  results.floorDust = {
    value: floor,
    level: floor <= 5 ? "normal" : floor <= 9 ? "warning" : "high",
    message:
      floor <= 5
        ? "Lead dust within safe limits."
        : floor <= 9
          ? "Slightly elevated — re-clean and re-test."
          : "Hazardous — cleaning or abatement needed.",
  };

  const sill = Number.parseFloat(data.windowSill ?? "") || (surfaceType === "window sill" ? rawLeadDust : 0);
  results.windowSill = {
    value: sill,
    level: sill <= 40 ? "normal" : sill <= 99 ? "warning" : "high",
    message:
      sill <= 40
        ? "Safe lead dust level."
        : sill <= 99
          ? "Moderate — re-clean recommended."
          : "Hazardous — exceeds EPA limit, professional cleaning required.",
  };

  const trough = Number.parseFloat(data.windowTrough ?? "") || (surfaceType === "window trough" ? rawLeadDust : 0);
  results.windowTrough = {
    value: trough,
    level: trough <= 200 ? "normal" : trough <= 399 ? "warning" : "high",
    message:
      trough <= 200
        ? "Safe range."
        : trough <= 399
          ? "Elevated — clean and monitor."
          : "High lead level — abatement recommended.",
  };

  return results;
}

// ---------------- WALL / SURFACE QUALITY ----------------
export function analyzeSurfaceQuality(data: Record<string, string>): Record<string, AnalysisResult> {
  const results: Record<string, AnalysisResult> = {};

  // Lead Paint (XRF) - the form stores two room measurements (leadPaintRoom1/2).
  // If a consolidated leadPaintXRF value is provided use it; otherwise use the
  // maximum of the two room readings so the analysis reflects the worst-case.
  const leadFromXRF = Number.parseFloat(data.leadPaintXRF ?? "");
  const leadRoom1 = Number.parseFloat(data.leadPaintRoom1 ?? "") || 0;
  const leadRoom2 = Number.parseFloat(data.leadPaintRoom2 ?? "") || 0;
  const leadPaint = !Number.isNaN(leadFromXRF) && leadFromXRF > 0 ? leadFromXRF : Math.max(leadRoom1, leadRoom2);
  results.leadPaintXRF = {
    value: leadPaint,
    level: leadPaint <= 0.4 ? "normal" : leadPaint <= 0.9 ? "warning" : "high",
    message:
      leadPaint <= 0.4
        ? "Within normal range — no action needed."
        : leadPaint <= 0.9
          ? "Slightly elevated — may occur on older surfaces; consider monitoring or re-testing."
          : "Hazardous lead level — professional evaluation or remediation advised.",
  };

  // Mold (Surface Sampling) - accept either surfaceMold or the shorter 'mold' form key.
  const mold = Number.parseFloat(data.surfaceMold ?? "") || Number.parseFloat(data.mold ?? "") || 0;
  results.surfaceMold = {
    value: mold,
    level: mold <= 50 ? "normal" : mold <= 500 ? "warning" : "high",
    message:
      mold <= 50
        ? "Typical background mold — no concern."
        : mold <= 500
          ? "Moderately elevated — monitor or re-test in 6 months."
          : "High mold levels — indicates active growth; remediation recommended.",
  };

  return results;
}

// ---------------- UTILITIES ----------------
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
