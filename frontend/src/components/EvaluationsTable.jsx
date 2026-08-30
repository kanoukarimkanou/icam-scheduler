// // // import React, { useEffect, useMemo, useState } from 'react';
// // // import {
// // //   Table,
// // //   Form,
// // //   Button,
// // //   Alert,
// // //   Spinner,
// // //   Badge,
// // //   Card,
// // //   Row,
// // //   Col,
// // //   InputGroup,
// // //   Modal,
// // // } from 'react-bootstrap';
// // // import {
// // //   Chart as ChartJS,
// // //   RadialLinearScale,
// // //   PointElement,
// // //   LineElement,
// // //   Filler,
// // //   Tooltip,
// // //   Legend,
// // // } from 'chart.js';
// // // import { Radar } from 'react-chartjs-2';
// // // import * as XLSX from 'xlsx';
// // // import Navbar from './Navbar';
// // // import { useAuth } from '../context/AuthContext';
// // // import {
// // //   fetchEtudiants,
// // //   fetchChefsDeProjet,
// // //   fetchEvaluations,
// // //   saveEvaluation,
// // //   fetchSelections,
// // //   fetchAffectations,
// // //   saveAffectation,
// // //   deleteAffectation,
// // //   fetchAllApetences,
// // //   fetchAptitudesByEtudiant,
// // //   fetchApetencesByEtudiant,
// // //   computeChefRanksForStudent,
// // //   getDocumentPublicUrl,
// // // } from '../services/supabase';

// // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // const NOTES_DISPONIBLES = ['A', 'B', 'C', 'D'];

// // // const COMPETENCE_KEYS = [
// // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // //   { key: 'vision', label: 'Vision Industrielle' },
// // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // ];

// // // export default function EvaluationsTable() {
// // //   const { isAdmin, isChef, chefId, chefInfo } = useAuth();

// // //   const [etudiants, setEtudiants] = useState([]);
// // //   const [chefs, setChefs] = useState([]);
// // //   const [evaluations, setEvaluations] = useState([]);
// // //   const [selections, setSelections] = useState([]);
// // //   const [affectations, setAffectations] = useState([]);
// // //   const [apetencesList, setApetencesList] = useState([]);

// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [savingKey, setSavingKey] = useState(null);
// // //   const [savedSuccessKey, setSavedSuccessKey] = useState(null);

// // //   const [savingAffectationId, setSavingAffectationId] = useState(null);
// // //   const [affectationSuccessId, setAffectationSuccessId] = useState(null);

// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [localFormData, setLocalFormData] = useState({});

// // //   // Modals
// // //   const [modalRadarOpen, setModalRadarOpen] = useState(false);
// // //   const [modalLoading, setModalLoading] = useState(false);
// // //   const [selectedEtudRadar, setSelectedEtudRadar] = useState(null);
// // //   const [aptitudesData, setAptitudesData] = useState(null);
// // //   const [apetencesData, setApetencesData] = useState(null);
// // //   const [modalError, setModalError] = useState(null);

// // //   const [modalCommentOpen, setModalCommentOpen] = useState(false);
// // //   const [selectedCommentData, setSelectedCommentData] = useState(null);

// // //   const [modalAffectationsOpen, setModalAffectationsOpen] = useState(false);

// // //   const loadData = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const [etuds, chefsData, evals, sels, affs, apList] = await Promise.all([
// // //         fetchEtudiants(),
// // //         fetchChefsDeProjet(),
// // //         fetchEvaluations(),
// // //         fetchSelections(),
// // //         fetchAffectations(),
// // //         fetchAllApetences(),
// // //       ]);

// // //       setEtudiants(etuds || []);
// // //       setChefs(chefsData || []);
// // //       setEvaluations(evals || []);
// // //       setSelections(sels || []);
// // //       setAffectations(affs || []);
// // //       setApetencesList(apList || []);

// // //       const formInit = {};
// // //       (evals || []).forEach((ev) => {
// // //         formInit[`${ev.etudiant_id}-${ev.chef_de_projet_id}`] = {
// // //           note: ev.note || '',
// // //           commentaire: ev.commentaire || '',
// // //         };
// // //       });
// // //       setLocalFormData(formInit);
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors du chargement des évaluations.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

// // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // //   const appetenceRanksMap = useMemo(() => {
// // //     const map = new Map();
// // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // //     etudiants.forEach((etud) => {
// // //       const etudAp = apetencesByEtud.get(etud.id);
// // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // //       map.set(etud.id, ranks);
// // //     });

// // //     return map;
// // //   }, [apetencesList, etudiants, chefs]);

// // //   // Map des affectations : etudiant_id => { chef_id, chef_nom, specialite }
// // //   const affectationsMap = useMemo(() => {
// // //     const map = new Map();
// // //     (affectations || []).forEach((aff) => {
// // //       const chef = chefs.find((c) => c.id === aff.chef_de_projet_id);
// // //       map.set(aff.etudiant_id, {
// // //         chef_id: aff.chef_de_projet_id,
// // //         chef_nom: chef?.nom || aff.chefs_de_projet?.nom || 'Inconnu',
// // //         specialite: chef?.specialite || aff.chefs_de_projet?.specialite || '',
// // //       });
// // //     });
// // //     return map;
// // //   }, [affectations, chefs]);

// // //   // Liste filtrée des étudiants
// // //   const visibleEtudiants = useMemo(() => {
// // //     let list = etudiants;

// // //     if (isChef && chefId) {
// // //       const studentIdsForChef = new Set(
// // //         selections.filter((s) => s.chef_de_projet_id === chefId).map((s) => s.etudiant_id)
// // //       );
// // //       list = etudiants.filter((e) => studentIdsForChef.has(e.id));
// // //     }

// // //     if (searchTerm.trim()) {
// // //       const q = searchTerm.toLowerCase().trim();
// // //       list = list.filter(
// // //         (e) =>
// // //           (e.nom && e.nom.toLowerCase().includes(q)) ||
// // //           (e.prenom && e.prenom.toLowerCase().includes(q)) ||
// // //           (e.adresse_email && e.adresse_email.toLowerCase().includes(q))
// // //       );
// // //     }

// // //     // Si chef connecté : trier les étudiants par niveau d'appétence pour ce chef (rang 1er d'abord)
// // //     if (isChef && chefId) {
// // //       return [...list].sort((a, b) => {
// // //         const rankA = appetenceRanksMap.get(a.id)?.get(chefId)?.rank ?? 999;
// // //         const rankB = appetenceRanksMap.get(b.id)?.get(chefId)?.rank ?? 999;
// // //         return rankA - rankB;
// // //       });
// // //     }

// // //     return list;
// // //   }, [etudiants, isChef, chefId, selections, searchTerm, appetenceRanksMap]);

// // //   const getEval = (etudiantId, cId) =>
// // //     evaluations.find((e) => e.etudiant_id === etudiantId && e.chef_de_projet_id === cId);

// // //   const handleLocalChange = (etudiantId, cId, field, value) => {
// // //     const key = `${etudiantId}-${cId}`;
// // //     setLocalFormData((prev) => ({
// // //       ...prev,
// // //       [key]: {
// // //         ...prev[key],
// // //         [field]: value,
// // //       },
// // //     }));
// // //     setSavedSuccessKey(null);
// // //   };

// // //   const handleSaveEvaluation = async (etudiantId, cId) => {
// // //     const key = `${etudiantId}-${cId}`;
// // //     const formVal = localFormData[key] || {};
// // //     const note = formVal.note || '';
// // //     const commentaire = formVal.commentaire || '';

// // //     if (!note && !commentaire) {
// // //       setError('Veuillez renseigner au moins une note ou un commentaire.');
// // //       return;
// // //     }

// // //     setSavingKey(key);
// // //     setError(null);

// // //     try {
// // //       await saveEvaluation(cId, etudiantId, note, commentaire);

// // //       setEvaluations((prev) => {
// // //         const next = prev.filter(
// // //           (e) => !(e.etudiant_id === etudiantId && e.chef_de_projet_id === cId)
// // //         );
// // //         return [
// // //           ...next,
// // //           { etudiant_id: etudiantId, chef_de_projet_id: cId, note, commentaire },
// // //         ];
// // //       });

// // //       setSavedSuccessKey(key);
// // //       setTimeout(() => setSavedSuccessKey(null), 3000);
// // //     } catch (err) {
// // //       setError(err.message || "Erreur lors de l'enregistrement de l'évaluation.");
// // //     } finally {
// // //       setSavingKey(null);
// // //     }
// // //   };

// // //   const handleAssign = async (etudiantId, targetChefIdStr) => {
// // //     setSavingAffectationId(etudiantId);
// // //     setError(null);

// // //     try {
// // //       if (!targetChefIdStr) {
// // //         await deleteAffectation(etudiantId);
// // //         setAffectations((prev) => prev.filter((a) => a.etudiant_id !== etudiantId));
// // //       } else {
// // //         const targetChefId = Number(targetChefIdStr);
// // //         await saveAffectation(targetChefId, etudiantId);
// // //         setAffectations((prev) => {
// // //           const next = prev.filter((a) => a.etudiant_id !== etudiantId);
// // //           return [...next, { etudiant_id: etudiantId, chef_de_projet_id: targetChefId }];
// // //         });
// // //       }

// // //       setAffectationSuccessId(etudiantId);
// // //       setTimeout(() => setAffectationSuccessId(null), 2500);
// // //     } catch (err) {
// // //       setError(err.message || "Erreur lors de l'enregistrement de l'affectation.");
// // //     } finally {
// // //       setSavingAffectationId(null);
// // //     }
// // //   };

// // //   const handleOpenCommentPopup = (etudiant, chef, ev) => {
// // //     setSelectedCommentData({
// // //       etudiant,
// // //       chef,
// // //       note: ev?.note || 'Non noté',
// // //       commentaire: ev?.commentaire || 'Aucun commentaire rédigé.',
// // //     });
// // //     setModalCommentOpen(true);
// // //   };

// // //   const handleOpenRadar = async (etudiant) => {
// // //     setSelectedEtudRadar(etudiant);
// // //     setModalRadarOpen(true);
// // //     setModalLoading(true);
// // //     setModalError(null);
// // //     setAptitudesData(null);
// // //     setApetencesData(null);

// // //     try {
// // //       const [aptitudes, apetences] = await Promise.all([
// // //         fetchAptitudesByEtudiant(etudiant.id),
// // //         fetchApetencesByEtudiant(etudiant.id),
// // //       ]);

// // //       if (!aptitudes && !apetences) {
// // //         setModalError('Aucune compétence enregistrée.');
// // //       } else {
// // //         setAptitudesData(aptitudes);
// // //         setApetencesData(apetences);
// // //       }
// // //     } catch (err) {
// // //       setModalError(err.message || 'Erreur lors du chargement des compétences.');
// // //     } finally {
// // //       setModalLoading(false);
// // //     }
// // //   };

// // //   const radarChartData = useMemo(() => {
// // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // //     return {
// // //       labels,
// // //       datasets: [
// // //         {
// // //           label: 'Aptitudes (Technique)',
// // //           data: aptValues,
// // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // //           borderColor: '#38bdf8',
// // //           borderWidth: 2,
// // //           pointBackgroundColor: '#38bdf8',
// // //         },
// // //         {
// // //           label: 'Appétences (Intérêt)',
// // //           data: apeValues,
// // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // //           borderColor: '#f43f5e',
// // //           borderWidth: 2,
// // //           pointBackgroundColor: '#f43f5e',
// // //         },
// // //       ],
// // //     };
// // //   }, [aptitudesData, apetencesData]);

// // //   const radarOptions = {
// // //     responsive: true,
// // //     maintainAspectRatio: false,
// // //     scales: {
// // //       r: {
// // //         min: 0,
// // //         suggestedMax: 4,
// // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // //       },
// // //     },
// // //     plugins: {
// // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 12 } } },
// // //     },
// // //   };

// // //   // Export Excel
// // //   const handleExportEvaluationsExcel = () => {
// // //     try {
// // //       const rows = [];
// // //       visibleEtudiants.forEach((etud) => {
// // //         const chefsToExport = isChef && chefId ? chefs.filter((c) => c.id === chefId) : chefs;
// // //         const studentRanks = appetenceRanksMap.get(etud.id);

// // //         chefsToExport.forEach((c) => {
// // //           const ev = getEval(etud.id, c.id);
// // //           const aff = affectationsMap.get(etud.id);
// // //           const rankInfo = studentRanks?.get(c.id);

// // //           rows.push({
// // //             'Étudiant': `${etud.nom} ${etud.prenom}`,
// // //             'Email Étudiant': etud.adresse_email,
// // //             'Chef Évaluateur': c.nom,
// // //             'Rang Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : 'N/A',
// // //             'Note': ev?.note || '',
// // //             'Commentaire': ev?.commentaire || '',
// // //             'Affectation Finale': aff ? `${aff.chef_nom} (${aff.specialite})` : 'Non affecté',
// // //           });
// // //         });
// // //       });

// // //       const ws = XLSX.utils.json_to_sheet(rows);
// // //       ws['!cols'] = [{ wch: 25 }, { wch: 32 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 45 }, { wch: 30 }];

// // //       const wb = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(wb, ws, 'Évaluations');
// // //       XLSX.writeFile(wb, `evaluations_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // //     } catch (err) {
// // //       alert(`Erreur export: ${err.message}`);
// // //     }
// // //   };

// // //   const handleExportAffectationsExcel = () => {
// // //     try {
// // //       const detailedRows = etudiants.map((etud) => {
// // //         const aff = affectationsMap.get(etud.id);
// // //         const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

// // //         return {
// // //           'Nom': etud.nom || '',
// // //           'Prénom': etud.prenom || '',
// // //           'Email': etud.adresse_email || '',
// // //           'Parcours': etud.parcours || 'I2026',
// // //           'Statut Affectation': aff ? 'Affecté' : 'Non affecté',
// // //           'Chef Assigné': aff ? aff.chef_nom : '—',
// // //           'Spécialité': aff ? aff.specialite : '—',
// // //           'Satisfaction Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : aff ? 'Hors Vœux' : '—',
// // //         };
// // //       });

// // //       const summaryRows = chefs.map((chef) => {
// // //         const assignedStudents = etudiants.filter(
// // //           (e) => affectationsMap.get(e.id)?.chef_id === chef.id
// // //         );
// // //         return {
// // //           'Chef de Projet': chef.nom,
// // //           'Spécialité': chef.specialite || 'N/A',
// // //           'Email': chef.email || '',
// // //           'Nb Étudiants Affectés': assignedStudents.length,
// // //           'Étudiants': assignedStudents.map((s) => `${s.nom} ${s.prenom}`).join(', ') || 'Aucun',
// // //         };
// // //       });

// // //       const ws1 = XLSX.utils.json_to_sheet(detailedRows);
// // //       ws1['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 32 }, { wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];

// // //       const ws2 = XLSX.utils.json_to_sheet(summaryRows);
// // //       ws2['!cols'] = [{ wch: 26 }, { wch: 28 }, { wch: 32 }, { wch: 24 }, { wch: 60 }];

// // //       const wb = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(wb, ws1, 'Affectations Finales');
// // //       XLSX.utils.book_append_sheet(wb, ws2, 'Synthèse Chefs');

// // //       XLSX.writeFile(wb, `affectations_finales_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // //     } catch (err) {
// // //       alert(`Erreur export: ${err.message}`);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // //         <Spinner animation="border" variant="info" />
// // //         <p className="mt-3 text-muted">Chargement des évaluations...</p>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <style>{`
// // //         .eval-page-wrapper {
// // //           max-width: 98%;
// // //           margin: 0 auto;
// // //           padding: 1.5rem 0 3rem 0;
// // //           color: #f8fafc;
// // //         }
// // //         .eval-card {
// // //           background: rgba(18, 24, 38, 0.85);
// // //           backdrop-filter: blur(16px);
// // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // //           border-radius: 16px;
// // //         }
// // //         .btn-comment-popup {
// // //           background: rgba(14, 165, 233, 0.15);
// // //           border: 1px solid rgba(14, 165, 233, 0.35);
// // //           color: #38bdf8;
// // //           border-radius: 6px;
// // //           padding: 2px 6px;
// // //           font-size: 0.75rem;
// // //           cursor: pointer;
// // //         }
// // //         .select-affectation {
// // //           background-color: #1e293b !important;
// // //           color: #f8fafc !important;
// // //           border: 1px solid rgba(14, 165, 233, 0.4) !important;
// // //           font-size: 0.8rem;
// // //           border-radius: 8px;
// // //         }
// // //         .select-affectation.is-assigned {
// // //           background-color: rgba(16, 185, 129, 0.18) !important;
// // //           border-color: #10b981 !important;
// // //           color: #6ee7b7 !important;
// // //           font-weight: 600;
// // //         }
// // //       `}</style>

// // //       <Navbar />

// // //       <div className="eval-page-wrapper">
// // //         {/* Header */}
// // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // //           <div>
// // //             <div className="d-flex align-items-center gap-2">
// // //               <span style={{ fontSize: '1.8rem' }}>📝</span>
// // //               <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px' }}>
// // //                 {isChef ? `Mes Évaluations — ${chefInfo?.nom || 'Chef de projet'}` : 'Évaluations & Affectations Finales'}
// // //               </h2>
// // //             </div>
// // //             <p className="text-light opacity-75 small mt-1 mb-0">
// // //               {isChef
// // //                 ? 'Les étudiants sont triés selon leur niveau d’appétence pour votre thématique (1er choix en haut).'
// // //                 : 'Consultez les notes des chefs et l’ordre de préférence de l’étudiant basé sur ses appétences.'}
// // //             </p>
// // //           </div>

// // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // //             {isAdmin && (
// // //               <Button
// // //                 variant="primary"
// // //                 size="sm"
// // //                 onClick={() => setModalAffectationsOpen(true)}
// // //                 className="px-3 py-2 fw-semibold"
// // //               >
// // //                 🎯 Résultats Affectations ({affectations.length} / {etudiants.length})
// // //               </Button>
// // //             )}

// // //             <Button
// // //               variant="success"
// // //               size="sm"
// // //               onClick={handleExportEvaluationsExcel}
// // //               className="px-3 py-2 fw-semibold"
// // //             >
// // //               📊 Exporter Notes
// // //             </Button>

// // //             {isAdmin && (
// // //               <Button
// // //                 variant="outline-info"
// // //                 size="sm"
// // //                 onClick={handleExportAffectationsExcel}
// // //                 className="px-3 py-2 fw-semibold"
// // //               >
// // //                 📥 Exporter Affectations (.xlsx)
// // //               </Button>
// // //             )}

// // //             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
// // //               🔄 Actualiser
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

// // //         {/* Barre de recherche */}
// // //         <Card className="eval-card mb-4 p-3 shadow-sm">
// // //           <Row className="align-items-center">
// // //             <Col md={6}>
// // //               <InputGroup size="sm">
// // //                 <InputGroup.Text className="bg-transparent border-secondary text-muted">🔍</InputGroup.Text>
// // //                 <Form.Control
// // //                   placeholder="Rechercher un étudiant par nom, prénom ou email..."
// // //                   className="bg-dark text-white border-secondary"
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                 />
// // //                 {searchTerm && (
// // //                   <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>✕</Button>
// // //                 )}
// // //               </InputGroup>
// // //             </Col>
// // //             <Col md={6} className="text-md-end mt-2 mt-md-0 d-flex gap-2 justify-content-md-end align-items-center">
// // //               <Badge bg="info" className="px-3 py-2 fs-6">
// // //                 {visibleEtudiants.length} étudiant(s)
// // //               </Badge>
// // //               {isAdmin && (
// // //                 <Badge bg={affectations.length === etudiants.length ? 'success' : 'warning'} text="dark" className="px-3 py-2 fs-6">
// // //                   {affectations.length} / {etudiants.length} affecté(s)
// // //                 </Badge>
// // //               )}
// // //             </Col>
// // //           </Row>
// // //         </Card>

