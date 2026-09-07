// // // // import React, { useEffect, useState, useMemo } from 'react';
// // // // import {
// // // //   Card,
// // // //   Button,
// // // //   Form,
// // // //   Row,
// // // //   Col,
// // // //   Table,
// // // //   Badge,
// // // //   Alert,
// // // //   Spinner,
// // // //   Modal,
// // // //   InputGroup,
// // // // } from 'react-bootstrap';
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
// // // //   fetchReferentielCompetences,
// // // //   saveReferentielCompetence,
// // // //   deleteReferentielCompetence,
// // // //   resetReferentielToDefaults,
// // // // } from '../services/supabase';

// // // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // // export default function ParametresCompetencesPage() {
// // // //   const [competences, setCompetences] = useState([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [saving, setSaving] = useState(false);
// // // //   const [error, setError] = useState(null);
// // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // //   // Formulaire d'ajout / modification
// // // //   const [editingComp, setEditingComp] = useState(null); // null = mode ajout, objet = mode édition
// // // //   const [formLabel, setFormLabel] = useState('');
// // // //   const [formCode, setFormCode] = useState('');
// // // //   const [formDesc, setFormDesc] = useState('');
// // // //   const [formOrdre, setFormOrdre] = useState(1);
// // // //   const [formActif, setFormActif] = useState(true);

// // // //   // Modale de confirmation de suppression
// // // //   const [deletingId, setDeletingId] = useState(null);
// // // //   const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

// // // //   const loadData = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);
// // // //       const data = await fetchReferentielCompetences(false); // charge actives ET inactives
// // // //       setCompetences(data || []);
// // // //       setFormOrdre((data?.length || 0) + 1);
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors du chargement des compétences.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     loadData();
// // // //   }, []);

// // // //   // Génération automatique du code à partir du libellé
// // // //   const handleLabelChange = (val) => {
// // // //     setFormLabel(val);
// // // //     if (!editingComp) {
// // // //       const generatedCode = val
// // // //         .toLowerCase()
// // // //         .normalize('NFD')
// // // //         .replace(/[\u0300-\u036f]/g, '')
// // // //         .replace(/[^a-z0-9]+/g, '_')
// // // //         .replace(/^_+|_+$/g, '');
// // // //       setFormCode(generatedCode);
// // // //     }
// // // //   };

// // // //   const startEdit = (comp) => {
// // // //     setEditingComp(comp);
// // // //     setFormLabel(comp.label);
// // // //     setFormCode(comp.code);
// // // //     setFormDesc(comp.description || '');
// // // //     setFormOrdre(comp.ordre);
// // // //     setFormActif(comp.actif);
// // // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // // //   };

// // // //   const cancelEdit = () => {
// // // //     setEditingComp(null);
// // // //     setFormLabel('');
// // // //     setFormCode('');
// // // //     setFormDesc('');
// // // //     setFormOrdre(competences.length + 1);
// // // //     setFormActif(true);
// // // //   };

// // // //   // Sauvegarde (Création / Édition)
// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!formLabel.trim() || !formCode.trim()) {
// // // //       setError('Le libellé et le code sont obligatoires.');
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setSaving(true);
// // // //       setError(null);

// // // //       const payload = {
// // // //         label: formLabel,
// // // //         code: formCode,
// // // //         description: formDesc,
// // // //         ordre: formOrdre,
// // // //         actif: formActif,
// // // //       };
// // // //       if (editingComp?.id) payload.id = editingComp.id;

// // // //       await saveReferentielCompetence(payload);
// // // //       setSuccessMsg(
// // // //         editingComp
// // // //           ? `Compétence « ${formLabel} » mise à jour avec succès.`
// // // //           : `Nouvelle compétence « ${formLabel} » ajoutée au référentiel.`
// // // //       );
// // // //       cancelEdit();
// // // //       await loadData();
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la sauvegarde.');
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   // Bascule active / inactive directe dans le tableau
// // // //   const toggleActive = async (comp) => {
// // // //     try {
// // // //       setError(null);
// // // //       await saveReferentielCompetence({ ...comp, actif: !comp.actif });
// // // //       await loadData();
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la mise à jour.');
// // // //     }
// // // //   };

// // // //   // Suppression
// // // //   const confirmDelete = async () => {
// // // //     if (!deletingId) return;
// // // //     try {
// // // //       setSaving(true);
// // // //       setError(null);
// // // //       await deleteReferentielCompetence(deletingId);
// // // //       setDeletingId(null);
// // // //       setSuccessMsg('Compétence supprimée du référentiel.');
// // // //       await loadData();
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la suppression.');
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   // Réinitialisation aux 11 compétences standard
// // // //   const handleResetDefaults = async () => {
// // // //     try {
// // // //       setSaving(true);
// // // //       setError(null);
// // // //       await resetReferentielToDefaults();
// // // //       setShowResetDefaultsModal(false);
// // // //       setSuccessMsg('Référentiel réinitialisé aux 11 compétences standard ICAM.');
// // // //       await loadData();
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la réinitialisation.');
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   // Données du Radar de prévisualisation
// // // //   const activeCompetences = useMemo(
// // // //     () => competences.filter((c) => c.actif),
// // // //     [competences]
// // // //   );

// // // //   const radarPreviewData = useMemo(() => {
// // // //     return {
// // // //       labels: activeCompetences.map((c) => c.label),
// // // //       datasets: [
// // // //         {
// // // //           label: 'Aptitudes (Exemple)',
// // // //           data: activeCompetences.map((_, i) => (i % 2 === 0 ? 3 : 4)),
// // // //           backgroundColor: 'rgba(45, 212, 191, 0.22)',
// // // //           borderColor: '#2dd4bf',
// // // //           borderWidth: 2,
// // // //           pointBackgroundColor: '#2dd4bf',
// // // //         },
// // // //         {
// // // //           label: 'Appétences (Exemple)',
// // // //           data: activeCompetences.map((_, i) => (i % 3 === 0 ? 4 : 2)),
// // // //           backgroundColor: 'rgba(251, 111, 146, 0.20)',
// // // //           borderColor: '#fb6f92',
// // // //           borderWidth: 2,
// // // //           pointBackgroundColor: '#fb6f92',
// // // //         },
// // // //       ],
// // // //     };
// // // //   }, [activeCompetences]);

// // // //   const radarOptions = {
// // // //     responsive: true,
// // // //     maintainAspectRatio: false,
// // // //     scales: {
// // // //       r: {
// // // //         min: 0,
// // // //         max: 4,
// // // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
// // // //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// // // //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// // // //         pointLabels: { color: '#e7ebf5', font: { size: 10.5, weight: '600' } },
// // // //       },
// // // //     },
// // // //     plugins: {
// // // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 11, weight: 'bold' } } },
// // // //     },
// // // //   };

// // // //   return (
// // // //     <>
// // // //       <style>{`
// // // //         :root {
// // // //           --canvas: #0a0e1a;
// // // //           --panel: rgba(21, 27, 46, 0.86);
// // // //           --panel-solid: #151b2e;
// // // //           --panel-raised: #1b2338;
// // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // //           --text-primary: #f4f6fb;
// // // //           --text-muted: #93a0b8;
// // // //           --accent-violet: #7c6cf6;
// // // //           --accent-cyan: #29d3d3;
// // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // //           --accent-emerald: #35d0a0;
// // // //           --accent-coral: #ff6b6b;
// // // //         }

// // // //         .comp-page-wrapper {
// // // //           max-width: 100%;
// // // //           margin: 0 auto;
// // // //           padding: 1.25rem 1rem 3rem 1rem;
// // // //           color: var(--text-primary);
// // // //           background:
// // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // //             var(--canvas);
// // // //           min-height: calc(100vh - 60px);
// // // //         }
// // // //         .comp-card {
// // // //           background: var(--panel);
// // // //           backdrop-filter: blur(16px);
// // // //           border: 1px solid var(--border-subtle);
// // // //           border-radius: 14px;
// // // //         }
// // // //         .comp-table {
// // // //           font-size: 0.84rem;
// // // //         }
// // // //         .comp-table thead th {
// // // //           background: var(--panel-solid);
// // // //           color: var(--text-muted);
// // // //           font-size: 0.72rem;
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.5px;
// // // //           border-bottom: 2px solid var(--accent-cyan-soft) !important;
// // // //         }
// // // //         .comp-input {
// // // //           background: var(--panel-raised) !important;
// // // //           border: 1px solid var(--border-strong) !important;
// // // //           color: var(--text-primary) !important;
// // // //           border-radius: 8px;
// // // //         }
// // // //         .comp-input:focus {
// // // //           border-color: var(--accent-cyan) !important;
// // // //           box-shadow: 0 0 0 3px var(--accent-cyan-soft) !important;
// // // //         }
// // // //         .modal-dark .modal-content {
// // // //           background: #12161f !important;
// // // //           border: 1px solid var(--border-strong);
// // // //           border-radius: 16px;
// // // //           color: var(--text-primary);
// // // //         }
// // // //       `}</style>

// // // //       <Navbar />

// // // //       <div className="comp-page-wrapper">
// // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // //           <div>
// // // //             <div className="d-flex align-items-center gap-2">
// // // //               <span style={{ fontSize: '1.6rem' }}>⚙️</span>
// // // //               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
// // // //                 Référentiel des Compétences &amp; Appétences
// // // //               </h2>
// // // //             </div>
// // // //             <small className="text-muted">
// // // //               Configurez dynamiquement les compétences pour chaque promotion. Le Radar Chart et les classements s'adapteront automatiquement.
// // // //             </small>
// // // //           </div>

// // // //           <div className="d-flex align-items-center gap-2">
// // // //             <Button
// // // //               variant="outline-secondary"
// // // //               size="sm"
// // // //               onClick={() => setShowResetDefaultsModal(true)}
// // // //               className="px-3 py-2"
// // // //             >
// // // //               🔄 Restaurer les 11 compétences standard
// // // //             </Button>
// // // //             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
// // // //               🔄 Actualiser
// // // //             </Button>
// // // //           </div>
// // // //         </div>

// // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // //         <Row className="g-3">
// // // //           {/* Formulaire d'ajout / édition */}
// // // //           <Col lg={4}>
// // // //             <Card className="comp-card p-3 shadow-sm mb-3">
// // // //               <div className="d-flex justify-content-between align-items-center mb-3">
// // // //                 <h5 className="fw-bold text-white mb-0">
// // // //                   {editingComp ? '✏️ Modifier la compétence' : '➕ Nouvelle compétence'}
// // // //                 </h5>
// // // //                 {editingComp && (
// // // //                   <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
// // // //                     Annuler
// // // //                   </Button>
// // // //                 )}
// // // //               </div>

// // // //               <Form onSubmit={handleSubmit}>
// // // //                 <Form.Group className="mb-2">
// // // //                   <Form.Label className="small text-muted fw-bold">Libellé affiché sur le Radar *</Form.Label>
// // // //                   <Form.Control
// // // //                     size="sm"
// // // //                     className="comp-input"
// // // //                     placeholder="Ex: Cybersécurité, Cloud AWS..."
// // // //                     value={formLabel}
// // // //                     onChange={(e) => handleLabelChange(e.target.value)}
// // // //                     required
// // // //                   />
// // // //                 </Form.Group>

// // // //                 <Form.Group className="mb-2">
// // // //                   <Form.Label className="small text-muted fw-bold">Code technique (identifiant) *</Form.Label>
// // // //                   <Form.Control
// // // //                     size="sm"
// // // //                     className="comp-input font-monospace"
// // // //                     placeholder="Ex: cybersecurite, cloud_aws..."
// // // //                     value={formCode}
// // // //                     onChange={(e) => setFormCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
// // // //                     required
// // // //                     disabled={Boolean(editingComp)}
// // // //                   />
// // // //                   <small className="text-muted font-monospace" style={{ fontSize: '0.7rem' }}>
// // // //                     Utilisé pour les correspondances Moodle/CSV.
// // // //                   </small>
// // // //                 </Form.Group>

// // // //                 <Row className="g-2 mb-2">
// // // //                   <Col xs={6}>
// // // //                     <Form.Label className="small text-muted fw-bold">Ordre (position)</Form.Label>
// // // //                     <Form.Control
// // // //                       type="number"
// // // //                       size="sm"
// // // //                       className="comp-input"
// // // //                       value={formOrdre}
// // // //                       min={1}
// // // //                       onChange={(e) => setFormOrdre(parseInt(e.target.value, 10) || 1)}
// // // //                     />
// // // //                   </Col>
// // // //                   <Col xs={6} className="d-flex align-items-end pb-1">
// // // //                     <Form.Check
// // // //                       type="switch"
// // // //                       id="comp-actif-switch"
// // // //                       label="Active"
// // // //                       checked={formActif}
// // // //                       onChange={(e) => setFormActif(e.target.checked)}
// // // //                       className="text-white small fw-bold"
// // // //                     />
// // // //                   </Col>
// // // //                 </Row>

// // // //                 <Form.Group className="mb-3">
// // // //                   <Form.Label className="small text-muted fw-bold">Description / Thématiques couvertes</Form.Label>
// // // //                   <Form.Control
// // // //                     as="textarea"
// // // //                     rows={2}
// // // //                     size="sm"
// // // //                     className="comp-input"
// // // //                     placeholder="Mots-clés associés, description des projets..."
// // // //                     value={formDesc}
// // // //                     onChange={(e) => setFormDesc(e.target.value)}
// // // //                   />
// // // //                 </Form.Group>

// // // //                 <Button
// // // //                   type="submit"
// // // //                   variant={editingComp ? 'info' : 'primary'}
// // // //                   size="sm"
// // // //                   className="w-100 fw-bold py-2"
// // // //                   disabled={saving}
// // // //                 >
// // // //                   {saving ? <Spinner size="sm" animation="border" /> : editingComp ? '💾 Mettre à jour' : '➕ Ajouter au référentiel'}
// // // //                 </Button>
// // // //               </Form>
// // // //             </Card>

// // // //             {/* Prévisualisation en direct du Radar */}
// // // //             <Card className="comp-card p-3 shadow-sm">
// // // //               <div className="d-flex justify-content-between align-items-center mb-2">
// // // //                 <span className="small text-uppercase fw-bold text-muted">Aperçu du Radar Chart</span>
// // // //                 <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
// // // //               </div>
// // // //               <div style={{ position: 'relative', width: '100%', height: '240px' }}>
// // // //                 <Radar data={radarPreviewData} options={radarOptions} />
// // // //               </div>
// // // //             </Card>
// // // //           </Col>

