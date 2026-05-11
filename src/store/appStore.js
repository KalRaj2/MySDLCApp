import { create } from "zustand";

const useAppStore = create((set) => ({
  projects: [],

  setProjects: (projects) => set({ projects }),
}));

export default useAppStore;