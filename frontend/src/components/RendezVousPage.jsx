// // // // // // // import React, { useState, useMemo } from 'react';
// // // // // // // import {
// // // // // // //   Table,
// // // // // // //   Button,
// // // // // // //   Alert,
// // // // // // //   Spinner,
// // // // // // //   Form,
// // // // // // //   Card,
// // // // // // //   Row,
// // // // // // //   Col,
// // // // // // //   Badge,
// // // // // // //   InputGroup,
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
// // // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // // import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// // // // // // // import {
// // // // // // //   genererRendezVous,
// // // // // // //   fetchAptitudesByEtudiant,
// // // // // // //   fetchApetencesByEtudiant,
// // // // // // //   getDocumentPublicUrl,
// // // // // // // } from '../services/supabase';

// // // // // // // // Enregistrement des composants Chart.js pour le Radar
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

// // // // // // // export default function RendezVousPage() {
// // // // // // //   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
// // // // // // //   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

// // // // // // //   // Logique de génération (Admin)
// // // // // // //   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
// // // // // // //   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
// // // // // // //   const [generating, setGenerating] = useState(false);
// // // // // // //   const [genError, setGenError] = useState(null);
// // // // // // //   const [genResult, setGenResult] = useState(null);

// // // // // // //   // Filtres en temps réel
// // // // // // //   const [searchQuery, setSearchQuery] = useState('');
// // // // // // //   const [selectedChef, setSelectedChef] = useState('all');
// // // // // // //   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

// // // // // // //   // État du Modal Radar Étudiant
// // // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // // //   const [modalError, setModalError] = useState(null);

// // // // // // //   // Filtrage selon le profil connecté :
// // // // // // //   const visibles = useMemo(() => {
// // // // // // //     if (isAdmin) {
// // // // // // //       return rendezVous;
// // // // // // //     }
// // // // // // //     if (isChef) {
// // // // // // //       // Pour le chef : uniquement ses rendez-vous
// // // // // // //       return rendezVous.filter(
// // // // // // //         (r) =>
// // // // // // //           r.chef_de_projet_id === chefId ||
// // // // // // //           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
// // // // // // //       );
// // // // // // //     }
// // // // // // //     // Pour l'étudiant : uniquement ses propres rendez-vous
// // // // // // //     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
// // // // // // //   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

// // // // // // //   const uniqueChefs = useMemo(() => {
// // // // // // //     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
// // // // // // //     return Array.from(chefs).sort();
// // // // // // //   }, [visibles]);

// // // // // // //   const uniqueDates = useMemo(() => {
// // // // // // //     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
// // // // // // //     return Array.from(dates).sort();
// // // // // // //   }, [visibles]);

// // // // // // //   const filteredRdv = useMemo(() => {
// // // // // // //     return visibles.filter((r) => {
// // // // // // //       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
// // // // // // //       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
// // // // // // //       if (searchQuery.trim()) {
// // // // // // //         const query = searchQuery.toLowerCase().trim();
// // // // // // //         const matchEtud = r.etudiant?.toLowerCase().includes(query);
// // // // // // //         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
// // // // // // //         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
// // // // // // //         if (!matchEtud && !matchEmail && !matchChef) return false;
// // // // // // //       }
// // // // // // //       return true;
// // // // // // //     });
// // // // // // //   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

// // // // // // //   // Ouverture du Popup Radar
// // // // // // //   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
// // // // // // //     if (!etudiant_id) return;
// // // // // // //     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
// // // // // // //     setModalOpen(true);
// // // // // // //     setModalLoading(true);
// // // // // // //     setModalError(null);
// // // // // // //     setAptitudesData(null);
// // // // // // //     setApetencesData(null);

// // // // // // //     try {
// // // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // // //         fetchAptitudesByEtudiant(etudiant_id),
// // // // // // //         fetchApetencesByEtudiant(etudiant_id),
// // // // // // //       ]);

// // // // // // //       if (!aptitudes && !apetences) {
// // // // // // //         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
// // // // // // //       } else {
// // // // // // //         setAptitudesData(aptitudes);
// // // // // // //         setApetencesData(apetences);
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       setModalError(err.message || 'Erreur lors du chargement des compétences.');
// // // // // // //     } finally {
// // // // // // //       setModalLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // Données du graphique Radar
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
// // // // // // //           pointBorderColor: '#ffffff',
// // // // // // //           pointHoverRadius: 6,
// // // // // // //         },
// // // // // // //         {
// // // // // // //           label: 'Appétences (Intérêt)',
// // // // // // //           data: apeValues,
// // // // // // //           backgroundColor: 'rgba(244, 63, 94, 0.25)',
// // // // // // //           borderColor: '#f43f5e',
// // // // // // //           borderWidth: 2,
// // // // // // //           pointBackgroundColor: '#f43f5e',
// // // // // // //           pointBorderColor: '#ffffff',
// // // // // // //           pointHoverRadius: 6,
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
// // // // // // //         ticks: {
// // // // // // //           stepSize: 1,
// // // // // // //           backdropColor: 'transparent',
// // // // // // //           color: '#94a3b8',
// // // // // // //           font: { size: 10 },
// // // // // // //         },
// // // // // // //         grid: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // //         angleLines: { color: 'rgba(255, 255, 255, 0.12)' },
// // // // // // //         pointLabels: { color: '#f8fafc', font: { size: 11, weight: 'bold' } },
// // // // // // //       },
// // // // // // //     },
// // // // // // //     plugins: {
// // // // // // //       legend: {
// // // // // // //         position: 'top',
// // // // // // //         labels: { color: '#ffffff', font: { size: 13, weight: 'bold' } },
// // // // // // //       },
// // // // // // //       tooltip: {
// // // // // // //         backgroundColor: '#0f172a',
// // // // // // //         titleColor: '#38bdf8',
// // // // // // //         bodyColor: '#ffffff',
// // // // // // //         borderColor: 'rgba(255, 255, 255, 0.2)',
// // // // // // //         borderWidth: 1,
// // // // // // //       },
// // // // // // //     },
// // // // // // //   };

// // // // // // //   // Export Excel
// // // // // // //   const handleExportExcel = () => {
// // // // // // //     if (filteredRdv.length === 0) {
// // // // // // //       alert('Aucun rendez-vous à exporter.');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     const exportRows = filteredRdv.map((r) => ({
// // // // // // //       'Date': r.date,
// // // // // // //       'Heure de Début': r.heure_debut,
// // // // // // //       'Heure de Fin': r.heure_fin,
// // // // // // //       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
// // // // // // //       'Chef de Projet': r.chef_de_projet || '',
// // // // // // //       'Étudiant': r.etudiant || '',
// // // // // // //       'Email Étudiant': r.email_etudiant || '',
// // // // // // //     }));

// // // // // // //     const worksheet = XLSX.utils.json_to_sheet(exportRows);
// // // // // // //     worksheet['!cols'] = [
// // // // // // //       { wch: 14 },
// // // // // // //       { wch: 14 },
// // // // // // //       { wch: 14 },
// // // // // // //       { wch: 18 },
// // // // // // //       { wch: 28 },
// // // // // // //       { wch: 28 },
// // // // // // //       { wch: 35 },
// // // // // // //     ];

// // // // // // //     const workbook = XLSX.utils.book_new();
// // // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
// // // // // // //     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // // // // // //   };

// // // // // // //   // Génération du planning (Admin uniquement)
// // // // // // //   const handleGenerate = async () => {
// // // // // // //     const confirmation = window.confirm(
// // // // // // //       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
// // // // // // //     );
// // // // // // //     if (!confirmation) return;

// // // // // // //     setGenerating(true);
// // // // // // //     setGenError(null);
// // // // // // //     setGenResult(null);
// // // // // // //     try {
// // // // // // //       const token = await getIdToken();
// // // // // // //       const result = await genererRendezVous(dateDebut, dateFin, token);
// // // // // // //       setGenResult(result.stats);
// // // // // // //       await refresh();
// // // // // // //     } catch (err) {
// // // // // // //       setGenError(err.message);
// // // // // // //     } finally {
// // // // // // //       setGenerating(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <style>{`
// // // // // // //         .wow-container {
// // // // // // //           max-width: 96%;
// // // // // // //           margin: 0 auto;
// // // // // // //           padding: 2rem 0;
// // // // // // //           color: #f8fafc;
// // // // // // //         }

// // // // // // //         .glass-card {
// // // // // // //           background: rgba(18, 24, 38, 0.75);
// // // // // // //           backdrop-filter: blur(16px);
// // // // // // //           -webkit-backdrop-filter: blur(16px);
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // //           border-radius: 16px;
// // // // // // //           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
// // // // // // //         }

// // // // // // //         .kpi-card {
// // // // // // //           padding: 1.25rem;
// // // // // // //           border-radius: 16px;
// // // // // // //           background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.06);
// // // // // // //           transition: all 0.3s ease;
// // // // // // //         }
// // // // // // //         .kpi-card:hover {
// // // // // // //           transform: translateY(-4px);
// // // // // // //           border-color: rgba(99, 102, 241, 0.4);
// // // // // // //         }

// // // // // // //         .generator-box {
// // // // // // //           background: linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(6, 182, 212, 0.08) 100%);
// // // // // // //           border: 1px solid rgba(99, 102, 241, 0.25);
// // // // // // //           border-radius: 18px;
// // // // // // //         }

// // // // // // //         .btn-glow {
// // // // // // //           background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
// // // // // // //           border: none;
// // // // // // //           color: white;
// // // // // // //           font-weight: 600;
// // // // // // //           border-radius: 12px;
// // // // // // //           box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
// // // // // // //         }

// // // // // // //         .btn-excel {
// // // // // // //           background: linear-gradient(135deg, #10b981 0%, #059669 100%);
// // // // // // //           border: none;
// // // // // // //           color: #ffffff;
// // // // // // //           font-weight: 600;
// // // // // // //           border-radius: 10px;
// // // // // // //         }

// // // // // // //         .wow-table {
// // // // // // //           background: transparent !important;
// // // // // // //           color: #e2e8f0 !important;
// // // // // // //         }
// // // // // // //         .wow-table thead th {
// // // // // // //           background: rgba(15, 23, 42, 0.95) !important;
// // // // // // //           color: #94a3b8;
// // // // // // //           font-size: 0.75rem;
// // // // // // //           text-transform: uppercase;
// // // // // // //           letter-spacing: 0.08em;
// // // // // // //           padding: 1rem;
// // // // // // //         }
// // // // // // //         .wow-table tbody tr {
// // // // // // //           border-bottom: 1px solid rgba(255, 255, 255, 0.04);
// // // // // // //         }
// // // // // // //         .wow-table tbody tr:hover {
// // // // // // //           background-color: rgba(99, 102, 241, 0.07) !important;
// // // // // // //         }

// // // // // // //         .time-pill {
// // // // // // //           background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(99, 102, 241, 0.15));
// // // // // // //           border: 1px solid rgba(6, 182, 212, 0.3);
// // // // // // //           color: #38bdf8;
// // // // // // //           padding: 6px 14px;
// // // // // // //           border-radius: 20px;
// // // // // // //           font-weight: 600;
// // // // // // //           font-family: monospace;
// // // // // // //           font-size: 0.85rem;
// // // // // // //         }

// // // // // // //         .date-pill {
// // // // // // //           background: rgba(255, 255, 255, 0.06);
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.12);
// // // // // // //           color: #cbd5e1;
// // // // // // //           padding: 5px 12px;
// // // // // // //           border-radius: 8px;
// // // // // // //           font-family: monospace;
// // // // // // //         }

// // // // // // //         .avatar-student-btn {
// // // // // // //           cursor: pointer;
// // // // // // //           transition: all 0.2s ease;
// // // // // // //           display: inline-flex;
// // // // // // //           align-items: center;
// // // // // // //           gap: 10px;
// // // // // // //           padding: 4px 6px;
// // // // // // //           border-radius: 8px;
// // // // // // //         }
// // // // // // //         .avatar-student-btn:hover {
// // // // // // //           background: rgba(139, 92, 246, 0.2);
// // // // // // //         }

// // // // // // //         .avatar-icon {
// // // // // // //           width: 32px;
// // // // // // //           height: 32px;
// // // // // // //           border-radius: 8px;
// // // // // // //           background: linear-gradient(135deg, #8b5cf6, #6366f1);
// // // // // // //           display: inline-flex;
// // // // // // //           align-items: center;
// // // // // // //           justify-content: center;
// // // // // // //           font-weight: bold;
// // // // // // //           font-size: 0.8rem;
// // // // // // //           color: white;
// // // // // // //         }

// // // // // // //         /* Boutons Documents CV / LM */
// // // // // // //         .doc-badge-btn {
// // // // // // //           background: rgba(99, 102, 241, 0.18);
// // // // // // //           border: 1px solid rgba(99, 102, 241, 0.4);
// // // // // // //           color: #a5b4fc;
// // // // // // //           padding: 3px 7px;
// // // // // // //           border-radius: 6px;
// // // // // // //           font-size: 0.72rem;
// // // // // // //           font-weight: 600;
// // // // // // //           text-decoration: none;
// // // // // // //           display: inline-flex;
// // // // // // //           align-items: center;
// // // // // // //           gap: 3px;
// // // // // // //         }
// // // // // // //         .doc-badge-btn:hover {
// // // // // // //           background: rgba(99, 102, 241, 0.45);
// // // // // // //           color: #ffffff;
// // // // // // //         }
// // // // // // //         .doc-badge-disabled {
// // // // // // //           background: rgba(255, 255, 255, 0.03);
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // //           color: rgba(255, 255, 255, 0.25);
// // // // // // //           padding: 3px 7px;
// // // // // // //           border-radius: 6px;
// // // // // // //           font-size: 0.72rem;
// // // // // // //           cursor: not-allowed;
// // // // // // //         }

// // // // // // //         .custom-input {
// // // // // // //           background: rgba(15, 23, 42, 0.6) !important;
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.12) !important;
// // // // // // //           color: #f8fafc !important;
// // // // // // //           border-radius: 10px;
// // // // // // //         }

// // // // // // //         .modal-radar-dark .modal-content {
// // // // // // //           background: #0f172a;
// // // // // // //           color: #f8fafc;
// // // // // // //           border: 1px solid rgba(255, 255, 255, 0.12);
// // // // // // //           border-radius: 20px;
// // // // // // //           box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
// // // // // // //         }
// // // // // // //         .modal-radar-dark .modal-header {
// // // // // // //           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // //         }
// // // // // // //         .modal-radar-dark .modal-footer {
// // // // // // //           border-top: 1px solid rgba(255, 255, 255, 0.08);
// // // // // // //         }
// // // // // // //       `}</style>

// // // // // // //       <Navbar />

// // // // // // //       <div className="wow-container">
// // // // // // //         {/* Titre & Barre d'actions */}
// // // // // // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // // // // // //           <div>
// // // // // // //             <div className="d-flex align-items-center gap-2">
// // // // // // //               <span style={{ fontSize: '1.8rem' }}>⚡</span>
// // // // // // //               <h2
// // // // // // //                 className="fw-bold mb-0"
// // // // // // //                 style={{
// // // // // // //                   background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
// // // // // // //                   WebkitBackgroundClip: 'text',
// // // // // // //                   WebkitTextFillColor: 'transparent',
// // // // // // //                 }}
// // // // // // //               >
// // // // // // //                 {isAdmin
// // // // // // //                   ? 'Planning des Rendez-vous (Admin)'
// // // // // // //                   : isChef
// // // // // // //                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
// // // // // // //                   : 'Mes Rendez-vous'}
// // // // // // //               </h2>
// // // // // // //             </div>
// // // // // // //             <p className="text-muted small mt-1 mb-0">
// // // // // // //               {(isAdmin || isChef) ? (
// // // // // // //                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
// // // // // // //               ) : (
// // // // // // //                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
// // // // // // //               )}
// // // // // // //             </p>
// // // // // // //           </div>

// // // // // // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // // //             <Button
// // // // // // //               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
// // // // // // //               onClick={handleExportExcel}
// // // // // // //               disabled={filteredRdv.length === 0}
// // // // // // //             >
// // // // // // //               <span>📊</span>
// // // // // // //               <span>Exporter Excel ({filteredRdv.length})</span>
// // // // // // //             </Button>
// // // // // // //             <Button
// // // // // // //               variant="outline-light"
// // // // // // //               size="sm"
// // // // // // //               onClick={refresh}
// // // // // // //               className="d-flex align-items-center gap-2 px-3 py-2"
// // // // // // //               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}
// // // // // // //             >
// // // // // // //               <span>🔄</span> Actualiser
// // // // // // //             </Button>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Panneau Admin : Générateur */}
// // // // // // //         {isAdmin && (
// // // // // // //           <div className="generator-box p-4 mb-4 shadow-lg">
// // // // // // //             <div className="d-flex justify-content-between align-items-center mb-3">
// // // // // // //               <span className="badge rounded-pill bg-primary px-3 py-2 text-uppercase fw-bold">
// // // // // // //                 Mode Administrateur
// // // // // // //               </span>
// // // // // // //               <span className="fw-semibold fs-5 text-white">Générer le planning global</span>
// // // // // // //             </div>

// // // // // // //             <Row className="g-3 align-items-end">
// // // // // // //               <Col xs={12} sm={6} md={3}>
// // // // // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
// // // // // // //                 <Form.Control
// // // // // // //                   type="date"
// // // // // // //                   className="custom-input"
// // // // // // //                   value={dateDebut}
// // // // // // //                   onChange={(e) => setDateDebut(e.target.value)}
// // // // // // //                 />
// // // // // // //               </Col>
// // // // // // //               <Col xs={12} sm={6} md={3}>
// // // // // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
// // // // // // //                 <Form.Control
// // // // // // //                   type="date"
// // // // // // //                   className="custom-input"
// // // // // // //                   value={dateFin}
// // // // // // //                   onChange={(e) => setDateFin(e.target.value)}
// // // // // // //                 />
// // // // // // //               </Col>
// // // // // // //               <Col xs={12} md={6}>
// // // // // // //                 <Button
// // // // // // //                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
// // // // // // //                   onClick={handleGenerate}
// // // // // // //                   disabled={generating}
// // // // // // //                 >
// // // // // // //                   {generating ? (
// // // // // // //                     <>
// // // // // // //                       <Spinner size="sm" animation="border" />
// // // // // // //                       <span>Optimisation et placement des créneaux...</span>
// // // // // // //                     </>
// // // // // // //                   ) : (
// // // // // // //                     <>
// // // // // // //                       <span>✨</span>
// // // // // // //                       <span>Lancer la génération des rendez-vous</span>
// // // // // // //                     </>
// // // // // // //                   )}
// // // // // // //                 </Button>
// // // // // // //               </Col>
// // // // // // //             </Row>

// // // // // // //             {genError && (
// // // // // // //               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
// // // // // // //                 <strong>Erreur : </strong> {genError}
// // // // // // //               </Alert>
// // // // // // //             )}
// // // // // // //             {genResult && (
// // // // // // //               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
// // // // // // //                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
// // // // // // //                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
// // // // // // //               </Alert>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         )}

// // // // // // //         {/* KPI Cards */}
// // // // // // //         <Row className="g-3 mb-4">
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-card text-center">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Total Rendez-vous</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-info">{filteredRdv.length}</div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-card text-center">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-success">{uniqueChefs.length}</div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-card text-center">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Jours de Passage</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-warning">{uniqueDates.length}</div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //           <Col xs={6} md={3}>
// // // // // // //             <div className="kpi-card text-center">
// // // // // // //               <div className="text-muted small text-uppercase fw-bold">Visibilité</div>
// // // // // // //               <div className="fs-2 fw-bold mt-1 text-light">
// // // // // // //                 {filteredRdv.length} <span className="fs-6 text-muted">/ {visibles.length}</span>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </Col>
// // // // // // //         </Row>

// // // // // // //         {/* Barre de Filtres */}
// // // // // // //         <Card className="glass-card mb-4 p-3">
// // // // // // //           <Row className="g-2 align-items-center">
// // // // // // //             <Col xs={12} md={4}>
// // // // // // //               <InputGroup size="sm">
// // // // // // //                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
// // // // // // //                 <Form.Control
// // // // // // //                   placeholder="Rechercher étudiant, email, chef..."
// // // // // // //                   className="custom-input border-0"
// // // // // // //                   value={searchQuery}
// // // // // // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // // // // // //                 />
// // // // // // //                 {searchQuery && (
// // // // // // //                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
// // // // // // //                 )}
// // // // // // //               </InputGroup>
// // // // // // //             </Col>

// // // // // // //             <Col xs={12} sm={6} md={3}>
// // // // // // //               <Form.Select
// // // // // // //                 size="sm"
// // // // // // //                 className="custom-input"
// // // // // // //                 value={selectedChef}
// // // // // // //                 onChange={(e) => setSelectedChef(e.target.value)}
// // // // // // //               >
// // // // // // //                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
// // // // // // //                 {uniqueChefs.map((chef) => (
// // // // // // //                   <option key={chef} value={chef}>{chef}</option>
// // // // // // //                 ))}
// // // // // // //               </Form.Select>
// // // // // // //             </Col>

// // // // // // //             <Col xs={12} sm={6} md={3}>
// // // // // // //               <Form.Select
// // // // // // //                 size="sm"
// // // // // // //                 className="custom-input"
// // // // // // //                 value={selectedDateFilter}
// // // // // // //                 onChange={(e) => setSelectedDateFilter(e.target.value)}
// // // // // // //               >
// // // // // // //                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
// // // // // // //                 {uniqueDates.map((d) => (
// // // // // // //                   <option key={d} value={d}>{d}</option>
// // // // // // //                 ))}
// // // // // // //               </Form.Select>
// // // // // // //             </Col>

// // // // // // //             <Col xs={12} md={2} className="text-md-end">
// // // // // // //               <Button
// // // // // // //                 variant="outline-secondary"
// // // // // // //                 size="sm"
// // // // // // //                 className="w-100 py-1 rounded-3"
// // // // // // //                 onClick={() => {
// // // // // // //                   setSearchQuery('');
// // // // // // //                   setSelectedChef('all');
// // // // // // //                   setSelectedDateFilter('all');
// // // // // // //                 }}
// // // // // // //                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
// // // // // // //               >
// // // // // // //                 Réinitialiser
// // // // // // //               </Button>
// // // // // // //             </Col>
// // // // // // //           </Row>
// // // // // // //         </Card>

// // // // // // //         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

