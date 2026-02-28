import { create } from "zustand";
import { CashFlowAppData, guestDefaultData } from "../../../types";

interface AppDataStoreData {
  appData: CashFlowAppData;
  setAppData: (data: CashFlowAppData) => void;
  clearAppData: () => void;
}

export const useAppDataStore = create<AppDataStoreData>((set) => ({
  appData: guestDefaultData,

  setAppData: (data) =>
    set({ appData: data }),

  clearAppData: () =>
    set({ appData:  guestDefaultData}),
}));