// // import React, { useState } from 'react';
// // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col } from 'react-bootstrap';
// // import * as XLSX from 'xlsx';
// // import Navbar from './Navbar';
// // import {
// //   importChefsDeProjet,
// //   importEtudiants,
// //   importAptitudes,
// //   importApetences,
// // } from '../services/supabase';

// // const COMPETENCES = [
// //   'calculs_simulation_numerique',
// //   'essais_caracterisation',
// //   'fabrication_prototypage',
// //   'conception_mecanique',
// //   'automatique_automatisme',
// //   'iot_systeme_embarque',
// //   'robot_cobot',
// //   'vision',
// //   'ia',
// //   'ihm_appli_web_mobile',
// //   'ethique_ergonomie',
// // ];

// // export default function ImportPage() {
// //   const [importType, setImportType] = useState('chefs');
// //   const [parsedData, setParsedData] = useState([]);
// //   const [fileName, setFileName] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [successMsg, setSuccessMsg] = useState(null);

// //   // Parseur de nom/prénom depuis un email "jean.dupont@..." ou un nom complet
// //   const extractNameFromEmail = (email) => {
// //     try {
// //       const namePart = email.split('@')[0];
// //       const parts = namePart.split('.');
// //       if (parts.length >= 2) {
// //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// //         const nom = parts.slice(1).join(' ').toUpperCase();
// //         return { nom, prenom };
// //       }
// //       return { nom: namePart.toUpperCase(), prenom: '' };
// //     } catch {
// //       return { nom: email, prenom: '' };
// //     }
// //   };

// //   // Lecture du fichier (CSV ou XLSX)
// //   const handleFileUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     setFileName(file.name);
// //     setError(null);
// //     setSuccessMsg(null);
// //     setParsedData([]);

// //     const reader = new FileReader();
// //     reader.onload = (evt) => {
// //       try {
// //         const data = evt.target.result;
// //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// //         const sheetName = workbook.SheetNames[0];
// //         const sheet = workbook.Sheets[sheetName];
// //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// //         if (rawJson.length === 0) {
// //           throw new Error('Le fichier est vide.');
// //         }

// //         processData(rawJson, importType);
// //       } catch (err) {
// //         setError(`Erreur de lecture du fichier : ${err.message}`);
// //       }
// //     };
// //     reader.readAsBinaryString(file);
// //   };

// //   // Transformation des données selon le type
// //   const processData = (rows, type) => {
// //     if (rows.length < 2) {
// //       throw new Error('Le fichier ne contient pas assez de lignes.');
// //     }

// //     // Détection de header ou raw columns
// //     const firstRow = rows[0];
// //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// //     let formatted = [];

// //     if (type === 'chefs') {
// //       formatted = dataRows.map((r) => ({
// //         nom: String(r[0] || '').trim(),
// //         specialite: String(r[1] || '').trim(),
// //         email: String(r[2] || '').trim().toLowerCase(),
// //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// //       })).filter((r) => r.email && r.nom);
// //     } else if (type === 'etudiants') {
// //       formatted = dataRows.map((r) => {
// //         const emailOrFirst = String(r[0] || '').trim();
// //         const secondCol = String(r[1] || '').trim();
// //         const thirdCol = String(r[2] || '').trim();
// //         const fourthCol = String(r[3] || '').trim();

// //         // Si le fichier contient directement Adresse;parcours
// //         if (emailOrFirst.includes('@')) {
// //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// //           return {
// //             nom,
// //             prenom,
// //             adresse_email: emailOrFirst.toLowerCase(),
// //             parcours: secondCol || 'I2026',
// //           };
// //         }

// //         // Si colonnes : Nom | Prenom | Email | Parcours
// //         return {
// //           nom: emailOrFirst,
// //           prenom: secondCol,
// //           adresse_email: thirdCol.toLowerCase(),
// //           parcours: fourthCol || 'I2026',
// //         };
// //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// //     } else if (type === 'aptitudes' || type === 'apetences') {
// //       // Détection automatique questionnaire Moodle ou format simple
// //       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

// //       if (isMoodleSurvey) {
// //         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
// //         // Décalage pour aptitudes (colonnes 5 à 15) ou appétences (colonnes 16 à 26)
// //         const startOffset = type === 'aptitudes' ? 5 : 16;

// //         formatted = dataRows.map((r) => {
// //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// //           const rowData = { adresse_email: email };
// //           COMPETENCES.forEach((comp, idx) => {
// //             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
// //           });
// //           return rowData;
// //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// //       } else {
// //         // Format direct : adresse_email + 11 colonnes
// //         formatted = dataRows.map((r) => {
// //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// //           COMPETENCES.forEach((comp, idx) => {
// //             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
// //           });
// //           return rowData;
// //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// //       }
// //     }

