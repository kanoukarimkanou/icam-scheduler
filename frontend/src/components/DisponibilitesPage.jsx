// // // import React, { useEffect, useState } from 'react';
// // // import { Form, Button, Alert, Spinner } from 'react-bootstrap';
// // // import Navbar from './Navbar';
// // // import {
// // //   fetchChefsDeProjet,
// // //   fetchDisponibiliteChef,
// // //   saveDisponibiliteChef,
// // // } from '../services/supabase';

// // // const NB_SLOTS = 40;
// // // const HEURE_DEBUT = 8 * 60; // 08:00 en minutes
// // // const DUREE_SLOT = 15;

// // // function slotLabel(i) {
// // //   const mins = HEURE_DEBUT + i * DUREE_SLOT;
// // //   const h = Math.floor(mins / 60);
// // //   const m = mins % 60;
// // //   return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
// // // }

// // // export default function DisponibilitesPage() {
// // //   const [chefs, setChefs] = useState([]);
// // //   const [chefId, setChefId] = useState('');
// // //   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
// // //   const [slots, setSlots] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [success, setSuccess] = useState(false);

// // //   useEffect(() => {
// // //     fetchChefsDeProjet()
// // //       .then((data) => {
// // //         setChefs(data);
// // //         if (data.length) setChefId(String(data[0].id));
// // //       })
// // //       .catch((err) => setError(err.message));
// // //   }, []);

// // //   useEffect(() => {
// // //     if (!chefId || !date) return;
// // //     setLoading(true);
// // //     setSuccess(false);
// // //     fetchDisponibiliteChef(Number(chefId), date)
// // //       .then(setSlots)
// // //       .catch((err) => setError(err.message))
// // //       .finally(() => setLoading(false));
// // //   }, [chefId, date]);

// // //   const toggleSlot = (i) => {
// // //     const key = `slot${i + 1}`;
// // //     setSlots((prev) => ({ ...prev, [key]: prev[key] === '0' ? '1' : '0' }));
// // //   };

// // //   const handleSave = async () => {
// // //     setSaving(true);
// // //     setError(null);
// // //     try {
// // //       await saveDisponibiliteChef(Number(chefId), date, slots);
// // //       setSuccess(true);
// // //     } catch (err) {
// // //       setError(err.message);
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <div className="page-container">
// // //         <h2>Disponibilités des chefs de projet</h2>
// // //         <p className="text-muted">
// // //           Cliquez sur un créneau pour basculer entre <strong>libre</strong> (vert) et{' '}
// // //           <strong>occupé</strong> (rouge), puis enregistrez.
// // //         </p>
// // //         {error && <Alert variant="danger">{error}</Alert>}
// // //         {success && <Alert variant="success">Disponibilités enregistrées.</Alert>}

// // //         <div className="d-flex gap-3 mb-3 flex-wrap">
// // //           <Form.Group>
// // //             <Form.Label>Chef de projet</Form.Label>
// // //             <Form.Select value={chefId} onChange={(e) => setChefId(e.target.value)}>
// // //               {chefs.map((c) => (
// // //                 <option key={c.id} value={c.id}>
// // //                   {c.nom}
// // //                 </option>
// // //               ))}
// // //             </Form.Select>
// // //           </Form.Group>
// // //           <Form.Group>
// // //             <Form.Label>Date</Form.Label>
// // //             <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
// // //           </Form.Group>
// // //         </div>

// // //         {loading || !slots ? (
// // //           <Spinner animation="border" />
// // //         ) : (
// // //           <>
// // //             <div className="slot-grid">
// // //               {Array.from({ length: NB_SLOTS }, (_, i) => {
// // //                 const key = `slot${i + 1}`;
// // //                 const free = slots[key] === '0';
// // //                 return (
// // //                   <div
// // //                     key={key}
// // //                     className={`slot-cell ${free ? 'free' : 'busy'}`}
// // //                     onClick={() => toggleSlot(i)}
// // //                   >
// // //                     {slotLabel(i)}
// // //                   </div>
// // //                 );
// // //               })}
// // //             </div>
// // //             <Button onClick={handleSave} disabled={saving}>
// // //               {saving ? 'Enregistrement…' : 'Enregistrer'}
// // //             </Button>
// // //           </>
// // //         )}
// // //       </div>
// // //     </>
// // //   );
// // // }
// // import React, { useEffect, useState, useMemo } from 'react';
// // import { Form, Button, Alert, Spinner } from 'react-bootstrap';
// // import Navbar from './Navbar';
// // import {
// //   fetchChefsDeProjet,
// //   fetchDisponibiliteChef,
// //   saveDisponibiliteChef,
// // } from '../services/supabase';

// // // ============================================================================
// // // Constantes & helpers métier (logique inchangée)
// // // ============================================================================

// // const NB_SLOTS = 40;
// // const HEURE_DEBUT = 8 * 60; // 08:00 en minutes
// // const DUREE_SLOT = 15;

// // function slotLabel(i) {
// //   const mins = HEURE_DEBUT + i * DUREE_SLOT;
// //   const h = Math.floor(mins / 60);
// //   const m = mins % 60;
// //   return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
// // }

// // // Regroupement purement visuel des 40 créneaux par heure pleine (10 x 4).
// // const HOUR_GROUPS = Array.from({ length: 10 }, (_, h) => ({
// //   label: `${8 + h}h`,
// //   start: h * 4,
// // }));

// // // ============================================================================
// // // Styles (mêmes tokens que la page "Disponibilités des étudiants" pour
// // // garder une identité visuelle cohérente dans l'application)
// // // ============================================================================

// // const STYLE_SHEET = `
// // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // .dispo-chef-page {
// //   --bg: #0a0d12;
// //   --surface: #12161f;
// //   --surface-2: #1a2029;
// //   --surface-hover: #212836;
// //   --border: #232a37;
// //   --border-soft: #1c222c;
// //   --text: #e9ecf1;
// //   --text-muted: #8b93a5;
// //   --text-faint: #5a6272;
// //   --accent: #2dd4bf;
// //   --accent-soft: rgba(45, 212, 191, 0.14);
// //   --danger: #f2545b;
// //   --danger-soft: rgba(242, 84, 91, 0.14);
// //   --radius: 10px;
// //   --radius-lg: 14px;
// //   font-family: 'Inter', -apple-system, sans-serif;
// //   background: var(--bg);
// //   min-height: 100vh;
// //   color: var(--text);
// // }

// // .dispo-chef-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
// // .dispo-chef-page .display { font-family: 'Space Grotesk', sans-serif; }

// // .dispo-chef-shell {
// //   max-width: 1100px;
// //   margin: 0 auto;
// //   padding: 1.75rem 1.5rem 4rem;
// // }

