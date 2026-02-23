import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

// ─── Sign up with Email + Password ──────────────────────────────
export const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string
): Promise<User> => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // Set display name on Firebase Auth profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: null,
        createdAt: new Date().toISOString(),
    });

    return user;
};

// ─── Sign in with Email + Password ──────────────────────────────
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
};

// ─── Sign in with Google ────────────────────────────────────────
export const signInWithGoogle = async (): Promise<User> => {
    const { user } = await signInWithPopup(auth, googleProvider);

    // Create/update user doc if it doesn't exist yet
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date().toISOString(),
        });
    }

    return user;
};

// ─── Log out ────────────────────────────────────────────────────
export const logOut = async (): Promise<void> => {
    await signOut(auth);
};

// ─── Password reset ─────────────────────────────────────────────
export const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
};
