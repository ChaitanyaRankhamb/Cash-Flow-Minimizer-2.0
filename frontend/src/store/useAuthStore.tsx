import { create } from "zustand";

interface authStoreData {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;
}

export const useAuthStore = create<authStoreData>((set) => ({
  accessToken: null,

  setAccessToken: (token) => set({ accessToken: token }),

  clearAccessToken: () => set({ accessToken: null }),
}));
