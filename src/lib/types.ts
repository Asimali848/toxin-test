export interface AirTestData {
  carbonDioxide: string;
  carbonMonoxide: string;
  nitrogenDioxide: string;
  pm25: string;
  pm10: string;
  relativeHumidity: string;
  formaldehyde: string;
  tvocs: string;
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
  pcbs: string;
  microplastics: string;
}

export interface DustTestData {
  surfaceType: string;
  customSurface: string;
  leadDust: string;
  result: string;
}

export interface SurfaceTestData {
  leadPaintRoom1: string;
  leadPaintRoom2: string;
  mold: string;
}

export interface TestData {
  air: AirTestData;
  water: WaterTestData;
  dust: DustTestData;
  surface: SurfaceTestData;
}

export interface UserInfo {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  inspectionDate: string;
  inspector: string;
}

export type TabType = "air" | "water" | "surface" | "dust";