// // // // // // //         {/* Tableau des Rendez-vous */}
// // // // // // //         {loading ? (
// // // // // // //           <div className="text-center py-5">
// // // // // // //             <Spinner animation="border" variant="info" />
// // // // // // //             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
// // // // // // //           </div>
// // // // // // //         ) : (
// // // // // // //           <div className="glass-card overflow-hidden">
// // // // // // //             <div className="table-responsive">
// // // // // // //               <Table hover size="sm" className="wow-table mb-0 align-middle text-nowrap">
// // // // // // //                 <thead>
// // // // // // //                   <tr>
// // // // // // //                     <th>Date</th>
// // // // // // //                     <th>Créneau Horaire</th>
// // // // // // //                     <th>Chef de projet</th>
// // // // // // //                     {(isAdmin || isChef) && <th>Étudiant (Radar & Documents)</th>}
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {filteredRdv.map((r) => (
// // // // // // //                     <tr key={r.id}>
// // // // // // //                       <td>
// // // // // // //                         <span className="date-pill">{r.date}</span>
// // // // // // //                       </td>
// // // // // // //                       <td>
// // // // // // //                         <span className="time-pill">
// // // // // // //                           <span>⏱</span>
// // // // // // //                           <span>{r.heure_debut} ➔ {r.heure_fin}</span>
// // // // // // //                         </span>
// // // // // // //                       </td>
// // // // // // //                       <td>
// // // // // // //                         <div className="d-flex align-items-center gap-2">
// // // // // // //                           <span className="avatar-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
// // // // // // //                             {r.chef_de_projet?.charAt(0) || 'C'}
// // // // // // //                           </span>
// // // // // // //                           <span className="fw-semibold text-white">{r.chef_de_projet}</span>
// // // // // // //                         </div>
// // // // // // //                       </td>
// // // // // // //                       {(isAdmin || isChef) && (
// // // // // // //                         <td>
// // // // // // //                           <div className="d-flex align-items-center justify-content-between gap-2">
// // // // // // //                             <div
// // // // // // //                               className="avatar-student-btn"
// // // // // // //                               title="Cliquer pour afficher le Radar des compétences"
// // // // // // //                               onClick={() => handleOpenStudentRadar(r.etudiant_id, r.etudiant, r.email_etudiant)}
// // // // // // //                             >
// // // // // // //                               <span className="avatar-icon">
// // // // // // //                                 {r.etudiant?.charAt(0) || 'E'}
// // // // // // //                               </span>
// // // // // // //                               <div>
// // // // // // //                                 <div className="fw-semibold text-info text-decoration-underline">
// // // // // // //                                   {r.etudiant} 📊
// // // // // // //                                 </div>
// // // // // // //                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // // // // // //                                   {r.email_etudiant}
// // // // // // //                                 </div>
// // // // // // //                               </div>
// // // // // // //                             </div>

// // // // // // //                             {/* Boutons Documents CV / LM */}
// // // // // // //                             <div className="d-flex gap-1 me-2">
// // // // // // //                               {r.cv_path ? (
// // // // // // //                                 <a
// // // // // // //                                   href={getDocumentPublicUrl(r.cv_path)}
// // // // // // //                                   target="_blank"
// // // // // // //                                   rel="noopener noreferrer"
// // // // // // //                                   className="doc-badge-btn"
// // // // // // //                                   title="Ouvrir le CV (PDF)"
// // // // // // //                                   onClick={(e) => e.stopPropagation()}
// // // // // // //                                 >
// // // // // // //                                   📄 CV
// // // // // // //                                 </a>
// // // // // // //                               ) : (
// // // // // // //                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
// // // // // // //                                   📄 CV
// // // // // // //                                 </span>
// // // // // // //                               )}

// // // // // // //                               {r.lm_path ? (
// // // // // // //                                 <a
// // // // // // //                                   href={getDocumentPublicUrl(r.lm_path)}
// // // // // // //                                   target="_blank"
// // // // // // //                                   rel="noopener noreferrer"
// // // // // // //                                   className="doc-badge-btn"
// // // // // // //                                   title="Ouvrir la Lettre de Motivation (PDF)"
// // // // // // //                                   onClick={(e) => e.stopPropagation()}
// // // // // // //                                 >
// // // // // // //                                   ✉️ LM
// // // // // // //                                 </a>
// // // // // // //                               ) : (
// // // // // // //                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
// // // // // // //                                   ✉️ LM
// // // // // // //                                 </span>
// // // // // // //                               )}
// // // // // // //                             </div>
// // // // // // //                           </div>
// // // // // // //                         </td>
// // // // // // //                       )}
// // // // // // //                     </tr>
// // // // // // //                   ))}

// // // // // // //                   {filteredRdv.length === 0 && (
// // // // // // //                     <tr>
// // // // // // //                       <td colSpan={(isAdmin || isChef) ? 4 : 3} className="text-center py-5">
// // // // // // //                         <div style={{ fontSize: '2.5rem' }}>✨</div>
// // // // // // //                         <div className="mt-3 fw-bold text-white fs-5">Aucun rendez-vous trouvé</div>
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   )}
// // // // // // //                 </tbody>
// // // // // // //               </Table>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </div>

// // // // // // //       {/* Modal Radar Chart */}
// // // // // // //       <Modal
// // // // // // //         show={modalOpen}
// // // // // // //         onHide={() => setModalOpen(false)}
// // // // // // //         size="lg"
// // // // // // //         centered
// // // // // // //         className="modal-radar-dark"
// // // // // // //       >
// // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // //           <Modal.Title className="d-flex align-items-center gap-2">
// // // // // // //             <span>📊</span>
// // // // // // //             <span>Profil de Compétences : <strong>{selectedEtudiantInfo?.nom}</strong></span>
// // // // // // //           </Modal.Title>
// // // // // // //         </Modal.Header>

// // // // // // //         <Modal.Body style={{ minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
// // // // // // //           {modalLoading ? (
// // // // // // //             <div className="text-center py-5">
// // // // // // //               <Spinner animation="border" variant="info" />
// // // // // // //               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
// // // // // // //             </div>
// // // // // // //           ) : modalError ? (
// // // // // // //             <Alert variant="warning" className="text-center m-3">
// // // // // // //               {modalError}
// // // // // // //             </Alert>
// // // // // // //           ) : (
// // // // // // //             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
// // // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </Modal.Body>

// // // // // // //         <Modal.Footer className="d-flex justify-content-between align-items-center">
// // // // // // //           <small className="text-muted font-monospace">
// // // // // // //             {selectedEtudiantInfo?.email}
// // // // // // //           </small>
// // // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>
// // // // // // //             Fermer
// // // // // // //           </Button>
// // // // // // //         </Modal.Footer>
// // // // // // //       </Modal>
// // // // // // //     </>
// // // // // // //   );
// // // // // // // }

// // // // // // import React, { useState, useMemo } from 'react';
// // // // // // import {
// // // // // //   Table,
// // // // // //   Button,
// // // // // //   Alert,
// // // // // //   Spinner,
// // // // // //   Form,
// // // // // //   Card,
// // // // // //   Row,
// // // // // //   Col,
// // // // // //   InputGroup,
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
// // // // // // import { useAuth } from '../context/AuthContext';
// // // // // // import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// // // // // // import {
// // // // // //   genererRendezVous,
// // // // // //   fetchAptitudesByEtudiant,
// // // // // //   fetchApetencesByEtudiant,
// // // // // //   getDocumentPublicUrl,
// // // // // // } from '../services/supabase';

// // // // // // // Enregistrement des composants Chart.js pour le Radar
// // // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

// // // // // // export default function RendezVousPage() {
// // // // // //   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
// // // // // //   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

// // // // // //   // Logique de génération (Admin)
// // // // // //   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
// // // // // //   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
// // // // // //   const [generating, setGenerating] = useState(false);
// // // // // //   const [genError, setGenError] = useState(null);
// // // // // //   const [genResult, setGenResult] = useState(null);

// // // // // //   // Filtres en temps réel
// // // // // //   const [searchQuery, setSearchQuery] = useState('');
// // // // // //   const [selectedChef, setSelectedChef] = useState('all');
// // // // // //   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

// // // // // //   // État du Modal Radar Étudiant
// // // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // // //   const [modalError, setModalError] = useState(null);

// // // // // //   // Filtrage selon le profil connecté :
// // // // // //   const visibles = useMemo(() => {
// // // // // //     if (isAdmin) {
// // // // // //       return rendezVous;
// // // // // //     }
// // // // // //     if (isChef) {
// // // // // //       // Pour le chef : uniquement ses rendez-vous
// // // // // //       return rendezVous.filter(
// // // // // //         (r) =>
// // // // // //           r.chef_de_projet_id === chefId ||
// // // // // //           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
// // // // // //       );
// // // // // //     }
// // // // // //     // Pour l'étudiant : uniquement ses propres rendez-vous
// // // // // //     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
// // // // // //   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

// // // // // //   const uniqueChefs = useMemo(() => {
// // // // // //     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
// // // // // //     return Array.from(chefs).sort();
// // // // // //   }, [visibles]);

// // // // // //   const uniqueDates = useMemo(() => {
// // // // // //     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
// // // // // //     return Array.from(dates).sort();
// // // // // //   }, [visibles]);

// // // // // //   const filteredRdv = useMemo(() => {
// // // // // //     return visibles.filter((r) => {
// // // // // //       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
// // // // // //       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
// // // // // //       if (searchQuery.trim()) {
// // // // // //         const query = searchQuery.toLowerCase().trim();
// // // // // //         const matchEtud = r.etudiant?.toLowerCase().includes(query);
// // // // // //         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
// // // // // //         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
// // // // // //         if (!matchEtud && !matchEmail && !matchChef) return false;
// // // // // //       }
// // // // // //       return true;
// // // // // //     });
// // // // // //   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

// // // // // //   // Ouverture du Popup Radar
// // // // // //   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
// // // // // //     if (!etudiant_id) return;
// // // // // //     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
// // // // // //     setModalOpen(true);
// // // // // //     setModalLoading(true);
// // // // // //     setModalError(null);
// // // // // //     setAptitudesData(null);
// // // // // //     setApetencesData(null);

// // // // // //     try {
// // // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // // //         fetchAptitudesByEtudiant(etudiant_id),
// // // // // //         fetchApetencesByEtudiant(etudiant_id),
// // // // // //       ]);

// // // // // //       if (!aptitudes && !apetences) {
// // // // // //         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
// // // // // //       } else {
// // // // // //         setAptitudesData(aptitudes);
// // // // // //         setApetencesData(apetences);
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       setModalError(err.message || 'Erreur lors du chargement des compétences.');
// // // // // //     } finally {
// // // // // //       setModalLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   // Données du graphique Radar
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
// // // // // //           backgroundColor: 'rgba(41, 211, 211, 0.22)',
// // // // // //           borderColor: '#29d3d3',
// // // // // //           borderWidth: 2.5,
// // // // // //           pointBackgroundColor: '#29d3d3',
// // // // // //           pointBorderColor: '#0a0e1a',
// // // // // //           pointBorderWidth: 1.5,
// // // // // //           pointRadius: 4,
// // // // // //           pointHoverRadius: 6,
// // // // // //         },
// // // // // //         {
// // // // // //           label: 'Appétences (Intérêt)',
// // // // // //           data: apeValues,
// // // // // //           backgroundColor: 'rgba(251, 111, 146, 0.20)',
// // // // // //           borderColor: '#fb6f92',
// // // // // //           borderWidth: 2.5,
// // // // // //           pointBackgroundColor: '#fb6f92',
// // // // // //           pointBorderColor: '#0a0e1a',
// // // // // //           pointBorderWidth: 1.5,
// // // // // //           pointRadius: 4,
// // // // // //           pointHoverRadius: 6,
// // // // // //         },
// // // // // //       ],
// // // // // //     };
// // // // // //   }, [aptitudesData, apetencesData]);

// // // // // //   // Moyennes pour les badges de synthèse au-dessus du radar (dérivé, aucune nouvelle donnée)
// // // // // //   const radarAverages = useMemo(() => {
// // // // // //     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
// // // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
// // // // // //     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
// // // // // //   }, [aptitudesData, apetencesData]);

// // // // // //   const radarOptions = {
// // // // // //     responsive: true,
// // // // // //     maintainAspectRatio: false,
// // // // // //     scales: {
// // // // // //       r: {
// // // // // //         min: 0,
// // // // // //         suggestedMax: 4,
// // // // // //         ticks: {
// // // // // //           stepSize: 1,
// // // // // //           backdropColor: 'transparent',
// // // // // //           color: '#7c88a3',
// // // // // //           font: { size: 10 },
// // // // // //         },
// // // // // //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// // // // // //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// // // // // //         pointLabels: { color: '#e7ebf5', font: { size: 11, weight: '600' } },
// // // // // //       },
// // // // // //     },
// // // // // //     plugins: {
// // // // // //       legend: { display: false },
// // // // // //       tooltip: {
// // // // // //         backgroundColor: '#151b2e',
// // // // // //         borderColor: 'rgba(148, 163, 184, 0.25)',
// // // // // //         borderWidth: 1,
// // // // // //         titleColor: '#f4f6fb',
// // // // // //         bodyColor: '#c7cede',
// // // // // //         padding: 10,
// // // // // //         cornerRadius: 8,
// // // // // //         displayColors: true,
// // // // // //       },
// // // // // //     },
// // // // // //   };

// // // // // //   // Export Excel
// // // // // //   const handleExportExcel = () => {
// // // // // //     if (filteredRdv.length === 0) {
// // // // // //       alert('Aucun rendez-vous à exporter.');
// // // // // //       return;
// // // // // //     }

// // // // // //     const exportRows = filteredRdv.map((r) => ({
// // // // // //       'Date': r.date,
// // // // // //       'Heure de Début': r.heure_debut,
// // // // // //       'Heure de Fin': r.heure_fin,
// // // // // //       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
// // // // // //       'Chef de Projet': r.chef_de_projet || '',
// // // // // //       'Étudiant': r.etudiant || '',
// // // // // //       'Email Étudiant': r.email_etudiant || '',
// // // // // //     }));

// // // // // //     const worksheet = XLSX.utils.json_to_sheet(exportRows);
// // // // // //     worksheet['!cols'] = [
// // // // // //       { wch: 14 },
// // // // // //       { wch: 14 },
// // // // // //       { wch: 14 },
// // // // // //       { wch: 18 },
// // // // // //       { wch: 28 },
// // // // // //       { wch: 28 },
// // // // // //       { wch: 35 },
// // // // // //     ];

// // // // // //     const workbook = XLSX.utils.book_new();
// // // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
// // // // // //     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // // // // //   };

// // // // // //   // Génération du planning (Admin uniquement)
// // // // // //   const handleGenerate = async () => {
// // // // // //     const confirmation = window.confirm(
// // // // // //       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
// // // // // //     );
// // // // // //     if (!confirmation) return;

// // // // // //     setGenerating(true);
// // // // // //     setGenError(null);
// // // // // //     setGenResult(null);
// // // // // //     try {
// // // // // //       const token = await getIdToken();
// // // // // //       const result = await genererRendezVous(dateDebut, dateFin, token);
// // // // // //       setGenResult(result.stats);
// // // // // //       await refresh();
// // // // // //     } catch (err) {
// // // // // //       setGenError(err.message);
// // // // // //     } finally {
// // // // // //       setGenerating(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <>
// // // // // //       <style>{`
// // // // // //         :root {
// // // // // //           --canvas: #0a0e1a;
// // // // // //           --panel: rgba(21, 27, 46, 0.86);
// // // // // //           --panel-solid: #151b2e;
// // // // // //           --panel-raised: #1b2338;
// // // // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // // // //           --text-primary: #f4f6fb;
// // // // // //           --text-muted: #93a0b8;
// // // // // //           --accent-violet: #7c6cf6;
// // // // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // // // //           --accent-cyan: #29d3d3;
// // // // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // // // //           --accent-rose: #fb6f92;
// // // // // //           --accent-rose-soft: rgba(251, 111, 146, 0.16);
// // // // // //           --accent-amber: #f5b942;
// // // // // //           --accent-emerald: #35d0a0;
// // // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // // //           --accent-coral: #ff6b6b;
// // // // // //         }

// // // // // //         .wow-container {
// // // // // //           max-width: 100%;
// // // // // //           margin: 0 auto;
// // // // // //           padding: 1.5rem 1rem 2.5rem 1rem;
// // // // // //           color: var(--text-primary);
// // // // // //           background:
// // // // // //             radial-gradient(1200px 520px at 8% -10%, rgba(124,108,246,0.12), transparent 60%),
// // // // // //             radial-gradient(1000px 520px at 100% 0%, rgba(41,211,211,0.10), transparent 55%),
// // // // // //             var(--canvas);
// // // // // //         }

// // // // // //         .glass-card {
// // // // // //           background: var(--panel);
// // // // // //           backdrop-filter: blur(16px);
// // // // // //           -webkit-backdrop-filter: blur(16px);
// // // // // //           border: 1px solid var(--border-subtle);
// // // // // //           border-radius: 16px;
// // // // // //           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
// // // // // //         }

// // // // // //         .kpi-card {
// // // // // //           padding: 1.15rem;
// // // // // //           border-radius: 16px;
// // // // // //           background: var(--panel-raised);
// // // // // //           border: 1px solid var(--border-subtle);
// // // // // //           transition: transform 0.2s ease, border-color 0.2s ease;
// // // // // //         }
// // // // // //         .kpi-card:hover {
// // // // // //           transform: translateY(-3px);
// // // // // //           border-color: var(--accent-violet);
// // // // // //         }

// // // // // //         .generator-box {
// // // // // //           background:
// // // // // //             radial-gradient(500px 200px at 0% 0%, rgba(124,108,246,0.20), transparent 60%),
// // // // // //             radial-gradient(500px 200px at 100% 100%, rgba(41,211,211,0.14), transparent 60%),
// // // // // //             var(--panel-raised);
// // // // // //           border: 1px solid var(--border-strong);
// // // // // //           border-radius: 18px;
// // // // // //         }

// // // // // //         .btn-glow {
// // // // // //           background: linear-gradient(135deg, var(--accent-violet) 0%, #9b7cf9 50%, var(--accent-cyan) 100%);
// // // // // //           border: none;
// // // // // //           color: #0a0e1a;
// // // // // //           font-weight: 700;
// // // // // //           border-radius: 12px;
// // // // // //           box-shadow: 0 4px 20px rgba(124, 108, 246, 0.35);
// // // // // //         }

// // // // // //         .btn-excel {
// // // // // //           background: linear-gradient(135deg, var(--accent-emerald) 0%, #22b98c 100%);
// // // // // //           border: none;
// // // // // //           color: #06231a;
// // // // // //           font-weight: 700;
// // // // // //           border-radius: 10px;
// // // // // //         }

// // // // // //         .wow-table {
// // // // // //           background: transparent !important;
// // // // // //           color: var(--text-primary) !important;
// // // // // //         }
// // // // // //         .wow-table thead th {
// // // // // //           background: var(--panel-solid) !important;
// // // // // //           color: var(--text-muted);
// // // // // //           font-size: 0.75rem;
// // // // // //           text-transform: uppercase;
// // // // // //           letter-spacing: 0.08em;
// // // // // //           padding: 0.85rem 1rem;
// // // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // // //         }
// // // // // //         .wow-table tbody tr {
// // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // //         }
// // // // // //         .wow-table tbody tr:hover {
// // // // // //           background-color: var(--accent-violet-soft) !important;
// // // // // //         }

// // // // // //         .time-pill {
// // // // // //           background: linear-gradient(135deg, var(--accent-cyan-soft), var(--accent-violet-soft));
// // // // // //           border: 1px solid rgba(41, 211, 211, 0.35);
// // // // // //           color: var(--accent-cyan);
// // // // // //           padding: 6px 14px;
// // // // // //           border-radius: 20px;
// // // // // //           font-weight: 600;
// // // // // //           font-family: monospace;
// // // // // //           font-size: 0.85rem;
// // // // // //         }

// // // // // //         .date-pill {
// // // // // //           background: rgba(255, 255, 255, 0.05);
// // // // // //           border: 1px solid var(--border-strong);
// // // // // //           color: var(--text-primary);
// // // // // //           padding: 5px 12px;
// // // // // //           border-radius: 8px;
// // // // // //           font-family: monospace;
// // // // // //         }

// // // // // //         .avatar-student-btn {
// // // // // //           cursor: pointer;
// // // // // //           transition: background 0.15s ease;
// // // // // //           display: inline-flex;
// // // // // //           align-items: center;
// // // // // //           gap: 10px;
// // // // // //           padding: 4px 6px;
// // // // // //           border-radius: 8px;
// // // // // //         }
// // // // // //         .avatar-student-btn:hover {
// // // // // //           background: var(--accent-rose-soft);
// // // // // //         }

// // // // // //         .avatar-icon {
// // // // // //           width: 32px;
// // // // // //           height: 32px;
// // // // // //           border-radius: 8px;
// // // // // //           background: linear-gradient(135deg, var(--accent-violet), #9b7cf9);
// // // // // //           display: inline-flex;
// // // // // //           align-items: center;
// // // // // //           justify-content: center;
// // // // // //           font-weight: bold;
// // // // // //           font-size: 0.8rem;
// // // // // //           color: #0a0e1a;
// // // // // //         }

// // // // // //         /* Boutons Documents CV / LM */
// // // // // //         .doc-badge-btn {
// // // // // //           background: var(--accent-violet-soft);
// // // // // //           border: 1px solid rgba(124, 108, 246, 0.4);
// // // // // //           color: #c8bfff;
// // // // // //           padding: 3px 7px;
// // // // // //           border-radius: 6px;
// // // // // //           font-size: 0.72rem;
// // // // // //           font-weight: 600;
// // // // // //           text-decoration: none;
// // // // // //           display: inline-flex;
// // // // // //           align-items: center;
// // // // // //           gap: 3px;
// // // // // //         }
// // // // // //         .doc-badge-btn:hover {
// // // // // //           background: var(--accent-violet);
// // // // // //           color: #0a0e1a;
// // // // // //         }
// // // // // //         .doc-badge-disabled {
// // // // // //           background: rgba(255, 255, 255, 0.03);
// // // // // //           border: 1px solid var(--border-subtle);
// // // // // //           color: rgba(148, 163, 184, 0.4);
// // // // // //           padding: 3px 7px;
// // // // // //           border-radius: 6px;
// // // // // //           font-size: 0.72rem;
// // // // // //           cursor: not-allowed;
// // // // // //         }

// // // // // //         .custom-input {
// // // // // //           background: var(--panel-raised) !important;
// // // // // //           border: 1px solid var(--border-strong) !important;
// // // // // //           color: var(--text-primary) !important;
// // // // // //           border-radius: 10px;
// // // // // //         }
// // // // // //         .custom-input:focus {
// // // // // //           background: var(--panel-raised) !important;
// // // // // //           color: var(--text-primary) !important;
// // // // // //           border-color: var(--accent-cyan) !important;
// // // // // //           box-shadow: 0 0 0 3px rgba(41, 211, 211, 0.18) !important;
// // // // // //         }

// // // // // //         .wow-container .text-info { color: var(--accent-cyan) !important; }
// // // // // //         .wow-container .text-success { color: var(--accent-emerald) !important; }
// // // // // //         .wow-container .text-warning { color: var(--accent-amber) !important; }

// // // // // //         /* --- Modal Radar : même refonte que la page Évaluations --- */
// // // // // //         .radar-modal-content {
// // // // // //           background: var(--panel-solid) !important;
// // // // // //           border: 1px solid var(--border-strong) !important;
// // // // // //           border-radius: 18px !important;
// // // // // //           overflow: hidden;
// // // // // //           box-shadow: 0 24px 60px rgba(0,0,0,0.55);
// // // // // //         }
// // // // // //         .radar-modal-header {
// // // // // //           position: relative;
// // // // // //           padding: 1.5rem 1.75rem 1.25rem 1.75rem;
// // // // // //           background:
// // // // // //             radial-gradient(600px 220px at 15% 0%, rgba(124,108,246,0.35), transparent 60%),
// // // // // //             radial-gradient(600px 220px at 100% 0%, rgba(41,211,211,0.25), transparent 60%),
// // // // // //             var(--panel-raised);
// // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // //         }
// // // // // //         .radar-modal-close {
// // // // // //           position: absolute;
// // // // // //           top: 1rem;
// // // // // //           right: 1rem;
// // // // // //           width: 30px;
// // // // // //           height: 30px;
// // // // // //           border-radius: 50%;
// // // // // //           border: 1px solid var(--border-strong);
// // // // // //           background: rgba(255,255,255,0.04);
// // // // // //           color: var(--text-primary);
// // // // // //           font-size: 0.85rem;
// // // // // //           line-height: 1;
// // // // // //           cursor: pointer;
// // // // // //         }
// // // // // //         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
// // // // // //         .radar-modal-eyebrow {
// // // // // //           text-transform: uppercase;
// // // // // //           letter-spacing: 1.2px;
// // // // // //           font-size: 0.7rem;
// // // // // //           font-weight: 700;
// // // // // //           color: var(--accent-cyan);
// // // // // //           margin-bottom: 0.25rem;
// // // // // //         }
// // // // // //         .radar-modal-title {
// // // // // //           color: var(--text-primary);
// // // // // //           font-weight: 700;
// // // // // //           margin: 0 0 1rem 0;
// // // // // //           font-size: 1.35rem;
// // // // // //         }
// // // // // //         .radar-modal-stats {
// // // // // //           display: flex;
// // // // // //           gap: 0.75rem;
// // // // // //           flex-wrap: wrap;
// // // // // //         }
// // // // // //         .radar-stat {
// // // // // //           display: flex;
// // // // // //           align-items: center;
// // // // // //           gap: 0.45rem;
// // // // // //           padding: 0.4rem 0.75rem;
// // // // // //           border-radius: 10px;
// // // // // //           background: rgba(255,255,255,0.04);
// // // // // //           border: 1px solid var(--border-subtle);
// // // // // //         }
// // // // // //         .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
// // // // // //         .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
// // // // // //         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
// // // // // //         .radar-stat-label { color: var(--text-muted); font-size: 0.78rem; }
// // // // // //         .radar-stat-value { color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
// // // // // //         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
// // // // // //         .radar-modal-body {
// // // // // //           padding: 1.5rem 1.75rem;
// // // // // //           min-height: 400px;
// // // // // //           display: flex;
// // // // // //           flex-direction: column;
// // // // // //           justify-content: center;
// // // // // //         }
// // // // // //         .radar-modal-footer {
// // // // // //           padding: 1rem 1.75rem;
// // // // // //           border-top: 1px solid var(--border-subtle);
// // // // // //           display: flex;
// // // // // //           justify-content: space-between;
// // // // // //           align-items: center;
// // // // // //         }
// // // // // //       `}</style>

// // // // // //       <Navbar />

// // // // // //       <div className="wow-container">
// // // // // //         {/* Titre & Barre d'actions */}
// // // // // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // // // // //           <div>
// // // // // //             <div className="d-flex align-items-center gap-2">
// // // // // //               <span style={{ fontSize: '1.6rem' }}>⚡</span>
// // // // // //               <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
// // // // // //                 {isAdmin
// // // // // //                   ? 'Planning des Rendez-vous (Admin)'
// // // // // //                   : isChef
// // // // // //                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
// // // // // //                   : 'Mes Rendez-vous'}
// // // // // //               </h2>
// // // // // //             </div>
// // // // // //             <p className="text-muted small mt-1 mb-0">
// // // // // //               {(isAdmin || isChef) ? (
// // // // // //                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
// // // // // //               ) : (
// // // // // //                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
// // // // // //               )}
// // // // // //             </p>
// // // // // //           </div>

// // // // // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // // //             <Button
// // // // // //               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
// // // // // //               onClick={handleExportExcel}
// // // // // //               disabled={filteredRdv.length === 0}
// // // // // //             >
// // // // // //               <span>📊</span>
// // // // // //               <span>Exporter Excel ({filteredRdv.length})</span>
// // // // // //             </Button>
// // // // // //             <Button
// // // // // //               variant="outline-light"
// // // // // //               size="sm"
// // // // // //               onClick={refresh}
// // // // // //               className="d-flex align-items-center gap-2 px-3 py-2"
// // // // // //               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}
// // // // // //             >
// // // // // //               <span>🔄</span> Actualiser
// // // // // //             </Button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* Panneau Admin : Générateur */}
// // // // // //         {isAdmin && (
// // // // // //           <div className="generator-box p-4 mb-4 shadow-lg">
// // // // // //             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // // //               <span
// // // // // //                 className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
// // // // // //                 style={{ background: 'var(--accent-violet)', color: '#0a0e1a' }}
// // // // // //               >
// // // // // //                 Mode Administrateur
// // // // // //               </span>
// // // // // //               <span className="fw-semibold fs-5 text-white">Générer le planning global</span>
// // // // // //             </div>

// // // // // //             <Row className="g-3 align-items-end">
// // // // // //               <Col xs={12} sm={6} md={3}>
// // // // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
// // // // // //                 <Form.Control
// // // // // //                   type="date"
// // // // // //                   className="custom-input"
// // // // // //                   value={dateDebut}
// // // // // //                   onChange={(e) => setDateDebut(e.target.value)}
// // // // // //                 />
// // // // // //               </Col>
// // // // // //               <Col xs={12} sm={6} md={3}>
// // // // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
// // // // // //                 <Form.Control
// // // // // //                   type="date"
// // // // // //                   className="custom-input"
// // // // // //                   value={dateFin}
// // // // // //                   onChange={(e) => setDateFin(e.target.value)}
// // // // // //                 />
// // // // // //               </Col>
// // // // // //               <Col xs={12} md={6}>
// // // // // //                 <Button
// // // // // //                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
// // // // // //                   onClick={handleGenerate}
// // // // // //                   disabled={generating}
// // // // // //                 >
// // // // // //                   {generating ? (
// // // // // //                     <>
// // // // // //                       <Spinner size="sm" animation="border" />
// // // // // //                       <span>Optimisation et placement des créneaux...</span>
// // // // // //                     </>
// // // // // //                   ) : (
// // // // // //                     <>
// // // // // //                       <span>✨</span>
// // // // // //                       <span>Lancer la génération des rendez-vous</span>
// // // // // //                     </>
// // // // // //                   )}
// // // // // //                 </Button>
// // // // // //               </Col>
// // // // // //             </Row>

// // // // // //             {genError && (
// // // // // //               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
// // // // // //                 <strong>Erreur : </strong> {genError}
// // // // // //               </Alert>
// // // // // //             )}
// // // // // //             {genResult && (
// // // // // //               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
// // // // // //                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
// // // // // //                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
// // // // // //               </Alert>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         )}

// // // // // //         {/* KPI Cards */}
// // // // // //         <Row className="g-3 mb-4">
// // // // // //           <Col xs={6} md={3}>
// // // // // //             <div className="kpi-card text-center">
// // // // // //               <div className="text-muted small text-uppercase fw-bold">Total Rendez-vous</div>
// // // // // //               <div className="fs-2 fw-bold mt-1 text-info">{filteredRdv.length}</div>
// // // // // //             </div>
// // // // // //           </Col>
// // // // // //           <Col xs={6} md={3}>
// // // // // //             <div className="kpi-card text-center">
// // // // // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // // // // //               <div className="fs-2 fw-bold mt-1 text-success">{uniqueChefs.length}</div>
// // // // // //             </div>
// // // // // //           </Col>
// // // // // //           <Col xs={6} md={3}>
// // // // // //             <div className="kpi-card text-center">
// // // // // //               <div className="text-muted small text-uppercase fw-bold">Jours de Passage</div>
// // // // // //               <div className="fs-2 fw-bold mt-1 text-warning">{uniqueDates.length}</div>
// // // // // //             </div>
// // // // // //           </Col>
// // // // // //           <Col xs={6} md={3}>
// // // // // //             <div className="kpi-card text-center">
// // // // // //               <div className="text-muted small text-uppercase fw-bold">Visibilité</div>
// // // // // //               <div className="fs-2 fw-bold mt-1 text-light">
// // // // // //                 {filteredRdv.length} <span className="fs-6 text-muted">/ {visibles.length}</span>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </Col>
// // // // // //         </Row>

// // // // // //         {/* Barre de Filtres */}
// // // // // //         <Card className="glass-card mb-4 p-3 border-0">
// // // // // //           <Row className="g-2 align-items-center">
// // // // // //             <Col xs={12} md={4}>
// // // // // //               <InputGroup size="sm">
// // // // // //                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
// // // // // //                 <Form.Control
// // // // // //                   placeholder="Rechercher étudiant, email, chef..."
// // // // // //                   className="custom-input border-0"
// // // // // //                   value={searchQuery}
// // // // // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // // // // //                 />
// // // // // //                 {searchQuery && (
// // // // // //                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
// // // // // //                 )}
// // // // // //               </InputGroup>
// // // // // //             </Col>

// // // // // //             <Col xs={12} sm={6} md={3}>
// // // // // //               <Form.Select
// // // // // //                 size="sm"
// // // // // //                 className="custom-input"
// // // // // //                 value={selectedChef}
// // // // // //                 onChange={(e) => setSelectedChef(e.target.value)}
// // // // // //               >
// // // // // //                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
// // // // // //                 {uniqueChefs.map((chef) => (
// // // // // //                   <option key={chef} value={chef}>{chef}</option>
// // // // // //                 ))}
// // // // // //               </Form.Select>
// // // // // //             </Col>

// // // // // //             <Col xs={12} sm={6} md={3}>
// // // // // //               <Form.Select
// // // // // //                 size="sm"
// // // // // //                 className="custom-input"
// // // // // //                 value={selectedDateFilter}
// // // // // //                 onChange={(e) => setSelectedDateFilter(e.target.value)}
// // // // // //               >
// // // // // //                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
// // // // // //                 {uniqueDates.map((d) => (
// // // // // //                   <option key={d} value={d}>{d}</option>
// // // // // //                 ))}
// // // // // //               </Form.Select>
// // // // // //             </Col>

// // // // // //             <Col xs={12} md={2} className="text-md-end">
// // // // // //               <Button
// // // // // //                 variant="outline-secondary"
// // // // // //                 size="sm"
// // // // // //                 className="w-100 py-1 rounded-3"
// // // // // //                 onClick={() => {
// // // // // //                   setSearchQuery('');
// // // // // //                   setSelectedChef('all');
// // // // // //                   setSelectedDateFilter('all');
// // // // // //                 }}
// // // // // //                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
// // // // // //               >
// // // // // //                 Réinitialiser
// // // // // //               </Button>
// // // // // //             </Col>
// // // // // //           </Row>
// // // // // //         </Card>

// // // // // //         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

// // // // // //         {/* Tableau des Rendez-vous */}
// // // // // //         {loading ? (
// // // // // //           <div className="text-center py-5">
// // // // // //             <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // // // // //             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
// // // // // //           </div>
// // // // // //         ) : (
// // // // // //           <div className="glass-card overflow-hidden">
// // // // // //             <div className="table-responsive">
// // // // // //               <Table hover size="sm" className="wow-table mb-0 align-middle text-nowrap">
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th>Date</th>
// // // // // //                     <th>Créneau Horaire</th>
// // // // // //                     <th>Chef de projet</th>
// // // // // //                     {(isAdmin || isChef) && <th>Étudiant (Radar & Documents)</th>}
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {filteredRdv.map((r) => (
// // // // // //                     <tr key={r.id}>
// // // // // //                       <td>
// // // // // //                         <span className="date-pill">{r.date}</span>
// // // // // //                       </td>
// // // // // //                       <td>
// // // // // //                         <span className="time-pill">
// // // // // //                           <span>⏱</span>
// // // // // //                           <span>{r.heure_debut} ➔ {r.heure_fin}</span>
// // // // // //                         </span>
// // // // // //                       </td>
// // // // // //                       <td>
// // // // // //                         <div className="d-flex align-items-center gap-2">
// // // // // //                           <span className="avatar-icon" style={{ background: 'linear-gradient(135deg, var(--accent-emerald), #22b98c)', color: '#06231a' }}>
// // // // // //                             {r.chef_de_projet?.charAt(0) || 'C'}
// // // // // //                           </span>
// // // // // //                           <span className="fw-semibold text-white">{r.chef_de_projet}</span>
// // // // // //                         </div>
// // // // // //                       </td>
// // // // // //                       {(isAdmin || isChef) && (
// // // // // //                         <td>
// // // // // //                           <div className="d-flex align-items-center justify-content-between gap-2">
// // // // // //                             <div
// // // // // //                               className="avatar-student-btn"
// // // // // //                               title="Cliquer pour afficher le Radar des compétences"
// // // // // //                               onClick={() => handleOpenStudentRadar(r.etudiant_id, r.etudiant, r.email_etudiant)}
// // // // // //                             >
// // // // // //                               <span className="avatar-icon">
// // // // // //                                 {r.etudiant?.charAt(0) || 'E'}
// // // // // //                               </span>
// // // // // //                               <div>
// // // // // //                                 <div className="fw-semibold text-decoration-underline" style={{ color: 'var(--accent-cyan)' }}>
// // // // // //                                   {r.etudiant} 📊
// // // // // //                                 </div>
// // // // // //                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // // // // //                                   {r.email_etudiant}
// // // // // //                                 </div>
// // // // // //                               </div>
// // // // // //                             </div>

// // // // // //                             {/* Boutons Documents CV / LM */}
// // // // // //                             <div className="d-flex gap-1 me-2">
// // // // // //                               {r.cv_path ? (
// // // // // //                                 <a
// // // // // //                                   href={getDocumentPublicUrl(r.cv_path)}
// // // // // //                                   target="_blank"
// // // // // //                                   rel="noopener noreferrer"
// // // // // //                                   className="doc-badge-btn"
// // // // // //                                   title="Ouvrir le CV (PDF)"
// // // // // //                                   onClick={(e) => e.stopPropagation()}
// // // // // //                                 >
// // // // // //                                   📄 CV
// // // // // //                                 </a>
// // // // // //                               ) : (
// // // // // //                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
// // // // // //                                   📄 CV
// // // // // //                                 </span>
// // // // // //                               )}

// // // // // //                               {r.lm_path ? (
// // // // // //                                 <a
// // // // // //                                   href={getDocumentPublicUrl(r.lm_path)}
// // // // // //                                   target="_blank"
// // // // // //                                   rel="noopener noreferrer"
// // // // // //                                   className="doc-badge-btn"
// // // // // //                                   title="Ouvrir la Lettre de Motivation (PDF)"
// // // // // //                                   onClick={(e) => e.stopPropagation()}
// // // // // //                                 >
// // // // // //                                   ✉️ LM
// // // // // //                                 </a>
// // // // // //                               ) : (
// // // // // //                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
// // // // // //                                   ✉️ LM
// // // // // //                                 </span>
// // // // // //                               )}
// // // // // //                             </div>
// // // // // //                           </div>
// // // // // //                         </td>
// // // // // //                       )}
// // // // // //                     </tr>
// // // // // //                   ))}

// // // // // //                   {filteredRdv.length === 0 && (
// // // // // //                     <tr>
// // // // // //                       <td colSpan={(isAdmin || isChef) ? 4 : 3} className="text-center py-5">
// // // // // //                         <div style={{ fontSize: '2.5rem' }}>✨</div>
// // // // // //                         <div className="mt-3 fw-bold text-white fs-5">Aucun rendez-vous trouvé</div>
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   )}
// // // // // //                 </tbody>
// // // // // //               </Table>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* Modal Radar — profil de compétences (même refonte que la page Évaluations) */}
// // // // // //       <Modal
// // // // // //         show={modalOpen}
// // // // // //         onHide={() => setModalOpen(false)}
// // // // // //         size="lg"
// // // // // //         centered
// // // // // //         contentClassName="radar-modal-content"
// // // // // //       >
// // // // // //         <div className="radar-modal-header">
// // // // // //           <button
// // // // // //             type="button"
// // // // // //             className="radar-modal-close"
// // // // // //             onClick={() => setModalOpen(false)}
// // // // // //             aria-label="Fermer"
// // // // // //           >
// // // // // //             ✕
// // // // // //           </button>
// // // // // //           <div className="radar-modal-eyebrow">Profil de compétences</div>
// // // // // //           <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
// // // // // //           {!modalLoading && !modalError && (
// // // // // //             <div className="radar-modal-stats">
// // // // // //               <div className="radar-stat radar-stat-cyan">
// // // // // //                 <span className="radar-stat-dot" />
// // // // // //                 <span className="radar-stat-label">Aptitudes</span>
// // // // // //                 <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
// // // // // //               </div>
// // // // // //               <div className="radar-stat radar-stat-rose">
// // // // // //                 <span className="radar-stat-dot" />
// // // // // //                 <span className="radar-stat-label">Appétences</span>
// // // // // //                 <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>

// // // // // //         <div className="radar-modal-body">
// // // // // //           {modalLoading ? (
// // // // // //             <div className="text-center py-5">
// // // // // //               <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // // // // //               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
// // // // // //             </div>
// // // // // //           ) : modalError ? (
// // // // // //             <Alert variant="warning" className="text-center m-3 mb-0">
// // // // // //               {modalError}
// // // // // //             </Alert>
// // // // // //           ) : (
// // // // // //             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
// // // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </div>

// // // // // //         <div className="radar-modal-footer">
// // // // // //           <small className="text-muted font-monospace">
// // // // // //             {selectedEtudiantInfo?.email}
// // // // // //           </small>
// // // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>
// // // // // //             Fermer
// // // // // //           </Button>
// // // // // //         </div>
// // // // // //       </Modal>
// // // // // //     </>
// // // // // //   );
// // // // // // }

// // // // // import React, { useState, useMemo } from 'react';
// // // // // import {
// // // // //   Table,
// // // // //   Button,
// // // // //   Alert,
// // // // //   Spinner,
// // // // //   Form,
// // // // //   Card,
// // // // //   Row,
// // // // //   Col,
// // // // //   InputGroup,
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
// // // // // import { useAuth } from '../context/AuthContext';
// // // // // import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// // // // // import {
// // // // //   genererRendezVous,
// // // // //   fetchAptitudesByEtudiant,
// // // // //   fetchApetencesByEtudiant,
// // // // //   getDocumentPublicUrl,
// // // // // } from '../services/supabase';

// // // // // // Enregistrement des composants Chart.js pour le Radar
// // // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

// // // // // export default function RendezVousPage() {
// // // // //   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
// // // // //   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

// // // // //   // Logique de génération (Admin)
// // // // //   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
// // // // //   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
// // // // //   const [generating, setGenerating] = useState(false);
// // // // //   const [genError, setGenError] = useState(null);
// // // // //   const [genResult, setGenResult] = useState(null);

// // // // //   // Filtres en temps réel
// // // // //   const [searchQuery, setSearchQuery] = useState('');
// // // // //   const [selectedChef, setSelectedChef] = useState('all');
// // // // //   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

// // // // //   // État du Modal Radar Étudiant
// // // // //   const [modalOpen, setModalOpen] = useState(false);
// // // // //   const [modalLoading, setModalLoading] = useState(false);
// // // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // // //   const [apetencesData, setApetencesData] = useState(null);
// // // // //   const [modalError, setModalError] = useState(null);

// // // // //   // Filtrage selon le profil connecté :
// // // // //   const visibles = useMemo(() => {
// // // // //     if (isAdmin) {
// // // // //       return rendezVous;
// // // // //     }
// // // // //     if (isChef) {
// // // // //       // Pour le chef : uniquement ses rendez-vous
// // // // //       return rendezVous.filter(
// // // // //         (r) =>
// // // // //           r.chef_de_projet_id === chefId ||
// // // // //           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
// // // // //       );
// // // // //     }
// // // // //     // Pour l'étudiant : uniquement ses propres rendez-vous
// // // // //     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
// // // // //   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

// // // // //   const uniqueChefs = useMemo(() => {
// // // // //     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
// // // // //     return Array.from(chefs).sort();
// // // // //   }, [visibles]);

// // // // //   const uniqueDates = useMemo(() => {
// // // // //     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
// // // // //     return Array.from(dates).sort();
// // // // //   }, [visibles]);

// // // // //   const filteredRdv = useMemo(() => {
// // // // //     return visibles.filter((r) => {
// // // // //       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
// // // // //       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
// // // // //       if (searchQuery.trim()) {
// // // // //         const query = searchQuery.toLowerCase().trim();
// // // // //         const matchEtud = r.etudiant?.toLowerCase().includes(query);
// // // // //         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
// // // // //         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
// // // // //         if (!matchEtud && !matchEmail && !matchChef) return false;
// // // // //       }
// // // // //       return true;
// // // // //     });
// // // // //   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

// // // // //   // Ouverture du Popup Radar
// // // // //   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
// // // // //     if (!etudiant_id) return;
// // // // //     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
// // // // //     setModalOpen(true);
// // // // //     setModalLoading(true);
// // // // //     setModalError(null);
// // // // //     setAptitudesData(null);
// // // // //     setApetencesData(null);

// // // // //     try {
// // // // //       const [aptitudes, apetences] = await Promise.all([
// // // // //         fetchAptitudesByEtudiant(etudiant_id),
// // // // //         fetchApetencesByEtudiant(etudiant_id),
// // // // //       ]);

// // // // //       if (!aptitudes && !apetences) {
// // // // //         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
// // // // //       } else {
// // // // //         setAptitudesData(aptitudes);
// // // // //         setApetencesData(apetences);
// // // // //       }
// // // // //     } catch (err) {
// // // // //       setModalError(err.message || 'Erreur lors du chargement des compétences.');
// // // // //     } finally {
// // // // //       setModalLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // Données du graphique Radar
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
// // // // //           backgroundColor: 'rgba(41, 211, 211, 0.22)',
// // // // //           borderColor: '#29d3d3',
// // // // //           borderWidth: 2.5,
// // // // //           pointBackgroundColor: '#29d3d3',
// // // // //           pointBorderColor: '#0a0e1a',
// // // // //           pointBorderWidth: 1.5,
// // // // //           pointRadius: 4,
// // // // //           pointHoverRadius: 6,
// // // // //         },
// // // // //         {
// // // // //           label: 'Appétences (Intérêt)',
// // // // //           data: apeValues,
// // // // //           backgroundColor: 'rgba(251, 111, 146, 0.20)',
// // // // //           borderColor: '#fb6f92',
// // // // //           borderWidth: 2.5,
// // // // //           pointBackgroundColor: '#fb6f92',
// // // // //           pointBorderColor: '#0a0e1a',
// // // // //           pointBorderWidth: 1.5,
// // // // //           pointRadius: 4,
// // // // //           pointHoverRadius: 6,
// // // // //         },
// // // // //       ],
// // // // //     };
// // // // //   }, [aptitudesData, apetencesData]);

// // // // //   // Moyennes pour les badges de synthèse au-dessus du radar (dérivé, aucune nouvelle donnée)
// // // // //   const radarAverages = useMemo(() => {
// // // // //     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
// // // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
// // // // //     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
// // // // //   }, [aptitudesData, apetencesData]);

// // // // //   const radarOptions = {
// // // // //     responsive: true,
// // // // //     maintainAspectRatio: false,
// // // // //     scales: {
// // // // //       r: {
// // // // //         min: 0,
// // // // //         suggestedMax: 4,
// // // // //         ticks: {
// // // // //           stepSize: 1,
// // // // //           backdropColor: 'transparent',
// // // // //           color: '#7c88a3',
// // // // //           font: { size: 10 },
// // // // //         },
// // // // //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// // // // //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// // // // //         pointLabels: { color: '#e7ebf5', font: { size: 11, weight: '600' } },
// // // // //       },
// // // // //     },
// // // // //     plugins: {
// // // // //       legend: { display: false },
// // // // //       tooltip: {
// // // // //         backgroundColor: '#151b2e',
// // // // //         borderColor: 'rgba(148, 163, 184, 0.25)',
// // // // //         borderWidth: 1,
// // // // //         titleColor: '#f4f6fb',
// // // // //         bodyColor: '#c7cede',
// // // // //         padding: 10,
// // // // //         cornerRadius: 8,
// // // // //         displayColors: true,
// // // // //       },
// // // // //     },
// // // // //   };

// // // // //   // Export Excel
// // // // //   const handleExportExcel = () => {
// // // // //     if (filteredRdv.length === 0) {
// // // // //       alert('Aucun rendez-vous à exporter.');
// // // // //       return;
// // // // //     }

// // // // //     const exportRows = filteredRdv.map((r) => ({
// // // // //       'Date': r.date,
// // // // //       'Heure de Début': r.heure_debut,
// // // // //       'Heure de Fin': r.heure_fin,
// // // // //       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
// // // // //       'Chef de Projet': r.chef_de_projet || '',
// // // // //       'Étudiant': r.etudiant || '',
// // // // //       'Email Étudiant': r.email_etudiant || '',
// // // // //     }));

// // // // //     const worksheet = XLSX.utils.json_to_sheet(exportRows);
// // // // //     worksheet['!cols'] = [
// // // // //       { wch: 14 },
// // // // //       { wch: 14 },
// // // // //       { wch: 14 },
// // // // //       { wch: 18 },
// // // // //       { wch: 28 },
// // // // //       { wch: 28 },
// // // // //       { wch: 35 },
// // // // //     ];

// // // // //     const workbook = XLSX.utils.book_new();
// // // // //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
// // // // //     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // // // //   };

// // // // //   // Génération du planning (Admin uniquement)
// // // // //   const handleGenerate = async () => {
// // // // //     const confirmation = window.confirm(
// // // // //       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
// // // // //     );
// // // // //     if (!confirmation) return;

// // // // //     setGenerating(true);
// // // // //     setGenError(null);
// // // // //     setGenResult(null);
// // // // //     try {
// // // // //       const token = await getIdToken();
// // // // //       const result = await genererRendezVous(dateDebut, dateFin, token);
// // // // //       setGenResult(result.stats);
// // // // //       await refresh();
// // // // //     } catch (err) {
// // // // //       setGenError(err.message);
// // // // //     } finally {
// // // // //       setGenerating(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <>
// // // // //       <style>{`
// // // // //         :root {
// // // // //           --canvas: #0a0e1a;
// // // // //           --panel: rgba(21, 27, 46, 0.86);
// // // // //           --panel-solid: #151b2e;
// // // // //           --panel-raised: #1b2338;
// // // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // // //           --text-primary: #f4f6fb;
// // // // //           --text-muted: #93a0b8;
// // // // //           --accent-violet: #7c6cf6;
// // // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // // //           --accent-cyan: #29d3d3;
// // // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // // //           --accent-rose: #fb6f92;
// // // // //           --accent-rose-soft: rgba(251, 111, 146, 0.16);
// // // // //           --accent-amber: #f5b942;
// // // // //           --accent-emerald: #35d0a0;
// // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // //           --accent-coral: #ff6b6b;

// // // // //           /* Palette dédiée au tableau des rendez-vous (plus moderne : indigo / sarcelle / ambre) */
// // // // //           --tbl-indigo: #6366f1;
// // // // //           --tbl-indigo-soft: rgba(99, 102, 241, 0.14);
// // // // //           --tbl-teal: #2dd4bf;
// // // // //           --tbl-teal-soft: rgba(45, 212, 191, 0.14);
// // // // //           --tbl-amber: #f59e0b;
// // // // //           --tbl-amber-2: #fb923c;
// // // // //           --tbl-slate-text: #aab6cc;
// // // // //         }

// // // // //         .wow-container {
// // // // //           max-width: 100%;
// // // // //           margin: 0 auto;
// // // // //           padding: 1.5rem 1rem 2.5rem 1rem;
// // // // //           color: var(--text-primary);
// // // // //           background:
// // // // //             radial-gradient(1200px 520px at 8% -10%, rgba(124,108,246,0.12), transparent 60%),
// // // // //             radial-gradient(1000px 520px at 100% 0%, rgba(41,211,211,0.10), transparent 55%),
// // // // //             var(--canvas);
// // // // //         }

// // // // //         .glass-card {
// // // // //           background: var(--panel);
// // // // //           backdrop-filter: blur(16px);
// // // // //           -webkit-backdrop-filter: blur(16px);
// // // // //           border: 1px solid var(--border-subtle);
// // // // //           border-radius: 16px;
// // // // //           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
// // // // //         }

// // // // //         .kpi-card {
// // // // //           padding: 1.15rem;
// // // // //           border-radius: 16px;
// // // // //           background: var(--panel-raised);
// // // // //           border: 1px solid var(--border-subtle);
// // // // //           transition: transform 0.2s ease, border-color 0.2s ease;
// // // // //         }
// // // // //         .kpi-card:hover {
// // // // //           transform: translateY(-3px);
// // // // //           border-color: var(--accent-violet);
// // // // //         }

// // // // //         .generator-box {
// // // // //           background:
// // // // //             radial-gradient(500px 200px at 0% 0%, rgba(124,108,246,0.20), transparent 60%),
// // // // //             radial-gradient(500px 200px at 100% 100%, rgba(41,211,211,0.14), transparent 60%),
// // // // //             var(--panel-raised);
// // // // //           border: 1px solid var(--border-strong);
// // // // //           border-radius: 18px;
// // // // //         }

// // // // //         .btn-glow {
// // // // //           background: linear-gradient(135deg, var(--accent-violet) 0%, #9b7cf9 50%, var(--accent-cyan) 100%);
// // // // //           border: none;
// // // // //           color: #0a0e1a;
// // // // //           font-weight: 700;
// // // // //           border-radius: 12px;
// // // // //           box-shadow: 0 4px 20px rgba(124, 108, 246, 0.35);
// // // // //         }

// // // // //         .btn-excel {
// // // // //           background: linear-gradient(135deg, var(--accent-emerald) 0%, #22b98c 100%);
// // // // //           border: none;
// // // // //           color: #06231a;
// // // // //           font-weight: 700;
// // // // //           border-radius: 10px;
// // // // //         }

// // // // //         /* ---------- Tableau des rendez-vous : palette moderne indigo / sarcelle / ambre ---------- */
// // // // //         .wow-table {
// // // // //           background: transparent !important;
// // // // //           color: var(--text-primary) !important;
// // // // //         }
// // // // //         .wow-table thead th {
// // // // //           background: var(--panel-solid) !important;
// // // // //           color: var(--tbl-slate-text);
// // // // //           font-size: 0.75rem;
// // // // //           text-transform: uppercase;
// // // // //           letter-spacing: 0.08em;
// // // // //           padding: 0.85rem 1rem;
// // // // //           border-bottom: 2px solid var(--tbl-teal-soft) !important;
// // // // //         }
// // // // //         .wow-table tbody tr {
// // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // //         }
// // // // //         .wow-table tbody tr:hover {
// // // // //           background-color: var(--tbl-indigo-soft) !important;
// // // // //         }

// // // // //         .time-pill {
// // // // //           background: linear-gradient(135deg, var(--tbl-teal-soft), var(--tbl-indigo-soft));
// // // // //           border: 1px solid rgba(45, 212, 191, 0.4);
// // // // //           color: var(--tbl-teal);
// // // // //           padding: 6px 14px;
// // // // //           border-radius: 20px;
// // // // //           font-weight: 600;
// // // // //           font-family: monospace;
// // // // //           font-size: 0.85rem;
// // // // //         }

// // // // //         .date-pill {
// // // // //           background: rgba(148, 163, 184, 0.07);
// // // // //           border: 1px solid rgba(148, 163, 184, 0.28);
// // // // //           color: #dbe4f3;
// // // // //           padding: 5px 12px;
// // // // //           border-radius: 8px;
// // // // //           font-family: monospace;
// // // // //         }

// // // // //         .avatar-student-btn {
// // // // //           cursor: pointer;
// // // // //           transition: background 0.15s ease;
// // // // //           display: inline-flex;
// // // // //           align-items: center;
// // // // //           gap: 10px;
// // // // //           padding: 4px 6px;
// // // // //           border-radius: 8px;
// // // // //         }
// // // // //         .avatar-student-btn:hover {
// // // // //           background: var(--tbl-indigo-soft);
// // // // //         }

// // // // //         .avatar-icon {
// // // // //           width: 32px;
// // // // //           height: 32px;
// // // // //           border-radius: 8px;
// // // // //           background: linear-gradient(135deg, var(--tbl-indigo), #8b7cf6);
// // // // //           display: inline-flex;
// // // // //           align-items: center;
// // // // //           justify-content: center;
// // // // //           font-weight: bold;
// // // // //           font-size: 0.8rem;
// // // // //           color: #ffffff;
// // // // //         }

// // // // //         /* Boutons Documents CV / LM */
// // // // //         .doc-badge-btn {
// // // // //           background: var(--tbl-teal-soft);
// // // // //           border: 1px solid rgba(45, 212, 191, 0.4);
// // // // //           color: var(--tbl-teal);
// // // // //           padding: 3px 7px;
// // // // //           border-radius: 6px;
// // // // //           font-size: 0.72rem;
// // // // //           font-weight: 600;
// // // // //           text-decoration: none;
// // // // //           display: inline-flex;
// // // // //           align-items: center;
// // // // //           gap: 3px;
// // // // //           transition: background 0.15s ease, color 0.15s ease;
// // // // //         }
// // // // //         .doc-badge-btn:hover {
// // // // //           background: var(--tbl-teal);
// // // // //           color: #06231e;
// // // // //         }
// // // // //         .doc-badge-disabled {
// // // // //           background: rgba(255, 255, 255, 0.03);
// // // // //           border: 1px solid var(--border-subtle);
// // // // //           color: rgba(148, 163, 184, 0.4);
// // // // //           padding: 3px 7px;
// // // // //           border-radius: 6px;
// // // // //           font-size: 0.72rem;
// // // // //           cursor: not-allowed;
// // // // //         }

// // // // //         .custom-input {
// // // // //           background: var(--panel-raised) !important;
// // // // //           border: 1px solid var(--border-strong) !important;
// // // // //           color: var(--text-primary) !important;
// // // // //           border-radius: 10px;
// // // // //         }
// // // // //         .custom-input:focus {
// // // // //           background: var(--panel-raised) !important;
// // // // //           color: var(--text-primary) !important;
// // // // //           border-color: var(--accent-cyan) !important;
// // // // //           box-shadow: 0 0 0 3px rgba(41, 211, 211, 0.18) !important;
// // // // //         }

// // // // //         .wow-container .text-info { color: var(--accent-cyan) !important; }
// // // // //         .wow-container .text-success { color: var(--accent-emerald) !important; }
// // // // //         .wow-container .text-warning { color: var(--accent-amber) !important; }

// // // // //         /* --- Modal Radar : même refonte que la page Évaluations --- */
// // // // //         .radar-modal-content {
// // // // //           background: var(--panel-solid) !important;
// // // // //           border: 1px solid var(--border-strong) !important;
// // // // //           border-radius: 18px !important;
// // // // //           overflow: hidden;
// // // // //           box-shadow: 0 24px 60px rgba(0,0,0,0.55);
// // // // //         }
// // // // //         .radar-modal-header {
// // // // //           position: relative;
// // // // //           padding: 1.5rem 1.75rem 1.25rem 1.75rem;
// // // // //           background:
// // // // //             radial-gradient(600px 220px at 15% 0%, rgba(124,108,246,0.35), transparent 60%),
// // // // //             radial-gradient(600px 220px at 100% 0%, rgba(41,211,211,0.25), transparent 60%),
// // // // //             var(--panel-raised);
// // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // //         }
// // // // //         .radar-modal-close {
// // // // //           position: absolute;
// // // // //           top: 1rem;
// // // // //           right: 1rem;
// // // // //           width: 30px;
// // // // //           height: 30px;
// // // // //           border-radius: 50%;
// // // // //           border: 1px solid var(--border-strong);
// // // // //           background: rgba(255,255,255,0.04);
// // // // //           color: var(--text-primary);
// // // // //           font-size: 0.85rem;
// // // // //           line-height: 1;
// // // // //           cursor: pointer;
// // // // //         }
// // // // //         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
// // // // //         .radar-modal-eyebrow {
// // // // //           text-transform: uppercase;
// // // // //           letter-spacing: 1.2px;
// // // // //           font-size: 0.7rem;
// // // // //           font-weight: 700;
// // // // //           color: var(--accent-cyan);
// // // // //           margin-bottom: 0.25rem;
// // // // //         }
// // // // //         .radar-modal-title {
// // // // //           color: var(--text-primary);
// // // // //           font-weight: 700;
// // // // //           margin: 0 0 1rem 0;
// // // // //           font-size: 1.35rem;
// // // // //         }
// // // // //         .radar-modal-stats {
// // // // //           display: flex;
// // // // //           gap: 0.75rem;
// // // // //           flex-wrap: wrap;
// // // // //         }
// // // // //         .radar-stat {
// // // // //           display: flex;
// // // // //           align-items: center;
// // // // //           gap: 0.45rem;
// // // // //           padding: 0.4rem 0.75rem;
// // // // //           border-radius: 10px;
// // // // //           background: rgba(255,255,255,0.04);
// // // // //           border: 1px solid var(--border-subtle);
// // // // //         }
// // // // //         .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
// // // // //         .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
// // // // //         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
// // // // //         .radar-stat-label { color: var(--text-muted); font-size: 0.78rem; }
// // // // //         .radar-stat-value { color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
// // // // //         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
// // // // //         .radar-modal-body {
// // // // //           padding: 1.5rem 1.75rem;
// // // // //           min-height: 400px;
// // // // //           display: flex;
// // // // //           flex-direction: column;
// // // // //           justify-content: center;
// // // // //         }
// // // // //         .radar-modal-footer {
// // // // //           padding: 1rem 1.75rem;
// // // // //           border-top: 1px solid var(--border-subtle);
// // // // //           display: flex;
// // // // //           justify-content: space-between;
// // // // //           align-items: center;
// // // // //         }
// // // // //       `}</style>

// // // // //       <Navbar />

// // // // //       <div className="wow-container">
// // // // //         {/* Titre & Barre d'actions */}
// // // // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // // // //           <div>
// // // // //             <div className="d-flex align-items-center gap-2">
// // // // //               <span style={{ fontSize: '1.6rem' }}>⚡</span>
// // // // //               <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
// // // // //                 {isAdmin
// // // // //                   ? 'Planning des Rendez-vous (Admin)'
// // // // //                   : isChef
// // // // //                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
// // // // //                   : 'Mes Rendez-vous'}
// // // // //               </h2>
// // // // //             </div>
// // // // //             <p className="text-muted small mt-1 mb-0">
// // // // //               {(isAdmin || isChef) ? (
// // // // //                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
// // // // //               ) : (
// // // // //                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
// // // // //               )}
// // // // //             </p>
// // // // //           </div>

// // // // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // // // //             <Button
// // // // //               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
// // // // //               onClick={handleExportExcel}
// // // // //               disabled={filteredRdv.length === 0}
// // // // //             >
// // // // //               <span>📊</span>
// // // // //               <span>Exporter Excel ({filteredRdv.length})</span>
// // // // //             </Button>
// // // // //             <Button
// // // // //               variant="outline-light"
// // // // //               size="sm"
// // // // //               onClick={refresh}
// // // // //               className="d-flex align-items-center gap-2 px-3 py-2"
// // // // //               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}
// // // // //             >
// // // // //               <span>🔄</span> Actualiser
// // // // //             </Button>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Panneau Admin : Générateur */}
// // // // //         {isAdmin && (
// // // // //           <div className="generator-box p-4 mb-4 shadow-lg">
// // // // //             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // //               <span
// // // // //                 className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
// // // // //                 style={{ background: 'var(--accent-violet)', color: '#0a0e1a' }}
// // // // //               >
// // // // //                 Mode Administrateur
// // // // //               </span>
// // // // //               <span className="fw-semibold fs-5 text-white">Générer le planning global</span>
// // // // //             </div>

// // // // //             <Row className="g-3 align-items-end">
// // // // //               <Col xs={12} sm={6} md={3}>
// // // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
// // // // //                 <Form.Control
// // // // //                   type="date"
// // // // //                   className="custom-input"
// // // // //                   value={dateDebut}
// // // // //                   onChange={(e) => setDateDebut(e.target.value)}
// // // // //                 />
// // // // //               </Col>
// // // // //               <Col xs={12} sm={6} md={3}>
// // // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
// // // // //                 <Form.Control
// // // // //                   type="date"
// // // // //                   className="custom-input"
// // // // //                   value={dateFin}
// // // // //                   onChange={(e) => setDateFin(e.target.value)}
// // // // //                 />
// // // // //               </Col>
// // // // //               <Col xs={12} md={6}>
// // // // //                 <Button
// // // // //                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
// // // // //                   onClick={handleGenerate}
// // // // //                   disabled={generating}
// // // // //                 >
// // // // //                   {generating ? (
// // // // //                     <>
// // // // //                       <Spinner size="sm" animation="border" />
// // // // //                       <span>Optimisation et placement des créneaux...</span>
// // // // //                     </>
// // // // //                   ) : (
// // // // //                     <>
// // // // //                       <span>✨</span>
// // // // //                       <span>Lancer la génération des rendez-vous</span>
// // // // //                     </>
// // // // //                   )}
// // // // //                 </Button>
// // // // //               </Col>
// // // // //             </Row>

// // // // //             {genError && (
// // // // //               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
// // // // //                 <strong>Erreur : </strong> {genError}
// // // // //               </Alert>
// // // // //             )}
// // // // //             {genResult && (
// // // // //               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
// // // // //                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
// // // // //                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
// // // // //               </Alert>
// // // // //             )}
// // // // //           </div>
// // // // //         )}

// // // // //         {/* KPI Cards */}
// // // // //         <Row className="g-3 mb-4">
// // // // //           <Col xs={6} md={3}>
// // // // //             <div className="kpi-card text-center">
// // // // //               <div className="text-muted small text-uppercase fw-bold">Total Rendez-vous</div>
// // // // //               <div className="fs-2 fw-bold mt-1 text-info">{filteredRdv.length}</div>
// // // // //             </div>
// // // // //           </Col>
// // // // //           <Col xs={6} md={3}>
// // // // //             <div className="kpi-card text-center">
// // // // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // // // //               <div className="fs-2 fw-bold mt-1 text-success">{uniqueChefs.length}</div>
// // // // //             </div>
// // // // //           </Col>
// // // // //           <Col xs={6} md={3}>
// // // // //             <div className="kpi-card text-center">
// // // // //               <div className="text-muted small text-uppercase fw-bold">Jours de Passage</div>
// // // // //               <div className="fs-2 fw-bold mt-1 text-warning">{uniqueDates.length}</div>
// // // // //             </div>
// // // // //           </Col>
// // // // //           <Col xs={6} md={3}>
// // // // //             <div className="kpi-card text-center">
// // // // //               <div className="text-muted small text-uppercase fw-bold">Visibilité</div>
// // // // //               <div className="fs-2 fw-bold mt-1 text-light">
// // // // //                 {filteredRdv.length} <span className="fs-6 text-muted">/ {visibles.length}</span>
// // // // //               </div>
// // // // //             </div>
// // // // //           </Col>
// // // // //         </Row>

// // // // //         {/* Barre de Filtres */}
// // // // //         <Card className="glass-card mb-4 p-3 border-0">
// // // // //           <Row className="g-2 align-items-center">
// // // // //             <Col xs={12} md={4}>
// // // // //               <InputGroup size="sm">
// // // // //                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
// // // // //                 <Form.Control
// // // // //                   placeholder="Rechercher étudiant, email, chef..."
// // // // //                   className="custom-input border-0"
// // // // //                   value={searchQuery}
// // // // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // // // //                 />
// // // // //                 {searchQuery && (
// // // // //                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
// // // // //                 )}
// // // // //               </InputGroup>
// // // // //             </Col>

// // // // //             <Col xs={12} sm={6} md={3}>
// // // // //               <Form.Select
// // // // //                 size="sm"
// // // // //                 className="custom-input"
// // // // //                 value={selectedChef}
// // // // //                 onChange={(e) => setSelectedChef(e.target.value)}
// // // // //               >
// // // // //                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
// // // // //                 {uniqueChefs.map((chef) => (
// // // // //                   <option key={chef} value={chef}>{chef}</option>
// // // // //                 ))}
// // // // //               </Form.Select>
// // // // //             </Col>

// // // // //             <Col xs={12} sm={6} md={3}>
// // // // //               <Form.Select
// // // // //                 size="sm"
// // // // //                 className="custom-input"
// // // // //                 value={selectedDateFilter}
// // // // //                 onChange={(e) => setSelectedDateFilter(e.target.value)}
// // // // //               >
// // // // //                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
// // // // //                 {uniqueDates.map((d) => (
// // // // //                   <option key={d} value={d}>{d}</option>
// // // // //                 ))}
// // // // //               </Form.Select>
// // // // //             </Col>

// // // // //             <Col xs={12} md={2} className="text-md-end">
// // // // //               <Button
// // // // //                 variant="outline-secondary"
// // // // //                 size="sm"
// // // // //                 className="w-100 py-1 rounded-3"
// // // // //                 onClick={() => {
// // // // //                   setSearchQuery('');
// // // // //                   setSelectedChef('all');
// // // // //                   setSelectedDateFilter('all');
// // // // //                 }}
// // // // //                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
// // // // //               >
// // // // //                 Réinitialiser
// // // // //               </Button>
// // // // //             </Col>
// // // // //           </Row>
// // // // //         </Card>

// // // // //         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

// // // // //         {/* Tableau des Rendez-vous */}
// // // // //         {loading ? (
// // // // //           <div className="text-center py-5">
// // // // //             <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // // // //             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
// // // // //           </div>
// // // // //         ) : (
// // // // //           <div className="glass-card overflow-hidden">
// // // // //             <div className="table-responsive">
// // // // //               <Table hover size="sm" className="wow-table mb-0 align-middle text-nowrap">
// // // // //                 <thead>
// // // // //                   <tr>
// // // // //                     <th>Date</th>
// // // // //                     <th>Créneau Horaire</th>
// // // // //                     <th>Chef de projet</th>
// // // // //                     {(isAdmin || isChef) && <th>Étudiant (Radar & Documents)</th>}
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {filteredRdv.map((r) => (
// // // // //                     <tr key={r.id}>
// // // // //                       <td>
// // // // //                         <span className="date-pill">{r.date}</span>
// // // // //                       </td>
// // // // //                       <td>
// // // // //                         <span className="time-pill">
// // // // //                           <span>⏱</span>
// // // // //                           <span>{r.heure_debut} ➔ {r.heure_fin}</span>
// // // // //                         </span>
// // // // //                       </td>
// // // // //                       <td>
// // // // //                         <div className="d-flex align-items-center gap-2">
// // // // //                           <span className="avatar-icon" style={{ background: 'linear-gradient(135deg, var(--tbl-amber), var(--tbl-amber-2))', color: '#241a03' }}>
// // // // //                             {r.chef_de_projet?.charAt(0) || 'C'}
// // // // //                           </span>
// // // // //                           <span className="fw-semibold text-white">{r.chef_de_projet}</span>
// // // // //                         </div>
// // // // //                       </td>
// // // // //                       {(isAdmin || isChef) && (
// // // // //                         <td>
// // // // //                           <div className="d-flex align-items-center justify-content-between gap-2">
// // // // //                             <div
// // // // //                               className="avatar-student-btn"
// // // // //                               title="Cliquer pour afficher le Radar des compétences"
// // // // //                               onClick={() => handleOpenStudentRadar(r.etudiant_id, r.etudiant, r.email_etudiant)}
// // // // //                             >
// // // // //                               <span className="avatar-icon">
// // // // //                                 {r.etudiant?.charAt(0) || 'E'}
// // // // //                               </span>
// // // // //                               <div>
// // // // //                                 <div className="fw-semibold text-decoration-underline" style={{ color: 'var(--tbl-teal)' }}>
// // // // //                                   {r.etudiant} 📊
// // // // //                                 </div>
// // // // //                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // // // //                                   {r.email_etudiant}
// // // // //                                 </div>
// // // // //                               </div>
// // // // //                             </div>

// // // // //                             {/* Boutons Documents CV / LM */}
// // // // //                             <div className="d-flex gap-1 me-2">
// // // // //                               {r.cv_path ? (
// // // // //                                 <a
// // // // //                                   href={getDocumentPublicUrl(r.cv_path)}
// // // // //                                   target="_blank"
// // // // //                                   rel="noopener noreferrer"
// // // // //                                   className="doc-badge-btn"
// // // // //                                   title="Ouvrir le CV (PDF)"
// // // // //                                   onClick={(e) => e.stopPropagation()}
// // // // //                                 >
// // // // //                                   📄 CV
// // // // //                                 </a>
// // // // //                               ) : (
// // // // //                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
// // // // //                                   📄 CV
// // // // //                                 </span>
// // // // //                               )}

// // // // //                               {r.lm_path ? (
// // // // //                                 <a
// // // // //                                   href={getDocumentPublicUrl(r.lm_path)}
// // // // //                                   target="_blank"
// // // // //                                   rel="noopener noreferrer"
// // // // //                                   className="doc-badge-btn"
// // // // //                                   title="Ouvrir la Lettre de Motivation (PDF)"
// // // // //                                   onClick={(e) => e.stopPropagation()}
// // // // //                                 >
// // // // //                                   ✉️ LM
// // // // //                                 </a>
// // // // //                               ) : (
// // // // //                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
// // // // //                                   ✉️ LM
// // // // //                                 </span>
// // // // //                               )}
// // // // //                             </div>
// // // // //                           </div>
// // // // //                         </td>
// // // // //                       )}
// // // // //                     </tr>
// // // // //                   ))}

// // // // //                   {filteredRdv.length === 0 && (
// // // // //                     <tr>
// // // // //                       <td colSpan={(isAdmin || isChef) ? 4 : 3} className="text-center py-5">
// // // // //                         <div style={{ fontSize: '2.5rem' }}>✨</div>
// // // // //                         <div className="mt-3 fw-bold text-white fs-5">Aucun rendez-vous trouvé</div>
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   )}
// // // // //                 </tbody>
// // // // //               </Table>
// // // // //             </div>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Modal Radar — profil de compétences (même refonte que la page Évaluations) */}
// // // // //       <Modal
// // // // //         show={modalOpen}
// // // // //         onHide={() => setModalOpen(false)}
// // // // //         size="lg"
// // // // //         centered
// // // // //         contentClassName="radar-modal-content"
// // // // //       >
// // // // //         <div className="radar-modal-header">
// // // // //           <button
// // // // //             type="button"
// // // // //             className="radar-modal-close"
// // // // //             onClick={() => setModalOpen(false)}
// // // // //             aria-label="Fermer"
// // // // //           >
// // // // //             ✕
// // // // //           </button>
// // // // //           <div className="radar-modal-eyebrow">Profil de compétences</div>
// // // // //           <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
// // // // //           {!modalLoading && !modalError && (
// // // // //             <div className="radar-modal-stats">
// // // // //               <div className="radar-stat radar-stat-cyan">
// // // // //                 <span className="radar-stat-dot" />
// // // // //                 <span className="radar-stat-label">Aptitudes</span>
// // // // //                 <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
// // // // //               </div>
// // // // //               <div className="radar-stat radar-stat-rose">
// // // // //                 <span className="radar-stat-dot" />
// // // // //                 <span className="radar-stat-label">Appétences</span>
// // // // //                 <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         <div className="radar-modal-body">
// // // // //           {modalLoading ? (
// // // // //             <div className="text-center py-5">
// // // // //               <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // // // //               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
// // // // //             </div>
// // // // //           ) : modalError ? (
// // // // //             <Alert variant="warning" className="text-center m-3 mb-0">
// // // // //               {modalError}
// // // // //             </Alert>
// // // // //           ) : (
// // // // //             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
// // // // //               <Radar data={radarChartData} options={radarOptions} />
// // // // //             </div>
// // // // //           )}
// // // // //         </div>

// // // // //         <div className="radar-modal-footer">
// // // // //           <small className="text-muted font-monospace">
// // // // //             {selectedEtudiantInfo?.email}
// // // // //           </small>
// // // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>
// // // // //             Fermer
// // // // //           </Button>
// // // // //         </div>
// // // // //       </Modal>
// // // // //     </>
// // // // //   );
// // // // // }

// // // // import React, { useState, useMemo } from 'react';
// // // // import {
// // // //   Table,
// // // //   Button,
// // // //   Alert,
// // // //   Spinner,
// // // //   Form,
// // // //   Card,
// // // //   Row,
// // // //   Col,
// // // //   InputGroup,
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
// // // // import { useAuth } from '../context/AuthContext';
// // // // import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// // // // import {
// // // //   genererRendezVous,
// // // //   fetchAptitudesByEtudiant,
// // // //   fetchApetencesByEtudiant,
// // // //   getDocumentPublicUrl,
// // // // } from '../services/supabase';

// // // // // Enregistrement des composants Chart.js pour le Radar
// // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

// // // // export default function RendezVousPage() {
// // // //   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
// // // //   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

// // // //   // Logique de génération (Admin)
// // // //   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
// // // //   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
// // // //   const [generating, setGenerating] = useState(false);
// // // //   const [genError, setGenError] = useState(null);
// // // //   const [genResult, setGenResult] = useState(null);

// // // //   // Filtres en temps réel
// // // //   const [searchQuery, setSearchQuery] = useState('');
// // // //   const [selectedChef, setSelectedChef] = useState('all');
// // // //   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

// // // //   // État du Modal Radar Étudiant
// // // //   const [modalOpen, setModalOpen] = useState(false);
// // // //   const [modalLoading, setModalLoading] = useState(false);
// // // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // // //   const [aptitudesData, setAptitudesData] = useState(null);
// // // //   const [apetencesData, setApetencesData] = useState(null);
// // // //   const [modalError, setModalError] = useState(null);

// // // //   // Filtrage selon le profil connecté :
// // // //   const visibles = useMemo(() => {
// // // //     if (isAdmin) {
// // // //       return rendezVous;
// // // //     }
// // // //     if (isChef) {
// // // //       // Pour le chef : uniquement ses rendez-vous
// // // //       return rendezVous.filter(
// // // //         (r) =>
// // // //           r.chef_de_projet_id === chefId ||
// // // //           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
// // // //       );
// // // //     }
// // // //     // Pour l'étudiant : uniquement ses propres rendez-vous
// // // //     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
// // // //   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

// // // //   const uniqueChefs = useMemo(() => {
// // // //     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
// // // //     return Array.from(chefs).sort();
// // // //   }, [visibles]);

// // // //   const uniqueDates = useMemo(() => {
// // // //     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
// // // //     return Array.from(dates).sort();
// // // //   }, [visibles]);

// // // //   const filteredRdv = useMemo(() => {
// // // //     return visibles.filter((r) => {
// // // //       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
// // // //       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
// // // //       if (searchQuery.trim()) {
// // // //         const query = searchQuery.toLowerCase().trim();
// // // //         const matchEtud = r.etudiant?.toLowerCase().includes(query);
// // // //         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
// // // //         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
// // // //         if (!matchEtud && !matchEmail && !matchChef) return false;
// // // //       }
// // // //       return true;
// // // //     });
// // // //   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

// // // //   // Ouverture du Popup Radar
// // // //   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
// // // //     if (!etudiant_id) return;
// // // //     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
// // // //     setModalOpen(true);
// // // //     setModalLoading(true);
// // // //     setModalError(null);
// // // //     setAptitudesData(null);
// // // //     setApetencesData(null);

// // // //     try {
// // // //       const [aptitudes, apetences] = await Promise.all([
// // // //         fetchAptitudesByEtudiant(etudiant_id),
// // // //         fetchApetencesByEtudiant(etudiant_id),
// // // //       ]);

// // // //       if (!aptitudes && !apetences) {
// // // //         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
// // // //       } else {
// // // //         setAptitudesData(aptitudes);
// // // //         setApetencesData(apetences);
// // // //       }
// // // //     } catch (err) {
// // // //       setModalError(err.message || 'Erreur lors du chargement des compétences.');
// // // //     } finally {
// // // //       setModalLoading(false);
// // // //     }
// // // //   };

// // // //   // Données du graphique Radar
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
// // // //           backgroundColor: 'rgba(45, 212, 191, 0.22)',
// // // //           borderColor: '#2dd4bf',
// // // //           borderWidth: 2.5,
// // // //           pointBackgroundColor: '#2dd4bf',
// // // //           pointBorderColor: '#0b1020',
// // // //           pointBorderWidth: 1.5,
// // // //           pointRadius: 4,
// // // //           pointHoverRadius: 6,
// // // //         },
// // // //         {
// // // //           label: 'Appétences (Intérêt)',
// // // //           data: apeValues,
// // // //           backgroundColor: 'rgba(244, 63, 94, 0.18)',
// // // //           borderColor: '#f43f5e',
// // // //           borderWidth: 2.5,
// // // //           pointBackgroundColor: '#f43f5e',
// // // //           pointBorderColor: '#0b1020',
// // // //           pointBorderWidth: 1.5,
// // // //           pointRadius: 4,
// // // //           pointHoverRadius: 6,
// // // //         },
// // // //       ],
// // // //     };
// // // //   }, [aptitudesData, apetencesData]);

// // // //   // Moyennes pour les badges de synthèse au-dessus du radar (dérivé, aucune nouvelle donnée)
// // // //   const radarAverages = useMemo(() => {
// // // //     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
// // // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
// // // //     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
// // // //   }, [aptitudesData, apetencesData]);

// // // //   const radarOptions = {
// // // //     responsive: true,
// // // //     maintainAspectRatio: false,
// // // //     scales: {
// // // //       r: {
// // // //         min: 0,
// // // //         suggestedMax: 4,
// // // //         ticks: {
// // // //           stepSize: 1,
// // // //           backdropColor: 'transparent',
// // // //           color: '#8892ab',
// // // //           font: { size: 10 },
// // // //         },
// // // //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// // // //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// // // //         pointLabels: { color: '#eef1f8', font: { size: 11, weight: '600' } },
// // // //       },
// // // //     },
// // // //     plugins: {
// // // //       legend: { display: false },
// // // //       tooltip: {
// // // //         backgroundColor: '#161c30',
// // // //         borderColor: 'rgba(148, 163, 184, 0.25)',
// // // //         borderWidth: 1,
// // // //         titleColor: '#f5f7fc',
// // // //         bodyColor: '#c9d0e0',
// // // //         padding: 10,
// // // //         cornerRadius: 8,
// // // //         displayColors: true,
// // // //       },
// // // //     },
// // // //   };

// // // //   // Export Excel
// // // //   const handleExportExcel = () => {
// // // //     if (filteredRdv.length === 0) {
// // // //       alert('Aucun rendez-vous à exporter.');
// // // //       return;
// // // //     }

// // // //     const exportRows = filteredRdv.map((r) => ({
// // // //       'Date': r.date,
// // // //       'Heure de Début': r.heure_debut,
// // // //       'Heure de Fin': r.heure_fin,
// // // //       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
// // // //       'Chef de Projet': r.chef_de_projet || '',
// // // //       'Étudiant': r.etudiant || '',
// // // //       'Email Étudiant': r.email_etudiant || '',
// // // //     }));

// // // //     const worksheet = XLSX.utils.json_to_sheet(exportRows);
// // // //     worksheet['!cols'] = [
// // // //       { wch: 14 },
// // // //       { wch: 14 },
// // // //       { wch: 14 },
// // // //       { wch: 18 },
// // // //       { wch: 28 },
// // // //       { wch: 28 },
// // // //       { wch: 35 },
// // // //     ];

// // // //     const workbook = XLSX.utils.book_new();
// // // //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
// // // //     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // // //   };

// // // //   // Génération du planning (Admin uniquement)
// // // //   const handleGenerate = async () => {
// // // //     const confirmation = window.confirm(
// // // //       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
// // // //     );
// // // //     if (!confirmation) return;

// // // //     setGenerating(true);
// // // //     setGenError(null);
// // // //     setGenResult(null);
// // // //     try {
// // // //       const token = await getIdToken();
// // // //       const result = await genererRendezVous(dateDebut, dateFin, token);
// // // //       setGenResult(result.stats);
// // // //       await refresh();
// // // //     } catch (err) {
// // // //       setGenError(err.message);
// // // //     } finally {
// // // //       setGenerating(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <style>{`
// // // //         :root {
// // // //           --canvas: #0b0f1d;
// // // //           --panel: rgba(22, 28, 48, 0.86);
// // // //           --panel-solid: #161c30;
// // // //           --panel-raised: #1c2440;
// // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // //           --text-primary: #f5f7fc;
// // // //           --text-muted: #8f9bb5;

// // // //           /* Palette principale modernisée */
// // // //           --accent-violet: #8b5cf6;
// // // //           --accent-violet-soft: rgba(139, 92, 246, 0.18);
// // // //           --accent-cyan: #22d3ee;
// // // //           --accent-cyan-soft: rgba(34, 211, 238, 0.16);
// // // //           --accent-rose: #f43f5e;
// // // //           --accent-rose-soft: rgba(244, 63, 94, 0.16);
// // // //           --accent-amber: #f59e0b;
// // // //           --accent-emerald: #10b981;
// // // //           --accent-emerald-soft: rgba(16, 185, 129, 0.16);
// // // //           --accent-coral: #fb7185;

// // // //           /* Palette dédiée au tableau des rendez-vous (indigo / sarcelle / ambre) */
// // // //           --tbl-indigo: #6366f1;
// // // //           --tbl-indigo-soft: rgba(99, 102, 241, 0.14);
// // // //           --tbl-teal: #2dd4bf;
// // // //           --tbl-teal-soft: rgba(45, 212, 191, 0.14);
// // // //           --tbl-amber: #f59e0b;
// // // //           --tbl-amber-2: #fb923c;
// // // //           --tbl-amber-text: #fbbf24;
// // // //           --tbl-slate-text: #a7b2c9;
// // // //         }

// // // //         .wow-container {
// // // //           max-width: 100%;
// // // //           margin: 0 auto;
// // // //           padding: 1.5rem 1rem 2.5rem 1rem;
// // // //           color: var(--text-primary);
// // // //           background:
// // // //             radial-gradient(1200px 520px at 8% -10%, rgba(139,92,246,0.12), transparent 60%),
// // // //             radial-gradient(1000px 520px at 100% 0%, rgba(34,211,238,0.10), transparent 55%),
// // // //             var(--canvas);
// // // //         }

// // // //         .glass-card {
// // // //           background: var(--panel);
// // // //           backdrop-filter: blur(16px);
// // // //           -webkit-backdrop-filter: blur(16px);
// // // //           border: 1px solid var(--border-subtle);
// // // //           border-radius: 16px;
// // // //           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
// // // //         }

// // // //         .kpi-card {
// // // //           padding: 1.15rem;
// // // //           border-radius: 16px;
// // // //           background: var(--panel-raised);
// // // //           border: 1px solid var(--border-subtle);
// // // //           transition: transform 0.2s ease, border-color 0.2s ease;
// // // //         }
// // // //         .kpi-card:hover {
// // // //           transform: translateY(-3px);
// // // //           border-color: var(--accent-violet);
// // // //         }

// // // //         .generator-box {
// // // //           background:
// // // //             radial-gradient(500px 200px at 0% 0%, rgba(139,92,246,0.20), transparent 60%),
// // // //             radial-gradient(500px 200px at 100% 100%, rgba(34,211,238,0.14), transparent 60%),
// // // //             var(--panel-raised);
// // // //           border: 1px solid var(--border-strong);
// // // //           border-radius: 18px;
// // // //         }

// // // //         .btn-glow {
// // // //           background: linear-gradient(135deg, var(--accent-violet) 0%, #a78bfa 50%, var(--accent-cyan) 100%);
// // // //           border: none;
// // // //           color: #0b0f1d;
// // // //           font-weight: 700;
// // // //           border-radius: 12px;
// // // //           box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
// // // //         }

// // // //         .btn-excel {
// // // //           background: linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%);
// // // //           border: none;
// // // //           color: #05231a;
// // // //           font-weight: 700;
// // // //           border-radius: 10px;
// // // //         }

// // // //         /* ---------- Tableau des rendez-vous : palette moderne indigo / sarcelle / ambre ---------- */
// // // //         .wow-table {
// // // //           background: transparent !important;
// // // //           color: var(--text-primary) !important;
// // // //         }
// // // //         .wow-table thead th {
// // // //           background: var(--panel-solid) !important;
// // // //           color: var(--tbl-slate-text);
// // // //           font-size: 0.75rem;
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.08em;
// // // //           padding: 0.85rem 1rem;
// // // //           border-bottom: 2px solid var(--tbl-teal-soft) !important;
// // // //         }
// // // //         .wow-table tbody tr {
// // // //           border-bottom: 1px solid var(--border-subtle);
// // // //         }
// // // //         .wow-table tbody tr:hover {
// // // //           background-color: var(--tbl-indigo-soft) !important;
// // // //         }

// // // //         .time-pill {
// // // //           background: linear-gradient(135deg, var(--tbl-teal-soft), var(--tbl-indigo-soft));
// // // //           border: 1px solid rgba(45, 212, 191, 0.4);
// // // //           color: var(--tbl-teal);
// // // //           padding: 6px 14px;
// // // //           border-radius: 20px;
// // // //           font-weight: 600;
// // // //           font-family: monospace;
// // // //           font-size: 0.85rem;
// // // //         }

// // // //         .date-pill {
// // // //           background: rgba(148, 163, 184, 0.07);
// // // //           border: 1px solid rgba(148, 163, 184, 0.28);
// // // //           color: #dfe6f5;
// // // //           padding: 5px 12px;
// // // //           border-radius: 8px;
// // // //           font-family: monospace;
// // // //         }

// // // //         .chef-name {
// // // //           color: var(--tbl-amber-text);
// // // //           font-weight: 600;
// // // //         }

// // // //         .avatar-student-btn {
// // // //           cursor: pointer;
// // // //           transition: background 0.15s ease;
// // // //           display: inline-flex;
// // // //           align-items: center;
// // // //           gap: 10px;
// // // //           padding: 4px 6px;
// // // //           border-radius: 8px;
// // // //         }
// // // //         .avatar-student-btn:hover {
// // // //           background: var(--tbl-indigo-soft);
// // // //         }

// // // //         .avatar-icon {
// // // //           width: 32px;
// // // //           height: 32px;
// // // //           border-radius: 8px;
// // // //           background: linear-gradient(135deg, var(--tbl-indigo), #a78bfa);
// // // //           display: inline-flex;
// // // //           align-items: center;
// // // //           justify-content: center;
// // // //           font-weight: bold;
// // // //           font-size: 0.8rem;
// // // //           color: #ffffff;
// // // //         }

// // // //         /* Boutons Documents CV / LM */
// // // //         .doc-badge-btn {
// // // //           background: var(--tbl-teal-soft);
// // // //           border: 1px solid rgba(45, 212, 191, 0.4);
// // // //           color: var(--tbl-teal);
// // // //           padding: 3px 7px;
// // // //           border-radius: 6px;
// // // //           font-size: 0.72rem;
// // // //           font-weight: 600;
// // // //           text-decoration: none;
// // // //           display: inline-flex;
// // // //           align-items: center;
// // // //           gap: 3px;
// // // //           transition: background 0.15s ease, color 0.15s ease;
// // // //         }
// // // //         .doc-badge-btn:hover {
// // // //           background: var(--tbl-teal);
// // // //           color: #062a24;
// // // //         }
// // // //         .doc-badge-disabled {
// // // //           background: rgba(255, 255, 255, 0.03);
// // // //           border: 1px solid var(--border-subtle);
// // // //           color: rgba(148, 163, 184, 0.4);
// // // //           padding: 3px 7px;
// // // //           border-radius: 6px;
// // // //           font-size: 0.72rem;
// // // //           cursor: not-allowed;
// // // //         }

// // // //         .custom-input {
// // // //           background: var(--panel-raised) !important;
// // // //           border: 1px solid var(--border-strong) !important;
// // // //           color: var(--text-primary) !important;
// // // //           border-radius: 10px;
// // // //         }
// // // //         .custom-input:focus {
// // // //           background: var(--panel-raised) !important;
// // // //           color: var(--text-primary) !important;
// // // //           border-color: var(--accent-cyan) !important;
// // // //           box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.18) !important;
// // // //         }

// // // //         .wow-container .text-info { color: var(--accent-cyan) !important; }
// // // //         .wow-container .text-success { color: var(--accent-emerald) !important; }
// // // //         .wow-container .text-warning { color: var(--accent-amber) !important; }

// // // //         /* --- Modal Radar : même refonte que la page Évaluations --- */
// // // //         .radar-modal-content {
// // // //           background: var(--panel-solid) !important;
// // // //           border: 1px solid var(--border-strong) !important;
// // // //           border-radius: 18px !important;
// // // //           overflow: hidden;
// // // //           box-shadow: 0 24px 60px rgba(0,0,0,0.55);
// // // //         }
// // // //         .radar-modal-header {
// // // //           position: relative;
// // // //           padding: 1.5rem 1.75rem 1.25rem 1.75rem;
// // // //           background:
// // // //             radial-gradient(600px 220px at 15% 0%, rgba(139,92,246,0.35), transparent 60%),
// // // //             radial-gradient(600px 220px at 100% 0%, rgba(34,211,238,0.25), transparent 60%),
// // // //             var(--panel-raised);
// // // //           border-bottom: 1px solid var(--border-subtle);
// // // //         }
// // // //         .radar-modal-close {
// // // //           position: absolute;
// // // //           top: 1rem;
// // // //           right: 1rem;
// // // //           width: 30px;
// // // //           height: 30px;
// // // //           border-radius: 50%;
// // // //           border: 1px solid var(--border-strong);
// // // //           background: rgba(255,255,255,0.04);
// // // //           color: var(--text-primary);
// // // //           font-size: 0.85rem;
// // // //           line-height: 1;
// // // //           cursor: pointer;
// // // //         }
// // // //         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
// // // //         .radar-modal-eyebrow {
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 1.2px;
// // // //           font-size: 0.7rem;
// // // //           font-weight: 700;
// // // //           color: var(--accent-cyan);
// // // //           margin-bottom: 0.25rem;
// // // //         }
// // // //         .radar-modal-title {
// // // //           color: var(--text-primary);
// // // //           font-weight: 700;
// // // //           margin: 0 0 1rem 0;
// // // //           font-size: 1.35rem;
// // // //         }
// // // //         .radar-modal-stats {
// // // //           display: flex;
// // // //           gap: 0.75rem;
// // // //           flex-wrap: wrap;
// // // //         }
// // // //         .radar-stat {
// // // //           display: flex;
// // // //           align-items: center;
// // // //           gap: 0.45rem;
// // // //           padding: 0.4rem 0.75rem;
// // // //           border-radius: 10px;
// // // //           background: rgba(255,255,255,0.04);
// // // //           border: 1px solid var(--border-subtle);
// // // //         }
// // // //         .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
// // // //         .radar-stat-cyan .radar-stat-dot { background: var(--tbl-teal); box-shadow: 0 0 8px var(--tbl-teal); }
// // // //         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
// // // //         .radar-stat-label { color: var(--text-muted); font-size: 0.78rem; }
// // // //         .radar-stat-value { color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
// // // //         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
// // // //         .radar-modal-body {
// // // //           padding: 1.5rem 1.75rem;
// // // //           min-height: 400px;
// // // //           display: flex;
// // // //           flex-direction: column;
// // // //           justify-content: center;
// // // //         }
// // // //         .radar-modal-footer {
// // // //           padding: 1rem 1.75rem;
// // // //           border-top: 1px solid var(--border-subtle);
// // // //           display: flex;
// // // //           justify-content: space-between;
// // // //           align-items: center;
// // // //         }
// // // //       `}</style>

// // // //       <Navbar />

// // // //       <div className="wow-container">
// // // //         {/* Titre & Barre d'actions */}
// // // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // // //           <div>
// // // //             <div className="d-flex align-items-center gap-2">
// // // //               <span style={{ fontSize: '1.6rem' }}>⚡</span>
// // // //               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
// // // //                 {isAdmin
// // // //                   ? 'Planning des Rendez-vous (Admin)'
// // // //                   : isChef
// // // //                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
// // // //                   : 'Mes Rendez-vous'}
// // // //               </h2>
// // // //             </div>
// // // //             <p className="text-muted small mt-1 mb-0">
// // // //               {(isAdmin || isChef) ? (
// // // //                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
// // // //               ) : (
// // // //                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
// // // //               )}
// // // //             </p>
// // // //           </div>

// // // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // // //             <Button
// // // //               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
// // // //               onClick={handleExportExcel}
// // // //               disabled={filteredRdv.length === 0}
// // // //             >
// // // //               <span>📊</span>
// // // //               <span>Exporter Excel ({filteredRdv.length})</span>
// // // //             </Button>
// // // //             <Button
// // // //               variant="outline-light"
// // // //               size="sm"
// // // //               onClick={refresh}
// // // //               className="d-flex align-items-center gap-2 px-3 py-2"
// // // //               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}
// // // //             >
// // // //               <span>🔄</span> Actualiser
// // // //             </Button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Panneau Admin : Générateur */}
// // // //         {isAdmin && (
// // // //           <div className="generator-box p-4 mb-4 shadow-lg">
// // // //             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // //               <span
// // // //                 className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
// // // //                 style={{ background: 'var(--accent-violet)', color: '#0b0f1d' }}
// // // //               >
// // // //                 Mode Administrateur
// // // //               </span>
// // // //               <span className="fw-semibold fs-5" style={{ color: 'var(--text-primary)' }}>Générer le planning global</span>
// // // //             </div>

// // // //             <Row className="g-3 align-items-end">
// // // //               <Col xs={12} sm={6} md={3}>
// // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
// // // //                 <Form.Control
// // // //                   type="date"
// // // //                   className="custom-input"
// // // //                   value={dateDebut}
// // // //                   onChange={(e) => setDateDebut(e.target.value)}
// // // //                 />
// // // //               </Col>
// // // //               <Col xs={12} sm={6} md={3}>
// // // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
// // // //                 <Form.Control
// // // //                   type="date"
// // // //                   className="custom-input"
// // // //                   value={dateFin}
// // // //                   onChange={(e) => setDateFin(e.target.value)}
// // // //                 />
// // // //               </Col>
// // // //               <Col xs={12} md={6}>
// // // //                 <Button
// // // //                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
// // // //                   onClick={handleGenerate}
// // // //                   disabled={generating}
// // // //                 >
// // // //                   {generating ? (
// // // //                     <>
// // // //                       <Spinner size="sm" animation="border" />
// // // //                       <span>Optimisation et placement des créneaux...</span>
// // // //                     </>
// // // //                   ) : (
// // // //                     <>
// // // //                       <span>✨</span>
// // // //                       <span>Lancer la génération des rendez-vous</span>
// // // //                     </>
// // // //                   )}
// // // //                 </Button>
// // // //               </Col>
// // // //             </Row>

// // // //             {genError && (
// // // //               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
// // // //                 <strong>Erreur : </strong> {genError}
// // // //               </Alert>
// // // //             )}
// // // //             {genResult && (
// // // //               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
// // // //                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
// // // //                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
// // // //               </Alert>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* KPI Cards */}
// // // //         <Row className="g-3 mb-4">
// // // //           <Col xs={6} md={3}>
// // // //             <div className="kpi-card text-center">
// // // //               <div className="text-muted small text-uppercase fw-bold">Total Rendez-vous</div>
// // // //               <div className="fs-2 fw-bold mt-1 text-info">{filteredRdv.length}</div>
// // // //             </div>
// // // //           </Col>
// // // //           <Col xs={6} md={3}>
// // // //             <div className="kpi-card text-center">
// // // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // // //               <div className="fs-2 fw-bold mt-1 text-success">{uniqueChefs.length}</div>
// // // //             </div>
// // // //           </Col>
// // // //           <Col xs={6} md={3}>
// // // //             <div className="kpi-card text-center">
// // // //               <div className="text-muted small text-uppercase fw-bold">Jours de Passage</div>
// // // //               <div className="fs-2 fw-bold mt-1 text-warning">{uniqueDates.length}</div>
// // // //             </div>
// // // //           </Col>
// // // //           <Col xs={6} md={3}>
// // // //             <div className="kpi-card text-center">
// // // //               <div className="text-muted small text-uppercase fw-bold">Visibilité</div>
// // // //               <div className="fs-2 fw-bold mt-1" style={{ color: 'var(--text-primary)' }}>
// // // //                 {filteredRdv.length} <span className="fs-6 text-muted">/ {visibles.length}</span>
// // // //               </div>
// // // //             </div>
// // // //           </Col>
// // // //         </Row>

// // // //         {/* Barre de Filtres */}
// // // //         <Card className="glass-card mb-4 p-3 border-0">
// // // //           <Row className="g-2 align-items-center">
// // // //             <Col xs={12} md={4}>
// // // //               <InputGroup size="sm">
// // // //                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
// // // //                 <Form.Control
// // // //                   placeholder="Rechercher étudiant, email, chef..."
// // // //                   className="custom-input border-0"
// // // //                   value={searchQuery}
// // // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // // //                 />
// // // //                 {searchQuery && (
// // // //                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
// // // //                 )}
// // // //               </InputGroup>
// // // //             </Col>

// // // //             <Col xs={12} sm={6} md={3}>
// // // //               <Form.Select
// // // //                 size="sm"
// // // //                 className="custom-input"
// // // //                 value={selectedChef}
// // // //                 onChange={(e) => setSelectedChef(e.target.value)}
// // // //               >
// // // //                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
// // // //                 {uniqueChefs.map((chef) => (
// // // //                   <option key={chef} value={chef}>{chef}</option>
// // // //                 ))}
// // // //               </Form.Select>
// // // //             </Col>

// // // //             <Col xs={12} sm={6} md={3}>
// // // //               <Form.Select
// // // //                 size="sm"
// // // //                 className="custom-input"
// // // //                 value={selectedDateFilter}
// // // //                 onChange={(e) => setSelectedDateFilter(e.target.value)}
// // // //               >
// // // //                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
// // // //                 {uniqueDates.map((d) => (
// // // //                   <option key={d} value={d}>{d}</option>
// // // //                 ))}
// // // //               </Form.Select>
// // // //             </Col>

// // // //             <Col xs={12} md={2} className="text-md-end">
// // // //               <Button
// // // //                 variant="outline-secondary"
// // // //                 size="sm"
// // // //                 className="w-100 py-1 rounded-3"
// // // //                 onClick={() => {
// // // //                   setSearchQuery('');
// // // //                   setSelectedChef('all');
// // // //                   setSelectedDateFilter('all');
// // // //                 }}
// // // //                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
// // // //               >
// // // //                 Réinitialiser
// // // //               </Button>
// // // //             </Col>
// // // //           </Row>
// // // //         </Card>

// // // //         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

// // // //         {/* Tableau des Rendez-vous */}
// // // //         {loading ? (
// // // //           <div className="text-center py-5">
// // // //             <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // // //             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
// // // //           </div>
// // // //         ) : (
// // // //           <div className="glass-card overflow-hidden">
// // // //             <div className="table-responsive">
// // // //               <Table hover size="sm" className="wow-table mb-0 align-middle text-nowrap">
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th>Date</th>
// // // //                     <th>Créneau Horaire</th>
// // // //                     <th>Chef de projet</th>
// // // //                     {(isAdmin || isChef) && <th>Étudiant (Radar & Documents)</th>}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {filteredRdv.map((r) => (
// // // //                     <tr key={r.id}>
// // // //                       <td>
// // // //                         <span className="date-pill">{r.date}</span>
// // // //                       </td>
// // // //                       <td>
// // // //                         <span className="time-pill">
// // // //                           <span>⏱</span>
// // // //                           <span>{r.heure_debut} ➔ {r.heure_fin}</span>
// // // //                         </span>
// // // //                       </td>
// // // //                       <td>
// // // //                         <div className="d-flex align-items-center gap-2">
// // // //                           <span className="avatar-icon" style={{ background: 'linear-gradient(135deg, var(--tbl-amber), var(--tbl-amber-2))', color: '#241a03' }}>
// // // //                             {r.chef_de_projet?.charAt(0) || 'C'}
// // // //                           </span>
// // // //                           <span className="chef-name">{r.chef_de_projet}</span>
// // // //                         </div>
// // // //                       </td>
// // // //                       {(isAdmin || isChef) && (
// // // //                         <td>
// // // //                           <div className="d-flex align-items-center justify-content-between gap-2">
// // // //                             <div
// // // //                               className="avatar-student-btn"
// // // //                               title="Cliquer pour afficher le Radar des compétences"
// // // //                               onClick={() => handleOpenStudentRadar(r.etudiant_id, r.etudiant, r.email_etudiant)}
// // // //                             >
// // // //                               <span className="avatar-icon">
// // // //                                 {r.etudiant?.charAt(0) || 'E'}
// // // //                               </span>
// // // //                               <div>
// // // //                                 <div className="fw-semibold text-decoration-underline" style={{ color: 'var(--tbl-teal)' }}>
// // // //                                   {r.etudiant} 📊
// // // //                                 </div>
// // // //                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // // //                                   {r.email_etudiant}
// // // //                                 </div>
// // // //                               </div>
// // // //                             </div>

// // // //                             {/* Boutons Documents CV / LM */}
// // // //                             <div className="d-flex gap-1 me-2">
// // // //                               {r.cv_path ? (
// // // //                                 <a
// // // //                                   href={getDocumentPublicUrl(r.cv_path)}
// // // //                                   target="_blank"
// // // //                                   rel="noopener noreferrer"
// // // //                                   className="doc-badge-btn"
// // // //                                   title="Ouvrir le CV (PDF)"
// // // //                                   onClick={(e) => e.stopPropagation()}
// // // //                                 >
// // // //                                   📄 CV
// // // //                                 </a>
// // // //                               ) : (
// // // //                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
// // // //                                   📄 CV
// // // //                                 </span>
// // // //                               )}

// // // //                               {r.lm_path ? (
// // // //                                 <a
// // // //                                   href={getDocumentPublicUrl(r.lm_path)}
// // // //                                   target="_blank"
// // // //                                   rel="noopener noreferrer"
// // // //                                   className="doc-badge-btn"
// // // //                                   title="Ouvrir la Lettre de Motivation (PDF)"
// // // //                                   onClick={(e) => e.stopPropagation()}
// // // //                                 >
// // // //                                   ✉️ LM
// // // //                                 </a>
// // // //                               ) : (
// // // //                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
// // // //                                   ✉️ LM
// // // //                                 </span>
// // // //                               )}
// // // //                             </div>
// // // //                           </div>
// // // //                         </td>
// // // //                       )}
// // // //                     </tr>
// // // //                   ))}

// // // //                   {filteredRdv.length === 0 && (
// // // //                     <tr>
// // // //                       <td colSpan={(isAdmin || isChef) ? 4 : 3} className="text-center py-5">
// // // //                         <div style={{ fontSize: '2.5rem' }}>✨</div>
// // // //                         <div className="mt-3 fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>Aucun rendez-vous trouvé</div>
// // // //                       </td>
// // // //                     </tr>
// // // //                   )}
// // // //                 </tbody>
// // // //               </Table>
// // // //             </div>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Modal Radar — profil de compétences (même refonte que la page Évaluations) */}
// // // //       <Modal
// // // //         show={modalOpen}
// // // //         onHide={() => setModalOpen(false)}
// // // //         size="lg"
// // // //         centered
// // // //         contentClassName="radar-modal-content"
// // // //       >
// // // //         <div className="radar-modal-header">
// // // //           <button
// // // //             type="button"
// // // //             className="radar-modal-close"
// // // //             onClick={() => setModalOpen(false)}
// // // //             aria-label="Fermer"
// // // //           >
// // // //             ✕
// // // //           </button>
// // // //           <div className="radar-modal-eyebrow">Profil de compétences</div>
// // // //           <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
// // // //           {!modalLoading && !modalError && (
// // // //             <div className="radar-modal-stats">
// // // //               <div className="radar-stat radar-stat-cyan">
// // // //                 <span className="radar-stat-dot" />
// // // //                 <span className="radar-stat-label">Aptitudes</span>
// // // //                 <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
// // // //               </div>
// // // //               <div className="radar-stat radar-stat-rose">
// // // //                 <span className="radar-stat-dot" />
// // // //                 <span className="radar-stat-label">Appétences</span>
// // // //                 <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         <div className="radar-modal-body">
// // // //           {modalLoading ? (
// // // //             <div className="text-center py-5">
// // // //               <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // // //               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
// // // //             </div>
// // // //           ) : modalError ? (
// // // //             <Alert variant="warning" className="text-center m-3 mb-0">
// // // //               {modalError}
// // // //             </Alert>
// // // //           ) : (
// // // //             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
// // // //               <Radar data={radarChartData} options={radarOptions} />
// // // //             </div>
// // // //           )}
// // // //         </div>

// // // //         <div className="radar-modal-footer">
// // // //           <small className="text-muted font-monospace">
// // // //             {selectedEtudiantInfo?.email}
// // // //           </small>
// // // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>
// // // //             Fermer
// // // //           </Button>
// // // //         </div>
// // // //       </Modal>
// // // //     </>
// // // //   );
// // // // }


// // // import React, { useState, useMemo } from 'react';
// // // import {
// // //   Table,
// // //   Button,
// // //   Alert,
// // //   Spinner,
// // //   Form,
// // //   Card,
// // //   Row,
// // //   Col,
// // //   InputGroup,
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
// // // import { useAuth } from '../context/AuthContext';
// // // import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// // // import {
// // //   genererRendezVous,
// // //   resetAllRendezVous,
// // //   fetchAptitudesByEtudiant,
// // //   fetchApetencesByEtudiant,
// // //   getDocumentPublicUrl,
// // // } from '../services/supabase';

// // // // Enregistrement des composants Chart.js pour le Radar
// // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

// // // export default function RendezVousPage() {
// // //   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
// // //   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

// // //   // Logique de génération (Admin)
// // //   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
// // //   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
// // //   const [generating, setGenerating] = useState(false);
// // //   const [genError, setGenError] = useState(null);
// // //   const [genResult, setGenResult] = useState(null);

// // //   // État Réinitialisation (Reset planning)
// // //   const [showResetModal, setShowResetModal] = useState(false);
// // //   const [resetRangeOnly, setResetRangeOnly] = useState(false);
// // //   const [resetting, setResetting] = useState(false);

// // //   // Filtres en temps réel
// // //   const [searchQuery, setSearchQuery] = useState('');
// // //   const [selectedChef, setSelectedChef] = useState('all');
// // //   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

// // //   // État du Modal Radar Étudiant
// // //   const [modalOpen, setModalOpen] = useState(false);
// // //   const [modalLoading, setModalLoading] = useState(false);
// // //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// // //   const [aptitudesData, setAptitudesData] = useState(null);
// // //   const [apetencesData, setApetencesData] = useState(null);
// // //   const [modalError, setModalError] = useState(null);

// // //   // Filtrage selon le profil connecté :
// // //   const visibles = useMemo(() => {
// // //     if (isAdmin) {
// // //       return rendezVous;
// // //     }
// // //     if (isChef) {
// // //       return rendezVous.filter(
// // //         (r) =>
// // //           r.chef_de_projet_id === chefId ||
// // //           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
// // //       );
// // //     }
// // //     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
// // //   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

// // //   const uniqueChefs = useMemo(() => {
// // //     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
// // //     return Array.from(chefs).sort();
// // //   }, [visibles]);

// // //   const uniqueDates = useMemo(() => {
// // //     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
// // //     return Array.from(dates).sort();
// // //   }, [visibles]);

// // //   const filteredRdv = useMemo(() => {
// // //     return visibles.filter((r) => {
// // //       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
// // //       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
// // //       if (searchQuery.trim()) {
// // //         const query = searchQuery.toLowerCase().trim();
// // //         const matchEtud = r.etudiant?.toLowerCase().includes(query);
// // //         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
// // //         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
// // //         if (!matchEtud && !matchEmail && !matchChef) return false;
// // //       }
// // //       return true;
// // //     });
// // //   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

// // //   // Ouverture du Popup Radar
// // //   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
// // //     if (!etudiant_id) return;
// // //     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
// // //     setModalOpen(true);
// // //     setModalLoading(true);
// // //     setModalError(null);
// // //     setAptitudesData(null);
// // //     setApetencesData(null);

// // //     try {
// // //       const [aptitudes, apetences] = await Promise.all([
// // //         fetchAptitudesByEtudiant(etudiant_id),
// // //         fetchApetencesByEtudiant(etudiant_id),
// // //       ]);

// // //       if (!aptitudes && !apetences) {
// // //         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
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

// // //   // Données du graphique Radar
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
// // //           backgroundColor: 'rgba(45, 212, 191, 0.22)',
// // //           borderColor: '#2dd4bf',
// // //           borderWidth: 2.5,
// // //           pointBackgroundColor: '#2dd4bf',
// // //           pointBorderColor: '#0b1020',
// // //           pointBorderWidth: 1.5,
// // //           pointRadius: 4,
// // //           pointHoverRadius: 6,
// // //         },
// // //         {
// // //           label: 'Appétences (Intérêt)',
// // //           data: apeValues,
// // //           backgroundColor: 'rgba(244, 63, 94, 0.18)',
// // //           borderColor: '#f43f5e',
// // //           borderWidth: 2.5,
// // //           pointBackgroundColor: '#f43f5e',
// // //           pointBorderColor: '#0b1020',
// // //           pointBorderWidth: 1.5,
// // //           pointRadius: 4,
// // //           pointHoverRadius: 6,
// // //         },
// // //       ],
// // //     };
// // //   }, [aptitudesData, apetencesData]);

// // //   const radarAverages = useMemo(() => {
// // //     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
// // //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// // //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
// // //     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
// // //   }, [aptitudesData, apetencesData]);

// // //   const radarOptions = {
// // //     responsive: true,
// // //     maintainAspectRatio: false,
// // //     scales: {
// // //       r: {
// // //         min: 0,
// // //         suggestedMax: 4,
// // //         ticks: {
// // //           stepSize: 1,
// // //           backdropColor: 'transparent',
// // //           color: '#8892ab',
// // //           font: { size: 10 },
// // //         },
// // //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// // //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// // //         pointLabels: { color: '#eef1f8', font: { size: 11, weight: '600' } },
// // //       },
// // //     },
// // //     plugins: {
// // //       legend: { display: false },
// // //       tooltip: {
// // //         backgroundColor: '#161c30',
// // //         borderColor: 'rgba(148, 163, 184, 0.25)',
// // //         borderWidth: 1,
// // //         titleColor: '#f5f7fc',
// // //         bodyColor: '#c9d0e0',
// // //         padding: 10,
// // //         cornerRadius: 8,
// // //         displayColors: true,
// // //       },
// // //     },
// // //   };

// // //   // Export Excel
// // //   const handleExportExcel = () => {
// // //     if (filteredRdv.length === 0) {
// // //       alert('Aucun rendez-vous à exporter.');
// // //       return;
// // //     }

// // //     const exportRows = filteredRdv.map((r) => ({
// // //       'Date': r.date,
// // //       'Heure de Début': r.heure_debut,
// // //       'Heure de Fin': r.heure_fin,
// // //       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
// // //       'Chef de Projet': r.chef_de_projet || '',
// // //       'Étudiant': r.etudiant || '',
// // //       'Email Étudiant': r.email_etudiant || '',
// // //     }));

// // //     const worksheet = XLSX.utils.json_to_sheet(exportRows);
// // //     worksheet['!cols'] = [
// // //       { wch: 14 },
// // //       { wch: 14 },
// // //       { wch: 14 },
// // //       { wch: 18 },
// // //       { wch: 28 },
// // //       { wch: 28 },
// // //       { wch: 35 },
// // //     ];

// // //     const workbook = XLSX.utils.book_new();
// // //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
// // //     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
// // //   };

// // //   // Génération du planning (Admin)
// // //   const handleGenerate = async () => {
// // //     const confirmation = window.confirm(
// // //       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
// // //     );
// // //     if (!confirmation) return;

// // //     setGenerating(true);
// // //     setGenError(null);
// // //     setGenResult(null);
// // //     try {
// // //       const token = await getIdToken();
// // //       const result = await genererRendezVous(dateDebut, dateFin, token);
// // //       setGenResult(result.stats);
// // //       await refresh();
// // //     } catch (err) {
// // //       setGenError(err.message);
// // //     } finally {
// // //       setGenerating(false);
// // //     }
// // //   };

// // //   // Action de Réinitialisation / Purge du planning
// // //   const handleResetSchedule = async () => {
// // //     try {
// // //       setResetting(true);
// // //       setGenError(null);
// // //       if (resetRangeOnly) {
// // //         await resetAllRendezVous(dateDebut, dateFin);
// // //       } else {
// // //         await resetAllRendezVous();
// // //       }
// // //       await refresh();
// // //       setShowResetModal(false);
// // //     } catch (err) {
// // //       setGenError(err.message || 'Erreur lors de la réinitialisation du planning.');
// // //     } finally {
// // //       setResetting(false);
// // //     }
// // //   };

// // //   return (
// // //     <>
// // //       <style>{`
// // //         :root {
// // //           --canvas: #0b0f1d;
// // //           --panel: rgba(22, 28, 48, 0.86);
// // //           --panel-solid: #161c30;
// // //           --panel-raised: #1c2440;
// // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // //           --border-strong: rgba(148, 163, 184, 0.28);
// // //           --text-primary: #f5f7fc;
// // //           --text-muted: #8f9bb5;

// // //           --accent-violet: #8b5cf6;
// // //           --accent-cyan: #22d3ee;
// // //           --accent-rose: #f43f5e;
// // //           --accent-amber: #f59e0b;
// // //           --accent-emerald: #10b981;

// // //           --tbl-indigo: #6366f1;
// // //           --tbl-indigo-soft: rgba(99, 102, 241, 0.14);
// // //           --tbl-teal: #2dd4bf;
// // //           --tbl-teal-soft: rgba(45, 212, 191, 0.14);
// // //           --tbl-amber: #f59e0b;
// // //           --tbl-amber-2: #fb923c;
// // //           --tbl-amber-text: #fbbf24;
// // //           --tbl-slate-text: #a7b2c9;
// // //         }

// // //         .wow-container {
// // //           max-width: 100%;
// // //           margin: 0 auto;
// // //           padding: 1.5rem 1rem 2.5rem 1rem;
// // //           color: var(--text-primary);
// // //           background:
// // //             radial-gradient(1200px 520px at 8% -10%, rgba(139,92,246,0.12), transparent 60%),
// // //             radial-gradient(1000px 520px at 100% 0%, rgba(34,211,238,0.10), transparent 55%),
// // //             var(--canvas);
// // //         }

// // //         .glass-card {
// // //           background: var(--panel);
// // //           backdrop-filter: blur(16px);
// // //           -webkit-backdrop-filter: blur(16px);
// // //           border: 1px solid var(--border-subtle);
// // //           border-radius: 16px;
// // //           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
// // //         }

// // //         .kpi-card {
// // //           padding: 1.15rem;
// // //           border-radius: 16px;
// // //           background: var(--panel-raised);
// // //           border: 1px solid var(--border-subtle);
// // //           transition: transform 0.2s ease, border-color 0.2s ease;
// // //         }
// // //         .kpi-card:hover {
// // //           transform: translateY(-3px);
// // //           border-color: var(--accent-violet);
// // //         }

// // //         .generator-box {
// // //           background:
// // //             radial-gradient(500px 200px at 0% 0%, rgba(139,92,246,0.20), transparent 60%),
// // //             radial-gradient(500px 200px at 100% 100%, rgba(34,211,238,0.14), transparent 60%),
// // //             var(--panel-raised);
// // //           border: 1px solid var(--border-strong);
// // //           border-radius: 18px;
// // //         }

// // //         .btn-glow {
// // //           background: linear-gradient(135deg, var(--accent-violet) 0%, #a78bfa 50%, var(--accent-cyan) 100%);
// // //           border: none;
// // //           color: #0b0f1d;
// // //           font-weight: 700;
// // //           border-radius: 12px;
// // //           box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
// // //         }

// // //         .btn-excel {
// // //           background: linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%);
// // //           border: none;
// // //           color: #05231a;
// // //           font-weight: 700;
// // //           border-radius: 10px;
// // //         }

// // //         .btn-danger-pill {
// // //           background: rgba(239, 68, 68, 0.14) !important;
// // //           color: #f87171 !important;
// // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // //           border-radius: 10px !important;
// // //           font-weight: 700 !important;
// // //         }
// // //         .btn-danger-pill:hover:not(:disabled) {
// // //           background: #dc2626 !important;
// // //           color: #ffffff !important;
// // //           border-color: #dc2626 !important;
// // //         }
// // //         .btn-danger-pill:disabled { opacity: 0.4; }

// // //         .wow-table {
// // //           background: transparent !important;
// // //           color: var(--text-primary) !important;
// // //         }
// // //         .wow-table thead th {
// // //           background: var(--panel-solid) !important;
// // //           color: var(--tbl-slate-text);
// // //           font-size: 0.75rem;
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.08em;
// // //           padding: 0.85rem 1rem;
// // //           border-bottom: 2px solid var(--tbl-teal-soft) !important;
// // //         }
// // //         .wow-table tbody tr {
// // //           border-bottom: 1px solid var(--border-subtle);
// // //         }
// // //         .wow-table tbody tr:hover {
// // //           background-color: var(--tbl-indigo-soft) !important;
// // //         }

// // //         .time-pill {
// // //           background: linear-gradient(135deg, var(--tbl-teal-soft), var(--tbl-indigo-soft));
// // //           border: 1px solid rgba(45, 212, 191, 0.4);
// // //           color: var(--tbl-teal);
// // //           padding: 6px 14px;
// // //           border-radius: 20px;
// // //           font-weight: 600;
// // //           font-family: monospace;
// // //           font-size: 0.85rem;
// // //         }

// // //         .date-pill {
// // //           background: rgba(148, 163, 184, 0.07);
// // //           border: 1px solid rgba(148, 163, 184, 0.28);
// // //           color: #dfe6f5;
// // //           padding: 5px 12px;
// // //           border-radius: 8px;
// // //           font-family: monospace;
// // //         }

// // //         .chef-name {
// // //           color: var(--tbl-amber-text);
// // //           font-weight: 600;
// // //         }

// // //         .avatar-student-btn {
// // //           cursor: pointer;
// // //           transition: background 0.15s ease;
// // //           display: inline-flex;
// // //           align-items: center;
// // //           gap: 10px;
// // //           padding: 4px 6px;
// // //           border-radius: 8px;
// // //         }
// // //         .avatar-student-btn:hover {
// // //           background: var(--tbl-indigo-soft);
// // //         }

// // //         .avatar-icon {
// // //           width: 32px;
// // //           height: 32px;
// // //           border-radius: 8px;
// // //           background: linear-gradient(135deg, var(--tbl-indigo), #a78bfa);
// // //           display: inline-flex;
// // //           align-items: center;
// // //           justify-content: center;
// // //           font-weight: bold;
// // //           font-size: 0.8rem;
// // //           color: #ffffff;
// // //         }

// // //         .doc-badge-btn {
// // //           background: var(--tbl-teal-soft);
// // //           border: 1px solid rgba(45, 212, 191, 0.4);
// // //           color: var(--tbl-teal);
// // //           padding: 3px 7px;
// // //           border-radius: 6px;
// // //           font-size: 0.72rem;
// // //           font-weight: 600;
// // //           text-decoration: none;
// // //           display: inline-flex;
// // //           align-items: center;
// // //           gap: 3px;
// // //           transition: background 0.15s ease, color 0.15s ease;
// // //         }
// // //         .doc-badge-btn:hover {
// // //           background: var(--tbl-teal);
// // //           color: #062a24;
// // //         }
// // //         .doc-badge-disabled {
// // //           background: rgba(255, 255, 255, 0.03);
// // //           border: 1px solid var(--border-subtle);
// // //           color: rgba(148, 163, 184, 0.4);
// // //           padding: 3px 7px;
// // //           border-radius: 6px;
// // //           font-size: 0.72rem;
// // //           cursor: not-allowed;
// // //         }

// // //         .custom-input {
// // //           background: var(--panel-raised) !important;
// // //           border: 1px solid var(--border-strong) !important;
// // //           color: var(--text-primary) !important;
// // //           border-radius: 10px;
// // //         }
// // //         .custom-input:focus {
// // //           background: var(--panel-raised) !important;
// // //           color: var(--text-primary) !important;
// // //           border-color: var(--accent-cyan) !important;
// // //           box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.18) !important;
// // //         }

// // //         .radar-modal-content {
// // //           background: var(--panel-solid) !important;
// // //           border: 1px solid var(--border-strong) !important;
// // //           border-radius: 18px !important;
// // //           overflow: hidden;
// // //           box-shadow: 0 24px 60px rgba(0,0,0,0.55);
// // //         }
// // //         .radar-modal-header {
// // //           position: relative;
// // //           padding: 1.5rem 1.75rem 1.25rem 1.75rem;
// // //           background:
// // //             radial-gradient(600px 220px at 15% 0%, rgba(139,92,246,0.35), transparent 60%),
// // //             radial-gradient(600px 220px at 100% 0%, rgba(34,211,238,0.25), transparent 60%),
// // //             var(--panel-raised);
// // //           border-bottom: 1px solid var(--border-subtle);
// // //         }
// // //         .radar-modal-close {
// // //           position: absolute;
// // //           top: 1rem;
// // //           right: 1rem;
// // //           width: 30px;
// // //           height: 30px;
// // //           border-radius: 50%;
// // //           border: 1px solid var(--border-strong);
// // //           background: rgba(255,255,255,0.04);
// // //           color: var(--text-primary);
// // //           font-size: 0.85rem;
// // //           line-height: 1;
// // //           cursor: pointer;
// // //         }
// // //         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
// // //         .radar-modal-eyebrow {
// // //           text-transform: uppercase;
// // //           letter-spacing: 1.2px;
// // //           font-size: 0.7rem;
// // //           font-weight: 700;
// // //           color: var(--accent-cyan);
// // //           margin-bottom: 0.25rem;
// // //         }
// // //         .radar-modal-title {
// // //           color: var(--text-primary);
// // //           font-weight: 700;
// // //           margin: 0 0 1rem 0;
// // //           font-size: 1.35rem;
// // //         }
// // //         .radar-modal-stats {
// // //           display: flex;
// // //           gap: 0.75rem;
// // //           flex-wrap: wrap;
// // //         }
// // //         .radar-stat {
// // //           display: flex;
// // //           align-items: center;
// // //           gap: 0.45rem;
// // //           padding: 0.4rem 0.75rem;
// // //           border-radius: 10px;
// // //           background: rgba(255,255,255,0.04);
// // //           border: 1px solid var(--border-subtle);
// // //         }
// // //         .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
// // //         .radar-stat-cyan .radar-stat-dot { background: var(--tbl-teal); box-shadow: 0 0 8px var(--tbl-teal); }
// // //         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
// // //         .radar-stat-label { color: var(--text-muted); font-size: 0.78rem; }
// // //         .radar-stat-value { color: var(--text-primary); font-weight: 700; font-size: 0.95rem; }
// // //         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
// // //         .radar-modal-body {
// // //           padding: 1.5rem 1.75rem;
// // //           min-height: 400px;
// // //           display: flex;
// // //           flex-direction: column;
// // //           justify-content: center;
// // //         }
// // //         .radar-modal-footer {
// // //           padding: 1rem 1.75rem;
// // //           border-top: 1px solid var(--border-subtle);
// // //           display: flex;
// // //           justify-content: space-between;
// // //           align-items: center;
// // //         }
// // //       `}</style>

// // //       <Navbar />

// // //       <div className="wow-container">
// // //         {/* Titre & Barre d'actions */}
// // //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// // //           <div>
// // //             <div className="d-flex align-items-center gap-2">
// // //               <span style={{ fontSize: '1.6rem' }}>⚡</span>
// // //               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
// // //                 {isAdmin
// // //                   ? 'Planning des Rendez-vous (Admin)'
// // //                   : isChef
// // //                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
// // //                   : 'Mes Rendez-vous'}
// // //               </h2>
// // //             </div>
// // //             <p className="text-muted small mt-1 mb-0">
// // //               {(isAdmin || isChef) ? (
// // //                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
// // //               ) : (
// // //                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
// // //               )}
// // //             </p>
// // //           </div>

// // //           <div className="d-flex align-items-center gap-2 flex-wrap">
// // //             {/* Bouton Vider le planning (Admin uniquement) */}
// // //             {isAdmin && (
// // //               <Button
// // //                 className="btn-danger-pill d-flex align-items-center gap-2 px-3 py-2"
// // //                 onClick={() => setShowResetModal(true)}
// // //                 disabled={visibles.length === 0 || resetting}
// // //                 title="Supprimer les rendez-vous générés"
// // //               >
// // //                 <span>🗑️</span>
// // //                 <span>Vider planning ({visibles.length})</span>
// // //               </Button>
// // //             )}

// // //             <Button
// // //               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
// // //               onClick={handleExportExcel}
// // //               disabled={filteredRdv.length === 0}
// // //             >
// // //               <span>📊</span>
// // //               <span>Exporter Excel ({filteredRdv.length})</span>
// // //             </Button>
// // //             <Button
// // //               variant="outline-light"
// // //               size="sm"
// // //               onClick={refresh}
// // //               className="d-flex align-items-center gap-2 px-3 py-2"
// // //               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}
// // //             >
// // //               <span>🔄</span> Actualiser
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         {/* Panneau Admin : Générateur */}
// // //         {isAdmin && (
// // //           <div className="generator-box p-4 mb-4 shadow-lg">
// // //             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // //               <span
// // //                 className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
// // //                 style={{ background: 'var(--accent-violet)', color: '#0b0f1d' }}
// // //               >
// // //                 Mode Administrateur
// // //               </span>
// // //               <span className="fw-semibold fs-5" style={{ color: 'var(--text-primary)' }}>Générer le planning global</span>
// // //             </div>

// // //             <Row className="g-3 align-items-end">
// // //               <Col xs={12} sm={6} md={3}>
// // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
// // //                 <Form.Control
// // //                   type="date"
// // //                   className="custom-input"
// // //                   value={dateDebut}
// // //                   onChange={(e) => setDateDebut(e.target.value)}
// // //                 />
// // //               </Col>
// // //               <Col xs={12} sm={6} md={3}>
// // //                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
// // //                 <Form.Control
// // //                   type="date"
// // //                   className="custom-input"
// // //                   value={dateFin}
// // //                   onChange={(e) => setDateFin(e.target.value)}
// // //                 />
// // //               </Col>
// // //               <Col xs={12} md={6}>
// // //                 <Button
// // //                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
// // //                   onClick={handleGenerate}
// // //                   disabled={generating}
// // //                 >
// // //                   {generating ? (
// // //                     <>
// // //                       <Spinner size="sm" animation="border" />
// // //                       <span>Optimisation et placement des créneaux...</span>
// // //                     </>
// // //                   ) : (
// // //                     <>
// // //                       <span>✨</span>
// // //                       <span>Lancer la génération des rendez-vous</span>
// // //                     </>
// // //                   )}
// // //                 </Button>
// // //               </Col>
// // //             </Row>

// // //             {genError && (
// // //               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
// // //                 <strong>Erreur : </strong> {genError}
// // //               </Alert>
// // //             )}
// // //             {genResult && (
// // //               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
// // //                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
// // //                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
// // //               </Alert>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* KPI Cards */}
// // //         <Row className="g-3 mb-4">
// // //           <Col xs={6} md={3}>
// // //             <div className="kpi-card text-center">
// // //               <div className="text-muted small text-uppercase fw-bold">Total Rendez-vous</div>
// // //               <div className="fs-2 fw-bold mt-1 text-info">{filteredRdv.length}</div>
// // //             </div>
// // //           </Col>
// // //           <Col xs={6} md={3}>
// // //             <div className="kpi-card text-center">
// // //               <div className="text-muted small text-uppercase fw-bold">Chefs de Projet</div>
// // //               <div className="fs-2 fw-bold mt-1 text-success">{uniqueChefs.length}</div>
// // //             </div>
// // //           </Col>
// // //           <Col xs={6} md={3}>
// // //             <div className="kpi-card text-center">
// // //               <div className="text-muted small text-uppercase fw-bold">Jours de Passage</div>
// // //               <div className="fs-2 fw-bold mt-1 text-warning">{uniqueDates.length}</div>
// // //             </div>
// // //           </Col>
// // //           <Col xs={6} md={3}>
// // //             <div className="kpi-card text-center">
// // //               <div className="text-muted small text-uppercase fw-bold">Visibilité</div>
// // //               <div className="fs-2 fw-bold mt-1" style={{ color: 'var(--text-primary)' }}>
// // //                 {filteredRdv.length} <span className="fs-6 text-muted">/ {visibles.length}</span>
// // //               </div>
// // //             </div>
// // //           </Col>
// // //         </Row>

// // //         {/* Barre de Filtres */}
// // //         <Card className="glass-card mb-4 p-3 border-0">
// // //           <Row className="g-2 align-items-center">
// // //             <Col xs={12} md={4}>
// // //               <InputGroup size="sm">
// // //                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
// // //                 <Form.Control
// // //                   placeholder="Rechercher étudiant, email, chef..."
// // //                   className="custom-input border-0"
// // //                   value={searchQuery}
// // //                   onChange={(e) => setSearchQuery(e.target.value)}
// // //                 />
// // //                 {searchQuery && (
// // //                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
// // //                 )}
// // //               </InputGroup>
// // //             </Col>

// // //             <Col xs={12} sm={6} md={3}>
// // //               <Form.Select
// // //                 size="sm"
// // //                 className="custom-input"
// // //                 value={selectedChef}
// // //                 onChange={(e) => setSelectedChef(e.target.value)}
// // //               >
// // //                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
// // //                 {uniqueChefs.map((chef) => (
// // //                   <option key={chef} value={chef}>{chef}</option>
// // //                 ))}
// // //               </Form.Select>
// // //             </Col>

// // //             <Col xs={12} sm={6} md={3}>
// // //               <Form.Select
// // //                 size="sm"
// // //                 className="custom-input"
// // //                 value={selectedDateFilter}
// // //                 onChange={(e) => setSelectedDateFilter(e.target.value)}
// // //               >
// // //                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
// // //                 {uniqueDates.map((d) => (
// // //                   <option key={d} value={d}>{d}</option>
// // //                 ))}
// // //               </Form.Select>
// // //             </Col>

// // //             <Col xs={12} md={2} className="text-md-end">
// // //               <Button
// // //                 variant="outline-secondary"
// // //                 size="sm"
// // //                 className="w-100 py-1 rounded-3"
// // //                 onClick={() => {
// // //                   setSearchQuery('');
// // //                   setSelectedChef('all');
// // //                   setSelectedDateFilter('all');
// // //                 }}
// // //                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
// // //               >
// // //                 Réinitialiser
// // //               </Button>
// // //             </Col>
// // //           </Row>
// // //         </Card>

// // //         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

// // //         {/* Tableau des Rendez-vous */}
// // //         {loading ? (
// // //           <div className="text-center py-5">
// // //             <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // //             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
// // //           </div>
// // //         ) : (
// // //           <div className="glass-card overflow-hidden">
// // //             <div className="table-responsive">
// // //               <Table hover size="sm" className="wow-table mb-0 align-middle text-nowrap">
// // //                 <thead>
// // //                   <tr>
// // //                     <th>Date</th>
// // //                     <th>Créneau Horaire</th>
// // //                     <th>Chef de projet</th>
// // //                     {(isAdmin || isChef) && <th>Étudiant (Radar & Documents)</th>}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {filteredRdv.map((r) => (
// // //                     <tr key={r.id}>
// // //                       <td>
// // //                         <span className="date-pill">{r.date}</span>
// // //                       </td>
// // //                       <td>
// // //                         <span className="time-pill">
// // //                           <span>⏱</span>
// // //                           <span>{r.heure_debut} ➔ {r.heure_fin}</span>
// // //                         </span>
// // //                       </td>
// // //                       <td>
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <span className="avatar-icon" style={{ background: 'linear-gradient(135deg, var(--tbl-amber), var(--tbl-amber-2))', color: '#241a03' }}>
// // //                             {r.chef_de_projet?.charAt(0) || 'C'}
// // //                           </span>
// // //                           <span className="chef-name">{r.chef_de_projet}</span>
// // //                         </div>
// // //                       </td>
// // //                       {(isAdmin || isChef) && (
// // //                         <td>
// // //                           <div className="d-flex align-items-center justify-content-between gap-2">
// // //                             <div
// // //                               className="avatar-student-btn"
// // //                               title="Cliquer pour afficher le Radar des compétences"
// // //                               onClick={() => handleOpenStudentRadar(r.etudiant_id, r.etudiant, r.email_etudiant)}
// // //                             >
// // //                               <span className="avatar-icon">
// // //                                 {r.etudiant?.charAt(0) || 'E'}
// // //                               </span>
// // //                               <div>
// // //                                 <div className="fw-semibold text-decoration-underline" style={{ color: 'var(--tbl-teal)' }}>
// // //                                   {r.etudiant} 📊
// // //                                 </div>
// // //                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
// // //                                   {r.email_etudiant}
// // //                                 </div>
// // //                               </div>
// // //                             </div>

// // //                             {/* Boutons Documents CV / LM */}
// // //                             <div className="d-flex gap-1 me-2">
// // //                               {r.cv_path ? (
// // //                                 <a
// // //                                   href={getDocumentPublicUrl(r.cv_path)}
// // //                                   target="_blank"
// // //                                   rel="noopener noreferrer"
// // //                                   className="doc-badge-btn"
// // //                                   title="Ouvrir le CV (PDF)"
// // //                                   onClick={(e) => e.stopPropagation()}
// // //                                 >
// // //                                   📄 CV
// // //                                 </a>
// // //                               ) : (
// // //                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
// // //                                   📄 CV
// // //                                 </span>
// // //                               )}

// // //                               {r.lm_path ? (
// // //                                 <a
// // //                                   href={getDocumentPublicUrl(r.lm_path)}
// // //                                   target="_blank"
// // //                                   rel="noopener noreferrer"
// // //                                   className="doc-badge-btn"
// // //                                   title="Ouvrir la Lettre de Motivation (PDF)"
// // //                                   onClick={(e) => e.stopPropagation()}
// // //                                 >
// // //                                   ✉️ LM
// // //                                 </a>
// // //                               ) : (
// // //                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
// // //                                   ✉️ LM
// // //                                 </span>
// // //                               )}
// // //                             </div>
// // //                           </div>
// // //                         </td>
// // //                       )}
// // //                     </tr>
// // //                   ))}

// // //                   {filteredRdv.length === 0 && (
// // //                     <tr>
// // //                       <td colSpan={(isAdmin || isChef) ? 4 : 3} className="text-center py-5">
// // //                         <div style={{ fontSize: '2.5rem' }}>✨</div>
// // //                         <div className="mt-3 fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>Aucun rendez-vous trouvé</div>
// // //                       </td>
// // //                     </tr>
// // //                   )}
// // //                 </tbody>
// // //               </Table>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Modal Confirmation Réinitialisation Planning */}
// // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered contentClassName="radar-modal-content">
// // //         <div className="radar-modal-header" style={{ background: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // //           <button type="button" className="radar-modal-close" onClick={() => setShowResetModal(false)}>✕</button>
// // //           <div className="radar-modal-eyebrow" style={{ color: '#f87171' }}>Zone d'administration</div>
// // //           <h4 className="radar-modal-title" style={{ color: '#ffffff', margin: 0 }}>🗑️ Vider le planning des rendez-vous</h4>
// // //         </div>
// // //         <div className="radar-modal-body" style={{ minHeight: 'auto', padding: '1.5rem' }}>
// // //           <p className="text-light">
// // //             Voulez-vous supprimer les créneaux de rendez-vous générés dans la base de données ?
// // //           </p>

// // //           <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
// // //             <Form.Check
// // //               type="radio"
// // //               id="reset-all"
// // //               name="reset-choice"
// // //               label="Supprimer TOUS les rendez-vous de la base"
// // //               checked={!resetRangeOnly}
// // //               onChange={() => setResetRangeOnly(false)}
// // //               className="mb-2 text-white"
// // //             />
// // //             <Form.Check
// // //               type="radio"
// // //               id="reset-range"
// // //               name="reset-choice"
// // //               label={`Supprimer uniquement la période sélectionnée (du ${dateDebut} au ${dateFin})`}
// // //               checked={resetRangeOnly}
// // //               onChange={() => setResetRangeOnly(true)}
// // //               className="text-white"
// // //             />
// // //           </div>

// // //           <p className="text-muted small mb-0">
// // //             ⚠️ Cette action est irréversible. Les disponibilités et sélections resteront intactes.
// // //           </p>
// // //         </div>
// // //         <div className="radar-modal-footer">
// // //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // //             Annuler
// // //           </Button>
// // //           <Button className="btn-danger-pill" onClick={handleResetSchedule} disabled={resetting}>
// // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la suppression'}
// // //           </Button>
// // //         </div>
// // //       </Modal>

// // //       {/* Modal Radar — profil de compétences */}
// // //       <Modal
// // //         show={modalOpen}
// // //         onHide={() => setModalOpen(false)}
// // //         size="lg"
// // //         centered
// // //         contentClassName="radar-modal-content"
// // //       >
// // //         <div className="radar-modal-header">
// // //           <button
// // //             type="button"
// // //             className="radar-modal-close"
// // //             onClick={() => setModalOpen(false)}
// // //             aria-label="Fermer"
// // //           >
// // //             ✕
// // //           </button>
// // //           <div className="radar-modal-eyebrow">Profil de compétences</div>
// // //           <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
// // //           {!modalLoading && !modalError && (
// // //             <div className="radar-modal-stats">
// // //               <div className="radar-stat radar-stat-cyan">
// // //                 <span className="radar-stat-dot" />
// // //                 <span className="radar-stat-label">Aptitudes</span>
// // //                 <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
// // //               </div>
// // //               <div className="radar-stat radar-stat-rose">
// // //                 <span className="radar-stat-dot" />
// // //                 <span className="radar-stat-label">Appétences</span>
// // //                 <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         <div className="radar-modal-body">
// // //           {modalLoading ? (
// // //             <div className="text-center py-5">
// // //               <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// // //               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
// // //             </div>
// // //           ) : modalError ? (
// // //             <Alert variant="warning" className="text-center m-3 mb-0">
// // //               {modalError}
// // //             </Alert>
// // //           ) : (
// // //             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
// // //               <Radar data={radarChartData} options={radarOptions} />
// // //             </div>
// // //           )}
// // //         </div>

// // //         <div className="radar-modal-footer">
// // //           <small className="text-muted font-monospace">
// // //             {selectedEtudiantInfo?.email}
// // //           </small>
// // //           <Button variant="secondary" onClick={() => setModalOpen(false)}>
// // //             Fermer
// // //           </Button>
// // //         </div>
// // //       </Modal>
// // //     </>
// // //   );
// // // }

// // import React, { useState, useMemo } from 'react';
// // import {
// //   Table,
// //   Button,
// //   Alert,
// //   Spinner,
// //   Form,
// //   Card,
// //   Row,
// //   Col,
// //   InputGroup,
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
// // import { useAuth } from '../context/AuthContext';
// // import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// // import {
// //   genererRendezVous,
// //   resetAllRendezVous,
// //   fetchAptitudesByEtudiant,
// //   fetchApetencesByEtudiant,
// //   getDocumentPublicUrl,
// // } from '../services/supabase';

// // // Enregistrement des composants Chart.js pour le Radar
// // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

// // export default function RendezVousPage() {
// //   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
// //   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

// //   // Logique de génération (Admin)
// //   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
// //   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
// //   const [generating, setGenerating] = useState(false);
// //   const [genError, setGenError] = useState(null);
// //   const [genResult, setGenResult] = useState(null);

// //   // État Réinitialisation (Reset planning)
// //   const [showResetModal, setShowResetModal] = useState(false);
// //   const [resetRangeOnly, setResetRangeOnly] = useState(false);
// //   const [resetting, setResetting] = useState(false);

// //   // Filtres en temps réel
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [selectedChef, setSelectedChef] = useState('all');
// //   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

// //   // État du Modal Radar Étudiant
// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [modalLoading, setModalLoading] = useState(false);
// //   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
// //   const [aptitudesData, setAptitudesData] = useState(null);
// //   const [apetencesData, setApetencesData] = useState(null);
// //   const [modalError, setModalError] = useState(null);

// //   // Filtrage selon le profil connecté :
// //   const visibles = useMemo(() => {
// //     if (isAdmin) {
// //       return rendezVous;
// //     }
// //     if (isChef) {
// //       return rendezVous.filter(
// //         (r) =>
// //           r.chef_de_projet_id === chefId ||
// //           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
// //       );
// //     }
// //     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
// //   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

// //   const uniqueChefs = useMemo(() => {
// //     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
// //     return Array.from(chefs).sort();
// //   }, [visibles]);

// //   const uniqueDates = useMemo(() => {
// //     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
// //     return Array.from(dates).sort();
// //   }, [visibles]);

// //   const filteredRdv = useMemo(() => {
// //     return visibles.filter((r) => {
// //       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
// //       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
// //       if (searchQuery.trim()) {
// //         const query = searchQuery.toLowerCase().trim();
// //         const matchEtud = r.etudiant?.toLowerCase().includes(query);
// //         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
// //         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
// //         if (!matchEtud && !matchEmail && !matchChef) return false;
// //       }
// //       return true;
// //     });
// //   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

// //   // Ouverture du Popup Radar
// //   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
// //     if (!etudiant_id) return;
// //     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
// //     setModalOpen(true);
// //     setModalLoading(true);
// //     setModalError(null);
// //     setAptitudesData(null);
// //     setApetencesData(null);

// //     try {
// //       const [aptitudes, apetences] = await Promise.all([
// //         fetchAptitudesByEtudiant(etudiant_id),
// //         fetchApetencesByEtudiant(etudiant_id),
// //       ]);

// //       if (!aptitudes && !apetences) {
// //         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
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

// //   // Données du graphique Radar
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
// //           backgroundColor: 'rgba(45, 212, 191, 0.22)',
// //           borderColor: '#2dd4bf',
// //           borderWidth: 2.5,
// //           pointBackgroundColor: '#2dd4bf',
// //           pointBorderColor: '#0b1020',
// //           pointBorderWidth: 1.5,
// //           pointRadius: 4,
// //           pointHoverRadius: 6,
// //         },
// //         {
// //           label: 'Appétences (Intérêt)',
// //           data: apeValues,
// //           backgroundColor: 'rgba(244, 63, 94, 0.18)',
// //           borderColor: '#f43f5e',
// //           borderWidth: 2.5,
// //           pointBackgroundColor: '#f43f5e',
// //           pointBorderColor: '#0b1020',
// //           pointBorderWidth: 1.5,
// //           pointRadius: 4,
// //           pointHoverRadius: 6,
// //         },
// //       ],
// //     };
// //   }, [aptitudesData, apetencesData]);

// //   const radarAverages = useMemo(() => {
// //     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
// //     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
// //     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
// //     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
// //   }, [aptitudesData, apetencesData]);

// //   const radarOptions = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     scales: {
// //       r: {
// //         min: 0,
// //         suggestedMax: 4,
// //         ticks: {
// //           stepSize: 1,
// //           backdropColor: 'transparent',
// //           color: '#8892ab',
// //           font: { size: 10 },
// //         },
// //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// //         pointLabels: { color: '#eef1f8', font: { size: 11, weight: '600' } },
// //       },
// //     },
// //     plugins: {
// //       legend: { display: false },
// //       tooltip: {
// //         backgroundColor: '#161c30',
// //         borderColor: 'rgba(148, 163, 184, 0.25)',
// //         borderWidth: 1,
// //         titleColor: '#f5f7fc',
// //         bodyColor: '#c9d0e0',
// //         padding: 10,
// //         cornerRadius: 8,
// //         displayColors: true,
// //       },
// //     },
// //   };

// //   // Export Excel
// //   const handleExportExcel = () => {
// //     if (filteredRdv.length === 0) {
// //       alert('Aucun rendez-vous à exporter.');
// //       return;
// //     }

// //     const exportRows = filteredRdv.map((r) => ({
// //       'Date': r.date,
// //       'Heure de Début': r.heure_debut,
// //       'Heure de Fin': r.heure_fin,
// //       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
// //       'Chef de Projet': r.chef_de_projet || '',
// //       'Étudiant': r.etudiant || '',
// //       'Email Étudiant': r.email_etudiant || '',
// //     }));

// //     const worksheet = XLSX.utils.json_to_sheet(exportRows);
// //     worksheet['!cols'] = [
// //       { wch: 14 },
// //       { wch: 14 },
// //       { wch: 14 },
// //       { wch: 18 },
// //       { wch: 28 },
// //       { wch: 28 },
// //       { wch: 35 },
// //     ];

// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
// //     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
// //   };

// //   // Génération du planning (Admin)
// //   const handleGenerate = async () => {
// //     const confirmation = window.confirm(
// //       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
// //     );
// //     if (!confirmation) return;

// //     setGenerating(true);
// //     setGenError(null);
// //     setGenResult(null);
// //     try {
// //       const token = await getIdToken();
// //       const result = await genererRendezVous(dateDebut, dateFin, token);
// //       setGenResult(result.stats);
// //       await refresh();
// //     } catch (err) {
// //       setGenError(err.message);
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // Action de Réinitialisation / Purge du planning
// //   const handleResetSchedule = async () => {
// //     try {
// //       setResetting(true);
// //       setGenError(null);
// //       if (resetRangeOnly) {
// //         await resetAllRendezVous(dateDebut, dateFin);
// //       } else {
// //         await resetAllRendezVous();
// //       }
// //       await refresh();
// //       setShowResetModal(false);
// //     } catch (err) {
// //       setGenError(err.message || 'Erreur lors de la suppression du planning.');
// //     } finally {
// //       setResetting(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <style>{`
// //         :root {
// //           --canvas-bg: #090d16;
// //           --panel-bg: rgba(18, 24, 38, 0.88);
// //           --panel-solid: #121827;
// //           --panel-raised: #182033;
// //           --border-subtle: rgba(148, 163, 184, 0.12);
// //           --border-strong: rgba(148, 163, 184, 0.24);
// //           --text-primary: #f8fafc;
// //           --text-muted: #94a3b8;
// //           --text-faint: #64748b;

// //           /* Accents modernes et professionnels */
// //           --accent-cyan: #06b6d4;
// //           --accent-cyan-soft: rgba(6, 182, 212, 0.15);
// //           --accent-teal: #14b8a6;
// //           --accent-teal-soft: rgba(20, 184, 166, 0.15);
// //           --accent-indigo: #6366f1;
// //           --accent-indigo-soft: rgba(99, 102, 241, 0.15);
// //           --accent-amber: #f59e0b;
// //           --accent-amber-soft: rgba(245, 158, 11, 0.15);
// //           --accent-emerald: #10b981;
// //           --accent-emerald-soft: rgba(16, 185, 129, 0.15);
// //           --accent-rose: #f43f5e;
// //           --accent-danger: #ef4444;
// //           --accent-danger-soft: rgba(239, 68, 68, 0.15);
// //         }

// //         .wow-container {
// //           max-width: 100%;
// //           margin: 0 auto;
// //           padding: 1.5rem 1.25rem 3rem 1.25rem;
// //           color: var(--text-primary);
// //           background:
// //             radial-gradient(1000px 480px at 5% -5%, rgba(99, 102, 241, 0.08), transparent 60%),
// //             radial-gradient(900px 480px at 95% 0%, rgba(6, 182, 212, 0.08), transparent 55%),
// //             var(--canvas-bg);
// //           min-height: calc(100vh - 60px);
// //         }

// //         /* Cartes & Conteneurs */
// //         .glass-card {
// //           background: var(--panel-bg);
// //           backdrop-filter: blur(16px);
// //           -webkit-backdrop-filter: blur(16px);
// //           border: 1px solid var(--border-subtle);
// //           border-radius: 16px;
// //           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
// //         }

// //         /* Cartes KPI Pro */
// //         .kpi-card {
// //           padding: 1.15rem 1.25rem;
// //           border-radius: 14px;
// //           background: var(--panel-raised);
// //           border: 1px solid var(--border-subtle);
// //           transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
// //         }
// //         .kpi-card:hover {
// //           transform: translateY(-2px);
// //           border-color: rgba(99, 102, 241, 0.35);
// //           box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.4);
// //         }
// //         .kpi-label {
// //           font-size: 0.72rem;
// //           text-transform: uppercase;
// //           letter-spacing: 0.08em;
// //           color: var(--text-muted);
// //           font-weight: 700;
// //         }
// //         .kpi-val {
// //           font-size: 1.85rem;
// //           font-weight: 800;
// //           line-height: 1.1;
// //           margin-top: 0.25rem;
// //         }

// //         /* Générateur Admin */
// //         .generator-box {
// //           background:
// //             radial-gradient(600px 220px at 0% 0%, rgba(99, 102, 241, 0.16), transparent 60%),
// //             radial-gradient(600px 220px at 100% 100%, rgba(6, 182, 212, 0.12), transparent 60%),
// //             var(--panel-raised);
// //           border: 1px solid var(--border-strong);
// //           border-radius: 16px;
// //         }

// //         /* Boutons d'Action */
// //         .btn-glow {
// //           background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%);
// //           border: none;
// //           color: #ffffff;
// //           font-weight: 700;
// //           border-radius: 10px;
// //           box-shadow: 0 4px 18px rgba(79, 70, 229, 0.35);
// //           transition: all 0.2s ease;
// //         }
// //         .btn-glow:hover:not(:disabled) {
// //           transform: translateY(-1px);
// //           box-shadow: 0 6px 22px rgba(79, 70, 229, 0.5);
// //           color: #ffffff;
// //         }

// //         .btn-excel {
// //           background: linear-gradient(135deg, #059669 0%, #10b981 100%);
// //           border: none;
// //           color: #ffffff;
// //           font-weight: 700;
// //           border-radius: 10px;
// //           box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
// //           transition: all 0.2s ease;
// //         }
// //         .btn-excel:hover:not(:disabled) {
// //           transform: translateY(-1px);
// //           box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
// //           color: #ffffff;
// //         }

// //         .btn-danger-pill {
// //           background: var(--accent-danger-soft) !important;
// //           color: #fca5a5 !important;
// //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// //           border-radius: 10px !important;
// //           font-weight: 700 !important;
// //           transition: all 0.2s ease;
// //         }
// //         .btn-danger-pill:hover:not(:disabled) {
// //           background: #dc2626 !important;
// //           color: #ffffff !important;
// //           border-color: #dc2626 !important;
// //         }

// //         /* Tableau Pro */
// //         .wow-table {
// //           background: transparent !important;
// //           color: var(--text-primary) !important;
// //           font-size: 0.84rem;
// //         }
// //         .wow-table thead th {
// //           background: #0f1524 !important;
// //           color: var(--text-muted);
// //           font-size: 0.72rem;
// //           text-transform: uppercase;
// //           letter-spacing: 0.08em;
// //           padding: 0.85rem 1rem;
// //           border-bottom: 2px solid rgba(6, 182, 212, 0.3) !important;
// //           font-weight: 700;
// //         }
// //         .wow-table tbody tr {
// //           border-bottom: 1px solid var(--border-subtle);
// //           transition: background-color 0.15s ease;
// //         }
// //         .wow-table tbody tr:hover {
// //           background-color: rgba(99, 102, 241, 0.06) !important;
// //         }
// //         .wow-table tbody td {
// //           padding: 0.75rem 1rem;
// //           vertical-align: middle;
// //         }

// //         /* Badges & Pills */
// //         .time-pill {
// //           background: rgba(6, 182, 212, 0.12);
// //           border: 1px solid rgba(6, 182, 212, 0.35);
// //           color: #38bdf8;
// //           padding: 5px 12px;
// //           border-radius: 8px;
// //           font-weight: 700;
// //           font-family: 'JetBrains Mono', monospace;
// //           font-size: 0.8rem;
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 6px;
// //         }

// //         .date-pill {
// //           background: var(--panel-raised);
// //           border: 1px solid var(--border-strong);
// //           color: #e2e8f0;
// //           padding: 5px 10px;
// //           border-radius: 8px;
// //           font-family: 'JetBrains Mono', monospace;
// //           font-size: 0.78rem;
// //           font-weight: 600;
// //         }

// //         .chef-cell-wrapper {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 10px;
// //         }
// //         .chef-avatar-icon {
// //           width: 32px;
// //           height: 32px;
// //           border-radius: 8px;
// //           background: linear-gradient(135deg, #d97706, #f59e0b);
// //           display: inline-flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-weight: 800;
// //           font-size: 0.78rem;
// //           color: #1a1202;
// //           box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
// //         }
// //         .chef-name-text {
// //           color: #fde68a;
// //           font-weight: 700;
// //         }

// //         .avatar-student-btn {
// //           cursor: pointer;
// //           transition: background 0.15s ease, transform 0.15s ease;
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 10px;
// //           padding: 4px 8px;
// //           border-radius: 8px;
// //         }
// //         .avatar-student-btn:hover {
// //           background: var(--accent-indigo-soft);
// //           transform: translateX(2px);
// //         }

// //         .student-avatar-icon {
// //           width: 32px;
// //           height: 32px;
// //           border-radius: 8px;
// //           background: linear-gradient(135deg, #4f46e5, #7c3aed);
// //           display: inline-flex;
// //           align-items: center;
// //           justify-content: center;
// //           font-weight: 800;
// //           font-size: 0.78rem;
// //           color: #ffffff;
// //           box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
// //         }

// //         .student-name-link {
// //           color: #2dd4bf;
// //           font-weight: 700;
// //           text-decoration: none;
// //         }
// //         .student-name-link:hover {
// //           text-decoration: underline;
// //         }

// //         /* Boutons Documents CV / LM */
// //         .doc-badge-btn {
// //           background: var(--accent-teal-soft);
// //           border: 1px solid rgba(20, 184, 166, 0.35);
// //           color: #2dd4bf;
// //           padding: 3px 8px;
// //           border-radius: 6px;
// //           font-size: 0.72rem;
// //           font-weight: 700;
// //           text-decoration: none;
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 3px;
// //           transition: all 0.15s ease;
// //         }
// //         .doc-badge-btn:hover {
// //           background: #14b8a6;
// //           color: #042f2e;
// //           border-color: #14b8a6;
// //         }
// //         .doc-badge-disabled {
// //           background: rgba(255, 255, 255, 0.02);
// //           border: 1px solid var(--border-subtle);
// //           color: var(--text-faint);
// //           padding: 3px 8px;
// //           border-radius: 6px;
// //           font-size: 0.72rem;
// //           cursor: not-allowed;
// //         }

// //         /* Inputs & Filtres */
// //         .custom-input {
// //           background: var(--panel-raised) !important;
// //           border: 1px solid var(--border-strong) !important;
// //           color: var(--text-primary) !important;
// //           border-radius: 8px;
// //           font-size: 0.85rem;
// //         }
// //         .custom-input:focus {
// //           background: var(--panel-raised) !important;
// //           color: var(--text-primary) !important;
// //           border-color: var(--accent-cyan) !important;
// //           box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.18) !important;
// //         }

// //         /* Modal Radar & Reset */
// //         .radar-modal-content {
// //           background: var(--panel-solid) !important;
// //           border: 1px solid var(--border-strong) !important;
// //           border-radius: 16px !important;
// //           overflow: hidden;
// //           box-shadow: 0 24px 60px rgba(0,0,0,0.6);
// //         }
// //         .radar-modal-header {
// //           position: relative;
// //           padding: 1.25rem 1.5rem;
// //           background:
// //             radial-gradient(600px 220px at 15% 0%, rgba(99, 102, 241, 0.25), transparent 60%),
// //             radial-gradient(600px 220px at 100% 0%, rgba(6, 182, 212, 0.18), transparent 60%),
// //             var(--panel-raised);
// //           border-bottom: 1px solid var(--border-subtle);
// //         }
// //         .radar-modal-close {
// //           position: absolute;
// //           top: 1rem;
// //           right: 1rem;
// //           width: 28px;
// //           height: 28px;
// //           border-radius: 50%;
// //           border: 1px solid var(--border-strong);
// //           background: rgba(255,255,255,0.04);
// //           color: var(--text-primary);
// //           font-size: 0.8rem;
// //           line-height: 1;
// //           cursor: pointer;
// //         }
// //         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
// //         .radar-modal-eyebrow {
// //           text-transform: uppercase;
// //           letter-spacing: 1.2px;
// //           font-size: 0.68rem;
// //           font-weight: 800;
// //           color: var(--accent-cyan);
// //           margin-bottom: 0.2rem;
// //         }
// //         .radar-modal-title {
// //           color: var(--text-primary);
// //           font-weight: 700;
// //           margin: 0 0 0.85rem 0;
// //           font-size: 1.25rem;
// //         }
// //         .radar-modal-stats {
// //           display: flex;
// //           gap: 0.75rem;
// //           flex-wrap: wrap;
// //         }
// //         .radar-stat {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.45rem;
// //           padding: 0.35rem 0.7rem;
// //           border-radius: 8px;
// //           background: rgba(255,255,255,0.04);
// //           border: 1px solid var(--border-subtle);
// //         }
// //         .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
// //         .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
// //         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
// //         .radar-stat-label { color: var(--text-muted); font-size: 0.75rem; font-weight: 600; }
// //         .radar-stat-value { color: var(--text-primary); font-weight: 800; font-size: 0.9rem; }
// //         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
// //         .radar-modal-body {
// //           padding: 1.5rem;
// //           min-height: 400px;
// //           display: flex;
// //           flex-direction: column;
// //           justify-content: center;
// //         }
// //         .radar-modal-footer {
// //           padding: 0.9rem 1.5rem;
// //           border-top: 1px solid var(--border-subtle);
// //           display: flex;
// //           justify-content: space-between;
// //           align-items: center;
// //         }
// //       `}</style>

// //       <Navbar />

// //       <div className="wow-container">
// //         {/* Titre & Barre d'actions */}
// //         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
// //           <div>
// //             <div className="d-flex align-items-center gap-2">
// //               <span style={{ fontSize: '1.6rem' }}>📅</span>
// //               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
// //                 {isAdmin
// //                   ? 'Planning des Rendez-vous (Admin)'
// //                   : isChef
// //                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
// //                   : 'Mes Rendez-vous'}
// //               </h2>
// //             </div>
// //             <p className="text-muted small mt-1 mb-0">
// //               {(isAdmin || isChef) ? (
// //                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar de compétences, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
// //               ) : (
// //                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
// //               )}
// //             </p>
// //           </div>

// //           <div className="d-flex align-items-center gap-2 flex-wrap">
// //             {/* Bouton Vider le planning (Admin uniquement) */}
// //             {isAdmin && (
// //               <Button
// //                 className="btn-danger-pill d-flex align-items-center gap-2 px-3 py-2"
// //                 onClick={() => setShowResetModal(true)}
// //                 disabled={visibles.length === 0 || resetting}
// //                 title="Supprimer les rendez-vous générés"
// //               >
// //                 <span>🗑️</span>
// //                 <span>Vider planning ({visibles.length})</span>
// //               </Button>
// //             )}

// //             <Button
// //               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
// //               onClick={handleExportExcel}
// //               disabled={filteredRdv.length === 0}
// //             >
// //               <span>📊</span>
// //               <span>Exporter Excel ({filteredRdv.length})</span>
// //             </Button>
// //             <Button
// //               variant="outline-light"
// //               size="sm"
// //               onClick={refresh}
// //               className="d-flex align-items-center gap-2 px-3 py-2"
// //               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderColor: 'var(--border-strong)' }}
// //             >
// //               <span>🔄</span> Actualiser
// //             </Button>
// //           </div>
// //         </div>

// //         {/* Panneau Admin : Générateur */}
// //         {isAdmin && (
// //           <div className="generator-box p-4 mb-4 shadow-lg">
// //             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// //               <span
// //                 className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
// //                 style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}
// //               >
// //                 Mode Administrateur
// //               </span>
// //               <span className="fw-semibold fs-5" style={{ color: 'var(--text-primary)' }}>Générer le planning global</span>
// //             </div>

// //             <Row className="g-3 align-items-end">
// //               <Col xs={12} sm={6} md={3}>
// //                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
// //                 <Form.Control
// //                   type="date"
// //                   className="custom-input"
// //                   value={dateDebut}
// //                   onChange={(e) => setDateDebut(e.target.value)}
// //                 />
// //               </Col>
// //               <Col xs={12} sm={6} md={3}>
// //                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
// //                 <Form.Control
// //                   type="date"
// //                   className="custom-input"
// //                   value={dateFin}
// //                   onChange={(e) => setDateFin(e.target.value)}
// //                 />
// //               </Col>
// //               <Col xs={12} md={6}>
// //                 <Button
// //                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
// //                   onClick={handleGenerate}
// //                   disabled={generating}
// //                 >
// //                   {generating ? (
// //                     <>
// //                       <Spinner size="sm" animation="border" />
// //                       <span>Optimisation et placement des créneaux...</span>
// //                     </>
// //                   ) : (
// //                     <>
// //                       <span>✨</span>
// //                       <span>Lancer la génération des rendez-vous</span>
// //                     </>
// //                   )}
// //                 </Button>
// //               </Col>
// //             </Row>

// //             {genError && (
// //               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
// //                 <strong>Erreur : </strong> {genError}
// //               </Alert>
// //             )}
// //             {genResult && (
// //               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
// //                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
// //                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
// //               </Alert>
// //             )}
// //           </div>
// //         )}

// //         {/* Cartes KPI */}
// //         <Row className="g-3 mb-4">
// //           <Col xs={6} md={3}>
// //             <div className="kpi-card text-center">
// //               <div className="kpi-label">Total Rendez-vous</div>
// //               <div className="kpi-val" style={{ color: 'var(--accent-cyan)' }}>{filteredRdv.length}</div>
// //             </div>
// //           </Col>
// //           <Col xs={6} md={3}>
// //             <div className="kpi-card text-center">
// //               <div className="kpi-label">Chefs de Projet</div>
// //               <div className="kpi-val" style={{ color: 'var(--accent-emerald)' }}>{uniqueChefs.length}</div>
// //             </div>
// //           </Col>
// //           <Col xs={6} md={3}>
// //             <div className="kpi-card text-center">
// //               <div className="kpi-label">Jours de Passage</div>
// //               <div className="kpi-val" style={{ color: 'var(--accent-amber)' }}>{uniqueDates.length}</div>
// //             </div>
// //           </Col>
// //           <Col xs={6} md={3}>
// //             <div className="kpi-card text-center">
// //               <div className="kpi-label">Affichage</div>
// //               <div className="kpi-val" style={{ color: 'var(--text-primary)' }}>
// //                 {filteredRdv.length} <span className="fs-6 text-muted" style={{ fontWeight: 500 }}>/ {visibles.length}</span>
// //               </div>
// //             </div>
// //           </Col>
// //         </Row>

// //         {/* Barre de Filtres */}
// //         <Card className="glass-card mb-4 p-3 border-0">
// //           <Row className="g-2 align-items-center">
// //             <Col xs={12} md={4}>
// //               <InputGroup size="sm">
// //                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
// //                 <Form.Control
// //                   placeholder="Rechercher étudiant, email, chef..."
// //                   className="custom-input border-0"
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //                 />
// //                 {searchQuery && (
// //                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
// //                 )}
// //               </InputGroup>
// //             </Col>

// //             <Col xs={12} sm={6} md={3}>
// //               <Form.Select
// //                 size="sm"
// //                 className="custom-input"
// //                 value={selectedChef}
// //                 onChange={(e) => setSelectedChef(e.target.value)}
// //               >
// //                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
// //                 {uniqueChefs.map((chef) => (
// //                   <option key={chef} value={chef}>{chef}</option>
// //                 ))}
// //               </Form.Select>
// //             </Col>

// //             <Col xs={12} sm={6} md={3}>
// //               <Form.Select
// //                 size="sm"
// //                 className="custom-input"
// //                 value={selectedDateFilter}
// //                 onChange={(e) => setSelectedDateFilter(e.target.value)}
// //               >
// //                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
// //                 {uniqueDates.map((d) => (
// //                   <option key={d} value={d}>{d}</option>
// //                 ))}
// //               </Form.Select>
// //             </Col>

// //             <Col xs={12} md={2} className="text-md-end">
// //               <Button
// //                 variant="outline-secondary"
// //                 size="sm"
// //                 className="w-100 py-1 rounded-3"
// //                 onClick={() => {
// //                   setSearchQuery('');
// //                   setSelectedChef('all');
// //                   setSelectedDateFilter('all');
// //                 }}
// //                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
// //               >
// //                 Réinitialiser
// //               </Button>
// //             </Col>
// //           </Row>
// //         </Card>

// //         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

// //         {/* Tableau des Rendez-vous */}
// //         {loading ? (
// //           <div className="text-center py-5">
// //             <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// //             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
// //           </div>
// //         ) : (
// //           <div className="glass-card overflow-hidden">
// //             <div className="table-responsive">
// //               <Table hover size="sm" className="wow-table mb-0 align-middle text-nowrap">
// //                 <thead>
// //                   <tr>
// //                     <th>Date</th>
// //                     <th>Créneau Horaire</th>
// //                     <th>Chef de projet</th>
// //                     {(isAdmin || isChef) && <th>Étudiant (Radar & Documents)</th>}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {filteredRdv.map((r) => (
// //                     <tr key={r.id}>
// //                       <td>
// //                         <span className="date-pill">{r.date}</span>
// //                       </td>
// //                       <td>
// //                         <span className="time-pill">
// //                           <span>⏱</span>
// //                           <span>{r.heure_debut} ➔ {r.heure_fin}</span>
// //                         </span>
// //                       </td>
// //                       <td>
// //                         <div className="chef-cell-wrapper">
// //                           <span className="chef-avatar-icon">
// //                             {r.chef_de_projet?.charAt(0) || 'C'}
// //                           </span>
// //                           <span className="chef-name-text">{r.chef_de_projet}</span>
// //                         </div>
// //                       </td>
// //                       {(isAdmin || isChef) && (
// //                         <td>
// //                           <div className="d-flex align-items-center justify-content-between gap-2">
// //                             <div
// //                               className="avatar-student-btn"
// //                               title="Cliquer pour afficher le Radar des compétences"
// //                               onClick={() => handleOpenStudentRadar(r.etudiant_id, r.etudiant, r.email_etudiant)}
// //                             >
// //                               <span className="student-avatar-icon">
// //                                 {r.etudiant?.charAt(0) || 'E'}
// //                               </span>
// //                               <div>
// //                                 <div className="student-name-link">
// //                                   {r.etudiant} 📊
// //                                 </div>
// //                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.72rem' }}>
// //                                   {r.email_etudiant}
// //                                 </div>
// //                               </div>
// //                             </div>

// //                             {/* Boutons Documents CV / LM */}
// //                             <div className="d-flex gap-1 me-2">
// //                               {r.cv_path ? (
// //                                 <a
// //                                   href={getDocumentPublicUrl(r.cv_path)}
// //                                   target="_blank"
// //                                   rel="noopener noreferrer"
// //                                   className="doc-badge-btn"
// //                                   title="Ouvrir le CV (PDF)"
// //                                   onClick={(e) => e.stopPropagation()}
// //                                 >
// //                                   📄 CV
// //                                 </a>
// //                               ) : (
// //                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
// //                                   📄 CV
// //                                 </span>
// //                               )}

// //                               {r.lm_path ? (
// //                                 <a
// //                                   href={getDocumentPublicUrl(r.lm_path)}
// //                                   target="_blank"
// //                                   rel="noopener noreferrer"
// //                                   className="doc-badge-btn"
// //                                   title="Ouvrir la Lettre de Motivation (PDF)"
// //                                   onClick={(e) => e.stopPropagation()}
// //                                 >
// //                                   ✉️ LM
// //                                 </a>
// //                               ) : (
// //                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
// //                                   ✉️ LM
// //                                 </span>
// //                               )}
// //                             </div>
// //                           </div>
// //                         </td>
// //                       )}
// //                     </tr>
// //                   ))}

// //                   {filteredRdv.length === 0 && (
// //                     <tr>
// //                       <td colSpan={(isAdmin || isChef) ? 4 : 3} className="text-center py-5">
// //                         <div style={{ fontSize: '2.5rem' }}>✨</div>
// //                         <div className="mt-3 fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>Aucun rendez-vous trouvé</div>
// //                       </td>
// //                     </tr>
// //                   )}
// //                 </tbody>
// //               </Table>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Modal Confirmation Réinitialisation Planning */}
// //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered contentClassName="radar-modal-content">
// //         <div className="radar-modal-header" style={{ background: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
// //           <button type="button" className="radar-modal-close" onClick={() => setShowResetModal(false)}>✕</button>
// //           <div className="radar-modal-eyebrow" style={{ color: '#f87171' }}>Zone d'administration</div>
// //           <h4 className="radar-modal-title" style={{ color: '#ffffff', margin: 0 }}>🗑️ Vider le planning des rendez-vous</h4>
// //         </div>
// //         <div className="radar-modal-body" style={{ minHeight: 'auto', padding: '1.5rem' }}>
// //           <p className="text-light">
// //             Voulez-vous supprimer les créneaux de rendez-vous générés dans la base de données ?
// //           </p>

// //           <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
// //             <Form.Check
// //               type="radio"
// //               id="reset-all"
// //               name="reset-choice"
// //               label="Supprimer TOUS les rendez-vous de la base"
// //               checked={!resetRangeOnly}
// //               onChange={() => setResetRangeOnly(false)}
// //               className="mb-2 text-white"
// //             />
// //             <Form.Check
// //               type="radio"
// //               id="reset-range"
// //               name="reset-choice"
// //               label={`Supprimer uniquement la période sélectionnée (du ${dateDebut} au ${dateFin})`}
// //               checked={resetRangeOnly}
// //               onChange={() => setResetRangeOnly(true)}
// //               className="text-white"
// //             />
// //           </div>

// //           <p className="text-muted small mb-0">
// //             ⚠️ Cette action est irréversible. Les disponibilités et sélections resteront intactes.
// //           </p>
// //         </div>
// //         <div className="radar-modal-footer">
// //           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
// //             Annuler
// //           </Button>
// //           <Button className="btn-danger-pill" onClick={handleResetSchedule} disabled={resetting}>
// //             {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la suppression'}
// //           </Button>
// //         </div>
// //       </Modal>

// //       {/* Modal Radar — profil de compétences */}
// //       <Modal
// //         show={modalOpen}
// //         onHide={() => setModalOpen(false)}
// //         size="lg"
// //         centered
// //         contentClassName="radar-modal-content"
// //       >
// //         <div className="radar-modal-header">
// //           <button
// //             type="button"
// //             className="radar-modal-close"
// //             onClick={() => setModalOpen(false)}
// //             aria-label="Fermer"
// //           >
// //             ✕
// //           </button>
// //           <div className="radar-modal-eyebrow">Profil de compétences</div>
// //           <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
// //           {!modalLoading && !modalError && (
// //             <div className="radar-modal-stats">
// //               <div className="radar-stat radar-stat-cyan">
// //                 <span className="radar-stat-dot" />
// //                 <span className="radar-stat-label">Aptitudes</span>
// //                 <span className="radar-stat-value">{radarAverages.aptitude.toFixed(1)}<small>/4</small></span>
// //               </div>
// //               <div className="radar-stat radar-stat-rose">
// //                 <span className="radar-stat-dot" />
// //                 <span className="radar-stat-label">Appétences</span>
// //                 <span className="radar-stat-value">{radarAverages.appetence.toFixed(1)}<small>/4</small></span>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         <div className="radar-modal-body">
// //           {modalLoading ? (
// //             <div className="text-center py-5">
// //               <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
// //               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
// //             </div>
// //           ) : modalError ? (
// //             <Alert variant="warning" className="text-center m-3 mb-0">
// //               {modalError}
// //             </Alert>
// //           ) : (
// //             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
// //               <Radar data={radarChartData} options={radarOptions} />
// //             </div>
// //           )}
// //         </div>

// //         <div className="radar-modal-footer">
// //           <small className="text-muted font-monospace">
// //             {selectedEtudiantInfo?.email}
// //           </small>
// //           <Button variant="secondary" onClick={() => setModalOpen(false)}>
// //             Fermer
// //           </Button>
// //         </div>
// //       </Modal>
// //     </>
// //   );
// // }
// import React, { useState, useMemo } from 'react';
// import {
//   Table,
//   Button,
//   Alert,
//   Spinner,
//   Form,
//   Card,
//   Row,
//   Col,
//   InputGroup,
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
// import { useAuth } from '../context/AuthContext';
// import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
// import {
//   genererRendezVous,
//   resetAllRendezVous,
//   fetchAptitudesByEtudiant,
//   fetchApetencesByEtudiant,
//   getDocumentPublicUrl,
// } from '../services/supabase';

// // Enregistrement des composants Chart.js pour le Radar
// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

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

// export default function RendezVousPage() {
//   const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
//   const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

//   // Logique de génération (Admin)
//   const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
//   const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
//   const [generating, setGenerating] = useState(false);
//   const [genError, setGenError] = useState(null);
//   const [genResult, setGenResult] = useState(null);

//   // État Réinitialisation (Reset planning)
//   const [showResetModal, setShowResetModal] = useState(false);
//   const [resetRangeOnly, setResetRangeOnly] = useState(false);
//   const [resetting, setResetting] = useState(false);

//   // Filtres en temps réel
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedChef, setSelectedChef] = useState('all');
//   const [selectedDateFilter, setSelectedDateFilter] = useState('all');

//   // État du Modal Radar Étudiant
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
//   const [aptitudesData, setAptitudesData] = useState(null);
//   const [apetencesData, setApetencesData] = useState(null);
//   const [modalError, setModalError] = useState(null);

//   // Filtrage selon le profil connecté :
//   const visibles = useMemo(() => {
//     if (isAdmin) {
//       return rendezVous;
//     }
//     if (isChef) {
//       return rendezVous.filter(
//         (r) =>
//           r.chef_de_projet_id === chefId ||
//           r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
//       );
//     }
//     return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
//   }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

//   const uniqueChefs = useMemo(() => {
//     const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
//     return Array.from(chefs).sort();
//   }, [visibles]);

//   const uniqueDates = useMemo(() => {
//     const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
//     return Array.from(dates).sort();
//   }, [visibles]);

//   const filteredRdv = useMemo(() => {
//     return visibles.filter((r) => {
//       if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
//       if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
//       if (searchQuery.trim()) {
//         const query = searchQuery.toLowerCase().trim();
//         const matchEtud = r.etudiant?.toLowerCase().includes(query);
//         const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
//         const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
//         if (!matchEtud && !matchEmail && !matchChef) return false;
//       }
//       return true;
//     });
//   }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

//   // --- Construction de la matrice Étudiants (lignes) x Chefs de projet (colonnes) ---
//   const matrixChefs = useMemo(() => {
//     const chefs = new Set(filteredRdv.map((r) => r.chef_de_projet).filter(Boolean));
//     return Array.from(chefs).sort();
//   }, [filteredRdv]);

//   const matrixStudents = useMemo(() => {
//     const map = new Map();
//     filteredRdv.forEach((r) => {
//       const key = r.etudiant_id || r.email_etudiant || r.etudiant;
//       if (!key) return;
//       if (!map.has(key)) {
//         map.set(key, {
//           key,
//           id: r.etudiant_id,
//           nom: r.etudiant,
//           email: r.email_etudiant,
//           cv_path: r.cv_path,
//           lm_path: r.lm_path,
//         });
//       }
//     });
//     return Array.from(map.values()).sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
//   }, [filteredRdv]);

//   const matrixData = useMemo(() => {
//     const map = new Map();
//     filteredRdv.forEach((r) => {
//       const studentKey = r.etudiant_id || r.email_etudiant || r.etudiant;
//       if (!studentKey || !r.chef_de_projet) return;
//       const cellKey = `${studentKey}__${r.chef_de_projet}`;
//       if (!map.has(cellKey)) map.set(cellKey, []);
//       map.get(cellKey).push(r);
//     });
//     return map;
//   }, [filteredRdv]);

//   // Ouverture du Popup Radar
//   const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
//     if (!etudiant_id) return;
//     setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
//     setModalOpen(true);
//     setModalLoading(true);
//     setModalError(null);
//     setAptitudesData(null);
//     setApetencesData(null);

//     try {
//       const [aptitudes, apetences] = await Promise.all([
//         fetchAptitudesByEtudiant(etudiant_id),
//         fetchApetencesByEtudiant(etudiant_id),
//       ]);

//       if (!aptitudes && !apetences) {
//         setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
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

//   // Données du graphique Radar
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
//           backgroundColor: 'rgba(45, 212, 191, 0.22)',
//           borderColor: '#2dd4bf',
//           borderWidth: 2.5,
//           pointBackgroundColor: '#2dd4bf',
//           pointBorderColor: '#0b1020',
//           pointBorderWidth: 1.5,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//         },
//         {
//           label: 'Appétences (Intérêt)',
//           data: apeValues,
//           backgroundColor: 'rgba(244, 63, 94, 0.18)',
//           borderColor: '#f43f5e',
//           borderWidth: 2.5,
//           pointBackgroundColor: '#f43f5e',
//           pointBorderColor: '#0b1020',
//           pointBorderWidth: 1.5,
//           pointRadius: 4,
//           pointHoverRadius: 6,
//         },
//       ],
//     };
//   }, [aptitudesData, apetencesData]);

//   const radarAverages = useMemo(() => {
//     const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
//     const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
//     const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
//     return { aptitude: avg(aptValues), appetence: avg(apeValues) };
//   }, [aptitudesData, apetencesData]);

//   const radarOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       r: {
//         min: 0,
//         suggestedMax: 4,
//         ticks: {
//           stepSize: 1,
//           backdropColor: 'transparent',
//           color: '#8892ab',
//           font: { size: 10 },
//         },
//         grid: { color: 'rgba(148, 163, 184, 0.14)' },
//         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
//         pointLabels: { color: '#eef1f8', font: { size: 11, weight: '600' } },
//       },
//     },
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         backgroundColor: '#161c30',
//         borderColor: 'rgba(148, 163, 184, 0.25)',
//         borderWidth: 1,
//         titleColor: '#f5f7fc',
//         bodyColor: '#c9d0e0',
//         padding: 10,
//         cornerRadius: 8,
//         displayColors: true,
//       },
//     },
//   };

//   // Export Excel
//   const handleExportExcel = () => {
//     if (filteredRdv.length === 0) {
//       alert('Aucun rendez-vous à exporter.');
//       return;
//     }

//     const exportRows = filteredRdv.map((r) => ({
//       'Date': r.date,
//       'Heure de Début': r.heure_debut,
//       'Heure de Fin': r.heure_fin,
//       'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
//       'Chef de Projet': r.chef_de_projet || '',
//       'Étudiant': r.etudiant || '',
//       'Email Étudiant': r.email_etudiant || '',
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(exportRows);
//     worksheet['!cols'] = [
//       { wch: 14 },
//       { wch: 14 },
//       { wch: 14 },
//       { wch: 18 },
//       { wch: 28 },
//       { wch: 28 },
//       { wch: 35 },
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
//     XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   };

//   // Génération du planning (Admin)
//   const handleGenerate = async () => {
//     const confirmation = window.confirm(
//       `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
//     );
//     if (!confirmation) return;

//     setGenerating(true);
//     setGenError(null);
//     setGenResult(null);
//     try {
//       const token = await getIdToken();
//       const result = await genererRendezVous(dateDebut, dateFin, token);
//       setGenResult(result.stats);
//       await refresh();
//     } catch (err) {
//       setGenError(err.message);
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // Action de Réinitialisation / Purge du planning
//   const handleResetSchedule = async () => {
//     try {
//       setResetting(true);
//       setGenError(null);
//       if (resetRangeOnly) {
//         await resetAllRendezVous(dateDebut, dateFin);
//       } else {
//         await resetAllRendezVous();
//       }
//       await refresh();
//       setShowResetModal(false);
//     } catch (err) {
//       setGenError(err.message || 'Erreur lors de la suppression du planning.');
//     } finally {
//       setResetting(false);
//     }
//   };

//   return (
//     <>
//       <style>{`
//         :root {
//           --canvas-bg: #090d16;
//           --panel-bg: rgba(18, 24, 38, 0.88);
//           --panel-solid: #121827;
//           --panel-raised: #182033;
//           --border-subtle: rgba(148, 163, 184, 0.12);
//           --border-strong: rgba(148, 163, 184, 0.24);
//           --text-primary: #f8fafc;
//           --text-muted: #94a3b8;
//           --text-faint: #64748b;

//           /* Accents modernes et professionnels */
//           --accent-cyan: #06b6d4;
//           --accent-cyan-soft: rgba(6, 182, 212, 0.15);
//           --accent-teal: #14b8a6;
//           --accent-teal-soft: rgba(20, 184, 166, 0.15);
//           --accent-indigo: #6366f1;
//           --accent-indigo-soft: rgba(99, 102, 241, 0.15);
//           --accent-amber: #f59e0b;
//           --accent-amber-soft: rgba(245, 158, 11, 0.15);
//           --accent-emerald: #10b981;
//           --accent-emerald-soft: rgba(16, 185, 129, 0.15);
//           --accent-rose: #f43f5e;
//           --accent-danger: #ef4444;
//           --accent-danger-soft: rgba(239, 68, 68, 0.15);
//         }

//         .wow-container {
//           max-width: 100%;
//           margin: 0 auto;
//           padding: 1.5rem 1.25rem 3rem 1.25rem;
//           color: var(--text-primary);
//           background:
//             radial-gradient(1000px 480px at 5% -5%, rgba(99, 102, 241, 0.08), transparent 60%),
//             radial-gradient(900px 480px at 95% 0%, rgba(6, 182, 212, 0.08), transparent 55%),
//             var(--canvas-bg);
//           min-height: calc(100vh - 60px);
//         }

//         /* Cartes & Conteneurs */
//         .glass-card {
//           background: var(--panel-bg);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid var(--border-subtle);
//           border-radius: 16px;
//           box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
//         }

//         /* Cartes KPI Pro */
//         .kpi-card {
//           padding: 1.15rem 1.25rem;
//           border-radius: 14px;
//           background: var(--panel-raised);
//           border: 1px solid var(--border-subtle);
//           transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
//         }
//         .kpi-card:hover {
//           transform: translateY(-2px);
//           border-color: rgba(99, 102, 241, 0.35);
//           box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.4);
//         }
//         .kpi-label {
//           font-size: 0.72rem;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           color: var(--text-muted);
//           font-weight: 700;
//         }
//         .kpi-val {
//           font-size: 1.85rem;
//           font-weight: 800;
//           line-height: 1.1;
//           margin-top: 0.25rem;
//         }

//         /* Générateur Admin */
//         .generator-box {
//           background:
//             radial-gradient(600px 220px at 0% 0%, rgba(99, 102, 241, 0.16), transparent 60%),
//             radial-gradient(600px 220px at 100% 100%, rgba(6, 182, 212, 0.12), transparent 60%),
//             var(--panel-raised);
//           border: 1px solid var(--border-strong);
//           border-radius: 16px;
//         }

//         /* Boutons d'Action */
//         .btn-glow {
//           background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%);
//           border: none;
//           color: #ffffff;
//           font-weight: 700;
//           border-radius: 10px;
//           box-shadow: 0 4px 18px rgba(79, 70, 229, 0.35);
//           transition: all 0.2s ease;
//         }
//         .btn-glow:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 6px 22px rgba(79, 70, 229, 0.5);
//           color: #ffffff;
//         }

//         .btn-excel {
//           background: linear-gradient(135deg, #059669 0%, #10b981 100%);
//           border: none;
//           color: #ffffff;
//           font-weight: 700;
//           border-radius: 10px;
//           box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
//           transition: all 0.2s ease;
//         }
//         .btn-excel:hover:not(:disabled) {
//           transform: translateY(-1px);
//           box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
//           color: #ffffff;
//         }

//         .btn-danger-pill {
//           background: var(--accent-danger-soft) !important;
//           color: #fca5a5 !important;
//           border: 1px solid rgba(239, 68, 68, 0.35) !important;
//           border-radius: 10px !important;
//           font-weight: 700 !important;
//           transition: all 0.2s ease;
//         }
//         .btn-danger-pill:hover:not(:disabled) {
//           background: #dc2626 !important;
//           color: #ffffff !important;
//           border-color: #dc2626 !important;
//         }

//         /* Tableau Pro (base) */
//         .wow-table {
//           background: transparent !important;
//           color: var(--text-primary) !important;
//           font-size: 0.84rem;
//         }
//         .wow-table thead th {
//           background: #0f1524 !important;
//           color: var(--text-muted);
//           font-size: 0.72rem;
//           text-transform: uppercase;
//           letter-spacing: 0.08em;
//           padding: 0.85rem 1rem;
//           border-bottom: 2px solid rgba(6, 182, 212, 0.3) !important;
//           font-weight: 700;
//         }
//         .wow-table tbody tr {
//           border-bottom: 1px solid var(--border-subtle);
//           transition: background-color 0.15s ease;
//         }
//         .wow-table tbody tr:hover {
//           background-color: rgba(99, 102, 241, 0.06) !important;
//         }
//         .wow-table tbody td {
//           padding: 0.75rem 1rem;
//           vertical-align: middle;
//         }

//         /* ===== Matrice Étudiants x Chefs de projet ===== */
//         .matrix-table {
//           border-collapse: separate;
//           border-spacing: 0;
//         }
//         .matrix-table thead th {
//           text-align: center;
//           white-space: nowrap;
//         }
//         .matrix-table thead th.matrix-corner {
//           position: sticky;
//           left: 0;
//           z-index: 4;
//           text-align: left;
//           min-width: 150px;
//           background: #0f1524 !important;
//           border-right: 1px solid var(--border-strong) !important;
//         }
//         .matrix-table thead th.matrix-chef-col {
//           min-width: 168px;
//           background: linear-gradient(180deg, rgba(99, 102, 241, 0.14) 0%, #0f1524 100%) !important;
//           border-bottom: 2px solid var(--accent-indigo) !important;
//         }
//         .matrix-chef-header {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 5px;
//         }
//         .chef-avatar-icon-sm {
//           width: 26px;
//           height: 26px;
//           border-radius: 7px;
//           background: linear-gradient(135deg, #d97706, #f59e0b);
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 800;
//           font-size: 0.7rem;
//           color: #1a1202;
//           box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
//         }
//         .matrix-chef-name {
//           color: #cbd5f5;
//           font-weight: 700;
//           font-size: 0.72rem;
//           white-space: normal;
//           text-align: center;
//           line-height: 1.15;
//         }

//         .matrix-table tbody td.matrix-student-cell {
//           position: sticky;
//           left: 0;
//           z-index: 2;
//           background: #111729 !important;
//           border-right: 1px solid var(--border-strong);
//           min-width: 150px;
//         }
//         .matrix-table tbody tr:hover td.matrix-student-cell {
//           background: #141c33 !important;
//         }

//         .matrix-cell {
//           text-align: center;
//           min-width: 168px;
//           vertical-align: middle;
//           border-left: 1px solid var(--border-subtle);
//         }
//         .matrix-cell-filled {
//           background: linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(99, 102, 241, 0.07));
//           box-shadow: inset 3px 0 0 var(--accent-cyan);
//         }
//         .matrix-cell-empty {
//           opacity: 0.32;
//         }
//         .matrix-slot {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 2px;
//           padding: 3px 2px;
//         }
//         .matrix-slot + .matrix-slot {
//           margin-top: 4px;
//           padding-top: 5px;
//           border-top: 1px dashed var(--border-subtle);
//         }
//         .matrix-slot-date {
//           font-size: 0.66rem;
//           color: var(--text-muted);
//           font-weight: 600;
//         }
//         .matrix-slot-time {
//           font-family: 'JetBrains Mono', monospace;
//           font-weight: 700;
//           color: #38bdf8;
//           font-size: 0.78rem;
//         }
//         .matrix-empty-dash {
//           color: var(--text-faint);
//           font-size: 1rem;
//         }

//         /* Badges & Pills */
//         .time-pill {
//           background: rgba(6, 182, 212, 0.12);
//           border: 1px solid rgba(6, 182, 212, 0.35);
//           color: #38bdf8;
//           padding: 5px 12px;
//           border-radius: 8px;
//           font-weight: 700;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.8rem;
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .date-pill {
//           background: var(--panel-raised);
//           border: 1px solid var(--border-strong);
//           color: #e2e8f0;
//           padding: 5px 10px;
//           border-radius: 8px;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.78rem;
//           font-weight: 600;
//         }

//         .chef-cell-wrapper {
//           display: inline-flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .chef-avatar-icon {
//           width: 32px;
//           height: 32px;
//           border-radius: 8px;
//           background: linear-gradient(135deg, #d97706, #f59e0b);
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 800;
//           font-size: 0.78rem;
//           color: #1a1202;
//           box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
//         }
//         .chef-name-text {
//           color: #fde68a;
//           font-weight: 700;
//         }

//         .avatar-student-btn {
//           cursor: pointer;
//           transition: background 0.15s ease, transform 0.15s ease;
//           display: inline-flex;
//           align-items: center;
//           gap: 10px;
//           padding: 4px 8px;
//           border-radius: 8px;
//         }
//         .avatar-student-btn:hover {
//           background: var(--accent-indigo-soft);
//           transform: translateX(2px);
//         }

//         .student-avatar-icon {
//           width: 32px;
//           height: 32px;
//           border-radius: 8px;
//           background: linear-gradient(135deg, #4f46e5, #7c3aed);
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: 800;
//           font-size: 0.78rem;
//           color: #ffffff;
//           box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
//         }

//         .student-name-link {
//           color: #2dd4bf;
//           font-weight: 700;
//           text-decoration: none;
//         }
//         .student-name-link:hover {
//           text-decoration: underline;
//         }

//         /* Boutons Documents CV / LM */
//         .doc-badge-btn {
//           background: var(--accent-teal-soft);
//           border: 1px solid rgba(20, 184, 166, 0.35);
//           color: #2dd4bf;
//           padding: 3px 8px;
//           border-radius: 6px;
//           font-size: 0.72rem;
//           font-weight: 700;
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           gap: 3px;
//           transition: all 0.15s ease;
//         }
//         .doc-badge-btn:hover {
//           background: #14b8a6;
//           color: #042f2e;
//           border-color: #14b8a6;
//         }
//         .doc-badge-disabled {
//           background: rgba(255, 255, 255, 0.02);
//           border: 1px solid var(--border-subtle);
//           color: var(--text-faint);
//           padding: 3px 8px;
//           border-radius: 6px;
//           font-size: 0.72rem;
//           cursor: not-allowed;
//         }

//         /* Inputs & Filtres */
//         .custom-input {
//           background: var(--panel-raised) !important;
//           border: 1px solid var(--border-strong) !important;
//           color: var(--text-primary) !important;
//           border-radius: 8px;
//           font-size: 0.85rem;
//         }
//         .custom-input:focus {
//           background: var(--panel-raised) !important;
//           color: var(--text-primary) !important;
//           border-color: var(--accent-cyan) !important;
//           box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.18) !important;
//         }

//         /* Modal Radar & Reset */
//         .radar-modal-content {
//           background: var(--panel-solid) !important;
//           border: 1px solid var(--border-strong) !important;
//           border-radius: 16px !important;
//           overflow: hidden;
//           box-shadow: 0 24px 60px rgba(0,0,0,0.6);
//         }
//         .radar-modal-header {
//           position: relative;
//           padding: 1.25rem 1.5rem;
//           background:
//             radial-gradient(600px 220px at 15% 0%, rgba(99, 102, 241, 0.25), transparent 60%),
//             radial-gradient(600px 220px at 100% 0%, rgba(6, 182, 212, 0.18), transparent 60%),
//             var(--panel-raised);
//           border-bottom: 1px solid var(--border-subtle);
//         }
//         .radar-modal-close {
//           position: absolute;
//           top: 1rem;
//           right: 1rem;
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           border: 1px solid var(--border-strong);
//           background: rgba(255,255,255,0.04);
//           color: var(--text-primary);
//           font-size: 0.8rem;
//           line-height: 1;
//           cursor: pointer;
//         }
//         .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
//         .radar-modal-eyebrow {
//           text-transform: uppercase;
//           letter-spacing: 1.2px;
//           font-size: 0.68rem;
//           font-weight: 800;
//           color: var(--accent-cyan);
//           margin-bottom: 0.2rem;
//         }
//         .radar-modal-title {
//           color: var(--text-primary);
//           font-weight: 700;
//           margin: 0 0 0.85rem 0;
//           font-size: 1.25rem;
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
//           padding: 0.35rem 0.7rem;
//           border-radius: 8px;
//           background: rgba(255,255,255,0.04);
//           border: 1px solid var(--border-subtle);
//         }
//         .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
//         .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
//         .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
//         .radar-stat-label { color: var(--text-muted); font-size: 0.75rem; font-weight: 600; }
//         .radar-stat-value { color: var(--text-primary); font-weight: 800; font-size: 0.9rem; }
//         .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
//         .radar-modal-body {
//           padding: 1.5rem;
//           min-height: 400px;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//         }
//         .radar-modal-footer {
//           padding: 0.9rem 1.5rem;
//           border-top: 1px solid var(--border-subtle);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }
//       `}</style>

//       <Navbar />

//       <div className="wow-container">
//         {/* Titre & Barre d'actions */}
//         <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
//           <div>
//             <div className="d-flex align-items-center gap-2">
//               <span style={{ fontSize: '1.6rem' }}>📅</span>
//               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
//                 {isAdmin
//                   ? 'Planning des Rendez-vous (Admin)'
//                   : isChef
//                   ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
//                   : 'Mes Rendez-vous'}
//               </h2>
//             </div>
//             <p className="text-muted small mt-1 mb-0">
//               {(isAdmin || isChef) ? (
//                 <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar de compétences, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
//               ) : (
//                 <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
//               )}
//             </p>
//           </div>

//           <div className="d-flex align-items-center gap-2 flex-wrap">
//             {/* Bouton Vider le planning (Admin uniquement) */}
//             {isAdmin && (
//               <Button
//                 className="btn-danger-pill d-flex align-items-center gap-2 px-3 py-2"
//                 onClick={() => setShowResetModal(true)}
//                 disabled={visibles.length === 0 || resetting}
//                 title="Supprimer les rendez-vous générés"
//               >
//                 <span>🗑️</span>
//                 <span>Vider planning ({visibles.length})</span>
//               </Button>
//             )}

//             <Button
//               className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
//               onClick={handleExportExcel}
//               disabled={filteredRdv.length === 0}
//             >
//               <span>📊</span>
//               <span>Exporter Excel ({filteredRdv.length})</span>
//             </Button>
//             <Button
//               variant="outline-light"
//               size="sm"
//               onClick={refresh}
//               className="d-flex align-items-center gap-2 px-3 py-2"
//               style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderColor: 'var(--border-strong)' }}
//             >
//               <span>🔄</span> Actualiser
//             </Button>
//           </div>
//         </div>

//         {/* Panneau Admin : Générateur */}
//         {isAdmin && (
//           <div className="generator-box p-4 mb-4 shadow-lg">
//             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//               <span
//                 className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
//                 style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}
//               >
//                 Mode Administrateur
//               </span>
//               <span className="fw-semibold fs-5" style={{ color: 'var(--text-primary)' }}>Générer le planning global</span>
//             </div>

//             <Row className="g-3 align-items-end">
//               <Col xs={12} sm={6} md={3}>
//                 <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
//                 <Form.Control
//                   type="date"
//                   className="custom-input"
//                   value={dateDebut}
//                   onChange={(e) => setDateDebut(e.target.value)}
//                 />
//               </Col>
//               <Col xs={12} sm={6} md={3}>
//                 <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
//                 <Form.Control
//                   type="date"
//                   className="custom-input"
//                   value={dateFin}
//                   onChange={(e) => setDateFin(e.target.value)}
//                 />
//               </Col>
//               <Col xs={12} md={6}>
//                 <Button
//                   className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
//                   onClick={handleGenerate}
//                   disabled={generating}
//                 >
//                   {generating ? (
//                     <>
//                       <Spinner size="sm" animation="border" />
//                       <span>Optimisation et placement des créneaux...</span>
//                     </>
//                   ) : (
//                     <>
//                       <span>✨</span>
//                       <span>Lancer la génération des rendez-vous</span>
//                     </>
//                   )}
//                 </Button>
//               </Col>
//             </Row>

//             {genError && (
//               <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
//                 <strong>Erreur : </strong> {genError}
//               </Alert>
//             )}
//             {genResult && (
//               <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
//                 🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
//                 <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
//               </Alert>
//             )}
//           </div>
//         )}

//         {/* Cartes KPI */}
//         <Row className="g-3 mb-4">
//           <Col xs={6} md={3}>
//             <div className="kpi-card text-center">
//               <div className="kpi-label">Total Rendez-vous</div>
//               <div className="kpi-val" style={{ color: 'var(--accent-cyan)' }}>{filteredRdv.length}</div>
//             </div>
//           </Col>
//           <Col xs={6} md={3}>
//             <div className="kpi-card text-center">
//               <div className="kpi-label">Chefs de Projet</div>
//               <div className="kpi-val" style={{ color: 'var(--accent-emerald)' }}>{uniqueChefs.length}</div>
//             </div>
//           </Col>
//           <Col xs={6} md={3}>
//             <div className="kpi-card text-center">
//               <div className="kpi-label">Jours de Passage</div>
//               <div className="kpi-val" style={{ color: 'var(--accent-amber)' }}>{uniqueDates.length}</div>
//             </div>
//           </Col>
//           <Col xs={6} md={3}>
//             <div className="kpi-card text-center">
//               <div className="kpi-label">Affichage</div>
//               <div className="kpi-val" style={{ color: 'var(--text-primary)' }}>
//                 {filteredRdv.length} <span className="fs-6 text-muted" style={{ fontWeight: 500 }}>/ {visibles.length}</span>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         {/* Barre de Filtres */}
//         <Card className="glass-card mb-4 p-3 border-0">
//           <Row className="g-2 align-items-center">
//             <Col xs={12} md={4}>
//               <InputGroup size="sm">
//                 <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
//                 <Form.Control
//                   placeholder="Rechercher étudiant, email, chef..."
//                   className="custom-input border-0"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 {searchQuery && (
//                   <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
//                 )}
//               </InputGroup>
//             </Col>

//             <Col xs={12} sm={6} md={3}>
//               <Form.Select
//                 size="sm"
//                 className="custom-input"
//                 value={selectedChef}
//                 onChange={(e) => setSelectedChef(e.target.value)}
//               >
//                 <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
//                 {uniqueChefs.map((chef) => (
//                   <option key={chef} value={chef}>{chef}</option>
//                 ))}
//               </Form.Select>
//             </Col>

//             <Col xs={12} sm={6} md={3}>
//               <Form.Select
//                 size="sm"
//                 className="custom-input"
//                 value={selectedDateFilter}
//                 onChange={(e) => setSelectedDateFilter(e.target.value)}
//               >
//                 <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
//                 {uniqueDates.map((d) => (
//                   <option key={d} value={d}>{d}</option>
//                 ))}
//               </Form.Select>
//             </Col>

//             <Col xs={12} md={2} className="text-md-end">
//               <Button
//                 variant="outline-secondary"
//                 size="sm"
//                 className="w-100 py-1 rounded-3"
//                 onClick={() => {
//                   setSearchQuery('');
//                   setSelectedChef('all');
//                   setSelectedDateFilter('all');
//                 }}
//                 disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
//               >
//                 Réinitialiser
//               </Button>
//             </Col>
//           </Row>
//         </Card>

//         {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

//         {/* Matrice Étudiants x Chefs de projet */}
//         {loading ? (
//           <div className="text-center py-5">
//             <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
//             <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
//           </div>
//         ) : (
//           <div className="glass-card overflow-hidden">
//             <div className="table-responsive">
//               <Table hover size="sm" className="wow-table matrix-table mb-0 align-middle">
//                 <thead>
//                   <tr>
//                     <th className="matrix-corner">Étudiant</th>
//                     {matrixChefs.map((chef) => (
//                       <th key={chef} className="matrix-chef-col">
//                         <div className="matrix-chef-header">
//                           {/* <span className="chef-avatar-icon-sm">{chef.charAt(0)}</span> */}
//                           {/* <span className="matrix-chef-name">{chef}</span> */}
//                           <span className="matrix-chef-name">
//                             {chef.substring(0, 3).toUpperCase()}
//                           </span>
//                         </div>
//                       </th>
//                     ))}
//                     {matrixChefs.length === 0 && <th className="matrix-chef-col">Chef de projet</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {matrixStudents.map((student) => (
//                     <tr key={student.key}>
//                       <td className="matrix-student-cell">
//                         {(isAdmin || isChef) ? (
//                           <div className="d-flex align-items-center justify-content-between gap-2">
//                             <div
//                               className="avatar-student-btn"
//                               title="Cliquer pour afficher le Radar des compétences"
//                               onClick={() => handleOpenStudentRadar(student.id, student.nom, student.email)}
//                             >
//                               <span className="student-avatar-icon">
//                                 {student.nom?.charAt(0) || 'E'}
//                               </span>
//                               <div>
//                                 <div className="student-name-link">
//                                   {student.nom} 📊
//                                 </div>
//                                 <div className="text-muted small font-monospace" style={{ fontSize: '0.72rem' }}>
//                                   {student.email}
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Boutons Documents CV / LM */}
//                             <div className="d-flex gap-1 me-2">
//                               {student.cv_path ? (
//                                 <a
//                                   href={getDocumentPublicUrl(student.cv_path)}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="doc-badge-btn"
//                                   title="Ouvrir le CV (PDF)"
//                                   onClick={(e) => e.stopPropagation()}
//                                 >
//                                   📄 CV
//                                 </a>
//                               ) : (
//                                 <span className="doc-badge-disabled" title="Aucun CV déposé">
//                                   📄 CV
//                                 </span>
//                               )}

//                               {student.lm_path ? (
//                                 <a
//                                   href={getDocumentPublicUrl(student.lm_path)}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="doc-badge-btn"
//                                   title="Ouvrir la Lettre de Motivation (PDF)"
//                                   onClick={(e) => e.stopPropagation()}
//                                 >
//                                   ✉️ LM
//                                 </a>
//                               ) : (
//                                 <span className="doc-badge-disabled" title="Aucune LM déposée">
//                                   ✉️ LM
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         ) : (
//                           <div>
//                             <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>{student.nom}</div>
//                             <div className="text-muted small font-monospace" style={{ fontSize: '0.72rem' }}>{student.email}</div>
//                           </div>
//                         )}
//                       </td>

//                       {matrixChefs.map((chef) => {
//                         const cellKey = `${student.key}__${chef}`;
//                         const cellRdvs = matrixData.get(cellKey) || [];
//                         return (
//                           <td
//                             key={chef}
//                             className={`matrix-cell ${cellRdvs.length ? 'matrix-cell-filled' : 'matrix-cell-empty'}`}
//                           >
//                             {cellRdvs.length ? (
//                               cellRdvs.map((r) => (
//                                 <div key={r.id} className="matrix-slot">
//                                   {/* <span className="matrix-slot-date">{r.date}</span> */}
//                                   <span className="matrix-slot-date">
//                                     {new Date(r.date).toLocaleDateString('fr-FR', {
//                                       day: '2-digit',
//                                       month: '2-digit'
//                                     })}
//                                   </span>
//                                   <span className="matrix-slot-time">{r.heure_debut}</span>
//                                 </div>
//                               ))
//                             ) : (
//                               <span className="matrix-empty-dash">—</span>
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}

//                   {matrixStudents.length === 0 && (
//                     <tr>
//                       <td colSpan={matrixChefs.length + 1} className="text-center py-5">
//                         <div style={{ fontSize: '2.5rem' }}>✨</div>
//                         <div className="mt-3 fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>Aucun rendez-vous trouvé</div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal Confirmation Réinitialisation Planning */}
//       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered contentClassName="radar-modal-content">
//         <div className="radar-modal-header" style={{ background: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
//           <button type="button" className="radar-modal-close" onClick={() => setShowResetModal(false)}>✕</button>
//           <div className="radar-modal-eyebrow" style={{ color: '#f87171' }}>Zone d'administration</div>
//           <h4 className="radar-modal-title" style={{ color: '#ffffff', margin: 0 }}>🗑️ Vider le planning des rendez-vous</h4>
//         </div>
//         <div className="radar-modal-body" style={{ minHeight: 'auto', padding: '1.5rem' }}>
//           <p className="text-light">
//             Voulez-vous supprimer les créneaux de rendez-vous générés dans la base de données ?
//           </p>

//           <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
//             <Form.Check
//               type="radio"
//               id="reset-all"
//               name="reset-choice"
//               label="Supprimer TOUS les rendez-vous de la base"
//               checked={!resetRangeOnly}
//               onChange={() => setResetRangeOnly(false)}
//               className="mb-2 text-white"
//             />
//             <Form.Check
//               type="radio"
//               id="reset-range"
//               name="reset-choice"
//               label={`Supprimer uniquement la période sélectionnée (du ${dateDebut} au ${dateFin})`}
//               checked={resetRangeOnly}
//               onChange={() => setResetRangeOnly(true)}
//               className="text-white"
//             />
//           </div>

//           <p className="text-muted small mb-0">
//             ⚠️ Cette action est irréversible. Les disponibilités et sélections resteront intactes.
//           </p>
//         </div>
//         <div className="radar-modal-footer">
//           <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
//             Annuler
//           </Button>
//           <Button className="btn-danger-pill" onClick={handleResetSchedule} disabled={resetting}>
//             {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la suppression'}
//           </Button>
//         </div>
//       </Modal>

//       {/* Modal Radar — profil de compétences */}
//       <Modal
//         show={modalOpen}
//         onHide={() => setModalOpen(false)}
//         size="lg"
//         centered
//         contentClassName="radar-modal-content"
//       >
//         <div className="radar-modal-header">
//           <button
//             type="button"
//             className="radar-modal-close"
//             onClick={() => setModalOpen(false)}
//             aria-label="Fermer"
//           >
//             ✕
//           </button>
//           <div className="radar-modal-eyebrow">Profil de compétences</div>
//           <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
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
//             <div className="text-center py-5">
//               <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
//               <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
//             </div>
//           ) : modalError ? (
//             <Alert variant="warning" className="text-center m-3 mb-0">
//               {modalError}
//             </Alert>
//           ) : (
//             <div style={{ position: 'relative', width: '100%', height: '400px' }}>
//               <Radar data={radarChartData} options={radarOptions} />
//             </div>
//           )}
//         </div>

//         <div className="radar-modal-footer">
//           <small className="text-muted font-monospace">
//             {selectedEtudiantInfo?.email}
//           </small>
//           <Button variant="secondary" onClick={() => setModalOpen(false)}>
//             Fermer
//           </Button>
//         </div>
//       </Modal>
//     </>
//   );
// }

import React, { useState, useMemo } from 'react';
import {
  Table,
  Button,
  Alert,
  Spinner,
  Form,
  Card,
  Row,
  Col,
  InputGroup,
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
import { useAuth } from '../context/AuthContext';
import { useRealtimeRendezVous } from '../services/useRealtimeRendezVous';
import {
  genererRendezVous,
  resetAllRendezVous,
  fetchAptitudesByEtudiant,
  fetchApetencesByEtudiant,
  getDocumentPublicUrl,
} from '../services/supabase';

// Enregistrement des composants Chart.js pour le Radar
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Formate une date en "JJ/MM" pour un affichage compact dans la matrice
function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
  if (iso) return `${iso[3]}/${iso[2]}`;
  const parts = String(dateStr).split('/');
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return dateStr;
}

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

export default function RendezVousPage() {
  const { currentUser, isAdmin, isChef, chefId, chefInfo, getIdToken } = useAuth();
  const { rendezVous, loading, error, refresh } = useRealtimeRendezVous();

  // Logique de génération (Admin)
  const [dateDebut, setDateDebut] = useState(() => new Date().toISOString().slice(0, 10));
  const [dateFin, setDateFin] = useState(() => new Date().toISOString().slice(0, 10));
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [genResult, setGenResult] = useState(null);

  // État Réinitialisation (Reset planning)
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetRangeOnly, setResetRangeOnly] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Filtres en temps réel
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChef, setSelectedChef] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  // État du Modal Radar Étudiant
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedEtudiantInfo, setSelectedEtudiantInfo] = useState(null);
  const [aptitudesData, setAptitudesData] = useState(null);
  const [apetencesData, setApetencesData] = useState(null);
  const [modalError, setModalError] = useState(null);

  // Filtrage selon le profil connecté :
  const visibles = useMemo(() => {
    if (isAdmin) {
      return rendezVous;
    }
    if (isChef) {
      return rendezVous.filter(
        (r) =>
          r.chef_de_projet_id === chefId ||
          r.chef_de_projet?.toLowerCase() === chefInfo?.nom?.toLowerCase()
      );
    }
    return rendezVous.filter((r) => r.email_etudiant?.toLowerCase() === currentUser?.toLowerCase());
  }, [rendezVous, isAdmin, isChef, chefId, chefInfo, currentUser]);

  const uniqueChefs = useMemo(() => {
    const chefs = new Set(visibles.map((r) => r.chef_de_projet).filter(Boolean));
    return Array.from(chefs).sort();
  }, [visibles]);

  const uniqueDates = useMemo(() => {
    const dates = new Set(visibles.map((r) => r.date).filter(Boolean));
    return Array.from(dates).sort();
  }, [visibles]);

  const filteredRdv = useMemo(() => {
    return visibles.filter((r) => {
      if (selectedChef !== 'all' && r.chef_de_projet !== selectedChef) return false;
      if (selectedDateFilter !== 'all' && r.date !== selectedDateFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchEtud = r.etudiant?.toLowerCase().includes(query);
        const matchEmail = r.email_etudiant?.toLowerCase().includes(query);
        const matchChef = r.chef_de_projet?.toLowerCase().includes(query);
        if (!matchEtud && !matchEmail && !matchChef) return false;
      }
      return true;
    });
  }, [visibles, selectedChef, selectedDateFilter, searchQuery]);

  // --- Construction de la matrice Étudiants (lignes) x Chefs de projet (colonnes) ---
  const matrixChefs = useMemo(() => {
    const chefs = new Set(filteredRdv.map((r) => r.chef_de_projet).filter(Boolean));
    return Array.from(chefs).sort();
  }, [filteredRdv]);

  const matrixStudents = useMemo(() => {
    const map = new Map();
    filteredRdv.forEach((r) => {
      const key = r.etudiant_id || r.email_etudiant || r.etudiant;
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          key,
          id: r.etudiant_id,
          nom: r.etudiant,
          email: r.email_etudiant,
          cv_path: r.cv_path,
          lm_path: r.lm_path,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
  }, [filteredRdv]);

  const matrixData = useMemo(() => {
    const map = new Map();
    filteredRdv.forEach((r) => {
      const studentKey = r.etudiant_id || r.email_etudiant || r.etudiant;
      if (!studentKey || !r.chef_de_projet) return;
      const cellKey = `${studentKey}__${r.chef_de_projet}`;
      if (!map.has(cellKey)) map.set(cellKey, []);
      map.get(cellKey).push(r);
    });
    return map;
  }, [filteredRdv]);

  // Ouverture du Popup Radar
  const handleOpenStudentRadar = async (etudiant_id, etudiantName, email) => {
    if (!etudiant_id) return;
    setSelectedEtudiantInfo({ id: etudiant_id, nom: etudiantName, email });
    setModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    setAptitudesData(null);
    setApetencesData(null);

    try {
      const [aptitudes, apetences] = await Promise.all([
        fetchAptitudesByEtudiant(etudiant_id),
        fetchApetencesByEtudiant(etudiant_id),
      ]);

      if (!aptitudes && !apetences) {
        setModalError("Aucune compétence ni appétence n'a été importée pour cet étudiant.");
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

  // Données du graphique Radar
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
          backgroundColor: 'rgba(45, 212, 191, 0.22)',
          borderColor: '#2dd4bf',
          borderWidth: 2.5,
          pointBackgroundColor: '#2dd4bf',
          pointBorderColor: '#0b1020',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Appétences (Intérêt)',
          data: apeValues,
          backgroundColor: 'rgba(244, 63, 94, 0.18)',
          borderColor: '#f43f5e',
          borderWidth: 2.5,
          pointBackgroundColor: '#f43f5e',
          pointBorderColor: '#0b1020',
          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [aptitudesData, apetencesData]);

  const radarAverages = useMemo(() => {
    const avg = (values) => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
    const aptValues = COMPETENCE_KEYS.map((c) => aptitudesData?.[c.key] ?? 0);
    const apeValues = COMPETENCE_KEYS.map((c) => apetencesData?.[c.key] ?? 0);
    return { aptitude: avg(aptValues), appetence: avg(apeValues) };
  }, [aptitudesData, apetencesData]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        suggestedMax: 4,
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent',
          color: '#8892ab',
          font: { size: 10 },
        },
        grid: { color: 'rgba(148, 163, 184, 0.14)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
        pointLabels: { color: '#eef1f8', font: { size: 11, weight: '600' } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#161c30',
        borderColor: 'rgba(148, 163, 184, 0.25)',
        borderWidth: 1,
        titleColor: '#f5f7fc',
        bodyColor: '#c9d0e0',
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  // Export Excel
  const handleExportExcel = () => {
    if (filteredRdv.length === 0) {
      alert('Aucun rendez-vous à exporter.');
      return;
    }

    const exportRows = filteredRdv.map((r) => ({
      'Date': r.date,
      'Heure de Début': r.heure_debut,
      'Heure de Fin': r.heure_fin,
      'Créneau': `${r.heure_debut} - ${r.heure_fin}`,
      'Chef de Projet': r.chef_de_projet || '',
      'Étudiant': r.etudiant || '',
      'Email Étudiant': r.email_etudiant || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet['!cols'] = [
      { wch: 14 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 28 },
      { wch: 28 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning Rendez-vous');
    XLSX.writeFile(workbook, `planning_rendez_vous_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Génération du planning (Admin)
  const handleGenerate = async () => {
    const confirmation = window.confirm(
      `⚠️ Attention : Cela va réinitialiser et remplacer tous les rendez-vous existants du ${dateDebut} au ${dateFin}.\n\nSouhaitez-vous continuer ?`
    );
    if (!confirmation) return;

    setGenerating(true);
    setGenError(null);
    setGenResult(null);
    try {
      const token = await getIdToken();
      const result = await genererRendezVous(dateDebut, dateFin, token);
      setGenResult(result.stats);
      await refresh();
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Action de Réinitialisation / Purge du planning
  const handleResetSchedule = async () => {
    try {
      setResetting(true);
      setGenError(null);
      if (resetRangeOnly) {
        await resetAllRendezVous(dateDebut, dateFin);
      } else {
        await resetAllRendezVous();
      }
      await refresh();
      setShowResetModal(false);
    } catch (err) {
      setGenError(err.message || 'Erreur lors de la suppression du planning.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --canvas-bg: #090d16;
          --panel-bg: rgba(18, 24, 38, 0.88);
          --panel-solid: #121827;
          --panel-raised: #182033;
          --border-subtle: rgba(148, 163, 184, 0.12);
          --border-strong: rgba(148, 163, 184, 0.24);
          --text-primary: #f8fafc;
          --text-muted: #94a3b8;
          --text-faint: #64748b;

          /* Accents modernes et professionnels */
          --accent-cyan: #06b6d4;
          --accent-cyan-soft: rgba(6, 182, 212, 0.15);
          --accent-teal: #14b8a6;
          --accent-teal-soft: rgba(20, 184, 166, 0.15);
          --accent-indigo: #6366f1;
          --accent-indigo-soft: rgba(99, 102, 241, 0.15);
          --accent-amber: #f59e0b;
          --accent-amber-soft: rgba(245, 158, 11, 0.15);
          --accent-emerald: #10b981;
          --accent-emerald-soft: rgba(16, 185, 129, 0.15);
          --accent-rose: #f43f5e;
          --accent-danger: #ef4444;
          --accent-danger-soft: rgba(239, 68, 68, 0.15);
        }

        .wow-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 1.5rem 1.25rem 3rem 1.25rem;
          color: var(--text-primary);
          background:
            radial-gradient(1000px 480px at 5% -5%, rgba(99, 102, 241, 0.08), transparent 60%),
            radial-gradient(900px 480px at 95% 0%, rgba(6, 182, 212, 0.08), transparent 55%),
            var(--canvas-bg);
          min-height: calc(100vh - 60px);
        }

        /* Cartes & Conteneurs */
        .glass-card {
          background: var(--panel-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        /* Cartes KPI Pro */
        .kpi-card {
          padding: 1.15rem 1.25rem;
          border-radius: 14px;
          background: var(--panel-raised);
          border: 1px solid var(--border-subtle);
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.35);
          box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.4);
        }
        .kpi-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          font-weight: 700;
        }
        .kpi-val {
          font-size: 1.85rem;
          font-weight: 800;
          line-height: 1.1;
          margin-top: 0.25rem;
        }

        /* Générateur Admin */
        .generator-box {
          background:
            radial-gradient(600px 220px at 0% 0%, rgba(99, 102, 241, 0.16), transparent 60%),
            radial-gradient(600px 220px at 100% 100%, rgba(6, 182, 212, 0.12), transparent 60%),
            var(--panel-raised);
          border: 1px solid var(--border-strong);
          border-radius: 16px;
        }

        /* Boutons d'Action */
        .btn-glow {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%);
          border: none;
          color: #ffffff;
          font-weight: 700;
          border-radius: 10px;
          box-shadow: 0 4px 18px rgba(79, 70, 229, 0.35);
          transition: all 0.2s ease;
        }
        .btn-glow:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(79, 70, 229, 0.5);
          color: #ffffff;
        }

        .btn-excel {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border: none;
          color: #ffffff;
          font-weight: 700;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
          transition: all 0.2s ease;
        }
        .btn-excel:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
          color: #ffffff;
        }

        .btn-danger-pill {
          background: var(--accent-danger-soft) !important;
          color: #fca5a5 !important;
          border: 1px solid rgba(239, 68, 68, 0.35) !important;
          border-radius: 10px !important;
          font-weight: 700 !important;
          transition: all 0.2s ease;
        }
        .btn-danger-pill:hover:not(:disabled) {
          background: #dc2626 !important;
          color: #ffffff !important;
          border-color: #dc2626 !important;
        }

        /* Tableau Pro (base) */
        .wow-table {
          background: transparent !important;
          color: var(--text-primary) !important;
          font-size: 0.84rem;
        }
        .wow-table thead th {
          background: #0f1524 !important;
          color: var(--text-muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.85rem 1rem;
          border-bottom: 2px solid rgba(6, 182, 212, 0.3) !important;
          font-weight: 700;
        }
        .wow-table tbody tr {
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color 0.15s ease;
        }
        .wow-table tbody tr:hover {
          background-color: rgba(99, 102, 241, 0.06) !important;
        }
        .wow-table tbody td {
          padding: 0.75rem 1rem;
          vertical-align: middle;
        }

        /* ===== Matrice Étudiants x Chefs de projet (version compacte) ===== */
        .matrix-scroll-wrapper {
          max-height: 72vh;
          overflow: auto;
        }
        .matrix-table {
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
        }
        .matrix-table thead th {
          text-align: center;
          white-space: nowrap;
          position: sticky;
          top: 0;
        }
        .matrix-table thead th.matrix-corner {
          left: 0;
          z-index: 5;
          text-align: left;
          width: 130px;
          min-width: 130px;
          max-width: 130px;
          padding: 0.55rem 0.5rem;
          background: #0f1524 !important;
          border-right: 1px solid var(--border-strong) !important;
        }
        .matrix-table thead th.matrix-chef-col {
          z-index: 3;
          width: 80px;
          min-width: 80px;
          max-width: 80px;
          padding: 0.5rem 0.2rem;
          background: linear-gradient(180deg, rgba(99, 102, 241, 0.18) 0%, #0f1524 100%) !important;
          border-bottom: 2px solid var(--accent-indigo) !important;
          border-left: 1px solid var(--border-subtle);
        }
        .matrix-chef-abbr {
          display: inline-block;
          color: #c7d2fe;
          font-weight: 800;
          font-size: 0.74rem;
          letter-spacing: 0.05em;
          cursor: default;
        }

        .matrix-table tbody td.matrix-student-cell {
          position: sticky;
          left: 0;
          z-index: 2;
          background: #111729 !important;
          border-right: 1px solid var(--border-strong);
          width: 130px;
          min-width: 130px;
          max-width: 130px;
          padding: 0.5rem 0.5rem;
        }
        .matrix-table tbody tr:hover td.matrix-student-cell {
          background: #141c33 !important;
        }
        .matrix-student-block {
          display: flex;
          flex-direction: column;
        }
        .matrix-student-info {
          overflow: hidden;
        }
        .matrix-student-info .student-name-link {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        .matrix-cell {
          text-align: center;
          width: 80px;
          min-width: 80px;
          max-width: 80px;
          padding: 0.3rem 0.15rem;
          vertical-align: middle;
          border-left: 1px solid var(--border-subtle);
        }
        .matrix-cell-filled {
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(99, 102, 241, 0.07));
          box-shadow: inset 3px 0 0 var(--accent-cyan);
        }
        .matrix-cell-empty {
          opacity: 0.3;
        }
        .matrix-slot {
          font-family: 'JetBrains Mono', monospace;
          cursor: default;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .matrix-slot-date {
          font-size: 0.6rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .matrix-slot-time {
          font-size: 0.78rem;
          color: #38bdf8;
          font-weight: 700;
        }
        .matrix-slot + .matrix-slot {
          margin-top: 3px;
          padding-top: 3px;
          border-top: 1px dashed var(--border-subtle);
        }
        .matrix-empty-dash {
          color: var(--text-faint);
          font-size: 0.95rem;
        }

        /* Badges & Pills */
        .time-pill {
          background: rgba(6, 182, 212, 0.12);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #38bdf8;
          padding: 5px 12px;
          border-radius: 8px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .date-pill {
          background: var(--panel-raised);
          border: 1px solid var(--border-strong);
          color: #e2e8f0;
          padding: 5px 10px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.78rem;
          font-weight: 600;
        }

        .chef-cell-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .chef-avatar-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #d97706, #f59e0b);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.78rem;
          color: #1a1202;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
        }
        .chef-name-text {
          color: #fde68a;
          font-weight: 700;
        }

        .avatar-student-btn {
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px;
          border-radius: 8px;
        }
        .avatar-student-btn:hover {
          background: var(--accent-indigo-soft);
          transform: translateX(2px);
        }

        .student-avatar-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.78rem;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
        }

        .student-name-link {
          color: #2dd4bf;
          font-weight: 700;
          text-decoration: none;
        }
        .student-name-link:hover {
          text-decoration: underline;
        }

        /* Boutons Documents CV / LM */
        .doc-badge-btn {
          background: var(--accent-teal-soft);
          border: 1px solid rgba(20, 184, 166, 0.35);
          color: #2dd4bf;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          transition: all 0.15s ease;
        }
        .doc-badge-btn:hover {
          background: #14b8a6;
          color: #042f2e;
          border-color: #14b8a6;
        }
        .doc-badge-disabled {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          color: var(--text-faint);
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          cursor: not-allowed;
        }

        /* Inputs & Filtres */
        .custom-input {
          background: var(--panel-raised) !important;
          border: 1px solid var(--border-strong) !important;
          color: var(--text-primary) !important;
          border-radius: 8px;
          font-size: 0.85rem;
        }
        .custom-input:focus {
          background: var(--panel-raised) !important;
          color: var(--text-primary) !important;
          border-color: var(--accent-cyan) !important;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.18) !important;
        }

        /* Modal Radar & Reset */
        .radar-modal-content {
          background: var(--panel-solid) !important;
          border: 1px solid var(--border-strong) !important;
          border-radius: 16px !important;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0,0,0,0.6);
        }
        .radar-modal-header {
          position: relative;
          padding: 1.25rem 1.5rem;
          background:
            radial-gradient(600px 220px at 15% 0%, rgba(99, 102, 241, 0.25), transparent 60%),
            radial-gradient(600px 220px at 100% 0%, rgba(6, 182, 212, 0.18), transparent 60%),
            var(--panel-raised);
          border-bottom: 1px solid var(--border-subtle);
        }
        .radar-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--border-strong);
          background: rgba(255,255,255,0.04);
          color: var(--text-primary);
          font-size: 0.8rem;
          line-height: 1;
          cursor: pointer;
        }
        .radar-modal-close:hover { background: rgba(255,255,255,0.1); }
        .radar-modal-eyebrow {
          text-transform: uppercase;
          letter-spacing: 1.2px;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--accent-cyan);
          margin-bottom: 0.2rem;
        }
        .radar-modal-title {
          color: var(--text-primary);
          font-weight: 700;
          margin: 0 0 0.85rem 0;
          font-size: 1.25rem;
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
          padding: 0.35rem 0.7rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
        }
        .radar-stat-dot { width: 8px; height: 8px; border-radius: 50%; }
        .radar-stat-cyan .radar-stat-dot { background: var(--accent-cyan); box-shadow: 0 0 8px var(--accent-cyan); }
        .radar-stat-rose .radar-stat-dot { background: var(--accent-rose); box-shadow: 0 0 8px var(--accent-rose); }
        .radar-stat-label { color: var(--text-muted); font-size: 0.75rem; font-weight: 600; }
        .radar-stat-value { color: var(--text-primary); font-weight: 800; font-size: 0.9rem; }
        .radar-stat-value small { color: var(--text-muted); font-weight: 500; }
        .radar-modal-body {
          padding: 1.5rem;
          min-height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .radar-modal-footer {
          padding: 0.9rem 1.5rem;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

      <Navbar />

      <div className="wow-container">
        {/* Titre & Barre d'actions */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.6rem' }}>📅</span>
              <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>
                {isAdmin
                  ? 'Planning des Rendez-vous (Admin)'
                  : isChef
                  ? `Mes Rendez-vous (${chefInfo?.nom || 'Chef de projet'})`
                  : 'Mes Rendez-vous'}
              </h2>
            </div>
            <p className="text-muted small mt-1 mb-0">
              {(isAdmin || isChef) ? (
                <>💡 <em>Astuce : Cliquez sur le nom d'un étudiant pour voir son Radar de compétences, ou sur 📄 CV / ✉️ LM pour ouvrir ses documents.</em></>
              ) : (
                <>Consultez vos horaires d'entretiens et les chefs de projet associés.</>
              )}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Bouton Vider le planning (Admin uniquement) */}
            {isAdmin && (
              <Button
                className="btn-danger-pill d-flex align-items-center gap-2 px-3 py-2"
                onClick={() => setShowResetModal(true)}
                disabled={visibles.length === 0 || resetting}
                title="Supprimer les rendez-vous générés"
              >
                <span>🗑️</span>
                <span>Vider planning ({visibles.length})</span>
              </Button>
            )}

            <Button
              className="btn-excel d-flex align-items-center gap-2 px-3 py-2"
              onClick={handleExportExcel}
              disabled={filteredRdv.length === 0}
            >
              <span>📊</span>
              <span>Exporter Excel ({filteredRdv.length})</span>
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              onClick={refresh}
              className="d-flex align-items-center gap-2 px-3 py-2"
              style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', borderColor: 'var(--border-strong)' }}
            >
              <span>🔄</span> Actualiser
            </Button>
          </div>
        </div>

        {/* Panneau Admin : Générateur */}
        {isAdmin && (
          <div className="generator-box p-4 mb-4 shadow-lg">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <span
                className="badge rounded-pill px-3 py-2 text-uppercase fw-bold"
                style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)' }}
              >
                Mode Administrateur
              </span>
              <span className="fw-semibold fs-5" style={{ color: 'var(--text-primary)' }}>Générer le planning global</span>
            </div>

            <Row className="g-3 align-items-end">
              <Col xs={12} sm={6} md={3}>
                <Form.Label className="small text-muted fw-semibold">📅 Date de début</Form.Label>
                <Form.Control
                  type="date"
                  className="custom-input"
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                />
              </Col>
              <Col xs={12} sm={6} md={3}>
                <Form.Label className="small text-muted fw-semibold">📅 Date de fin</Form.Label>
                <Form.Control
                  type="date"
                  className="custom-input"
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                />
              </Col>
              <Col xs={12} md={6}>
                <Button
                  className="btn-glow w-100 py-2 d-flex justify-content-center align-items-center gap-2"
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <Spinner size="sm" animation="border" />
                      <span>Optimisation et placement des créneaux...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Lancer la génération des rendez-vous</span>
                    </>
                  )}
                </Button>
              </Col>
            </Row>

            {genError && (
              <Alert variant="danger" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenError(null)}>
                <strong>Erreur : </strong> {genError}
              </Alert>
            )}
            {genResult && (
              <Alert variant="success" className="mt-3 py-2 small border-0" dismissible onClose={() => setGenResult(null)}>
                🎉 <strong>{genResult.rdvProgrammes}</strong> créneaux programmés sur{' '}
                <strong>{genResult.totalSelections}</strong> vœux ({genResult.rdvNonProgrammes} non assignés).
              </Alert>
            )}
          </div>
        )}

        {/* Cartes KPI */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <div className="kpi-card text-center">
              <div className="kpi-label">Total Rendez-vous</div>
              <div className="kpi-val" style={{ color: 'var(--accent-cyan)' }}>{filteredRdv.length}</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="kpi-card text-center">
              <div className="kpi-label">Chefs de Projet</div>
              <div className="kpi-val" style={{ color: 'var(--accent-emerald)' }}>{uniqueChefs.length}</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="kpi-card text-center">
              <div className="kpi-label">Jours de Passage</div>
              <div className="kpi-val" style={{ color: 'var(--accent-amber)' }}>{uniqueDates.length}</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="kpi-card text-center">
              <div className="kpi-label">Affichage</div>
              <div className="kpi-val" style={{ color: 'var(--text-primary)' }}>
                {filteredRdv.length} <span className="fs-6 text-muted" style={{ fontWeight: 500 }}>/ {visibles.length}</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Barre de Filtres */}
        <Card className="glass-card mb-4 p-3 border-0">
          <Row className="g-2 align-items-center">
            <Col xs={12} md={4}>
              <InputGroup size="sm">
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-2">🔍</InputGroup.Text>
                <Form.Control
                  placeholder="Rechercher étudiant, email, chef..."
                  className="custom-input border-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button variant="link" className="text-muted text-decoration-none" onClick={() => setSearchQuery('')}>✕</Button>
                )}
              </InputGroup>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Select
                size="sm"
                className="custom-input"
                value={selectedChef}
                onChange={(e) => setSelectedChef(e.target.value)}
              >
                <option value="all">👨‍🏫 Tous les chefs ({uniqueChefs.length})</option>
                {uniqueChefs.map((chef) => (
                  <option key={chef} value={chef}>{chef}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} sm={6} md={3}>
              <Form.Select
                size="sm"
                className="custom-input"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
              >
                <option value="all">📅 Toutes les dates ({uniqueDates.length})</option>
                {uniqueDates.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={2} className="text-md-end">
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100 py-1 rounded-3"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedChef('all');
                  setSelectedDateFilter('all');
                }}
                disabled={!searchQuery && selectedChef === 'all' && selectedDateFilter === 'all'}
              >
                Réinitialiser
              </Button>
            </Col>
          </Row>
        </Card>

        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

        {/* Matrice Étudiants x Chefs de projet */}
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
            <p className="mt-3 text-muted">Synchronisation en temps réel...</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="matrix-scroll-wrapper">
              <Table hover size="sm" className="wow-table matrix-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th className="matrix-corner">Étudiant</th>
                    {matrixChefs.map((chef) => (
                      <th key={chef} className="matrix-chef-col" title={chef}>
                        <span className="matrix-chef-abbr">{chef.slice(0, 3).toUpperCase()}</span>
                      </th>
                    ))}
                    {matrixChefs.length === 0 && <th className="matrix-chef-col">Chef de projet</th>}
                  </tr>
                </thead>
                <tbody>
                  {matrixStudents.map((student) => (
                    <tr key={student.key}>
                      <td className="matrix-student-cell">
                        {(isAdmin || isChef) ? (
                          <div className="matrix-student-block">
                            <div
                              className="avatar-student-btn"
                              title="Cliquer pour afficher le Radar des compétences"
                              onClick={() => handleOpenStudentRadar(student.id, student.nom, student.email)}
                            >
                              <span className="student-avatar-icon">
                                {student.nom?.charAt(0) || 'E'}
                              </span>
                              <div className="matrix-student-info">
                                <div className="student-name-link">
                                  {student.nom}
                                </div>
                              </div>
                            </div>

                            {/* Boutons Documents CV / LM */}
                            <div className="d-flex gap-1 mt-1">
                              {student.cv_path ? (
                                <a
                                  href={getDocumentPublicUrl(student.cv_path)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="doc-badge-btn"
                                  title="Ouvrir le CV (PDF)"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  📄 CV
                                </a>
                              ) : (
                                <span className="doc-badge-disabled" title="Aucun CV déposé">
                                  📄 CV
                                </span>
                              )}

                              {student.lm_path ? (
                                <a
                                  href={getDocumentPublicUrl(student.lm_path)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="doc-badge-btn"
                                  title="Ouvrir la Lettre de Motivation (PDF)"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  ✉️ LM
                                </a>
                              ) : (
                                <span className="doc-badge-disabled" title="Aucune LM déposée">
                                  ✉️ LM
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>{student.nom}</div>
                          </div>
                        )}
                      </td>

                      {matrixChefs.map((chef) => {
                        const cellKey = `${student.key}__${chef}`;
                        const cellRdvs = matrixData.get(cellKey) || [];
                        return (
                          <td
                            key={chef}
                            className={`matrix-cell ${cellRdvs.length ? 'matrix-cell-filled' : 'matrix-cell-empty'}`}
                          >
                            {cellRdvs.length ? (
                              cellRdvs.map((r) => (
                                <div
                                  key={r.id}
                                  className="matrix-slot"
                                  title={`${r.date} · ${r.heure_debut} – ${r.heure_fin}`}
                                >
                                  <span className="matrix-slot-date">{formatShortDate(r.date)}</span>
                                  <span className="matrix-slot-time">{r.heure_debut}</span>
                                </div>
                              ))
                            ) : (
                              <span className="matrix-empty-dash">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {matrixStudents.length === 0 && (
                    <tr>
                      <td colSpan={matrixChefs.length + 1} className="text-center py-5">
                        <div style={{ fontSize: '2.5rem' }}>✨</div>
                        <div className="mt-3 fw-bold fs-5" style={{ color: 'var(--text-primary)' }}>Aucun rendez-vous trouvé</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Confirmation Réinitialisation Planning */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered contentClassName="radar-modal-content">
        <div className="radar-modal-header" style={{ background: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <button type="button" className="radar-modal-close" onClick={() => setShowResetModal(false)}>✕</button>
          <div className="radar-modal-eyebrow" style={{ color: '#f87171' }}>Zone d'administration</div>
          <h4 className="radar-modal-title" style={{ color: '#ffffff', margin: 0 }}>🗑️ Vider le planning des rendez-vous</h4>
        </div>
        <div className="radar-modal-body" style={{ minHeight: 'auto', padding: '1.5rem' }}>
          <p className="text-light">
            Voulez-vous supprimer les créneaux de rendez-vous générés dans la base de données ?
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
            <Form.Check
              type="radio"
              id="reset-all"
              name="reset-choice"
              label="Supprimer TOUS les rendez-vous de la base"
              checked={!resetRangeOnly}
              onChange={() => setResetRangeOnly(false)}
              className="mb-2 text-white"
            />
            <Form.Check
              type="radio"
              id="reset-range"
              name="reset-choice"
              label={`Supprimer uniquement la période sélectionnée (du ${dateDebut} au ${dateFin})`}
              checked={resetRangeOnly}
              onChange={() => setResetRangeOnly(true)}
              className="text-white"
            />
          </div>

          <p className="text-muted small mb-0">
            ⚠️ Cette action est irréversible. Les disponibilités et sélections resteront intactes.
          </p>
        </div>
        <div className="radar-modal-footer">
          <Button variant="secondary" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button className="btn-danger-pill" onClick={handleResetSchedule} disabled={resetting}>
            {resetting ? <Spinner size="sm" animation="border" /> : 'Confirmer la suppression'}
          </Button>
        </div>
      </Modal>

      {/* Modal Radar — profil de compétences */}
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        size="lg"
        centered
        contentClassName="radar-modal-content"
      >
        <div className="radar-modal-header">
          <button
            type="button"
            className="radar-modal-close"
            onClick={() => setModalOpen(false)}
            aria-label="Fermer"
          >
            ✕
          </button>
          <div className="radar-modal-eyebrow">Profil de compétences</div>
          <h4 className="radar-modal-title">{selectedEtudiantInfo?.nom}</h4>
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
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: 'var(--accent-cyan)' }} />
              <p className="mt-3 text-muted">Récupération des aptitudes et appétences...</p>
            </div>
          ) : modalError ? (
            <Alert variant="warning" className="text-center m-3 mb-0">
              {modalError}
            </Alert>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '400px' }}>
              <Radar data={radarChartData} options={radarOptions} />
            </div>
          )}
        </div>

        <div className="radar-modal-footer">
          <small className="text-muted font-monospace">
            {selectedEtudiantInfo?.email}
          </small>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Fermer
          </Button>
        </div>
      </Modal>
    </>
  );
}