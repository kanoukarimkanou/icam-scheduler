// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   Card,
//   Button,
//   Form,
//   Row,
//   Col,
//   Table,
//   Badge,
//   Alert,
//   Spinner,
//   Modal,
//   InputGroup,
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
// import Navbar from './Navbar';
// import {
//   fetchReferentielCompetences,
//   saveReferentielCompetence,
//   deleteReferentielCompetence,
//   resetReferentielToDefaults,
// } from '../services/supabase';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// export default function ParametresCompetencesPage() {
//   const [competences, setCompetences] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   // Formulaire d'ajout / modification
//   const [editingComp, setEditingComp] = useState(null); // null = mode ajout, objet = mode édition
//   const [formLabel, setFormLabel] = useState('');
//   const [formCode, setFormCode] = useState('');
//   const [formDesc, setFormDesc] = useState('');
//   const [formOrdre, setFormOrdre] = useState(1);
//   const [formActif, setFormActif] = useState(true);

//   // Modale de confirmation de suppression
//   const [deletingId, setDeletingId] = useState(null);
//   const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await fetchReferentielCompetences(false); // charge actives ET inactives
//       setCompetences(data || []);
//       setFormOrdre((data?.length || 0) + 1);
//     } catch (err) {
//       setError(err.message || 'Erreur lors du chargement des compétences.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   // Génération automatique du code à partir du libellé
//   const handleLabelChange = (val) => {
//     setFormLabel(val);
//     if (!editingComp) {
//       const generatedCode = val
//         .toLowerCase()
//         .normalize('NFD')
//         .replace(/[\u0300-\u036f]/g, '')
//         .replace(/[^a-z0-9]+/g, '_')
//         .replace(/^_+|_+$/g, '');
//       setFormCode(generatedCode);
//     }
//   };

//   const startEdit = (comp) => {
//     setEditingComp(comp);
//     setFormLabel(comp.label);
//     setFormCode(comp.code);
//     setFormDesc(comp.description || '');
//     setFormOrdre(comp.ordre);
//     setFormActif(comp.actif);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const cancelEdit = () => {
//     setEditingComp(null);
//     setFormLabel('');
//     setFormCode('');
//     setFormDesc('');
//     setFormOrdre(competences.length + 1);
//     setFormActif(true);
//   };

//   // Sauvegarde (Création / Édition)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formLabel.trim() || !formCode.trim()) {
//       setError('Le libellé et le code sont obligatoires.');
//       return;
//     }

//     try {
//       setSaving(true);
//       setError(null);

//       const payload = {
//         label: formLabel,
//         code: formCode,
//         description: formDesc,
//         ordre: formOrdre,
//         actif: formActif,
//       };
//       if (editingComp?.id) payload.id = editingComp.id;

//       await saveReferentielCompetence(payload);
//       setSuccessMsg(
//         editingComp
//           ? `Compétence « ${formLabel} » mise à jour avec succès.`
//           : `Nouvelle compétence « ${formLabel} » ajoutée au référentiel.`
//       );
//       cancelEdit();
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la sauvegarde.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Bascule active / inactive directe dans le tableau
//   const toggleActive = async (comp) => {
//     try {
//       setError(null);
//       await saveReferentielCompetence({ ...comp, actif: !comp.actif });
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la mise à jour.');
//     }
//   };

//   // Suppression
//   const confirmDelete = async () => {
//     if (!deletingId) return;
//     try {
//       setSaving(true);
//       setError(null);
//       await deleteReferentielCompetence(deletingId);
//       setDeletingId(null);
//       setSuccessMsg('Compétence supprimée du référentiel.');
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la suppression.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Réinitialisation aux 11 compétences standard
//   const handleResetDefaults = async () => {
//     try {
//       setSaving(true);
//       setError(null);
//       await resetReferentielToDefaults();
//       setShowResetDefaultsModal(false);
//       setSuccessMsg('Référentiel réinitialisé aux 11 compétences standard ICAM.');
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la réinitialisation.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Données du Radar de prévisualisation
//   const activeCompetences = useMemo(
//     () => competences.filter((c) => c.actif),
//     [competences]
//   );

