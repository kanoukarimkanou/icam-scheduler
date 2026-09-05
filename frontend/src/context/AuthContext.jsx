// import React, { createContext, useContext, useState, useEffect } from 'react';
// import {
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
// } from 'firebase/auth';
// import { auth } from '../services/firebase';
// import { supabase } from '../services/supabase';

// export const AuthContext = createContext(null);

// const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin.pse@icam.fr').toLowerCase();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState('student'); // 'admin' | 'chef' | 'student'
//   const [chefInfo, setChefInfo] = useState(null); // { id, nom, email, specialite } si chef
//   const [loading, setLoading] = useState(true);

//   // Détection du rôle de l'utilisateur
//   const determineRole = async (email) => {
//     if (!email) {
//       setRole('student');
//       setChefInfo(null);
//       return;
//     }

//     const cleanEmail = email.toLowerCase().trim();

//     // 1. Administrateur
//     if (cleanEmail === ADMIN_EMAIL) {
//       setRole('admin');
//       setChefInfo(null);
//       return;
//     }

//     // 2. Chef de projet
//     try {
//       const { data: chefData } = await supabase
//         .from('chefs_de_projet')
//         .select('*')
//         .ilike('email', cleanEmail)
//         .maybeSingle();

//       if (chefData) {
//         setRole('chef');
//         setChefInfo(chefData);
//         return;
//       }
//     } catch (err) {
//       console.error('Erreur vérification chef_de_projet:', err);
//     }

//     // 3. Étudiant par défaut
//     setRole('student');
//     setChefInfo(null);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
//       if (currentUser?.email) {
//         await determineRole(currentUser.email);
//       } else {
//         setRole('student');
//         setChefInfo(null);
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

//   const register = async (email, password, username) => {
//     const cred = await createUserWithEmailAndPassword(auth, email, password);
//     const cleanEmail = email.toLowerCase().trim();

//     // Détection du rôle à l'inscription
//     let assignedRole = 'student';
//     let isStaff = false;

//     if (cleanEmail === ADMIN_EMAIL) {
//       assignedRole = 'admin';
//       isStaff = true;
//     } else {
//       const { data: chef } = await supabase
//         .from('chefs_de_projet')
//         .select('id')
//         .ilike('email', cleanEmail)
//         .maybeSingle();

//       if (chef) {
//         assignedRole = 'chef';
//       }
//     }

//     // Synchronisation avec la table users de Supabase
//     const { error } = await supabase.from('users').upsert(
//       {
//         email: cleanEmail,
//         username: username || cleanEmail.split('@')[0],
//         is_active: true,
//         is_staff: isStaff,
//         role: assignedRole,
//       },
//       { onConflict: 'email' }
//     );

//     if (error) throw error;
//     await determineRole(cleanEmail);
//     return cred;
//   };

//   const logout = () => {
//     setRole('student');
//     setChefInfo(null);
//     return signOut(auth);
//   };

//   const getIdToken = () => auth.currentUser?.getIdToken();

//   const value = {
//     user,
//     currentUser: user?.email || null,
//     role,
//     isAdmin: role === 'admin',
//     isChef: role === 'chef',
//     isStudent: role === 'student',
//     chefId: chefInfo?.id || null,
//     chefInfo,
//     login,
//     register,
//     logout,
//     getIdToken,
//   };

//   return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, sendPasswordReset } from '../services/firebase';
import { supabase } from '../services/supabase';

export const AuthContext = createContext(null);

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin.pse@icam.fr').toLowerCase();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); // 'admin' | 'chef' | 'student'
  const [chefInfo, setChefInfo] = useState(null); // { id, nom, email, specialite } si chef
  const [loading, setLoading] = useState(true);

  // Detection du role de l utilisateur
  const determineRole = async (email) => {
    if (!email) {
      setRole('student');
      setChefInfo(null);
      return;
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Administrateur
    if (cleanEmail === ADMIN_EMAIL) {
      setRole('admin');
      setChefInfo(null);
      return;
    }

    // 2. Chef de projet
    try {
      const { data: chefData } = await supabase
        .from('chefs_de_projet')
        .select('*')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (chefData) {
        setRole('chef');
        setChefInfo(chefData);
        return;
      }
    } catch (err) {
      console.error('Erreur verification chef_de_projet:', err);
    }

    // 3. Etudiant par defaut
    setRole('student');
    setChefInfo(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        await determineRole(currentUser.email);
      } else {
        setRole('student');
        setChefInfo(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const register = async (email, password, username) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const cleanEmail = email.toLowerCase().trim();

    // Detection du role a l inscription
    let assignedRole = 'student';
    let isStaff = false;

    if (cleanEmail === ADMIN_EMAIL) {
      assignedRole = 'admin';
      isStaff = true;
    } else {
      const { data: chef } = await supabase
        .from('chefs_de_projet')
        .select('id')
        .ilike('email', cleanEmail)
        .maybeSingle();

      if (chef) {
        assignedRole = 'chef';
      }
    }

    // Synchronisation avec la table users de Supabase
    const { error } = await supabase.from('users').upsert(
      {
        email: cleanEmail,
        username: username || cleanEmail.split('@')[0],
        is_active: true,
        is_staff: isStaff,
        role: assignedRole,
      },
      { onConflict: 'email' }
    );

    if (error) throw error;
    await determineRole(cleanEmail);
    return cred;
  };

  const logout = () => {
    setRole('student');
    setChefInfo(null);
    return signOut(auth);
  };

  // Methode de demande de reinitialisation de mot de passe
  const resetPassword = (email) => {
    return sendPasswordReset(email);
  };

  const getIdToken = () => auth.currentUser?.getIdToken();

  const value = {
    user,
    currentUser: user?.email || null,
    role,
    isAdmin: role === 'admin',
    isChef: role === 'chef',
    isStudent: role === 'student',
    chefId: chefInfo?.id || null,
    chefInfo,
    login,
    register,
    logout,
    resetPassword,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);