// // /* ---------- Header ---------- */
// // .dispo-chef-header { margin-bottom: 1.25rem; }
// // .dispo-chef-title {
// //   font-size: 1.5rem;
// //   font-weight: 700;
// //   letter-spacing: -0.02em;
// //   margin: 0 0 0.3rem;
// //   color: #fff;
// // }
// // .dispo-chef-subtitle { color: var(--text-muted); font-size: 0.85rem; margin: 0; }
// // .dispo-chef-legend {
// //   display: inline-flex;
// //   align-items: center;
// //   gap: 0.4rem;
// //   margin-left: 0.75rem;
// //   font-size: 0.78rem;
// // }
// // .dispo-chef-legend-dot { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }

// // /* ---------- Alerts ---------- */
// // .dispo-chef-alerts { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
// // .dispo-chef-alerts .alert { border-radius: var(--radius); border: 1px solid var(--border); margin: 0; }

// // /* ---------- Toolbar ---------- */
// // .dispo-chef-toolbar {
// //   background: var(--surface);
// //   border: 1px solid var(--border);
// //   border-radius: var(--radius-lg);
// //   padding: 1.1rem 1.2rem;
// //   margin-bottom: 1.25rem;
// //   display: flex;
// //   gap: 1.5rem;
// //   flex-wrap: wrap;
// //   align-items: flex-end;
// // }
// // .dispo-chef-toolbar label {
// //   color: var(--text-faint);
// //   font-size: 0.7rem;
// //   text-transform: uppercase;
// //   letter-spacing: 0.06em;
// //   font-weight: 600;
// //   margin-bottom: 0.35rem;
// //   display: block;
// // }
// // .dispo-chef-toolbar .form-select,
// // .dispo-chef-toolbar .form-control {
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   color: var(--text);
// //   min-width: 220px;
// // }
// // .dispo-chef-toolbar .form-select:focus,
// // .dispo-chef-toolbar .form-control:focus {
// //   background: var(--surface-2);
// //   border-color: var(--accent);
// //   color: var(--text);
// //   box-shadow: 0 0 0 3px var(--accent-soft);
// // }

// // .chef-chip {
// //   margin-left: auto;
// //   display: flex;
// //   align-items: center;
// //   gap: 0.6rem;
// // }
// // .chef-avatar {
// //   width: 34px;
// //   height: 34px;
// //   border-radius: 9px;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   font-size: 0.75rem;
// //   font-weight: 700;
// //   color: var(--accent);
// //   flex-shrink: 0;
// // }
// // .stat-chip {
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   border-radius: 999px;
// //   padding: 0.35rem 0.8rem;
// //   font-size: 0.78rem;
// //   color: var(--text-muted);
// //   white-space: nowrap;
// // }
// // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }

// // /* ---------- Schedule card ---------- */
// // .schedule-card {
// //   background: var(--surface);
// //   border: 1px solid var(--border);
// //   border-radius: var(--radius-lg);
// //   padding: 1.3rem 1.2rem 1.5rem;
// // }

// // .hour-groups {
// //   display: flex;
// //   flex-wrap: wrap;
// //   gap: 12px;
// // }
// // .hour-group { display: flex; flex-direction: column; gap: 5px; }
// // .hour-label {
// //   font-family: 'JetBrains Mono', monospace;
// //   font-size: 0.7rem;
// //   color: var(--text-faint);
// //   text-align: center;
// //   letter-spacing: 0.03em;
// // }
// // .hour-cells { display: flex; gap: 4px; }

// // .slot-cell {
// //   width: 38px;
// //   height: 38px;
// //   border-radius: 7px;
// //   border: 1px solid transparent;
// //   cursor: pointer;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   font-family: 'JetBrains Mono', monospace;
// //   font-size: 0.62rem;
// //   font-weight: 500;
// //   transition: transform 0.08s ease, box-shadow 0.12s ease;
// //   user-select: none;
// // }
// // .slot-cell:hover { transform: scale(1.1); z-index: 1; position: relative; }
// // .slot-cell:focus-visible {
// //   outline: none;
// //   box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
// // }
// // .slot-cell.free { background: var(--accent); color: #06201c; }
// // .slot-cell.busy { background: var(--surface-2); border-color: var(--border); color: var(--text-faint); }
// // .slot-cell.busy:hover { background: var(--danger-soft); border-color: var(--danger); color: #fecdd0; }

// // /* ---------- Footer action bar ---------- */
// // .dispo-chef-footer {
// //   position: sticky;
// //   bottom: 1rem;
// //   margin-top: 1.5rem;
// //   display: flex;
// //   justify-content: flex-end;
// // }
// // .btn-save {
// //   background: var(--accent) !important;
// //   border: none !important;
// //   color: #06201c !important;
// //   font-weight: 600;
// //   padding: 0.6rem 1.3rem !important;
// //   border-radius: var(--radius) !important;
// //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 10px 24px -10px rgba(45, 212, 191, 0.55);
// //   transition: transform 0.12s ease;
// // }
// // .btn-save:hover:not(:disabled) { transform: translateY(-1px); }
// // .btn-save:disabled { opacity: 0.6; }

// // .loading-state, .empty-state {
// //   text-align: center;
// //   padding: 3.5rem 1rem;
// //   color: var(--text-muted);
// //   background: var(--surface);
// //   border: 1px dashed var(--border);
// //   border-radius: var(--radius-lg);
// // }

// // @media (max-width: 640px) {
// //   .dispo-chef-shell { padding: 1.1rem 0.85rem 3rem; }
// //   .dispo-chef-toolbar { flex-direction: column; align-items: stretch; }
// //   .dispo-chef-toolbar .form-select,
// //   .dispo-chef-toolbar .form-control { min-width: 0; width: 100%; }
// //   .chef-chip { margin-left: 0; }
// //   .slot-cell { width: 30px; height: 30px; font-size: 0; }
// //   .dispo-chef-footer { position: static; }
// // }
// // `;

// // // ============================================================================
// // // Composant principal
// // // ============================================================================

// // export default function DisponibilitesPage() {
// //   const [chefs, setChefs] = useState([]);
// //   const [chefId, setChefId] = useState('');
// //   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
// //   const [slots, setSlots] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [success, setSuccess] = useState(false);

// //   useEffect(() => {
// //     fetchChefsDeProjet()
// //       .then((data) => {
// //         setChefs(data);
// //         if (data.length) setChefId(String(data[0].id));
// //       })
// //       .catch((err) => setError(err.message));
// //   }, []);

// //   useEffect(() => {
// //     if (!chefId || !date) return;
// //     setLoading(true);
// //     setSuccess(false);
// //     fetchDisponibiliteChef(Number(chefId), date)
// //       .then(setSlots)
// //       .catch((err) => setError(err.message))
// //       .finally(() => setLoading(false));
// //   }, [chefId, date]);

