// // import React, { useEffect, useState, useMemo } from 'react';
// // import {
// //   Card,
// //   Button,
// //   Form,
// //   Row,
// //   Col,
// //   Alert,
// //   Spinner,
// //   Badge,
// //   InputGroup,
// // } from 'react-bootstrap';
// // import Navbar from './Navbar';
// // import {
// //   fetchEtudiants,
// //   fetchDisponibiliteEtudiant,
// //   saveDisponibiliteEtudiant,
// // } from '../services/supabase';

// // // 40 libellés d'heures (08:00 à 17:45)
// // const TIME_SLOTS = Array.from({ length: 40 }, (_, i) => {
// //   const totalMinutes = 8 * 60 + i * 15;
// //   const h = Math.floor(totalMinutes / 60);
// //   const m = totalMinutes % 60;
// //   return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
// // });

// // const createDefaultSlots = () => Array(40).fill('1');

// // // Conversion tableau [0..39] -> objet { slot1, slot2, ..., slot40 }
// // const toSlotObject = (slotsArray) => {
// //   const obj = {};
// //   for (let i = 0; i < 40; i++) {
// //     obj[`slot${i + 1}`] = String(slotsArray[i] ?? '1');
// //   }
// //   return obj;
// // };

// // // Extraction objet { slot1..slot40 } -> tableau [0..39]
// // const fromSlotRow = (row) => {
// //   const arr = [];
// //   for (let i = 1; i <= 40; i++) {
// //     arr.push(String(row?.[`slot${i}`] ?? '1'));
// //   }
// //   return arr;
// // };

// // export default function DisponibilitesEtudiantPage() {
// //   const [etudiants, setEtudiants] = useState([]);
// //   const [selectedDate, setSelectedDate] = useState(
// //     new Date().toISOString().split('T')[0]
// //   );
  
// //   // Map { [etudiantId]: string[40] } où '0'=libre, '1'=occupé
// //   const [studentSlots, setStudentSlots] = useState({});
// //   const [searchTerm, setSearchTerm] = useState('');

// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [successMsg, setSuccessMsg] = useState(null);

// //   const loadData = async (date) => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const etuds = await fetchEtudiants();
// //       setEtudiants(etuds || []);

// //       const slotsMap = {};
// //       await Promise.all(
// //         (etuds || []).map(async (etud) => {
// //           try {
// //             const data = await fetchDisponibiliteEtudiant(etud.id, date);
// //             if (data) {
// //               if (Array.isArray(data) && data.length === 40) {
// //                 slotsMap[etud.id] = data.map(String);
// //               } else if (typeof data === 'object') {
// //                 slotsMap[etud.id] = fromSlotRow(data);
// //               } else {
// //                 slotsMap[etud.id] = createDefaultSlots();
// //               }
// //             } else {
// //               slotsMap[etud.id] = createDefaultSlots();
// //             }
// //           } catch {
// //             slotsMap[etud.id] = createDefaultSlots();
// //           }
// //         })
// //       );

// //       setStudentSlots(slotsMap);
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors du chargement des disponibilités.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData(selectedDate);
// //   }, [selectedDate]);

// //   const toggleSlot = (etudiantId, slotIdx) => {
// //     setStudentSlots((prev) => {
// //       const current = prev[etudiantId] ? [...prev[etudiantId]] : createDefaultSlots();
// //       current[slotIdx] = current[slotIdx] === '0' ? '1' : '0';
// //       return { ...prev, [etudiantId]: current };
// //     });
// //     setSuccessMsg(null);
// //   };

// //   const setAllSlotsForStudent = (etudiantId, value) => {
// //     setStudentSlots((prev) => ({
// //       ...prev,
// //       [etudiantId]: Array(40).fill(value),
// //     }));
// //     setSuccessMsg(null);
// //   };

// //   const setAllSlotsForVisible = (value) => {
// //     setStudentSlots((prev) => {
// //       const next = { ...prev };
// //       filteredEtudiants.forEach((e) => {
// //         next[e.id] = Array(40).fill(value);
// //       });
// //       return next;
// //     });
// //     setSuccessMsg(null);
// //   };

// //   const handleSaveAll = async () => {
// //     try {
// //       setSaving(true);
// //       setError(null);
// //       setSuccessMsg(null);

// //       const savePromises = etudiants.map((etud) => {
// //         const slotsArray = studentSlots[etud.id] || createDefaultSlots();
// //         const slotPayload = toSlotObject(slotsArray);
// //         return saveDisponibiliteEtudiant(etud.id, selectedDate, slotPayload);
// //       });

