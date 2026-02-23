import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCk8RldaJnK2dBWpUNZLg7rbEFsFWc8aj0",
    authDomain: "habit-tracker-7e516.firebaseapp.com",
    projectId: "habit-tracker-7e516",
    storageBucket: "habit-tracker-7e516.firebasestorage.app",
    messagingSenderId: "935756709840",
    appId: "1:935756709840:web:09f0c1edf2da6f8f10c3d5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