// //   const toggleSlot = (i) => {
// //     const key = `slot${i + 1}`;
// //     setSlots((prev) => ({ ...prev, [key]: prev[key] === '0' ? '1' : '0' }));
// //     setSuccess(false);
// //   };

// //   const handleSave = async () => {
// //     setSaving(true);
// //     setError(null);
// //     try {
// //       await saveDisponibiliteChef(Number(chefId), date, slots);
// //       setSuccess(true);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const selectedChef = useMemo(
// //     () => chefs.find((c) => String(c.id) === String(chefId)),
// //     [chefs, chefId]
// //   );

// //   const freeCount = useMemo(() => {
// //     if (!slots) return 0;
// //     return Object.values(slots).filter((v) => v === '0').length;
// //   }, [slots]);

// //   const initials = (selectedChef?.nom || '')
// //     .split(' ')
// //     .map((p) => p[0])
// //     .filter(Boolean)
// //     .slice(0, 2)
// //     .join('')
// //     .toUpperCase();

// //   return (
// //     <>
// //       <Navbar />
// //       <style>{STYLE_SHEET}</style>

// //       <div className="dispo-chef-page">
// //         <div className="dispo-chef-shell">
// //           <div className="dispo-chef-header">
// //             <h2 className="dispo-chef-title display">Disponibilités des chefs de projet</h2>
// //             <p className="dispo-chef-subtitle">
// //               Cliquez sur un créneau pour basculer entre libre et occupé, puis enregistrez.
// //               <span className="dispo-chef-legend">
// //                 <span className="dispo-chef-legend-dot" style={{ background: '#2dd4bf' }} />
// //                 Libre
// //               </span>
// //               <span className="dispo-chef-legend">
// //                 <span className="dispo-chef-legend-dot" style={{ background: '#2a3140' }} />
// //                 Occupé
// //               </span>
// //             </p>
// //           </div>

// //           {(error || success) && (
// //             <div className="dispo-chef-alerts">
// //               {error && (
// //                 <Alert variant="danger" dismissible onClose={() => setError(null)}>
// //                   {error}
// //                 </Alert>
// //               )}
// //               {success && (
// //                 <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
// //                   Disponibilités enregistrées.
// //                 </Alert>
// //               )}
// //             </div>
// //           )}

// //           <div className="dispo-chef-toolbar">
// //             <Form.Group>
// //               <Form.Label>Chef de projet</Form.Label>
// //               <Form.Select value={chefId} onChange={(e) => setChefId(e.target.value)}>
// //                 {chefs.map((c) => (
// //                   <option key={c.id} value={c.id}>
// //                     {c.nom}
// //                   </option>
// //                 ))}
// //               </Form.Select>
// //             </Form.Group>

// //             <Form.Group>
// //               <Form.Label>Date</Form.Label>
// //               <Form.Control
// //                 type="date"
// //                 value={date}
// //                 onChange={(e) => setDate(e.target.value)}
// //               />
// //             </Form.Group>

// //             {selectedChef && slots && (
// //               <div className="chef-chip">
// //                 <span className="chef-avatar">{initials || '?'}</span>
// //                 <span className="stat-chip">
// //                   <strong>{freeCount}</strong>/{NB_SLOTS} créneaux libres
// //                 </span>
// //               </div>
// //             )}
// //           </div>

// //           {loading || !slots ? (
// //             <div className="loading-state">
// //               <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// //               <p className="mt-3 mb-0">Chargement des disponibilités...</p>
// //             </div>
// //           ) : chefs.length === 0 ? (
// //             <div className="empty-state">Aucun chef de projet enregistré pour le moment.</div>
// //           ) : (
// //             <>
// //               <div className="schedule-card">
// //                 <div className="hour-groups">
// //                   {HOUR_GROUPS.map((group) => (
// //                     <div className="hour-group" key={group.label}>
// //                       <div className="hour-label">{group.label}</div>
// //                       <div className="hour-cells">
// //                         {[0, 1, 2, 3].map((offset) => {
// //                           const idx = group.start + offset;
// //                           const key = `slot${idx + 1}`;
// //                           const free = slots[key] === '0';
// //                           return (
// //                             <button
// //                               key={key}
// //                               type="button"
// //                               className={`slot-cell ${free ? 'free' : 'busy'}`}
// //                               aria-pressed={free}
// //                               aria-label={`${slotLabel(idx)} — ${free ? 'libre' : 'occupé'}`}
// //                               title={`${slotLabel(idx)} · ${free ? 'Libre' : 'Occupé'}`}
// //                               onClick={() => toggleSlot(idx)}
// //                             />
// //                           );
// //                         })}
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="dispo-chef-footer">
// //                 <Button className="btn-save" onClick={handleSave} disabled={saving}>
// //                   {saving ? (
// //                     <>
// //                       <Spinner size="sm" animation="border" className="me-2" />
// //                       Enregistrement…
// //                     </>
// //                   ) : (
// //                     'Enregistrer'
// //                   )}
// //                 </Button>
// //               </div>
// //             </>
// //           )}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// import React, { useEffect, useState, useMemo } from 'react';
// import { Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
// import Navbar from './Navbar';
// import {
//   fetchChefsDeProjet,
//   fetchDisponibiliteChef,
//   saveDisponibiliteChef,
//   resetAllDisponibilites,
// } from '../services/supabase';

// // ============================================================================
// // Constantes & helpers métier
// // ============================================================================

// const NB_SLOTS = 40;
// const HEURE_DEBUT = 8 * 60; // 08:00 en minutes
// const DUREE_SLOT = 15;

// function slotLabel(i) {
//   const mins = HEURE_DEBUT + i * DUREE_SLOT;
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
// }

// const HOUR_GROUPS = Array.from({ length: 10 }, (_, h) => ({
//   label: `${8 + h}h`,
//   start: h * 4,
// }));

// // ============================================================================
// // Styles
// // ============================================================================

// const STYLE_SHEET = `
// @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// .dispo-chef-page {
//   --bg: #0a0d12;
//   --surface: #12161f;
//   --surface-2: #1a2029;
//   --surface-hover: #212836;
//   --border: #232a37;
//   --border-soft: #1c222c;
//   --text: #e9ecf1;
//   --text-muted: #8b93a5;
//   --text-faint: #5a6272;
//   --accent: #2dd4bf;
//   --accent-soft: rgba(45, 212, 191, 0.14);
//   --danger: #f2545b;
//   --danger-soft: rgba(242, 84, 91, 0.14);
//   --radius: 10px;
//   --radius-lg: 14px;
//   font-family: 'Inter', -apple-system, sans-serif;
//   background: var(--bg);
//   min-height: 100vh;
//   color: var(--text);
// }

