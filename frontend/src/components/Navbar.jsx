// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { Badge } from 'react-bootstrap';

// // export default function Navbar() {
// //   const { currentUser, isAdmin, isChef, chefInfo, logout } = useAuth();
// //   if (!currentUser) return null;

// //   return (
// //     <div className="navbar-icam">
// //       <div>
// //         {isAdmin && (
// //           <>
// //             <Link to="/import">Import</Link>
// //             <Link to="/disponibilites">Disponibilités Chefs</Link>
// //             <Link to="/disponibilites-etudiants">Dispo Étudiants</Link>
// //             <Link to="/selectionpage">Sélections</Link>
// //             <Link to="/ProjectAssignment">Affectations</Link>
// //             <Link to="/rendez-vous">Rendez-vous</Link>
// //             <Link to="/evaluations">Évaluations</Link>
// //           </>
// //         )}

// //         {isChef && (
// //           <>
// //             <Link to="/rendez-vous">Mes rendez-vous</Link>
// //             <Link to="/evaluations">Mes évaluations</Link>
// //           </>
// //         )}

// //         {!isAdmin && !isChef && (
// //           <>
// //             <Link to="/rendez-vous">Mes rendez-vous</Link>
// //           </>
// //         )}
// //       </div>

// //       <div className="d-flex align-items-center gap-3">
// //         <div className="d-flex align-items-center gap-2 text-light small">
// //           <span>{currentUser}</span>
// //           {isAdmin && <Badge bg="primary">Admin</Badge>}
// //           {isChef && (
// //             <Badge bg="success">
// //               Chef : {chefInfo?.nom || 'Intervenant'}
// //             </Badge>
// //           )}
// //         </div>
// //         <button className="btn btn-sm btn-outline-light" onClick={logout}>
// //           Déconnexion
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// import React from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { Badge } from 'react-bootstrap';

// const ADMIN_LINKS = [
//   { to: '/import', label: 'Import', icon: '📥' },
//   { to: '/disponibilites', label: 'Dispo. Chefs', icon: '🗓️' },
//   { to: '/disponibilites-etudiants', label: 'Dispo. Étudiants', icon: '📅' },
//   { to: '/selectionpage', label: 'Sélections', icon: '✅' },
//   { to: '/ProjectAssignment', label: 'Affectations', icon: '🎯' },
//   { to: '/rendez-vous', label: 'Rendez-vous', icon: '🤝' },
//   { to: '/evaluations', label: 'Évaluations', icon: '📝' },
// ];

// const CHEF_LINKS = [
//   { to: '/rendez-vous', label: 'Mes rendez-vous', icon: '🤝' },
//   { to: '/evaluations', label: 'Mes évaluations', icon: '📝' },
// ];

// const STUDENT_LINKS = [{ to: '/rendez-vous', label: 'Mes rendez-vous', icon: '🤝' }];

// export default function Navbar() {
//   const { currentUser, isAdmin, isChef, chefInfo, logout } = useAuth();
//   if (!currentUser) return null;

//   const links = isAdmin ? ADMIN_LINKS : isChef ? CHEF_LINKS : STUDENT_LINKS;

//   return (
//     <>
//       <style>{`
//         :root {
//           --canvas: #0a0e1a;
//           --panel: rgba(21, 27, 46, 0.86);
//           --panel-solid: #151b2e;
//           --panel-raised: #1b2338;
//           --border-subtle: rgba(148, 163, 184, 0.14);
//           --border-strong: rgba(148, 163, 184, 0.28);
//           --text-primary: #f4f6fb;
//           --text-muted: #93a0b8;
//           --accent-violet: #7c6cf6;
//           --accent-violet-soft: rgba(124, 108, 246, 0.18);
//           --accent-cyan: #29d3d3;
//           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
//           --accent-emerald: #35d0a0;
//         }

//         .app-navbar {
//           position: sticky;
//           top: 0;
//           z-index: 1030;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 1rem;
//           padding: 0.6rem 1.25rem;
//           background:
//             radial-gradient(500px 120px at 0% 0%, rgba(124,108,246,0.16), transparent 60%),
//             var(--panel-solid);
//           border-bottom: 1px solid var(--border-subtle);
//           backdrop-filter: blur(14px);
//         }
//         .app-navbar-brand {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           font-weight: 800;
//           color: var(--text-primary);
//           letter-spacing: -0.3px;
//           white-space: nowrap;
//           margin-right: 0.5rem;
//         }
//         .app-navbar-brand .dot {
//           width: 9px; height: 9px; border-radius: 50%;
//           background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
//           box-shadow: 0 0 10px var(--accent-cyan);
//         }
//         .app-navbar-links {
//           display: flex;
//           align-items: center;
//           gap: 0.25rem;
//           flex-wrap: wrap;
//           flex: 1;
//         }
//         .app-navbar-link {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.35rem;
//           padding: 0.4rem 0.7rem;
//           border-radius: 8px;
//           font-size: 0.82rem;
//           font-weight: 600;
//           color: var(--text-muted);
//           text-decoration: none;
//           border: 1px solid transparent;
//           white-space: nowrap;
//           transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease;
//         }
//         .app-navbar-link:hover {
//           color: var(--text-primary);
//           background: rgba(255,255,255,0.05);
//         }
//         .app-navbar-link.active {
//           color: var(--accent-cyan);
//           background: var(--accent-cyan-soft);
//           border-color: rgba(41, 211, 211, 0.35);
//         }
//         .app-navbar-user {
//           display: flex;
//           align-items: center;
//           gap: 0.6rem;
//           flex-shrink: 0;
//         }
//         .app-navbar-user .who {
//           color: var(--text-muted);
//           font-size: 0.8rem;
//         }
//         .app-navbar .badge-role-admin {
//           background: var(--accent-violet) !important;
//         }
//         .app-navbar .badge-role-chef {
//           background: var(--accent-emerald) !important;
//           color: #06231a !important;
//         }
//         .app-navbar-logout {
//           border: 1px solid var(--border-strong);
//           background: rgba(255,255,255,0.03);
//           color: var(--text-primary);
//           font-size: 0.78rem;
//           font-weight: 600;
//           padding: 0.35rem 0.75rem;
//           border-radius: 8px;
//           cursor: pointer;
//         }
//         .app-navbar-logout:hover {
//           background: rgba(255,255,255,0.09);
//         }

