// // // // // // // import React, { useEffect, useState, useMemo } from 'react';
// // // // // // // import {
// // // // // // //   Table,
// // // // // // //   Button,
// // // // // // //   Alert,
// // // // // // //   Spinner,
// // // // // // //   Form,
// // // // // // //   InputGroup,
// // // // // // //   Badge,
// // // // // // //   Card,
// // // // // // //   Row,
// // // // // // //   Col,
// // // // // // //   Modal,
// // // // // // // } from 'react-bootstrap';
// // // // // // // import * as XLSX from 'xlsx';
// // // // // // // import {
// // // // // // //   Chart as ChartJS,
// // // // // // //   RadialLinearScale,
// // // // // // //   PointElement,
// // // // // // //   LineElement,
// // // // // // //   Filler,
// // // // // // //   Tooltip,
// // // // // // //   Legend,
// // // // // // // } from 'chart.js';
// // // // // // // import { Radar } from 'react-chartjs-2';
// // // // // // // import Navbar from './Navbar';
// // // // // // // import {
// // // // // // //   fetchChefsDeProjet,
// // // // // // //   fetchEtudiants,
// // // // // // //   fetchSelections,
// // // // // // //   saveSelection,
// // // // // // //   deleteSelection,
// // // // // // //   fetchAllApetences,
// // // // // // //   fetchAptitudesByEtudiant,
// // // // // // //   fetchApetencesByEtudiant,
// // // // // // //   computeChefRanksForStudent,
// // // // // // //   getDocumentPublicUrl,
// // // // // // // } from '../services/supabase';

// // // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // // const COMPETENCE_KEYS = [
// // // // // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // // // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // // // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // // // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // // // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // // // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // // // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // // // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // // // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // // // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // // // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // // // // ];

// // // // // // // const getRankBadgeStyle = (rank) => {
// // // // // // //   switch (rank) {
// // // // // // //     case 1:
// // // // // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // // // // //     case 2:
// // // // // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // // // // //     case 3:
// // // // // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // // // // //     default:
// // // // // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // // // // //   }
// // // // // // // };

// // // // // // // export default function SelectionPage() {
// // // // // // //   const [chefs, setChefs] = useState([]);
// // // // // // //   const [etudiants, setEtudiants] = useState([]);
// // // // // // //   const [apetencesList, setApetencesList] = useState([]);

// // // // // // //   // Set de "etudiantId-chefId"
// // // // // // //   const [selections, setSelections] = useState(new Set());
// // // // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // //   const [error, setError] = useState(null);
// // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // //   // Modal Radar
// // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // // //   const [modalError, setModalError] = useState(null);

// // // // // // //   const loadData = async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setError(null);

// // // // // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // // // // //         fetchChefsDeProjet(),
// // // // // // //         fetchEtudiants(),
// // // // // // //         fetchSelections(),
// // // // // // //         fetchAllApetences(),
// // // // // // //       ]);

// // // // // // //       setChefs(chefsData || []);
// // // // // // //       setEtudiants(etudiantsData || []);
// // // // // // //       setApetencesList(apetencesDataRaw || []);

// // // // // // //       const activeSet = new Set();
// // // // // // //       (selectionsData || []).forEach((s) => {
// // // // // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // // // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // // // // //         }
// // // // // // //       });

// // // // // // //       setSelections(new Set(activeSet));
// // // // // // //       setInitialSelections(new Set(activeSet));
// // // // // // //     } catch (err) {
// // // // // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     loadData();
// // // // // // //   }, []);

// // // // // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // // // // //   const appetenceRanksMap = useMemo(() => {
// // // // // // //     const map = new Map();
// // // // // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // // // // //     etudiants.forEach((etud) => {
// // // // // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // // // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // // // // //       map.set(etud.id, ranks);
// // // // // // //     });

// // // // // // //     return map;
// // // // // // //   }, [apetencesList, etudiants, chefs]);

// // // // // // //   const hasChanges = useMemo(() => {
// // // // // // //     if (selections.size !== initialSelections.size) return true;
// // // // // // //     for (const key of selections) {
// // // // // // //       if (!initialSelections.has(key)) return true;
// // // // // // //     }
// // // // // // //     return false;
// // // // // // //   }, [selections, initialSelections]);

// // // // // // //   const filteredEtudiants = useMemo(() => {
// // // // // // //     const term = searchStudent.toLowerCase().trim();
// // // // // // //     if (!term) return etudiants;
// // // // // // //     return etudiants.filter(
// // // // // // //       (e) =>
// // // // // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // // // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // // // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // // // // //     );
// // // // // // //   }, [etudiants, searchStudent]);

// // // // // // //   const visibleChefs = useMemo(() => {
// // // // // // //     if (selectedChefFilter === 'all') return chefs;
// // // // // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // // // // //   }, [chefs, selectedChefFilter]);

// // // // // // //   const countsPerStudent = useMemo(() => {
// // // // // // //     const map = {};
// // // // // // //     for (const key of selections) {
// // // // // // //       const [etudId] = key.split('-');
// // // // // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // // // // //     }
// // // // // // //     return map;
// // // // // // //   }, [selections]);

// // // // // // //   const countsPerChef = useMemo(() => {
// // // // // // //     const map = {};
// // // // // // //     for (const key of selections) {
// // // // // // //       const [, chefId] = key.split('-');
// // // // // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // // // // //     }
// // // // // // //     return map;
// // // // // // //   }, [selections]);

// // // // // // //   const toggleSelection = (etudiantId, chefId) => {
// // // // // // //     const key = `${etudiantId}-${chefId}`;
// // // // // // //     setSelections((prev) => {
// // // // // // //       const next = new Set(prev);
// // // // // // //       if (next.has(key)) next.delete(key);
// // // // // // //       else next.add(key);
// // // // // // //       return next;
// // // // // // //     });
// // // // // // //     setSuccessMsg(null);
// // // // // // //   };

// // // // // // //   const handleSelectAllVisible = () => {
// // // // // // //     setSelections((prev) => {
// // // // // // //       const next = new Set(prev);
// // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // // // // //       });
// // // // // // //       return next;
// // // // // // //     });
// // // // // // //     setSuccessMsg(null);
// // // // // // //   };

// // // // // // //   const handleDeselectAllVisible = () => {
// // // // // // //     setSelections((prev) => {
// // // // // // //       const next = new Set(prev);
// // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // // // // //       });
// // // // // // //       return next;
// // // // // // //     });
// // // // // // //     setSuccessMsg(null);
// // // // // // //   };

// // // // // // //   const handleSubmit = async () => {
// // // // // // //     try {
// // // // // // //       setSaving(true);
// // // // // // //       setError(null);
// // // // // // //       setSuccessMsg(null);

// // // // // // //       const toAdd = [];
// // // // // // //       selections.forEach((key) => {
// // // // // // //         if (!initialSelections.has(key)) {
// // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // //           toAdd.push({ etudiantId, chefId });
// // // // // // //         }
// // // // // // //       });

// // // // // // //       const toDelete = [];
// // // // // // //       initialSelections.forEach((key) => {
// // // // // // //         if (!selections.has(key)) {
// // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // //           toDelete.push({ etudiantId, chefId });
// // // // // // //         }
// // // // // // //       });

// // // // // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // // // // //         deleteSelection(etudiantId, chefId)
// // // // // // //       );
// // // // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // // // // //         saveSelection(etudiantId, chefId)
// // // // // // //       );

// // // // // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // // // // //       setInitialSelections(new Set(selections));
// // // // // // //       setSuccessMsg(
// // // // // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // // // // //       );
// // // // // // //     } catch (err) {
// // // // // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // // // // //     } finally {
// // // // // // //       setSaving(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Export Excel
// // // // // // //   const handleDownloadSelectionXLSX = () => {
// // // // // // //     try {
// // // // // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // // // // //         alert("Aucune donnée disponible.");
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // // // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // // // // //       );

// // // // // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // // // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // // // // //         const row = {
// // // // // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // // // // //           'Email': etud.adresse_email || '',
// // // // // // //           'Parcours': etud.parcours || 'I2026',
// // // // // // //         };

// // // // // // //         chefs.forEach((chef) => {
// // // // // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // // // // //           const rankInfo = studentRanks?.get(chef.id);
// // // // // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // // // // //         });

// // // // // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // // // // //         return row;
// // // // // // //       });

// // // // // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // // // // //       wsSelections['!cols'] = [
// // // // // // //         { wch: 26 },
// // // // // // //         { wch: 32 },
// // // // // // //         { wch: 12 },
// // // // // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // // // // //         { wch: 16 },
// // // // // // //       ];

// // // // // // //       const statsRows = chefs.map((chef) => ({
// // // // // // //         'Chef de Projet': chef.nom,
// // // // // // //         'Spécialité': chef.specialite || 'N/A',
// // // // // // //         'Email': chef.email || '',
// // // // // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // // // // //       }));

// // // // // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // // // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // // // // //       const workbook = XLSX.utils.book_new();
// // // // // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // // // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // // // // //       const today = new Date().toISOString().slice(0, 10);
// // // // // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // // // // //     } catch (err) {
// // // // // // //       alert(`Erreur export: ${err.message}`);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Popup Radar
// // // // // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // // // // //     if (!etudiantId) return;
// // // // // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // // // // //     setModalOpen(true);
// // // // // // //     setModalLoading(true);
// // // // // // //     setModalError(null);
// // // // // // //     setAptitudesData(null);
// // // // // // //     setApetencesData(null);

// // // // // // //     try {
// // // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // // //         fetchAptitudesByEtudiant(etudiantId),
// // // // // // //         fetchApetencesByEtudiant(etudiantId),
// // // // // // //       ]);

// // // // // // //       if (!aptitudes && !apetences) {
// // // // // // //         setModalError("Aucune compétence ni appétence enregistrée.");
// // // // // // //       } else {
// // // // // // //         setAptitudesData(aptitudes);
// // // // // // //         setApetencesData(apetences);
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // // // // //     } finally {
// // // // // // //       setModalLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const radarChartData = useMemo(() => {
// // // // // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // // // // //     return {
// // // // // // //       labels,
// // // // // // //       datasets: [
// // // // // // //         {
// // // // // // //           label: 'Aptitudes (Technique)',
// // // // // // //           data: aptValues,
// // // // // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // // // // //           borderColor: '#38bdf8',
// // // // // // //           borderWidth: 2,
// // // // // // //           pointBackgroundColor: '#38bdf8',
// // // // // // //         },
// // // // // // //         {
// // // // // // //           label: 'Appétences (Intérêt)',
// // // // // // //           data: apeValues,
// // // // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // // // //           borderColor: '#f43f5e',
// // // // // // //           borderWidth: 2,
// // // // // // //           pointBackgroundColor: '#f43f5e',
// // // // // // //         },
// // // // // // //       ],
// // // // // // //     };
// // // // // // //   }, [aptitudesData, apetencesData]);

// // // // // // //   const radarOptions = {
// // // // // // //     responsive: true,
// // // // // // //     maintainAspectRatio: false,
// // // // // // //     scales: {
// // // // // // //       r: {
// // // // // // //         min: 0,
// // // // // // //         suggestedMax: 4,
// // // // // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // // // //       },
// // // // // // //     },
// // // // // // //     plugins: {
// // // // // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // // // // //     },
// // // // // // //   };

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // // // //         <Spinner animation="border" variant="info" />
// // // // // // //         <p className="mt-3 text-muted fw-semibold">Chargement de la matrice des sélections...</p>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <style>{`
// // // // // // //         .matrix-page-wrapper {
// // // // // // //           max-width: 98%;
// // // // // // //           margin: 0 auto;
// // // // // // //           padding: 1.5rem 0 3rem 0;
// // // // // // //           color: #f8fafc;
// // // // // // //         }
// // // // // // //         .glass-card-matrix {
// // // // // // //           background: rgba(18, 24, 38, 0.85);
// // // // // // //           backdrop-filter: blur(16px);
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // //           border-radius: 16px;
// // // // // // //         }
// // // // // // //         .kpi-matrix {
// // // // // // //           padding: 1.2rem;
// // // // // // //           border-radius: 16px;
// // // // // // //           background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%);
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.06);
// // // // // // //         }
// // // // // // //         .table-scroll-container {
// // // // // // //           width: 100%;
// // // // // // //           max-height: calc(100vh - 290px);
// // // // // // //           min-height: 480px;
// // // // // // //           overflow-x: auto;
// // // // // // //           overflow-y: auto;
// // // // // // //           border-radius: 16px;
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // //           background: rgba(18, 24, 38, 0.9);
// // // // // // //         }
// // // // // // //         .matrix-table {
// // // // // // //           width: 100%;
// // // // // // //           border-collapse: separate;
// // // // // // //           border-spacing: 0;
// // // // // // //           color: #e2e8f0;
// // // // // // //         }
// // // // // // //         .matrix-table thead th {
// // // // // // //           position: sticky;
// // // // // // //           top: 0;
// // // // // // //           background: #0f172a !important;
// // // // // // //           z-index: 10;
// // // // // // //           padding: 0.85rem 0.6rem;
// // // // // // //           border-bottom: 2px solid rgba(99, 102, 241, 0.3);
// // // // // // //         }
// // // // // // //         .matrix-table tbody tr:hover {
// // // // // // //           background-color: rgba(99, 102, 241, 0.08) !important;
// // // // // // //         }
// // // // // // //         .badge-rank-selection {
// // // // // // //           display: inline-flex;
// // // // // // //           align-items: center;
// // // // // // //           gap: 6px;
// // // // // // //           padding: 4px 10px;
// // // // // // //           border-radius: 8px;
// // // // // // //           font-weight: 700;
// // // // // // //           font-size: 0.78rem;
// // // // // // //           cursor: pointer;
// // // // // // //           transition: transform 0.15s ease, box-shadow 0.15s ease;
// // // // // // //         }
// // // // // // //         .badge-rank-selection:hover {
// // // // // // //           transform: scale(1.06);
// // // // // // //           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
// // // // // // //         }
// // // // // // //       `}</style>

// // // // // // //       <Navbar />

// // // // // // //       <div className="matrix-page-wrapper">
// // // // // // //         {/* Header */}
// // // // // // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // // // // // //           <div>
// // // // // // //             <div className="d-flex align-items-center gap-2">
// // // // // // //               <span style={{ fontSize: '1.8rem' }}>🎯</span>
// // // // // // //               <h2 className="fw-bold mb-0 text-white">Sélections & Classement par Appétences</h2>
// // // // // // //             </div>
// // // // // // //             <p className="text-light opacity-75 small mt-1 mb-0">
// // // // // // //               💡 <em>Le rang de chaque chef (1er, 2e, 3e...) est calculé automatiquement d'après les appétences de l'étudiant pour sa thématique.</em>
// // // // // // //             </p>
// // // // // // //           </div>

// // // // // // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // // //             {hasChanges && (
// // // // // // //               <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">
// // // // // // //                 ⚠️ Modifications non enregistrées
// // // // // // //               </Badge>
// // // // // // //             )}

// // // // // // //             <Button variant="success" size="sm" onClick={handleDownloadSelectionXLSX} className="px-3 py-2 fw-semibold">
// // // // // // //               📊 Exporter Tableau (.xlsx)
// // // // // // //             </Button>

// // // // // // //             <Button
// // // // // // //               variant="primary"
// // // // // // //               size="sm"
// // // // // // //               onClick={handleSubmit}
// // // // // // //               disabled={saving || !hasChanges}
// // // // // // //               className="px-4 py-2 fw-semibold"
// // // // // // //             >
// // // // // // //               {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer les sélections'}
// // // // // // //             </Button>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // //         {/* Cartes KPI */}
// // // // // // //         <Row className="g-3 mb-4">
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-matrix">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Total Sélections</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-info">{selections.size}</div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-matrix">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Étudiants avec Vœux</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-success">
// // // // // // //                 {Object.values(countsPerStudent).filter((c) => c > 0).length} <span className="fs-6 text-muted">/ {etudiants.length}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-matrix">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-warning">{chefs.length}</div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-matrix">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Étudiants Filtrés</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-light">
// // // // // // //                 {filteredEtudiants.length} <span className="fs-6 text-muted">/ {etudiants.length}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //         </Row>

// // // // // // //         {/* Barre de Filtres */}
// // // // // // //         <Card className="glass-card-matrix mb-4 p-3 shadow-sm">
// // // // // // //           <Row className="g-3 align-items-center">
// // // // // // //             <Col md={4}>
// // // // // // //               <Form.Label className="mb-1 text-muted small fw-semibold">🔍 Rechercher un étudiant</Form.Label>
// // // // // // //               <InputGroup size="sm">
// // // // // // //                 <Form.Control
// // // // // // //                   placeholder="Nom, prénom ou adresse email..."
// // // // // // //                   className="bg-dark text-white border-secondary"
// // // // // // //                   value={searchStudent}
// // // // // // //                   onChange={(e) => setSearchStudent(e.target.value)}
// // // // // // //                 />
// // // // // // //                 {searchStudent && (
// // // // // // //                   <Button variant="outline-secondary" onClick={() => setSearchStudent('')}>✕</Button>
// // // // // // //                 )}
// // // // // // //               </InputGroup>
// // // // // // //             </Col>

// // // // // // //             <Col md={4}>
// // // // // // //               <Form.Label className="mb-1 text-muted small fw-semibold">👨‍🏫 Filtrer par chef de projet</Form.Label>
// // // // // // //               <Form.Select
// // // // // // //                 size="sm"
// // // // // // //                 className="bg-dark text-white border-secondary"
// // // // // // //                 value={selectedChefFilter}
// // // // // // //                 onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // // // //               >
// // // // // // //                 <option value="all">Tous les chefs de projet ({chefs.length})</option>
// // // // // // //                 {chefs.map((c) => (
// // // // // // //                   <option key={c.id} value={c.id}>
// // // // // // //                     {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // // // //                   </option>
// // // // // // //                 ))}
// // // // // // //               </Form.Select>
// // // // // // //             </Col>

// // // // // // //             <Col md={4} className="d-flex gap-2 align-items-end justify-content-md-end pt-2 pt-md-0">
// // // // // // //               <Button variant="outline-info" size="sm" onClick={handleSelectAllVisible}>
// // // // // // //                 Tout cocher (visibles)
// // // // // // //               </Button>
// // // // // // //               <Button variant="outline-secondary" size="sm" onClick={handleDeselectAllVisible}>
// // // // // // //                 Tout décocher
// // // // // // //               </Button>
// // // // // // //             </Col>
// // // // // // //           </Row>
// // // // // // //         </Card>

// // // // // // //         {/* Tableau Matriciel avec Rangs d'Appétence */}
// // // // // // //         <div className="table-scroll-container">
// // // // // // //           <Table size="sm" className="matrix-table text-center text-nowrap align-middle">
// // // // // // //             <thead>
// // // // // // //               <tr>
// // // // // // //                 <th style={{ minWidth: '290px', textAlign: 'left', position: 'sticky', left: 0, top: 0, backgroundColor: '#0f172a', zIndex: 20, paddingLeft: '1.25rem' }}>
// // // // // // //                   Étudiant ({filteredEtudiants.length})
// // // // // // //                 </th>
// // // // // // //                 <th style={{ width: '80px', position: 'sticky', top: 0, backgroundColor: '#0f172a', zIndex: 10 }}>
// // // // // // //                   Total
// // // // // // //                 </th>
// // // // // // //                 {visibleChefs.map((chef) => (
// // // // // // //                   <th key={chef.id} style={{ minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#0f172a', zIndex: 10, verticalAlign: 'top' }}>
// // // // // // //                     <div className="fw-bold text-white">{chef.nom}</div>
// // // // // // //                     {chef.specialite && (
// // // // // // //                       <div className="text-muted small fw-normal text-truncate" style={{ maxWidth: '140px' }} title={chef.specialite}>
// // // // // // //                         {chef.specialite}
// // // // // // //                       </div>
// // // // // // //                     )}
// // // // // // //                     <Badge bg="secondary" className="mt-1 px-2 py-1">
// // // // // // //                       {countsPerChef[chef.id] || 0} vœu(x)
// // // // // // //                     </Badge>
// // // // // // //                   </th>
// // // // // // //                 ))}
// // // // // // //               </tr>
// // // // // // //             </thead>
// // // // // // //             <tbody>
// // // // // // //               {filteredEtudiants.length === 0 ? (
// // // // // // //                 <tr>
// // // // // // //                   <td colSpan={visibleChefs.length + 2} className="text-center py-5 text-muted">
// // // // // // //                     Aucun étudiant trouvé.
// // // // // // //                   </td>
// // // // // // //                 </tr>
// // // // // // //               ) : (
// // // // // // //                 filteredEtudiants.map((etud) => {
// // // // // // //                   const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // // // //                   const studentRanks = appetenceRanksMap.get(etud.id);

// // // // // // //                   return (
// // // // // // //                     <tr key={etud.id}>
// // // // // // //                       {/* Colonne Étudiant */}
// // // // // // //                       <td style={{ textAlign: 'left', position: 'sticky', left: 0, backgroundColor: '#131c2e', zIndex: 5, paddingLeft: '1.25rem' }}>
// // // // // // //                         <div className="d-flex align-items-center justify-content-between gap-2">
// // // // // // //                           <div
// // // // // // //                             style={{ cursor: 'pointer' }}
// // // // // // //                             onClick={() => handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)}
// // // // // // //                           >
// // // // // // //                             <div className="fw-semibold text-info text-decoration-underline">
// // // // // // //                               {etud.nom} {etud.prenom} 📊
// // // // // // //                             </div>
// // // // // // //                             <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // // // // // //                               {etud.adresse_email}
// // // // // // //                             </div>
// // // // // // //                           </div>

// // // // // // //                           <div className="d-flex gap-1 me-2">
// // // // // // //                             {etud.cv_path && (
// // // // // // //                               <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // // // // // //                                 📄 CV
// // // // // // //                               </a>
// // // // // // //                             )}
// // // // // // //                             {etud.lm_path && (
// // // // // // //                               <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // // // // // //                                 ✉️ LM
// // // // // // //                               </a>
// // // // // // //                             )}
// // // // // // //                           </div>
// // // // // // //                         </div>
// // // // // // //                       </td>

// // // // // // //                       {/* Total */}
// // // // // // //                       <td style={{ backgroundColor: '#131c2e' }}>
// // // // // // //                         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // //                       </td>

// // // // // // //                       {/* Cellules Sélection avec Rang d'Appétence */}
// // // // // // //                       {visibleChefs.map((chef) => {
// // // // // // //                         const key = `${etud.id}-${chef.id}`;
// // // // // // //                         const isSelected = selections.has(key);
// // // // // // //                         const rankInfo = studentRanks?.get(chef.id);
// // // // // // //                         const rankNum = rankInfo?.rank || 1;

// // // // // // //                         return (
// // // // // // //                           <td key={chef.id} style={{ backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'transparent' }}>
// // // // // // //                             {isSelected ? (
// // // // // // //                               <div
// // // // // // //                                 className="badge-rank-selection"
// // // // // // //                                 style={getRankBadgeStyle(rankNum)}
// // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // //                                 title={`Cliquer pour retirer (${rankNum}e choix par appétence, note: ${rankInfo?.score ?? 0}/4)`}
// // // // // // //                               >
// // // // // // //                                 <span>✓</span>
// // // // // // //                                 <span>{rankNum === 1 ? '1er' : `${rankNum}e`}</span>
// // // // // // //                               </div>
// // // // // // //                             ) : (
// // // // // // //                               <Button
// // // // // // //                                 variant="outline-secondary"
// // // // // // //                                 size="sm"
// // // // // // //                                 style={{ padding: '2px 8px', fontSize: '0.75rem', opacity: 0.4 }}
// // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // //                                 title={`Sélectionner (${rankNum}e choix par appétence)`}
// // // // // // //                               >
// // // // // // //                                 +
// // // // // // //                               </Button>
// // // // // // //                             )}
// // // // // // //                           </td>
// // // // // // //                         );
// // // // // // //                       })}
// // // // // // //                     </tr>
// // // // // // //                   );
// // // // // // //                 })
// // // // // // //               )}
// // // // // // //             </tbody>
// // // // // // //           </Table>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Modal Radar */}
// // // // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
// // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // // // //         </Modal.Header>
// // // // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // // //           {modalLoading ? (
// // // // // // //             <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
// // // // // // //           ) : modalError ? (
// // // // // // //             <Alert variant="warning">{modalError}</Alert>
// // // // // // //           ) : (
// // // // // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </Modal.Body>
// // // // // // //         <Modal.Footer>
// // // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // // // // //         </Modal.Footer>
// // // // // // //       </Modal>
// // // // // // //     </>
// // // // // // //   );
// // // // // // // }


// // // // // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // // // // import {
// // // // // //   Table,
// // // // // //   Button,
// // // // // //   Alert,
// // // // // //   Spinner,
// // // // // //   Form,
// // // // // //   InputGroup,
// // // // // //   Badge,
// // // // // //   Modal,
// // // // // // } from 'react-bootstrap';
// // // // // // import * as XLSX from 'xlsx';
// // // // // // import {
// // // // // //   Chart as ChartJS,
// // // // // //   RadialLinearScale,
// // // // // //   PointElement,
// // // // // //   LineElement,
// // // // // //   Filler,
// // // // // //   Tooltip,
// // // // // //   Legend,
// // // // // // } from 'chart.js';
// // // // // // import { Radar } from 'react-chartjs-2';
// // // // // // import Navbar from './Navbar';
// // // // // // import {
// // // // // //   fetchChefsDeProjet,
// // // // // //   fetchEtudiants,
// // // // // //   fetchSelections,
// // // // // //   saveSelection,
// // // // // //   deleteSelection,
// // // // // //   fetchAllApetences,
// // // // // //   fetchAptitudesByEtudiant,
// // // // // //   fetchApetencesByEtudiant,
// // // // // //   computeChefRanksForStudent,
// // // // // //   getDocumentPublicUrl,
// // // // // // } from '../services/supabase';

// // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // // ============================================================================
// // // // // // // Constantes & helpers métier (logique inchangée)
// // // // // // // ============================================================================

// // // // // // const COMPETENCE_KEYS = [
// // // // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // // // ];

// // // // // // const getRankBadgeStyle = (rank) => {
// // // // // //   switch (rank) {
// // // // // //     case 1:
// // // // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // // // //     case 2:
// // // // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // // // //     case 3:
// // // // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // // // //     default:
// // // // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // // // //   }
// // // // // // };

// // // // // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // // // // // Abréviation d'un chef pour l'affichage compact des en-têtes de colonne
// // // // // // // (4 premières lettres du nom, plus lisible que de simples initiales)
// // // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // // ============================================================================
// // // // // // // Hook responsive (bascule automatique vers la vue mobile)
// // // // // // // ============================================================================

// // // // // // function useIsMobile(breakpoint = 768) {
// // // // // //   const [isMobile, setIsMobile] = useState(
// // // // // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // // // // //   );

// // // // // //   useEffect(() => {
// // // // // //     if (typeof window === 'undefined') return undefined;
// // // // // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // // // // //     const handler = (e) => setIsMobile(e.matches);
// // // // // //     setIsMobile(mql.matches);
// // // // // //     mql.addEventListener('change', handler);
// // // // // //     return () => mql.removeEventListener('change', handler);
// // // // // //   }, [breakpoint]);

// // // // // //   return isMobile;
// // // // // // }

// // // // // // // ============================================================================
// // // // // // // Styles
// // // // // // // ============================================================================

// // // // // // const STYLE_SHEET = `
// // // // // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // // // // .matrix-page {
// // // // // //   --bg: #0a0d12;
// // // // // //   --surface: #12161f;
// // // // // //   --surface-2: #1a2029;
// // // // // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // // // // //   --border: #232a37;
// // // // // //   --text: #e9ecf1;
// // // // // //   --text-muted: #8b93a5;
// // // // // //   --text-faint: #5a6272;
// // // // // //   --accent: #2dd4bf;
// // // // // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // // // // //   font-family: 'Inter', -apple-system, sans-serif;
// // // // // //   background: var(--bg);
// // // // // //   min-height: 100vh;
// // // // // //   color: var(--text);
// // // // // // }
// // // // // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // // // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // // // // .matrix-shell {
// // // // // //   max-width: 100%;
// // // // // //   margin: 0 auto;
// // // // // //   padding: 1.25rem 1.5rem 2rem;
// // // // // // }

// // // // // // /* ---------- Header ---------- */
// // // // // // .matrix-header {
// // // // // //   display: flex;
// // // // // //   justify-content: space-between;
// // // // // //   align-items: center;
// // // // // //   gap: 1rem;
// // // // // //   flex-wrap: wrap;
// // // // // //   margin-bottom: 0.9rem;
// // // // // // }
// // // // // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // // // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }

// // // // // // .btn-pill {
// // // // // //   border-radius: 999px !important;
// // // // // //   font-weight: 600 !important;
// // // // // //   font-size: 0.82rem !important;
// // // // // //   padding: 0.45rem 1rem !important;
// // // // // //   border: 1px solid var(--border) !important;
// // // // // // }
// // // // // // .btn-save-pill {
// // // // // //   background: var(--accent) !important;
// // // // // //   border: none !important;
// // // // // //   color: #06201c !important;
// // // // // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // // // // }
// // // // // // .btn-save-pill:disabled { opacity: 0.5; }
// // // // // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // // // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // .pending-chip {
// // // // // //   display: inline-flex;
// // // // // //   align-items: center;
// // // // // //   gap: 0.35rem;
// // // // // //   background: rgba(245, 158, 11, 0.14);
// // // // // //   color: #fbbf24;
// // // // // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // // // // //   border-radius: 999px;
// // // // // //   padding: 0.3rem 0.75rem;
// // // // // //   font-size: 0.78rem;
// // // // // //   font-weight: 600;
// // // // // // }

// // // // // // /* ---------- Toolbar unique (fusion KPI + filtres) ---------- */
// // // // // // .matrix-toolbar {
// // // // // //   background: var(--surface);
// // // // // //   border: 1px solid var(--border);
// // // // // //   border-radius: 14px;
// // // // // //   padding: 0.75rem 0.9rem;
// // // // // //   margin-bottom: 0.9rem;
// // // // // //   display: flex;
// // // // // //   align-items: center;
// // // // // //   gap: 0.9rem;
// // // // // //   flex-wrap: wrap;
// // // // // // }
// // // // // // .matrix-toolbar .form-control,
// // // // // // .matrix-toolbar .form-select {
// // // // // //   background: var(--surface-2);
// // // // // //   border: 1px solid var(--border);
// // // // // //   color: var(--text);
// // // // // //   font-size: 0.85rem;
// // // // // // }
// // // // // // .matrix-toolbar .form-control:focus,
// // // // // // .matrix-toolbar .form-select:focus {
// // // // // //   background: var(--surface-2);
// // // // // //   border-color: var(--accent);
// // // // // //   color: var(--text);
// // // // // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // // // // }
// // // // // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // // // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // // // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // // // // .stat-chip {
// // // // // //   background: var(--surface-2);
// // // // // //   border: 1px solid var(--border);
// // // // // //   border-radius: 999px;
// // // // // //   padding: 0.32rem 0.7rem;
// // // // // //   font-size: 0.76rem;
// // // // // //   color: var(--text-muted);
// // // // // //   white-space: nowrap;
// // // // // // }
// // // // // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // // // // .stat-chip.accent strong { color: var(--accent); }

// // // // // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // // // // .segmented {
// // // // // //   display: inline-flex;
// // // // // //   background: var(--surface-2);
// // // // // //   border: 1px solid var(--border);
// // // // // //   border-radius: 8px;
// // // // // //   padding: 2px;
// // // // // //   gap: 2px;
// // // // // // }
// // // // // // .segmented button {
// // // // // //   border: none;
// // // // // //   background: transparent;
// // // // // //   color: var(--text-faint);
// // // // // //   font-size: 0.74rem;
// // // // // //   font-weight: 600;
// // // // // //   padding: 0.3rem 0.55rem;
// // // // // //   border-radius: 6px;
// // // // // //   cursor: pointer;
// // // // // //   transition: background 0.12s ease, color 0.12s ease;
// // // // // // }
// // // // // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // // // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // // // // .btn-ghost {
// // // // // //   background: transparent !important;
// // // // // //   border: 1px solid var(--border) !important;
// // // // // //   color: var(--text-muted) !important;
// // // // // //   font-size: 0.78rem !important;
// // // // // //   border-radius: 8px !important;
// // // // // //   padding: 0.35rem 0.65rem !important;
// // // // // // }
// // // // // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // /* ---------- Tableau matriciel ---------- */
// // // // // // .table-scroll-container {
// // // // // //   width: 100%;
// // // // // //   max-height: calc(100vh - 230px);
// // // // // //   min-height: 420px;
// // // // // //   overflow: auto;
// // // // // //   border-radius: 14px;
// // // // // //   border: 1px solid var(--border);
// // // // // //   background: var(--surface);
// // // // // // }
// // // // // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // // // // .matrix-table thead th {
// // // // // //   position: sticky;
// // // // // //   top: 0;
// // // // // //   background: #0f1420 !important;
// // // // // //   z-index: 10;
// // // // // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // // // // //   vertical-align: middle;
// // // // // // }

// // // // // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // // // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // // // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // // // // .student-cell { white-space: normal; }
// // // // // // .student-cell-inner { max-width: 100%; }
// // // // // // .student-cell-name {
// // // // // //   display: block;
// // // // // //   font-weight: 600;
// // // // // //   color: var(--accent);
// // // // // //   cursor: pointer;
// // // // // //   text-decoration: none;
// // // // // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // // // // //   white-space: nowrap;
// // // // // //   overflow: hidden;
// // // // // //   text-overflow: ellipsis;
// // // // // // }
// // // // // // .student-cell-name:hover { color: #6ee7de; }
// // // // // // .student-cell-email {
// // // // // //   color: var(--text-faint);
// // // // // //   font-size: 0.7rem;
// // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // //   white-space: nowrap;
// // // // // //   overflow: hidden;
// // // // // //   text-overflow: ellipsis;
// // // // // // }

// // // // // // .doc-badge {
// // // // // //   font-size: 0.68rem;
// // // // // //   padding: 0.15rem 0.4rem;
// // // // // //   border-radius: 5px;
// // // // // //   background: var(--surface-2) !important;
// // // // // //   border: 1px solid var(--border);
// // // // // //   color: var(--text-muted) !important;
// // // // // //   text-decoration: none !important;
// // // // // // }

// // // // // // .chef-head-cell { text-align: center; }
// // // // // // .chef-avatar {
// // // // // //   min-width: 40px;
// // // // // //   height: 24px;
// // // // // //   padding: 0 6px;
// // // // // //   border-radius: 7px;
// // // // // //   background: var(--surface-2);
// // // // // //   border: 1px solid var(--border);
// // // // // //   display: inline-flex;
// // // // // //   align-items: center;
// // // // // //   justify-content: center;
// // // // // //   font-size: 0.66rem;
// // // // // //   font-weight: 700;
// // // // // //   letter-spacing: 0.02em;
// // // // // //   color: var(--accent);
// // // // // //   margin-bottom: 2px;
// // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // }
// // // // // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // // // // .chef-specialite {
// // // // // //   color: var(--text-faint);
// // // // // //   font-weight: 400;
// // // // // //   font-size: 0.68rem;
// // // // // //   max-width: 130px;
// // // // // //   white-space: nowrap;
// // // // // //   overflow: hidden;
// // // // // //   text-overflow: ellipsis;
// // // // // //   margin: 0 auto;
// // // // // // }
// // // // // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // // // .badge-rank-selection {
// // // // // //   display: inline-flex;
// // // // // //   align-items: center;
// // // // // //   gap: 5px;
// // // // // //   padding: 3px 9px;
// // // // // //   border-radius: 7px;
// // // // // //   font-weight: 700;
// // // // // //   font-size: 0.74rem;
// // // // // //   pointer-events: none;
// // // // // // }
// // // // // // .sel-cell-empty {
// // // // // //   display: inline-flex;
// // // // // //   width: 26px;
// // // // // //   height: 22px;
// // // // // //   align-items: center;
// // // // // //   justify-content: center;
// // // // // //   border-radius: 7px;
// // // // // //   border: 1px dashed var(--border);
// // // // // //   color: var(--text-faint);
// // // // // //   font-size: 0.85rem;
// // // // // //   opacity: 0.6;
// // // // // //   transition: opacity 0.12s ease, border-color 0.12s ease;
// // // // // // }
// // // // // // .sel-cell:hover .sel-cell-empty { opacity: 1; border-color: var(--accent); color: var(--accent); }

// // // // // // /* ---------- Vue mobile (accordéon) ---------- */
// // // // // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // // // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // // // // .mobile-card-head {
// // // // // //   display: flex;
// // // // // //   align-items: center;
// // // // // //   gap: 0.7rem;
// // // // // //   padding: 0.75rem 0.85rem;
// // // // // //   cursor: pointer;
// // // // // // }
// // // // // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // // // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // // // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // // // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // // // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // // // // .mobile-chef-chip {
// // // // // //   display: inline-flex;
// // // // // //   align-items: center;
// // // // // //   gap: 0.35rem;
// // // // // //   padding: 0.35rem 0.6rem;
// // // // // //   border-radius: 999px;
// // // // // //   font-size: 0.76rem;
// // // // // //   font-weight: 600;
// // // // // //   cursor: pointer;
// // // // // //   border: 1px solid var(--border);
// // // // // //   background: var(--surface-2);
// // // // // //   color: var(--text-muted);
// // // // // // }

// // // // // // .empty-state {
// // // // // //   text-align: center;
// // // // // //   padding: 3rem 1rem;
// // // // // //   color: var(--text-muted);
// // // // // // }

// // // // // // /* ---------- Modal radar ---------- */
// // // // // // .modal-dark .modal-content { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
// // // // // // .modal-dark .modal-header { border-bottom: 1px solid var(--border); }
// // // // // // .modal-dark .modal-footer { border-top: 1px solid var(--border); }
// // // // // // .modal-dark .modal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }

// // // // // // @media (max-width: 767px) {
// // // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // // //   .bulk-actions { margin-left: 0; }
// // // // // // }
// // // // // // `;

// // // // // // // ============================================================================
// // // // // // // Sous-composants de présentation
// // // // // // // ============================================================================

// // // // // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // // // // //   return (
// // // // // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // // // // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // // // // //       {showFullNames && (
// // // // // //         <>
// // // // // //           <div className="chef-fullname">{chef.nom}</div>
// // // // // //           {chef.specialite && (
// // // // // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // // // // //           )}
// // // // // //         </>
// // // // // //       )}
// // // // // //       <div>
// // // // // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // // // // //       </div>
// // // // // //     </th>
// // // // // //   );
// // // // // // }

// // // // // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // // // // //   return (
// // // // // //     <td className="sel-cell" onClick={onClick}>
// // // // // //       {selected ? (
// // // // // //         <span
// // // // // //           className="badge-rank-selection"
// // // // // //           style={getRankBadgeStyle(rankNum)}
// // // // // //           title={`Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`}
// // // // // //         >
// // // // // //           ✓ {rankLabel(rankNum)}
// // // // // //         </span>
// // // // // //       ) : (
// // // // // //         <span className="sel-cell-empty" title={`Sélectionner (${rankLabel(rankNum)} choix par appétence)`}>+</span>
// // // // // //       )}
// // // // // //     </td>
// // // // // //   );
// // // // // // }

// // // // // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // // // // //   return (
// // // // // //     <div className="mobile-card">
// // // // // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // // // // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // // // // //         <div style={{ flex: 1, minWidth: 0 }}>
// // // // // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // // // // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // // // // //         </div>
// // // // // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // //       </div>
// // // // // //       {expanded && (
// // // // // //         <div className="mobile-card-body">
// // // // // //           <Button
// // // // // //             size="sm"
// // // // // //             className="btn-ghost"
// // // // // //             onClick={(e) => {
// // // // // //               e.stopPropagation();
// // // // // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // // // // //             }}
// // // // // //           >
// // // // // //             📊 Profil compétences
// // // // // //           </Button>
// // // // // //           {chefs.map((chef) => {
// // // // // //             const key = `${etud.id}-${chef.id}`;
// // // // // //             const isSelected = selections.has(key);
// // // // // //             const rankInfo = studentRanks?.get(chef.id);
// // // // // //             const rankNum = rankInfo?.rank || 1;
// // // // // //             return (
// // // // // //               <span
// // // // // //                 key={chef.id}
// // // // // //                 className="mobile-chef-chip"
// // // // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // // // //               >
// // // // // //                 {isSelected ? `✓ ${chef.nom} · ${rankLabel(rankNum)}` : chef.nom}
// // // // // //               </span>
// // // // // //             );
// // // // // //           })}
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // // ============================================================================
// // // // // // // Composant principal
// // // // // // // ============================================================================

// // // // // // export default function SelectionPage() {
// // // // // //   const [chefs, setChefs] = useState([]);
// // // // // //   const [etudiants, setEtudiants] = useState([]);
// // // // // //   const [apetencesList, setApetencesList] = useState([]);

// // // // // //   // Set de "etudiantId-chefId"
// // // // // //   const [selections, setSelections] = useState(new Set());
// // // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [saving, setSaving] = useState(false);
// // // // // //   const [error, setError] = useState(null);
// // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // //   // Réglages d'affichage (purement UI, n'affectent aucune donnée)
// // // // // //   const [density, setDensity] = useState('compact'); // 'compact' | 'comfortable'
// // // // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // // // // //   // Modal Radar
// // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // //   const [modalError, setModalError] = useState(null);

// // // // // //   const isMobile = useIsMobile(768);

// // // // // //   const loadData = async () => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       setError(null);

// // // // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // // // //         fetchChefsDeProjet(),
// // // // // //         fetchEtudiants(),
// // // // // //         fetchSelections(),
// // // // // //         fetchAllApetences(),
// // // // // //       ]);

// // // // // //       setChefs(chefsData || []);
// // // // // //       setEtudiants(etudiantsData || []);
// // // // // //       setApetencesList(apetencesDataRaw || []);

// // // // // //       const activeSet = new Set();
// // // // // //       (selectionsData || []).forEach((s) => {
// // // // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // // // //         }
// // // // // //       });

// // // // // //       setSelections(new Set(activeSet));
// // // // // //       setInitialSelections(new Set(activeSet));
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     loadData();
// // // // // //   }, []);

// // // // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // // // //   const appetenceRanksMap = useMemo(() => {
// // // // // //     const map = new Map();
// // // // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // // // //     etudiants.forEach((etud) => {
// // // // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // // // //       map.set(etud.id, ranks);
// // // // // //     });

// // // // // //     return map;
// // // // // //   }, [apetencesList, etudiants, chefs]);

// // // // // //   const hasChanges = useMemo(() => {
// // // // // //     if (selections.size !== initialSelections.size) return true;
// // // // // //     for (const key of selections) {
// // // // // //       if (!initialSelections.has(key)) return true;
// // // // // //     }
// // // // // //     return false;
// // // // // //   }, [selections, initialSelections]);

// // // // // //   const filteredEtudiants = useMemo(() => {
// // // // // //     const term = searchStudent.toLowerCase().trim();
// // // // // //     if (!term) return etudiants;
// // // // // //     return etudiants.filter(
// // // // // //       (e) =>
// // // // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // // // //     );
// // // // // //   }, [etudiants, searchStudent]);

// // // // // //   const visibleChefs = useMemo(() => {
// // // // // //     if (selectedChefFilter === 'all') return chefs;
// // // // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // // // //   }, [chefs, selectedChefFilter]);

// // // // // //   const countsPerStudent = useMemo(() => {
// // // // // //     const map = {};
// // // // // //     for (const key of selections) {
// // // // // //       const [etudId] = key.split('-');
// // // // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // // // //     }
// // // // // //     return map;
// // // // // //   }, [selections]);

// // // // // //   const countsPerChef = useMemo(() => {
// // // // // //     const map = {};
// // // // // //     for (const key of selections) {
// // // // // //       const [, chefId] = key.split('-');
// // // // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // // // //     }
// // // // // //     return map;
// // // // // //   }, [selections]);

// // // // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // // // //     const key = `${etudiantId}-${chefId}`;
// // // // // //     setSelections((prev) => {
// // // // // //       const next = new Set(prev);
// // // // // //       if (next.has(key)) next.delete(key);
// // // // // //       else next.add(key);
// // // // // //       return next;
// // // // // //     });
// // // // // //     setSuccessMsg(null);
// // // // // //   }, []);

// // // // // //   const handleSelectAllVisible = () => {
// // // // // //     setSelections((prev) => {
// // // // // //       const next = new Set(prev);
// // // // // //       filteredEtudiants.forEach((e) => {
// // // // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // // // //       });
// // // // // //       return next;
// // // // // //     });
// // // // // //     setSuccessMsg(null);
// // // // // //   };

// // // // // //   const handleDeselectAllVisible = () => {
// // // // // //     setSelections((prev) => {
// // // // // //       const next = new Set(prev);
// // // // // //       filteredEtudiants.forEach((e) => {
// // // // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // // // //       });
// // // // // //       return next;
// // // // // //     });
// // // // // //     setSuccessMsg(null);
// // // // // //   };

// // // // // //   const handleSubmit = async () => {
// // // // // //     try {
// // // // // //       setSaving(true);
// // // // // //       setError(null);
// // // // // //       setSuccessMsg(null);

// // // // // //       const toAdd = [];
// // // // // //       selections.forEach((key) => {
// // // // // //         if (!initialSelections.has(key)) {
// // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // //           toAdd.push({ etudiantId, chefId });
// // // // // //         }
// // // // // //       });

// // // // // //       const toDelete = [];
// // // // // //       initialSelections.forEach((key) => {
// // // // // //         if (!selections.has(key)) {
// // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // //           toDelete.push({ etudiantId, chefId });
// // // // // //         }
// // // // // //       });

// // // // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // // // //         deleteSelection(etudiantId, chefId)
// // // // // //       );
// // // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // // // //         saveSelection(etudiantId, chefId)
// // // // // //       );

// // // // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // // // //       setInitialSelections(new Set(selections));
// // // // // //       setSuccessMsg(
// // // // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // // // //       );
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // // // //     } finally {
// // // // // //       setSaving(false);
// // // // // //     }
// // // // // //   };

// // // // // //   // Export Excel
// // // // // //   const handleDownloadSelectionXLSX = () => {
// // // // // //     try {
// // // // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // // // //         alert('Aucune donnée disponible.');
// // // // // //         return;
// // // // // //       }

// // // // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // // // //       );

// // // // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // // // //         const row = {
// // // // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // // // //           'Email': etud.adresse_email || '',
// // // // // //           'Parcours': etud.parcours || 'I2026',
// // // // // //         };

// // // // // //         chefs.forEach((chef) => {
// // // // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // // // //           const rankInfo = studentRanks?.get(chef.id);
// // // // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // // // //         });

// // // // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // // // //         return row;
// // // // // //       });

// // // // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // // // //       wsSelections['!cols'] = [
// // // // // //         { wch: 26 },
// // // // // //         { wch: 32 },
// // // // // //         { wch: 12 },
// // // // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // // // //         { wch: 16 },
// // // // // //       ];

// // // // // //       const statsRows = chefs.map((chef) => ({
// // // // // //         'Chef de Projet': chef.nom,
// // // // // //         'Spécialité': chef.specialite || 'N/A',
// // // // // //         'Email': chef.email || '',
// // // // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // // // //       }));

// // // // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // // // //       const workbook = XLSX.utils.book_new();
// // // // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // // // //       const today = new Date().toISOString().slice(0, 10);
// // // // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // // // //     } catch (err) {
// // // // // //       alert(`Erreur export: ${err.message}`);
// // // // // //     }
// // // // // //   };

// // // // // //   // Popup Radar
// // // // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // // // //     if (!etudiantId) return;
// // // // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // // // //     setModalOpen(true);
// // // // // //     setModalLoading(true);
// // // // // //     setModalError(null);
// // // // // //     setAptitudesData(null);
// // // // // //     setApetencesData(null);

// // // // // //     try {
// // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // //         fetchAptitudesByEtudiant(etudiantId),
// // // // // //         fetchApetencesByEtudiant(etudiantId),
// // // // // //       ]);

// // // // // //       if (!aptitudes && !apetences) {
// // // // // //         setModalError('Aucune compétence ni appétence enregistrée.');
// // // // // //       } else {
// // // // // //         setAptitudesData(aptitudes);
// // // // // //         setApetencesData(apetences);
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // // // //     } finally {
// // // // // //       setModalLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const radarChartData = useMemo(() => {
// // // // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // // // //     return {
// // // // // //       labels,
// // // // // //       datasets: [
// // // // // //         {
// // // // // //           label: 'Aptitudes (Technique)',
// // // // // //           data: aptValues,
// // // // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // // // //           borderColor: '#38bdf8',
// // // // // //           borderWidth: 2,
// // // // // //           pointBackgroundColor: '#38bdf8',
// // // // // //         },
// // // // // //         {
// // // // // //           label: 'Appétences (Intérêt)',
// // // // // //           data: apeValues,
// // // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // // //           borderColor: '#f43f5e',
// // // // // //           borderWidth: 2,
// // // // // //           pointBackgroundColor: '#f43f5e',
// // // // // //         },
// // // // // //       ],
// // // // // //     };
// // // // // //   }, [aptitudesData, apetencesData]);

// // // // // //   const radarOptions = {
// // // // // //     responsive: true,
// // // // // //     maintainAspectRatio: false,
// // // // // //     scales: {
// // // // // //       r: {
// // // // // //         min: 0,
// // // // // //         suggestedMax: 4,
// // // // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // // //       },
// // // // // //     },
// // // // // //     plugins: {
// // // // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // // // //     },
// // // // // //   };

// // // // // //   const toggleMobileExpand = (id) => {
// // // // // //     setExpandedMobileIds((prev) => {
// // // // // //       const next = new Set(prev);
// // // // // //       if (next.has(id)) next.delete(id);
// // // // // //       else next.add(id);
// // // // // //       return next;
// // // // // //     });
// // // // // //   };

// // // // // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <>
// // // // // //         <Navbar />
// // // // // //         <style>{STYLE_SHEET}</style>
// // // // // //         <div className="matrix-page">
// // // // // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // // // // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // // // // //               Chargement de la matrice des sélections...
// // // // // //             </p>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <>
// // // // // //       <Navbar />
// // // // // //       <style>{STYLE_SHEET}</style>

// // // // // //       <div className="matrix-page">
// // // // // //         <div className="matrix-shell">
// // // // // //           {/* Header */}
// // // // // //           <div className="matrix-header">
// // // // // //             <div>
// // // // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // // // // //               <p className="matrix-subtitle">
// // // // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant.
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
// // // // // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // // // // //                 📊 Exporter (.xlsx)
// // // // // //               </Button>
// // // // // //               <Button
// // // // // //                 className="btn-pill btn-save-pill"
// // // // // //                 onClick={handleSubmit}
// // // // // //                 disabled={saving || !hasChanges}
// // // // // //               >
// // // // // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // //           {/* Toolbar unique : recherche, filtre, stats, réglages, actions groupées */}
// // // // // //           <div className="matrix-toolbar">
// // // // // //             <InputGroup size="sm" className="toolbar-search">
// // // // // //               <Form.Control
// // // // // //                 placeholder="🔍 Rechercher un étudiant..."
// // // // // //                 value={searchStudent}
// // // // // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // // // // //               />
// // // // // //               {searchStudent && (
// // // // // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // // // // //               )}
// // // // // //             </InputGroup>

// // // // // //             <Form.Select
// // // // // //               size="sm"
// // // // // //               className="toolbar-select"
// // // // // //               value={selectedChefFilter}
// // // // // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // // //             >
// // // // // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // // // // //               {chefs.map((c) => (
// // // // // //                 <option key={c.id} value={c.id}>
// // // // // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // // //                 </option>
// // // // // //               ))}
// // // // // //             </Form.Select>

// // // // // //             <div className="toolbar-divider" />

// // // // // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // // // // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // // // // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // // // // //             {!isMobile && (
// // // // // //               <>
// // // // // //                 <div className="toolbar-divider" />
// // // // // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // // // // //                   <button
// // // // // //                     type="button"
// // // // // //                     className={density === 'compact' ? 'active' : ''}
// // // // // //                     onClick={() => setDensity('compact')}
// // // // // //                   >
// // // // // //                     Compact
// // // // // //                   </button>
// // // // // //                   <button
// // // // // //                     type="button"
// // // // // //                     className={density === 'comfortable' ? 'active' : ''}
// // // // // //                     onClick={() => setDensity('comfortable')}
// // // // // //                   >
// // // // // //                     Confortable
// // // // // //                   </button>
// // // // // //                 </div>
// // // // // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // // // // //                   <button
// // // // // //                     type="button"
// // // // // //                     className={!showFullNames ? 'active' : ''}
// // // // // //                     onClick={() => setShowFullNames(false)}
// // // // // //                   >
// // // // // //                     Initiales
// // // // // //                   </button>
// // // // // //                   <button
// // // // // //                     type="button"
// // // // // //                     className={showFullNames ? 'active' : ''}
// // // // // //                     onClick={() => setShowFullNames(true)}
// // // // // //                   >
// // // // // //                     Noms complets
// // // // // //                   </button>
// // // // // //                 </div>
// // // // // //               </>
// // // // // //             )}