// .dispo-chef-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
// .dispo-chef-page .display { font-family: 'Space Grotesk', sans-serif; }

// .dispo-chef-shell {
//   max-width: 1100px;
//   margin: 0 auto;
//   padding: 1.75rem 1.5rem 4rem;
// }

// /* ---------- Header ---------- */
// .dispo-chef-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 1rem;
//   flex-wrap: wrap;
//   margin-bottom: 1.25rem;
// }
// .dispo-chef-title {
//   font-size: 1.5rem;
//   font-weight: 700;
//   letter-spacing: -0.02em;
//   margin: 0 0 0.3rem;
//   color: #fff;
// }
// .dispo-chef-subtitle { color: var(--text-muted); font-size: 0.85rem; margin: 0; }
// .dispo-chef-legend {
//   display: inline-flex;
//   align-items: center;
//   gap: 0.4rem;
//   margin-left: 0.75rem;
//   font-size: 0.78rem;
// }
// .dispo-chef-legend-dot { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }

// .btn-danger-pill {
//   background: rgba(242, 84, 91, 0.14) !important;
//   color: #fca5a5 !important;
//   border: 1px solid rgba(242, 84, 91, 0.35) !important;
//   border-radius: 999px !important;
//   font-weight: 600 !important;
//   font-size: 0.82rem !important;
//   padding: 0.45rem 1rem !important;
//   transition: all 0.15s ease;
// }
// .btn-danger-pill:hover:not(:disabled) {
//   background: #dc2626 !important;
//   color: #ffffff !important;
//   border-color: #dc2626 !important;
// }

// /* ---------- Alerts ---------- */
// .dispo-chef-alerts { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
// .dispo-chef-alerts .alert { border-radius: var(--radius); border: 1px solid var(--border); margin: 0; }

// /* ---------- Toolbar ---------- */
// .dispo-chef-toolbar {
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: var(--radius-lg);
//   padding: 1.1rem 1.2rem;
//   margin-bottom: 1.25rem;
//   display: flex;
//   gap: 1.5rem;
//   flex-wrap: wrap;
//   align-items: flex-end;
// }
// .dispo-chef-toolbar label {
//   color: var(--text-faint);
//   font-size: 0.7rem;
//   text-transform: uppercase;
//   letter-spacing: 0.06em;
//   font-weight: 600;
//   margin-bottom: 0.35rem;
//   display: block;
// }
// .dispo-chef-toolbar .form-select,
// .dispo-chef-toolbar .form-control {
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   color: var(--text);
//   min-width: 220px;
// }
// .dispo-chef-toolbar .form-select:focus,
// .dispo-chef-toolbar .form-control:focus {
//   background: var(--surface-2);
//   border-color: var(--accent);
//   color: var(--text);
//   box-shadow: 0 0 0 3px var(--accent-soft);
// }

// .chef-chip {
//   margin-left: auto;
//   display: flex;
//   align-items: center;
//   gap: 0.6rem;
// }
// .chef-avatar {
//   width: 34px;
//   height: 34px;
//   border-radius: 9px;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 0.75rem;
//   font-weight: 700;
//   color: var(--accent);
//   flex-shrink: 0;
// }
// .stat-chip {
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   border-radius: 999px;
//   padding: 0.35rem 0.8rem;
//   font-size: 0.78rem;
//   color: var(--text-muted);
//   white-space: nowrap;
// }
// .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }

// /* ---------- Schedule card ---------- */
// .schedule-card {
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: var(--radius-lg);
//   padding: 1.3rem 1.2rem 1.5rem;
// }

// .hour-groups {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
// }
// .hour-group { display: flex; flex-direction: column; gap: 5px; }
// .hour-label {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.7rem;
//   color: var(--text-faint);
//   text-align: center;
//   letter-spacing: 0.03em;
// }
// .hour-cells { display: flex; gap: 4px; }

// .slot-cell {
//   width: 38px;
//   height: 38px;
//   border-radius: 7px;
//   border: 1px solid transparent;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.62rem;
//   font-weight: 500;
//   transition: transform 0.08s ease, box-shadow 0.12s ease;
//   user-select: none;
// }
// .slot-cell:hover { transform: scale(1.1); z-index: 1; position: relative; }
// .slot-cell:focus-visible {
//   outline: none;
//   box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
// }
// .slot-cell.free { background: var(--accent); color: #06201c; }
// .slot-cell.busy { background: var(--surface-2); border-color: var(--border); color: var(--text-faint); }
// .slot-cell.busy:hover { background: var(--danger-soft); border-color: var(--danger); color: #fecdd0; }

// /* ---------- Footer action bar ---------- */
// .dispo-chef-footer {
//   position: sticky;
//   bottom: 1rem;
//   margin-top: 1.5rem;
//   display: flex;
//   justify-content: flex-end;
// }
// .btn-save {
//   background: var(--accent) !important;
//   border: none !important;
//   color: #06201c !important;
//   font-weight: 600;
//   padding: 0.6rem 1.3rem !important;
//   border-radius: var(--radius) !important;
//   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 10px 24px -10px rgba(45, 212, 191, 0.55);
//   transition: transform 0.12s ease;
// }
// .btn-save:hover:not(:disabled) { transform: translateY(-1px); }
// .btn-save:disabled { opacity: 0.6; }

// .loading-state, .empty-state {
//   text-align: center;
//   padding: 3.5rem 1rem;
//   color: var(--text-muted);
//   background: var(--surface);
//   border: 1px dashed var(--border);
//   border-radius: var(--radius-lg);
// }

// /* Modal Dark */
// .modal-dark .modal-content {
//   background: #12161f !important;
//   border: 1px solid var(--border);
//   border-radius: 16px;
//   color: var(--text);
// }
// .modal-dark .modal-header {
//   border-bottom: 1px solid var(--border);
//   background: rgba(242, 84, 91, 0.08);
// }
// .modal-dark .modal-footer {
//   border-top: 1px solid var(--border);
// }

// @media (max-width: 640px) {
//   .dispo-chef-shell { padding: 1.1rem 0.85rem 3rem; }
//   .dispo-chef-toolbar { flex-direction: column; align-items: stretch; }
//   .dispo-chef-toolbar .form-select,
//   .dispo-chef-toolbar .form-control { min-width: 0; width: 100%; }
//   .chef-chip { margin-left: 0; }
//   .slot-cell { width: 30px; height: 30px; font-size: 0; }
//   .dispo-chef-footer { position: static; }
// }
// `;

// // ============================================================================
// // Composant principal
// // ============================================================================