// //       await Promise.all(savePromises);
// //       setSuccessMsg(
// //         `Disponibilités enregistrées avec succès pour ${etudiants.length} étudiant(s) au ${selectedDate}.`
// //       );
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la sauvegarde des disponibilités.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const filteredEtudiants = useMemo(() => {
// //     const term = searchTerm.toLowerCase().trim();
// //     if (!term) return etudiants;
// //     return etudiants.filter(
// //       (e) =>
// //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// //     );
// //   }, [etudiants, searchTerm]);

// //   return (
// //     <>
// //       <Navbar />
// //       <div
// //         className="page-container"
// //         style={{ maxWidth: '98%', margin: '0 auto', padding: '1.5rem 0' }}
// //       >
// //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// //           <div>
// //             <h2 className="mb-0">Disponibilités des étudiants</h2>
// //             <small className="text-muted">
// //               Grille des créneaux horaires (08:00 à 18:00). Vert = Libre (0), Rouge = Occupé (1).
// //             </small>
// //           </div>
// //           <Button
// //             variant="success"
// //             size="md"
// //             onClick={handleSaveAll}
// //             disabled={saving || loading}
// //           >
// //             {saving ? (
// //               <>
// //                 <Spinner size="sm" animation="border" className="me-2" />
// //                 Enregistrement...
// //               </>
// //             ) : (
// //               'Enregistrer les disponibilités'
// //             )}
// //           </Button>
// //         </div>

// //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// //         <Card className="mb-4 p-3 shadow-sm bg-dark text-white border-secondary">
// //           <Row className="g-3 align-items-end">
// //             <Col md={3}>
// //               <Form.Label className="mb-1 text-muted small fw-bold">Date</Form.Label>
// //               <Form.Control
// //                 type="date"
// //                 size="sm"
// //                 value={selectedDate}
// //                 onChange={(e) => setSelectedDate(e.target.value)}
// //               />
// //             </Col>

// //             <Col md={4}>
// //               <Form.Label className="mb-1 text-muted small fw-bold">Filtrer un étudiant</Form.Label>
// //               <InputGroup size="sm">
// //                 <Form.Control
// //                   placeholder="Nom, prénom, email..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //                 {searchTerm && (
// //                   <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
// //                     ✕
// //                   </Button>
// //                 )}
// //               </InputGroup>
// //             </Col>

// //             <Col md={5} className="d-flex gap-2 justify-content-md-end">
// //               <Button
// //                 variant="outline-success"
// //                 size="sm"
// //                 onClick={() => setAllSlotsForVisible('0')}
// //               >
// //                 Tout libre (visibles)
// //               </Button>
// //               <Button
// //                 variant="outline-danger"
// //                 size="sm"
// //                 onClick={() => setAllSlotsForVisible('1')}
// //               >
// //                 Tout occupé (visibles)
// //               </Button>
// //             </Col>
// //           </Row>
// //         </Card>

// //         {loading ? (
// //           <div className="text-center py-5">
// //             <Spinner animation="border" variant="primary" />
// //             <p className="mt-3 text-muted">Chargement des disponibilités...</p>
// //           </div>
// //         ) : filteredEtudiants.length === 0 ? (
// //           <Alert variant="secondary" className="text-center">
// //             Aucun étudiant trouvé.
// //           </Alert>
// //         ) : (
// //           <div className="d-flex flex-column gap-3">
// //             {filteredEtudiants.map((etud) => {
// //               const slots = studentSlots[etud.id] || createDefaultSlots();
// //               const freeCount = slots.filter((s) => s === '0').length;

// //               return (
// //                 <Card
// //                   key={etud.id}
// //                   className="bg-dark text-white border-secondary shadow-sm"
// //                 >
// //                   <Card.Header className="d-flex justify-content-between align-items-center py-2 bg-black bg-opacity-25 border-secondary">
// //                     <div>
// //                       <span className="fw-bold fs-6 me-2">
// //                         {etud.nom} {etud.prenom}
// //                       </span>
// //                       <span className="text-muted small me-3">({etud.adresse_email})</span>
// //                       <Badge bg={freeCount > 0 ? 'success' : 'secondary'}>
// //                         {freeCount} / 40 créneaux libres
// //                       </Badge>
// //                     </div>

// //                     <div className="d-flex gap-2">
// //                       <Button
// //                         size="sm"
// //                         variant="outline-success"
// //                         style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
// //                         onClick={() => setAllSlotsForStudent(etud.id, '0')}
// //                       >
// //                         Tout libre
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         variant="outline-danger"
// //                         style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
// //                         onClick={() => setAllSlotsForStudent(etud.id, '1')}
// //                       >
// //                         Tout occupé
// //                       </Button>
// //                     </div>
// //                   </Card.Header>

// //                   <Card.Body className="p-3">
// //                     <div
// //                       style={{
// //                         display: 'grid',
// //                         gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))',
// //                         gap: '6px',
// //                       }}
// //                     >
// //                       {TIME_SLOTS.map((time, idx) => {
// //                         const isFree = slots[idx] === '0';
// //                         return (
// //                           <div
// //                             key={idx}
// //                             onClick={() => toggleSlot(etud.id, idx)}
// //                             title={`${time} - ${isFree ? 'Libre' : 'Occupé'}`}
// //                             style={{
// //                               backgroundColor: isFree ? '#198754' : '#dc3545',
// //                               color: '#fff',
// //                               borderRadius: '4px',
// //                               padding: '6px 2px',
// //                               textAlign: 'center',
// //                               fontSize: '0.75rem',
// //                               fontWeight: '600',
// //                               cursor: 'pointer',
// //                               userSelect: 'none',
// //                               transition: 'transform 0.1s, opacity 0.15s',
// //                               opacity: isFree ? 1 : 0.65,
// //                             }}
// //                             onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
// //                             onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
// //                           >
// //                             {time}
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
// //                   </Card.Body>
// //                 </Card>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // }


// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   Card,
//   Button,
//   Form,
//   Row,
//   Col,
//   Alert,
//   Spinner,
//   Badge,
//   InputGroup,
// } from 'react-bootstrap';
// import Navbar from './Navbar';
// import {
//   fetchEtudiants,
//   fetchDisponibiliteEtudiant,
//   saveDisponibiliteEtudiant,
// } from '../services/supabase';

// // ============================================================================
// // Constantes & helpers métier (logique inchangée)
// // ============================================================================

// // 40 libellés d'heures (08:00 à 17:45)
// const TIME_SLOTS = Array.from({ length: 40 }, (_, i) => {
//   const totalMinutes = 8 * 60 + i * 15;
//   const h = Math.floor(totalMinutes / 60);
//   const m = totalMinutes % 60;
//   return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
// });

// // Regroupement des 40 créneaux par heure pleine (10 heures x 4 quarts d'heure)
// // Purement présentation : ne modifie pas la structure de données sous-jacente.
// const HOUR_GROUPS = Array.from({ length: 10 }, (_, h) => ({
//   label: `${8 + h}h`,
//   start: h * 4,
// }));

// const createDefaultSlots = () => Array(40).fill('1');

// // Conversion tableau [0..39] -> objet { slot1, slot2, ..., slot40 }
// const toSlotObject = (slotsArray) => {
//   const obj = {};
//   for (let i = 0; i < 40; i++) {
//     obj[`slot${i + 1}`] = String(slotsArray[i] ?? '1');
//   }
//   return obj;
// };

// // Extraction objet { slot1..slot40 } -> tableau [0..39]
// const fromSlotRow = (row) => {
//   const arr = [];
//   for (let i = 1; i <= 40; i++) {
//     arr.push(String(row?.[`slot${i}`] ?? '1'));
//   }
//   return arr;
// };

// // ============================================================================
// // Styles (design system auto-contenu, injecté une seule fois)
// // ============================================================================

// const STYLE_SHEET = `
// @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// .dispo-page {
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

// .dispo-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
// .dispo-page .display { font-family: 'Space Grotesk', sans-serif; }

// .dispo-shell {
//   max-width: 1400px;
//   margin: 0 auto;
//   padding: 1.75rem 1.5rem 4rem;
// }

// /* ---------- Header ---------- */
// .dispo-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: flex-start;
//   gap: 1rem;
//   margin-bottom: 1.25rem;
//   flex-wrap: wrap;
// }
// .dispo-title {
//   font-size: 1.5rem;
//   font-weight: 700;
//   letter-spacing: -0.02em;
//   margin: 0 0 0.2rem;
//   color: #fff;
// }
// .dispo-subtitle {
//   color: var(--text-muted);
//   font-size: 0.85rem;
//   margin: 0;
// }
// .dispo-legend {
//   display: inline-flex;
//   align-items: center;
//   gap: 0.4rem;
//   margin-left: 0.75rem;
//   font-size: 0.78rem;
// }
// .dispo-legend-dot {
//   width: 9px;
//   height: 9px;
//   border-radius: 3px;
//   display: inline-block;
// }

// .btn-save {
//   background: var(--accent) !important;
//   border: none !important;
//   color: #06201c !important;
//   font-weight: 600;
//   padding: 0.55rem 1.15rem !important;
//   border-radius: var(--radius) !important;
//   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -8px rgba(45, 212, 191, 0.5);
//   transition: transform 0.12s ease, box-shadow 0.12s ease;
// }
// .btn-save:hover:not(:disabled) { transform: translateY(-1px); }
// .btn-save:disabled { opacity: 0.6; }

// /* ---------- Toolbar ---------- */
// .dispo-toolbar {
//   position: sticky;
//   top: 0.75rem;
//   z-index: 10;
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: var(--radius-lg);
//   padding: 1rem 1.1rem;
//   margin-bottom: 1.25rem;
//   box-shadow: 0 12px 30px -18px rgba(0,0,0,0.6);
// }
// .dispo-toolbar label {
//   color: var(--text-faint);
//   font-size: 0.7rem;
//   text-transform: uppercase;
//   letter-spacing: 0.06em;
//   font-weight: 600;
//   margin-bottom: 0.35rem;
//   display: block;
// }
// .dispo-toolbar .form-control {
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   color: var(--text);
// }
// .dispo-toolbar .form-control:focus {
//   background: var(--surface-2);
//   border-color: var(--accent);
//   color: var(--text);
//   box-shadow: 0 0 0 3px var(--accent-soft);
// }
// .dispo-toolbar .form-control::placeholder { color: var(--text-faint); }

// .stat-chip {
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   border-radius: 999px;
//   padding: 0.35rem 0.8rem;
//   font-size: 0.78rem;
//   color: var(--text-muted);
//   display: inline-flex;
//   align-items: center;
//   gap: 0.4rem;
//   white-space: nowrap;
// }
// .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }

// .btn-ghost {
//   background: transparent !important;
//   border: 1px solid var(--border) !important;
//   color: var(--text-muted) !important;
//   font-size: 0.8rem !important;
//   border-radius: var(--radius) !important;
//   padding: 0.4rem 0.7rem !important;
//   transition: border-color 0.12s ease, color 0.12s ease;
// }
// .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
// .btn-ghost-danger:hover { border-color: var(--danger) !important; color: var(--danger) !important; }

// /* ---------- Toasts ---------- */
// .dispo-toast-stack {
//   position: fixed;
//   top: 1rem;
//   right: 1rem;
//   z-index: 50;
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
//   max-width: 380px;
// }
// .dispo-toast-stack .alert { border-radius: var(--radius); border: 1px solid var(--border); }

// /* ---------- Student cards ---------- */
// .student-list { display: flex; flex-direction: column; gap: 0.7rem; }

// .student-card {
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: var(--radius-lg);
//   overflow: hidden;
// }

// .student-header {
//   display: flex;
//   align-items: center;
//   gap: 1rem;
//   padding: 0.85rem 1rem;
//   cursor: pointer;
//   user-select: none;
// }
// .student-header:hover { background: var(--surface-hover); }

// .chevron {
//   color: var(--text-faint);
//   transition: transform 0.15s ease;
//   flex-shrink: 0;
//   font-size: 0.7rem;
// }
// .chevron.open { transform: rotate(90deg); color: var(--accent); }

// .student-avatar {
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

// .student-meta { min-width: 0; flex-shrink: 0; }
// .student-name { font-weight: 600; font-size: 0.92rem; color: #fff; white-space: nowrap; }
// .student-email { font-size: 0.74rem; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

// .sparkline {
//   display: flex;
//   gap: 2px;
//   flex: 1;
//   min-width: 120px;
//   height: 20px;
//   align-items: stretch;
// }
// .spark-tick { flex: 1; border-radius: 2px; min-width: 2px; }

// .free-badge {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.72rem;
//   font-weight: 600;
//   padding: 0.28rem 0.55rem;
//   border-radius: 999px;
//   flex-shrink: 0;
//   white-space: nowrap;
// }

// .student-quick-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }

// .student-body {
//   padding: 0 1rem 1.1rem;
//   border-top: 1px solid var(--border-soft);
// }

// .hour-groups {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 10px;
//   padding-top: 1rem;
// }

// .hour-group { display: flex; flex-direction: column; gap: 4px; }

// .hour-label {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.68rem;
//   color: var(--text-faint);
//   text-align: center;
//   margin-bottom: 2px;
//   letter-spacing: 0.03em;
// }

// .hour-cells { display: flex; gap: 3px; }

// .slot-btn {
//   width: 30px;
//   height: 30px;
//   border-radius: 6px;
//   border: 1px solid transparent;
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0;
//   cursor: pointer;
//   padding: 0;
//   transition: transform 0.08s ease, box-shadow 0.12s ease;
// }
// .slot-btn:hover { transform: scale(1.12); z-index: 1; position: relative; }
// .slot-btn:focus-visible {
//   outline: none;
//   box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent);
// }
// .slot-btn.free { background: var(--accent); }
// .slot-btn.occupied { background: var(--surface-2); border-color: var(--border); }
// .slot-btn.occupied:hover { background: var(--danger-soft); border-color: var(--danger); }

// .empty-state {
//   text-align: center;
//   padding: 3.5rem 1rem;
//   color: var(--text-muted);
//   background: var(--surface);
//   border: 1px dashed var(--border);
//   border-radius: var(--radius-lg);
// }

// @media (max-width: 767px) {
//   .dispo-header { flex-direction: column; align-items: stretch; }
//   .dispo-shell { padding: 1.1rem 0.85rem 3rem; }
//   .student-header { flex-wrap: wrap; }
//   .sparkline { order: 4; width: 100%; min-width: 100%; }
//   .student-quick-actions { margin-left: auto; }
// }
// `;

// // ============================================================================
// // Sous-composants de présentation
// // ============================================================================

// function AvailabilityToast({ error, success, onCloseError, onCloseSuccess }) {
//   if (!error && !success) return null;
//   return (
//     <div className="dispo-toast-stack">
//       {error && (
//         <Alert variant="danger" dismissible onClose={onCloseError} className="mb-0">
//           {error}
//         </Alert>
//       )}
//       {success && (
//         <Alert variant="success" dismissible onClose={onCloseSuccess} className="mb-0">
//           {success}
//         </Alert>
//       )}
//     </div>
//   );
// }

// function Sparkline({ slots }) {
//   return (
//     <div className="sparkline" aria-hidden="true">
//       {slots.map((s, i) => (
//         <span
//           key={i}
//           className="spark-tick"
//           style={{ background: s === '0' ? '#2dd4bf' : '#2a3140' }}
//         />
//       ))}
//     </div>
//   );
// }

// function StudentCard({
//   etudiant,
//   slots,
//   expanded,
//   onToggleExpand,
//   onToggleSlot,
//   onSetAll,
// }) {
//   const freeCount = slots.filter((s) => s === '0').length;
//   const initials = `${etudiant.prenom?.[0] ?? ''}${etudiant.nom?.[0] ?? ''}`.toUpperCase();

//   return (
//     <Card className="student-card">
//       <div
//         className="student-header"
//         onClick={onToggleExpand}
//         role="button"
//         tabIndex={0}
//         aria-expanded={expanded}
//         onKeyDown={(e) => {
//           if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             onToggleExpand();
//           }
//         }}
//       >
//         <span className={`chevron ${expanded ? 'open' : ''}`}>▶</span>
//         <span className="student-avatar">{initials || '?'}</span>

//         <div className="student-meta">
//           <div className="student-name">
//             {etudiant.nom} {etudiant.prenom}
//           </div>
//           <div className="student-email">{etudiant.adresse_email}</div>
//         </div>

//         <Sparkline slots={slots} />

//         <span
//           className="free-badge"
//           style={{
//             color: freeCount > 0 ? '#2dd4bf' : '#8b93a5',
//             background: freeCount > 0 ? 'rgba(45,212,191,0.12)' : 'rgba(139,147,165,0.1)',
//           }}
//         >
//           {freeCount}/40 libres
//         </span>

//         <div className="student-quick-actions" onClick={(e) => e.stopPropagation()}>
//           <Button
//             size="sm"
//             className="btn-ghost"
//             onClick={() => onSetAll(etudiant.id, '0')}
//             title="Marquer toute la journée comme libre"
//           >
//             Tout libre
//           </Button>
//           <Button
//             size="sm"
//             className="btn-ghost btn-ghost-danger"
//             onClick={() => onSetAll(etudiant.id, '1')}
//             title="Marquer toute la journée comme occupée"
//           >
//             Tout occupé
//           </Button>
//         </div>
//       </div>

//       {expanded && (
//         <div className="student-body">
//           <div className="hour-groups">
//             {HOUR_GROUPS.map((group) => (
//               <div className="hour-group" key={group.label}>
//                 <div className="hour-label">{group.label}</div>
//                 <div className="hour-cells">
//                   {[0, 1, 2, 3].map((offset) => {
//                     const idx = group.start + offset;
//                     const isFree = slots[idx] === '0';
//                     return (
//                       <button
//                         key={idx}
//                         type="button"
//                         className={`slot-btn ${isFree ? 'free' : 'occupied'}`}
//                         aria-pressed={isFree}
//                         aria-label={`${TIME_SLOTS[idx]} — ${isFree ? 'libre' : 'occupé'}`}
//                         title={`${TIME_SLOTS[idx]} · ${isFree ? 'Libre' : 'Occupé'}`}
//                         onClick={() => onToggleSlot(etudiant.id, idx)}
//                       />
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// }

// // ============================================================================
// // Composant principal
// // ============================================================================

// export default function DisponibilitesEtudiantPage() {
//   const [etudiants, setEtudiants] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );

//   // Map { [etudiantId]: string[40] } où '0'=libre, '1'=occupé
//   const [studentSlots, setStudentSlots] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedIds, setExpandedIds] = useState(new Set());

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   const loadData = async (date) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const etuds = await fetchEtudiants();
//       setEtudiants(etuds || []);
//       // Par défaut, tout est déplié pour retrouver le comportement d'origine.
//       setExpandedIds(new Set((etuds || []).map((e) => e.id)));

//       const slotsMap = {};
//       await Promise.all(
//         (etuds || []).map(async (etud) => {
//           try {
//             const data = await fetchDisponibiliteEtudiant(etud.id, date);
//             if (data) {
//               if (Array.isArray(data) && data.length === 40) {
//                 slotsMap[etud.id] = data.map(String);
//               } else if (typeof data === 'object') {
//                 slotsMap[etud.id] = fromSlotRow(data);
//               } else {
//                 slotsMap[etud.id] = createDefaultSlots();
//               }
//             } else {
//               slotsMap[etud.id] = createDefaultSlots();
//             }
//           } catch {
//             slotsMap[etud.id] = createDefaultSlots();
//           }
//         })
//       );

//       setStudentSlots(slotsMap);
//     } catch (err) {
//       setError(err.message || 'Erreur lors du chargement des disponibilités.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData(selectedDate);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedDate]);

//   const toggleSlot = useCallback((etudiantId, slotIdx) => {
//     setStudentSlots((prev) => {
//       const current = prev[etudiantId] ? [...prev[etudiantId]] : createDefaultSlots();
//       current[slotIdx] = current[slotIdx] === '0' ? '1' : '0';
//       return { ...prev, [etudiantId]: current };
//     });
//     setSuccessMsg(null);
//   }, []);

//   const setAllSlotsForStudent = useCallback((etudiantId, value) => {
//     setStudentSlots((prev) => ({
//       ...prev,
//       [etudiantId]: Array(40).fill(value),
//     }));
//     setSuccessMsg(null);
//   }, []);

//   const setAllSlotsForVisible = (value) => {
//     setStudentSlots((prev) => {
//       const next = { ...prev };
//       filteredEtudiants.forEach((e) => {
//         next[e.id] = Array(40).fill(value);
//       });
//       return next;
//     });
//     setSuccessMsg(null);
//   };

//   const handleSaveAll = async () => {
//     try {
//       setSaving(true);
//       setError(null);
//       setSuccessMsg(null);

//       const savePromises = etudiants.map((etud) => {
//         const slotsArray = studentSlots[etud.id] || createDefaultSlots();
//         const slotPayload = toSlotObject(slotsArray);
//         return saveDisponibiliteEtudiant(etud.id, selectedDate, slotPayload);
//       });

//       await Promise.all(savePromises);
//       setSuccessMsg(
//         `Disponibilités enregistrées avec succès pour ${etudiants.length} étudiant(s) au ${selectedDate}.`
//       );
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la sauvegarde des disponibilités.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const filteredEtudiants = useMemo(() => {
//     const term = searchTerm.toLowerCase().trim();
//     if (!term) return etudiants;
//     return etudiants.filter(
//       (e) =>
//         (e.nom && e.nom.toLowerCase().includes(term)) ||
//         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
//         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
//     );
//   }, [etudiants, searchTerm]);

//   const globalStats = useMemo(() => {
//     let free = 0;
//     let total = 0;
//     filteredEtudiants.forEach((e) => {
//       const slots = studentSlots[e.id] || createDefaultSlots();
//       free += slots.filter((s) => s === '0').length;
//       total += 40;
//     });
//     const pct = total ? Math.round((free / total) * 100) : 0;
//     return { free, total, pct };
//   }, [filteredEtudiants, studentSlots]);

//   const toggleExpand = (id) => {
//     setExpandedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const expandAll = () => setExpandedIds(new Set(filteredEtudiants.map((e) => e.id)));
//   const collapseAll = () => setExpandedIds(new Set());

//   return (
//     <>
//       <Navbar />
//       <style>{STYLE_SHEET}</style>

//       <div className="dispo-page">
//         <AvailabilityToast
//           error={error}
//           success={successMsg}
//           onCloseError={() => setError(null)}
//           onCloseSuccess={() => setSuccessMsg(null)}
//         />

//         <div className="dispo-shell">
//           <div className="dispo-header">
//             <div>
//               <h2 className="dispo-title display">Disponibilités des étudiants</h2>
//               <p className="dispo-subtitle">
//                 Grille horaire 08:00 – 18:00, par créneaux de 15 minutes.
//                 <span className="dispo-legend">
//                   <span className="dispo-legend-dot" style={{ background: '#2dd4bf' }} />
//                   Libre
//                 </span>
//                 <span className="dispo-legend">
//                   <span className="dispo-legend-dot" style={{ background: '#2a3140' }} />
//                   Occupé
//                 </span>
//               </p>
//             </div>

//             <Button
//               className="btn-save"
//               onClick={handleSaveAll}
//               disabled={saving || loading}
//             >
//               {saving ? (
//                 <>
//                   <Spinner size="sm" animation="border" className="me-2" />
//                   Enregistrement...
//                 </>
//               ) : (
//                 'Enregistrer les disponibilités'
//               )}
//             </Button>
//           </div>

//           <div className="dispo-toolbar">
//             <Row className="g-3 align-items-end">
//               <Col md={2}>
//                 <Form.Label>Date</Form.Label>
//                 <Form.Control
//                   type="date"
//                   size="sm"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                 />
//               </Col>

//               <Col md={3}>
//                 <Form.Label>Rechercher</Form.Label>
//                 <InputGroup size="sm">
//                   <Form.Control
//                     placeholder="Nom, prénom, email..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   {searchTerm && (
//                     <Button className="btn-ghost" onClick={() => setSearchTerm('')}>
//                       ✕
//                     </Button>
//                   )}
//                 </InputGroup>
//               </Col>

//               <Col md={4} className="d-flex align-items-center gap-2 flex-wrap">
//                 <span className="stat-chip">
//                   <strong>{filteredEtudiants.length}</strong> étudiant(s) affiché(s)
//                 </span>
//                 <span className="stat-chip">
//                   <strong>{globalStats.pct}%</strong> de créneaux libres
//                 </span>
//               </Col>

//               <Col md={3} className="d-flex gap-2 justify-content-md-end flex-wrap">
//                 <Button className="btn-ghost" onClick={expandAll}>
//                   Tout déplier
//                 </Button>
//                 <Button className="btn-ghost" onClick={collapseAll}>
//                   Tout replier
//                 </Button>
//                 <Button
//                   className="btn-ghost"
//                   onClick={() => setAllSlotsForVisible('0')}
//                   title="Marquer tous les étudiants visibles comme libres"
//                 >
//                   Libérer tout
//                 </Button>
//                 <Button
//                   className="btn-ghost btn-ghost-danger"
//                   onClick={() => setAllSlotsForVisible('1')}
//                   title="Marquer tous les étudiants visibles comme occupés"
//                 >
//                   Occuper tout
//                 </Button>
//               </Col>
//             </Row>
//           </div>

//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" style={{ color: '#2dd4bf' }} />
//               <p className="mt-3" style={{ color: '#8b93a5' }}>
//                 Chargement des disponibilités...
//               </p>
//             </div>
//           ) : filteredEtudiants.length === 0 ? (
//             <div className="empty-state">
//               <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🔍</div>
//               Aucun étudiant ne correspond à votre recherche.
//             </div>
//           ) : (
//             <div className="student-list">
//               {filteredEtudiants.map((etud) => (
//                 <StudentCard
//                   key={etud.id}
//                   etudiant={etud}
//                   slots={studentSlots[etud.id] || createDefaultSlots()}
//                   expanded={expandedIds.has(etud.id)}
//                   onToggleExpand={() => toggleExpand(etud.id)}
//                   onToggleSlot={toggleSlot}
//                   onSetAll={setAllSlotsForStudent}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
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
  fetchEtudiants,
  fetchDisponibiliteEtudiant,
  saveDisponibiliteEtudiant,
  resetAllDisponibilites,
} from '../services/supabase';

// ============================================================================
// Constantes & helpers métier
// ============================================================================

const TIME_SLOTS = Array.from({ length: 40 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 15;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

const HOUR_GROUPS = Array.from({ length: 10 }, (_, h) => ({
  label: `${8 + h}h`,
  start: h * 4,
}));

const createDefaultSlots = () => Array(40).fill('1');

const toSlotObject = (slotsArray) => {
  const obj = {};
  for (let i = 0; i < 40; i++) {
    obj[`slot${i + 1}`] = String(slotsArray[i] ?? '1');
  }
  return obj;
};

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

/* ---------- Student cards ---------- */
.student-list { display: flex; flex-direction: column; gap: 0.7rem; }

.student-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.student-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  user-select: none;
}
.student-header:hover { background: var(--surface-hover); }

.chevron {
  color: var(--text-faint);
  transition: transform 0.15s ease;
  flex-shrink: 0;
  font-size: 0.7rem;
}
.chevron.open { transform: rotate(90deg); color: var(--accent); }

.student-avatar {
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

.student-meta { min-width: 0; flex-shrink: 0; }
.student-name { font-weight: 600; font-size: 0.92rem; color: #fff; white-space: nowrap; }
.student-email { font-size: 0.74rem; color: var(--text-faint); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

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

.student-quick-actions { display: flex; gap: 0.4rem; flex-shrink: 0; }

.student-body {
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
  .student-header { flex-wrap: wrap; }
  .sparkline { order: 4; width: 100%; min-width: 100%; }
  .student-quick-actions { margin-left: auto; }
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

function StudentCard({
  etudiant,
  slots,
  expanded,
  onToggleExpand,
  onToggleSlot,
  onSetAll,
}) {
  const freeCount = slots.filter((s) => s === '0').length;
  const initials = `${etudiant.prenom?.[0] ?? ''}${etudiant.nom?.[0] ?? ''}`.toUpperCase();

  return (
    <Card className="student-card">
      <div
        className="student-header"
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
        <span className="student-avatar">{initials || '?'}</span>

        <div className="student-meta">
          <div className="student-name">
            {etudiant.nom} {etudiant.prenom}
          </div>
          <div className="student-email">{etudiant.adresse_email}</div>
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

        <div className="student-quick-actions" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            className="btn-ghost"
            onClick={() => onSetAll(etudiant.id, '0')}
            title="Marquer toute la journée comme libre"
          >
            Tout libre
          </Button>
          <Button
            size="sm"
            className="btn-ghost btn-ghost-danger"
            onClick={() => onSetAll(etudiant.id, '1')}
            title="Marquer toute la journée comme occupée"
          >
            Tout occupé
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="student-body">
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
                        onClick={() => onToggleSlot(etudiant.id, idx)}
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

export default function DisponibilitesEtudiantPage() {
  const [etudiants, setEtudiants] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [studentSlots, setStudentSlots] = useState({});
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

      const etuds = await fetchEtudiants();
      setEtudiants(etuds || []);
      setExpandedIds(new Set((etuds || []).map((e) => e.id)));

      const slotsMap = {};
      await Promise.all(
        (etuds || []).map(async (etud) => {
          try {
            const data = await fetchDisponibiliteEtudiant(etud.id, date);
            if (data) {
              if (Array.isArray(data) && data.length === 40) {
                slotsMap[etud.id] = data.map(String);
              } else if (typeof data === 'object') {
                slotsMap[etud.id] = fromSlotRow(data);
              } else {
                slotsMap[etud.id] = createDefaultSlots();
              }
            } else {
              slotsMap[etud.id] = createDefaultSlots();
            }
          } catch {
            slotsMap[etud.id] = createDefaultSlots();
          }
        })
      );

      setStudentSlots(slotsMap);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des disponibilités.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const toggleSlot = useCallback((etudiantId, slotIdx) => {
    setStudentSlots((prev) => {
      const current = prev[etudiantId] ? [...prev[etudiantId]] : createDefaultSlots();
      current[slotIdx] = current[slotIdx] === '0' ? '1' : '0';
      return { ...prev, [etudiantId]: current };
    });
    setSuccessMsg(null);
  }, []);

  const setAllSlotsForStudent = useCallback((etudiantId, value) => {
    setStudentSlots((prev) => ({
      ...prev,
      [etudiantId]: Array(40).fill(value),
    }));
    setSuccessMsg(null);
  }, []);

  const setAllSlotsForVisible = (value) => {
    setStudentSlots((prev) => {
      const next = { ...prev };
      filteredEtudiants.forEach((e) => {
        next[e.id] = Array(40).fill(value);
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

      const savePromises = etudiants.map((etud) => {
        const slotsArray = studentSlots[etud.id] || createDefaultSlots();
        const slotPayload = toSlotObject(slotsArray);
        return saveDisponibiliteEtudiant(etud.id, selectedDate, slotPayload);
      });

      await Promise.all(savePromises);
      setSuccessMsg(
        `Disponibilités enregistrées avec succès pour ${etudiants.length} étudiant(s) au ${selectedDate}.`
      );
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde des disponibilités.');
    } finally {
      setSaving(false);
    }
  };

  // Action de Réinitialisation ciblée des disponibilités des étudiants
  const handleResetStudentDisponibilites = async () => {
    try {
      setResetting(true);
      setError(null);

      if (resetOption === 'current_date') {
        await resetAllDisponibilites('etudiants', selectedDate);
        await loadData(selectedDate);
      } else if (resetOption === 'all_dates') {
        await resetAllDisponibilites('etudiants');
        await loadData(selectedDate);
      }

      setSuccessMsg('Disponibilités des étudiants réinitialisées avec succès.');
      setShowResetModal(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setResetting(false);
    }
  };

  const filteredEtudiants = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return etudiants;
    return etudiants.filter(
      (e) =>
        (e.nom && e.nom.toLowerCase().includes(term)) ||
        (e.prenom && e.prenom.toLowerCase().includes(term)) ||
        (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
    );
  }, [etudiants, searchTerm]);

  const globalStats = useMemo(() => {
    let free = 0;
    let total = 0;
    filteredEtudiants.forEach((e) => {
      const slots = studentSlots[e.id] || createDefaultSlots();
      free += slots.filter((s) => s === '0').length;
      total += 40;
    });
    const pct = total ? Math.round((free / total) * 100) : 0;
    return { free, total, pct };
  }, [filteredEtudiants, studentSlots]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(filteredEtudiants.map((e) => e.id)));
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
              <h2 className="dispo-title display">Disponibilités des étudiants</h2>
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
                <span>🗑️</span>
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
                <Form.Label>Rechercher</Form.Label>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder="Nom, prénom, email..."
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
                  <strong>{filteredEtudiants.length}</strong> étudiant(s) affiché(s)
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
                  title="Marquer tous les étudiants visibles comme libres"
                >
                  Libérer tout
                </Button>
                <Button
                  className="btn-ghost btn-ghost-danger"
                  onClick={() => setAllSlotsForVisible('1')}
                  title="Marquer tous les étudiants visibles comme occupés"
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
                Chargement des disponibilités...
              </p>
            </div>
          ) : filteredEtudiants.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🔍</div>
              Aucun étudiant ne correspond à votre recherche.
            </div>
          ) : (
            <div className="student-list">
              {filteredEtudiants.map((etud) => (
                <StudentCard
                  key={etud.id}
                  etudiant={etud}
                  slots={studentSlots[etud.id] || createDefaultSlots()}
                  expanded={expandedIds.has(etud.id)}
                  onToggleExpand={() => toggleExpand(etud.id)}
                  onToggleSlot={toggleSlot}
                  onSetAll={setAllSlotsForStudent}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Réinitialisation Disponibilités Étudiants */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>
            🗑️ Réinitialiser les disponibilités (Étudiants)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">
            Choisissez la portée de la réinitialisation des créneaux :
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <Form.Check
              type="radio"
              id="reset-etud-date"
              name="reset-dispo-etud"
              label={`Réinitialiser les disponibilités de TOUS les étudiants pour le ${selectedDate}`}
              checked={resetOption === 'current_date'}
              onChange={() => setResetOption('current_date')}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              id="reset-etud-all"
              name="reset-dispo-etud"
              label="Supprimer TOUTES les disponibilités de TOUS les étudiants (toutes dates)"
              checked={resetOption === 'all_dates'}
              onChange={() => setResetOption('all_dates')}
            />
          </div>

          <p className="small text-muted mb-0">
            ⚠️ Les créneaux réinitialisés seront remis à l'état "occupé" par défaut.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button variant="danger" size="sm" onClick={handleResetStudentDisponibilites} disabled={resetting}>
            {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la réinitialisation'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}