// // // // // //             <div className="bulk-actions">
// // // // // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // // // // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Vue mobile : accordéons */}
// // // // // //           {isMobile ? (
// // // // // //             filteredEtudiants.length === 0 ? (
// // // // // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // // // // //             ) : (
// // // // // //               <div className="mobile-list">
// // // // // //                 {filteredEtudiants.map((etud) => (
// // // // // //                   <MobileStudentCard
// // // // // //                     key={etud.id}
// // // // // //                     etud={etud}
// // // // // //                     chefs={visibleChefs}
// // // // // //                     selections={selections}
// // // // // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // // // // //                     expanded={expandedMobileIds.has(etud.id)}
// // // // // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // // // // //                     onToggleSelection={toggleSelection}
// // // // // //                     onOpenRadar={handleOpenStudentRadar}
// // // // // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // // // // //                   />
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             )
// // // // // //           ) : (
// // // // // //             /* Vue desktop : tableau matriciel */
// // // // // //             <div className="table-scroll-container">
// // // // // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th
// // // // // //                       style={{
// // // // // //                         minWidth: density === 'compact' ? 148 : 190,
// // // // // //                         maxWidth: density === 'compact' ? 148 : 190,
// // // // // //                         textAlign: 'left',
// // // // // //                         position: 'sticky',
// // // // // //                         left: 0,
// // // // // //                         top: 0,
// // // // // //                         backgroundColor: '#0f1420',
// // // // // //                         zIndex: 20,
// // // // // //                         paddingLeft: '0.65rem',
// // // // // //                       }}
// // // // // //                     >
// // // // // //                       Étudiant ({filteredEtudiants.length})
// // // // // //                     </th>
// // // // // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // // // // //                       Total
// // // // // //                     </th>
// // // // // //                     {visibleChefs.map((chef) => (
// // // // // //                       <ChefHeaderCell
// // // // // //                         key={chef.id}
// // // // // //                         chef={chef}
// // // // // //                         count={countsPerChef[chef.id]}
// // // // // //                         showFullNames={showFullNames}
// // // // // //                       />
// // // // // //                     ))}
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {filteredEtudiants.length === 0 ? (
// // // // // //                     <tr>
// // // // // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // // // // //                         Aucun étudiant trouvé.
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   ) : (
// // // // // //                     filteredEtudiants.map((etud) => {
// // // // // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // // // // //                       return (
// // // // // //                         <tr key={etud.id}>
// // // // // //                           <td
// // // // // //                             className="student-cell"
// // // // // //                             style={{
// // // // // //                               textAlign: 'left',
// // // // // //                               position: 'sticky',
// // // // // //                               left: 0,
// // // // // //                               backgroundColor: '#131c2e',
// // // // // //                               zIndex: 5,
// // // // // //                               paddingLeft: '0.65rem',
// // // // // //                               maxWidth: density === 'compact' ? 148 : 190,
// // // // // //                             }}
// // // // // //                           >
// // // // // //                             <div className="student-cell-inner">
// // // // // //                               <span
// // // // // //                                 className="student-cell-name"
// // // // // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // // // // //                                 onClick={() =>
// // // // // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // // // // //                                 }
// // // // // //                               >
// // // // // //                                 {etud.nom} {etud.prenom}
// // // // // //                               </span>
// // // // // //                               {density === 'comfortable' && (
// // // // // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // // // // //                                   {etud.adresse_email}
// // // // // //                                 </div>
// // // // // //                               )}
// // // // // //                               {(etud.cv_path || etud.lm_path) && (
// // // // // //                                 <div className="d-flex gap-1 mt-1">
// // // // // //                                   {etud.cv_path && (
// // // // // //                                     <a
// // // // // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // // // // //                                       target="_blank"
// // // // // //                                       rel="noopener noreferrer"
// // // // // //                                       className="doc-badge badge"
// // // // // //                                       title="CV"
// // // // // //                                     >
// // // // // //                                       📄
// // // // // //                                     </a>
// // // // // //                                   )}
// // // // // //                                   {etud.lm_path && (
// // // // // //                                     <a
// // // // // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // // // // //                                       target="_blank"
// // // // // //                                       rel="noopener noreferrer"
// // // // // //                                       className="doc-badge badge"
// // // // // //                                       title="Lettre de motivation"
// // // // // //                                     >
// // // // // //                                       ✉️
// // // // // //                                     </a>
// // // // // //                                   )}
// // // // // //                                 </div>
// // // // // //                               )}
// // // // // //                             </div>
// // // // // //                           </td>

// // // // // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // // // // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // //                           </td>

// // // // // //                           {visibleChefs.map((chef) => {
// // // // // //                             const key = `${etud.id}-${chef.id}`;
// // // // // //                             const isSelected = selections.has(key);
// // // // // //                             const rankInfo = studentRanks?.get(chef.id);
// // // // // //                             const rankNum = rankInfo?.rank || 1;

// // // // // //                             return (
// // // // // //                               <SelectionCell
// // // // // //                                 key={chef.id}
// // // // // //                                 selected={isSelected}
// // // // // //                                 rankNum={rankNum}
// // // // // //                                 rankInfo={rankInfo}
// // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // //                               />
// // // // // //                             );
// // // // // //                           })}
// // // // // //                         </tr>
// // // // // //                       );
// // // // // //                     })
// // // // // //                   )}
// // // // // //                 </tbody>
// // // // // //               </Table>
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* Modal Radar */}
// // // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
// // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // // //         </Modal.Header>
// // // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // //           {modalLoading ? (
// // // // // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// // // // // //           ) : modalError ? (
// // // // // //             <Alert variant="warning">{modalError}</Alert>
// // // // // //           ) : (
// // // // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </Modal.Body>
// // // // // //         <Modal.Footer>
// // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // // // //         </Modal.Footer>
// // // // // //       </Modal>
// // // // // //     </>
// // // // // //   );
// // // // // // }

// // // // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // // // import {
// // // // //   Table,
// // // // //   Button,
// // // // //   Alert,
// // // // //   Spinner,
// // // // //   Form,
// // // // //   InputGroup,
// // // // //   Badge,
// // // // //   Modal,
// // // // // } from 'react-bootstrap';
// // // // // import * as XLSX from 'xlsx';
// // // // // import {
// // // // //   Chart as ChartJS,
// // // // //   RadialLinearScale,
// // // // //   PointElement,
// // // // //   LineElement,
// // // // //   Filler,
// // // // //   Tooltip,
// // // // //   Legend,
// // // // // } from 'chart.js';
// // // // // import { Radar } from 'react-chartjs-2';
// // // // // import Navbar from './Navbar';
// // // // // import {
// // // // //   fetchChefsDeProjet,
// // // // //   fetchEtudiants,
// // // // //   fetchSelections,
// // // // //   saveSelection,
// // // // //   deleteSelection,
// // // // //   fetchAllApetences,
// // // // //   fetchAptitudesByEtudiant,
// // // // //   fetchApetencesByEtudiant,
// // // // //   computeChefRanksForStudent,
// // // // //   getDocumentPublicUrl,
// // // // // } from '../services/supabase';

// // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // ============================================================================
// // // // // // Constantes & helpers métier (logique inchangée)
// // // // // // ============================================================================

// // // // // const COMPETENCE_KEYS = [
// // // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // // ];

// // // // // const getRankBadgeStyle = (rank) => {
// // // // //   switch (rank) {
// // // // //     case 1:
// // // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // // //     case 2:
// // // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // // //     case 3:
// // // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // // //     default:
// // // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // // //   }
// // // // // };

// // // // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // // // // Abréviation d'un chef pour l'affichage compact des en-têtes de colonne
// // // // // // (4 premières lettres du nom, plus lisible que de simples initiales)
// // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // ============================================================================
// // // // // // Hook responsive (bascule automatique vers la vue mobile)
// // // // // // ============================================================================

// // // // // function useIsMobile(breakpoint = 768) {
// // // // //   const [isMobile, setIsMobile] = useState(
// // // // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // // // //   );

// // // // //   useEffect(() => {
// // // // //     if (typeof window === 'undefined') return undefined;
// // // // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // // // //     const handler = (e) => setIsMobile(e.matches);
// // // // //     setIsMobile(mql.matches);
// // // // //     mql.addEventListener('change', handler);
// // // // //     return () => mql.removeEventListener('change', handler);
// // // // //   }, [breakpoint]);

// // // // //   return isMobile;
// // // // // }

// // // // // // ============================================================================
// // // // // // Styles
// // // // // // ============================================================================

// // // // // const STYLE_SHEET = `
// // // // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // // // .matrix-page {
// // // // //   --bg: #0a0d12;
// // // // //   --surface: #12161f;
// // // // //   --surface-2: #1a2029;
// // // // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // // // //   --border: #232a37;
// // // // //   --text: #e9ecf1;
// // // // //   --text-muted: #8b93a5;
// // // // //   --text-faint: #5a6272;
// // // // //   --accent: #2dd4bf;
// // // // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // // // //   font-family: 'Inter', -apple-system, sans-serif;
// // // // //   background: var(--bg);
// // // // //   min-height: 100vh;
// // // // //   color: var(--text);
// // // // // }
// // // // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // // // .matrix-shell {
// // // // //   max-width: 100%;
// // // // //   margin: 0 auto;
// // // // //   padding: 1.25rem 1.5rem 2rem;
// // // // // }

// // // // // /* ---------- Header ---------- */
// // // // // .matrix-header {
// // // // //   display: flex;
// // // // //   justify-content: space-between;
// // // // //   align-items: center;
// // // // //   gap: 1rem;
// // // // //   flex-wrap: wrap;
// // // // //   margin-bottom: 0.9rem;
// // // // // }
// // // // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }

// // // // // .btn-pill {
// // // // //   border-radius: 999px !important;
// // // // //   font-weight: 600 !important;
// // // // //   font-size: 0.82rem !important;
// // // // //   padding: 0.45rem 1rem !important;
// // // // //   border: 1px solid var(--border) !important;
// // // // // }
// // // // // .btn-save-pill {
// // // // //   background: var(--accent) !important;
// // // // //   border: none !important;
// // // // //   color: #06201c !important;
// // // // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // // // }
// // // // // .btn-save-pill:disabled { opacity: 0.5; }
// // // // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // .pending-chip {
// // // // //   display: inline-flex;
// // // // //   align-items: center;
// // // // //   gap: 0.35rem;
// // // // //   background: rgba(245, 158, 11, 0.14);
// // // // //   color: #fbbf24;
// // // // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // // // //   border-radius: 999px;
// // // // //   padding: 0.3rem 0.75rem;
// // // // //   font-size: 0.78rem;
// // // // //   font-weight: 600;
// // // // // }

// // // // // /* ---------- Toolbar unique (fusion KPI + filtres) ---------- */
// // // // // .matrix-toolbar {
// // // // //   background: var(--surface);
// // // // //   border: 1px solid var(--border);
// // // // //   border-radius: 14px;
// // // // //   padding: 0.75rem 0.9rem;
// // // // //   margin-bottom: 0.9rem;
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   gap: 0.9rem;
// // // // //   flex-wrap: wrap;
// // // // // }
// // // // // .matrix-toolbar .form-control,
// // // // // .matrix-toolbar .form-select {
// // // // //   background: var(--surface-2);
// // // // //   border: 1px solid var(--border);
// // // // //   color: var(--text);
// // // // //   font-size: 0.85rem;
// // // // // }
// // // // // .matrix-toolbar .form-control:focus,
// // // // // .matrix-toolbar .form-select:focus {
// // // // //   background: var(--surface-2);
// // // // //   border-color: var(--accent);
// // // // //   color: var(--text);
// // // // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // // // }
// // // // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // // // .stat-chip {
// // // // //   background: var(--surface-2);
// // // // //   border: 1px solid var(--border);
// // // // //   border-radius: 999px;
// // // // //   padding: 0.32rem 0.7rem;
// // // // //   font-size: 0.76rem;
// // // // //   color: var(--text-muted);
// // // // //   white-space: nowrap;
// // // // // }
// // // // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // // // .stat-chip.accent strong { color: var(--accent); }

// // // // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // // // .segmented {
// // // // //   display: inline-flex;
// // // // //   background: var(--surface-2);
// // // // //   border: 1px solid var(--border);
// // // // //   border-radius: 8px;
// // // // //   padding: 2px;
// // // // //   gap: 2px;
// // // // // }
// // // // // .segmented button {
// // // // //   border: none;
// // // // //   background: transparent;
// // // // //   color: var(--text-faint);
// // // // //   font-size: 0.74rem;
// // // // //   font-weight: 600;
// // // // //   padding: 0.3rem 0.55rem;
// // // // //   border-radius: 6px;
// // // // //   cursor: pointer;
// // // // //   transition: background 0.12s ease, color 0.12s ease;
// // // // // }
// // // // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // // // .btn-ghost {
// // // // //   background: transparent !important;
// // // // //   border: 1px solid var(--border) !important;
// // // // //   color: var(--text-muted) !important;
// // // // //   font-size: 0.78rem !important;
// // // // //   border-radius: 8px !important;
// // // // //   padding: 0.35rem 0.65rem !important;
// // // // // }
// // // // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // /* ---------- Tableau matriciel ---------- */
// // // // // .table-scroll-container {
// // // // //   width: 100%;
// // // // //   max-height: calc(100vh - 230px);
// // // // //   min-height: 420px;
// // // // //   overflow: auto;
// // // // //   border-radius: 14px;
// // // // //   border: 1px solid var(--border);
// // // // //   background: var(--surface);
// // // // // }
// // // // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // // // .matrix-table thead th {
// // // // //   position: sticky;
// // // // //   top: 0;
// // // // //   background: #0f1420 !important;
// // // // //   z-index: 10;
// // // // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // // // //   vertical-align: middle;
// // // // // }

// // // // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // // // .student-cell { white-space: normal; }
// // // // // .student-cell-inner { max-width: 100%; }
// // // // // .student-cell-name {
// // // // //   display: block;
// // // // //   font-weight: 600;
// // // // //   color: var(--accent);
// // // // //   cursor: pointer;
// // // // //   text-decoration: none;
// // // // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // // // //   white-space: nowrap;
// // // // //   overflow: hidden;
// // // // //   text-overflow: ellipsis;
// // // // // }
// // // // // .student-cell-name:hover { color: #6ee7de; }
// // // // // .student-cell-email {
// // // // //   color: var(--text-faint);
// // // // //   font-size: 0.7rem;
// // // // //   font-family: 'JetBrains Mono', monospace;
// // // // //   white-space: nowrap;
// // // // //   overflow: hidden;
// // // // //   text-overflow: ellipsis;
// // // // // }

// // // // // .doc-badge {
// // // // //   font-size: 0.68rem;
// // // // //   padding: 0.15rem 0.4rem;
// // // // //   border-radius: 5px;
// // // // //   background: var(--surface-2) !important;
// // // // //   border: 1px solid var(--border);
// // // // //   color: var(--text-muted) !important;
// // // // //   text-decoration: none !important;
// // // // // }

// // // // // .chef-head-cell { text-align: center; }
// // // // // .chef-avatar {
// // // // //   min-width: 40px;
// // // // //   height: 24px;
// // // // //   padding: 0 6px;
// // // // //   border-radius: 7px;
// // // // //   background: var(--surface-2);
// // // // //   border: 1px solid var(--border);
// // // // //   display: inline-flex;
// // // // //   align-items: center;
// // // // //   justify-content: center;
// // // // //   font-size: 0.66rem;
// // // // //   font-weight: 700;
// // // // //   letter-spacing: 0.02em;
// // // // //   color: var(--accent);
// // // // //   margin-bottom: 2px;
// // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // }
// // // // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // // // .chef-specialite {
// // // // //   color: var(--text-faint);
// // // // //   font-weight: 400;
// // // // //   font-size: 0.68rem;
// // // // //   max-width: 130px;
// // // // //   white-space: nowrap;
// // // // //   overflow: hidden;
// // // // //   text-overflow: ellipsis;
// // // // //   margin: 0 auto;
// // // // // }
// // // // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // // // /* ---------- Cellule de sélection : le rang est toujours visible ---------- */
// // // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // // .badge-rank-selection {
// // // // //   display: inline-flex;
// // // // //   align-items: center;
// // // // //   gap: 4px;
// // // // //   min-width: 34px;
// // // // //   justify-content: center;
// // // // //   padding: 3px 9px;
// // // // //   border-radius: 7px;
// // // // //   font-weight: 700;
// // // // //   font-size: 0.74rem;
// // // // //   pointer-events: none;
// // // // //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // // // // }
// // // // // /* Rang affiché avant que la case soit cochée : discret, en attente de clic */
// // // // // .badge-rank-selection.is-pending {
// // // // //   background: transparent;
// // // // //   border: 1px dashed var(--border);
// // // // //   color: var(--text-faint);
// // // // //   opacity: 0.75;
// // // // // }
// // // // // .sel-cell:hover .badge-rank-selection.is-pending {
// // // // //   opacity: 1;
// // // // //   border-color: var(--accent);
// // // // //   color: var(--accent);
// // // // //   transform: translateY(-1px);
// // // // // }
// // // // // /* Rang affiché une fois la case cochée : plein, avec le signe ✓ */
// // // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // // /* ---------- Vue mobile (accordéon) ---------- */
// // // // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // // // .mobile-card-head {
// // // // //   display: flex;
// // // // //   align-items: center;
// // // // //   gap: 0.7rem;
// // // // //   padding: 0.75rem 0.85rem;
// // // // //   cursor: pointer;
// // // // // }
// // // // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // // // .mobile-chef-chip {
// // // // //   display: inline-flex;
// // // // //   align-items: center;
// // // // //   gap: 0.35rem;
// // // // //   padding: 0.35rem 0.6rem;
// // // // //   border-radius: 999px;
// // // // //   font-size: 0.76rem;
// // // // //   font-weight: 600;
// // // // //   cursor: pointer;
// // // // //   border: 1px solid var(--border);
// // // // //   background: var(--surface-2);
// // // // //   color: var(--text-muted);
// // // // //   transition: border-color 0.12s ease, color 0.12s ease;
// // // // // }
// // // // // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // // // // .empty-state {
// // // // //   text-align: center;
// // // // //   padding: 3rem 1rem;
// // // // //   color: var(--text-muted);
// // // // // }

// // // // // /* ---------- Modal radar : design moderne, entièrement opaque ---------- */
// // // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // // .modal-dark .modal-content {
// // // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // // //   background-color: #12161f !important;
// // // // //   opacity: 1 !important;
// // // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // // //   border-radius: 20px;
// // // // //   color: var(--text);
// // // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
// // // // //   overflow: hidden;
// // // // // }
// // // // // .modal-dark .modal-header {
// // // // //   border-bottom: 1px solid var(--border);
// // // // //   background: rgba(45, 212, 191, 0.07);
// // // // //   padding: 1.15rem 1.5rem;
// // // // // }
// // // // // .modal-dark .modal-body {
// // // // //   background: transparent;
// // // // //   padding: 1.5rem;
// // // // // }
// // // // // .modal-dark .modal-footer {
// // // // //   border-top: 1px solid var(--border);
// // // // //   background: rgba(255, 255, 255, 0.02);
// // // // //   padding: 0.9rem 1.5rem;
// // // // // }
// // // // // .modal-dark .modal-title {
// // // // //   font-family: 'Space Grotesk', sans-serif;
// // // // //   font-weight: 700;
// // // // //   font-size: 1.08rem;
// // // // //   letter-spacing: -0.01em;
// // // // // }
// // // // // .modal-dark .btn-close {
// // // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // // //   opacity: 0.7;
// // // // // }
// // // // // .modal-dark .btn-close:hover { opacity: 1; }
// // // // // .modal-dark .modal-footer .btn-secondary {
// // // // //   background: var(--surface-2) !important;
// // // // //   border: 1px solid var(--border) !important;
// // // // //   border-radius: 999px !important;
// // // // //   font-weight: 600 !important;
// // // // //   font-size: 0.82rem !important;
// // // // //   padding: 0.4rem 1.1rem !important;
// // // // //   color: var(--text) !important;
// // // // // }
// // // // // .modal-dark .modal-footer .btn-secondary:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
// // // // // .modal-backdrop.show { opacity: 0.78 !important; }

// // // // // @media (max-width: 767px) {
// // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // //   .bulk-actions { margin-left: 0; }
// // // // // }
// // // // // `;

// // // // // // ============================================================================
// // // // // // Sous-composants de présentation
// // // // // // ============================================================================

// // // // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // // // //   return (
// // // // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // // // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // // // //       {showFullNames && (
// // // // //         <>
// // // // //           <div className="chef-fullname">{chef.nom}</div>
// // // // //           {chef.specialite && (
// // // // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // // // //           )}
// // // // //         </>
// // // // //       )}
// // // // //       <div>
// // // // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // // // //       </div>
// // // // //     </th>
// // // // //   );
// // // // // }

// // // // // // Le rang (1er, 2e, 3e…) est toujours visible, même avant la sélection.
// // // // // // Une fois la case cochée, le badge se remplit de couleur et affiche le signe ✓.
// // // // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // // // //   return (
// // // // //     <td className="sel-cell" onClick={onClick}>
// // // // //       <span
// // // // //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// // // // //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// // // // //         title={
// // // // //           selected
// // // // //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// // // // //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// // // // //         }
// // // // //       >
// // // // //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// // // // //       </span>
// // // // //     </td>
// // // // //   );
// // // // // }

// // // // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // // // //   return (
// // // // //     <div className="mobile-card">
// // // // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // // // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // // // //         <div style={{ flex: 1, minWidth: 0 }}>
// // // // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // // // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // // // //         </div>
// // // // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // //       </div>
// // // // //       {expanded && (
// // // // //         <div className="mobile-card-body">
// // // // //           <Button
// // // // //             size="sm"
// // // // //             className="btn-ghost"
// // // // //             onClick={(e) => {
// // // // //               e.stopPropagation();
// // // // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // // // //             }}
// // // // //           >
// // // // //             📊 Profil compétences
// // // // //           </Button>
// // // // //           {chefs.map((chef) => {
// // // // //             const key = `${etud.id}-${chef.id}`;
// // // // //             const isSelected = selections.has(key);
// // // // //             const rankInfo = studentRanks?.get(chef.id);
// // // // //             const rankNum = rankInfo?.rank || 1;
// // // // //             return (
// // // // //               <span
// // // // //                 key={chef.id}
// // // // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`}
// // // // //               >
// // // // //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
// // // // //               </span>
// // // // //             );
// // // // //           })}
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // // ============================================================================
// // // // // // Composant principal
// // // // // // ============================================================================

// // // // // export default function SelectionPage() {
// // // // //   const [chefs, setChefs] = useState([]);
// // // // //   const [etudiants, setEtudiants] = useState([]);
// // // // //   const [apetencesList, setApetencesList] = useState([]);

// // // // //   // Set de "etudiantId-chefId"
// // // // //   const [selections, setSelections] = useState(new Set());
// // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [saving, setSaving] = useState(false);
// // // // //   const [error, setError] = useState(null);
// // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // //   // Réglages d'affichage (purement UI, n'affectent aucune donnée)
// // // // //   const [density, setDensity] = useState('compact'); // 'compact' | 'comfortable'
// // // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // // // //   // Modal Radar
// // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // //   const [modalError, setModalError] = useState(null);

// // // // //   const isMobile = useIsMobile(768);

// // // // //   const loadData = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       setError(null);

// // // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // // //         fetchChefsDeProjet(),
// // // // //         fetchEtudiants(),
// // // // //         fetchSelections(),
// // // // //         fetchAllApetences(),
// // // // //       ]);

// // // // //       setChefs(chefsData || []);
// // // // //       setEtudiants(etudiantsData || []);
// // // // //       setApetencesList(apetencesDataRaw || []);

// // // // //       const activeSet = new Set();
// // // // //       (selectionsData || []).forEach((s) => {
// // // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // // //         }
// // // // //       });

// // // // //       setSelections(new Set(activeSet));
// // // // //       setInitialSelections(new Set(activeSet));
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     loadData();
// // // // //   }, []);

// // // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // // //   const appetenceRanksMap = useMemo(() => {
// // // // //     const map = new Map();
// // // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // // //     etudiants.forEach((etud) => {
// // // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // // //       map.set(etud.id, ranks);
// // // // //     });

// // // // //     return map;
// // // // //   }, [apetencesList, etudiants, chefs]);

// // // // //   const hasChanges = useMemo(() => {
// // // // //     if (selections.size !== initialSelections.size) return true;
// // // // //     for (const key of selections) {
// // // // //       if (!initialSelections.has(key)) return true;
// // // // //     }
// // // // //     return false;
// // // // //   }, [selections, initialSelections]);

// // // // //   const filteredEtudiants = useMemo(() => {
// // // // //     const term = searchStudent.toLowerCase().trim();
// // // // //     if (!term) return etudiants;
// // // // //     return etudiants.filter(
// // // // //       (e) =>
// // // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // // //     );
// // // // //   }, [etudiants, searchStudent]);

// // // // //   const visibleChefs = useMemo(() => {
// // // // //     if (selectedChefFilter === 'all') return chefs;
// // // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // // //   }, [chefs, selectedChefFilter]);

// // // // //   const countsPerStudent = useMemo(() => {
// // // // //     const map = {};
// // // // //     for (const key of selections) {
// // // // //       const [etudId] = key.split('-');
// // // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // // //     }
// // // // //     return map;
// // // // //   }, [selections]);

// // // // //   const countsPerChef = useMemo(() => {
// // // // //     const map = {};
// // // // //     for (const key of selections) {
// // // // //       const [, chefId] = key.split('-');
// // // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // // //     }
// // // // //     return map;
// // // // //   }, [selections]);

// // // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // // //     const key = `${etudiantId}-${chefId}`;
// // // // //     setSelections((prev) => {
// // // // //       const next = new Set(prev);
// // // // //       if (next.has(key)) next.delete(key);
// // // // //       else next.add(key);
// // // // //       return next;
// // // // //     });
// // // // //     setSuccessMsg(null);
// // // // //   }, []);

// // // // //   const handleSelectAllVisible = () => {
// // // // //     setSelections((prev) => {
// // // // //       const next = new Set(prev);
// // // // //       filteredEtudiants.forEach((e) => {
// // // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // // //       });
// // // // //       return next;
// // // // //     });
// // // // //     setSuccessMsg(null);
// // // // //   };

// // // // //   const handleDeselectAllVisible = () => {
// // // // //     setSelections((prev) => {
// // // // //       const next = new Set(prev);
// // // // //       filteredEtudiants.forEach((e) => {
// // // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // // //       });
// // // // //       return next;
// // // // //     });
// // // // //     setSuccessMsg(null);
// // // // //   };

// // // // //   const handleSubmit = async () => {
// // // // //     try {
// // // // //       setSaving(true);
// // // // //       setError(null);
// // // // //       setSuccessMsg(null);

// // // // //       const toAdd = [];
// // // // //       selections.forEach((key) => {
// // // // //         if (!initialSelections.has(key)) {
// // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // //           toAdd.push({ etudiantId, chefId });
// // // // //         }
// // // // //       });

// // // // //       const toDelete = [];
// // // // //       initialSelections.forEach((key) => {
// // // // //         if (!selections.has(key)) {
// // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // //           toDelete.push({ etudiantId, chefId });
// // // // //         }
// // // // //       });

// // // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // // //         deleteSelection(etudiantId, chefId)
// // // // //       );
// // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // // //         saveSelection(etudiantId, chefId)
// // // // //       );

// // // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // // //       setInitialSelections(new Set(selections));
// // // // //       setSuccessMsg(
// // // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // // //       );
// // // // //     } catch (err) {
// // // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // // //     } finally {
// // // // //       setSaving(false);
// // // // //     }
// // // // //   };

// // // // //   // Export Excel
// // // // //   const handleDownloadSelectionXLSX = () => {
// // // // //     try {
// // // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // // //         alert('Aucune donnée disponible.');
// // // // //         return;
// // // // //       }

// // // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // // //       );

// // // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // // //         const row = {
// // // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // // //           'Email': etud.adresse_email || '',
// // // // //           'Parcours': etud.parcours || 'I2026',
// // // // //         };

// // // // //         chefs.forEach((chef) => {
// // // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // // //           const rankInfo = studentRanks?.get(chef.id);
// // // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // // //         });

// // // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // // //         return row;
// // // // //       });

// // // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // // //       wsSelections['!cols'] = [
// // // // //         { wch: 26 },
// // // // //         { wch: 32 },
// // // // //         { wch: 12 },
// // // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // // //         { wch: 16 },
// // // // //       ];

// // // // //       const statsRows = chefs.map((chef) => ({
// // // // //         'Chef de Projet': chef.nom,
// // // // //         'Spécialité': chef.specialite || 'N/A',
// // // // //         'Email': chef.email || '',
// // // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // // //       }));

// // // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // // //       const workbook = XLSX.utils.book_new();
// // // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // // //       const today = new Date().toISOString().slice(0, 10);
// // // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // // //     } catch (err) {
// // // // //       alert(`Erreur export: ${err.message}`);
// // // // //     }
// // // // //   };

// // // // //   // Popup Radar
// // // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // // //     if (!etudiantId) return;
// // // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // // //     setModalOpen(true);
// // // // //     setModalLoading(true);
// // // // //     setModalError(null);
// // // // //     setAptitudesData(null);
// // // // //     setApetencesData(null);

// // // // //     try {
// // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // //         fetchAptitudesByEtudiant(etudiantId),
// // // // //         fetchApetencesByEtudiant(etudiantId),
// // // // //       ]);

// // // // //       if (!aptitudes && !apetences) {
// // // // //         setModalError('Aucune compétence ni appétence enregistrée.');
// // // // //       } else {
// // // // //         setAptitudesData(aptitudes);
// // // // //         setApetencesData(apetences);
// // // // //       }
// // // // //     } catch (err) {
// // // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // // //     } finally {
// // // // //       setModalLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const radarChartData = useMemo(() => {
// // // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // // //     return {
// // // // //       labels,
// // // // //       datasets: [
// // // // //         {
// // // // //           label: 'Aptitudes (Technique)',
// // // // //           data: aptValues,
// // // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // // //           borderColor: '#38bdf8',
// // // // //           borderWidth: 2,
// // // // //           pointBackgroundColor: '#38bdf8',
// // // // //         },
// // // // //         {
// // // // //           label: 'Appétences (Intérêt)',
// // // // //           data: apeValues,
// // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // //           borderColor: '#f43f5e',
// // // // //           borderWidth: 2,
// // // // //           pointBackgroundColor: '#f43f5e',
// // // // //         },
// // // // //       ],
// // // // //     };
// // // // //   }, [aptitudesData, apetencesData]);

// // // // //   const radarOptions = {
// // // // //     responsive: true,
// // // // //     maintainAspectRatio: false,
// // // // //     scales: {
// // // // //       r: {
// // // // //         min: 0,
// // // // //         suggestedMax: 4,
// // // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // //       },
// // // // //     },
// // // // //     plugins: {
// // // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // // //     },
// // // // //   };

// // // // //   const toggleMobileExpand = (id) => {
// // // // //     setExpandedMobileIds((prev) => {
// // // // //       const next = new Set(prev);
// // // // //       if (next.has(id)) next.delete(id);
// // // // //       else next.add(id);
// // // // //       return next;
// // // // //     });
// // // // //   };

// // // // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <>
// // // // //         <Navbar />
// // // // //         <style>{STYLE_SHEET}</style>
// // // // //         <div className="matrix-page">
// // // // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // // // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // // // //               Chargement de la matrice des sélections...
// // // // //             </p>
// // // // //           </div>
// // // // //         </div>
// // // // //       </>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <>
// // // // //       <Navbar />
// // // // //       <style>{STYLE_SHEET}</style>

// // // // //       <div className="matrix-page">
// // // // //         <div className="matrix-shell">
// // // // //           {/* Header */}
// // // // //           <div className="matrix-header">
// // // // //             <div>
// // // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // // // //               <p className="matrix-subtitle">
// // // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// // // // //               </p>
// // // // //             </div>

// // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
// // // // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // // // //                 📊 Exporter (.xlsx)
// // // // //               </Button>
// // // // //               <Button
// // // // //                 className="btn-pill btn-save-pill"
// // // // //                 onClick={handleSubmit}
// // // // //                 disabled={saving || !hasChanges}
// // // // //               >
// // // // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // //           {/* Toolbar unique : recherche, filtre, stats, réglages, actions groupées */}
// // // // //           <div className="matrix-toolbar">
// // // // //             <InputGroup size="sm" className="toolbar-search">
// // // // //               <Form.Control
// // // // //                 placeholder="🔍 Rechercher un étudiant..."
// // // // //                 value={searchStudent}
// // // // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // // // //               />
// // // // //               {searchStudent && (
// // // // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // // // //               )}
// // // // //             </InputGroup>

// // // // //             <Form.Select
// // // // //               size="sm"
// // // // //               className="toolbar-select"
// // // // //               value={selectedChefFilter}
// // // // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // //             >
// // // // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // // // //               {chefs.map((c) => (
// // // // //                 <option key={c.id} value={c.id}>
// // // // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // //                 </option>
// // // // //               ))}
// // // // //             </Form.Select>

// // // // //             <div className="toolbar-divider" />

// // // // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // // // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // // // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // // // //             {!isMobile && (
// // // // //               <>
// // // // //                 <div className="toolbar-divider" />
// // // // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     className={density === 'compact' ? 'active' : ''}
// // // // //                     onClick={() => setDensity('compact')}
// // // // //                   >
// // // // //                     Compact
// // // // //                   </button>
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     className={density === 'comfortable' ? 'active' : ''}
// // // // //                     onClick={() => setDensity('comfortable')}
// // // // //                   >
// // // // //                     Confortable
// // // // //                   </button>
// // // // //                 </div>
// // // // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     className={!showFullNames ? 'active' : ''}
// // // // //                     onClick={() => setShowFullNames(false)}
// // // // //                   >
// // // // //                     Initiales
// // // // //                   </button>
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     className={showFullNames ? 'active' : ''}
// // // // //                     onClick={() => setShowFullNames(true)}
// // // // //                   >
// // // // //                     Noms complets
// // // // //                   </button>
// // // // //                 </div>
// // // // //               </>
// // // // //             )}

// // // // //             <div className="bulk-actions">
// // // // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // // // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Vue mobile : accordéons */}
// // // // //           {isMobile ? (
// // // // //             filteredEtudiants.length === 0 ? (
// // // // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // // // //             ) : (
// // // // //               <div className="mobile-list">
// // // // //                 {filteredEtudiants.map((etud) => (
// // // // //                   <MobileStudentCard
// // // // //                     key={etud.id}
// // // // //                     etud={etud}
// // // // //                     chefs={visibleChefs}
// // // // //                     selections={selections}
// // // // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // // // //                     expanded={expandedMobileIds.has(etud.id)}
// // // // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // // // //                     onToggleSelection={toggleSelection}
// // // // //                     onOpenRadar={handleOpenStudentRadar}
// // // // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // // // //                   />
// // // // //                 ))}
// // // // //               </div>
// // // // //             )
// // // // //           ) : (
// // // // //             /* Vue desktop : tableau matriciel */
// // // // //             <div className="table-scroll-container">
// // // // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // // // //                 <thead>
// // // // //                   <tr>
// // // // //                     <th
// // // // //                       style={{
// // // // //                         minWidth: density === 'compact' ? 148 : 190,
// // // // //                         maxWidth: density === 'compact' ? 148 : 190,
// // // // //                         textAlign: 'left',
// // // // //                         position: 'sticky',
// // // // //                         left: 0,
// // // // //                         top: 0,
// // // // //                         backgroundColor: '#0f1420',
// // // // //                         zIndex: 20,
// // // // //                         paddingLeft: '0.65rem',
// // // // //                       }}
// // // // //                     >
// // // // //                       Étudiant ({filteredEtudiants.length})
// // // // //                     </th>
// // // // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // // // //                       Total
// // // // //                     </th>
// // // // //                     {visibleChefs.map((chef) => (
// // // // //                       <ChefHeaderCell
// // // // //                         key={chef.id}
// // // // //                         chef={chef}
// // // // //                         count={countsPerChef[chef.id]}
// // // // //                         showFullNames={showFullNames}
// // // // //                       />
// // // // //                     ))}
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {filteredEtudiants.length === 0 ? (
// // // // //                     <tr>
// // // // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // // // //                         Aucun étudiant trouvé.
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ) : (
// // // // //                     filteredEtudiants.map((etud) => {
// // // // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // // // //                       return (
// // // // //                         <tr key={etud.id}>
// // // // //                           <td
// // // // //                             className="student-cell"
// // // // //                             style={{
// // // // //                               textAlign: 'left',
// // // // //                               position: 'sticky',
// // // // //                               left: 0,
// // // // //                               backgroundColor: '#131c2e',
// // // // //                               zIndex: 5,
// // // // //                               paddingLeft: '0.65rem',
// // // // //                               maxWidth: density === 'compact' ? 148 : 190,
// // // // //                             }}
// // // // //                           >
// // // // //                             <div className="student-cell-inner">
// // // // //                               <span
// // // // //                                 className="student-cell-name"
// // // // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // // // //                                 onClick={() =>
// // // // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // // // //                                 }
// // // // //                               >
// // // // //                                 {etud.nom} {etud.prenom}
// // // // //                               </span>
// // // // //                               {density === 'comfortable' && (
// // // // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // // // //                                   {etud.adresse_email}
// // // // //                                 </div>
// // // // //                               )}
// // // // //                               {(etud.cv_path || etud.lm_path) && (
// // // // //                                 <div className="d-flex gap-1 mt-1">
// // // // //                                   {etud.cv_path && (
// // // // //                                     <a
// // // // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // // // //                                       target="_blank"
// // // // //                                       rel="noopener noreferrer"
// // // // //                                       className="doc-badge badge"
// // // // //                                       title="CV"
// // // // //                                     >
// // // // //                                       📄
// // // // //                                     </a>
// // // // //                                   )}
// // // // //                                   {etud.lm_path && (
// // // // //                                     <a
// // // // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // // // //                                       target="_blank"
// // // // //                                       rel="noopener noreferrer"
// // // // //                                       className="doc-badge badge"
// // // // //                                       title="Lettre de motivation"
// // // // //                                     >
// // // // //                                       ✉️
// // // // //                                     </a>
// // // // //                                   )}
// // // // //                                 </div>
// // // // //                               )}
// // // // //                             </div>
// // // // //                           </td>

// // // // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // // // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // //                           </td>

// // // // //                           {visibleChefs.map((chef) => {
// // // // //                             const key = `${etud.id}-${chef.id}`;
// // // // //                             const isSelected = selections.has(key);
// // // // //                             const rankInfo = studentRanks?.get(chef.id);
// // // // //                             const rankNum = rankInfo?.rank || 1;

// // // // //                             return (
// // // // //                               <SelectionCell
// // // // //                                 key={chef.id}
// // // // //                                 selected={isSelected}
// // // // //                                 rankNum={rankNum}
// // // // //                                 rankInfo={rankInfo}
// // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // //                               />
// // // // //                             );
// // // // //                           })}
// // // // //                         </tr>
// // // // //                       );
// // // // //                     })
// // // // //                   )}
// // // // //                 </tbody>
// // // // //               </Table>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Modal Radar */}
// // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark" backdropClassName="modal-dark-backdrop">
// // // // //         <Modal.Header closeButton closeVariant="white">
// // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // //         </Modal.Header>
// // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // //           {modalLoading ? (
// // // // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// // // // //           ) : modalError ? (
// // // // //             <Alert variant="warning">{modalError}</Alert>
// // // // //           ) : (
// // // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // //             </div>
// // // // //           )}
// // // // //         </Modal.Body>
// // // // //         <Modal.Footer>
// // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // // //         </Modal.Footer>
// // // // //       </Modal>
// // // // //     </>
// // // // //   );
// // // // // }
// // // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // // import {
// // // //   Table,
// // // //   Button,
// // // //   Alert,
// // // //   Spinner,
// // // //   Form,
// // // //   InputGroup,
// // // //   Badge,
// // // //   Modal,
// // // // } from 'react-bootstrap';
// // // // import * as XLSX from 'xlsx';
// // // // import {
// // // //   Chart as ChartJS,
// // // //   RadialLinearScale,
// // // //   PointElement,
// // // //   LineElement,
// // // //   Filler,
// // // //   Tooltip,
// // // //   Legend,
// // // // } from 'chart.js';
// // // // import { Radar } from 'react-chartjs-2';
// // // // import Navbar from './Navbar';
// // // // import {
// // // //   fetchChefsDeProjet,
// // // //   fetchEtudiants,
// // // //   fetchSelections,
// // // //   saveSelection,
// // // //   deleteSelection,
// // // //   fetchAllApetences,
// // // //   fetchAptitudesByEtudiant,
// // // //   fetchApetencesByEtudiant,
// // // //   computeChefRanksForStudent,
// // // //   getDocumentPublicUrl,
// // // // } from '../services/supabase';

// // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // ============================================================================
// // // // // Constantes & helpers métier (logique inchangée)
// // // // // ============================================================================

// // // // const COMPETENCE_KEYS = [
// // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // ];

// // // // const getRankBadgeStyle = (rank) => {
// // // //   switch (rank) {
// // // //     case 1:
// // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // //     case 2:
// // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // //     case 3:
// // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // //     default:
// // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // //   }
// // // // };

// // // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // // // Abréviation d'un chef pour l'affichage compact des en-têtes de colonne
// // // // // (4 premières lettres du nom, plus lisible que de simples initiales)
// // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // ============================================================================
// // // // // Hook responsive (bascule automatique vers la vue mobile)
// // // // // ============================================================================

// // // // function useIsMobile(breakpoint = 768) {
// // // //   const [isMobile, setIsMobile] = useState(
// // // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // // //   );

// // // //   useEffect(() => {
// // // //     if (typeof window === 'undefined') return undefined;
// // // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // // //     const handler = (e) => setIsMobile(e.matches);
// // // //     setIsMobile(mql.matches);
// // // //     mql.addEventListener('change', handler);
// // // //     return () => mql.removeEventListener('change', handler);
// // // //   }, [breakpoint]);

// // // //   return isMobile;
// // // // }

// // // // // ============================================================================
// // // // // Styles
// // // // // ============================================================================

// // // // const STYLE_SHEET = `
// // // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // // .matrix-page {
// // // //   --bg: #0a0d12;
// // // //   --surface: #12161f;
// // // //   --surface-2: #1a2029;
// // // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // // //   --border: #232a37;
// // // //   --text: #e9ecf1;
// // // //   --text-muted: #8b93a5;
// // // //   --text-faint: #5a6272;
// // // //   --accent: #2dd4bf;
// // // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // // //   font-family: 'Inter', -apple-system, sans-serif;
// // // //   background: var(--bg);
// // // //   min-height: 100vh;
// // // //   color: var(--text);
// // // // }
// // // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // // .matrix-shell {
// // // //   max-width: 100%;
// // // //   margin: 0 auto;
// // // //   padding: 1.25rem 1.5rem 2rem;
// // // // }

// // // // /* ---------- Header ---------- */
// // // // .matrix-header {
// // // //   display: flex;
// // // //   justify-content: space-between;
// // // //   align-items: center;
// // // //   gap: 1rem;
// // // //   flex-wrap: wrap;
// // // //   margin-bottom: 0.9rem;
// // // // }
// // // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }
// // // // .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

// // // // .btn-pill {
// // // //   border-radius: 999px !important;
// // // //   font-weight: 600 !important;
// // // //   font-size: 0.82rem !important;
// // // //   padding: 0.45rem 1rem !important;
// // // //   border: 1px solid var(--border) !important;
// // // // }
// // // // .btn-save-pill {
// // // //   background: var(--accent) !important;
// // // //   border: none !important;
// // // //   color: #06201c !important;
// // // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // // }
// // // // .btn-save-pill:disabled { opacity: 0.5; }
// // // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // .pending-chip {
// // // //   display: inline-flex;
// // // //   align-items: center;
// // // //   gap: 0.35rem;
// // // //   background: rgba(245, 158, 11, 0.14);
// // // //   color: #fbbf24;
// // // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // // //   border-radius: 999px;
// // // //   padding: 0.3rem 0.75rem;
// // // //   font-size: 0.78rem;
// // // //   font-weight: 600;
// // // // }
// // // // .pending-chip.auto-chip {
// // // //   background: rgba(45, 212, 191, 0.14);
// // // //   color: #2dd4bf;
// // // //   border: 1px solid rgba(45, 212, 191, 0.35);
// // // // }

// // // // /* ---------- Toolbar unique (fusion KPI + filtres) ---------- */
// // // // .matrix-toolbar {
// // // //   background: var(--surface);
// // // //   border: 1px solid var(--border);
// // // //   border-radius: 14px;
// // // //   padding: 0.75rem 0.9rem;
// // // //   margin-bottom: 0.9rem;
// // // //   display: flex;
// // // //   align-items: center;
// // // //   gap: 0.9rem;
// // // //   flex-wrap: wrap;
// // // // }
// // // // .matrix-toolbar .form-control,
// // // // .matrix-toolbar .form-select {
// // // //   background: var(--surface-2);
// // // //   border: 1px solid var(--border);
// // // //   color: var(--text);
// // // //   font-size: 0.85rem;
// // // // }
// // // // .matrix-toolbar .form-control:focus,
// // // // .matrix-toolbar .form-select:focus {
// // // //   background: var(--surface-2);
// // // //   border-color: var(--accent);
// // // //   color: var(--text);
// // // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // // }
// // // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // // .stat-chip {
// // // //   background: var(--surface-2);
// // // //   border: 1px solid var(--border);
// // // //   border-radius: 999px;
// // // //   padding: 0.32rem 0.7rem;
// // // //   font-size: 0.76rem;
// // // //   color: var(--text-muted);
// // // //   white-space: nowrap;
// // // // }
// // // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // // .stat-chip.accent strong { color: var(--accent); }

// // // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // // .segmented {
// // // //   display: inline-flex;
// // // //   background: var(--surface-2);
// // // //   border: 1px solid var(--border);
// // // //   border-radius: 8px;
// // // //   padding: 2px;
// // // //   gap: 2px;
// // // // }
// // // // .segmented button {
// // // //   border: none;
// // // //   background: transparent;
// // // //   color: var(--text-faint);
// // // //   font-size: 0.74rem;
// // // //   font-weight: 600;
// // // //   padding: 0.3rem 0.55rem;
// // // //   border-radius: 6px;
// // // //   cursor: pointer;
// // // //   transition: background 0.12s ease, color 0.12s ease;
// // // // }
// // // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // // .btn-ghost {
// // // //   background: transparent !important;
// // // //   border: 1px solid var(--border) !important;
// // // //   color: var(--text-muted) !important;
// // // //   font-size: 0.78rem !important;
// // // //   border-radius: 8px !important;
// // // //   padding: 0.35rem 0.65rem !important;
// // // // }
// // // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // /* ---------- Tableau matriciel ---------- */
// // // // .table-scroll-container {
// // // //   width: 100%;
// // // //   max-height: calc(100vh - 230px);
// // // //   min-height: 420px;
// // // //   overflow: auto;
// // // //   border-radius: 14px;
// // // //   border: 1px solid var(--border);
// // // //   background: var(--surface);
// // // // }
// // // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // // .matrix-table thead th {
// // // //   position: sticky;
// // // //   top: 0;
// // // //   background: #0f1420 !important;
// // // //   z-index: 10;
// // // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // // //   vertical-align: middle;
// // // // }

// // // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // // .student-cell { white-space: normal; }
// // // // .student-cell-inner { max-width: 100%; }
// // // // .student-cell-name {
// // // //   display: block;
// // // //   font-weight: 600;
// // // //   color: var(--accent);
// // // //   cursor: pointer;
// // // //   text-decoration: none;
// // // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // // //   white-space: nowrap;
// // // //   overflow: hidden;
// // // //   text-overflow: ellipsis;
// // // // }
// // // // .student-cell-name:hover { color: #6ee7de; }
// // // // .student-cell-email {
// // // //   color: var(--text-faint);
// // // //   font-size: 0.7rem;
// // // //   font-family: 'JetBrains Mono', monospace;
// // // //   white-space: nowrap;
// // // //   overflow: hidden;
// // // //   text-overflow: ellipsis;
// // // // }

// // // // .doc-badge {
// // // //   font-size: 0.68rem;
// // // //   padding: 0.15rem 0.4rem;
// // // //   border-radius: 5px;
// // // //   background: var(--surface-2) !important;
// // // //   border: 1px solid var(--border);
// // // //   color: var(--text-muted) !important;
// // // //   text-decoration: none !important;
// // // // }

// // // // .chef-head-cell { text-align: center; }
// // // // .chef-avatar {
// // // //   min-width: 40px;
// // // //   height: 24px;
// // // //   padding: 0 6px;
// // // //   border-radius: 7px;
// // // //   background: var(--surface-2);
// // // //   border: 1px solid var(--border);
// // // //   display: inline-flex;
// // // //   align-items: center;
// // // //   justify-content: center;
// // // //   font-size: 0.66rem;
// // // //   font-weight: 700;
// // // //   letter-spacing: 0.02em;
// // // //   color: var(--accent);
// // // //   margin-bottom: 2px;
// // // //   font-family: 'JetBrains Mono', monospace;
// // // // }
// // // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // // .chef-specialite {
// // // //   color: var(--text-faint);
// // // //   font-weight: 400;
// // // //   font-size: 0.68rem;
// // // //   max-width: 130px;
// // // //   white-space: nowrap;
// // // //   overflow: hidden;
// // // //   text-overflow: ellipsis;
// // // //   margin: 0 auto;
// // // // }
// // // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // // /* ---------- Cellule de sélection : le rang est toujours visible ---------- */
// // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // .badge-rank-selection {
// // // //   display: inline-flex;
// // // //   align-items: center;
// // // //   gap: 4px;
// // // //   min-width: 34px;
// // // //   justify-content: center;
// // // //   padding: 3px 9px;
// // // //   border-radius: 7px;
// // // //   font-weight: 700;
// // // //   font-size: 0.74rem;
// // // //   pointer-events: none;
// // // //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // // // }
// // // // /* Rang affiché avant que la case soit cochée : discret, en attente de clic */
// // // // .badge-rank-selection.is-pending {
// // // //   background: transparent;
// // // //   border: 1px dashed var(--border);
// // // //   color: var(--text-faint);
// // // //   opacity: 0.75;
// // // // }
// // // // .sel-cell:hover .badge-rank-selection.is-pending {
// // // //   opacity: 1;
// // // //   border-color: var(--accent);
// // // //   color: var(--accent);
// // // //   transform: translateY(-1px);
// // // // }
// // // // /* Rang affiché une fois la case cochée : plein, avec le signe ✓ */
// // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // /* ---------- Vue mobile (accordéon) ---------- */
// // // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // // .mobile-card-head {
// // // //   display: flex;
// // // //   align-items: center;
// // // //   gap: 0.7rem;
// // // //   padding: 0.75rem 0.85rem;
// // // //   cursor: pointer;
// // // // }
// // // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // // .mobile-chef-chip {
// // // //   display: inline-flex;
// // // //   align-items: center;
// // // //   gap: 0.35rem;
// // // //   padding: 0.35rem 0.6rem;
// // // //   border-radius: 999px;
// // // //   font-size: 0.76rem;
// // // //   font-weight: 600;
// // // //   cursor: pointer;
// // // //   border: 1px solid var(--border);
// // // //   background: var(--surface-2);
// // // //   color: var(--text-muted);
// // // //   transition: border-color 0.12s ease, color 0.12s ease;
// // // // }
// // // // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // // // .empty-state {
// // // //   text-align: center;
// // // //   padding: 3rem 1rem;
// // // //   color: var(--text-muted);
// // // // }

// // // // /* ---------- Modal radar : design moderne, entièrement opaque ---------- */
// // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // .modal-dark .modal-content {
// // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // //   background-color: #12161f !important;
// // // //   opacity: 1 !important;
// // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // //   border-radius: 20px;
// // // //   color: var(--text);
// // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
// // // //   overflow: hidden;
// // // // }
// // // // .modal-dark .modal-header {
// // // //   border-bottom: 1px solid var(--border);
// // // //   background: rgba(45, 212, 191, 0.07);
// // // //   padding: 1.15rem 1.5rem;
// // // // }
// // // // .modal-dark .modal-body {
// // // //   background: transparent;
// // // //   padding: 1.5rem;
// // // // }
// // // // .modal-dark .modal-footer {
// // // //   border-top: 1px solid var(--border);
// // // //   background: rgba(255, 255, 255, 0.02);
// // // //   padding: 0.9rem 1.5rem;
// // // // }
// // // // .modal-dark .modal-title {
// // // //   font-family: 'Space Grotesk', sans-serif;
// // // //   font-weight: 700;
// // // //   font-size: 1.08rem;
// // // //   letter-spacing: -0.01em;
// // // // }
// // // // .modal-dark .btn-close {
// // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // //   opacity: 0.7;
// // // // }
// // // // .modal-dark .btn-close:hover { opacity: 1; }
// // // // .modal-dark .modal-footer .btn-secondary {
// // // //   background: var(--surface-2) !important;
// // // //   border: 1px solid var(--border) !important;
// // // //   border-radius: 999px !important;
// // // //   font-weight: 600 !important;
// // // //   font-size: 0.82rem !important;
// // // //   padding: 0.4rem 1.1rem !important;
// // // //   color: var(--text) !important;
// // // // }
// // // // .modal-dark .modal-footer .btn-secondary:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
// // // // .modal-backdrop.show { opacity: 0.78 !important; }

// // // // @media (max-width: 767px) {
// // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // //   .bulk-actions { margin-left: 0; }
// // // // }
// // // // `;

// // // // // ============================================================================
// // // // // Sous-composants de présentation
// // // // // ============================================================================

// // // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // // //   return (
// // // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // // //       {showFullNames && (
// // // //         <>
// // // //           <div className="chef-fullname">{chef.nom}</div>
// // // //           {chef.specialite && (
// // // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // // //           )}
// // // //         </>
// // // //       )}
// // // //       <div>
// // // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // // //       </div>
// // // //     </th>
// // // //   );
// // // // }

// // // // // Le rang (1er, 2e, 3e…) est toujours visible, même avant la sélection.
// // // // // Une fois la case cochée, le badge se remplit de couleur et affiche le signe ✓.
// // // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // // //   return (
// // // //     <td className="sel-cell" onClick={onClick}>
// // // //       <span
// // // //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// // // //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// // // //         title={
// // // //           selected
// // // //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// // // //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// // // //         }
// // // //       >
// // // //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// // // //       </span>
// // // //     </td>
// // // //   );
// // // // }

// // // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // // //   return (
// // // //     <div className="mobile-card">
// // // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // // //         <div style={{ flex: 1, minWidth: 0 }}>
// // // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // // //         </div>
// // // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // //       </div>
// // // //       {expanded && (
// // // //         <div className="mobile-card-body">
// // // //           <Button
// // // //             size="sm"
// // // //             className="btn-ghost"
// // // //             onClick={(e) => {
// // // //               e.stopPropagation();
// // // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // // //             }}
// // // //           >
// // // //             📊 Profil compétences
// // // //           </Button>
// // // //           {chefs.map((chef) => {
// // // //             const key = `${etud.id}-${chef.id}`;
// // // //             const isSelected = selections.has(key);
// // // //             const rankInfo = studentRanks?.get(chef.id);
// // // //             const rankNum = rankInfo?.rank || 1;
// // // //             return (
// // // //               <span
// // // //                 key={chef.id}
// // // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`}
// // // //               >
// // // //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
// // // //               </span>
// // // //             );
// // // //           })}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // // ============================================================================
// // // // // Composant principal
// // // // // ============================================================================

// // // // export default function SelectionPage() {
// // // //   const [chefs, setChefs] = useState([]);
// // // //   const [etudiants, setEtudiants] = useState([]);
// // // //   const [apetencesList, setApetencesList] = useState([]);

// // // //   // Set de "etudiantId-chefId"
// // // //   const [selections, setSelections] = useState(new Set());
// // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // //   const [searchStudent, setSearchStudent] = useState('');
// // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // //   const [loading, setLoading] = useState(true);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState(null);
// // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // //   // Sélection automatique (top 3 par appétences) au premier chargement
// // // //   const [autoSelecting, setAutoSelecting] = useState(false);

// // // //   // Réglages d'affichage (purement UI, n'affectent aucune donnée)
// // // //   const [density, setDensity] = useState('compact'); // 'compact' | 'comfortable'
// // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // // //   // Modal Radar
// // // //   const [modalOpen, setModalOpen] = useState(false);
// // // //   const [modalLoading, setModalLoading] = useState(false);
// // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // //   const [apetencesData, setApetencesData] = useState(null);
// // // //   const [modalError, setModalError] = useState(null);

// // // //   const isMobile = useIsMobile(768);

// // // //   const loadData = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);

// // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // //         fetchChefsDeProjet(),
// // // //         fetchEtudiants(),
// // // //         fetchSelections(),
// // // //         fetchAllApetences(),
// // // //       ]);

// // // //       setChefs(chefsData || []);
// // // //       setEtudiants(etudiantsData || []);
// // // //       setApetencesList(apetencesDataRaw || []);

// // // //       const activeSet = new Set();
// // // //       (selectionsData || []).forEach((s) => {
// // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // //         }
// // // //       });

// // // //       setSelections(new Set(activeSet));
// // // //       setInitialSelections(new Set(activeSet));
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     loadData();
// // // //   }, []);

// // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // //   const appetenceRanksMap = useMemo(() => {
// // // //     const map = new Map();
// // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // //     etudiants.forEach((etud) => {
// // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // //       map.set(etud.id, ranks);
// // // //     });

// // // //     return map;
// // // //   }, [apetencesList, etudiants, chefs]);

// // // //   // ----------------------------------------------------------------------
// // // //   // Sélection automatique du top 3 (par appétences) au chargement initial.
// // // //   // Ne concerne que les étudiants qui n'ont ENCORE aucune sélection en base :
// // // //   // un étudiant déjà traité (auto ou manuellement) n'est jamais re-touché,
// // // //   // même après un rafraîchissement de la page.
// // // //   // ----------------------------------------------------------------------
// // // //   useEffect(() => {
// // // //     if (loading || chefs.length === 0 || etudiants.length === 0) return;

// // // //     const etudiantsAvecSelection = new Set();
// // // //     initialSelections.forEach((key) => {
// // // //       etudiantsAvecSelection.add(key.split('-')[0]);
// // // //     });

// // // //     const etudiantsASelectionner = etudiants.filter(
// // // //       (e) => !etudiantsAvecSelection.has(String(e.id))
// // // //     );
// // // //     if (etudiantsASelectionner.length === 0) return;

// // // //     let cancelled = false;

// // // //     const autoSelect = async () => {
// // // //       setAutoSelecting(true);
// // // //       const nouvellesCles = [];
// // // //       const enregistrements = [];

// // // //       etudiantsASelectionner.forEach((etud) => {
// // // //         const ranks = appetenceRanksMap.get(etud.id);
// // // //         if (!ranks) return;
// // // //         ranks.forEach((info, chefId) => {
// // // //           if (info.rank <= 3) {
// // // //             nouvellesCles.push(`${etud.id}-${chefId}`);
// // // //             enregistrements.push(saveSelection(etud.id, chefId, info.rank));
// // // //           }
// // // //         });
// // // //       });

// // // //       if (nouvellesCles.length === 0) {
// // // //         if (!cancelled) setAutoSelecting(false);
// // // //         return;
// // // //       }

// // // //       try {
// // // //         await Promise.all(enregistrements);
// // // //         if (!cancelled) {
// // // //           setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // //           setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // //         }
// // // //       } catch (err) {
// // // //         if (!cancelled) setError(err.message || "Erreur lors de la sélection automatique.");
// // // //       } finally {
// // // //         if (!cancelled) setAutoSelecting(false);
// // // //       }
// // // //     };

// // // //     autoSelect();

// // // //     return () => {
// // // //       cancelled = true;
// // // //     };
// // // //     // On ne veut déclencher ce calcul qu'au chargement initial des données
// // // //     // (chefs/étudiants/appétences), jamais en réaction à des sélections
// // // //     // manuelles ultérieures (celles-ci ne changent pas ces dépendances).
// // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // //   }, [loading, chefs, etudiants, appetenceRanksMap]);

// // // //   const hasChanges = useMemo(() => {
// // // //     if (selections.size !== initialSelections.size) return true;
// // // //     for (const key of selections) {
// // // //       if (!initialSelections.has(key)) return true;
// // // //     }
// // // //     return false;
// // // //   }, [selections, initialSelections]);

// // // //   const filteredEtudiants = useMemo(() => {
// // // //     const term = searchStudent.toLowerCase().trim();
// // // //     if (!term) return etudiants;
// // // //     return etudiants.filter(
// // // //       (e) =>
// // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // //     );
// // // //   }, [etudiants, searchStudent]);

// // // //   const visibleChefs = useMemo(() => {
// // // //     if (selectedChefFilter === 'all') return chefs;
// // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // //   }, [chefs, selectedChefFilter]);

// // // //   const countsPerStudent = useMemo(() => {
// // // //     const map = {};
// // // //     for (const key of selections) {
// // // //       const [etudId] = key.split('-');
// // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // //     }
// // // //     return map;
// // // //   }, [selections]);

// // // //   const countsPerChef = useMemo(() => {
// // // //     const map = {};
// // // //     for (const key of selections) {
// // // //       const [, chefId] = key.split('-');
// // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // //     }
// // // //     return map;
// // // //   }, [selections]);

// // // //   // Sélection/désélection manuelle par l'admin. La priorité par défaut (1)
// // // //   // ne s'applique qu'aux nouvelles sélections manuelles hors calcul auto ;
// // // //   // le rang réel affiché reste toujours celui calculé par appetenceRanksMap.
// // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // //     const key = `${etudiantId}-${chefId}`;
// // // //     setSelections((prev) => {
// // // //       const next = new Set(prev);
// // // //       if (next.has(key)) next.delete(key);
// // // //       else next.add(key);
// // // //       return next;
// // // //     });
// // // //     setSuccessMsg(null);
// // // //   }, []);

// // // //   const handleSelectAllVisible = () => {
// // // //     setSelections((prev) => {
// // // //       const next = new Set(prev);
// // // //       filteredEtudiants.forEach((e) => {
// // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // //       });
// // // //       return next;
// // // //     });
// // // //     setSuccessMsg(null);
// // // //   };

// // // //   const handleDeselectAllVisible = () => {
// // // //     setSelections((prev) => {
// // // //       const next = new Set(prev);
// // // //       filteredEtudiants.forEach((e) => {
// // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // //       });
// // // //       return next;
// // // //     });
// // // //     setSuccessMsg(null);
// // // //   };

// // // //   const handleSubmit = async () => {
// // // //     try {
// // // //       setSaving(true);
// // // //       setError(null);
// // // //       setSuccessMsg(null);

// // // //       const toAdd = [];
// // // //       selections.forEach((key) => {
// // // //         if (!initialSelections.has(key)) {
// // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // //           toAdd.push({ etudiantId, chefId });
// // // //         }
// // // //       });

// // // //       const toDelete = [];
// // // //       initialSelections.forEach((key) => {
// // // //         if (!selections.has(key)) {
// // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // //           toDelete.push({ etudiantId, chefId });
// // // //         }
// // // //       });

// // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // //         deleteSelection(etudiantId, chefId)
// // // //       );
// // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) => {
// // // //         // On conserve le rang par appétence comme priorité lorsqu'il existe,
// // // //         // pour rester cohérent avec les sélections automatiques (P1/P2/P3).
// // // //         const rankInfo = appetenceRanksMap.get(etudiantId)?.get(chefId);
// // // //         return saveSelection(etudiantId, chefId, rankInfo?.rank ?? 1);
// // // //       });

// // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // //       setInitialSelections(new Set(selections));
// // // //       setSuccessMsg(
// // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // //       );
// // // //     } catch (err) {
// // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   // Export Excel
// // // //   const handleDownloadSelectionXLSX = () => {
// // // //     try {
// // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // //         alert('Aucune donnée disponible.');
// // // //         return;
// // // //       }

// // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // //       );

// // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // //         const row = {
// // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // //           'Email': etud.adresse_email || '',
// // // //           'Parcours': etud.parcours || 'I2026',
// // // //         };

// // // //         chefs.forEach((chef) => {
// // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // //           const rankInfo = studentRanks?.get(chef.id);
// // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // //         });

// // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // //         return row;
// // // //       });

// // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // //       wsSelections['!cols'] = [
// // // //         { wch: 26 },
// // // //         { wch: 32 },
// // // //         { wch: 12 },
// // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // //         { wch: 16 },
// // // //       ];

// // // //       const statsRows = chefs.map((chef) => ({
// // // //         'Chef de Projet': chef.nom,
// // // //         'Spécialité': chef.specialite || 'N/A',
// // // //         'Email': chef.email || '',
// // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // //       }));

// // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // //       const workbook = XLSX.utils.book_new();
// // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // //       const today = new Date().toISOString().slice(0, 10);
// // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // //     } catch (err) {
// // // //       alert(`Erreur export: ${err.message}`);
// // // //     }
// // // //   };

// // // //   // Popup Radar
// // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // //     if (!etudiantId) return;
// // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // //     setModalOpen(true);
// // // //     setModalLoading(true);
// // // //     setModalError(null);
// // // //     setAptitudesData(null);
// // // //     setApetencesData(null);

// // // //     try {
// // // //       const [aptitudes, apetences] = await Promise.all([
// // // //         fetchAptitudesByEtudiant(etudiantId),
// // // //         fetchApetencesByEtudiant(etudiantId),
// // // //       ]);

// // // //       if (!aptitudes && !apetences) {
// // // //         setModalError('Aucune compétence ni appétence enregistrée.');
// // // //       } else {
// // // //         setAptitudesData(aptitudes);
// // // //         setApetencesData(apetences);
// // // //       }
// // // //     } catch (err) {
// // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // //     } finally {
// // // //       setModalLoading(false);
// // // //     }
// // // //   };

// // // //   const radarChartData = useMemo(() => {
// // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // //     return {
// // // //       labels,
// // // //       datasets: [
// // // //         {
// // // //           label: 'Aptitudes (Technique)',
// // // //           data: aptValues,
// // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // //           borderColor: '#38bdf8',
// // // //           borderWidth: 2,
// // // //           pointBackgroundColor: '#38bdf8',
// // // //         },
// // // //         {
// // // //           label: 'Appétences (Intérêt)',
// // // //           data: apeValues,
// // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // //           borderColor: '#f43f5e',
// // // //           borderWidth: 2,
// // // //           pointBackgroundColor: '#f43f5e',
// // // //         },
// // // //       ],
// // // //     };
// // // //   }, [aptitudesData, apetencesData]);

// // // //   const radarOptions = {
// // // //     responsive: true,
// // // //     maintainAspectRatio: false,
// // // //     scales: {
// // // //       r: {
// // // //         min: 0,
// // // //         suggestedMax: 4,
// // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // //       },
// // // //     },
// // // //     plugins: {
// // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // //     },
// // // //   };

// // // //   const toggleMobileExpand = (id) => {
// // // //     setExpandedMobileIds((prev) => {
// // // //       const next = new Set(prev);
// // // //       if (next.has(id)) next.delete(id);
// // // //       else next.add(id);
// // // //       return next;
// // // //     });
// // // //   };

// // // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // // //   if (loading) {
// // // //     return (
// // // //       <>
// // // //         <Navbar />
// // // //         <style>{STYLE_SHEET}</style>
// // // //         <div className="matrix-page">
// // // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // // //               Chargement de la matrice des sélections...
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       </>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <>
// // // //       <Navbar />
// // // //       <style>{STYLE_SHEET}</style>

// // // //       <div className="matrix-page">
// // // //         <div className="matrix-shell">
// // // //           {/* Header */}
// // // //           <div className="matrix-header">
// // // //             <div>
// // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // // //               <p className="matrix-subtitle">
// // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// // // //               </p>
// // // //               <p className="matrix-subtitle auto-legend mono">
// // // //                 🎯 Sélection automatique basée sur les appétences (top 3 par étudiant)
// // // //               </p>
// // // //             </div>

// // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // //               {autoSelecting && (
// // // //                 <span className="pending-chip auto-chip">
// // // //                   <Spinner size="sm" animation="border" /> Calcul automatique en cours...
// // // //                 </span>
// // // //               )}
// // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
// // // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // // //                 📊 Exporter (.xlsx)
// // // //               </Button>
// // // //               <Button
// // // //                 className="btn-pill btn-save-pill"
// // // //                 onClick={handleSubmit}
// // // //                 disabled={saving || !hasChanges}
// // // //               >
// // // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // //           {/* Toolbar unique : recherche, filtre, stats, réglages, actions groupées */}
// // // //           <div className="matrix-toolbar">
// // // //             <InputGroup size="sm" className="toolbar-search">
// // // //               <Form.Control
// // // //                 placeholder="🔍 Rechercher un étudiant..."
// // // //                 value={searchStudent}
// // // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // // //               />
// // // //               {searchStudent && (
// // // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // // //               )}
// // // //             </InputGroup>

// // // //             <Form.Select
// // // //               size="sm"
// // // //               className="toolbar-select"
// // // //               value={selectedChefFilter}
// // // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // //             >
// // // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // // //               {chefs.map((c) => (
// // // //                 <option key={c.id} value={c.id}>
// // // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // //                 </option>
// // // //               ))}
// // // //             </Form.Select>

// // // //             <div className="toolbar-divider" />

// // // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // // //             {!isMobile && (
// // // //               <>
// // // //                 <div className="toolbar-divider" />
// // // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // // //                   <button
// // // //                     type="button"
// // // //                     className={density === 'compact' ? 'active' : ''}
// // // //                     onClick={() => setDensity('compact')}
// // // //                   >
// // // //                     Compact
// // // //                   </button>
// // // //                   <button
// // // //                     type="button"
// // // //                     className={density === 'comfortable' ? 'active' : ''}
// // // //                     onClick={() => setDensity('comfortable')}
// // // //                   >
// // // //                     Confortable
// // // //                   </button>
// // // //                 </div>
// // // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // // //                   <button
// // // //                     type="button"
// // // //                     className={!showFullNames ? 'active' : ''}
// // // //                     onClick={() => setShowFullNames(false)}
// // // //                   >
// // // //                     Initiales
// // // //                   </button>
// // // //                   <button
// // // //                     type="button"
// // // //                     className={showFullNames ? 'active' : ''}
// // // //                     onClick={() => setShowFullNames(true)}
// // // //                   >
// // // //                     Noms complets
// // // //                   </button>
// // // //                 </div>
// // // //               </>
// // // //             )}

// // // //             <div className="bulk-actions">
// // // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // // //             </div>
// // // //           </div>

// // // //           {/* Vue mobile : accordéons */}
// // // //           {isMobile ? (
// // // //             filteredEtudiants.length === 0 ? (
// // // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // // //             ) : (
// // // //               <div className="mobile-list">
// // // //                 {filteredEtudiants.map((etud) => (
// // // //                   <MobileStudentCard
// // // //                     key={etud.id}
// // // //                     etud={etud}
// // // //                     chefs={visibleChefs}
// // // //                     selections={selections}
// // // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // // //                     expanded={expandedMobileIds.has(etud.id)}
// // // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // // //                     onToggleSelection={toggleSelection}
// // // //                     onOpenRadar={handleOpenStudentRadar}
// // // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // // //                   />
// // // //                 ))}
// // // //               </div>
// // // //             )
// // // //           ) : (
// // // //             /* Vue desktop : tableau matriciel */
// // // //             <div className="table-scroll-container">
// // // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th
// // // //                       style={{
// // // //                         minWidth: density === 'compact' ? 148 : 190,
// // // //                         maxWidth: density === 'compact' ? 148 : 190,
// // // //                         textAlign: 'left',
// // // //                         position: 'sticky',
// // // //                         left: 0,
// // // //                         top: 0,
// // // //                         backgroundColor: '#0f1420',
// // // //                         zIndex: 20,
// // // //                         paddingLeft: '0.65rem',
// // // //                       }}
// // // //                     >
// // // //                       Étudiant ({filteredEtudiants.length})
// // // //                     </th>
// // // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // // //                       Total
// // // //                     </th>
// // // //                     {visibleChefs.map((chef) => (
// // // //                       <ChefHeaderCell
// // // //                         key={chef.id}
// // // //                         chef={chef}
// // // //                         count={countsPerChef[chef.id]}
// // // //                         showFullNames={showFullNames}
// // // //                       />
// // // //                     ))}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {filteredEtudiants.length === 0 ? (
// // // //                     <tr>
// // // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // // //                         Aucun étudiant trouvé.
// // // //                       </td>
// // // //                     </tr>
// // // //                   ) : (
// // // //                     filteredEtudiants.map((etud) => {
// // // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // // //                       return (
// // // //                         <tr key={etud.id}>
// // // //                           <td
// // // //                             className="student-cell"
// // // //                             style={{
// // // //                               textAlign: 'left',
// // // //                               position: 'sticky',
// // // //                               left: 0,
// // // //                               backgroundColor: '#131c2e',
// // // //                               zIndex: 5,
// // // //                               paddingLeft: '0.65rem',
// // // //                               maxWidth: density === 'compact' ? 148 : 190,
// // // //                             }}
// // // //                           >
// // // //                             <div className="student-cell-inner">
// // // //                               <span
// // // //                                 className="student-cell-name"
// // // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // // //                                 onClick={() =>
// // // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // // //                                 }
// // // //                               >
// // // //                                 {etud.nom} {etud.prenom}
// // // //                               </span>
// // // //                               {density === 'comfortable' && (
// // // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // // //                                   {etud.adresse_email}
// // // //                                 </div>
// // // //                               )}
// // // //                               {(etud.cv_path || etud.lm_path) && (
// // // //                                 <div className="d-flex gap-1 mt-1">
// // // //                                   {etud.cv_path && (
// // // //                                     <a
// // // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // // //                                       target="_blank"
// // // //                                       rel="noopener noreferrer"
// // // //                                       className="doc-badge badge"
// // // //                                       title="CV"
// // // //                                     >
// // // //                                       📄
// // // //                                     </a>
// // // //                                   )}
// // // //                                   {etud.lm_path && (
// // // //                                     <a
// // // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // // //                                       target="_blank"
// // // //                                       rel="noopener noreferrer"
// // // //                                       className="doc-badge badge"
// // // //                                       title="Lettre de motivation"
// // // //                                     >
// // // //                                       ✉️
// // // //                                     </a>
// // // //                                   )}
// // // //                                 </div>
// // // //                               )}
// // // //                             </div>
// // // //                           </td>

// // // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // //                           </td>

// // // //                           {visibleChefs.map((chef) => {
// // // //                             const key = `${etud.id}-${chef.id}`;
// // // //                             const isSelected = selections.has(key);
// // // //                             const rankInfo = studentRanks?.get(chef.id);
// // // //                             const rankNum = rankInfo?.rank || 1;

// // // //                             return (
// // // //                               <SelectionCell
// // // //                                 key={chef.id}
// // // //                                 selected={isSelected}
// // // //                                 rankNum={rankNum}
// // // //                                 rankInfo={rankInfo}
// // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // //                               />
// // // //                             );
// // // //                           })}
// // // //                         </tr>
// // // //                       );
// // // //                     })
// // // //                   )}
// // // //                 </tbody>
// // // //               </Table>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Modal Radar */}
// // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark" backdropClassName="modal-dark-backdrop">
// // // //         <Modal.Header closeButton closeVariant="white">
// // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // //         </Modal.Header>
// // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // //           {modalLoading ? (
// // // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// // // //           ) : modalError ? (
// // // //             <Alert variant="warning">{modalError}</Alert>
// // // //           ) : (
// // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // //               <Radar data={radarChartData} options={radarOptions} />
// // // //             </div>
// // // //           )}
// // // //         </Modal.Body>
// // // //         <Modal.Footer>
// // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // //         </Modal.Footer>
// // // //       </Modal>
// // // //     </>
// // // //   );
// // // // }

// // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // import {
// // //   Table,
// // //   Button,
// // //   Alert,
// // //   Spinner,
// // //   Form,
// // //   InputGroup,
// // //   Badge,
// // //   Modal,
// // // } from 'react-bootstrap';
// // // import * as XLSX from 'xlsx';
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
// // // import Navbar from './Navbar';
// // // import {
// // //   fetchChefsDeProjet,
// // //   fetchEtudiants,
// // //   fetchSelections,
// // //   saveSelection,
// // //   deleteSelection,
// // //   resetAllSelections,
// // //   fetchAllApetences,
// // //   fetchAptitudesByEtudiant,
// // //   fetchApetencesByEtudiant,
// // //   computeChefRanksForStudent,
// // //   getDocumentPublicUrl,
// // // } from '../services/supabase';

// // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // ============================================================================
// // // // Constantes & helpers métier
// // // // ============================================================================

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

// // // const getRankBadgeStyle = (rank) => {
// // //   switch (rank) {
// // //     case 1:
// // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // //     case 2:
// // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // //     case 3:
// // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // //     default:
// // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // //   }
// // // };

// // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // ============================================================================
// // // // Hook responsive
// // // // ============================================================================

// // // function useIsMobile(breakpoint = 768) {
// // //   const [isMobile, setIsMobile] = useState(
// // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // //   );

// // //   useEffect(() => {
// // //     if (typeof window === 'undefined') return undefined;
// // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // //     const handler = (e) => setIsMobile(e.matches);
// // //     setIsMobile(mql.matches);
// // //     mql.addEventListener('change', handler);
// // //     return () => mql.removeEventListener('change', handler);
// // //   }, [breakpoint]);

// // //   return isMobile;
// // // }

// // // // ============================================================================
// // // // Styles
// // // // ============================================================================

// // // const STYLE_SHEET = `
// // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // .matrix-page {
// // //   --bg: #0a0d12;
// // //   --surface: #12161f;
// // //   --surface-2: #1a2029;
// // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // //   --border: #232a37;
// // //   --text: #e9ecf1;
// // //   --text-muted: #8b93a5;
// // //   --text-faint: #5a6272;
// // //   --accent: #2dd4bf;
// // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // //   font-family: 'Inter', -apple-system, sans-serif;
// // //   background: var(--bg);
// // //   min-height: 100vh;
// // //   color: var(--text);
// // // }
// // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // .matrix-shell {
// // //   max-width: 100%;
// // //   margin: 0 auto;
// // //   padding: 1.25rem 1.5rem 2rem;
// // // }

// // // /* ---------- Header ---------- */
// // // .matrix-header {
// // //   display: flex;
// // //   justify-content: space-between;
// // //   align-items: center;
// // //   gap: 1rem;
// // //   flex-wrap: wrap;
// // //   margin-bottom: 0.9rem;
// // // }
// // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }
// // // .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

// // // .btn-pill {
// // //   border-radius: 999px !important;
// // //   font-weight: 600 !important;
// // //   font-size: 0.82rem !important;
// // //   padding: 0.45rem 1rem !important;
// // //   border: 1px solid var(--border) !important;
// // // }
// // // .btn-save-pill {
// // //   background: var(--accent) !important;
// // //   border: none !important;
// // //   color: #06201c !important;
// // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // }
// // // .btn-save-pill:disabled { opacity: 0.5; }
// // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // .btn-danger-pill {
// // //   background: rgba(239, 68, 68, 0.14) !important;
// // //   color: #f87171 !important;
// // //   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // }
// // // .btn-danger-pill:hover:not(:disabled) {
// // //   background: #dc2626 !important;
// // //   color: #ffffff !important;
// // //   border-color: #dc2626 !important;
// // // }
// // // .btn-danger-pill:disabled { opacity: 0.4; }

// // // .pending-chip {
// // //   display: inline-flex;
// // //   align-items: center;
// // //   gap: 0.35rem;
// // //   background: rgba(245, 158, 11, 0.14);
// // //   color: #fbbf24;
// // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // //   border-radius: 999px;
// // //   padding: 0.3rem 0.75rem;
// // //   font-size: 0.78rem;
// // //   font-weight: 600;
// // // }
// // // .pending-chip.auto-chip {
// // //   background: rgba(45, 212, 191, 0.14);
// // //   color: #2dd4bf;
// // //   border: 1px solid rgba(45, 212, 191, 0.35);
// // // }

// // // /* ---------- Toolbar unique ---------- */
// // // .matrix-toolbar {
// // //   background: var(--surface);
// // //   border: 1px solid var(--border);
// // //   border-radius: 14px;
// // //   padding: 0.75rem 0.9rem;
// // //   margin-bottom: 0.9rem;
// // //   display: flex;
// // //   align-items: center;
// // //   gap: 0.9rem;
// // //   flex-wrap: wrap;
// // // }
// // // .matrix-toolbar .form-control,
// // // .matrix-toolbar .form-select {
// // //   background: var(--surface-2);
// // //   border: 1px solid var(--border);
// // //   color: var(--text);
// // //   font-size: 0.85rem;
// // // }
// // // .matrix-toolbar .form-control:focus,
// // // .matrix-toolbar .form-select:focus {
// // //   background: var(--surface-2);
// // //   border-color: var(--accent);
// // //   color: var(--text);
// // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // }
// // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // .stat-chip {
// // //   background: var(--surface-2);
// // //   border: 1px solid var(--border);
// // //   border-radius: 999px;
// // //   padding: 0.32rem 0.7rem;
// // //   font-size: 0.76rem;
// // //   color: var(--text-muted);
// // //   white-space: nowrap;
// // // }
// // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // .stat-chip.accent strong { color: var(--accent); }

// // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // .segmented {
// // //   display: inline-flex;
// // //   background: var(--surface-2);
// // //   border: 1px solid var(--border);
// // //   border-radius: 8px;
// // //   padding: 2px;
// // //   gap: 2px;
// // // }
// // // .segmented button {
// // //   border: none;
// // //   background: transparent;
// // //   color: var(--text-faint);
// // //   font-size: 0.74rem;
// // //   font-weight: 600;
// // //   padding: 0.3rem 0.55rem;
// // //   border-radius: 6px;
// // //   cursor: pointer;
// // //   transition: background 0.12s ease, color 0.12s ease;
// // // }
// // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // .btn-ghost {
// // //   background: transparent !important;
// // //   border: 1px solid var(--border) !important;
// // //   color: var(--text-muted) !important;
// // //   font-size: 0.78rem !important;
// // //   border-radius: 8px !important;
// // //   padding: 0.35rem 0.65rem !important;
// // // }
// // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // /* ---------- Tableau matriciel ---------- */
// // // .table-scroll-container {
// // //   width: 100%;
// // //   max-height: calc(100vh - 230px);
// // //   min-height: 420px;
// // //   overflow: auto;
// // //   border-radius: 14px;
// // //   border: 1px solid var(--border);
// // //   background: var(--surface);
// // // }
// // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // .matrix-table thead th {
// // //   position: sticky;
// // //   top: 0;
// // //   background: #0f1420 !important;
// // //   z-index: 10;
// // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // //   vertical-align: middle;
// // // }

// // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // .student-cell { white-space: normal; }
// // // .student-cell-inner { max-width: 100%; }
// // // .student-cell-name {
// // //   display: block;
// // //   font-weight: 600;
// // //   color: var(--accent);
// // //   cursor: pointer;
// // //   text-decoration: none;
// // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // //   white-space: nowrap;
// // //   overflow: hidden;
// // //   text-overflow: ellipsis;
// // // }
// // // .student-cell-name:hover { color: #6ee7de; }
// // // .student-cell-email {
// // //   color: var(--text-faint);
// // //   font-size: 0.7rem;
// // //   font-family: 'JetBrains Mono', monospace;
// // //   white-space: nowrap;
// // //   overflow: hidden;
// // //   text-overflow: ellipsis;
// // // }

// // // .doc-badge {
// // //   font-size: 0.68rem;
// // //   padding: 0.15rem 0.4rem;
// // //   border-radius: 5px;
// // //   background: var(--surface-2) !important;
// // //   border: 1px solid var(--border);
// // //   color: var(--text-muted) !important;
// // //   text-decoration: none !important;
// // // }

// // // .chef-head-cell { text-align: center; }
// // // .chef-avatar {
// // //   min-width: 40px;
// // //   height: 24px;
// // //   padding: 0 6px;
// // //   border-radius: 7px;
// // //   background: var(--surface-2);
// // //   border: 1px solid var(--border);
// // //   display: inline-flex;
// // //   align-items: center;
// // //   justify-content: center;
// // //   font-size: 0.66rem;
// // //   font-weight: 700;
// // //   letter-spacing: 0.02em;
// // //   color: var(--accent);
// // //   margin-bottom: 2px;
// // //   font-family: 'JetBrains Mono', monospace;
// // // }
// // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // .chef-specialite {
// // //   color: var(--text-faint);
// // //   font-weight: 400;
// // //   font-size: 0.68rem;
// // //   max-width: 130px;
// // //   white-space: nowrap;
// // //   overflow: hidden;
// // //   text-overflow: ellipsis;
// // //   margin: 0 auto;
// // // }
// // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // /* ---------- Cellule de sélection ---------- */
// // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // .badge-rank-selection {
// // //   display: inline-flex;
// // //   align-items: center;
// // //   gap: 4px;
// // //   min-width: 34px;
// // //   justify-content: center;
// // //   padding: 3px 9px;
// // //   border-radius: 7px;
// // //   font-weight: 700;
// // //   font-size: 0.74rem;
// // //   pointer-events: none;
// // //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // // }
// // // .badge-rank-selection.is-pending {
// // //   background: transparent;
// // //   border: 1px dashed var(--border);
// // //   color: var(--text-faint);
// // //   opacity: 0.75;
// // // }
// // // .sel-cell:hover .badge-rank-selection.is-pending {
// // //   opacity: 1;
// // //   border-color: var(--accent);
// // //   color: var(--accent);
// // //   transform: translateY(-1px);
// // // }
// // // .badge-rank-selection.is-selected { border-style: solid; }
// // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // /* ---------- Vue mobile ---------- */
// // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // .mobile-card-head {
// // //   display: flex;
// // //   align-items: center;
// // //   gap: 0.7rem;
// // //   padding: 0.75rem 0.85rem;
// // //   cursor: pointer;
// // // }
// // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // .mobile-chef-chip {
// // //   display: inline-flex;
// // //   align-items: center;
// // //   gap: 0.35rem;
// // //   padding: 0.35rem 0.6rem;
// // //   border-radius: 999px;
// // //   font-size: 0.76rem;
// // //   font-weight: 600;
// // //   cursor: pointer;
// // //   border: 1px solid var(--border);
// // //   background: var(--surface-2);
// // //   color: var(--text-muted);
// // //   transition: border-color 0.12s ease, color 0.12s ease;
// // // }
// // // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // // .empty-state {
// // //   text-align: center;
// // //   padding: 3rem 1rem;
// // //   color: var(--text-muted);
// // // }

// // // /* ---------- Modals Dark ---------- */
// // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // .modal-dark .modal-content {
// // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // //   background-color: #12161f !important;
// // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // //   border-radius: 20px;
// // //   color: var(--text);
// // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
// // //   overflow: hidden;
// // // }
// // // .modal-dark .modal-header {
// // //   border-bottom: 1px solid var(--border);
// // //   background: rgba(45, 212, 191, 0.07);
// // //   padding: 1.15rem 1.5rem;
// // // }
// // // .modal-dark .modal-header.danger-header {
// // //   background: rgba(239, 68, 68, 0.12);
// // //   border-bottom-color: rgba(239, 68, 68, 0.25);
// // // }
// // // .modal-dark .modal-body {
// // //   padding: 1.5rem;
// // // }
// // // .modal-dark .modal-footer {
// // //   border-top: 1px solid var(--border);
// // //   padding: 0.9rem 1.5rem;
// // // }
// // // .modal-dark .btn-close {
// // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // //   opacity: 0.7;
// // // }

// // // @media (max-width: 767px) {
// // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // //   .bulk-actions { margin-left: 0; }
// // // }
// // // `;

// // // // ============================================================================
// // // // Sous-composants
// // // // ============================================================================

// // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // //   return (
// // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // //       {showFullNames && (
// // //         <>
// // //           <div className="chef-fullname">{chef.nom}</div>
// // //           {chef.specialite && (
// // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // //           )}
// // //         </>
// // //       )}
// // //       <div>
// // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // //       </div>
// // //     </th>
// // //   );
// // // }

// // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // //   return (
// // //     <td className="sel-cell" onClick={onClick}>
// // //       <span
// // //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// // //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// // //         title={
// // //           selected
// // //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// // //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// // //         }
// // //       >
// // //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// // //       </span>
// // //     </td>
// // //   );
// // // }

// // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // //   return (
// // //     <div className="mobile-card">
// // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // //         <div style={{ flex: 1, minWidth: 0 }}>
// // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // //         </div>
// // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // //       </div>
// // //       {expanded && (
// // //         <div className="mobile-card-body">
// // //           <Button
// // //             size="sm"
// // //             className="btn-ghost"
// // //             onClick={(e) => {
// // //               e.stopPropagation();
// // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // //             }}
// // //           >
// // //             📊 Profil compétences
// // //           </Button>
// // //           {chefs.map((chef) => {
// // //             const key = `${etud.id}-${chef.id}`;
// // //             const isSelected = selections.has(key);
// // //             const rankInfo = studentRanks?.get(chef.id);
// // //             const rankNum = rankInfo?.rank || 1;
// // //             return (
// // //               <span
// // //                 key={chef.id}
// // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix)`}
// // //               >
// // //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
// // //               </span>
// // //             );
// // //           })}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ============================================================================
// // // // Composant principal
// // // // ============================================================================

// // // export default function SelectionPage() {
// // //   const [chefs, setChefs] = useState([]);
// // //   const [etudiants, setEtudiants] = useState([]);
// // //   const [apetencesList, setApetencesList] = useState([]);

// // //   const [selections, setSelections] = useState(new Set());
// // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // //   const [searchStudent, setSearchStudent] = useState('');
// // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [successMsg, setSuccessMsg] = useState(null);

// // //   // État Réinitialisation (Reset modal)
// // //   const [showResetModal, setShowResetModal] = useState(false);
// // //   const [resetting, setResetting] = useState(false);

// // //   // Sélection automatique (top 3)
// // //   const [autoSelecting, setAutoSelecting] = useState(false);

// // //   // Réglages d'affichage
// // //   const [density, setDensity] = useState('compact');
// // //   const [showFullNames, setShowFullNames] = useState(false);
// // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // //   // Modal Radar
// // //   const [modalOpen, setModalOpen] = useState(false);
// // //   const [modalLoading, setModalLoading] = useState(false);
// // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // //   const [aptitudesData, setAptitudesData] = useState(null);
// // //   const [apetencesData, setApetencesData] = useState(null);
// // //   const [modalError, setModalError] = useState(null);

// // //   const isMobile = useIsMobile(768);

// // //   const loadData = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // //         fetchChefsDeProjet(),
// // //         fetchEtudiants(),
// // //         fetchSelections(),
// // //         fetchAllApetences(),
// // //       ]);

// // //       setChefs(chefsData || []);
// // //       setEtudiants(etudiantsData || []);
// // //       setApetencesList(apetencesDataRaw || []);

// // //       const activeSet = new Set();
// // //       (selectionsData || []).forEach((s) => {
// // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // //         }
// // //       });

// // //       setSelections(new Set(activeSet));
// // //       setInitialSelections(new Set(activeSet));
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors du chargement des données.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

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

// // //   // Sélection automatique (top 3) pour les étudiants n'ayant aucun vœu
// // //   useEffect(() => {
// // //     if (loading || chefs.length === 0 || etudiants.length === 0) return;

// // //     const etudiantsAvecSelection = new Set();
// // //     initialSelections.forEach((key) => {
// // //       etudiantsAvecSelection.add(key.split('-')[0]);
// // //     });

// // //     const etudiantsASelectionner = etudiants.filter(
// // //       (e) => !etudiantsAvecSelection.has(String(e.id))
// // //     );
// // //     if (etudiantsASelectionner.length === 0) return;

// // //     let cancelled = false;

// // //     const autoSelect = async () => {
// // //       setAutoSelecting(true);
// // //       const nouvellesCles = [];
// // //       const enregistrements = [];

// // //       etudiantsASelectionner.forEach((etud) => {
// // //         const ranks = appetenceRanksMap.get(etud.id);
// // //         if (!ranks) return;
// // //         ranks.forEach((info, chefId) => {
// // //           if (info.rank <= 3) {
// // //             nouvellesCles.push(`${etud.id}-${chefId}`);
// // //             enregistrements.push(saveSelection(etud.id, chefId));
// // //           }
// // //         });
// // //       });

// // //       if (nouvellesCles.length === 0) {
// // //         if (!cancelled) setAutoSelecting(false);
// // //         return;
// // //       }

// // //       try {
// // //         await Promise.all(enregistrements);
// // //         if (!cancelled) {
// // //           setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // //           setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // //         }
// // //       } catch (err) {
// // //         if (!cancelled) setError(err.message || 'Erreur sélection automatique.');
// // //       } finally {
// // //         if (!cancelled) setAutoSelecting(false);
// // //       }
// // //     };

// // //     autoSelect();

// // //     return () => {
// // //       cancelled = true;
// // //     };
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [loading, chefs, etudiants, appetenceRanksMap]);

// // //   const hasChanges = useMemo(() => {
// // //     if (selections.size !== initialSelections.size) return true;
// // //     for (const key of selections) {
// // //       if (!initialSelections.has(key)) return true;
// // //     }
// // //     return false;
// // //   }, [selections, initialSelections]);

// // //   const filteredEtudiants = useMemo(() => {
// // //     const term = searchStudent.toLowerCase().trim();
// // //     if (!term) return etudiants;
// // //     return etudiants.filter(
// // //       (e) =>
// // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // //     );
// // //   }, [etudiants, searchStudent]);

// // //   const visibleChefs = useMemo(() => {
// // //     if (selectedChefFilter === 'all') return chefs;
// // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // //   }, [chefs, selectedChefFilter]);

// // //   const countsPerStudent = useMemo(() => {
// // //     const map = {};
// // //     for (const key of selections) {
// // //       const [etudId] = key.split('-');
// // //       map[etudId] = (map[etudId] || 0) + 1;
// // //     }
// // //     return map;
// // //   }, [selections]);

// // //   const countsPerChef = useMemo(() => {
// // //     const map = {};
// // //     for (const key of selections) {
// // //       const [, chefId] = key.split('-');
// // //       map[chefId] = (map[chefId] || 0) + 1;
// // //     }
// // //     return map;
// // //   }, [selections]);

// // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // //     const key = `${etudiantId}-${chefId}`;
// // //     setSelections((prev) => {
// // //       const next = new Set(prev);
// // //       if (next.has(key)) next.delete(key);
// // //       else next.add(key);
// // //       return next;
// // //     });
// // //     setSuccessMsg(null);
// // //   }, []);

// // //   const handleSelectAllVisible = () => {
// // //     setSelections((prev) => {
// // //       const next = new Set(prev);
// // //       filteredEtudiants.forEach((e) => {
// // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // //       });
// // //       return next;
// // //     });
// // //     setSuccessMsg(null);
// // //   };

// // //   const handleDeselectAllVisible = () => {
// // //     setSelections((prev) => {
// // //       const next = new Set(prev);
// // //       filteredEtudiants.forEach((e) => {
// // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // //       });
// // //       return next;
// // //     });
// // //     setSuccessMsg(null);
// // //   };

// // //   const handleSubmit = async () => {
// // //     try {
// // //       setSaving(true);
// // //       setError(null);
// // //       setSuccessMsg(null);

// // //       const toAdd = [];
// // //       selections.forEach((key) => {
// // //         if (!initialSelections.has(key)) {
// // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // //           toAdd.push({ etudiantId, chefId });
// // //         }
// // //       });

// // //       const toDelete = [];
// // //       initialSelections.forEach((key) => {
// // //         if (!selections.has(key)) {
// // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // //           toDelete.push({ etudiantId, chefId });
// // //         }
// // //       });

// // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // //         deleteSelection(etudiantId, chefId)
// // //       );
// // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // //         saveSelection(etudiantId, chefId)
// // //       );

// // //       await Promise.all([...deletePromises, ...addPromises]);

// // //       setInitialSelections(new Set(selections));
// // //       setSuccessMsg(
// // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // //       );
// // //     } catch (err) {
// // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   // Action de Réinitialisation complète des sélections
// // //   const handleResetSelections = async () => {
// // //     try {
// // //       setResetting(true);
// // //       setError(null);
// // //       await resetAllSelections();
// // //       setSelections(new Set());
// // //       setInitialSelections(new Set());
// // //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// // //       setShowResetModal(false);
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// // //     } finally {
// // //       setResetting(false);
// // //     }
// // //   };

// // //   // Export Excel
// // //   const handleDownloadSelectionXLSX = () => {
// // //     try {
// // //       if (etudiants.length === 0 || chefs.length === 0) {
// // //         alert('Aucune donnée disponible.');
// // //         return;
// // //       }

// // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // //       );

// // //       const selectionRows = sortedEtudiants.map((etud) => {
// // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // //         const row = {
// // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // //           'Email': etud.adresse_email || '',
// // //           'Parcours': etud.parcours || 'I2026',
// // //         };

// // //         chefs.forEach((chef) => {
// // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // //           const rankInfo = studentRanks?.get(chef.id);
// // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // //         });

// // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // //         return row;
// // //       });

// // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // //       wsSelections['!cols'] = [
// // //         { wch: 26 },
// // //         { wch: 32 },
// // //         { wch: 12 },
// // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // //         { wch: 16 },
// // //       ];

// // //       const statsRows = chefs.map((chef) => ({
// // //         'Chef de Projet': chef.nom,
// // //         'Spécialité': chef.specialite || 'N/A',
// // //         'Email': chef.email || '',
// // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // //       }));

// // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // //       const workbook = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // //       const today = new Date().toISOString().slice(0, 10);
// // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // //     } catch (err) {
// // //       alert(`Erreur export: ${err.message}`);
// // //     }
// // //   };

// // //   // Popup Radar
// // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // //     if (!etudiantId) return;
// // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // //     setModalOpen(true);
// // //     setModalLoading(true);
// // //     setModalError(null);
// // //     setAptitudesData(null);
// // //     setApetencesData(null);

// // //     try {
// // //       const [aptitudes, apetences] = await Promise.all([
// // //         fetchAptitudesByEtudiant(etudiantId),
// // //         fetchApetencesByEtudiant(etudiantId),
// // //       ]);

// // //       if (!aptitudes && !apetences) {
// // //         setModalError('Aucune compétence ni appétence enregistrée.');
// // //       } else {
// // //         setAptitudesData(aptitudes);
// // //         setApetencesData(apetences);
// // //       }
// // //     } catch (err) {
// // //       setModalError(err.message || 'Erreur chargement compétences.');
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
// // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // //     },
// // //   };

// // //   const toggleMobileExpand = (id) => {
// // //     setExpandedMobileIds((prev) => {
// // //       const next = new Set(prev);
// // //       if (next.has(id)) next.delete(id);
// // //       else next.add(id);
// // //       return next;
// // //     });
// // //   };

// // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // //   if (loading) {
// // //     return (
// // //       <>
// // //         <Navbar />
// // //         <style>{STYLE_SHEET}</style>
// // //         <div className="matrix-page">
// // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // //               Chargement de la matrice des sélections...
// // //             </p>
// // //           </div>
// // //         </div>
// // //       </>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <style>{STYLE_SHEET}</style>

// // //       <div className="matrix-page">
// // //         <div className="matrix-shell">
// // //           {/* Header */}
// // //           <div className="matrix-header">
// // //             <div>
// // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // //               <p className="matrix-subtitle">
// // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// // //               </p>
// // //               <p className="matrix-subtitle auto-legend mono">
// // //                 🎯 Sélection automatique basée sur les appétences (top 3 par étudiant)
// // //               </p>
// // //             </div>

// // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // //               {autoSelecting && (
// // //                 <span className="pending-chip auto-chip">
// // //                   <Spinner size="sm" animation="border" /> Calcul automatique en cours...
// // //                 </span>
// // //               )}
// // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
              
// // //               {/* Bouton Réinitialiser / Vider */}
// // //               <Button
// // //                 className="btn-pill btn-danger-pill"
// // //                 onClick={() => setShowResetModal(true)}
// // //                 disabled={selections.size === 0 || resetting}
// // //                 title="Supprimer toutes les sélections pour repartir de zéro"
// // //               >
// // //                 🗑️ Vider tout ({selections.size})
// // //               </Button>

// // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // //                 📊 Exporter (.xlsx)
// // //               </Button>

// // //               <Button
// // //                 className="btn-pill btn-save-pill"
// // //                 onClick={handleSubmit}
// // //                 disabled={saving || !hasChanges}
// // //               >
// // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // //           {/* Toolbar unique */}
// // //           <div className="matrix-toolbar">
// // //             <InputGroup size="sm" className="toolbar-search">
// // //               <Form.Control
// // //                 placeholder="🔍 Rechercher un étudiant..."
// // //                 value={searchStudent}
// // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // //               />
// // //               {searchStudent && (
// // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // //               )}
// // //             </InputGroup>

// // //             <Form.Select
// // //               size="sm"
// // //               className="toolbar-select"
// // //               value={selectedChefFilter}
// // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // //             >
// // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // //               {chefs.map((c) => (
// // //                 <option key={c.id} value={c.id}>
// // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // //                 </option>
// // //               ))}
// // //             </Form.Select>

// // //             <div className="toolbar-divider" />

// // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // //             {!isMobile && (
// // //               <>
// // //                 <div className="toolbar-divider" />
// // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // //                   <button
// // //                     type="button"
// // //                     className={density === 'compact' ? 'active' : ''}
// // //                     onClick={() => setDensity('compact')}
// // //                   >
// // //                     Compact
// // //                   </button>
// // //                   <button
// // //                     type="button"
// // //                     className={density === 'comfortable' ? 'active' : ''}
// // //                     onClick={() => setDensity('comfortable')}
// // //                   >
// // //                     Confortable
// // //                   </button>
// // //                 </div>
// // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // //                   <button
// // //                     type="button"
// // //                     className={!showFullNames ? 'active' : ''}
// // //                     onClick={() => setShowFullNames(false)}
// // //                   >
// // //                     Initiales
// // //                   </button>
// // //                   <button
// // //                     type="button"
// // //                     className={showFullNames ? 'active' : ''}
// // //                     onClick={() => setShowFullNames(true)}
// // //                   >
// // //                     Noms complets
// // //                   </button>
// // //                 </div>
// // //               </>
// // //             )}

// // //             <div className="bulk-actions">
// // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // //             </div>
// // //           </div>

// // //           {/* Vue mobile */}
// // //           {isMobile ? (
// // //             filteredEtudiants.length === 0 ? (
// // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // //             ) : (
// // //               <div className="mobile-list">
// // //                 {filteredEtudiants.map((etud) => (
// // //                   <MobileStudentCard
// // //                     key={etud.id}
// // //                     etud={etud}
// // //                     chefs={visibleChefs}
// // //                     selections={selections}
// // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // //                     expanded={expandedMobileIds.has(etud.id)}
// // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // //                     onToggleSelection={toggleSelection}
// // //                     onOpenRadar={handleOpenStudentRadar}
// // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // //                   />
// // //                 ))}
// // //               </div>
// // //             )
// // //           ) : (
// // //             /* Vue desktop */
// // //             <div className="table-scroll-container">
// // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // //                 <thead>
// // //                   <tr>
// // //                     <th
// // //                       style={{
// // //                         minWidth: density === 'compact' ? 148 : 190,
// // //                         maxWidth: density === 'compact' ? 148 : 190,
// // //                         textAlign: 'left',
// // //                         position: 'sticky',
// // //                         left: 0,
// // //                         top: 0,
// // //                         backgroundColor: '#0f1420',
// // //                         zIndex: 20,
// // //                         paddingLeft: '0.65rem',
// // //                       }}
// // //                     >
// // //                       Étudiant ({filteredEtudiants.length})
// // //                     </th>
// // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // //                       Total
// // //                     </th>
// // //                     {visibleChefs.map((chef) => (
// // //                       <ChefHeaderCell
// // //                         key={chef.id}
// // //                         chef={chef}
// // //                         count={countsPerChef[chef.id]}
// // //                         showFullNames={showFullNames}
// // //                       />
// // //                     ))}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {filteredEtudiants.length === 0 ? (
// // //                     <tr>
// // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // //                         Aucun étudiant trouvé.
// // //                       </td>
// // //                     </tr>
// // //                   ) : (
// // //                     filteredEtudiants.map((etud) => {
// // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // //                       return (
// // //                         <tr key={etud.id}>
// // //                           <td
// // //                             className="student-cell"
// // //                             style={{
// // //                               textAlign: 'left',
// // //                               position: 'sticky',
// // //                               left: 0,
// // //                               backgroundColor: '#131c2e',
// // //                               zIndex: 5,
// // //                               paddingLeft: '0.65rem',
// // //                               maxWidth: density === 'compact' ? 148 : 190,
// // //                             }}
// // //                           >
// // //                             <div className="student-cell-inner">
// // //                               <span
// // //                                 className="student-cell-name"
// // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // //                                 onClick={() =>
// // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // //                                 }
// // //                               >
// // //                                 {etud.nom} {etud.prenom}
// // //                               </span>
// // //                               {density === 'comfortable' && (
// // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // //                                   {etud.adresse_email}
// // //                                 </div>
// // //                               )}
// // //                               {(etud.cv_path || etud.lm_path) && (
// // //                                 <div className="d-flex gap-1 mt-1">
// // //                                   {etud.cv_path && (
// // //                                     <a
// // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // //                                       target="_blank"
// // //                                       rel="noopener noreferrer"
// // //                                       className="doc-badge badge"
// // //                                       title="CV"
// // //                                     >
// // //                                       📄
// // //                                     </a>
// // //                                   )}
// // //                                   {etud.lm_path && (
// // //                                     <a
// // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // //                                       target="_blank"
// // //                                       rel="noopener noreferrer"
// // //                                       className="doc-badge badge"
// // //                                       title="Lettre de motivation"
// // //                                     >
// // //                                       ✉️
// // //                                     </a>
// // //                                   )}
// // //                                 </div>
// // //                               )}
// // //                             </div>
// // //                           </td>

// // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // //                           </td>

// // //                           {visibleChefs.map((chef) => {
// // //                             const key = `${etud.id}-${chef.id}`;
// // //                             const isSelected = selections.has(key);
// // //                             const rankInfo = studentRanks?.get(chef.id);
// // //                             const rankNum = rankInfo?.rank || 1;

// // //                             return (
// // //                               <SelectionCell
// // //                                 key={chef.id}
// // //                                 selected={isSelected}
// // //                                 rankNum={rankNum}
// // //                                 rankInfo={rankInfo}
// // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // //                               />
// // //                             );
// // //                           })}
// // //                         </tr>
// // //                       );
// // //                     })
// // //                   )}
// // //                 </tbody>
// // //               </Table>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Modal Confirmation Réinitialisation Sélections */}
// // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// // //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body>
// // //           <p>
// // //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selections.size} vœux)</strong> de la base de données ?
// // //           </p>
// // //           <p className="text-muted small mb-0">
// // //             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
// // //           </p>
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // //             Annuler
// // //           </Button>
// // //           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
// // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
// // //           </Button>
// // //         </Modal.Footer>
// // //       </Modal>

// // //       {/* Modal Radar */}
// // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // //           {modalLoading ? (
// // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// // //           ) : modalError ? (
// // //             <Alert variant="warning">{modalError}</Alert>
// // //           ) : (
// // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // //               <Radar data={radarChartData} options={radarOptions} />
// // //             </div>
// // //           )}
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // //         </Modal.Footer>
// // //       </Modal>
// // //     </>
// // //   );
// // // }

// // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // import {
// //   Table,
// //   Button,
// //   Alert,
// //   Spinner,
// //   Form,
// //   InputGroup,
// //   Badge,
// //   Modal,
// // } from 'react-bootstrap';
// // import * as XLSX from 'xlsx';
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
// // import Navbar from './Navbar';
// // import {
// //   fetchChefsDeProjet,
// //   fetchEtudiants,
// //   fetchSelections,
// //   saveSelection,
// //   deleteSelection,
// //   resetAllSelections,
// //   fetchAllApetences,
// //   fetchAptitudesByEtudiant,
// //   fetchApetencesByEtudiant,
// //   computeChefRanksForStudent,
// //   getDocumentPublicUrl,
// // } from '../services/supabase';

// // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // ============================================================================
// // // Constantes & helpers métier
// // // ============================================================================

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

// // const getRankBadgeStyle = (rank) => {
// //   switch (rank) {
// //     case 1:
// //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// //     case 2:
// //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// //     case 3:
// //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// //     default:
// //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// //   }
// // };

// // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // ============================================================================
// // // Hook responsive
// // // ============================================================================

// // function useIsMobile(breakpoint = 768) {
// //   const [isMobile, setIsMobile] = useState(
// //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// //   );

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return undefined;
// //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// //     const handler = (e) => setIsMobile(e.matches);
// //     setIsMobile(mql.matches);
// //     mql.addEventListener('change', handler);
// //     return () => mql.removeEventListener('change', handler);
// //   }, [breakpoint]);

// //   return isMobile;
// // }

// // // ============================================================================
// // // Styles
// // // ============================================================================

// // const STYLE_SHEET = `
// // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // .matrix-page {
// //   --bg: #0a0d12;
// //   --surface: #12161f;
// //   --surface-2: #1a2029;
// //   --surface-hover: rgba(99, 102, 241, 0.08);
// //   --border: #232a37;
// //   --text: #e9ecf1;
// //   --text-muted: #8b93a5;
// //   --text-faint: #5a6272;
// //   --accent: #2dd4bf;
// //   --accent-soft: rgba(45, 212, 191, 0.14);
// //   font-family: 'Inter', -apple-system, sans-serif;
// //   background: var(--bg);
// //   min-height: 100vh;
// //   color: var(--text);
// // }
// // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // .matrix-shell {
// //   max-width: 100%;
// //   margin: 0 auto;
// //   padding: 1.25rem 1.5rem 2rem;
// // }

// // /* ---------- Header ---------- */
// // .matrix-header {
// //   display: flex;
// //   justify-content: space-between;
// //   align-items: center;
// //   gap: 1rem;
// //   flex-wrap: wrap;
// //   margin-bottom: 0.9rem;
// // }
// // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }
// // .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

// // .btn-pill {
// //   border-radius: 999px !important;
// //   font-weight: 600 !important;
// //   font-size: 0.82rem !important;
// //   padding: 0.45rem 1rem !important;
// //   border: 1px solid var(--border) !important;
// // }
// // .btn-save-pill {
// //   background: var(--accent) !important;
// //   border: none !important;
// //   color: #06201c !important;
// //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // }
// // .btn-save-pill:disabled { opacity: 0.5; }
// // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // .btn-danger-pill {
// //   background: rgba(239, 68, 68, 0.14) !important;
// //   color: #f87171 !important;
// //   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // }
// // .btn-danger-pill:hover:not(:disabled) {
// //   background: #dc2626 !important;
// //   color: #ffffff !important;
// //   border-color: #dc2626 !important;
// // }
// // .btn-danger-pill:disabled { opacity: 0.4; }

// // .pending-chip {
// //   display: inline-flex;
// //   align-items: center;
// //   gap: 0.35rem;
// //   background: rgba(245, 158, 11, 0.14);
// //   color: #fbbf24;
// //   border: 1px solid rgba(245, 158, 11, 0.35);
// //   border-radius: 999px;
// //   padding: 0.3rem 0.75rem;
// //   font-size: 0.78rem;
// //   font-weight: 600;
// // }
// // .pending-chip.auto-chip {
// //   background: rgba(45, 212, 191, 0.14);
// //   color: #2dd4bf;
// //   border: 1px solid rgba(45, 212, 191, 0.35);
// // }

// // /* ---------- Toolbar unique ---------- */
// // .matrix-toolbar {
// //   background: var(--surface);
// //   border: 1px solid var(--border);
// //   border-radius: 14px;
// //   padding: 0.75rem 0.9rem;
// //   margin-bottom: 0.9rem;
// //   display: flex;
// //   align-items: center;
// //   gap: 0.9rem;
// //   flex-wrap: wrap;
// // }
// // .matrix-toolbar .form-control,
// // .matrix-toolbar .form-select {
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   color: var(--text);
// //   font-size: 0.85rem;
// // }
// // .matrix-toolbar .form-control:focus,
// // .matrix-toolbar .form-select:focus {
// //   background: var(--surface-2);
// //   border-color: var(--accent);
// //   color: var(--text);
// //   box-shadow: 0 0 0 3px var(--accent-soft);
// // }
// // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // .stat-chip {
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   border-radius: 999px;
// //   padding: 0.32rem 0.7rem;
// //   font-size: 0.76rem;
// //   color: var(--text-muted);
// //   white-space: nowrap;
// // }
// // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // .stat-chip.accent strong { color: var(--accent); }

// // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // .segmented {
// //   display: inline-flex;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   border-radius: 8px;
// //   padding: 2px;
// //   gap: 2px;
// // }
// // .segmented button {
// //   border: none;
// //   background: transparent;
// //   color: var(--text-faint);
// //   font-size: 0.74rem;
// //   font-weight: 600;
// //   padding: 0.3rem 0.55rem;
// //   border-radius: 6px;
// //   cursor: pointer;
// //   transition: background 0.12s ease, color 0.12s ease;
// // }
// // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // .btn-ghost {
// //   background: transparent !important;
// //   border: 1px solid var(--border) !important;
// //   color: var(--text-muted) !important;
// //   font-size: 0.78rem !important;
// //   border-radius: 8px !important;
// //   padding: 0.35rem 0.65rem !important;
// // }
// // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // /* ---------- Tableau matriciel ---------- */
// // .table-scroll-container {
// //   width: 100%;
// //   max-height: calc(100vh - 230px);
// //   min-height: 420px;
// //   overflow: auto;
// //   border-radius: 14px;
// //   border: 1px solid var(--border);
// //   background: var(--surface);
// // }
// // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // .matrix-table thead th {
// //   position: sticky;
// //   top: 0;
// //   background: #0f1420 !important;
// //   z-index: 10;
// //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// //   vertical-align: middle;
// // }

// // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // .student-cell { white-space: normal; }
// // .student-cell-inner { max-width: 100%; }
// // .student-cell-name {
// //   display: block;
// //   font-weight: 600;
// //   color: var(--accent);
// //   cursor: pointer;
// //   text-decoration: none;
// //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// //   white-space: nowrap;
// //   overflow: hidden;
// //   text-overflow: ellipsis;
// // }
// // .student-cell-name:hover { color: #6ee7de; }
// // .student-cell-email {
// //   color: var(--text-faint);
// //   font-size: 0.7rem;
// //   font-family: 'JetBrains Mono', monospace;
// //   white-space: nowrap;
// //   overflow: hidden;
// //   text-overflow: ellipsis;
// // }

// // .doc-badge {
// //   font-size: 0.68rem;
// //   padding: 0.15rem 0.4rem;
// //   border-radius: 5px;
// //   background: var(--surface-2) !important;
// //   border: 1px solid var(--border);
// //   color: var(--text-muted) !important;
// //   text-decoration: none !important;
// // }

// // .chef-head-cell { text-align: center; }
// // .chef-avatar {
// //   min-width: 40px;
// //   height: 24px;
// //   padding: 0 6px;
// //   border-radius: 7px;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   display: inline-flex;
// //   align-items: center;
// //   justify-content: center;
// //   font-size: 0.66rem;
// //   font-weight: 700;
// //   letter-spacing: 0.02em;
// //   color: var(--accent);
// //   margin-bottom: 2px;
// //   font-family: 'JetBrains Mono', monospace;
// // }
// // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // .chef-specialite {
// //   color: var(--text-faint);
// //   font-weight: 400;
// //   font-size: 0.68rem;
// //   max-width: 130px;
// //   white-space: nowrap;
// //   overflow: hidden;
// //   text-overflow: ellipsis;
// //   margin: 0 auto;
// // }
// // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // /* ---------- Cellule de sélection ---------- */
// // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // .badge-rank-selection {
// //   display: inline-flex;
// //   align-items: center;
// //   gap: 4px;
// //   min-width: 34px;
// //   justify-content: center;
// //   padding: 3px 9px;
// //   border-radius: 7px;
// //   font-weight: 700;
// //   font-size: 0.74rem;
// //   pointer-events: none;
// //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // }
// // .badge-rank-selection.is-pending {
// //   background: transparent;
// //   border: 1px dashed var(--border);
// //   color: var(--text-faint);
// //   opacity: 0.75;
// // }
// // .sel-cell:hover .badge-rank-selection.is-pending {
// //   opacity: 1;
// //   border-color: var(--accent);
// //   color: var(--accent);
// //   transform: translateY(-1px);
// // }
// // .badge-rank-selection.is-selected { border-style: solid; }
// // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // /* ---------- Vue mobile ---------- */
// // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // .mobile-card-head {
// //   display: flex;
// //   align-items: center;
// //   gap: 0.7rem;
// //   padding: 0.75rem 0.85rem;
// //   cursor: pointer;
// // }
// // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // .mobile-chef-chip {
// //   display: inline-flex;
// //   align-items: center;
// //   gap: 0.35rem;
// //   padding: 0.35rem 0.6rem;
// //   border-radius: 999px;
// //   font-size: 0.76rem;
// //   font-weight: 600;
// //   cursor: pointer;
// //   border: 1px solid var(--border);
// //   background: var(--surface-2);
// //   color: var(--text-muted);
// //   transition: border-color 0.12s ease, color 0.12s ease;
// // }
// // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // .empty-state {
// //   text-align: center;
// //   padding: 3rem 1rem;
// //   color: var(--text-muted);
// // }

// // /* ---------- Modals Dark ---------- */
// // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // .modal-dark .modal-content {
// //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// //   background-color: #12161f !important;
// //   border: 1px solid rgba(45, 212, 191, 0.22);
// //   border-radius: 20px;
// //   color: var(--text);
// //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
// //   overflow: hidden;
// // }
// // .modal-dark .modal-header {
// //   border-bottom: 1px solid var(--border);
// //   background: rgba(45, 212, 191, 0.07);
// //   padding: 1.15rem 1.5rem;
// // }
// // .modal-dark .modal-header.danger-header {
// //   background: rgba(239, 68, 68, 0.12);
// //   border-bottom-color: rgba(239, 68, 68, 0.25);
// // }
// // .modal-dark .modal-body {
// //   padding: 1.5rem;
// // }
// // .modal-dark .modal-footer {
// //   border-top: 1px solid var(--border);
// //   padding: 0.9rem 1.5rem;
// // }
// // .modal-dark .btn-close {
// //   filter: invert(1) grayscale(100%) brightness(1.6);
// //   opacity: 0.7;
// // }

// // @media (max-width: 767px) {
// //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// //   .bulk-actions { margin-left: 0; }
// // }
// // `;

// // // ============================================================================
// // // Sous-composants
// // // ============================================================================

// // function ChefHeaderCell({ chef, count, showFullNames }) {
// //   return (
// //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// //       {showFullNames && (
// //         <>
// //           <div className="chef-fullname">{chef.nom}</div>
// //           {chef.specialite && (
// //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// //           )}
// //         </>
// //       )}
// //       <div>
// //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// //       </div>
// //     </th>
// //   );
// // }

// // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// //   return (
// //     <td className="sel-cell" onClick={onClick}>
// //       <span
// //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// //         title={
// //           selected
// //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// //         }
// //       >
// //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// //       </span>
// //     </td>
// //   );
// // }

// // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// //   return (
// //     <div className="mobile-card">
// //       <div className="mobile-card-head" onClick={onToggleExpand}>
// //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// //         <div style={{ flex: 1, minWidth: 0 }}>
// //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// //           <div className="mobile-card-email">{etud.adresse_email}</div>
// //         </div>
// //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// //       </div>
// //       {expanded && (
// //         <div className="mobile-card-body">
// //           <Button
// //             size="sm"
// //             className="btn-ghost"
// //             onClick={(e) => {
// //               e.stopPropagation();
// //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// //             }}
// //           >
// //             📊 Profil compétences
// //           </Button>
// //           {chefs.map((chef) => {
// //             const key = `${etud.id}-${chef.id}`;
// //             const isSelected = selections.has(key);
// //             const rankInfo = studentRanks?.get(chef.id);
// //             const rankNum = rankInfo?.rank || 1;
// //             return (
// //               <span
// //                 key={chef.id}
// //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix)`}
// //               >
// //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
// //               </span>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ============================================================================
// // // Composant principal
// // // ============================================================================

// // export default function SelectionPage() {
// //   const [chefs, setChefs] = useState([]);
// //   const [etudiants, setEtudiants] = useState([]);
// //   const [apetencesList, setApetencesList] = useState([]);

// //   const [selections, setSelections] = useState(new Set());
// //   const [initialSelections, setInitialSelections] = useState(new Set());

// //   const [searchStudent, setSearchStudent] = useState('');
// //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [successMsg, setSuccessMsg] = useState(null);

// //   // État Réinitialisation (Reset modal)
// //   const [showResetModal, setShowResetModal] = useState(false);
// //   const [resetting, setResetting] = useState(false);

// //   // Sélection automatique (top 3) — désormais déclenchée manuellement par bouton
// //   const [autoSelecting, setAutoSelecting] = useState(false);

// //   // Réglages d'affichage
// //   const [density, setDensity] = useState('compact');
// //   const [showFullNames, setShowFullNames] = useState(false);
// //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// //   // Modal Radar
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [modalLoading, setModalLoading] = useState(false);
// //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// //   const [aptitudesData, setAptitudesData] = useState(null);
// //   const [apetencesData, setApetencesData] = useState(null);
// //   const [modalError, setModalError] = useState(null);

// //   const isMobile = useIsMobile(768);

// //   const loadData = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);

// //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// //         fetchChefsDeProjet(),
// //         fetchEtudiants(),
// //         fetchSelections(),
// //         fetchAllApetences(),
// //       ]);

// //       setChefs(chefsData || []);
// //       setEtudiants(etudiantsData || []);
// //       setApetencesList(apetencesDataRaw || []);

// //       const activeSet = new Set();
// //       (selectionsData || []).forEach((s) => {
// //         if (s.etudiant_id && s.chef_de_projet_id) {
// //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// //         }
// //       });

// //       setSelections(new Set(activeSet));
// //       setInitialSelections(new Set(activeSet));
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors du chargement des données.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, []);

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

// //   // Sélection automatique (top 3) pour les étudiants n'ayant aucun vœu.
// //   // Ne s'exécute plus automatiquement au chargement de la page : c'est le
// //   // bouton "Sélection auto (top 3)" du header qui déclenche cette action.
// //   const handleAutoSelectTop3 = useCallback(async () => {
// //     if (chefs.length === 0 || etudiants.length === 0) return;

// //     const etudiantsAvecSelection = new Set();
// //     initialSelections.forEach((key) => {
// //       etudiantsAvecSelection.add(key.split('-')[0]);
// //     });

// //     const etudiantsASelectionner = etudiants.filter(
// //       (e) => !etudiantsAvecSelection.has(String(e.id))
// //     );

// //     if (etudiantsASelectionner.length === 0) {
// //       setSuccessMsg('ℹ️ Tous les étudiants ont déjà au moins un vœu, rien à sélectionner automatiquement.');
// //       return;
// //     }

// //     setAutoSelecting(true);
// //     setError(null);
// //     setSuccessMsg(null);

// //     const nouvellesCles = [];
// //     const enregistrements = [];

// //     etudiantsASelectionner.forEach((etud) => {
// //       const ranks = appetenceRanksMap.get(etud.id);
// //       if (!ranks) return;
// //       ranks.forEach((info, chefId) => {
// //         if (info.rank <= 3) {
// //           nouvellesCles.push(`${etud.id}-${chefId}`);
// //           enregistrements.push(saveSelection(etud.id, chefId));
// //         }
// //       });
// //     });

// //     if (nouvellesCles.length === 0) {
// //       setAutoSelecting(false);
// //       return;
// //     }

// //     try {
// //       await Promise.all(enregistrements);
// //       setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// //       setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// //       setSuccessMsg(
// //         `🎯 Sélection automatique effectuée pour ${etudiantsASelectionner.length} étudiant(s) (${nouvellesCles.length} vœu(x) ajouté(s)).`
// //       );
// //     } catch (err) {
// //       setError(err.message || 'Erreur sélection automatique.');
// //     } finally {
// //       setAutoSelecting(false);
// //     }
// //   }, [chefs, etudiants, initialSelections, appetenceRanksMap]);

// //   const hasChanges = useMemo(() => {
// //     if (selections.size !== initialSelections.size) return true;
// //     for (const key of selections) {
// //       if (!initialSelections.has(key)) return true;
// //     }
// //     return false;
// //   }, [selections, initialSelections]);

// //   const filteredEtudiants = useMemo(() => {
// //     const term = searchStudent.toLowerCase().trim();
// //     if (!term) return etudiants;
// //     return etudiants.filter(
// //       (e) =>
// //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// //     );
// //   }, [etudiants, searchStudent]);

// //   const visibleChefs = useMemo(() => {
// //     if (selectedChefFilter === 'all') return chefs;
// //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// //   }, [chefs, selectedChefFilter]);

// //   const countsPerStudent = useMemo(() => {
// //     const map = {};
// //     for (const key of selections) {
// //       const [etudId] = key.split('-');
// //       map[etudId] = (map[etudId] || 0) + 1;
// //     }
// //     return map;
// //   }, [selections]);

// //   const countsPerChef = useMemo(() => {
// //     const map = {};
// //     for (const key of selections) {
// //       const [, chefId] = key.split('-');
// //       map[chefId] = (map[chefId] || 0) + 1;
// //     }
// //     return map;
// //   }, [selections]);

// //   const toggleSelection = useCallback((etudiantId, chefId) => {
// //     const key = `${etudiantId}-${chefId}`;
// //     setSelections((prev) => {
// //       const next = new Set(prev);
// //       if (next.has(key)) next.delete(key);
// //       else next.add(key);
// //       return next;
// //     });
// //     setSuccessMsg(null);
// //   }, []);

// //   const handleSelectAllVisible = () => {
// //     setSelections((prev) => {
// //       const next = new Set(prev);
// //       filteredEtudiants.forEach((e) => {
// //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// //       });
// //       return next;
// //     });
// //     setSuccessMsg(null);
// //   };

// //   const handleDeselectAllVisible = () => {
// //     setSelections((prev) => {
// //       const next = new Set(prev);
// //       filteredEtudiants.forEach((e) => {
// //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// //       });
// //       return next;
// //     });
// //     setSuccessMsg(null);
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       setSaving(true);
// //       setError(null);
// //       setSuccessMsg(null);

// //       const toAdd = [];
// //       selections.forEach((key) => {
// //         if (!initialSelections.has(key)) {
// //           const [etudiantId, chefId] = key.split('-').map(Number);
// //           toAdd.push({ etudiantId, chefId });
// //         }
// //       });

// //       const toDelete = [];
// //       initialSelections.forEach((key) => {
// //         if (!selections.has(key)) {
// //           const [etudiantId, chefId] = key.split('-').map(Number);
// //           toDelete.push({ etudiantId, chefId });
// //         }
// //       });

// //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// //         deleteSelection(etudiantId, chefId)
// //       );
// //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// //         saveSelection(etudiantId, chefId)
// //       );

// //       await Promise.all([...deletePromises, ...addPromises]);

// //       setInitialSelections(new Set(selections));
// //       setSuccessMsg(
// //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// //       );
// //     } catch (err) {
// //       setError(err.message || "Erreur lors de l'enregistrement.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // Action de Réinitialisation complète des sélections
// //   const handleResetSelections = async () => {
// //     try {
// //       setResetting(true);
// //       setError(null);
// //       await resetAllSelections();
// //       setSelections(new Set());
// //       setInitialSelections(new Set());
// //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// //       setShowResetModal(false);
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// //     } finally {
// //       setResetting(false);
// //     }
// //   };

// //   // Export Excel
// //   const handleDownloadSelectionXLSX = () => {
// //     try {
// //       if (etudiants.length === 0 || chefs.length === 0) {
// //         alert('Aucune donnée disponible.');
// //         return;
// //       }

// //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// //       );

// //       const selectionRows = sortedEtudiants.map((etud) => {
// //         const studentRanks = appetenceRanksMap.get(etud.id);
// //         const row = {
// //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// //           'Email': etud.adresse_email || '',
// //           'Parcours': etud.parcours || 'I2026',
// //         };

// //         chefs.forEach((chef) => {
// //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// //           const rankInfo = studentRanks?.get(chef.id);
// //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// //         });

// //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// //         return row;
// //       });

// //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// //       wsSelections['!cols'] = [
// //         { wch: 26 },
// //         { wch: 32 },
// //         { wch: 12 },
// //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// //         { wch: 16 },
// //       ];

// //       const statsRows = chefs.map((chef) => ({
// //         'Chef de Projet': chef.nom,
// //         'Spécialité': chef.specialite || 'N/A',
// //         'Email': chef.email || '',
// //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// //       }));

// //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// //       const workbook = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// //       const today = new Date().toISOString().slice(0, 10);
// //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// //     } catch (err) {
// //       alert(`Erreur export: ${err.message}`);
// //     }
// //   };

// //   // Popup Radar
// //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// //     if (!etudiantId) return;
// //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// //     setModalOpen(true);
// //     setModalLoading(true);
// //     setModalError(null);
// //     setAptitudesData(null);
// //     setApetencesData(null);

// //     try {
// //       const [aptitudes, apetences] = await Promise.all([
// //         fetchAptitudesByEtudiant(etudiantId),
// //         fetchApetencesByEtudiant(etudiantId),
// //       ]);

// //       if (!aptitudes && !apetences) {
// //         setModalError('Aucune compétence ni appétence enregistrée.');
// //       } else {
// //         setAptitudesData(aptitudes);
// //         setApetencesData(apetences);
// //       }
// //     } catch (err) {
// //       setModalError(err.message || 'Erreur chargement compétences.');
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
// //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// //     },
// //   };

// //   const toggleMobileExpand = (id) => {
// //     setExpandedMobileIds((prev) => {
// //       const next = new Set(prev);
// //       if (next.has(id)) next.delete(id);
// //       else next.add(id);
// //       return next;
// //     });
// //   };

// //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// //   if (loading) {
// //     return (
// //       <>
// //         <Navbar />
// //         <style>{STYLE_SHEET}</style>
// //         <div className="matrix-page">
// //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// //               Chargement de la matrice des sélections...
// //             </p>
// //           </div>
// //         </div>
// //       </>
// //     );
// //   }

// //   return (
// //     <>
// //       <Navbar />
// //       <style>{STYLE_SHEET}</style>

// //       <div className="matrix-page">
// //         <div className="matrix-shell">
// //           {/* Header */}
// //           <div className="matrix-header">
// //             <div>
// //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// //               <p className="matrix-subtitle">
// //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// //               </p>
// //               <p className="matrix-subtitle auto-legend mono">
// //                 🎯 Sélection automatique basée sur les appétences (top 3 par étudiant)
// //               </p>
// //             </div>

// //             <div className="d-flex align-items-center gap-2 flex-wrap">
// //               {autoSelecting && (
// //                 <span className="pending-chip auto-chip">
// //                   <Spinner size="sm" animation="border" /> Calcul automatique en cours...
// //                 </span>
// //               )}
// //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

// //               {/* Bouton Sélection automatique (top 3 par appétence) — déclenchement manuel */}
// //               <Button
// //                 className="btn-pill btn-export-pill"
// //                 onClick={handleAutoSelectTop3}
// //                 disabled={autoSelecting}
// //                 title="Sélectionner automatiquement le top 3 (par appétence) pour les étudiants n'ayant encore aucun vœu"
// //               >
// //                 {autoSelecting ? <Spinner size="sm" animation="border" /> : '🎯 Sélection auto (top 3)'}
// //               </Button>

// //               {/* Bouton Réinitialiser / Vider */}
// //               <Button
// //                 className="btn-pill btn-danger-pill"
// //                 onClick={() => setShowResetModal(true)}
// //                 disabled={selections.size === 0 || resetting}
// //                 title="Supprimer toutes les sélections pour repartir de zéro"
// //               >
// //                 🗑️ Vider tout ({selections.size})
// //               </Button>

// //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// //                 📊 Exporter (.xlsx)
// //               </Button>

// //               <Button
// //                 className="btn-pill btn-save-pill"
// //                 onClick={handleSubmit}
// //                 disabled={saving || !hasChanges}
// //               >
// //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// //               </Button>
// //             </div>
// //           </div>

// //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// //           {/* Toolbar unique */}
// //           <div className="matrix-toolbar">
// //             <InputGroup size="sm" className="toolbar-search">
// //               <Form.Control
// //                 placeholder="🔍 Rechercher un étudiant..."
// //                 value={searchStudent}
// //                 onChange={(e) => setSearchStudent(e.target.value)}
// //               />
// //               {searchStudent && (
// //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// //               )}
// //             </InputGroup>

// //             <Form.Select
// //               size="sm"
// //               className="toolbar-select"
// //               value={selectedChefFilter}
// //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// //             >
// //               <option value="all">Tous les chefs ({chefs.length})</option>
// //               {chefs.map((c) => (
// //                 <option key={c.id} value={c.id}>
// //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// //                 </option>
// //               ))}
// //             </Form.Select>

// //             <div className="toolbar-divider" />

// //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// //             {!isMobile && (
// //               <>
// //                 <div className="toolbar-divider" />
// //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// //                   <button
// //                     type="button"
// //                     className={density === 'compact' ? 'active' : ''}
// //                     onClick={() => setDensity('compact')}
// //                   >
// //                     Compact
// //                   </button>
// //                   <button
// //                     type="button"
// //                     className={density === 'comfortable' ? 'active' : ''}
// //                     onClick={() => setDensity('comfortable')}
// //                   >
// //                     Confortable
// //                   </button>
// //                 </div>
// //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// //                   <button
// //                     type="button"
// //                     className={!showFullNames ? 'active' : ''}
// //                     onClick={() => setShowFullNames(false)}
// //                   >
// //                     Initiales
// //                   </button>
// //                   <button
// //                     type="button"
// //                     className={showFullNames ? 'active' : ''}
// //                     onClick={() => setShowFullNames(true)}
// //                   >
// //                     Noms complets
// //                   </button>
// //                 </div>
// //               </>
// //             )}

// //             <div className="bulk-actions">
// //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// //             </div>
// //           </div>

// //           {/* Vue mobile */}
// //           {isMobile ? (
// //             filteredEtudiants.length === 0 ? (
// //               <div className="empty-state">Aucun étudiant trouvé.</div>
// //             ) : (
// //               <div className="mobile-list">
// //                 {filteredEtudiants.map((etud) => (
// //                   <MobileStudentCard
// //                     key={etud.id}
// //                     etud={etud}
// //                     chefs={visibleChefs}
// //                     selections={selections}
// //                     studentRanks={appetenceRanksMap.get(etud.id)}
// //                     expanded={expandedMobileIds.has(etud.id)}
// //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// //                     onToggleSelection={toggleSelection}
// //                     onOpenRadar={handleOpenStudentRadar}
// //                     totalForEtud={countsPerStudent[etud.id] || 0}
// //                   />
// //                 ))}
// //               </div>
// //             )
// //           ) : (
// //             /* Vue desktop */
// //             <div className="table-scroll-container">
// //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// //                 <thead>
// //                   <tr>
// //                     <th
// //                       style={{
// //                         minWidth: density === 'compact' ? 148 : 190,
// //                         maxWidth: density === 'compact' ? 148 : 190,
// //                         textAlign: 'left',
// //                         position: 'sticky',
// //                         left: 0,
// //                         top: 0,
// //                         backgroundColor: '#0f1420',
// //                         zIndex: 20,
// //                         paddingLeft: '0.65rem',
// //                       }}
// //                     >
// //                       Étudiant ({filteredEtudiants.length})
// //                     </th>
// //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// //                       Total
// //                     </th>
// //                     {visibleChefs.map((chef) => (
// //                       <ChefHeaderCell
// //                         key={chef.id}
// //                         chef={chef}
// //                         count={countsPerChef[chef.id]}
// //                         showFullNames={showFullNames}
// //                       />
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredEtudiants.length === 0 ? (
// //                     <tr>
// //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// //                         Aucun étudiant trouvé.
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     filteredEtudiants.map((etud) => {
// //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// //                       const studentRanks = appetenceRanksMap.get(etud.id);

// //                       return (
// //                         <tr key={etud.id}>
// //                           <td
// //                             className="student-cell"
// //                             style={{
// //                               textAlign: 'left',
// //                               position: 'sticky',
// //                               left: 0,
// //                               backgroundColor: '#131c2e',
// //                               zIndex: 5,
// //                               paddingLeft: '0.65rem',
// //                               maxWidth: density === 'compact' ? 148 : 190,
// //                             }}
// //                           >
// //                             <div className="student-cell-inner">
// //                               <span
// //                                 className="student-cell-name"
// //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// //                                 onClick={() =>
// //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// //                                 }
// //                               >
// //                                 {etud.nom} {etud.prenom}
// //                               </span>
// //                               {density === 'comfortable' && (
// //                                 <div className="student-cell-email" title={etud.adresse_email}>
// //                                   {etud.adresse_email}
// //                                 </div>
// //                               )}
// //                               {(etud.cv_path || etud.lm_path) && (
// //                                 <div className="d-flex gap-1 mt-1">
// //                                   {etud.cv_path && (
// //                                     <a
// //                                       href={getDocumentPublicUrl(etud.cv_path)}
// //                                       target="_blank"
// //                                       rel="noopener noreferrer"
// //                                       className="doc-badge badge"
// //                                       title="CV"
// //                                     >
// //                                       📄
// //                                     </a>
// //                                   )}
// //                                   {etud.lm_path && (
// //                                     <a
// //                                       href={getDocumentPublicUrl(etud.lm_path)}
// //                                       target="_blank"
// //                                       rel="noopener noreferrer"
// //                                       className="doc-badge badge"
// //                                       title="Lettre de motivation"
// //                                     >
// //                                       ✉️
// //                                     </a>
// //                                   )}
// //                                 </div>
// //                               )}
// //                             </div>
// //                           </td>

// //                           <td style={{ backgroundColor: '#131c2e' }}>
// //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// //                           </td>

// //                           {visibleChefs.map((chef) => {
// //                             const key = `${etud.id}-${chef.id}`;
// //                             const isSelected = selections.has(key);
// //                             const rankInfo = studentRanks?.get(chef.id);
// //                             const rankNum = rankInfo?.rank || 1;

// //                             return (
// //                               <SelectionCell
// //                                 key={chef.id}
// //                                 selected={isSelected}
// //                                 rankNum={rankNum}
// //                                 rankInfo={rankInfo}
// //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// //                               />
// //                             );
// //                           })}
// //                         </tr>
// //                       );
// //                     })
// //                   )}
// //                 </tbody>
// //               </Table>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Modal Confirmation Réinitialisation Sélections */}
// //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <p>
// //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selections.size} vœux)</strong> de la base de données ?
// //           </p>
// //           <p className="text-muted small mb-0">
// //             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
// //           </p>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// //             Annuler
// //           </Button>
// //           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
// //             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>

// //       {/* Modal Radar */}
// //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// //           {modalLoading ? (
// //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// //           ) : modalError ? (
// //             <Alert variant="warning">{modalError}</Alert>
// //           ) : (
// //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// //               <Radar data={radarChartData} options={radarOptions} />
// //             </div>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </>
// //   );
// // }

// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   Table,
//   Button,
//   Alert,
//   Spinner,
//   Form,
//   InputGroup,
//   Badge,
//   Modal,
// } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
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
// import Navbar from './Navbar';
// import {
//   fetchChefsDeProjet,
//   fetchEtudiants,
//   fetchSelections,
//   saveSelection,
//   deleteSelection,
//   resetAllSelections,
//   fetchAllApetences,
//   fetchReferentielCompetences,
//   fetchAptitudesByEtudiant,
//   fetchApetencesByEtudiant,
//   computeChefRanksForStudent,
//   getDocumentPublicUrl,
// } from '../services/supabase';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // ============================================================================
// // Helpers visuels
// // ============================================================================

// const getRankBadgeStyle = (rank) => {
//   switch (rank) {
//     case 1:
//       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
//     case 2:
//       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
//     case 3:
//       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
//     default:
//       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
//   }
// };

// const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// function useIsMobile(breakpoint = 768) {
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
//   );

//   useEffect(() => {
//     if (typeof window === 'undefined') return undefined;
//     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
//     const handler = (e) => setIsMobile(e.matches);
//     setIsMobile(mql.matches);
//     mql.addEventListener('change', handler);
//     return () => mql.removeEventListener('change', handler);
//   }, [breakpoint]);

//   return isMobile;
// }

// // ============================================================================
// // Styles
// // ============================================================================

// const STYLE_SHEET = `
// @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// .matrix-page {
//   --bg: #0a0d12;
//   --surface: #12161f;
//   --surface-2: #1a2029;
//   --surface-hover: rgba(99, 102, 241, 0.08);
//   --border: #232a37;
//   --text: #e9ecf1;
//   --text-muted: #8b93a5;
//   --text-faint: #5a6272;
//   --accent: #2dd4bf;
//   --accent-soft: rgba(45, 212, 191, 0.14);
//   font-family: 'Inter', -apple-system, sans-serif;
//   background: var(--bg);
//   min-height: 100vh;
//   color: var(--text);
// }
// .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// .matrix-shell {
//   max-width: 100%;
//   margin: 0 auto;
//   padding: 1.25rem 1.5rem 2rem;
// }

// .matrix-header {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 1rem;
//   flex-wrap: wrap;
//   margin-bottom: 0.9rem;
// }
// .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }
// .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

// .btn-pill {
//   border-radius: 999px !important;
//   font-weight: 600 !important;
//   font-size: 0.82rem !important;
//   padding: 0.45rem 1rem !important;
//   border: 1px solid var(--border) !important;
// }
// .btn-save-pill {
//   background: var(--accent) !important;
//   border: none !important;
//   color: #06201c !important;
//   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// }
// .btn-save-pill:disabled { opacity: 0.5; }
// .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// .btn-danger-pill {
//   background: rgba(239, 68, 68, 0.14) !important;
//   color: #f87171 !important;
//   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// }
// .btn-danger-pill:hover:not(:disabled) {
//   background: #dc2626 !important;
//   color: #ffffff !important;
//   border-color: #dc2626 !important;
// }
// .btn-danger-pill:disabled { opacity: 0.4; }

// .pending-chip {
//   display: inline-flex;
//   align-items: center;
//   gap: 0.35rem;
//   background: rgba(245, 158, 11, 0.14);
//   color: #fbbf24;
//   border: 1px solid rgba(245, 158, 11, 0.35);
//   border-radius: 999px;
//   padding: 0.3rem 0.75rem;
//   font-size: 0.78rem;
//   font-weight: 600;
// }
// .pending-chip.auto-chip {
//   background: rgba(45, 212, 191, 0.14);
//   color: #2dd4bf;
//   border: 1px solid rgba(45, 212, 191, 0.35);
// }

// .matrix-toolbar {
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: 14px;
//   padding: 0.75rem 0.9rem;
//   margin-bottom: 0.9rem;
//   display: flex;
//   align-items: center;
//   gap: 0.9rem;
//   flex-wrap: wrap;
// }
// .matrix-toolbar .form-control,
// .matrix-toolbar .form-select {
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   color: var(--text);
//   font-size: 0.85rem;
// }
// .matrix-toolbar .form-control:focus,
// .matrix-toolbar .form-select:focus {
//   background: var(--surface-2);
//   border-color: var(--accent);
//   color: var(--text);
//   box-shadow: 0 0 0 3px var(--accent-soft);
// }
// .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// .stat-chip {
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   border-radius: 999px;
//   padding: 0.32rem 0.7rem;
//   font-size: 0.76rem;
//   color: var(--text-muted);
//   white-space: nowrap;
// }
// .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// .stat-chip.accent strong { color: var(--accent); }

// .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// .segmented {
//   display: inline-flex;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   border-radius: 8px;
//   padding: 2px;
//   gap: 2px;
// }
// .segmented button {
//   border: none;
//   background: transparent;
//   color: var(--text-faint);
//   font-size: 0.74rem;
//   font-weight: 600;
//   padding: 0.3rem 0.55rem;
//   border-radius: 6px;
//   cursor: pointer;
//   transition: background 0.12s ease, color 0.12s ease;
// }
// .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// .btn-ghost {
//   background: transparent !important;
//   border: 1px solid var(--border) !important;
//   color: var(--text-muted) !important;
//   font-size: 0.78rem !important;
//   border-radius: 8px !important;
//   padding: 0.35rem 0.65rem !important;
// }
// .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// .table-scroll-container {
//   width: 100%;
//   max-height: calc(100vh - 230px);
//   min-height: 420px;
//   overflow: auto;
//   border-radius: 14px;
//   border: 1px solid var(--border);
//   background: var(--surface);
// }
// .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// .matrix-table thead th {
//   position: sticky;
//   top: 0;
//   background: #0f1420 !important;
//   z-index: 10;
//   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
//   vertical-align: middle;
// }

// .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// .student-cell { white-space: normal; }
// .student-cell-inner { max-width: 100%; }
// .student-cell-name {
//   display: block;
//   font-weight: 600;
//   color: var(--accent);
//   cursor: pointer;
//   text-decoration: none;
//   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
// .student-cell-name:hover { color: #6ee7de; }
// .student-cell-email {
//   color: var(--text-faint);
//   font-size: 0.7rem;
//   font-family: 'JetBrains Mono', monospace;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }

// .doc-badge {
//   font-size: 0.68rem;
//   padding: 0.15rem 0.4rem;
//   border-radius: 5px;
//   background: var(--surface-2) !important;
//   border: 1px solid var(--border);
//   color: var(--text-muted) !important;
//   text-decoration: none !important;
// }

// .chef-head-cell { text-align: center; }
// .chef-avatar {
//   min-width: 40px;
//   height: 24px;
//   padding: 0 6px;
//   border-radius: 7px;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   font-size: 0.66rem;
//   font-weight: 700;
//   letter-spacing: 0.02em;
//   color: var(--accent);
//   margin-bottom: 2px;
//   font-family: 'JetBrains Mono', monospace;
// }
// .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// .chef-specialite {
//   color: var(--text-faint);
//   font-weight: 400;
//   font-size: 0.68rem;
//   max-width: 130px;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   margin: 0 auto;
// }
// .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// .badge-rank-selection {
//   display: inline-flex;
//   align-items: center;
//   gap: 4px;
//   min-width: 34px;
//   justify-content: center;
//   padding: 3px 9px;
//   border-radius: 7px;
//   font-weight: 700;
//   font-size: 0.74rem;
//   pointer-events: none;
//   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// }
// .badge-rank-selection.is-pending {
//   background: transparent;
//   border: 1px dashed var(--border);
//   color: var(--text-faint);
//   opacity: 0.75;
// }
// .sel-cell:hover .badge-rank-selection.is-pending {
//   opacity: 1;
//   border-color: var(--accent);
//   color: var(--accent);
//   transform: translateY(-1px);
// }
// .badge-rank-selection.is-selected { border-style: solid; }
// .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// /* Vue mobile */
// .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// .mobile-card-head {
//   display: flex;
//   align-items: center;
//   gap: 0.7rem;
//   padding: 0.75rem 0.85rem;
//   cursor: pointer;
// }
// .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// .mobile-chef-chip {
//   display: inline-flex;
//   align-items: center;
//   gap: 0.35rem;
//   padding: 0.35rem 0.6rem;
//   border-radius: 999px;
//   font-size: 0.76rem;
//   font-weight: 600;
//   cursor: pointer;
//   border: 1px solid var(--border);
//   background: var(--surface-2);
//   color: var(--text-muted);
//   transition: border-color 0.12s ease, color 0.12s ease;
// }
// .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// .empty-state {
//   text-align: center;
//   padding: 3rem 1rem;
//   color: var(--text-muted);
// }

// /* Modals Dark */
// .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// .modal-dark .modal-content {
//   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
//   background-color: #12161f !important;
//   border: 1px solid rgba(45, 212, 191, 0.22);
//   border-radius: 20px;
//   color: var(--text);
//   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
//   overflow: hidden;
// }
// .modal-dark .modal-header {
//   border-bottom: 1px solid var(--border);
//   background: rgba(45, 212, 191, 0.07);
//   padding: 1.15rem 1.5rem;
// }
// .modal-dark .modal-header.danger-header {
//   background: rgba(239, 68, 68, 0.12);
//   border-bottom-color: rgba(239, 68, 68, 0.25);
// }
// .modal-dark .modal-body {
//   padding: 1.5rem;
// }
// .modal-dark .modal-footer {
//   border-top: 1px solid var(--border);
//   padding: 0.9rem 1.5rem;
// }
// .modal-dark .btn-close {
//   filter: invert(1) grayscale(100%) brightness(1.6);
//   opacity: 0.7;
// }

// @media (max-width: 767px) {
//   .matrix-shell { padding: 1rem 0.85rem 2rem; }
//   .matrix-toolbar { flex-direction: column; align-items: stretch; }
//   .bulk-actions { margin-left: 0; }
// }
// `;

// function ChefHeaderCell({ chef, count, showFullNames }) {
//   return (
//     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
//       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
//       {showFullNames && (
//         <>
//           <div className="chef-fullname">{chef.nom}</div>
//           {chef.specialite && (
//             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
//           )}
//         </>
//       )}
//       <div>
//         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
//       </div>
//     </th>
//   );
// }

// function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
//   return (
//     <td className="sel-cell" onClick={onClick}>
//       <span
//         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
//         style={selected ? getRankBadgeStyle(rankNum) : undefined}
//         title={
//           selected
//             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
//             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
//         }
//       >
//         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
//       </span>
//     </td>
//   );
// }

// function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
//   return (
//     <div className="mobile-card">
//       <div className="mobile-card-head" onClick={onToggleExpand}>
//         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
//           <div className="mobile-card-email">{etud.adresse_email}</div>
//         </div>
//         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
//       </div>
//       {expanded && (
//         <div className="mobile-card-body">
//           <Button
//             size="sm"
//             className="btn-ghost"
//             onClick={(e) => {
//               e.stopPropagation();
//               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
//             }}
//           >
//             📊 Profil compétences
//           </Button>
//           {chefs.map((chef) => {
//             const key = `${etud.id}-${chef.id}`;
//             const isSelected = selections.has(key);
//             const rankInfo = studentRanks?.get(chef.id);
//             const rankNum = rankInfo?.rank || 1;
//             return (
//               <span
//                 key={chef.id}
//                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
//                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
//                 onClick={() => onToggleSelection(etud.id, chef.id)}
//                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`}
//               >
//                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
//               </span>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function SelectionPage() {
//   const [chefs, setChefs] = useState([]);
//   const [etudiants, setEtudiants] = useState([]);
//   const [apetencesList, setApetencesList] = useState([]);
//   const [referentielCompetences, setReferentielCompetences] = useState([]);

//   const [selections, setSelections] = useState(new Set());
//   const [initialSelections, setInitialSelections] = useState(new Set());

//   const [searchStudent, setSearchStudent] = useState('');
//   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   const [showResetModal, setShowResetModal] = useState(false);
//   const [resetting, setResetting] = useState(false);
//   const [autoSelecting, setAutoSelecting] = useState(false);

//   const [density, setDensity] = useState('compact');
//   const [showFullNames, setShowFullNames] = useState(false);
//   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
//   const [aptitudesData, setAptitudesData] = useState(null);
//   const [apetencesData, setApetencesData] = useState(null);
//   const [modalError, setModalError] = useState(null);

//   const isMobile = useIsMobile(768);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw, refCompsData] = await Promise.all([
//         fetchChefsDeProjet(),
//         fetchEtudiants(),
//         fetchSelections(),
//         fetchAllApetences(),
//         fetchReferentielCompetences(true),
//       ]);

//       setChefs(chefsData || []);
//       setEtudiants(etudiantsData || []);
//       setApetencesList(apetencesDataRaw || []);
//       setReferentielCompetences(refCompsData || []);

//       const activeSet = new Set();
//       (selectionsData || []).forEach((s) => {
//         if (s.etudiant_id && s.chef_de_projet_id) {
//           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
//         }
//       });

//       setSelections(new Set(activeSet));
//       setInitialSelections(new Set(activeSet));
//     } catch (err) {
//       setError(err.message || 'Erreur lors du chargement des données.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Map dynamique des rangs d'appétence avec référentiel actif
//   const appetenceRanksMap = useMemo(() => {
//     const map = new Map();
//     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

//     etudiants.forEach((etud) => {
//       const etudAp = apetencesByEtud.get(etud.id);
//       const ranks = computeChefRanksForStudent(etudAp, chefs, referentielCompetences);
//       map.set(etud.id, ranks);
//     });

//     return map;
//   }, [apetencesList, etudiants, chefs, referentielCompetences]);

//   // Sélection automatique manuelle (top 3)
//   const handleAutoSelectTop3 = useCallback(async () => {
//     if (chefs.length === 0 || etudiants.length === 0) return;

//     const etudiantsAvecSelection = new Set();
//     initialSelections.forEach((key) => {
//       etudiantsAvecSelection.add(key.split('-')[0]);
//     });

//     const etudiantsASelectionner = etudiants.filter(
//       (e) => !etudiantsAvecSelection.has(String(e.id))
//     );

//     if (etudiantsASelectionner.length === 0) {
//       setSuccessMsg('ℹ️ Tous les étudiants ont déjà au moins un vœu.');
//       return;
//     }

//     setAutoSelecting(true);
//     setError(null);
//     setSuccessMsg(null);

//     const nouvellesCles = [];
//     const enregistrements = [];

//     etudiantsASelectionner.forEach((etud) => {
//       const ranks = appetenceRanksMap.get(etud.id);
//       if (!ranks) return;
//       ranks.forEach((info, chefId) => {
//         if (info.rank <= 3) {
//           nouvellesCles.push(`${etud.id}-${chefId}`);
//           enregistrements.push(saveSelection(etud.id, chefId));
//         }
//       });
//     });

//     if (nouvellesCles.length === 0) {
//       setAutoSelecting(false);
//       return;
//     }

//     try {
//       await Promise.all(enregistrements);
//       setSelections((prev) => new Set([...prev, ...nouvellesCles]));
//       setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
//       setSuccessMsg(
//         ` Sélection automatique effectuée pour ${etudiantsASelectionner.length} étudiant(s) (${nouvellesCles.length} vœu(x)).`
//       );
//     } catch (err) {
//       setError(err.message || 'Erreur sélection automatique.');
//     } finally {
//       setAutoSelecting(false);
//     }
//   }, [chefs, etudiants, initialSelections, appetenceRanksMap]);

//   const hasChanges = useMemo(() => {
//     if (selections.size !== initialSelections.size) return true;
//     for (const key of selections) {
//       if (!initialSelections.has(key)) return true;
//     }
//     return false;
//   }, [selections, initialSelections]);

//   const filteredEtudiants = useMemo(() => {
//     const term = searchStudent.toLowerCase().trim();
//     if (!term) return etudiants;
//     return etudiants.filter(
//       (e) =>
//         (e.nom && e.nom.toLowerCase().includes(term)) ||
//         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
//         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
//     );
//   }, [etudiants, searchStudent]);

//   const visibleChefs = useMemo(() => {
//     if (selectedChefFilter === 'all') return chefs;
//     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
//   }, [chefs, selectedChefFilter]);

//   const countsPerStudent = useMemo(() => {
//     const map = {};
//     for (const key of selections) {
//       const [etudId] = key.split('-');
//       map[etudId] = (map[etudId] || 0) + 1;
//     }
//     return map;
//   }, [selections]);

//   const countsPerChef = useMemo(() => {
//     const map = {};
//     for (const key of selections) {
//       const [, chefId] = key.split('-');
//       map[chefId] = (map[chefId] || 0) + 1;
//     }
//     return map;
//   }, [selections]);

//   const toggleSelection = useCallback((etudiantId, chefId) => {
//     const key = `${etudiantId}-${chefId}`;
//     setSelections((prev) => {
//       const next = new Set(prev);
//       if (next.has(key)) next.delete(key);
//       else next.add(key);
//       return next;
//     });
//     setSuccessMsg(null);
//   }, []);

//   const handleSelectAllVisible = () => {
//     setSelections((prev) => {
//       const next = new Set(prev);
//       filteredEtudiants.forEach((e) => {
//         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
//       });
//       return next;
//     });
//     setSuccessMsg(null);
//   };

//   const handleDeselectAllVisible = () => {
//     setSelections((prev) => {
//       const next = new Set(prev);
//       filteredEtudiants.forEach((e) => {
//         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
//       });
//       return next;
//     });
//     setSuccessMsg(null);
//   };

//   const handleSubmit = async () => {
//     try {
//       setSaving(true);
//       setError(null);
//       setSuccessMsg(null);

//       const toAdd = [];
//       selections.forEach((key) => {
//         if (!initialSelections.has(key)) {
//           const [etudiantId, chefId] = key.split('-').map(Number);
//           toAdd.push({ etudiantId, chefId });
//         }
//       });

//       const toDelete = [];
//       initialSelections.forEach((key) => {
//         if (!selections.has(key)) {
//           const [etudiantId, chefId] = key.split('-').map(Number);
//           toDelete.push({ etudiantId, chefId });
//         }
//       });

//       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
//         deleteSelection(etudiantId, chefId)
//       );
//       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
//         saveSelection(etudiantId, chefId)
//       );

//       await Promise.all([...deletePromises, ...addPromises]);

//       setInitialSelections(new Set(selections));
//       setSuccessMsg(
//         ` Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
//       );
//     } catch (err) {
//       setError(err.message || "Erreur lors de l'enregistrement.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleResetSelections = async () => {
//     try {
//       setResetting(true);
//       setError(null);
//       await resetAllSelections();
//       setSelections(new Set());
//       setInitialSelections(new Set());
//       setSuccessMsg('Toutes les sélections ont été réinitialisées avec succès.');
//       setShowResetModal(false);
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
//     } finally {
//       setResetting(false);
//     }
//   };

//   const handleDownloadSelectionXLSX = () => {
//     try {
//       if (etudiants.length === 0 || chefs.length === 0) {
//         alert('Aucune donnée disponible.');
//         return;
//       }

//       const sortedEtudiants = [...etudiants].sort((a, b) =>
//         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
//       );

//       const selectionRows = sortedEtudiants.map((etud) => {
//         const studentRanks = appetenceRanksMap.get(etud.id);
//         const row = {
//           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
//           'Email': etud.adresse_email || '',
//           'Parcours': etud.parcours || 'I2026',
//         };

//         chefs.forEach((chef) => {
//           const isSelected = selections.has(`${etud.id}-${chef.id}`);
//           const rankInfo = studentRanks?.get(chef.id);
//           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
//         });

//         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
//         return row;
//       });

//       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
//       wsSelections['!cols'] = [
//         { wch: 26 },
//         { wch: 32 },
//         { wch: 12 },
//         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
//         { wch: 16 },
//       ];

//       const statsRows = chefs.map((chef) => ({
//         'Chef de Projet': chef.nom,
//         'Spécialité': chef.specialite || 'N/A',
//         'Email': chef.email || '',
//         'Nombre de Sélections': countsPerChef[chef.id] || 0,
//       }));

//       const wsStats = XLSX.utils.json_to_sheet(statsRows);
//       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
//       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

//       const today = new Date().toISOString().slice(0, 10);
//       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
//     } catch (err) {
//       alert(`Erreur export: ${err.message}`);
//     }
//   };

//   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
//     if (!etudiantId) return;
//     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
//     setModalOpen(true);
//     setModalLoading(true);
//     setModalError(null);
//     setAptitudesData(null);
//     setApetencesData(null);

//     try {
//       const [aptitudes, apetences] = await Promise.all([
//         fetchAptitudesByEtudiant(etudiantId),
//         fetchApetencesByEtudiant(etudiantId),
//       ]);

//       if (!aptitudes && !apetences) {
//         setModalError('Aucune compétence ni appétence enregistrée.');
//       } else {
//         setAptitudesData(aptitudes);
//         setApetencesData(apetences);
//       }
//     } catch (err) {
//       setModalError(err.message || 'Erreur chargement compétences.');
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   // Génération dynamique des axes du Radar d'après les compétences actives
//   const radarChartData = useMemo(() => {
//     const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
//     const labels = activeComps.map((c) => c.label);
//     const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
//     const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);

//     return {
//       labels,
//       datasets: [
//         {
//           label: 'Aptitudes (Technique)',
//           data: aptValues,
//           backgroundColor: 'rgba(56, 189, 248, 0.25)',
//           borderColor: '#38bdf8',
//           borderWidth: 2,
//           pointBackgroundColor: '#38bdf8',
//         },
//         {
//           label: 'Appétences (Intérêt)',
//           data: apeValues,
//           backgroundColor: 'rgba(244, 63, 94, 0.25)',
//           borderColor: '#f43f5e',
//           borderWidth: 2,
//           pointBackgroundColor: '#f43f5e',
//         },
//       ],
//     };
//   }, [referentielCompetences, aptitudesData, apetencesData]);

//   const radarOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       r: {
//         min: 0,
//         suggestedMax: 4,
//         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
//         grid: { color: 'rgba(255, 255, 255, 0.12)' },
//         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
//         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
//       },
//     },
//     plugins: {
//       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
//     },
//   };

//   const toggleMobileExpand = (id) => {
//     setExpandedMobileIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <style>{STYLE_SHEET}</style>
//         <div className="matrix-page">
//           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
//             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
//             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
//               Chargement de la matrice des sélections...
//             </p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <style>{STYLE_SHEET}</style>

//       <div className="matrix-page">
//         <div className="matrix-shell">
//           {/* Header */}
//           <div className="matrix-header">
//             <div>
//               <h2 className="matrix-title display">Sélections &amp; Classement par Appétences</h2>
//               <p className="matrix-subtitle">
//                 Le rang de chaque chef (1er, 2e, 3e…) est calculé dynamiquement d'après les appétences actives ({referentielCompetences.length} compétences).
//               </p>
//               <p className="matrix-subtitle auto-legend mono">
//                  Sélection manuelle ou assistée par appétences
//               </p>
//             </div>

//             <div className="d-flex align-items-center gap-2 flex-wrap">
//               {autoSelecting && (
//                 <span className="pending-chip auto-chip">
//                   <Spinner size="sm" animation="border" /> Calcul en cours...
//                 </span>
//               )}
//               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

//               <Button
//                 className="btn-pill btn-export-pill"
//                 onClick={handleAutoSelectTop3}
//                 disabled={autoSelecting}
//                 title="Sélectionner automatiquement le top 3 (par appétence) pour les étudiants n'ayant encore aucun vœu"
//               >
//                 {autoSelecting ? <Spinner size="sm" animation="border" /> : 'Sélection auto (top 3)'}
//               </Button>

//               <Button
//                 className="btn-pill btn-danger-pill"
//                 onClick={() => setShowResetModal(true)}
//                 disabled={selections.size === 0 || resetting}
//                 title="Supprimer toutes les sélections pour repartir de zéro"
//               >
//                  Vider tout ({selections.size})
//               </Button>

//               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
//                 📊 Exporter (.xlsx)
//               </Button>

//               <Button
//                 className="btn-pill btn-save-pill"
//                 onClick={handleSubmit}
//                 disabled={saving || !hasChanges}
//               >
//                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
//               </Button>
//             </div>
//           </div>

//           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
//           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

//           {/* Toolbar unique */}
//           <div className="matrix-toolbar">
//             <InputGroup size="sm" className="toolbar-search">
//               <Form.Control
//                 placeholder="🔍 Rechercher un étudiant..."
//                 value={searchStudent}
//                 onChange={(e) => setSearchStudent(e.target.value)}
//               />
//               {searchStudent && (
//                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
//               )}
//             </InputGroup>

//             <Form.Select
//               size="sm"
//               className="toolbar-select"
//               value={selectedChefFilter}
//               onChange={(e) => setSelectedChefFilter(e.target.value)}
//             >
//               <option value="all">Tous les chefs ({chefs.length})</option>
//               {chefs.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
//                 </option>
//               ))}
//             </Form.Select>

//             <div className="toolbar-divider" />

//             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
//             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
//             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

//             {!isMobile && (
//               <>
//                 <div className="toolbar-divider" />
//                 <div className="segmented" role="group" aria-label="Densité du tableau">
//                   <button
//                     type="button"
//                     className={density === 'compact' ? 'active' : ''}
//                     onClick={() => setDensity('compact')}
//                   >
//                     Compact
//                   </button>
//                   <button
//                     type="button"
//                     className={density === 'comfortable' ? 'active' : ''}
//                     onClick={() => setDensity('comfortable')}
//                   >
//                     Confortable
//                   </button>
//                 </div>
//                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
//                   <button
//                     type="button"
//                     className={!showFullNames ? 'active' : ''}
//                     onClick={() => setShowFullNames(false)}
//                   >
//                     Initiales
//                   </button>
//                   <button
//                     type="button"
//                     className={showFullNames ? 'active' : ''}
//                     onClick={() => setShowFullNames(true)}
//                   >
//                     Noms complets
//                   </button>
//                 </div>
//               </>
//             )}

//             <div className="bulk-actions">
//               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
//               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
//             </div>
//           </div>

//           {/* Vue mobile */}
//           {isMobile ? (
//             filteredEtudiants.length === 0 ? (
//               <div className="empty-state">Aucun étudiant trouvé.</div>
//             ) : (
//               <div className="mobile-list">
//                 {filteredEtudiants.map((etud) => (
//                   <MobileStudentCard
//                     key={etud.id}
//                     etud={etud}
//                     chefs={visibleChefs}
//                     selections={selections}
//                     studentRanks={appetenceRanksMap.get(etud.id)}
//                     expanded={expandedMobileIds.has(etud.id)}
//                     onToggleExpand={() => toggleMobileExpand(etud.id)}
//                     onToggleSelection={toggleSelection}
//                     onOpenRadar={handleOpenStudentRadar}
//                     totalForEtud={countsPerStudent[etud.id] || 0}
//                   />
//                 ))}
//               </div>
//             )
//           ) : (
//             /* Vue desktop */
//             <div className="table-scroll-container">
//               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
//                 <thead>
//                   <tr>
//                     <th
//                       style={{
//                         minWidth: density === 'compact' ? 148 : 190,
//                         maxWidth: density === 'compact' ? 148 : 190,
//                         textAlign: 'left',
//                         position: 'sticky',
//                         left: 0,
//                         top: 0,
//                         backgroundColor: '#0f1420',
//                         zIndex: 20,
//                         paddingLeft: '0.65rem',
//                       }}
//                     >
//                       Étudiant ({filteredEtudiants.length})
//                     </th>
//                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
//                       Total
//                     </th>
//                     {visibleChefs.map((chef) => (
//                       <ChefHeaderCell
//                         key={chef.id}
//                         chef={chef}
//                         count={countsPerChef[chef.id]}
//                         showFullNames={showFullNames}
//                       />
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredEtudiants.length === 0 ? (
//                     <tr>
//                       <td colSpan={visibleChefs.length + 2} className="empty-state">
//                         Aucun étudiant trouvé.
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredEtudiants.map((etud) => {
//                       const totalForEtud = countsPerStudent[etud.id] || 0;
//                       const studentRanks = appetenceRanksMap.get(etud.id);

//                       return (
//                         <tr key={etud.id}>
//                           <td
//                             className="student-cell"
//                             style={{
//                               textAlign: 'left',
//                               position: 'sticky',
//                               left: 0,
//                               backgroundColor: '#131c2e',
//                               zIndex: 5,
//                               paddingLeft: '0.65rem',
//                               maxWidth: density === 'compact' ? 148 : 190,
//                             }}
//                           >
//                             <div className="student-cell-inner">
//                               <span
//                                 className="student-cell-name"
//                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
//                                 onClick={() =>
//                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
//                                 }
//                               >
//                                 {etud.nom} {etud.prenom}
//                               </span>
//                               {density === 'comfortable' && (
//                                 <div className="student-cell-email" title={etud.adresse_email}>
//                                   {etud.adresse_email}
//                                 </div>
//                               )}
//                               {(etud.cv_path || etud.lm_path) && (
//                                 <div className="d-flex gap-1 mt-1">
//                                   {etud.cv_path && (
//                                     <a
//                                       href={getDocumentPublicUrl(etud.cv_path)}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="doc-badge badge"
//                                       title="CV"
//                                     >
//                                       📄
//                                     </a>
//                                   )}
//                                   {etud.lm_path && (
//                                     <a
//                                       href={getDocumentPublicUrl(etud.lm_path)}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="doc-badge badge"
//                                       title="Lettre de motivation"
//                                     >
//                                       ✉️
//                                     </a>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                           </td>

//                           <td style={{ backgroundColor: '#131c2e' }}>
//                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
//                           </td>

//                           {visibleChefs.map((chef) => {
//                             const key = `${etud.id}-${chef.id}`;
//                             const isSelected = selections.has(key);
//                             const rankInfo = studentRanks?.get(chef.id);
//                             const rankNum = rankInfo?.rank || 1;

//                             return (
//                               <SelectionCell
//                                 key={chef.id}
//                                 selected={isSelected}
//                                 rankNum={rankNum}
//                                 rankInfo={rankInfo}
//                                 onClick={() => toggleSelection(etud.id, chef.id)}
//                               />
//                             );
//                           })}
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal Confirmation Réinitialisation Sélections */}
//       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white" className="danger-header">
//           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selections.size} vœux)</strong> de la base de données ?
//           </p>
//           <p className="text-muted small mb-0">
//             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
//             Annuler
//           </Button>
//           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
//             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal Radar Dynamique */}
//       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//           {modalLoading ? (
//             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
//           ) : modalError ? (
//             <Alert variant="warning">{modalError}</Alert>
//           ) : (
//             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
//               <Radar data={radarChartData} options={radarOptions} />
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Table,
  Button,
  Alert,
  Spinner,
  Form,
  InputGroup,
  Badge,
  Modal,
} from 'react-bootstrap';
import * as XLSX from 'xlsx';
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
import Navbar from './Navbar';
import {
  fetchChefsDeProjet,
  fetchEtudiants,
  fetchSelections,
  saveSelection,
  deleteSelection,
  resetAllSelections,
  fetchReferentielCompetences,
  fetchAptitudesByEtudiant,
  fetchApetencesByEtudiant,
  getDocumentPublicUrl,
} from '../services/supabase';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ============================================================================
// Helpers visuels
// ============================================================================

const getRankBadgeStyle = (rank) => {
  switch (Number(rank)) {
    case 1:
      return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
    case 2:
      return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
    case 3:
      return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
    default:
      return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
  }
};

const rankLabel = (rank) => (Number(rank) === 1 ? '1er' : `${rank}e`);

// const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();
const chefInitials = (nom = '') =>
  nom
    .replace(/Ã©/gi, 'E')
    .replace(/Ã/gi, 'A')
    .replace(/\s+/g, '')
    .slice(0, 4)
    .toUpperCase();
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

// ============================================================================
// Styles
// ============================================================================

const STYLE_SHEET = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

.matrix-page {
  --bg: #0a0d12;
  --surface: #12161f;
  --surface-2: #1a2029;
  --surface-hover: rgba(99, 102, 241, 0.08);
  --border: #232a37;
  --text: #e9ecf1;
  --text-muted: #8b93a5;
  --text-faint: #5a6272;
  --accent: #2dd4bf;
  --accent-soft: rgba(45, 212, 191, 0.14);
  font-family: 'Inter', -apple-system, sans-serif;
  background: var(--bg);
  min-height: 100vh;
  color: var(--text);
}
.matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
.matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

.matrix-shell {
  max-width: 100%;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 2rem;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.9rem;
}
.matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
.matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }
.matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

.btn-pill {
  border-radius: 999px !important;
  font-weight: 600 !important;
  font-size: 0.82rem !important;
  padding: 0.45rem 1rem !important;
  border: 1px solid var(--border) !important;
}
.btn-save-pill {
  background: var(--accent) !important;
  border: none !important;
  color: #06201c !important;
  box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
}
.btn-save-pill:disabled { opacity: 0.5; }
.btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
.btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

.btn-danger-pill {
  background: rgba(239, 68, 68, 0.14) !important;
  color: #f87171 !important;
  border: 1px solid rgba(239, 68, 68, 0.35) !important;
}
.btn-danger-pill:hover:not(:disabled) {
  background: #dc2626 !important;
  color: #ffffff !important;
  border-color: #dc2626 !important;
}
.btn-danger-pill:disabled { opacity: 0.4; }

.matrix-toolbar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.75rem 0.9rem;
  margin-bottom: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
}
.matrix-toolbar .form-control,
.matrix-toolbar .form-select {
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.85rem;
}
.matrix-toolbar .form-control:focus,
.matrix-toolbar .form-select:focus {
  background: var(--surface-2);
  border-color: var(--accent);
  color: var(--text);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

.toolbar-search { min-width: 210px; flex: 1 1 210px; }
.toolbar-select { min-width: 190px; flex: 0 0 auto; }

.stat-chip {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.32rem 0.7rem;
  font-size: 0.76rem;
  color: var(--text-muted);
  white-space: nowrap;
}
.stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
.stat-chip.accent strong { color: var(--accent); }

.toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

.segmented {
  display: inline-flex;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}
.segmented button {
  border: none;
  background: transparent;
  color: var(--text-faint);
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.3rem 0.55rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.segmented button.active { background: var(--accent-soft); color: var(--accent); }

.bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
.btn-ghost {
  background: transparent !important;
  border: 1px solid var(--border) !important;
  color: var(--text-muted) !important;
  font-size: 0.78rem !important;
  border-radius: 8px !important;
  padding: 0.35rem 0.65rem !important;
}
.btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

.table-scroll-container {
  width: 100%;
  max-height: calc(100vh - 230px);
  min-height: 420px;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--surface);
}
.matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

.matrix-table thead th {
  position: sticky;
  top: 0;
  background: #0f1420 !important;
  z-index: 10;
  border-bottom: 2px solid rgba(45, 212, 191, 0.25);
  vertical-align: middle;
}

.matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
.matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

.matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

.student-cell { white-space: normal; }
.student-cell-inner { max-width: 100%; }
.student-cell-name {
  display: block;
  font-weight: 600;
  color: var(--accent);
  cursor: pointer;
  text-decoration: none;
  border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.student-cell-name:hover { color: #6ee7de; }
.student-cell-email {
  color: var(--text-faint);
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.doc-badge {
  font-size: 0.68rem;
  padding: 0.15rem 0.4rem;
  border-radius: 5px;
  background: var(--surface-2) !important;
  border: 1px solid var(--border);
  color: var(--text-muted) !important;
  text-decoration: none !important;
}

.chef-head-cell { text-align: center; }
.chef-avatar {
  min-width: 40px;
  height: 24px;
  padding: 0 6px;
  border-radius: 7px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--accent);
  margin-bottom: 2px;
  font-family: 'JetBrains Mono', monospace;
}
.chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
.chef-specialite {
  color: var(--text-faint);
  font-weight: 400;
  font-size: 0.68rem;
  max-width: 130px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
}
.chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

.sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
.badge-rank-selection {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 38px;
  justify-content: center;
  padding: 3px 8px;
  border-radius: 7px;
  font-weight: 700;
  font-size: 0.74rem;
  user-select: none;
  transition: transform 0.12s ease;
}
.badge-rank-selection.is-pending {
  background: transparent;
  border: 1px dashed var(--border);
  color: var(--text-faint);
  opacity: 0.5;
}
.sel-cell:hover .badge-rank-selection.is-pending {
  opacity: 1;
  border-color: var(--accent);
  color: var(--accent);
  transform: scale(1.15);
}
.badge-rank-selection.is-selected { border-style: solid; }
.sel-cell:hover .badge-rank-selection.is-selected { transform: scale(1.08); }

/* Vue mobile */
.mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
.mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.mobile-card-head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 0.85rem;
  cursor: pointer;
}
.mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
.mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
.mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
.mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
.mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
.mobile-chef-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.6rem;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text-muted);
  transition: border-color 0.12s ease, color 0.12s ease;
}
.mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

/* Modals Dark */
.modal-dark .modal-dialog { --bs-modal-width: 560px; }
.modal-dark .modal-content {
  background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
  background-color: #12161f !important;
  border: 1px solid rgba(45, 212, 191, 0.22);
  border-radius: 20px;
  color: var(--text);
  box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
  overflow: hidden;
}
.modal-dark .modal-header {
  border-bottom: 1px solid var(--border);
  background: rgba(45, 212, 191, 0.07);
  padding: 1.15rem 1.5rem;
}
.modal-dark .modal-header.danger-header {
  background: rgba(239, 68, 68, 0.12);
  border-bottom-color: rgba(239, 68, 68, 0.25);
}
.modal-dark .modal-body {
  padding: 1.5rem;
}
.modal-dark .modal-footer {
  border-top: 1px solid var(--border);
  padding: 0.9rem 1.5rem;
}
.modal-dark .btn-close {
  filter: invert(1) grayscale(100%) brightness(1.6);
  opacity: 0.7;
}

@media (max-width: 767px) {
  .matrix-shell { padding: 1rem 0.85rem 2rem; }
  .matrix-toolbar { flex-direction: column; align-items: stretch; }
  .bulk-actions { margin-left: 0; }
}
`;

function ChefHeaderCell({ chef, count, showFullNames }) {
  return (
    <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
      <div className="chef-avatar">{chefInitials(chef.nom)}</div>
      {showFullNames && (
        <>
          <div className="chef-fullname">{chef.nom}</div>
          {chef.specialite && (
            <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
          )}
        </>
      )}
      <div>
        <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
      </div>
    </th>
  );
}

function SelectionCell({ selected, rankNum, onClick }) {
  return (
    <td className="sel-cell" onClick={onClick}>
      {selected ? (
        <span
          className="badge-rank-selection is-selected"
          style={getRankBadgeStyle(rankNum)}
          title={`Vœu ${rankLabel(rankNum)} — cliquer pour retirer`}
        >
          ✓ {rankLabel(rankNum)}
        </span>
      ) : (
        <span className="badge-rank-selection is-pending" title="Cliquer pour ajouter comme vœu">
          +
        </span>
      )}
    </td>
  );
}

function MobileStudentCard({ etud, chefs, selectionsMap, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
  return (
    <div className="mobile-card">
      <div className="mobile-card-head" onClick={onToggleExpand}>
        <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
          <div className="mobile-card-email">{etud.adresse_email}</div>
        </div>
        <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
      </div>
      {expanded && (
        <div className="mobile-card-body">
          <Button
            size="sm"
            className="btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
            }}
          >
            📊 Profil compétences
          </Button>
          {chefs.map((chef) => {
            const key = `${etud.id}-${chef.id}`;
            const prio = selectionsMap.get(key);
            const isSelected = Boolean(prio);
            return (
              <span
                key={chef.id}
                className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
                style={isSelected ? getRankBadgeStyle(prio) : undefined}
                onClick={() => onToggleSelection(etud.id, chef.id)}
              >
                {isSelected ? `✓ ${chef.nom} · ${rankLabel(prio)}` : `+ ${chef.nom}`}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SelectionPage() {
  const [chefs, setChefs] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [referentielCompetences, setReferentielCompetences] = useState([]);

  // Map "etudiantId-chefId" => priorite (1, 2, 3...)
  const [selectionsMap, setSelectionsMap] = useState(new Map());
  const [initialSelectionsMap, setInitialSelectionsMap] = useState(new Map());

  const [searchStudent, setSearchStudent] = useState('');
  const [selectedChefFilter, setSelectedChefFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [density, setDensity] = useState('compact');
  const [showFullNames, setShowFullNames] = useState(false);
  const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
  const [aptitudesData, setAptitudesData] = useState(null);
  const [apetencesData, setApetencesData] = useState(null);
  const [modalError, setModalError] = useState(null);

  const isMobile = useIsMobile(768);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [chefsData, etudiantsData, selectionsData, refCompsData] = await Promise.all([
        fetchChefsDeProjet(),
        fetchEtudiants(),
        fetchSelections(),
        fetchReferentielCompetences(true),
      ]);

      setChefs(chefsData || []);
      setEtudiants(etudiantsData || []);
      setReferentielCompetences(refCompsData || []);

      const activeMap = new Map();
      (selectionsData || []).forEach((s) => {
        if (s.etudiant_id && s.chef_de_projet_id) {
          activeMap.set(`${s.etudiant_id}-${s.chef_de_projet_id}`, s.priorite || 1);
        }
      });

      setSelectionsMap(new Map(activeMap));
      setInitialSelectionsMap(new Map(activeMap));
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const hasChanges = useMemo(() => {
    if (selectionsMap.size !== initialSelectionsMap.size) return true;
    for (const [key, prio] of selectionsMap.entries()) {
      if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
        return true;
      }
    }
    return false;
  }, [selectionsMap, initialSelectionsMap]);

  const filteredEtudiants = useMemo(() => {
    const term = searchStudent.toLowerCase().trim();
    if (!term) return etudiants;
    return etudiants.filter(
      (e) =>
        (e.nom && e.nom.toLowerCase().includes(term)) ||
        (e.prenom && e.prenom.toLowerCase().includes(term)) ||
        (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
    );
  }, [etudiants, searchStudent]);

  const visibleChefs = useMemo(() => {
    if (selectedChefFilter === 'all') return chefs;
    return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
  }, [chefs, selectedChefFilter]);

  const countsPerStudent = useMemo(() => {
    const map = {};
    for (const key of selectionsMap.keys()) {
      const [etudId] = key.split('-');
      map[etudId] = (map[etudId] || 0) + 1;
    }
    return map;
  }, [selectionsMap]);

  const countsPerChef = useMemo(() => {
    const map = {};
    for (const key of selectionsMap.keys()) {
      const [, chefId] = key.split('-');
      map[chefId] = (map[chefId] || 0) + 1;
    }
    return map;
  }, [selectionsMap]);

  // Bascule ou ajout manuel d'un vœu
  const toggleSelection = useCallback((etudiantId, chefId) => {
    const key = `${etudiantId}-${chefId}`;
    setSelectionsMap((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        // Détermine le rang suivant disponible (ex: 1 si premier vœu, 2 si deuxième, etc.)
        let maxPrio = 0;
        for (const [k, p] of next.entries()) {
          if (k.startsWith(`${etudiantId}-`)) {
            if (p > maxPrio) maxPrio = p;
          }
        }
        next.set(key, maxPrio + 1);
      }
      return next;
    });
    setSuccessMsg(null);
  }, []);

  const handleSelectAllVisible = () => {
    setSelectionsMap((prev) => {
      const next = new Map(prev);
      filteredEtudiants.forEach((e) => {
        let currentPrio = 1;
        visibleChefs.forEach((c) => {
          const key = `${e.id}-${c.id}`;
          if (!next.has(key)) {
            next.set(key, currentPrio);
            currentPrio++;
          }
        });
      });
      return next;
    });
    setSuccessMsg(null);
  };

  const handleDeselectAllVisible = () => {
    setSelectionsMap((prev) => {
      const next = new Map(prev);
      filteredEtudiants.forEach((e) => {
        visibleChefs.forEach((c) => {
          next.delete(`${e.id}-${c.id}`);
        });
      });
      return next;
    });
    setSuccessMsg(null);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      const toUpsert = [];
      selectionsMap.forEach((prio, key) => {
        const [etudiantId, chefId] = key.split('-').map(Number);
        if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
          toUpsert.push({ etudiantId, chefId, prio });
        }
      });

      const toDelete = [];
      initialSelectionsMap.forEach((_, key) => {
        if (!selectionsMap.has(key)) {
          const [etudiantId, chefId] = key.split('-').map(Number);
          toDelete.push({ etudiantId, chefId });
        }
      });

      const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
        deleteSelection(etudiantId, chefId)
      );
      const savePromises = toUpsert.map(({ etudiantId, chefId, prio }) =>
        saveSelection(etudiantId, chefId, prio)
      );

      await Promise.all([...deletePromises, ...savePromises]);

      setInitialSelectionsMap(new Map(selectionsMap));
      setSuccessMsg(
        `✨ Sélections enregistrées (${toUpsert.length} mise(s) à jour, ${toDelete.length} suppression(s)).`
      );
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSelections = async () => {
    try {
      setResetting(true);
      setError(null);
      await resetAllSelections();
      setSelectionsMap(new Map());
      setInitialSelectionsMap(new Map());
      setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
      setShowResetModal(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
    } finally {
      setResetting(false);
    }
  };

  const handleDownloadSelectionXLSX = () => {
    try {
      if (etudiants.length === 0 || chefs.length === 0) {
        alert('Aucune donnée disponible.');
        return;
      }

      const sortedEtudiants = [...etudiants].sort((a, b) =>
        (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
      );

      const selectionRows = sortedEtudiants.map((etud) => {
        const row = {
          'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
          'Email': etud.adresse_email || '',
          'Parcours': etud.parcours || 'I2026',
        };

        chefs.forEach((chef) => {
          const prio = selectionsMap.get(`${etud.id}-${chef.id}`);
          row[chef.nom] = prio ? `${rankLabel(prio)} Choix (P${prio})` : '';
        });

        row['Total Vœux'] = countsPerStudent[etud.id] || 0;
        return row;
      });

      const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
      wsSelections['!cols'] = [
        { wch: 26 },
        { wch: 32 },
        { wch: 12 },
        ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 18) })),
        { wch: 16 },
      ];

      const statsRows = chefs.map((chef) => {
        let p1Count = 0;
        let totalCount = 0;
        for (const [key, prio] of selectionsMap.entries()) {
          const [, cId] = key.split('-').map(Number);
          if (cId === chef.id) {
            totalCount++;
            if (prio === 1) p1Count++;
          }
        }
        return {
          'Chef de Projet': chef.nom,
          'Spécialité': chef.specialite || 'N/A',
          'Email': chef.email || '',
          'Vœux 1er choix (P1)': p1Count,
          'Total Sélections': totalCount,
        };
      });

      const wsStats = XLSX.utils.json_to_sheet(statsRows);
      wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }, { wch: 18 }];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
      XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

      const today = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `selections_voeux_reels_${today}.xlsx`);
    } catch (err) {
      alert(`Erreur export: ${err.message}`);
    }
  };

  const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
    if (!etudiantId) return;
    setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setAptitudesData(null);
    setApetencesData(null);

    try {
      const [aptitudes, apetences] = await Promise.all([
        fetchAptitudesByEtudiant(etudiantId),
        fetchApetencesByEtudiant(etudiantId),
      ]);

      if (!aptitudes && !apetences) {
        setModalError('Aucune compétence ni appétence enregistrée.');
      } else {
        setAptitudesData(aptitudes);
        setApetencesData(apetences);
      }
    } catch (err) {
      setModalError(err.message || 'Erreur chargement compétences.');
    } finally {
      setModalLoading(false);
    }
  };

  const radarChartData = useMemo(() => {
    const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
    const labels = activeComps.map((c) => c.label);
    const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
    const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);

    return {
      labels,
      datasets: [
        {
          label: 'Aptitudes (Technique)',
          data: aptValues,
          backgroundColor: 'rgba(56, 189, 248, 0.25)',
          borderColor: '#38bdf8',
          borderWidth: 2,
          pointBackgroundColor: '#38bdf8',
        },
        {
          label: 'Appétences (Intérêt)',
          data: apeValues,
          backgroundColor: 'rgba(244, 63, 94, 0.25)',
          borderColor: '#f43f5e',
          borderWidth: 2,
          pointBackgroundColor: '#f43f5e',
        },
      ],
    };
  }, [referentielCompetences, aptitudesData, apetencesData]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        suggestedMax: 4,
        ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.12)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
        pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
      },
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
    },
  };

  const toggleMobileExpand = (id) => {
    setExpandedMobileIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <style>{STYLE_SHEET}</style>
        <div className="matrix-page">
          <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
            <Spinner animation="border" style={{ color: '#2dd4bf' }} />
            <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
              Chargement de la matrice des sélections...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <style>{STYLE_SHEET}</style>

      <div className="matrix-page">
        <div className="matrix-shell">
          {/* Header */}
          <div className="matrix-header">
            <div>
              <h2 className="matrix-title display">🎯 Sélections &amp; Vœux Réels des Étudiants</h2>
              <p className="matrix-subtitle">
                Les vœux réels (1er, 2e, 3e choix) sont importés directement depuis le questionnaire Moodle et modifiables par l'administrateur.
              </p>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

              <Button
                className="btn-pill btn-danger-pill"
                onClick={() => setShowResetModal(true)}
                disabled={selectionsMap.size === 0 || resetting}
                title="Supprimer toutes les sélections pour repartir de zéro"
              >
                🗑️ Vider tout ({selectionsMap.size})
              </Button>

              <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
                📊 Exporter (.xlsx)
              </Button>

              <Button
                className="btn-pill btn-save-pill"
                onClick={handleSubmit}
                disabled={saving || !hasChanges}
              >
                {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
              </Button>
            </div>
          </div>

          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
          {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

          {/* Toolbar unique */}
          <div className="matrix-toolbar">
            <InputGroup size="sm" className="toolbar-search">
              <Form.Control
                placeholder="🔍 Rechercher un étudiant..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
              {searchStudent && (
                <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
              )}
            </InputGroup>

            <Form.Select
              size="sm"
              className="toolbar-select"
              value={selectedChefFilter}
              onChange={(e) => setSelectedChefFilter(e.target.value)}
            >
              <option value="all">Tous les chefs ({chefs.length})</option>
              {chefs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom} {c.specialite ? `(${c.specialite})` : ''}
                </option>
              ))}
            </Form.Select>

            <div className="toolbar-divider" />

            <span className="stat-chip accent"><strong>{selectionsMap.size}</strong> sélections</span>
            <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
            <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

            {!isMobile && (
              <>
                <div className="toolbar-divider" />
                <div className="segmented" role="group" aria-label="Densité du tableau">
                  <button
                    type="button"
                    className={density === 'compact' ? 'active' : ''}
                    onClick={() => setDensity('compact')}
                  >
                    Compact
                  </button>
                  <button
                    type="button"
                    className={density === 'comfortable' ? 'active' : ''}
                    onClick={() => setDensity('comfortable')}
                  >
                    Confortable
                  </button>
                </div>
                <div className="segmented" role="group" aria-label="Affichage des noms de chef">
                  <button
                    type="button"
                    className={!showFullNames ? 'active' : ''}
                    onClick={() => setShowFullNames(false)}
                  >
                    Initiales
                  </button>
                  <button
                    type="button"
                    className={showFullNames ? 'active' : ''}
                    onClick={() => setShowFullNames(true)}
                  >
                    Noms complets
                  </button>
                </div>
              </>
            )}

            <div className="bulk-actions">
              <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
              <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
            </div>
          </div>

          {/* Vue mobile */}
          {isMobile ? (
            filteredEtudiants.length === 0 ? (
              <div className="empty-state">Aucun étudiant trouvé.</div>
            ) : (
              <div className="mobile-list">
                {filteredEtudiants.map((etud) => (
                  <MobileStudentCard
                    key={etud.id}
                    etud={etud}
                    chefs={visibleChefs}
                    selectionsMap={selectionsMap}
                    expanded={expandedMobileIds.has(etud.id)}
                    onToggleExpand={() => toggleMobileExpand(etud.id)}
                    onToggleSelection={toggleSelection}
                    onOpenRadar={handleOpenStudentRadar}
                    totalForEtud={countsPerStudent[etud.id] || 0}
                  />
                ))}
              </div>
            )
          ) : (
            /* Vue desktop */
            <div className="table-scroll-container">
              <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
                <thead>
                  <tr>
                    <th
                      style={{
                        minWidth: density === 'compact' ? 148 : 190,
                        maxWidth: density === 'compact' ? 148 : 190,
                        textAlign: 'left',
                        position: 'sticky',
                        left: 0,
                        top: 0,
                        backgroundColor: '#0f1420',
                        zIndex: 20,
                        paddingLeft: '0.65rem',
                      }}
                    >
                      Étudiant ({filteredEtudiants.length})
                    </th>
                    <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
                      Total
                    </th>
                    {visibleChefs.map((chef) => (
                      <ChefHeaderCell
                        key={chef.id}
                        chef={chef}
                        count={countsPerChef[chef.id]}
                        showFullNames={showFullNames}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEtudiants.length === 0 ? (
                    <tr>
                      <td colSpan={visibleChefs.length + 2} className="empty-state">
                        Aucun étudiant trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredEtudiants.map((etud) => {
                      const totalForEtud = countsPerStudent[etud.id] || 0;

                      return (
                        <tr key={etud.id}>
                          <td
                            className="student-cell"
                            style={{
                              textAlign: 'left',
                              position: 'sticky',
                              left: 0,
                              backgroundColor: '#131c2e',
                              zIndex: 5,
                              paddingLeft: '0.65rem',
                              maxWidth: density === 'compact' ? 148 : 190,
                            }}
                          >
                            <div className="student-cell-inner">
                              <span
                                className="student-cell-name"
                                title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
                                onClick={() =>
                                  handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
                                }
                              >
                                {etud.nom} {etud.prenom}
                              </span>
                              {density === 'comfortable' && (
                                <div className="student-cell-email" title={etud.adresse_email}>
                                  {etud.adresse_email}
                                </div>
                              )}
                              {(etud.cv_path || etud.lm_path) && (
                                <div className="d-flex gap-1 mt-1">
                                  {etud.cv_path && (
                                    <a
                                      href={getDocumentPublicUrl(etud.cv_path)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="doc-badge badge"
                                      title="CV"
                                    >
                                      📄
                                    </a>
                                  )}
                                  {etud.lm_path && (
                                    <a
                                      href={getDocumentPublicUrl(etud.lm_path)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="doc-badge badge"
                                      title="Lettre de motivation"
                                    >
                                      ✉️
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>

                          <td style={{ backgroundColor: '#131c2e' }}>
                            <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
                          </td>

                          {visibleChefs.map((chef) => {
                            const key = `${etud.id}-${chef.id}`;
                            const prio = selectionsMap.get(key);
                            const isSelected = Boolean(prio);

                            return (
                              <SelectionCell
                                key={chef.id}
                                selected={isSelected}
                                rankNum={prio || 1}
                                onClick={() => toggleSelection(etud.id, chef.id)}
                              />
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Confirmation Réinitialisation Sélections */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white" className="danger-header">
          <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selectionsMap.size} vœux)</strong> de la base de données ?
          </p>
          <p className="text-muted small mb-0">
            Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
            {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Radar Dynamique */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {modalLoading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
          ) : modalError ? (
            <Alert variant="warning">{modalError}</Alert>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '380px' }}>
              <Radar data={radarChartData} options={radarOptions} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}