// export default function DisponibilitesPage() {
//   const [chefs, setChefs] = useState([]);
//   const [chefId, setChefId] = useState('');
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
//   const [slots, setSlots] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   // État Réinitialisation
//   const [showResetModal, setShowResetModal] = useState(false);
//   const [resetOption, setResetOption] = useState('current_chef_date');
//   const [resetting, setResetting] = useState(false);

//   useEffect(() => {
//     fetchChefsDeProjet()
//       .then((data) => {
//         setChefs(data);
//         if (data.length) setChefId(String(data[0].id));
//       })
//       .catch((err) => setError(err.message));
//   }, []);

//   useEffect(() => {
//     if (!chefId || !date) return;
//     setLoading(true);
//     setSuccess(false);
//     fetchDisponibiliteChef(Number(chefId), date)
//       .then(setSlots)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [chefId, date]);

//   const toggleSlot = (i) => {
//     const key = `slot${i + 1}`;
//     setSlots((prev) => ({ ...prev, [key]: prev[key] === '0' ? '1' : '0' }));
//     setSuccess(false);
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     setError(null);
//     try {
//       await saveDisponibiliteChef(Number(chefId), date, slots);
//       setSuccess(true);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Action de Réinitialisation ciblée des disponibilités des chefs
//   const handleResetDisponibilites = async () => {
//     try {
//       setResetting(true);
//       setError(null);

//       if (resetOption === 'current_chef_date') {
//         const busySlots = Object.fromEntries(
//           Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '1'])
//         );
//         await saveDisponibiliteChef(Number(chefId), date, busySlots);
//         setSlots(busySlots);
//       } else if (resetOption === 'all_chefs_date') {
//         await resetAllDisponibilites('chefs', date);
//         const data = await fetchDisponibiliteChef(Number(chefId), date);
//         setSlots(data);
//       } else if (resetOption === 'all_chefs_all_dates') {
//         await resetAllDisponibilites('chefs');
//         const data = await fetchDisponibiliteChef(Number(chefId), date);
//         setSlots(data);
//       }

//       setSuccess(true);
//       setShowResetModal(false);
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la réinitialisation.');
//     } finally {
//       setResetting(false);
//     }
//   };

//   const selectedChef = useMemo(
//     () => chefs.find((c) => String(c.id) === String(chefId)),
//     [chefs, chefId]
//   );

//   const freeCount = useMemo(() => {
//     if (!slots) return 0;
//     return Object.values(slots).filter((v) => v === '0').length;
//   }, [slots]);

//   const initials = (selectedChef?.nom || '')
//     .split(' ')
//     .map((p) => p[0])
//     .filter(Boolean)
//     .slice(0, 2)
//     .join('')
//     .toUpperCase();

//   return (
//     <>
//       <Navbar />
//       <style>{STYLE_SHEET}</style>

//       <div className="dispo-chef-page">
//         <div className="dispo-chef-shell">
//           <div className="dispo-chef-header">
//             <div>
//               <h2 className="dispo-chef-title display">Disponibilités des chefs de projet</h2>
//               <p className="dispo-chef-subtitle">
//                 Cliquez sur un créneau pour basculer entre libre et occupé, puis enregistrez.
//                 <span className="dispo-chef-legend">
//                   <span className="dispo-chef-legend-dot" style={{ background: '#2dd4bf' }} />
//                   Libre
//                 </span>
//                 <span className="dispo-chef-legend">
//                   <span className="dispo-chef-legend-dot" style={{ background: '#2a3140' }} />
//                   Occupé
//                 </span>
//               </p>
//             </div>

//             {/* Bouton Réinitialiser */}
//             <Button
//               className="btn-danger-pill d-flex align-items-center gap-1"
//               onClick={() => setShowResetModal(true)}
//               disabled={resetting}
//             >
//               <span>🗑️</span>
//               <span>Réinitialiser...</span>
//             </Button>
//           </div>

//           {(error || success) && (
//             <div className="dispo-chef-alerts">
//               {error && (
//                 <Alert variant="danger" dismissible onClose={() => setError(null)}>
//                   {error}
//                 </Alert>
//               )}
//               {success && (
//                 <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
//                   Disponibilités enregistrées / réinitialisées.
//                 </Alert>
//               )}
//             </div>
//           )}

//           <div className="dispo-chef-toolbar">
//             <Form.Group>
//               <Form.Label>Chef de projet</Form.Label>
//               <Form.Select value={chefId} onChange={(e) => setChefId(e.target.value)}>
//                 {chefs.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.nom}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             <Form.Group>
//               <Form.Label>Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </Form.Group>

//             {selectedChef && slots && (
//               <div className="chef-chip">
//                 <span className="chef-avatar">{initials || '?'}</span>
//                 <span className="stat-chip">
//                   <strong>{freeCount}</strong>/{NB_SLOTS} créneaux libres
//                 </span>
//               </div>
//             )}
//           </div>

//           {loading || !slots ? (
//             <div className="loading-state">
//               <Spinner animation="border" style={{ color: '#2dd4bf' }} />
//               <p className="mt-3 mb-0">Chargement des disponibilités...</p>
//             </div>
//           ) : chefs.length === 0 ? (
//             <div className="empty-state">Aucun chef de projet enregistré pour le moment.</div>
//           ) : (
//             <>
//               <div className="schedule-card">
//                 <div className="hour-groups">
//                   {HOUR_GROUPS.map((group) => (
//                     <div className="hour-group" key={group.label}>
//                       <div className="hour-label">{group.label}</div>
//                       <div className="hour-cells">
//                         {[0, 1, 2, 3].map((offset) => {
//                           const idx = group.start + offset;
//                           const key = `slot${idx + 1}`;
//                           const free = slots[key] === '0';
//                           return (
//                             <button
//                               key={key}
//                               type="button"
//                               className={`slot-cell ${free ? 'free' : 'busy'}`}
//                               aria-pressed={free}
//                               aria-label={`${slotLabel(idx)} — ${free ? 'libre' : 'occupé'}`}
//                               title={`${slotLabel(idx)} · ${free ? 'Libre' : 'Occupé'}`}
//                               onClick={() => toggleSlot(idx)}
//                             />
//                           );
//                         })}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="dispo-chef-footer">
//                 <Button className="btn-save" onClick={handleSave} disabled={saving}>
//                   {saving ? (
//                     <>
//                       <Spinner size="sm" animation="border" className="me-2" />
//                       Enregistrement…
//                     </>
//                   ) : (
//                     'Enregistrer'
//                   )}
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Modal Réinitialisation Disponibilités Chefs */}
//       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>
//             🗑️ Réinitialiser les disponibilités (Chefs)
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="small text-muted mb-3">
//             Choisissez la portée de la réinitialisation des créneaux :
//           </p>

