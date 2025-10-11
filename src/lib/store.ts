import { create } from "zustand";
import type { TabType, TestData, UserInfo } from "./types";

type AppStep = "user-info" | "tests" | "results";

interface TestStore {
  currentStep: AppStep;
  currentTab: TabType;
  data: TestData;
  userInfo: UserInfo;
  showResults: boolean;
  setCurrentStep: (step: AppStep) => void;
  setCurrentTab: (tab: TabType) => void;
  updateAirData: (data: Partial<TestData["air"]>) => void;
  updateWaterData: (data: Partial<TestData["water"]>) => void;
  updateDustData: (data: Partial<TestData["dust"]>) => void;
  updateSurfaceData: (data: Partial<TestData["surface"]>) => void;
  updateUserInfo: (data: Partial<UserInfo>) => void;
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
    pcbs: "",
  },
  dust: {
    leadDust: "",
    surfaceType: "",
    customSurface: "",
    result: "",
  },
  surface: {
    leadPaintRoom1: "",
    leadPaintRoom2: "",
    mold: "",
  },
};

const initialUserInfo: UserInfo = {
  name: "",
  email: "",
  address: "",
  phoneNumber: "",
  inspectionDate: "",
  inspector: "",
};

export const useTestStore = create<TestStore>((set) => ({
  currentStep: "user-info",
  currentTab: "air",
  data: initialData,
  userInfo: initialUserInfo,
  showResults: false,
  setCurrentStep: (step) => set({ currentStep: step }),
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
  updateUserInfo: (data) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...data },
    })),
  resetData: () => set({ 
    data: initialData, 
    userInfo: initialUserInfo, 
    currentStep: "user-info",
    currentTab: "air", 
    showResults: false 
  }),
  setShowResults: (show) => set({ showResults: show }),
}));
