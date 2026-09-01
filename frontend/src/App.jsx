// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';

// import LoginForm from './components/LoginForm';
// import RegisterForm from './components/RegisterForm';
// import SelectionPage from './components/SelectionPage';
// import RendezVousPage from './components/RendezVousPage';
// import DisponibilitesPage from './components/DisponibilitesPage';
// import DisponibilitesEtudiantPage from './components/DisponibilitesEtudiantPage';
// import ProjectAssignment from './components/ProjectAssignment';
// import EvaluationsTable from './components/EvaluationsTable';
// import ImportPage from './components/ImportPage';
// import ProtectedRoute from './components/ProtectedRoute';

// export default function App() {
//   const { currentUser, isAdmin, isChef } = useAuth();

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             !currentUser ? (
//               <LoginForm />
//             ) : isAdmin ? (
//               <Navigate to="/selectionpage" />
//             ) : isChef ? (
//               <Navigate to="/rendez-vous" />
//             ) : (
//               <Navigate to="/rendez-vous" />
//             )
//           }
//         />
//         <Route path="/register" element={<RegisterForm />} />

//         {/* Route Admin : Sélections */}
//         <Route
//           path="/selectionpage"
//           element={<ProtectedRoute adminOnly element={<SelectionPage />} />}
//         />

//         {/* Route Accessible à Tous les utilisateurs connectés */}
//         <Route path="/rendez-vous" element={<ProtectedRoute element={<RendezVousPage />} />} />

//         {/* Route Accessible aux Administrateurs et aux Chefs de projet */}
//         <Route
//           path="/evaluations"
//           element={
//             <ProtectedRoute
//               element={isAdmin || isChef ? <EvaluationsTable /> : <Navigate to="/rendez-vous" />}
//             />
//           }
//         />

//         {/* Routes Admin Uniquement */}
//         <Route
//           path="/import"
//           element={<ProtectedRoute adminOnly element={<ImportPage />} />}
//         />
//         <Route
//           path="/disponibilites"
//           element={<ProtectedRoute adminOnly element={<DisponibilitesPage />} />}
//         />
//         <Route
//           path="/disponibilites-etudiants"
//           element={<ProtectedRoute adminOnly element={<DisponibilitesEtudiantPage />} />}
//         />
//         <Route
//           path="/ProjectAssignment"
//           element={<ProtectedRoute adminOnly element={<ProjectAssignment />} />}
//         />

//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SelectionPage from './components/SelectionPage';
import RendezVousPage from './components/RendezVousPage';
import DisponibilitesPage from './components/DisponibilitesPage';
import DisponibilitesEtudiantPage from './components/DisponibilitesEtudiantPage';
import ProjectAssignment from './components/ProjectAssignment';
import EvaluationsTable from './components/EvaluationsTable';
import ImportPage from './components/ImportPage';
import ParametresCompetencesPage from './components/ParametresCompetencesPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { currentUser, isAdmin, isChef } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !currentUser ? (
              <LoginForm />
            ) : isAdmin ? (
              <Navigate to="/selectionpage" />
            ) : isChef ? (
              <Navigate to="/rendez-vous" />
            ) : (
              <Navigate to="/rendez-vous" />
            )
          }
        />
        <Route path="/register" element={<RegisterForm />} />

        {/* Route Admin : Sélections */}
        <Route
          path="/selectionpage"
          element={<ProtectedRoute adminOnly element={<SelectionPage />} />}
        />

        {/* Route Accessible à Tous les utilisateurs connectés */}
        <Route path="/rendez-vous" element={<ProtectedRoute element={<RendezVousPage />} />} />

        {/* Route Accessible aux Administrateurs et aux Chefs de projet */}
        <Route
          path="/evaluations"
          element={
            <ProtectedRoute
              element={isAdmin || isChef ? <EvaluationsTable /> : <Navigate to="/rendez-vous" />}
            />
          }
        />

        {/* Routes Admin Uniquement */}
        <Route
          path="/import"
          element={<ProtectedRoute adminOnly element={<ImportPage />} />}
        />
        <Route
          path="/competences"
          element={<ProtectedRoute adminOnly element={<ParametresCompetencesPage />} />}
        />
        <Route
          path="/disponibilites"
          element={<ProtectedRoute adminOnly element={<DisponibilitesPage />} />}
        />
        <Route
          path="/disponibilites-etudiants"
          element={<ProtectedRoute adminOnly element={<DisponibilitesEtudiantPage />} />}
        />
        <Route
          path="/ProjectAssignment"
          element={<ProtectedRoute adminOnly element={<ProjectAssignment />} />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}