//           <div className="p-3 rounded mb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
//             <Form.Check
//               type="radio"
//               id="reset-chef-date"
//               name="reset-dispo-chef"
//               label={`Réinitialiser uniquement ${selectedChef?.nom || 'ce chef'} pour le ${date}`}
//               checked={resetOption === 'current_chef_date'}
//               onChange={() => setResetOption('current_chef_date')}
//               className="mb-2"
//             />
//             <Form.Check
//               type="radio"
//               id="reset-all-chefs-date"
//               name="reset-dispo-chef"
//               label={`Réinitialiser TOUS les chefs pour la date du ${date}`}
//               checked={resetOption === 'all_chefs_date'}
//               onChange={() => setResetOption('all_chefs_date')}
//               className="mb-2"
//             />
//             <Form.Check
//               type="radio"
//               id="reset-all-chefs-all"
//               name="reset-dispo-chef"
//               label="Supprimer TOUTES les disponibilités de TOUS les chefs (toutes dates)"
//               checked={resetOption === 'all_chefs_all_dates'}
//               onChange={() => setResetOption('all_chefs_all_dates')}
//             />
//           </div>

//           <p className="small text-muted mb-0">
//             ⚠️ Les créneaux réinitialisés seront remis à l'état "occupé" par défaut.
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
//             Annuler
//           </Button>
//           <Button variant="danger" size="sm" onClick={handleResetDisponibilites} disabled={resetting}>
//             {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la réinitialisation'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Spinner,
  Badge,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import Navbar from './Navbar';
import {
  fetchChefsDeProjet,
  fetchDisponibiliteChef,
  saveDisponibiliteChef,
  resetAllDisponibilites,
} from '../services/supabase';

// ============================================================================
// Constantes & helpers métier
// ============================================================================

// 40 libellés d'heures (08:00 à 17:45)
const TIME_SLOTS = Array.from({ length: 40 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 15;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

// Regroupement des 40 créneaux par heure pleine (10 heures x 4 quarts d'heure)
const HOUR_GROUPS = Array.from({ length: 10 }, (_, h) => ({
  label: `${8 + h}h`,
  start: h * 4,
}));

const createDefaultSlots = () => Array(40).fill('1');

// Conversion tableau [0..39] -> objet { slot1, slot2, ..., slot40 }
const toSlotObject = (slotsArray) => {
  const obj = {};
  for (let i = 0; i < 40; i++) {
    obj[`slot${i + 1}`] = String(slotsArray[i] ?? '1');
  }
  return obj;
};

// Extraction objet { slot1..slot40 } -> tableau [0..39]
const fromSlotRow = (row) => {
  const arr = [];
  for (let i = 1; i <= 40; i++) {
    arr.push(String(row?.[`slot${i}`] ?? '1'));
  }
  return arr;
};

// ============================================================================
// Styles
// ============================================================================

const STYLE_SHEET = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

.dispo-page {
  --bg: #0a0d12;
  --surface: #12161f;
  --surface-2: #1a2029;
  --surface-hover: #212836;
  --border: #232a37;
  --border-soft: #1c222c;
  --text: #e9ecf1;
  --text-muted: #8b93a5;
  --text-faint: #5a6272;
  --accent: #2dd4bf;
  --accent-soft: rgba(45, 212, 191, 0.14);
  --danger: #f2545b;
  --danger-soft: rgba(242, 84, 91, 0.14);
  --radius: 10px;
  --radius-lg: 14px;
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
}

.dispo-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
.dispo-page .display { font-family: 'Space Grotesk', sans-serif; }

.dispo-shell {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.75rem 1.5rem 4rem;
}

/* ---------- Header ---------- */
.dispo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.dispo-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.2rem;
  color: #fff;
}
.dispo-subtitle {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}
.dispo-legend {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: 0.75rem;
  font-size: 0.78rem;
}
.dispo-legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 3px;
  display: inline-block;
}

.btn-save {
  background: var(--accent) !important;
  border: none !important;
  color: #06201c !important;
  font-weight: 600;
  padding: 0.55rem 1.15rem !important;
  border-radius: var(--radius) !important;
  box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -8px rgba(45, 212, 191, 0.5);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.btn-save:hover:not(:disabled) { transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; }

.btn-danger-pill {
  background: rgba(242, 84, 91, 0.14) !important;
  color: #fca5a5 !important;
  border: 1px solid rgba(242, 84, 91, 0.35) !important;
  border-radius: var(--radius) !important;
  font-weight: 600 !important;
  font-size: 0.82rem !important;
  padding: 0.55rem 1rem !important;
  transition: all 0.15s ease;
}
.btn-danger-pill:hover:not(:disabled) {
  background: #dc2626 !important;
  color: #ffffff !important;
  border-color: #dc2626 !important;
}

/* ---------- Toolbar ---------- */
.dispo-toolbar {
  position: sticky;
  top: 0.75rem;
  z-index: 10;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.1rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 12px 30px -18px rgba(0,0,0,0.6);
}
.dispo-toolbar label {
  color: var(--text-faint);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 600;
  margin-bottom: 0.35rem;
  display: block;
}
.dispo-toolbar .form-control {
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
}
.dispo-toolbar .form-control:focus {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--text);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.dispo-toolbar .form-control::placeholder { color: var(--text-faint); }

.stat-chip {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  font-size: 0.78rem;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
}
.stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }

.btn-ghost {
  background: transparent !important;
  border: 1px solid var(--border) !important;
  color: var(--text-muted) !important;
  font-size: 0.8rem !important;
  border-radius: var(--radius) !important;
  padding: 0.4rem 0.7rem !important;
  transition: border-color 0.12s ease, color 0.12s ease;
}
.btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
.btn-ghost-danger:hover { border-color: var(--danger) !important; color: var(--danger) !important; }

/* ---------- Toasts ---------- */
.dispo-toast-stack {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 380px;
}
.dispo-toast-stack .alert { border-radius: var(--radius); border: 1px solid var(--border); }

/* ---------- Chef cards ---------- */
.chef-list { display: flex; flex-direction: column; gap: 0.7rem; }

.chef-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.chef-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  user-select: none;
}
.chef-header:hover { background: var(--surface-hover); }

.chevron {
  color: var(--text-faint);
  transition: transform 0.15s ease;
  flex-shrink: 0;
  font-size: 0.7rem;
}
.chevron.open { transform: rotate(90deg); color: var(--accent); }

.chef-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  flex-shrink: 0;
}

.chef-meta { min-width: 0; flex-shrink: 0; }
.chef-name { font-weight: 600; font-size: 0.92rem; color: #fff; white-space: nowrap; }
.chef-specialite { font-size: 0.74rem; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.sparkline {
  display: flex;
  gap: 2px;
  flex: 1;
  min-width: 120px;
  height: 20px;
  align-items: stretch;
}
.spark-tick { flex: 1; border-radius: 2px; min-width: 2px; }

.free-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.28rem 0.55rem;
  border-radius: 999px;
  flex-shrink: 0;
  white-space: nowrap;
}

.chef-quick-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }

.chef-body {
  padding: 0 1rem 1.1rem;
  border-top: 1px solid var(--border-soft);
}

.hour-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 1rem;
}

.hour-group { display: flex; flex-direction: column; gap: 4px; }

.hour-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: var(--text-faint);
  text-align: center;
  margin-bottom: 2px;
  letter-spacing: 0.03em;
}

.hour-cells { display: flex; gap: 3px; }

.slot-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid transparent;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0;
  cursor: pointer;
  padding: 0;
  transition: transform 0.08s ease, box-shadow 0.12s ease;
}
.slot-btn:hover { transform: scale(1.12); z-index: 1; position: relative; }
.slot-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
}
.slot-btn.free { background: var(--accent); }
.slot-btn.occupied { background: var(--surface-2); border-color: var(--border); }
.slot-btn.occupied:hover { background: var(--danger-soft); border-color: var(--danger); }

.empty-state {
  text-align: center;
  padding: 3.5rem 1rem;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
}

/* Modal Dark */
.modal-dark .modal-content {
  background: #12161f !important;
  border: 1px solid var(--border);
  border-radius: 16px;
  color: var(--text);
}
.modal-dark .modal-header {
  border-bottom: 1px solid var(--border);
  background: rgba(242, 84, 91, 0.08);
}
.modal-dark .modal-footer {
  border-top: 1px solid var(--border);
}

