import { create } from "zustand";
import type { TabType, TestData } from "./types";

interface TestStore {
  currentTab: TabType;
  data: TestData;
  showResults: boolean;
  setCurrentTab: (tab: TabType) => void;
  updateAirData: (data: Partial<TestData["air"]>) => void;
  updateWaterData: (data: Partial<TestData["water"]>) => void;
  updateDustData: (data: Partial<TestData["dust"]>) => void;
  updateSurfaceData: (data: Partial<TestData["surface"]>) => void;
  resetData: () => void;
  setShowResults: (show: boolean) => void;
}

const initialData: TestData = {
  air: {
    carbonDioxide: "",
    carbonMonoxide: "",
    nitrogenDioxide: "",
    pm25: "",
    pm10: "",
    relativeHumidity: "",
    formaldehyde: "",
    tvocs: "",
    pcbs: "",
  },
  water: {
    leadInWater: "",
    silver: "",
    arsenic: "",
    barium: "",
    cadmium: "",
    chromium: "",
    mercury: "",
    lead: "",
    selenium: "",
    pfas: "",
    microplastics: "",
  },
  dust: {
    leadDust: "",
  },
  surface: {
    leadPaintRoom1: "",
    leadPaintRoom2: "",
    asbestos: "",
    mold: "",
  },
};

export const useTestStore = create<TestStore>((set) => ({
  currentTab: "air",
  data: initialData,
  showResults: false,
  setCurrentTab: (tab) => set({ currentTab: tab }),
  updateAirData: (data) =>
    set((state) => ({
      data: { ...state.data, air: { ...state.data.air, ...data } },
    })),
  updateWaterData: (data) =>
    set((state) => ({
      data: { ...state.data, water: { ...state.data.water, ...data } },
    })),
  updateDustData: (data) =>
    set((state) => ({
      data: { ...state.data, dust: { ...state.data.dust, ...data } },
    })),
  updateSurfaceData: (data) =>
    set((state) => ({
      data: { ...state.data, surface: { ...state.data.surface, ...data } },
    })),
  resetData: () => set({ data: initialData, currentTab: "air", showResults: false }),
  setShowResults: (show) => set({ showResults: show }),
}));
