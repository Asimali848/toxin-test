export interface GuidanceBlockData {
  avgForNY?: string;
  causes?: string;
  actions?: string;
  // optional numeric ranges for value-specific guidance
  ranges?: Array<{
    min?: number;
    max?: number;
    avgForNY?: string;
    causes?: string;
    actions?: string;
  }>;
}

// Placeholder guidance map. User will provide final text for each metric.
export const guidanceMap: Record<string, GuidanceBlockData> = {
  // Air
  carbonDioxide: {
    avgForNY: "~400-800 ppm (typical indoor range)",
    causes: "Occupant density, ventilation, combustion sources",
    actions: "Increase ventilation, inspect HVAC, reduce sources",
  },
  carbonMonoxide: {
    avgForNY: "Near 0 ppm in typical homes",
    causes: "Combustion appliances, vehicle exhaust",
    actions: "Ventilate, inspect appliances, use CO alarms",
  },
  pm25: {
    avgForNY: "~5-15 µg/m³ typical indoors",
    causes: "Outdoor pollution infiltration, indoor combustion",
    actions: "Increase filtration, reduce indoor smoking/cooking emissions",
  },
  relativeHumidity: {
    avgForNY: "30-50% typical indoor range",
    causes: "HVAC settings, outdoor humidity, moisture sources",
    actions: "Use dehumidifiers/humidifiers, repair leaks",
  },

  // Water
  lead: {
    avgForNY: "< 1 ppb in most treated systems (varies)",
    causes: "Lead service lines, solder, plumbing fixtures",
    actions: "Flush lines, use certified filters, replace plumbing",
  },
  arsenic: {
    avgForNY: "Generally low in municipal supplies",
    causes: "Groundwater sources, industrial contamination",
    actions: "Use treatment, test source, consult utility",
  },
  pfas: {
    avgForNY: "Typically non-detect to low ppt levels",
    causes: "Industrial runoff, firefighting foams",
    actions: "Use PFAS-specific treatment, contact authorities",
  },

  // Surface
  leadPaintXRF: {
    avgForNY: "Most modern renovated surfaces: non-detect to low",
    causes: "Legacy lead paint in older buildings",
    actions: "Encapsulation, abatement, targeted cleaning",
  },
  surfaceMold: {
    avgForNY: "Variable — typically low when dry",
    causes: "Moisture intrusion, poor ventilation",
    actions: "Dry the area, remediate mold, investigate source",
  },

  // Dust
  floorDust: {
    avgForNY: "Typically <10 µg/ft² in cleaned homes",
    causes: "Lead paint, tracked-in soil",
    actions: "Professional cleaning, HEPA vacuuming",
    ranges: [
      {
        min: 0,
        max: 9.99,
        avgForNY: "<10 µg/ft²",
        causes: "Normal background; routine household dust",
        actions: "Routine cleaning and HEPA vacuuming",
      },
      {
        min: 10,
        max: 99.99,
        avgForNY: "10–99 µg/ft²",
        causes: "Elevated lead dust — possible localized lead sources",
        actions: "Targeted cleaning, consider source investigation",
      },
      {
        min: 100,
        avgForNY: ">=100 µg/ft²",
        causes: "Significant contamination; likely active lead sources",
        actions: "Professional cleaning/abatement and occupant protection",
      },
    ],
  },
  windowSill: {
    avgForNY: "Typically <100 µg/ft²",
    causes: "Exterior paint wear, traffic",
    actions: "Targeted cleaning, abatement if high",
    ranges: [
      {
        min: 0,
        max: 99.99,
        avgForNY: "<100 µg/ft²",
        causes: "Typical deposited dust on sills",
        actions: "Wipe/scrub with HEPA-filtered cleaning",
      },
      {
        min: 100,
        max: 399.99,
        avgForNY: "100–399 µg/ft²",
        causes: "Elevated — likely paint wear or nearby sources",
        actions: "Deep cleaning and inspect paint condition",
      },
      {
        min: 400,
        avgForNY: ">=400 µg/ft²",
        causes: "High contamination; likely ongoing source",
        actions: "Professional abatement recommended",
      },
    ],
  },
  windowTrough: {
    avgForNY: "Typically <400 µg/ft²",
    causes: "Accumulation from sill and exterior",
    actions: "Clean troughs, reduce sources",
    ranges: [
      {
        min: 0,
        max: 399.99,
        avgForNY: "<400 µg/ft²",
        causes: "Normal accumulation",
        actions: "Routine cleaning",
      },
      {
        min: 400,
        max: 999.99,
        avgForNY: "400–999 µg/ft²",
        causes: "Elevated accumulation from nearby sources",
        actions: "Deep clean and investigate nearby paint or soil sources",
      },
      {
        min: 1000,
        avgForNY: ">=1000 µg/ft²",
        causes: "Severe contamination",
        actions: "Professional remediation and occupant protection",
      },
    ],
  },
};

export function getGuidance(metricKey: string, rawValue?: string | number) {
  const def = guidanceMap[metricKey] || {};
  if (rawValue == null || rawValue === "")
    return {
      avgForNY: def.avgForNY || "",
      causes: def.causes || "",
      actions: def.actions || "",
    };

  const value = typeof rawValue === "string" ? parseFloat(rawValue) : rawValue;
  if (Number.isNaN(value)) {
    return {
      avgForNY: def.avgForNY || "",
      causes: def.causes || "",
      actions: def.actions || "",
    };
  }

  // If ranges exist, find the matching one
  if (def.ranges && def.ranges.length) {
    const match = def.ranges.find((r) => {
      const minOk = r.min == null || value >= r.min;
      const maxOk = r.max == null || value <= r.max;
      return minOk && maxOk;
    });
    if (match) {
      return {
        avgForNY: match.avgForNY || def.avgForNY || "",
        causes: match.causes || def.causes || "",
        actions: match.actions || def.actions || "",
      };
    }
  }

  return {
    avgForNY: def.avgForNY || "",
    causes: def.causes || "",
    actions: def.actions || "",
  };
}