@media (max-width: 767px) {
  .dispo-header { flex-direction: column; align-items: stretch; }
  .dispo-shell { padding: 1.1rem 0.85rem 3rem; }
  .chef-header { flex-wrap: wrap; }
  .sparkline { order: 4; width: 100%; min-width: 100%; }
  .chef-quick-actions { margin-left: auto; }
}
`;

// ============================================================================
// Sous-composants
// ============================================================================

function AvailabilityToast({ error, success, onCloseError, onCloseSuccess }) {
  if (!error && !success) return null;
  return (
    <div className="dispo-toast-stack">
      {error && (
        <Alert variant="danger" dismissible onClose={onCloseError} className="mb-0">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={onCloseSuccess} className="mb-0">
          {success}
        </Alert>
      )}
    </div>
  );
}

function Sparkline({ slots }) {
  return (
    <div className="sparkline" aria-hidden="true">
      {slots.map((s, i) => (
        <span
          key={i}
          className="spark-tick"
          style={{ background: s === '0' ? '#2dd4bf' : '#2a3140' }}
        />
      ))}
    </div>
  );
}

function ChefCard({
  chef,
  slots,
  expanded,
  onToggleExpand,
  onToggleSlot,
  onSetAll,
}) {
  const freeCount = slots.filter((s) => s === '0').length;
  const initials = (chef.nom || '')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Card className="chef-card">
      <div
        className="chef-header"
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
      >
        <span className={`chevron ${expanded ? 'open' : ''}`}>▶</span>
        <span className="chef-avatar">{initials || '?'}</span>

        <div className="chef-meta">
          <div className="chef-name">{chef.nom}</div>
          {/* <div className="chef-specialite">{chef.specialite || 'Spécialité générale'} · {chef.email}</div> */}
        </div>

        <Sparkline slots={slots} />

        <span
          className="free-badge"
          style={{
            color: freeCount > 0 ? '#2dd4bf' : '#8b93a5',
            background: freeCount > 0 ? 'rgba(45,212,191,0.12)' : 'rgba(139,147,165,0.1)',
          }}
        >
          {freeCount}/40 libres
        </span>

        <div className="chef-quick-actions" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            className="btn-ghost"
            onClick={() => onSetAll(chef.id, '0')}
            title="Marquer toute la journée comme libre pour ce chef"
          >
            Tout libre
          </Button>
          <Button
            size="sm"
            className="btn-ghost btn-ghost-danger"
            onClick={() => onSetAll(chef.id, '1')}
            title="Marquer toute la journée comme occupée pour ce chef"
          >
            Tout occupé
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="chef-body">
          <div className="hour-groups">
            {HOUR_GROUPS.map((group) => (
              <div className="hour-group" key={group.label}>
                <div className="hour-label">{group.label}</div>
                <div className="hour-cells">
                  {[0, 1, 2, 3].map((offset) => {
                    const idx = group.start + offset;
                    const isFree = slots[idx] === '0';
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`slot-btn ${isFree ? 'free' : 'occupied'}`}
                        aria-pressed={isFree}
                        aria-label={`${TIME_SLOTS[idx]} — ${isFree ? 'libre' : 'occupé'}`}
                        title={`${TIME_SLOTS[idx]} · ${isFree ? 'Libre' : 'Occupé'}`}
                        onClick={() => onToggleSlot(chef.id, idx)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// Composant principal
// ============================================================================

export default function DisponibilitesPage() {
  const [chefs, setChefs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Map { [chefId]: string[40] } où '0'=libre, '1'=occupé
  const [chefSlots, setChefSlots] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // État Réinitialisation
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetOption, setResetOption] = useState('current_date'); // 'current_date' | 'all_dates'
  const [resetting, setResetting] = useState(false);

  const loadData = async (date) => {
    try {
      setLoading(true);
      setError(null);

      const chefsData = await fetchChefsDeProjet();
      setChefs(chefsData || []);
      setExpandedIds(new Set((chefsData || []).map((c) => c.id)));

      const slotsMap = {};
      await Promise.all(
        (chefsData || []).map(async (chef) => {
          try {
            const data = await fetchDisponibiliteChef(chef.id, date);
            if (data) {
              if (Array.isArray(data) && data.length === 40) {
                slotsMap[chef.id] = data.map(String);
              } else if (typeof data === 'object') {
                slotsMap[chef.id] = fromSlotRow(data);
              } else {
                slotsMap[chef.id] = createDefaultSlots();
              }
            } else {
              slotsMap[chef.id] = createDefaultSlots();
            }
          } catch {
            slotsMap[chef.id] = createDefaultSlots();
          }
        })
      );

      setChefSlots(slotsMap);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des disponibilités des chefs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const toggleSlot = useCallback((chefId, slotIdx) => {
    setChefSlots((prev) => {
      const current = prev[chefId] ? [...prev[chefId]] : createDefaultSlots();
      current[slotIdx] = current[slotIdx] === '0' ? '1' : '0';
      return { ...prev, [chefId]: current };
    });
    setSuccessMsg(null);
  }, []);

  const setAllSlotsForChef = useCallback((chefId, value) => {
    setChefSlots((prev) => ({
      ...prev,
      [chefId]: Array(40).fill(value),
    }));
    setSuccessMsg(null);
  }, []);

  const setAllSlotsForVisible = (value) => {
    setChefSlots((prev) => {
      const next = { ...prev };
      filteredChefs.forEach((c) => {
        next[c.id] = Array(40).fill(value);
      });
      return next;
    });
    setSuccessMsg(null);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const savePromises = chefs.map((chef) => {
        const slotsArray = chefSlots[chef.id] || createDefaultSlots();
        const slotPayload = toSlotObject(slotsArray);
        return saveDisponibiliteChef(chef.id, selectedDate, slotPayload);
      });

      await Promise.all(savePromises);
      setSuccessMsg(
        `Disponibilités enregistrées avec succès pour ${chefs.length} chef(s) de projet au ${selectedDate}.`
      );
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde des disponibilités des chefs.');
    } finally {
      setSaving(false);
    }
  };

  // Action de Réinitialisation ciblée des disponibilités des chefs
  const handleResetChefsDisponibilites = async () => {
    try {
      setResetting(true);
      setError(null);

      if (resetOption === 'current_date') {
        await resetAllDisponibilites('chefs', selectedDate);
        await loadData(selectedDate);
      } else if (resetOption === 'all_dates') {
        await resetAllDisponibilites('chefs');
        await loadData(selectedDate);
      }

      setSuccessMsg('Disponibilités des chefs réinitialisées avec succès.');
      setShowResetModal(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setResetting(false);
    }
  };

  const filteredChefs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return chefs;
    return chefs.filter(
      (c) =>
        (c.nom && c.nom.toLowerCase().includes(term)) ||
        (c.specialite && c.specialite.toLowerCase().includes(term)) ||
        (c.email && c.email.toLowerCase().includes(term))
    );
  }, [chefs, searchTerm]);

  const globalStats = useMemo(() => {
    let free = 0;
    let total = 0;
    filteredChefs.forEach((c) => {
      const slots = chefSlots[c.id] || createDefaultSlots();
      free += slots.filter((s) => s === '0').length;
      total += 40;
    });
    const pct = total ? Math.round((free / total) * 100) : 0;
    return { free, total, pct };
  }, [filteredChefs, chefSlots]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(filteredChefs.map((c) => c.id)));
  const collapseAll = () => setExpandedIds(new Set());

  return (
    <>
      <Navbar />
      <style>{STYLE_SHEET}</style>

      <div className="dispo-page">
        <AvailabilityToast
          error={error}
          success={successMsg}
          onCloseError={() => setError(null)}
          onCloseSuccess={() => setSuccessMsg(null)}
        />

        <div className="dispo-shell">
          <div className="dispo-header">
            <div>
              <h2 className="dispo-title display">Disponibilités des chefs de projet</h2>
              <p className="dispo-subtitle">
                Grille horaire 08:00 – 18:00, par créneaux de 15 minutes.
                <span className="dispo-legend">
                  <span className="dispo-legend-dot" style={{ background: '#2dd4bf' }} />
                  Libre
                </span>
                <span className="dispo-legend">
                  <span className="dispo-legend-dot" style={{ background: '#2a3140' }} />
                  Occupé
                </span>
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {/* Bouton Réinitialiser */}
              <Button
                className="btn-danger-pill d-flex align-items-center gap-1"
                onClick={() => setShowResetModal(true)}
                disabled={resetting}
              >
                <span></span>
                <span>Réinitialiser...</span>
              </Button>

              <Button
                className="btn-save"
                onClick={handleSaveAll}
                disabled={saving || loading}
              >
                {saving ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer les disponibilités'
                )}
              </Button>
            </div>
          </div>

          <div className="dispo-toolbar">
            <Row className="g-3 align-items-end">
              <Col md={2}>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </Col>

              <Col md={3}>
                <Form.Label>Rechercher un chef</Form.Label>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder="Nom, spécialité, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button className="btn-ghost" onClick={() => setSearchTerm('')}>
                      ✕
                    </Button>
                  )}
                </InputGroup>
              </Col>

              <Col md={4} className="d-flex align-items-center gap-2 flex-wrap">
                <span className="stat-chip">
                  <strong>{filteredChefs.length}</strong> chef(s) affiché(s)
                </span>
                <span className="stat-chip">
                  <strong>{globalStats.pct}%</strong> de créneaux libres
                </span>
              </Col>

              <Col md={3} className="d-flex gap-2 justify-content-md-end flex-wrap">
                <Button className="btn-ghost" onClick={expandAll}>
                  Tout déplier
                </Button>
                <Button className="btn-ghost" onClick={collapseAll}>
                  Tout replier
                </Button>
                <Button
                  className="btn-ghost"
                  onClick={() => setAllSlotsForVisible('0')}
                  title="Marquer tous les chefs visibles comme libres"
                >
                  Libérer tout
                </Button>
                <Button
                  className="btn-ghost btn-ghost-danger"
                  onClick={() => setAllSlotsForVisible('1')}
                  title="Marquer tous les chefs visibles comme occupés"
                >
                  Occuper tout
                </Button>
              </Col>
            </Row>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: '#2dd4bf' }} />
              <p className="mt-3" style={{ color: '#8b93a5' }}>
                Chargement des disponibilités des chefs...
              </p>
            </div>
          ) : filteredChefs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🔍</div>
              Aucun chef de projet ne correspond à votre recherche.
            </div>
          ) : (
            <div className="chef-list">
              {filteredChefs.map((chef) => (
                <ChefCard
                  key={chef.id}
                  chef={chef}
                  slots={chefSlots[chef.id] || createDefaultSlots()}
                  expanded={expandedIds.has(chef.id)}
                  onToggleExpand={() => toggleExpand(chef.id)}
                  onToggleSlot={toggleSlot}
                  onSetAll={setAllSlotsForChef}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Réinitialisation Disponibilités Chefs */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>
            Réinitialiser les disponibilités (Chefs)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">
            Choisissez la portée de la réinitialisation des créneaux :
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <Form.Check
              type="radio"
              id="reset-chef-date"
              name="reset-dispo-chef"
              label={`Réinitialiser les disponibilités de TOUS les chefs pour le ${selectedDate}`}
              checked={resetOption === 'current_date'}
              onChange={() => setResetOption('current_date')}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id="reset-chef-all"
              name="reset-dispo-chef"
              label="Supprimer TOUTES les disponibilités de TOUS les chefs (toutes dates)"
              checked={resetOption === 'all_dates'}
              onChange={() => setResetOption('all_dates')}
            />
          </div>

          <p className="small text-muted mb-0">
            Les créneaux réinitialisés seront remis à l'état "occupé" par défaut.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetChefsDisponibilites} disabled={resetting}>
            {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la réinitialisation'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}