// // // //           {/* Tableau de la liste des compétences */}
// // // //           <Col lg={8}>
// // // //             <Card className="comp-card overflow-hidden shadow-sm">
// // // //               <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // //                 <span className="fw-bold text-white fs-6">
// // // //                   Liste des Compétences ({competences.length} au total, {activeCompetences.length} actives)
// // // //                 </span>
// // // //                 <span className="small text-muted">
// // // //                   Les compétences actives génèrent automatiquement les axes des graphiques Radar.
// // // //                 </span>
// // // //               </div>

// // // //               {loading ? (
// // // //                 <div className="text-center py-5">
// // // //                   <Spinner animation="border" variant="info" />
// // // //                   <p className="mt-3 text-muted">Chargement du référentiel...</p>
// // // //                 </div>
// // // //               ) : competences.length === 0 ? (
// // // //                 <div className="text-center py-5 text-muted">
// // // //                   Aucune compétence configurée. Cliquez sur "Restaurer les 11 compétences standard" pour démarrer.
// // // //                 </div>
// // // //               ) : (
// // // //                 <div className="table-responsive">
// // // //                   <Table hover size="sm" className="comp-table mb-0 text-white align-middle text-nowrap">
// // // //                     <thead>
// // // //                       <tr>
// // // //                         <th style={{ width: '50px', textAlign: 'center' }}>Ordre</th>
// // // //                         <th>Libellé (Radar)</th>
// // // //                         <th>Code Technique</th>
// // // //                         <th style={{ textAlign: 'center' }}>Statut</th>
// // // //                         <th style={{ width: '100px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
// // // //                       </tr>
// // // //                     </thead>
// // // //                     <tbody>
// // // //                       {competences.map((comp) => (
// // // //                         <tr key={comp.id} style={{ opacity: comp.actif ? 1 : 0.45 }}>
// // // //                           <td style={{ textAlign: 'center' }} className="font-monospace fw-bold text-muted">
// // // //                             {comp.ordre}
// // // //                           </td>
// // // //                           <td>
// // // //                             <div className="fw-bold text-light">{comp.label}</div>
// // // //                             {comp.description && (
// // // //                               <small className="text-muted text-truncate d-block" style={{ maxWidth: '280px' }}>
// // // //                                 {comp.description}
// // // //                               </small>
// // // //                             )}
// // // //                           </td>
// // // //                           <td>
// // // //                             <code className="text-info">{comp.code}</code>
// // // //                           </td>
// // // //                           <td style={{ textAlign: 'center' }}>
// // // //                             <Button
// // // //                               variant={comp.actif ? 'outline-success' : 'outline-secondary'}
// // // //                               size="sm"
// // // //                               style={{ fontSize: '0.7rem', padding: '2px 8px' }}
// // // //                               onClick={() => toggleActive(comp)}
// // // //                               title="Cliquer pour activer/désactiver"
// // // //                             >
// // // //                               {comp.actif ? '✓ Active' : '✕ Inactive'}
// // // //                             </Button>
// // // //                           </td>
// // // //                           <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
// // // //                             <div className="d-flex gap-1 justify-content-end">
// // // //                               <Button
// // // //                                 variant="outline-light"
// // // //                                 size="sm"
// // // //                                 style={{ fontSize: '0.72rem', padding: '2px 6px' }}
// // // //                                 onClick={() => startEdit(comp)}
// // // //                                 title="Modifier"
// // // //                               >
// // // //                                 ✏️
// // // //                               </Button>
// // // //                               <Button
// // // //                                 variant="outline-danger"
// // // //                                 size="sm"
// // // //                                 style={{ fontSize: '0.72rem', padding: '2px 6px' }}
// // // //                                 onClick={() => setDeletingId(comp.id)}
// // // //                                 title="Supprimer"
// // // //                               >
// // // //                                 🗑️
// // // //                               </Button>
// // // //                             </div>
// // // //                           </td>
// // // //                         </tr>
// // // //                       ))}
// // // //                     </tbody>
// // // //                   </Table>
// // // //                 </div>
// // // //               )}
// // // //             </Card>
// // // //           </Col>
// // // //         </Row>
// // // //       </div>

// // // //       {/* Modale Confirmation Suppression */}
// // // //       <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
// // // //         <Modal.Header closeButton closeVariant="white">
// // // //           <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>🗑️ Supprimer la compétence</Modal.Title>
// // // //         </Modal.Header>
// // // //         <Modal.Body>
// // // //           <p className="text-light mb-0">
// // // //             Êtes-vous sûr de vouloir supprimer définitivement cette compétence du référentiel ?
// // // //           </p>
// // // //         </Modal.Body>
// // // //         <Modal.Footer>
// // // //           <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
// // // //           <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
// // // //         </Modal.Footer>
// // // //       </Modal>

// // // //       {/* Modale Restauration aux valeurs par défaut */}
// // // //       <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
// // // //         <Modal.Header closeButton closeVariant="white">
// // // //           <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>🔄 Restaurer les compétences standard</Modal.Title>
// // // //         </Modal.Header>
// // // //         <Modal.Body>
// // // //           <p className="text-light mb-0">
// // // //             Voulez-vous réinitialiser le référentiel aux <strong>11 compétences officielles de l'ICAM</strong> ?
// // // //           </p>
// // // //         </Modal.Body>
// // // //         <Modal.Footer>
// // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetDefaultsModal(false)}>Annuler</Button>
// // // //           <Button variant="info" size="sm" onClick={handleResetDefaults}>Restaurer</Button>
// // // //         </Modal.Footer>
// // // //       </Modal>
// // // //     </>
// // // //   );
// // // // }

// // // import React, { useEffect, useState, useMemo } from 'react';
// // // import {
// // //   Card,
// // //   Button,
// // //   Form,
// // //   Row,
// // //   Col,
// // //   Table,
// // //   Badge,
// // //   Alert,
// // //   Spinner,
// // //   Modal,
// // //   InputGroup,
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
// // // import Navbar from './Navbar';
// // // import {
// // //   fetchReferentielCompetences,
// // //   saveReferentielCompetence,
// // //   deleteReferentielCompetence,
// // //   resetReferentielToDefaults,
// // // } from '../services/supabase';

// // // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // export default function ParametresCompetencesPage() {
// // //   const [competences, setCompetences] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [saving, setSaving] = useState(false);
// // //   const [error, setError] = useState(null);
// // //   const [successMsg, setSuccessMsg] = useState(null);

// // //   // Formulaire d'ajout / modification
// // //   const [editingComp, setEditingComp] = useState(null); // null = mode ajout, objet = mode édition
// // //   const [formLabel, setFormLabel] = useState('');
// // //   const [formCode, setFormCode] = useState('');
// // //   const [formDesc, setFormDesc] = useState('');
// // //   const [formOrdre, setFormOrdre] = useState(1);
// // //   const [formActif, setFormActif] = useState(true);

// // //   // Modale de confirmation de suppression
// // //   const [deletingId, setDeletingId] = useState(null);
// // //   const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

// // //   const loadData = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);
// // //       const data = await fetchReferentielCompetences(false); // charge actives ET inactives
// // //       setCompetences(data || []);
// // //       setFormOrdre((data?.length || 0) + 1);
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors du chargement des compétences.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

// // //   // Génération automatique du code à partir du libellé
// // //   const handleLabelChange = (val) => {
// // //     setFormLabel(val);
// // //     if (!editingComp) {
// // //       const generatedCode = val
// // //         .toLowerCase()
// // //         .normalize('NFD')
// // //         .replace(/[\u0300-\u036f]/g, '')
// // //         .replace(/[^a-z0-9]+/g, '_')
// // //         .replace(/^_+|_+$/g, '');
// // //       setFormCode(generatedCode);
// // //     }
// // //   };

// // //   const startEdit = (comp) => {
// // //     setEditingComp(comp);
// // //     setFormLabel(comp.label);
// // //     setFormCode(comp.code);
// // //     setFormDesc(comp.description || '');
// // //     setFormOrdre(comp.ordre);
// // //     setFormActif(comp.actif);
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   };

// // //   const cancelEdit = () => {
// // //     setEditingComp(null);
// // //     setFormLabel('');
// // //     setFormCode('');
// // //     setFormDesc('');
// // //     setFormOrdre(competences.length + 1);
// // //     setFormActif(true);
// // //   };

// // //   // Sauvegarde (Création / Édition)
// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!formLabel.trim() || !formCode.trim()) {
// // //       setError('Le libellé et le code sont obligatoires.');
// // //       return;
// // //     }

// // //     try {
// // //       setSaving(true);
// // //       setError(null);

// // //       const payload = {
// // //         label: formLabel,
// // //         code: formCode,
// // //         description: formDesc,
// // //         ordre: formOrdre,
// // //         actif: formActif,
// // //       };
// // //       if (editingComp?.id) payload.id = editingComp.id;

// // //       await saveReferentielCompetence(payload);
// // //       setSuccessMsg(
// // //         editingComp
// // //           ? `Compétence « ${formLabel} » mise à jour avec succès.`
// // //           : `Nouvelle compétence « ${formLabel} » ajoutée au référentiel.`
// // //       );
// // //       cancelEdit();
// // //       await loadData();
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la sauvegarde.');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   // Bascule active / inactive directe dans le tableau
// // //   const toggleActive = async (comp) => {
// // //     try {
// // //       setError(null);
// // //       await saveReferentielCompetence({ ...comp, actif: !comp.actif });
// // //       await loadData();
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la mise à jour.');
// // //     }
// // //   };

// // //   // Suppression
// // //   const confirmDelete = async () => {
// // //     if (!deletingId) return;
// // //     try {
// // //       setSaving(true);
// // //       setError(null);
// // //       await deleteReferentielCompetence(deletingId);
// // //       setDeletingId(null);
// // //       setSuccessMsg('Compétence supprimée du référentiel.');
// // //       await loadData();
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la suppression.');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   // Réinitialisation aux 11 compétences standard
// // //   const handleResetDefaults = async () => {
// // //     try {
// // //       setSaving(true);
// // //       setError(null);
// // //       await resetReferentielToDefaults();
// // //       setShowResetDefaultsModal(false);
// // //       setSuccessMsg('Référentiel réinitialisé aux 11 compétences standard ICAM.');
// // //       await loadData();
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la réinitialisation.');
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   // Données du Radar de prévisualisation
// // //   const activeCompetences = useMemo(
// // //     () => competences.filter((c) => c.actif),
// // //     [competences]
// // //   );

// // //   const radarPreviewData = useMemo(() => {
// // //     return {
// // //       labels: activeCompetences.map((c) => c.label),
// // //       datasets: [
// // //         {
// // //           label: 'Aptitudes (Exemple)',
// // //           data: activeCompetences.map((_, i) => (i % 2 === 0 ? 3 : 4)),
// // //           backgroundColor: 'rgba(45, 212, 191, 0.22)',
// // //           borderColor: '#2dd4bf',
// // //           borderWidth: 2,
// // //           pointBackgroundColor: '#2dd4bf',
// // //         },
// // //         {
// // //           label: 'Appétences (Exemple)',
// // //           data: activeCompetences.map((_, i) => (i % 3 === 0 ? 4 : 2)),
// // //           backgroundColor: 'rgba(251, 111, 146, 0.20)',
// // //           borderColor: '#fb6f92',
// // //           borderWidth: 2,
// // //           pointBackgroundColor: '#fb6f92',
// // //         },
// // //       ],
// // //     };
// // //   }, [activeCompetences]);

// // //   const radarOptions = {
// // //     responsive: true,
// // //     maintainAspectRatio: false,
// // //     scales: {
// // //       r: {
// // //         min: 0,
// // //         max: 4,
// // //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
// // //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// // //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// // //         pointLabels: { color: '#e7ebf5', font: { size: 10.5, weight: '600' } },
// // //       },
// // //     },
// // //     plugins: {
// // //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 11, weight: 'bold' } } },
// // //     },
// // //   };

// // //   return (
// // //     <>
// // //       <style>{`
// // //         :root {
// // //           --canvas: #0a0e1a;
// // //           --panel: rgba(21, 27, 46, 0.86);
// // //           --panel-solid: #151b2e;
// // //           --panel-raised: #1b2338;
// // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // //           --border-strong: rgba(148, 163, 184, 0.28);
// // //           --text-primary: #f4f6fb;
// // //           --text-muted: #93a0b8;
// // //           --accent-violet: #7c6cf6;
// // //           --accent-cyan: #29d3d3;
// // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // //           --accent-emerald: #35d0a0;
// // //           --accent-coral: #ff6b6b;
// // //         }

// // //         .comp-page-wrapper {
// // //           max-width: 100%;
// // //           margin: 0 auto;
// // //           padding: 1.25rem 1rem 3rem 1rem;
// // //           color: var(--text-primary);
// // //           background:
// // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // //             var(--canvas);
// // //           min-height: calc(100vh - 60px);
// // //         }
// // //         .comp-card {
// // //           background: var(--panel);
// // //           backdrop-filter: blur(16px);
// // //           border: 1px solid var(--border-subtle);
// // //           border-radius: 14px;
// // //         }

// // //         /* ===== Tableau des compétences — style pro moderne ===== */
        
// // //         .comp-table {
// // //         --bs-table-bg: #0d2340 !important;
// // //         --bs-table-color: #4ade80 !important;
// // //         --bs-table-hover-bg: #163b63 !important;
// // //         --bs-table-hover-color: #4ade80 !important;

// // //         font-size: 0.84rem;
// // //         background-color: #0d2340 !important;
// // //         color: #4ade80 !important;
// // //         border-collapse: separate;
// // //         border-spacing: 0;
// // //         }

// // //         /* En-tête */
// // //         .comp-table thead th {
// // //         background-color: #081a30 !important;
// // //         color: #4ade80 !important;

// // //         font-size: 0.72rem;
// // //         text-transform: uppercase;
// // //         letter-spacing: 0.06em;
// // //         font-weight: 700;

// // //         padding: 0.75rem 0.85rem;

// // //         border-bottom: 2px solid #4ade80 !important;
// // //         }

// // //         /* Lignes */
// // //         .comp-table tbody tr {
// // //         --bs-table-bg: #0d2340 !important;
// // //         --bs-table-color: #4ade80 !important;

// // //         background-color: #0d2340 !important;
// // //         color: #4ade80 !important;

// // //         border-bottom: 1px solid rgba(74, 222, 128, 0.18);

// // //         transition: background-color 0.15s ease;
// // //         }

// // //         /* Survol */
// // //         .comp-table tbody tr:hover {
// // //         --bs-table-hover-bg: #163b63 !important;

// // //         background-color: #163b63 !important;
// // //         color: #4ade80 !important;
// // //         }