// // //         {/* ========================================================================= */}
// // //         {/* VUE CHEF                                                                  */}
// // //         {/* ========================================================================= */}
// // //         {isChef ? (
// // //           <div className="d-flex flex-column gap-3">
// // //             {visibleEtudiants.length === 0 ? (
// // //               <Alert variant="secondary" className="text-center py-5">
// // //                 Aucun étudiant assigné pour le moment.
// // //               </Alert>
// // //             ) : (
// // //               visibleEtudiants.map((etud) => {
// // //                 const key = `${etud.id}-${chefId}`;
// // //                 const formVal = localFormData[key] || {};
// // //                 const isSaving = savingKey === key;
// // //                 const isSaved = savedSuccessKey === key;
// // //                 const aff = affectationsMap.get(etud.id);
// // //                 const isAssignedToMe = aff?.chef_id === chefId;
// // //                 const rankInfo = appetenceRanksMap.get(etud.id)?.get(chefId);
// // //                 const rankNum = rankInfo?.rank || 1;

// // //                 return (
// // //                   <Card key={etud.id} className="eval-card p-3 shadow-sm border-secondary">
// // //                     <Row className="g-3 align-items-center">
// // //                       <Col lg={4} md={12}>
// // //                         <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
// // //                           <span className="fw-bold fs-6 text-white">{etud.nom} {etud.prenom}</span>
// // //                           <Badge bg="secondary" className="font-monospace">{etud.parcours}</Badge>
// // //                           <Badge bg={rankNum === 1 ? 'success' : rankNum === 2 ? 'info' : 'warning'} text={rankNum === 1 ? 'light' : 'dark'}>
// // //                             ⭐ Appétence : {rankNum === 1 ? '1er choix' : `${rankNum}e choix`} ({rankInfo?.score ?? 0}/4)
// // //                           </Badge>
// // //                           {aff && (
// // //                             <Badge bg={isAssignedToMe ? 'success' : 'dark'} className="border border-secondary">
// // //                               {isAssignedToMe ? '🎯 Affecté à vous' : `Affecté : ${aff.chef_nom}`}
// // //                             </Badge>
// // //                           )}
// // //                         </div>
// // //                         <div className="text-muted small font-monospace mb-2">{etud.adresse_email}</div>

// // //                         <div className="d-flex gap-2 align-items-center">
// // //                           <Button variant="outline-info" size="sm" style={{ fontSize: '0.75rem', padding: '2px 8px' }} onClick={() => handleOpenRadar(etud)}>
// // //                             📊 Radar
// // //                           </Button>
// // //                           {etud.cv_path && (
// // //                             <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // //                               📄 CV
// // //                             </a>
// // //                           )}
// // //                           {etud.lm_path && (
// // //                             <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // //                               ✉️ LM
// // //                             </a>
// // //                           )}
// // //                         </div>
// // //                       </Col>

// // //                       <Col lg={2} md={4}>
// // //                         <Form.Label className="small text-light fw-bold mb-1">Note</Form.Label>
// // //                         <Form.Select
// // //                           size="sm"
// // //                           className="bg-dark text-white border-secondary fw-bold"
// // //                           value={formVal.note || ''}
// // //                           onChange={(e) => handleLocalChange(etud.id, chefId, 'note', e.target.value)}
// // //                         >
// // //                           <option value="">— Non noté —</option>
// // //                           {NOTES_DISPONIBLES.map((n) => (
// // //                             <option key={n} value={n}>Note {n}</option>
// // //                           ))}
// // //                         </Form.Select>
// // //                       </Col>

// // //                       <Col lg={4} md={5}>
// // //                         <Form.Label className="small text-light fw-bold mb-1">Commentaire</Form.Label>
// // //                         <Form.Control
// // //                           as="textarea"
// // //                           rows={2}
// // //                           size="sm"
// // //                           className="bg-dark text-white border-secondary"
// // //                           placeholder="Points forts, adéquation..."
// // //                           value={formVal.commentaire || ''}
// // //                           onChange={(e) => handleLocalChange(etud.id, chefId, 'commentaire', e.target.value)}
// // //                         />
// // //                       </Col>

// // //                       <Col lg={2} md={3} className="text-end">
// // //                         <Button
// // //                           variant={isSaved ? 'outline-success' : 'primary'}
// // //                           size="sm"
// // //                           className="w-100 py-2 fw-semibold"
// // //                           disabled={isSaving}
// // //                           onClick={() => handleSaveEvaluation(etud.id, chefId)}
// // //                         >
// // //                           {isSaving ? <Spinner size="sm" animation="border" /> : isSaved ? 'Enregistré ✅' : '💾 Enregistrer'}
// // //                         </Button>
// // //                       </Col>
// // //                     </Row>
// // //                   </Card>
// // //                 );
// // //               })
// // //             )}
// // //           </div>
// // //         ) : (
// // //           /* ========================================================================= */
// // //           /* VUE ADMIN : Matrice avec Rang d'Appétence                                 */
// // //           /* ========================================================================= */
// // //           <div className="eval-card overflow-hidden">
// // //             <div className="table-responsive" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
// // //               <Table size="sm" hover className="mb-0 text-white text-center align-middle text-nowrap">
// // //                 <thead className="table-dark sticky-top" style={{ zIndex: 10 }}>
// // //                   <tr>
// // //                     <th style={{ textAlign: 'left', minWidth: '260px', paddingLeft: '1rem', zIndex: 12 }}>
// // //                       Étudiant & Documents
// // //                     </th>
// // //                     <th style={{ minWidth: '220px', backgroundColor: '#0f172a', borderRight: '2px solid rgba(99,102,241,0.4)', zIndex: 11 }}>
// // //                       🎯 Affectation Finale
// // //                     </th>
// // //                     {chefs.map((c) => (
// // //                       <th key={c.id} style={{ minWidth: '135px' }}>
// // //                         <div>{c.nom}</div>
// // //                         {c.specialite && (
// // //                           <div className="text-muted small fw-normal text-truncate" style={{ maxWidth: '130px' }} title={c.specialite}>
// // //                             {c.specialite}
// // //                           </div>
// // //                         )}
// // //                       </th>
// // //                     ))}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {visibleEtudiants.map((etud) => {
// // //                     const aff = affectationsMap.get(etud.id);
// // //                     const isSavingAff = savingAffectationId === etud.id;
// // //                     const isAffSuccess = affectationSuccessId === etud.id;
// // //                     const studentRanks = appetenceRanksMap.get(etud.id);

// // //                     return (
// // //                       <tr key={etud.id}>
// // //                         <td style={{ textAlign: 'left', paddingLeft: '1rem' }}>
// // //                           <div className="d-flex align-items-center justify-content-between gap-2">
// // //                             <div>
// // //                               <div className="fw-bold text-light">{etud.nom} {etud.prenom}</div>
// // //                               <small className="text-muted font-monospace">{etud.adresse_email}</small>
// // //                             </div>
// // //                             <div className="d-flex gap-1">
// // //                               <Button variant="outline-info" size="sm" style={{ fontSize: '0.7rem', padding: '2px 6px' }} onClick={() => handleOpenRadar(etud)}>
// // //                                 📊
// // //                               </Button>
// // //                               {etud.cv_path && (
// // //                                 <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // //                                   📄
// // //                                 </a>
// // //                               )}
// // //                               {etud.lm_path && (
// // //                                 <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // //                                   ✉️
// // //                                 </a>
// // //                               )}
// // //                             </div>
// // //                           </div>
// // //                         </td>

// // //                         <td style={{ borderRight: '2px solid rgba(99,102,241,0.4)', padding: '0.4rem 0.8rem' }}>
// // //                           <div className="d-flex align-items-center gap-2 justify-content-center">
// // //                             {isSavingAff ? (
// // //                               <Spinner size="sm" animation="border" variant="info" />
// // //                             ) : (
// // //                               <Form.Select
// // //                                 size="sm"
// // //                                 className={`select-affectation ${aff ? 'is-assigned' : ''}`}
// // //                                 value={aff ? aff.chef_id : ''}
// // //                                 onChange={(e) => handleAssign(etud.id, e.target.value)}
// // //                               >
// // //                                 <option value="">— Non affecté —</option>
// // //                                 {chefs.map((c) => (
// // //                                   <option key={c.id} value={c.id}>
// // //                                     {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // //                                   </option>
// // //                                 ))}
// // //                               </Form.Select>
// // //                             )}
// // //                             {isAffSuccess && <span className="small text-success fw-bold">✅</span>}
// // //                           </div>
// // //                         </td>

// // //                         {chefs.map((c) => {
// // //                           const ev = getEval(etud.id, c.id);
// // //                           const rankInfo = studentRanks?.get(c.id);
// // //                           const hasComment = Boolean(ev?.commentaire?.trim());
// // //                           const isAssignedToThisChef = aff?.chef_id === c.id;

// // //                           return (
// // //                             <td key={c.id} style={{ backgroundColor: isAssignedToThisChef ? 'rgba(16, 185, 129, 0.15)' : 'inherit' }}>
// // //                               <div className="d-flex align-items-center justify-content-center gap-1">
// // //                                 {rankInfo ? (
// // //                                   <Badge
// // //                                     bg={rankInfo.rank === 1 ? 'success' : rankInfo.rank === 2 ? 'info' : 'warning'}
// // //                                     text={rankInfo.rank === 1 ? 'light' : 'dark'}
// // //                                     style={{ fontSize: '0.72rem' }}
// // //                                     title={`Appétence: ${rankInfo.score}/4`}
// // //                                   >
// // //                                     {rankInfo.rank === 1 ? '1er' : `${rankInfo.rank}e`}
// // //                                   </Badge>
// // //                                 ) : (
// // //                                   <span className="text-muted small" style={{ opacity: 0.4 }}>—</span>
// // //                                 )}

// // //                                 <Badge
// // //                                   bg={ev?.note === 'A' ? 'success' : ev?.note === 'B' ? 'primary' : ev?.note === 'C' ? 'warning' : ev?.note === 'D' ? 'danger' : 'dark'}
// // //                                   className="px-2 py-1 font-monospace"
// // //                                   style={{ fontSize: '0.8rem' }}
// // //                                 >
// // //                                   {ev?.note || '—'}
// // //                                 </Badge>

// // //                                 {hasComment && (
// // //                                   <button className="btn-comment-popup" onClick={() => handleOpenCommentPopup(etud, c, ev)}>
// // //                                     💬
// // //                                   </button>
// // //                                 )}
// // //                               </div>
// // //                             </td>
// // //                           );
// // //                         })}
// // //                       </tr>
// // //                     );
// // //                   })}
// // //                 </tbody>
// // //               </Table>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Modal Résultats d'affectations avec rang d'appétence */}
// // //       <Modal show={modalAffectationsOpen} onHide={() => setModalAffectationsOpen(false)} size="xl" centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title className="text-white">🎯 Synthèse Officielle des Affectations ({affectations.length} / {etudiants.length})</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
// // //           <Row className="g-3 mb-4">
// // //             <Col md={4}>
// // //               <Card className="bg-black bg-opacity-40 border-secondary text-center p-3">
// // //                 <span className="text-muted small fw-bold">Total Étudiants</span>
// // //                 <h3 className="text-white fw-bold mb-0 mt-1">{etudiants.length}</h3>
// // //               </Card>
// // //             </Col>
// // //             <Col md={4}>
// // //               <Card className="bg-black bg-opacity-40 border-success text-center p-3">
// // //                 <span className="text-success small fw-bold">Affectés</span>
// // //                 <h3 className="text-success fw-bold mb-0 mt-1">{affectations.length}</h3>
// // //               </Card>
// // //             </Col>
// // //             <Col md={4}>
// // //               <Card className="bg-black bg-opacity-40 border-warning text-center p-3">
// // //                 <span className="text-warning small fw-bold">Non affectés</span>
// // //                 <h3 className="text-warning fw-bold mb-0 mt-1">{etudiants.length - affectations.length}</h3>
// // //               </Card>
// // //             </Col>
// // //           </Row>

// // //           <h5 className="text-white mb-3">📋 Liste détaillée par étudiant & Satisfaction Appétence</h5>
// // //           <div className="table-responsive rounded border border-secondary">
// // //             <Table size="sm" hover variant="dark" className="mb-0 align-middle">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Étudiant</th>
// // //                   <th>Email</th>
// // //                   <th>Statut</th>
// // //                   <th>Chef Assigné</th>
// // //                   <th>Satisfaction Appétence</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {etudiants.map((etud) => {
// // //                   const aff = affectationsMap.get(etud.id);
// // //                   const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

// // //                   return (
// // //                     <tr key={etud.id}>
// // //                       <td className="fw-semibold text-white">{etud.nom} {etud.prenom}</td>
// // //                       <td className="text-muted font-monospace">{etud.adresse_email}</td>
// // //                       <td>
// // //                         <Badge bg={aff ? 'success' : 'warning'} text={aff ? 'light' : 'dark'}>
// // //                           {aff ? 'Affecté' : 'Non affecté'}
// // //                         </Badge>
// // //                       </td>
// // //                       <td>{aff ? <strong className="text-info">{aff.chef_nom}</strong> : '—'}</td>
// // //                       <td>
// // //                         {rankInfo ? (
// // //                           <Badge bg={rankInfo.rank === 1 ? 'success' : rankInfo.rank === 2 ? 'info' : 'warning'} text={rankInfo.rank === 1 ? 'light' : 'dark'}>
// // //                             {rankInfo.rank === 1 ? '1er choix' : `${rankInfo.rank}e choix`} ({rankInfo.score}/4)
// // //                           </Badge>
// // //                         ) : aff ? (
// // //                           <Badge bg="secondary">Hors Vœux</Badge>
// // //                         ) : (
// // //                           '—'
// // //                         )}
// // //                       </td>
// // //                     </tr>
// // //                   );
// // //                 })}
// // //               </tbody>
// // //             </Table>
// // //           </div>
// // //         </Modal.Body>
// // //         <Modal.Footer className="d-flex justify-content-between">
// // //           <Button variant="success" onClick={handleExportAffectationsExcel}>
// // //             📥 Télécharger le fichier Excel (.xlsx)
// // //           </Button>
// // //           <Button variant="secondary" onClick={() => setModalAffectationsOpen(false)}>
// // //             Fermer
// // //           </Button>
// // //         </Modal.Footer>
// // //       </Modal>

// // //       {/* Modal Commentaire */}
// // //       <Modal show={modalCommentOpen} onHide={() => setModalCommentOpen(false)} centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title>💬 Détail de l'évaluation</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body className="p-4">
// // //           <div className="mb-3">
// // //             <h5 className="text-white mb-0">{selectedCommentData?.etudiant?.nom} {selectedCommentData?.etudiant?.prenom}</h5>
// // //             <small className="text-muted font-monospace">{selectedCommentData?.etudiant?.adresse_email}</small>
// // //           </div>
// // //           <div className="mb-3 d-flex justify-content-between p-2 rounded bg-black bg-opacity-25 border border-secondary">
// // //             <div>Évaluateur : <strong className="text-info">{selectedCommentData?.chef?.nom}</strong></div>
// // //             <div>Note : <Badge bg="primary">{selectedCommentData?.note}</Badge></div>
// // //           </div>
// // //           <div className="p-3 rounded bg-dark border border-secondary text-white">
// // //             {selectedCommentData?.commentaire}
// // //           </div>
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" onClick={() => setModalCommentOpen(false)}>Fermer</Button>
// // //         </Modal.Footer>
// // //       </Modal>

// // //       {/* Modal Radar */}
// // //       <Modal show={modalRadarOpen} onHide={() => setModalRadarOpen(false)} size="lg" centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title>📊 Profil Compétences : {selectedEtudRadar?.nom} {selectedEtudRadar?.prenom}</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // //           {modalLoading ? (
// // //             <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
// // //           ) : modalError ? (
// // //             <Alert variant="warning">{modalError}</Alert>
// // //           ) : (
// // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // //               <Radar data={radarChartData} options={radarOptions} />
// // //             </div>
// // //           )}
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" onClick={() => setModalRadarOpen(false)}>Fermer</Button>
// // //         </Modal.Footer>
// // //       </Modal>
// // //     </>
// // //   );
// // // }

// // import React, { useEffect, useMemo, useState } from 'react';
// // import {
// //   Table,
// //   Form,
// //   Button,
// //   Alert,
// //   Spinner,
// //   Badge,
// //   Card,
// //   Row,
// //   Col,
// //   InputGroup,
// //   Modal,
// //   ButtonGroup,
// //   OverlayTrigger,
// //   Tooltip as BsTooltip,
// // } from 'react-bootstrap';
// // import {
// //   Chart as ChartJS,
// //   RadialLinearScale,
// //   PointElement,
// //   LineElement,
// //   Filler,
// //   Tooltip,
// //   Legend,
// // } from 'chart.js';
// // import { Radar } from 'react-chartjs-2';
// // import * as XLSX from 'xlsx';
// // import Navbar from './Navbar';
// // import { useAuth } from '../context/AuthContext';
// // import {
// //   fetchEtudiants,
// //   fetchChefsDeProjet,
// //   fetchEvaluations,
// //   saveEvaluation,
// //   fetchSelections,
// //   fetchAffectations,
// //   saveAffectation,
// //   deleteAffectation,
// //   fetchAllApetences,
// //   fetchAptitudesByEtudiant,
// //   fetchApetencesByEtudiant,
// //   computeChefRanksForStudent,
// //   getDocumentPublicUrl,
// // } from '../services/supabase';

// // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // const NOTES_DISPONIBLES = ['A', 'B', 'C', 'D'];

// // const COMPETENCE_KEYS = [
// //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// //   { key: 'conception_mecanique', label: 'Conception Méca' },
// //   { key: 'automatique_automatisme', label: 'Automatique' },
// //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// //   { key: 'vision', label: 'Vision Industrielle' },
// //   { key: 'ia', label: 'Intelligence Artificielle' },
// //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // ];

// // // Longueur de l'abréviation utilisée dans les en-têtes de colonnes chef (compromis
// // // lisibilité / densité horizontale demandé : 3-4 caractères + tooltip nom complet).
// // const CHEF_ABBR_LEN = 4;
// // const abbreviateChefName = (nom = '') => {
// //   const clean = nom.trim();
// //   if (!clean) return '—';
// //   return clean.slice(0, CHEF_ABBR_LEN).toUpperCase();
// // };

// // const rankBadgeVariant = (rank) => (rank === 1 ? 'success' : rank === 2 ? 'info' : 'warning');
// // const rankBadgeText = (rank) => (rank === 1 ? 'light' : 'dark');
// // const noteBadgeVariant = (note) =>
// //   note === 'A' ? 'success' : note === 'B' ? 'primary' : note === 'C' ? 'warning' : note === 'D' ? 'danger' : 'dark';

// // function withTooltip(id, label, children) {
// //   return (
// //     <OverlayTrigger placement="top" overlay={<BsTooltip id={id}>{label}</BsTooltip>}>
// //       {children}
// //     </OverlayTrigger>
// //   );
// // }

// // export default function EvaluationsTable() {
// //   const { isAdmin, isChef, chefId, chefInfo } = useAuth();

// //   const [etudiants, setEtudiants] = useState([]);
// //   const [chefs, setChefs] = useState([]);
// //   const [evaluations, setEvaluations] = useState([]);
// //   const [selections, setSelections] = useState([]);
// //   const [affectations, setAffectations] = useState([]);
// //   const [apetencesList, setApetencesList] = useState([]);

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [savingKey, setSavingKey] = useState(null);
// //   const [savedSuccessKey, setSavedSuccessKey] = useState(null);

// //   const [savingAffectationId, setSavingAffectationId] = useState(null);
// //   const [affectationSuccessId, setAffectationSuccessId] = useState(null);

// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [localFormData, setLocalFormData] = useState({});

// //   // Filtres rapides (UX : permet de zoomer sur les étudiants qui nécessitent une action)
// //   const [statusFilter, setStatusFilter] = useState('all'); // all | assigned | unassigned

// //   // Densité du tableau admin : compacte (par défaut, max d'infos visibles) ou confortable
// //   const [density, setDensity] = useState('compact'); // compact | comfortable

// //   // Modals
// //   const [modalRadarOpen, setModalRadarOpen] = useState(false);
// //   const [modalLoading, setModalLoading] = useState(false);
// //   const [selectedEtudRadar, setSelectedEtudRadar] = useState(null);
// //   const [aptitudesData, setAptitudesData] = useState(null);
// //   const [apetencesData, setApetencesData] = useState(null);
// //   const [modalError, setModalError] = useState(null);

// //   const [modalCommentOpen, setModalCommentOpen] = useState(false);
// //   const [selectedCommentData, setSelectedCommentData] = useState(null);

// //   const [modalAffectationsOpen, setModalAffectationsOpen] = useState(false);

// //   const loadData = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const [etuds, chefsData, evals, sels, affs, apList] = await Promise.all([
// //         fetchEtudiants(),
// //         fetchChefsDeProjet(),
// //         fetchEvaluations(),
// //         fetchSelections(),
// //         fetchAffectations(),
// //         fetchAllApetences(),
// //       ]);

// //       setEtudiants(etuds || []);
// //       setChefs(chefsData || []);
// //       setEvaluations(evals || []);
// //       setSelections(sels || []);
// //       setAffectations(affs || []);
// //       setApetencesList(apList || []);

// //       const formInit = {};
// //       (evals || []).forEach((ev) => {
// //         formInit[`${ev.etudiant_id}-${ev.chef_de_projet_id}`] = {
// //           note: ev.note || '',
// //           commentaire: ev.commentaire || '',
// //         };
// //       });
// //       setLocalFormData(formInit);
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors du chargement des évaluations.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// //   const appetenceRanksMap = useMemo(() => {
// //     const map = new Map();
// //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// //     etudiants.forEach((etud) => {
// //       const etudAp = apetencesByEtud.get(etud.id);
// //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// //       map.set(etud.id, ranks);
// //     });

// //     return map;
// //   }, [apetencesList, etudiants, chefs]);

// //   // Map des affectations : etudiant_id => { chef_id, chef_nom, specialite }
// //   const affectationsMap = useMemo(() => {
// //     const map = new Map();
// //     (affectations || []).forEach((aff) => {
// //       const chef = chefs.find((c) => c.id === aff.chef_de_projet_id);
// //       map.set(aff.etudiant_id, {
// //         chef_id: aff.chef_de_projet_id,
// //         chef_nom: chef?.nom || aff.chefs_de_projet?.nom || 'Inconnu',
// //         specialite: chef?.specialite || aff.chefs_de_projet?.specialite || '',
// //       });
// //     });
// //     return map;
// //   }, [affectations, chefs]);

// //   // Liste filtrée des étudiants
// //   const visibleEtudiants = useMemo(() => {
// //     let list = etudiants;

// //     if (isChef && chefId) {
// //       const studentIdsForChef = new Set(
// //         selections.filter((s) => s.chef_de_projet_id === chefId).map((s) => s.etudiant_id)
// //       );
// //       list = etudiants.filter((e) => studentIdsForChef.has(e.id));
// //     }

// //     if (searchTerm.trim()) {
// //       const q = searchTerm.toLowerCase().trim();
// //       list = list.filter(
// //         (e) =>
// //           (e.nom && e.nom.toLowerCase().includes(q)) ||
// //           (e.prenom && e.prenom.toLowerCase().includes(q)) ||
// //           (e.adresse_email && e.adresse_email.toLowerCase().includes(q))
// //       );
// //     }

// //     if (isAdmin && statusFilter !== 'all') {
// //       list = list.filter((e) => {
// //         const isAssigned = affectationsMap.has(e.id);
// //         return statusFilter === 'assigned' ? isAssigned : !isAssigned;
// //       });
// //     }

// //     // Si chef connecté : trier les étudiants par niveau d'appétence pour ce chef (rang 1er d'abord)
// //     if (isChef && chefId) {
// //       return [...list].sort((a, b) => {
// //         const rankA = appetenceRanksMap.get(a.id)?.get(chefId)?.rank ?? 999;
// //         const rankB = appetenceRanksMap.get(b.id)?.get(chefId)?.rank ?? 999;
// //         return rankA - rankB;
// //       });
// //     }

// //     return list;
// //   }, [etudiants, isChef, chefId, selections, searchTerm, appetenceRanksMap, isAdmin, statusFilter, affectationsMap]);

// //   const getEval = (etudiantId, cId) =>
// //     evaluations.find((e) => e.etudiant_id === etudiantId && e.chef_de_projet_id === cId);

// //   const handleLocalChange = (etudiantId, cId, field, value) => {
// //     const key = `${etudiantId}-${cId}`;
// //     setLocalFormData((prev) => ({
// //       ...prev,
// //       [key]: {
// //         ...prev[key],
// //         [field]: value,
// //       },
// //     }));
// //     setSavedSuccessKey(null);
// //   };

// //   const handleSaveEvaluation = async (etudiantId, cId) => {
// //     const key = `${etudiantId}-${cId}`;
// //     const formVal = localFormData[key] || {};
// //     const note = formVal.note || '';
// //     const commentaire = formVal.commentaire || '';

// //     if (!note && !commentaire) {
// //       setError('Veuillez renseigner au moins une note ou un commentaire.');
// //       return;
// //     }

// //     setSavingKey(key);
// //     setError(null);

// //     try {
// //       await saveEvaluation(cId, etudiantId, note, commentaire);

// //       setEvaluations((prev) => {
// //         const next = prev.filter(
// //           (e) => !(e.etudiant_id === etudiantId && e.chef_de_projet_id === cId)
// //         );
// //         return [
// //           ...next,
// //           { etudiant_id: etudiantId, chef_de_projet_id: cId, note, commentaire },
// //         ];
// //       });

// //       setSavedSuccessKey(key);
// //       setTimeout(() => setSavedSuccessKey(null), 3000);
// //     } catch (err) {
// //       setError(err.message || "Erreur lors de l'enregistrement de l'évaluation.");
// //     } finally {
// //       setSavingKey(null);
// //     }
// //   };

// //   const handleAssign = async (etudiantId, targetChefIdStr) => {
// //     setSavingAffectationId(etudiantId);
// //     setError(null);

// //     try {
// //       if (!targetChefIdStr) {
// //         await deleteAffectation(etudiantId);
// //         setAffectations((prev) => prev.filter((a) => a.etudiant_id !== etudiantId));
// //       } else {
// //         const targetChefId = Number(targetChefIdStr);
// //         await saveAffectation(targetChefId, etudiantId);
// //         setAffectations((prev) => {
// //           const next = prev.filter((a) => a.etudiant_id !== etudiantId);
// //           return [...next, { etudiant_id: etudiantId, chef_de_projet_id: targetChefId }];
// //         });
// //       }

// //       setAffectationSuccessId(etudiantId);
// //       setTimeout(() => setAffectationSuccessId(null), 2500);
// //     } catch (err) {
// //       setError(err.message || "Erreur lors de l'enregistrement de l'affectation.");
// //     } finally {
// //       setSavingAffectationId(null);
// //     }
// //   };

// //   const handleOpenCommentPopup = (etudiant, chef, ev) => {
// //     setSelectedCommentData({
// //       etudiant,
// //       chef,
// //       note: ev?.note || 'Non noté',
// //       commentaire: ev?.commentaire || 'Aucun commentaire rédigé.',
// //     });
// //     setModalCommentOpen(true);
// //   };

// //   const handleOpenRadar = async (etudiant) => {
// //     setSelectedEtudRadar(etudiant);
// //     setModalRadarOpen(true);
// //     setModalLoading(true);
// //     setModalError(null);
// //     setAptitudesData(null);
// //     setApetencesData(null);

// //     try {
// //       const [aptitudes, apetences] = await Promise.all([
// //         fetchAptitudesByEtudiant(etudiant.id),
// //         fetchApetencesByEtudiant(etudiant.id),
// //       ]);

// //       if (!aptitudes && !apetences) {
// //         setModalError('Aucune compétence enregistrée.');
// //       } else {
// //         setAptitudesData(aptitudes);
// //         setApetencesData(apetences);
// //       }
// //     } catch (err) {
// //       setModalError(err.message || 'Erreur lors du chargement des compétences.');
// //     } finally {
// //       setModalLoading(false);
// //     }
// //   };

// //   const radarChartData = useMemo(() => {
// //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// //     return {
// //       labels,
// //       datasets: [
// //         {
// //           label: 'Aptitudes (Technique)',
// //           data: aptValues,
// //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// //           borderColor: '#38bdf8',
// //           borderWidth: 2,
// //           pointBackgroundColor: '#38bdf8',
// //         },
// //         {
// //           label: 'Appétences (Intérêt)',
// //           data: apeValues,
// //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// //           borderColor: '#f43f5e',
// //           borderWidth: 2,
// //           pointBackgroundColor: '#f43f5e',
// //         },
// //       ],
// //     };
// //   }, [aptitudesData, apetencesData]);

// //   const radarOptions = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     scales: {
// //       r: {
// //         min: 0,
// //         suggestedMax: 4,
// //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// //       },
// //     },
// //     plugins: {
// //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 12 } } },
// //     },
// //   };

// //   // Export Excel
// //   const handleExportEvaluationsExcel = () => {
// //     try {
// //       const rows = [];
// //       visibleEtudiants.forEach((etud) => {
// //         const chefsToExport = isChef && chefId ? chefs.filter((c) => c.id === chefId) : chefs;
// //         const studentRanks = appetenceRanksMap.get(etud.id);

// //         chefsToExport.forEach((c) => {
// //           const ev = getEval(etud.id, c.id);
// //           const aff = affectationsMap.get(etud.id);
// //           const rankInfo = studentRanks?.get(c.id);

// //           rows.push({
// //             'Étudiant': `${etud.nom} ${etud.prenom}`,
// //             'Email Étudiant': etud.adresse_email,
// //             'Chef Évaluateur': c.nom,
// //             'Rang Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : 'N/A',
// //             'Note': ev?.note || '',
// //             'Commentaire': ev?.commentaire || '',
// //             'Affectation Finale': aff ? `${aff.chef_nom} (${aff.specialite})` : 'Non affecté',
// //           });
// //         });
// //       });

// //       const ws = XLSX.utils.json_to_sheet(rows);
// //       ws['!cols'] = [{ wch: 25 }, { wch: 32 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 45 }, { wch: 30 }];

// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws, 'Évaluations');
// //       XLSX.writeFile(wb, `evaluations_${new Date().toISOString().slice(0, 10)}.xlsx`);
// //     } catch (err) {
// //       alert(`Erreur export: ${err.message}`);
// //     }
// //   };

// //   const handleExportAffectationsExcel = () => {
// //     try {
// //       const detailedRows = etudiants.map((etud) => {
// //         const aff = affectationsMap.get(etud.id);
// //         const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

// //         return {
// //           'Nom': etud.nom || '',
// //           'Prénom': etud.prenom || '',
// //           'Email': etud.adresse_email || '',
// //           'Parcours': etud.parcours || 'I2026',
// //           'Statut Affectation': aff ? 'Affecté' : 'Non affecté',
// //           'Chef Assigné': aff ? aff.chef_nom : '—',
// //           'Spécialité': aff ? aff.specialite : '—',
// //           'Satisfaction Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : aff ? 'Hors Vœux' : '—',
// //         };
// //       });

// //       const summaryRows = chefs.map((chef) => {
// //         const assignedStudents = etudiants.filter(
// //           (e) => affectationsMap.get(e.id)?.chef_id === chef.id
// //         );
// //         return {
// //           'Chef de Projet': chef.nom,
// //           'Spécialité': chef.specialite || 'N/A',
// //           'Email': chef.email || '',
// //           'Nb Étudiants Affectés': assignedStudents.length,
// //           'Étudiants': assignedStudents.map((s) => `${s.nom} ${s.prenom}`).join(', ') || 'Aucun',
// //         };
// //       });

// //       const ws1 = XLSX.utils.json_to_sheet(detailedRows);
// //       ws1['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 32 }, { wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];

// //       const ws2 = XLSX.utils.json_to_sheet(summaryRows);
// //       ws2['!cols'] = [{ wch: 26 }, { wch: 28 }, { wch: 32 }, { wch: 24 }, { wch: 60 }];

// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws1, 'Affectations Finales');
// //       XLSX.utils.book_append_sheet(wb, ws2, 'Synthèse Chefs');

// //       XLSX.writeFile(wb, `affectations_finales_${new Date().toISOString().slice(0, 10)}.xlsx`);
// //     } catch (err) {
// //       alert(`Erreur export: ${err.message}`);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// //         <Spinner animation="border" variant="info" />
// //         <p className="mt-3 text-muted">Chargement des évaluations...</p>
// //       </div>
// //     );
// //   }

// //   const rowMinHeight = density === 'compact' ? '38px' : '52px';
// //   const firstColWidth = density === 'compact' ? 168 : 200;
// //   const affColWidth = density === 'compact' ? 150 : 180;
// //   const chefColWidth = density === 'compact' ? 76 : 96;

// //   return (
// //     <>
// //       <style>{`
// //         .eval-page-wrapper {
// //           max-width: 100%;
// //           margin: 0 auto;
// //           padding: 1.25rem 1rem 2.5rem 1rem;
// //           color: #f8fafc;
// //         }
// //         .eval-card {
// //           background: rgba(18, 24, 38, 0.85);
// //           backdrop-filter: blur(16px);
// //           border: 1px solid rgba(255, 255, 255, 0.08);
// //           border-radius: 14px;
// //         }
// //         .toolbar-card {
// //           padding: 0.75rem 1rem;
// //         }
// //         .btn-comment-popup {
// //           background: rgba(14, 165, 233, 0.15);
// //           border: 1px solid rgba(14, 165, 233, 0.35);
// //           color: #38bdf8;
// //           border-radius: 6px;
// //           padding: 1px 5px;
// //           font-size: 0.7rem;
// //           line-height: 1.3;
// //           cursor: pointer;
// //         }
// //         .select-affectation {
// //           background-color: #1e293b !important;
// //           color: #f8fafc !important;
// //           border: 1px solid rgba(14, 165, 233, 0.4) !important;
// //           font-size: 0.76rem;
// //           border-radius: 8px;
// //           padding-top: 2px;
// //           padding-bottom: 2px;
// //         }
// //         .select-affectation.is-assigned {
// //           background-color: rgba(16, 185, 129, 0.18) !important;
// //           border-color: #10b981 !important;
// //           color: #6ee7b7 !important;
// //           font-weight: 600;
// //         }

// //         /* --- Tableau matrice : densité maximale, colonnes figées --- */
// //         .eval-matrix-wrapper {
// //           max-height: 76vh;
// //           overflow: auto;
// //         }
// //         .eval-matrix {
// //           font-size: 0.78rem;
// //         }
// //         .eval-matrix td, .eval-matrix th {
// //           padding: 0.28rem 0.4rem;
// //           vertical-align: middle;
// //           min-height: ${rowMinHeight};
// //         }
// //         .eval-matrix thead th {
// //           position: sticky;
// //           top: 0;
// //           background: #0f172a;
// //           z-index: 5;
// //           border-bottom: 2px solid rgba(99,102,241,0.4);
// //         }
// //         .col-student {
// //           position: sticky;
// //           left: 0;
// //           z-index: 6;
// //           background: #111827;
// //           text-align: left !important;
// //           width: ${firstColWidth}px;
// //           min-width: ${firstColWidth}px;
// //           max-width: ${firstColWidth}px;
// //         }
// //         thead .col-student { z-index: 15; }
// //         .col-affectation {
// //           position: sticky;
// //           left: ${firstColWidth}px;
// //           z-index: 6;
// //           background: #0f172a;
// //           border-right: 2px solid rgba(99,102,241,0.4);
// //           width: ${affColWidth}px;
// //           min-width: ${affColWidth}px;
// //           max-width: ${affColWidth}px;
// //         }
// //         thead .col-affectation { z-index: 15; }
// //         .col-chef {
// //           width: ${chefColWidth}px;
// //           min-width: ${chefColWidth}px;
// //           max-width: ${chefColWidth}px;
// //         }
// //         .chef-abbr {
// //           font-weight: 700;
// //           letter-spacing: 0.4px;
// //           cursor: help;
// //           border-bottom: 1px dashed rgba(148,163,184,0.6);
// //         }
// //         .student-name-cell {
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           gap: 0.35rem;
// //         }
// //         .student-name-cell .name-text {
// //           overflow: hidden;
// //           text-overflow: ellipsis;
// //           white-space: nowrap;
// //           font-weight: 600;
// //           font-size: 0.82rem;
// //         }
// //         .doc-icon-btn {
// //           font-size: 0.68rem;
// //           padding: 1px 4px;
// //         }
// //         .density-toggle .btn { font-size: 0.72rem; padding: 0.2rem 0.55rem; }

// //         /* --- Vue Chef : cartes compactes --- */
// //         .chef-eval-row {
// //           padding: 0.6rem 0.9rem;
// //         }
// //       `}</style>

// //       <Navbar />

// //       <div className="eval-page-wrapper">
// //         {/* Header */}
// //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
// //           <div>
// //             <div className="d-flex align-items-center gap-2">
// //               <span style={{ fontSize: '1.6rem' }}>📝</span>
// //               <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px', fontSize: '1.5rem' }}>
// //                 {isChef ? `Mes Évaluations — ${chefInfo?.nom || 'Chef de projet'}` : 'Évaluations & Affectations Finales'}
// //               </h2>
// //             </div>
// //             <p className="text-light opacity-75 small mt-1 mb-0">
// //               {isChef
// //                 ? 'Les étudiants sont triés selon leur niveau d’appétence pour votre thématique (1er choix en haut).'
// //                 : 'Survolez un en-tête de colonne pour voir le nom complet du chef de projet. Cliquez sur une cellule pour noter.'}
// //             </p>
// //           </div>

// //           <div className="d-flex align-items-center gap-2 flex-wrap">
// //             {isAdmin && (
// //               <Button
// //                 variant="primary"
// //                 size="sm"
// //                 onClick={() => setModalAffectationsOpen(true)}
// //                 className="px-3 py-2 fw-semibold"
// //               >
// //                 🎯 Résultats Affectations ({affectations.length} / {etudiants.length})
// //               </Button>
// //             )}

// //             <Button
// //               variant="success"
// //               size="sm"
// //               onClick={handleExportEvaluationsExcel}
// //               className="px-3 py-2 fw-semibold"
// //             >
// //               📊 Exporter Notes
// //             </Button>

// //             {isAdmin && (
// //               <Button
// //                 variant="outline-info"
// //                 size="sm"
// //                 onClick={handleExportAffectationsExcel}
// //                 className="px-3 py-2 fw-semibold"
// //               >
// //                 📥 Exporter Affectations (.xlsx)
// //               </Button>
// //             )}

// //             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
// //               🔄 Actualiser
// //             </Button>
// //           </div>
// //         </div>

// //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

// //         {/* Barre d'outils : recherche, filtres, densité */}
// //         <Card className="eval-card toolbar-card mb-3 shadow-sm">
// //           <Row className="align-items-center g-2">
// //             <Col md={4}>
// //               <InputGroup size="sm">
// //                 <InputGroup.Text className="bg-transparent border-secondary text-muted">🔍</InputGroup.Text>
// //                 <Form.Control
// //                   placeholder="Rechercher nom, prénom ou email..."
// //                   className="bg-dark text-white border-secondary"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //                 {searchTerm && (
// //                   <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>✕</Button>
// //                 )}
// //               </InputGroup>
// //             </Col>

