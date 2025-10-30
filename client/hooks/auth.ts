import { create, StateCreator } from 'zustand';

type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    hashedPassword: string;
};

interface AuthState {
    isAuth: boolean;
    user: User | null;
}

interface AuthActions {
    setAuth: (updatedAuth: boolean) => void;
    setUser: (updatedUser: User | null) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuth = create<AuthStore>((set) => ({
    isAuth: false,
    user: null,

    setAuth: (updatedAuth: boolean) => set({ isAuth: updatedAuth }),
    setUser: (updatedUser: User | null) => set({ user: updatedUser }),
}));
