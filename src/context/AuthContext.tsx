import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../config/firebase';
import {
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logOut,
    resetPassword,
} from '../services/authService';

// ─── Context shape ──────────────────────────────────────────────
interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    googleSignIn: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, displayName: string) => {
        await signUpWithEmail(email, password, displayName);
    };

    const signIn = async (email: string, password: string) => {
        await signInWithEmail(email, password);
    };

    const googleSignIn = async () => {
        await signInWithGoogle();
    };

    const logout = async () => {
        await logOut();
    };

    const forgotPassword = async (email: string) => {
        await resetPassword(email);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, signUp, signIn, googleSignIn, logout, forgotPassword }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ─── Custom hook ────────────────────────────────────────────────
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
