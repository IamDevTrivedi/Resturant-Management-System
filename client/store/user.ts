import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}

export interface IUserData {
    user: IUser | null;
    setUser: (user: IUser | null) => void;

    token: string | null;
    setToken: (token: string | null) => void;

    verifying: boolean;
    setVerifying: (current: boolean) => void;

    isAuthenticated: () => boolean;

    makeLogin: (user: IUser, token: string) => void;
    makeLogout: () => void;

    reset: () => void;
}

export const useUserData = create<IUserData>()(
    persist(
        (set, get) => ({
            user: null,
            setUser: (user: IUser | null) => set({ user }),

            token: null,
            setToken: (token: string | null) => set({ token }),

            verifying: false,
            setVerifying: (current: boolean) => set({ verifying: current }),

            isAuthenticated: () => !!get().token,

            makeLogin: (user: IUser, token: string) => set({ user, token }),
            makeLogout: () => set({ user: null, token: null }),

            reset: () => {
                set({
                    user: null,
                    token: null,
                    verifying: false,
                });
            },
        }),
        {
            name: 'user-storage',
        },
    ),
);
