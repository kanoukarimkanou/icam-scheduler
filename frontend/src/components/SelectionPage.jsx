// // // // // // // // // // import React, { useEffect, useState, useMemo } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //   Table,
// // // // // // // // // //   Button,
// // // // // // // // // //   Alert,
// // // // // // // // // //   Spinner,
// // // // // // // // // //   Form,
// // // // // // // // // //   InputGroup,
// // // // // // // // // //   Badge,
// // // // // // // // // //   Card,
// // // // // // // // // //   Row,
// // // // // // // // // //   Col,
// // // // // // // // // //   Modal,
// // // // // // // // // // } from 'react-bootstrap';
// // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // import {
// // // // // // // // // //   Chart as ChartJS,
// // // // // // // // // //   RadialLinearScale,
// // // // // // // // // //   PointElement,
// // // // // // // // // //   LineElement,
// // // // // // // // // //   Filler,
// // // // // // // // // //   Tooltip,
// // // // // // // // // //   Legend,
// // // // // // // // // // } from 'chart.js';
// // // // // // // // // // import { Radar } from 'react-chartjs-2';
// // // // // // // // // // import Navbar from './Navbar';
// // // // // // // // // // import {
// // // // // // // // // //   fetchChefsDeProjet,
// // // // // // // // // //   fetchEtudiants,
// // // // // // // // // //   fetchSelections,
// // // // // // // // // //   saveSelection,
// // // // // // // // // //   deleteSelection,
// // // // // // // // // //   fetchAllApetences,
// // // // // // // // // //   fetchAptitudesByEtudiant,
// // // // // // // // // //   fetchApetencesByEtudiant,
// // // // // // // // // //   computeChefRanksForStudent,
// // // // // // // // // //   getDocumentPublicUrl,
// // // // // // // // // // } from '../services/supabase';

// // // // // // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // // // // // const COMPETENCE_KEYS = [
// // // // // // // // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // // // // // // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // // // // // // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // // // // // // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // // // // // // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // // // // // // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // // // // // // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // // // // // // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // // // // // // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // // // // // // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // // // // // // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // // // // // // // ];

// // // // // // // // // // const getRankBadgeStyle = (rank) => {
// // // // // // // // // //   switch (rank) {
// // // // // // // // // //     case 1:
// // // // // // // // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // // // // // // // //     case 2:
// // // // // // // // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // // // // // // // //     case 3:
// // // // // // // // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // // // // // // // //     default:
// // // // // // // // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // // // // // // // //   }
// // // // // // // // // // };

// // // // // // // // // // export default function SelectionPage() {
// // // // // // // // // //   const [chefs, setChefs] = useState([]);
// // // // // // // // // //   const [etudiants, setEtudiants] = useState([]);
// // // // // // // // // //   const [apetencesList, setApetencesList] = useState([]);

// // // // // // // // // //   // Set de "etudiantId-chefId"
// // // // // // // // // //   const [selections, setSelections] = useState(new Set());
// // // // // // // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // // // // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // // // // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // // // //   const [error, setError] = useState(null);
// // // // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // // // //   // Modal Radar
// // // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // // // // // //   const [modalError, setModalError] = useState(null);

// // // // // // // // // //   const loadData = async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       setError(null);

// // // // // // // // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // // // // // // // //         fetchChefsDeProjet(),
// // // // // // // // // //         fetchEtudiants(),
// // // // // // // // // //         fetchSelections(),
// // // // // // // // // //         fetchAllApetences(),
// // // // // // // // // //       ]);

// // // // // // // // // //       setChefs(chefsData || []);
// // // // // // // // // //       setEtudiants(etudiantsData || []);
// // // // // // // // // //       setApetencesList(apetencesDataRaw || []);

// // // // // // // // // //       const activeSet = new Set();
// // // // // // // // // //       (selectionsData || []).forEach((s) => {
// // // // // // // // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // // // // // // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // // // // // // // //         }
// // // // // // // // // //       });

// // // // // // // // // //       setSelections(new Set(activeSet));
// // // // // // // // // //       setInitialSelections(new Set(activeSet));
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     loadData();
// // // // // // // // // //   }, []);

// // // // // // // // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // // // // // // // //   const appetenceRanksMap = useMemo(() => {
// // // // // // // // // //     const map = new Map();
// // // // // // // // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // // // // // // // //     etudiants.forEach((etud) => {
// // // // // // // // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // // // // // // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // // // // // // // //       map.set(etud.id, ranks);
// // // // // // // // // //     });

// // // // // // // // // //     return map;
// // // // // // // // // //   }, [apetencesList, etudiants, chefs]);

// // // // // // // // // //   const hasChanges = useMemo(() => {
// // // // // // // // // //     if (selections.size !== initialSelections.size) return true;
// // // // // // // // // //     for (const key of selections) {
// // // // // // // // // //       if (!initialSelections.has(key)) return true;
// // // // // // // // // //     }
// // // // // // // // // //     return false;
// // // // // // // // // //   }, [selections, initialSelections]);

// // // // // // // // // //   const filteredEtudiants = useMemo(() => {
// // // // // // // // // //     const term = searchStudent.toLowerCase().trim();
// // // // // // // // // //     if (!term) return etudiants;
// // // // // // // // // //     return etudiants.filter(
// // // // // // // // // //       (e) =>
// // // // // // // // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // // // // // // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // // // // // // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // // // // // // // //     );
// // // // // // // // // //   }, [etudiants, searchStudent]);

// // // // // // // // // //   const visibleChefs = useMemo(() => {
// // // // // // // // // //     if (selectedChefFilter === 'all') return chefs;
// // // // // // // // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // // // // // // // //   }, [chefs, selectedChefFilter]);

// // // // // // // // // //   const countsPerStudent = useMemo(() => {
// // // // // // // // // //     const map = {};
// // // // // // // // // //     for (const key of selections) {
// // // // // // // // // //       const [etudId] = key.split('-');
// // // // // // // // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // // // // // // // //     }
// // // // // // // // // //     return map;
// // // // // // // // // //   }, [selections]);

// // // // // // // // // //   const countsPerChef = useMemo(() => {
// // // // // // // // // //     const map = {};
// // // // // // // // // //     for (const key of selections) {
// // // // // // // // // //       const [, chefId] = key.split('-');
// // // // // // // // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // // // // // // // //     }
// // // // // // // // // //     return map;
// // // // // // // // // //   }, [selections]);

// // // // // // // // // //   const toggleSelection = (etudiantId, chefId) => {
// // // // // // // // // //     const key = `${etudiantId}-${chefId}`;
// // // // // // // // // //     setSelections((prev) => {
// // // // // // // // // //       const next = new Set(prev);
// // // // // // // // // //       if (next.has(key)) next.delete(key);
// // // // // // // // // //       else next.add(key);
// // // // // // // // // //       return next;
// // // // // // // // // //     });
// // // // // // // // // //     setSuccessMsg(null);
// // // // // // // // // //   };

// // // // // // // // // //   const handleSelectAllVisible = () => {
// // // // // // // // // //     setSelections((prev) => {
// // // // // // // // // //       const next = new Set(prev);
// // // // // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // // // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // // // // // // // //       });
// // // // // // // // // //       return next;
// // // // // // // // // //     });
// // // // // // // // // //     setSuccessMsg(null);
// // // // // // // // // //   };

// // // // // // // // // //   const handleDeselectAllVisible = () => {
// // // // // // // // // //     setSelections((prev) => {
// // // // // // // // // //       const next = new Set(prev);
// // // // // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // // // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // // // // // // // //       });
// // // // // // // // // //       return next;
// // // // // // // // // //     });
// // // // // // // // // //     setSuccessMsg(null);
// // // // // // // // // //   };

// // // // // // // // // //   const handleSubmit = async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       setSaving(true);
// // // // // // // // // //       setError(null);
// // // // // // // // // //       setSuccessMsg(null);

// // // // // // // // // //       const toAdd = [];
// // // // // // // // // //       selections.forEach((key) => {
// // // // // // // // // //         if (!initialSelections.has(key)) {
// // // // // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // // // // //           toAdd.push({ etudiantId, chefId });
// // // // // // // // // //         }
// // // // // // // // // //       });

// // // // // // // // // //       const toDelete = [];
// // // // // // // // // //       initialSelections.forEach((key) => {
// // // // // // // // // //         if (!selections.has(key)) {
// // // // // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // // // // //           toDelete.push({ etudiantId, chefId });
// // // // // // // // // //         }
// // // // // // // // // //       });

// // // // // // // // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // // // // // // // //         deleteSelection(etudiantId, chefId)
// // // // // // // // // //       );
// // // // // // // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // // // // // // // //         saveSelection(etudiantId, chefId)
// // // // // // // // // //       );

// // // // // // // // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // // // // // // // //       setInitialSelections(new Set(selections));
// // // // // // // // // //       setSuccessMsg(
// // // // // // // // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // // // // // // // //       );
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setSaving(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Export Excel
// // // // // // // // // //   const handleDownloadSelectionXLSX = () => {
// // // // // // // // // //     try {
// // // // // // // // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // // // // // // // //         alert("Aucune donnée disponible.");
// // // // // // // // // //         return;
// // // // // // // // // //       }

// // // // // // // // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // // // // // // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // // // // // // // //       );

// // // // // // // // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // // // // // // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // // // // // // // //         const row = {
// // // // // // // // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // // // // // // // //           'Email': etud.adresse_email || '',
// // // // // // // // // //           'Parcours': etud.parcours || 'I2026',
// // // // // // // // // //         };

// // // // // // // // // //         chefs.forEach((chef) => {
// // // // // // // // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // // // // // // // //           const rankInfo = studentRanks?.get(chef.id);
// // // // // // // // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // // // // // // // //         });

// // // // // // // // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // // // // // // // //         return row;
// // // // // // // // // //       });

// // // // // // // // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // // // // // // // //       wsSelections['!cols'] = [
// // // // // // // // // //         { wch: 26 },
// // // // // // // // // //         { wch: 32 },
// // // // // // // // // //         { wch: 12 },
// // // // // // // // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // // // // // // // //         { wch: 16 },
// // // // // // // // // //       ];

// // // // // // // // // //       const statsRows = chefs.map((chef) => ({
// // // // // // // // // //         'Chef de Projet': chef.nom,
// // // // // // // // // //         'Spécialité': chef.specialite || 'N/A',
// // // // // // // // // //         'Email': chef.email || '',
// // // // // // // // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // // // // // // // //       }));

// // // // // // // // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // // // // // // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // // // // // // // //       const workbook = XLSX.utils.book_new();
// // // // // // // // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // // // // // // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // // // // // // // //       const today = new Date().toISOString().slice(0, 10);
// // // // // // // // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       alert(`Erreur export: ${err.message}`);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Popup Radar
// // // // // // // // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // // // // // // // //     if (!etudiantId) return;
// // // // // // // // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // // // // // // // //     setModalOpen(true);
// // // // // // // // // //     setModalLoading(true);
// // // // // // // // // //     setModalError(null);
// // // // // // // // // //     setAptitudesData(null);
// // // // // // // // // //     setApetencesData(null);

// // // // // // // // // //     try {
// // // // // // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // // // // // //         fetchAptitudesByEtudiant(etudiantId),
// // // // // // // // // //         fetchApetencesByEtudiant(etudiantId),
// // // // // // // // // //       ]);

// // // // // // // // // //       if (!aptitudes && !apetences) {
// // // // // // // // // //         setModalError("Aucune compétence ni appétence enregistrée.");
// // // // // // // // // //       } else {
// // // // // // // // // //         setAptitudesData(aptitudes);
// // // // // // // // // //         setApetencesData(apetences);
// // // // // // // // // //       }
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // // // // // // // //     } finally {
// // // // // // // // // //       setModalLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const radarChartData = useMemo(() => {
// // // // // // // // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // // // // // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // // // // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // // // // // // // //     return {
// // // // // // // // // //       labels,
// // // // // // // // // //       datasets: [
// // // // // // // // // //         {
// // // // // // // // // //           label: 'Aptitudes (Technique)',
// // // // // // // // // //           data: aptValues,
// // // // // // // // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // // // // // // // //           borderColor: '#38bdf8',
// // // // // // // // // //           borderWidth: 2,
// // // // // // // // // //           pointBackgroundColor: '#38bdf8',
// // // // // // // // // //         },
// // // // // // // // // //         {
// // // // // // // // // //           label: 'Appétences (Intérêt)',
// // // // // // // // // //           data: apeValues,
// // // // // // // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // // // // // // //           borderColor: '#f43f5e',
// // // // // // // // // //           borderWidth: 2,
// // // // // // // // // //           pointBackgroundColor: '#f43f5e',
// // // // // // // // // //         },
// // // // // // // // // //       ],
// // // // // // // // // //     };
// // // // // // // // // //   }, [aptitudesData, apetencesData]);

// // // // // // // // // //   const radarOptions = {
// // // // // // // // // //     responsive: true,
// // // // // // // // // //     maintainAspectRatio: false,
// // // // // // // // // //     scales: {
// // // // // // // // // //       r: {
// // // // // // // // // //         min: 0,
// // // // // // // // // //         suggestedMax: 4,
// // // // // // // // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // // // // // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // // // // // // //       },
// // // // // // // // // //     },
// // // // // // // // // //     plugins: {
// // // // // // // // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // // // // // // // //     },
// // // // // // // // // //   };

// // // // // // // // // //   if (loading) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // // // // // // //         <Spinner animation="border" variant="info" />
// // // // // // // // // //         <p className="mt-3 text-muted fw-semibold">Chargement de la matrice des sélections...</p>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <>
// // // // // // // // // //       <style>{`
// // // // // // // // // //         .matrix-page-wrapper {
// // // // // // // // // //           max-width: 98%;
// // // // // // // // // //           margin: 0 auto;
// // // // // // // // // //           padding: 1.5rem 0 3rem 0;
// // // // // // // // // //           color: #f8fafc;
// // // // // // // // // //         }
// // // // // // // // // //         .glass-card-matrix {
// // // // // // // // // //           background: rgba(18, 24, 38, 0.85);
// // // // // // // // // //           backdrop-filter: blur(16px);
// // // // // // // // // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // // // // //           border-radius: 16px;
// // // // // // // // // //         }
// // // // // // // // // //         .kpi-matrix {
// // // // // // // // // //           padding: 1.2rem;
// // // // // // // // // //           border-radius: 16px;
// // // // // // // // // //           background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%);
// // // // // // // // // //           border: 1px solid rgba(255, 255, 255, 0.06);
// // // // // // // // // //         }
// // // // // // // // // //         .table-scroll-container {
// // // // // // // // // //           width: 100%;
// // // // // // // // // //           max-height: calc(100vh - 290px);
// // // // // // // // // //           min-height: 480px;
// // // // // // // // // //           overflow-x: auto;
// // // // // // // // // //           overflow-y: auto;
// // // // // // // // // //           border-radius: 16px;
// // // // // // // // // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // // // // //           background: rgba(18, 24, 38, 0.9);
// // // // // // // // // //         }
// // // // // // // // // //         .matrix-table {
// // // // // // // // // //           width: 100%;
// // // // // // // // // //           border-collapse: separate;
// // // // // // // // // //           border-spacing: 0;
// // // // // // // // // //           color: #e2e8f0;
// // // // // // // // // //         }
// // // // // // // // // //         .matrix-table thead th {
// // // // // // // // // //           position: sticky;
// // // // // // // // // //           top: 0;
// // // // // // // // // //           background: #0f172a !important;
// // // // // // // // // //           z-index: 10;
// // // // // // // // // //           padding: 0.85rem 0.6rem;
// // // // // // // // // //           border-bottom: 2px solid rgba(99, 102, 241, 0.3);
// // // // // // // // // //         }
// // // // // // // // // //         .matrix-table tbody tr:hover {
// // // // // // // // // //           background-color: rgba(99, 102, 241, 0.08) !important;
// // // // // // // // // //         }
// // // // // // // // // //         .badge-rank-selection {
// // // // // // // // // //           display: inline-flex;
// // // // // // // // // //           align-items: center;
// // // // // // // // // //           gap: 6px;
// // // // // // // // // //           padding: 4px 10px;
// // // // // // // // // //           border-radius: 8px;
// // // // // // // // // //           font-weight: 700;
// // // // // // // // // //           font-size: 0.78rem;
// // // // // // // // // //           cursor: pointer;
// // // // // // // // // //           transition: transform 0.15s ease, box-shadow 0.15s ease;
// // // // // // // // // //         }
// // // // // // // // // //         .badge-rank-selection:hover {
// // // // // // // // // //           transform: scale(1.06);
// // // // // // // // // //           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
// // // // // // // // // //         }
// // // // // // // // // //       `}</style>

// // // // // // // // // //       <Navbar />

// // // // // // // // // //       <div className="matrix-page-wrapper">
// // // // // // // // // //         {/* Header */}
// // // // // // // // // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // // // // // // // // //           <div>
// // // // // // // // // //             <div className="d-flex align-items-center gap-2">
// // // // // // // // // //               <span style={{ fontSize: '1.8rem' }}>🎯</span>
// // // // // // // // // //               <h2 className="fw-bold mb-0 text-white">Sélections & Classement par Appétences</h2>
// // // // // // // // // //             </div>
// // // // // // // // // //             <p className="text-light opacity-75 small mt-1 mb-0">
// // // // // // // // // //               💡 <em>Le rang de chaque chef (1er, 2e, 3e...) est calculé automatiquement d'après les appétences de l'étudiant pour sa thématique.</em>
// // // // // // // // // //             </p>
// // // // // // // // // //           </div>

// // // // // // // // // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // // // // // //             {hasChanges && (
// // // // // // // // // //               <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">
// // // // // // // // // //                 ⚠️ Modifications non enregistrées
// // // // // // // // // //               </Badge>
// // // // // // // // // //             )}

// // // // // // // // // //             <Button variant="success" size="sm" onClick={handleDownloadSelectionXLSX} className="px-3 py-2 fw-semibold">
// // // // // // // // // //               📊 Exporter Tableau (.xlsx)
// // // // // // // // // //             </Button>

// // // // // // // // // //             <Button
// // // // // // // // // //               variant="primary"
// // // // // // // // // //               size="sm"
// // // // // // // // // //               onClick={handleSubmit}
// // // // // // // // // //               disabled={saving || !hasChanges}
// // // // // // // // // //               className="px-4 py-2 fw-semibold"
// // // // // // // // // //             >
// // // // // // // // // //               {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer les sélections'}
// // // // // // // // // //             </Button>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>

// // // // // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // // // //         {/* Cartes KPI */}
// // // // // // // // // //         <Row className="g-3 mb-4">
// // // // // // // // // //           <Col xs={6} md={3}>
// // // // // // // // // //             <div className="kpi-matrix">
// // // // // // // // // //               <div className="text-muted small text-uppercase fw-bold">Total Sélections</div>
// // // // // // // // // //               <div className="fs-2 fw-bold mt-1 text-info">{selections.size}</div>
// // // // // // // // // //             </div>
// // // // // // // // // //           </Col>
// // // // // // // // // //           <Col xs={6} md={3}>
// // // // // // // // // //             <div className="kpi-matrix">
// // // // // // // // // //               <div className="text-muted small text-uppercase fw-bold">Étudiants avec Vœux</div>
// // // // // // // // // //               <div className="fs-2 fw-bold mt-1 text-success">
// // // // // // // // // //                 {Object.values(countsPerStudent).filter((c) => c > 0).length} <span className="fs-6 text-muted">/ {etudiants.length}</span>
// // // // // // // // // //               </div>
// // // // // // // // // //             </div>
// // // // // // // // // //           </Col>
// // // // // // // // // //           <Col xs={6} md={3}>
// // // // // // // // // //             <div className="kpi-matrix">
// // // // // // // // // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // // // // // // // // //               <div className="fs-2 fw-bold mt-1 text-warning">{chefs.length}</div>
// // // // // // // // // //             </div>
// // // // // // // // // //           </Col>
// // // // // // // // // //           <Col xs={6} md={3}>
// // // // // // // // // //             <div className="kpi-matrix">
// // // // // // // // // //               <div className="text-muted small text-uppercase fw-bold">Étudiants Filtrés</div>
// // // // // // // // // //               <div className="fs-2 fw-bold mt-1 text-light">
// // // // // // // // // //                 {filteredEtudiants.length} <span className="fs-6 text-muted">/ {etudiants.length}</span>
// // // // // // // // // //               </div>
// // // // // // // // // //             </div>
// // // // // // // // // //           </Col>
// // // // // // // // // //         </Row>

// // // // // // // // // //         {/* Barre de Filtres */}
// // // // // // // // // //         <Card className="glass-card-matrix mb-4 p-3 shadow-sm">
// // // // // // // // // //           <Row className="g-3 align-items-center">
// // // // // // // // // //             <Col md={4}>
// // // // // // // // // //               <Form.Label className="mb-1 text-muted small fw-semibold">🔍 Rechercher un étudiant</Form.Label>
// // // // // // // // // //               <InputGroup size="sm">
// // // // // // // // // //                 <Form.Control
// // // // // // // // // //                   placeholder="Nom, prénom ou adresse email..."
// // // // // // // // // //                   className="bg-dark text-white border-secondary"
// // // // // // // // // //                   value={searchStudent}
// // // // // // // // // //                   onChange={(e) => setSearchStudent(e.target.value)}
// // // // // // // // // //                 />
// // // // // // // // // //                 {searchStudent && (
// // // // // // // // // //                   <Button variant="outline-secondary" onClick={() => setSearchStudent('')}>✕</Button>
// // // // // // // // // //                 )}
// // // // // // // // // //               </InputGroup>
// // // // // // // // // //             </Col>

// // // // // // // // // //             <Col md={4}>
// // // // // // // // // //               <Form.Label className="mb-1 text-muted small fw-semibold">👨‍🏫 Filtrer par chef de projet</Form.Label>
// // // // // // // // // //               <Form.Select
// // // // // // // // // //                 size="sm"
// // // // // // // // // //                 className="bg-dark text-white border-secondary"
// // // // // // // // // //                 value={selectedChefFilter}
// // // // // // // // // //                 onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // // // // // // //               >
// // // // // // // // // //                 <option value="all">Tous les chefs de projet ({chefs.length})</option>
// // // // // // // // // //                 {chefs.map((c) => (
// // // // // // // // // //                   <option key={c.id} value={c.id}>
// // // // // // // // // //                     {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // // // // // // //                   </option>
// // // // // // // // // //                 ))}
// // // // // // // // // //               </Form.Select>
// // // // // // // // // //             </Col>

// // // // // // // // // //             <Col md={4} className="d-flex gap-2 align-items-end justify-content-md-end pt-2 pt-md-0">
// // // // // // // // // //               <Button variant="outline-info" size="sm" onClick={handleSelectAllVisible}>
// // // // // // // // // //                 Tout cocher (visibles)
// // // // // // // // // //               </Button>
// // // // // // // // // //               <Button variant="outline-secondary" size="sm" onClick={handleDeselectAllVisible}>
// // // // // // // // // //                 Tout décocher
// // // // // // // // // //               </Button>
// // // // // // // // // //             </Col>
// // // // // // // // // //           </Row>
// // // // // // // // // //         </Card>

// // // // // // // // // //         {/* Tableau Matriciel avec Rangs d'Appétence */}
// // // // // // // // // //         <div className="table-scroll-container">
// // // // // // // // // //           <Table size="sm" className="matrix-table text-center text-nowrap align-middle">
// // // // // // // // // //             <thead>
// // // // // // // // // //               <tr>
// // // // // // // // // //                 <th style={{ minWidth: '290px', textAlign: 'left', position: 'sticky', left: 0, top: 0, backgroundColor: '#0f172a', zIndex: 20, paddingLeft: '1.25rem' }}>
// // // // // // // // // //                   Étudiant ({filteredEtudiants.length})
// // // // // // // // // //                 </th>
// // // // // // // // // //                 <th style={{ width: '80px', position: 'sticky', top: 0, backgroundColor: '#0f172a', zIndex: 10 }}>
// // // // // // // // // //                   Total
// // // // // // // // // //                 </th>
// // // // // // // // // //                 {visibleChefs.map((chef) => (
// // // // // // // // // //                   <th key={chef.id} style={{ minWidth: '140px', position: 'sticky', top: 0, backgroundColor: '#0f172a', zIndex: 10, verticalAlign: 'top' }}>
// // // // // // // // // //                     <div className="fw-bold text-white">{chef.nom}</div>
// // // // // // // // // //                     {chef.specialite && (
// // // // // // // // // //                       <div className="text-muted small fw-normal text-truncate" style={{ maxWidth: '140px' }} title={chef.specialite}>
// // // // // // // // // //                         {chef.specialite}
// // // // // // // // // //                       </div>
// // // // // // // // // //                     )}
// // // // // // // // // //                     <Badge bg="secondary" className="mt-1 px-2 py-1">
// // // // // // // // // //                       {countsPerChef[chef.id] || 0} vœu(x)
// // // // // // // // // //                     </Badge>
// // // // // // // // // //                   </th>
// // // // // // // // // //                 ))}
// // // // // // // // // //               </tr>
// // // // // // // // // //             </thead>
// // // // // // // // // //             <tbody>
// // // // // // // // // //               {filteredEtudiants.length === 0 ? (
// // // // // // // // // //                 <tr>
// // // // // // // // // //                   <td colSpan={visibleChefs.length + 2} className="text-center py-5 text-muted">
// // // // // // // // // //                     Aucun étudiant trouvé.
// // // // // // // // // //                   </td>
// // // // // // // // // //                 </tr>
// // // // // // // // // //               ) : (
// // // // // // // // // //                 filteredEtudiants.map((etud) => {
// // // // // // // // // //                   const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // // // // // // //                   const studentRanks = appetenceRanksMap.get(etud.id);

// // // // // // // // // //                   return (
// // // // // // // // // //                     <tr key={etud.id}>
// // // // // // // // // //                       {/* Colonne Étudiant */}
// // // // // // // // // //                       <td style={{ textAlign: 'left', position: 'sticky', left: 0, backgroundColor: '#131c2e', zIndex: 5, paddingLeft: '1.25rem' }}>
// // // // // // // // // //                         <div className="d-flex align-items-center justify-content-between gap-2">
// // // // // // // // // //                           <div
// // // // // // // // // //                             style={{ cursor: 'pointer' }}
// // // // // // // // // //                             onClick={() => handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)}
// // // // // // // // // //                           >
// // // // // // // // // //                             <div className="fw-semibold text-info text-decoration-underline">
// // // // // // // // // //                               {etud.nom} {etud.prenom} 📊
// // // // // // // // // //                             </div>
// // // // // // // // // //                             <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // // // // // // // // //                               {etud.adresse_email}
// // // // // // // // // //                             </div>
// // // // // // // // // //                           </div>

// // // // // // // // // //                           <div className="d-flex gap-1 me-2">
// // // // // // // // // //                             {etud.cv_path && (
// // // // // // // // // //                               <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // // // // // // // // //                                 📄 CV
// // // // // // // // // //                               </a>
// // // // // // // // // //                             )}
// // // // // // // // // //                             {etud.lm_path && (
// // // // // // // // // //                               <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none">
// // // // // // // // // //                                 ✉️ LM
// // // // // // // // // //                               </a>
// // // // // // // // // //                             )}
// // // // // // // // // //                           </div>
// // // // // // // // // //                         </div>
// // // // // // // // // //                       </td>

// // // // // // // // // //                       {/* Total */}
// // // // // // // // // //                       <td style={{ backgroundColor: '#131c2e' }}>
// // // // // // // // // //                         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // // // // //                       </td>

// // // // // // // // // //                       {/* Cellules Sélection avec Rang d'Appétence */}
// // // // // // // // // //                       {visibleChefs.map((chef) => {
// // // // // // // // // //                         const key = `${etud.id}-${chef.id}`;
// // // // // // // // // //                         const isSelected = selections.has(key);
// // // // // // // // // //                         const rankInfo = studentRanks?.get(chef.id);
// // // // // // // // // //                         const rankNum = rankInfo?.rank || 1;

// // // // // // // // // //                         return (
// // // // // // // // // //                           <td key={chef.id} style={{ backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.08)' : 'transparent' }}>
// // // // // // // // // //                             {isSelected ? (
// // // // // // // // // //                               <div
// // // // // // // // // //                                 className="badge-rank-selection"
// // // // // // // // // //                                 style={getRankBadgeStyle(rankNum)}
// // // // // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // // // // //                                 title={`Cliquer pour retirer (${rankNum}e choix par appétence, note: ${rankInfo?.score ?? 0}/4)`}
// // // // // // // // // //                               >
// // // // // // // // // //                                 <span>✓</span>
// // // // // // // // // //                                 <span>{rankNum === 1 ? '1er' : `${rankNum}e`}</span>
// // // // // // // // // //                               </div>
// // // // // // // // // //                             ) : (
// // // // // // // // // //                               <Button
// // // // // // // // // //                                 variant="outline-secondary"
// // // // // // // // // //                                 size="sm"
// // // // // // // // // //                                 style={{ padding: '2px 8px', fontSize: '0.75rem', opacity: 0.4 }}
// // // // // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // // // // //                                 title={`Sélectionner (${rankNum}e choix par appétence)`}
// // // // // // // // // //                               >
// // // // // // // // // //                                 +
// // // // // // // // // //                               </Button>
// // // // // // // // // //                             )}
// // // // // // // // // //                           </td>
// // // // // // // // // //                         );
// // // // // // // // // //                       })}
// // // // // // // // // //                     </tr>
// // // // // // // // // //                   );
// // // // // // // // // //                 })
// // // // // // // // // //               )}
// // // // // // // // // //             </tbody>
// // // // // // // // // //           </Table>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* Modal Radar */}
// // // // // // // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
// // // // // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // // // // // // //         </Modal.Header>
// // // // // // // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // // // // // //           {modalLoading ? (
// // // // // // // // // //             <div className="text-center py-5"><Spinner animation="border" variant="info" /></div>
// // // // // // // // // //           ) : modalError ? (
// // // // // // // // // //             <Alert variant="warning">{modalError}</Alert>
// // // // // // // // // //           ) : (
// // // // // // // // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // // // // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // // // // // //             </div>
// // // // // // // // // //           )}
// // // // // // // // // //         </Modal.Body>
// // // // // // // // // //         <Modal.Footer>
// // // // // // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // // // // // // // //         </Modal.Footer>
// // // // // // // // // //       </Modal>
// // // // // // // // // //     </>
// // // // // // // // // //   );
// // // // // // // // // // }


// // // // // // // // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // // // // // // // import {
// // // // // // // // //   Table,
// // // // // // // // //   Button,
// // // // // // // // //   Alert,
// // // // // // // // //   Spinner,
// // // // // // // // //   Form,
// // // // // // // // //   InputGroup,
// // // // // // // // //   Badge,
// // // // // // // // //   Modal,
// // // // // // // // // } from 'react-bootstrap';
// // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // import {
// // // // // // // // //   Chart as ChartJS,
// // // // // // // // //   RadialLinearScale,
// // // // // // // // //   PointElement,
// // // // // // // // //   LineElement,
// // // // // // // // //   Filler,
// // // // // // // // //   Tooltip,
// // // // // // // // //   Legend,
// // // // // // // // // } from 'chart.js';
// // // // // // // // // import { Radar } from 'react-chartjs-2';
// // // // // // // // // import Navbar from './Navbar';
// // // // // // // // // import {
// // // // // // // // //   fetchChefsDeProjet,
// // // // // // // // //   fetchEtudiants,
// // // // // // // // //   fetchSelections,
// // // // // // // // //   saveSelection,
// // // // // // // // //   deleteSelection,
// // // // // // // // //   fetchAllApetences,
// // // // // // // // //   fetchAptitudesByEtudiant,
// // // // // // // // //   fetchApetencesByEtudiant,
// // // // // // // // //   computeChefRanksForStudent,
// // // // // // // // //   getDocumentPublicUrl,
// // // // // // // // // } from '../services/supabase';

// // // // // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // // // // // ============================================================================
// // // // // // // // // // Constantes & helpers métier (logique inchangée)
// // // // // // // // // // ============================================================================

// // // // // // // // // const COMPETENCE_KEYS = [
// // // // // // // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // // // // // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // // // // // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // // // // // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // // // // // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // // // // // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // // // // // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // // // // // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // // // // // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // // // // // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // // // // // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // // // // // // ];

// // // // // // // // // const getRankBadgeStyle = (rank) => {
// // // // // // // // //   switch (rank) {
// // // // // // // // //     case 1:
// // // // // // // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // // // // // // //     case 2:
// // // // // // // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // // // // // // //     case 3:
// // // // // // // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // // // // // // //     default:
// // // // // // // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // // // // // // //   }
// // // // // // // // // };

// // // // // // // // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // // // // // // // // Abréviation d'un chef pour l'affichage compact des en-têtes de colonne
// // // // // // // // // // (4 premières lettres du nom, plus lisible que de simples initiales)
// // // // // // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // // // // // ============================================================================
// // // // // // // // // // Hook responsive (bascule automatique vers la vue mobile)
// // // // // // // // // // ============================================================================

// // // // // // // // // function useIsMobile(breakpoint = 768) {
// // // // // // // // //   const [isMobile, setIsMobile] = useState(
// // // // // // // // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // // // // // // // //   );

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     if (typeof window === 'undefined') return undefined;
// // // // // // // // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // // // // // // // //     const handler = (e) => setIsMobile(e.matches);
// // // // // // // // //     setIsMobile(mql.matches);
// // // // // // // // //     mql.addEventListener('change', handler);
// // // // // // // // //     return () => mql.removeEventListener('change', handler);
// // // // // // // // //   }, [breakpoint]);

// // // // // // // // //   return isMobile;
// // // // // // // // // }

// // // // // // // // // // ============================================================================
// // // // // // // // // // Styles
// // // // // // // // // // ============================================================================

// // // // // // // // // const STYLE_SHEET = `
// // // // // // // // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // // // // // // // .matrix-page {
// // // // // // // // //   --bg: #0a0d12;
// // // // // // // // //   --surface: #12161f;
// // // // // // // // //   --surface-2: #1a2029;
// // // // // // // // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // // // // // // // //   --border: #232a37;
// // // // // // // // //   --text: #e9ecf1;
// // // // // // // // //   --text-muted: #8b93a5;
// // // // // // // // //   --text-faint: #5a6272;
// // // // // // // // //   --accent: #2dd4bf;
// // // // // // // // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // // // // // // // //   font-family: 'Inter', -apple-system, sans-serif;
// // // // // // // // //   background: var(--bg);
// // // // // // // // //   min-height: 100vh;
// // // // // // // // //   color: var(--text);
// // // // // // // // // }
// // // // // // // // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // // // // // // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // // // // // // // .matrix-shell {
// // // // // // // // //   max-width: 100%;
// // // // // // // // //   margin: 0 auto;
// // // // // // // // //   padding: 1.25rem 1.5rem 2rem;
// // // // // // // // // }

// // // // // // // // // /* ---------- Header ---------- */
// // // // // // // // // .matrix-header {
// // // // // // // // //   display: flex;
// // // // // // // // //   justify-content: space-between;
// // // // // // // // //   align-items: center;
// // // // // // // // //   gap: 1rem;
// // // // // // // // //   flex-wrap: wrap;
// // // // // // // // //   margin-bottom: 0.9rem;
// // // // // // // // // }
// // // // // // // // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // // // // // // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }

// // // // // // // // // .btn-pill {
// // // // // // // // //   border-radius: 999px !important;
// // // // // // // // //   font-weight: 600 !important;
// // // // // // // // //   font-size: 0.82rem !important;
// // // // // // // // //   padding: 0.45rem 1rem !important;
// // // // // // // // //   border: 1px solid var(--border) !important;
// // // // // // // // // }
// // // // // // // // // .btn-save-pill {
// // // // // // // // //   background: var(--accent) !important;
// // // // // // // // //   border: none !important;
// // // // // // // // //   color: #06201c !important;
// // // // // // // // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // // // // // // // }
// // // // // // // // // .btn-save-pill:disabled { opacity: 0.5; }
// // // // // // // // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // // // // // // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // // // // .pending-chip {
// // // // // // // // //   display: inline-flex;
// // // // // // // // //   align-items: center;
// // // // // // // // //   gap: 0.35rem;
// // // // // // // // //   background: rgba(245, 158, 11, 0.14);
// // // // // // // // //   color: #fbbf24;
// // // // // // // // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // // // // // // // //   border-radius: 999px;
// // // // // // // // //   padding: 0.3rem 0.75rem;
// // // // // // // // //   font-size: 0.78rem;
// // // // // // // // //   font-weight: 600;
// // // // // // // // // }

// // // // // // // // // /* ---------- Toolbar unique (fusion KPI + filtres) ---------- */
// // // // // // // // // .matrix-toolbar {
// // // // // // // // //   background: var(--surface);
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   border-radius: 14px;
// // // // // // // // //   padding: 0.75rem 0.9rem;
// // // // // // // // //   margin-bottom: 0.9rem;
// // // // // // // // //   display: flex;
// // // // // // // // //   align-items: center;
// // // // // // // // //   gap: 0.9rem;
// // // // // // // // //   flex-wrap: wrap;
// // // // // // // // // }
// // // // // // // // // .matrix-toolbar .form-control,
// // // // // // // // // .matrix-toolbar .form-select {
// // // // // // // // //   background: var(--surface-2);
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   color: var(--text);
// // // // // // // // //   font-size: 0.85rem;
// // // // // // // // // }
// // // // // // // // // .matrix-toolbar .form-control:focus,
// // // // // // // // // .matrix-toolbar .form-select:focus {
// // // // // // // // //   background: var(--surface-2);
// // // // // // // // //   border-color: var(--accent);
// // // // // // // // //   color: var(--text);
// // // // // // // // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // // // // // // // }
// // // // // // // // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // // // // // // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // // // // // // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // // // // // // // .stat-chip {
// // // // // // // // //   background: var(--surface-2);
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   border-radius: 999px;
// // // // // // // // //   padding: 0.32rem 0.7rem;
// // // // // // // // //   font-size: 0.76rem;
// // // // // // // // //   color: var(--text-muted);
// // // // // // // // //   white-space: nowrap;
// // // // // // // // // }
// // // // // // // // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // // // // // // // .stat-chip.accent strong { color: var(--accent); }

// // // // // // // // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // // // // // // // .segmented {
// // // // // // // // //   display: inline-flex;
// // // // // // // // //   background: var(--surface-2);
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   border-radius: 8px;
// // // // // // // // //   padding: 2px;
// // // // // // // // //   gap: 2px;
// // // // // // // // // }
// // // // // // // // // .segmented button {
// // // // // // // // //   border: none;
// // // // // // // // //   background: transparent;
// // // // // // // // //   color: var(--text-faint);
// // // // // // // // //   font-size: 0.74rem;
// // // // // // // // //   font-weight: 600;
// // // // // // // // //   padding: 0.3rem 0.55rem;
// // // // // // // // //   border-radius: 6px;
// // // // // // // // //   cursor: pointer;
// // // // // // // // //   transition: background 0.12s ease, color 0.12s ease;
// // // // // // // // // }
// // // // // // // // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // // // // // // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // // // // // // // .btn-ghost {
// // // // // // // // //   background: transparent !important;
// // // // // // // // //   border: 1px solid var(--border) !important;
// // // // // // // // //   color: var(--text-muted) !important;
// // // // // // // // //   font-size: 0.78rem !important;
// // // // // // // // //   border-radius: 8px !important;
// // // // // // // // //   padding: 0.35rem 0.65rem !important;
// // // // // // // // // }
// // // // // // // // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // // // // /* ---------- Tableau matriciel ---------- */
// // // // // // // // // .table-scroll-container {
// // // // // // // // //   width: 100%;
// // // // // // // // //   max-height: calc(100vh - 230px);
// // // // // // // // //   min-height: 420px;
// // // // // // // // //   overflow: auto;
// // // // // // // // //   border-radius: 14px;
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   background: var(--surface);
// // // // // // // // // }
// // // // // // // // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // // // // // // // .matrix-table thead th {
// // // // // // // // //   position: sticky;
// // // // // // // // //   top: 0;
// // // // // // // // //   background: #0f1420 !important;
// // // // // // // // //   z-index: 10;
// // // // // // // // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // // // // // // // //   vertical-align: middle;
// // // // // // // // // }

// // // // // // // // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // // // // // // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // // // // // // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // // // // // // // .student-cell { white-space: normal; }
// // // // // // // // // .student-cell-inner { max-width: 100%; }
// // // // // // // // // .student-cell-name {
// // // // // // // // //   display: block;
// // // // // // // // //   font-weight: 600;
// // // // // // // // //   color: var(--accent);
// // // // // // // // //   cursor: pointer;
// // // // // // // // //   text-decoration: none;
// // // // // // // // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // // // // // // // //   white-space: nowrap;
// // // // // // // // //   overflow: hidden;
// // // // // // // // //   text-overflow: ellipsis;
// // // // // // // // // }
// // // // // // // // // .student-cell-name:hover { color: #6ee7de; }
// // // // // // // // // .student-cell-email {
// // // // // // // // //   color: var(--text-faint);
// // // // // // // // //   font-size: 0.7rem;
// // // // // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // // // //   white-space: nowrap;
// // // // // // // // //   overflow: hidden;
// // // // // // // // //   text-overflow: ellipsis;
// // // // // // // // // }

// // // // // // // // // .doc-badge {
// // // // // // // // //   font-size: 0.68rem;
// // // // // // // // //   padding: 0.15rem 0.4rem;
// // // // // // // // //   border-radius: 5px;
// // // // // // // // //   background: var(--surface-2) !important;
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   color: var(--text-muted) !important;
// // // // // // // // //   text-decoration: none !important;
// // // // // // // // // }

// // // // // // // // // .chef-head-cell { text-align: center; }
// // // // // // // // // .chef-avatar {
// // // // // // // // //   min-width: 40px;
// // // // // // // // //   height: 24px;
// // // // // // // // //   padding: 0 6px;
// // // // // // // // //   border-radius: 7px;
// // // // // // // // //   background: var(--surface-2);
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   display: inline-flex;
// // // // // // // // //   align-items: center;
// // // // // // // // //   justify-content: center;
// // // // // // // // //   font-size: 0.66rem;
// // // // // // // // //   font-weight: 700;
// // // // // // // // //   letter-spacing: 0.02em;
// // // // // // // // //   color: var(--accent);
// // // // // // // // //   margin-bottom: 2px;
// // // // // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // // // // }
// // // // // // // // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // // // // // // // .chef-specialite {
// // // // // // // // //   color: var(--text-faint);
// // // // // // // // //   font-weight: 400;
// // // // // // // // //   font-size: 0.68rem;
// // // // // // // // //   max-width: 130px;
// // // // // // // // //   white-space: nowrap;
// // // // // // // // //   overflow: hidden;
// // // // // // // // //   text-overflow: ellipsis;
// // // // // // // // //   margin: 0 auto;
// // // // // // // // // }
// // // // // // // // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // // // // // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // // // // // // .badge-rank-selection {
// // // // // // // // //   display: inline-flex;
// // // // // // // // //   align-items: center;
// // // // // // // // //   gap: 5px;
// // // // // // // // //   padding: 3px 9px;
// // // // // // // // //   border-radius: 7px;
// // // // // // // // //   font-weight: 700;
// // // // // // // // //   font-size: 0.74rem;
// // // // // // // // //   pointer-events: none;
// // // // // // // // // }
// // // // // // // // // .sel-cell-empty {
// // // // // // // // //   display: inline-flex;
// // // // // // // // //   width: 26px;
// // // // // // // // //   height: 22px;
// // // // // // // // //   align-items: center;
// // // // // // // // //   justify-content: center;
// // // // // // // // //   border-radius: 7px;
// // // // // // // // //   border: 1px dashed var(--border);
// // // // // // // // //   color: var(--text-faint);
// // // // // // // // //   font-size: 0.85rem;
// // // // // // // // //   opacity: 0.6;
// // // // // // // // //   transition: opacity 0.12s ease, border-color 0.12s ease;
// // // // // // // // // }
// // // // // // // // // .sel-cell:hover .sel-cell-empty { opacity: 1; border-color: var(--accent); color: var(--accent); }

// // // // // // // // // /* ---------- Vue mobile (accordéon) ---------- */
// // // // // // // // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // // // // // // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // // // // // // // .mobile-card-head {
// // // // // // // // //   display: flex;
// // // // // // // // //   align-items: center;
// // // // // // // // //   gap: 0.7rem;
// // // // // // // // //   padding: 0.75rem 0.85rem;
// // // // // // // // //   cursor: pointer;
// // // // // // // // // }
// // // // // // // // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // // // // // // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // // // // // // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // // // // // // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // // // // // // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // // // // // // // .mobile-chef-chip {
// // // // // // // // //   display: inline-flex;
// // // // // // // // //   align-items: center;
// // // // // // // // //   gap: 0.35rem;
// // // // // // // // //   padding: 0.35rem 0.6rem;
// // // // // // // // //   border-radius: 999px;
// // // // // // // // //   font-size: 0.76rem;
// // // // // // // // //   font-weight: 600;
// // // // // // // // //   cursor: pointer;
// // // // // // // // //   border: 1px solid var(--border);
// // // // // // // // //   background: var(--surface-2);
// // // // // // // // //   color: var(--text-muted);
// // // // // // // // // }

// // // // // // // // // .empty-state {
// // // // // // // // //   text-align: center;
// // // // // // // // //   padding: 3rem 1rem;
// // // // // // // // //   color: var(--text-muted);
// // // // // // // // // }

// // // // // // // // // /* ---------- Modal radar ---------- */
// // // // // // // // // .modal-dark .modal-content { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
// // // // // // // // // .modal-dark .modal-header { border-bottom: 1px solid var(--border); }
// // // // // // // // // .modal-dark .modal-footer { border-top: 1px solid var(--border); }
// // // // // // // // // .modal-dark .modal-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; }

// // // // // // // // // @media (max-width: 767px) {
// // // // // // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // // // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // // // // // //   .bulk-actions { margin-left: 0; }
// // // // // // // // // }
// // // // // // // // // `;

// // // // // // // // // // ============================================================================
// // // // // // // // // // Sous-composants de présentation
// // // // // // // // // // ============================================================================

// // // // // // // // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // // // // // // // //   return (
// // // // // // // // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // // // // // // // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // // // // // // // //       {showFullNames && (
// // // // // // // // //         <>
// // // // // // // // //           <div className="chef-fullname">{chef.nom}</div>
// // // // // // // // //           {chef.specialite && (
// // // // // // // // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // // // // // // // //           )}
// // // // // // // // //         </>
// // // // // // // // //       )}
// // // // // // // // //       <div>
// // // // // // // // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // // // // // // // //       </div>
// // // // // // // // //     </th>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // // // // // // // //   return (
// // // // // // // // //     <td className="sel-cell" onClick={onClick}>
// // // // // // // // //       {selected ? (
// // // // // // // // //         <span
// // // // // // // // //           className="badge-rank-selection"
// // // // // // // // //           style={getRankBadgeStyle(rankNum)}
// // // // // // // // //           title={`Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`}
// // // // // // // // //         >
// // // // // // // // //           ✓ {rankLabel(rankNum)}
// // // // // // // // //         </span>
// // // // // // // // //       ) : (
// // // // // // // // //         <span className="sel-cell-empty" title={`Sélectionner (${rankLabel(rankNum)} choix par appétence)`}>+</span>
// // // // // // // // //       )}
// // // // // // // // //     </td>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // // // // // // // //   return (
// // // // // // // // //     <div className="mobile-card">
// // // // // // // // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // // // // // // // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // // // // // // // //         <div style={{ flex: 1, minWidth: 0 }}>
// // // // // // // // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // // // // // // // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // // // // // // // //         </div>
// // // // // // // // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // // // //       </div>
// // // // // // // // //       {expanded && (
// // // // // // // // //         <div className="mobile-card-body">
// // // // // // // // //           <Button
// // // // // // // // //             size="sm"
// // // // // // // // //             className="btn-ghost"
// // // // // // // // //             onClick={(e) => {
// // // // // // // // //               e.stopPropagation();
// // // // // // // // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // // // // // // // //             }}
// // // // // // // // //           >
// // // // // // // // //             📊 Profil compétences
// // // // // // // // //           </Button>
// // // // // // // // //           {chefs.map((chef) => {
// // // // // // // // //             const key = `${etud.id}-${chef.id}`;
// // // // // // // // //             const isSelected = selections.has(key);
// // // // // // // // //             const rankInfo = studentRanks?.get(chef.id);
// // // // // // // // //             const rankNum = rankInfo?.rank || 1;
// // // // // // // // //             return (
// // // // // // // // //               <span
// // // // // // // // //                 key={chef.id}
// // // // // // // // //                 className="mobile-chef-chip"
// // // // // // // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // // // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // // // // // // //               >
// // // // // // // // //                 {isSelected ? `✓ ${chef.nom} · ${rankLabel(rankNum)}` : chef.nom}
// // // // // // // // //               </span>
// // // // // // // // //             );
// // // // // // // // //           })}
// // // // // // // // //         </div>
// // // // // // // // //       )}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // // ============================================================================
// // // // // // // // // // Composant principal
// // // // // // // // // // ============================================================================

// // // // // // // // // export default function SelectionPage() {
// // // // // // // // //   const [chefs, setChefs] = useState([]);
// // // // // // // // //   const [etudiants, setEtudiants] = useState([]);
// // // // // // // // //   const [apetencesList, setApetencesList] = useState([]);

// // // // // // // // //   // Set de "etudiantId-chefId"
// // // // // // // // //   const [selections, setSelections] = useState(new Set());
// // // // // // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // // // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // // // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // // //   const [error, setError] = useState(null);
// // // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // // //   // Réglages d'affichage (purement UI, n'affectent aucune donnée)
// // // // // // // // //   const [density, setDensity] = useState('compact'); // 'compact' | 'comfortable'
// // // // // // // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // // // // // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // // // // // // // //   // Modal Radar
// // // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // // // // //   const [modalError, setModalError] = useState(null);

// // // // // // // // //   const isMobile = useIsMobile(768);

// // // // // // // // //   const loadData = async () => {
// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       setError(null);

// // // // // // // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // // // // // // //         fetchChefsDeProjet(),
// // // // // // // // //         fetchEtudiants(),
// // // // // // // // //         fetchSelections(),
// // // // // // // // //         fetchAllApetences(),
// // // // // // // // //       ]);

// // // // // // // // //       setChefs(chefsData || []);
// // // // // // // // //       setEtudiants(etudiantsData || []);
// // // // // // // // //       setApetencesList(apetencesDataRaw || []);

// // // // // // // // //       const activeSet = new Set();
// // // // // // // // //       (selectionsData || []).forEach((s) => {
// // // // // // // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // // // // // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // // // // // // //         }
// // // // // // // // //       });

// // // // // // // // //       setSelections(new Set(activeSet));
// // // // // // // // //       setInitialSelections(new Set(activeSet));
// // // // // // // // //     } catch (err) {
// // // // // // // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     loadData();
// // // // // // // // //   }, []);

// // // // // // // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // // // // // // //   const appetenceRanksMap = useMemo(() => {
// // // // // // // // //     const map = new Map();
// // // // // // // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // // // // // // //     etudiants.forEach((etud) => {
// // // // // // // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // // // // // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // // // // // // //       map.set(etud.id, ranks);
// // // // // // // // //     });

// // // // // // // // //     return map;
// // // // // // // // //   }, [apetencesList, etudiants, chefs]);

// // // // // // // // //   const hasChanges = useMemo(() => {
// // // // // // // // //     if (selections.size !== initialSelections.size) return true;
// // // // // // // // //     for (const key of selections) {
// // // // // // // // //       if (!initialSelections.has(key)) return true;
// // // // // // // // //     }
// // // // // // // // //     return false;
// // // // // // // // //   }, [selections, initialSelections]);

// // // // // // // // //   const filteredEtudiants = useMemo(() => {
// // // // // // // // //     const term = searchStudent.toLowerCase().trim();
// // // // // // // // //     if (!term) return etudiants;
// // // // // // // // //     return etudiants.filter(
// // // // // // // // //       (e) =>
// // // // // // // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // // // // // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // // // // // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // // // // // // //     );
// // // // // // // // //   }, [etudiants, searchStudent]);

// // // // // // // // //   const visibleChefs = useMemo(() => {
// // // // // // // // //     if (selectedChefFilter === 'all') return chefs;
// // // // // // // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // // // // // // //   }, [chefs, selectedChefFilter]);

// // // // // // // // //   const countsPerStudent = useMemo(() => {
// // // // // // // // //     const map = {};
// // // // // // // // //     for (const key of selections) {
// // // // // // // // //       const [etudId] = key.split('-');
// // // // // // // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // // // // // // //     }
// // // // // // // // //     return map;
// // // // // // // // //   }, [selections]);

// // // // // // // // //   const countsPerChef = useMemo(() => {
// // // // // // // // //     const map = {};
// // // // // // // // //     for (const key of selections) {
// // // // // // // // //       const [, chefId] = key.split('-');
// // // // // // // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // // // // // // //     }
// // // // // // // // //     return map;
// // // // // // // // //   }, [selections]);

// // // // // // // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // // // // // // //     const key = `${etudiantId}-${chefId}`;
// // // // // // // // //     setSelections((prev) => {
// // // // // // // // //       const next = new Set(prev);
// // // // // // // // //       if (next.has(key)) next.delete(key);
// // // // // // // // //       else next.add(key);
// // // // // // // // //       return next;
// // // // // // // // //     });
// // // // // // // // //     setSuccessMsg(null);
// // // // // // // // //   }, []);

// // // // // // // // //   const handleSelectAllVisible = () => {
// // // // // // // // //     setSelections((prev) => {
// // // // // // // // //       const next = new Set(prev);
// // // // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // // // // // // //       });
// // // // // // // // //       return next;
// // // // // // // // //     });
// // // // // // // // //     setSuccessMsg(null);
// // // // // // // // //   };

// // // // // // // // //   const handleDeselectAllVisible = () => {
// // // // // // // // //     setSelections((prev) => {
// // // // // // // // //       const next = new Set(prev);
// // // // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // // // // // // //       });
// // // // // // // // //       return next;
// // // // // // // // //     });
// // // // // // // // //     setSuccessMsg(null);
// // // // // // // // //   };

// // // // // // // // //   const handleSubmit = async () => {
// // // // // // // // //     try {
// // // // // // // // //       setSaving(true);
// // // // // // // // //       setError(null);
// // // // // // // // //       setSuccessMsg(null);

// // // // // // // // //       const toAdd = [];
// // // // // // // // //       selections.forEach((key) => {
// // // // // // // // //         if (!initialSelections.has(key)) {
// // // // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // // // //           toAdd.push({ etudiantId, chefId });
// // // // // // // // //         }
// // // // // // // // //       });

// // // // // // // // //       const toDelete = [];
// // // // // // // // //       initialSelections.forEach((key) => {
// // // // // // // // //         if (!selections.has(key)) {
// // // // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // // // //           toDelete.push({ etudiantId, chefId });
// // // // // // // // //         }
// // // // // // // // //       });

// // // // // // // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // // // // // // //         deleteSelection(etudiantId, chefId)
// // // // // // // // //       );
// // // // // // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // // // // // // //         saveSelection(etudiantId, chefId)
// // // // // // // // //       );

// // // // // // // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // // // // // // //       setInitialSelections(new Set(selections));
// // // // // // // // //       setSuccessMsg(
// // // // // // // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // // // // // // //       );
// // // // // // // // //     } catch (err) {
// // // // // // // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // // // // // // //     } finally {
// // // // // // // // //       setSaving(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Export Excel
// // // // // // // // //   const handleDownloadSelectionXLSX = () => {
// // // // // // // // //     try {
// // // // // // // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // // // // // // //         alert('Aucune donnée disponible.');
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // // // // // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // // // // // // //       );

// // // // // // // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // // // // // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // // // // // // //         const row = {
// // // // // // // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // // // // // // //           'Email': etud.adresse_email || '',
// // // // // // // // //           'Parcours': etud.parcours || 'I2026',
// // // // // // // // //         };

// // // // // // // // //         chefs.forEach((chef) => {
// // // // // // // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // // // // // // //           const rankInfo = studentRanks?.get(chef.id);
// // // // // // // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // // // // // // //         });

// // // // // // // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // // // // // // //         return row;
// // // // // // // // //       });

// // // // // // // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // // // // // // //       wsSelections['!cols'] = [
// // // // // // // // //         { wch: 26 },
// // // // // // // // //         { wch: 32 },
// // // // // // // // //         { wch: 12 },
// // // // // // // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // // // // // // //         { wch: 16 },
// // // // // // // // //       ];

// // // // // // // // //       const statsRows = chefs.map((chef) => ({
// // // // // // // // //         'Chef de Projet': chef.nom,
// // // // // // // // //         'Spécialité': chef.specialite || 'N/A',
// // // // // // // // //         'Email': chef.email || '',
// // // // // // // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // // // // // // //       }));

// // // // // // // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // // // // // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // // // // // // //       const workbook = XLSX.utils.book_new();
// // // // // // // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // // // // // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // // // // // // //       const today = new Date().toISOString().slice(0, 10);
// // // // // // // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       alert(`Erreur export: ${err.message}`);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Popup Radar
// // // // // // // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // // // // // // //     if (!etudiantId) return;
// // // // // // // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // // // // // // //     setModalOpen(true);
// // // // // // // // //     setModalLoading(true);
// // // // // // // // //     setModalError(null);
// // // // // // // // //     setAptitudesData(null);
// // // // // // // // //     setApetencesData(null);

// // // // // // // // //     try {
// // // // // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // // // // //         fetchAptitudesByEtudiant(etudiantId),
// // // // // // // // //         fetchApetencesByEtudiant(etudiantId),
// // // // // // // // //       ]);

// // // // // // // // //       if (!aptitudes && !apetences) {
// // // // // // // // //         setModalError('Aucune compétence ni appétence enregistrée.');
// // // // // // // // //       } else {
// // // // // // // // //         setAptitudesData(aptitudes);
// // // // // // // // //         setApetencesData(apetences);
// // // // // // // // //       }
// // // // // // // // //     } catch (err) {
// // // // // // // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // // // // // // //     } finally {
// // // // // // // // //       setModalLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const radarChartData = useMemo(() => {
// // // // // // // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // // // // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // // // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // // // // // // //     return {
// // // // // // // // //       labels,
// // // // // // // // //       datasets: [
// // // // // // // // //         {
// // // // // // // // //           label: 'Aptitudes (Technique)',
// // // // // // // // //           data: aptValues,
// // // // // // // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // // // // // // //           borderColor: '#38bdf8',
// // // // // // // // //           borderWidth: 2,
// // // // // // // // //           pointBackgroundColor: '#38bdf8',
// // // // // // // // //         },
// // // // // // // // //         {
// // // // // // // // //           label: 'Appétences (Intérêt)',
// // // // // // // // //           data: apeValues,
// // // // // // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // // // // // //           borderColor: '#f43f5e',
// // // // // // // // //           borderWidth: 2,
// // // // // // // // //           pointBackgroundColor: '#f43f5e',
// // // // // // // // //         },
// // // // // // // // //       ],
// // // // // // // // //     };
// // // // // // // // //   }, [aptitudesData, apetencesData]);

// // // // // // // // //   const radarOptions = {
// // // // // // // // //     responsive: true,
// // // // // // // // //     maintainAspectRatio: false,
// // // // // // // // //     scales: {
// // // // // // // // //       r: {
// // // // // // // // //         min: 0,
// // // // // // // // //         suggestedMax: 4,
// // // // // // // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // // // // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // // // // // //       },
// // // // // // // // //     },
// // // // // // // // //     plugins: {
// // // // // // // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // // // // // // //     },
// // // // // // // // //   };

// // // // // // // // //   const toggleMobileExpand = (id) => {
// // // // // // // // //     setExpandedMobileIds((prev) => {
// // // // // // // // //       const next = new Set(prev);
// // // // // // // // //       if (next.has(id)) next.delete(id);
// // // // // // // // //       else next.add(id);
// // // // // // // // //       return next;
// // // // // // // // //     });
// // // // // // // // //   };

// // // // // // // // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // // // // // // // //   if (loading) {
// // // // // // // // //     return (
// // // // // // // // //       <>
// // // // // // // // //         <Navbar />
// // // // // // // // //         <style>{STYLE_SHEET}</style>
// // // // // // // // //         <div className="matrix-page">
// // // // // // // // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // // // // // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // // // // // // // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // // // // // // // //               Chargement de la matrice des sélections...
// // // // // // // // //             </p>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <>
// // // // // // // // //       <Navbar />
// // // // // // // // //       <style>{STYLE_SHEET}</style>

// // // // // // // // //       <div className="matrix-page">
// // // // // // // // //         <div className="matrix-shell">
// // // // // // // // //           {/* Header */}
// // // // // // // // //           <div className="matrix-header">
// // // // // // // // //             <div>
// // // // // // // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // // // // // // // //               <p className="matrix-subtitle">
// // // // // // // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant.
// // // // // // // // //               </p>
// // // // // // // // //             </div>

// // // // // // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
// // // // // // // // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // // // // // // // //                 📊 Exporter (.xlsx)
// // // // // // // // //               </Button>
// // // // // // // // //               <Button
// // // // // // // // //                 className="btn-pill btn-save-pill"
// // // // // // // // //                 onClick={handleSubmit}
// // // // // // // // //                 disabled={saving || !hasChanges}
// // // // // // // // //               >
// // // // // // // // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // // // // // // // //               </Button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>

// // // // // // // // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // // //           {/* Toolbar unique : recherche, filtre, stats, réglages, actions groupées */}
// // // // // // // // //           <div className="matrix-toolbar">
// // // // // // // // //             <InputGroup size="sm" className="toolbar-search">
// // // // // // // // //               <Form.Control
// // // // // // // // //                 placeholder="🔍 Rechercher un étudiant..."
// // // // // // // // //                 value={searchStudent}
// // // // // // // // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // // // // // // // //               />
// // // // // // // // //               {searchStudent && (
// // // // // // // // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // // // // // // // //               )}
// // // // // // // // //             </InputGroup>

// // // // // // // // //             <Form.Select
// // // // // // // // //               size="sm"
// // // // // // // // //               className="toolbar-select"
// // // // // // // // //               value={selectedChefFilter}
// // // // // // // // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // // // // // //             >
// // // // // // // // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // // // // // // // //               {chefs.map((c) => (
// // // // // // // // //                 <option key={c.id} value={c.id}>
// // // // // // // // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // // // // // //                 </option>
// // // // // // // // //               ))}
// // // // // // // // //             </Form.Select>

// // // // // // // // //             <div className="toolbar-divider" />

// // // // // // // // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // // // // // // // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // // // // // // // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // // // // // // // //             {!isMobile && (
// // // // // // // // //               <>
// // // // // // // // //                 <div className="toolbar-divider" />
// // // // // // // // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // // // // // // // //                   <button
// // // // // // // // //                     type="button"
// // // // // // // // //                     className={density === 'compact' ? 'active' : ''}
// // // // // // // // //                     onClick={() => setDensity('compact')}
// // // // // // // // //                   >
// // // // // // // // //                     Compact
// // // // // // // // //                   </button>
// // // // // // // // //                   <button
// // // // // // // // //                     type="button"
// // // // // // // // //                     className={density === 'comfortable' ? 'active' : ''}
// // // // // // // // //                     onClick={() => setDensity('comfortable')}
// // // // // // // // //                   >
// // // // // // // // //                     Confortable
// // // // // // // // //                   </button>
// // // // // // // // //                 </div>
// // // // // // // // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // // // // // // // //                   <button
// // // // // // // // //                     type="button"
// // // // // // // // //                     className={!showFullNames ? 'active' : ''}
// // // // // // // // //                     onClick={() => setShowFullNames(false)}
// // // // // // // // //                   >
// // // // // // // // //                     Initiales
// // // // // // // // //                   </button>
// // // // // // // // //                   <button
// // // // // // // // //                     type="button"
// // // // // // // // //                     className={showFullNames ? 'active' : ''}
// // // // // // // // //                     onClick={() => setShowFullNames(true)}
// // // // // // // // //                   >
// // // // // // // // //                     Noms complets
// // // // // // // // //                   </button>
// // // // // // // // //                 </div>
// // // // // // // // //               </>
// // // // // // // // //             )}

// // // // // // // // //             <div className="bulk-actions">
// // // // // // // // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // // // // // // // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>

// // // // // // // // //           {/* Vue mobile : accordéons */}
// // // // // // // // //           {isMobile ? (
// // // // // // // // //             filteredEtudiants.length === 0 ? (
// // // // // // // // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // // // // // // // //             ) : (
// // // // // // // // //               <div className="mobile-list">
// // // // // // // // //                 {filteredEtudiants.map((etud) => (
// // // // // // // // //                   <MobileStudentCard
// // // // // // // // //                     key={etud.id}
// // // // // // // // //                     etud={etud}
// // // // // // // // //                     chefs={visibleChefs}
// // // // // // // // //                     selections={selections}
// // // // // // // // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // // // // // // // //                     expanded={expandedMobileIds.has(etud.id)}
// // // // // // // // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // // // // // // // //                     onToggleSelection={toggleSelection}
// // // // // // // // //                     onOpenRadar={handleOpenStudentRadar}
// // // // // // // // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // // // // // // // //                   />
// // // // // // // // //                 ))}
// // // // // // // // //               </div>
// // // // // // // // //             )
// // // // // // // // //           ) : (
// // // // // // // // //             /* Vue desktop : tableau matriciel */
// // // // // // // // //             <div className="table-scroll-container">
// // // // // // // // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // // // // // // // //                 <thead>
// // // // // // // // //                   <tr>
// // // // // // // // //                     <th
// // // // // // // // //                       style={{
// // // // // // // // //                         minWidth: density === 'compact' ? 148 : 190,
// // // // // // // // //                         maxWidth: density === 'compact' ? 148 : 190,
// // // // // // // // //                         textAlign: 'left',
// // // // // // // // //                         position: 'sticky',
// // // // // // // // //                         left: 0,
// // // // // // // // //                         top: 0,
// // // // // // // // //                         backgroundColor: '#0f1420',
// // // // // // // // //                         zIndex: 20,
// // // // // // // // //                         paddingLeft: '0.65rem',
// // // // // // // // //                       }}
// // // // // // // // //                     >
// // // // // // // // //                       Étudiant ({filteredEtudiants.length})
// // // // // // // // //                     </th>
// // // // // // // // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // // // // // // // //                       Total
// // // // // // // // //                     </th>
// // // // // // // // //                     {visibleChefs.map((chef) => (
// // // // // // // // //                       <ChefHeaderCell
// // // // // // // // //                         key={chef.id}
// // // // // // // // //                         chef={chef}
// // // // // // // // //                         count={countsPerChef[chef.id]}
// // // // // // // // //                         showFullNames={showFullNames}
// // // // // // // // //                       />
// // // // // // // // //                     ))}
// // // // // // // // //                   </tr>
// // // // // // // // //                 </thead>
// // // // // // // // //                 <tbody>
// // // // // // // // //                   {filteredEtudiants.length === 0 ? (
// // // // // // // // //                     <tr>
// // // // // // // // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // // // // // // // //                         Aucun étudiant trouvé.
// // // // // // // // //                       </td>
// // // // // // // // //                     </tr>
// // // // // // // // //                   ) : (
// // // // // // // // //                     filteredEtudiants.map((etud) => {
// // // // // // // // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // // // // // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // // // // // // // //                       return (
// // // // // // // // //                         <tr key={etud.id}>
// // // // // // // // //                           <td
// // // // // // // // //                             className="student-cell"
// // // // // // // // //                             style={{
// // // // // // // // //                               textAlign: 'left',
// // // // // // // // //                               position: 'sticky',
// // // // // // // // //                               left: 0,
// // // // // // // // //                               backgroundColor: '#131c2e',
// // // // // // // // //                               zIndex: 5,
// // // // // // // // //                               paddingLeft: '0.65rem',
// // // // // // // // //                               maxWidth: density === 'compact' ? 148 : 190,
// // // // // // // // //                             }}
// // // // // // // // //                           >
// // // // // // // // //                             <div className="student-cell-inner">
// // // // // // // // //                               <span
// // // // // // // // //                                 className="student-cell-name"
// // // // // // // // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // // // // // // // //                                 onClick={() =>
// // // // // // // // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // // // // // // // //                                 }
// // // // // // // // //                               >
// // // // // // // // //                                 {etud.nom} {etud.prenom}
// // // // // // // // //                               </span>
// // // // // // // // //                               {density === 'comfortable' && (
// // // // // // // // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // // // // // // // //                                   {etud.adresse_email}
// // // // // // // // //                                 </div>
// // // // // // // // //                               )}
// // // // // // // // //                               {(etud.cv_path || etud.lm_path) && (
// // // // // // // // //                                 <div className="d-flex gap-1 mt-1">
// // // // // // // // //                                   {etud.cv_path && (
// // // // // // // // //                                     <a
// // // // // // // // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // // // // // // // //                                       target="_blank"
// // // // // // // // //                                       rel="noopener noreferrer"
// // // // // // // // //                                       className="doc-badge badge"
// // // // // // // // //                                       title="CV"
// // // // // // // // //                                     >
// // // // // // // // //                                       📄
// // // // // // // // //                                     </a>
// // // // // // // // //                                   )}
// // // // // // // // //                                   {etud.lm_path && (
// // // // // // // // //                                     <a
// // // // // // // // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // // // // // // // //                                       target="_blank"
// // // // // // // // //                                       rel="noopener noreferrer"
// // // // // // // // //                                       className="doc-badge badge"
// // // // // // // // //                                       title="Lettre de motivation"
// // // // // // // // //                                     >
// // // // // // // // //                                       ✉️
// // // // // // // // //                                     </a>
// // // // // // // // //                                   )}
// // // // // // // // //                                 </div>
// // // // // // // // //                               )}
// // // // // // // // //                             </div>
// // // // // // // // //                           </td>

// // // // // // // // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // // // // // // // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // // // //                           </td>

// // // // // // // // //                           {visibleChefs.map((chef) => {
// // // // // // // // //                             const key = `${etud.id}-${chef.id}`;
// // // // // // // // //                             const isSelected = selections.has(key);
// // // // // // // // //                             const rankInfo = studentRanks?.get(chef.id);
// // // // // // // // //                             const rankNum = rankInfo?.rank || 1;

// // // // // // // // //                             return (
// // // // // // // // //                               <SelectionCell
// // // // // // // // //                                 key={chef.id}
// // // // // // // // //                                 selected={isSelected}
// // // // // // // // //                                 rankNum={rankNum}
// // // // // // // // //                                 rankInfo={rankInfo}
// // // // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // // // //                               />
// // // // // // // // //                             );
// // // // // // // // //                           })}
// // // // // // // // //                         </tr>
// // // // // // // // //                       );
// // // // // // // // //                     })
// // // // // // // // //                   )}
// // // // // // // // //                 </tbody>
// // // // // // // // //               </Table>
// // // // // // // // //             </div>
// // // // // // // // //           )}
// // // // // // // // //         </div>
// // // // // // // // //       </div>

// // // // // // // // //       {/* Modal Radar */}
// // // // // // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
// // // // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // // // // // //         </Modal.Header>
// // // // // // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // // // // //           {modalLoading ? (
// // // // // // // // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// // // // // // // // //           ) : modalError ? (
// // // // // // // // //             <Alert variant="warning">{modalError}</Alert>
// // // // // // // // //           ) : (
// // // // // // // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // // // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // // // // //             </div>
// // // // // // // // //           )}
// // // // // // // // //         </Modal.Body>
// // // // // // // // //         <Modal.Footer>
// // // // // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // // // // // // //         </Modal.Footer>
// // // // // // // // //       </Modal>
// // // // // // // // //     </>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // // // // // // import {
// // // // // // // //   Table,
// // // // // // // //   Button,
// // // // // // // //   Alert,
// // // // // // // //   Spinner,
// // // // // // // //   Form,
// // // // // // // //   InputGroup,
// // // // // // // //   Badge,
// // // // // // // //   Modal,
// // // // // // // // } from 'react-bootstrap';
// // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // import {
// // // // // // // //   Chart as ChartJS,
// // // // // // // //   RadialLinearScale,
// // // // // // // //   PointElement,
// // // // // // // //   LineElement,
// // // // // // // //   Filler,
// // // // // // // //   Tooltip,
// // // // // // // //   Legend,
// // // // // // // // } from 'chart.js';
// // // // // // // // import { Radar } from 'react-chartjs-2';
// // // // // // // // import Navbar from './Navbar';
// // // // // // // // import {
// // // // // // // //   fetchChefsDeProjet,
// // // // // // // //   fetchEtudiants,
// // // // // // // //   fetchSelections,
// // // // // // // //   saveSelection,
// // // // // // // //   deleteSelection,
// // // // // // // //   fetchAllApetences,
// // // // // // // //   fetchAptitudesByEtudiant,
// // // // // // // //   fetchApetencesByEtudiant,
// // // // // // // //   computeChefRanksForStudent,
// // // // // // // //   getDocumentPublicUrl,
// // // // // // // // } from '../services/supabase';

// // // // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // // // // ============================================================================
// // // // // // // // // Constantes & helpers métier (logique inchangée)
// // // // // // // // // ============================================================================

// // // // // // // // const COMPETENCE_KEYS = [
// // // // // // // //   { key: 'calculs_simulation_numerique', label: 'Calculs & Simulation' },
// // // // // // // //   { key: 'essais_caracterisation', label: 'Essais & Caractérisation' },
// // // // // // // //   { key: 'fabrication_prototypage', label: 'Fabrication & Proto' },
// // // // // // // //   { key: 'conception_mecanique', label: 'Conception Méca' },
// // // // // // // //   { key: 'automatique_automatisme', label: 'Automatique' },
// // // // // // // //   { key: 'iot_systeme_embarque', label: 'IOT & Embarqué' },
// // // // // // // //   { key: 'robot_cobot', label: 'Robot & Cobot' },
// // // // // // // //   { key: 'vision', label: 'Vision Industrielle' },
// // // // // // // //   { key: 'ia', label: 'Intelligence Artificielle' },
// // // // // // // //   { key: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile' },
// // // // // // // //   { key: 'ethique_ergonomie', label: 'Éthique & Ergonomie' },
// // // // // // // // ];

// // // // // // // // const getRankBadgeStyle = (rank) => {
// // // // // // // //   switch (rank) {
// // // // // // // //     case 1:
// // // // // // // //       return { background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: '1px solid #34d399' };
// // // // // // // //     case 2:
// // // // // // // //       return { background: 'linear-gradient(135deg, #06b6d4, #0284c7)', color: '#fff', border: '1px solid #38bdf8' };
// // // // // // // //     case 3:
// // // // // // // //       return { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid #fbbf24' };
// // // // // // // //     default:
// // // // // // // //       return { background: 'linear-gradient(135deg, #64748b, #475569)', color: '#fff', border: '1px solid #94a3b8' };
// // // // // // // //   }
// // // // // // // // };

// // // // // // // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // // // // // // // Abréviation d'un chef pour l'affichage compact des en-têtes de colonne
// // // // // // // // // (4 premières lettres du nom, plus lisible que de simples initiales)
// // // // // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // // // // ============================================================================
// // // // // // // // // Hook responsive (bascule automatique vers la vue mobile)
// // // // // // // // // ============================================================================

// // // // // // // // function useIsMobile(breakpoint = 768) {
// // // // // // // //   const [isMobile, setIsMobile] = useState(
// // // // // // // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // // // // // // //   );

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (typeof window === 'undefined') return undefined;
// // // // // // // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // // // // // // //     const handler = (e) => setIsMobile(e.matches);
// // // // // // // //     setIsMobile(mql.matches);
// // // // // // // //     mql.addEventListener('change', handler);
// // // // // // // //     return () => mql.removeEventListener('change', handler);
// // // // // // // //   }, [breakpoint]);

// // // // // // // //   return isMobile;
// // // // // // // // }

// // // // // // // // // ============================================================================
// // // // // // // // // Styles
// // // // // // // // // ============================================================================

// // // // // // // // const STYLE_SHEET = `
// // // // // // // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // // // // // // .matrix-page {
// // // // // // // //   --bg: #0a0d12;
// // // // // // // //   --surface: #12161f;
// // // // // // // //   --surface-2: #1a2029;
// // // // // // // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // // // // // // //   --border: #232a37;
// // // // // // // //   --text: #e9ecf1;
// // // // // // // //   --text-muted: #8b93a5;
// // // // // // // //   --text-faint: #5a6272;
// // // // // // // //   --accent: #2dd4bf;
// // // // // // // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // // // // // // //   font-family: 'Inter', -apple-system, sans-serif;
// // // // // // // //   background: var(--bg);
// // // // // // // //   min-height: 100vh;
// // // // // // // //   color: var(--text);
// // // // // // // // }
// // // // // // // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // // // // // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // // // // // // .matrix-shell {
// // // // // // // //   max-width: 100%;
// // // // // // // //   margin: 0 auto;
// // // // // // // //   padding: 1.25rem 1.5rem 2rem;
// // // // // // // // }

// // // // // // // // /* ---------- Header ---------- */
// // // // // // // // .matrix-header {
// // // // // // // //   display: flex;
// // // // // // // //   justify-content: space-between;
// // // // // // // //   align-items: center;
// // // // // // // //   gap: 1rem;
// // // // // // // //   flex-wrap: wrap;
// // // // // // // //   margin-bottom: 0.9rem;
// // // // // // // // }
// // // // // // // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // // // // // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }

// // // // // // // // .btn-pill {
// // // // // // // //   border-radius: 999px !important;
// // // // // // // //   font-weight: 600 !important;
// // // // // // // //   font-size: 0.82rem !important;
// // // // // // // //   padding: 0.45rem 1rem !important;
// // // // // // // //   border: 1px solid var(--border) !important;
// // // // // // // // }
// // // // // // // // .btn-save-pill {
// // // // // // // //   background: var(--accent) !important;
// // // // // // // //   border: none !important;
// // // // // // // //   color: #06201c !important;
// // // // // // // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // // // // // // }
// // // // // // // // .btn-save-pill:disabled { opacity: 0.5; }
// // // // // // // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // // // // // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // // // .pending-chip {
// // // // // // // //   display: inline-flex;
// // // // // // // //   align-items: center;
// // // // // // // //   gap: 0.35rem;
// // // // // // // //   background: rgba(245, 158, 11, 0.14);
// // // // // // // //   color: #fbbf24;
// // // // // // // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // // // // // // //   border-radius: 999px;
// // // // // // // //   padding: 0.3rem 0.75rem;
// // // // // // // //   font-size: 0.78rem;
// // // // // // // //   font-weight: 600;
// // // // // // // // }

// // // // // // // // /* ---------- Toolbar unique (fusion KPI + filtres) ---------- */
// // // // // // // // .matrix-toolbar {
// // // // // // // //   background: var(--surface);
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   border-radius: 14px;
// // // // // // // //   padding: 0.75rem 0.9rem;
// // // // // // // //   margin-bottom: 0.9rem;
// // // // // // // //   display: flex;
// // // // // // // //   align-items: center;
// // // // // // // //   gap: 0.9rem;
// // // // // // // //   flex-wrap: wrap;
// // // // // // // // }
// // // // // // // // .matrix-toolbar .form-control,
// // // // // // // // .matrix-toolbar .form-select {
// // // // // // // //   background: var(--surface-2);
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   color: var(--text);
// // // // // // // //   font-size: 0.85rem;
// // // // // // // // }
// // // // // // // // .matrix-toolbar .form-control:focus,
// // // // // // // // .matrix-toolbar .form-select:focus {
// // // // // // // //   background: var(--surface-2);
// // // // // // // //   border-color: var(--accent);
// // // // // // // //   color: var(--text);
// // // // // // // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // // // // // // }
// // // // // // // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // // // // // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // // // // // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // // // // // // .stat-chip {
// // // // // // // //   background: var(--surface-2);
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   border-radius: 999px;
// // // // // // // //   padding: 0.32rem 0.7rem;
// // // // // // // //   font-size: 0.76rem;
// // // // // // // //   color: var(--text-muted);
// // // // // // // //   white-space: nowrap;
// // // // // // // // }
// // // // // // // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // // // // // // .stat-chip.accent strong { color: var(--accent); }

// // // // // // // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // // // // // // .segmented {
// // // // // // // //   display: inline-flex;
// // // // // // // //   background: var(--surface-2);
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   border-radius: 8px;
// // // // // // // //   padding: 2px;
// // // // // // // //   gap: 2px;
// // // // // // // // }
// // // // // // // // .segmented button {
// // // // // // // //   border: none;
// // // // // // // //   background: transparent;
// // // // // // // //   color: var(--text-faint);
// // // // // // // //   font-size: 0.74rem;
// // // // // // // //   font-weight: 600;
// // // // // // // //   padding: 0.3rem 0.55rem;
// // // // // // // //   border-radius: 6px;
// // // // // // // //   cursor: pointer;
// // // // // // // //   transition: background 0.12s ease, color 0.12s ease;
// // // // // // // // }
// // // // // // // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // // // // // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // // // // // // .btn-ghost {
// // // // // // // //   background: transparent !important;
// // // // // // // //   border: 1px solid var(--border) !important;
// // // // // // // //   color: var(--text-muted) !important;
// // // // // // // //   font-size: 0.78rem !important;
// // // // // // // //   border-radius: 8px !important;
// // // // // // // //   padding: 0.35rem 0.65rem !important;
// // // // // // // // }
// // // // // // // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // // // /* ---------- Tableau matriciel ---------- */
// // // // // // // // .table-scroll-container {
// // // // // // // //   width: 100%;
// // // // // // // //   max-height: calc(100vh - 230px);
// // // // // // // //   min-height: 420px;
// // // // // // // //   overflow: auto;
// // // // // // // //   border-radius: 14px;
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   background: var(--surface);
// // // // // // // // }
// // // // // // // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // // // // // // .matrix-table thead th {
// // // // // // // //   position: sticky;
// // // // // // // //   top: 0;
// // // // // // // //   background: #0f1420 !important;
// // // // // // // //   z-index: 10;
// // // // // // // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // // // // // // //   vertical-align: middle;
// // // // // // // // }

// // // // // // // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // // // // // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // // // // // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // // // // // // .student-cell { white-space: normal; }
// // // // // // // // .student-cell-inner { max-width: 100%; }
// // // // // // // // .student-cell-name {
// // // // // // // //   display: block;
// // // // // // // //   font-weight: 600;
// // // // // // // //   color: var(--accent);
// // // // // // // //   cursor: pointer;
// // // // // // // //   text-decoration: none;
// // // // // // // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // // // // // // //   white-space: nowrap;
// // // // // // // //   overflow: hidden;
// // // // // // // //   text-overflow: ellipsis;
// // // // // // // // }
// // // // // // // // .student-cell-name:hover { color: #6ee7de; }
// // // // // // // // .student-cell-email {
// // // // // // // //   color: var(--text-faint);
// // // // // // // //   font-size: 0.7rem;
// // // // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // // //   white-space: nowrap;
// // // // // // // //   overflow: hidden;
// // // // // // // //   text-overflow: ellipsis;
// // // // // // // // }

// // // // // // // // .doc-badge {
// // // // // // // //   font-size: 0.68rem;
// // // // // // // //   padding: 0.15rem 0.4rem;
// // // // // // // //   border-radius: 5px;
// // // // // // // //   background: var(--surface-2) !important;
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   color: var(--text-muted) !important;
// // // // // // // //   text-decoration: none !important;
// // // // // // // // }

// // // // // // // // .chef-head-cell { text-align: center; }
// // // // // // // // .chef-avatar {
// // // // // // // //   min-width: 40px;
// // // // // // // //   height: 24px;
// // // // // // // //   padding: 0 6px;
// // // // // // // //   border-radius: 7px;
// // // // // // // //   background: var(--surface-2);
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   display: inline-flex;
// // // // // // // //   align-items: center;
// // // // // // // //   justify-content: center;
// // // // // // // //   font-size: 0.66rem;
// // // // // // // //   font-weight: 700;
// // // // // // // //   letter-spacing: 0.02em;
// // // // // // // //   color: var(--accent);
// // // // // // // //   margin-bottom: 2px;
// // // // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // // // }
// // // // // // // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // // // // // // .chef-specialite {
// // // // // // // //   color: var(--text-faint);
// // // // // // // //   font-weight: 400;
// // // // // // // //   font-size: 0.68rem;
// // // // // // // //   max-width: 130px;
// // // // // // // //   white-space: nowrap;
// // // // // // // //   overflow: hidden;
// // // // // // // //   text-overflow: ellipsis;
// // // // // // // //   margin: 0 auto;
// // // // // // // // }
// // // // // // // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // // // // // // /* ---------- Cellule de sélection : le rang est toujours visible ---------- */
// // // // // // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // // // // // .badge-rank-selection {
// // // // // // // //   display: inline-flex;
// // // // // // // //   align-items: center;
// // // // // // // //   gap: 4px;
// // // // // // // //   min-width: 34px;
// // // // // // // //   justify-content: center;
// // // // // // // //   padding: 3px 9px;
// // // // // // // //   border-radius: 7px;
// // // // // // // //   font-weight: 700;
// // // // // // // //   font-size: 0.74rem;
// // // // // // // //   pointer-events: none;
// // // // // // // //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // // // // // // // }
// // // // // // // // /* Rang affiché avant que la case soit cochée : discret, en attente de clic */
// // // // // // // // .badge-rank-selection.is-pending {
// // // // // // // //   background: transparent;
// // // // // // // //   border: 1px dashed var(--border);
// // // // // // // //   color: var(--text-faint);
// // // // // // // //   opacity: 0.75;
// // // // // // // // }
// // // // // // // // .sel-cell:hover .badge-rank-selection.is-pending {
// // // // // // // //   opacity: 1;
// // // // // // // //   border-color: var(--accent);
// // // // // // // //   color: var(--accent);
// // // // // // // //   transform: translateY(-1px);
// // // // // // // // }
// // // // // // // // /* Rang affiché une fois la case cochée : plein, avec le signe ✓ */
// // // // // // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // // // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // // // // // /* ---------- Vue mobile (accordéon) ---------- */
// // // // // // // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // // // // // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // // // // // // .mobile-card-head {
// // // // // // // //   display: flex;
// // // // // // // //   align-items: center;
// // // // // // // //   gap: 0.7rem;
// // // // // // // //   padding: 0.75rem 0.85rem;
// // // // // // // //   cursor: pointer;
// // // // // // // // }
// // // // // // // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // // // // // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // // // // // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // // // // // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // // // // // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // // // // // // .mobile-chef-chip {
// // // // // // // //   display: inline-flex;
// // // // // // // //   align-items: center;
// // // // // // // //   gap: 0.35rem;
// // // // // // // //   padding: 0.35rem 0.6rem;
// // // // // // // //   border-radius: 999px;
// // // // // // // //   font-size: 0.76rem;
// // // // // // // //   font-weight: 600;
// // // // // // // //   cursor: pointer;
// // // // // // // //   border: 1px solid var(--border);
// // // // // // // //   background: var(--surface-2);
// // // // // // // //   color: var(--text-muted);
// // // // // // // //   transition: border-color 0.12s ease, color 0.12s ease;
// // // // // // // // }
// // // // // // // // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // // // // // // // .empty-state {
// // // // // // // //   text-align: center;
// // // // // // // //   padding: 3rem 1rem;
// // // // // // // //   color: var(--text-muted);
// // // // // // // // }

// // // // // // // // /* ---------- Modal radar : design moderne, entièrement opaque ---------- */
// // // // // // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // // // // // .modal-dark .modal-content {
// // // // // // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // // // // // //   background-color: #12161f !important;
// // // // // // // //   opacity: 1 !important;
// // // // // // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // // // // // //   border-radius: 20px;
// // // // // // // //   color: var(--text);
// // // // // // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
// // // // // // // //   overflow: hidden;
// // // // // // // // }
// // // // // // // // .modal-dark .modal-header {
// // // // // // // //   border-bottom: 1px solid var(--border);
// // // // // // // //   background: rgba(45, 212, 191, 0.07);
// // // // // // // //   padding: 1.15rem 1.5rem;
// // // // // // // // }
// // // // // // // // .modal-dark .modal-body {
// // // // // // // //   background: transparent;
// // // // // // // //   padding: 1.5rem;
// // // // // // // // }
// // // // // // // // .modal-dark .modal-footer {
// // // // // // // //   border-top: 1px solid var(--border);
// // // // // // // //   background: rgba(255, 255, 255, 0.02);
// // // // // // // //   padding: 0.9rem 1.5rem;
// // // // // // // // }
// // // // // // // // .modal-dark .modal-title {
// // // // // // // //   font-family: 'Space Grotesk', sans-serif;
// // // // // // // //   font-weight: 700;
// // // // // // // //   font-size: 1.08rem;
// // // // // // // //   letter-spacing: -0.01em;
// // // // // // // // }
// // // // // // // // .modal-dark .btn-close {
// // // // // // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // // // // // //   opacity: 0.7;
// // // // // // // // }
// // // // // // // // .modal-dark .btn-close:hover { opacity: 1; }
// // // // // // // // .modal-dark .modal-footer .btn-secondary {
// // // // // // // //   background: var(--surface-2) !important;
// // // // // // // //   border: 1px solid var(--border) !important;
// // // // // // // //   border-radius: 999px !important;
// // // // // // // //   font-weight: 600 !important;
// // // // // // // //   font-size: 0.82rem !important;
// // // // // // // //   padding: 0.4rem 1.1rem !important;
// // // // // // // //   color: var(--text) !important;
// // // // // // // // }
// // // // // // // // .modal-dark .modal-footer .btn-secondary:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
// // // // // // // // .modal-backdrop.show { opacity: 0.78 !important; }

// // // // // // // // @media (max-width: 767px) {
// // // // // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // // // // //   .bulk-actions { margin-left: 0; }
// // // // // // // // }
// // // // // // // // `;

// // // // // // // // // ============================================================================
// // // // // // // // // Sous-composants de présentation
// // // // // // // // // ============================================================================

// // // // // // // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // // // // // // //   return (
// // // // // // // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // // // // // // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // // // // // // //       {showFullNames && (
// // // // // // // //         <>
// // // // // // // //           <div className="chef-fullname">{chef.nom}</div>
// // // // // // // //           {chef.specialite && (
// // // // // // // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // // // // // // //           )}
// // // // // // // //         </>
// // // // // // // //       )}
// // // // // // // //       <div>
// // // // // // // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // // // // // // //       </div>
// // // // // // // //     </th>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // // Le rang (1er, 2e, 3e…) est toujours visible, même avant la sélection.
// // // // // // // // // Une fois la case cochée, le badge se remplit de couleur et affiche le signe ✓.
// // // // // // // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // // // // // // //   return (
// // // // // // // //     <td className="sel-cell" onClick={onClick}>
// // // // // // // //       <span
// // // // // // // //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// // // // // // // //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // // // //         title={
// // // // // // // //           selected
// // // // // // // //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// // // // // // // //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// // // // // // // //         }
// // // // // // // //       >
// // // // // // // //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// // // // // // // //       </span>
// // // // // // // //     </td>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // // // // // // //   return (
// // // // // // // //     <div className="mobile-card">
// // // // // // // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // // // // // // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // // // // // // //         <div style={{ flex: 1, minWidth: 0 }}>
// // // // // // // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // // // // // // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // // // // // // //         </div>
// // // // // // // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // // //       </div>
// // // // // // // //       {expanded && (
// // // // // // // //         <div className="mobile-card-body">
// // // // // // // //           <Button
// // // // // // // //             size="sm"
// // // // // // // //             className="btn-ghost"
// // // // // // // //             onClick={(e) => {
// // // // // // // //               e.stopPropagation();
// // // // // // // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // // // // // // //             }}
// // // // // // // //           >
// // // // // // // //             📊 Profil compétences
// // // // // // // //           </Button>
// // // // // // // //           {chefs.map((chef) => {
// // // // // // // //             const key = `${etud.id}-${chef.id}`;
// // // // // // // //             const isSelected = selections.has(key);
// // // // // // // //             const rankInfo = studentRanks?.get(chef.id);
// // // // // // // //             const rankNum = rankInfo?.rank || 1;
// // // // // // // //             return (
// // // // // // // //               <span
// // // // // // // //                 key={chef.id}
// // // // // // // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // // // // // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // // // // // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`}
// // // // // // // //               >
// // // // // // // //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
// // // // // // // //               </span>
// // // // // // // //             );
// // // // // // // //           })}
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // // ============================================================================
// // // // // // // // // Composant principal
// // // // // // // // // ============================================================================

// // // // // // // // export default function SelectionPage() {
// // // // // // // //   const [chefs, setChefs] = useState([]);
// // // // // // // //   const [etudiants, setEtudiants] = useState([]);
// // // // // // // //   const [apetencesList, setApetencesList] = useState([]);

// // // // // // // //   // Set de "etudiantId-chefId"
// // // // // // // //   const [selections, setSelections] = useState(new Set());
// // // // // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // //   const [error, setError] = useState(null);
// // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // //   // Réglages d'affichage (purement UI, n'affectent aucune donnée)
// // // // // // // //   const [density, setDensity] = useState('compact'); // 'compact' | 'comfortable'
// // // // // // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // // // // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // // // // // // //   // Modal Radar
// // // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // // // //   const [modalError, setModalError] = useState(null);

// // // // // // // //   const isMobile = useIsMobile(768);

// // // // // // // //   const loadData = async () => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       setError(null);

// // // // // // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw] = await Promise.all([
// // // // // // // //         fetchChefsDeProjet(),
// // // // // // // //         fetchEtudiants(),
// // // // // // // //         fetchSelections(),
// // // // // // // //         fetchAllApetences(),
// // // // // // // //       ]);

// // // // // // // //       setChefs(chefsData || []);
// // // // // // // //       setEtudiants(etudiantsData || []);
// // // // // // // //       setApetencesList(apetencesDataRaw || []);

// // // // // // // //       const activeSet = new Set();
// // // // // // // //       (selectionsData || []).forEach((s) => {
// // // // // // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // // // // // //           activeSet.add(`${s.etudiant_id}-${s.chef_de_projet_id}`);
// // // // // // // //         }
// // // // // // // //       });

// // // // // // // //       setSelections(new Set(activeSet));
// // // // // // // //       setInitialSelections(new Set(activeSet));
// // // // // // // //     } catch (err) {
// // // // // // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     loadData();
// // // // // // // //   }, []);

// // // // // // // //   // Map des rangs d'appétence : etudiant_id => Map(chef_id => { rank, score })
// // // // // // // //   const appetenceRanksMap = useMemo(() => {
// // // // // // // //     const map = new Map();
// // // // // // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // // // // // //     etudiants.forEach((etud) => {
// // // // // // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // // // // // //       const ranks = computeChefRanksForStudent(etudAp, chefs);
// // // // // // // //       map.set(etud.id, ranks);
// // // // // // // //     });

// // // // // // // //     return map;
// // // // // // // //   }, [apetencesList, etudiants, chefs]);

// // // // // // // //   const hasChanges = useMemo(() => {
// // // // // // // //     if (selections.size !== initialSelections.size) return true;
// // // // // // // //     for (const key of selections) {
// // // // // // // //       if (!initialSelections.has(key)) return true;
// // // // // // // //     }
// // // // // // // //     return false;
// // // // // // // //   }, [selections, initialSelections]);

// // // // // // // //   const filteredEtudiants = useMemo(() => {
// // // // // // // //     const term = searchStudent.toLowerCase().trim();
// // // // // // // //     if (!term) return etudiants;
// // // // // // // //     return etudiants.filter(
// // // // // // // //       (e) =>
// // // // // // // //         (e.nom && e.nom.toLowerCase().includes(term)) ||
// // // // // // // //         (e.prenom && e.prenom.toLowerCase().includes(term)) ||
// // // // // // // //         (e.adresse_email && e.adresse_email.toLowerCase().includes(term))
// // // // // // // //     );
// // // // // // // //   }, [etudiants, searchStudent]);

// // // // // // // //   const visibleChefs = useMemo(() => {
// // // // // // // //     if (selectedChefFilter === 'all') return chefs;
// // // // // // // //     return chefs.filter((c) => String(c.id) === String(selectedChefFilter));
// // // // // // // //   }, [chefs, selectedChefFilter]);

// // // // // // // //   const countsPerStudent = useMemo(() => {
// // // // // // // //     const map = {};
// // // // // // // //     for (const key of selections) {
// // // // // // // //       const [etudId] = key.split('-');
// // // // // // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // // // // // //     }
// // // // // // // //     return map;
// // // // // // // //   }, [selections]);

// // // // // // // //   const countsPerChef = useMemo(() => {
// // // // // // // //     const map = {};
// // // // // // // //     for (const key of selections) {
// // // // // // // //       const [, chefId] = key.split('-');
// // // // // // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // // // // // //     }
// // // // // // // //     return map;
// // // // // // // //   }, [selections]);

// // // // // // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // // // // // //     const key = `${etudiantId}-${chefId}`;
// // // // // // // //     setSelections((prev) => {
// // // // // // // //       const next = new Set(prev);
// // // // // // // //       if (next.has(key)) next.delete(key);
// // // // // // // //       else next.add(key);
// // // // // // // //       return next;
// // // // // // // //     });
// // // // // // // //     setSuccessMsg(null);
// // // // // // // //   }, []);

// // // // // // // //   const handleSelectAllVisible = () => {
// // // // // // // //     setSelections((prev) => {
// // // // // // // //       const next = new Set(prev);
// // // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // // //         visibleChefs.forEach((c) => next.add(`${e.id}-${c.id}`));
// // // // // // // //       });
// // // // // // // //       return next;
// // // // // // // //     });
// // // // // // // //     setSuccessMsg(null);
// // // // // // // //   };

// // // // // // // //   const handleDeselectAllVisible = () => {
// // // // // // // //     setSelections((prev) => {
// // // // // // // //       const next = new Set(prev);
// // // // // // // //       filteredEtudiants.forEach((e) => {
// // // // // // // //         visibleChefs.forEach((c) => next.delete(`${e.id}-${c.id}`));
// // // // // // // //       });
// // // // // // // //       return next;
// // // // // // // //     });
// // // // // // // //     setSuccessMsg(null);
// // // // // // // //   };

// // // // // // // //   const handleSubmit = async () => {
// // // // // // // //     try {
// // // // // // // //       setSaving(true);
// // // // // // // //       setError(null);
// // // // // // // //       setSuccessMsg(null);

// // // // // // // //       const toAdd = [];
// // // // // // // //       selections.forEach((key) => {
// // // // // // // //         if (!initialSelections.has(key)) {
// // // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // // //           toAdd.push({ etudiantId, chefId });
// // // // // // // //         }
// // // // // // // //       });

// // // // // // // //       const toDelete = [];
// // // // // // // //       initialSelections.forEach((key) => {
// // // // // // // //         if (!selections.has(key)) {
// // // // // // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // // // // // //           toDelete.push({ etudiantId, chefId });
// // // // // // // //         }
// // // // // // // //       });

// // // // // // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // // // // // //         deleteSelection(etudiantId, chefId)
// // // // // // // //       );
// // // // // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // // // // // //         saveSelection(etudiantId, chefId)
// // // // // // // //       );

// // // // // // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // // // // // //       setInitialSelections(new Set(selections));
// // // // // // // //       setSuccessMsg(
// // // // // // // //         `✨ Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // // // // // //       );
// // // // // // // //     } catch (err) {
// // // // // // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // // // // // //     } finally {
// // // // // // // //       setSaving(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Export Excel
// // // // // // // //   const handleDownloadSelectionXLSX = () => {
// // // // // // // //     try {
// // // // // // // //       if (etudiants.length === 0 || chefs.length === 0) {
// // // // // // // //         alert('Aucune donnée disponible.');
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       const sortedEtudiants = [...etudiants].sort((a, b) =>
// // // // // // // //         (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
// // // // // // // //       );

// // // // // // // //       const selectionRows = sortedEtudiants.map((etud) => {
// // // // // // // //         const studentRanks = appetenceRanksMap.get(etud.id);
// // // // // // // //         const row = {
// // // // // // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // // // // // //           'Email': etud.adresse_email || '',
// // // // // // // //           'Parcours': etud.parcours || 'I2026',
// // // // // // // //         };

// // // // // // // //         chefs.forEach((chef) => {
// // // // // // // //           const isSelected = selections.has(`${etud.id}-${chef.id}`);
// // // // // // // //           const rankInfo = studentRanks?.get(chef.id);
// // // // // // // //           row[chef.nom] = isSelected ? (rankInfo ? `${rankInfo.rank}e choix` : 'Sélectionné') : '';
// // // // // // // //         });

// // // // // // // //         row['Total Sélections'] = countsPerStudent[etud.id] || 0;
// // // // // // // //         return row;
// // // // // // // //       });

// // // // // // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // // // // // //       wsSelections['!cols'] = [
// // // // // // // //         { wch: 26 },
// // // // // // // //         { wch: 32 },
// // // // // // // //         { wch: 12 },
// // // // // // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 16) })),
// // // // // // // //         { wch: 16 },
// // // // // // // //       ];

// // // // // // // //       const statsRows = chefs.map((chef) => ({
// // // // // // // //         'Chef de Projet': chef.nom,
// // // // // // // //         'Spécialité': chef.specialite || 'N/A',
// // // // // // // //         'Email': chef.email || '',
// // // // // // // //         'Nombre de Sélections': countsPerChef[chef.id] || 0,
// // // // // // // //       }));

// // // // // // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // // // // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }];

// // // // // // // //       const workbook = XLSX.utils.book_new();
// // // // // // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // // // // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // // // // // //       const today = new Date().toISOString().slice(0, 10);
// // // // // // // //       XLSX.writeFile(workbook, `selections_appetences_${today}.xlsx`);
// // // // // // // //     } catch (err) {
// // // // // // // //       alert(`Erreur export: ${err.message}`);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Popup Radar
// // // // // // // //   const handleOpenStudentRadar = async (etudiantId, nomComplet, email) => {
// // // // // // // //     if (!etudiantId) return;
// // // // // // // //     setSelectedEtudiantInfo({ id: etudiantId, nom: nomComplet, email });
// // // // // // // //     setModalOpen(true);
// // // // // // // //     setModalLoading(true);
// // // // // // // //     setModalError(null);
// // // // // // // //     setAptitudesData(null);
// // // // // // // //     setApetencesData(null);

// // // // // // // //     try {
// // // // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // // // //         fetchAptitudesByEtudiant(etudiantId),
// // // // // // // //         fetchApetencesByEtudiant(etudiantId),
// // // // // // // //       ]);

// // // // // // // //       if (!aptitudes && !apetences) {
// // // // // // // //         setModalError('Aucune compétence ni appétence enregistrée.');
// // // // // // // //       } else {
// // // // // // // //         setAptitudesData(aptitudes);
// // // // // // // //         setApetencesData(apetences);
// // // // // // // //       }
// // // // // // // //     } catch (err) {
// // // // // // // //       setModalError(err.message || 'Erreur chargement compétences.');
// // // // // // // //     } finally {
// // // // // // // //       setModalLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const radarChartData = useMemo(() => {
// // // // // // // //     const labels = COMPETENCE_KEYS.map((c) => c.label);
// // // // // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);

// // // // // // // //     return {
// // // // // // // //       labels,
// // // // // // // //       datasets: [
// // // // // // // //         {
// // // // // // // //           label: 'Aptitudes (Technique)',
// // // // // // // //           data: aptValues,
// // // // // // // //           backgroundColor: 'rgba(56, 189, 248, 0.25)',
// // // // // // // //           borderColor: '#38bdf8',
// // // // // // // //           borderWidth: 2,
// // // // // // // //           pointBackgroundColor: '#38bdf8',
// // // // // // // //         },
// // // // // // // //         {
// // // // // // // //           label: 'Appétences (Intérêt)',
// // // // // // // //           data: apeValues,
// // // // // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // // // // //           borderColor: '#f43f5e',
// // // // // // // //           borderWidth: 2,
// // // // // // // //           pointBackgroundColor: '#f43f5e',
// // // // // // // //         },
// // // // // // // //       ],
// // // // // // // //     };
// // // // // // // //   }, [aptitudesData, apetencesData]);

// // // // // // // //   const radarOptions = {
// // // // // // // //     responsive: true,
// // // // // // // //     maintainAspectRatio: false,
// // // // // // // //     scales: {
// // // // // // // //       r: {
// // // // // // // //         min: 0,
// // // // // // // //         suggestedMax: 4,
// // // // // // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#94a3b8' },
// // // // // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // // // // //       },
// // // // // // // //     },
// // // // // // // //     plugins: {
// // // // // // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } } },
// // // // // // // //     },
// // // // // // // //   };

// // // // // // // //   const toggleMobileExpand = (id) => {
// // // // // // // //     setExpandedMobileIds((prev) => {
// // // // // // // //       const next = new Set(prev);
// // // // // // // //       if (next.has(id)) next.delete(id);
// // // // // // // //       else next.add(id);
// // // // // // // //       return next;
// // // // // // // //     });
// // // // // // // //   };

// // // // // // // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // // // // // // //   if (loading) {
// // // // // // // //     return (
// // // // // // // //       <>
// // // // // // // //         <Navbar />
// // // // // // // //         <style>{STYLE_SHEET}</style>
// // // // // // // //         <div className="matrix-page">
// // // // // // // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // // // // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // // // // // // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // // // // // // //               Chargement de la matrice des sélections...
// // // // // // // //             </p>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <>
// // // // // // // //       <Navbar />
// // // // // // // //       <style>{STYLE_SHEET}</style>

// // // // // // // //       <div className="matrix-page">
// // // // // // // //         <div className="matrix-shell">
// // // // // // // //           {/* Header */}
// // // // // // // //           <div className="matrix-header">
// // // // // // // //             <div>
// // // // // // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // // // // // // //               <p className="matrix-subtitle">
// // // // // // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// // // // // // // //               </p>
// // // // // // // //             </div>

// // // // // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
// // // // // // // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // // // // // // //                 📊 Exporter (.xlsx)
// // // // // // // //               </Button>
// // // // // // // //               <Button
// // // // // // // //                 className="btn-pill btn-save-pill"
// // // // // // // //                 onClick={handleSubmit}
// // // // // // // //                 disabled={saving || !hasChanges}
// // // // // // // //               >
// // // // // // // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // // // // // // //               </Button>
// // // // // // // //             </div>
// // // // // // // //           </div>

// // // // // // // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // //           {/* Toolbar unique : recherche, filtre, stats, réglages, actions groupées */}
// // // // // // // //           <div className="matrix-toolbar">
// // // // // // // //             <InputGroup size="sm" className="toolbar-search">
// // // // // // // //               <Form.Control
// // // // // // // //                 placeholder="🔍 Rechercher un étudiant..."
// // // // // // // //                 value={searchStudent}
// // // // // // // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // // // // // // //               />
// // // // // // // //               {searchStudent && (
// // // // // // // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // // // // // // //               )}
// // // // // // // //             </InputGroup>

// // // // // // // //             <Form.Select
// // // // // // // //               size="sm"
// // // // // // // //               className="toolbar-select"
// // // // // // // //               value={selectedChefFilter}
// // // // // // // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // // // // //             >
// // // // // // // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // // // // // // //               {chefs.map((c) => (
// // // // // // // //                 <option key={c.id} value={c.id}>
// // // // // // // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // // // // //                 </option>
// // // // // // // //               ))}
// // // // // // // //             </Form.Select>

// // // // // // // //             <div className="toolbar-divider" />

// // // // // // // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // // // // // // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // // // // // // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // // // // // // //             {!isMobile && (
// // // // // // // //               <>
// // // // // // // //                 <div className="toolbar-divider" />
// // // // // // // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // // // // // // //                   <button
// // // // // // // //                     type="button"
// // // // // // // //                     className={density === 'compact' ? 'active' : ''}
// // // // // // // //                     onClick={() => setDensity('compact')}
// // // // // // // //                   >
// // // // // // // //                     Compact
// // // // // // // //                   </button>
// // // // // // // //                   <button
// // // // // // // //                     type="button"
// // // // // // // //                     className={density === 'comfortable' ? 'active' : ''}
// // // // // // // //                     onClick={() => setDensity('comfortable')}
// // // // // // // //                   >
// // // // // // // //                     Confortable
// // // // // // // //                   </button>
// // // // // // // //                 </div>
// // // // // // // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // // // // // // //                   <button
// // // // // // // //                     type="button"
// // // // // // // //                     className={!showFullNames ? 'active' : ''}
// // // // // // // //                     onClick={() => setShowFullNames(false)}
// // // // // // // //                   >
// // // // // // // //                     Initiales
// // // // // // // //                   </button>
// // // // // // // //                   <button
// // // // // // // //                     type="button"
// // // // // // // //                     className={showFullNames ? 'active' : ''}
// // // // // // // //                     onClick={() => setShowFullNames(true)}
// // // // // // // //                   >
// // // // // // // //                     Noms complets
// // // // // // // //                   </button>
// // // // // // // //                 </div>
// // // // // // // //               </>
// // // // // // // //             )}

// // // // // // // //             <div className="bulk-actions">
// // // // // // // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // // // // // // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // // // // // // //             </div>
// // // // // // // //           </div>

// // // // // // // //           {/* Vue mobile : accordéons */}
// // // // // // // //           {isMobile ? (
// // // // // // // //             filteredEtudiants.length === 0 ? (
// // // // // // // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // // // // // // //             ) : (
// // // // // // // //               <div className="mobile-list">
// // // // // // // //                 {filteredEtudiants.map((etud) => (
// // // // // // // //                   <MobileStudentCard
// // // // // // // //                     key={etud.id}
// // // // // // // //                     etud={etud}
// // // // // // // //                     chefs={visibleChefs}
// // // // // // // //                     selections={selections}
// // // // // // // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // // // // // // //                     expanded={expandedMobileIds.has(etud.id)}
// // // // // // // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // // // // // // //                     onToggleSelection={toggleSelection}
// // // // // // // //                     onOpenRadar={handleOpenStudentRadar}
// // // // // // // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // // // // // // //                   />
// // // // // // // //                 ))}
// // // // // // // //               </div>
// // // // // // // //             )
// // // // // // // //           ) : (
// // // // // // // //             /* Vue desktop : tableau matriciel */
// // // // // // // //             <div className="table-scroll-container">
// // // // // // // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // // // // // // //                 <thead>
// // // // // // // //                   <tr>
// // // // // // // //                     <th
// // // // // // // //                       style={{
// // // // // // // //                         minWidth: density === 'compact' ? 148 : 190,
// // // // // // // //                         maxWidth: density === 'compact' ? 148 : 190,
// // // // // // // //                         textAlign: 'left',
// // // // // // // //                         position: 'sticky',
// // // // // // // //                         left: 0,
// // // // // // // //                         top: 0,
// // // // // // // //                         backgroundColor: '#0f1420',
// // // // // // // //                         zIndex: 20,
// // // // // // // //                         paddingLeft: '0.65rem',
// // // // // // // //                       }}
// // // // // // // //                     >
// // // // // // // //                       Étudiant ({filteredEtudiants.length})
// // // // // // // //                     </th>
// // // // // // // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // // // // // // //                       Total
// // // // // // // //                     </th>
// // // // // // // //                     {visibleChefs.map((chef) => (
// // // // // // // //                       <ChefHeaderCell
// // // // // // // //                         key={chef.id}
// // // // // // // //                         chef={chef}
// // // // // // // //                         count={countsPerChef[chef.id]}
// // // // // // // //                         showFullNames={showFullNames}
// // // // // // // //                       />
// // // // // // // //                     ))}
// // // // // // // //                   </tr>
// // // // // // // //                 </thead>
// // // // // // // //                 <tbody>
// // // // // // // //                   {filteredEtudiants.length === 0 ? (
// // // // // // // //                     <tr>
// // // // // // // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // // // // // // //                         Aucun étudiant trouvé.
// // // // // // // //                       </td>
// // // // // // // //                     </tr>
// // // // // // // //                   ) : (
// // // // // // // //                     filteredEtudiants.map((etud) => {
// // // // // // // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // // // // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // // // // // // //                       return (
// // // // // // // //                         <tr key={etud.id}>
// // // // // // // //                           <td
// // // // // // // //                             className="student-cell"
// // // // // // // //                             style={{
// // // // // // // //                               textAlign: 'left',
// // // // // // // //                               position: 'sticky',
// // // // // // // //                               left: 0,
// // // // // // // //                               backgroundColor: '#131c2e',
// // // // // // // //                               zIndex: 5,
// // // // // // // //                               paddingLeft: '0.65rem',
// // // // // // // //                               maxWidth: density === 'compact' ? 148 : 190,
// // // // // // // //                             }}
// // // // // // // //                           >
// // // // // // // //                             <div className="student-cell-inner">
// // // // // // // //                               <span
// // // // // // // //                                 className="student-cell-name"
// // // // // // // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // // // // // // //                                 onClick={() =>
// // // // // // // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // // // // // // //                                 }
// // // // // // // //                               >
// // // // // // // //                                 {etud.nom} {etud.prenom}
// // // // // // // //                               </span>
// // // // // // // //                               {density === 'comfortable' && (
// // // // // // // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // // // // // // //                                   {etud.adresse_email}
// // // // // // // //                                 </div>
// // // // // // // //                               )}
// // // // // // // //                               {(etud.cv_path || etud.lm_path) && (
// // // // // // // //                                 <div className="d-flex gap-1 mt-1">
// // // // // // // //                                   {etud.cv_path && (
// // // // // // // //                                     <a
// // // // // // // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // // // // // // //                                       target="_blank"
// // // // // // // //                                       rel="noopener noreferrer"
// // // // // // // //                                       className="doc-badge badge"
// // // // // // // //                                       title="CV"
// // // // // // // //                                     >
// // // // // // // //                                       📄
// // // // // // // //                                     </a>
// // // // // // // //                                   )}
// // // // // // // //                                   {etud.lm_path && (
// // // // // // // //                                     <a
// // // // // // // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // // // // // // //                                       target="_blank"
// // // // // // // //                                       rel="noopener noreferrer"
// // // // // // // //                                       className="doc-badge badge"
// // // // // // // //                                       title="Lettre de motivation"
// // // // // // // //                                     >
// // // // // // // //                                       ✉️
// // // // // // // //                                     </a>
// // // // // // // //                                   )}
// // // // // // // //                                 </div>
// // // // // // // //                               )}
// // // // // // // //                             </div>
// // // // // // // //                           </td>

// // // // // // // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // // // // // // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // // //                           </td>

// // // // // // // //                           {visibleChefs.map((chef) => {
// // // // // // // //                             const key = `${etud.id}-${chef.id}`;
// // // // // // // //                             const isSelected = selections.has(key);
// // // // // // // //                             const rankInfo = studentRanks?.get(chef.id);
// // // // // // // //                             const rankNum = rankInfo?.rank || 1;

// // // // // // // //                             return (
// // // // // // // //                               <SelectionCell
// // // // // // // //                                 key={chef.id}
// // // // // // // //                                 selected={isSelected}
// // // // // // // //                                 rankNum={rankNum}
// // // // // // // //                                 rankInfo={rankInfo}
// // // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // // //                               />
// // // // // // // //                             );
// // // // // // // //                           })}
// // // // // // // //                         </tr>
// // // // // // // //                       );
// // // // // // // //                     })
// // // // // // // //                   )}
// // // // // // // //                 </tbody>
// // // // // // // //               </Table>
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //         </div>
// // // // // // // //       </div>

// // // // // // // //       {/* Modal Radar */}
// // // // // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark" backdropClassName="modal-dark-backdrop">
// // // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // // // // //         </Modal.Header>
// // // // // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // // // //           {modalLoading ? (
// // // // // // // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
// // // // // // // //           ) : modalError ? (
// // // // // // // //             <Alert variant="warning">{modalError}</Alert>
// // // // // // // //           ) : (
// // // // // // // //             <div style={{ position: 'relative', width: '100%', height: '380px' }}>
// // // // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //         </Modal.Body>
// // // // // // // //         <Modal.Footer>
// // // // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>Fermer</Button>
// // // // // // // //         </Modal.Footer>
// // // // // // // //       </Modal>
// // // // // // // //     </>
// // // // // // // //   );
// // // // // // // // }
// // // // // // // import React, { useEffect, useState, useMemo, useCallback } from 'react';
// // // // // // // import {
// // // // // // //   Table,
// // // // // // //   Button,
// // // // // // //   Alert,
// // // // // // //   Spinner,
// // // // // // //   Form,
// // // // // // //   InputGroup,
// // // // // // //   Badge,
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

// // // // // // // // ============================================================================
// // // // // // // // Constantes & helpers métier (logique inchangée)
// // // // // // // // ============================================================================

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

// // // // // // // const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// // // // // // // // Abréviation d'un chef pour l'affichage compact des en-têtes de colonne
// // // // // // // // (4 premières lettres du nom, plus lisible que de simples initiales)
// // // // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // // // ============================================================================
// // // // // // // // Hook responsive (bascule automatique vers la vue mobile)
// // // // // // // // ============================================================================

// // // // // // // function useIsMobile(breakpoint = 768) {
// // // // // // //   const [isMobile, setIsMobile] = useState(
// // // // // // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // // // // // //   );

// // // // // // //   useEffect(() => {
// // // // // // //     if (typeof window === 'undefined') return undefined;
// // // // // // //     const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
// // // // // // //     const handler = (e) => setIsMobile(e.matches);
// // // // // // //     setIsMobile(mql.matches);
// // // // // // //     mql.addEventListener('change', handler);
// // // // // // //     return () => mql.removeEventListener('change', handler);
// // // // // // //   }, [breakpoint]);

// // // // // // //   return isMobile;
// // // // // // // }

// // // // // // // // ============================================================================
// // // // // // // // Styles
// // // // // // // // ============================================================================

// // // // // // // const STYLE_SHEET = `
// // // // // // // @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

// // // // // // // .matrix-page {
// // // // // // //   --bg: #0a0d12;
// // // // // // //   --surface: #12161f;
// // // // // // //   --surface-2: #1a2029;
// // // // // // //   --surface-hover: rgba(99, 102, 241, 0.08);
// // // // // // //   --border: #232a37;
// // // // // // //   --text: #e9ecf1;
// // // // // // //   --text-muted: #8b93a5;
// // // // // // //   --text-faint: #5a6272;
// // // // // // //   --accent: #2dd4bf;
// // // // // // //   --accent-soft: rgba(45, 212, 191, 0.14);
// // // // // // //   font-family: 'Inter', -apple-system, sans-serif;
// // // // // // //   background: var(--bg);
// // // // // // //   min-height: 100vh;
// // // // // // //   color: var(--text);
// // // // // // // }
// // // // // // // .matrix-page .display { font-family: 'Space Grotesk', sans-serif; }
// // // // // // // .matrix-page .mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }

// // // // // // // .matrix-shell {
// // // // // // //   max-width: 100%;
// // // // // // //   margin: 0 auto;
// // // // // // //   padding: 1.25rem 1.5rem 2rem;
// // // // // // // }

// // // // // // // /* ---------- Header ---------- */
// // // // // // // .matrix-header {
// // // // // // //   display: flex;
// // // // // // //   justify-content: space-between;
// // // // // // //   align-items: center;
// // // // // // //   gap: 1rem;
// // // // // // //   flex-wrap: wrap;
// // // // // // //   margin-bottom: 0.9rem;
// // // // // // // }
// // // // // // // .matrix-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; margin: 0; }
// // // // // // // .matrix-subtitle { color: var(--text-muted); font-size: 0.8rem; margin: 0.15rem 0 0; max-width: 640px; }
// // // // // // // .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

// // // // // // // .btn-pill {
// // // // // // //   border-radius: 999px !important;
// // // // // // //   font-weight: 600 !important;
// // // // // // //   font-size: 0.82rem !important;
// // // // // // //   padding: 0.45rem 1rem !important;
// // // // // // //   border: 1px solid var(--border) !important;
// // // // // // // }
// // // // // // // .btn-save-pill {
// // // // // // //   background: var(--accent) !important;
// // // // // // //   border: none !important;
// // // // // // //   color: #06201c !important;
// // // // // // //   box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.25), 0 8px 20px -10px rgba(45, 212, 191, 0.55);
// // // // // // // }
// // // // // // // .btn-save-pill:disabled { opacity: 0.5; }
// // // // // // // .btn-export-pill { background: var(--surface-2) !important; color: var(--text) !important; }
// // // // // // // .btn-export-pill:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // // .pending-chip {
// // // // // // //   display: inline-flex;
// // // // // // //   align-items: center;
// // // // // // //   gap: 0.35rem;
// // // // // // //   background: rgba(245, 158, 11, 0.14);
// // // // // // //   color: #fbbf24;
// // // // // // //   border: 1px solid rgba(245, 158, 11, 0.35);
// // // // // // //   border-radius: 999px;
// // // // // // //   padding: 0.3rem 0.75rem;
// // // // // // //   font-size: 0.78rem;
// // // // // // //   font-weight: 600;
// // // // // // // }
// // // // // // // .pending-chip.auto-chip {
// // // // // // //   background: rgba(45, 212, 191, 0.14);
// // // // // // //   color: #2dd4bf;
// // // // // // //   border: 1px solid rgba(45, 212, 191, 0.35);
// // // // // // // }

// // // // // // // /* ---------- Toolbar unique (fusion KPI + filtres) ---------- */
// // // // // // // .matrix-toolbar {
// // // // // // //   background: var(--surface);
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   border-radius: 14px;
// // // // // // //   padding: 0.75rem 0.9rem;
// // // // // // //   margin-bottom: 0.9rem;
// // // // // // //   display: flex;
// // // // // // //   align-items: center;
// // // // // // //   gap: 0.9rem;
// // // // // // //   flex-wrap: wrap;
// // // // // // // }
// // // // // // // .matrix-toolbar .form-control,
// // // // // // // .matrix-toolbar .form-select {
// // // // // // //   background: var(--surface-2);
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   color: var(--text);
// // // // // // //   font-size: 0.85rem;
// // // // // // // }
// // // // // // // .matrix-toolbar .form-control:focus,
// // // // // // // .matrix-toolbar .form-select:focus {
// // // // // // //   background: var(--surface-2);
// // // // // // //   border-color: var(--accent);
// // // // // // //   color: var(--text);
// // // // // // //   box-shadow: 0 0 0 3px var(--accent-soft);
// // // // // // // }
// // // // // // // .matrix-toolbar .form-control::placeholder { color: var(--text-faint); }

// // // // // // // .toolbar-search { min-width: 210px; flex: 1 1 210px; }
// // // // // // // .toolbar-select { min-width: 190px; flex: 0 0 auto; }

// // // // // // // .stat-chip {
// // // // // // //   background: var(--surface-2);
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   border-radius: 999px;
// // // // // // //   padding: 0.32rem 0.7rem;
// // // // // // //   font-size: 0.76rem;
// // // // // // //   color: var(--text-muted);
// // // // // // //   white-space: nowrap;
// // // // // // // }
// // // // // // // .stat-chip strong { color: var(--text); font-family: 'JetBrains Mono', monospace; }
// // // // // // // .stat-chip.accent strong { color: var(--accent); }

// // // // // // // .toolbar-divider { width: 1px; align-self: stretch; background: var(--border); margin: 0 0.1rem; }

// // // // // // // .segmented {
// // // // // // //   display: inline-flex;
// // // // // // //   background: var(--surface-2);
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   border-radius: 8px;
// // // // // // //   padding: 2px;
// // // // // // //   gap: 2px;
// // // // // // // }
// // // // // // // .segmented button {
// // // // // // //   border: none;
// // // // // // //   background: transparent;
// // // // // // //   color: var(--text-faint);
// // // // // // //   font-size: 0.74rem;
// // // // // // //   font-weight: 600;
// // // // // // //   padding: 0.3rem 0.55rem;
// // // // // // //   border-radius: 6px;
// // // // // // //   cursor: pointer;
// // // // // // //   transition: background 0.12s ease, color 0.12s ease;
// // // // // // // }
// // // // // // // .segmented button.active { background: var(--accent-soft); color: var(--accent); }

// // // // // // // .bulk-actions { display: flex; gap: 0.4rem; margin-left: auto; }
// // // // // // // .btn-ghost {
// // // // // // //   background: transparent !important;
// // // // // // //   border: 1px solid var(--border) !important;
// // // // // // //   color: var(--text-muted) !important;
// // // // // // //   font-size: 0.78rem !important;
// // // // // // //   border-radius: 8px !important;
// // // // // // //   padding: 0.35rem 0.65rem !important;
// // // // // // // }
// // // // // // // .btn-ghost:hover { border-color: var(--accent) !important; color: var(--accent) !important; }

// // // // // // // /* ---------- Tableau matriciel ---------- */
// // // // // // // .table-scroll-container {
// // // // // // //   width: 100%;
// // // // // // //   max-height: calc(100vh - 230px);
// // // // // // //   min-height: 420px;
// // // // // // //   overflow: auto;
// // // // // // //   border-radius: 14px;
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   background: var(--surface);
// // // // // // // }
// // // // // // // .matrix-table { width: 100%; border-collapse: separate; border-spacing: 0; color: var(--text); margin: 0; }

// // // // // // // .matrix-table thead th {
// // // // // // //   position: sticky;
// // // // // // //   top: 0;
// // // // // // //   background: #0f1420 !important;
// // // // // // //   z-index: 10;
// // // // // // //   border-bottom: 2px solid rgba(45, 212, 191, 0.25);
// // // // // // //   vertical-align: middle;
// // // // // // // }

// // // // // // // .matrix-table.compact th, .matrix-table.compact td { padding: 0.32rem 0.4rem; font-size: 0.78rem; }
// // // // // // // .matrix-table.comfortable th, .matrix-table.comfortable td { padding: 0.65rem 0.7rem; font-size: 0.86rem; }

// // // // // // // .matrix-table tbody tr:hover td { background-color: var(--surface-hover) !important; }

// // // // // // // .student-cell { white-space: normal; }
// // // // // // // .student-cell-inner { max-width: 100%; }
// // // // // // // .student-cell-name {
// // // // // // //   display: block;
// // // // // // //   font-weight: 600;
// // // // // // //   color: var(--accent);
// // // // // // //   cursor: pointer;
// // // // // // //   text-decoration: none;
// // // // // // //   border-bottom: 1px dashed rgba(45, 212, 191, 0.4);
// // // // // // //   white-space: nowrap;
// // // // // // //   overflow: hidden;
// // // // // // //   text-overflow: ellipsis;
// // // // // // // }
// // // // // // // .student-cell-name:hover { color: #6ee7de; }
// // // // // // // .student-cell-email {
// // // // // // //   color: var(--text-faint);
// // // // // // //   font-size: 0.7rem;
// // // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // //   white-space: nowrap;
// // // // // // //   overflow: hidden;
// // // // // // //   text-overflow: ellipsis;
// // // // // // // }

// // // // // // // .doc-badge {
// // // // // // //   font-size: 0.68rem;
// // // // // // //   padding: 0.15rem 0.4rem;
// // // // // // //   border-radius: 5px;
// // // // // // //   background: var(--surface-2) !important;
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   color: var(--text-muted) !important;
// // // // // // //   text-decoration: none !important;
// // // // // // // }

// // // // // // // .chef-head-cell { text-align: center; }
// // // // // // // .chef-avatar {
// // // // // // //   min-width: 40px;
// // // // // // //   height: 24px;
// // // // // // //   padding: 0 6px;
// // // // // // //   border-radius: 7px;
// // // // // // //   background: var(--surface-2);
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   display: inline-flex;
// // // // // // //   align-items: center;
// // // // // // //   justify-content: center;
// // // // // // //   font-size: 0.66rem;
// // // // // // //   font-weight: 700;
// // // // // // //   letter-spacing: 0.02em;
// // // // // // //   color: var(--accent);
// // // // // // //   margin-bottom: 2px;
// // // // // // //   font-family: 'JetBrains Mono', monospace;
// // // // // // // }
// // // // // // // .chef-fullname { font-weight: 700; color: #fff; font-size: 0.82rem; }
// // // // // // // .chef-specialite {
// // // // // // //   color: var(--text-faint);
// // // // // // //   font-weight: 400;
// // // // // // //   font-size: 0.68rem;
// // // // // // //   max-width: 130px;
// // // // // // //   white-space: nowrap;
// // // // // // //   overflow: hidden;
// // // // // // //   text-overflow: ellipsis;
// // // // // // //   margin: 0 auto;
// // // // // // // }
// // // // // // // .chef-count-badge { margin-top: 2px; font-size: 0.66rem !important; }

// // // // // // // /* ---------- Cellule de sélection : le rang est toujours visible ---------- */
// // // // // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // // // // .badge-rank-selection {
// // // // // // //   display: inline-flex;
// // // // // // //   align-items: center;
// // // // // // //   gap: 4px;
// // // // // // //   min-width: 34px;
// // // // // // //   justify-content: center;
// // // // // // //   padding: 3px 9px;
// // // // // // //   border-radius: 7px;
// // // // // // //   font-weight: 700;
// // // // // // //   font-size: 0.74rem;
// // // // // // //   pointer-events: none;
// // // // // // //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // // // // // // }
// // // // // // // /* Rang affiché avant que la case soit cochée : discret, en attente de clic */
// // // // // // // .badge-rank-selection.is-pending {
// // // // // // //   background: transparent;
// // // // // // //   border: 1px dashed var(--border);
// // // // // // //   color: var(--text-faint);
// // // // // // //   opacity: 0.75;
// // // // // // // }
// // // // // // // .sel-cell:hover .badge-rank-selection.is-pending {
// // // // // // //   opacity: 1;
// // // // // // //   border-color: var(--accent);
// // // // // // //   color: var(--accent);
// // // // // // //   transform: translateY(-1px);
// // // // // // // }
// // // // // // // /* Rang affiché une fois la case cochée : plein, avec le signe ✓ */
// // // // // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // // // // /* ---------- Vue mobile (accordéon) ---------- */
// // // // // // // .mobile-list { display: flex; flex-direction: column; gap: 0.6rem; }
// // // // // // // .mobile-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
// // // // // // // .mobile-card-head {
// // // // // // //   display: flex;
// // // // // // //   align-items: center;
// // // // // // //   gap: 0.7rem;
// // // // // // //   padding: 0.75rem 0.85rem;
// // // // // // //   cursor: pointer;
// // // // // // // }
// // // // // // // .mobile-chevron { color: var(--text-faint); transition: transform 0.15s ease; font-size: 0.68rem; }
// // // // // // // .mobile-chevron.open { transform: rotate(90deg); color: var(--accent); }
// // // // // // // .mobile-card-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
// // // // // // // .mobile-card-email { font-size: 0.72rem; color: var(--text-faint); }
// // // // // // // .mobile-card-body { padding: 0 0.85rem 0.9rem; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: 0.4rem; padding-top: 0.75rem; }
// // // // // // // .mobile-chef-chip {
// // // // // // //   display: inline-flex;
// // // // // // //   align-items: center;
// // // // // // //   gap: 0.35rem;
// // // // // // //   padding: 0.35rem 0.6rem;
// // // // // // //   border-radius: 999px;
// // // // // // //   font-size: 0.76rem;
// // // // // // //   font-weight: 600;
// // // // // // //   cursor: pointer;
// // // // // // //   border: 1px solid var(--border);
// // // // // // //   background: var(--surface-2);
// // // // // // //   color: var(--text-muted);
// // // // // // //   transition: border-color 0.12s ease, color 0.12s ease;
// // // // // // // }
// // // // // // // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // // // // // // .empty-state {
// // // // // // //   text-align: center;
// // // // // // //   padding: 3rem 1rem;
// // // // // // //   color: var(--text-muted);
// // // // // // // }

// // // // // // // /* ---------- Modal radar : design moderne, entièrement opaque ---------- */
// // // // // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // // // // .modal-dark .modal-content {
// // // // // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // // // // //   background-color: #12161f !important;
// // // // // // //   opacity: 1 !important;
// // // // // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // // // // //   border-radius: 20px;
// // // // // // //   color: var(--text);
// // // // // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
// // // // // // //   overflow: hidden;
// // // // // // // }
// // // // // // // .modal-dark .modal-header {
// // // // // // //   border-bottom: 1px solid var(--border);
// // // // // // //   background: rgba(45, 212, 191, 0.07);
// // // // // // //   padding: 1.15rem 1.5rem;
// // // // // // // }
// // // // // // // .modal-dark .modal-body {
// // // // // // //   background: transparent;
// // // // // // //   padding: 1.5rem;
// // // // // // // }
// // // // // // // .modal-dark .modal-footer {
// // // // // // //   border-top: 1px solid var(--border);
// // // // // // //   background: rgba(255, 255, 255, 0.02);
// // // // // // //   padding: 0.9rem 1.5rem;
// // // // // // // }
// // // // // // // .modal-dark .modal-title {
// // // // // // //   font-family: 'Space Grotesk', sans-serif;
// // // // // // //   font-weight: 700;
// // // // // // //   font-size: 1.08rem;
// // // // // // //   letter-spacing: -0.01em;
// // // // // // // }
// // // // // // // .modal-dark .btn-close {
// // // // // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // // // // //   opacity: 0.7;
// // // // // // // }
// // // // // // // .modal-dark .btn-close:hover { opacity: 1; }
// // // // // // // .modal-dark .modal-footer .btn-secondary {
// // // // // // //   background: var(--surface-2) !important;
// // // // // // //   border: 1px solid var(--border) !important;
// // // // // // //   border-radius: 999px !important;
// // // // // // //   font-weight: 600 !important;
// // // // // // //   font-size: 0.82rem !important;
// // // // // // //   padding: 0.4rem 1.1rem !important;
// // // // // // //   color: var(--text) !important;
// // // // // // // }
// // // // // // // .modal-dark .modal-footer .btn-secondary:hover { border-color: var(--accent) !important; color: var(--accent) !important; }
// // // // // // // .modal-backdrop.show { opacity: 0.78 !important; }

// // // // // // // @media (max-width: 767px) {
// // // // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // // // //   .bulk-actions { margin-left: 0; }
// // // // // // // }
// // // // // // // `;

// // // // // // // // ============================================================================
// // // // // // // // Sous-composants de présentation
// // // // // // // // ============================================================================

// // // // // // // function ChefHeaderCell({ chef, count, showFullNames }) {
// // // // // // //   return (
// // // // // // //     <th className="chef-head-cell" style={{ minWidth: showFullNames ? 130 : 56 }}>
// // // // // // //       <div className="chef-avatar">{chefInitials(chef.nom)}</div>
// // // // // // //       {showFullNames && (
// // // // // // //         <>
// // // // // // //           <div className="chef-fullname">{chef.nom}</div>
// // // // // // //           {chef.specialite && (
// // // // // // //             <div className="chef-specialite" title={chef.specialite}>{chef.specialite}</div>
// // // // // // //           )}
// // // // // // //         </>
// // // // // // //       )}
// // // // // // //       <div>
// // // // // // //         <Badge bg="secondary" className="chef-count-badge">{count || 0}</Badge>
// // // // // // //       </div>
// // // // // // //     </th>
// // // // // // //   );
// // // // // // // }

// // // // // // // // Le rang (1er, 2e, 3e…) est toujours visible, même avant la sélection.
// // // // // // // // Une fois la case cochée, le badge se remplit de couleur et affiche le signe ✓.
// // // // // // // function SelectionCell({ selected, rankNum, rankInfo, onClick }) {
// // // // // // //   return (
// // // // // // //     <td className="sel-cell" onClick={onClick}>
// // // // // // //       <span
// // // // // // //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// // // // // // //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // // //         title={
// // // // // // //           selected
// // // // // // //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// // // // // // //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// // // // // // //         }
// // // // // // //       >
// // // // // // //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// // // // // // //       </span>
// // // // // // //     </td>
// // // // // // //   );
// // // // // // // }

// // // // // // // function MobileStudentCard({ etud, chefs, selections, studentRanks, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
// // // // // // //   return (
// // // // // // //     <div className="mobile-card">
// // // // // // //       <div className="mobile-card-head" onClick={onToggleExpand}>
// // // // // // //         <span className={`mobile-chevron ${expanded ? 'open' : ''}`}>▶</span>
// // // // // // //         <div style={{ flex: 1, minWidth: 0 }}>
// // // // // // //           <div className="mobile-card-name">{etud.nom} {etud.prenom}</div>
// // // // // // //           <div className="mobile-card-email">{etud.adresse_email}</div>
// // // // // // //         </div>
// // // // // // //         <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // //       </div>
// // // // // // //       {expanded && (
// // // // // // //         <div className="mobile-card-body">
// // // // // // //           <Button
// // // // // // //             size="sm"
// // // // // // //             className="btn-ghost"
// // // // // // //             onClick={(e) => {
// // // // // // //               e.stopPropagation();
// // // // // // //               onOpenRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email);
// // // // // // //             }}
// // // // // // //           >
// // // // // // //             📊 Profil compétences
// // // // // // //           </Button>
// // // // // // //           {chefs.map((chef) => {
// // // // // // //             const key = `${etud.id}-${chef.id}`;
// // // // // // //             const isSelected = selections.has(key);
// // // // // // //             const rankInfo = studentRanks?.get(chef.id);
// // // // // // //             const rankNum = rankInfo?.rank || 1;
// // // // // // //             return (
// // // // // // //               <span
// // // // // // //                 key={chef.id}
// // // // // // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // // // // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // // // // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`}
// // // // // // //               >
// // // // // // //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
// // // // // // //               </span>
// // // // // // //             );
// // // // // // //           })}
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // // ============================================================================
// // // // // // // // Composant principal
// // // // // // // // ============================================================================

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

// // // // // // //   // Sélection automatique (top 3 par appétences) au premier chargement
// // // // // // //   const [autoSelecting, setAutoSelecting] = useState(false);

// // // // // // //   // Réglages d'affichage (purement UI, n'affectent aucune donnée)
// // // // // // //   const [density, setDensity] = useState('compact'); // 'compact' | 'comfortable'
// // // // // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // // // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

// // // // // // //   // Modal Radar
// // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // // //   const [modalError, setModalError] = useState(null);

// // // // // // //   const isMobile = useIsMobile(768);

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

// // // // // // //   // ----------------------------------------------------------------------
// // // // // // //   // Sélection automatique du top 3 (par appétences) au chargement initial.
// // // // // // //   // Ne concerne que les étudiants qui n'ont ENCORE aucune sélection en base :
// // // // // // //   // un étudiant déjà traité (auto ou manuellement) n'est jamais re-touché,
// // // // // // //   // même après un rafraîchissement de la page.
// // // // // // //   // ----------------------------------------------------------------------
// // // // // // //   useEffect(() => {
// // // // // // //     if (loading || chefs.length === 0 || etudiants.length === 0) return;

// // // // // // //     const etudiantsAvecSelection = new Set();
// // // // // // //     initialSelections.forEach((key) => {
// // // // // // //       etudiantsAvecSelection.add(key.split('-')[0]);
// // // // // // //     });

// // // // // // //     const etudiantsASelectionner = etudiants.filter(
// // // // // // //       (e) => !etudiantsAvecSelection.has(String(e.id))
// // // // // // //     );
// // // // // // //     if (etudiantsASelectionner.length === 0) return;

// // // // // // //     let cancelled = false;

// // // // // // //     const autoSelect = async () => {
// // // // // // //       setAutoSelecting(true);
// // // // // // //       const nouvellesCles = [];
// // // // // // //       const enregistrements = [];

// // // // // // //       etudiantsASelectionner.forEach((etud) => {
// // // // // // //         const ranks = appetenceRanksMap.get(etud.id);
// // // // // // //         if (!ranks) return;
// // // // // // //         ranks.forEach((info, chefId) => {
// // // // // // //           if (info.rank <= 3) {
// // // // // // //             nouvellesCles.push(`${etud.id}-${chefId}`);
// // // // // // //             enregistrements.push(saveSelection(etud.id, chefId, info.rank));
// // // // // // //           }
// // // // // // //         });
// // // // // // //       });

// // // // // // //       if (nouvellesCles.length === 0) {
// // // // // // //         if (!cancelled) setAutoSelecting(false);
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       try {
// // // // // // //         await Promise.all(enregistrements);
// // // // // // //         if (!cancelled) {
// // // // // // //           setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // // // // //           setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // // // // //         }
// // // // // // //       } catch (err) {
// // // // // // //         if (!cancelled) setError(err.message || "Erreur lors de la sélection automatique.");
// // // // // // //       } finally {
// // // // // // //         if (!cancelled) setAutoSelecting(false);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     autoSelect();

// // // // // // //     return () => {
// // // // // // //       cancelled = true;
// // // // // // //     };
// // // // // // //     // On ne veut déclencher ce calcul qu'au chargement initial des données
// // // // // // //     // (chefs/étudiants/appétences), jamais en réaction à des sélections
// // // // // // //     // manuelles ultérieures (celles-ci ne changent pas ces dépendances).
// // // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // // //   }, [loading, chefs, etudiants, appetenceRanksMap]);

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

// // // // // // //   // Sélection/désélection manuelle par l'admin. La priorité par défaut (1)
// // // // // // //   // ne s'applique qu'aux nouvelles sélections manuelles hors calcul auto ;
// // // // // // //   // le rang réel affiché reste toujours celui calculé par appetenceRanksMap.
// // // // // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // // // // //     const key = `${etudiantId}-${chefId}`;
// // // // // // //     setSelections((prev) => {
// // // // // // //       const next = new Set(prev);
// // // // // // //       if (next.has(key)) next.delete(key);
// // // // // // //       else next.add(key);
// // // // // // //       return next;
// // // // // // //     });
// // // // // // //     setSuccessMsg(null);
// // // // // // //   }, []);

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
// // // // // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) => {
// // // // // // //         // On conserve le rang par appétence comme priorité lorsqu'il existe,
// // // // // // //         // pour rester cohérent avec les sélections automatiques (P1/P2/P3).
// // // // // // //         const rankInfo = appetenceRanksMap.get(etudiantId)?.get(chefId);
// // // // // // //         return saveSelection(etudiantId, chefId, rankInfo?.rank ?? 1);
// // // // // // //       });

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
// // // // // // //         alert('Aucune donnée disponible.');
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
// // // // // // //         setModalError('Aucune compétence ni appétence enregistrée.');
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

// // // // // // //   const toggleMobileExpand = (id) => {
// // // // // // //     setExpandedMobileIds((prev) => {
// // // // // // //       const next = new Set(prev);
// // // // // // //       if (next.has(id)) next.delete(id);
// // // // // // //       else next.add(id);
// // // // // // //       return next;
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const studentsWithWishes = Object.values(countsPerStudent).filter((c) => c > 0).length;

// // // // // // //   if (loading) {
// // // // // // //     return (
// // // // // // //       <>
// // // // // // //         <Navbar />
// // // // // // //         <style>{STYLE_SHEET}</style>
// // // // // // //         <div className="matrix-page">
// // // // // // //           <div className="text-center py-5" style={{ paddingTop: '8rem' }}>
// // // // // // //             <Spinner animation="border" style={{ color: '#2dd4bf' }} />
// // // // // // //             <p className="mt-3 fw-semibold" style={{ color: '#8b93a5' }}>
// // // // // // //               Chargement de la matrice des sélections...
// // // // // // //             </p>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <Navbar />
// // // // // // //       <style>{STYLE_SHEET}</style>

// // // // // // //       <div className="matrix-page">
// // // // // // //         <div className="matrix-shell">
// // // // // // //           {/* Header */}
// // // // // // //           <div className="matrix-header">
// // // // // // //             <div>
// // // // // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Classement par Appétences</h2>
// // // // // // //               <p className="matrix-subtitle">
// // // // // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// // // // // // //               </p>
// // // // // // //               <p className="matrix-subtitle auto-legend mono">
// // // // // // //                 🎯 Sélection automatique basée sur les appétences (top 3 par étudiant)
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // // //               {autoSelecting && (
// // // // // // //                 <span className="pending-chip auto-chip">
// // // // // // //                   <Spinner size="sm" animation="border" /> Calcul automatique en cours...
// // // // // // //                 </span>
// // // // // // //               )}
// // // // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
// // // // // // //               <Button className="btn-pill btn-export-pill" onClick={handleDownloadSelectionXLSX}>
// // // // // // //                 📊 Exporter (.xlsx)
// // // // // // //               </Button>
// // // // // // //               <Button
// // // // // // //                 className="btn-pill btn-save-pill"
// // // // // // //                 onClick={handleSubmit}
// // // // // // //                 disabled={saving || !hasChanges}
// // // // // // //               >
// // // // // // //                 {saving ? <Spinner size="sm" animation="border" /> : '💾 Enregistrer'}
// // // // // // //               </Button>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // //           {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // //           {/* Toolbar unique : recherche, filtre, stats, réglages, actions groupées */}
// // // // // // //           <div className="matrix-toolbar">
// // // // // // //             <InputGroup size="sm" className="toolbar-search">
// // // // // // //               <Form.Control
// // // // // // //                 placeholder="🔍 Rechercher un étudiant..."
// // // // // // //                 value={searchStudent}
// // // // // // //                 onChange={(e) => setSearchStudent(e.target.value)}
// // // // // // //               />
// // // // // // //               {searchStudent && (
// // // // // // //                 <Button className="btn-ghost" onClick={() => setSearchStudent('')}>✕</Button>
// // // // // // //               )}
// // // // // // //             </InputGroup>

// // // // // // //             <Form.Select
// // // // // // //               size="sm"
// // // // // // //               className="toolbar-select"
// // // // // // //               value={selectedChefFilter}
// // // // // // //               onChange={(e) => setSelectedChefFilter(e.target.value)}
// // // // // // //             >
// // // // // // //               <option value="all">Tous les chefs ({chefs.length})</option>
// // // // // // //               {chefs.map((c) => (
// // // // // // //                 <option key={c.id} value={c.id}>
// // // // // // //                   {c.nom} {c.specialite ? `(${c.specialite})` : ''}
// // // // // // //                 </option>
// // // // // // //               ))}
// // // // // // //             </Form.Select>

// // // // // // //             <div className="toolbar-divider" />

// // // // // // //             <span className="stat-chip accent"><strong>{selections.size}</strong> sélections</span>
// // // // // // //             <span className="stat-chip"><strong>{studentsWithWishes}</strong>/{etudiants.length} avec vœux</span>
// // // // // // //             <span className="stat-chip"><strong>{filteredEtudiants.length}</strong> affichés</span>

// // // // // // //             {!isMobile && (
// // // // // // //               <>
// // // // // // //                 <div className="toolbar-divider" />
// // // // // // //                 <div className="segmented" role="group" aria-label="Densité du tableau">
// // // // // // //                   <button
// // // // // // //                     type="button"
// // // // // // //                     className={density === 'compact' ? 'active' : ''}
// // // // // // //                     onClick={() => setDensity('compact')}
// // // // // // //                   >
// // // // // // //                     Compact
// // // // // // //                   </button>
// // // // // // //                   <button
// // // // // // //                     type="button"
// // // // // // //                     className={density === 'comfortable' ? 'active' : ''}
// // // // // // //                     onClick={() => setDensity('comfortable')}
// // // // // // //                   >
// // // // // // //                     Confortable
// // // // // // //                   </button>
// // // // // // //                 </div>
// // // // // // //                 <div className="segmented" role="group" aria-label="Affichage des noms de chef">
// // // // // // //                   <button
// // // // // // //                     type="button"
// // // // // // //                     className={!showFullNames ? 'active' : ''}
// // // // // // //                     onClick={() => setShowFullNames(false)}
// // // // // // //                   >
// // // // // // //                     Initiales
// // // // // // //                   </button>
// // // // // // //                   <button
// // // // // // //                     type="button"
// // // // // // //                     className={showFullNames ? 'active' : ''}
// // // // // // //                     onClick={() => setShowFullNames(true)}
// // // // // // //                   >
// // // // // // //                     Noms complets
// // // // // // //                   </button>
// // // // // // //                 </div>
// // // // // // //               </>
// // // // // // //             )}

// // // // // // //             <div className="bulk-actions">
// // // // // // //               <Button className="btn-ghost" onClick={handleSelectAllVisible}>Tout cocher</Button>
// // // // // // //               <Button className="btn-ghost" onClick={handleDeselectAllVisible}>Tout décocher</Button>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* Vue mobile : accordéons */}
// // // // // // //           {isMobile ? (
// // // // // // //             filteredEtudiants.length === 0 ? (
// // // // // // //               <div className="empty-state">Aucun étudiant trouvé.</div>
// // // // // // //             ) : (
// // // // // // //               <div className="mobile-list">
// // // // // // //                 {filteredEtudiants.map((etud) => (
// // // // // // //                   <MobileStudentCard
// // // // // // //                     key={etud.id}
// // // // // // //                     etud={etud}
// // // // // // //                     chefs={visibleChefs}
// // // // // // //                     selections={selections}
// // // // // // //                     studentRanks={appetenceRanksMap.get(etud.id)}
// // // // // // //                     expanded={expandedMobileIds.has(etud.id)}
// // // // // // //                     onToggleExpand={() => toggleMobileExpand(etud.id)}
// // // // // // //                     onToggleSelection={toggleSelection}
// // // // // // //                     onOpenRadar={handleOpenStudentRadar}
// // // // // // //                     totalForEtud={countsPerStudent[etud.id] || 0}
// // // // // // //                   />
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             )
// // // // // // //           ) : (
// // // // // // //             /* Vue desktop : tableau matriciel */
// // // // // // //             <div className="table-scroll-container">
// // // // // // //               <Table size="sm" className={`matrix-table ${density} text-center text-nowrap align-middle`}>
// // // // // // //                 <thead>
// // // // // // //                   <tr>
// // // // // // //                     <th
// // // // // // //                       style={{
// // // // // // //                         minWidth: density === 'compact' ? 148 : 190,
// // // // // // //                         maxWidth: density === 'compact' ? 148 : 190,
// // // // // // //                         textAlign: 'left',
// // // // // // //                         position: 'sticky',
// // // // // // //                         left: 0,
// // // // // // //                         top: 0,
// // // // // // //                         backgroundColor: '#0f1420',
// // // // // // //                         zIndex: 20,
// // // // // // //                         paddingLeft: '0.65rem',
// // // // // // //                       }}
// // // // // // //                     >
// // // // // // //                       Étudiant ({filteredEtudiants.length})
// // // // // // //                     </th>
// // // // // // //                     <th style={{ width: 64, position: 'sticky', top: 0, backgroundColor: '#0f1420', zIndex: 10 }}>
// // // // // // //                       Total
// // // // // // //                     </th>
// // // // // // //                     {visibleChefs.map((chef) => (
// // // // // // //                       <ChefHeaderCell
// // // // // // //                         key={chef.id}
// // // // // // //                         chef={chef}
// // // // // // //                         count={countsPerChef[chef.id]}
// // // // // // //                         showFullNames={showFullNames}
// // // // // // //                       />
// // // // // // //                     ))}
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {filteredEtudiants.length === 0 ? (
// // // // // // //                     <tr>
// // // // // // //                       <td colSpan={visibleChefs.length + 2} className="empty-state">
// // // // // // //                         Aucun étudiant trouvé.
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   ) : (
// // // // // // //                     filteredEtudiants.map((etud) => {
// // // // // // //                       const totalForEtud = countsPerStudent[etud.id] || 0;
// // // // // // //                       const studentRanks = appetenceRanksMap.get(etud.id);

// // // // // // //                       return (
// // // // // // //                         <tr key={etud.id}>
// // // // // // //                           <td
// // // // // // //                             className="student-cell"
// // // // // // //                             style={{
// // // // // // //                               textAlign: 'left',
// // // // // // //                               position: 'sticky',
// // // // // // //                               left: 0,
// // // // // // //                               backgroundColor: '#131c2e',
// // // // // // //                               zIndex: 5,
// // // // // // //                               paddingLeft: '0.65rem',
// // // // // // //                               maxWidth: density === 'compact' ? 148 : 190,
// // // // // // //                             }}
// // // // // // //                           >
// // // // // // //                             <div className="student-cell-inner">
// // // // // // //                               <span
// // // // // // //                                 className="student-cell-name"
// // // // // // //                                 title={`${etud.nom} ${etud.prenom} — cliquer pour le profil`}
// // // // // // //                                 onClick={() =>
// // // // // // //                                   handleOpenStudentRadar(etud.id, `${etud.nom} ${etud.prenom}`, etud.adresse_email)
// // // // // // //                                 }
// // // // // // //                               >
// // // // // // //                                 {etud.nom} {etud.prenom}
// // // // // // //                               </span>
// // // // // // //                               {density === 'comfortable' && (
// // // // // // //                                 <div className="student-cell-email" title={etud.adresse_email}>
// // // // // // //                                   {etud.adresse_email}
// // // // // // //                                 </div>
// // // // // // //                               )}
// // // // // // //                               {(etud.cv_path || etud.lm_path) && (
// // // // // // //                                 <div className="d-flex gap-1 mt-1">
// // // // // // //                                   {etud.cv_path && (
// // // // // // //                                     <a
// // // // // // //                                       href={getDocumentPublicUrl(etud.cv_path)}
// // // // // // //                                       target="_blank"
// // // // // // //                                       rel="noopener noreferrer"
// // // // // // //                                       className="doc-badge badge"
// // // // // // //                                       title="CV"
// // // // // // //                                     >
// // // // // // //                                       📄
// // // // // // //                                     </a>
// // // // // // //                                   )}
// // // // // // //                                   {etud.lm_path && (
// // // // // // //                                     <a
// // // // // // //                                       href={getDocumentPublicUrl(etud.lm_path)}
// // // // // // //                                       target="_blank"
// // // // // // //                                       rel="noopener noreferrer"
// // // // // // //                                       className="doc-badge badge"
// // // // // // //                                       title="Lettre de motivation"
// // // // // // //                                     >
// // // // // // //                                       ✉️
// // // // // // //                                     </a>
// // // // // // //                                   )}
// // // // // // //                                 </div>
// // // // // // //                               )}
// // // // // // //                             </div>
// // // // // // //                           </td>

// // // // // // //                           <td style={{ backgroundColor: '#131c2e' }}>
// // // // // // //                             <Badge bg={totalForEtud > 0 ? 'success' : 'dark'}>{totalForEtud}</Badge>
// // // // // // //                           </td>

// // // // // // //                           {visibleChefs.map((chef) => {
// // // // // // //                             const key = `${etud.id}-${chef.id}`;
// // // // // // //                             const isSelected = selections.has(key);
// // // // // // //                             const rankInfo = studentRanks?.get(chef.id);
// // // // // // //                             const rankNum = rankInfo?.rank || 1;

// // // // // // //                             return (
// // // // // // //                               <SelectionCell
// // // // // // //                                 key={chef.id}
// // // // // // //                                 selected={isSelected}
// // // // // // //                                 rankNum={rankNum}
// // // // // // //                                 rankInfo={rankInfo}
// // // // // // //                                 onClick={() => toggleSelection(etud.id, chef.id)}
// // // // // // //                               />
// // // // // // //                             );
// // // // // // //                           })}
// // // // // // //                         </tr>
// // // // // // //                       );
// // // // // // //                     })
// // // // // // //                   )}
// // // // // // //                 </tbody>
// // // // // // //               </Table>
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* Modal Radar */}
// // // // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark" backdropClassName="modal-dark-backdrop">
// // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // //           <Modal.Title>📊 Profil Compétences : {selectedEtudiantInfo?.nom}</Modal.Title>
// // // // // // //         </Modal.Header>
// // // // // // //         <Modal.Body style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // // //           {modalLoading ? (
// // // // // // //             <div className="text-center py-5"><Spinner animation="border" style={{ color: '#2dd4bf' }} /></div>
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
// // // // // //   resetAllSelections,
// // // // // //   fetchAllApetences,
// // // // // //   fetchAptitudesByEtudiant,
// // // // // //   fetchApetencesByEtudiant,
// // // // // //   computeChefRanksForStudent,
// // // // // //   getDocumentPublicUrl,
// // // // // // } from '../services/supabase';

// // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // // ============================================================================
// // // // // // // Constantes & helpers métier
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

// // // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // // ============================================================================
// // // // // // // Hook responsive
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
// // // // // // .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

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

// // // // // // .btn-danger-pill {
// // // // // //   background: rgba(239, 68, 68, 0.14) !important;
// // // // // //   color: #f87171 !important;
// // // // // //   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // // // }
// // // // // // .btn-danger-pill:hover:not(:disabled) {
// // // // // //   background: #dc2626 !important;
// // // // // //   color: #ffffff !important;
// // // // // //   border-color: #dc2626 !important;
// // // // // // }
// // // // // // .btn-danger-pill:disabled { opacity: 0.4; }

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
// // // // // // .pending-chip.auto-chip {
// // // // // //   background: rgba(45, 212, 191, 0.14);
// // // // // //   color: #2dd4bf;
// // // // // //   border: 1px solid rgba(45, 212, 191, 0.35);
// // // // // // }

// // // // // // /* ---------- Toolbar unique ---------- */
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

// // // // // // /* ---------- Cellule de sélection ---------- */
// // // // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // // // .badge-rank-selection {
// // // // // //   display: inline-flex;
// // // // // //   align-items: center;
// // // // // //   gap: 4px;
// // // // // //   min-width: 34px;
// // // // // //   justify-content: center;
// // // // // //   padding: 3px 9px;
// // // // // //   border-radius: 7px;
// // // // // //   font-weight: 700;
// // // // // //   font-size: 0.74rem;
// // // // // //   pointer-events: none;
// // // // // //   transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease;
// // // // // // }
// // // // // // .badge-rank-selection.is-pending {
// // // // // //   background: transparent;
// // // // // //   border: 1px dashed var(--border);
// // // // // //   color: var(--text-faint);
// // // // // //   opacity: 0.75;
// // // // // // }
// // // // // // .sel-cell:hover .badge-rank-selection.is-pending {
// // // // // //   opacity: 1;
// // // // // //   border-color: var(--accent);
// // // // // //   color: var(--accent);
// // // // // //   transform: translateY(-1px);
// // // // // // }
// // // // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // // // /* ---------- Vue mobile ---------- */
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
// // // // // //   transition: border-color 0.12s ease, color 0.12s ease;
// // // // // // }
// // // // // // .mobile-chef-chip:not(.is-selected):hover { border-color: var(--accent); color: var(--accent); }

// // // // // // .empty-state {
// // // // // //   text-align: center;
// // // // // //   padding: 3rem 1rem;
// // // // // //   color: var(--text-muted);
// // // // // // }

// // // // // // /* ---------- Modals Dark ---------- */
// // // // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // // // .modal-dark .modal-content {
// // // // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // // // //   background-color: #12161f !important;
// // // // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // // // //   border-radius: 20px;
// // // // // //   color: var(--text);
// // // // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
// // // // // //   overflow: hidden;
// // // // // // }
// // // // // // .modal-dark .modal-header {
// // // // // //   border-bottom: 1px solid var(--border);
// // // // // //   background: rgba(45, 212, 191, 0.07);
// // // // // //   padding: 1.15rem 1.5rem;
// // // // // // }
// // // // // // .modal-dark .modal-header.danger-header {
// // // // // //   background: rgba(239, 68, 68, 0.12);
// // // // // //   border-bottom-color: rgba(239, 68, 68, 0.25);
// // // // // // }
// // // // // // .modal-dark .modal-body {
// // // // // //   padding: 1.5rem;
// // // // // // }
// // // // // // .modal-dark .modal-footer {
// // // // // //   border-top: 1px solid var(--border);
// // // // // //   padding: 0.9rem 1.5rem;
// // // // // // }
// // // // // // .modal-dark .btn-close {
// // // // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // // // //   opacity: 0.7;
// // // // // // }

// // // // // // @media (max-width: 767px) {
// // // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // // //   .bulk-actions { margin-left: 0; }
// // // // // // }
// // // // // // `;

// // // // // // // ============================================================================
// // // // // // // Sous-composants
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
// // // // // //       <span
// // // // // //         className={`badge-rank-selection ${selected ? 'is-selected' : 'is-pending'}`}
// // // // // //         style={selected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // //         title={
// // // // // //           selected
// // // // // //             ? `Cliquer pour retirer (${rankLabel(rankNum)} choix, note ${rankInfo?.score ?? 0}/4)`
// // // // // //             : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix par appétence)`
// // // // // //         }
// // // // // //       >
// // // // // //         {selected ? '✓ ' : ''}{rankLabel(rankNum)}
// // // // // //       </span>
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
// // // // // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // // // // //                 style={isSelected ? getRankBadgeStyle(rankNum) : undefined}
// // // // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // // // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix)`}
// // // // // //               >
// // // // // //                 {isSelected ? '✓ ' : ''}{chef.nom} · {rankLabel(rankNum)}
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

// // // // // //   const [selections, setSelections] = useState(new Set());
// // // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [saving, setSaving] = useState(false);
// // // // // //   const [error, setError] = useState(null);
// // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // //   // État Réinitialisation (Reset modal)
// // // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // // //   const [resetting, setResetting] = useState(false);

// // // // // //   // Sélection automatique (top 3)
// // // // // //   const [autoSelecting, setAutoSelecting] = useState(false);

// // // // // //   // Réglages d'affichage
// // // // // //   const [density, setDensity] = useState('compact');
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

// // // // // //   // Sélection automatique (top 3) pour les étudiants n'ayant aucun vœu
// // // // // //   useEffect(() => {
// // // // // //     if (loading || chefs.length === 0 || etudiants.length === 0) return;

// // // // // //     const etudiantsAvecSelection = new Set();
// // // // // //     initialSelections.forEach((key) => {
// // // // // //       etudiantsAvecSelection.add(key.split('-')[0]);
// // // // // //     });

// // // // // //     const etudiantsASelectionner = etudiants.filter(
// // // // // //       (e) => !etudiantsAvecSelection.has(String(e.id))
// // // // // //     );
// // // // // //     if (etudiantsASelectionner.length === 0) return;

// // // // // //     let cancelled = false;

// // // // // //     const autoSelect = async () => {
// // // // // //       setAutoSelecting(true);
// // // // // //       const nouvellesCles = [];
// // // // // //       const enregistrements = [];

// // // // // //       etudiantsASelectionner.forEach((etud) => {
// // // // // //         const ranks = appetenceRanksMap.get(etud.id);
// // // // // //         if (!ranks) return;
// // // // // //         ranks.forEach((info, chefId) => {
// // // // // //           if (info.rank <= 3) {
// // // // // //             nouvellesCles.push(`${etud.id}-${chefId}`);
// // // // // //             enregistrements.push(saveSelection(etud.id, chefId));
// // // // // //           }
// // // // // //         });
// // // // // //       });

// // // // // //       if (nouvellesCles.length === 0) {
// // // // // //         if (!cancelled) setAutoSelecting(false);
// // // // // //         return;
// // // // // //       }

// // // // // //       try {
// // // // // //         await Promise.all(enregistrements);
// // // // // //         if (!cancelled) {
// // // // // //           setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // // // //           setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         if (!cancelled) setError(err.message || 'Erreur sélection automatique.');
// // // // // //       } finally {
// // // // // //         if (!cancelled) setAutoSelecting(false);
// // // // // //       }
// // // // // //     };

// // // // // //     autoSelect();

// // // // // //     return () => {
// // // // // //       cancelled = true;
// // // // // //     };
// // // // // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // // // // //   }, [loading, chefs, etudiants, appetenceRanksMap]);

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

// // // // // //   // Action de Réinitialisation complète des sélections
// // // // // //   const handleResetSelections = async () => {
// // // // // //     try {
// // // // // //       setResetting(true);
// // // // // //       setError(null);
// // // // // //       await resetAllSelections();
// // // // // //       setSelections(new Set());
// // // // // //       setInitialSelections(new Set());
// // // // // //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// // // // // //       setShowResetModal(false);
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// // // // // //     } finally {
// // // // // //       setResetting(false);
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
// // // // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé automatiquement d'après les appétences de l'étudiant, et reste visible même avant de cocher.
// // // // // //               </p>
// // // // // //               <p className="matrix-subtitle auto-legend mono">
// // // // // //                 🎯 Sélection automatique basée sur les appétences (top 3 par étudiant)
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // //               {autoSelecting && (
// // // // // //                 <span className="pending-chip auto-chip">
// // // // // //                   <Spinner size="sm" animation="border" /> Calcul automatique en cours...
// // // // // //                 </span>
// // // // // //               )}
// // // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}
              
// // // // // //               {/* Bouton Réinitialiser / Vider */}
// // // // // //               <Button
// // // // // //                 className="btn-pill btn-danger-pill"
// // // // // //                 onClick={() => setShowResetModal(true)}
// // // // // //                 disabled={selections.size === 0 || resetting}
// // // // // //                 title="Supprimer toutes les sélections pour repartir de zéro"
// // // // // //               >
// // // // // //                 🗑️ Vider tout ({selections.size})
// // // // // //               </Button>

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

// // // // // //           {/* Toolbar unique */}
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

// // // // // //           {/* Vue mobile */}
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
// // // // // //             /* Vue desktop */
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

// // // // // //       {/* Modal Confirmation Réinitialisation Sélections */}
// // // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// // // // // //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// // // // // //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// // // // // //         </Modal.Header>
// // // // // //         <Modal.Body>
// // // // // //           <p>
// // // // // //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selections.size} vœux)</strong> de la base de données ?
// // // // // //           </p>
// // // // // //           <p className="text-muted small mb-0">
// // // // // //             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
// // // // // //           </p>
// // // // // //         </Modal.Body>
// // // // // //         <Modal.Footer>
// // // // // //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // // //             Annuler
// // // // // //           </Button>
// // // // // //           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
// // // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
// // // // // //           </Button>
// // // // // //         </Modal.Footer>
// // // // // //       </Modal>

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
// // // // //   resetAllSelections,
// // // // //   fetchAllApetences,
// // // // //   fetchAptitudesByEtudiant,
// // // // //   fetchApetencesByEtudiant,
// // // // //   computeChefRanksForStudent,
// // // // //   getDocumentPublicUrl,
// // // // // } from '../services/supabase';

// // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // // ============================================================================
// // // // // // Constantes & helpers métier
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

// // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

// // // // // // ============================================================================
// // // // // // Hook responsive
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
// // // // // .matrix-subtitle.auto-legend { color: var(--accent); font-weight: 600; display: flex; align-items: center; gap: 0.4rem; }

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

// // // // // .btn-danger-pill {
// // // // //   background: rgba(239, 68, 68, 0.14) !important;
// // // // //   color: #f87171 !important;
// // // // //   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // // }
// // // // // .btn-danger-pill:hover:not(:disabled) {
// // // // //   background: #dc2626 !important;
// // // // //   color: #ffffff !important;
// // // // //   border-color: #dc2626 !important;
// // // // // }
// // // // // .btn-danger-pill:disabled { opacity: 0.4; }

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
// // // // // .pending-chip.auto-chip {
// // // // //   background: rgba(45, 212, 191, 0.14);
// // // // //   color: #2dd4bf;
// // // // //   border: 1px solid rgba(45, 212, 191, 0.35);
// // // // // }

// // // // // /* ---------- Toolbar unique ---------- */
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

// // // // // /* ---------- Cellule de sélection ---------- */
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
// // // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // // /* ---------- Vue mobile ---------- */
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

// // // // // /* ---------- Modals Dark ---------- */
// // // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // // .modal-dark .modal-content {
// // // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // // //   background-color: #12161f !important;
// // // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // // //   border-radius: 20px;
// // // // //   color: var(--text);
// // // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
// // // // //   overflow: hidden;
// // // // // }
// // // // // .modal-dark .modal-header {
// // // // //   border-bottom: 1px solid var(--border);
// // // // //   background: rgba(45, 212, 191, 0.07);
// // // // //   padding: 1.15rem 1.5rem;
// // // // // }
// // // // // .modal-dark .modal-header.danger-header {
// // // // //   background: rgba(239, 68, 68, 0.12);
// // // // //   border-bottom-color: rgba(239, 68, 68, 0.25);
// // // // // }
// // // // // .modal-dark .modal-body {
// // // // //   padding: 1.5rem;
// // // // // }
// // // // // .modal-dark .modal-footer {
// // // // //   border-top: 1px solid var(--border);
// // // // //   padding: 0.9rem 1.5rem;
// // // // // }
// // // // // .modal-dark .btn-close {
// // // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // // //   opacity: 0.7;
// // // // // }

// // // // // @media (max-width: 767px) {
// // // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // // //   .bulk-actions { margin-left: 0; }
// // // // // }
// // // // // `;

// // // // // // ============================================================================
// // // // // // Sous-composants
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
// // // // //                 title={isSelected ? `Cliquer pour retirer (${rankLabel(rankNum)} choix)` : `Cliquer pour sélectionner (${rankLabel(rankNum)} choix)`}
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

// // // // //   const [selections, setSelections] = useState(new Set());
// // // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // // //   const [searchStudent, setSearchStudent] = useState('');
// // // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [saving, setSaving] = useState(false);
// // // // //   const [error, setError] = useState(null);
// // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // //   // État Réinitialisation (Reset modal)
// // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // //   const [resetting, setResetting] = useState(false);

// // // // //   // Sélection automatique (top 3) — désormais déclenchée manuellement par bouton
// // // // //   const [autoSelecting, setAutoSelecting] = useState(false);

// // // // //   // Réglages d'affichage
// // // // //   const [density, setDensity] = useState('compact');
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

// // // // //   // Sélection automatique (top 3) pour les étudiants n'ayant aucun vœu.
// // // // //   // Ne s'exécute plus automatiquement au chargement de la page : c'est le
// // // // //   // bouton "Sélection auto (top 3)" du header qui déclenche cette action.
// // // // //   const handleAutoSelectTop3 = useCallback(async () => {
// // // // //     if (chefs.length === 0 || etudiants.length === 0) return;

// // // // //     const etudiantsAvecSelection = new Set();
// // // // //     initialSelections.forEach((key) => {
// // // // //       etudiantsAvecSelection.add(key.split('-')[0]);
// // // // //     });

// // // // //     const etudiantsASelectionner = etudiants.filter(
// // // // //       (e) => !etudiantsAvecSelection.has(String(e.id))
// // // // //     );

// // // // //     if (etudiantsASelectionner.length === 0) {
// // // // //       setSuccessMsg('ℹ️ Tous les étudiants ont déjà au moins un vœu, rien à sélectionner automatiquement.');
// // // // //       return;
// // // // //     }

// // // // //     setAutoSelecting(true);
// // // // //     setError(null);
// // // // //     setSuccessMsg(null);

// // // // //     const nouvellesCles = [];
// // // // //     const enregistrements = [];

// // // // //     etudiantsASelectionner.forEach((etud) => {
// // // // //       const ranks = appetenceRanksMap.get(etud.id);
// // // // //       if (!ranks) return;
// // // // //       ranks.forEach((info, chefId) => {
// // // // //         if (info.rank <= 3) {
// // // // //           nouvellesCles.push(`${etud.id}-${chefId}`);
// // // // //           enregistrements.push(saveSelection(etud.id, chefId));
// // // // //         }
// // // // //       });
// // // // //     });

// // // // //     if (nouvellesCles.length === 0) {
// // // // //       setAutoSelecting(false);
// // // // //       return;
// // // // //     }

// // // // //     try {
// // // // //       await Promise.all(enregistrements);
// // // // //       setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // // //       setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // // //       setSuccessMsg(
// // // // //         `🎯 Sélection automatique effectuée pour ${etudiantsASelectionner.length} étudiant(s) (${nouvellesCles.length} vœu(x) ajouté(s)).`
// // // // //       );
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'Erreur sélection automatique.');
// // // // //     } finally {
// // // // //       setAutoSelecting(false);
// // // // //     }
// // // // //   }, [chefs, etudiants, initialSelections, appetenceRanksMap]);

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

// // // // //   // Action de Réinitialisation complète des sélections
// // // // //   const handleResetSelections = async () => {
// // // // //     try {
// // // // //       setResetting(true);
// // // // //       setError(null);
// // // // //       await resetAllSelections();
// // // // //       setSelections(new Set());
// // // // //       setInitialSelections(new Set());
// // // // //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// // // // //       setShowResetModal(false);
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// // // // //     } finally {
// // // // //       setResetting(false);
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
// // // // //               <p className="matrix-subtitle auto-legend mono">
// // // // //                 🎯 Sélection automatique basée sur les appétences (top 3 par étudiant)
// // // // //               </p>
// // // // //             </div>

// // // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // //               {autoSelecting && (
// // // // //                 <span className="pending-chip auto-chip">
// // // // //                   <Spinner size="sm" animation="border" /> Calcul automatique en cours...
// // // // //                 </span>
// // // // //               )}
// // // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

// // // // //               {/* Bouton Sélection automatique (top 3 par appétence) — déclenchement manuel */}
// // // // //               <Button
// // // // //                 className="btn-pill btn-export-pill"
// // // // //                 onClick={handleAutoSelectTop3}
// // // // //                 disabled={autoSelecting}
// // // // //                 title="Sélectionner automatiquement le top 3 (par appétence) pour les étudiants n'ayant encore aucun vœu"
// // // // //               >
// // // // //                 {autoSelecting ? <Spinner size="sm" animation="border" /> : '🎯 Sélection auto (top 3)'}
// // // // //               </Button>

// // // // //               {/* Bouton Réinitialiser / Vider */}
// // // // //               <Button
// // // // //                 className="btn-pill btn-danger-pill"
// // // // //                 onClick={() => setShowResetModal(true)}
// // // // //                 disabled={selections.size === 0 || resetting}
// // // // //                 title="Supprimer toutes les sélections pour repartir de zéro"
// // // // //               >
// // // // //                 🗑️ Vider tout ({selections.size})
// // // // //               </Button>

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

// // // // //           {/* Toolbar unique */}
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

// // // // //           {/* Vue mobile */}
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
// // // // //             /* Vue desktop */
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

// // // // //       {/* Modal Confirmation Réinitialisation Sélections */}
// // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// // // // //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// // // // //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// // // // //         </Modal.Header>
// // // // //         <Modal.Body>
// // // // //           <p>
// // // // //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selections.size} vœux)</strong> de la base de données ?
// // // // //           </p>
// // // // //           <p className="text-muted small mb-0">
// // // // //             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
// // // // //           </p>
// // // // //         </Modal.Body>
// // // // //         <Modal.Footer>
// // // // //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // //             Annuler
// // // // //           </Button>
// // // // //           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
// // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
// // // // //           </Button>
// // // // //         </Modal.Footer>
// // // // //       </Modal>

// // // // //       {/* Modal Radar */}
// // // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
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
// // // //   resetAllSelections,
// // // //   fetchAllApetences,
// // // //   fetchReferentielCompetences,
// // // //   fetchAptitudesByEtudiant,
// // // //   fetchApetencesByEtudiant,
// // // //   computeChefRanksForStudent,
// // // //   getDocumentPublicUrl,
// // // // } from '../services/supabase';

// // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // ============================================================================
// // // // // Helpers visuels
// // // // // ============================================================================

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

// // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();

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

// // // // .btn-danger-pill {
// // // //   background: rgba(239, 68, 68, 0.14) !important;
// // // //   color: #f87171 !important;
// // // //   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // }
// // // // .btn-danger-pill:hover:not(:disabled) {
// // // //   background: #dc2626 !important;
// // // //   color: #ffffff !important;
// // // //   border-color: #dc2626 !important;
// // // // }
// // // // .btn-danger-pill:disabled { opacity: 0.4; }

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
// // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: translateY(-1px); }

// // // // /* Vue mobile */
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

// // // // /* Modals Dark */
// // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // .modal-dark .modal-content {
// // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // //   background-color: #12161f !important;
// // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // //   border-radius: 20px;
// // // //   color: var(--text);
// // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
// // // //   overflow: hidden;
// // // // }
// // // // .modal-dark .modal-header {
// // // //   border-bottom: 1px solid var(--border);
// // // //   background: rgba(45, 212, 191, 0.07);
// // // //   padding: 1.15rem 1.5rem;
// // // // }
// // // // .modal-dark .modal-header.danger-header {
// // // //   background: rgba(239, 68, 68, 0.12);
// // // //   border-bottom-color: rgba(239, 68, 68, 0.25);
// // // // }
// // // // .modal-dark .modal-body {
// // // //   padding: 1.5rem;
// // // // }
// // // // .modal-dark .modal-footer {
// // // //   border-top: 1px solid var(--border);
// // // //   padding: 0.9rem 1.5rem;
// // // // }
// // // // .modal-dark .btn-close {
// // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // //   opacity: 0.7;
// // // // }

// // // // @media (max-width: 767px) {
// // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // //   .bulk-actions { margin-left: 0; }
// // // // }
// // // // `;

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

// // // // export default function SelectionPage() {
// // // //   const [chefs, setChefs] = useState([]);
// // // //   const [etudiants, setEtudiants] = useState([]);
// // // //   const [apetencesList, setApetencesList] = useState([]);
// // // //   const [referentielCompetences, setReferentielCompetences] = useState([]);

// // // //   const [selections, setSelections] = useState(new Set());
// // // //   const [initialSelections, setInitialSelections] = useState(new Set());

// // // //   const [searchStudent, setSearchStudent] = useState('');
// // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // //   const [loading, setLoading] = useState(true);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState(null);
// // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // //   const [resetting, setResetting] = useState(false);
// // // //   const [autoSelecting, setAutoSelecting] = useState(false);

// // // //   const [density, setDensity] = useState('compact');
// // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

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

// // // //       const [chefsData, etudiantsData, selectionsData, apetencesDataRaw, refCompsData] = await Promise.all([
// // // //         fetchChefsDeProjet(),
// // // //         fetchEtudiants(),
// // // //         fetchSelections(),
// // // //         fetchAllApetences(),
// // // //         fetchReferentielCompetences(true),
// // // //       ]);

// // // //       setChefs(chefsData || []);
// // // //       setEtudiants(etudiantsData || []);
// // // //       setApetencesList(apetencesDataRaw || []);
// // // //       setReferentielCompetences(refCompsData || []);

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

// // // //   // Map dynamique des rangs d'appétence avec référentiel actif
// // // //   const appetenceRanksMap = useMemo(() => {
// // // //     const map = new Map();
// // // //     const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

// // // //     etudiants.forEach((etud) => {
// // // //       const etudAp = apetencesByEtud.get(etud.id);
// // // //       const ranks = computeChefRanksForStudent(etudAp, chefs, referentielCompetences);
// // // //       map.set(etud.id, ranks);
// // // //     });

// // // //     return map;
// // // //   }, [apetencesList, etudiants, chefs, referentielCompetences]);

// // // //   // Sélection automatique manuelle (top 3)
// // // //   const handleAutoSelectTop3 = useCallback(async () => {
// // // //     if (chefs.length === 0 || etudiants.length === 0) return;

// // // //     const etudiantsAvecSelection = new Set();
// // // //     initialSelections.forEach((key) => {
// // // //       etudiantsAvecSelection.add(key.split('-')[0]);
// // // //     });

// // // //     const etudiantsASelectionner = etudiants.filter(
// // // //       (e) => !etudiantsAvecSelection.has(String(e.id))
// // // //     );

// // // //     if (etudiantsASelectionner.length === 0) {
// // // //       setSuccessMsg('ℹ️ Tous les étudiants ont déjà au moins un vœu.');
// // // //       return;
// // // //     }

// // // //     setAutoSelecting(true);
// // // //     setError(null);
// // // //     setSuccessMsg(null);

// // // //     const nouvellesCles = [];
// // // //     const enregistrements = [];

// // // //     etudiantsASelectionner.forEach((etud) => {
// // // //       const ranks = appetenceRanksMap.get(etud.id);
// // // //       if (!ranks) return;
// // // //       ranks.forEach((info, chefId) => {
// // // //         if (info.rank <= 3) {
// // // //           nouvellesCles.push(`${etud.id}-${chefId}`);
// // // //           enregistrements.push(saveSelection(etud.id, chefId));
// // // //         }
// // // //       });
// // // //     });

// // // //     if (nouvellesCles.length === 0) {
// // // //       setAutoSelecting(false);
// // // //       return;
// // // //     }

// // // //     try {
// // // //       await Promise.all(enregistrements);
// // // //       setSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // //       setInitialSelections((prev) => new Set([...prev, ...nouvellesCles]));
// // // //       setSuccessMsg(
// // // //         ` Sélection automatique effectuée pour ${etudiantsASelectionner.length} étudiant(s) (${nouvellesCles.length} vœu(x)).`
// // // //       );
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur sélection automatique.');
// // // //     } finally {
// // // //       setAutoSelecting(false);
// // // //     }
// // // //   }, [chefs, etudiants, initialSelections, appetenceRanksMap]);

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
// // // //       const addPromises = toAdd.map(({ etudiantId, chefId }) =>
// // // //         saveSelection(etudiantId, chefId)
// // // //       );

// // // //       await Promise.all([...deletePromises, ...addPromises]);

// // // //       setInitialSelections(new Set(selections));
// // // //       setSuccessMsg(
// // // //         ` Sélections enregistrées (${toAdd.length} ajout(s), ${toDelete.length} suppression(s)).`
// // // //       );
// // // //     } catch (err) {
// // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const handleResetSelections = async () => {
// // // //     try {
// // // //       setResetting(true);
// // // //       setError(null);
// // // //       await resetAllSelections();
// // // //       setSelections(new Set());
// // // //       setInitialSelections(new Set());
// // // //       setSuccessMsg('Toutes les sélections ont été réinitialisées avec succès.');
// // // //       setShowResetModal(false);
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// // // //     } finally {
// // // //       setResetting(false);
// // // //     }
// // // //   };

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

// // // //   // Génération dynamique des axes du Radar d'après les compétences actives
// // // //   const radarChartData = useMemo(() => {
// // // //     const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
// // // //     const labels = activeComps.map((c) => c.label);
// // // //     const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
// // // //     const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);

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
// // // //   }, [referentielCompetences, aptitudesData, apetencesData]);

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
// // // //               <h2 className="matrix-title display">Sélections &amp; Classement par Appétences</h2>
// // // //               <p className="matrix-subtitle">
// // // //                 Le rang de chaque chef (1er, 2e, 3e…) est calculé dynamiquement d'après les appétences actives ({referentielCompetences.length} compétences).
// // // //               </p>
// // // //               <p className="matrix-subtitle auto-legend mono">
// // // //                  Sélection manuelle ou assistée par appétences
// // // //               </p>
// // // //             </div>

// // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // //               {autoSelecting && (
// // // //                 <span className="pending-chip auto-chip">
// // // //                   <Spinner size="sm" animation="border" /> Calcul en cours...
// // // //                 </span>
// // // //               )}
// // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

// // // //               <Button
// // // //                 className="btn-pill btn-export-pill"
// // // //                 onClick={handleAutoSelectTop3}
// // // //                 disabled={autoSelecting}
// // // //                 title="Sélectionner automatiquement le top 3 (par appétence) pour les étudiants n'ayant encore aucun vœu"
// // // //               >
// // // //                 {autoSelecting ? <Spinner size="sm" animation="border" /> : 'Sélection auto (top 3)'}
// // // //               </Button>

// // // //               <Button
// // // //                 className="btn-pill btn-danger-pill"
// // // //                 onClick={() => setShowResetModal(true)}
// // // //                 disabled={selections.size === 0 || resetting}
// // // //                 title="Supprimer toutes les sélections pour repartir de zéro"
// // // //               >
// // // //                  Vider tout ({selections.size})
// // // //               </Button>

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

// // // //           {/* Toolbar unique */}
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

// // // //           {/* Vue mobile */}
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
// // // //             /* Vue desktop */
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

// // // //       {/* Modal Confirmation Réinitialisation Sélections */}
// // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// // // //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// // // //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// // // //         </Modal.Header>
// // // //         <Modal.Body>
// // // //           <p>
// // // //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selections.size} vœux)</strong> de la base de données ?
// // // //           </p>
// // // //           <p className="text-muted small mb-0">
// // // //             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
// // // //           </p>
// // // //         </Modal.Body>
// // // //         <Modal.Footer>
// // // //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // //             Annuler
// // // //           </Button>
// // // //           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
// // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
// // // //           </Button>
// // // //         </Modal.Footer>
// // // //       </Modal>

// // // //       {/* Modal Radar Dynamique */}
// // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
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
// // // //   resetAllSelections,
// // // //   fetchReferentielCompetences,
// // // //   fetchAptitudesByEtudiant,
// // // //   fetchApetencesByEtudiant,
// // // //   getDocumentPublicUrl,
// // // // } from '../services/supabase';

// // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // // ============================================================================
// // // // // Helpers visuels
// // // // // ============================================================================

// // // // const getRankBadgeStyle = (rank) => {
// // // //   switch (Number(rank)) {
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

// // // // const rankLabel = (rank) => (Number(rank) === 1 ? '1er' : `${rank}e`);

// // // // // const chefInitials = (nom = '') => nom.replace(/\s+/g, '').slice(0, 4).toUpperCase();
// // // // const chefInitials = (nom = '') =>
// // // //   nom
// // // //     .replace(/Ã©/gi, 'E')
// // // //     .replace(/Ã/gi, 'A')
// // // //     .replace(/\s+/g, '')
// // // //     .slice(0, 4)
// // // //     .toUpperCase();
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

// // // // .btn-danger-pill {
// // // //   background: rgba(239, 68, 68, 0.14) !important;
// // // //   color: #f87171 !important;
// // // //   border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // }
// // // // .btn-danger-pill:hover:not(:disabled) {
// // // //   background: #dc2626 !important;
// // // //   color: #ffffff !important;
// // // //   border-color: #dc2626 !important;
// // // // }
// // // // .btn-danger-pill:disabled { opacity: 0.4; }

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

// // // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // // .badge-rank-selection {
// // // //   display: inline-flex;
// // // //   align-items: center;
// // // //   gap: 4px;
// // // //   min-width: 38px;
// // // //   justify-content: center;
// // // //   padding: 3px 8px;
// // // //   border-radius: 7px;
// // // //   font-weight: 700;
// // // //   font-size: 0.74rem;
// // // //   user-select: none;
// // // //   transition: transform 0.12s ease;
// // // // }
// // // // .badge-rank-selection.is-pending {
// // // //   background: transparent;
// // // //   border: 1px dashed var(--border);
// // // //   color: var(--text-faint);
// // // //   opacity: 0.5;
// // // // }
// // // // .sel-cell:hover .badge-rank-selection.is-pending {
// // // //   opacity: 1;
// // // //   border-color: var(--accent);
// // // //   color: var(--accent);
// // // //   transform: scale(1.15);
// // // // }
// // // // .badge-rank-selection.is-selected { border-style: solid; }
// // // // .sel-cell:hover .badge-rank-selection.is-selected { transform: scale(1.08); }

// // // // /* Vue mobile */
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

// // // // /* Modals Dark */
// // // // .modal-dark .modal-dialog { --bs-modal-width: 560px; }
// // // // .modal-dark .modal-content {
// // // //   background: linear-gradient(180deg, #171d29 0%, #10141c 100%) !important;
// // // //   background-color: #12161f !important;
// // // //   border: 1px solid rgba(45, 212, 191, 0.22);
// // // //   border-radius: 20px;
// // // //   color: var(--text);
// // // //   box-shadow: 0 30px 70px -20px rgba(0, 0, 0, 0.7);
// // // //   overflow: hidden;
// // // // }
// // // // .modal-dark .modal-header {
// // // //   border-bottom: 1px solid var(--border);
// // // //   background: rgba(45, 212, 191, 0.07);
// // // //   padding: 1.15rem 1.5rem;
// // // // }
// // // // .modal-dark .modal-header.danger-header {
// // // //   background: rgba(239, 68, 68, 0.12);
// // // //   border-bottom-color: rgba(239, 68, 68, 0.25);
// // // // }
// // // // .modal-dark .modal-body {
// // // //   padding: 1.5rem;
// // // // }
// // // // .modal-dark .modal-footer {
// // // //   border-top: 1px solid var(--border);
// // // //   padding: 0.9rem 1.5rem;
// // // // }
// // // // .modal-dark .btn-close {
// // // //   filter: invert(1) grayscale(100%) brightness(1.6);
// // // //   opacity: 0.7;
// // // // }

// // // // @media (max-width: 767px) {
// // // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // // //   .bulk-actions { margin-left: 0; }
// // // // }
// // // // `;

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

// // // // function SelectionCell({ selected, rankNum, onClick }) {
// // // //   return (
// // // //     <td className="sel-cell" onClick={onClick}>
// // // //       {selected ? (
// // // //         <span
// // // //           className="badge-rank-selection is-selected"
// // // //           style={getRankBadgeStyle(rankNum)}
// // // //           title={`Vœu ${rankLabel(rankNum)} — cliquer pour retirer`}
// // // //         >
// // // //           ✓ {rankLabel(rankNum)}
// // // //         </span>
// // // //       ) : (
// // // //         <span className="badge-rank-selection is-pending" title="Cliquer pour ajouter comme vœu">
// // // //           +
// // // //         </span>
// // // //       )}
// // // //     </td>
// // // //   );
// // // // }

// // // // function MobileStudentCard({ etud, chefs, selectionsMap, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
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
// // // //             const prio = selectionsMap.get(key);
// // // //             const isSelected = Boolean(prio);
// // // //             return (
// // // //               <span
// // // //                 key={chef.id}
// // // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // // //                 style={isSelected ? getRankBadgeStyle(prio) : undefined}
// // // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // // //               >
// // // //                 {isSelected ? `✓ ${chef.nom} · ${rankLabel(prio)}` : `+ ${chef.nom}`}
// // // //               </span>
// // // //             );
// // // //           })}
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default function SelectionPage() {
// // // //   const [chefs, setChefs] = useState([]);
// // // //   const [etudiants, setEtudiants] = useState([]);
// // // //   const [referentielCompetences, setReferentielCompetences] = useState([]);

// // // //   // Map "etudiantId-chefId" => priorite (1, 2, 3...)
// // // //   const [selectionsMap, setSelectionsMap] = useState(new Map());
// // // //   const [initialSelectionsMap, setInitialSelectionsMap] = useState(new Map());

// // // //   const [searchStudent, setSearchStudent] = useState('');
// // // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // // //   const [loading, setLoading] = useState(true);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState(null);
// // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // //   const [resetting, setResetting] = useState(false);

// // // //   const [density, setDensity] = useState('compact');
// // // //   const [showFullNames, setShowFullNames] = useState(false);
// // // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

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

// // // //       const [chefsData, etudiantsData, selectionsData, refCompsData] = await Promise.all([
// // // //         fetchChefsDeProjet(),
// // // //         fetchEtudiants(),
// // // //         fetchSelections(),
// // // //         fetchReferentielCompetences(true),
// // // //       ]);

// // // //       setChefs(chefsData || []);
// // // //       setEtudiants(etudiantsData || []);
// // // //       setReferentielCompetences(refCompsData || []);

// // // //       const activeMap = new Map();
// // // //       (selectionsData || []).forEach((s) => {
// // // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // // //           activeMap.set(`${s.etudiant_id}-${s.chef_de_projet_id}`, s.priorite || 1);
// // // //         }
// // // //       });

// // // //       setSelectionsMap(new Map(activeMap));
// // // //       setInitialSelectionsMap(new Map(activeMap));
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors du chargement des données.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     loadData();
// // // //   }, []);

// // // //   const hasChanges = useMemo(() => {
// // // //     if (selectionsMap.size !== initialSelectionsMap.size) return true;
// // // //     for (const [key, prio] of selectionsMap.entries()) {
// // // //       if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
// // // //         return true;
// // // //       }
// // // //     }
// // // //     return false;
// // // //   }, [selectionsMap, initialSelectionsMap]);

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
// // // //     for (const key of selectionsMap.keys()) {
// // // //       const [etudId] = key.split('-');
// // // //       map[etudId] = (map[etudId] || 0) + 1;
// // // //     }
// // // //     return map;
// // // //   }, [selectionsMap]);

// // // //   const countsPerChef = useMemo(() => {
// // // //     const map = {};
// // // //     for (const key of selectionsMap.keys()) {
// // // //       const [, chefId] = key.split('-');
// // // //       map[chefId] = (map[chefId] || 0) + 1;
// // // //     }
// // // //     return map;
// // // //   }, [selectionsMap]);

// // // //   // Bascule ou ajout manuel d'un vœu
// // // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // // //     const key = `${etudiantId}-${chefId}`;
// // // //     setSelectionsMap((prev) => {
// // // //       const next = new Map(prev);
// // // //       if (next.has(key)) {
// // // //         next.delete(key);
// // // //       } else {
// // // //         // Détermine le rang suivant disponible (ex: 1 si premier vœu, 2 si deuxième, etc.)
// // // //         let maxPrio = 0;
// // // //         for (const [k, p] of next.entries()) {
// // // //           if (k.startsWith(`${etudiantId}-`)) {
// // // //             if (p > maxPrio) maxPrio = p;
// // // //           }
// // // //         }
// // // //         next.set(key, maxPrio + 1);
// // // //       }
// // // //       return next;
// // // //     });
// // // //     setSuccessMsg(null);
// // // //   }, []);

// // // //   const handleSelectAllVisible = () => {
// // // //     setSelectionsMap((prev) => {
// // // //       const next = new Map(prev);
// // // //       filteredEtudiants.forEach((e) => {
// // // //         let currentPrio = 1;
// // // //         visibleChefs.forEach((c) => {
// // // //           const key = `${e.id}-${c.id}`;
// // // //           if (!next.has(key)) {
// // // //             next.set(key, currentPrio);
// // // //             currentPrio++;
// // // //           }
// // // //         });
// // // //       });
// // // //       return next;
// // // //     });
// // // //     setSuccessMsg(null);
// // // //   };

// // // //   const handleDeselectAllVisible = () => {
// // // //     setSelectionsMap((prev) => {
// // // //       const next = new Map(prev);
// // // //       filteredEtudiants.forEach((e) => {
// // // //         visibleChefs.forEach((c) => {
// // // //           next.delete(`${e.id}-${c.id}`);
// // // //         });
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

// // // //       const toUpsert = [];
// // // //       selectionsMap.forEach((prio, key) => {
// // // //         const [etudiantId, chefId] = key.split('-').map(Number);
// // // //         if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
// // // //           toUpsert.push({ etudiantId, chefId, prio });
// // // //         }
// // // //       });

// // // //       const toDelete = [];
// // // //       initialSelectionsMap.forEach((_, key) => {
// // // //         if (!selectionsMap.has(key)) {
// // // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // // //           toDelete.push({ etudiantId, chefId });
// // // //         }
// // // //       });

// // // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // // //         deleteSelection(etudiantId, chefId)
// // // //       );
// // // //       const savePromises = toUpsert.map(({ etudiantId, chefId, prio }) =>
// // // //         saveSelection(etudiantId, chefId, prio)
// // // //       );

// // // //       await Promise.all([...deletePromises, ...savePromises]);

// // // //       setInitialSelectionsMap(new Map(selectionsMap));
// // // //       setSuccessMsg(
// // // //         `✨ Sélections enregistrées (${toUpsert.length} mise(s) à jour, ${toDelete.length} suppression(s)).`
// // // //       );
// // // //     } catch (err) {
// // // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   const handleResetSelections = async () => {
// // // //     try {
// // // //       setResetting(true);
// // // //       setError(null);
// // // //       await resetAllSelections();
// // // //       setSelectionsMap(new Map());
// // // //       setInitialSelectionsMap(new Map());
// // // //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// // // //       setShowResetModal(false);
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// // // //     } finally {
// // // //       setResetting(false);
// // // //     }
// // // //   };

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
// // // //         const row = {
// // // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // // //           'Email': etud.adresse_email || '',
// // // //           'Parcours': etud.parcours || 'I2026',
// // // //         };

// // // //         chefs.forEach((chef) => {
// // // //           const prio = selectionsMap.get(`${etud.id}-${chef.id}`);
// // // //           row[chef.nom] = prio ? `${rankLabel(prio)} Choix (P${prio})` : '';
// // // //         });

// // // //         row['Total Vœux'] = countsPerStudent[etud.id] || 0;
// // // //         return row;
// // // //       });

// // // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // // //       wsSelections['!cols'] = [
// // // //         { wch: 26 },
// // // //         { wch: 32 },
// // // //         { wch: 12 },
// // // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 18) })),
// // // //         { wch: 16 },
// // // //       ];

// // // //       const statsRows = chefs.map((chef) => {
// // // //         let p1Count = 0;
// // // //         let totalCount = 0;
// // // //         for (const [key, prio] of selectionsMap.entries()) {
// // // //           const [, cId] = key.split('-').map(Number);
// // // //           if (cId === chef.id) {
// // // //             totalCount++;
// // // //             if (prio === 1) p1Count++;
// // // //           }
// // // //         }
// // // //         return {
// // // //           'Chef de Projet': chef.nom,
// // // //           'Spécialité': chef.specialite || 'N/A',
// // // //           'Email': chef.email || '',
// // // //           'Vœux 1er choix (P1)': p1Count,
// // // //           'Total Sélections': totalCount,
// // // //         };
// // // //       });

// // // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }, { wch: 18 }];

// // // //       const workbook = XLSX.utils.book_new();
// // // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // // //       const today = new Date().toISOString().slice(0, 10);
// // // //       XLSX.writeFile(workbook, `selections_voeux_reels_${today}.xlsx`);
// // // //     } catch (err) {
// // // //       alert(`Erreur export: ${err.message}`);
// // // //     }
// // // //   };

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
// // // //     const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
// // // //     const labels = activeComps.map((c) => c.label);
// // // //     const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
// // // //     const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);

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
// // // //   }, [referentielCompetences, aptitudesData, apetencesData]);

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
// // // //               <h2 className="matrix-title display">🎯 Sélections &amp; Vœux Réels des Étudiants</h2>
// // // //               <p className="matrix-subtitle">
// // // //                 Les vœux réels (1er, 2e, 3e choix) sont importés directement depuis le questionnaire Moodle et modifiables par l'administrateur.
// // // //               </p>
// // // //             </div>

// // // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

// // // //               <Button
// // // //                 className="btn-pill btn-danger-pill"
// // // //                 onClick={() => setShowResetModal(true)}
// // // //                 disabled={selectionsMap.size === 0 || resetting}
// // // //                 title="Supprimer toutes les sélections pour repartir de zéro"
// // // //               >
// // // //                 🗑️ Vider tout ({selectionsMap.size})
// // // //               </Button>

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

// // // //           {/* Toolbar unique */}
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

// // // //             <span className="stat-chip accent"><strong>{selectionsMap.size}</strong> sélections</span>
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

// // // //           {/* Vue mobile */}
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
// // // //                     selectionsMap={selectionsMap}
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
// // // //             /* Vue desktop */
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
// // // //                             const prio = selectionsMap.get(key);
// // // //                             const isSelected = Boolean(prio);

// // // //                             return (
// // // //                               <SelectionCell
// // // //                                 key={chef.id}
// // // //                                 selected={isSelected}
// // // //                                 rankNum={prio || 1}
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

// // // //       {/* Modal Confirmation Réinitialisation Sélections */}
// // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// // // //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// // // //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// // // //         </Modal.Header>
// // // //         <Modal.Body>
// // // //           <p>
// // // //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selectionsMap.size} vœux)</strong> de la base de données ?
// // // //           </p>
// // // //           <p className="text-muted small mb-0">
// // // //             Cette action est irréversible et remettra la matrice à zéro pour démarrer une nouvelle session.
// // // //           </p>
// // // //         </Modal.Body>
// // // //         <Modal.Footer>
// // // //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // //             Annuler
// // // //           </Button>
// // // //           <Button variant="danger" onClick={handleResetSelections} disabled={resetting}>
// // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Oui, tout supprimer'}
// // // //           </Button>
// // // //         </Modal.Footer>
// // // //       </Modal>

// // // //       {/* Modal Radar Dynamique */}
// // // //       <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="modal-dark">
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
// // //   Row,
// // //   Col,
// // //   Card,
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
// // //   fetchReferentielCompetences,
// // //   fetchAptitudesByEtudiant,
// // //   fetchApetencesByEtudiant,
// // //   getDocumentPublicUrl,
// // // } from '../services/supabase';

// // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // ============================================================================
// // // // Helpers visuels
// // // // ============================================================================

// // // const getRankBadgeStyle = (rank) => {
// // //   switch (Number(rank)) {
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

// // // const rankLabel = (rank) => (Number(rank) === 1 ? '1er' : `${rank}e`);

// // // const chefInitials = (nom = '') =>
// // //   nom
// // //     .replace(/Ã©/gi, 'E')
// // //     .replace(/Ã/gi, 'A')
// // //     .replace(/\s+/g, '')
// // //     .slice(0, 4)
// // //     .toUpperCase();

// // // function useIsMobile(breakpoint = 768) {
// // //   const [isMobile, setIsMobile] = useState(
// // //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// // //   );

// // //   useEffect(() => {
// // //     if (typeof window !== 'undefined') return undefined;
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

// // // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // // .badge-rank-selection {
// // //   display: inline-flex;
// // //   align-items: center;
// // //   gap: 4px;
// // //   min-width: 38px;
// // //   justify-content: center;
// // //   padding: 3px 8px;
// // //   border-radius: 7px;
// // //   font-weight: 700;
// // //   font-size: 0.74rem;
// // //   user-select: none;
// // //   transition: transform 0.12s ease;
// // // }
// // // .badge-rank-selection.is-pending {
// // //   background: transparent;
// // //   border: 1px dashed var(--border);
// // //   color: var(--text-faint);
// // //   opacity: 0.5;
// // // }
// // // .sel-cell:hover .badge-rank-selection.is-pending {
// // //   opacity: 1;
// // //   border-color: var(--accent);
// // //   color: var(--accent);
// // //   transform: scale(1.15);
// // // }
// // // .badge-rank-selection.is-selected { border-style: solid; }
// // // .sel-cell:hover .badge-rank-selection.is-selected { transform: scale(1.08); }

// // // /* Vue mobile */
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

// // // /* Modals Dark */
// // // .modal-dark .modal-dialog { --bs-modal-width: 600px; }
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

// // // /* Style de la table de statistiques */
// // // .stats-table thead th {
// // //   background: #0f1524 !important;
// // //   color: var(--text-muted);
// // //   font-size: 0.74rem;
// // //   text-transform: uppercase;
// // //   letter-spacing: 0.5px;
// // //   border-bottom: 2px solid rgba(45, 212, 191, 0.3) !important;
// // //   vertical-align: middle;
// // // }
// // // .stats-table tfoot th {
// // //   background: #141c2c !important;
// // //   border-top: 2px solid var(--accent);
// // //   color: #fff;
// // //   font-weight: 800;
// // // }
// // // .stats-table tbody tr:hover td {
// // //   background-color: rgba(45, 212, 191, 0.06) !important;
// // // }

// // // @media (max-width: 767px) {
// // //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// // //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// // //   .bulk-actions { margin-left: 0; }
// // // }
// // // `;

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

// // // function SelectionCell({ selected, rankNum, onClick }) {
// // //   return (
// // //     <td className="sel-cell" onClick={onClick}>
// // //       {selected ? (
// // //         <span
// // //           className="badge-rank-selection is-selected"
// // //           style={getRankBadgeStyle(rankNum)}
// // //           title={`Vœu ${rankLabel(rankNum)} — cliquer pour retirer`}
// // //         >
// // //           ✓ {rankLabel(rankNum)}
// // //         </span>
// // //       ) : (
// // //         <span className="badge-rank-selection is-pending" title="Cliquer pour ajouter comme vœu">
// // //           +
// // //         </span>
// // //       )}
// // //     </td>
// // //   );
// // // }

// // // function MobileStudentCard({ etud, chefs, selectionsMap, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
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
// // //             const prio = selectionsMap.get(key);
// // //             const isSelected = Boolean(prio);
// // //             return (
// // //               <span
// // //                 key={chef.id}
// // //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// // //                 style={isSelected ? getRankBadgeStyle(prio) : undefined}
// // //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// // //               >
// // //                 {isSelected ? `✓ ${chef.nom} · ${rankLabel(prio)}` : `+ ${chef.nom}`}
// // //               </span>
// // //             );
// // //           })}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default function SelectionPage() {
// // //   const [chefs, setChefs] = useState([]);
// // //   const [etudiants, setEtudiants] = useState([]);
// // //   const [referentielCompetences, setReferentielCompetences] = useState([]);

// // //   // Map "etudiantId-chefId" => priorite (1, 2, 3...)
// // //   const [selectionsMap, setSelectionsMap] = useState(new Map());
// // //   const [initialSelectionsMap, setInitialSelectionsMap] = useState(new Map());

// // //   const [searchStudent, setSearchStudent] = useState('');
// // //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [successMsg, setSuccessMsg] = useState(null);

// // //   const [showResetModal, setShowResetModal] = useState(false);
// // //   const [resetting, setResetting] = useState(false);

// // //   // Modale Statistiques par thématique
// // //   const [showStatsModal, setShowStatsModal] = useState(false);

// // //   const [density, setDensity] = useState('compact');
// // //   const [showFullNames, setShowFullNames] = useState(false);
// // //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

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

// // //       const [chefsData, etudiantsData, selectionsData, refCompsData] = await Promise.all([
// // //         fetchChefsDeProjet(),
// // //         fetchEtudiants(),
// // //         fetchSelections(),
// // //         fetchReferentielCompetences(true),
// // //       ]);

// // //       setChefs(chefsData || []);
// // //       setEtudiants(etudiantsData || []);
// // //       setReferentielCompetences(refCompsData || []);

// // //       const activeMap = new Map();
// // //       (selectionsData || []).forEach((s) => {
// // //         if (s.etudiant_id && s.chef_de_projet_id) {
// // //           activeMap.set(`${s.etudiant_id}-${s.chef_de_projet_id}`, s.priorite || 1);
// // //         }
// // //       });

// // //       setSelectionsMap(new Map(activeMap));
// // //       setInitialSelectionsMap(new Map(activeMap));
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors du chargement des données.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

// // //   const hasChanges = useMemo(() => {
// // //     if (selectionsMap.size !== initialSelectionsMap.size) return true;
// // //     for (const [key, prio] of selectionsMap.entries()) {
// // //       if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
// // //         return true;
// // //       }
// // //     }
// // //     return false;
// // //   }, [selectionsMap, initialSelectionsMap]);

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
// // //     for (const key of selectionsMap.keys()) {
// // //       const [etudId] = key.split('-');
// // //       map[etudId] = (map[etudId] || 0) + 1;
// // //     }
// // //     return map;
// // //   }, [selectionsMap]);

// // //   const countsPerChef = useMemo(() => {
// // //     const map = {};
// // //     for (const key of selectionsMap.keys()) {
// // //       const [, chefId] = key.split('-');
// // //       map[chefId] = (map[chefId] || 0) + 1;
// // //     }
// // //     return map;
// // //   }, [selectionsMap]);

// // //   // ==========================================================================
// // //   // Calcul statistique des vœux par Thématique & Chef
// // //   // ==========================================================================
// // //   const statsByThematique = useMemo(() => {
// // //     let maxP = 3;
// // //     for (const p of selectionsMap.values()) {
// // //       if (p > maxP) maxP = p;
// // //     }

// // //     const priorityCols = Array.from({ length: maxP }, (_, i) => i + 1);

// // //     const rows = chefs.map((chef) => {
// // //       const counts = {};
// // //       priorityCols.forEach((p) => {
// // //         counts[p] = 0;
// // //       });
// // //       let total = 0;

// // //       for (const [key, prio] of selectionsMap.entries()) {
// // //         const [, cId] = key.split('-').map(Number);
// // //         if (cId === chef.id) {
// // //           counts[prio] = (counts[prio] || 0) + 1;
// // //           total++;
// // //         }
// // //       }

// // //       return {
// // //         chefId: chef.id,
// // //         chefNom: chef.nom,
// // //         specialite: chef.specialite || 'Non renseignée',
// // //         counts,
// // //         total,
// // //         p1: counts[1] || 0,
// // //       };
// // //     });

// // //     // Tri par popularité du 1er choix décroissant, puis par total
// // //     rows.sort((a, b) => b.p1 - a.p1 || b.total - a.total);

// // //     // Totaux des colonnes
// // //     const colTotals = {};
// // //     priorityCols.forEach((p) => {
// // //       colTotals[p] = 0;
// // //     });
// // //     let grandTotal = 0;

// // //     rows.forEach((r) => {
// // //       priorityCols.forEach((p) => {
// // //         colTotals[p] += r.counts[p] || 0;
// // //       });
// // //       grandTotal += r.total;
// // //     });

// // //     return {
// // //       priorityCols,
// // //       rows,
// // //       colTotals,
// // //       grandTotal,
// // //     };
// // //   }, [chefs, selectionsMap]);

// // //   // Export Excel des statistiques de thématiques
// // //   const handleExportStatsXLSX = () => {
// // //     try {
// // //       const exportRows = statsByThematique.rows.map((r, idx) => {
// // //         const rowData = {
// // //           'Rang': idx + 1,
// // //           'Thématique': r.specialite,
// // //           'Chef de Projet': r.chefNom,
// // //         };
// // //         statsByThematique.priorityCols.forEach((p) => {
// // //           rowData[`${rankLabel(p)} Choix`] = r.counts[p] || 0;
// // //         });
// // //         rowData['Total Vœux'] = r.total;
// // //         rowData['% 1er Choix'] = statsByThematique.colTotals[1] > 0
// // //           ? `${((r.p1 / statsByThematique.colTotals[1]) * 100).toFixed(1)} %`
// // //           : '0 %';
// // //         return rowData;
// // //       });

// // //       const ws = XLSX.utils.json_to_sheet(exportRows);
// // //       ws['!cols'] = [
// // //         { wch: 6 },
// // //         { wch: 45 },
// // //         { wch: 22 },
// // //         ...statsByThematique.priorityCols.map(() => ({ wch: 14 })),
// // //         { wch: 14 },
// // //         { wch: 14 },
// // //       ];

// // //       const wb = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(wb, ws, 'Statistiques Thématiques');
// // //       XLSX.writeFile(wb, `statistiques_thematiques_voeux_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // //     } catch (err) {
// // //       alert(`Erreur export statistiques : ${err.message}`);
// // //     }
// // //   };

// // //   // Bascule ou ajout manuel d'un vœu
// // //   const toggleSelection = useCallback((etudiantId, chefId) => {
// // //     const key = `${etudiantId}-${chefId}`;
// // //     setSelectionsMap((prev) => {
// // //       const next = new Map(prev);
// // //       if (next.has(key)) {
// // //         next.delete(key);
// // //       } else {
// // //         let maxPrio = 0;
// // //         for (const [k, p] of next.entries()) {
// // //           if (k.startsWith(`${etudiantId}-`)) {
// // //             if (p > maxPrio) maxPrio = p;
// // //           }
// // //         }
// // //         next.set(key, maxPrio + 1);
// // //       }
// // //       return next;
// // //     });
// // //     setSuccessMsg(null);
// // //   }, []);

// // //   const handleSelectAllVisible = () => {
// // //     setSelectionsMap((prev) => {
// // //       const next = new Map(prev);
// // //       filteredEtudiants.forEach((e) => {
// // //         let currentPrio = 1;
// // //         visibleChefs.forEach((c) => {
// // //           const key = `${e.id}-${c.id}`;
// // //           if (!next.has(key)) {
// // //             next.set(key, currentPrio);
// // //             currentPrio++;
// // //           }
// // //         });
// // //       });
// // //       return next;
// // //     });
// // //     setSuccessMsg(null);
// // //   };

// // //   const handleDeselectAllVisible = () => {
// // //     setSelectionsMap((prev) => {
// // //       const next = new Map(prev);
// // //       filteredEtudiants.forEach((e) => {
// // //         visibleChefs.forEach((c) => {
// // //           next.delete(`${e.id}-${c.id}`);
// // //         });
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

// // //       const toUpsert = [];
// // //       selectionsMap.forEach((prio, key) => {
// // //         const [etudiantId, chefId] = key.split('-').map(Number);
// // //         if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
// // //           toUpsert.push({ etudiantId, chefId, prio });
// // //         }
// // //       });

// // //       const toDelete = [];
// // //       initialSelectionsMap.forEach((_, key) => {
// // //         if (!selectionsMap.has(key)) {
// // //           const [etudiantId, chefId] = key.split('-').map(Number);
// // //           toDelete.push({ etudiantId, chefId });
// // //         }
// // //       });

// // //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// // //         deleteSelection(etudiantId, chefId)
// // //       );
// // //       const savePromises = toUpsert.map(({ etudiantId, chefId, prio }) =>
// // //         saveSelection(etudiantId, chefId, prio)
// // //       );

// // //       await Promise.all([...deletePromises, ...savePromises]);

// // //       setInitialSelectionsMap(new Map(selectionsMap));
// // //       setSuccessMsg(
// // //         `✨ Sélections enregistrées (${toUpsert.length} mise(s) à jour, ${toDelete.length} suppression(s)).`
// // //       );
// // //     } catch (err) {
// // //       setError(err.message || "Erreur lors de l'enregistrement.");
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   const handleResetSelections = async () => {
// // //     try {
// // //       setResetting(true);
// // //       setError(null);
// // //       await resetAllSelections();
// // //       setSelectionsMap(new Map());
// // //       setInitialSelectionsMap(new Map());
// // //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// // //       setShowResetModal(false);
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// // //     } finally {
// // //       setResetting(false);
// // //     }
// // //   };

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
// // //         const row = {
// // //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// // //           'Email': etud.adresse_email || '',
// // //           'Parcours': etud.parcours || 'I2026',
// // //         };

// // //         chefs.forEach((chef) => {
// // //           const prio = selectionsMap.get(`${etud.id}-${chef.id}`);
// // //           row[chef.nom] = prio ? `${rankLabel(prio)} Choix (P${prio})` : '';
// // //         });

// // //         row['Total Vœux'] = countsPerStudent[etud.id] || 0;
// // //         return row;
// // //       });

// // //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// // //       wsSelections['!cols'] = [
// // //         { wch: 26 },
// // //         { wch: 32 },
// // //         { wch: 12 },
// // //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 18) })),
// // //         { wch: 16 },
// // //       ];

// // //       const statsRows = chefs.map((chef) => {
// // //         let p1Count = 0;
// // //         let totalCount = 0;
// // //         for (const [key, prio] of selectionsMap.entries()) {
// // //           const [, cId] = key.split('-').map(Number);
// // //           if (cId === chef.id) {
// // //             totalCount++;
// // //             if (prio === 1) p1Count++;
// // //           }
// // //         }
// // //         return {
// // //           'Chef de Projet': chef.nom,
// // //           'Spécialité': chef.specialite || 'N/A',
// // //           'Email': chef.email || '',
// // //           'Vœux 1er choix (P1)': p1Count,
// // //           'Total Sélections': totalCount,
// // //         };
// // //       });

// // //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// // //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }, { wch: 18 }];

// // //       const workbook = XLSX.utils.book_new();
// // //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// // //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// // //       const today = new Date().toISOString().slice(0, 10);
// // //       XLSX.writeFile(workbook, `selections_voeux_reels_${today}.xlsx`);
// // //     } catch (err) {
// // //       alert(`Erreur export: ${err.message}`);
// // //     }
// // //   };

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
// // //     const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
// // //     const labels = activeComps.map((c) => c.label);
// // //     const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
// // //     const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);

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
// // //   }, [referentielCompetences, aptitudesData, apetencesData]);

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
// // //               <h2 className="matrix-title display">🎯 Sélections &amp; Vœux Réels des Étudiants</h2>
// // //               <p className="matrix-subtitle">
// // //                 Les vœux réels (1er, 2e, 3e choix) sont importés directement depuis le questionnaire Moodle et modifiables par l'administrateur.
// // //               </p>
// // //             </div>

// // //             <div className="d-flex align-items-center gap-2 flex-wrap">
// // //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

// // //               {/* Nouveau Bouton Statistiques par Thématique */}
// // //               <Button
// // //                 className="btn-pill btn-export-pill"
// // //                 onClick={() => setShowStatsModal(true)}
// // //                 title="Afficher le tableau récapitulatif des choix par thématique"
// // //               >
// // //                 📊 Stats par thématique
// // //               </Button>

// // //               <Button
// // //                 className="btn-pill btn-danger-pill"
// // //                 onClick={() => setShowResetModal(true)}
// // //                 disabled={selectionsMap.size === 0 || resetting}
// // //                 title="Supprimer toutes les sélections pour repartir de zéro"
// // //               >
// // //                 🗑️ Vider tout ({selectionsMap.size})
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

// // //             <span className="stat-chip accent"><strong>{selectionsMap.size}</strong> sélections</span>
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
// // //                     selectionsMap={selectionsMap}
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
// // //                             const prio = selectionsMap.get(key);
// // //                             const isSelected = Boolean(prio);

// // //                             return (
// // //                               <SelectionCell
// // //                                 key={chef.id}
// // //                                 selected={isSelected}
// // //                                 rankNum={prio || 1}
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

// // //       {/* ========================================================================= */}
// // //       {/* NOUVELLE MODALE : STATISTIQUES DES CHOIX PAR THÉMATIQUE                    */}
// // //       {/* ========================================================================= */}
// // //       <Modal
// // //         show={showStatsModal}
// // //         onHide={() => setShowStatsModal(false)}
// // //         size="xl"
// // //         centered
// // //         className="modal-dark"
// // //       >
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title style={{ fontSize: '1.25rem', color: '#2dd4bf', fontWeight: 800 }}>
// // //             📊 Statistiques et Répartition des Choix par Thématique
// // //           </Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body className="p-4" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
// // //           {/* Bandeau indicateurs KPI */}
// // //           <Row className="g-3 mb-4">
// // //             <Col md={4}>
// // //               <Card className="bg-black bg-opacity-40 border-secondary text-center p-3">
// // //                 <span className="text-muted small fw-bold">Total Vœux Exprimés</span>
// // //                 <h3 className="text-white fw-bold mb-0 mt-1">{statsByThematique.grandTotal}</h3>
// // //               </Card>
// // //             </Col>
// // //             <Col md={4}>
// // //               <Card className="bg-black bg-opacity-40 border-success text-center p-3">
// // //                 <span className="text-success small fw-bold">Thématique N°1 (1ers choix)</span>
// // //                 <h6 className="text-white fw-bold mb-0 mt-2 text-truncate" title={statsByThematique.rows[0]?.specialite}>
// // //                   {statsByThematique.rows[0]?.specialite || '—'}
// // //                 </h6>
// // //                 <small className="text-success fw-semibold">
// // //                   {statsByThematique.rows[0]?.p1 || 0} fois en 1er choix
// // //                 </small>
// // //               </Card>
// // //             </Col>
// // //             <Col md={4}>
// // //               <Card className="bg-black bg-opacity-40 border-info text-center p-3">
// // //                 <span className="text-info small fw-bold">Étudiants avec Vœux</span>
// // //                 <h3 className="text-info fw-bold mb-0 mt-1">{studentsWithWishes} / {etudiants.length}</h3>
// // //               </Card>
// // //             </Col>
// // //           </Row>

// // //           <p className="small text-muted mb-3">
// // //             💡 <em>Le tableau ci-dessous classe les thématiques par ordre d'attractivité (nombre de 1ers choix décroissant). Chaque colonne représente le nombre d'étudiants ayant sélectionné cette thématique à ce rang précis.</em>
// // //           </p>

// // //           <div className="table-responsive rounded border border-secondary">
// // //             <Table hover size="sm" className="stats-table mb-0 text-white align-middle text-nowrap">
// // //               <thead>
// // //                 <tr>
// // //                   <th style={{ width: '45px', textAlign: 'center' }}>#</th>
// // //                   <th>Intitulé de la Thématique</th>
// // //                   <th>Chef de Projet</th>
// // //                   {statsByThematique.priorityCols.map((p) => (
// // //                     <th key={p} style={{ textAlign: 'center', minWidth: '95px' }}>
// // //                       {rankLabel(p)} Choix
// // //                     </th>
// // //                   ))}
// // //                   <th style={{ textAlign: 'center', minWidth: '90px' }}>Total</th>
// // //                   <th style={{ textAlign: 'center', minWidth: '95px' }}>% 1er Choix</th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody>
// // //                 {statsByThematique.rows.map((row, idx) => (
// // //                   <tr key={row.chefId}>
// // //                     <td style={{ textAlign: 'center' }} className="text-muted font-monospace">
// // //                       {idx + 1}
// // //                     </td>
// // //                     <td>
// // //                       <strong className="text-light">{row.specialite}</strong>
// // //                     </td>
// // //                     <td>
// // //                       <span className="text-info">{row.chefNom}</span>
// // //                     </td>
// // //                     {statsByThematique.priorityCols.map((p) => {
// // //                       const count = row.counts[p] || 0;
// // //                       return (
// // //                         <td key={p} style={{ textAlign: 'center' }}>
// // //                           <span
// // //                             className="badge"
// // //                             style={{
// // //                               ...getRankBadgeStyle(p),
// // //                               fontSize: '0.78rem',
// // //                               padding: '4px 9px',
// // //                               opacity: count > 0 ? 1 : 0.25,
// // //                             }}
// // //                           >
// // //                             {count}
// // //                           </span>
// // //                         </td>
// // //                       );
// // //                     })}
// // //                     <td style={{ textAlign: 'center' }}>
// // //                       <Badge bg="secondary" className="px-2 py-1 font-monospace" style={{ fontSize: '0.8rem' }}>
// // //                         {row.total}
// // //                       </Badge>
// // //                     </td>
// // //                     <td style={{ textAlign: 'center' }} className="font-monospace text-muted">
// // //                       {statsByThematique.colTotals[1] > 0
// // //                         ? `${((row.p1 / statsByThematique.colTotals[1]) * 100).toFixed(1)} %`
// // //                         : '0 %'}
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //               <tfoot>
// // //                 <tr>
// // //                   <th colSpan={3} style={{ textAlign: 'right', paddingRight: '1rem' }}>
// // //                     TOTAUX GLOBAUX :
// // //                   </th>
// // //                   {statsByThematique.priorityCols.map((p) => (
// // //                     <th key={p} style={{ textAlign: 'center' }}>
// // //                       <Badge bg="light" text="dark" style={{ fontSize: '0.84rem' }}>
// // //                         {statsByThematique.colTotals[p]}
// // //                       </Badge>
// // //                     </th>
// // //                   ))}
// // //                   <th style={{ textAlign: 'center' }}>
// // //                     <Badge bg="success" style={{ fontSize: '0.86rem' }}>
// // //                       {statsByThematique.grandTotal}
// // //                     </Badge>
// // //                   </th>
// // //                   <th style={{ textAlign: 'center', color: '#2dd4bf' }}>100 %</th>
// // //                 </tr>
// // //               </tfoot>
// // //             </Table>
// // //           </div>
// // //         </Modal.Body>
// // //         <Modal.Footer className="d-flex justify-content-between">
// // //           <Button variant="success" size="sm" onClick={handleExportStatsXLSX} className="fw-semibold">
// // //             📊 Exporter ces statistiques en Excel (.xlsx)
// // //           </Button>
// // //           <Button variant="secondary" size="sm" onClick={() => setShowStatsModal(false)}>
// // //             Fermer
// // //           </Button>
// // //         </Modal.Footer>
// // //       </Modal>

// // //       {/* Modal Confirmation Réinitialisation Sélections */}
// // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// // //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body>
// // //           <p>
// // //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selectionsMap.size} vœux)</strong> de la base de données ?
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

// // //       {/* Modal Radar Dynamique */}
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
// //   fetchReferentielCompetences,
// //   fetchAptitudesByEtudiant,
// //   fetchApetencesByEtudiant,
// //   getDocumentPublicUrl,
// // } from '../services/supabase';

// // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // ============================================================================
// // // Helpers visuels
// // // ============================================================================

// // const getRankBadgeStyle = (rank) => {
// //   switch (Number(rank)) {
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

// // const rankLabel = (rank) => (Number(rank) === 1 ? '1er' : `${rank}e`);

// // const chefInitials = (nom = '') =>
// //   nom
// //     .replace(/Ã©/gi, 'E')
// //     .replace(/Ã/gi, 'A')
// //     .replace(/\s+/g, '')
// //     .slice(0, 4)
// //     .toUpperCase();

// // function useIsMobile(breakpoint = 768) {
// //   const [isMobile, setIsMobile] = useState(
// //     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
// //   );

// //   useEffect(() => {
// //     if (typeof window !== 'undefined') return undefined;
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

// // .sel-cell { cursor: pointer; text-align: center; transition: background-color 0.1s ease; }
// // .badge-rank-selection {
// //   display: inline-flex;
// //   align-items: center;
// //   gap: 4px;
// //   min-width: 38px;
// //   justify-content: center;
// //   padding: 3px 8px;
// //   border-radius: 7px;
// //   font-weight: 700;
// //   font-size: 0.74rem;
// //   user-select: none;
// //   transition: transform 0.12s ease;
// // }
// // .badge-rank-selection.is-pending {
// //   background: transparent;
// //   border: 1px dashed var(--border);
// //   color: var(--text-faint);
// //   opacity: 0.5;
// // }
// // .sel-cell:hover .badge-rank-selection.is-pending {
// //   opacity: 1;
// //   border-color: var(--accent);
// //   color: var(--accent);
// //   transform: scale(1.15);
// // }
// // .badge-rank-selection.is-selected { border-style: solid; }
// // .sel-cell:hover .badge-rank-selection.is-selected { transform: scale(1.08); }

// // /* Vue mobile */
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

// // /* Modals Dark */
// // .modal-dark .modal-dialog { --bs-modal-width: 600px; }
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

// // /* Style de la table de statistiques */
// // .stats-table thead th {
// //   background: #0f1524 !important;
// //   color: var(--text-muted);
// //   font-size: 0.74rem;
// //   text-transform: uppercase;
// //   letter-spacing: 0.5px;
// //   border-bottom: 2px solid rgba(45, 212, 191, 0.3) !important;
// //   vertical-align: middle;
// // }
// // .stats-table tfoot th {
// //   background: #141c2c !important;
// //   border-top: 2px solid var(--accent);
// //   color: #fff;
// //   font-weight: 800;
// // }
// // .stats-table tbody tr:hover td {
// //   background-color: rgba(45, 212, 191, 0.06) !important;
// // }

// // /* ==========================================================================
// //    Modale "Statistiques par thématique" — mise en page niveau entreprise
// //    ========================================================================== */
// // .stats-modal .modal-dialog { --bs-modal-width: 980px; }
// // .stats-modal .modal-content { border-radius: 18px; }

// // .stats-modal-header {
// //   display: flex;
// //   align-items: center;
// //   gap: 0.85rem;
// // }
// // .stats-modal-icon {
// //   width: 40px;
// //   height: 40px;
// //   border-radius: 10px;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   background: var(--accent-soft);
// //   border: 1px solid rgba(45, 212, 191, 0.35);
// //   color: var(--accent);
// //   font-size: 1.05rem;
// //   flex-shrink: 0;
// // }
// // .stats-modal-heading { display: flex; flex-direction: column; gap: 0.15rem; }
// // .stats-modal-title {
// //   font-size: 1.05rem;
// //   font-weight: 700;
// //   color: #fff;
// //   letter-spacing: -0.01em;
// //   margin: 0;
// // }
// // .stats-modal-eyebrow {
// //   font-size: 0.72rem;
// //   color: var(--text-faint);
// //   margin: 0;
// // }

// // .stats-modal-body { padding: 1.4rem 1.5rem 1.5rem !important; }

// // .stats-kpi-row {
// //   display: grid;
// //   grid-template-columns: repeat(3, 1fr);
// //   gap: 0.85rem;
// //   margin-bottom: 1.4rem;
// // }
// // @media (max-width: 767px) {
// //   .stats-kpi-row { grid-template-columns: 1fr; }
// // }
// // .stats-kpi-card {
// //   background: var(--surface);
// //   border: 1px solid var(--border);
// //   border-radius: 12px;
// //   padding: 0.95rem 1.05rem;
// //   display: flex;
// //   flex-direction: column;
// //   gap: 0.35rem;
// //   position: relative;
// //   overflow: hidden;
// // }
// // .stats-kpi-card::before {
// //   content: '';
// //   position: absolute;
// //   top: 0; left: 0;
// //   width: 3px;
// //   height: 100%;
// //   background: var(--kpi-accent, var(--accent));
// // }
// // .stats-kpi-label {
// //   font-size: 0.7rem;
// //   font-weight: 600;
// //   color: var(--text-faint);
// //   letter-spacing: 0.02em;
// // }
// // .stats-kpi-value {
// //   font-family: 'JetBrains Mono', monospace;
// //   font-size: 1.55rem;
// //   font-weight: 700;
// //   color: #fff;
// //   line-height: 1.1;
// // }
// // .stats-kpi-value.is-compact {
// //   font-family: 'Space Grotesk', sans-serif;
// //   font-size: 1.05rem;
// //   font-weight: 700;
// //   white-space: nowrap;
// //   overflow: hidden;
// //   text-overflow: ellipsis;
// // }
// // .stats-kpi-sub { font-size: 0.74rem; color: var(--text-muted); }
// // .stats-kpi-sub strong { color: var(--accent); font-family: 'JetBrains Mono', monospace; }

// // .stats-insight-bar {
// //   display: flex;
// //   align-items: flex-start;
// //   gap: 0.55rem;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   border-radius: 10px;
// //   padding: 0.6rem 0.85rem;
// //   margin-bottom: 1.1rem;
// //   color: var(--text-muted);
// //   font-size: 0.78rem;
// //   line-height: 1.5;
// // }
// // .stats-insight-bar .dot { color: var(--accent); flex-shrink: 0; margin-top: 0.15rem; }

// // .stats-table-panel {
// //   border: 1px solid var(--border);
// //   border-radius: 12px;
// //   overflow: hidden;
// //   background: var(--surface);
// // }
// // .stats-table-scroll { max-height: 46vh; overflow-y: auto; }

// // .stats-modal-table { width: 100%; margin: 0; border-collapse: separate; border-spacing: 0; color: var(--text); }
// // .stats-modal-table thead th {
// //   position: sticky;
// //   top: 0;
// //   z-index: 5;
// //   background: #0f1524;
// //   color: var(--text-faint);
// //   font-size: 0.68rem;
// //   font-weight: 700;
// //   letter-spacing: 0.04em;
// //   text-transform: uppercase;
// //   border-bottom: 1px solid var(--border);
// //   padding: 0.6rem 0.7rem;
// //   white-space: nowrap;
// // }
// // .stats-modal-table tbody td {
// //   padding: 0.55rem 0.7rem;
// //   font-size: 0.83rem;
// //   border-bottom: 1px solid var(--border);
// //   vertical-align: middle;
// // }
// // .stats-modal-table tbody tr:last-child td { border-bottom: none; }
// // .stats-modal-table tbody tr:hover td { background-color: var(--surface-hover); }
// // .stats-modal-table tbody tr.is-top-row td { background-color: rgba(45, 212, 191, 0.05); }

// // .stats-rank-index {
// //   display: inline-flex;
// //   align-items: center;
// //   justify-content: center;
// //   width: 22px;
// //   height: 22px;
// //   border-radius: 6px;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   color: var(--text-faint);
// //   font-family: 'JetBrains Mono', monospace;
// //   font-size: 0.72rem;
// //   font-weight: 700;
// // }
// // .stats-rank-index.is-first {
// //   background: rgba(45, 212, 191, 0.14);
// //   border-color: rgba(45, 212, 191, 0.4);
// //   color: var(--accent);
// // }

// // .stats-theme-name { color: #fff; font-weight: 600; }
// // .stats-chef-name { color: var(--text-muted); font-size: 0.79rem; }

// // .stats-count-chip {
// //   display: inline-flex;
// //   align-items: center;
// //   justify-content: center;
// //   min-width: 26px;
// //   padding: 0.15rem 0.4rem;
// //   border-radius: 6px;
// //   font-family: 'JetBrains Mono', monospace;
// //   font-size: 0.74rem;
// //   font-weight: 700;
// // }

// // .stats-total-cell { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
// // .stats-total-value { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #fff; font-size: 0.85rem; }
// // .stats-progress-track {
// //   width: 64px;
// //   height: 4px;
// //   border-radius: 999px;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   overflow: hidden;
// // }
// // .stats-progress-fill { height: 100%; background: var(--accent); border-radius: 999px; }

// // .stats-share-value { font-family: 'JetBrains Mono', monospace; color: var(--text-muted); font-size: 0.8rem; }

// // .stats-modal-table tfoot th {
// //   position: sticky;
// //   bottom: 0;
// //   background: #141c2c;
// //   border-top: 1px solid var(--accent);
// //   color: #fff;
// //   font-size: 0.76rem;
// //   font-weight: 700;
// //   padding: 0.6rem 0.7rem;
// // }
// // .stats-foot-chip {
// //   display: inline-flex;
// //   align-items: center;
// //   justify-content: center;
// //   min-width: 30px;
// //   padding: 0.18rem 0.45rem;
// //   border-radius: 6px;
// //   background: var(--surface-2);
// //   border: 1px solid var(--border);
// //   color: var(--text);
// //   font-family: 'JetBrains Mono', monospace;
// //   font-size: 0.76rem;
// // }

// // .stats-modal-footer {
// //   display: flex;
// //   align-items: center;
// //   justify-content: space-between;
// //   gap: 0.6rem;
// // }
// // .stats-footer-note { font-size: 0.72rem; color: var(--text-faint); }

// // @media (max-width: 767px) {
// //   .matrix-shell { padding: 1rem 0.85rem 2rem; }
// //   .matrix-toolbar { flex-direction: column; align-items: stretch; }
// //   .bulk-actions { margin-left: 0; }
// // }
// // `;

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

// // function SelectionCell({ selected, rankNum, onClick }) {
// //   return (
// //     <td className="sel-cell" onClick={onClick}>
// //       {selected ? (
// //         <span
// //           className="badge-rank-selection is-selected"
// //           style={getRankBadgeStyle(rankNum)}
// //           title={`Vœu ${rankLabel(rankNum)} — cliquer pour retirer`}
// //         >
// //           ✓ {rankLabel(rankNum)}
// //         </span>
// //       ) : (
// //         <span className="badge-rank-selection is-pending" title="Cliquer pour ajouter comme vœu">
// //           +
// //         </span>
// //       )}
// //     </td>
// //   );
// // }

// // function MobileStudentCard({ etud, chefs, selectionsMap, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
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
// //             const prio = selectionsMap.get(key);
// //             const isSelected = Boolean(prio);
// //             return (
// //               <span
// //                 key={chef.id}
// //                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
// //                 style={isSelected ? getRankBadgeStyle(prio) : undefined}
// //                 onClick={() => onToggleSelection(etud.id, chef.id)}
// //               >
// //                 {isSelected ? `✓ ${chef.nom} · ${rankLabel(prio)}` : `+ ${chef.nom}`}
// //               </span>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default function SelectionPage() {
// //   const [chefs, setChefs] = useState([]);
// //   const [etudiants, setEtudiants] = useState([]);
// //   const [referentielCompetences, setReferentielCompetences] = useState([]);

// //   // Map "etudiantId-chefId" => priorite (1, 2, 3...)
// //   const [selectionsMap, setSelectionsMap] = useState(new Map());
// //   const [initialSelectionsMap, setInitialSelectionsMap] = useState(new Map());

// //   const [searchStudent, setSearchStudent] = useState('');
// //   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [successMsg, setSuccessMsg] = useState(null);

// //   const [showResetModal, setShowResetModal] = useState(false);
// //   const [resetting, setResetting] = useState(false);

// //   // Modale Statistiques par thématique
// //   const [showStatsModal, setShowStatsModal] = useState(false);

// //   const [density, setDensity] = useState('compact');
// //   const [showFullNames, setShowFullNames] = useState(false);
// //   const [expandedMobileIds, setExpandedMobileIds] = useState(new Set());

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

// //       const [chefsData, etudiantsData, selectionsData, refCompsData] = await Promise.all([
// //         fetchChefsDeProjet(),
// //         fetchEtudiants(),
// //         fetchSelections(),
// //         fetchReferentielCompetences(true),
// //       ]);

// //       setChefs(chefsData || []);
// //       setEtudiants(etudiantsData || []);
// //       setReferentielCompetences(refCompsData || []);

// //       const activeMap = new Map();
// //       (selectionsData || []).forEach((s) => {
// //         if (s.etudiant_id && s.chef_de_projet_id) {
// //           activeMap.set(`${s.etudiant_id}-${s.chef_de_projet_id}`, s.priorite || 1);
// //         }
// //       });

// //       setSelectionsMap(new Map(activeMap));
// //       setInitialSelectionsMap(new Map(activeMap));
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors du chargement des données.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const hasChanges = useMemo(() => {
// //     if (selectionsMap.size !== initialSelectionsMap.size) return true;
// //     for (const [key, prio] of selectionsMap.entries()) {
// //       if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
// //         return true;
// //       }
// //     }
// //     return false;
// //   }, [selectionsMap, initialSelectionsMap]);

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
// //     for (const key of selectionsMap.keys()) {
// //       const [etudId] = key.split('-');
// //       map[etudId] = (map[etudId] || 0) + 1;
// //     }
// //     return map;
// //   }, [selectionsMap]);

// //   const countsPerChef = useMemo(() => {
// //     const map = {};
// //     for (const key of selectionsMap.keys()) {
// //       const [, chefId] = key.split('-');
// //       map[chefId] = (map[chefId] || 0) + 1;
// //     }
// //     return map;
// //   }, [selectionsMap]);

// //   // ==========================================================================
// //   // Calcul statistique des vœux par Thématique & Chef
// //   // ==========================================================================
// //   const statsByThematique = useMemo(() => {
// //     let maxP = 3;
// //     for (const p of selectionsMap.values()) {
// //       if (p > maxP) maxP = p;
// //     }

// //     const priorityCols = Array.from({ length: maxP }, (_, i) => i + 1);

// //     const rows = chefs.map((chef) => {
// //       const counts = {};
// //       priorityCols.forEach((p) => {
// //         counts[p] = 0;
// //       });
// //       let total = 0;

// //       for (const [key, prio] of selectionsMap.entries()) {
// //         const [, cId] = key.split('-').map(Number);
// //         if (cId === chef.id) {
// //           counts[prio] = (counts[prio] || 0) + 1;
// //           total++;
// //         }
// //       }

// //       return {
// //         chefId: chef.id,
// //         chefNom: chef.nom,
// //         specialite: chef.specialite || 'Non renseignée',
// //         counts,
// //         total,
// //         p1: counts[1] || 0,
// //       };
// //     });

// //     // Tri par popularité du 1er choix décroissant, puis par total
// //     rows.sort((a, b) => b.p1 - a.p1 || b.total - a.total);

// //     // Totaux des colonnes
// //     const colTotals = {};
// //     priorityCols.forEach((p) => {
// //       colTotals[p] = 0;
// //     });
// //     let grandTotal = 0;

// //     rows.forEach((r) => {
// //       priorityCols.forEach((p) => {
// //         colTotals[p] += r.counts[p] || 0;
// //       });
// //       grandTotal += r.total;
// //     });

// //     return {
// //       priorityCols,
// //       rows,
// //       colTotals,
// //       grandTotal,
// //     };
// //   }, [chefs, selectionsMap]);

// //   // Export Excel des statistiques de thématiques
// //   const handleExportStatsXLSX = () => {
// //     try {
// //       const exportRows = statsByThematique.rows.map((r, idx) => {
// //         const rowData = {
// //           'Rang': idx + 1,
// //           'Thématique': r.specialite,
// //           'Chef de Projet': r.chefNom,
// //         };
// //         statsByThematique.priorityCols.forEach((p) => {
// //           rowData[`${rankLabel(p)} Choix`] = r.counts[p] || 0;
// //         });
// //         rowData['Total Vœux'] = r.total;
// //         rowData['% 1er Choix'] = statsByThematique.colTotals[1] > 0
// //           ? `${((r.p1 / statsByThematique.colTotals[1]) * 100).toFixed(1)} %`
// //           : '0 %';
// //         return rowData;
// //       });

// //       const ws = XLSX.utils.json_to_sheet(exportRows);
// //       ws['!cols'] = [
// //         { wch: 6 },
// //         { wch: 45 },
// //         { wch: 22 },
// //         ...statsByThematique.priorityCols.map(() => ({ wch: 14 })),
// //         { wch: 14 },
// //         { wch: 14 },
// //       ];

// //       const wb = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(wb, ws, 'Statistiques Thématiques');
// //       XLSX.writeFile(wb, `statistiques_thematiques_voeux_${new Date().toISOString().slice(0, 10)}.xlsx`);
// //     } catch (err) {
// //       alert(`Erreur export statistiques : ${err.message}`);
// //     }
// //   };

// //   // Bascule ou ajout manuel d'un vœu
// //   const toggleSelection = useCallback((etudiantId, chefId) => {
// //     const key = `${etudiantId}-${chefId}`;
// //     setSelectionsMap((prev) => {
// //       const next = new Map(prev);
// //       if (next.has(key)) {
// //         next.delete(key);
// //       } else {
// //         let maxPrio = 0;
// //         for (const [k, p] of next.entries()) {
// //           if (k.startsWith(`${etudiantId}-`)) {
// //             if (p > maxPrio) maxPrio = p;
// //           }
// //         }
// //         next.set(key, maxPrio + 1);
// //       }
// //       return next;
// //     });
// //     setSuccessMsg(null);
// //   }, []);

// //   const handleSelectAllVisible = () => {
// //     setSelectionsMap((prev) => {
// //       const next = new Map(prev);
// //       filteredEtudiants.forEach((e) => {
// //         let currentPrio = 1;
// //         visibleChefs.forEach((c) => {
// //           const key = `${e.id}-${c.id}`;
// //           if (!next.has(key)) {
// //             next.set(key, currentPrio);
// //             currentPrio++;
// //           }
// //         });
// //       });
// //       return next;
// //     });
// //     setSuccessMsg(null);
// //   };

// //   const handleDeselectAllVisible = () => {
// //     setSelectionsMap((prev) => {
// //       const next = new Map(prev);
// //       filteredEtudiants.forEach((e) => {
// //         visibleChefs.forEach((c) => {
// //           next.delete(`${e.id}-${c.id}`);
// //         });
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

// //       const toUpsert = [];
// //       selectionsMap.forEach((prio, key) => {
// //         const [etudiantId, chefId] = key.split('-').map(Number);
// //         if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
// //           toUpsert.push({ etudiantId, chefId, prio });
// //         }
// //       });

// //       const toDelete = [];
// //       initialSelectionsMap.forEach((_, key) => {
// //         if (!selectionsMap.has(key)) {
// //           const [etudiantId, chefId] = key.split('-').map(Number);
// //           toDelete.push({ etudiantId, chefId });
// //         }
// //       });

// //       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
// //         deleteSelection(etudiantId, chefId)
// //       );
// //       const savePromises = toUpsert.map(({ etudiantId, chefId, prio }) =>
// //         saveSelection(etudiantId, chefId, prio)
// //       );

// //       await Promise.all([...deletePromises, ...savePromises]);

// //       setInitialSelectionsMap(new Map(selectionsMap));
// //       setSuccessMsg(
// //         `✨ Sélections enregistrées (${toUpsert.length} mise(s) à jour, ${toDelete.length} suppression(s)).`
// //       );
// //     } catch (err) {
// //       setError(err.message || "Erreur lors de l'enregistrement.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleResetSelections = async () => {
// //     try {
// //       setResetting(true);
// //       setError(null);
// //       await resetAllSelections();
// //       setSelectionsMap(new Map());
// //       setInitialSelectionsMap(new Map());
// //       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
// //       setShowResetModal(false);
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la réinitialisation des sélections.');
// //     } finally {
// //       setResetting(false);
// //     }
// //   };

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
// //         const row = {
// //           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
// //           'Email': etud.adresse_email || '',
// //           'Parcours': etud.parcours || 'I2026',
// //         };

// //         chefs.forEach((chef) => {
// //           const prio = selectionsMap.get(`${etud.id}-${chef.id}`);
// //           row[chef.nom] = prio ? `${rankLabel(prio)} Choix (P${prio})` : '';
// //         });

// //         row['Total Vœux'] = countsPerStudent[etud.id] || 0;
// //         return row;
// //       });

// //       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
// //       wsSelections['!cols'] = [
// //         { wch: 26 },
// //         { wch: 32 },
// //         { wch: 12 },
// //         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 18) })),
// //         { wch: 16 },
// //       ];

// //       const statsRows = chefs.map((chef) => {
// //         let p1Count = 0;
// //         let totalCount = 0;
// //         for (const [key, prio] of selectionsMap.entries()) {
// //           const [, cId] = key.split('-').map(Number);
// //           if (cId === chef.id) {
// //             totalCount++;
// //             if (prio === 1) p1Count++;
// //           }
// //         }
// //         return {
// //           'Chef de Projet': chef.nom,
// //           'Spécialité': chef.specialite || 'N/A',
// //           'Email': chef.email || '',
// //           'Vœux 1er choix (P1)': p1Count,
// //           'Total Sélections': totalCount,
// //         };
// //       });

// //       const wsStats = XLSX.utils.json_to_sheet(statsRows);
// //       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }, { wch: 18 }];

// //       const workbook = XLSX.utils.book_new();
// //       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
// //       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

// //       const today = new Date().toISOString().slice(0, 10);
// //       XLSX.writeFile(workbook, `selections_voeux_reels_${today}.xlsx`);
// //     } catch (err) {
// //       alert(`Erreur export: ${err.message}`);
// //     }
// //   };

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
// //     const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
// //     const labels = activeComps.map((c) => c.label);
// //     const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
// //     const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);

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
// //   }, [referentielCompetences, aptitudesData, apetencesData]);

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
// //               <h2 className="matrix-title display">🎯 Sélections &amp; Vœux Réels des Étudiants</h2>
// //               <p className="matrix-subtitle">
// //                 Les vœux réels (1er, 2e, 3e choix) sont importés directement depuis le questionnaire Moodle et modifiables par l'administrateur.
// //               </p>
// //             </div>

// //             <div className="d-flex align-items-center gap-2 flex-wrap">
// //               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

// //               {/* Nouveau Bouton Statistiques par Thématique */}
// //               <Button
// //                 className="btn-pill btn-export-pill"
// //                 onClick={() => setShowStatsModal(true)}
// //                 title="Afficher le tableau récapitulatif des choix par thématique"
// //               >
// //                 📊 Stats par thématique
// //               </Button>

// //               <Button
// //                 className="btn-pill btn-danger-pill"
// //                 onClick={() => setShowResetModal(true)}
// //                 disabled={selectionsMap.size === 0 || resetting}
// //                 title="Supprimer toutes les sélections pour repartir de zéro"
// //               >
// //                 🗑️ Vider tout ({selectionsMap.size})
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

// //             <span className="stat-chip accent"><strong>{selectionsMap.size}</strong> sélections</span>
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
// //                     selectionsMap={selectionsMap}
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
// //                             const prio = selectionsMap.get(key);
// //                             const isSelected = Boolean(prio);

// //                             return (
// //                               <SelectionCell
// //                                 key={chef.id}
// //                                 selected={isSelected}
// //                                 rankNum={prio || 1}
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

// //       {/* ========================================================================= */}
// //       {/* NOUVELLE MODALE : STATISTIQUES DES CHOIX PAR THÉMATIQUE                    */}
// //       {/* ========================================================================= */}
// //       <Modal
// //         show={showStatsModal}
// //         onHide={() => setShowStatsModal(false)}
// //         size="xl"
// //         centered
// //         className="modal-dark stats-modal"
// //       >
// //         <Modal.Header closeButton closeVariant="white">
// //           <div className="stats-modal-header">
// //             <div className="stats-modal-icon">◧</div>
// //             <div className="stats-modal-heading">
// //               <p className="stats-modal-eyebrow">Pilotage des vœux</p>
// //               <h2 className="stats-modal-title">Répartition des choix par thématique</h2>
// //             </div>
// //           </div>
// //         </Modal.Header>

// //         <Modal.Body className="stats-modal-body">
// //           {/* Indicateurs clés */}
// //           <div className="stats-kpi-row">
// //             <div className="stats-kpi-card" style={{ '--kpi-accent': '#2dd4bf' }}>
// //               <span className="stats-kpi-label">Total vœux exprimés</span>
// //               <span className="stats-kpi-value">{statsByThematique.grandTotal}</span>
// //               <span className="stats-kpi-sub">Sur {statsByThematique.priorityCols.length} rangs de préférence</span>
// //             </div>

// //             <div className="stats-kpi-card" style={{ '--kpi-accent': '#10b981' }}>
// //               <span className="stats-kpi-label">Thématique la plus demandée</span>
// //               <span
// //                 className="stats-kpi-value is-compact"
// //                 title={statsByThematique.rows[0]?.specialite}
// //               >
// //                 {statsByThematique.rows[0]?.specialite || '—'}
// //               </span>
// //               <span className="stats-kpi-sub">
// //                 <strong>{statsByThematique.rows[0]?.p1 || 0}</strong> fois classée en 1er choix
// //               </span>
// //             </div>

// //             <div className="stats-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
// //               <span className="stats-kpi-label">Étudiants ayant exprimé un vœu</span>
// //               <span className="stats-kpi-value">
// //                 {studentsWithWishes} <span style={{ color: 'var(--text-faint)', fontSize: '1rem' }}>/ {etudiants.length}</span>
// //               </span>
// //               <span className="stats-kpi-sub">
// //                 {etudiants.length > 0 ? `${((studentsWithWishes / etudiants.length) * 100).toFixed(0)} % de couverture` : '—'}
// //               </span>
// //             </div>
// //           </div>

// //           <div className="stats-insight-bar">
// //             <span className="dot">●</span>
// //             <span>
// //               Les thématiques sont classées par nombre décroissant de 1ers choix. Chaque colonne indique le nombre
// //               d'étudiants ayant positionné cette thématique à ce rang précis.
// //             </span>
// //           </div>

// //           {/* Tableau */}
// //           <div className="stats-table-panel">
// //             <div className="stats-table-scroll">
// //               <table className="stats-modal-table">
// //                 <thead>
// //                   <tr>
// //                     <th style={{ width: 40, textAlign: 'center' }}>#</th>
// //                     <th style={{ textAlign: 'left' }}>Thématique</th>
// //                     <th style={{ textAlign: 'left' }}>Chef de projet</th>
// //                     {statsByThematique.priorityCols.map((p) => (
// //                       <th key={p} style={{ textAlign: 'center', minWidth: 90 }}>
// //                         {rankLabel(p)} choix
// //                       </th>
// //                     ))}
// //                     <th style={{ textAlign: 'center', minWidth: 100 }}>Total</th>
// //                     <th style={{ textAlign: 'center', minWidth: 90 }}>Part 1er choix</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {statsByThematique.rows.map((row, idx) => {
// //                     const sharePct = statsByThematique.grandTotal > 0
// //                       ? (row.total / statsByThematique.grandTotal) * 100
// //                       : 0;
// //                     const p1Pct = statsByThematique.colTotals[1] > 0
// //                       ? (row.p1 / statsByThematique.colTotals[1]) * 100
// //                       : 0;

// //                     return (
// //                       <tr key={row.chefId} className={idx === 0 && row.total > 0 ? 'is-top-row' : ''}>
// //                         <td style={{ textAlign: 'center' }}>
// //                           <span className={`stats-rank-index ${idx === 0 ? 'is-first' : ''}`}>{idx + 1}</span>
// //                         </td>
// //                         <td>
// //                           <span className="stats-theme-name">{row.specialite}</span>
// //                         </td>
// //                         <td>
// //                           <span className="stats-chef-name">{row.chefNom}</span>
// //                         </td>
// //                         {statsByThematique.priorityCols.map((p) => {
// //                           const count = row.counts[p] || 0;
// //                           return (
// //                             <td key={p} style={{ textAlign: 'center' }}>
// //                               <span
// //                                 className="stats-count-chip"
// //                                 style={{
// //                                   ...getRankBadgeStyle(p),
// //                                   opacity: count > 0 ? 1 : 0.28,
// //                                 }}
// //                               >
// //                                 {count}
// //                               </span>
// //                             </td>
// //                           );
// //                         })}
// //                         <td>
// //                           <div className="stats-total-cell">
// //                             <span className="stats-total-value">{row.total}</span>
// //                             <span className="stats-progress-track">
// //                               <span className="stats-progress-fill" style={{ width: `${sharePct}%` }} />
// //                             </span>
// //                           </div>
// //                         </td>
// //                         <td style={{ textAlign: 'center' }}>
// //                           <span className="stats-share-value">{p1Pct.toFixed(1)} %</span>
// //                         </td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //                 <tfoot>
// //                   <tr>
// //                     <th colSpan={3} style={{ textAlign: 'right' }}>Totaux globaux</th>
// //                     {statsByThematique.priorityCols.map((p) => (
// //                       <th key={p} style={{ textAlign: 'center' }}>
// //                         <span className="stats-foot-chip">{statsByThematique.colTotals[p]}</span>
// //                       </th>
// //                     ))}
// //                     <th style={{ textAlign: 'center' }}>
// //                       <span className="stats-foot-chip" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
// //                         {statsByThematique.grandTotal}
// //                       </span>
// //                     </th>
// //                     <th style={{ textAlign: 'center', color: 'var(--accent)' }}>100 %</th>
// //                   </tr>
// //                 </tfoot>
// //               </table>
// //             </div>
// //           </div>
// //         </Modal.Body>

// //         <Modal.Footer className="stats-modal-footer">
// //           <span className="stats-footer-note">
// //             {statsByThematique.rows.length} thématique(s) · {statsByThematique.grandTotal} vœu(x) au total
// //           </span>
// //           <div className="d-flex gap-2">
// //             <Button className="btn-pill btn-export-pill" size="sm" onClick={handleExportStatsXLSX}>
// //               Exporter en Excel (.xlsx)
// //             </Button>
// //             <Button className="btn-pill btn-ghost" size="sm" onClick={() => setShowStatsModal(false)}>
// //               Fermer
// //             </Button>
// //           </div>
// //         </Modal.Footer>
// //       </Modal>

// //       {/* Modal Confirmation Réinitialisation Sélections */}
// //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white" className="danger-header">
// //           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <p>
// //             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selectionsMap.size} vœux)</strong> de la base de données ?
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

// //       {/* Modal Radar Dynamique */}
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
//   fetchReferentielCompetences,
//   fetchAptitudesByEtudiant,
//   fetchApetencesByEtudiant,
//   getDocumentPublicUrl,
// } from '../services/supabase';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // ============================================================================
// // Helpers visuels
// // ============================================================================

// const getRankBadgeStyle = (rank) => {
//   switch (Number(rank)) {
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

// const rankLabel = (rank) => (Number(rank) === 1 ? '1er' : `${rank}e`);

// const chefInitials = (nom = '') =>
//   nom
//     .replace(/Ã©/gi, 'E')
//     .replace(/Ã/gi, 'A')
//     .replace(/\s+/g, '')
//     .slice(0, 4)
//     .toUpperCase();

// function useIsMobile(breakpoint = 768) {
//   const [isMobile, setIsMobile] = useState(
//     () => typeof window !== 'undefined' && window.innerWidth < breakpoint
//   );

//   useEffect(() => {
//     if (typeof window !== 'undefined') return undefined;
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
//   min-width: 38px;
//   justify-content: center;
//   padding: 3px 8px;
//   border-radius: 7px;
//   font-weight: 700;
//   font-size: 0.74rem;
//   user-select: none;
//   transition: transform 0.12s ease;
// }
// .badge-rank-selection.is-pending {
//   background: transparent;
//   border: 1px dashed var(--border);
//   color: var(--text-faint);
//   opacity: 0.5;
// }
// .sel-cell:hover .badge-rank-selection.is-pending {
//   opacity: 1;
//   border-color: var(--accent);
//   color: var(--accent);
//   transform: scale(1.15);
// }
// .badge-rank-selection.is-selected { border-style: solid; }
// .sel-cell:hover .badge-rank-selection.is-selected { transform: scale(1.08); }

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
// .modal-dark .modal-dialog { --bs-modal-width: 600px; }
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

// /* Style de la table de statistiques */
// .stats-table thead th {
//   background: #0f1524 !important;
//   color: var(--text-muted);
//   font-size: 0.74rem;
//   text-transform: uppercase;
//   letter-spacing: 0.5px;
//   border-bottom: 2px solid rgba(45, 212, 191, 0.3) !important;
//   vertical-align: middle;
// }
// .stats-table tfoot th {
//   background: #141c2c !important;
//   border-top: 2px solid var(--accent);
//   color: #fff;
//   font-weight: 800;
// }
// .stats-table tbody tr:hover td {
//   background-color: rgba(45, 212, 191, 0.06) !important;
// }

// /* ==========================================================================
//    Modale "Statistiques par thématique" — mise en page niveau entreprise
//    ========================================================================== */
// .stats-modal .modal-dialog { --bs-modal-width: 980px; }
// .stats-modal .modal-content { border-radius: 18px; }

// .stats-modal-header {
//   display: flex;
//   align-items: center;
//   gap: 0.85rem;
// }
// .stats-modal-icon {
//   width: 40px;
//   height: 40px;
//   border-radius: 10px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: var(--accent-soft);
//   border: 1px solid rgba(45, 212, 191, 0.35);
//   color: var(--accent);
//   font-size: 1.05rem;
//   flex-shrink: 0;
// }
// .stats-modal-heading { display: flex; flex-direction: column; gap: 0.15rem; }
// .stats-modal-title {
//   font-size: 1.05rem;
//   font-weight: 700;
//   color: #fff;
//   letter-spacing: -0.01em;
//   margin: 0;
// }
// .stats-modal-eyebrow {
//   font-size: 0.72rem;
//   color: var(--text-faint);
//   margin: 0;
// }

// .stats-modal-body { padding: 1.4rem 1.5rem 1.5rem !important; }

// .stats-kpi-row {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 0.85rem;
//   margin-bottom: 1.4rem;
// }
// @media (max-width: 767px) {
//   .stats-kpi-row { grid-template-columns: 1fr; }
// }
// .stats-kpi-card {
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: 12px;
//   padding: 0.95rem 1.05rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.35rem;
//   position: relative;
//   overflow: hidden;
// }
// .stats-kpi-card::before {
//   content: '';
//   position: absolute;
//   top: 0; left: 0;
//   width: 3px;
//   height: 100%;
//   background: var(--kpi-accent, var(--accent));
// }
// .stats-kpi-label {
//   font-size: 0.7rem;
//   font-weight: 600;
//   color: var(--text-faint);
//   letter-spacing: 0.02em;
// }
// .stats-kpi-value {
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 1.55rem;
//   font-weight: 700;
//   color: #fff;
//   line-height: 1.1;
// }
// .stats-kpi-value.is-compact {
//   font-family: 'Space Grotesk', sans-serif;
//   font-size: 1.05rem;
//   font-weight: 700;
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
// .stats-kpi-sub { font-size: 0.74rem; color: var(--text-muted); }
// .stats-kpi-sub strong { color: var(--accent); font-family: 'JetBrains Mono', monospace; }

// .stats-insight-bar {
//   display: flex;
//   align-items: flex-start;
//   gap: 0.55rem;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   border-radius: 10px;
//   padding: 0.6rem 0.85rem;
//   margin-bottom: 1.1rem;
//   color: var(--text-muted);
//   font-size: 0.78rem;
//   line-height: 1.5;
// }
// .stats-insight-bar .dot { color: var(--accent); flex-shrink: 0; margin-top: 0.15rem; }

// .stats-table-panel {
//   border: 1px solid var(--border);
//   border-radius: 12px;
//   overflow: hidden;
//   background: var(--surface);
// }
// .stats-table-scroll { max-height: 46vh; overflow-y: auto; }

// .stats-modal-table { width: 100%; margin: 0; border-collapse: separate; border-spacing: 0; color: var(--text); }
// .stats-modal-table thead th {
//   position: sticky;
//   top: 0;
//   z-index: 5;
//   background: #0f1524;
//   color: var(--text-faint);
//   font-size: 0.68rem;
//   font-weight: 700;
//   letter-spacing: 0.04em;
//   text-transform: uppercase;
//   border-bottom: 1px solid var(--border);
//   padding: 0.6rem 0.7rem;
//   white-space: nowrap;
// }
// .stats-modal-table tbody td {
//   padding: 0.55rem 0.7rem;
//   font-size: 0.83rem;
//   border-bottom: 1px solid var(--border);
//   vertical-align: middle;
// }
// .stats-modal-table tbody tr:last-child td { border-bottom: none; }
// .stats-modal-table tbody tr:hover td { background-color: var(--surface-hover); }
// .stats-modal-table tbody tr.is-top-row td { background-color: rgba(45, 212, 191, 0.05); }

// .stats-rank-index {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   width: 22px;
//   height: 22px;
//   border-radius: 6px;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   color: var(--text-faint);
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.72rem;
//   font-weight: 700;
// }
// .stats-rank-index.is-first {
//   background: rgba(45, 212, 191, 0.14);
//   border-color: rgba(45, 212, 191, 0.4);
//   color: var(--accent);
// }

// .stats-theme-name { color: #fff; font-weight: 600; }
// .stats-chef-name { color: var(--text-muted); font-size: 0.79rem; }

// .stats-count-chip {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   min-width: 26px;
//   padding: 0.15rem 0.4rem;
//   border-radius: 6px;
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.74rem;
//   font-weight: 700;
// }

// .stats-total-cell { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
// .stats-total-value { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #fff; font-size: 0.85rem; }
// .stats-progress-track {
//   width: 64px;
//   height: 4px;
//   border-radius: 999px;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   overflow: hidden;
// }
// .stats-progress-fill { height: 100%; background: var(--accent); border-radius: 999px; }

// .stats-share-value { font-family: 'JetBrains Mono', monospace; color: var(--text-muted); font-size: 0.8rem; }

// .stats-count-chip.is-clickable { transition: transform 0.12s ease, box-shadow 0.12s ease; }
// .stats-count-chip.is-clickable:hover { transform: scale(1.12); }
// .stats-count-chip.is-active { box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.55); }

// .stats-detail-row td { padding: 0 !important; border-bottom: 1px solid var(--border) !important; }
// .stats-detail-panel {
//   background: var(--surface-2);
//   border-top: 1px dashed var(--border);
//   border-bottom: 1px solid var(--border);
//   padding: 0.65rem 0.9rem 0.8rem;
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// }
// .stats-detail-head {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 0.6rem;
// }
// .stats-detail-title {
//   font-size: 0.76rem;
//   font-weight: 700;
//   color: var(--accent);
//   white-space: normal;
// }
// .stats-detail-close {
//   background: transparent;
//   border: 1px solid var(--border);
//   color: var(--text-faint);
//   border-radius: 6px;
//   width: 22px;
//   height: 22px;
//   line-height: 1;
//   font-size: 0.72rem;
//   cursor: pointer;
//   flex-shrink: 0;
// }
// .stats-detail-close:hover { border-color: var(--accent); color: var(--accent); }
// .stats-detail-students { display: flex; flex-wrap: wrap; gap: 0.35rem; }
// .stats-detail-chip {
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: 999px;
//   padding: 0.22rem 0.6rem;
//   font-size: 0.74rem;
//   color: var(--text);
//   white-space: nowrap;
// }
// .stats-detail-empty { font-size: 0.76rem; color: var(--text-faint); font-style: italic; }

// .stats-modal-table tfoot th {
//   position: sticky;
//   bottom: 0;
//   background: #141c2c;
//   border-top: 1px solid var(--accent);
//   color: #fff;
//   font-size: 0.76rem;
//   font-weight: 700;
//   padding: 0.6rem 0.7rem;
// }
// .stats-foot-chip {
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   min-width: 30px;
//   padding: 0.18rem 0.45rem;
//   border-radius: 6px;
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   color: var(--text);
//   font-family: 'JetBrains Mono', monospace;
//   font-size: 0.76rem;
// }

// .stats-modal-footer {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   gap: 0.6rem;
// }
// .stats-footer-note { font-size: 0.72rem; color: var(--text-faint); }

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

// function SelectionCell({ selected, rankNum, onClick }) {
//   return (
//     <td className="sel-cell" onClick={onClick}>
//       {selected ? (
//         <span
//           className="badge-rank-selection is-selected"
//           style={getRankBadgeStyle(rankNum)}
//           title={`Vœu ${rankLabel(rankNum)} — cliquer pour retirer`}
//         >
//           ✓ {rankLabel(rankNum)}
//         </span>
//       ) : (
//         <span className="badge-rank-selection is-pending" title="Cliquer pour ajouter comme vœu">
//           +
//         </span>
//       )}
//     </td>
//   );
// }

// function MobileStudentCard({ etud, chefs, selectionsMap, expanded, onToggleExpand, onToggleSelection, onOpenRadar, totalForEtud }) {
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
//             const prio = selectionsMap.get(key);
//             const isSelected = Boolean(prio);
//             return (
//               <span
//                 key={chef.id}
//                 className={`mobile-chef-chip ${isSelected ? 'is-selected' : ''}`}
//                 style={isSelected ? getRankBadgeStyle(prio) : undefined}
//                 onClick={() => onToggleSelection(etud.id, chef.id)}
//               >
//                 {isSelected ? `✓ ${chef.nom} · ${rankLabel(prio)}` : `+ ${chef.nom}`}
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
//   const [referentielCompetences, setReferentielCompetences] = useState([]);

//   // Map "etudiantId-chefId" => priorite (1, 2, 3...)
//   const [selectionsMap, setSelectionsMap] = useState(new Map());
//   const [initialSelectionsMap, setInitialSelectionsMap] = useState(new Map());

//   const [searchStudent, setSearchStudent] = useState('');
//   const [selectedChefFilter, setSelectedChefFilter] = useState('all');

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   const [showResetModal, setShowResetModal] = useState(false);
//   const [resetting, setResetting] = useState(false);

//   // Modale Statistiques par thématique
//   const [showStatsModal, setShowStatsModal] = useState(false);
//   const [activeStatsCell, setActiveStatsCell] = useState(null); // { chefId, priority } | null

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

//       const [chefsData, etudiantsData, selectionsData, refCompsData] = await Promise.all([
//         fetchChefsDeProjet(),
//         fetchEtudiants(),
//         fetchSelections(),
//         fetchReferentielCompetences(true),
//       ]);

//       setChefs(chefsData || []);
//       setEtudiants(etudiantsData || []);
//       setReferentielCompetences(refCompsData || []);

//       const activeMap = new Map();
//       (selectionsData || []).forEach((s) => {
//         if (s.etudiant_id && s.chef_de_projet_id) {
//           activeMap.set(`${s.etudiant_id}-${s.chef_de_projet_id}`, s.priorite || 1);
//         }
//       });

//       setSelectionsMap(new Map(activeMap));
//       setInitialSelectionsMap(new Map(activeMap));
//     } catch (err) {
//       setError(err.message || 'Erreur lors du chargement des données.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const hasChanges = useMemo(() => {
//     if (selectionsMap.size !== initialSelectionsMap.size) return true;
//     for (const [key, prio] of selectionsMap.entries()) {
//       if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
//         return true;
//       }
//     }
//     return false;
//   }, [selectionsMap, initialSelectionsMap]);

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
//     for (const key of selectionsMap.keys()) {
//       const [etudId] = key.split('-');
//       map[etudId] = (map[etudId] || 0) + 1;
//     }
//     return map;
//   }, [selectionsMap]);

//   const countsPerChef = useMemo(() => {
//     const map = {};
//     for (const key of selectionsMap.keys()) {
//       const [, chefId] = key.split('-');
//       map[chefId] = (map[chefId] || 0) + 1;
//     }
//     return map;
//   }, [selectionsMap]);

//   // ==========================================================================
//   // Calcul statistique des vœux par Thématique & Chef
//   // ==========================================================================
//   const statsByThematique = useMemo(() => {
//     let maxP = 3;
//     for (const p of selectionsMap.values()) {
//       if (p > maxP) maxP = p;
//     }

//     const priorityCols = Array.from({ length: maxP }, (_, i) => i + 1);

//     // Permet de retrouver le nom complet d'un étudiant à partir de son id,
//     // pour afficher le détail nominatif derrière chaque chiffre.
//     const etudiantsById = new Map(etudiants.map((e) => [e.id, e]));

//     const rows = chefs.map((chef) => {
//       const counts = {};
//       const studentsByPriority = {};
//       priorityCols.forEach((p) => {
//         counts[p] = 0;
//         studentsByPriority[p] = [];
//       });
//       let total = 0;

//       for (const [key, prio] of selectionsMap.entries()) {
//         const [eId, cId] = key.split('-').map(Number);
//         if (cId === chef.id) {
//           counts[prio] = (counts[prio] || 0) + 1;
//           if (!studentsByPriority[prio]) studentsByPriority[prio] = [];
//           const etud = etudiantsById.get(eId);
//           studentsByPriority[prio].push(etud ? `${etud.nom} ${etud.prenom}`.trim() : `Étudiant #${eId}`);
//           total++;
//         }
//       }

//       return {
//         chefId: chef.id,
//         chefNom: chef.nom,
//         specialite: chef.specialite || 'Non renseignée',
//         counts,
//         studentsByPriority,
//         total,
//         p1: counts[1] || 0,
//       };
//     });

//     // Tri par popularité du 1er choix décroissant, puis par total
//     rows.sort((a, b) => b.p1 - a.p1 || b.total - a.total);

//     // Totaux des colonnes
//     const colTotals = {};
//     priorityCols.forEach((p) => {
//       colTotals[p] = 0;
//     });
//     let grandTotal = 0;

//     rows.forEach((r) => {
//       priorityCols.forEach((p) => {
//         colTotals[p] += r.counts[p] || 0;
//       });
//       grandTotal += r.total;
//     });

//     return {
//       priorityCols,
//       rows,
//       colTotals,
//       grandTotal,
//     };
//   }, [chefs, selectionsMap, etudiants]);

//   // Export Excel des statistiques de thématiques
//   const handleExportStatsXLSX = () => {
//     try {
//       const exportRows = statsByThematique.rows.map((r, idx) => {
//         const rowData = {
//           'Rang': idx + 1,
//           'Thématique': r.specialite,
//           'Chef de Projet': r.chefNom,
//         };
//         statsByThematique.priorityCols.forEach((p) => {
//           rowData[`${rankLabel(p)} Choix`] = r.counts[p] || 0;
//         });
//         rowData['Total Vœux'] = r.total;
//         rowData['% 1er Choix'] = statsByThematique.colTotals[1] > 0
//           ? `${((r.p1 / statsByThematique.colTotals[1]) * 100).toFixed(1)} %`
//           : '0 %';
//         return rowData;
//       });

//       const ws = XLSX.utils.json_to_sheet(exportRows);
//       ws['!cols'] = [
//         { wch: 6 },
//         { wch: 45 },
//         { wch: 22 },
//         ...statsByThematique.priorityCols.map(() => ({ wch: 14 })),
//         { wch: 14 },
//         { wch: 14 },
//       ];

//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Statistiques Thématiques');
//       XLSX.writeFile(wb, `statistiques_thematiques_voeux_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     } catch (err) {
//       alert(`Erreur export statistiques : ${err.message}`);
//     }
//   };

//   // Affiche/masque la liste nominative des étudiants derrière un chiffre du tableau de stats
//   const handleToggleStatsCell = (chefId, priority) => {
//     setActiveStatsCell((prev) =>
//       prev && prev.chefId === chefId && prev.priority === priority ? null : { chefId, priority }
//     );
//   };

//   // Bascule ou ajout manuel d'un vœu
//   const toggleSelection = useCallback((etudiantId, chefId) => {
//     const key = `${etudiantId}-${chefId}`;
//     setSelectionsMap((prev) => {
//       const next = new Map(prev);
//       if (next.has(key)) {
//         next.delete(key);
//       } else {
//         let maxPrio = 0;
//         for (const [k, p] of next.entries()) {
//           if (k.startsWith(`${etudiantId}-`)) {
//             if (p > maxPrio) maxPrio = p;
//           }
//         }
//         next.set(key, maxPrio + 1);
//       }
//       return next;
//     });
//     setSuccessMsg(null);
//   }, []);

//   const handleSelectAllVisible = () => {
//     setSelectionsMap((prev) => {
//       const next = new Map(prev);
//       filteredEtudiants.forEach((e) => {
//         let currentPrio = 1;
//         visibleChefs.forEach((c) => {
//           const key = `${e.id}-${c.id}`;
//           if (!next.has(key)) {
//             next.set(key, currentPrio);
//             currentPrio++;
//           }
//         });
//       });
//       return next;
//     });
//     setSuccessMsg(null);
//   };

//   const handleDeselectAllVisible = () => {
//     setSelectionsMap((prev) => {
//       const next = new Map(prev);
//       filteredEtudiants.forEach((e) => {
//         visibleChefs.forEach((c) => {
//           next.delete(`${e.id}-${c.id}`);
//         });
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

//       const toUpsert = [];
//       selectionsMap.forEach((prio, key) => {
//         const [etudiantId, chefId] = key.split('-').map(Number);
//         if (!initialSelectionsMap.has(key) || initialSelectionsMap.get(key) !== prio) {
//           toUpsert.push({ etudiantId, chefId, prio });
//         }
//       });

//       const toDelete = [];
//       initialSelectionsMap.forEach((_, key) => {
//         if (!selectionsMap.has(key)) {
//           const [etudiantId, chefId] = key.split('-').map(Number);
//           toDelete.push({ etudiantId, chefId });
//         }
//       });

//       const deletePromises = toDelete.map(({ etudiantId, chefId }) =>
//         deleteSelection(etudiantId, chefId)
//       );
//       const savePromises = toUpsert.map(({ etudiantId, chefId, prio }) =>
//         saveSelection(etudiantId, chefId, prio)
//       );

//       await Promise.all([...deletePromises, ...savePromises]);

//       setInitialSelectionsMap(new Map(selectionsMap));
//       setSuccessMsg(
//         `✨ Sélections enregistrées (${toUpsert.length} mise(s) à jour, ${toDelete.length} suppression(s)).`
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
//       setSelectionsMap(new Map());
//       setInitialSelectionsMap(new Map());
//       setSuccessMsg('🗑️ Toutes les sélections ont été réinitialisées avec succès.');
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
//         const row = {
//           'Étudiant': `${etud.nom || ''} ${etud.prenom || ''}`.trim(),
//           'Email': etud.adresse_email || '',
//           'Parcours': etud.parcours || 'I2026',
//         };

//         chefs.forEach((chef) => {
//           const prio = selectionsMap.get(`${etud.id}-${chef.id}`);
//           row[chef.nom] = prio ? `${rankLabel(prio)} Choix (P${prio})` : '';
//         });

//         row['Total Vœux'] = countsPerStudent[etud.id] || 0;
//         return row;
//       });

//       const wsSelections = XLSX.utils.json_to_sheet(selectionRows);
//       wsSelections['!cols'] = [
//         { wch: 26 },
//         { wch: 32 },
//         { wch: 12 },
//         ...chefs.map((c) => ({ wch: Math.max(c.nom.length + 4, 18) })),
//         { wch: 16 },
//       ];

//       const statsRows = chefs.map((chef) => {
//         let p1Count = 0;
//         let totalCount = 0;
//         for (const [key, prio] of selectionsMap.entries()) {
//           const [, cId] = key.split('-').map(Number);
//           if (cId === chef.id) {
//             totalCount++;
//             if (prio === 1) p1Count++;
//           }
//         }
//         return {
//           'Chef de Projet': chef.nom,
//           'Spécialité': chef.specialite || 'N/A',
//           'Email': chef.email || '',
//           'Vœux 1er choix (P1)': p1Count,
//           'Total Sélections': totalCount,
//         };
//       });

//       const wsStats = XLSX.utils.json_to_sheet(statsRows);
//       wsStats['!cols'] = [{ wch: 26 }, { wch: 30 }, { wch: 32 }, { wch: 22 }, { wch: 18 }];

//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, wsSelections, 'Sélections');
//       XLSX.utils.book_append_sheet(workbook, wsStats, 'Statistiques');

//       const today = new Date().toISOString().slice(0, 10);
//       XLSX.writeFile(workbook, `selections_voeux_reels_${today}.xlsx`);
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
//               <h2 className="matrix-title display">🎯 Sélections &amp; Vœux Réels des Étudiants</h2>
//               <p className="matrix-subtitle">
//                 Les vœux réels (1er, 2e, 3e choix) sont importés directement depuis le questionnaire Moodle et modifiables par l'administrateur.
//               </p>
//             </div>

//             <div className="d-flex align-items-center gap-2 flex-wrap">
//               {hasChanges && <span className="pending-chip">⚠️ Modifications non enregistrées</span>}

//               {/* Nouveau Bouton Statistiques par Thématique */}
//               <Button
//                 className="btn-pill btn-export-pill"
//                 onClick={() => setShowStatsModal(true)}
//                 title="Afficher le tableau récapitulatif des choix par thématique"
//               >
//                 📊 Stats par thématique
//               </Button>

//               <Button
//                 className="btn-pill btn-danger-pill"
//                 onClick={() => setShowResetModal(true)}
//                 disabled={selectionsMap.size === 0 || resetting}
//                 title="Supprimer toutes les sélections pour repartir de zéro"
//               >
//                 🗑️ Vider tout ({selectionsMap.size})
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

//             <span className="stat-chip accent"><strong>{selectionsMap.size}</strong> sélections</span>
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
//                     selectionsMap={selectionsMap}
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
//                             const prio = selectionsMap.get(key);
//                             const isSelected = Boolean(prio);

//                             return (
//                               <SelectionCell
//                                 key={chef.id}
//                                 selected={isSelected}
//                                 rankNum={prio || 1}
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

//       {/* ========================================================================= */}
//       {/* NOUVELLE MODALE : STATISTIQUES DES CHOIX PAR THÉMATIQUE                    */}
//       {/* ========================================================================= */}
//       <Modal
//         show={showStatsModal}
//         onHide={() => {
//           setShowStatsModal(false);
//           setActiveStatsCell(null);
//         }}
//         size="xl"
//         centered
//         className="modal-dark stats-modal"
//       >
//         <Modal.Header closeButton closeVariant="white">
//           <div className="stats-modal-header">
//             <div className="stats-modal-icon">◧</div>
//             <div className="stats-modal-heading">
//               <p className="stats-modal-eyebrow">Pilotage des vœux</p>
//               <h2 className="stats-modal-title">Répartition des choix par thématique</h2>
//             </div>
//           </div>
//         </Modal.Header>

//         <Modal.Body className="stats-modal-body">
//           {/* Indicateurs clés */}
//           <div className="stats-kpi-row">
//             <div className="stats-kpi-card" style={{ '--kpi-accent': '#2dd4bf' }}>
//               <span className="stats-kpi-label">Total vœux exprimés</span>
//               <span className="stats-kpi-value">{statsByThematique.grandTotal}</span>
//               <span className="stats-kpi-sub">Sur {statsByThematique.priorityCols.length} rangs de préférence</span>
//             </div>

//             <div className="stats-kpi-card" style={{ '--kpi-accent': '#10b981' }}>
//               <span className="stats-kpi-label">Thématique la plus demandée</span>
//               <span
//                 className="stats-kpi-value is-compact"
//                 title={statsByThematique.rows[0]?.specialite}
//               >
//                 {statsByThematique.rows[0]?.specialite || '—'}
//               </span>
//               <span className="stats-kpi-sub">
//                 <strong>{statsByThematique.rows[0]?.p1 || 0}</strong> fois classée en 1er choix
//               </span>
//             </div>

//             <div className="stats-kpi-card" style={{ '--kpi-accent': '#38bdf8' }}>
//               <span className="stats-kpi-label">Étudiants ayant exprimé un vœu</span>
//               <span className="stats-kpi-value">
//                 {studentsWithWishes} <span style={{ color: 'var(--text-faint)', fontSize: '1rem' }}>/ {etudiants.length}</span>
//               </span>
//               <span className="stats-kpi-sub">
//                 {etudiants.length > 0 ? `${((studentsWithWishes / etudiants.length) * 100).toFixed(0)} % de couverture` : '—'}
//               </span>
//             </div>
//           </div>

//           <div className="stats-insight-bar">
//             <span className="dot">●</span>
//             <span>
//               Les thématiques sont classées par nombre décroissant de 1ers choix. Toutes les colonnes de rang
//               réellement utilisées sont affichées, même faiblement représentées. Cliquez sur un chiffre pour
//               afficher la liste nominative des étudiants concernés.
//             </span>
//           </div>

//           {/* Tableau */}
//           <div className="stats-table-panel">
//             <div className="stats-table-scroll">
//               <table className="stats-modal-table">
//                 <thead>
//                   <tr>
//                     <th style={{ width: 40, textAlign: 'center' }}>#</th>
//                     <th style={{ textAlign: 'left' }}>Thématique</th>
//                     <th style={{ textAlign: 'left' }}>Chef de projet</th>
//                     {statsByThematique.priorityCols.map((p) => (
//                       <th key={p} style={{ textAlign: 'center', minWidth: 90 }}>
//                         {rankLabel(p)} choix
//                       </th>
//                     ))}
//                     <th style={{ textAlign: 'center', minWidth: 100 }}>Total</th>
//                     <th style={{ textAlign: 'center', minWidth: 90 }}>Part 1er choix</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {statsByThematique.rows.map((row, idx) => {
//                     const sharePct = statsByThematique.grandTotal > 0
//                       ? (row.total / statsByThematique.grandTotal) * 100
//                       : 0;
//                     const p1Pct = statsByThematique.colTotals[1] > 0
//                       ? (row.p1 / statsByThematique.colTotals[1]) * 100
//                       : 0;

//                     const isCellActive = (p) =>
//                       activeStatsCell && activeStatsCell.chefId === row.chefId && activeStatsCell.priority === p;

//                     const detailPriority =
//                       activeStatsCell && activeStatsCell.chefId === row.chefId ? activeStatsCell.priority : null;

//                     return (
//                       <React.Fragment key={row.chefId}>
//                         <tr className={idx === 0 && row.total > 0 ? 'is-top-row' : ''}>
//                           <td style={{ textAlign: 'center' }}>
//                             <span className={`stats-rank-index ${idx === 0 ? 'is-first' : ''}`}>{idx + 1}</span>
//                           </td>
//                           <td>
//                             <span className="stats-theme-name">{row.specialite}</span>
//                           </td>
//                           <td>
//                             <span className="stats-chef-name">{row.chefNom}</span>
//                           </td>
//                           {statsByThematique.priorityCols.map((p) => {
//                             const count = row.counts[p] || 0;
//                             return (
//                               <td key={p} style={{ textAlign: 'center' }}>
//                                 <span
//                                   className={`stats-count-chip ${count > 0 ? 'is-clickable' : ''} ${isCellActive(p) ? 'is-active' : ''}`}
//                                   style={{
//                                     ...getRankBadgeStyle(p),
//                                     opacity: count > 0 ? 1 : 0.28,
//                                     cursor: count > 0 ? 'pointer' : 'default',
//                                   }}
//                                   onClick={() => count > 0 && handleToggleStatsCell(row.chefId, p)}
//                                   title={count > 0 ? 'Cliquer pour voir les étudiants concernés' : undefined}
//                                 >
//                                   {count}
//                                 </span>
//                               </td>
//                             );
//                           })}
//                           <td>
//                             <div className="stats-total-cell">
//                               <span className="stats-total-value">{row.total}</span>
//                               <span className="stats-progress-track">
//                                 <span className="stats-progress-fill" style={{ width: `${sharePct}%` }} />
//                               </span>
//                             </div>
//                           </td>
//                           <td style={{ textAlign: 'center' }}>
//                             <span className="stats-share-value">{p1Pct.toFixed(1)} %</span>
//                           </td>
//                         </tr>

//                         {detailPriority !== null && (
//                           <tr className="stats-detail-row">
//                             <td colSpan={3 + statsByThematique.priorityCols.length + 2}>
//                               <div className="stats-detail-panel">
//                                 <div className="stats-detail-head">
//                                   <span className="stats-detail-title">
//                                     {rankLabel(detailPriority)} choix · {row.specialite} ({row.chefNom})
//                                   </span>
//                                   <button
//                                     type="button"
//                                     className="stats-detail-close"
//                                     onClick={() => setActiveStatsCell(null)}
//                                   >
//                                     ✕
//                                   </button>
//                                 </div>
//                                 <div className="stats-detail-students">
//                                   {(row.studentsByPriority[detailPriority] || []).length > 0 ? (
//                                     row.studentsByPriority[detailPriority].map((name, i) => (
//                                       <span key={i} className="stats-detail-chip">{name}</span>
//                                     ))
//                                   ) : (
//                                     <span className="stats-detail-empty">Aucun étudiant sur ce rang.</span>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <th colSpan={3} style={{ textAlign: 'right' }}>Totaux globaux</th>
//                     {statsByThematique.priorityCols.map((p) => (
//                       <th key={p} style={{ textAlign: 'center' }}>
//                         <span className="stats-foot-chip">{statsByThematique.colTotals[p]}</span>
//                       </th>
//                     ))}
//                     <th style={{ textAlign: 'center' }}>
//                       <span className="stats-foot-chip" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
//                         {statsByThematique.grandTotal}
//                       </span>
//                     </th>
//                     <th style={{ textAlign: 'center', color: 'var(--accent)' }}>100 %</th>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           </div>
//         </Modal.Body>

//         <Modal.Footer className="stats-modal-footer">
//           <span className="stats-footer-note">
//             {statsByThematique.rows.length} thématique(s) · {statsByThematique.grandTotal} vœu(x) au total
//           </span>
//           <div className="d-flex gap-2">
//             <Button className="btn-pill btn-export-pill" size="sm" onClick={handleExportStatsXLSX}>
//               Exporter en Excel (.xlsx)
//             </Button>
//             <Button className="btn-pill btn-ghost" size="sm" onClick={() => setShowStatsModal(false)}>
//               Fermer
//             </Button>
//           </div>
//         </Modal.Footer>
//       </Modal>

//       {/* Modal Confirmation Réinitialisation Sélections */}
//       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white" className="danger-header">
//           <Modal.Title>⚠️ Réinitialiser toutes les sélections</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             Êtes-vous certain de vouloir <strong>supprimer toutes les sélections actuelles ({selectionsMap.size} vœux)</strong> de la base de données ?
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
  resetAllEvaluations,
  fetchSelections,
  fetchAffectations,
  saveAffectation,
  deleteAffectation,
  resetAllAffectations,
  fetchAllApetences,
  fetchReferentielCompetences,
  fetchAptitudesByEtudiant,
  fetchApetencesByEtudiant,
  computeChefRanksForStudent,
  getDocumentPublicUrl,
  fetchQuotasChefs,
  saveQuotaChef,
  calculateChefGradeQuotas,
  DEFAULT_GRADE_PERCENTAGES,
} from '../services/supabase';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const NOTES_DISPONIBLES = ['A', 'B', 'C', 'D'];

const CHEF_ABBR_LEN = 4;
const abbreviateChefName = (nom = '') => {
  const clean = nom.trim();
  if (!clean) return '—';
  return clean.slice(0, CHEF_ABBR_LEN).toUpperCase();
};

const rankBadgeVariant = (rank) => (rank === 1 ? 'success' : rank === 2 ? 'info' : 'warning');
const rankBadgeText = (rank) => (rank === 1 ? 'light' : 'dark');
const rankLabel = (rank) => (rank === 1 ? '1er' : `${rank}e`);

// Couleurs des puces de répartition par rang de choix (dégradé du plus favorable au moins favorable)
const CHOICE_CHIP_COLORS = ['#10b981', '#06b6d4', '#7c6cf6', '#f59e0b', '#fb6f92', '#f87171'];
const choiceChipColor = (rank) => CHOICE_CHIP_COLORS[Math.min(rank - 1, CHOICE_CHIP_COLORS.length - 1)];

// Couleurs d'accent par note (réutilise la palette déjà utilisée dans getNoteSquareStyle / jauges)
const NOTE_ACCENT_COLORS = { A: '#10b981', B: '#06b6d4', C: '#f59e0b', D: '#f87171' };

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
  const [referentielCompetences, setReferentielCompetences] = useState([]);
  const [quotasChefs, setQuotasChefs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingKey, setSavingKey] = useState(null);
  const [savedSuccessKey, setSavedSuccessKey] = useState(null);

  const [savingAffectationId, setSavingAffectationId] = useState(null);
  const [savingAffectationChefId, setSavingAffectationChefId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [localFormData, setLocalFormData] = useState({});
  const [statusFilter, setStatusFilter] = useState('all');
  const [density, setDensity] = useState('compact');

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

  // Modale Jauges / Quotas (Admin)
  const [modalQuotasOpen, setModalQuotasOpen] = useState(false);
  const [selectedChefForQuota, setSelectedChefForQuota] = useState('all');
  const [quotaFormA, setQuotaFormA] = useState(25);
  const [quotaFormB, setQuotaFormB] = useState(25);
  const [quotaFormC, setQuotaFormC] = useState(25);
  const [quotaFormD, setQuotaFormD] = useState(25);
  const [savingQuota, setSavingQuota] = useState(false);

  // Modal Réinitialisation
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTarget, setResetTarget] = useState('evaluations');
  const [resetting, setResetting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [etuds, chefsData, evals, sels, affs, apList, refCompsData, quotasData] = await Promise.all([
        fetchEtudiants(),
        fetchChefsDeProjet(),
        fetchEvaluations(),
        fetchSelections(),
        fetchAffectations(),
        fetchAllApetences(),
        fetchReferentielCompetences(true),
        fetchQuotasChefs(),
      ]);

      setEtudiants(etuds || []);
      setChefs(chefsData || []);
      setEvaluations(evals || []);
      setSelections(sels || []);
      setAffectations(affs || []);
      setApetencesList(apList || []);
      setReferentielCompetences(refCompsData || []);
      setQuotasChefs(quotasData || []);

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

  // Map des quotas par chef
  const quotasMap = useMemo(() => {
    const map = new Map();
    (quotasChefs || []).forEach((q) => {
      map.set(q.chef_de_projet_id, {
        pourcentage_a: Number(q.pourcentage_a ?? 25),
        pourcentage_b: Number(q.pourcentage_b ?? 25),
        pourcentage_c: Number(q.pourcentage_c ?? 25),
        pourcentage_d: Number(q.pourcentage_d ?? 25),
      });
    });
    return map;
  }, [quotasChefs]);

  const appetenceRanksMap = useMemo(() => {
    const map = new Map();
    const apetencesByEtud = new Map(apetencesList.map((a) => [a.etudiant_id, a]));

    etudiants.forEach((etud) => {
      const etudAp = apetencesByEtud.get(etud.id);
      const ranks = computeChefRanksForStudent(etudAp, chefs, referentielCompetences);
      map.set(etud.id, ranks);
    });

    return map;
  }, [apetencesList, etudiants, chefs, referentielCompetences]);

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

    if (isChef && chefId) {
      return [...list].sort((a, b) => {
        const rankA = appetenceRanksMap.get(a.id)?.get(chefId)?.rank ?? 999;
        const rankB = appetenceRanksMap.get(b.id)?.get(chefId)?.rank ?? 999;
        return rankA - rankB;
      });
    }

    return list;
  }, [etudiants, isChef, chefId, selections, searchTerm, appetenceRanksMap, isAdmin, statusFilter, affectationsMap]);

  // Statistiques et quotas du chef connecté en direct
  const chefGaugesStats = useMemo(() => {
    if (!isChef || !chefId) return null;

    const assignedStudentsCount = selections.filter((s) => s.chef_de_projet_id === chefId).length;
    const chefPct = quotasMap.get(chefId) || DEFAULT_GRADE_PERCENTAGES;
    const targetQuotas = calculateChefGradeQuotas(assignedStudentsCount, chefPct);

    // Notes actuellement enregistrées en base pour ce chef
    const evalsForThisChef = evaluations.filter((e) => e.chef_de_projet_id === chefId);
    const countA = evalsForThisChef.filter((e) => e.note === 'A').length;
    const countB = evalsForThisChef.filter((e) => e.note === 'B').length;
    const countC = evalsForThisChef.filter((e) => e.note === 'C').length;
    const countD = evalsForThisChef.filter((e) => e.note === 'D').length;

    return {
      assignedTotal: assignedStudentsCount,
      evaluatedTotal: evalsForThisChef.length,
      pct: chefPct,
      targets: targetQuotas,
      counts: { countA, countB, countC, countD },
    };
  }, [isChef, chefId, selections, quotasMap, evaluations]);

  // Répartition des affectations par rang de choix (1er, 2e, 3e, ... jusqu'au dernier chef), pas uniquement les 3 premiers
  const satisfactionBreakdown = useMemo(() => {
    const counts = new Map();
    let horsVoeux = 0;

    etudiants.forEach((etud) => {
      const aff = affectationsMap.get(etud.id);
      if (!aff) return;
      const rankInfo = appetenceRanksMap.get(etud.id)?.get(aff.chef_id);
      if (rankInfo) {
        counts.set(rankInfo.rank, (counts.get(rankInfo.rank) || 0) + 1);
      } else {
        horsVoeux += 1;
      }
    });

    const maxRank = chefs.length;
    const byRank = [];
    for (let r = 1; r <= maxRank; r += 1) {
      byRank.push({ rank: r, count: counts.get(r) || 0 });
    }

    return { byRank, horsVoeux };
  }, [etudiants, affectationsMap, appetenceRanksMap, chefs]);

  const getEval = (etudiantId, cId) =>
    evaluations.find((e) => e.etudiant_id === etudiantId && e.chef_de_projet_id === cId);

  // Vérifie si une note est bloquée par son quota pour un étudiant donné
  const isGradeBlockedForStudent = (grade, etudiantId) => {
    if (!isChef || !chefGaugesStats) return false;

    const existingEval = getEval(etudiantId, chefId);
    // Si l'étudiant a déjà cette note, il a le droit de la conserver
    if (existingEval?.note === grade) return false;

    const maxAllowed = chefGaugesStats.targets[`max${grade}`];
    const currentCount = chefGaugesStats.counts[`count${grade}`];

    return currentCount >= maxAllowed;
  };

  const getGradeMax = (grade) => {
    if (!chefGaugesStats) return 0;
    return chefGaugesStats.targets[`max${grade}`] ?? 0;
  };

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

  // Enregistrement de l'évaluation avec vérification stricte du quota
  const handleSaveEvaluation = async (etudiantId, cId) => {
    const key = `${etudiantId}-${cId}`;
    const formVal = localFormData[key] || {};
    const note = formVal.note || '';
    const commentaire = formVal.commentaire || '';

    if (!note && !commentaire) {
      setError('Veuillez renseigner au moins une note ou un commentaire.');
      return;
    }

    // Blocage strict du quota pour le chef de projet
    if (isChef && note) {
      const existingEval = getEval(etudiantId, cId);
      const isAlreadyThisNote = existingEval?.note === note;

      if (!isAlreadyThisNote && chefGaugesStats) {
        const targetMax = chefGaugesStats.targets[`max${note}`];
        const currentCount = chefGaugesStats.counts[`count${note}`];

        if (currentCount >= targetMax) {
          setError(
            `🚫 Quota dépassé pour la note ${note} : vous avez déjà attribué le nombre maximal autorisé (${targetMax} max). Veuillez modifier une note ${note} existante avant d'en attribuer une nouvelle.`
          );
          return;
        }
      }
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

  const handleAssign = async (etudiantId, targetChefIdStr, cellChefId) => {
    setSavingAffectationId(etudiantId);
    setSavingAffectationChefId(cellChefId);
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
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement de l'affectation.");
    } finally {
      setSavingAffectationId(null);
      setSavingAffectationChefId(null);
    }
  };

  const handleSaveQuotas = async () => {
    const sum = Number(quotaFormA) + Number(quotaFormB) + Number(quotaFormC) + Number(quotaFormD);
    if (sum !== 100) {
      alert(`La somme des pourcentages doit être exactement égale à 100% (actuellement : ${sum}%).`);
      return;
    }

    try {
      setSavingQuota(true);
      const payload = {
        pourcentage_a: quotaFormA,
        pourcentage_b: quotaFormB,
        pourcentage_c: quotaFormC,
        pourcentage_d: quotaFormD,
      };

      if (selectedChefForQuota === 'all') {
        await Promise.all(chefs.map((c) => saveQuotaChef(c.id, payload)));
      } else {
        await saveQuotaChef(Number(selectedChefForQuota), payload);
      }

      await loadData();
      setModalQuotasOpen(false);
    } catch (err) {
      alert(`Erreur sauvegarde quotas : ${err.message}`);
    } finally {
      setSavingQuota(false);
    }
  };

  const handleResetEvaluationsOrAffectations = async () => {
    try {
      setResetting(true);
      setError(null);

      if (resetTarget === 'evaluations' || resetTarget === 'both') {
        await resetAllEvaluations();
        setEvaluations([]);
        setLocalFormData({});
      }

      if (resetTarget === 'affectations' || resetTarget === 'both') {
        await resetAllAffectations();
        setAffectations([]);
      }

      setShowResetModal(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setResetting(false);
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
      const [aptitudes, apetences, refComps] = await Promise.all([
        fetchAptitudesByEtudiant(etudiant.id),
        fetchApetencesByEtudiant(etudiant.id),
        fetchReferentielCompetences(true),
      ]);

      setReferentielCompetences(refComps || []);

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
  }, [referentielCompetences, aptitudesData, apetencesData]);

  const radarAverages = useMemo(() => {
    const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];
    const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
    const aptValues = activeComps.map((c) => aptitudesData?.[c.code] ?? 0);
    const apeValues = activeComps.map((c) => apetencesData?.[c.code] ?? 0);
    return { aptitude: avg(aptValues), appetence: avg(apeValues) };
  }, [referentielCompetences, aptitudesData, apetencesData]);

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
          --accent-amber: #f5b942;
          --accent-emerald: #35d0a0;
          --accent-coral: #ff6b6b;
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
          padding: 0px 4px;
          font-size: 0.65rem;
          line-height: 1.25;
          cursor: pointer;
        }

        .name-text-link {
          cursor: pointer;
          color: var(--accent-cyan);
          text-decoration: none;
        }
        .name-text-link:hover {
          text-decoration: underline;
        }

        .affectation-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          min-width: 30px;
          justify-content: center;
          padding: 2px 6px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.62rem;
          letter-spacing: 0.2px;
          cursor: pointer;
          user-select: none;
          transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease, background 0.12s ease;
        }
        .affectation-pill.is-pending {
          background: transparent;
          border: 1px dashed var(--border-strong);
          color: var(--text-muted);
          opacity: 0.7;
        }
        tr:hover .affectation-pill.is-pending {
          opacity: 1;
          border-color: var(--accent-violet);
          color: var(--accent-violet);
        }
        .affectation-pill.is-pending:hover {
          transform: translateY(-1px);
        }
        .affectation-pill.is-assigned {
          background: linear-gradient(135deg, var(--accent-violet), #5b4bd6);
          border: 1px solid #9b8ff9;
          color: #fff;
        }
        .affectation-pill.is-assigned:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .btn-danger-pill {
          background: rgba(239, 68, 68, 0.14) !important;
          color: #f87171 !important;
          border: 1px solid rgba(239, 68, 68, 0.35) !important;
          border-radius: 8px !important;
        }
        .btn-danger-pill:hover:not(:disabled) {
          background: #dc2626 !important;
          color: #ffffff !important;
          border-color: #dc2626 !important;
        }

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

        .eval-matrix-wrapper {
          max-height: 76vh;
          overflow: auto;
        }
        .eval-matrix {
          font-size: 0.76rem;
        }
        .eval-matrix td, .eval-matrix th {
          padding: 0.2rem 0.3rem;
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
        // .col-student {
        //   position: sticky;
        //   left: 0;
        //   z-index: 6;
        //   background: var(--panel-solid);
        //   text-align: left !important;
        //   width: ${firstColWidth}px;
        //   min-width: ${firstColWidth}px;
        //   max-width: ${firstColWidth}px;
        //   border-right: 2px solid rgba(124, 108, 246, 0.35);
        // }
        .col-student {
            position: sticky;
            left: 0;
            z-index: 6;
            background: var(--panel-solid) !important;   /* ← !important ajouté */
            text-align: left !important;
            width: ${firstColWidth}px;
            min-width: ${firstColWidth}px;
            max-width: ${firstColWidth}px;
            border-right: 2px solid rgba(124, 108, 246, 0.35);
          }
        // thead .col-student { z-index: 15; }
        thead .col-student {
              z-index: 15;
              background: var(--panel-solid) !important;   /* ← on force ici aussi */
            }
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
          gap: 0.3rem;
        }
        .student-name-cell .name-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 600;
          font-size: 0.8rem;
        }
        .density-toggle .btn { font-size: 0.72rem; padding: 0.2rem 0.55rem; }

        .note-rank-square {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 26px;
          height: 22px;
          padding: 0 5px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.66rem;
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

        .note-rank-square {
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.12s ease, border-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
}
.note-rank-square.is-assigned {
  box-shadow: 0 0 0 2px #10b981, 0 2px 8px rgba(16, 185, 129, 0.35);
}
.note-rank-square.is-assigned:hover {
  transform: translateY(-1px) scale(1.05);
}
.note-rank-square.is-pending:hover {
  opacity: 1;
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

        .chef-eval-row {
          padding: 0.6rem 0.9rem;
        }

        /* Bannière de Jauges Chef */
        .gauges-dashboard-card {
          background: linear-gradient(135deg, rgba(21, 27, 46, 0.95), rgba(27, 35, 56, 0.95));
          border: 1px solid var(--border-strong);
          border-radius: 12px;
          padding: 0.85rem 1.15rem;
          margin-bottom: 1rem;
        }
        .gauge-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 0.4rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

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

        /* ===================== Vue Chef — mise en page "dashboard" ===================== */
        .chef-toolbar-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          flex-wrap: wrap;
          padding: 0 0.15rem 0.75rem 0.15rem;
        }
        .chef-toolbar-strip .chef-toolbar-hint {
          color: var(--text-muted);
          font-size: 0.78rem;
        }
        .chef-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .chef-student-card {
          padding: 0;
          overflow: hidden;
          border-left: 4px solid var(--border-strong) !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
        }
        .chef-student-card:hover {
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
          transform: translateY(-1px);
        }
        .chef-card-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 0.9rem 1.1rem 0.8rem 1.1rem;
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.015);
        }
        .chef-identity-block {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }
        .chef-avatar {
          flex-shrink: 0;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.85rem;
          letter-spacing: 0.3px;
          color: #fff;
          background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
          box-shadow: 0 4px 14px rgba(124, 108, 246, 0.28);
        }
        .chef-identity-text {
          min-width: 0;
        }
        .chef-identity-text .chef-student-email {
          color: var(--text-muted);
          font-size: 0.74rem;
        }
        .chef-status-badges {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .chef-doc-link {
          font-size: 0.72rem;
        }
        .chef-card-body-row {
          padding: 0.9rem 1.1rem 1rem 1.1rem;
        }
        .chef-section-label {
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.3rem;
        }
        .chef-save-btn {
          height: 100%;
          min-height: 38px;
        }
        @media (max-width: 991.98px) {
          .chef-card-header-row { padding: 0.85rem 0.9rem; }
          .chef-card-body-row { padding: 0.85rem 0.9rem; }
        }

        /* ===================== Modale "Détail de l'évaluation" — layout entreprise ===================== */
        .detail-modal-content {
          background: var(--panel-solid) !important;
          border: 1px solid var(--border-strong) !important;
          border-radius: 16px !important;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.55);
        }
        .detail-modal-header {
          position: relative;
          padding: 1.35rem 1.6rem 1.1rem 1.6rem;
          background: var(--panel-raised);
          border-bottom: 1px solid var(--border-subtle);
        }
        .detail-modal-eyebrow {
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 0.35rem;
        }
        .detail-modal-identity {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .detail-modal-avatar {
          flex-shrink: 0;
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          color: #fff;
          background: linear-gradient(135deg, var(--accent-violet), var(--accent-cyan));
          box-shadow: 0 4px 14px rgba(124, 108, 246, 0.28);
        }
        .detail-modal-title {
          color: var(--text-primary);
          font-weight: 700;
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.25;
        }
        .detail-modal-subtitle {
          color: var(--text-muted);
          font-size: 0.78rem;
          font-family: 'SFMono-Regular', Consolas, monospace;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .detail-modal-body {
          padding: 1.4rem 1.6rem 1.6rem 1.6rem;
          overflow-x: hidden;
        }
        .detail-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 1.1rem;
        }
        .detail-info-cell {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 0.65rem 0.85rem;
        }
        .detail-info-label {
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.3rem;
        }
        .detail-info-value {
          color: var(--text-primary);
          font-weight: 600;
          font-size: 0.88rem;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        .detail-note-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          height: 26px;
          padding: 0 8px;
          border-radius: 7px;
          font-weight: 800;
          font-size: 0.78rem;
        }
        .detail-comment-label {
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .detail-comment-box {
          background: rgba(255,255,255,0.025);
          border: 1px solid var(--border-subtle);
          border-left: 3px solid var(--accent-cyan);
          border-radius: 0 10px 10px 0;
          padding: 0.9rem 1.05rem;
          color: var(--text-primary);
          font-size: 0.88rem;
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          word-break: break-word;
          max-width: 100%;
          max-height: 40vh;
          overflow-y: auto;
        }
        .detail-modal-footer {
          padding: 1rem 1.6rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 575.98px) {
          .detail-info-grid { grid-template-columns: 1fr; }
        }

        /* ===================== Modale "Résultats Affectations" — layout entreprise ===================== */
        .affectations-modal-content {
          background: var(--panel-solid) !important;
          border: 1px solid var(--border-strong) !important;
          border-radius: 16px !important;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.55);
        }
        .affectations-modal-header {
          padding: 1.35rem 1.75rem 1.1rem 1.75rem;
          background: var(--panel-raised);
          border-bottom: 1px solid var(--border-subtle);
        }
        .affectations-modal-eyebrow {
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--accent-cyan);
          margin-bottom: 0.3rem;
        }
        .affectations-modal-title {
          color: var(--text-primary);
          font-weight: 700;
          margin: 0;
          font-size: 1.25rem;
        }
        .affectations-kpi-strip {
          padding: 1.1rem 1.75rem;
          background: rgba(255,255,255,0.015);
          border-bottom: 1px solid var(--border-subtle);
        }
        .affectations-kpi-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
          margin-bottom: 0.9rem;
        }
        .kpi-tile {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 0.75rem 0.95rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .kpi-tile-label {
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--text-muted);
        }
        .kpi-tile-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
        }
        .kpi-tile-total .kpi-tile-value { color: var(--text-primary); }
        .kpi-tile-success { border-color: rgba(53, 208, 160, 0.35); }
        .kpi-tile-success .kpi-tile-value { color: var(--accent-emerald); }
        .kpi-tile-warning { border-color: rgba(245, 185, 66, 0.35); }
        .kpi-tile-warning .kpi-tile-value { color: var(--accent-amber); }
        .affectations-progress-track {
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .affectations-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));
          transition: width 0.4s ease;
        }
        .affectations-progress-caption {
          display: flex;
          justify-content: space-between;
          margin-top: 0.4rem;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .affectations-breakdown {
          margin-top: 1rem;
        }
        .affectations-breakdown-label {
          text-transform: uppercase;
          letter-spacing: 0.6px;
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .affectations-breakdown-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .choice-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.65rem;
          border-radius: 999px;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          font-size: 0.74rem;
        }
        .choice-chip-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .choice-chip-label {
          color: var(--text-muted);
          font-weight: 600;
        }
        .choice-chip-count {
          color: var(--text-primary);
          font-weight: 800;
          font-variant-numeric: tabular-nums;
        }
        .choice-chip.is-empty {
          opacity: 0.45;
        }
        .choice-chip.is-hors {
          border-color: rgba(248, 113, 113, 0.35);
        }
        .affectations-table-section {
          padding: 1.25rem 1.75rem 1.5rem 1.75rem;
        }
        .affectations-table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .affectations-table-heading h6 {
          color: var(--text-primary);
          font-weight: 700;
          font-size: 0.85rem;
          margin: 0;
        }
        .affectations-table-wrapper {
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          overflow: hidden;
          max-height: 48vh;
          overflow-y: auto;
        }
        .affectations-table {
          font-size: 0.82rem;
          margin: 0;
        }
        .affectations-table thead th {
          position: sticky;
          top: 0;
          z-index: 2;
          background: var(--panel-raised) !important;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.66rem;
          font-weight: 700;
          border-bottom: 1px solid var(--border-subtle) !important;
          padding: 0.65rem 0.85rem;
        }
        .affectations-table tbody td {
          padding: 0.6rem 0.85rem;
          border-color: var(--border-subtle) !important;
          background: transparent !important;
          color: var(--text-primary);
          vertical-align: middle;
        }
        .affectations-table tbody tr:nth-child(even) td {
          background: rgba(255,255,255,0.015) !important;
        }
        .affectations-table tbody tr:hover td {
          background: rgba(124, 108, 246, 0.06) !important;
        }
        .affectations-modal-footer {
          padding: 1rem 1.75rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      <Navbar />

      <div className="eval-page-wrapper">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.6rem' }}></span>
              <h2 className="fw-bold mb-0 text-white" style={{ letterSpacing: '-0.5px', fontSize: '1.5rem' }}>
                {isChef ? `Mes Évaluations — ${chefInfo?.nom || 'Chef de projet'}` : 'Évaluations & Affectations Finales'}
              </h2>
            </div>
            <p className="text-light opacity-75 small mt-1 mb-0">
              {isChef
                ? 'Attribuez vos notes en respectant vos jauges de notation cibles (A, B, C, D). Les notes dont le quota est atteint sont automatiquement bloquées.'
                : 'Consultez les notes des chefs, réglez les jauges de quotas et procédez aux affectations.'}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {isAdmin && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => {
                  setQuotaFormA(25);
                  setQuotaFormB(25);
                  setQuotaFormC(25);
                  setQuotaFormD(25);
                  setModalQuotasOpen(true);
                }}
                className="px-3 py-2 fw-semibold"
                title="Régler les pourcentages autorisés de A, B, C, D par chef"
              >
                ⚙️ Jauges de notation
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalAffectationsOpen(true)}
                className="px-3 py-2 fw-semibold"
              >
                Résultats Affectations ({affectations.length} / {etudiants.length})
              </Button>
            )}

            {/* Bouton Réinitialiser / Vider (Admin uniquement) */}
            {isAdmin && (
              <Button
                className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
                size="sm"
                onClick={() => setShowResetModal(true)}
                title="Supprimer les évaluations ou les affectations"
              >
                <span></span>
                <span>Vider...</span>
              </Button>
            )}

            <Button
              variant="success"
              size="sm"
              onClick={handleExportEvaluationsExcel}
              className="px-3 py-2 fw-semibold"
            >
               Exporter Notes
            </Button>

            {isAdmin && (
              <Button
                variant="outline-info"
                size="sm"
                onClick={handleExportAffectationsExcel}
                className="px-3 py-2 fw-semibold"
              >
                 Exporter Affectations (.xlsx)
              </Button>
            )}

            <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
              🔄 Actualiser
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

        {/* Tableau de bord des Jauges de notation (Vue Chef) */}
        {isChef && chefGaugesStats && (
          <div className="gauges-dashboard-card shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white fs-6">📊 Vos Jauges de notation autorisées</span>
                <Badge bg="secondary" className="font-monospace">
                  {chefGaugesStats.evaluatedTotal} / {chefGaugesStats.assignedTotal} évalué(s)
                </Badge>
              </div>
              <small className="text-muted">
                Objectifs : {chefGaugesStats.pct.pourcentage_a}% A · {chefGaugesStats.pct.pourcentage_b}% B · {chefGaugesStats.pct.pourcentage_c}% C · {chefGaugesStats.pct.pourcentage_d}% D
              </small>
            </div>

            <Row className="g-2">
              <Col xs={6} md={3}>
                <div className="gauge-item">
                  <div>
                    <strong style={{ color: '#10b981' }}>Note A</strong>
                    <div className="small text-muted font-monospace">{chefGaugesStats.pct.pourcentage_a}% max</div>
                  </div>
                  <div className="text-end">
                    <span className={`fw-bold fs-6 ${chefGaugesStats.counts.countA >= chefGaugesStats.targets.maxA ? 'text-warning' : 'text-white'}`}>
                      {chefGaugesStats.counts.countA} / {chefGaugesStats.targets.maxA}
                    </span>
                    {chefGaugesStats.counts.countA >= chefGaugesStats.targets.maxA && (
                      <div className="text-warning small" style={{ fontSize: '0.65rem' }}>🔒 Quota plein</div>
                    )}
                  </div>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="gauge-item">
                  <div>
                    <strong style={{ color: '#06b6d4' }}>Note B</strong>
                    <div className="small text-muted font-monospace">{chefGaugesStats.pct.pourcentage_b}% max</div>
                  </div>
                  <div className="text-end">
                    <span className={`fw-bold fs-6 ${chefGaugesStats.counts.countB >= chefGaugesStats.targets.maxB ? 'text-warning' : 'text-white'}`}>
                      {chefGaugesStats.counts.countB} / {chefGaugesStats.targets.maxB}
                    </span>
                    {chefGaugesStats.counts.countB >= chefGaugesStats.targets.maxB && (
                      <div className="text-warning small" style={{ fontSize: '0.65rem' }}>🔒 Quota plein</div>
                    )}
                  </div>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="gauge-item">
                  <div>
                    <strong style={{ color: '#f59e0b' }}>Note C</strong>
                    <div className="small text-muted font-monospace">{chefGaugesStats.pct.pourcentage_c}% cible</div>
                  </div>
                  <div className="text-end">
                    <span className={`fw-bold fs-6 ${chefGaugesStats.counts.countC >= chefGaugesStats.targets.maxC ? 'text-warning' : 'text-white'}`}>
                      {chefGaugesStats.counts.countC} / {chefGaugesStats.targets.maxC}
                    </span>
                    {chefGaugesStats.counts.countC >= chefGaugesStats.targets.maxC && (
                      <div className="text-warning small" style={{ fontSize: '0.65rem' }}>🔒 Quota plein</div>
                    )}
                  </div>
                </div>
              </Col>

              <Col xs={6} md={3}>
                <div className="gauge-item">
                  <div>
                    <strong style={{ color: '#f87171' }}>Note D</strong>
                    <div className="small text-muted font-monospace">{chefGaugesStats.pct.pourcentage_d}% max</div>
                  </div>
                  <div className="text-end">
                    <span className={`fw-bold fs-6 ${chefGaugesStats.counts.countD >= chefGaugesStats.targets.maxD ? 'text-warning' : 'text-white'}`}>
                      {chefGaugesStats.counts.countD} / {chefGaugesStats.targets.maxD}
                    </span>
                    {chefGaugesStats.counts.countD >= chefGaugesStats.targets.maxD && (
                      <div className="text-warning small" style={{ fontSize: '0.65rem' }}>🔒 Quota plein</div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Barre d'outils */}
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
                  {/* <Button
                    variant={density === 'comfortable' ? 'secondary' : 'outline-secondary'}
                    onClick={() => setDensity('comfortable')}
                    title="Lignes aérées"
                  >
                    ☰ Confort
                  </Button> */}
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
          <div>
            {visibleEtudiants.length > 0 && (
              <div className="chef-toolbar-strip">
                <span className="chef-toolbar-hint">
                  Triés par ordre d'appétence de l'étudiant pour votre projet · cliquez sur un nom pour voir son profil de compétences
                </span>
              </div>
            )}

            {visibleEtudiants.length === 0 ? (
              <Alert variant="secondary" className="text-center py-5">
                Aucun étudiant assigné pour le moment.
              </Alert>
            ) : (
              <div className="chef-cards-grid">
                {visibleEtudiants.map((etud) => {
                  const key = `${etud.id}-${chefId}`;
                  const formVal = localFormData[key] || {};
                  const isSaving = savingKey === key;
                  const isSaved = savedSuccessKey === key;
                  const aff = affectationsMap.get(etud.id);
                  const isAssignedToMe = aff?.chef_id === chefId;
                  const rankInfo = appetenceRanksMap.get(etud.id)?.get(chefId);
                  const rankNum = rankInfo?.rank || 1;
                  const initials = `${etud.nom?.[0] || ''}${etud.prenom?.[0] || ''}`.toUpperCase() || '—';
                  const accentColor = formVal.note ? NOTE_ACCENT_COLORS[formVal.note] : 'var(--border-strong)';

                  return (
                    <Card
                      key={etud.id}
                      className="eval-card chef-student-card shadow-sm border-secondary"
                      style={{ borderLeftColor: accentColor }}
                    >
                      {/* En-tête : identité de l'étudiant + statuts */}
                      <div className="chef-card-header-row">
                        <div className="chef-identity-block">
                          <div className="chef-avatar">{initials}</div>
                          <div className="chef-identity-text">
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <span
                                className="fw-bold fs-6 text-white name-text-link"
                                role="button"
                                tabIndex={0}
                                onClick={() => handleOpenRadar(etud)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleOpenRadar(etud);
                                }}
                                title="Voir le profil de compétences"
                              >
                                {etud.nom} {etud.prenom}
                              </span>
                              <Badge bg="secondary" className="font-monospace">{etud.parcours}</Badge>
                            </div>
                            <div className="chef-student-email font-monospace mt-1">{etud.adresse_email}</div>
                          </div>
                        </div>

                        <div className="chef-status-badges">
                          <Badge bg={rankBadgeVariant(rankNum)} text={rankBadgeText(rankNum)}>
                             {rankNum === 1 ? '1er choix' : `${rankNum}e choix`} ({rankInfo?.score ?? 0}/4)
                          </Badge>
                          {aff && (
                            <Badge bg={isAssignedToMe ? 'success' : 'dark'} className="border border-secondary">
                              {isAssignedToMe ? '🎯 Affecté à vous' : `Affecté : ${aff.chef_nom}`}
                            </Badge>
                          )}
                          {etud.cv_path && (
                            <a href={getDocumentPublicUrl(etud.cv_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none chef-doc-link">
                              📄 CV
                            </a>
                          )}
                          {etud.lm_path && (
                            <a href={getDocumentPublicUrl(etud.lm_path)} target="_blank" rel="noopener noreferrer" className="badge bg-secondary text-decoration-none chef-doc-link">
                              ✉️ LM
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Corps : évaluation */}
                      <div className="chef-card-body-row">
                        <Row className="g-3 align-items-end">
                          {/* Sélecteur de note avec désactivation automatique si quota plein */}
                          <Col lg={3} md={4}>
                            <div className="chef-section-label">Note</div>
                            <Form.Select
                              size="sm"
                              className="bg-dark text-white border-secondary fw-bold"
                              value={formVal.note || ''}
                              onChange={(e) => handleLocalChange(etud.id, chefId, 'note', e.target.value)}
                            >
                              <option value="">— Non noté —</option>
                              {NOTES_DISPONIBLES.map((n) => {
                                const isBlocked = isGradeBlockedForStudent(n, etud.id);
                                const maxVal = getGradeMax(n);
                                return (
                                  <option key={n} value={n} disabled={isBlocked}>
                                    Note {n} {isBlocked ? `(Quota plein : max ${maxVal})` : ''}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </Col>

                          <Col lg={7} md={8}>
                            <div className="chef-section-label">Commentaire</div>
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

                          <Col lg={2} md={12}>
                            <Button
                              variant={isSaved ? 'outline-success' : 'primary'}
                              size="sm"
                              className="w-100 fw-semibold chef-save-btn"
                              disabled={isSaving}
                              onClick={() => handleSaveEvaluation(etud.id, chefId)}
                            >
                              {isSaving ? <Spinner size="sm" animation="border" /> : isSaved ? 'Enregistré ✅' : '💾 Enregistrer'}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VUE ADMIN                                                                 */
          /* ========================================================================= */
          <div className="eval-card overflow-hidden">
            <div className="eval-matrix-wrapper">
              <Table size="sm" hover className="eval-matrix mb-0 text-white text-center align-middle text-nowrap">
                <thead className="table-dark">
                  <tr>
                    <th className="col-student" style={{ paddingLeft: '0.75rem' }}>
                      Étudiant
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
                    const studentRanks = appetenceRanksMap.get(etud.id);
                    const fullName = `${etud.nom} ${etud.prenom}`;

                    return (
                      <tr key={etud.id}>
                        <td className="col-student" style={{ paddingLeft: '0.75rem' }}>
                          <div className="student-name-cell">
                            {withTooltip(
                              `student-tt-${etud.id}`,
                              etud.adresse_email || fullName,
                              <span
                                className="name-text name-text-link"
                                role="button"
                                tabIndex={0}
                                onClick={() => handleOpenRadar(etud)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleOpenRadar(etud);
                                }}
                              >
                                {fullName}
                              </span>
                            )}
                            <div className="d-flex gap-1 flex-shrink-0">
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

                        {chefs.map((c) => {
  const ev = getEval(etud.id, c.id);
  const rankInfo = studentRanks?.get(c.id);
  const hasComment = Boolean(ev?.commentaire?.trim());
  const isAssignedToThisChef = aff?.chef_id === c.id;
  const hasNote = Boolean(ev?.note);
  const squareStyle = hasNote ? getNoteSquareStyle(ev.note) : undefined;
  const rankText = rankInfo ? rankLabel(rankInfo.rank) : '—';
  const isTogglingThisCell = savingAffectationId === etud.id && savingAffectationChefId === c.id;

  return (
    <td
      key={c.id}
      className="col-chef"
      style={{ backgroundColor: isAssignedToThisChef ? 'rgba(16, 185, 129, 0.15)' : 'inherit' }}
    >
      <div className="d-flex align-items-center justify-content-center gap-1">
        {isTogglingThisCell ? (
          <Spinner
            size="sm"
            animation="border"
            variant="info"
            style={{ width: '0.7rem', height: '0.7rem', borderWidth: '1.5px' }}
          />
        ) : (
          <span
            className={`note-rank-square ${hasNote ? 'is-evaluated' : 'is-pending'} ${isAssignedToThisChef ? 'is-assigned' : ''}`}
            style={squareStyle}
            role="button"
            tabIndex={0}
            onClick={() =>
              handleAssign(etud.id, isAssignedToThisChef ? '' : String(c.id), c.id)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAssign(etud.id, isAssignedToThisChef ? '' : String(c.id), c.id);
              }
            }}
            title={
              isAssignedToThisChef
                ? `Affecté à ${c.nom} — ${rankText} choix${hasNote ? ` (Note ${ev.note})` : ''} — cliquer pour retirer`
                : `${rankText} choix${hasNote ? ` (Note ${ev.note})` : ''} — cliquer pour affecter à ${c.nom}`
            }
            aria-label={`Affecter ${fullName} à ${c.nom}`}
          >
            {/* {rankText} */}  {rankText}{isAssignedToThisChef && ' ✓'}
          </span>
        )}

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

      {/* Modale Paramétrage des Jauges de notation (Admin) */}
      <Modal show={modalQuotasOpen} onHide={() => setModalQuotasOpen(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.15rem', color: '#2dd4bf', fontWeight: 700 }}>
            ⚙️ Paramétrage des Jauges de Notation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <Form.Group className="mb-3">
            <Form.Label className="small text-muted fw-bold">Chef de projet cible</Form.Label>
            <Form.Select
              size="sm"
              className="bg-dark text-white border-secondary"
              value={selectedChefForQuota}
              onChange={(e) => setSelectedChefForQuota(e.target.value)}
            >
              <option value="all"> Tous les chefs de projet (Par défaut)</option>
              {chefs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom} {c.specialite ? `(${c.specialite})` : ''}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-subtle)' }}>
            <h6 className="small text-light fw-bold mb-2">Pourcentages cibles autorisés :</h6>
            <Row className="g-2">
              <Col xs={6}>
                <Form.Label className="small text-muted mb-1" style={{ color: '#10b981' }}>Note A (%)</Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  min="0"
                  max="100"
                  className="bg-dark text-white border-secondary font-monospace"
                  value={quotaFormA}
                  onChange={(e) => setQuotaFormA(e.target.value)}
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted mb-1" style={{ color: '#06b6d4' }}>Note B (%)</Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  min="0"
                  max="100"
                  className="bg-dark text-white border-secondary font-monospace"
                  value={quotaFormB}
                  onChange={(e) => setQuotaFormB(e.target.value)}
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted mb-1" style={{ color: '#f59e0b' }}>Note C (%) <small>(ajustement)</small></Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  min="0"
                  max="100"
                  className="bg-dark text-white border-secondary font-monospace"
                  value={quotaFormC}
                  onChange={(e) => setQuotaFormC(e.target.value)}
                />
              </Col>
              <Col xs={6}>
                <Form.Label className="small text-muted mb-1" style={{ color: '#f87171' }}>Note D (%)</Form.Label>
                <Form.Control
                  type="number"
                  size="sm"
                  min="0"
                  max="100"
                  className="bg-dark text-white border-secondary font-monospace"
                  value={quotaFormD}
                  onChange={(e) => setQuotaFormD(e.target.value)}
                />
              </Col>
            </Row>

            <div className="mt-2 text-end small">
              <span className="text-muted">Total : </span>
              <strong className={Number(quotaFormA) + Number(quotaFormB) + Number(quotaFormC) + Number(quotaFormD) === 100 ? 'text-success' : 'text-danger'}>
                {Number(quotaFormA) + Number(quotaFormB) + Number(quotaFormC) + Number(quotaFormD)} %
              </strong>
            </div>
          </div>

          <p className="small text-muted mb-0">
             Les quotas en nombre d'étudiants sont calculés au plus haut pour A, B et D, et le reliquat est automatiquement équilibré sur la note C.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setModalQuotasOpen(false)} disabled={savingQuota}>
            Annuler
          </Button>
          <Button variant="success" size="sm" onClick={handleSaveQuotas} disabled={savingQuota}>
            {savingQuota ? <Spinner size="sm" animation="border" /> : 'Enregistrer les jauges'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmation Réinitialisation Évals / Affectations */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered contentClassName="radar-modal-content">
        <div className="radar-modal-header" style={{ background: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <button type="button" className="radar-modal-close" onClick={() => setShowResetModal(false)}>✕</button>
          <div className="radar-modal-eyebrow" style={{ color: '#f87171' }}>Zone d'administration</div>
          <h4 className="radar-modal-title" style={{ color: '#ffffff', margin: 0 }}>🗑️ Remise à zéro des résultats</h4>
        </div>
        <div className="radar-modal-body" style={{ minHeight: 'auto', padding: '1.5rem' }}>
          <p className="text-light">
            Sélectionnez les données que vous souhaitez supprimer de la base de données :
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <Form.Check
              type="radio"
              id="reset-evals"
              name="reset-eval-target"
              label={`Vider uniquement les Évaluations (${evaluations.length} notes/commentaires)`}
              checked={resetTarget === 'evaluations'}
              onChange={() => setResetTarget('evaluations')}
              className="mb-2 text-white"
            />
            <Form.Check
              type="radio"
              id="reset-affs"
              name="reset-eval-target"
              label={`Vider uniquement les Affectations finales (${affectations.length} affectations)`}
              checked={resetTarget === 'affectations'}
              onChange={() => setResetTarget('affectations')}
              className="mb-2 text-white"
            />
            <Form.Check
              type="radio"
              id="reset-both"
              name="reset-eval-target"
              label="Vider TOUT (Évaluations + Affectations)"
              checked={resetTarget === 'both'}
              onChange={() => setResetTarget('both')}
              className="text-white"
            />
          </div>

          <p className="text-muted small mb-0">
             Cette action est irréversible. Les profils des étudiants et des chefs de projet seront conservés.
          </p>
        </div>
        <div className="radar-modal-footer">
          <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button className="btn-danger-pill" onClick={handleResetEvaluationsOrAffectations} disabled={resetting}>
            {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la suppression'}
          </Button>
        </div>
      </Modal>

      {/* Modal Résultats d'affectations avec rang d'appétence */}
      <Modal show={modalAffectationsOpen} onHide={() => setModalAffectationsOpen(false)} size="xl" centered contentClassName="affectations-modal-content">
        <div className="affectations-modal-header">
          <div className="affectations-modal-eyebrow">Synthèse officielle</div>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <h4 className="affectations-modal-title">Résultats des Affectations</h4>
            <button
              type="button"
              className="radar-modal-close"
              style={{ position: 'static' }}
              onClick={() => setModalAffectationsOpen(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="affectations-kpi-strip">
          <div className="affectations-kpi-row">
            <div className="kpi-tile kpi-tile-total">
              <span className="kpi-tile-label">Total étudiants</span>
              <span className="kpi-tile-value">{etudiants.length}</span>
            </div>
            <div className="kpi-tile kpi-tile-success">
              <span className="kpi-tile-label">Affectés</span>
              <span className="kpi-tile-value">{affectations.length}</span>
            </div>
            <div className="kpi-tile kpi-tile-warning">
              <span className="kpi-tile-label">Non affectés</span>
              <span className="kpi-tile-value">{etudiants.length - affectations.length}</span>
            </div>
          </div>

          <div className="affectations-progress-track">
            <div
              className="affectations-progress-fill"
              style={{ width: `${etudiants.length ? Math.round((affectations.length / etudiants.length) * 100) : 0}%` }}
            />
          </div>
          <div className="affectations-progress-caption">
            <span>Progression des affectations</span>
            <span>{etudiants.length ? Math.round((affectations.length / etudiants.length) * 100) : 0}%</span>
          </div>

          <div className="affectations-breakdown">
            <div className="affectations-breakdown-label">Répartition par rang de choix (tous les choix)</div>
            <div className="affectations-breakdown-chips">
              {satisfactionBreakdown.byRank.map(({ rank, count }) => (
                <span key={rank} className={`choice-chip ${count === 0 ? 'is-empty' : ''}`}>
                  <span className="choice-chip-dot" style={{ background: choiceChipColor(rank) }} />
                  <span className="choice-chip-label">{rankLabel(rank)} choix</span>
                  <span className="choice-chip-count">{count}</span>
                </span>
              ))}
              {satisfactionBreakdown.horsVoeux > 0 && (
                <span className="choice-chip is-hors">
                  <span className="choice-chip-dot" style={{ background: '#f87171' }} />
                  <span className="choice-chip-label">Hors Vœux</span>
                  <span className="choice-chip-count">{satisfactionBreakdown.horsVoeux}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="affectations-table-section">
          <div className="affectations-table-heading">
            <h6>Liste détaillée par étudiant &amp; satisfaction appétence</h6>
          </div>
          <div className="affectations-table-wrapper">
            <Table hover className="affectations-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Chef assigné</th>
                  <th>Satisfaction appétence</th>
                </tr>
              </thead>
              <tbody>
                {etudiants.map((etud) => {
                  const aff = affectationsMap.get(etud.id);
                  const rankInfo = aff ? appetenceRanksMap.get(etud.id)?.get(aff.chef_id) : null;

                  return (
                    <tr key={etud.id}>
                      <td className="fw-semibold">{etud.nom} {etud.prenom}</td>
                      <td className="text-muted font-monospace" style={{ fontSize: '0.78rem' }}>{etud.adresse_email}</td>
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
        </div>

        <div className="affectations-modal-footer">
          <Button variant="success" size="sm" onClick={handleExportAffectationsExcel} className="fw-semibold">
             Télécharger le fichier Excel (.xlsx)
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setModalAffectationsOpen(false)}>
            Fermer
          </Button>
        </div>
      </Modal>

      {/* Modal Commentaire */}
      <Modal show={modalCommentOpen} onHide={() => setModalCommentOpen(false)} centered contentClassName="detail-modal-content">
        <div className="detail-modal-header">
          <div className="detail-modal-eyebrow">Détail de l'évaluation</div>
          <div className="d-flex justify-content-between align-items-start gap-2">
            <div className="detail-modal-identity">
              <div className="detail-modal-avatar">
                {`${selectedCommentData?.etudiant?.nom?.[0] || ''}${selectedCommentData?.etudiant?.prenom?.[0] || ''}`.toUpperCase() || '—'}
              </div>
              <div>
                <h5 className="detail-modal-title">{selectedCommentData?.etudiant?.nom} {selectedCommentData?.etudiant?.prenom}</h5>
                <div className="detail-modal-subtitle">{selectedCommentData?.etudiant?.adresse_email}</div>
              </div>
            </div>
            <button
              type="button"
              className="radar-modal-close"
              style={{ position: 'static', flexShrink: 0 }}
              onClick={() => setModalCommentOpen(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="detail-modal-body">
          <div className="detail-info-grid">
            <div className="detail-info-cell">
              <div className="detail-info-label">Évaluateur</div>
              <div className="detail-info-value">{selectedCommentData?.chef?.nom}</div>
            </div>
            <div className="detail-info-cell">
              <div className="detail-info-label">Note attribuée</div>
              <div className="detail-info-value">
                {NOTES_DISPONIBLES.includes(selectedCommentData?.note) ? (
                  <span className="detail-note-pill" style={getNoteSquareStyle(selectedCommentData?.note)}>
                    {selectedCommentData?.note}
                  </span>
                ) : (
                  <span className="text-muted">{selectedCommentData?.note}</span>
                )}
              </div>
            </div>
          </div>

          <div className="detail-comment-label">Commentaire</div>
          <div className="detail-comment-box">{selectedCommentData?.commentaire}</div>
        </div>

        <div className="detail-modal-footer">
          <Button variant="secondary" size="sm" onClick={() => setModalCommentOpen(false)}>Fermer</Button>
        </div>
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
          <div className="radar-modal-eyebrow">Profil de compétences ({referentielCompetences.length} axes)</div>
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