// // //         /* Cellules */
// // //         .comp-table tbody td {
// // //         background-color: #0d2340 !important;
// // //         color: #4ade80 !important;

// // //         padding: 0.65rem 0.85rem;
// // //         vertical-align: middle;

// // //         border-color: rgba(74, 222, 128, 0.15) !important;
// // //         }

// // //         /* Cellules au survol */
// // //         .comp-table tbody tr:hover td {
// // //         background-color: #163b63 !important;
// // //         color: #4ade80 !important;
// // //         }

// // //         /* Texte Bootstrap text-white / text-light */
// // //         .comp-table .text-white,
// // //         .comp-table .text-light {
// // //         color: #4ade80 !important;
// // //         }

// // //         /* Description */
// // //         .comp-table .text-muted {
// // //         color: #86efac !important;
// // //         }        .comp-order-badge {
// // //           display: inline-flex;
// // //           align-items: center;
// // //           justify-content: center;
// // //           width: 28px;
// // //           height: 28px;
// // //           border-radius: 8px;
// // //           background: var(--panel-raised);
// // //           border: 1px solid var(--border-subtle);
// // //           color: var(--accent-cyan);
// // //           font-weight: 800;
// // //           font-size: 0.74rem;
// // //           font-family: 'JetBrains Mono', monospace;
// // //         }

// // //         .comp-code-pill {
// // //           background: rgba(124, 108, 246, 0.12);
// // //           border: 1px solid rgba(124, 108, 246, 0.35);
// // //           color: #b9adfb;
// // //           padding: 3px 9px;
// // //           border-radius: 6px;
// // //           font-size: 0.74rem;
// // //           font-weight: 600;
// // //           font-family: 'JetBrains Mono', monospace;
// // //           display: inline-block;
// // //         }

// // //         .comp-status-pill {
// // //           border-radius: 20px !important;
// // //           font-weight: 700 !important;
// // //           font-size: 0.7rem !important;
// // //           padding: 4px 13px !important;
// // //           transition: all 0.15s ease;
// // //           box-shadow: none !important;
// // //         }
// // //         .comp-status-active {
// // //           background: rgba(53, 208, 160, 0.14) !important;
// // //           color: var(--accent-emerald) !important;
// // //           border: 1px solid rgba(53, 208, 160, 0.4) !important;
// // //         }
// // //         .comp-status-active:hover {
// // //           background: var(--accent-emerald) !important;
// // //           color: #06281d !important;
// // //         }
// // //         .comp-status-inactive {
// // //           background: rgba(148, 163, 184, 0.07) !important;
// // //           color: var(--text-muted) !important;
// // //           border: 1px solid var(--border-subtle) !important;
// // //         }
// // //         .comp-status-inactive:hover {
// // //           background: rgba(148, 163, 184, 0.18) !important;
// // //           color: #ffffff !important;
// // //         }

// // //         .comp-action-btn {
// // //           width: 30px;
// // //           height: 30px;
// // //           border-radius: 8px;
// // //           display: inline-flex;
// // //           align-items: center;
// // //           justify-content: center;
// // //           padding: 0 !important;
// // //           background: rgba(255, 255, 255, 0.02) !important;
// // //           border: 1px solid var(--border-subtle) !important;
// // //           transition: all 0.15s ease;
// // //         }
// // //         .comp-action-edit:hover {
// // //           background: rgba(41, 211, 211, 0.16) !important;
// // //           border-color: var(--accent-cyan) !important;
// // //         }
// // //         .comp-action-delete:hover {
// // //           background: rgba(255, 107, 107, 0.16) !important;
// // //           border-color: var(--accent-coral) !important;
// // //         }

// // //         .comp-input {
// // //           background: var(--panel-raised) !important;
// // //           border: 1px solid var(--border-strong) !important;
// // //           color: var(--text-primary) !important;
// // //           border-radius: 8px;
// // //         }
// // //         /* Labels du formulaire en blanc */
// // //         .comp-form-label {
// // //         color: #ffffff !important;
// // //         font-weight: 700 !important;
// // //         }
// // //         .comp-input:focus {
// // //           border-color: var(--accent-cyan) !important;
// // //           box-shadow: 0 0 0 3px var(--accent-cyan-soft) !important;
// // //         }
// // //         .modal-dark .modal-content {
// // //           background: #12161f !important;
// // //           border: 1px solid var(--border-strong);
// // //           border-radius: 16px;
// // //           color: var(--text-primary);
// // //         }
// // //       `}</style>

// // //       <Navbar />

// // //       <div className="comp-page-wrapper">
// // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // //           <div>
// // //             <div className="d-flex align-items-center gap-2">
// // //               <span style={{ fontSize: '1.6rem' }}>⚙️</span>
// // //               <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
// // //                 Référentiel des Compétences &amp; Appétences
// // //               </h2>
// // //             </div>
// // //             <small className="text-muted">
// // //               Configurez dynamiquement les compétences pour chaque promotion. Le Radar Chart et les classements s'adapteront automatiquement.
// // //             </small>
// // //           </div>

// // //           <div className="d-flex align-items-center gap-2">
// // //             <Button
// // //               variant="outline-secondary"
// // //               size="sm"
// // //               onClick={() => setShowResetDefaultsModal(true)}
// // //               className="px-3 py-2"
// // //             >
// // //               🔄 Restaurer les 11 compétences standard
// // //             </Button>
// // //             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
// // //               🔄 Actualiser
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // //         <Row className="g-3">
// // //           {/* Formulaire d'ajout / édition */}
// // //           <Col lg={4}>
// // //             <Card className="comp-card p-3 shadow-sm mb-3">
// // //               <div className="d-flex justify-content-between align-items-center mb-3">
// // //                 <h5 className="fw-bold text-white mb-0">
// // //                   {editingComp ? '✏️ Modifier la compétence' : '➕ Nouvelle compétence'}
// // //                 </h5>
// // //                 {editingComp && (
// // //                   <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
// // //                     Annuler
// // //                   </Button>
// // //                 )}
// // //               </div>

// // //               <Form onSubmit={handleSubmit}>
// // //                 <Form.Group className="mb-2">
// // //                   <Form.Label className="small comp-form-label">Libellé affiché sur le Radar *</Form.Label>
// // //                   <Form.Control
// // //                     size="sm"
// // //                     className="comp-input"
// // //                     placeholder="Ex: Cybersécurité, Cloud AWS..."
// // //                     value={formLabel}
// // //                     onChange={(e) => handleLabelChange(e.target.value)}
// // //                     required
// // //                   />
// // //                 </Form.Group>

// // //                 <Form.Group className="mb-2">
// // //                   <Form.Label className="small comp-form-label">Code technique (identifiant) *</Form.Label>
// // //                   <Form.Control
// // //                     size="sm"
// // //                     className="comp-input font-monospace"
// // //                     placeholder="Ex: cybersecurite, cloud_aws..."
// // //                     value={formCode}
// // //                     onChange={(e) => setFormCode(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
// // //                     required
// // //                     disabled={Boolean(editingComp)}
// // //                   />
// // //                   <small
// // //                     className="font-monospace"
// // //                     style={{ fontSize: '0.7rem', color: '#ffffff' }}
// // //                     >
// // //                     Utilisé pour les correspondances Moodle/CSV.
// // //                     </small>
// // //                 </Form.Group>

// // //                 <Row className="g-2 mb-2">
// // //                   <Col xs={6}>
// // //                     <Form.Label className="small comp-form-label">Ordre (position)</Form.Label>
// // //                     <Form.Control
// // //                       type="number"
// // //                       size="sm"
// // //                       className="comp-input"
// // //                       value={formOrdre}
// // //                       min={1}
// // //                       onChange={(e) => setFormOrdre(parseInt(e.target.value, 10) || 1)}
// // //                     />
// // //                   </Col>
// // //                   <Col xs={6} className="d-flex align-items-end pb-1">
// // //                     <Form.Check
// // //                       type="switch"
// // //                       id="comp-actif-switch"
// // //                       label="Active"
// // //                       checked={formActif}
// // //                       onChange={(e) => setFormActif(e.target.checked)}
// // //                       className="text-white small fw-bold"
// // //                     />
// // //                   </Col>
// // //                 </Row>

// // //                 <Form.Group className="mb-3">
// // //                   <Form.Label className="small comp-form-label">Description / Thématiques couvertes</Form.Label>
// // //                   <Form.Control
// // //                     as="textarea"
// // //                     rows={2}
// // //                     size="sm"
// // //                     className="comp-input"
// // //                     placeholder="Mots-clés associés, description des projets..."
// // //                     value={formDesc}
// // //                     onChange={(e) => setFormDesc(e.target.value)}
// // //                   />
// // //                 </Form.Group>

// // //                 <Button
// // //                   type="submit"
// // //                   variant={editingComp ? 'info' : 'primary'}
// // //                   size="sm"
// // //                   className="w-100 fw-bold py-2"
// // //                   disabled={saving}
// // //                 >
// // //                   {saving ? <Spinner size="sm" animation="border" /> : editingComp ? '💾 Mettre à jour' : '➕ Ajouter au référentiel'}
// // //                 </Button>
// // //               </Form>
// // //             </Card>

// // //             {/* Prévisualisation en direct du Radar */}
// // //             <Card className="comp-card p-3 shadow-sm">
// // //               <div className="d-flex justify-content-between align-items-center mb-2">
// // //                 <span className="small text-uppercase fw-bold text-muted">Aperçu du Radar Chart</span>
// // //                 <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
// // //               </div>
// // //               <div style={{ position: 'relative', width: '100%', height: '240px' }}>
// // //                 <Radar data={radarPreviewData} options={radarOptions} />
// // //               </div>
// // //             </Card>
// // //           </Col>

// // //           {/* Tableau de la liste des compétences */}
// // //           <Col lg={8}>
// // //             <Card className="comp-card overflow-hidden shadow-sm">
// // //               <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
// // //                 <span className="fw-bold text-white fs-6">
// // //                   Liste des Compétences ({competences.length} au total, {activeCompetences.length} actives)
// // //                 </span>
// // //                 <span className="small text-muted">
// // //                   Les compétences actives génèrent automatiquement les axes des graphiques Radar.
// // //                 </span>
// // //               </div>

// // //               {loading ? (
// // //                 <div className="text-center py-5">
// // //                   <Spinner animation="border" variant="info" />
// // //                   <p className="mt-3 text-muted">Chargement du référentiel...</p>
// // //                 </div>
// // //               ) : competences.length === 0 ? (
// // //                 <div className="text-center py-5 text-muted">
// // //                   Aucune compétence configurée. Cliquez sur "Restaurer les 11 compétences standard" pour démarrer.
// // //                 </div>
// // //               ) : (
// // //                 <div className="table-responsive">
// // //                   <Table hover size="sm" className="comp-table mb-0 text-white align-middle text-nowrap">
// // //                     <thead>
// // //                       <tr>
// // //                         <th style={{ width: '50px', textAlign: 'center' }}>Ordre</th>
// // //                         <th>Libellé (Radar)</th>
// // //                         <th>Code Technique</th>
// // //                         <th style={{ textAlign: 'center' }}>Statut</th>
// // //                         <th style={{ width: '100px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {competences.map((comp) => (
// // //                         <tr key={comp.id} style={{ opacity: comp.actif ? 1 : 0.45 }}>
// // //                           <td style={{ textAlign: 'center' }}>
// // //                             <span className="comp-order-badge">{comp.ordre}</span>
// // //                           </td>
// // //                           <td>
// // //                             <div className="fw-bold text-light">{comp.label}</div>
// // //                             {comp.description && (
// // //                               <small className="text-muted text-truncate d-block" style={{ maxWidth: '280px' }}>
// // //                                 {comp.description}
// // //                               </small>
// // //                             )}
// // //                           </td>
// // //                           <td>
// // //                             <span className="comp-code-pill">{comp.code}</span>
// // //                           </td>
// // //                           <td style={{ textAlign: 'center' }}>
// // //                             <Button
// // //                               className={`comp-status-pill ${comp.actif ? 'comp-status-active' : 'comp-status-inactive'}`}
// // //                               size="sm"
// // //                               onClick={() => toggleActive(comp)}
// // //                               title="Cliquer pour activer/désactiver"
// // //                             >
// // //                               {comp.actif ? '✓ Active' : '✕ Inactive'}
// // //                             </Button>
// // //                           </td>
// // //                           <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
// // //                             <div className="d-flex gap-1 justify-content-end">
// // //                               <Button
// // //                                 className="comp-action-btn comp-action-edit"
// // //                                 size="sm"
// // //                                 onClick={() => startEdit(comp)}
// // //                                 title="Modifier"
// // //                               >
// // //                                 ✏️
// // //                               </Button>
// // //                               <Button
// // //                                 className="comp-action-btn comp-action-delete"
// // //                                 size="sm"
// // //                                 onClick={() => setDeletingId(comp.id)}
// // //                                 title="Supprimer"
// // //                               >
                                
// // //                               </Button>
// // //                             </div>
// // //                           </td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </Table>
// // //                 </div>
// // //               )}
// // //             </Card>
// // //           </Col>
// // //         </Row>
// // //       </div>

// // //       {/* Modale Confirmation Suppression */}
// // //       <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>🗑️ Supprimer la compétence</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body>
// // //           <p className="text-light mb-0">
// // //             Êtes-vous sûr de vouloir supprimer définitivement cette compétence du référentiel ?
// // //           </p>
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
// // //           <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
// // //         </Modal.Footer>
// // //       </Modal>

// // //       {/* Modale Restauration aux valeurs par défaut */}
// // //       <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>🔄 Restaurer les compétences standard</Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body>
// // //           <p className="text-light mb-0">
// // //             Voulez-vous réinitialiser le référentiel aux <strong>11 compétences officielles de l'ICAM</strong> ?
// // //           </p>
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" size="sm" onClick={() => setShowResetDefaultsModal(false)}>Annuler</Button>
// // //           <Button variant="info" size="sm" onClick={handleResetDefaults}>Restaurer</Button>
// // //         </Modal.Footer>
// // //       </Modal>
// // //     </>
// // //   );
// // // }
// // import React, { useEffect, useState, useMemo, useRef } from 'react';
// // import {
// //   Card,
// //   Button,
// //   Form,
// //   Row,
// //   Col,
// //   Table,
// //   Badge,
// //   Alert,
// //   Spinner,
// //   Modal,
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
// // import Navbar from './Navbar';
// // import {
// //   fetchReferentielCompetences,
// //   saveReferentielCompetence,
// //   saveBatchReferentielCompetences,
// //   deleteReferentielCompetence,
// //   resetReferentielToDefaults,
// // } from '../services/supabase';

// // ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // // Colonnes standard d'administration Moodle a ignorer lors de l'extraction des questions
// // const MOODLE_ADMIN_COLUMNS = [
// //   'horodateur',
// //   'timestamp',
// //   'nom',
// //   'prenom',
// //   'prenom et nom',
// //   'nom de famille',
// //   'adresse de courriel',
// //   'courriel',
// //   'email',
// //   'id',
// //   'numero d identification',
// //   'institution',
// //   'departement',
// //   'groupe',
// //   'etat',
// //   'statut',
// //   'commence le',
// //   'termine le',
// //   'temps mis',
// //   'note',
// // ];

// // export default function ParametresCompetencesPage() {
// //   const [competences, setCompetences] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [saving, setSaving] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [successMsg, setSuccessMsg] = useState(null);

// //   // Formulaire d'ajout / modification
// //   const [editingComp, setEditingComp] = useState(null);
// //   const [formLabel, setFormLabel] = useState('');
// //   const [formCode, setFormCode] = useState('');
// //   const [formDesc, setFormDesc] = useState('');
// //   const [formOrdre, setFormOrdre] = useState(1);
// //   const [formActif, setFormActif] = useState(true);
// //   const [formIntituleMoodle, setFormIntituleMoodle] = useState('');

// //   // Modales
// //   const [deletingId, setDeletingId] = useState(null);
// //   const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

// //   // Modale Assistant Import Moodle
// //   const [showMoodleModal, setShowMoodleModal] = useState(false);
// //   const [detectedCompetences, setDetectedCompetences] = useState([]);
// //   const [moodleParseError, setMoodleParseError] = useState(null);
// //   const [moodleFileName, setMoodleFileName] = useState('');
// //   const fileInputRef = useRef(null);

// //   const loadData = async () => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const data = await fetchReferentielCompetences(false);
// //       setCompetences(data || []);
// //       setFormOrdre((data?.length || 0) + 1);
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors du chargement des competences.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const generateCleanCode = (text) => {
// //     return (text || '')
// //       .toLowerCase()
// //       .normalize('NFD')
// //       .replace(/[\u0300-\u036f]/g, '')
// //       .replace(/[^a-z0-9]+/g, '_')
// //       .replace(/^_+|_+$/g, '');
// //   };

// //   const handleLabelChange = (val) => {
// //     setFormLabel(val);
// //     if (!editingComp) {
// //       setFormCode(generateCleanCode(val));
// //     }
// //   };

// //   const startEdit = (comp) => {
// //     setEditingComp(comp);
// //     setFormLabel(comp.label || '');
// //     setFormCode(comp.code || '');
// //     setFormDesc(comp.description || '');
// //     setFormOrdre(comp.ordre || 1);
// //     setFormActif(comp.actif !== undefined ? comp.actif : true);
// //     setFormIntituleMoodle(comp.intitule_moodle || '');
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   };

// //   const cancelEdit = () => {
// //     setEditingComp(null);
// //     setFormLabel('');
// //     setFormCode('');
// //     setFormDesc('');
// //     setFormOrdre(competences.length + 1);
// //     setFormActif(true);
// //     setFormIntituleMoodle('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!formLabel.trim() || !formCode.trim()) {
// //       setError('Le libelle et le code sont obligatoires.');
// //       return;
// //     }

// //     try {
// //       setSaving(true);
// //       setError(null);

// //       const payload = {
// //         label: formLabel.trim(),
// //         code: formCode.trim(),
// //         description: formDesc.trim(),
// //         ordre: Number(formOrdre) || 1,
// //         actif: formActif,
// //         intitule_moodle: formIntituleMoodle.trim() || null,
// //       };
// //       if (editingComp?.id) payload.id = editingComp.id;

