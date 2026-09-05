// import { initializeApp, getApps } from 'firebase/app';
// import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
// export const auth = getAuth(app);
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

// Service de reinitialisation de mot de passe securise
export const sendPasswordReset = async (email) => {
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail) {
    throw new Error('Veuillez renseigner une adresse email.');
  }

  try {
    await sendPasswordResetEmail(auth, cleanEmail);
    return { success: true };
  } catch (error) {
    // Protection anti-enumeration : on traite l absence de compte de maniere transparente
    if (error.code === 'auth/user-not-found') {
      return { success: true };
    }

    if (error.code === 'auth/invalid-email') {
      throw new Error('Le format de l adresse email est invalide.');
    }

    if (error.code === 'auth/too-many-requests') {
      throw new Error('Trop de demandes effectuees. Veuillez patienter quelques minutes avant de reessayer.');
    }

    throw new Error('Impossible d envoyer le courriel de reinitialisation pour le moment.');
  }
};