// //             {isAdmin && (
// //               <Col md={4} className="d-flex justify-content-md-center">
// //                 <ButtonGroup size="sm">
// //                   <Button
// //                     variant={statusFilter === 'all' ? 'info' : 'outline-info'}
// //                     onClick={() => setStatusFilter('all')}
// //                   >
// //                     Tous ({etudiants.length})
// //                   </Button>
// //                   <Button
// //                     variant={statusFilter === 'assigned' ? 'success' : 'outline-success'}
// //                     onClick={() => setStatusFilter('assigned')}
// //                   >
// //                     Affectés ({affectations.length})
// //                   </Button>
// //                   <Button
// //                     variant={statusFilter === 'unassigned' ? 'warning' : 'outline-warning'}
// //                     onClick={() => setStatusFilter('unassigned')}
// //                   >
// //                     Non affectés ({etudiants.length - affectations.length})
// //                   </Button>
// //                 </ButtonGroup>
// //               </Col>
// //             )}

// //             <Col md={isAdmin ? 4 : 8} className="d-flex justify-content-end align-items-center gap-2">
// //               {isAdmin && (
// //                 <ButtonGroup size="sm" className="density-toggle">
// //                   <Button
// //                     variant={density === 'compact' ? 'secondary' : 'outline-secondary'}
// //                     onClick={() => setDensity('compact')}
// //                     title="Lignes compactes — voir plus d'étudiants à l'écran"
// //                   >
// //                     ▤ Compact
// //                   </Button>
// //                   <Button
// //                     variant={density === 'comfortable' ? 'secondary' : 'outline-secondary'}
// //                     onClick={() => setDensity('comfortable')}
// //                     title="Lignes aérées"
// //                   >
// //                     ☰ Confort
// //                   </Button>
// //                 </ButtonGroup>
// //               )}
// //               <Badge bg="info" className="px-3 py-2">
// //                 {visibleEtudiants.length} étudiant(s)
// //               </Badge>
// //             </Col>
// //           </Row>
// //         </Card>

// //         {/* ========================================================================= */}
// //         {/* VUE CHEF                                                                  */}
// //         {/* ========================================================================= */}
// //         {isChef ? (
// //           <div className="d-flex flex-column gap-2">
// //             {visibleEtudiants.length === 0 ? (
// //               <Alert variant="secondary" className="text-center py-5">
// //                 Aucun étudiant assigné pour le moment.
// //               </Alert>
// //             ) : (
// //               visibleEtudiants.map((etud) => {
// //                 const key = `${etud.id}-${chefId}`;
// //                 const formVal = localFormData[key] || {};
// //                 const isSaving = savingKey === key;
// //                 const isSaved = savedSuccessKey === key;
// //                 const aff = affectationsMap.get(etud.id);
// //                 const isAssignedToMe = aff?.chef_id === chefId;
// //                 const rankInfo = appetenceRanksMap.get(etud.id)?.get(chefId);
// //                 const rankNum = rankInfo?.rank || 1;

// //                 return (
// //                   <Card key={etud.id} className="eval-card chef-eval-row shadow-sm border-secondary">
// //                     <Row className="g-2 align-items-center">
// //                       <Col lg={4} md={12}>
// //                         <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
// //                           <span className="fw-bold fs-6 text-white">{etud.nom} {etud.prenom}</span>
// //                           <Badge bg="secondary" className="font-monospace">{etud.parcours}</Badge>
// //                           <Badge bg={rankBadgeVariant(rankNum)} text={rankBadgeText(rankNum)}>
// //                             ⭐ {rankNum === 1 ? '1er choix' : `${rankNum}e choix`} ({rankInfo?.score ?? 0}/4)
// //                           </Badge>
// //                           {aff && (
// //                             <Badge bg={isAssignedToMe ? 'success' : 'dark'} className="border border-secondary">
// //                               {isAssignedToMe ? '🎯 Affecté à vous' : `Affecté : ${aff.chef_nom}`}
// //                             </Badge>
// //                           )}
// //                         </div>
// //                         <div className="text-muted small font-monospace mb-2">{etud.adresse_email}</div>

// //                         <div className="d-flex gap-2 align-items-center">
// //                           <Button variant="outline-info" size="sm" className="doc-icon-btn" onClick={() => handleOpenRadar(etud)}>
// //                             📊 Radar
// //                           </Button>
// //                           {etud.cv_path && (
// //                             <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// //                               📄 CV
// //                             </a>
// //                           )}
// //                           {etud.lm_path && (
// //                             <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// //                               ✉️ LM
// //                             </a>
// //                           )}
// //                         </div>
// //                       </Col>

// //                       <Col lg={2} md={4}>
// //                         <Form.Label className="small text-light fw-bold mb-1">Note</Form.Label>
// //                         <Form.Select
// //                           size="sm"
// //                           className="bg-dark text-white border-secondary fw-bold"
// //                           value={formVal.note || ''}
// //                           onChange={(e) => handleLocalChange(etud.id, chefId, 'note', e.target.value)}
// //                         >
// //                           <option value="">— Non noté —</option>
// //                           {NOTES_DISPONIBLES.map((n) => (
// //                             <option key={n} value={n}>Note {n}</option>
// //                           ))}
// //                         </Form.Select>
// //                       </Col>

// //                       <Col lg={4} md={5}>
// //                         <Form.Label className="small text-light fw-bold mb-1">Commentaire</Form.Label>
// //                         <Form.Control
// //                           as="textarea"
// //                           rows={2}
// //                           size="sm"
// //                           className="bg-dark text-white border-secondary"
// //                           placeholder="Points forts, adéquation..."
// //                           value={formVal.commentaire || ''}
// //                           onChange={(e) => handleLocalChange(etud.id, chefId, 'commentaire', e.target.value)}
// //                         />
// //                       </Col>

// //                       <Col lg={2} md={3} className="text-end">
// //                         <Button
// //                           variant={isSaved ? 'outline-success' : 'primary'}
// //                           size="sm"
// //                           className="w-100 py-2 fw-semibold"
// //                           disabled={isSaving}
// //                           onClick={() => handleSaveEvaluation(etud.id, chefId)}
// //                         >
// //                           {isSaving ? <Spinner size="sm" animation="border" /> : isSaved ? 'Enregistré ✅' : '💾 Enregistrer'}
// //                         </Button>
// //                       </Col>
// //                     </Row>
// //                   </Card>
// //                 );
// //               })
// //             )}
// //           </div>
// //         ) : (
// //           /* ========================================================================= */
// //           /* VUE ADMIN : Matrice compacte avec colonnes figées + noms de chefs abrégés */
// //           /* ========================================================================= */
// //           <div className="eval-card overflow-hidden">
// //             <div className="eval-matrix-wrapper">
// //               <Table size="sm" hover className="eval-matrix mb-0 text-white text-center align-middle text-nowrap">
// //                 <thead className="table-dark">
// //                   <tr>
// //                     <th className="col-student" style={{ paddingLeft: '0.75rem' }}>
// //                       Étudiant
// //                     </th>
// //                     <th className="col-affectation">
// //                       🎯 Affectation
// //                     </th>
// //                     {chefs.map((c) => {
// //                       const abbr = abbreviateChefName(c.nom);
// //                       const tooltipLabel = c.specialite ? `${c.nom} — ${c.specialite}` : c.nom;
// //                       return (
// //                         <th key={c.id} className="col-chef">
// //                           {withTooltip(
// //                             `chef-tt-${c.id}`,
// //                             tooltipLabel,
// //                             <span className="chef-abbr">{abbr}</span>
// //                           )}
// //                         </th>
// //                       );
// //                     })}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {visibleEtudiants.map((etud) => {
// //                     const aff = affectationsMap.get(etud.id);
// //                     const isSavingAff = savingAffectationId === etud.id;
// //                     const isAffSuccess = affectationSuccessId === etud.id;
// //                     const studentRanks = appetenceRanksMap.get(etud.id);
// //                     const fullName = `${etud.nom} ${etud.prenom}`;

// //                     return (
// //                       <tr key={etud.id}>
// //                         <td className="col-student" style={{ paddingLeft: '0.75rem' }}>
// //                           <div className="student-name-cell">
// //                             {withTooltip(
// //                               `student-tt-${etud.id}`,
// //                               etud.adresse_email || fullName,
// //                               <span className="name-text">{fullName}</span>
// //                             )}
// //                             <div className="d-flex gap-1 flex-shrink-0">
// //                               <Button variant="outline-info" size="sm" className="doc-icon-btn" onClick={() => handleOpenRadar(etud)} title="Voir le profil de compétences" aria-label="Voir le radar de compétences">
// //                                 📊
// //                               </Button>
// //                               {etud.cv_path && (
// //                                 <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none" title="Ouvrir le CV">
// //                                   📄
// //                                 </a>
// //                               )}
// //                               {etud.lm_path && (
// //                                 <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none" title="Ouvrir la lettre de motivation">
// //                                   ✉️
// //                                 </a>
// //                               )}
// //                             </div>
// //                           </div>
// //                         </td>

// //                         <td className="col-affectation">
// //                           <div className="d-flex align-items-center gap-2 justify-content-center">
// //                             {isSavingAff ? (
// //                               <Spinner size="sm" animation="border" variant="info" />
// //                             ) : (
// //                               <Form.Select
// //                                 size="sm"
// //                                 className={`select-affectation ${aff ? 'is-assigned' : ''}`}
// //                                 value={aff ? aff.chef_id : ''}
// //                                 onChange={(e) => handleAssign(etud.id, e.target.value)}
// //                                 aria-label={`Affecter ${fullName}`}
// //                               >
// //                                 <option value="">— Non affecté —</option>
// //                                 {chefs.map((c) => (
// //                                   <option key={c.id} value={c.id}>
// //                                     {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// //                                   </option>
// //                                 ))}
// //                               </Form.Select>
// //                             )}
// //                             {isAffSuccess && <span className="small text-success fw-bold">✅</span>}
// //                           </div>
// //                         </td>

// //                         {chefs.map((c) => {
// //                           const ev = getEval(etud.id, c.id);
// //                           const rankInfo = studentRanks?.get(c.id);
// //                           const hasComment = Boolean(ev?.commentaire?.trim());
// //                           const isAssignedToThisChef = aff?.chef_id === c.id;

// //                           return (
// //                             <td
// //                               key={c.id}
// //                               className="col-chef"
// //                               style={{ backgroundColor: isAssignedToThisChef ? 'rgba(16, 185, 129, 0.15)' : 'inherit' }}
// //                             >
// //                               <div className="d-flex align-items-center justify-content-center gap-1">
// //                                 {rankInfo ? (
// //                                   <Badge
// //                                     bg={rankBadgeVariant(rankInfo.rank)}
// //                                     text={rankBadgeText(rankInfo.rank)}
// //                                     style={{ fontSize: '0.68rem' }}
// //                                     title={`Appétence: ${rankInfo.score}/4`}
// //                                   >
// //                                     {rankInfo.rank === 1 ? '1er' : `${rankInfo.rank}e`}
// //                                   </Badge>
// //                                 ) : (
// //                                   <span className="text-muted small" style={{ opacity: 0.4 }}>—</span>
// //                                 )}

// //                                 <Badge
// //                                   bg={noteBadgeVariant(ev?.note)}
// //                                   className="px-2 py-1 font-monospace"
// //                                   style={{ fontSize: '0.72rem' }}
// //                                 >
// //                                   {ev?.note || '—'}
// //                                 </Badge>

// //                                 {hasComment && (
// //                                   <button
// //                                     className="btn-comment-popup"
// //                                     onClick={() => handleOpenCommentPopup(etud, c, ev)}
// //                                     aria-label={`Voir le commentaire de ${c.nom} pour ${fullName}`}
// //                                   >
// //                                     💬
// //                                   </button>
// //                                 )}
// //                               </div>
// //                             </td>
// //                           );
// //                         })}
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </Table>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Modal Résultats d'affectations avec rang d'appétence */}
// //       <Modal show={modalAffectationsOpen} onHide={() => setModalAffectationsOpen(false)} size="xl" centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title className="text-white">🎯 Synthèse Officielle des Affectations ({affectations.length} / {etudiants.length})</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
// //           <Row className="g-3 mb-4">
// //             <Col md={4}>
// //               <Card className="bg-black bg-opacity-40 border-secondary text-center p-3">
// //                 <span className="text-muted small fw-bold">Total Étudiants</span>
// //                 <h3 className="text-white fw-bold mb-0 mt-1">{etudiants.length}</h3>
// //               </Card>
// //             </Col>
// //             <Col md={4}>
// //               <Card className="bg-black bg-opacity-40 border-success text-center p-3">
// //                 <span className="text-success small fw-bold">Affectés</span>
// //                 <h3 className="text-success fw-bold mb-0 mt-1">{affectations.length}</h3>
// //               </Card>
// //             </Col>
// //             <Col md={4}>
// //               <Card className="bg-black bg-opacity-40 border-warning text-center p-3">
// //                 <span className="text-warning small fw-bold">Non affectés</span>
// //                 <h3 className="text-warning fw-bold mb-0 mt-1">{etudiants.length - affectations.length}</h3>
// //               </Card>
// //             </Col>
// //           </Row>

// //           <h5 className="text-white mb-3">📋 Liste détaillée par étudiant & Satisfaction Appétence</h5>
// //           <div className="table-responsive rounded border border-secondary">
// //             <Table size="sm" hover variant="dark" className="mb-0 align-middle">
// //               <thead>
// //                 <tr>
// //                   <th>Étudiant</th>
// //                   <th>Email</th>
// //                   <th>Statut</th>
// //                   <th>Chef Assigné</th>
// //                   <th>Satisfaction Appétence</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {etudiants.map((etud) => {
// //                   const aff = affectationsMap.get(etud.id);
// //                   const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

// //                   return (
// //                     <tr key={etud.id}>
// //                       <td className="fw-semibold text-white">{etud.nom} {etud.prenom}</td>
// //                       <td className="text-muted font-monospace">{etud.adresse_email}</td>
// //                       <td>
// //                         <Badge bg={aff ? 'success' : 'warning'} text={aff ? 'light' : 'dark'}>
// //                           {aff ? 'Affecté' : 'Non affecté'}
// //                         </Badge>
// //                       </td>
// //                       <td>{aff ? <strong className="text-info">{aff.chef_nom}</strong> : '—'}</td>
// //                       <td>
// //                         {rankInfo ? (
// //                           <Badge bg={rankBadgeVariant(rankInfo.rank)} text={rankBadgeText(rankInfo.rank)}>
// //                             {rankInfo.rank === 1 ? '1er choix' : `${rankInfo.rank}e choix`} ({rankInfo.score}/4)
// //                           </Badge>
// //                         ) : aff ? (
// //                           <Badge bg="secondary">Hors Vœux</Badge>
// //                         ) : (
// //                           '—'
// //                         )}
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </Table>
// //           </div>
// //         </Modal.Body>
// //         <Modal.Footer className="d-flex justify-content-between">
// //           <Button variant="success" onClick={handleExportAffectationsExcel}>
// //             📥 Télécharger le fichier Excel (.xlsx)
// //           </Button>
// //           <Button variant="secondary" onClick={() => setModalAffectationsOpen(false)}>
// //             Fermer
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>

// //       {/* Modal Commentaire */}
// //       <Modal show={modalCommentOpen} onHide={() => setModalCommentOpen(false)} centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title>💬 Détail de l'évaluation</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body className="p-4">
// //           <div className="mb-3">
// //             <h5 className="text-white mb-0">{selectedCommentData?.etudiant?.nom} {selectedCommentData?.etudiant?.prenom}</h5>
// //             <small className="text-muted font-monospace">{selectedCommentData?.etudiant?.adresse_email}</small>
// //           </div>
// //           <div className="mb-3 d-flex justify-content-between p-2 rounded bg-black bg-opacity-25 border border-secondary">
// //             <div>Évaluateur : <strong className="text-info">{selectedCommentData?.chef?.nom}</strong></div>
// //             <div>Note : <Badge bg="primary">{selectedCommentData?.note}</Badge></div>
// //           </div>
// //           <div className="p-3 rounded bg-dark border border-secondary text-white">
// //             {selectedCommentData?.commentaire}
// //           </div>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setModalCommentOpen(false)}>Fermer</Button>
// //         </Modal.Footer>
// //       </Modal>

// //       {/* Modal Radar */}
// //       <Modal show={modalRadarOpen} onHide={() => setModalRadarOpen(false)} size="lg" centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title>📊 Profil Compétences : {selectedEtudRadar?.nom} {selectedEtudRadar?.prenom}</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// //           {modalLoading ? (
// //             <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
// //           ) : modalError ? (
// //             <Alert variant="warning">{modalError}</Alert>
// //           ) : (
// //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// //               <Radar data={radarChartData} options={radarOptions} />
// //             </div>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setModalRadarOpen(false)}>Fermer</Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </>
// //   );
// // }


// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   Table,
//   Form,
//   Button,
//   Alert,
//   Spinner,
//   Badge,
//   Card,
//   Row,
//   Col,
//   InputGroup,
//   Modal,
//   ButtonGroup,
//   OverlayTrigger,
//   Tooltip as BsTooltip,
// } from 'react-bootstrap';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Radar } from 'react-chartjs-2';
// import * as XLSX from 'xlsx';
// import Navbar from './Navbar';
// import { useAuth } from '../context/AuthContext';
// import {
//   fetchEtudiants,
//   fetchChefsDeProjet,
//   fetchEvaluations,
//   saveEvaluation,
//   fetchSelections,
//   fetchAffectations,
//   saveAffectation,
//   deleteAffectation,
//   fetchAllApetences,
//   fetchAptitudesByEtudiant,
//   fetchApetencesByEtudiant,
//   computeChefRanksForStudent,
//   getDocumentPublicUrl,
// } from '../services/supabase';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// const NOTES_DISPONIBLES = ['A', 'B', 'C', 'D'];

// const COMPETENCE_KEYS = [
//   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
//   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
//   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
//   { key: 'conception_mecanique', label: 'Conception Méca' },
//   { key: 'automatique_automatisme', label: 'Automatique' },
//   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
//   { key: 'robot_cobot', label: 'Robot & Cobot' },
//   { key: 'vision', label: 'Vision Industrielle' },
//   { key: 'ia', label: 'Intelligence Artificielle' },
//   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
//   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// ];

// // Longueur de l'abréviation utilisée dans les en-têtes de colonnes chef (compromis
// // lisibilité / densité horizontale demandé : 3-4 caractères + tooltip nom complet).
// const CHEF_ABBR_LEN = 4;
// const abbreviateChefName = (nom = '') => {
//   const clean = nom.trim();
//   if (!clean) return '—';
//   return clean.slice(0, CHEF_ABBR_LEN).toUpperCase();
// };

// const rankBadgeVariant = (rank) => (rank === 1 ? 'success' : rank === 2 ? 'info' : 'warning');
// const rankBadgeText = (rank) => (rank === 1 ? 'light' : 'dark');
// const noteBadgeVariant = (note) =>
//   note === 'A' ? 'success' : note === 'B' ? 'primary' : note === 'C' ? 'warning' : note === 'D' ? 'danger' : 'dark';

// function withTooltip(id, label, children) {
//   return (
//     <OverlayTrigger placement="top" overlay={<BsTooltip id={id}>{label}</BsTooltip>}>
//       {children}
//     </OverlayTrigger>
//   );
// }

// export default function EvaluationsTable() {
//   const { isAdmin, isChef, chefId, chefInfo } = useAuth();