//   const radarPreviewData = useMemo(() => {
//     return {
//       labels: activeCompetences.map((c) => c.label),
//       datasets: [
//         {
//           label: 'Aptitudes (Exemple)',
//           data: activeCompetences.map((_, i) => (i % 2 === 0 ? 3 : 4)),
//           backgroundColor: 'rgba(45, 212, 191, 0.22)',
//           borderColor: '#2dd4bf',
//           borderWidth: 2,
//           pointBackgroundColor: '#2dd4bf',
//         },
//         {
//           label: 'Appétences (Exemple)',
//           data: activeCompetences.map((_, i) => (i % 3 === 0 ? 4 : 2)),
//           backgroundColor: 'rgba(251, 111, 146, 0.20)',
//           borderColor: '#fb6f92',
//           borderWidth: 2,
//           pointBackgroundColor: '#fb6f92',
//         },
//       ],
//     };
//   }, [activeCompetences]);

//   const radarOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       r: {
//         min: 0,
//         max: 4,
//         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
//         grid: { color: 'rgba(148, 163, 184, 0.14)' },
//         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
//         pointLabels: { color: '#e7ebf5', font: { size: 10.5, weight: '600' } },
//       },
//     },
//     plugins: {
//       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 11, weight: 'bold' } } },
//     },
//   };

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
//           --accent-cyan: #29d3d3;
//           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
//           --accent-emerald: #35d0a0;
//           --accent-coral: #ff6b6b;
//         }

//         .comp-page-wrapper {
//           max-width: 100%;
//           margin: 0 auto;
//           padding: 1.25rem 1rem 3rem 1rem;
//           color: var(--text-primary);
//           background:
//             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
//             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
//             var(--canvas);
//           min-height: calc(100vh - 60px);
//         }
//         .comp-card {
//           background: var(--panel);
//           backdrop-filter: blur(16px);
//           border: 1px solid var(--border-subtle);
//           border-radius: 14px;
//         }
//         .comp-table {
//           font-size: 0.84rem;
//         }
//         .comp-table thead th {
//           background: var(--panel-solid);
//           color: var(--text-muted);
//           font-size: 0.72rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           border-bottom: 2px solid var(--accent-cyan-soft) !important;
//         }
//         .comp-input {
//           background: var(--panel-raised) !important;
//           border: 1px solid var(--border-strong) !important;
//           color: var(--text-primary) !important;
//           border-radius: 8px;
//         }
//         .comp-input:focus {
//           border-color: var(--accent-cyan) !important;
//           box-shadow: 0 0 0 3px var(--accent-cyan-soft) !important;
//         }
//         .modal-dark .modal-content {
//           background: #12161f !important;
//           border: 1px solid var(--border-strong);
//           border-radius: 16px;
//           color: var(--text-primary);
//         }
//       `}</style>

//       <Navbar />

//       <div className="comp-page-wrapper">
//         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//           <div>
//             <div className="d-flex align-items-center gap-2">
//               <span style={{ fontSize: '1.6rem' }}>⚙️</span>
//               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
//                 Référentiel des Compétences &amp; Appétences
//               </h2>
//             </div>
//             <small className="text-muted">
//               Configurez dynamiquement les compétences pour chaque promotion. Le Radar Chart et les classements s'adapteront automatiquement.
//             </small>
//           </div>

//           <div className="d-flex align-items-center gap-2">
//             <Button
//               variant="outline-secondary"
//               size="sm"
//               onClick={() => setShowResetDefaultsModal(true)}
//               className="px-3 py-2"
//             >
//               🔄 Restaurer les 11 compétences standard
//             </Button>
//             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
//               🔄 Actualiser
//             </Button>
//           </div>
//         </div>

//         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
//         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

//         <Row className="g-3">
//           {/* Formulaire d'ajout / édition */}
//           <Col lg={4}>
//             <Card className="comp-card p-3 shadow-sm mb-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5 className="fw-bold text-white mb-0">
//                   {editingComp ? '✏️ Modifier la compétence' : '➕ Nouvelle compétence'}
//                 </h5>
//                 {editingComp && (
//                   <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
//                     Annuler
//                   </Button>
//                 )}
//               </div>

