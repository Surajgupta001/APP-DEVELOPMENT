import { create } from "zustand";

interface UserStore {
    currency: string;
    setCurrency: (currency: string) => void;
    needsOnboarding: boolean | null; // null = not yet determined
    setNeedsOnboarding: (value: boolean | null) => void;
};

// Create a Zustand store for user data
export const useUserStore = create<UserStore>((set) => ({
    currency: "USD",
    setCurrency: (value) => set({ currency: value }),
    needsOnboarding: null,
    setNeedsOnboarding: (value) => set({ needsOnboarding: value }),
}));