//   const [etudiants, setEtudiants] = useState([]);
//   const [chefs, setChefs] = useState([]);
//   const [evaluations, setEvaluations] = useState([]);
//   const [selections, setSelections] = useState([]);
//   const [affectations, setAffectations] = useState([]);
//   const [apetencesList, setApetencesList] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [savingKey, setSavingKey] = useState(null);
//   const [savedSuccessKey, setSavedSuccessKey] = useState(null);

//   const [savingAffectationId, setSavingAffectationId] = useState(null);
//   const [affectationSuccessId, setAffectationSuccessId] = useState(null);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [localFormData, setLocalFormData] = useState({});

//   // Filtres rapides (UX : permet de zoomer sur les étudiants qui nécessitent une action)
//   const [statusFilter, setStatusFilter] = useState('all'); // all | assigned | unassigned

//   // Densité du tableau admin : compacte (par défaut, max d'infos visibles) ou confortable
//   const [density, setDensity] = useState('compact'); // compact | comfortable

//   // Modals
//   const [modalRadarOpen, setModalRadarOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedEtudRadar, setSelectedEtudRadar] = useState(null);
//   const [aptitudesData, setAptitudesData] = useState(null);
//   const [apetencesData, setApetencesData] = useState(null);
//   const [modalError, setModalError] = useState(null);

//   const [modalCommentOpen, setModalCommentOpen] = useState(false);
//   const [selectedCommentData, setSelectedCommentData] = useState(null);

//   const [modalAffectationsOpen, setModalAffectationsOpen] = useState(false);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [etuds, chefsData, evals, sels, affs, apList] = await Promise.all([
//         fetchEtudiants(),
//         fetchChefsDeProjet(),
//         fetchEvaluations(),
//         fetchSelections(),
//         fetchAffectations(),
//         fetchAllApetences(),
//       ]);

//       setEtudiants(etuds || []);
//       setChefs(chefsData || []);
//       setEvaluations(evals || []);
//       setSelections(sels || []);
//       setAffectations(affs || []);
//       setApetencesList(apList || []);

//       const formInit = {};
//       (evals || []).forEach((ev) => {
//         formInit[`${ev.etudiant_id}-${ev.chef_de_projet_id}`] = {
//           note: ev.note || '',
//           commentaire: ev.commentaire || '',
//         };
//       });
//       setLocalFormData(formInit);
//     } catch (err) {
//       setError(err.message || 'Erreur lors du chargement des évaluations.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
//   const appetenceRanksMap = useMemo(() => {
//     const map = new Map();
//     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

//     etudiants.forEach((etud) => {
//       const etudAp = apetencesByEtud.get(etud.id);
//       const ranks = computeChefRanksForStudent(etudAp, chefs);
//       map.set(etud.id, ranks);
//     });

//     return map;
//   }, [apetencesList, etudiants, chefs]);

//   // Map des affectations : etudiant_id => { chef_id, chef_nom, specialite }
//   const affectationsMap = useMemo(() => {
//     const map = new Map();
//     (affectations || []).forEach((aff) => {
//       const chef = chefs.find((c) => c.id === aff.chef_de_projet_id);
//       map.set(aff.etudiant_id, {
//         chef_id: aff.chef_de_projet_id,
//         chef_nom: chef?.nom || aff.chefs_de_projet?.nom || 'Inconnu',
//         specialite: chef?.specialite || aff.chefs_de_projet?.specialite || '',
//       });
//     });
//     return map;
//   }, [affectations, chefs]);

//   // Liste filtrée des étudiants
//   const visibleEtudiants = useMemo(() => {
//     let list = etudiants;

//     if (isChef && chefId) {
//       const studentIdsForChef = new Set(
//         selections.filter((s) => s.chef_de_projet_id === chefId).map((s) => s.etudiant_id)
//       );
//       list = etudiants.filter((e) => studentIdsForChef.has(e.id));
//     }

//     if (searchTerm.trim()) {
//       const q = searchTerm.toLowerCase().trim();
//       list = list.filter(
//         (e) =>
//           (e.nom && e.nom.toLowerCase().includes(q)) ||
//           (e.prenom && e.prenom.toLowerCase().includes(q)) ||
//           (e.adresse_email && e.adresse_email.toLowerCase().includes(q))
//       );
//     }

//     if (isAdmin && statusFilter !== 'all') {
//       list = list.filter((e) => {
//         const isAssigned = affectationsMap.has(e.id);
//         return statusFilter === 'assigned' ? isAssigned : !isAssigned;
//       });
//     }

//     // Si chef connecté : trier les étudiants par niveau d'appétence pour ce chef (rang 1er d'abord)
//     if (isChef && chefId) {
//       return [...list].sort((a, b) => {
//         const rankA = appetenceRanksMap.get(a.id)?.get(chefId)?.rank ?? 999;
//         const rankB = appetenceRanksMap.get(b.id)?.get(chefId)?.rank ?? 999;
//         return rankA - rankB;
//       });
//     }

//     return list;
//   }, [etudiants, isChef, chefId, selections, searchTerm, appetenceRanksMap, isAdmin, statusFilter, affectationsMap]);

//   const getEval = (etudiantId, cId) =>
//     evaluations.find((e) => e.etudiant_id === etudiantId && e.chef_de_projet_id === cId);

//   const handleLocalChange = (etudiantId, cId, field, value) => {
//     const key = `${etudiantId}-${cId}`;
//     setLocalFormData((prev) => ({
//       ...prev,
//       [key]: {
//         ...prev[key],
//         [field]: value,
//       },
//     }));
//     setSavedSuccessKey(null);
//   };

//   const handleSaveEvaluation = async (etudiantId, cId) => {
//     const key = `${etudiantId}-${cId}`;
//     const formVal = localFormData[key] || {};
//     const note = formVal.note || '';
//     const commentaire = formVal.commentaire || '';

//     if (!note && !commentaire) {
//       setError('Veuillez renseigner au moins une note ou un commentaire.');
//       return;
//     }

//     setSavingKey(key);
//     setError(null);

//     try {
//       await saveEvaluation(cId, etudiantId, note, commentaire);

//       setEvaluations((prev) => {
//         const next = prev.filter(
//           (e) => !(e.etudiant_id === etudiantId && e.chef_de_projet_id === cId)
//         );
//         return [
//           ...next,
//           { etudiant_id: etudiantId, chef_de_projet_id: cId, note, commentaire },
//         ];
//       });

//       setSavedSuccessKey(key);
//       setTimeout(() => setSavedSuccessKey(null), 3000);
//     } catch (err) {
//       setError(err.message || "Erreur lors de l'enregistrement de l'évaluation.");
//     } finally {
//       setSavingKey(null);
//     }
//   };

//   const handleAssign = async (etudiantId, targetChefIdStr) => {
//     setSavingAffectationId(etudiantId);
//     setError(null);

//     try {
//       if (!targetChefIdStr) {
//         await deleteAffectation(etudiantId);
//         setAffectations((prev) => prev.filter((a) => a.etudiant_id !== etudiantId));
//       } else {
//         const targetChefId = Number(targetChefIdStr);
//         await saveAffectation(targetChefId, etudiantId);
//         setAffectations((prev) => {
//           const next = prev.filter((a) => a.etudiant_id !== etudiantId);
//           return [...next, { etudiant_id: etudiantId, chef_de_projet_id: targetChefId }];
//         });
//       }

//       setAffectationSuccessId(etudiantId);
//       setTimeout(() => setAffectationSuccessId(null), 2500);
//     } catch (err) {
//       setError(err.message || "Erreur lors de l'enregistrement de l'affectation.");
//     } finally {
//       setSavingAffectationId(null);
//     }
//   };

//   const handleOpenCommentPopup = (etudiant, chef, ev) => {
//     setSelectedCommentData({
//       etudiant,
//       chef,
//       note: ev?.note || 'Non noté',
//       commentaire: ev?.commentaire || 'Aucun commentaire rédigé.',
//     });
//     setModalCommentOpen(true);
//   };

//   const handleOpenRadar = async (etudiant) => {
//     setSelectedEtudRadar(etudiant);
//     setModalRadarOpen(true);
//     setModalLoading(true);
//     setModalError(null);
//     setAptitudesData(null);
//     setApetencesData(null);

//     try {
//       const [aptitudes, apetences] = await Promise.all([
//         fetchAptitudesByEtudiant(etudiant.id),
//         fetchApetencesByEtudiant(etudiant.id),
//       ]);

