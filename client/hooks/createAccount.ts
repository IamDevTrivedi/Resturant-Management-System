import { create, StateCreator } from 'zustand';

interface AccountState {
    email: string | null;
    isVerified: boolean;
}

interface AccountActions {
    setEmail: (newEmail: string | null) => void;
    setVerified: (value: boolean) => void;
}

type AccountStore = AccountState & AccountActions;

export const useAccount = create<AccountStore>((set) => ({
    email: null,
    isVerified: false,

    setEmail: (newEmail: string | null) => set({ email: newEmail }),
    setVerified: (value: boolean) => set({ isVerified: value }),
}));