// //     setParsedData(formatted);
// //   };

// //   // Exécution de l'import Supabase
// //   const handleImport = async () => {
// //     if (parsedData.length === 0) return;
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       setSuccessMsg(null);

// //       let result;
// //       if (importType === 'chefs') {
// //         result = await importChefsDeProjet(parsedData);
// //       } else if (importType === 'etudiants') {
// //         result = await importEtudiants(parsedData);
// //       } else if (importType === 'aptitudes') {
// //         result = await importAptitudes(parsedData);
// //       } else if (importType === 'apetences') {
// //         result = await importApetences(parsedData);
// //       }

// //       setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// //       setParsedData([]);
// //       setFileName('');
// //     } catch (err) {
// //       setError(err.message || "Erreur lors de l'import dans la base de données.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="page-container" style={{ maxWidth: '95%', margin: '0 auto', padding: '1.5rem 0' }}>
// //         <div className="d-flex justify-content-between align-items-center mb-3">
// //           <div>
// //             <h2 className="mb-0">Import de données (Admin)</h2>
// //             <small className="text-muted">
// //               Importez vos fichiers CSV ou Excel pour alimenter la base de données Supabase.
// //             </small>
// //           </div>
// //         </div>

// //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// //         <Card className="mb-4 p-3 bg-dark text-white border-secondary">
// //           <Row className="g-3 align-items-end">
// //             <Col md={4}>
// //               <Form.Label className="fw-bold small text-muted">1. Type de données à importer</Form.Label>
// //               <Form.Select
// //                 value={importType}
// //                 onChange={(e) => {
// //                   setImportType(e.target.value);
// //                   setParsedData([]);
// //                   setFileName('');
// //                 }}
// //               >
// //                 <option value="chefs">Chefs de projet (nom, spécialité, email)</option>
// //                 <option value="etudiants">Étudiants (nom, prénom, email, parcours)</option>
// //                 <option value="aptitudes">Aptitudes techniques (11 compétences)</option>
// //                 <option value="apetences">Appétences / Intérêts (11 compétences)</option>
// //               </Form.Select>
// //             </Col>

// //             <Col md={5}>
// //               <Form.Label className="fw-bold small text-muted">2. Sélectionner le fichier (.csv, .xlsx)</Form.Label>
// //               <Form.Control
// //                 type="file"
// //                 accept=".csv, .xlsx, .xls"
// //                 onChange={handleFileUpload}
// //               />
// //             </Col>

// //             <Col md={3} className="d-flex justify-content-end">
// //               <Button
// //                 variant="success"
// //                 className="w-100"
// //                 onClick={handleImport}
// //                 disabled={loading || parsedData.length === 0}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Spinner size="sm" animation="border" className="me-2" />
// //                     Importation...
// //                   </>
// //                 ) : (
// //                   `Importer (${parsedData.length} lignes)`
// //                 )}
// //               </Button>
// //             </Col>
// //           </Row>
// //         </Card>

// //         {/* Prévisualisation */}
// //         {parsedData.length > 0 && (
// //           <Card className="bg-dark text-white border-secondary">
// //             <Card.Header className="d-flex justify-content-between align-items-center">
// //               <span>
// //                 Prévisualisation : <strong>{fileName}</strong>
// //               </span>
// //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// //             </Card.Header>
// //             <div className="table-responsive" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
// //               <Table striped bordered hover size="sm" variant="dark" className="mb-0 text-nowrap">
// //                 <thead>
// //                   <tr>
// //                     <th>#</th>
// //                     {Object.keys(parsedData[0]).map((key) => (
// //                       <th key={key}>{key}</th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {parsedData.slice(0, 50).map((row, idx) => (
// //                     <tr key={idx}>
// //                       <td>{idx + 1}</td>
// //                       {Object.values(row).map((val, cIdx) => (
// //                         <td key={cIdx}>{String(val)}</td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </Table>
// //             </div>
// //             {parsedData.length > 50 && (
// //               <Card.Footer className="text-muted small text-center">
// //                 Affichage des 50 premières lignes sur {parsedData.length}.
// //               </Card.Footer>
// //             )}
// //           </Card>
// //         )}
// //       </div>
// //     </>
// //   );
// // }

// import React, { useState } from 'react';
// import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
// import Navbar from './Navbar';
// import {
//   importChefsDeProjet,
//   importEtudiants,
//   importAptitudes,
//   importApetences,
// } from '../services/supabase';

// const COMPETENCES = [
//   'calculs_simulation_numerique',
//   'essais_caracterisation',
//   'fabrication_prototypage',
//   'conception_mecanique',
//   'automatique_automatisme',
//   'iot_systeme_embarque',
//   'robot_cobot',
//   'vision',
//   'ia',
//   'ihm_appli_web_mobile',
//   'ethique_ergonomie',
// ];