//       if (!aptitudes && !apetences) {
//         setModalError('Aucune compétence enregistrée.');
//       } else {
//         setAptitudesData(aptitudes);
//         setApetencesData(apetences);
//       }
//     } catch (err) {
//       setModalError(err.message || 'Erreur lors du chargement des compétences.');
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const radarChartData = useMemo(() => {
//     const labels = COMPETENCE_KEYS.map((c) => c.label);
//     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
//     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Aptitudes (Technique)',
//           data: aptValues,
//           backgroundColor: 'rgba(41, 211, 211, 0.22)',
//           borderColor: '#29d3d3',
//           borderWidth: 2.5,
//           pointBackgroundColor: '#29d3d3',
//           pointBorderColor: '#0a0e1a',
//           pointBorderWidth: 1.5,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//         },
//         {
//           label: 'Appétences (Intérêt)',
//           data: apeValues,
//           backgroundColor: 'rgba(251, 111, 146, 0.20)',
//           borderColor: '#fb6f92',
//           borderWidth: 2.5,
//           pointBackgroundColor: '#fb6f92',
//           pointBorderColor: '#0a0e1a',
//           pointBorderWidth: 1.5,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//         },
//       ],
//     };
//   }, [aptitudesData, apetencesData]);

//   // Moyennes pour les indicateurs de synthèse au-dessus du radar (purement dérivé, aucune nouvelle donnée)
//   const radarAverages = useMemo(() => {
//     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
//     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
//     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
//     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
//   }, [aptitudesData, apetencesData]);

//   const radarOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     interaction: { mode: 'point' },
//     scales: {
//       r: {
//         min: 0,
//         suggestedMax: 4,
//         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
//         grid: { color: 'rgba(148, 163, 184, 0.14)' },
//         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
//         pointLabels: { color: '#e7ebf5', font: { size: 11, weight: '600' } },
//       },
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: '#151b2e',
//         borderColor: 'rgba(148, 163, 184, 0.25)',
//         borderWidth: 1,
//         titleColor: '#f4f6fb',
//         bodyColor: '#c7cede',
//         padding: 10,
//         cornerRadius: 8,
//         displayColors: true,
//       },
//     },
//   };

//   // Export Excel
//   const handleExportEvaluationsExcel = () => {
//     try {
//       const rows = [];
//       visibleEtudiants.forEach((etud) => {
//         const chefsToExport = isChef && chefId ? chefs.filter((c) => c.id === chefId) : chefs;
//         const studentRanks = appetenceRanksMap.get(etud.id);

//         chefsToExport.forEach((c) => {
//           const ev = getEval(etud.id, c.id);
//           const aff = affectationsMap.get(etud.id);
//           const rankInfo = studentRanks?.get(c.id);

//           rows.push({
//             'Étudiant': `${etud.nom} ${etud.prenom}`,
//             'Email Étudiant': etud.adresse_email,
//             'Chef Évaluateur': c.nom,
//             'Rang Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : 'N/A',
//             'Note': ev?.note || '',
//             'Commentaire': ev?.commentaire || '',
//             'Affectation Finale': aff ? `${aff.chef_nom} (${aff.specialite})` : 'Non affecté',
//           });
//         });
//       });

//       const ws = XLSX.utils.json_to_sheet(rows);
//       ws['!cols'] = [{ wch: 25 }, { wch: 32 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 45 }, { wch: 30 }];

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Évaluations');
//       XLSX.writeFile(wb, `evaluations_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     } catch (err) {
//       alert(`Erreur export: ${err.message}`);
//     }
//   };

//   const handleExportAffectationsExcel = () => {
//     try {
//       const detailedRows = etudiants.map((etud) => {
//         const aff = affectationsMap.get(etud.id);
//         const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

//         return {
//           'Nom': etud.nom || '',
//           'Prénom': etud.prenom || '',
//           'Email': etud.adresse_email || '',
//           'Parcours': etud.parcours || 'I2026',
//           'Statut Affectation': aff ? 'Affecté' : 'Non affecté',
//           'Chef Assigné': aff ? aff.chef_nom : '—',
//           'Spécialité': aff ? aff.specialite : '—',
//           'Satisfaction Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : aff ? 'Hors Vœux' : '—',
//         };
//       });

//       const summaryRows = chefs.map((chef) => {
//         const assignedStudents = etudiants.filter(
//           (e) => affectationsMap.get(e.id)?.chef_id === chef.id
//         );
//         return {
//           'Chef de Projet': chef.nom,
//           'Spécialité': chef.specialite || 'N/A',
//           'Email': chef.email || '',
//           'Nb Étudiants Affectés': assignedStudents.length,
//           'Étudiants': assignedStudents.map((s) => `${s.nom} ${s.prenom}`).join(', ') || 'Aucun',
//         };
//       });

//       const ws1 = XLSX.utils.json_to_sheet(detailedRows);
//       ws1['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 32 }, { wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];

//       const ws2 = XLSX.utils.json_to_sheet(summaryRows);
//       ws2['!cols'] = [{ wch: 26 }, { wch: 28 }, { wch: 32 }, { wch: 24 }, { wch: 60 }];

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws1, 'Affectations Finales');
//       XLSX.utils.book_append_sheet(wb, ws2, 'Synthèse Chefs');

//       XLSX.writeFile(wb, `affectations_finales_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     } catch (err) {
//       alert(`Erreur export: ${err.message}`);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
//         <Spinner animation="border" variant="info" />
//         <p className="mt-3 text-muted">Chargement des évaluations...</p>
//       </div>
//     );
//   }

//   const rowMinHeight = density === 'compact' ? '38px' : '52px';
//   const firstColWidth = density === 'compact' ? 168 : 200;
//   const affColWidth = density === 'compact' ? 150 : 180;
//   const chefColWidth = density === 'compact' ? 76 : 96;

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
//           --accent-rose: #fb6f92;
//           --accent-rose-soft: rgba(251, 111, 146, 0.16);
//           --accent-amber: #f5b942;
//           --accent-amber-soft: rgba(245, 185, 66, 0.16);
//           --accent-emerald: #35d0a0;
//           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
//           --accent-coral: #ff6b6b;
//           --accent-coral-soft: rgba(255, 107, 107, 0.16);
//         }

//         .eval-page-wrapper {
//           max-width: 100%;
//           margin: 0 auto;
//           padding: 1.25rem 1rem 2.5rem 1rem;
//           color: var(--text-primary);
//           background:
//             radial-gradient(1200px 500px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
//             radial-gradient(900px 500px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
//             var(--canvas);
//         }
//         .eval-card {
//           background: var(--panel);
//           backdrop-filter: blur(16px);
//           border: 1px solid var(--border-subtle);
//           border-radius: 14px;
//         }
//         .toolbar-card {
//           padding: 0.75rem 1rem;
//         }
//         .btn-comment-popup {
//           background: var(--accent-cyan-soft);
//           border: 1px solid rgba(41, 211, 211, 0.4);
//           color: var(--accent-cyan);
//           border-radius: 6px;
//           padding: 1px 5px;
//           font-size: 0.7rem;
//           line-height: 1.3;
//           cursor: pointer;
//         }
//         .select-affectation {
//           background-color: var(--panel-raised) !important;
//           color: var(--text-primary) !important;
//           border: 1px solid var(--border-strong) !important;
//           font-size: 0.76rem;
//           border-radius: 8px;
//           padding-top: 2px;
//           padding-bottom: 2px;
//         }
//         .select-affectation.is-assigned {
//           background-color: var(--accent-emerald-soft) !important;
//           border-color: var(--accent-emerald) !important;
//           color: var(--accent-emerald) !important;
//           font-weight: 600;
//         }

//         /* --- Palette moderne : recolore les variantes Bootstrap par défaut --- */
//         .eval-page-wrapper .badge.bg-success, .eval-page-wrapper .btn-success {
//           background-color: var(--accent-emerald) !important; border-color: var(--accent-emerald) !important; color: #06231a !important;
//         }
//         .eval-page-wrapper .badge.bg-info, .eval-page-wrapper .btn-info, .eval-page-wrapper .btn-outline-info {
//           --bs-btn-color: var(--accent-cyan); --bs-btn-border-color: var(--accent-cyan); --bs-btn-hover-bg: var(--accent-cyan);
//         }
//         .eval-page-wrapper .badge.bg-info { background-color: var(--accent-cyan) !important; color: #06231a !important; }
//         .eval-page-wrapper .badge.bg-warning { background-color: var(--accent-amber) !important; color: #241a03 !important; }
//         .eval-page-wrapper .badge.bg-danger { background-color: var(--accent-coral) !important; }
//         .eval-page-wrapper .badge.bg-primary, .eval-page-wrapper .btn-primary {
//           background-color: var(--accent-violet) !important; border-color: var(--accent-violet) !important;
//         }
//         .eval-page-wrapper .badge.bg-dark { background-color: var(--panel-raised) !important; border: 1px solid var(--border-subtle); }
//         .eval-page-wrapper .btn-success { color: #06231a !important; }
//         .eval-page-wrapper .btn-outline-info:hover { color: #06231a !important; }

//         /* --- Tableau matrice : densité maximale, colonnes figées --- */
//         .eval-matrix-wrapper {
//           max-height: 76vh;
//           overflow: auto;
//         }
//         .eval-matrix {
//           font-size: 0.78rem;
//         }
//         .eval-matrix td, .eval-matrix th {
//           padding: 0.28rem 0.4rem;
//           vertical-align: middle;
//           min-height: ${rowMinHeight};
//         }
//         .eval-matrix thead th {
//           position: sticky;
//           top: 0;
//           background: var(--panel-solid);
//           z-index: 5;
//           border-bottom: 2px solid var(--accent-violet-soft);
//         }
//         .col-student {
//           position: sticky;
//           left: 0;
//           z-index: 6;
//           background: var(--panel-solid);
//           text-align: left !important;
//           width: ${firstColWidth}px;
//           min-width: ${firstColWidth}px;
//           max-width: ${firstColWidth}px;
//         }
//         thead .col-student { z-index: 15; }
//         .col-affectation {
//           position: sticky;
//           left: ${firstColWidth}px;
//           z-index: 6;
//           background: var(--panel-solid);
//           border-right: 2px solid rgba(124, 108, 246, 0.35);
//           width: ${affColWidth}px;
//           min-width: ${affColWidth}px;
//           max-width: ${affColWidth}px;
//         }
//         thead .col-affectation { z-index: 15; }
//         .col-chef {
//           width: ${chefColWidth}px;
//           min-width: ${chefColWidth}px;
//           max-width: ${chefColWidth}px;
//         }
//         .chef-abbr {
//           font-weight: 700;
//           letter-spacing: 0.4px;
//           cursor: help;
//           border-bottom: 1px dashed rgba(148,163,184,0.6);
//         }
//         .student-name-cell {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 0.35rem;
//         }
//         .student-name-cell .name-text {
//           overflow: hidden;
//           text-overflow: ellipsis;
//           white-space: nowrap;
//           font-weight: 600;
//           font-size: 0.82rem;
//         }
//         .doc-icon-btn {
//           font-size: 0.68rem;
//           padding: 1px 4px;
//         }
//         .density-toggle .btn { font-size: 0.72rem; padding: 0.2rem 0.55rem; }

//         /* --- Vue Chef : cartes compactes --- */
//         .chef-eval-row {
//           padding: 0.6rem 0.9rem;
//         }

//         /* --- Modal Radar : refonte visuelle --- */
//         .radar-modal .modal-dialog { }
//         .radar-modal-content {
//           background: var(--panel-solid) !important;
//           border: 1px solid var(--border-strong) !important;
//           border-radius: 18px !important;
//           overflow: hidden;
//           box-shadow: 0 24px 60px rgba(0,0,0,0.55);
//         }
//         .radar-modal-header {
//           position: relative;
//           padding: 1.5rem 1.75rem 1.25rem 1.75rem;
//           background:
//             radial-gradient(600px 220px at 15% 0%, rgba(124,108,246,0.35), transparent 60%),
//             radial-gradient(600px 220px at 100% 0%, rgba(41,211,211,0.25), transparent 60%),
//             var(--panel-raised);
//           border-bottom: 1px solid var(--border-subtle);
//         }
//         .radar-modal-close {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           width: 30px;
//           height: 30px;
//           border-radius: 50%;
//           border: 1px solid var(--border-strong);
//           background: rgba(255,255,255,0.04);
//           color: var(--text-primary);
//           font-size: 0.85rem;
//           line-height: 1;
//           cursor: pointer;
//         }
//         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
//         .radar-modal-eyebrow {
//           text-transform: uppercase;
//           letter-spacing: 1.2px;
//           font-size: 0.7rem;
//           font-weight: 700;
//           color: var(--accent-cyan);
//           margin-bottom: 0.25rem;
//         }
//         .radar-modal-title {
//           color: var(--text-primary);
//           font-weight: 700;
//           margin: 0 0 1rem 0;
//           font-size: 1.35rem;
//         }
//         .radar-modal-stats {
//           display: flex;
//           gap: 0.75rem;
//           flex-wrap: wrap;
//         }
//         .radar-stat {
//           display: flex;
//           align-items: center;
//           gap: 0.45rem;
//           padding: 0.4rem 0.75rem;
//           border-radius: 10px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid var(--border-subtle);
//         }
//         .radar-stat-dot {
//           width: 8px; height: 8px; border-radius: 50%;
//         }
//         .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
//         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
//         .radar-stat-label { color: var(--text-muted); font-size: 0.78rem; }
//         .radar-stat-value { color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
//         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
//         .radar-modal-body {
//           padding: 1.5rem 1.75rem;
//           min-height: 400px;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//         }
//         .radar-modal-footer {
//           padding: 1rem 1.75rem;
//           border-top: 1px solid var(--border-subtle);
//           display: flex;
//           justify-content: flex-end;
//         }
//       `}</style>

//       <Navbar />

//       <div className="eval-page-wrapper">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
//           <div>
//             <div className="d-flex align-items-center gap-2">
//               <span style={{ fontSize: '1.6rem' }}>📝</span>
//               <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px', fontSize: '1.5rem' }}>
//                 {isChef ? `Mes Évaluations — ${chefInfo?.nom || 'Chef de projet'}` : 'Évaluations & Affectations Finales'}
//               </h2>
//             </div>
//             <p className="text-light opacity-75 small mt-1 mb-0">
//               {isChef
//                 ? 'Les étudiants sont triés selon leur niveau d’appétence pour votre thématique (1er choix en haut).'
//                 : 'Survolez un en-tête de colonne pour voir le nom complet du chef de projet. Cliquez sur une cellule pour noter.'}
//             </p>
//           </div>

//           <div className="d-flex align-items-center gap-2 flex-wrap">
//             {isAdmin && (
//               <Button
//                 variant="primary"
//                 size="sm"
//                 onClick={() => setModalAffectationsOpen(true)}
//                 className="px-3 py-2 fw-semibold"
//               >
//                 🎯 Résultats Affectations ({affectations.length} / {etudiants.length})
//               </Button>
//             )}

//             <Button
//               variant="success"
//               size="sm"
//               onClick={handleExportEvaluationsExcel}
//               className="px-3 py-2 fw-semibold"
//             >
//               📊 Exporter Notes
//             </Button>

//             {isAdmin && (
//               <Button
//                 variant="outline-info"
//                 size="sm"
//                 onClick={handleExportAffectationsExcel}
//                 className="px-3 py-2 fw-semibold"
//               >
//                 📥 Exporter Affectations (.xlsx)
//               </Button>
//             )}

//             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
//               🔄 Actualiser
//             </Button>
//           </div>
//         </div>

//         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

//         {/* Barre d'outils : recherche, filtres, densité */}
//         <Card className="eval-card toolbar-card mb-3 shadow-sm">
//           <Row className="align-items-center g-2">
//             <Col md={4}>
//               <InputGroup size="sm">
//                 <InputGroup.Text className="bg-transparent border-secondary text-muted">🔍</InputGroup.Text>
//                 <Form.Control
//                   placeholder="Rechercher nom, prénom ou email..."
//                   className="bg-dark text-white border-secondary"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 {searchTerm && (
//                   <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>✕</Button>
//                 )}
//               </InputGroup>
//             </Col>

//             {isAdmin && (
//               <Col md={4} className="d-flex justify-content-md-center">
//                 <ButtonGroup size="sm">
//                   <Button
//                     variant={statusFilter === 'all' ? 'info' : 'outline-info'}
//                     onClick={() => setStatusFilter('all')}
//                   >
//                     Tous ({etudiants.length})
//                   </Button>
//                   <Button
//                     variant={statusFilter === 'assigned' ? 'success' : 'outline-success'}
//                     onClick={() => setStatusFilter('assigned')}
//                   >
//                     Affectés ({affectations.length})
//                   </Button>
//                   <Button
//                     variant={statusFilter === 'unassigned' ? 'warning' : 'outline-warning'}
//                     onClick={() => setStatusFilter('unassigned')}
//                   >
//                     Non affectés ({etudiants.length - affectations.length})
//                   </Button>
//                 </ButtonGroup>
//               </Col>
//             )}

//             <Col md={isAdmin ? 4 : 8} className="d-flex justify-content-end align-items-center gap-2">
//               {isAdmin && (
//                 <ButtonGroup size="sm" className="density-toggle">
//                   <Button
//                     variant={density === 'compact' ? 'secondary' : 'outline-secondary'}
//                     onClick={() => setDensity('compact')}
//                     title="Lignes compactes — voir plus d'étudiants à l'écran"
//                   >
//                     ▤ Compact
//                   </Button>
//                   <Button
//                     variant={density === 'comfortable' ? 'secondary' : 'outline-secondary'}
//                     onClick={() => setDensity('comfortable')}
//                     title="Lignes aérées"
//                   >
//                     ☰ Confort
//                   </Button>
//                 </ButtonGroup>
//               )}
//               <Badge bg="info" className="px-3 py-2">
//                 {visibleEtudiants.length} étudiant(s)
//               </Badge>
//             </Col>
//           </Row>
//         </Card>

//         {/* ========================================================================= */}
//         {/* VUE CHEF                                                                  */}
//         {/* ========================================================================= */}
//         {isChef ? (
//           <div className="d-flex flex-column gap-2">
//             {visibleEtudiants.length === 0 ? (
//               <Alert variant="secondary" className="text-center py-5">
//                 Aucun étudiant assigné pour le moment.
//               </Alert>
//             ) : (
//               visibleEtudiants.map((etud) => {
//                 const key = `${etud.id}-${chefId}`;
//                 const formVal = localFormData[key] || {};
//                 const isSaving = savingKey === key;
//                 const isSaved = savedSuccessKey === key;
//                 const aff = affectationsMap.get(etud.id);
//                 const isAssignedToMe = aff?.chef_id === chefId;
//                 const rankInfo = appetenceRanksMap.get(etud.id)?.get(chefId);
//                 const rankNum = rankInfo?.rank || 1;

//                 return (
//                   <Card key={etud.id} className="eval-card chef-eval-row shadow-sm border-secondary">
//                     <Row className="g-2 align-items-center">
//                       <Col lg={4} md={12}>
//                         <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
//                           <span className="fw-bold fs-6 text-white">{etud.nom} {etud.prenom}</span>
//                           <Badge bg="secondary" className="font-monospace">{etud.parcours}</Badge>
//                           <Badge bg={rankBadgeVariant(rankNum)} text={rankBadgeText(rankNum)}>
//                             ⭐ {rankNum === 1 ? '1er choix' : `${rankNum}e choix`} ({rankInfo?.score ?? 0}/4)
//                           </Badge>
//                           {aff && (
//                             <Badge bg={isAssignedToMe ? 'success' : 'dark'} className="border border-secondary">
//                               {isAssignedToMe ? '🎯 Affecté à vous' : `Affecté : ${aff.chef_nom}`}
//                             </Badge>
//                           )}
//                         </div>
//                         <div className="text-muted small font-monospace mb-2">{etud.adresse_email}</div>

//                         <div className="d-flex gap-2 align-items-center">
//                           <Button variant="outline-info" size="sm" className="doc-icon-btn" onClick={() => handleOpenRadar(etud)}>
//                             📊 Radar
//                           </Button>
//                           {etud.cv_path && (
//                             <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
//                               📄 CV
//                             </a>
//                           )}
//                           {etud.lm_path && (
//                             <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
//                               ✉️ LM
//                             </a>
//                           )}
//                         </div>
//                       </Col>

//                       <Col lg={2} md={4}>
//                         <Form.Label className="small text-light fw-bold mb-1">Note</Form.Label>
//                         <Form.Select
//                           size="sm"
//                           className="bg-dark text-white border-secondary fw-bold"
//                           value={formVal.note || ''}
//                           onChange={(e) => handleLocalChange(etud.id, chefId, 'note', e.target.value)}
//                         >
//                           <option value="">— Non noté —</option>
//                           {NOTES_DISPONIBLES.map((n) => (
//                             <option key={n} value={n}>Note {n}</option>
//                           ))}
//                         </Form.Select>
//                       </Col>

//                       <Col lg={4} md={5}>
//                         <Form.Label className="small text-light fw-bold mb-1">Commentaire</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={2}
//                           size="sm"
//                           className="bg-dark text-white border-secondary"
//                           placeholder="Points forts, adéquation..."
//                           value={formVal.commentaire || ''}
//                           onChange={(e) => handleLocalChange(etud.id, chefId, 'commentaire', e.target.value)}
//                         />
//                       </Col>

//                       <Col lg={2} md={3} className="text-end">
//                         <Button
//                           variant={isSaved ? 'outline-success' : 'primary'}
//                           size="sm"
//                           className="w-100 py-2 fw-semibold"
//                           disabled={isSaving}
//                           onClick={() => handleSaveEvaluation(etud.id, chefId)}
//                         >
//                           {isSaving ? <Spinner size="sm" animation="border" /> : isSaved ? 'Enregistré ✅' : '💾 Enregistrer'}
//                         </Button>
//                       </Col>
//                     </Row>
//                   </Card>
//                 );
//               })
//             )}
//           </div>
//         ) : (
//           /* ========================================================================= */
//           /* VUE ADMIN : Matrice compacte avec colonnes figées + noms de chefs abrégés */
//           /* ========================================================================= */
//           <div className="eval-card overflow-hidden">
//             <div className="eval-matrix-wrapper">
//               <Table size="sm" hover className="eval-matrix mb-0 text-white text-center align-middle text-nowrap">
//                 <thead className="table-dark">
//                   <tr>
//                     <th className="col-student" style={{ paddingLeft: '0.75rem' }}>
//                       Étudiant
//                     </th>
//                     <th className="col-affectation">
//                       🎯 Affectation
//                     </th>
//                     {chefs.map((c) => {
//                       const abbr = abbreviateChefName(c.nom);
//                       const tooltipLabel = c.specialite ? `${c.nom} — ${c.specialite}` : c.nom;
//                       return (
//                         <th key={c.id} className="col-chef">
//                           {withTooltip(
//                             `chef-tt-${c.id}`,
//                             tooltipLabel,
//                             <span className="chef-abbr">{abbr}</span>
//                           )}
//                         </th>
//                       );
//                     })}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {visibleEtudiants.map((etud) => {
//                     const aff = affectationsMap.get(etud.id);
//                     const isSavingAff = savingAffectationId === etud.id;
//                     const isAffSuccess = affectationSuccessId === etud.id;
//                     const studentRanks = appetenceRanksMap.get(etud.id);
//                     const fullName = `${etud.nom} ${etud.prenom}`;

//                     return (
//                       <tr key={etud.id}>
//                         <td className="col-student" style={{ paddingLeft: '0.75rem' }}>
//                           <div className="student-name-cell">
//                             {withTooltip(
//                               `student-tt-${etud.id}`,
//                               etud.adresse_email || fullName,
//                               <span className="name-text">{fullName}</span>
//                             )}
//                             <div className="d-flex gap-1 flex-shrink-0">
//                               <Button variant="outline-info" size="sm" className="doc-icon-btn" onClick={() => handleOpenRadar(etud)} title="Voir le profil de compétences" aria-label="Voir le radar de compétences">
//                                 📊
//                               </Button>
//                               {etud.cv_path && (
//                                 <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none" title="Ouvrir le CV">
//                                   📄
//                                 </a>
//                               )}
//                               {etud.lm_path && (
//                                 <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none" title="Ouvrir la lettre de motivation">
//                                   ✉️
//                                 </a>
//                               )}
//                             </div>
//                           </div>
//                         </td>

//                         <td className="col-affectation">
//                           <div className="d-flex align-items-center gap-2 justify-content-center">
//                             {isSavingAff ? (
//                               <Spinner size="sm" animation="border" variant="info" />
//                             ) : (
//                               <Form.Select
//                                 size="sm"
//                                 className={`select-affectation ${aff ? 'is-assigned' : ''}`}
//                                 value={aff ? aff.chef_id : ''}
//                                 onChange={(e) => handleAssign(etud.id, e.target.value)}
//                                 aria-label={`Affecter ${fullName}`}
//                               >
//                                 <option value="">— Non affecté —</option>
//                                 {chefs.map((c) => (
//                                   <option key={c.id} value={c.id}>
//                                     {c.nom} {c.specialite ? `(${c.specialite})` : ''}
//                                   </option>
//                                 ))}
//                               </Form.Select>
//                             )}
//                             {isAffSuccess && <span className="small text-success fw-bold">✅</span>}
//                           </div>
//                         </td>

//                         {chefs.map((c) => {
//                           const ev = getEval(etud.id, c.id);
//                           const rankInfo = studentRanks?.get(c.id);
//                           const hasComment = Boolean(ev?.commentaire?.trim());
//                           const isAssignedToThisChef = aff?.chef_id === c.id;

//                           return (
//                             <td
//                               key={c.id}
//                               className="col-chef"
//                               style={{ backgroundColor: isAssignedToThisChef ? 'rgba(16, 185, 129, 0.15)' : 'inherit' }}
//                             >
//                               <div className="d-flex align-items-center justify-content-center gap-1">
//                                 {rankInfo ? (
//                                   <Badge
//                                     bg={rankBadgeVariant(rankInfo.rank)}
//                                     text={rankBadgeText(rankInfo.rank)}
//                                     style={{ fontSize: '0.68rem' }}
//                                     title={`Appétence: ${rankInfo.score}/4`}
//                                   >
//                                     {rankInfo.rank === 1 ? '1er' : `${rankInfo.rank}e`}
//                                   </Badge>
//                                 ) : (
//                                   <span className="text-muted small" style={{ opacity: 0.4 }}>—</span>
//                                 )}

//                                 <Badge
//                                   bg={noteBadgeVariant(ev?.note)}
//                                   className="px-2 py-1 font-monospace"
//                                   style={{ fontSize: '0.72rem' }}
//                                 >
//                                   {ev?.note || '—'}
//                                 </Badge>

//                                 {hasComment && (
//                                   <button
//                                     className="btn-comment-popup"
//                                     onClick={() => handleOpenCommentPopup(etud, c, ev)}
//                                     aria-label={`Voir le commentaire de ${c.nom} pour ${fullName}`}
//                                   >
//                                     💬
//                                   </button>
//                                 )}
//                               </div>
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal Résultats d'affectations avec rang d'appétence */}
//       <Modal show={modalAffectationsOpen} onHide={() => setModalAffectationsOpen(false)} size="xl" centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title className="text-white">🎯 Synthèse Officielle des Affectations ({affectations.length} / {etudiants.length})</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
//           <Row className="g-3 mb-4">
//             <Col md={4}>
//               <Card className="bg-black bg-opacity-40 border-secondary text-center p-3">
//                 <span className="text-muted small fw-bold">Total Étudiants</span>
//                 <h3 className="text-white fw-bold mb-0 mt-1">{etudiants.length}</h3>
//               </Card>
//             </Col>
//             <Col md={4}>
//               <Card className="bg-black bg-opacity-40 border-success text-center p-3">
//                 <span className="text-success small fw-bold">Affectés</span>
//                 <h3 className="text-success fw-bold mb-0 mt-1">{affectations.length}</h3>
//               </Card>
//             </Col>
//             <Col md={4}>
//               <Card className="bg-black bg-opacity-40 border-warning text-center p-3">
//                 <span className="text-warning small fw-bold">Non affectés</span>
//                 <h3 className="text-warning fw-bold mb-0 mt-1">{etudiants.length - affectations.length}</h3>
//               </Card>
//             </Col>
//           </Row>

//           <h5 className="text-white mb-3">📋 Liste détaillée par étudiant & Satisfaction Appétence</h5>
//           <div className="table-responsive rounded border border-secondary">
//             <Table size="sm" hover variant="dark" className="mb-0 align-middle">
//               <thead>
//                 <tr>
//                   <th>Étudiant</th>
//                   <th>Email</th>
//                   <th>Statut</th>
//                   <th>Chef Assigné</th>
//                   <th>Satisfaction Appétence</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {etudiants.map((etud) => {
//                   const aff = affectationsMap.get(etud.id);
//                   const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

//                   return (
//                     <tr key={etud.id}>
//                       <td className="fw-semibold text-white">{etud.nom} {etud.prenom}</td>
//                       <td className="text-muted font-monospace">{etud.adresse_email}</td>
//                       <td>
//                         <Badge bg={aff ? 'success' : 'warning'} text={aff ? 'light' : 'dark'}>
//                           {aff ? 'Affecté' : 'Non affecté'}
//                         </Badge>
//                       </td>
//                       <td>{aff ? <strong className="text-info">{aff.chef_nom}</strong> : '—'}</td>
//                       <td>
//                         {rankInfo ? (
//                           <Badge bg={rankBadgeVariant(rankInfo.rank)} text={rankBadgeText(rankInfo.rank)}>
//                             {rankInfo.rank === 1 ? '1er choix' : `${rankInfo.rank}e choix`} ({rankInfo.score}/4)
//                           </Badge>
//                         ) : aff ? (
//                           <Badge bg="secondary">Hors Vœux</Badge>
//                         ) : (
//                           '—'
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>
//         </Modal.Body>
//         <Modal.Footer className="d-flex justify-content-between">
//           <Button variant="success" onClick={handleExportAffectationsExcel}>
//             📥 Télécharger le fichier Excel (.xlsx)
//           </Button>
//           <Button variant="secondary" onClick={() => setModalAffectationsOpen(false)}>
//             Fermer
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal Commentaire */}
//       <Modal show={modalCommentOpen} onHide={() => setModalCommentOpen(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title>💬 Détail de l'évaluation</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="p-4">
//           <div className="mb-3">
//             <h5 className="text-white mb-0">{selectedCommentData?.etudiant?.nom} {selectedCommentData?.etudiant?.prenom}</h5>
//             <small className="text-muted font-monospace">{selectedCommentData?.etudiant?.adresse_email}</small>
//           </div>
//           <div className="mb-3 d-flex justify-content-between p-2 rounded bg-black bg-opacity-25 border border-secondary">
//             <div>Évaluateur : <strong className="text-info">{selectedCommentData?.chef?.nom}</strong></div>
//             <div>Note : <Badge bg="primary">{selectedCommentData?.note}</Badge></div>
//           </div>
//           <div className="p-3 rounded bg-dark border border-secondary text-white">
//             {selectedCommentData?.commentaire}
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setModalCommentOpen(false)}>Fermer</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal Radar — profil de compétences */}
//       <Modal show={modalRadarOpen} onHide={() => setModalRadarOpen(false)} size="lg" centered className="radar-modal" contentClassName="radar-modal-content">
//         <div className="radar-modal-header">
//           <button
//             type="button"
//             className="radar-modal-close"
//             onClick={() => setModalRadarOpen(false)}
//             aria-label="Fermer"
//           >
//             ✕
//           </button>
//           <div className="radar-modal-eyebrow">Profil de compétences</div>
//           <h4 className="radar-modal-title">{selectedEtudRadar?.nom} {selectedEtudRadar?.prenom}</h4>
//           {!modalLoading && !modalError && (
//             <div className="radar-modal-stats">
//               <div className="radar-stat radar-stat-cyan">
//                 <span className="radar-stat-dot" />
//                 <span className="radar-stat-label">Aptitudes</span>
//                 <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
//               </div>
//               <div className="radar-stat radar-stat-rose">
//                 <span className="radar-stat-dot" />
//                 <span className="radar-stat-label">Appétences</span>
//                 <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="radar-modal-body">
//           {modalLoading ? (
//             <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} /></div>
//           ) : modalError ? (
//             <Alert variant="warning" className="mb-0">{modalError}</Alert>
//           ) : (
//             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
//               <Radar data={radarChartData} options={radarOptions} />
//             </div>
//           )}
//         </div>

