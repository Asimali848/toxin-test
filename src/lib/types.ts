export interface AirTestData {
  carbonDioxide: string;
  carbonMonoxide: string;
  nitrogenDioxide: string;
  pm25: string;
  pm10: string;
  relativeHumidity: string;
  formaldehyde: string;
  tvocs: string;
  pcbs: string;
}

export interface WaterTestData {
  leadInWater: string;
  silver: string;
  arsenic: string;
  barium: string;
  cadmium: string;
  chromium: string;
  mercury: string;
  lead: string;
  selenium: string;
  pfas: string;
  microplastics: string;
}

export interface DustTestData {
  leadDust: string;
}

export interface SurfaceTestData {
  leadPaintRoom1: string;
  leadPaintRoom2: string;
  asbestos: string;
  mold: string;
}

export interface TestData {
  air: AirTestData;
  water: WaterTestData;
  dust: DustTestData;
  surface: SurfaceTestData;
}

export type TabType = "air" | "water" | "surface" | "dust";