// const IMPORT_TYPES = [
//   { value: 'chefs', label: 'Chefs de projet', hint: 'nom, spécialité, email' },
//   { value: 'etudiants', label: 'Étudiants', hint: 'nom, prénom, email, parcours' },
//   { value: 'aptitudes', label: 'Aptitudes techniques', hint: '11 compétences' },
//   { value: 'apetences', label: 'Appétences / Intérêts', hint: '11 compétences' },
// ];

// export default function ImportPage() {
//   const [importType, setImportType] = useState('chefs');
//   const [parsedData, setParsedData] = useState([]);
//   const [fileName, setFileName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   // Parseur de nom/prénom depuis un email "jean.dupont@..." ou un nom complet
//   const extractNameFromEmail = (email) => {
//     try {
//       const namePart = email.split('@')[0];
//       const parts = namePart.split('.');
//       if (parts.length >= 2) {
//         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
//         const nom = parts.slice(1).join(' ').toUpperCase();
//         return { nom, prenom };
//       }
//       return { nom: namePart.toUpperCase(), prenom: '' };
//     } catch {
//       return { nom: email, prenom: '' };
//     }
//   };

//   // Lecture du fichier (CSV ou XLSX)
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setFileName(file.name);
//     setError(null);
//     setSuccessMsg(null);
//     setParsedData([]);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const data = evt.target.result;
//         const workbook = XLSX.read(data, { type: 'binary', raw: false });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

//         if (rawJson.length === 0) {
//           throw new Error('Le fichier est vide.');
//         }

//         processData(rawJson, importType);
//       } catch (err) {
//         setError(`Erreur de lecture du fichier : ${err.message}`);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   // Transformation des données selon le type
//   const processData = (rows, type) => {
//     if (rows.length < 2) {
//       throw new Error('Le fichier ne contient pas assez de lignes.');
//     }

//     // Détection de header ou raw columns
//     const firstRow = rows[0];
//     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

//     let formatted = [];

//     if (type === 'chefs') {
//       formatted = dataRows.map((r) => ({
//         nom: String(r[0] || '').trim(),
//         specialite: String(r[1] || '').trim(),
//         email: String(r[2] || '').trim().toLowerCase(),
//         max_creneaux_entretien: parseInt(r[3], 10) || 15,
//       })).filter((r) => r.email && r.nom);
//     } else if (type === 'etudiants') {
//       formatted = dataRows.map((r) => {
//         const emailOrFirst = String(r[0] || '').trim();
//         const secondCol = String(r[1] || '').trim();
//         const thirdCol = String(r[2] || '').trim();
//         const fourthCol = String(r[3] || '').trim();

//         // Si le fichier contient directement Adresse;parcours
//         if (emailOrFirst.includes('@')) {
//           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
//           return {
//             nom,
//             prenom,
//             adresse_email: emailOrFirst.toLowerCase(),
//             parcours: secondCol || 'I2026',
//           };
//         }

//         // Si colonnes : Nom | Prenom | Email | Parcours
//         return {
//           nom: emailOrFirst,
//           prenom: secondCol,
//           adresse_email: thirdCol.toLowerCase(),
//           parcours: fourthCol || 'I2026',
//         };
//       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
//     } else if (type === 'aptitudes' || type === 'apetences') {
//       // Détection automatique questionnaire Moodle ou format simple
//       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

//       if (isMoodleSurvey) {
//         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
//         // Décalage pour aptitudes (colonnes 5 à 15) ou appétences (colonnes 16 à 26)
//         const startOffset = type === 'aptitudes' ? 5 : 16;

//         formatted = dataRows.map((r) => {
//           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
//           const rowData = { adresse_email: email };
//           COMPETENCES.forEach((comp, idx) => {
//             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
//           });
//           return rowData;
//         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
//       } else {
//         // Format direct : adresse_email + 11 colonnes
//         formatted = dataRows.map((r) => {
//           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
//           COMPETENCES.forEach((comp, idx) => {
//             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
//           });
//           return rowData;
//         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
//       }
//     }

//     setParsedData(formatted);
//   };

//   // Exécution de l'import Supabase
//   const handleImport = async () => {
//     if (parsedData.length === 0) return;
//     try {
//       setLoading(true);
//       setError(null);
//       setSuccessMsg(null);

//       let result;
//       if (importType === 'chefs') {
//         result = await importChefsDeProjet(parsedData);
//       } else if (importType === 'etudiants') {
//         result = await importEtudiants(parsedData);
//       } else if (importType === 'aptitudes') {
//         result = await importAptitudes(parsedData);
//       } else if (importType === 'apetences') {
//         result = await importApetences(parsedData);
//       }