//         <div className="radar-modal-footer">
//           <Button variant="secondary" onClick={() => setModalRadarOpen(false)}>Fermer</Button>
//         </div>
//       </Modal>
//     </>
//   );
// }

import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Form,
  Button,
  Alert,
  Spinner,
  Badge,
  Card,
  Row,
  Col,
  InputGroup,
  Modal,
  ButtonGroup,
  OverlayTrigger,
  Tooltip as BsTooltip,
} from 'react-bootstrap';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import {
  fetchEtudiants,
  fetchChefsDeProjet,
  fetchEvaluations,
  saveEvaluation,
  fetchSelections,
  fetchAffectations,
  saveAffectation,
  deleteAffectation,
  fetchAllApetences,
  fetchAptitudesByEtudiant,
  fetchApetencesByEtudiant,
  computeChefRanksForStudent,
  getDocumentPublicUrl,
} from '../services/supabase';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const NOTES_DISPONIBLES = ['A', 'B', 'C', 'D'];

const COMPETENCE_KEYS = [
  { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
  { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
  { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
  { key: 'conception_mecanique', label: 'Conception Méca' },
  { key: 'automatique_automatisme', label: 'Automatique' },
  { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
  { key: 'robot_cobot', label: 'Robot & Cobot' },
  { key: 'vision', label: 'Vision Industrielle' },
  { key: 'ia', label: 'Intelligence Artificielle' },
  { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
  { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
];

// Longueur de l'abréviation utilisée dans les en-têtes de colonnes chef (compromis
// lisibilité / densité horizontale demandé : 3-4 caractères + tooltip nom complet).
const CHEF_ABBR_LEN = 4;
const abbreviateChefName = (nom = '') => {
  const clean = nom.trim();
  if (!clean) return '—';
  return clean.slice(0, CHEF_ABBR_LEN).toUpperCase();
};

const rankBadgeVariant = (rank) => (rank === 1 ? 'success' : rank === 2 ? 'info' : 'warning');
const rankBadgeText = (rank) => (rank === 1 ? 'light' : 'dark');
const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// Couleur du carré d'évaluation : encode la note (A/B/C/D) UNIQUEMENT par la couleur,
// la note elle-même n'est jamais écrite dans la cellule — seul le rang d'appétence y figure.
const getNoteSquareStyle = (note) => {
  switch (note) {
    case 'A':
      return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
    case 'B':
      return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
    case 'C':
      return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
    case 'D':
      return { background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: '1px solid #f87171' };
    default:
      return undefined;
  }
};

function withTooltip(id, label, children) {
  return (
    <OverlayTrigger placement="top" overlay={<BsTooltip id={id}>{label}</BsTooltip>}>
      {children}
    </OverlayTrigger>
  );
}

export default function EvaluationsTable() {
  const { isAdmin, isChef, chefId, chefInfo } = useAuth();

  const [etudiants, setEtudiants] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [selections, setSelections] = useState([]);
  const [affectations, setAffectations] = useState([]);
  const [apetencesList, setApetencesList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [savedSuccessKey, setSavedSuccessKey] = useState(null);

  const [savingAffectationId, setSavingAffectationId] = useState(null);
  const [affectationSuccessId, setAffectationSuccessId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [localFormData, setLocalFormData] = useState({});

  // Filtres rapides (UX : permet de zoomer sur les étudiants qui nécessitent une action)
  const [statusFilter, setStatusFilter] = useState('all'); // all | assigned | unassigned

  // Densité du tableau admin : compacte (par défaut, max d'infos visibles) ou confortable
  const [density, setDensity] = useState('compact'); // compact | comfortable

  // Modals
  const [modalRadarOpen, setModalRadarOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedEtudRadar, setSelectedEtudRadar] = useState(null);
  const [aptitudesData, setAptitudesData] = useState(null);
  const [apetencesData, setApetencesData] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [modalCommentOpen, setModalCommentOpen] = useState(false);
  const [selectedCommentData, setSelectedCommentData] = useState(null);

  const [modalAffectationsOpen, setModalAffectationsOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [etuds, chefsData, evals, sels, affs, apList] = await Promise.all([
        fetchEtudiants(),
        fetchChefsDeProjet(),
        fetchEvaluations(),
        fetchSelections(),
        fetchAffectations(),
        fetchAllApetences(),
      ]);

      setEtudiants(etuds || []);
      setChefs(chefsData || []);
      setEvaluations(evals || []);
      setSelections(sels || []);
      setAffectations(affs || []);
      setApetencesList(apList || []);

      const formInit = {};
      (evals || []).forEach((ev) => {
        formInit[`${ev.etudiant_id}-${ev.chef_de_projet_id}`] = {
          note: ev.note || '',
          commentaire: ev.commentaire || '',
        };
      });
      setLocalFormData(formInit);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des évaluations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
  const appetenceRanksMap = useMemo(() => {
    const map = new Map();
    const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

    etudiants.forEach((etud) => {
      const etudAp = apetencesByEtud.get(etud.id);
      const ranks = computeChefRanksForStudent(etudAp, chefs);
      map.set(etud.id, ranks);
    });

    return map;
  }, [apetencesList, etudiants, chefs]);

  // Map des affectations : etudiant_id => { chef_id, chef_nom, specialite }
  const affectationsMap = useMemo(() => {
    const map = new Map();
    (affectations || []).forEach((aff) => {
      const chef = chefs.find((c) => c.id === aff.chef_de_projet_id);
      map.set(aff.etudiant_id, {
        chef_id: aff.chef_de_projet_id,
        chef_nom: chef?.nom || aff.chefs_de_projet?.nom || 'Inconnu',
        specialite: chef?.specialite || aff.chefs_de_projet?.specialite || '',
      });
    });
    return map;
  }, [affectations, chefs]);

  // Liste filtrée des étudiants
  const visibleEtudiants = useMemo(() => {
    let list = etudiants;

    if (isChef && chefId) {
      const studentIdsForChef = new Set(
        selections.filter((s) => s.chef_de_projet_id === chefId).map((s) => s.etudiant_id)
      );
      list = etudiants.filter((e) => studentIdsForChef.has(e.id));
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (e) =>
          (e.nom && e.nom.toLowerCase().includes(q)) ||
          (e.prenom && e.prenom.toLowerCase().includes(q)) ||
          (e.adresse_email && e.adresse_email.toLowerCase().includes(q))
      );
    }

    if (isAdmin && statusFilter !== 'all') {
      list = list.filter((e) => {
        const isAssigned = affectationsMap.has(e.id);
        return statusFilter === 'assigned' ? isAssigned : !isAssigned;
      });
    }

    // Si chef connecté : trier les étudiants par niveau d'appétence pour ce chef (rang 1er d'abord)
    if (isChef && chefId) {
      return [...list].sort((a, b) => {
        const rankA = appetenceRanksMap.get(a.id)?.get(chefId)?.rank ?? 999;
        const rankB = appetenceRanksMap.get(b.id)?.get(chefId)?.rank ?? 999;
        return rankA - rankB;
      });
    }

    return list;
  }, [etudiants, isChef, chefId, selections, searchTerm, appetenceRanksMap, isAdmin, statusFilter, affectationsMap]);

  const getEval = (etudiantId, cId) =>
    evaluations.find((e) => e.etudiant_id === etudiantId && e.chef_de_projet_id === cId);

  const handleLocalChange = (etudiantId, cId, field, value) => {
    const key = `${etudiantId}-${cId}`;
    setLocalFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
    setSavedSuccessKey(null);
  };

  const handleSaveEvaluation = async (etudiantId, cId) => {
    const key = `${etudiantId}-${cId}`;
    const formVal = localFormData[key] || {};
    const note = formVal.note || '';
    const commentaire = formVal.commentaire || '';

    if (!note && !commentaire) {
      setError('Veuillez renseigner au moins une note ou un commentaire.');
      return;
    }

    setSavingKey(key);
    setError(null);

    try {
      await saveEvaluation(cId, etudiantId, note, commentaire);

      setEvaluations((prev) => {
        const next = prev.filter(
          (e) => !(e.etudiant_id === etudiantId && e.chef_de_projet_id === cId)
        );
        return [
          ...next,
          { etudiant_id: etudiantId, chef_de_projet_id: cId, note, commentaire },
        ];
      });

      setSavedSuccessKey(key);
      setTimeout(() => setSavedSuccessKey(null), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement de l'évaluation.");
    } finally {
      setSavingKey(null);
    }
  };

  const handleAssign = async (etudiantId, targetChefIdStr) => {
    setSavingAffectationId(etudiantId);
    setError(null);

    try {
      if (!targetChefIdStr) {
        await deleteAffectation(etudiantId);
        setAffectations((prev) => prev.filter((a) => a.etudiant_id !== etudiantId));
      } else {
        const targetChefId = Number(targetChefIdStr);
        await saveAffectation(targetChefId, etudiantId);
        setAffectations((prev) => {
          const next = prev.filter((a) => a.etudiant_id !== etudiantId);
          return [...next, { etudiant_id: etudiantId, chef_de_projet_id: targetChefId }];
        });
      }

      setAffectationSuccessId(etudiantId);
      setTimeout(() => setAffectationSuccessId(null), 2500);
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement de l'affectation.");
    } finally {
      setSavingAffectationId(null);
    }
  };

  const handleOpenCommentPopup = (etudiant, chef, ev) => {
    setSelectedCommentData({
      etudiant,
      chef,
      note: ev?.note || 'Non noté',
      commentaire: ev?.commentaire || 'Aucun commentaire rédigé.',
    });
    setModalCommentOpen(true);
  };

  const handleOpenRadar = async (etudiant) => {
    setSelectedEtudRadar(etudiant);
    setModalRadarOpen(true);
    setModalLoading(true);
    setModalError(null);
    setAptitudesData(null);
    setApetencesData(null);

    try {
      const [aptitudes, apetences] = await Promise.all([
        fetchAptitudesByEtudiant(etudiant.id),
        fetchApetencesByEtudiant(etudiant.id),
      ]);

      if (!aptitudes && !apetences) {
        setModalError('Aucune compétence enregistrée.');
      } else {
        setAptitudesData(aptitudes);
        setApetencesData(apetences);
      }
    } catch (err) {
      setModalError(err.message || 'Erreur lors du chargement des compétences.');
    } finally {
      setModalLoading(false);
    }
  };

  const radarChartData = useMemo(() => {
    const labels = COMPETENCE_KEYS.map((c) => c.label);
    const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
    const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

    return {
      labels,
      datasets: [
        {
          label: 'Aptitudes (Technique)',
          data: aptValues,
          backgroundColor: 'rgba(41, 211, 211, 0.22)',
          borderColor: '#29d3d3',
          borderWidth: 2.5,
          pointBackgroundColor: '#29d3d3',
          pointBorderColor: '#0a0e1a',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Appétences (Intérêt)',
          data: apeValues,
          backgroundColor: 'rgba(251, 111, 146, 0.20)',
          borderColor: '#fb6f92',
          borderWidth: 2.5,
          pointBackgroundColor: '#fb6f92',
          pointBorderColor: '#0a0e1a',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [aptitudesData, apetencesData]);

  // Moyennes pour les indicateurs de synthèse au-dessus du radar (purement dérivé, aucune nouvelle donnée)
  const radarAverages = useMemo(() => {
    const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
    const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
    const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
    return { aptitude: avg(aptValues), appetence: avg(apeValues) };
  }, [aptitudesData, apetencesData]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'point' },
    scales: {
      r: {
        min: 0,
        suggestedMax: 4,
        ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
        grid: { color: 'rgba(148, 163, 184, 0.14)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
        pointLabels: { color: '#e7ebf5', font: { size: 11, weight: '600' } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#151b2e',
        borderColor: 'rgba(148, 163, 184, 0.25)',
        borderWidth: 1,
        titleColor: '#f4f6fb',
        bodyColor: '#c7cede',
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  // Export Excel
  const handleExportEvaluationsExcel = () => {
    try {
      const rows = [];
      visibleEtudiants.forEach((etud) => {
        const chefsToExport = isChef && chefId ? chefs.filter((c) => c.id === chefId) : chefs;
        const studentRanks = appetenceRanksMap.get(etud.id);

        chefsToExport.forEach((c) => {
          const ev = getEval(etud.id, c.id);
          const aff = affectationsMap.get(etud.id);
          const rankInfo = studentRanks?.get(c.id);

          rows.push({
            'Étudiant': `${etud.nom} ${etud.prenom}`,
            'Email Étudiant': etud.adresse_email,
            'Chef Évaluateur': c.nom,
            'Rang Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : 'N/A',
            'Note': ev?.note || '',
            'Commentaire': ev?.commentaire || '',
            'Affectation Finale': aff ? `${aff.chef_nom} (${aff.specialite})` : 'Non affecté',
          });
        });
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      ws['!cols'] = [{ wch: 25 }, { wch: 32 }, { wch: 25 }, { wch: 20 }, { wch: 10 }, { wch: 45 }, { wch: 30 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Évaluations');
      XLSX.writeFile(wb, `evaluations_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      alert(`Erreur export: ${err.message}`);
    }
  };

  const handleExportAffectationsExcel = () => {
    try {
      const detailedRows = etudiants.map((etud) => {
        const aff = affectationsMap.get(etud.id);
        const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

        return {
          'Nom': etud.nom || '',
          'Prénom': etud.prenom || '',
          'Email': etud.adresse_email || '',
          'Parcours': etud.parcours || 'I2026',
          'Statut Affectation': aff ? 'Affecté' : 'Non affecté',
          'Chef Assigné': aff ? aff.chef_nom : '—',
          'Spécialité': aff ? aff.specialite : '—',
          'Satisfaction Appétence': rankInfo ? `${rankInfo.rank}e choix (${rankInfo.score}/4)` : aff ? 'Hors Vœux' : '—',
        };
      });

      const summaryRows = chefs.map((chef) => {
        const assignedStudents = etudiants.filter(
          (e) => affectationsMap.get(e.id)?.chef_id === chef.id
        );
        return {
          'Chef de Projet': chef.nom,
          'Spécialité': chef.specialite || 'N/A',
          'Email': chef.email || '',
          'Nb Étudiants Affectés': assignedStudents.length,
          'Étudiants': assignedStudents.map((s) => `${s.nom} ${s.prenom}`).join(', ') || 'Aucun',
        };
      });

      const ws1 = XLSX.utils.json_to_sheet(detailedRows);
      ws1['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 32 }, { wch: 12 }, { wch: 18 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];

      const ws2 = XLSX.utils.json_to_sheet(summaryRows);
      ws2['!cols'] = [{ wch: 26 }, { wch: 28 }, { wch: 32 }, { wch: 24 }, { wch: 60 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws1, 'Affectations Finales');
      XLSX.utils.book_append_sheet(wb, ws2, 'Synthèse Chefs');

      XLSX.writeFile(wb, `affectations_finales_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      alert(`Erreur export: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
        <Spinner animation="border" variant="info" />
        <p className="mt-3 text-muted">Chargement des évaluations...</p>
      </div>
    );
  }

  const rowMinHeight = density === 'compact' ? '38px' : '52px';
  const firstColWidth = density === 'compact' ? 168 : 200;
  const affColWidth = density === 'compact' ? 150 : 180;
  const chefColWidth = density === 'compact' ? 76 : 96;

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
          --accent-rose: #fb6f92;
          --accent-rose-soft: rgba(251, 111, 146, 0.16);
          --accent-amber: #f5b942;
          --accent-amber-soft: rgba(245, 185, 66, 0.16);
          --accent-emerald: #35d0a0;
          --accent-emerald-soft: rgba(53, 208, 160, 0.16);
          --accent-coral: #ff6b6b;
          --accent-coral-soft: rgba(255, 107, 107, 0.16);
        }

        .eval-page-wrapper {
          max-width: 100%;
          margin: 0 auto;
          padding: 1.25rem 1rem 2.5rem 1rem;
          color: var(--text-primary);
          background:
            radial-gradient(1200px 500px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
            radial-gradient(900px 500px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
            var(--canvas);
        }
        .eval-card {
          background: var(--panel);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
        }
        .toolbar-card {
          padding: 0.75rem 1rem;
        }
        .btn-comment-popup {
          background: var(--accent-cyan-soft);
          border: 1px solid rgba(41, 211, 211, 0.4);
          color: var(--accent-cyan);
          border-radius: 6px;
          padding: 1px 5px;
          font-size: 0.7rem;
          line-height: 1.3;
          cursor: pointer;
        }
        .select-affectation {
          background-color: var(--panel-raised) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-strong) !important;
          font-size: 0.76rem;
          border-radius: 8px;
          padding-top: 2px;
          padding-bottom: 2px;
        }
        .select-affectation.is-assigned {
          background-color: var(--accent-emerald-soft) !important;
          border-color: var(--accent-emerald) !important;
          color: var(--accent-emerald) !important;
          font-weight: 600;
        }

        /* --- Palette moderne : recolore les variantes Bootstrap par défaut --- */
        .eval-page-wrapper .badge.bg-success, .eval-page-wrapper .btn-success {
          background-color: var(--accent-emerald) !important; border-color: var(--accent-emerald) !important; color: #06231a !important;
        }
        .eval-page-wrapper .badge.bg-info, .eval-page-wrapper .btn-info, .eval-page-wrapper .btn-outline-info {
          --bs-btn-color: var(--accent-cyan); --bs-btn-border-color: var(--accent-cyan); --bs-btn-hover-bg: var(--accent-cyan);
        }
        .eval-page-wrapper .badge.bg-info { background-color: var(--accent-cyan) !important; color: #06231a !important; }
        .eval-page-wrapper .badge.bg-warning { background-color: var(--accent-amber) !important; color: #241a03 !important; }
        .eval-page-wrapper .badge.bg-danger { background-color: var(--accent-coral) !important; }
        .eval-page-wrapper .badge.bg-primary, .eval-page-wrapper .btn-primary {
          background-color: var(--accent-violet) !important; border-color: var(--accent-violet) !important;
        }
        .eval-page-wrapper .badge.bg-dark { background-color: var(--panel-raised) !important; border: 1px solid var(--border-subtle); }
        .eval-page-wrapper .btn-success { color: #06231a !important; }
        .eval-page-wrapper .btn-outline-info:hover { color: #06231a !important; }

        /* --- Tableau matrice : densité maximale, colonnes figées --- */
        .eval-matrix-wrapper {
          max-height: 76vh;
          overflow: auto;
        }
        .eval-matrix {
          font-size: 0.78rem;
        }
        .eval-matrix td, .eval-matrix th {
          padding: 0.28rem 0.4rem;
          vertical-align: middle;
          min-height: ${rowMinHeight};
        }
        .eval-matrix thead th {
          position: sticky;
          top: 0;
          background: var(--panel-solid);
          z-index: 5;
          border-bottom: 2px solid var(--accent-violet-soft);
        }
        .col-student {
          position: sticky;
          left: 0;
          z-index: 6;
          background: var(--panel-solid);
          text-align: left !important;
          width: ${firstColWidth}px;
          min-width: ${firstColWidth}px;
          max-width: ${firstColWidth}px;
        }
        thead .col-student { z-index: 15; }
        .col-affectation {
          position: sticky;
          left: ${firstColWidth}px;
          z-index: 6;
          background: var(--panel-solid);
          border-right: 2px solid rgba(124, 108, 246, 0.35);
          width: ${affColWidth}px;
          min-width: ${affColWidth}px;
          max-width: ${affColWidth}px;
        }
        thead .col-affectation { z-index: 15; }
        .col-chef {
          width: ${chefColWidth}px;
          min-width: ${chefColWidth}px;
          max-width: ${chefColWidth}px;
        }
        .chef-abbr {
          font-weight: 700;
          letter-spacing: 0.4px;
          cursor: help;
          border-bottom: 1px dashed rgba(148,163,184,0.6);
        }
        .student-name-cell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.35rem;
        }
        .student-name-cell .name-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
          font-size: 0.82rem;
        }
        .doc-icon-btn {
          font-size: 0.68rem;
          padding: 1px 4px;
        }
        .density-toggle .btn { font-size: 0.72rem; padding: 0.2rem 0.55rem; }

        /* --- Carré d'évaluation : le rang est toujours affiché, la couleur seule ---
             encode la note une fois l'étudiant évalué. Transparent tant qu'il n'y a
             pas de note (même logique que la matrice de sélection des vœux). --- */
        .note-rank-square {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          height: 26px;
          padding: 0 6px;
          border-radius: 7px;
          font-weight: 700;
          font-size: 0.7rem;
          line-height: 1;
          transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
        }
        .note-rank-square.is-pending {
          background: transparent;
          border: 1px dashed var(--border-strong);
          color: var(--text-muted);
          opacity: 0.75;
        }
        tr:hover .note-rank-square.is-pending {
          opacity: 1;
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }
        .note-rank-square.is-evaluated {
          border-style: solid;
        }

        /* --- Vue Chef : cartes compactes --- */
        .chef-eval-row {
          padding: 0.6rem 0.9rem;
        }

        /* --- Modal Radar : refonte visuelle --- */
        .radar-modal .modal-dialog { }
        .radar-modal-content {
          background: var(--panel-solid) !important;
          border: 1px solid var(--border-strong) !important;
          border-radius: 18px !important;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.55);
        }
        .radar-modal-header {
          position: relative;
          padding: 1.5rem 1.75rem 1.25rem 1.75rem;
          background:
            radial-gradient(600px 220px at 15% 0%, rgba(124,108,246,0.35), transparent 60%),
            radial-gradient(600px 220px at 100% 0%, rgba(41,211,211,0.25), transparent 60%),
            var(--panel-raised);
          border-bottom: 1px solid var(--border-subtle);
        }
        .radar-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid var(--border-strong);
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
          font-size: 0.85rem;
          line-height: 1;
          cursor: pointer;
        }
        .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
        .radar-modal-eyebrow {
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 0.25rem;
        }
        .radar-modal-title {
          color: var(--text-primary);
          font-weight: 700;
          margin: 0 0 1rem 0;
          font-size: 1.35rem;
        }
        .radar-modal-stats {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .radar-stat {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.75rem;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
        }
        .radar-stat-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
        .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
        .radar-stat-label { color: var(--text-muted); font-size: 0.78rem; }
        .radar-stat-value { color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
        .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
        .radar-modal-body {
          padding: 1.5rem 1.75rem;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .radar-modal-footer {
          padding: 1rem 1.75rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
        }
      `}</style>

      <Navbar />

      <div className="eval-page-wrapper">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.6rem' }}>📝</span>
              <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px', fontSize: '1.5rem' }}>
                {isChef ? `Mes Évaluations — ${chefInfo?.nom || 'Chef de projet'}` : 'Évaluations & Affectations Finales'}
              </h2>
            </div>
            <p className="text-light opacity-75 small mt-1 mb-0">
              {isChef
                ? 'Les étudiants sont triés selon leur niveau d’appétence pour votre thématique (1er choix en haut).'
                : 'Survolez un en-tête de colonne pour voir le nom complet du chef de projet. Le carré affiche le rang ; sa couleur indique la note une fois l’étudiant évalué (vert = A, bleu = B, orange = C, rouge = D).'}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalAffectationsOpen(true)}
                className="px-3 py-2 fw-semibold"
              >
                🎯 Résultats Affectations ({affectations.length} / {etudiants.length})
              </Button>
            )}

            <Button
              variant="success"
              size="sm"
              onClick={handleExportEvaluationsExcel}
              className="px-3 py-2 fw-semibold"
            >
              📊 Exporter Notes
            </Button>

            {isAdmin && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={handleExportAffectationsExcel}
                className="px-3 py-2 fw-semibold"
              >
                📥 Exporter Affectations (.xlsx)
              </Button>
            )}

            <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
              🔄 Actualiser
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        {/* Barre d'outils : recherche, filtres, densité */}
        <Card className="eval-card toolbar-card mb-3 shadow-sm">
          <Row className="align-items-center g-2">
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-transparent border-secondary text-muted">🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Rechercher nom, prénom ou email..."
                  className="bg-dark text-white border-secondary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>✕</Button>
                )}
              </InputGroup>
            </Col>

            {isAdmin && (
              <Col md={4} className="d-flex justify-content-md-center">
                <ButtonGroup size="sm">
                  <Button
                    variant={statusFilter === 'all' ? 'info' : 'outline-info'}
                    onClick={() => setStatusFilter('all')}
                  >
                    Tous ({etudiants.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'assigned' ? 'success' : 'outline-success'}
                    onClick={() => setStatusFilter('assigned')}
                  >
                    Affectés ({affectations.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'unassigned' ? 'warning' : 'outline-warning'}
                    onClick={() => setStatusFilter('unassigned')}
                  >
                    Non affectés ({etudiants.length - affectations.length})
                  </Button>
                </ButtonGroup>
              </Col>
            )}

            <Col md={isAdmin ? 4 : 8} className="d-flex justify-content-end align-items-center gap-2">
              {isAdmin && (
                <ButtonGroup size="sm" className="density-toggle">
                  <Button
                    variant={density === 'compact' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setDensity('compact')}
                    title="Lignes compactes — voir plus d'étudiants à l'écran"
                  >
                    ▤ Compact
                  </Button>
                  <Button
                    variant={density === 'comfortable' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setDensity('comfortable')}
                    title="Lignes aérées"
                  >
                    ☰ Confort
                  </Button>
                </ButtonGroup>
              )}
              <Badge bg="info" className="px-3 py-2">
                {visibleEtudiants.length} étudiant(s)
              </Badge>
            </Col>
          </Row>
        </Card>

        {/* ========================================================================= */}
        {/* VUE CHEF                                                                  */}
        {/* ========================================================================= */}
        {isChef ? (
          <div className="d-flex flex-column gap-2">
            {visibleEtudiants.length === 0 ? (
              <Alert variant="secondary" className="text-center py-5">
                Aucun étudiant assigné pour le moment.
              </Alert>
            ) : (
              visibleEtudiants.map((etud) => {
                const key = `${etud.id}-${chefId}`;
                const formVal = localFormData[key] || {};
                const isSaving = savingKey === key;
                const isSaved = savedSuccessKey === key;
                const aff = affectationsMap.get(etud.id);
                const isAssignedToMe = aff?.chef_id === chefId;
                const rankInfo = appetenceRanksMap.get(etud.id)?.get(chefId);
                const rankNum = rankInfo?.rank || 1;

                return (
                  <Card key={etud.id} className="eval-card chef-eval-row shadow-sm border-secondary">
                    <Row className="g-2 align-items-center">
                      <Col lg={4} md={12}>
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <span className="fw-bold fs-6 text-white">{etud.nom} {etud.prenom}</span>
                          <Badge bg="secondary" className="font-monospace">{etud.parcours}</Badge>
                          <Badge bg={rankBadgeVariant(rankNum)} text={rankBadgeText(rankNum)}>
                            ⭐ {rankNum === 1 ? '1er choix' : `${rankNum}e choix`} ({rankInfo?.score ?? 0}/4)
                          </Badge>
                          {aff && (
                            <Badge bg={isAssignedToMe ? 'success' : 'dark'} className="border border-secondary">
                              {isAssignedToMe ? '🎯 Affecté à vous' : `Affecté : ${aff.chef_nom}`}
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted small font-monospace mb-2">{etud.adresse_email}</div>

                        <div className="d-flex gap-2 align-items-center">
                          <Button variant="outline-info" size="sm" className="doc-icon-btn" onClick={() => handleOpenRadar(etud)}>
                            📊 Radar
                          </Button>
                          {etud.cv_path && (
                            <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
                              📄 CV
                            </a>
                          )}
                          {etud.lm_path && (
                            <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
                              ✉️ LM
                            </a>
                          )}
                        </div>
                      </Col>

                      <Col lg={2} md={4}>
                        <Form.Label className="small text-light fw-bold mb-1">Note</Form.Label>
                        <Form.Select
                          size="sm"
                          className="bg-dark text-white border-secondary fw-bold"
                          value={formVal.note || ''}
                          onChange={(e) => handleLocalChange(etud.id, chefId, 'note', e.target.value)}
                        >
                          <option value="">— Non noté —</option>
                          {NOTES_DISPONIBLES.map((n) => (
                            <option key={n} value={n}>Note {n}</option>
                          ))}
                        </Form.Select>
                      </Col>

                      <Col lg={4} md={5}>
                        <Form.Label className="small text-light fw-bold mb-1">Commentaire</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          size="sm"
                          className="bg-dark text-white border-secondary"
                          placeholder="Points forts, adéquation..."
                          value={formVal.commentaire || ''}
                          onChange={(e) => handleLocalChange(etud.id, chefId, 'commentaire', e.target.value)}
                        />
                      </Col>

                      <Col lg={2} md={3} className="text-end">
                        <Button
                          variant={isSaved ? 'outline-success' : 'primary'}
                          size="sm"
                          className="w-100 py-2 fw-semibold"
                          disabled={isSaving}
                          onClick={() => handleSaveEvaluation(etud.id, chefId)}
                        >
                          {isSaving ? <Spinner size="sm" animation="border" /> : isSaved ? 'Enregistré ✅' : '💾 Enregistrer'}
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                );
              })
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VUE ADMIN : Matrice compacte avec colonnes figées + noms de chefs abrégés */
          /* ========================================================================= */
          <div className="eval-card overflow-hidden">
            <div className="eval-matrix-wrapper">
              <Table size="sm" hover className="eval-matrix mb-0 text-white text-center align-middle text-nowrap">
                <thead className="table-dark">
                  <tr>
                    <th className="col-student" style={{ paddingLeft: '0.75rem' }}>
                      Étudiant
                    </th>
                    <th className="col-affectation">
                      🎯 Affectation
                    </th>
                    {chefs.map((c) => {
                      const abbr = abbreviateChefName(c.nom);
                      const tooltipLabel = c.specialite ? `${c.nom} — ${c.specialite}` : c.nom;
                      return (
                        <th key={c.id} className="col-chef">
                          {withTooltip(
                            `chef-tt-${c.id}`,
                            tooltipLabel,
                            <span className="chef-abbr">{abbr}</span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {visibleEtudiants.map((etud) => {
                    const aff = affectationsMap.get(etud.id);
                    const isSavingAff = savingAffectationId === etud.id;
                    const isAffSuccess = affectationSuccessId === etud.id;
                    const studentRanks = appetenceRanksMap.get(etud.id);
                    const fullName = `${etud.nom} ${etud.prenom}`;

                    return (
                      <tr key={etud.id}>
                        <td className="col-student" style={{ paddingLeft: '0.75rem' }}>
                          <div className="student-name-cell">
                            {withTooltip(
                              `student-tt-${etud.id}`,
                              etud.adresse_email || fullName,
                              <span className="name-text">{fullName}</span>
                            )}
                            <div className="d-flex gap-1 flex-shrink-0">
                              <Button variant="outline-info" size="sm" className="doc-icon-btn" onClick={() => handleOpenRadar(etud)} title="Voir le profil de compétences" aria-label="Voir le radar de compétences">
                                📊
                              </Button>
                              {etud.cv_path && (
                                <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none" title="Ouvrir le CV">
                                  📄
                                </a>
                              )}
                              {etud.lm_path && (
                                <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none" title="Ouvrir la lettre de motivation">
                                  ✉️
                                </a>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="col-affectation">
                          <div className="d-flex align-items-center gap-2 justify-content-center">
                            {isSavingAff ? (
                              <Spinner size="sm" animation="border" variant="info" />
                            ) : (
                              <Form.Select
                                size="sm"
                                className={`select-affectation ${aff ? 'is-assigned' : ''}`}
                                value={aff ? aff.chef_id : ''}
                                onChange={(e) => handleAssign(etud.id, e.target.value)}
                                aria-label={`Affecter ${fullName}`}
                              >
                                <option value="">— Non affecté —</option>
                                {chefs.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.nom} {c.specialite ? `(${c.specialite})` : ''}
                                  </option>
                                ))}
                              </Form.Select>
                            )}
                            {isAffSuccess && <span className="small text-success fw-bold">✅</span>}
                          </div>
                        </td>

                        {chefs.map((c) => {
                          const ev = getEval(etud.id, c.id);
                          const rankInfo = studentRanks?.get(c.id);
                          const hasComment = Boolean(ev?.commentaire?.trim());
                          const isAssignedToThisChef = aff?.chef_id === c.id;
                          const hasNote = Boolean(ev?.note);
                          const squareStyle = hasNote ? getNoteSquareStyle(ev.note) : undefined;
                          const rankText = rankInfo ? rankLabel(rankInfo.rank) : '—';
                          const squareTitle = hasNote
                            ? `Évalué${rankInfo ? ` — ${rankText} choix (${rankInfo.score}/4)` : ''}`
                            : rankInfo
                            ? `Non évalué — ${rankText} choix (${rankInfo.score}/4)`
                            : 'Non évalué';

                          return (
                            <td
                              key={c.id}
                              className="col-chef"
                              style={{ backgroundColor: isAssignedToThisChef ? 'rgba(16, 185, 129, 0.15)' : 'inherit' }}
                            >
                              <div className="d-flex align-items-center justify-content-center gap-1">
                                <span
                                  className={`note-rank-square ${hasNote ? 'is-evaluated' : 'is-pending'}`}
                                  style={squareStyle}
                                  title={squareTitle}
                                >
                                  {rankText}
                                </span>

                                {hasComment && (
                                  <button
                                    className="btn-comment-popup"
                                    onClick={() => handleOpenCommentPopup(etud, c, ev)}
                                    aria-label={`Voir le commentaire de ${c.nom} pour ${fullName}`}
                                  >
                                    💬
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Résultats d'affectations avec rang d'appétence */}
      <Modal show={modalAffectationsOpen} onHide={() => setModalAffectationsOpen(false)} size="xl" centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="text-white">🎯 Synthèse Officielle des Affectations ({affectations.length} / {etudiants.length})</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Card className="bg-black bg-opacity-40 border-secondary text-center p-3">
                <span className="text-muted small fw-bold">Total Étudiants</span>
                <h3 className="text-white fw-bold mb-0 mt-1">{etudiants.length}</h3>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-black bg-opacity-40 border-success text-center p-3">
                <span className="text-success small fw-bold">Affectés</span>
                <h3 className="text-success fw-bold mb-0 mt-1">{affectations.length}</h3>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="bg-black bg-opacity-40 border-warning text-center p-3">
                <span className="text-warning small fw-bold">Non affectés</span>
                <h3 className="text-warning fw-bold mb-0 mt-1">{etudiants.length - affectations.length}</h3>
              </Card>
            </Col>
          </Row>

          <h5 className="text-white mb-3">📋 Liste détaillée par étudiant & Satisfaction Appétence</h5>
          <div className="table-responsive rounded border border-secondary">
            <Table size="sm" hover variant="dark" className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Chef Assigné</th>
                  <th>Satisfaction Appétence</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((etud) => {
                  const aff = affectationsMap.get(etud.id);
                  const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

                  return (
                    <tr key={etud.id}>
                      <td className="fw-semibold text-white">{etud.nom} {etud.prenom}</td>
                      <td className="text-muted font-monospace">{etud.adresse_email}</td>
                      <td>
                        <Badge bg={aff ? 'success' : 'warning'} text={aff ? 'light' : 'dark'}>
                          {aff ? 'Affecté' : 'Non affecté'}
                        </Badge>
                      </td>
                      <td>{aff ? <strong className="text-info">{aff.chef_nom}</strong> : '—'}</td>
                      <td>
                        {rankInfo ? (
                          <Badge bg={rankBadgeVariant(rankInfo.rank)} text={rankBadgeText(rankInfo.rank)}>
                            {rankInfo.rank === 1 ? '1er choix' : `${rankInfo.rank}e choix`} ({rankInfo.score}/4)
                          </Badge>
                        ) : aff ? (
                          <Badge bg="secondary">Hors Vœux</Badge>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="success" onClick={handleExportAffectationsExcel}>
            📥 Télécharger le fichier Excel (.xlsx)
          </Button>
          <Button variant="secondary" onClick={() => setModalAffectationsOpen(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Commentaire */}
      <Modal show={modalCommentOpen} onHide={() => setModalCommentOpen(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>💬 Détail de l'évaluation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-3">
            <h5 className="text-white mb-0">{selectedCommentData?.etudiant?.nom} {selectedCommentData?.etudiant?.prenom}</h5>
            <small className="text-muted font-monospace">{selectedCommentData?.etudiant?.adresse_email}</small>
          </div>
          <div className="mb-3 d-flex justify-content-between p-2 rounded bg-black bg-opacity-25 border border-secondary">
            <div>Évaluateur : <strong className="text-info">{selectedCommentData?.chef?.nom}</strong></div>
            <div>Note : <Badge bg="primary">{selectedCommentData?.note}</Badge></div>
          </div>
          <div className="p-3 rounded bg-dark border border-secondary text-white">
            {selectedCommentData?.commentaire}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalCommentOpen(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Radar — profil de compétences */}
      <Modal show={modalRadarOpen} onHide={() => setModalRadarOpen(false)} size="lg" centered className="radar-modal" contentClassName="radar-modal-content">
        <div className="radar-modal-header">
          <button
            type="button"
            className="radar-modal-close"
            onClick={() => setModalRadarOpen(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
          <div className="radar-modal-eyebrow">Profil de compétences</div>
          <h4 className="radar-modal-title">{selectedEtudRadar?.nom} {selectedEtudRadar?.prenom}</h4>
          {!modalLoading && !modalError && (
            <div className="radar-modal-stats">
              <div className="radar-stat radar-stat-cyan">
                <span className="radar-stat-dot" />
                <span className="radar-stat-label">Aptitudes</span>
                <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
              </div>
              <div className="radar-stat radar-stat-rose">
                <span className="radar-stat-dot" />
                <span className="radar-stat-label">Appétences</span>
                <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
              </div>
            </div>
          )}
        </div>

        <div className="radar-modal-body">
          {modalLoading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} /></div>
          ) : modalError ? (
            <Alert variant="warning" className="mb-0">{modalError}</Alert>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Radar data={radarChartData} options={radarOptions} />
            </div>
          )}
        </div>

        <div className="radar-modal-footer">
          <Button variant="secondary" onClick={() => setModalRadarOpen(false)}>Fermer</Button>
        </div>
      </Modal>
    </>
  );
}