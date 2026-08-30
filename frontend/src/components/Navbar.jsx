// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Badge } from 'react-bootstrap';

// export default function Navbar() {
//   const { currentUser, isAdmin, isChef, chefInfo, logout } = useAuth();
//   if (!currentUser) return null;

//   return (
//     <div className="navbar-icam">
//       <div>
//         {isAdmin && (
//           <>
//             <Link to="/import">Import</Link>
//             <Link to="/disponibilites">Disponibilités Chefs</Link>
//             <Link to="/disponibilites-etudiants">Dispo Étudiants</Link>
//             <Link to="/selectionpage">Sélections</Link>
//             <Link to="/ProjectAssignment">Affectations</Link>
//             <Link to="/rendez-vous">Rendez-vous</Link>
//             <Link to="/evaluations">Évaluations</Link>
//           </>
//         )}

//         {isChef && (
//           <>
//             <Link to="/rendez-vous">Mes rendez-vous</Link>
//             <Link to="/evaluations">Mes évaluations</Link>
//           </>
//         )}

//         {!isAdmin && !isChef && (
//           <>
//             <Link to="/rendez-vous">Mes rendez-vous</Link>
//           </>
//         )}
//       </div>

//       <div className="d-flex align-items-center gap-3">
//         <div className="d-flex align-items-center gap-2 text-light small">
//           <span>{currentUser}</span>
//           {isAdmin && <Badge bg="primary">Admin</Badge>}
//           {isChef && (
//             <Badge bg="success">
//               Chef : {chefInfo?.nom || 'Intervenant'}
//             </Badge>
//           )}
//         </div>
//         <button className="btn btn-sm btn-outline-light" onClick={logout}>
//           Déconnexion
//         </button>
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from 'react-bootstrap';

const ADMIN_LINKS = [
  { to: '/import', label: 'Import', icon: '📥' },
  { to: '/disponibilites', label: 'Dispo. Chefs', icon: '🗓️' },
  { to: '/disponibilites-etudiants', label: 'Dispo. Étudiants', icon: '📅' },
  { to: '/selectionpage', label: 'Sélections', icon: '✅' },
  { to: '/ProjectAssignment', label: 'Affectations', icon: '🎯' },
  { to: '/rendez-vous', label: 'Rendez-vous', icon: '🤝' },
  { to: '/evaluations', label: 'Évaluations', icon: '📝' },
];

const CHEF_LINKS = [
  { to: '/rendez-vous', label: 'Mes rendez-vous', icon: '🤝' },
  { to: '/evaluations', label: 'Mes évaluations', icon: '📝' },
];

const STUDENT_LINKS = [{ to: '/rendez-vous', label: 'Mes rendez-vous', icon: '🤝' }];

export default function Navbar() {
  const { currentUser, isAdmin, isChef, chefInfo, logout } = useAuth();
  if (!currentUser) return null;

  const links = isAdmin ? ADMIN_LINKS : isChef ? CHEF_LINKS : STUDENT_LINKS;

  return (
    <>
      <style>{`
        :root {
          --canvas: #0a0e1a;
          --panel: rgba(21, 27, 46, 0.86);
          --panel-solid: #151b2e;
          --panel-raised: #1b2338;
          --border-subtle: rgba(148, 163, 184, 0.14);
          --border-strong: rgba(148, 163, 184, 0.28);
          --text-primary: #f4f6fb;
          --text-muted: #93a0b8;
          --accent-violet: #7c6cf6;
          --accent-violet-soft: rgba(124, 108, 246, 0.18);
          --accent-cyan: #29d3d3;
          --accent-cyan-soft: rgba(41, 211, 211, 0.16);
          --accent-emerald: #35d0a0;
        }

        .app-navbar {
          position: sticky;
          top: 0;
          z-index: 1030;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.6rem 1.25rem;
          background:
            radial-gradient(500px 120px at 0% 0%, rgba(124,108,246,0.16), transparent 60%),
            var(--panel-solid);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(14px);
        }
        .app-navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          white-space: nowrap;
          margin-right: 0.5rem;
        }
        .app-navbar-brand .dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
          box-shadow: 0 0 10px var(--accent-cyan);
        }
        .app-navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-wrap: wrap;
          flex: 1;
        }
        .app-navbar-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.7rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          text-decoration: none;
          border: 1px solid transparent;
          white-space: nowrap;
          transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        }
        .app-navbar-link:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.05);
        }
        .app-navbar-link.active {
          color: var(--accent-cyan);
          background: var(--accent-cyan-soft);
          border-color: rgba(41, 211, 211, 0.35);
        }
        .app-navbar-user {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-shrink: 0;
        }
        .app-navbar-user .who {
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .app-navbar .badge-role-admin {
          background: var(--accent-violet) !important;
        }
        .app-navbar .badge-role-chef {
          background: var(--accent-emerald) !important;
          color: #06231a !important;
        }
        .app-navbar-logout {
          border: 1px solid var(--border-strong);
          background: rgba(255,255,255,0.03);
          color: var(--text-primary);
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .app-navbar-logout:hover {
          background: rgba(255,255,255,0.09);
        }

        @media (max-width: 900px) {
          .app-navbar { flex-wrap: wrap; }
          .app-navbar-links { order: 3; width: 100%; overflow-x: auto; padding-top: 0.4rem; border-top: 1px solid var(--border-subtle); }
        }
      `}</style>

      <div className="app-navbar">
        <div className="app-navbar-brand">
          <span className="dot" />
          ICAM
        </div>

        <div className="app-navbar-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `app-navbar-link${isActive ? ' active' : ''}`}
            >
              <span aria-hidden="true">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="app-navbar-user">
          <span className="who">{currentUser}</span>
          {isAdmin && <Badge className="badge-role-admin">Admin</Badge>}
          {isChef && <Badge className="badge-role-chef">Chef : {chefInfo?.nom || 'Intervenant'}</Badge>}
          <button className="app-navbar-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
}