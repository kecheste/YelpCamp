import { create } from "zustand";

interface AuthWindowState {
  signInOpen: boolean;
  signUpOpen: boolean;
  isOpen: boolean;
  setSignInOpen: (value: boolean) => void;
  setSignUpOpen: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}

export const useAuthWindowStore = create<AuthWindowState>((set) => ({
  signInOpen: false,
  signUpOpen: false,
  isOpen: false,
  setSignInOpen: (value: boolean) => set({ signInOpen: value }),
  setSignUpOpen: (value: boolean) => set({ signUpOpen: value }),
  setIsOpen: (value: boolean) => set({ isOpen: value }),
}));
