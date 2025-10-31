import { create } from 'zustand';

interface IResetPasswordStore {
    email: string;
    setEmail: (email: string) => void;

    password: string;
    setPassword: (password: string) => void;

    reset: () => void;
}

export const useResetPasswordStore = create<IResetPasswordStore>((set) => ({
    email: '',
    setEmail: (email) => set({ email }),

    password: '',
    setPassword: (password) => set({ password }),

    reset: () => {
        set({
            email: '',
            password: '',
        });
    },
}));