//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-2">
//                   <Form.Label className="small text-muted fw-bold">Libellé affiché sur le Radar *</Form.Label>
//                   <Form.Control
//                     size="sm"
//                     className="comp-input"
//                     placeholder="Ex: Cybersécurité, Cloud AWS..."
//                     value={formLabel}
//                     onChange={(e) => handleLabelChange(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label className="small text-muted fw-bold">Code technique (identifiant) *</Form.Label>
//                   <Form.Control
//                     size="sm"
//                     className="comp-input font-monospace"
//                     placeholder="Ex: cybersecurite, cloud_aws..."
//                     value={formCode}
//                     onChange={(e) => setFormCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
//                     required
//                     disabled={Boolean(editingComp)}
//                   />
//                   <small className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>
//                     Utilisé pour les correspondances Moodle/CSV.
//                   </small>
//                 </Form.Group>

//                 <Row className="g-2 mb-2">
//                   <Col xs={6}>
//                     <Form.Label className="small text-muted fw-bold">Ordre (position)</Form.Label>
//                     <Form.Control
//                       type="number"
//                       size="sm"
//                       className="comp-input"
//                       value={formOrdre}
//                       min={1}
//                       onChange={(e) => setFormOrdre(parseInt(e.target.value, 10) || 1)}
//                     />
//                   </Col>
//                   <Col xs={6} className="d-flex align-items-end pb-1">
//                     <Form.Check
//                       type="switch"
//                       id="comp-actif-switch"
//                       label="Active"
//                       checked={formActif}
//                       onChange={(e) => setFormActif(e.target.checked)}
//                       className="text-white small fw-bold"
//                     />
//                   </Col>
//                 </Row>

//                 <Form.Group className="mb-3">
//                   <Form.Label className="small text-muted fw-bold">Description / Thématiques couvertes</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     size="sm"
//                     className="comp-input"
//                     placeholder="Mots-clés associés, description des projets..."
//                     value={formDesc}
//                     onChange={(e) => setFormDesc(e.target.value)}
//                   />
//                 </Form.Group>

//                 <Button
//                   type="submit"
//                   variant={editingComp ? 'info' : 'primary'}
//                   size="sm"
//                   className="w-100 fw-bold py-2"
//                   disabled={saving}
//                 >
//                   {saving ? <Spinner size="sm" animation="border" /> : editingComp ? '💾 Mettre à jour' : '➕ Ajouter au référentiel'}
//                 </Button>
//               </Form>
//             </Card>

//             {/* Prévisualisation en direct du Radar */}
//             <Card className="comp-card p-3 shadow-sm">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="small text-uppercase fw-bold text-muted">Aperçu du Radar Chart</span>
//                 <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
//               </div>
//               <div style={{ position: 'relative', width: '100%', height: '240px' }}>
//                 <Radar data={radarPreviewData} options={radarOptions} />
//               </div>
//             </Card>
//           </Col>

//           {/* Tableau de la liste des compétences */}
//           <Col lg={8}>
//             <Card className="comp-card overflow-hidden shadow-sm">
//               <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
//                 <span className="fw-bold text-white fs-6">
//                   Liste des Compétences ({competences.length} au total, {activeCompetences.length} actives)
//                 </span>
//                 <span className="small text-muted">
//                   Les compétences actives génèrent automatiquement les axes des graphiques Radar.
//                 </span>
//               </div>

//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="info" />
//                   <p className="mt-3 text-muted">Chargement du référentiel...</p>
//                 </div>
//               ) : competences.length === 0 ? (
//                 <div className="text-center py-5 text-muted">
//                   Aucune compétence configurée. Cliquez sur "Restaurer les 11 compétences standard" pour démarrer.
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <Table hover size="sm" className="comp-table mb-0 text-white align-middle text-nowrap">
//                     <thead>
//                       <tr>
//                         <th style={{ width: '50px', textAlign: 'center' }}>Ordre</th>
//                         <th>Libellé (Radar)</th>
//                         <th>Code Technique</th>
//                         <th style={{ textAlign: 'center' }}>Statut</th>
//                         <th style={{ width: '100px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {competences.map((comp) => (
//                         <tr key={comp.id} style={{ opacity: comp.actif ? 1 : 0.45 }}>
//                           <td style={{ textAlign: 'center' }} className="font-monospace fw-bold text-muted">
//                             {comp.ordre}
//                           </td>
//                           <td>
//                             <div className="fw-bold text-light">{comp.label}</div>
//                             {comp.description && (
//                               <small className="text-muted text-truncate d-block" style={{ maxWidth: '280px' }}>
//                                 {comp.description}
//                               </small>
//                             )}
//                           </td>
//                           <td>
//                             <code className="text-info">{comp.code}</code>
//                           </td>
//                           <td style={{ textAlign: 'center' }}>
//                             <Button
//                               variant={comp.actif ? 'outline-success' : 'outline-secondary'}
//                               size="sm"
//                               style={{ fontSize: '0.7rem', padding: '2px 8px' }}
//                               onClick={() => toggleActive(comp)}
//                               title="Cliquer pour activer/désactiver"
//                             >
//                               {comp.actif ? '✓ Active' : '✕ Inactive'}
//                             </Button>
//                           </td>
//                           <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
//                             <div className="d-flex gap-1 justify-content-end">
//                               <Button
//                                 variant="outline-light"
//                                 size="sm"
//                                 style={{ fontSize: '0.72rem', padding: '2px 6px' }}
//                                 onClick={() => startEdit(comp)}
//                                 title="Modifier"
//                               >
//                                 ✏️
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 style={{ fontSize: '0.72rem', padding: '2px 6px' }}
//                                 onClick={() => setDeletingId(comp.id)}
//                                 title="Supprimer"
//                               >
//                                 🗑️
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </div>