//       setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
//       setParsedData([]);
//       setFileName('');
//     } catch (err) {
//       setError(err.message || "Erreur lors de l'import dans la base de données.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const activeType = IMPORT_TYPES.find((t) => t.value === importType);

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
//           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
//           --accent-coral: #ff6b6b;
//         }

//         .import-page-wrapper {
//           max-width: 100%;
//           margin: 0 auto;
//           padding: 1.25rem 1rem 2.5rem 1rem;
//           color: var(--text-primary);
//           background:
//             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
//             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
//             var(--canvas);
//           min-height: calc(100vh - 60px);
//         }
//         .import-card {
//           background: var(--panel);
//           backdrop-filter: blur(16px);
//           border: 1px solid var(--border-subtle);
//           border-radius: 14px;
//         }
//         .import-page-wrapper .alert-danger {
//           background: rgba(255,107,107,0.12);
//           border-color: rgba(255,107,107,0.35);
//           color: #ffd7d7;
//         }
//         .import-page-wrapper .alert-success {
//           background: var(--accent-emerald-soft);
//           border-color: rgba(53,208,160,0.4);
//           color: #baf5e2;
//         }

//         /* Étapes */
//         .import-step-label {
//           display: flex;
//           align-items: center;
//           gap: 0.4rem;
//           color: var(--text-muted);
//           font-weight: 700;
//           font-size: 0.75rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           margin-bottom: 0.5rem;
//         }
//         .import-step-num {
//           width: 20px; height: 20px;
//           border-radius: 50%;
//           background: var(--accent-violet-soft);
//           color: var(--accent-violet);
//           display: inline-flex; align-items: center; justify-content: center;
//           font-size: 0.7rem; font-weight: 800;
//         }
//         .import-type-options {
//           display: flex;
//           flex-direction: column;
//           gap: 0.4rem;
//         }
//         .import-type-option {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 0.5rem;
//           padding: 0.5rem 0.7rem;
//           border-radius: 10px;
//           border: 1px solid var(--border-subtle);
//           background: rgba(255,255,255,0.02);
//           cursor: pointer;
//           transition: border-color 0.15s ease, background 0.15s ease;
//         }
//         .import-type-option:hover { background: rgba(255,255,255,0.05); }
//         .import-type-option.active {
//           border-color: var(--accent-cyan);
//           background: var(--accent-cyan-soft);
//         }
//         .import-type-option input { accent-color: var(--accent-cyan); }
//         .import-type-option .opt-label { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
//         .import-type-option .opt-hint { font-size: 0.72rem; color: var(--text-muted); }

//         .import-dropzone {
//           position: relative;
//           border: 1.5px dashed var(--border-strong);
//           border-radius: 12px;
//           padding: 1.5rem 1rem;
//           text-align: center;
//           background: rgba(255,255,255,0.02);
//           transition: border-color 0.15s ease, background 0.15s ease;
//         }
//         .import-dropzone:hover {
//           border-color: var(--accent-cyan);
//           background: var(--accent-cyan-soft);
//         }
//         .import-dropzone input[type="file"] {
//           position: absolute;
//           inset: 0;
//           opacity: 0;
//           cursor: pointer;
//         }
//         .import-dropzone .dz-icon { font-size: 1.6rem; margin-bottom: 0.35rem; }
//         .import-dropzone .dz-text { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
//         .import-dropzone .dz-sub { font-size: 0.72rem; color: var(--text-muted); }
//         .import-filename-chip {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.35rem;
//           margin-top: 0.5rem;
//           padding: 0.25rem 0.6rem;
//           border-radius: 20px;
//           background: var(--panel-raised);
//           border: 1px solid var(--border-strong);
//           font-size: 0.75rem;
//           color: var(--text-primary);
//         }

//         .import-submit-btn {
//           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
//           border: none;
//           color: #06231a;
//           font-weight: 700;
//           border-radius: 10px;
//           height: 100%;
//           min-height: 78px;
//         }
//         .import-submit-btn:disabled {
//           background: var(--panel-raised);
//           color: var(--text-muted);
//           opacity: 1;
//         }