// //       await saveReferentielCompetence(payload);
// //       setSuccessMsg(
// //         editingComp
// //           ? `Competence "${formLabel}" mise a jour avec succes.`
// //           : `Nouvelle competence "${formLabel}" ajoutee au referentiel.`
// //       );
// //       cancelEdit();
// //       await loadData();
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la sauvegarde.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const toggleActive = async (comp) => {
// //     try {
// //       setError(null);
// //       await saveReferentielCompetence({ ...comp, actif: !comp.actif });
// //       await loadData();
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la mise a jour.');
// //     }
// //   };

// //   const confirmDelete = async () => {
// //     if (!deletingId) return;
// //     try {
// //       setSaving(true);
// //       setError(null);
// //       await deleteReferentielCompetence(deletingId);
// //       setDeletingId(null);
// //       setSuccessMsg('Competence supprimee du referentiel.');
// //       await loadData();
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la suppression.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const handleResetDefaults = async () => {
// //     try {
// //       setSaving(true);
// //       setError(null);
// //       await resetReferentielToDefaults();
// //       setShowResetDefaultsModal(false);
// //       setSuccessMsg('Referentiel reinitialise aux 11 competences standard ICAM.');
// //       await loadData();
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la reinitialisation.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   // ==========================================================================
// //   // PARSEUR ET DETECTEUR INTELLIGENT DU FICHIER MOODLE
// //   // ==========================================================================

// //   const parseCsvHeaders = (text) => {
// //     const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
// //     if (lines.length === 0) return [];

// //     const firstLine = lines[0];

// //     // Detection du delimiteur
// //     const semiCount = (firstLine.match(/;/g) || []).length;
// //     const commaCount = (firstLine.match(/,/g) || []).length;
// //     const tabCount = (firstLine.match(/\t/g) || []).length;

// //     let delimiter = ',';
// //     if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
// //     else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

// //     // Decoupage avec gestion des guillemets
// //     const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}]*))`, 'g');
// //     const headers = [];
// //     let match;
// //     while ((match = regex.exec(firstLine)) !== null) {
// //       let cell = match[1] ? match[1].replace(/""/g, '"') : match[2];
// //       headers.push((cell || '').trim());
// //       if (regex.lastIndex === match.index) regex.lastIndex++;
// //     }

// //     return headers;
// //   };

// //   const handleMoodleFileChange = (e) => {
// //     const file = e.target.files?.[0];
// //     if (!file) return;

// //     setMoodleFileName(file.name);
// //     setMoodleParseError(null);

// //     const reader = new FileReader();
// //     reader.onload = (evt) => {
// //       try {
// //         const rawContent = evt.target.result;
// //         const headers = parseCsvHeaders(rawContent);

// //         if (!headers || headers.length === 0) {
// //           throw new Error('Le fichier semble vide ou ses en-tetes ne sont pas exploitables.');
// //         }

// //         // Filtrer les colonnes de metadonnees
// //         const candidateQuestions = [];
// //         const seenQuestions = new Set();

// //         headers.forEach((header) => {
// //           const cleanHeader = header.trim();
// //           if (!cleanHeader) return;

// //           const norm = cleanHeader.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// //           const isMeta = MOODLE_ADMIN_COLUMNS.some((adminCol) => norm === adminCol || norm.startsWith(`${adminCol} `));

// //           if (!isMeta) {
// //             // Dédoublonnage : la question apparait une fois pour aptitude, une fois pour appetence
// //             if (!seenQuestions.has(cleanHeader)) {
// //               seenQuestions.add(cleanHeader);
// //               candidateQuestions.push(cleanHeader);
// //             }
// //           }
// //         });

// //         if (candidateQuestions.length === 0) {
// //           throw new Error('Aucune question technique detectee apres filtrage des colonnes administratives.');
// //         }

// //         // Construction de la previsualisation interactive
// //         const rows = candidateQuestions.map((title, idx) => {
// //           // Si une competence existait deja avec cet intitule ou code, on reprend son libelle
// //           const existing = competences.find(
// //             (c) =>
// //               (c.intitule_moodle && c.intitule_moodle.toLowerCase() === title.toLowerCase()) ||
// //               c.code === generateCleanCode(title)
// //           );

// //           return {
// //             id: existing?.id || null,
// //             ordre: idx + 1,
// //             intitule_moodle: title,
// //             code: existing?.code || generateCleanCode(title),
// //             label: existing?.label || title,
// //             actif: existing?.actif !== undefined ? existing.actif : true,
// //           };
// //         });

// //         setDetectedCompetences(rows);
// //       } catch (err) {
// //         setMoodleParseError(err.message || 'Impossible d analyser le fichier Moodle.');
// //         setDetectedCompetences([]);
// //       }
// //     };

// //     reader.readAsText(file, 'UTF-8');
// //   };

// //   const handleUpdateDetectedItem = (index, field, value) => {
// //     setDetectedCompetences((prev) => {
// //       const copy = [...prev];
// //       copy[index] = { ...copy[index], [field]: value };
// //       return copy;
// //     });
// //   };

// //   const handleSaveDetectedCompetences = async () => {
// //     try {
// //       setSaving(true);
// //       setMoodleParseError(null);

// //       // Verification doublon de code
// //       const codes = detectedCompetences.map((c) => c.code.trim().toLowerCase());
// //       const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
// //       if (duplicates.length > 0) {
// //         throw new Error(`Code technique en doublon detecte : "${duplicates[0]}". Chaque code doit etre unique.`);
// //       }

// //       await saveBatchReferentielCompetences(detectedCompetences);
// //       setShowMoodleModal(false);
// //       setDetectedCompetences([]);
// //       setMoodleFileName('');
// //       setSuccessMsg(`${detectedCompetences.length} competences Moodle enregistrees avec succes dans le referentiel.`);
// //       await loadData();
// //     } catch (err) {
// //       setMoodleParseError(err.message || 'Erreur lors de l enregistrement groupé.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const activeCompetences = useMemo(
// //     () => competences.filter((c) => c.actif),
// //     [competences]
// //   );

// //   const radarPreviewData = useMemo(() => {
// //     return {
// //       labels: activeCompetences.map((c) => c.label),
// //       datasets: [
// //         {
// //           label: 'Aptitudes (Exemple)',
// //           data: activeCompetences.map((_, i) => (i % 2 === 0 ? 3 : 4)),
// //           backgroundColor: 'rgba(45, 212, 191, 0.22)',
// //           borderColor: '#2dd4bf',
// //           borderWidth: 2,
// //           pointBackgroundColor: '#2dd4bf',
// //         },
// //         {
// //           label: 'Appetences (Exemple)',
// //           data: activeCompetences.map((_, i) => (i % 3 === 0 ? 4 : 2)),
// //           backgroundColor: 'rgba(251, 111, 146, 0.20)',
// //           borderColor: '#fb6f92',
// //           borderWidth: 2,
// //           pointBackgroundColor: '#fb6f92',
// //         },
// //       ],
// //     };
// //   }, [activeCompetences]);

// //   const radarOptions = {
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     scales: {
// //       r: {
// //         min: 0,
// //         max: 4,
// //         ticks: { stepSize: 1, backdropColor: 'transparent', color: '#7c88a3', font: { size: 10 } },
// //         grid: { color: 'rgba(148, 163, 184, 0.14)' },
// //         angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
// //         pointLabels: { color: '#e7ebf5', font: { size: 10.5, weight: '600' } },
// //       },
// //     },
// //     plugins: {
// //       legend: { position: 'top', labels: { color: '#ffffff', font: { size: 11, weight: 'bold' } } },
// //     },
// //   };

// //   return (
// //     <>
// //       <style>{`
// //         :root {
// //           --canvas: #0a0e1a;
// //           --panel: rgba(21, 27, 46, 0.86);
// //           --panel-solid: #151b2e;
// //           --panel-raised: #1b2338;
// //           --border-subtle: rgba(148, 163, 184, 0.14);
// //           --border-strong: rgba(148, 163, 184, 0.28);
// //           --text-primary: #f4f6fb;
// //           --text-muted: #93a0b8;
// //           --accent-violet: #7c6cf6;
// //           --accent-cyan: #29d3d3;
// //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// //           --accent-emerald: #35d0a0;
// //           --accent-coral: #ff6b6b;
// //         }

// //         .comp-page-wrapper {
// //           max-width: 100%;
// //           margin: 0 auto;
// //           padding: 1.25rem 1rem 3rem 1rem;
// //           color: var(--text-primary);
// //           background:
// //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// //             var(--canvas);
// //           min-height: calc(100vh - 60px);
// //         }
// //         .comp-card {
// //           background: var(--panel);
// //           backdrop-filter: blur(16px);
// //           border: 1px solid var(--border-subtle);
// //           border-radius: 14px;
// //         }

// //         .comp-table {
// //           font-size: 0.82rem;
// //           color: var(--text-primary);
// //           margin: 0;
// //         }
// //         .comp-table thead th {
// //           background-color: var(--panel-solid) !important;
// //           color: var(--text-muted) !important;
// //           font-size: 0.7rem;
// //           text-transform: uppercase;
// //           letter-spacing: 0.05em;
// //           font-weight: 700;
// //           padding: 0.75rem 0.85rem;
// //           border-bottom: 2px solid var(--border-strong) !important;
// //         }
// //         .comp-table tbody tr {
// //           border-bottom: 1px solid var(--border-subtle);
// //           transition: background-color 0.15s ease;
// //         }
// //         .comp-table tbody tr:hover td {
// //           background-color: rgba(41, 211, 211, 0.06) !important;
// //         }
// //         .comp-table tbody td {
// //           padding: 0.65rem 0.85rem;
// //           vertical-align: middle;
// //           border-color: var(--border-subtle) !important;
// //           background: transparent !important;
// //           color: var(--text-primary);
// //         }

// //         .comp-order-badge {
// //           display: inline-flex;
// //           align-items: center;
// //           justify-content: center;
// //           width: 26px;
// //           height: 26px;
// //           border-radius: 7px;
// //           background: var(--panel-raised);
// //           border: 1px solid var(--border-subtle);
// //           color: var(--accent-cyan);
// //           font-weight: 800;
// //           font-size: 0.74rem;
// //           font-family: monospace;
// //         }

// //         .comp-code-pill {
// //           background: rgba(124, 108, 246, 0.12);
// //           border: 1px solid rgba(124, 108, 246, 0.35);
// //           color: #b9adfb;
// //           padding: 2px 7px;
// //           border-radius: 5px;
// //           font-size: 0.7rem;
// //           font-weight: 600;
// //           font-family: monospace;
// //           display: inline-block;
// //         }

// //         .comp-status-pill {
// //           border-radius: 20px !important;
// //           font-weight: 700 !important;
// //           font-size: 0.68rem !important;
// //           padding: 3px 10px !important;
// //           transition: all 0.15s ease;
// //         }
// //         .comp-status-active {
// //           background: rgba(53, 208, 160, 0.14) !important;
// //           color: var(--accent-emerald) !important;
// //           border: 1px solid rgba(53, 208, 160, 0.4) !important;
// //         }
// //         .comp-status-active:hover {
// //           background: var(--accent-emerald) !important;
// //           color: #06281d !important;
// //         }
// //         .comp-status-inactive {
// //           background: rgba(148, 163, 184, 0.07) !important;
// //           color: var(--text-muted) !important;
// //           border: 1px solid var(--border-subtle) !important;
// //         }
// //         .comp-status-inactive:hover {
// //           background: rgba(148, 163, 184, 0.18) !important;
// //           color: #ffffff !important;
// //         }

// //         .comp-input {
// //           background: var(--panel-raised) !important;
// //           border: 1px solid var(--border-strong) !important;
// //           color: var(--text-primary) !important;
// //           border-radius: 8px;
// //         }
// //         .comp-form-label {
// //           color: var(--text-primary) !important;
// //           font-weight: 700 !important;
// //         }
// //         .comp-input:focus {
// //           border-color: var(--accent-cyan) !important;
// //           box-shadow: 0 0 0 3px var(--accent-cyan-soft) !important;
// //         }

// //         .modal-dark .modal-content {
// //           background: #12161f !important;
// //           border: 1px solid var(--border-strong);
// //           border-radius: 16px;
// //           color: var(--text-primary);
// //         }
// //       `}</style>

// //       <Navbar />

// //       <div className="comp-page-wrapper">
// //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// //           <div>
// //             <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
// //               Referentiel des Competences et Mapping Moodle
// //             </h2>
// //             <small className="text-muted">
// //               Configurez le referentiel manuellement ou importez directement le fichier CSV Moodle pour extraire et valider les intitules.
// //             </small>
// //           </div>

// //           <div className="d-flex align-items-center gap-2 flex-wrap">
// //             <Button
// //               variant="info"
// //               size="sm"
// //               onClick={() => {
// //                 setMoodleParseError(null);
// //                 setDetectedCompetences([]);
// //                 setMoodleFileName('');
// //                 setShowMoodleModal(true);
// //               }}
// //               className="px-3 py-2 fw-bold text-dark"
// //             >
// //               Detecter depuis un export Moodle
// //             </Button>
// //             <Button
// //               variant="outline-secondary"
// //               size="sm"
// //               onClick={() => setShowResetDefaultsModal(true)}
// //               className="px-3 py-2"
// //             >
// //               Restaurer les 11 competences standard
// //             </Button>
// //             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
// //               Actualiser
// //             </Button>
// //           </div>
// //         </div>

// //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// //         <Row className="g-3">
// //           {/* Formulaire d'ajout / edition manuelle */}
// //           <Col lg={4}>
// //             <Card className="comp-card p-3 shadow-sm mb-3">
// //               <div className="d-flex justify-content-between align-items-center mb-3">
// //                 <h5 className="fw-bold text-white mb-0">
// //                   {editingComp ? 'Modifier la competence' : 'Nouvelle competence'}
// //                 </h5>
// //                 {editingComp && (
// //                   <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
// //                     Annuler
// //                   </Button>
// //                 )}
// //               </div>

// //               <Form onSubmit={handleSubmit}>
// //                 <Form.Group className="mb-2">
// //                   <Form.Label className="small comp-form-label">Libelle affiche sur le Radar *</Form.Label>
// //                   <Form.Control
// //                     size="sm"
// //                     className="comp-input"
// //                     placeholder="Ex: Cybersecurite, Cloud AWS..."
// //                     value={formLabel}
// //                     onChange={(e) => handleLabelChange(e.target.value)}
// //                     required
// //                   />
// //                 </Form.Group>

// //                 <Form.Group className="mb-2">
// //                   <Form.Label className="small comp-form-label">Code technique (identifiant unique) *</Form.Label>
// //                   <Form.Control
// //                     size="sm"
// //                     className="comp-input font-monospace"
// //                     placeholder="Ex: cybersecurite, cloud_aws..."
// //                     value={formCode}
// //                     onChange={(e) => setFormCode(generateCleanCode(e.target.value))}
// //                     required
// //                     disabled={Boolean(editingComp)}
// //                   />
// //                   <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>
// //                     Cle unique en base (en minuscules sans accents).
// //                   </small>
// //                 </Form.Group>

// //                 <Form.Group className="mb-2">
// //                   <Form.Label className="small comp-form-label">Intitule exact Moodle</Form.Label>
// //                   <Form.Control
// //                     size="sm"
// //                     className="comp-input"
// //                     placeholder="Ex: Automatique et automatisme"
// //                     value={formIntituleMoodle}
// //                     onChange={(e) => setFormIntituleMoodle(e.target.value)}
// //                   />
// //                   <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>
// //                     Intitule tel qu il figure dans l en-tete du fichier Moodle (optionnel si renseigne par l import).
// //                   </small>
// //                 </Form.Group>

// //                 <Row className="g-2 mb-2">
// //                   <Col xs={6}>
// //                     <Form.Label className="small comp-form-label">Ordre</Form.Label>
// //                     <Form.Control
// //                       type="number"
// //                       size="sm"
// //                       className="comp-input"
// //                       value={formOrdre}
// //                       min={1}
// //                       onChange={(e) => setFormOrdre(parseInt(e.target.value, 10) || 1)}
// //                     />
// //                   </Col>
// //                   <Col xs={6} className="d-flex align-items-end pb-1">
// //                     <Form.Check
// //                       type="switch"
// //                       id="comp-actif-switch"
// //                       label="Active"
// //                       checked={formActif}
// //                       onChange={(e) => setFormActif(e.target.checked)}
// //                       className="text-white small fw-bold"
// //                     />
// //                   </Col>
// //                 </Row>

// //                 <Form.Group className="mb-3">
// //                   <Form.Label className="small comp-form-label">Description / Thematiques couvertes</Form.Label>
// //                   <Form.Control
// //                     as="textarea"
// //                     rows={2}
// //                     size="sm"
// //                     className="comp-input"
// //                     placeholder="Mots-cles associes, description des projets..."
// //                     value={formDesc}
// //                     onChange={(e) => setFormDesc(e.target.value)}
// //                   />
// //                 </Form.Group>

// //                 <Button
// //                   type="submit"
// //                   variant={editingComp ? 'info' : 'primary'}
// //                   size="sm"
// //                   className="w-100 fw-bold py-2"
// //                   disabled={saving}
// //                 >
// //                   {saving ? <Spinner size="sm" animation="border" /> : editingComp ? 'Mettre a jour' : 'Ajouter au referentiel'}
// //                 </Button>
// //               </Form>
// //             </Card>

// //             {/* Previsualisation du Radar */}
// //             <Card className="comp-card p-3 shadow-sm">
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <span className="small text-uppercase fw-bold text-muted">Apercu du Radar Chart</span>
// //                 <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
// //               </div>
// //               <div style={{ position: 'relative', width: '100%', height: '240px' }}>
// //                 <Radar data={radarPreviewData} options={radarOptions} />
// //               </div>
// //             </Card>
// //           </Col>

// //           {/* Tableau des competences */}
// //           <Col lg={8}>
// //             <Card className="comp-card overflow-hidden shadow-sm">
// //               <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
// //                 <span className="fw-bold text-white fs-6">
// //                   Liste des Competences ({competences.length} au total, {activeCompetences.length} actives)
// //                 </span>
// //                 <span className="small text-muted">
// //                   Les intitules Moodle sont synchronises pour l import automatique des notes.
// //                 </span>
// //               </div>

// //               {loading ? (
// //                 <div className="text-center py-5">
// //                   <Spinner animation="border" variant="info" />
// //                   <p className="mt-3 text-muted">Chargement du referentiel...</p>
// //                 </div>
// //               ) : competences.length === 0 ? (
// //                 <div className="text-center py-5 text-muted">
// //                   Aucune competence configuree. Utilisez "Detecter depuis un export Moodle" ou "Restaurer les 11 competences standard".
// //                 </div>
// //               ) : (
// //                 <div className="table-responsive">
// //                   <Table hover size="sm" className="comp-table mb-0 align-middle text-nowrap">
// //                     <thead>
// //                       <tr>
// //                         <th style={{ width: '45px', textAlign: 'center' }}>#</th>
// //                         <th>Competence (Radar)</th>
// //                         <th>Code Technique</th>
// //                         <th>Intitule Moodle lie</th>
// //                         <th style={{ textAlign: 'center', width: '90px' }}>Statut</th>
// //                         <th style={{ width: '150px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {competences.map((comp) => (
// //                         <tr key={comp.id || comp.code} style={{ opacity: comp.actif ? 1 : 0.45 }}>
// //                           <td style={{ textAlign: 'center' }}>
// //                             <span className="comp-order-badge">{comp.ordre}</span>
// //                           </td>
// //                           <td>
// //                             <div className="fw-bold text-white">{comp.label}</div>
// //                             {comp.description && (
// //                               <small className="text-muted text-truncate d-block" style={{ maxWidth: '220px' }}>
// //                                 {comp.description}
// //                               </small>
// //                             )}
// //                           </td>
// //                           <td>
// //                             <span className="comp-code-pill">{comp.code}</span>
// //                           </td>
// //                           <td>
// //                             {comp.intitule_moodle ? (
// //                               <span className="text-light small text-truncate d-inline-block" style={{ maxWidth: '260px' }}>
// //                                 {comp.intitule_moodle}
// //                               </span>
// //                             ) : (
// //                               <span className="text-warning small fst-italic">Non renseigne</span>
// //                             )}
// //                           </td>
// //                           <td style={{ textAlign: 'center' }}>
// //                             <Button
// //                               className={`comp-status-pill ${comp.actif ? 'comp-status-active' : 'comp-status-inactive'}`}
// //                               size="sm"
// //                               onClick={() => toggleActive(comp)}
// //                               title="Cliquer pour activer/desactiver"
// //                             >
// //                               {comp.actif ? 'Active' : 'Inactive'}
// //                             </Button>
// //                           </td>
// //                           <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
// //                             <div className="d-flex gap-2 justify-content-end">
// //                               <Button
// //                                 variant="outline-info"
// //                                 size="sm"
// //                                 onClick={() => startEdit(comp)}
// //                                 style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
// //                               >
// //                                 Modifier
// //                               </Button>
// //                               <Button
// //                                 variant="outline-danger"
// //                                 size="sm"
// //                                 onClick={() => setDeletingId(comp.id)}
// //                                 style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
// //                               >
// //                                 Supprimer
// //                               </Button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </Table>
// //                 </div>
// //               )}
// //             </Card>
// //           </Col>
// //         </Row>
// //       </div>

// //       {/* MODALE D'ANALYSE DU FICHIER MOODLE (STRATEGIE A) */}
// //       <Modal
// //         show={showMoodleModal}
// //         onHide={() => setShowMoodleModal(false)}
// //         size="xl"
// //         centered
// //         className="modal-dark"
// //       >
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title style={{ fontSize: '1.15rem', color: '#29d3d3' }}>
// //             Initialisation du Referentiel depuis un Export Moodle
// //           </Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <p className="text-light small mb-3">
// //             Deposez votre fichier exporte depuis le questionnaire Moodle (CSV). Le systeme va extraire
// //             les questions, deduire un code technique propre et vous permettre d ajuster les libelles
// //             avant l enregistrement en base.
// //           </p>

// //           <div className="mb-3 p-3 rounded" style={{ background: 'var(--panel-raised)', border: '1px dashed var(--border-strong)' }}>
// //             <Form.Group controlId="moodleFileInput">
// //               <Form.Label className="small fw-bold text-white mb-2">Selectionnez le fichier CSV Moodle :</Form.Label>
// //               <Form.Control
// //                 ref={fileInputRef}
// //                 type="file"
// //                 accept=".csv,text/csv"
// //                 size="sm"
// //                 className="comp-input"
// //                 onChange={handleMoodleFileChange}
// //               />
// //             </Form.Group>
// //             {moodleFileName && (
// //               <div className="mt-2 text-info small">
// //                 Fichier analyse : <strong>{moodleFileName}</strong>
// //               </div>
// //             )}
// //           </div>

// //           {moodleParseError && <Alert variant="danger" className="py-2 small">{moodleParseError}</Alert>}

// //           {detectedCompetences.length > 0 && (
// //             <>
// //               <div className="d-flex justify-content-between align-items-center mb-2">
// //                 <span className="small fw-bold text-white">
// //                   Questions detectees ({detectedCompetences.length}) — Ajustez les codes et libelles au besoin :
// //                 </span>
// //               </div>
// //               <div className="table-responsive" style={{ maxHeight: '380px', overflowY: 'auto' }}>
// //                 <Table hover size="sm" className="comp-table mb-0 align-middle">
// //                   <thead>
// //                     <tr>
// //                       <th style={{ width: '40px', textAlign: 'center' }}>#</th>
// //                       <th style={{ width: '38%' }}>Intitule Moodle (Question reelle)</th>
// //                       <th style={{ width: '30%' }}>Libelle Radar (Affiche)</th>
// //                       <th style={{ width: '25%' }}>Code Technique (BDD)</th>
// //                     </tr>
// //                   </thead>
// //                   <tbody>
// //                     {detectedCompetences.map((item, idx) => (
// //                       <tr key={idx}>
// //                         <td style={{ textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
// //                           {item.ordre}
// //                         </td>
// //                         <td>
// //                           <span className="text-white small fw-bold">{item.intitule_moodle}</span>
// //                         </td>
// //                         <td>
// //                           <Form.Control
// //                             size="sm"
// //                             className="comp-input py-1"
// //                             value={item.label}
// //                             onChange={(e) => handleUpdateDetectedItem(idx, 'label', e.target.value)}
// //                           />
// //                         </td>
// //                         <td>
// //                           <Form.Control
// //                             size="sm"
// //                             className="comp-input font-monospace py-1"
// //                             value={item.code}
// //                             onChange={(e) =>
// //                               handleUpdateDetectedItem(idx, 'code', generateCleanCode(e.target.value))
// //                             }
// //                           />
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </Table>
// //               </div>
// //             </>
// //           )}
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" size="sm" onClick={() => setShowMoodleModal(false)}>
// //             Annuler
// //           </Button>
// //           <Button
// //             variant="info"
// //             size="sm"
// //             className="fw-bold text-dark"
// //             disabled={detectedCompetences.length === 0 || saving}
// //             onClick={handleSaveDetectedCompetences}
// //           >
// //             {saving ? <Spinner size="sm" animation="border" /> : 'Valider et Enregistrer dans le referentiel'}
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>

// //       {/* Modale Confirmation Suppression */}
// //       <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>Supprimer la competence</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <p className="text-light mb-0">
// //             Etes-vous sur de vouloir supprimer definitivement cette competence du referentiel ?
// //           </p>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
// //           <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
// //         </Modal.Footer>
// //       </Modal>

// //       {/* Modale Restauration aux valeurs par defaut */}
// //       <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>Restaurer les competences standard</Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <p className="text-light mb-0">
// //             Voulez-vous reinitialiser le referentiel aux <strong>11 competences officielles de l ICAM</strong> ?
// //           </p>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" size="sm" onClick={() => setShowResetDefaultsModal(false)}>Annuler</Button>
// //           <Button variant="info" size="sm" onClick={handleResetDefaults}>Restaurer</Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </>
// //   );
// // }
// import React, { useEffect, useState, useMemo, useRef } from 'react';
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
//   saveBatchReferentielCompetences,
//   deleteReferentielCompetence,
//   resetReferentielToDefaults,
// } from '../services/supabase';

// ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// // Filtre robuste pour ecarter l administration, les parcours et les 10 choix de voeux
// const isIgnoredMoodleColumn = (headerText) => {
//   if (!headerText) return true;
//   const norm = headerText
//     .toLowerCase()
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .trim();

//   // 1. Voeux et Choix de projets (1er Choix, 2eme Choix, ... 10eme Choix)
//   if (norm.includes('choix') || norm.includes('voeu') || norm.includes('souhait')) {
//     return true;
//   }

//   // 2. Metadonnees de parcours et identite
//   if (norm.includes('parcours') || norm.includes('filiere') || norm.includes('groupe')) {
//     return true;
//   }

//   // 3. Colonnes d administration standard
//   const adminKeywords = [
//     'horodateur',
//     'timestamp',
//     'nom',
//     'prenom',
//     'courriel',
//     'email',
//     'id',
//     'date',
//     'dates',
//     'institution',
//     'departement',
//     'etat',
//     'statut',
//     'commence',
//     'termine',
//     'temps',
//     'note',
//   ];

//   return adminKeywords.some((kw) => norm === kw || norm.startsWith(`${kw} `) || norm.endsWith(` ${kw}`));
// };

// export default function ParametresCompetencesPage() {
//   const [competences, setCompetences] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   // Formulaire d ajout / edition manuelle
//   const [editingComp, setEditingComp] = useState(null);
//   const [formLabel, setFormLabel] = useState('');
//   const [formCode, setFormCode] = useState('');
//   const [formDesc, setFormDesc] = useState('');
//   const [formOrdre, setFormOrdre] = useState(1);
//   const [formActif, setFormActif] = useState(true);
//   const [formIntituleMoodle, setFormIntituleMoodle] = useState('');

//   // Modales
//   const [deletingId, setDeletingId] = useState(null);
//   const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

//   // Assistant Import Moodle
//   const [showMoodleModal, setShowMoodleModal] = useState(false);
//   const [detectedCompetences, setDetectedCompetences] = useState([]);
//   const [moodleParseError, setMoodleParseError] = useState(null);
//   const [moodleFileName, setMoodleFileName] = useState('');
//   const fileInputRef = useRef(null);

//   const loadData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await fetchReferentielCompetences(false);
//       setCompetences(data || []);
//       setFormOrdre((data?.length || 0) + 1);
//     } catch (err) {
//       setError(err.message || 'Erreur lors du chargement des competences.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

//   const generateCleanCode = (text) => {
//     return (text || '')
//       .toLowerCase()
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f]/g, '')
//       .replace(/[^a-z0-9]+/g, '_')
//       .replace(/^_+|_+$/g, '');
//   };

//   const handleLabelChange = (val) => {
//     setFormLabel(val);
//     if (!editingComp) {
//       setFormCode(generateCleanCode(val));
//     }
//   };

//   const startEdit = (comp) => {
//     setEditingComp(comp);
//     setFormLabel(comp.label || '');
//     setFormCode(comp.code || '');
//     setFormDesc(comp.description || '');
//     setFormOrdre(comp.ordre || 1);
//     setFormActif(comp.actif !== undefined ? comp.actif : true);
//     setFormIntituleMoodle(comp.intitule_moodle || '');
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const cancelEdit = () => {
//     setEditingComp(null);
//     setFormLabel('');
//     setFormCode('');
//     setFormDesc('');
//     setFormOrdre(competences.length + 1);
//     setFormActif(true);
//     setFormIntituleMoodle('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formLabel.trim() || !formCode.trim()) {
//       setError('Le libelle et le code sont obligatoires.');
//       return;
//     }

//     try {
//       setSaving(true);
//       setError(null);

//       const payload = {
//         label: formLabel.trim(),
//         code: formCode.trim(),
//         description: formDesc.trim(),
//         ordre: Number(formOrdre) || 1,
//         actif: formActif,
//         intitule_moodle: formIntituleMoodle.trim() || null,
//       };
//       if (editingComp?.id) payload.id = editingComp.id;

//       await saveReferentielCompetence(payload);
//       setSuccessMsg(
//         editingComp
//           ? `Competence "${formLabel}" mise a jour avec succes.`
//           : `Nouvelle competence "${formLabel}" ajoutee au referentiel.`
//       );
//       cancelEdit();
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la sauvegarde.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const toggleActive = async (comp) => {
//     try {
//       setError(null);
//       await saveReferentielCompetence({ ...comp, actif: !comp.actif });
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la mise a jour.');
//     }
//   };

//   const confirmDelete = async () => {
//     if (!deletingId) return;
//     try {
//       setSaving(true);
//       setError(null);
//       await deleteReferentielCompetence(deletingId);
//       setDeletingId(null);
//       setSuccessMsg('Competence supprimee du referentiel.');
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la suppression.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleResetDefaults = async () => {
//     try {
//       setSaving(true);
//       setError(null);
//       await resetReferentielToDefaults();
//       setShowResetDefaultsModal(false);
//       setSuccessMsg('Referentiel reinitialise aux 11 competences standard ICAM.');
//       await loadData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la reinitialisation.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const parseCsvHeaders = (text) => {
//     const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
//     if (lines.length === 0) return [];

//     const firstLine = lines[0];
//     const semiCount = (firstLine.match(/;/g) || []).length;
//     const commaCount = (firstLine.match(/,/g) || []).length;
//     const tabCount = (firstLine.match(/\t/g) || []).length;

//     let delimiter = ',';
//     if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
//     else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

//     const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}]*))`, 'g');
//     const headers = [];
//     let match;
//     while ((match = regex.exec(firstLine)) !== null) {
//       let cell = match[1] ? match[1].replace(/""/g, '"') : match[2];
//       headers.push((cell || '').trim());
//       if (regex.lastIndex === match.index) regex.lastIndex++;
//     }

//     return headers;
//   };

//   const handleMoodleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setMoodleFileName(file.name);
//     setMoodleParseError(null);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const rawContent = evt.target.result;
//         const headers = parseCsvHeaders(rawContent);

//         if (!headers || headers.length === 0) {
//           throw new Error('Le fichier semble vide ou ses en-tetes ne sont pas exploitables.');
//         }

//         const candidateQuestions = [];
//         const seenQuestions = new Set();

//         headers.forEach((header) => {
//           const cleanHeader = header.trim();
//           if (!cleanHeader) return;

//           // Ignorer les metadonnees, les filieres et les 10 colonnes de choix
//           if (!isIgnoredMoodleColumn(cleanHeader)) {
//             if (!seenQuestions.has(cleanHeader)) {
//               seenQuestions.add(cleanHeader);
//               candidateQuestions.push(cleanHeader);
//             }
//           }
//         });

//         if (candidateQuestions.length === 0) {
//           throw new Error('Aucune competence technique detectee apres filtrage.');
//         }

//         const rows = candidateQuestions.map((title, idx) => {
//           const existing = competences.find(
//             (c) =>
//               (c.intitule_moodle && c.intitule_moodle.toLowerCase() === title.toLowerCase()) ||
//               c.code === generateCleanCode(title)
//           );

//           return {
//             ordre: idx + 1,
//             intitule_moodle: title,
//             code: existing?.code || generateCleanCode(title),
//             label: existing?.label || title,
//             actif: existing?.actif !== undefined ? existing.actif : true,
//           };
//         });

//         setDetectedCompetences(rows);
//       } catch (err) {
//         setMoodleParseError(err.message || 'Impossible d analyser le fichier Moodle.');
//         setDetectedCompetences([]);
//       }
//     };

//     reader.readAsText(file, 'UTF-8');
//   };

//   const handleUpdateDetectedItem = (index, field, value) => {
//     setDetectedCompetences((prev) => {
//       const copy = [...prev];
//       copy[index] = { ...copy[index], [field]: value };
//       return copy;
//     });
//   };

//   const handleRemoveDetectedItem = (indexToRemove) => {
//     setDetectedCompetences((prev) =>
//       prev
//         .filter((_, idx) => idx !== indexToRemove)
//         .map((item, idx) => ({ ...item, ordre: idx + 1 }))
//     );
//   };

//   const handleSaveDetectedCompetences = async () => {
//     try {
//       setSaving(true);
//       setMoodleParseError(null);

//       const codes = detectedCompetences.map((c) => c.code.trim().toLowerCase());
//       const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
//       if (duplicates.length > 0) {
//         throw new Error(`Code technique en doublon : "${duplicates[0]}". Chaque code doit etre unique.`);
//       }

//       await saveBatchReferentielCompetences(detectedCompetences);
//       setShowMoodleModal(false);
//       setDetectedCompetences([]);
//       setMoodleFileName('');
//       setSuccessMsg(`${detectedCompetences.length} competences Moodle enregistrees avec succes.`);
//       await loadData();
//     } catch (err) {
//       setMoodleParseError(err.message || 'Erreur lors de l enregistrement.');
//     } finally {
//       setSaving(false);
//     }
//   };

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
//           label: 'Appetences (Exemple)',
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
//           --accent-cyan: #29d3d3;
//           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
//           --accent-emerald: #35d0a0;
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
//           font-size: 0.82rem;
//           color: var(--text-primary);
//           margin: 0;
//         }
//         .comp-table thead th {
//           background-color: var(--panel-solid) !important;
//           color: var(--text-muted) !important;
//           font-size: 0.7rem;
//           text-transform: uppercase;
//           letter-spacing: 0.05em;
//           font-weight: 700;
//           padding: 0.75rem 0.85rem;
//           border-bottom: 2px solid var(--border-strong) !important;
//         }
//         .comp-table tbody tr {
//           border-bottom: 1px solid var(--border-subtle);
//           transition: background-color 0.15s ease;
//         }
//         .comp-table tbody tr:hover td {
//           background-color: rgba(41, 211, 211, 0.06) !important;
//         }
//         .comp-table tbody td {
//           padding: 0.65rem 0.85rem;
//           vertical-align: middle;
//           border-color: var(--border-subtle) !important;
//           background: transparent !important;
//           color: var(--text-primary);
//         }

//         .comp-order-badge {
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           width: 26px;
//           height: 26px;
//           border-radius: 7px;
//           background: var(--panel-raised);
//           border: 1px solid var(--border-subtle);
//           color: var(--accent-cyan);
//           font-weight: 800;
//           font-size: 0.74rem;
//           font-family: monospace;
//         }

//         .comp-code-pill {
//           background: rgba(124, 108, 246, 0.12);
//           border: 1px solid rgba(124, 108, 246, 0.35);
//           color: #b9adfb;
//           padding: 2px 7px;
//           border-radius: 5px;
//           font-size: 0.7rem;
//           font-weight: 600;
//           font-family: monospace;
//           display: inline-block;
//         }

//         .comp-status-pill {
//           border-radius: 20px !important;
//           font-weight: 700 !important;
//           font-size: 0.68rem !important;
//           padding: 3px 10px !important;
//           transition: all 0.15s ease;
//         }
//         .comp-status-active {
//           background: rgba(53, 208, 160, 0.14) !important;
//           color: var(--accent-emerald) !important;
//           border: 1px solid rgba(53, 208, 160, 0.4) !important;
//         }
//         .comp-status-active:hover {
//           background: var(--accent-emerald) !important;
//           color: #06281d !important;
//         }
//         .comp-status-inactive {
//           background: rgba(148, 163, 184, 0.07) !important;
//           color: var(--text-muted) !important;
//           border: 1px solid var(--border-subtle) !important;
//         }
//         .comp-status-inactive:hover {
//           background: rgba(148, 163, 184, 0.18) !important;
//           color: #ffffff !important;
//         }

//         .comp-input {
//           background: var(--panel-raised) !important;
//           border: 1px solid var(--border-strong) !important;
//           color: var(--text-primary) !important;
//           border-radius: 8px;
//         }
//         .comp-form-label {
//           color: var(--text-primary) !important;
//           font-weight: 700 !important;
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
//             <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
//               Referentiel des Competences et Mapping Moodle
//             </h2>
//             <small className="text-muted">
//               Configurez le referentiel manuellement ou importez le fichier CSV Moodle pour extraire automatiquement les 11 competences.
//             </small>
//           </div>

//           <div className="d-flex align-items-center gap-2 flex-wrap">
//             <Button
//               variant="info"
//               size="sm"
//               onClick={() => {
//                 setMoodleParseError(null);
//                 setDetectedCompetences([]);
//                 setMoodleFileName('');
//                 setShowMoodleModal(true);
//               }}
//               className="px-3 py-2 fw-bold text-dark"
//             >
//               Detecter depuis un export Moodle
//             </Button>
//             <Button
//               variant="outline-secondary"
//               size="sm"
//               onClick={() => setShowResetDefaultsModal(true)}
//               className="px-3 py-2"
//             >
//               Restaurer les 11 competences standard
//             </Button>
//             <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
//               Actualiser
//             </Button>
//           </div>
//         </div>

//         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
//         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

//         <Row className="g-3">
//           {/* Formulaire manuel */}
//           <Col lg={4}>
//             <Card className="comp-card p-3 shadow-sm mb-3">
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h5 className="fw-bold text-white mb-0">
//                   {editingComp ? 'Modifier la competence' : 'Nouvelle competence'}
//                 </h5>
//                 {editingComp && (
//                   <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
//                     Annuler
//                   </Button>
//                 )}
//               </div>

//               <Form onSubmit={handleSubmit}>
//                 <Form.Group className="mb-2">
//                   <Form.Label className="small comp-form-label">Libelle affiche sur le Radar *</Form.Label>
//                   <Form.Control
//                     size="sm"
//                     className="comp-input"
//                     placeholder="Ex: Cybersecurite, Cloud AWS..."
//                     value={formLabel}
//                     onChange={(e) => handleLabelChange(e.target.value)}
//                     required
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label className="small comp-form-label">Code technique (identifiant unique) *</Form.Label>
//                   <Form.Control
//                     size="sm"
//                     className="comp-input font-monospace"
//                     placeholder="Ex: cybersecurite, cloud_aws..."
//                     value={formCode}
//                     onChange={(e) => setFormCode(generateCleanCode(e.target.value))}
//                     required
//                     disabled={Boolean(editingComp)}
//                   />
//                   <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>
//                     Cle unique en base (en minuscules sans accents).
//                   </small>
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label className="small comp-form-label">Intitule exact Moodle</Form.Label>
//                   <Form.Control
//                     size="sm"
//                     className="comp-input"
//                     placeholder="Ex: Automatique et automatisme"
//                     value={formIntituleMoodle}
//                     onChange={(e) => setFormIntituleMoodle(e.target.value)}
//                   />
//                   <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>
//                     Intitule exact pour faire correspondre les notes a l import.
//                   </small>
//                 </Form.Group>

//                 <Row className="g-2 mb-2">
//                   <Col xs={6}>
//                     <Form.Label className="small comp-form-label">Ordre</Form.Label>
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
//                   <Form.Label className="small comp-form-label">Description / Thematiques couvertes</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     size="sm"
//                     className="comp-input"
//                     placeholder="Mots-cles associes, description des projets..."
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
//                   {saving ? <Spinner size="sm" animation="border" /> : editingComp ? 'Mettre a jour' : 'Ajouter au referentiel'}
//                 </Button>
//               </Form>
//             </Card>

//             {/* Radar en direct */}
//             <Card className="comp-card p-3 shadow-sm">
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="small text-uppercase fw-bold text-muted">Apercu du Radar Chart</span>
//                 <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
//               </div>
//               <div style={{ position: 'relative', width: '100%', height: '240px' }}>
//                 <Radar data={radarPreviewData} options={radarOptions} />
//               </div>
//             </Card>
//           </Col>

//           {/* Tableau principal */}
//           <Col lg={8}>
//             <Card className="comp-card overflow-hidden shadow-sm">
//               <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
//                 <span className="fw-bold text-white fs-6">
//                   Liste des Competences ({competences.length} au total, {activeCompetences.length} actives)
//                 </span>
//                 <span className="small text-muted">
//                   Synchronisees avec le questionnaire Moodle.
//                 </span>
//               </div>

//               {loading ? (
//                 <div className="text-center py-5">
//                   <Spinner animation="border" variant="info" />
//                   <p className="mt-3 text-muted">Chargement du referentiel...</p>
//                 </div>
//               ) : competences.length === 0 ? (
//                 <div className="text-center py-5 text-muted">
//                   Aucune competence configuree. Utilisez "Detecter depuis un export Moodle" ou "Restaurer les 11 competences standard".
//                 </div>
//               ) : (
//                 <div className="table-responsive">
//                   <Table hover size="sm" className="comp-table mb-0 align-middle text-nowrap">
//                     <thead>
//                       <tr>
//                         <th style={{ width: '45px', textAlign: 'center' }}>#</th>
//                         <th>Competence (Radar)</th>
//                         <th>Code Technique</th>
//                         <th>Intitule Moodle lie</th>
//                         <th style={{ textAlign: 'center', width: '90px' }}>Statut</th>
//                         <th style={{ width: '150px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {competences.map((comp) => (
//                         <tr key={comp.id || comp.code} style={{ opacity: comp.actif ? 1 : 0.45 }}>
//                           <td style={{ textAlign: 'center' }}>
//                             <span className="comp-order-badge">{comp.ordre}</span>
//                           </td>
//                           <td>
//                             <div className="fw-bold text-white">{comp.label}</div>
//                             {comp.description && (
//                               <small className="text-muted text-truncate d-block" style={{ maxWidth: '220px' }}>
//                                 {comp.description}
//                               </small>
//                             )}
//                           </td>
//                           <td>
//                             <span className="comp-code-pill">{comp.code}</span>
//                           </td>
//                           <td>
//                             {comp.intitule_moodle ? (
//                               <span className="text-light small text-truncate d-inline-block" style={{ maxWidth: '260px' }}>
//                                 {comp.intitule_moodle}
//                               </span>
//                             ) : (
//                               <span className="text-warning small fst-italic">Non renseigne</span>
//                             )}
//                           </td>
//                           <td style={{ textAlign: 'center' }}>
//                             <Button
//                               className={`comp-status-pill ${comp.actif ? 'comp-status-active' : 'comp-status-inactive'}`}
//                               size="sm"
//                               onClick={() => toggleActive(comp)}
//                               title="Cliquer pour activer/desactiver"
//                             >
//                               {comp.actif ? 'Active' : 'Inactive'}
//                             </Button>
//                           </td>
//                           <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
//                             <div className="d-flex gap-2 justify-content-end">
//                               <Button
//                                 variant="outline-info"
//                                 size="sm"
//                                 onClick={() => startEdit(comp)}
//                                 style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
//                               >
//                                 Modifier
//                               </Button>
//                               <Button
//                                 variant="outline-danger"
//                                 size="sm"
//                                 onClick={() => setDeletingId(comp.id)}
//                                 style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
//                               >
//                                 Supprimer
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

//       {/* MODALE D'EXTRACTION MOODLE (AVEC FILTRE CHOIX ET METADONNEES) */}
//       <Modal
//         show={showMoodleModal}
//         onHide={() => setShowMoodleModal(false)}
//         size="xl"
//         centered
//         className="modal-dark"
//       >
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.15rem', color: '#29d3d3' }}>
//             Extraction des 11 Competences depuis l Export Moodle
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="text-light small mb-3">
//             Deposez votre fichier CSV Moodle. Le moteur filtre automatiquement les questions de parcours
//             et les 10 choix de voeux pour ne retenir que les 11 competences techniques.
//           </p>

//           <div className="mb-3 p-3 rounded" style={{ background: 'var(--panel-raised)', border: '1px dashed var(--border-strong)' }}>
//             <Form.Group controlId="moodleFileInput">
//               <Form.Label className="small fw-bold text-white mb-2">Selectionnez le fichier CSV Moodle :</Form.Label>
//               <Form.Control
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,text/csv"
//                 size="sm"
//                 className="comp-input"
//                 onChange={handleMoodleFileChange}
//               />
//             </Form.Group>
//             {moodleFileName && (
//               <div className="mt-2 text-info small">
//                 Fichier analyse : <strong>{moodleFileName}</strong>
//               </div>
//             )}
//           </div>

//           {moodleParseError && <Alert variant="danger" className="py-2 small">{moodleParseError}</Alert>}

//           {detectedCompetences.length > 0 && (
//             <>
//               <div className="d-flex justify-content-between align-items-center mb-2">
//                 <span className="small fw-bold text-white">
//                   Competences detectees ({detectedCompetences.length}) — Verifiez et ajustez si necessaire :
//                 </span>
//               </div>
//               <div className="table-responsive" style={{ maxHeight: '380px', overflowY: 'auto' }}>
//                 <Table hover size="sm" className="comp-table mb-0 align-middle">
//                   <thead>
//                     <tr>
//                       <th style={{ width: '40px', textAlign: 'center' }}>#</th>
//                       <th style={{ width: '36%' }}>Intitule Moodle reel</th>
//                       <th style={{ width: '28%' }}>Libelle Radar</th>
//                       <th style={{ width: '24%' }}>Code Technique</th>
//                       <th style={{ width: '12%', textAlign: 'center' }}>Action</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {detectedCompetences.map((item, idx) => (
//                       <tr key={idx}>
//                         <td style={{ textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
//                           {item.ordre}
//                         </td>
//                         <td>
//                           <span className="text-white small fw-bold">{item.intitule_moodle}</span>
//                         </td>
//                         <td>
//                           <Form.Control
//                             size="sm"
//                             className="comp-input py-1"
//                             value={item.label}
//                             onChange={(e) => handleUpdateDetectedItem(idx, 'label', e.target.value)}
//                           />
//                         </td>
//                         <td>
//                           <Form.Control
//                             size="sm"
//                             className="comp-input font-monospace py-1"
//                             value={item.code}
//                             onChange={(e) =>
//                               handleUpdateDetectedItem(idx, 'code', generateCleanCode(e.target.value))
//                             }
//                           />
//                         </td>
//                         <td style={{ textAlign: 'center' }}>
//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
//                             onClick={() => handleRemoveDetectedItem(idx)}
//                             title="Retirer cette ligne"
//                           >
//                             Retirer
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setShowMoodleModal(false)}>
//             Annuler
//           </Button>
//           <Button
//             variant="info"
//             size="sm"
//             className="fw-bold text-dark"
//             disabled={detectedCompetences.length === 0 || saving}
//             onClick={handleSaveDetectedCompetences}
//           >
//             {saving ? <Spinner size="sm" animation="border" /> : 'Valider et Enregistrer dans le referentiel'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modale Suppression */}
//       <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>Supprimer la competence</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="text-light mb-0">
//             Etes-vous sur de vouloir supprimer definitivement cette competence du referentiel ?
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
//           <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modale Restauration */}
//       <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>Restaurer les competences standard</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="text-light mb-0">
//             Voulez-vous reinitialiser le referentiel aux <strong>11 competences officielles de l ICAM</strong> ?
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

import React, { useEffect, useState, useMemo, useRef } from 'react';
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
  saveBatchReferentielCompetences,
  deleteReferentielCompetence,
  resetReferentielToDefaults,
  normalizeSpecialiteKey,
} from '../services/supabase';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Libelles d affichage standard officiels pour le Radar
const STANDARD_LABELS_MAP = {
  calculs_simulation_numerique: 'Calculs & Simulation',
  essais_caracterisation: 'Essais & Caracterisation',
  fabrication_prototypage: 'Fabrication & Proto',
  conception_mecanique: 'Conception Meca',
  automatique_automatisme: 'Automatique',
  iot_systeme_embarque: 'IOT & Embarque',
  robot_cobot: 'Robot & Cobot',
  vision: 'Vision Industrielle',
  ia: 'Intelligence Artificielle',
  ihm_appli_web_mobile: 'IHM & App Web/Mobile',
  ethique_ergonomie: 'Ethique & Ergonomie',
};

// Filtre robuste pour ecarter l administration, les parcours et les 10 choix de voeux
const isIgnoredMoodleColumn = (headerText) => {
  if (!headerText) return true;
  const norm = headerText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // 1. Voeux et Choix de projets (1er Choix, 2eme Choix, ... 10eme Choix)
  if (norm.includes('choix') || norm.includes('voeu') || norm.includes('souhait')) {
    return true;
  }

  // 2. Metadonnees de parcours et identite
  if (norm.includes('parcours') || norm.includes('filiere') || norm.includes('groupe')) {
    return true;
  }

  // 3. Colonnes d administration standard
  const adminKeywords = [
    'horodateur',
    'timestamp',
    'nom',
    'prenom',
    'courriel',
    'email',
    'id',
    'date',
    'dates',
    'institution',
    'departement',
    'etat',
    'statut',
    'commence',
    'termine',
    'temps',
    'note',
  ];

  return adminKeywords.some((kw) => norm === kw || norm.startsWith(`${kw} `) || norm.endsWith(` ${kw}`));
};

export default function ParametresCompetencesPage() {
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Formulaire d ajout / edition manuelle
  const [editingComp, setEditingComp] = useState(null);
  const [formLabel, setFormLabel] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formOrdre, setFormOrdre] = useState(1);
  const [formActif, setFormActif] = useState(true);
  const [formIntituleMoodle, setFormIntituleMoodle] = useState('');

  // Modales
  const [deletingId, setDeletingId] = useState(null);
  const [showResetDefaultsModal, setShowResetDefaultsModal] = useState(false);

  // Assistant Import Moodle
  const [showMoodleModal, setShowMoodleModal] = useState(false);
  const [detectedCompetences, setDetectedCompetences] = useState([]);
  const [moodleParseError, setMoodleParseError] = useState(null);
  const [moodleFileName, setMoodleFileName] = useState('');
  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchReferentielCompetences(false);
      setCompetences(data || []);
      setFormOrdre((data?.length || 0) + 1);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des competences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateCleanCode = (text) => {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const handleLabelChange = (val) => {
    setFormLabel(val);
    if (!editingComp) {
      const deduced = normalizeSpecialiteKey(val);
      setFormCode(deduced || generateCleanCode(val));
    }
  };

  const startEdit = (comp) => {
    setEditingComp(comp);
    setFormLabel(comp.label || '');
    setFormCode(comp.code || '');
    setFormDesc(comp.description || '');
    setFormOrdre(comp.ordre || 1);
    setFormActif(comp.actif !== undefined ? comp.actif : true);
    setFormIntituleMoodle(comp.intitule_moodle || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingComp(null);
    setFormLabel('');
    setFormCode('');
    setFormDesc('');
    setFormOrdre(competences.length + 1);
    setFormActif(true);
    setFormIntituleMoodle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formLabel.trim() || !formCode.trim()) {
      setError('Le libelle et le code sont obligatoires.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        label: formLabel.trim(),
        code: formCode.trim(),
        description: formDesc.trim(),
        ordre: Number(formOrdre) || 1,
        actif: formActif,
        intitule_moodle: formIntituleMoodle.trim() || null,
      };
      if (editingComp?.id) payload.id = editingComp.id;

      await saveReferentielCompetence(payload);
      setSuccessMsg(
        editingComp
          ? `Competence "${formLabel}" mise a jour avec succes.`
          : `Nouvelle competence "${formLabel}" ajoutee au referentiel.`
      );
      cancelEdit();
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (comp) => {
    try {
      setError(null);
      await saveReferentielCompetence({ ...comp, actif: !comp.actif });
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise a jour.');
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      setSaving(true);
      setError(null);
      await deleteReferentielCompetence(deletingId);
      setDeletingId(null);
      setSuccessMsg('Competence supprimee du referentiel.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    try {
      setSaving(true);
      setError(null);
      await resetReferentielToDefaults();
      setShowResetDefaultsModal(false);
      setSuccessMsg('Referentiel reinitialise aux 11 competences standard ICAM.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la reinitialisation.');
    } finally {
      setSaving(false);
    }
  };

  const parseCsvHeaders = (text) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];

    const firstLine = lines[0];
    const semiCount = (firstLine.match(/;/g) || []).length;
    const commaCount = (firstLine.match(/,/g) || []).length;
    const tabCount = (firstLine.match(/\t/g) || []).length;

    let delimiter = ',';
    if (semiCount > commaCount && semiCount > tabCount) delimiter = ';';
    else if (tabCount > commaCount && tabCount > semiCount) delimiter = '\t';

    const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}]*))`, 'g');
    const headers = [];
    let match;
    while ((match = regex.exec(firstLine)) !== null) {
      let cell = match[1] ? match[1].replace(/""/g, '"') : match[2];
      headers.push((cell || '').trim());
      if (regex.lastIndex === match.index) regex.lastIndex++;
    }

    return headers;
  };

  const handleMoodleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMoodleFileName(file.name);
    setMoodleParseError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const rawContent = evt.target.result;
        const headers = parseCsvHeaders(rawContent);

        if (!headers || headers.length === 0) {
          throw new Error('Le fichier semble vide ou ses en-tetes ne sont pas exploitables.');
        }

        const candidateQuestions = [];
        const seenQuestions = new Set();

        headers.forEach((header) => {
          const cleanHeader = header.trim();
          if (!cleanHeader) return;

          // Ignorer metadonnees, parcours et les 10 choix
          if (!isIgnoredMoodleColumn(cleanHeader)) {
            if (!seenQuestions.has(cleanHeader)) {
              seenQuestions.add(cleanHeader);
              candidateQuestions.push(cleanHeader);
            }
          }
        });

        if (candidateQuestions.length === 0) {
          throw new Error('Aucune competence technique detectee apres filtrage.');
        }

        const rows = candidateQuestions.map((title, idx) => {
          // Association automatique au nom exact de la colonne SQL via normalizeSpecialiteKey
          const deducedCode = normalizeSpecialiteKey(title);
          const finalCode = deducedCode || generateCleanCode(title);
          const finalLabel = STANDARD_LABELS_MAP[finalCode] || title;

          return {
            ordre: idx + 1,
            intitule_moodle: title,
            code: finalCode,
            label: finalLabel,
            actif: true,
          };
        });

        setDetectedCompetences(rows);
      } catch (err) {
        setMoodleParseError(err.message || 'Impossible d analyser le fichier Moodle.');
        setDetectedCompetences([]);
      }
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleUpdateDetectedItem = (index, field, value) => {
    setDetectedCompetences((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveDetectedItem = (indexToRemove) => {
    setDetectedCompetences((prev) =>
      prev
        .filter((_, idx) => idx !== indexToRemove)
        .map((item, idx) => ({ ...item, ordre: idx + 1 }))
    );
  };

  const handleSaveDetectedCompetences = async () => {
    try {
      setSaving(true);
      setMoodleParseError(null);

      const codes = detectedCompetences.map((c) => c.code.trim().toLowerCase());
      const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
      if (duplicates.length > 0) {
        throw new Error(`Code technique en doublon : "${duplicates[0]}". Chaque code doit etre unique.`);
      }

      await saveBatchReferentielCompetences(detectedCompetences);
      setShowMoodleModal(false);
      setDetectedCompetences([]);
      setMoodleFileName('');
      setSuccessMsg(`${detectedCompetences.length} competences Moodle enregistrees avec succes.`);
      await loadData();
    } catch (err) {
      setMoodleParseError(err.message || 'Erreur lors de l enregistrement.');
    } finally {
      setSaving(false);
    }
  };

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
          label: 'Appetences (Exemple)',
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
          --accent-cyan: #29d3d3;
          --accent-cyan-soft: rgba(41, 211, 211, 0.16);
          --accent-emerald: #35d0a0;
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

        .comp-table {
          font-size: 0.82rem;
          color: var(--text-primary);
          margin: 0;
        }
        .comp-table thead th {
          background-color: var(--panel-solid) !important;
          color: var(--text-muted) !important;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          padding: 0.75rem 0.85rem;
          border-bottom: 2px solid var(--border-strong) !important;
        }
        .comp-table tbody tr {
          border-bottom: 1px solid var(--border-subtle);
          transition: background-color 0.15s ease;
        }
        .comp-table tbody tr:hover td {
          background-color: rgba(41, 211, 211, 0.06) !important;
        }
        .comp-table tbody td {
          padding: 0.65rem 0.85rem;
          vertical-align: middle;
          border-color: var(--border-subtle) !important;
          background: transparent !important;
          color: var(--text-primary);
        }

        .comp-order-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 7px;
          background: var(--panel-raised);
          border: 1px solid var(--border-subtle);
          color: var(--accent-cyan);
          font-weight: 800;
          font-size: 0.74rem;
          font-family: monospace;
        }

        .comp-code-pill {
          background: rgba(124, 108, 246, 0.12);
          border: 1px solid rgba(124, 108, 246, 0.35);
          color: #b9adfb;
          padding: 2px 7px;
          border-radius: 5px;
          font-size: 0.7rem;
          font-weight: 600;
          font-family: monospace;
          display: inline-block;
        }

        .comp-status-pill {
          border-radius: 20px !important;
          font-weight: 700 !important;
          font-size: 0.68rem !important;
          padding: 3px 10px !important;
          transition: all 0.15s ease;
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

        .comp-input {
          background: var(--panel-raised) !important;
          border: 1px solid var(--border-strong) !important;
          color: var(--text-primary) !important;
          border-radius: 8px;
        }
        .comp-form-label {
          color: var(--text-primary) !important;
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
            <h2 className="fw-bold mb-0 text-white" style={{ fontSize: '1.5rem', letterSpacing: '-0.4px' }}>
              Referentiel des Competences et Mapping Moodle
            </h2>
            <small className="text-muted">
              Configurez le referentiel manuellement ou importez le fichier CSV Moodle pour extraire automatiquement les 11 competences.
            </small>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Button
              variant="info"
              size="sm"
              onClick={() => {
                setMoodleParseError(null);
                setDetectedCompetences([]);
                setMoodleFileName('');
                setShowMoodleModal(true);
              }}
              className="px-3 py-2 fw-bold text-dark"
            >
              Detecter depuis un export Moodle
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowResetDefaultsModal(true)}
              className="px-3 py-2"
            >
              Restaurer les 11 competences standard
            </Button>
            <Button variant="outline-light" size="sm" onClick={loadData} className="px-3 py-2">
              Actualiser
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

        <Row className="g-3">
          {/* Formulaire manuel */}
          <Col lg={4}>
            <Card className="comp-card p-3 shadow-sm mb-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-white mb-0">
                  {editingComp ? 'Modifier la competence' : 'Nouvelle competence'}
                </h5>
                {editingComp && (
                  <Button variant="link" size="sm" className="text-muted p-0" onClick={cancelEdit}>
                    Annuler
                  </Button>
                )}
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label className="small comp-form-label">Libelle affiche sur le Radar *</Form.Label>
                  <Form.Control
                    size="sm"
                    className="comp-input"
                    placeholder="Ex: Cybersecurite, Cloud AWS..."
                    value={formLabel}
                    onChange={(e) => handleLabelChange(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small comp-form-label">Code technique (colonne SQL) *</Form.Label>
                  <Form.Control
                    size="sm"
                    className="comp-input font-monospace"
                    placeholder="Ex: calculs_simulation_numerique..."
                    value={formCode}
                    onChange={(e) => setFormCode(generateCleanCode(e.target.value))}
                    required
                    disabled={Boolean(editingComp)}
                  />
                  <small className="font-monospace text-muted" style={{ fontSize: '0.7rem' }}>
                    Nom exact de la colonne dans les tables aptitudes et apetences.
                  </small>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small comp-form-label">Intitule exact Moodle</Form.Label>
                  <Form.Control
                    size="sm"
                    className="comp-input"
                    placeholder="Ex: Automatique et automatisme"
                    value={formIntituleMoodle}
                    onChange={(e) => setFormIntituleMoodle(e.target.value)}
                  />
                  <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>
                    Intitule exact pour faire correspondre les notes a l import.
                  </small>
                </Form.Group>

                <Row className="g-2 mb-2">
                  <Col xs={6}>
                    <Form.Label className="small comp-form-label">Ordre</Form.Label>
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
                  <Form.Label className="small comp-form-label">Description / Thematiques couvertes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    size="sm"
                    className="comp-input"
                    placeholder="Mots-cles associes, description des projets..."
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
                  {saving ? <Spinner size="sm" animation="border" /> : editingComp ? 'Mettre a jour' : 'Ajouter au referentiel'}
                </Button>
              </Form>
            </Card>

            {/* Radar */}
            <Card className="comp-card p-3 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small text-uppercase fw-bold text-muted">Apercu du Radar Chart</span>
                <Badge bg="info">{activeCompetences.length} axes actifs</Badge>
              </div>
              <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                <Radar data={radarPreviewData} options={radarOptions} />
              </div>
            </Card>
          </Col>

          {/* Tableau */}
          <Col lg={8}>
            <Card className="comp-card overflow-hidden shadow-sm">
              <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="fw-bold text-white fs-6">
                  Liste des Competences ({competences.length} au total, {activeCompetences.length} actives)
                </span>
                <span className="small text-muted">
                  Codes techniques alignes avec les colonnes SQL.
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="info" />
                  <p className="mt-3 text-muted">Chargement du referentiel...</p>
                </div>
              ) : competences.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  Aucune competence configuree. Utilisez "Detecter depuis un export Moodle" ou "Restaurer les 11 competences standard".
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover size="sm" className="comp-table mb-0 align-middle text-nowrap">
                    <thead>
                      <tr>
                        <th style={{ width: '45px', textAlign: 'center' }}>#</th>
                        <th>Competence (Radar)</th>
                        <th>Code Technique (SQL)</th>
                        <th>Intitule Moodle lie</th>
                        <th style={{ textAlign: 'center', width: '90px' }}>Statut</th>
                        <th style={{ width: '150px', textAlign: 'right', paddingRight: '1rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competences.map((comp) => (
                        <tr key={comp.id || comp.code} style={{ opacity: comp.actif ? 1 : 0.45 }}>
                          <td style={{ textAlign: 'center' }}>
                            <span className="comp-order-badge">{comp.ordre}</span>
                          </td>
                          <td>
                            <div className="fw-bold text-white">{comp.label}</div>
                            {comp.description && (
                              <small className="text-muted text-truncate d-block" style={{ maxWidth: '220px' }}>
                                {comp.description}
                              </small>
                            )}
                          </td>
                          <td>
                            <span className="comp-code-pill">{comp.code}</span>
                          </td>
                          <td>
                            {comp.intitule_moodle ? (
                              <span className="text-light small text-truncate d-inline-block" style={{ maxWidth: '260px' }}>
                                {comp.intitule_moodle}
                              </span>
                            ) : (
                              <span className="text-warning small fst-italic">Non renseigne</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <Button
                              className={`comp-status-pill ${comp.actif ? 'comp-status-active' : 'comp-status-inactive'}`}
                              size="sm"
                              onClick={() => toggleActive(comp)}
                              title="Cliquer pour activer/desactiver"
                            >
                              {comp.actif ? 'Active' : 'Inactive'}
                            </Button>
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: '1rem' }}>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => startEdit(comp)}
                                style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                              >
                                Modifier
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setDeletingId(comp.id)}
                                style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                              >
                                Supprimer
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

      {/* MODALE D'EXTRACTION MOODLE AVEC AUTO-MAPPING DES CODES SQL */}
      <Modal
        show={showMoodleModal}
        onHide={() => setShowMoodleModal(false)}
        size="xl"
        centered
        className="modal-dark"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.15rem', color: '#29d3d3' }}>
            Extraction des 11 Competences depuis l Export Moodle
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light small mb-3">
            Deposez votre fichier CSV Moodle. Le moteur associe automatiquement chaque question Moodle a sa
            colonne SQL correspondante dans la base de donnees.
          </p>

          <div className="mb-3 p-3 rounded" style={{ background: 'var(--panel-raised)', border: '1px dashed var(--border-strong)' }}>
            <Form.Group controlId="moodleFileInput">
              <Form.Label className="small fw-bold text-white mb-2">Selectionnez le fichier CSV Moodle :</Form.Label>
              <Form.Control
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                size="sm"
                className="comp-input"
                onChange={handleMoodleFileChange}
              />
            </Form.Group>
            {moodleFileName && (
              <div className="mt-2 text-info small">
                Fichier analyse : <strong>{moodleFileName}</strong>
              </div>
            )}
          </div>

          {moodleParseError && <Alert variant="danger" className="py-2 small">{moodleParseError}</Alert>}

          {detectedCompetences.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-bold text-white">
                  Competences detectees ({detectedCompetences.length}) — Verifiez et ajustez si necessaire :
                </span>
              </div>
              <div className="table-responsive" style={{ maxHeight: '380px', overflowY: 'auto' }}>
                <Table hover size="sm" className="comp-table mb-0 align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                      <th style={{ width: '36%' }}>Intitule Moodle reel</th>
                      <th style={{ width: '28%' }}>Libelle Radar</th>
                      <th style={{ width: '24%' }}>Code Technique (Colonne SQL)</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detectedCompetences.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: 'bold' }}>
                          {item.ordre}
                        </td>
                        <td>
                          <span className="text-white small fw-bold">{item.intitule_moodle}</span>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            className="comp-input py-1"
                            value={item.label}
                            onChange={(e) => handleUpdateDetectedItem(idx, 'label', e.target.value)}
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            className="comp-input font-monospace py-1"
                            value={item.code}
                            onChange={(e) =>
                              handleUpdateDetectedItem(idx, 'code', generateCleanCode(e.target.value))
                            }
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                            onClick={() => handleRemoveDetectedItem(idx)}
                            title="Retirer cette ligne"
                          >
                            Retirer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowMoodleModal(false)}>
            Annuler
          </Button>
          <Button
            variant="info"
            size="sm"
            className="fw-bold text-dark"
            disabled={detectedCompetences.length === 0 || saving}
            onClick={handleSaveDetectedCompetences}
          >
            {saving ? <Spinner size="sm" animation="border" /> : 'Valider et Enregistrer dans le referentiel'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale Suppression */}
      <Modal show={Boolean(deletingId)} onHide={() => setDeletingId(null)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#f87171' }}>Supprimer la competence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light mb-0">
            Etes-vous sur de vouloir supprimer definitivement cette competence du referentiel ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setDeletingId(null)}>Annuler</Button>
          <Button variant="danger" size="sm" onClick={confirmDelete}>Supprimer</Button>
        </Modal.Footer>
      </Modal>

      {/* Modale Restauration */}
      <Modal show={showResetDefaultsModal} onHide={() => setShowResetDefaultsModal(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#fff' }}>Restaurer les competences standard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light mb-0">
            Voulez-vous reinitialiser le referentiel aux <strong>11 competences officielles de l ICAM</strong> ?
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