//       {/* Modale Confirmation Suppression */}
//       <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>🗑️ Supprimer la compétence</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="text-light mb-0">
//             Êtes-vous sûr de vouloir supprimer définitivement cette compétence du référentiel ?
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
//           <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modale Restauration aux valeurs par défaut */}
//       <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>🔄 Restaurer les compétences standard</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="text-light mb-0">
//             Voulez-vous réinitialiser le référentiel aux <strong>11 compétences officielles de l'ICAM</strong> ?
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setShowResetDefaultsModal(false)}>Annuler</Button>
//           <Button variant="info" size="sm" onClick={handleResetDefaults}>Restaurer</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Table,
  Badge,
  Alert,
  Spinner,
  Modal,
  InputGroup,
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
import Navbar from './Navbar';
import {
  fetchReferentielCompetences,
  saveReferentielCompetence,
  deleteReferentielCompetence,
  resetReferentielToDefaults,
} from '../services/supabase';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function ParametresCompetencesPage() {
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Formulaire d'ajout / modification
  const [editingComp, setEditingComp] = useState(null); // null = mode ajout, objet = mode édition
  const [formLabel, setFormLabel] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formOrdre, setFormOrdre] = useState(1);
  const [formActif, setFormActif] = useState(true);

  // Modale de confirmation de suppression
  const [deletingId, setDeletingId] = useState(null);
  const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReferentielCompetences(false); // charge actives ET inactives
      setCompetences(data || []);
      setFormOrdre((data?.length || 0) + 1);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des compétences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Génération automatique du code à partir du libellé
  const handleLabelChange = (val) => {
    setFormLabel(val);
    if (!editingComp) {
      const generatedCode = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setFormCode(generatedCode);
    }
  };

  const startEdit = (comp) => {
    setEditingComp(comp);
    setFormLabel(comp.label);
    setFormCode(comp.code);
    setFormDesc(comp.description || '');
    setFormOrdre(comp.ordre);
    setFormActif(comp.actif);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingComp(null);
    setFormLabel('');
    setFormCode('');
    setFormDesc('');
    setFormOrdre(competences.length + 1);
    setFormActif(true);
  };

  // Sauvegarde (Création / Édition)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formLabel.trim() || !formCode.trim()) {
      setError('Le libellé et le code sont obligatoires.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        label: formLabel,
        code: formCode,
        description: formDesc,
        ordre: formOrdre,
        actif: formActif,
      };
      if (editingComp?.id) payload.id = editingComp.id;

      await saveReferentielCompetence(payload);
      setSuccessMsg(
        editingComp
          ? `Compétence « ${formLabel} » mise à jour avec succès.`
          : `Nouvelle compétence « ${formLabel} » ajoutée au référentiel.`
      );
      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  // Bascule active / inactive directe dans le tableau
  const toggleActive = async (comp) => {
    try {
      setError(null);
      await saveReferentielCompetence({ ...comp, actif: !comp.actif });
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    }
  };

  // Suppression
  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setSaving(true);
      setError(null);
      await deleteReferentielCompetence(deletingId);
      setDeletingId(null);
      setSuccessMsg('Compétence supprimée du référentiel.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.');
    } finally {
      setSaving(false);
    }
  };

  // Réinitialisation aux 11 compétences standard
  const handleResetDefaults = async () => {
    try {
      setSaving(true);
      setError(null);
      await resetReferentielToDefaults();
      setShowResetDefaultsModal(false);
      setSuccessMsg('Référentiel réinitialisé aux 11 compétences standard ICAM.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation.');
    } finally {
      setSaving(false);
    }
  };

  // Données du Radar de prévisualisation
  const activeCompetences = useMemo(
    () => competences.filter((c) => c.actif),
    [competences]
  );

  const radarPreviewData = useMemo(() => {
    return {
      labels: activeCompetences.map((c) => c.label),
      datasets: [
        {
          label: 'Aptitudes (Exemple)',
          data: activeCompetences.map((_, i) => (i % 2 === 0 ? 3 : 4)),
          backgroundColor: 'rgba(45, 212, 191, 0.22)',
          borderColor: '#2dd4bf',
          borderWidth: 2,
          pointBackgroundColor: '#2dd4bf',
        },
        {
          label: 'Appétences (Exemple)',
          data: activeCompetences.map((_, i) => (i % 3 === 0 ? 4 : 2)),
          backgroundColor: 'rgba(251, 111, 146, 0.20)',
          borderColor: '#fb6f92',
          borderWidth: 2,
          pointBackgroundColor: '#fb6f92',
        },
      ],
    };
  }, [activeCompetences]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 4,
        ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
        grid: { color: 'rgba(148, 163, 184, 0.14)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
        pointLabels: { color: '#e7ebf5', font: { size: 10.5, weight: '600' } },
      },
    },
    plugins: {
      legend: { position: 'top', labels: { color: '#ffffff', font: { size: 11, weight: 'bold' } } },
    },
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
          --accent-cyan: #29d3d3;
          --accent-cyan-soft: rgba(41, 211, 211, 0.16);
          --accent-emerald: #35d0a0;
          --accent-coral: #ff6b6b;
        }

        .comp-page-wrapper {
          max-width: 100%;
          margin: 0 auto;
          padding: 1.25rem 1rem 3rem 1rem;
          color: var(--text-primary);
          background:
            radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
            radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
            var(--canvas);
          min-height: calc(100vh - 60px);
        }
        .comp-card {
          background: var(--panel);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
        }

        /* ===== Tableau des compétences — style pro moderne ===== */
        
        .comp-table {
        --bs-table-bg: #0d2340 !important;
        --bs-table-color: #4ade80 !important;
        --bs-table-hover-bg: #163b63 !important;
        --bs-table-hover-color: #4ade80 !important;

        font-size: 0.84rem;
        background-color: #0d2340 !important;
        color: #4ade80 !important;
        border-collapse: separate;
        border-spacing: 0;
        }

        /* En-tête */
        .comp-table thead th {
        background-color: #081a30 !important;
        color: #4ade80 !important;

        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: 700;

        padding: 0.75rem 0.85rem;

        border-bottom: 2px solid #4ade80 !important;
        }

        /* Lignes */
        .comp-table tbody tr {
        --bs-table-bg: #0d2340 !important;
        --bs-table-color: #4ade80 !important;

        background-color: #0d2340 !important;
        color: #4ade80 !important;

        border-bottom: 1px solid rgba(74, 222, 128, 0.18);

        transition: background-color 0.15s ease;
        }

        /* Survol */
        .comp-table tbody tr:hover {
        --bs-table-hover-bg: #163b63 !important;

        background-color: #163b63 !important;
        color: #4ade80 !important;
        }

        /* Cellules */
        .comp-table tbody td {
        background-color: #0d2340 !important;
        color: #4ade80 !important;

        padding: 0.65rem 0.85rem;
        vertical-align: middle;

        border-color: rgba(74, 222, 128, 0.15) !important;
        }

        /* Cellules au survol */
        .comp-table tbody tr:hover td {
        background-color: #163b63 !important;
        color: #4ade80 !important;
        }

        /* Texte Bootstrap text-white / text-light */
        .comp-table .text-white,
        .comp-table .text-light {
        color: #4ade80 !important;
        }

        /* Description */
        .comp-table .text-muted {
        color: #86efac !important;
        }        .comp-order-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: var(--panel-raised);
          border: 1px solid var(--border-subtle);
          color: var(--accent-cyan);
          font-weight: 800;
          font-size: 0.74rem;
          font-family: 'JetBrains Mono', monospace;
        }

        .comp-code-pill {
          background: rgba(124, 108, 246, 0.12);
          border: 1px solid rgba(124, 108, 246, 0.35);
          color: #b9adfb;
          padding: 3px 9px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          display: inline-block;
        }

        .comp-status-pill {
          border-radius: 20px !important;
          font-weight: 700 !important;
          font-size: 0.7rem !important;
          padding: 4px 13px !important;
          transition: all 0.15s ease;
          box-shadow: none !important;
        }
        .comp-status-active {
          background: rgba(53, 208, 160, 0.14) !important;
          color: var(--accent-emerald) !important;
          border: 1px solid rgba(53, 208, 160, 0.4) !important;
        }
        .comp-status-active:hover {
          background: var(--accent-emerald) !important;
          color: #06281d !important;
        }
        .comp-status-inactive {
          background: rgba(148, 163, 184, 0.07) !important;
          color: var(--text-muted) !important;
          border: 1px solid var(--border-subtle) !important;
        }
        .comp-status-inactive:hover {
          background: rgba(148, 163, 184, 0.18) !important;
          color: #ffffff !important;
        }

        .comp-action-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 !important;
          background: rgba(255, 255, 255, 0.02) !important;
          border: 1px solid var(--border-subtle) !important;
          transition: all 0.15s ease;
        }
        .comp-action-edit:hover {
          background: rgba(41, 211, 211, 0.16) !important;
          border-color: var(--accent-cyan) !important;
        }
        .comp-action-delete:hover {
          background: rgba(255, 107, 107, 0.16) !important;
          border-color: var(--accent-coral) !important;
        }

        .comp-input {
          background: var(--panel-raised) !important;
          border: 1px solid var(--border-strong) !important;
          color: var(--text-primary) !important;
          border-radius: 8px;
        }
        /* Labels du formulaire en blanc */
        .comp-form-label {
        color: #ffffff !important;
        font-weight: 700 !important;
        }
        .comp-input:focus {
          border-color: var(--accent-cyan) !important;
          box-shadow: 0 0 0 3px var(--accent-cyan-soft) !important;
        }
        .modal-dark .modal-content {
          background: #12161f !important;
          border: 1px solid var(--border-strong);
          border-radius: 16px;
          color: var(--text-primary);
        }
      `}</style>

      <Navbar />

      <div className="comp-page-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontSize: '1.6rem' }}>⚙️</span>
              <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
                Référentiel des Compétences &amp; Appétences
              </h2>
            </div>
            <small className="text-muted">
              Configurez dynamiquement les compétences pour chaque promotion. Le Radar Chart et les classements s'adapteront automatiquement.
            </small>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowResetDefaultsModal(true)}
              className="px-3 py-2"
            >
              🔄 Restaurer les 11 compétences standard
            </Button>
            <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
              🔄 Actualiser
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

        <Row className="g-3">
          {/* Formulaire d'ajout / édition */}
          <Col lg={4}>
            <Card className="comp-card p-3 shadow-sm mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-white mb-0">
                  {editingComp ? '✏️ Modifier la compétence' : '➕ Nouvelle compétence'}
                </h5>
                {editingComp && (
                  <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
                    Annuler
                  </Button>
                )}
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label className="small comp-form-label">Libellé affiché sur le Radar *</Form.Label>
                  <Form.Control
                    size="sm"
                    className="comp-input"
                    placeholder="Ex: Cybersécurité, Cloud AWS..."
                    value={formLabel}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small comp-form-label">Code technique (identifiant) *</Form.Label>
                  <Form.Control
                    size="sm"
                    className="comp-input font-monospace"
                    placeholder="Ex: cybersecurite, cloud_aws..."
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    required
                    disabled={Boolean(editingComp)}
                  />
                  <small
                    className="font-monospace"
                    style={{ fontSize: '0.7rem', color: '#ffffff' }}
                    >
                    Utilisé pour les correspondances Moodle/CSV.
                    </small>
                </Form.Group>

                <Row className="g-2 mb-2">
                  <Col xs={6}>
                    <Form.Label className="small comp-form-label">Ordre (position)</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      className="comp-input"
                      value={formOrdre}
                      min={1}
                      onChange={(e) => setFormOrdre(parseInt(e.target.value, 10) || 1)}
                    />
                  </Col>
                  <Col xs={6} className="d-flex align-items-end pb-1">
                    <Form.Check
                      type="switch"
                      id="comp-actif-switch"
                      label="Active"
                      checked={formActif}
                      onChange={(e) => setFormActif(e.target.checked)}
                      className="text-white small fw-bold"
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label className="small comp-form-label">Description / Thématiques couvertes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    size="sm"
                    className="comp-input"
                    placeholder="Mots-clés associés, description des projets..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant={editingComp ? 'info' : 'primary'}
                  size="sm"
                  className="w-100 fw-bold py-2"
                  disabled={saving}
                >
                  {saving ? <Spinner size="sm" animation="border" /> : editingComp ? '💾 Mettre à jour' : '➕ Ajouter au référentiel'}
                </Button>
              </Form>
            </Card>

            {/* Prévisualisation en direct du Radar */}
            <Card className="comp-card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-uppercase fw-bold text-muted">Aperçu du Radar Chart</span>
                <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                <Radar data={radarPreviewData} options={radarOptions} />
              </div>
            </Card>
          </Col>

          {/* Tableau de la liste des compétences */}
          <Col lg={8}>
            <Card className="comp-card overflow-hidden shadow-sm">
              <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="fw-bold text-white fs-6">
                  Liste des Compétences ({competences.length} au total, {activeCompetences.length} actives)
                </span>
                <span className="small text-muted">
                  Les compétences actives génèrent automatiquement les axes des graphiques Radar.
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="info" />
                  <p className="mt-3 text-muted">Chargement du référentiel...</p>
                </div>
              ) : competences.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Aucune compétence configurée. Cliquez sur "Restaurer les 11 compétences standard" pour démarrer.
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover size="sm" className="comp-table mb-0 text-white align-middle text-nowrap">
                    <thead>
                      <tr>
                        <th style={{ width: '50px', textAlign: 'center' }}>Ordre</th>
                        <th>Libellé (Radar)</th>
                        <th>Code Technique</th>
                        <th style={{ textAlign: 'center' }}>Statut</th>
                        <th style={{ width: '100px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competences.map((comp) => (
                        <tr key={comp.id} style={{ opacity: comp.actif ? 1 : 0.45 }}>
                          <td style={{ textAlign: 'center' }}>
                            <span className="comp-order-badge">{comp.ordre}</span>
                          </td>
                          <td>
                            <div className="fw-bold text-light">{comp.label}</div>
                            {comp.description && (
                              <small className="text-muted text-truncate d-block" style={{ maxWidth: '280px' }}>
                                {comp.description}
                              </small>
                            )}
                          </td>
                          <td>
                            <span className="comp-code-pill">{comp.code}</span>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <Button
                              className={`comp-status-pill ${comp.actif ? 'comp-status-active' : 'comp-status-inactive'}`}
                              size="sm"
                              onClick={() => toggleActive(comp)}
                              title="Cliquer pour activer/désactiver"
                            >
                              {comp.actif ? '✓ Active' : '✕ Inactive'}
                            </Button>
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                            <div className="d-flex gap-1 justify-content-end">
                              <Button
                                className="comp-action-btn comp-action-edit"
                                size="sm"
                                onClick={() => startEdit(comp)}
                                title="Modifier"
                              >
                                ✏️
                              </Button>
                              <Button
                                className="comp-action-btn comp-action-delete"
                                size="sm"
                                onClick={() => setDeletingId(comp.id)}
                                title="Supprimer"
                              >
                                
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modale Confirmation Suppression */}
      <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>🗑️ Supprimer la compétence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light mb-0">
            Êtes-vous sûr de vouloir supprimer définitivement cette compétence du référentiel ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>

      {/* Modale Restauration aux valeurs par défaut */}
      <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>🔄 Restaurer les compétences standard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light mb-0">
            Voulez-vous réinitialiser le référentiel aux <strong>11 compétences officielles de l'ICAM</strong> ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowResetDefaultsModal(false)}>Annuler</Button>
          <Button variant="info" size="sm" onClick={handleResetDefaults}>Restaurer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}