//         /* Prévisualisation */
//         .import-preview-header {
//           background: var(--panel-raised);
//           border-bottom: 1px solid var(--border-subtle);
//           padding: 0.75rem 1rem;
//         }
//         .import-preview-wrapper {
//           max-height: 55vh;
//           overflow: auto;
//         }
//         .import-preview-table {
//           font-size: 0.78rem;
//         }
//         .import-preview-table thead th {
//           position: sticky;
//           top: 0;
//           background: var(--panel-solid);
//           color: var(--text-muted);
//           font-size: 0.7rem;
//           text-transform: uppercase;
//           letter-spacing: 0.4px;
//           border-bottom: 2px solid var(--accent-violet-soft) !important;
//           z-index: 2;
//         }
//         .import-preview-table tbody td {
//           border-color: var(--border-subtle) !important;
//           color: var(--text-primary);
//         }
//         .import-preview-table tbody tr:nth-child(odd) {
//           background: rgba(255,255,255,0.015);
//         }
//         .import-page-wrapper .badge.bg-info {
//           background: var(--accent-cyan) !important;
//           color: #06231a !important;
//         }
//       `}</style>

//       <Navbar />

//       <div className="import-page-wrapper">
//         <div className="mb-3">
//           <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>📥 Import de données</h2>
//           <small className="text-muted">
//             Importez vos fichiers CSV ou Excel pour alimenter la base de données.
//           </small>
//         </div>

//         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
//         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

//         <Card className="import-card mb-4 p-3 border-0">
//           <Row className="g-3 align-items-stretch">
//             <Col md={4}>
//               <div className="import-step-label"><span className="import-step-num">1</span> Type de données</div>
//               <div className="import-type-options">
//                 {IMPORT_TYPES.map((t) => (
//                   <label
//                     key={t.value}
//                     className={`import-type-option ${importType === t.value ? 'active' : ''}`}
//                   >
//                     <div>
//                       <div className="opt-label">{t.label}</div>
//                       <div className="opt-hint">{t.hint}</div>
//                     </div>
//                     <input
//                       type="radio"
//                       name="importType"
//                       value={t.value}
//                       checked={importType === t.value}
//                       onChange={(e) => {
//                         setImportType(e.target.value);
//                         setParsedData([]);
//                         setFileName('');
//                       }}
//                     />
//                   </label>
//                 ))}
//               </div>
//             </Col>

//             <Col md={5}>
//               <div className="import-step-label"><span className="import-step-num">2</span> Fichier (.csv, .xlsx)</div>
//               <div className="import-dropzone">
//                 <Form.Control
//                   type="file"
//                   accept=".csv, .xlsx, .xls"
//                   onChange={handleFileUpload}
//                   aria-label="Sélectionner le fichier à importer"
//                 />
//                 <div className="dz-icon">📄</div>
//                 <div className="dz-text">Cliquez ou glissez un fichier ici</div>
//                 <div className="dz-sub">Format attendu : {activeType?.hint}</div>
//                 {fileName && (
//                   <div className="import-filename-chip">📎 {fileName}</div>
//                 )}
//               </div>
//             </Col>

//             <Col md={3}>
//               <div className="import-step-label"><span className="import-step-num">3</span> Importer</div>
//               <Button
//                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
//                 onClick={handleImport}
//                 disabled={loading || parsedData.length === 0}
//               >
//                 {loading ? (
//                   <>
//                     <Spinner size="sm" animation="border" className="me-2" />
//                     Importation...
//                   </>
//                 ) : (
//                   `Importer (${parsedData.length} ligne${parsedData.length > 1 ? 's' : ''})`
//                 )}
//               </Button>
//             </Col>
//           </Row>
//         </Card>

//         {/* Prévisualisation */}
//         {parsedData.length > 0 && (
//           <Card className="import-card border-0 overflow-hidden">
//             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
//               <span>
//                 Prévisualisation : <strong>{fileName}</strong>
//               </span>
//               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
//             </div>
//             <div className="import-preview-wrapper">
//               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     {Object.keys(parsedData[0]).map((key) => (
//                       <th key={key}>{key}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {parsedData.slice(0, 50).map((row, idx) => (
//                     <tr key={idx}>
//                       <td className="text-muted">{idx + 1}</td>
//                       {Object.values(row).map((val, cIdx) => (
//                         <td key={cIdx}>{String(val)}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//             {parsedData.length > 50 && (
//               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
//                 Affichage des 50 premières lignes sur {parsedData.length}.
//               </div>
//             )}
//           </Card>
//         )}
//       </div>
//     </>
//   );
// }

import React, { useState } from 'react';
import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Navbar from './Navbar';
import {
  importChefsDeProjet,
  importEtudiants,
  importAptitudes,
  importApetences,
  purgeAllDocuments,
  supabase,
} from '../services/supabase';

const COMPETENCES = [
  'calculs_simulation_numerique',
  'essais_caracterisation',
  'fabrication_prototypage',
  'conception_mecanique',
  'automatique_automatisme',
  'iot_systeme_embarque',
  'robot_cobot',
  'vision',
  'ia',
  'ihm_appli_web_mobile',
  'ethique_ergonomie',
];