//         @media (max-width: 900px) {
//           .app-navbar { flex-wrap: wrap; }
//           .app-navbar-links { order: 3; width: 100%; overflow-x: auto; padding-top: 0.4rem; border-top: 1px solid var(--border-subtle); }
//         }
//       `}</style>

//       <div className="app-navbar">
//         <div className="app-navbar-brand">
//           <span className="dot" />
//           ICAM
//         </div>

//         <div className="app-navbar-links">
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               className={({ isActive }) => `app-navbar-link${isActive ? ' active' : ''}`}
//             >
//               <span aria-hidden="true">{l.icon}</span>
//               {l.label}
//             </NavLink>
//           ))}
//         </div>

//         <div className="app-navbar-user">
//           <span className="who">{currentUser}</span>
//           {isAdmin && <Badge className="badge-role-admin">Admin</Badge>}
//           {isChef && <Badge className="badge-role-chef">Chef : {chefInfo?.nom || 'Intervenant'}</Badge>}
//           <button className="app-navbar-logout" onClick={logout}>
//             Déconnexion
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge, Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import {
  resetEntireDatabaseAndStorage,
  clearClientStorageAndCookies,
} from '../services/supabase';

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

  // États pour la modale de Reset Global
  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(null);

  if (!currentUser) return null;

  const links = isAdmin ? ADMIN_LINKS : isChef ? CHEF_LINKS : STUDENT_LINKS;

  const handleGlobalReset = async () => {
    try {
      setResetting(true);
      setError(null);

      // 1. Vidage de la base de données et suppression des PDF dans Supabase Storage
      await resetEntireDatabaseAndStorage();

      // 2. Nettoyage des cookies, localStorage et sessionStorage du navigateur
      clearClientStorageAndCookies();

      // 3. Rechargement propre sur la page d'accueil
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Erreur lors de la remise à zéro complète.');
      setResetting(false);
    }
  };

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

        /* Bouton Reset Global */
        .app-navbar-reset-btn {
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 0.32rem 0.65rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.15s ease;
        }
        .app-navbar-reset-btn:hover {
          background: #dc2626;
          color: #ffffff;
          border-color: #dc2626;
          box-shadow: 0 0 12px rgba(220, 38, 38, 0.5);
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
          transition: background 0.15s ease;
        }
        .app-navbar-logout:hover {
          background: rgba(255,255,255,0.09);
        }

        /* Modal Dark */
        .modal-dark .modal-content {
          background: #12161f !important;
          border: 1px solid var(--border-strong);
          border-radius: 16px;
          color: var(--text-primary);
        }
        .modal-dark .modal-header {
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(239, 68, 68, 0.12);
        }
        .modal-dark .modal-footer {
          border-top: 1px solid var(--border-subtle);
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

          {/* Bouton Reset Global réservé à l'Admin */}
          {isAdmin && (
            <button
              type="button"
              className="app-navbar-reset-btn"
              onClick={() => {
                setShowResetModal(true);
                setConfirmInput('');
                setError(null);
              }}
              title="Remise à zéro complète de la base de données, du Storage et des cookies"
            >
              <span>⚡</span>
              <span>Reset Global</span>
            </button>
          )}

          <button className="app-navbar-logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Modal Confirmation Reset Global */}
      <Modal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        size="lg"
        centered
        className="modal-dark"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.2rem', color: '#f87171', fontWeight: 800 }}>
            ⚠️ Remise à Zéro Totale de l'Application
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {error && <Alert variant="danger">{error}</Alert>}

          <p className="text-light fs-6 mb-3">
            Vous êtes sur le point de réinitialiser l'ensemble de la plateforme pour démarrer une <strong>nouvelle campagne universitaire</strong>.
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
            <h6 className="text-danger fw-bold mb-2">Ce qui sera vidé et supprimé :</h6>
            <ul className="small text-light mb-0" style={{ lineHeight: '1.7' }}>
              <li>🗄️ <strong>Base de données</strong> : Suppression des lignes dans toutes les tables (étudiants, chefs, rendez-vous, évaluations, affectations, disponibilités, vœux, questionnaires).</li>
              <li>☁️ <strong>Cloud Storage</strong> : Suppression de tous les fichiers PDF (CVs et lettres de motivation).</li>
              <li>🍪 <strong>Navigateur</strong> : Suppression des cookies, du <code>localStorage</code> et de la mémoire de session.</li>
              <li>🛡️ <em>Votre compte administrateur principal reste préservé et la structure SQL reste intacte.</em></li>
            </ul>
          </div>

          <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)' }}>
            <Form.Label className="small text-danger fw-bold mb-2">
              Confirmation de sécurité : Tapez le mot « RESET » en majuscules pour débloquer :
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Tapez RESET"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="bg-dark text-white border-danger font-monospace fw-bold"
            />
          </div>

          <p className="text-muted small mb-0">
            ⚠️ Cette action est irréversible et effacera toutes les données de la session terminée.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleGlobalReset}
            disabled={confirmInput !== 'RESET' || resetting}
            className="fw-bold"
          >
            {resetting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Remise à zéro en cours...
              </>
            ) : (
              'Confirmer la remise à zéro totale'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}