const IMPORT_TYPES = [
  { value: 'chefs', label: 'Chefs de projet', hint: 'nom, spécialité, email' },
  { value: 'etudiants', label: 'Étudiants', hint: 'nom, prénom, email, parcours' },
  { value: 'aptitudes', label: 'Aptitudes techniques', hint: '11 compétences' },
  { value: 'apetences', label: 'Appétences / Intérêts', hint: '11 compétences' },
];

export default function ImportPage() {
  const [importType, setImportType] = useState('chefs');
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // États pour la modale de remise à zéro / purge
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  // Options de purge sélectionnées
  const [purgeOptions, setPurgeOptions] = useState({
    documents: false,
    competences: false,
    etudiants: false,
    chefs: false,
    tout: false,
  });

  const extractNameFromEmail = (email) => {
    try {
      const namePart = email.split('@')[0];
      const parts = namePart.split('.');
      if (parts.length >= 2) {
        const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        const nom = parts.slice(1).join(' ').toUpperCase();
        return { nom, prenom };
      }
      return { nom: namePart.toUpperCase(), prenom: '' };
    } catch {
      return { nom: email, prenom: '' };
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setSuccessMsg(null);
    setParsedData([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary', raw: false });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        if (rawJson.length === 0) {
          throw new Error('Le fichier est vide.');
        }

        processData(rawJson, importType);
      } catch (err) {
        setError(`Erreur de lecture du fichier : ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const processData = (rows, type) => {
    if (rows.length < 2) {
      throw new Error('Le fichier ne contient pas assez de lignes.');
    }

    const firstRow = rows[0];
    const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

    let formatted = [];

    if (type === 'chefs') {
      formatted = dataRows.map((r) => ({
        nom: String(r[0] || '').trim(),
        specialite: String(r[1] || '').trim(),
        email: String(r[2] || '').trim().toLowerCase(),
        max_creneaux_entretien: parseInt(r[3], 10) || 15,
      })).filter((r) => r.email && r.nom);
    } else if (type === 'etudiants') {
      formatted = dataRows.map((r) => {
        const emailOrFirst = String(r[0] || '').trim();
        const secondCol = String(r[1] || '').trim();
        const thirdCol = String(r[2] || '').trim();
        const fourthCol = String(r[3] || '').trim();

        if (emailOrFirst.includes('@')) {
          const { nom, prenom } = extractNameFromEmail(emailOrFirst);
          return {
            nom,
            prenom,
            adresse_email: emailOrFirst.toLowerCase(),
            parcours: secondCol || 'I2026',
          };
        }

        return {
          nom: emailOrFirst,
          prenom: secondCol,
          adresse_email: thirdCol.toLowerCase(),
          parcours: fourthCol || 'I2026',
        };
      }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
    } else if (type === 'aptitudes' || type === 'apetences') {
      const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

      if (isMoodleSurvey) {
        const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
        const startOffset = type === 'aptitudes' ? 5 : 16;

        formatted = dataRows.map((r) => {
          const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
          const rowData = { adresse_email: email };
          COMPETENCES.forEach((comp, idx) => {
            rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
          });
          return rowData;
        }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
      } else {
        formatted = dataRows.map((r) => {
          const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
          COMPETENCES.forEach((comp, idx) => {
            rowData[comp] = parseInt(r[idx + 1], 10) || 0;
          });
          return rowData;
        }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
      }
    }

    setParsedData(formatted);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      let result;
      if (importType === 'chefs') {
        result = await importChefsDeProjet(parsedData);
      } else if (importType === 'etudiants') {
        result = await importEtudiants(parsedData);
      } else if (importType === 'aptitudes') {
        result = await importAptitudes(parsedData);
      } else if (importType === 'apetences') {
        result = await importApetences(parsedData);
      }

      setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
      setParsedData([]);
      setFileName('');
    } catch (err) {
      setError(err.message || "Erreur lors de l'import dans la base de données.");
    } finally {
      setLoading(false);
    }
  };

  // Exécution de la purge / remise à zéro
  const handleExecutePurge = async () => {
    try {
      setResetting(true);
      setError(null);
      setSuccessMsg(null);

      const messages = [];

      // 1. Purge des fichiers Storage (CV et LM)
      if (purgeOptions.documents || purgeOptions.tout) {
        await purgeAllDocuments();
        messages.push('Fichiers CV & LM supprimés du Cloud.');
      }

      // 2. Purge sélective des tables via RPC PostgreSQL
      const payloadRPC = {
        rendez_vous: purgeOptions.tout,
        evaluations: purgeOptions.tout,
        affectations: purgeOptions.tout,
        selections: purgeOptions.tout,
        disponibilites: purgeOptions.tout,
        competences: purgeOptions.competences || purgeOptions.tout,
        etudiants: purgeOptions.etudiants || purgeOptions.tout,
        chefs: purgeOptions.chefs || purgeOptions.tout,
        users: purgeOptions.tout,
      };

      const { data, error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
      if (rpcErr) throw rpcErr;

      messages.push('Base de données mise à jour selon vos critères.');
      setSuccessMsg(`🗑️ Purge réussie : ${messages.join(' ')}`);
      setShowResetModal(false);
      setConfirmText('');
      setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
    } catch (err) {
      setError(err.message || 'Erreur lors de la purge.');
    } finally {
      setResetting(false);
    }
  };

  const activeType = IMPORT_TYPES.find((t) => t.value === importType);
  const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
  const isButtonDisabled = resetting || (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) || (requiresConfirmText && confirmText !== 'CONFIRMER');

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
          --accent-emerald-soft: rgba(53, 208, 160, 0.16);
          --accent-coral: #ff6b6b;
        }

        .import-page-wrapper {
          max-width: 100%;
          margin: 0 auto;
          padding: 1.25rem 1rem 2.5rem 1rem;
          color: var(--text-primary);
          background:
            radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
            radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
            var(--canvas);
          min-height: calc(100vh - 60px);
        }
        .import-card {
          background: var(--panel);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-subtle);
          border-radius: 14px;
        }
        .import-page-wrapper .alert-danger {
          background: rgba(255,107,107,0.12);
          border-color: rgba(255,107,107,0.35);
          color: #ffd7d7;
        }
        .import-page-wrapper .alert-success {
          background: var(--accent-emerald-soft);
          border-color: rgba(53,208,160,0.4);
          color: #baf5e2;
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

        .import-step-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--text-muted);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.5rem;
        }
        .import-step-num {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: var(--accent-violet-soft);
          color: var(--accent-violet);
          display: inline-flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 800;
        }
        .import-type-options {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .import-type-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.5rem 0.7rem;
          border-radius: 10px;
          border: 1px solid var(--border-subtle);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .import-type-option:hover { background: rgba(255,255,255,0.05); }
        .import-type-option.active {
          border-color: var(--accent-cyan);
          background: var(--accent-cyan-soft);
        }
        .import-type-option input { accent-color: var(--accent-cyan); }
        .import-type-option .opt-label { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
        .import-type-option .opt-hint { font-size: 0.72rem; color: var(--text-muted); }

        .import-dropzone {
          position: relative;
          border: 1.5px dashed var(--border-strong);
          border-radius: 12px;
          padding: 1.5rem 1rem;
          text-align: center;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .import-dropzone:hover {
          border-color: var(--accent-cyan);
          background: var(--accent-cyan-soft);
        }
        .import-dropzone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }
        .import-dropzone .dz-icon { font-size: 1.6rem; margin-bottom: 0.35rem; }
        .import-dropzone .dz-text { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
        .import-dropzone .dz-sub { font-size: 0.72rem; color: var(--text-muted); }
        .import-filename-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.5rem;
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          background: var(--panel-raised);
          border: 1px solid var(--border-strong);
          font-size: 0.75rem;
          color: var(--text-primary);
        }

        .import-submit-btn {
          background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
          border: none;
          color: #06231a;
          font-weight: 700;
          border-radius: 10px;
          height: 100%;
          min-height: 78px;
        }
        .import-submit-btn:disabled {
          background: var(--panel-raised);
          color: var(--text-muted);
          opacity: 1;
        }

        .import-preview-header {
          background: var(--panel-raised);
          border-bottom: 1px solid var(--border-subtle);
          padding: 0.75rem 1rem;
        }
        .import-preview-wrapper {
          max-height: 55vh;
          overflow: auto;
        }
        .import-preview-table {
          font-size: 0.78rem;
        }
        .import-preview-table thead th {
          position: sticky;
          top: 0;
          background: var(--panel-solid);
          color: var(--text-muted);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          border-bottom: 2px solid var(--accent-violet-soft) !important;
          z-index: 2;
        }
        .import-preview-table tbody td {
          border-color: var(--border-subtle) !important;
          color: var(--text-primary);
        }
        .import-preview-table tbody tr:nth-child(odd) {
          background: rgba(255,255,255,0.015);
        }
        .import-page-wrapper .badge.bg-info {
          background: var(--accent-cyan) !important;
          color: #06231a !important;
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
      `}</style>

      <Navbar />

      <div className="import-page-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>📥 Import &amp; Gestion des données</h2>
            <small className="text-muted">
              Alimentez la base avec vos fichiers CSV/Excel ou nettoyez les données existantes.
            </small>
          </div>

          {/* Bouton d'accès à la purge */}
          <Button
            className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
            size="sm"
            onClick={() => setShowResetModal(true)}
          >
            <span>🗑️</span>
            <span>Zone Danger / Purge &amp; Reset</span>
          </Button>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

        <Card className="import-card mb-4 p-3 border-0">
          <Row className="g-3 align-items-stretch">
            <Col md={4}>
              <div className="import-step-label"><span className="import-step-num">1</span> Type de données</div>
              <div className="import-type-options">
                {IMPORT_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className={`import-type-option ${importType === t.value ? 'active' : ''}`}
                  >
                    <div>
                      <div className="opt-label">{t.label}</div>
                      <div className="opt-hint">{t.hint}</div>
                    </div>
                    <input
                      type="radio"
                      name="importType"
                      value={t.value}
                      checked={importType === t.value}
                      onChange={(e) => {
                        setImportType(e.target.value);
                        setParsedData([]);
                        setFileName('');
                      }}
                    />
                  </label>
                ))}
              </div>
            </Col>

            <Col md={5}>
              <div className="import-step-label"><span className="import-step-num">2</span> Fichier (.csv, .xlsx)</div>
              <div className="import-dropzone">
                <Form.Control
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  aria-label="Sélectionner le fichier à importer"
                />
                <div className="dz-icon">📄</div>
                <div className="dz-text">Cliquez ou glissez un fichier ici</div>
                <div className="dz-sub">Format attendu : {activeType?.hint}</div>
                {fileName && (
                  <div className="import-filename-chip">📎 {fileName}</div>
                )}
              </div>
            </Col>

            <Col md={3}>
              <div className="import-step-label"><span className="import-step-num">3</span> Importer</div>
              <Button
                className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
                onClick={handleImport}
                disabled={loading || parsedData.length === 0}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Importation...
                  </>
                ) : (
                  `Importer (${parsedData.length} ligne${parsedData.length > 1 ? 's' : ''})`
                )}
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Prévisualisation */}
        {parsedData.length > 0 && (
          <Card className="import-card border-0 overflow-hidden">
            <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span>
                Prévisualisation : <strong>{fileName}</strong>
              </span>
              <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
            </div>
            <div className="import-preview-wrapper">
              <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
                <thead>
                  <tr>
                    <th>#</th>
                    {Object.keys(parsedData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 50).map((row, idx) => (
                    <tr key={idx}>
                      <td className="text-muted">{idx + 1}</td>
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx}>{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {parsedData.length > 50 && (
              <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                Affichage des 50 premières lignes sur {parsedData.length}.
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Modale Zone Danger — Purge & Remise à zéro */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
            ⚠️ Zone Danger — Purge &amp; Remise à zéro
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light small mb-3">
            Cochez les éléments que vous souhaitez purger ou supprimer pour redémarrer une nouvelle campagne :
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
            <Form.Check
              type="checkbox"
              id="purge-docs"
              label="📄 Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
              checked={purgeOptions.documents}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
              className="mb-2 text-white"
            />
            <Form.Check
              type="checkbox"
              id="purge-comp"
              label="📊 Vider les Aptitudes & Appétences des étudiants"
              checked={purgeOptions.competences}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
              className="mb-2 text-white"
            />
            <Form.Check
              type="checkbox"
              id="purge-etud"
              label="🎓 Supprimer TOUS les Étudiants (efface aussi leurs vœux, rendez-vous et évaluations)"
              checked={purgeOptions.etudiants}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
              className="mb-2 text-warning"
            />
            <Form.Check
              type="checkbox"
              id="purge-chefs"
              label="👨‍🏫 Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilités et rendez-vous)"
              checked={purgeOptions.chefs}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
              className="mb-2 text-warning"
            />
            <hr style={{ borderColor: 'var(--border-subtle)' }} />
            <Form.Check
              type="checkbox"
              id="purge-tout"
              label="🔥 TOUT RÉINITIALISER : Vider absolument toutes les données de campagne pour une nouvelle rentrée"
              checked={purgeOptions.tout}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
              className="text-danger fw-bold"
            />
          </div>

          {requiresConfirmText && (
            <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <Form.Label className="small text-danger fw-bold mb-1">
                Sécurité : Tapez le mot « CONFIRMER » pour débloquer la suppression :
              </Form.Label>
              <Form.Control
                size="sm"
                placeholder="Tapez CONFIRMER"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="bg-dark text-white border-danger"
              />
            </div>
          )}

          <p className="text-muted small mb-0">
            ⚠️ Les données supprimées ne pourront pas être récupérées.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
            Annuler
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleExecutePurge}
            disabled={isButtonDisabled}
          >
            {resetting ? <Spinner size="sm" animation="border" /> : 'Exécuter la purge sélectionnée'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}