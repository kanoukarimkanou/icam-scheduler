// // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col } from 'react-bootstrap';
// // // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // // import Navbar from './Navbar';
// // // // // // // // // // // import {
// // // // // // // // // // //   importChefsDeProjet,
// // // // // // // // // // //   importEtudiants,
// // // // // // // // // // //   importAptitudes,
// // // // // // // // // // //   importApetences,
// // // // // // // // // // // } from '../services/supabase';

// // // // // // // // // // // const COMPETENCES = [
// // // // // // // // // // //   'calculs_simulation_numerique',
// // // // // // // // // // //   'essais_caracterisation',
// // // // // // // // // // //   'fabrication_prototypage',
// // // // // // // // // // //   'conception_mecanique',
// // // // // // // // // // //   'automatique_automatisme',
// // // // // // // // // // //   'iot_systeme_embarque',
// // // // // // // // // // //   'robot_cobot',
// // // // // // // // // // //   'vision',
// // // // // // // // // // //   'ia',
// // // // // // // // // // //   'ihm_appli_web_mobile',
// // // // // // // // // // //   'ethique_ergonomie',
// // // // // // // // // // // ];

// // // // // // // // // // // export default function ImportPage() {
// // // // // // // // // // //   const [importType, setImportType] = useState('chefs');
// // // // // // // // // // //   const [parsedData, setParsedData] = useState([]);
// // // // // // // // // // //   const [fileName, setFileName] = useState('');
// // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // //   const [error, setError] = useState(null);
// // // // // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // // // // //   // Parseur de nom/prénom depuis un email "jean.dupont@..." ou un nom complet
// // // // // // // // // // //   const extractNameFromEmail = (email) => {
// // // // // // // // // // //     try {
// // // // // // // // // // //       const namePart = email.split('@')[0];
// // // // // // // // // // //       const parts = namePart.split('.');
// // // // // // // // // // //       if (parts.length >= 2) {
// // // // // // // // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // // // // // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // // // // // // // //         return { nom, prenom };
// // // // // // // // // // //       }
// // // // // // // // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // // // // // // // //     } catch {
// // // // // // // // // // //       return { nom: email, prenom: '' };
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   // Lecture du fichier (CSV ou XLSX)
// // // // // // // // // // //   const handleFileUpload = (e) => {
// // // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // // //     if (!file) return;

// // // // // // // // // // //     setFileName(file.name);
// // // // // // // // // // //     setError(null);
// // // // // // // // // // //     setSuccessMsg(null);
// // // // // // // // // // //     setParsedData([]);

// // // // // // // // // // //     const reader = new FileReader();
// // // // // // // // // // //     reader.onload = (evt) => {
// // // // // // // // // // //       try {
// // // // // // // // // // //         const data = evt.target.result;
// // // // // // // // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // // // // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // // // // // // //         const sheet = workbook.Sheets[sheetName];
// // // // // // // // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // // // // // // // //         if (rawJson.length === 0) {
// // // // // // // // // // //           throw new Error('Le fichier est vide.');
// // // // // // // // // // //         }

// // // // // // // // // // //         processData(rawJson, importType);
// // // // // // // // // // //       } catch (err) {
// // // // // // // // // // //         setError(`Erreur de lecture du fichier : ${err.message}`);
// // // // // // // // // // //       }
// // // // // // // // // // //     };
// // // // // // // // // // //     reader.readAsBinaryString(file);
// // // // // // // // // // //   };

// // // // // // // // // // //   // Transformation des données selon le type
// // // // // // // // // // //   const processData = (rows, type) => {
// // // // // // // // // // //     if (rows.length < 2) {
// // // // // // // // // // //       throw new Error('Le fichier ne contient pas assez de lignes.');
// // // // // // // // // // //     }

// // // // // // // // // // //     // Détection de header ou raw columns
// // // // // // // // // // //     const firstRow = rows[0];
// // // // // // // // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // // // // // // // //     let formatted = [];

// // // // // // // // // // //     if (type === 'chefs') {
// // // // // // // // // // //       formatted = dataRows.map((r) => ({
// // // // // // // // // // //         nom: String(r[0] || '').trim(),
// // // // // // // // // // //         specialite: String(r[1] || '').trim(),
// // // // // // // // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // // // // // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // // // // // // // //       })).filter((r) => r.email && r.nom);
// // // // // // // // // // //     } else if (type === 'etudiants') {
// // // // // // // // // // //       formatted = dataRows.map((r) => {
// // // // // // // // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // // // // // // // //         const secondCol = String(r[1] || '').trim();
// // // // // // // // // // //         const thirdCol = String(r[2] || '').trim();
// // // // // // // // // // //         const fourthCol = String(r[3] || '').trim();

// // // // // // // // // // //         // Si le fichier contient directement Adresse;parcours
// // // // // // // // // // //         if (emailOrFirst.includes('@')) {
// // // // // // // // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // // // // // // // //           return {
// // // // // // // // // // //             nom,
// // // // // // // // // // //             prenom,
// // // // // // // // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // // // // // // // //             parcours: secondCol || 'I2026',
// // // // // // // // // // //           };
// // // // // // // // // // //         }

// // // // // // // // // // //         // Si colonnes : Nom | Prenom | Email | Parcours
// // // // // // // // // // //         return {
// // // // // // // // // // //           nom: emailOrFirst,
// // // // // // // // // // //           prenom: secondCol,
// // // // // // // // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // // // // // // // //           parcours: fourthCol || 'I2026',
// // // // // // // // // // //         };
// // // // // // // // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // // // // // // // //       // Détection automatique questionnaire Moodle ou format simple
// // // // // // // // // // //       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

// // // // // // // // // // //       if (isMoodleSurvey) {
// // // // // // // // // // //         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
// // // // // // // // // // //         // Décalage pour aptitudes (colonnes 5 à 15) ou appétences (colonnes 16 à 26)
// // // // // // // // // // //         const startOffset = type === 'aptitudes' ? 5 : 16;

// // // // // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // // // // // // // //           const rowData = { adresse_email: email };
// // // // // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // // // // //             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
// // // // // // // // // // //           });
// // // // // // // // // // //           return rowData;
// // // // // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // // // //       } else {
// // // // // // // // // // //         // Format direct : adresse_email + 11 colonnes
// // // // // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // // // // //             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
// // // // // // // // // // //           });
// // // // // // // // // // //           return rowData;
// // // // // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // // // //       }
// // // // // // // // // // //     }

// // // // // // // // // // //     setParsedData(formatted);
// // // // // // // // // // //   };

// // // // // // // // // // //   // Exécution de l'import Supabase
// // // // // // // // // // //   const handleImport = async () => {
// // // // // // // // // // //     if (parsedData.length === 0) return;
// // // // // // // // // // //     try {
// // // // // // // // // // //       setLoading(true);
// // // // // // // // // // //       setError(null);
// // // // // // // // // // //       setSuccessMsg(null);

// // // // // // // // // // //       let result;
// // // // // // // // // // //       if (importType === 'chefs') {
// // // // // // // // // // //         result = await importChefsDeProjet(parsedData);
// // // // // // // // // // //       } else if (importType === 'etudiants') {
// // // // // // // // // // //         result = await importEtudiants(parsedData);
// // // // // // // // // // //       } else if (importType === 'aptitudes') {
// // // // // // // // // // //         result = await importAptitudes(parsedData);
// // // // // // // // // // //       } else if (importType === 'apetences') {
// // // // // // // // // // //         result = await importApetences(parsedData);
// // // // // // // // // // //       }

// // // // // // // // // // //       setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // // // // // // // //       setParsedData([]);
// // // // // // // // // // //       setFileName('');
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       setError(err.message || "Erreur lors de l'import dans la base de données.");
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <>
// // // // // // // // // // //       <Navbar />
// // // // // // // // // // //       <div className="page-container" style={{ maxWidth: '95%', margin: '0 auto', padding: '1.5rem 0' }}>
// // // // // // // // // // //         <div className="d-flex justify-content-between align-items-center mb-3">
// // // // // // // // // // //           <div>
// // // // // // // // // // //             <h2 className="mb-0">Import de données (Admin)</h2>
// // // // // // // // // // //             <small className="text-muted">
// // // // // // // // // // //               Importez vos fichiers CSV ou Excel pour alimenter la base de données Supabase.
// // // // // // // // // // //             </small>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </div>

// // // // // // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // // // // //         <Card className="mb-4 p-3 bg-dark text-white border-secondary">
// // // // // // // // // // //           <Row className="g-3 align-items-end">
// // // // // // // // // // //             <Col md={4}>
// // // // // // // // // // //               <Form.Label className="fw-bold small text-muted">1. Type de données à importer</Form.Label>
// // // // // // // // // // //               <Form.Select
// // // // // // // // // // //                 value={importType}
// // // // // // // // // // //                 onChange={(e) => {
// // // // // // // // // // //                   setImportType(e.target.value);
// // // // // // // // // // //                   setParsedData([]);
// // // // // // // // // // //                   setFileName('');
// // // // // // // // // // //                 }}
// // // // // // // // // // //               >
// // // // // // // // // // //                 <option value="chefs">Chefs de projet (nom, spécialité, email)</option>
// // // // // // // // // // //                 <option value="etudiants">Étudiants (nom, prénom, email, parcours)</option>
// // // // // // // // // // //                 <option value="aptitudes">Aptitudes techniques (11 compétences)</option>
// // // // // // // // // // //                 <option value="apetences">Appétences / Intérêts (11 compétences)</option>
// // // // // // // // // // //               </Form.Select>
// // // // // // // // // // //             </Col>

// // // // // // // // // // //             <Col md={5}>
// // // // // // // // // // //               <Form.Label className="fw-bold small text-muted">2. Sélectionner le fichier (.csv, .xlsx)</Form.Label>
// // // // // // // // // // //               <Form.Control
// // // // // // // // // // //                 type="file"
// // // // // // // // // // //                 accept=".csv, .xlsx, .xls"
// // // // // // // // // // //                 onChange={handleFileUpload}
// // // // // // // // // // //               />
// // // // // // // // // // //             </Col>

// // // // // // // // // // //             <Col md={3} className="d-flex justify-content-end">
// // // // // // // // // // //               <Button
// // // // // // // // // // //                 variant="success"
// // // // // // // // // // //                 className="w-100"
// // // // // // // // // // //                 onClick={handleImport}
// // // // // // // // // // //                 disabled={loading || parsedData.length === 0}
// // // // // // // // // // //               >
// // // // // // // // // // //                 {loading ? (
// // // // // // // // // // //                   <>
// // // // // // // // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // // // // // // // //                     Importation...
// // // // // // // // // // //                   </>
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   `Importer (${parsedData.length} lignes)`
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </Button>
// // // // // // // // // // //             </Col>
// // // // // // // // // // //           </Row>
// // // // // // // // // // //         </Card>

// // // // // // // // // // //         {/* Prévisualisation */}
// // // // // // // // // // //         {parsedData.length > 0 && (
// // // // // // // // // // //           <Card className="bg-dark text-white border-secondary">
// // // // // // // // // // //             <Card.Header className="d-flex justify-content-between align-items-center">
// // // // // // // // // // //               <span>
// // // // // // // // // // //                 Prévisualisation : <strong>{fileName}</strong>
// // // // // // // // // // //               </span>
// // // // // // // // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // // // // // // // //             </Card.Header>
// // // // // // // // // // //             <div className="table-responsive" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
// // // // // // // // // // //               <Table striped bordered hover size="sm" variant="dark" className="mb-0 text-nowrap">
// // // // // // // // // // //                 <thead>
// // // // // // // // // // //                   <tr>
// // // // // // // // // // //                     <th>#</th>
// // // // // // // // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // // // // // // // //                       <th key={key}>{key}</th>
// // // // // // // // // // //                     ))}
// // // // // // // // // // //                   </tr>
// // // // // // // // // // //                 </thead>
// // // // // // // // // // //                 <tbody>
// // // // // // // // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // // // // // // // //                     <tr key={idx}>
// // // // // // // // // // //                       <td>{idx + 1}</td>
// // // // // // // // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // // // // // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // // // // // // // //                       ))}
// // // // // // // // // // //                     </tr>
// // // // // // // // // // //                   ))}
// // // // // // // // // // //                 </tbody>
// // // // // // // // // // //               </Table>
// // // // // // // // // // //             </div>
// // // // // // // // // // //             {parsedData.length > 50 && (
// // // // // // // // // // //               <Card.Footer className="text-muted small text-center">
// // // // // // // // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // // // // // // // //               </Card.Footer>
// // // // // // // // // // //             )}
// // // // // // // // // // //           </Card>
// // // // // // // // // // //         )}
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col } from 'react-bootstrap';
// // // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // // import Navbar from './Navbar';
// // // // // // // // // // import {
// // // // // // // // // //   importChefsDeProjet,
// // // // // // // // // //   importEtudiants,
// // // // // // // // // //   importAptitudes,
// // // // // // // // // //   importApetences,
// // // // // // // // // // } from '../services/supabase';

// // // // // // // // // // const COMPETENCES = [
// // // // // // // // // //   'calculs_simulation_numerique',
// // // // // // // // // //   'essais_caracterisation',
// // // // // // // // // //   'fabrication_prototypage',
// // // // // // // // // //   'conception_mecanique',
// // // // // // // // // //   'automatique_automatisme',
// // // // // // // // // //   'iot_systeme_embarque',
// // // // // // // // // //   'robot_cobot',
// // // // // // // // // //   'vision',
// // // // // // // // // //   'ia',
// // // // // // // // // //   'ihm_appli_web_mobile',
// // // // // // // // // //   'ethique_ergonomie',
// // // // // // // // // // ];

// // // // // // // // // // const IMPORT_TYPES = [
// // // // // // // // // //   { value: 'chefs', label: 'Chefs de projet', hint: 'nom, spécialité, email' },
// // // // // // // // // //   { value: 'etudiants', label: 'Étudiants', hint: 'nom, prénom, email, parcours' },
// // // // // // // // // //   { value: 'aptitudes', label: 'Aptitudes techniques', hint: '11 compétences' },
// // // // // // // // // //   { value: 'apetences', label: 'Appétences / Intérêts', hint: '11 compétences' },
// // // // // // // // // // ];

// // // // // // // // // // export default function ImportPage() {
// // // // // // // // // //   const [importType, setImportType] = useState('chefs');
// // // // // // // // // //   const [parsedData, setParsedData] = useState([]);
// // // // // // // // // //   const [fileName, setFileName] = useState('');
// // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // //   const [error, setError] = useState(null);
// // // // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // // // //   // Parseur de nom/prénom depuis un email "jean.dupont@..." ou un nom complet
// // // // // // // // // //   const extractNameFromEmail = (email) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const namePart = email.split('@')[0];
// // // // // // // // // //       const parts = namePart.split('.');
// // // // // // // // // //       if (parts.length >= 2) {
// // // // // // // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // // // // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // // // // // // //         return { nom, prenom };
// // // // // // // // // //       }
// // // // // // // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // // // // // // //     } catch {
// // // // // // // // // //       return { nom: email, prenom: '' };
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // Lecture du fichier (CSV ou XLSX)
// // // // // // // // // //   const handleFileUpload = (e) => {
// // // // // // // // // //     const file = e.target.files[0];
// // // // // // // // // //     if (!file) return;

// // // // // // // // // //     setFileName(file.name);
// // // // // // // // // //     setError(null);
// // // // // // // // // //     setSuccessMsg(null);
// // // // // // // // // //     setParsedData([]);

// // // // // // // // // //     const reader = new FileReader();
// // // // // // // // // //     reader.onload = (evt) => {
// // // // // // // // // //       try {
// // // // // // // // // //         const data = evt.target.result;
// // // // // // // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // // // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // // // // // //         const sheet = workbook.Sheets[sheetName];
// // // // // // // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // // // // // // //         if (rawJson.length === 0) {
// // // // // // // // // //           throw new Error('Le fichier est vide.');
// // // // // // // // // //         }

// // // // // // // // // //         processData(rawJson, importType);
// // // // // // // // // //       } catch (err) {
// // // // // // // // // //         setError(`Erreur de lecture du fichier : ${err.message}`);
// // // // // // // // // //       }
// // // // // // // // // //     };
// // // // // // // // // //     reader.readAsBinaryString(file);
// // // // // // // // // //   };

// // // // // // // // // //   // Transformation des données selon le type
// // // // // // // // // //   const processData = (rows, type) => {
// // // // // // // // // //     if (rows.length < 2) {
// // // // // // // // // //       throw new Error('Le fichier ne contient pas assez de lignes.');
// // // // // // // // // //     }

// // // // // // // // // //     // Détection de header ou raw columns
// // // // // // // // // //     const firstRow = rows[0];
// // // // // // // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // // // // // // //     let formatted = [];

// // // // // // // // // //     if (type === 'chefs') {
// // // // // // // // // //       formatted = dataRows.map((r) => ({
// // // // // // // // // //         nom: String(r[0] || '').trim(),
// // // // // // // // // //         specialite: String(r[1] || '').trim(),
// // // // // // // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // // // // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // // // // // // //       })).filter((r) => r.email && r.nom);
// // // // // // // // // //     } else if (type === 'etudiants') {
// // // // // // // // // //       formatted = dataRows.map((r) => {
// // // // // // // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // // // // // // //         const secondCol = String(r[1] || '').trim();
// // // // // // // // // //         const thirdCol = String(r[2] || '').trim();
// // // // // // // // // //         const fourthCol = String(r[3] || '').trim();

// // // // // // // // // //         // Si le fichier contient directement Adresse;parcours
// // // // // // // // // //         if (emailOrFirst.includes('@')) {
// // // // // // // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // // // // // // //           return {
// // // // // // // // // //             nom,
// // // // // // // // // //             prenom,
// // // // // // // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // // // // // // //             parcours: secondCol || 'I2026',
// // // // // // // // // //           };
// // // // // // // // // //         }

// // // // // // // // // //         // Si colonnes : Nom | Prenom | Email | Parcours
// // // // // // // // // //         return {
// // // // // // // // // //           nom: emailOrFirst,
// // // // // // // // // //           prenom: secondCol,
// // // // // // // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // // // // // // //           parcours: fourthCol || 'I2026',
// // // // // // // // // //         };
// // // // // // // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // // // // // // //       // Détection automatique questionnaire Moodle ou format simple
// // // // // // // // // //       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

// // // // // // // // // //       if (isMoodleSurvey) {
// // // // // // // // // //         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
// // // // // // // // // //         // Décalage pour aptitudes (colonnes 5 à 15) ou appétences (colonnes 16 à 26)
// // // // // // // // // //         const startOffset = type === 'aptitudes' ? 5 : 16;

// // // // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // // // // // // //           const rowData = { adresse_email: email };
// // // // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // // // //             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
// // // // // // // // // //           });
// // // // // // // // // //           return rowData;
// // // // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // // //       } else {
// // // // // // // // // //         // Format direct : adresse_email + 11 colonnes
// // // // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // // // //             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
// // // // // // // // // //           });
// // // // // // // // // //           return rowData;
// // // // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // // //       }
// // // // // // // // // //     }

// // // // // // // // // //     setParsedData(formatted);
// // // // // // // // // //   };

// // // // // // // // // //   // Exécution de l'import Supabase
// // // // // // // // // //   const handleImport = async () => {
// // // // // // // // // //     if (parsedData.length === 0) return;
// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       setError(null);
// // // // // // // // // //       setSuccessMsg(null);

// // // // // // // // // //       let result;
// // // // // // // // // //       if (importType === 'chefs') {
// // // // // // // // // //         result = await importChefsDeProjet(parsedData);
// // // // // // // // // //       } else if (importType === 'etudiants') {
// // // // // // // // // //         result = await importEtudiants(parsedData);
// // // // // // // // // //       } else if (importType === 'aptitudes') {
// // // // // // // // // //         result = await importAptitudes(parsedData);
// // // // // // // // // //       } else if (importType === 'apetences') {
// // // // // // // // // //         result = await importApetences(parsedData);
// // // // // // // // // //       }

// // // // // // // // // //       setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // // // // // // //       setParsedData([]);
// // // // // // // // // //       setFileName('');
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       setError(err.message || "Erreur lors de l'import dans la base de données.");
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const activeType = IMPORT_TYPES.find((t) => t.value === importType);

// // // // // // // // // //   return (
// // // // // // // // // //     <>
// // // // // // // // // //       <style>{`
// // // // // // // // // //         :root {
// // // // // // // // // //           --canvas: #0a0e1a;
// // // // // // // // // //           --panel: rgba(21, 27, 46, 0.86);
// // // // // // // // // //           --panel-solid: #151b2e;
// // // // // // // // // //           --panel-raised: #1b2338;
// // // // // // // // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // // // // // // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // // // // // // // //           --text-primary: #f4f6fb;
// // // // // // // // // //           --text-muted: #93a0b8;
// // // // // // // // // //           --accent-violet: #7c6cf6;
// // // // // // // // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // // // // // // // //           --accent-cyan: #29d3d3;
// // // // // // // // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // // // // // // // //           --accent-emerald: #35d0a0;
// // // // // // // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // // // // // // //           --accent-coral: #ff6b6b;
// // // // // // // // // //         }

// // // // // // // // // //         .import-page-wrapper {
// // // // // // // // // //           max-width: 100%;
// // // // // // // // // //           margin: 0 auto;
// // // // // // // // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // // // // // // // //           color: var(--text-primary);
// // // // // // // // // //           background:
// // // // // // // // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // // // // // // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // // // // // // // //             var(--canvas);
// // // // // // // // // //           min-height: calc(100vh - 60px);
// // // // // // // // // //         }
// // // // // // // // // //         .import-card {
// // // // // // // // // //           background: var(--panel);
// // // // // // // // // //           backdrop-filter: blur(16px);
// // // // // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // // // // //           border-radius: 14px;
// // // // // // // // // //         }
// // // // // // // // // //         .import-page-wrapper .alert-danger {
// // // // // // // // // //           background: rgba(255,107,107,0.12);
// // // // // // // // // //           border-color: rgba(255,107,107,0.35);
// // // // // // // // // //           color: #ffd7d7;
// // // // // // // // // //         }
// // // // // // // // // //         .import-page-wrapper .alert-success {
// // // // // // // // // //           background: var(--accent-emerald-soft);
// // // // // // // // // //           border-color: rgba(53,208,160,0.4);
// // // // // // // // // //           color: #baf5e2;
// // // // // // // // // //         }

// // // // // // // // // //         /* Étapes */
// // // // // // // // // //         .import-step-label {
// // // // // // // // // //           display: flex;
// // // // // // // // // //           align-items: center;
// // // // // // // // // //           gap: 0.4rem;
// // // // // // // // // //           color: var(--text-muted);
// // // // // // // // // //           font-weight: 700;
// // // // // // // // // //           font-size: 0.75rem;
// // // // // // // // // //           text-transform: uppercase;
// // // // // // // // // //           letter-spacing: 0.5px;
// // // // // // // // // //           margin-bottom: 0.5rem;
// // // // // // // // // //         }
// // // // // // // // // //         .import-step-num {
// // // // // // // // // //           width: 20px; height: 20px;
// // // // // // // // // //           border-radius: 50%;
// // // // // // // // // //           background: var(--accent-violet-soft);
// // // // // // // // // //           color: var(--accent-violet);
// // // // // // // // // //           display: inline-flex; align-items: center; justify-content: center;
// // // // // // // // // //           font-size: 0.7rem; font-weight: 800;
// // // // // // // // // //         }
// // // // // // // // // //         .import-type-options {
// // // // // // // // // //           display: flex;
// // // // // // // // // //           flex-direction: column;
// // // // // // // // // //           gap: 0.4rem;
// // // // // // // // // //         }
// // // // // // // // // //         .import-type-option {
// // // // // // // // // //           display: flex;
// // // // // // // // // //           align-items: center;
// // // // // // // // // //           justify-content: space-between;
// // // // // // // // // //           gap: 0.5rem;
// // // // // // // // // //           padding: 0.5rem 0.7rem;
// // // // // // // // // //           border-radius: 10px;
// // // // // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // // // // //           cursor: pointer;
// // // // // // // // // //           transition: border-color 0.15s ease, background 0.15s ease;
// // // // // // // // // //         }
// // // // // // // // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // // // // // // // //         .import-type-option.active {
// // // // // // // // // //           border-color: var(--accent-cyan);
// // // // // // // // // //           background: var(--accent-cyan-soft);
// // // // // // // // // //         }
// // // // // // // // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // // // // // // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
// // // // // // // // // //         .import-type-option .opt-hint { font-size: 0.72rem; color: var(--text-muted); }

// // // // // // // // // //         .import-dropzone {
// // // // // // // // // //           position: relative;
// // // // // // // // // //           border: 1.5px dashed var(--border-strong);
// // // // // // // // // //           border-radius: 12px;
// // // // // // // // // //           padding: 1.5rem 1rem;
// // // // // // // // // //           text-align: center;
// // // // // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // // // // //           transition: border-color 0.15s ease, background 0.15s ease;
// // // // // // // // // //         }
// // // // // // // // // //         .import-dropzone:hover {
// // // // // // // // // //           border-color: var(--accent-cyan);
// // // // // // // // // //           background: var(--accent-cyan-soft);
// // // // // // // // // //         }
// // // // // // // // // //         .import-dropzone input[type="file"] {
// // // // // // // // // //           position: absolute;
// // // // // // // // // //           inset: 0;
// // // // // // // // // //           opacity: 0;
// // // // // // // // // //           cursor: pointer;
// // // // // // // // // //         }
// // // // // // // // // //         .import-dropzone .dz-icon { font-size: 1.6rem; margin-bottom: 0.35rem; }
// // // // // // // // // //         .import-dropzone .dz-text { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
// // // // // // // // // //         .import-dropzone .dz-sub { font-size: 0.72rem; color: var(--text-muted); }
// // // // // // // // // //         .import-filename-chip {
// // // // // // // // // //           display: inline-flex;
// // // // // // // // // //           align-items: center;
// // // // // // // // // //           gap: 0.35rem;
// // // // // // // // // //           margin-top: 0.5rem;
// // // // // // // // // //           padding: 0.25rem 0.6rem;
// // // // // // // // // //           border-radius: 20px;
// // // // // // // // // //           background: var(--panel-raised);
// // // // // // // // // //           border: 1px solid var(--border-strong);
// // // // // // // // // //           font-size: 0.75rem;
// // // // // // // // // //           color: var(--text-primary);
// // // // // // // // // //         }

// // // // // // // // // //         .import-submit-btn {
// // // // // // // // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // // // // // // // //           border: none;
// // // // // // // // // //           color: #06231a;
// // // // // // // // // //           font-weight: 700;
// // // // // // // // // //           border-radius: 10px;
// // // // // // // // // //           height: 100%;
// // // // // // // // // //           min-height: 78px;
// // // // // // // // // //         }
// // // // // // // // // //         .import-submit-btn:disabled {
// // // // // // // // // //           background: var(--panel-raised);
// // // // // // // // // //           color: var(--text-muted);
// // // // // // // // // //           opacity: 1;
// // // // // // // // // //         }

// // // // // // // // // //         /* Prévisualisation */
// // // // // // // // // //         .import-preview-header {
// // // // // // // // // //           background: var(--panel-raised);
// // // // // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // // // // //           padding: 0.75rem 1rem;
// // // // // // // // // //         }
// // // // // // // // // //         .import-preview-wrapper {
// // // // // // // // // //           max-height: 55vh;
// // // // // // // // // //           overflow: auto;
// // // // // // // // // //         }
// // // // // // // // // //         .import-preview-table {
// // // // // // // // // //           font-size: 0.78rem;
// // // // // // // // // //         }
// // // // // // // // // //         .import-preview-table thead th {
// // // // // // // // // //           position: sticky;
// // // // // // // // // //           top: 0;
// // // // // // // // // //           background: var(--panel-solid);
// // // // // // // // // //           color: var(--text-muted);
// // // // // // // // // //           font-size: 0.7rem;
// // // // // // // // // //           text-transform: uppercase;
// // // // // // // // // //           letter-spacing: 0.4px;
// // // // // // // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // // // // // // //           z-index: 2;
// // // // // // // // // //         }
// // // // // // // // // //         .import-preview-table tbody td {
// // // // // // // // // //           border-color: var(--border-subtle) !important;
// // // // // // // // // //           color: var(--text-primary);
// // // // // // // // // //         }
// // // // // // // // // //         .import-preview-table tbody tr:nth-child(odd) {
// // // // // // // // // //           background: rgba(255,255,255,0.015);
// // // // // // // // // //         }
// // // // // // // // // //         .import-page-wrapper .badge.bg-info {
// // // // // // // // // //           background: var(--accent-cyan) !important;
// // // // // // // // // //           color: #06231a !important;
// // // // // // // // // //         }
// // // // // // // // // //       `}</style>

// // // // // // // // // //       <Navbar />

// // // // // // // // // //       <div className="import-page-wrapper">
// // // // // // // // // //         <div className="mb-3">
// // // // // // // // // //           <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>📥 Import de données</h2>
// // // // // // // // // //           <small className="text-muted">
// // // // // // // // // //             Importez vos fichiers CSV ou Excel pour alimenter la base de données.
// // // // // // // // // //           </small>
// // // // // // // // // //         </div>

// // // // // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // // // //         <Card className="import-card mb-4 p-3 border-0">
// // // // // // // // // //           <Row className="g-3 align-items-stretch">
// // // // // // // // // //             <Col md={4}>
// // // // // // // // // //               <div className="import-step-label"><span className="import-step-num">1</span> Type de données</div>
// // // // // // // // // //               <div className="import-type-options">
// // // // // // // // // //                 {IMPORT_TYPES.map((t) => (
// // // // // // // // // //                   <label
// // // // // // // // // //                     key={t.value}
// // // // // // // // // //                     className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // // // // // // // //                   >
// // // // // // // // // //                     <div>
// // // // // // // // // //                       <div className="opt-label">{t.label}</div>
// // // // // // // // // //                       <div className="opt-hint">{t.hint}</div>
// // // // // // // // // //                     </div>
// // // // // // // // // //                     <input
// // // // // // // // // //                       type="radio"
// // // // // // // // // //                       name="importType"
// // // // // // // // // //                       value={t.value}
// // // // // // // // // //                       checked={importType === t.value}
// // // // // // // // // //                       onChange={(e) => {
// // // // // // // // // //                         setImportType(e.target.value);
// // // // // // // // // //                         setParsedData([]);
// // // // // // // // // //                         setFileName('');
// // // // // // // // // //                       }}
// // // // // // // // // //                     />
// // // // // // // // // //                   </label>
// // // // // // // // // //                 ))}
// // // // // // // // // //               </div>
// // // // // // // // // //             </Col>

// // // // // // // // // //             <Col md={5}>
// // // // // // // // // //               <div className="import-step-label"><span className="import-step-num">2</span> Fichier (.csv, .xlsx)</div>
// // // // // // // // // //               <div className="import-dropzone">
// // // // // // // // // //                 <Form.Control
// // // // // // // // // //                   type="file"
// // // // // // // // // //                   accept=".csv, .xlsx, .xls"
// // // // // // // // // //                   onChange={handleFileUpload}
// // // // // // // // // //                   aria-label="Sélectionner le fichier à importer"
// // // // // // // // // //                 />
// // // // // // // // // //                 <div className="dz-icon">📄</div>
// // // // // // // // // //                 <div className="dz-text">Cliquez ou glissez un fichier ici</div>
// // // // // // // // // //                 <div className="dz-sub">Format attendu : {activeType?.hint}</div>
// // // // // // // // // //                 {fileName && (
// // // // // // // // // //                   <div className="import-filename-chip">📎 {fileName}</div>
// // // // // // // // // //                 )}
// // // // // // // // // //               </div>
// // // // // // // // // //             </Col>

// // // // // // // // // //             <Col md={3}>
// // // // // // // // // //               <div className="import-step-label"><span className="import-step-num">3</span> Importer</div>
// // // // // // // // // //               <Button
// // // // // // // // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // // // // // // // //                 onClick={handleImport}
// // // // // // // // // //                 disabled={loading || parsedData.length === 0}
// // // // // // // // // //               >
// // // // // // // // // //                 {loading ? (
// // // // // // // // // //                   <>
// // // // // // // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // // // // // // //                     Importation...
// // // // // // // // // //                   </>
// // // // // // // // // //                 ) : (
// // // // // // // // // //                   `Importer (${parsedData.length} ligne${parsedData.length > 1 ? 's' : ''})`
// // // // // // // // // //                 )}
// // // // // // // // // //               </Button>
// // // // // // // // // //             </Col>
// // // // // // // // // //           </Row>
// // // // // // // // // //         </Card>

// // // // // // // // // //         {/* Prévisualisation */}
// // // // // // // // // //         {parsedData.length > 0 && (
// // // // // // // // // //           <Card className="import-card border-0 overflow-hidden">
// // // // // // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // // // // // //               <span>
// // // // // // // // // //                 Prévisualisation : <strong>{fileName}</strong>
// // // // // // // // // //               </span>
// // // // // // // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // // // // // // //             </div>
// // // // // // // // // //             <div className="import-preview-wrapper">
// // // // // // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // // // // // //                 <thead>
// // // // // // // // // //                   <tr>
// // // // // // // // // //                     <th>#</th>
// // // // // // // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // // // // // // //                       <th key={key}>{key}</th>
// // // // // // // // // //                     ))}
// // // // // // // // // //                   </tr>
// // // // // // // // // //                 </thead>
// // // // // // // // // //                 <tbody>
// // // // // // // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // // // // // // //                     <tr key={idx}>
// // // // // // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // // // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // // // // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // // // // // // //                       ))}
// // // // // // // // // //                     </tr>
// // // // // // // // // //                   ))}
// // // // // // // // // //                 </tbody>
// // // // // // // // // //               </Table>
// // // // // // // // // //             </div>
// // // // // // // // // //             {parsedData.length > 50 && (
// // // // // // // // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // // // // // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // // // // // // //               </div>
// // // // // // // // // //             )}
// // // // // // // // // //           </Card>
// // // // // // // // // //         )}
// // // // // // // // // //       </div>
// // // // // // // // // //     </>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal } from 'react-bootstrap';
// // // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // // import Navbar from './Navbar';
// // // // // // // // // import {
// // // // // // // // //   importChefsDeProjet,
// // // // // // // // //   importEtudiants,
// // // // // // // // //   importAptitudes,
// // // // // // // // //   importApetences,
// // // // // // // // //   purgeAllDocuments,
// // // // // // // // //   supabase,
// // // // // // // // // } from '../services/supabase';

// // // // // // // // // const COMPETENCES = [
// // // // // // // // //   'calculs_simulation_numerique',
// // // // // // // // //   'essais_caracterisation',
// // // // // // // // //   'fabrication_prototypage',
// // // // // // // // //   'conception_mecanique',
// // // // // // // // //   'automatique_automatisme',
// // // // // // // // //   'iot_systeme_embarque',
// // // // // // // // //   'robot_cobot',
// // // // // // // // //   'vision',
// // // // // // // // //   'ia',
// // // // // // // // //   'ihm_appli_web_mobile',
// // // // // // // // //   'ethique_ergonomie',
// // // // // // // // // ];

// // // // // // // // // const IMPORT_TYPES = [
// // // // // // // // //   { value: 'chefs', label: 'Chefs de projet', hint: 'nom, spécialité, email' },
// // // // // // // // //   { value: 'etudiants', label: 'Étudiants', hint: 'nom, prénom, email, parcours' },
// // // // // // // // //   { value: 'aptitudes', label: 'Aptitudes techniques', hint: '11 compétences' },
// // // // // // // // //   { value: 'apetences', label: 'Appétences / Intérêts', hint: '11 compétences' },
// // // // // // // // // ];

// // // // // // // // // export default function ImportPage() {
// // // // // // // // //   const [importType, setImportType] = useState('chefs');
// // // // // // // // //   const [parsedData, setParsedData] = useState([]);
// // // // // // // // //   const [fileName, setFileName] = useState('');
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [error, setError] = useState(null);
// // // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // // //   // États pour la modale de remise à zéro / purge
// // // // // // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // // // // // //   const [resetting, setResetting] = useState(false);
// // // // // // // // //   const [confirmText, setConfirmText] = useState('');

// // // // // // // // //   // Options de purge sélectionnées
// // // // // // // // //   const [purgeOptions, setPurgeOptions] = useState({
// // // // // // // // //     documents: false,
// // // // // // // // //     competences: false,
// // // // // // // // //     etudiants: false,
// // // // // // // // //     chefs: false,
// // // // // // // // //     tout: false,
// // // // // // // // //   });

// // // // // // // // //   const extractNameFromEmail = (email) => {
// // // // // // // // //     try {
// // // // // // // // //       const namePart = email.split('@')[0];
// // // // // // // // //       const parts = namePart.split('.');
// // // // // // // // //       if (parts.length >= 2) {
// // // // // // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // // // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // // // // // //         return { nom, prenom };
// // // // // // // // //       }
// // // // // // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // // // // // //     } catch {
// // // // // // // // //       return { nom: email, prenom: '' };
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const handleFileUpload = (e) => {
// // // // // // // // //     const file = e.target.files[0];
// // // // // // // // //     if (!file) return;

// // // // // // // // //     setFileName(file.name);
// // // // // // // // //     setError(null);
// // // // // // // // //     setSuccessMsg(null);
// // // // // // // // //     setParsedData([]);

// // // // // // // // //     const reader = new FileReader();
// // // // // // // // //     reader.onload = (evt) => {
// // // // // // // // //       try {
// // // // // // // // //         const data = evt.target.result;
// // // // // // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // // // // //         const sheet = workbook.Sheets[sheetName];
// // // // // // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // // // // // //         if (rawJson.length === 0) {
// // // // // // // // //           throw new Error('Le fichier est vide.');
// // // // // // // // //         }

// // // // // // // // //         processData(rawJson, importType);
// // // // // // // // //       } catch (err) {
// // // // // // // // //         setError(`Erreur de lecture du fichier : ${err.message}`);
// // // // // // // // //       }
// // // // // // // // //     };
// // // // // // // // //     reader.readAsBinaryString(file);
// // // // // // // // //   };

// // // // // // // // //   const processData = (rows, type) => {
// // // // // // // // //     if (rows.length < 2) {
// // // // // // // // //       throw new Error('Le fichier ne contient pas assez de lignes.');
// // // // // // // // //     }

// // // // // // // // //     const firstRow = rows[0];
// // // // // // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // // // // // //     let formatted = [];

// // // // // // // // //     if (type === 'chefs') {
// // // // // // // // //       formatted = dataRows.map((r) => ({
// // // // // // // // //         nom: String(r[0] || '').trim(),
// // // // // // // // //         specialite: String(r[1] || '').trim(),
// // // // // // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // // // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // // // // // //       })).filter((r) => r.email && r.nom);
// // // // // // // // //     } else if (type === 'etudiants') {
// // // // // // // // //       formatted = dataRows.map((r) => {
// // // // // // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // // // // // //         const secondCol = String(r[1] || '').trim();
// // // // // // // // //         const thirdCol = String(r[2] || '').trim();
// // // // // // // // //         const fourthCol = String(r[3] || '').trim();

// // // // // // // // //         if (emailOrFirst.includes('@')) {
// // // // // // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // // // // // //           return {
// // // // // // // // //             nom,
// // // // // // // // //             prenom,
// // // // // // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // // // // // //             parcours: secondCol || 'I2026',
// // // // // // // // //           };
// // // // // // // // //         }

// // // // // // // // //         return {
// // // // // // // // //           nom: emailOrFirst,
// // // // // // // // //           prenom: secondCol,
// // // // // // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // // // // // //           parcours: fourthCol || 'I2026',
// // // // // // // // //         };
// // // // // // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // // // // // //       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

// // // // // // // // //       if (isMoodleSurvey) {
// // // // // // // // //         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
// // // // // // // // //         const startOffset = type === 'aptitudes' ? 5 : 16;

// // // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // // // // // //           const rowData = { adresse_email: email };
// // // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // // //             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
// // // // // // // // //           });
// // // // // // // // //           return rowData;
// // // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // //       } else {
// // // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // // //             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
// // // // // // // // //           });
// // // // // // // // //           return rowData;
// // // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // // //       }
// // // // // // // // //     }

// // // // // // // // //     setParsedData(formatted);
// // // // // // // // //   };

// // // // // // // // //   const handleImport = async () => {
// // // // // // // // //     if (parsedData.length === 0) return;
// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       setError(null);
// // // // // // // // //       setSuccessMsg(null);

// // // // // // // // //       let result;
// // // // // // // // //       if (importType === 'chefs') {
// // // // // // // // //         result = await importChefsDeProjet(parsedData);
// // // // // // // // //       } else if (importType === 'etudiants') {
// // // // // // // // //         result = await importEtudiants(parsedData);
// // // // // // // // //       } else if (importType === 'aptitudes') {
// // // // // // // // //         result = await importAptitudes(parsedData);
// // // // // // // // //       } else if (importType === 'apetences') {
// // // // // // // // //         result = await importApetences(parsedData);
// // // // // // // // //       }

// // // // // // // // //       setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // // // // // //       setParsedData([]);
// // // // // // // // //       setFileName('');
// // // // // // // // //     } catch (err) {
// // // // // // // // //       setError(err.message || "Erreur lors de l'import dans la base de données.");
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // Exécution de la purge / remise à zéro
// // // // // // // // //   const handleExecutePurge = async () => {
// // // // // // // // //     try {
// // // // // // // // //       setResetting(true);
// // // // // // // // //       setError(null);
// // // // // // // // //       setSuccessMsg(null);

// // // // // // // // //       const messages = [];

// // // // // // // // //       // 1. Purge des fichiers Storage (CV et LM)
// // // // // // // // //       if (purgeOptions.documents || purgeOptions.tout) {
// // // // // // // // //         await purgeAllDocuments();
// // // // // // // // //         messages.push('Fichiers CV & LM supprimés du Cloud.');
// // // // // // // // //       }

// // // // // // // // //       // 2. Purge sélective des tables via RPC PostgreSQL
// // // // // // // // //       const payloadRPC = {
// // // // // // // // //         rendez_vous: purgeOptions.tout,
// // // // // // // // //         evaluations: purgeOptions.tout,
// // // // // // // // //         affectations: purgeOptions.tout,
// // // // // // // // //         selections: purgeOptions.tout,
// // // // // // // // //         disponibilites: purgeOptions.tout,
// // // // // // // // //         competences: purgeOptions.competences || purgeOptions.tout,
// // // // // // // // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // // // // // // // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // // // // // // // //         users: purgeOptions.tout,
// // // // // // // // //       };

// // // // // // // // //       const { data, error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // // // // // // // //       if (rpcErr) throw rpcErr;

// // // // // // // // //       messages.push('Base de données mise à jour selon vos critères.');
// // // // // // // // //       setSuccessMsg(`🗑️ Purge réussie : ${messages.join(' ')}`);
// // // // // // // // //       setShowResetModal(false);
// // // // // // // // //       setConfirmText('');
// // // // // // // // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // // // // // // // //     } catch (err) {
// // // // // // // // //       setError(err.message || 'Erreur lors de la purge.');
// // // // // // // // //     } finally {
// // // // // // // // //       setResetting(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const activeType = IMPORT_TYPES.find((t) => t.value === importType);
// // // // // // // // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // // // // // // // //   const isButtonDisabled = resetting || (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) || (requiresConfirmText && confirmText !== 'CONFIRMER');

// // // // // // // // //   return (
// // // // // // // // //     <>
// // // // // // // // //       <style>{`
// // // // // // // // //         :root {
// // // // // // // // //           --canvas: #0a0e1a;
// // // // // // // // //           --panel: rgba(21, 27, 46, 0.86);
// // // // // // // // //           --panel-solid: #151b2e;
// // // // // // // // //           --panel-raised: #1b2338;
// // // // // // // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // // // // // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // // // // // // //           --text-primary: #f4f6fb;
// // // // // // // // //           --text-muted: #93a0b8;
// // // // // // // // //           --accent-violet: #7c6cf6;
// // // // // // // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // // // // // // //           --accent-cyan: #29d3d3;
// // // // // // // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // // // // // // //           --accent-emerald: #35d0a0;
// // // // // // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // // // // // //           --accent-coral: #ff6b6b;
// // // // // // // // //         }

// // // // // // // // //         .import-page-wrapper {
// // // // // // // // //           max-width: 100%;
// // // // // // // // //           margin: 0 auto;
// // // // // // // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // // // // // // //           color: var(--text-primary);
// // // // // // // // //           background:
// // // // // // // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // // // // // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // // // // // // //             var(--canvas);
// // // // // // // // //           min-height: calc(100vh - 60px);
// // // // // // // // //         }
// // // // // // // // //         .import-card {
// // // // // // // // //           background: var(--panel);
// // // // // // // // //           backdrop-filter: blur(16px);
// // // // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // // // //           border-radius: 14px;
// // // // // // // // //         }
// // // // // // // // //         .import-page-wrapper .alert-danger {
// // // // // // // // //           background: rgba(255,107,107,0.12);
// // // // // // // // //           border-color: rgba(255,107,107,0.35);
// // // // // // // // //           color: #ffd7d7;
// // // // // // // // //         }
// // // // // // // // //         .import-page-wrapper .alert-success {
// // // // // // // // //           background: var(--accent-emerald-soft);
// // // // // // // // //           border-color: rgba(53,208,160,0.4);
// // // // // // // // //           color: #baf5e2;
// // // // // // // // //         }

// // // // // // // // //         .btn-danger-pill {
// // // // // // // // //           background: rgba(239, 68, 68, 0.14) !important;
// // // // // // // // //           color: #f87171 !important;
// // // // // // // // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // // // // // //           border-radius: 8px !important;
// // // // // // // // //         }
// // // // // // // // //         .btn-danger-pill:hover:not(:disabled) {
// // // // // // // // //           background: #dc2626 !important;
// // // // // // // // //           color: #ffffff !important;
// // // // // // // // //           border-color: #dc2626 !important;
// // // // // // // // //         }

// // // // // // // // //         .import-step-label {
// // // // // // // // //           display: flex;
// // // // // // // // //           align-items: center;
// // // // // // // // //           gap: 0.4rem;
// // // // // // // // //           color: var(--text-muted);
// // // // // // // // //           font-weight: 700;
// // // // // // // // //           font-size: 0.75rem;
// // // // // // // // //           text-transform: uppercase;
// // // // // // // // //           letter-spacing: 0.5px;
// // // // // // // // //           margin-bottom: 0.5rem;
// // // // // // // // //         }
// // // // // // // // //         .import-step-num {
// // // // // // // // //           width: 20px; height: 20px;
// // // // // // // // //           border-radius: 50%;
// // // // // // // // //           background: var(--accent-violet-soft);
// // // // // // // // //           color: var(--accent-violet);
// // // // // // // // //           display: inline-flex; align-items: center; justify-content: center;
// // // // // // // // //           font-size: 0.7rem; font-weight: 800;
// // // // // // // // //         }
// // // // // // // // //         .import-type-options {
// // // // // // // // //           display: flex;
// // // // // // // // //           flex-direction: column;
// // // // // // // // //           gap: 0.4rem;
// // // // // // // // //         }
// // // // // // // // //         .import-type-option {
// // // // // // // // //           display: flex;
// // // // // // // // //           align-items: center;
// // // // // // // // //           justify-content: space-between;
// // // // // // // // //           gap: 0.5rem;
// // // // // // // // //           padding: 0.5rem 0.7rem;
// // // // // // // // //           border-radius: 10px;
// // // // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // // // //           cursor: pointer;
// // // // // // // // //           transition: border-color 0.15s ease, background 0.15s ease;
// // // // // // // // //         }
// // // // // // // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // // // // // // //         .import-type-option.active {
// // // // // // // // //           border-color: var(--accent-cyan);
// // // // // // // // //           background: var(--accent-cyan-soft);
// // // // // // // // //         }
// // // // // // // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // // // // // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.85rem; color: var(--text-primary); }
// // // // // // // // //         .import-type-option .opt-hint { font-size: 0.72rem; color: var(--text-muted); }

// // // // // // // // //         .import-dropzone {
// // // // // // // // //           position: relative;
// // // // // // // // //           border: 1.5px dashed var(--border-strong);
// // // // // // // // //           border-radius: 12px;
// // // // // // // // //           padding: 1.5rem 1rem;
// // // // // // // // //           text-align: center;
// // // // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // // // //           transition: border-color 0.15s ease, background 0.15s ease;
// // // // // // // // //         }
// // // // // // // // //         .import-dropzone:hover {
// // // // // // // // //           border-color: var(--accent-cyan);
// // // // // // // // //           background: var(--accent-cyan-soft);
// // // // // // // // //         }
// // // // // // // // //         .import-dropzone input[type="file"] {
// // // // // // // // //           position: absolute;
// // // // // // // // //           inset: 0;
// // // // // // // // //           opacity: 0;
// // // // // // // // //           cursor: pointer;
// // // // // // // // //         }
// // // // // // // // //         .import-dropzone .dz-icon { font-size: 1.6rem; margin-bottom: 0.35rem; }
// // // // // // // // //         .import-dropzone .dz-text { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
// // // // // // // // //         .import-dropzone .dz-sub { font-size: 0.72rem; color: var(--text-muted); }
// // // // // // // // //         .import-filename-chip {
// // // // // // // // //           display: inline-flex;
// // // // // // // // //           align-items: center;
// // // // // // // // //           gap: 0.35rem;
// // // // // // // // //           margin-top: 0.5rem;
// // // // // // // // //           padding: 0.25rem 0.6rem;
// // // // // // // // //           border-radius: 20px;
// // // // // // // // //           background: var(--panel-raised);
// // // // // // // // //           border: 1px solid var(--border-strong);
// // // // // // // // //           font-size: 0.75rem;
// // // // // // // // //           color: var(--text-primary);
// // // // // // // // //         }

// // // // // // // // //         .import-submit-btn {
// // // // // // // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // // // // // // //           border: none;
// // // // // // // // //           color: #06231a;
// // // // // // // // //           font-weight: 700;
// // // // // // // // //           border-radius: 10px;
// // // // // // // // //           height: 100%;
// // // // // // // // //           min-height: 78px;
// // // // // // // // //         }
// // // // // // // // //         .import-submit-btn:disabled {
// // // // // // // // //           background: var(--panel-raised);
// // // // // // // // //           color: var(--text-muted);
// // // // // // // // //           opacity: 1;
// // // // // // // // //         }

// // // // // // // // //         .import-preview-header {
// // // // // // // // //           background: var(--panel-raised);
// // // // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // // // //           padding: 0.75rem 1rem;
// // // // // // // // //         }
// // // // // // // // //         .import-preview-wrapper {
// // // // // // // // //           max-height: 55vh;
// // // // // // // // //           overflow: auto;
// // // // // // // // //         }
// // // // // // // // //         .import-preview-table {
// // // // // // // // //           font-size: 0.78rem;
// // // // // // // // //         }
// // // // // // // // //         .import-preview-table thead th {
// // // // // // // // //           position: sticky;
// // // // // // // // //           top: 0;
// // // // // // // // //           background: var(--panel-solid);
// // // // // // // // //           color: var(--text-muted);
// // // // // // // // //           font-size: 0.7rem;
// // // // // // // // //           text-transform: uppercase;
// // // // // // // // //           letter-spacing: 0.4px;
// // // // // // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // // // // // //           z-index: 2;
// // // // // // // // //         }
// // // // // // // // //         .import-preview-table tbody td {
// // // // // // // // //           border-color: var(--border-subtle) !important;
// // // // // // // // //           color: var(--text-primary);
// // // // // // // // //         }
// // // // // // // // //         .import-preview-table tbody tr:nth-child(odd) {
// // // // // // // // //           background: rgba(255,255,255,0.015);
// // // // // // // // //         }
// // // // // // // // //         .import-page-wrapper .badge.bg-info {
// // // // // // // // //           background: var(--accent-cyan) !important;
// // // // // // // // //           color: #06231a !important;
// // // // // // // // //         }

// // // // // // // // //         /* Modal Dark */
// // // // // // // // //         .modal-dark .modal-content {
// // // // // // // // //           background: #12161f !important;
// // // // // // // // //           border: 1px solid var(--border-strong);
// // // // // // // // //           border-radius: 16px;
// // // // // // // // //           color: var(--text-primary);
// // // // // // // // //         }
// // // // // // // // //         .modal-dark .modal-header {
// // // // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // // // //           background: rgba(239, 68, 68, 0.12);
// // // // // // // // //         }
// // // // // // // // //         .modal-dark .modal-footer {
// // // // // // // // //           border-top: 1px solid var(--border-subtle);
// // // // // // // // //         }
// // // // // // // // //       `}</style>

// // // // // // // // //       <Navbar />

// // // // // // // // //       <div className="import-page-wrapper">
// // // // // // // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // // // // // //           <div>
// // // // // // // // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>📥 Import &amp; Gestion des données</h2>
// // // // // // // // //             <small className="text-muted">
// // // // // // // // //               Alimentez la base avec vos fichiers CSV/Excel ou nettoyez les données existantes.
// // // // // // // // //             </small>
// // // // // // // // //           </div>

// // // // // // // // //           {/* Bouton d'accès à la purge */}
// // // // // // // // //           <Button
// // // // // // // // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // // // // // // // //             size="sm"
// // // // // // // // //             onClick={() => setShowResetModal(true)}
// // // // // // // // //           >
// // // // // // // // //             <span>🗑️</span>
// // // // // // // // //             <span>Zone Danger / Purge &amp; Reset</span>
// // // // // // // // //           </Button>
// // // // // // // // //         </div>

// // // // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // // //         <Card className="import-card mb-4 p-3 border-0">
// // // // // // // // //           <Row className="g-3 align-items-stretch">
// // // // // // // // //             <Col md={4}>
// // // // // // // // //               <div className="import-step-label"><span className="import-step-num">1</span> Type de données</div>
// // // // // // // // //               <div className="import-type-options">
// // // // // // // // //                 {IMPORT_TYPES.map((t) => (
// // // // // // // // //                   <label
// // // // // // // // //                     key={t.value}
// // // // // // // // //                     className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // // // // // // //                   >
// // // // // // // // //                     <div>
// // // // // // // // //                       <div className="opt-label">{t.label}</div>
// // // // // // // // //                       <div className="opt-hint">{t.hint}</div>
// // // // // // // // //                     </div>
// // // // // // // // //                     <input
// // // // // // // // //                       type="radio"
// // // // // // // // //                       name="importType"
// // // // // // // // //                       value={t.value}
// // // // // // // // //                       checked={importType === t.value}
// // // // // // // // //                       onChange={(e) => {
// // // // // // // // //                         setImportType(e.target.value);
// // // // // // // // //                         setParsedData([]);
// // // // // // // // //                         setFileName('');
// // // // // // // // //                       }}
// // // // // // // // //                     />
// // // // // // // // //                   </label>
// // // // // // // // //                 ))}
// // // // // // // // //               </div>
// // // // // // // // //             </Col>

// // // // // // // // //             <Col md={5}>
// // // // // // // // //               <div className="import-step-label"><span className="import-step-num">2</span> Fichier (.csv, .xlsx)</div>
// // // // // // // // //               <div className="import-dropzone">
// // // // // // // // //                 <Form.Control
// // // // // // // // //                   type="file"
// // // // // // // // //                   accept=".csv, .xlsx, .xls"
// // // // // // // // //                   onChange={handleFileUpload}
// // // // // // // // //                   aria-label="Sélectionner le fichier à importer"
// // // // // // // // //                 />
// // // // // // // // //                 <div className="dz-icon">📄</div>
// // // // // // // // //                 <div className="dz-text">Cliquez ou glissez un fichier ici</div>
// // // // // // // // //                 <div className="dz-sub">Format attendu : {activeType?.hint}</div>
// // // // // // // // //                 {fileName && (
// // // // // // // // //                   <div className="import-filename-chip">📎 {fileName}</div>
// // // // // // // // //                 )}
// // // // // // // // //               </div>
// // // // // // // // //             </Col>

// // // // // // // // //             <Col md={3}>
// // // // // // // // //               <div className="import-step-label"><span className="import-step-num">3</span> Importer</div>
// // // // // // // // //               <Button
// // // // // // // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // // // // // // //                 onClick={handleImport}
// // // // // // // // //                 disabled={loading || parsedData.length === 0}
// // // // // // // // //               >
// // // // // // // // //                 {loading ? (
// // // // // // // // //                   <>
// // // // // // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // // // // // //                     Importation...
// // // // // // // // //                   </>
// // // // // // // // //                 ) : (
// // // // // // // // //                   `Importer (${parsedData.length} ligne${parsedData.length > 1 ? 's' : ''})`
// // // // // // // // //                 )}
// // // // // // // // //               </Button>
// // // // // // // // //             </Col>
// // // // // // // // //           </Row>
// // // // // // // // //         </Card>

// // // // // // // // //         {/* Prévisualisation */}
// // // // // // // // //         {parsedData.length > 0 && (
// // // // // // // // //           <Card className="import-card border-0 overflow-hidden">
// // // // // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // // // // //               <span>
// // // // // // // // //                 Prévisualisation : <strong>{fileName}</strong>
// // // // // // // // //               </span>
// // // // // // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // // // // // //             </div>
// // // // // // // // //             <div className="import-preview-wrapper">
// // // // // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // // // // //                 <thead>
// // // // // // // // //                   <tr>
// // // // // // // // //                     <th>#</th>
// // // // // // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // // // // // //                       <th key={key}>{key}</th>
// // // // // // // // //                     ))}
// // // // // // // // //                   </tr>
// // // // // // // // //                 </thead>
// // // // // // // // //                 <tbody>
// // // // // // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // // // // // //                     <tr key={idx}>
// // // // // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // // // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // // // // // //                       ))}
// // // // // // // // //                     </tr>
// // // // // // // // //                   ))}
// // // // // // // // //                 </tbody>
// // // // // // // // //               </Table>
// // // // // // // // //             </div>
// // // // // // // // //             {parsedData.length > 50 && (
// // // // // // // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // // // // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // // // // // //               </div>
// // // // // // // // //             )}
// // // // // // // // //           </Card>
// // // // // // // // //         )}
// // // // // // // // //       </div>

// // // // // // // // //       {/* Modale Zone Danger — Purge & Remise à zéro */}
// // // // // // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // // // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // // // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // // // // // // // //             ⚠️ Zone Danger — Purge &amp; Remise à zéro
// // // // // // // // //           </Modal.Title>
// // // // // // // // //         </Modal.Header>
// // // // // // // // //         <Modal.Body>
// // // // // // // // //           <p className="text-light small mb-3">
// // // // // // // // //             Cochez les éléments que vous souhaitez purger ou supprimer pour redémarrer une nouvelle campagne :
// // // // // // // // //           </p>

// // // // // // // // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // // // // // // // //             <Form.Check
// // // // // // // // //               type="checkbox"
// // // // // // // // //               id="purge-docs"
// // // // // // // // //               label="📄 Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // // // // // // // //               checked={purgeOptions.documents}
// // // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // // // // // // // //               className="mb-2 text-white"
// // // // // // // // //             />
// // // // // // // // //             <Form.Check
// // // // // // // // //               type="checkbox"
// // // // // // // // //               id="purge-comp"
// // // // // // // // //               label="📊 Vider les Aptitudes & Appétences des étudiants"
// // // // // // // // //               checked={purgeOptions.competences}
// // // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // // // // // // // //               className="mb-2 text-white"
// // // // // // // // //             />
// // // // // // // // //             <Form.Check
// // // // // // // // //               type="checkbox"
// // // // // // // // //               id="purge-etud"
// // // // // // // // //               label="🎓 Supprimer TOUS les Étudiants (efface aussi leurs vœux, rendez-vous et évaluations)"
// // // // // // // // //               checked={purgeOptions.etudiants}
// // // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // // // // // // // //               className="mb-2 text-warning"
// // // // // // // // //             />
// // // // // // // // //             <Form.Check
// // // // // // // // //               type="checkbox"
// // // // // // // // //               id="purge-chefs"
// // // // // // // // //               label="👨‍🏫 Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilités et rendez-vous)"
// // // // // // // // //               checked={purgeOptions.chefs}
// // // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // // // // // // // //               className="mb-2 text-warning"
// // // // // // // // //             />
// // // // // // // // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // // // // // // // //             <Form.Check
// // // // // // // // //               type="checkbox"
// // // // // // // // //               id="purge-tout"
// // // // // // // // //               label="🔥 TOUT RÉINITIALISER : Vider absolument toutes les données de campagne pour une nouvelle rentrée"
// // // // // // // // //               checked={purgeOptions.tout}
// // // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // // // // // // // //               className="text-danger fw-bold"
// // // // // // // // //             />
// // // // // // // // //           </div>

// // // // // // // // //           {requiresConfirmText && (
// // // // // // // // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // // // // // // // //               <Form.Label className="small text-danger fw-bold mb-1">
// // // // // // // // //                 Sécurité : Tapez le mot « CONFIRMER » pour débloquer la suppression :
// // // // // // // // //               </Form.Label>
// // // // // // // // //               <Form.Control
// // // // // // // // //                 size="sm"
// // // // // // // // //                 placeholder="Tapez CONFIRMER"
// // // // // // // // //                 value={confirmText}
// // // // // // // // //                 onChange={(e) => setConfirmText(e.target.value)}
// // // // // // // // //                 className="bg-dark text-white border-danger"
// // // // // // // // //               />
// // // // // // // // //             </div>
// // // // // // // // //           )}

// // // // // // // // //           <p className="text-muted small mb-0">
// // // // // // // // //             ⚠️ Les données supprimées ne pourront pas être récupérées.
// // // // // // // // //           </p>
// // // // // // // // //         </Modal.Body>
// // // // // // // // //         <Modal.Footer>
// // // // // // // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // // // // // //             Annuler
// // // // // // // // //           </Button>
// // // // // // // // //           <Button
// // // // // // // // //             variant="danger"
// // // // // // // // //             size="sm"
// // // // // // // // //             onClick={handleExecutePurge}
// // // // // // // // //             disabled={isButtonDisabled}
// // // // // // // // //           >
// // // // // // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Exécuter la purge sélectionnée'}
// // // // // // // // //           </Button>
// // // // // // // // //         </Modal.Footer>
// // // // // // // // //       </Modal>
// // // // // // // // //     </>
// // // // // // // // //   );
// // // // // // // // // }


// // // // // // // // import React, { useState } from 'react';
// // // // // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // // // // // // // import * as XLSX from 'xlsx';
// // // // // // // // import Navbar from './Navbar';
// // // // // // // // import {
// // // // // // // //   importChefsDeProjet,
// // // // // // // //   importEtudiants,
// // // // // // // //   importAptitudes,
// // // // // // // //   importApetences,
// // // // // // // //   fetchEtudiants,
// // // // // // // //   findEtudiantForDocument,
// // // // // // // //   uploadBatchDocuments,
// // // // // // // //   purgeAllDocuments,
// // // // // // // //   supabase,
// // // // // // // // } from '../services/supabase';

// // // // // // // // const COMPETENCES = [
// // // // // // // //   'calculs_simulation_numerique',
// // // // // // // //   'essais_caracterisation',
// // // // // // // //   'fabrication_prototypage',
// // // // // // // //   'conception_mecanique',
// // // // // // // //   'automatique_automatisme',
// // // // // // // //   'iot_systeme_embarque',
// // // // // // // //   'robot_cobot',
// // // // // // // //   'vision',
// // // // // // // //   'ia',
// // // // // // // //   'ihm_appli_web_mobile',
// // // // // // // //   'ethique_ergonomie',
// // // // // // // // ];

// // // // // // // // const IMPORT_TYPES = [
// // // // // // // //   { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, spécialité, email)', icon: '👨‍🏫', isDoc: false },
// // // // // // // //   { value: 'etudiants', label: 'Étudiants', hint: 'Fichier CSV / Excel (nom, prénom, email, parcours)', icon: '🎓', isDoc: false },
// // // // // // // //   { value: 'aptitudes', label: 'Aptitudes techniques', hint: 'Questionnaire Moodle ou CSV (11 compétences)', icon: '📊', isDoc: false },
// // // // // // // //   { value: 'apetences', label: 'Appétences / Intérêts', hint: 'Questionnaire Moodle ou CSV (11 compétences)', icon: '🎯', isDoc: false },
// // // // // // // //   { value: 'cv', label: 'CV des étudiants (PDF)', hint: 'Glissez plusieurs fichiers PDF de CV', icon: '📄', isDoc: true },
// // // // // // // //   { value: 'lm', label: 'Lettres de motivation (PDF)', hint: 'Glissez plusieurs fichiers PDF de LM', icon: '✉️', isDoc: true },
// // // // // // // // ];

// // // // // // // // export default function ImportPage() {
// // // // // // // //   const [importType, setImportType] = useState('chefs');
// // // // // // // //   const [parsedData, setParsedData] = useState([]);
// // // // // // // //   const [pdfItems, setPdfItems] = useState([]); // [{ file, fileName, student, matched }]
// // // // // // // //   const [fileName, setFileName] = useState('');
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [uploadProgress, setUploadProgress] = useState(null); // { current, total }
// // // // // // // //   const [error, setError] = useState(null);
// // // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // // //   // Modale de purge / remise à zéro
// // // // // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // // // // //   const [resetting, setResetting] = useState(false);
// // // // // // // //   const [confirmText, setConfirmText] = useState('');

// // // // // // // //   const [purgeOptions, setPurgeOptions] = useState({
// // // // // // // //     documents: false,
// // // // // // // //     competences: false,
// // // // // // // //     etudiants: false,
// // // // // // // //     chefs: false,
// // // // // // // //     tout: false,
// // // // // // // //   });

// // // // // // // //   const activeType = IMPORT_TYPES.find((t) => t.value === importType);

// // // // // // // //   const extractNameFromEmail = (email) => {
// // // // // // // //     try {
// // // // // // // //       const namePart = email.split('@')[0];
// // // // // // // //       const parts = namePart.split('.');
// // // // // // // //       if (parts.length >= 2) {
// // // // // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // // // // //         return { nom, prenom };
// // // // // // // //       }
// // // // // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // // // // //     } catch {
// // // // // // // //       return { nom: email, prenom: '' };
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // 1. Gestion des fichiers CSV / Excel
// // // // // // // //   const handleSpreadsheetUpload = (file) => {
// // // // // // // //     const reader = new FileReader();
// // // // // // // //     reader.onload = (evt) => {
// // // // // // // //       try {
// // // // // // // //         const data = evt.target.result;
// // // // // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // // // //         const sheet = workbook.Sheets[sheetName];
// // // // // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // // // // //         if (rawJson.length === 0) throw new Error('Le fichier est vide.');
// // // // // // // //         processSpreadsheetData(rawJson, importType);
// // // // // // // //       } catch (err) {
// // // // // // // //         setError(`Erreur de lecture : ${err.message}`);
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //     reader.readAsBinaryString(file);
// // // // // // // //   };

// // // // // // // //   // 2. Gestion des fichiers PDF multiples (CV ou LM)
// // // // // // // //   const handlePdfFilesUpload = async (filesList) => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       setError(null);

// // // // // // // //       // Récupérer la liste des étudiants en base pour matcher
// // // // // // // //       const etudiantsList = await fetchEtudiants();
// // // // // // // //       if (!etudiantsList || etudiantsList.length === 0) {
// // // // // // // //         throw new Error("Aucun étudiant trouvé en base. Veuillez d'abord importer la liste des étudiants.");
// // // // // // // //       }

// // // // // // // //       const items = Array.from(filesList).map((file) => {
// // // // // // // //         const pathToCheck = file.webkitRelativePath || file.name;
// // // // // // // //         const matchedStudent = findEtudiantForDocument(pathToCheck, etudiantsList);
// // // // // // // //         return {
// // // // // // // //           file,
// // // // // // // //           fileName: file.name,
// // // // // // // //           student: matchedStudent,
// // // // // // // //           matched: Boolean(matchedStudent),
// // // // // // // //         };
// // // // // // // //       });

// // // // // // // //       setPdfItems(items);
// // // // // // // //       setFileName(`${filesList.length} fichier(s) PDF sélectionné(s)`);
// // // // // // // //     } catch (err) {
// // // // // // // //       setError(err.message || 'Erreur lors de la lecture des fichiers PDF.');
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleFileUpload = (e) => {
// // // // // // // //     const files = e.target.files;
// // // // // // // //     if (!files || files.length === 0) return;

// // // // // // // //     setError(null);
// // // // // // // //     setSuccessMsg(null);
// // // // // // // //     setUploadProgress(null);

// // // // // // // //     if (activeType?.isDoc) {
// // // // // // // //       handlePdfFilesUpload(files);
// // // // // // // //     } else {
// // // // // // // //       setFileName(files[0].name);
// // // // // // // //       setParsedData([]);
// // // // // // // //       handleSpreadsheetUpload(files[0]);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const processSpreadsheetData = (rows, type) => {
// // // // // // // //     if (rows.length < 2) throw new Error('Le fichier ne contient pas assez de lignes.');

// // // // // // // //     const firstRow = rows[0];
// // // // // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // // // // //     let formatted = [];

// // // // // // // //     if (type === 'chefs') {
// // // // // // // //       formatted = dataRows.map((r) => ({
// // // // // // // //         nom: String(r[0] || '').trim(),
// // // // // // // //         specialite: String(r[1] || '').trim(),
// // // // // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // // // // //       })).filter((r) => r.email && r.nom);
// // // // // // // //     } else if (type === 'etudiants') {
// // // // // // // //       formatted = dataRows.map((r) => {
// // // // // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // // // // //         const secondCol = String(r[1] || '').trim();
// // // // // // // //         const thirdCol = String(r[2] || '').trim();
// // // // // // // //         const fourthCol = String(r[3] || '').trim();

// // // // // // // //         if (emailOrFirst.includes('@')) {
// // // // // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // // // // //           return {
// // // // // // // //             nom,
// // // // // // // //             prenom,
// // // // // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // // // // //             parcours: secondCol || 'I2026',
// // // // // // // //           };
// // // // // // // //         }

// // // // // // // //         return {
// // // // // // // //           nom: emailOrFirst,
// // // // // // // //           prenom: secondCol,
// // // // // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // // // // //           parcours: fourthCol || 'I2026',
// // // // // // // //         };
// // // // // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // // // // //       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

// // // // // // // //       if (isMoodleSurvey) {
// // // // // // // //         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
// // // // // // // //         const startOffset = type === 'aptitudes' ? 5 : 16;

// // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // // // // //           const rowData = { adresse_email: email };
// // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // //             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
// // // // // // // //           });
// // // // // // // //           return rowData;
// // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // //       } else {
// // // // // // // //         formatted = dataRows.map((r) => {
// // // // // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // // //             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
// // // // // // // //           });
// // // // // // // //           return rowData;
// // // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // // //       }
// // // // // // // //     }

// // // // // // // //     setParsedData(formatted);
// // // // // // // //   };

// // // // // // // //   // Exécution de l'import (CSV ou PDFs)
// // // // // // // //   const handleImport = async () => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       setError(null);
// // // // // // // //       setSuccessMsg(null);

// // // // // // // //       if (activeType?.isDoc) {
// // // // // // // //         // Upload par lot de PDFs
// // // // // // // //         const matchedItems = pdfItems.filter((item) => item.matched && item.student);
// // // // // // // //         if (matchedItems.length === 0) {
// // // // // // // //           throw new Error('Aucun fichier ne correspond à un étudiant enregistré.');
// // // // // // // //         }

// // // // // // // //         const batchPayload = matchedItems.map((item) => ({
// // // // // // // //           file: item.file,
// // // // // // // //           etudiant_id: item.student.id,
// // // // // // // //         }));

// // // // // // // //         setUploadProgress({ current: 0, total: batchPayload.length });

// // // // // // // //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// // // // // // // //           setUploadProgress({ current, total });
// // // // // // // //         });

// // // // // // // //         setSuccessMsg(
// // // // // // // //           `🎉 ${res.success} fichier(s) PDF (${importType.toUpperCase()}) téléversé(s) avec succès dans Supabase Storage !`
// // // // // // // //         );
// // // // // // // //         setPdfItems([]);
// // // // // // // //         setFileName('');
// // // // // // // //       } else {
// // // // // // // //         // Import CSV/Excel
// // // // // // // //         if (parsedData.length === 0) return;

// // // // // // // //         let result;
// // // // // // // //         if (importType === 'chefs') {
// // // // // // // //           result = await importChefsDeProjet(parsedData);
// // // // // // // //         } else if (importType === 'etudiants') {
// // // // // // // //           result = await importEtudiants(parsedData);
// // // // // // // //         } else if (importType === 'aptitudes') {
// // // // // // // //           result = await importAptitudes(parsedData);
// // // // // // // //         } else if (importType === 'apetences') {
// // // // // // // //           result = await importApetences(parsedData);
// // // // // // // //         }

// // // // // // // //         setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // // // // //         setParsedData([]);
// // // // // // // //         setFileName('');
// // // // // // // //       }
// // // // // // // //     } catch (err) {
// // // // // // // //       setError(err.message || "Erreur lors de l'import.");
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // Exécution de la purge globale / sélective
// // // // // // // //   const handleExecutePurge = async () => {
// // // // // // // //     try {
// // // // // // // //       setResetting(true);
// // // // // // // //       setError(null);
// // // // // // // //       setSuccessMsg(null);

// // // // // // // //       const messages = [];

// // // // // // // //       if (purgeOptions.documents || purgeOptions.tout) {
// // // // // // // //         await purgeAllDocuments();
// // // // // // // //         messages.push('Fichiers CV & LM supprimés du Storage.');
// // // // // // // //       }

// // // // // // // //       const payloadRPC = {
// // // // // // // //         rendez_vous: purgeOptions.tout,
// // // // // // // //         evaluations: purgeOptions.tout,
// // // // // // // //         affectations: purgeOptions.tout,
// // // // // // // //         selections: purgeOptions.tout,
// // // // // // // //         disponibilites: purgeOptions.tout,
// // // // // // // //         competences: purgeOptions.competences || purgeOptions.tout,
// // // // // // // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // // // // // // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // // // // // // //         users: purgeOptions.tout,
// // // // // // // //       };

// // // // // // // //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // // // // // // //       if (rpcErr) throw rpcErr;

// // // // // // // //       messages.push('Tables réinitialisées.');
// // // // // // // //       setSuccessMsg(`🗑️ Purge réussie : ${messages.join(' ')}`);
// // // // // // // //       setShowResetModal(false);
// // // // // // // //       setConfirmText('');
// // // // // // // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // // // // // // //     } catch (err) {
// // // // // // // //       setError(err.message || 'Erreur lors de la purge.');
// // // // // // // //     } finally {
// // // // // // // //       setResetting(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const matchedPdfCount = pdfItems.filter((i) => i.matched).length;
// // // // // // // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // // // // // // //   const isButtonDisabled = resetting || (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) || (requiresConfirmText && confirmText !== 'CONFIRMER');

// // // // // // // //   return (
// // // // // // // //     <>
// // // // // // // //       <style>{`
// // // // // // // //         :root {
// // // // // // // //           --canvas: #0a0e1a;
// // // // // // // //           --panel: rgba(21, 27, 46, 0.86);
// // // // // // // //           --panel-solid: #151b2e;
// // // // // // // //           --panel-raised: #1b2338;
// // // // // // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // // // // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // // // // // //           --text-primary: #f4f6fb;
// // // // // // // //           --text-muted: #93a0b8;
// // // // // // // //           --accent-violet: #7c6cf6;
// // // // // // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // // // // // //           --accent-cyan: #29d3d3;
// // // // // // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // // // // // //           --accent-emerald: #35d0a0;
// // // // // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // // // // //           --accent-coral: #ff6b6b;
// // // // // // // //         }

// // // // // // // //         .import-page-wrapper {
// // // // // // // //           max-width: 100%;
// // // // // // // //           margin: 0 auto;
// // // // // // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // // // // // //           color: var(--text-primary);
// // // // // // // //           background:
// // // // // // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // // // // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // // // // // //             var(--canvas);
// // // // // // // //           min-height: calc(100vh - 60px);
// // // // // // // //         }
// // // // // // // //         .import-card {
// // // // // // // //           background: var(--panel);
// // // // // // // //           backdrop-filter: blur(16px);
// // // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // // //           border-radius: 14px;
// // // // // // // //         }
// // // // // // // //         .btn-danger-pill {
// // // // // // // //           background: rgba(239, 68, 68, 0.14) !important;
// // // // // // // //           color: #f87171 !important;
// // // // // // // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // // // // //           border-radius: 8px !important;
// // // // // // // //         }
// // // // // // // //         .btn-danger-pill:hover:not(:disabled) {
// // // // // // // //           background: #dc2626 !important;
// // // // // // // //           color: #ffffff !important;
// // // // // // // //           border-color: #dc2626 !important;
// // // // // // // //         }

// // // // // // // //         .import-step-label {
// // // // // // // //           display: flex;
// // // // // // // //           align-items: center;
// // // // // // // //           gap: 0.4rem;
// // // // // // // //           color: var(--text-muted);
// // // // // // // //           font-weight: 700;
// // // // // // // //           font-size: 0.75rem;
// // // // // // // //           text-transform: uppercase;
// // // // // // // //           letter-spacing: 0.5px;
// // // // // // // //           margin-bottom: 0.5rem;
// // // // // // // //         }
// // // // // // // //         .import-step-num {
// // // // // // // //           width: 20px; height: 20px;
// // // // // // // //           border-radius: 50%;
// // // // // // // //           background: var(--accent-violet-soft);
// // // // // // // //           color: var(--accent-violet);
// // // // // // // //           display: inline-flex; align-items: center; justify-content: center;
// // // // // // // //           font-size: 0.7rem; font-weight: 800;
// // // // // // // //         }
// // // // // // // //         .import-type-options {
// // // // // // // //           display: grid;
// // // // // // // //           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // // // // // // //           gap: 0.5rem;
// // // // // // // //         }
// // // // // // // //         .import-type-option {
// // // // // // // //           display: flex;
// // // // // // // //           align-items: center;
// // // // // // // //           justify-content: space-between;
// // // // // // // //           gap: 0.5rem;
// // // // // // // //           padding: 0.6rem 0.8rem;
// // // // // // // //           border-radius: 10px;
// // // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // // //           cursor: pointer;
// // // // // // // //           transition: all 0.15s ease;
// // // // // // // //         }
// // // // // // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // // // // // //         .import-type-option.active {
// // // // // // // //           border-color: var(--accent-cyan);
// // // // // // // //           background: var(--accent-cyan-soft);
// // // // // // // //         }
// // // // // // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // // // // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// // // // // // // //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// // // // // // // //         .import-dropzone {
// // // // // // // //           position: relative;
// // // // // // // //           border: 1.5px dashed var(--border-strong);
// // // // // // // //           border-radius: 12px;
// // // // // // // //           padding: 1.5rem 1rem;
// // // // // // // //           text-align: center;
// // // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // // //           transition: all 0.15s ease;
// // // // // // // //         }
// // // // // // // //         .import-dropzone:hover {
// // // // // // // //           border-color: var(--accent-cyan);
// // // // // // // //           background: var(--accent-cyan-soft);
// // // // // // // //         }
// // // // // // // //         .import-dropzone input[type="file"] {
// // // // // // // //           position: absolute;
// // // // // // // //           inset: 0;
// // // // // // // //           opacity: 0;
// // // // // // // //           cursor: pointer;
// // // // // // // //         }
// // // // // // // //         .import-dropzone .dz-icon { font-size: 1.8rem; margin-bottom: 0.35rem; }
// // // // // // // //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// // // // // // // //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// // // // // // // //         .import-filename-chip {
// // // // // // // //           display: inline-flex;
// // // // // // // //           align-items: center;
// // // // // // // //           gap: 0.35rem;
// // // // // // // //           margin-top: 0.5rem;
// // // // // // // //           padding: 0.3rem 0.75rem;
// // // // // // // //           border-radius: 20px;
// // // // // // // //           background: var(--panel-raised);
// // // // // // // //           border: 1px solid var(--border-strong);
// // // // // // // //           font-size: 0.78rem;
// // // // // // // //           color: var(--text-primary);
// // // // // // // //           font-weight: 600;
// // // // // // // //         }

// // // // // // // //         .import-submit-btn {
// // // // // // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // // // // // //           border: none;
// // // // // // // //           color: #06231a;
// // // // // // // //           font-weight: 700;
// // // // // // // //           border-radius: 10px;
// // // // // // // //           padding: 0.75rem 1.5rem;
// // // // // // // //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// // // // // // // //         }
// // // // // // // //         .import-submit-btn:disabled {
// // // // // // // //           background: var(--panel-raised);
// // // // // // // //           color: var(--text-muted);
// // // // // // // //           opacity: 1;
// // // // // // // //         }

// // // // // // // //         .import-preview-header {
// // // // // // // //           background: var(--panel-raised);
// // // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // // //           padding: 0.75rem 1rem;
// // // // // // // //         }
// // // // // // // //         .import-preview-wrapper {
// // // // // // // //           max-height: 55vh;
// // // // // // // //           overflow: auto;
// // // // // // // //         }
// // // // // // // //         .import-preview-table {
// // // // // // // //           font-size: 0.78rem;
// // // // // // // //         }
// // // // // // // //         .import-preview-table thead th {
// // // // // // // //           position: sticky;
// // // // // // // //           top: 0;
// // // // // // // //           background: var(--panel-solid);
// // // // // // // //           color: var(--text-muted);
// // // // // // // //           font-size: 0.7rem;
// // // // // // // //           text-transform: uppercase;
// // // // // // // //           letter-spacing: 0.4px;
// // // // // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // // // // //           z-index: 2;
// // // // // // // //         }
// // // // // // // //         .modal-dark .modal-content {
// // // // // // // //           background: #12161f !important;
// // // // // // // //           border: 1px solid var(--border-strong);
// // // // // // // //           border-radius: 16px;
// // // // // // // //           color: var(--text-primary);
// // // // // // // //         }
// // // // // // // //         .modal-dark .modal-header {
// // // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // // //           background: rgba(239, 68, 68, 0.12);
// // // // // // // //         }
// // // // // // // //         .modal-dark .modal-footer {
// // // // // // // //           border-top: 1px solid var(--border-subtle);
// // // // // // // //         }
// // // // // // // //       `}</style>

// // // // // // // //       <Navbar />

// // // // // // // //       <div className="import-page-wrapper">
// // // // // // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // // // // //           <div>
// // // // // // // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>📥 Import &amp; Gestion des données</h2>
// // // // // // // //             <small className="text-muted">
// // // // // // // //               Importez vos fichiers CSV, Excel et téléversez directement les CVs et Lettres de motivation (PDF).
// // // // // // // //             </small>
// // // // // // // //           </div>

// // // // // // // //           <Button
// // // // // // // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // // // // // // //             size="sm"
// // // // // // // //             onClick={() => setShowResetModal(true)}
// // // // // // // //           >
// // // // // // // //             <span>🗑️</span>
// // // // // // // //             <span>Zone Danger / Purge &amp; Reset</span>
// // // // // // // //           </Button>
// // // // // // // //         </div>

// // // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // // //         {/* Formulaire d'importation */}
// // // // // // // //         <Card className="import-card mb-4 p-3 border-0">
// // // // // // // //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de données à importer</div>
// // // // // // // //           <div className="import-type-options mb-4">
// // // // // // // //             {IMPORT_TYPES.map((t) => (
// // // // // // // //               <label
// // // // // // // //                 key={t.value}
// // // // // // // //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // // // // // //               >
// // // // // // // //                 <div>
// // // // // // // //                   <div className="opt-label">{t.icon} {t.label}</div>
// // // // // // // //                   <div className="opt-hint">{t.hint}</div>
// // // // // // // //                 </div>
// // // // // // // //                 <input
// // // // // // // //                   type="radio"
// // // // // // // //                   name="importType"
// // // // // // // //                   value={t.value}
// // // // // // // //                   checked={importType === t.value}
// // // // // // // //                   onChange={(e) => {
// // // // // // // //                     setImportType(e.target.value);
// // // // // // // //                     setParsedData([]);
// // // // // // // //                     setPdfItems([]);
// // // // // // // //                     setFileName('');
// // // // // // // //                     setUploadProgress(null);
// // // // // // // //                   }}
// // // // // // // //                 />
// // // // // // // //               </label>
// // // // // // // //             ))}
// // // // // // // //           </div>

// // // // // // // //           <Row className="g-3 align-items-center">
// // // // // // // //             <Col md={8}>
// // // // // // // //               <div className="import-step-label"><span className="import-step-num">2</span> Sélectionnez le(s) fichier(s)</div>
// // // // // // // //               <div className="import-dropzone">
// // // // // // // //                 <Form.Control
// // // // // // // //                   type="file"
// // // // // // // //                   multiple={activeType?.isDoc}
// // // // // // // //                   accept={activeType?.isDoc ? '.pdf' : '.csv, .xlsx, .xls'}
// // // // // // // //                   onChange={handleFileUpload}
// // // // // // // //                   aria-label="Sélectionner les fichiers"
// // // // // // // //                 />
// // // // // // // //                 <div className="dz-icon">{activeType?.isDoc ? '📚' : '📄'}</div>
// // // // // // // //                 <div className="dz-text">
// // // // // // // //                   {activeType?.isDoc ? 'Glissez tous vos fichiers PDF ici (sélection multiple)' : 'Cliquez ou glissez votre fichier CSV / Excel'}
// // // // // // // //                 </div>
// // // // // // // //                 <div className="dz-sub">{activeType?.hint}</div>
// // // // // // // //                 {fileName && (
// // // // // // // //                   <div className="import-filename-chip">📎 {fileName}</div>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //             </Col>

// // // // // // // //             <Col md={4} className="d-flex flex-column justify-content-center">
// // // // // // // //               <div className="import-step-label"><span className="import-step-num">3</span> Lancer l'importation</div>
// // // // // // // //               <Button
// // // // // // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // // // // // //                 onClick={handleImport}
// // // // // // // //                 disabled={
// // // // // // // //                   loading ||
// // // // // // // //                   (activeType?.isDoc ? matchedPdfCount === 0 : parsedData.length === 0)
// // // // // // // //                 }
// // // // // // // //               >
// // // // // // // //                 {loading ? (
// // // // // // // //                   <>
// // // // // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // // // // //                     Téléversement en cours...
// // // // // // // //                   </>
// // // // // // // //                 ) : activeType?.isDoc ? (
// // // // // // // //                   `Importer ${matchedPdfCount} fichier(s) PDF (${importType.toUpperCase()})`
// // // // // // // //                 ) : (
// // // // // // // //                   `Importer (${parsedData.length} lignes)`
// // // // // // // //                 )}
// // // // // // // //               </Button>

// // // // // // // //               {uploadProgress && (
// // // // // // // //                 <div className="mt-3">
// // // // // // // //                   <div className="d-flex justify-content-between small text-muted mb-1">
// // // // // // // //                     <span>Progression du stockage Cloud :</span>
// // // // // // // //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// // // // // // // //                   </div>
// // // // // // // //                   <ProgressBar
// // // // // // // //                     animated
// // // // // // // //                     variant="success"
// // // // // // // //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// // // // // // // //                     style={{ height: '8px' }}
// // // // // // // //                   />
// // // // // // // //                 </div>
// // // // // // // //               )}
// // // // // // // //             </Col>
// // // // // // // //           </Row>
// // // // // // // //         </Card>

// // // // // // // //         {/* Prévisualisation PDFs (CV ou LM) */}
// // // // // // // //         {activeType?.isDoc && pdfItems.length > 0 && (
// // // // // // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // // // //               <span>
// // // // // // // //                 Correspondance automatique des fichiers PDF : <strong>{pdfItems.length} fichier(s) analysé(s)</strong>
// // // // // // // //               </span>
// // // // // // // //               <div className="d-flex gap-2">
// // // // // // // //                 <Badge bg="success">{matchedPdfCount} associé(s)</Badge>
// // // // // // // //                 {pdfItems.length - matchedPdfCount > 0 && (
// // // // // // // //                   <Badge bg="danger">{pdfItems.length - matchedPdfCount} non trouvé(s)</Badge>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //             <div className="import-preview-wrapper">
// // // // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // // // //                 <thead>
// // // // // // // //                   <tr>
// // // // // // // //                     <th>#</th>
// // // // // // // //                     <th>Nom du Fichier PDF</th>
// // // // // // // //                     <th>Étudiant Correspondant Détecté</th>
// // // // // // // //                     <th>Adresse Email</th>
// // // // // // // //                     <th>Statut</th>
// // // // // // // //                   </tr>
// // // // // // // //                 </thead>
// // // // // // // //                 <tbody>
// // // // // // // //                   {pdfItems.map((item, idx) => (
// // // // // // // //                     <tr key={idx}>
// // // // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // // // //                       <td className="fw-semibold text-white">{item.fileName}</td>
// // // // // // // //                       <td>
// // // // // // // //                         {item.student ? (
// // // // // // // //                           <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// // // // // // // //                         ) : (
// // // // // // // //                           <span className="text-danger">Inconnu (nom non reconnu)</span>
// // // // // // // //                         )}
// // // // // // // //                       </td>
// // // // // // // //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '—'}</td>
// // // // // // // //                       <td>
// // // // // // // //                         {item.matched ? (
// // // // // // // //                           <Badge bg="success">Prêt à uploader</Badge>
// // // // // // // //                         ) : (
// // // // // // // //                           <Badge bg="danger">Étudiant non trouvé</Badge>
// // // // // // // //                         )}
// // // // // // // //                       </td>
// // // // // // // //                     </tr>
// // // // // // // //                   ))}
// // // // // // // //                 </tbody>
// // // // // // // //               </Table>
// // // // // // // //             </div>
// // // // // // // //           </Card>
// // // // // // // //         )}

// // // // // // // //         {/* Prévisualisation CSV / Excel */}
// // // // // // // //         {!activeType?.isDoc && parsedData.length > 0 && (
// // // // // // // //           <Card className="import-card border-0 overflow-hidden">
// // // // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // // // //               <span>
// // // // // // // //                 Prévisualisation du tableur : <strong>{fileName}</strong>
// // // // // // // //               </span>
// // // // // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // // // // //             </div>
// // // // // // // //             <div className="import-preview-wrapper">
// // // // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // // // //                 <thead>
// // // // // // // //                   <tr>
// // // // // // // //                     <th>#</th>
// // // // // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // // // // //                       <th key={key}>{key}</th>
// // // // // // // //                     ))}
// // // // // // // //                   </tr>
// // // // // // // //                 </thead>
// // // // // // // //                 <tbody>
// // // // // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // // // // //                     <tr key={idx}>
// // // // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // // // // //                       ))}
// // // // // // // //                     </tr>
// // // // // // // //                   ))}
// // // // // // // //                 </tbody>
// // // // // // // //               </Table>
// // // // // // // //             </div>
// // // // // // // //             {parsedData.length > 50 && (
// // // // // // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // // // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // // // // //               </div>
// // // // // // // //             )}
// // // // // // // //           </Card>
// // // // // // // //         )}
// // // // // // // //       </div>

// // // // // // // //       {/* Modale Zone Danger */}
// // // // // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // // // // // // //             ⚠️ Zone Danger — Purge &amp; Remise à zéro
// // // // // // // //           </Modal.Title>
// // // // // // // //         </Modal.Header>
// // // // // // // //         <Modal.Body>
// // // // // // // //           <p className="text-light small mb-3">
// // // // // // // //             Cochez les éléments que vous souhaitez purger ou supprimer pour redémarrer une nouvelle campagne :
// // // // // // // //           </p>

// // // // // // // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // // // // // // //             <Form.Check
// // // // // // // //               type="checkbox"
// // // // // // // //               id="purge-docs"
// // // // // // // //               label="📄 Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // // // // // // //               checked={purgeOptions.documents}
// // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // // // // // // //               className="mb-2 text-white"
// // // // // // // //             />
// // // // // // // //             <Form.Check
// // // // // // // //               type="checkbox"
// // // // // // // //               id="purge-comp"
// // // // // // // //               label="📊 Vider les Aptitudes & Appétences des étudiants"
// // // // // // // //               checked={purgeOptions.competences}
// // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // // // // // // //               className="mb-2 text-white"
// // // // // // // //             />
// // // // // // // //             <Form.Check
// // // // // // // //               type="checkbox"
// // // // // // // //               id="purge-etud"
// // // // // // // //               label="🎓 Supprimer TOUS les Étudiants (efface aussi leurs vœux, rendez-vous et évaluations)"
// // // // // // // //               checked={purgeOptions.etudiants}
// // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // // // // // // //               className="mb-2 text-warning"
// // // // // // // //             />
// // // // // // // //             <Form.Check
// // // // // // // //               type="checkbox"
// // // // // // // //               id="purge-chefs"
// // // // // // // //               label="👨‍🏫 Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilités et rendez-vous)"
// // // // // // // //               checked={purgeOptions.chefs}
// // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // // // // // // //               className="mb-2 text-warning"
// // // // // // // //             />
// // // // // // // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // // // // // // //             <Form.Check
// // // // // // // //               type="checkbox"
// // // // // // // //               id="purge-tout"
// // // // // // // //               label="🔥 TOUT RÉINITIALISER : Vider absolument toutes les données de campagne pour une nouvelle rentrée"
// // // // // // // //               checked={purgeOptions.tout}
// // // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // // // // // // //               className="text-danger fw-bold"
// // // // // // // //             />
// // // // // // // //           </div>

// // // // // // // //           {requiresConfirmText && (
// // // // // // // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // // // // // // //               <Form.Label className="small text-danger fw-bold mb-1">
// // // // // // // //                 Sécurité : Tapez le mot « CONFIRMER » pour débloquer la suppression :
// // // // // // // //               </Form.Label>
// // // // // // // //               <Form.Control
// // // // // // // //                 size="sm"
// // // // // // // //                 placeholder="Tapez CONFIRMER"
// // // // // // // //                 value={confirmText}
// // // // // // // //                 onChange={(e) => setConfirmText(e.target.value)}
// // // // // // // //                 className="bg-dark text-white border-danger"
// // // // // // // //               />
// // // // // // // //             </div>
// // // // // // // //           )}

// // // // // // // //           <p className="text-muted small mb-0">
// // // // // // // //             ⚠️ Les données supprimées ne pourront pas être récupérées.
// // // // // // // //           </p>
// // // // // // // //         </Modal.Body>
// // // // // // // //         <Modal.Footer>
// // // // // // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // // // // //             Annuler
// // // // // // // //           </Button>
// // // // // // // //           <Button
// // // // // // // //             variant="danger"
// // // // // // // //             size="sm"
// // // // // // // //             onClick={handleExecutePurge}
// // // // // // // //             disabled={isButtonDisabled}
// // // // // // // //           >
// // // // // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Exécuter la purge sélectionnée'}
// // // // // // // //           </Button>
// // // // // // // //         </Modal.Footer>
// // // // // // // //       </Modal>
// // // // // // // //     </>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // import React, { useState } from 'react';
// // // // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // // // // // // import * as XLSX from 'xlsx';
// // // // // // // import Navbar from './Navbar';
// // // // // // // import {
// // // // // // //   importChefsDeProjet,
// // // // // // //   importEtudiants,
// // // // // // //   importAptitudes,
// // // // // // //   importApetences,
// // // // // // //   fetchEtudiants,
// // // // // // //   findEtudiantForDocument,
// // // // // // //   uploadBatchDocuments,
// // // // // // //   purgeAllDocuments,
// // // // // // //   supabase,
// // // // // // // } from '../services/supabase';

// // // // // // // const COMPETENCES = [
// // // // // // //   'calculs_simulation_numerique',
// // // // // // //   'essais_caracterisation',
// // // // // // //   'fabrication_prototypage',
// // // // // // //   'conception_mecanique',
// // // // // // //   'automatique_automatisme',
// // // // // // //   'iot_systeme_embarque',
// // // // // // //   'robot_cobot',
// // // // // // //   'vision',
// // // // // // //   'ia',
// // // // // // //   'ihm_appli_web_mobile',
// // // // // // //   'ethique_ergonomie',
// // // // // // // ];

// // // // // // // const IMPORT_TYPES = [
// // // // // // //   { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, spécialité, email)', icon: '👨‍🏫', isDoc: false },
// // // // // // //   { value: 'etudiants', label: 'Étudiants', hint: 'Fichier CSV / Excel (nom, prénom, email, parcours)', icon: '🎓', isDoc: false },
// // // // // // //   { value: 'aptitudes', label: 'Aptitudes techniques', hint: 'Questionnaire Moodle ou CSV (11 compétences)', icon: '📊', isDoc: false },
// // // // // // //   { value: 'apetences', label: 'Appétences / Intérêts', hint: 'Questionnaire Moodle ou CSV (11 compétences)', icon: '🎯', isDoc: false },
// // // // // // //   { value: 'cv', label: 'CV des étudiants (Dossier Tout_CV)', hint: 'Sélectionnez le dossier Tout_CV ou plusieurs fichiers PDF', icon: '📄', isDoc: true },
// // // // // // //   { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Sélectionnez le dossier Tout_LM ou plusieurs fichiers PDF', icon: '✉️', isDoc: true },
// // // // // // // ];

// // // // // // // export default function ImportPage() {
// // // // // // //   const [importType, setImportType] = useState('chefs');
// // // // // // //   const [parsedData, setParsedData] = useState([]);
// // // // // // //   const [pdfItems, setPdfItems] = useState([]);
// // // // // // //   const [fileName, setFileName] = useState('');
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [uploadProgress, setUploadProgress] = useState(null);
// // // // // // //   const [error, setError] = useState(null);
// // // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // // //   // Modale de purge / zone danger
// // // // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // // // //   const [resetting, setResetting] = useState(false);
// // // // // // //   const [confirmText, setConfirmText] = useState('');

// // // // // // //   const [purgeOptions, setPurgeOptions] = useState({
// // // // // // //     documents: false,
// // // // // // //     competences: false,
// // // // // // //     etudiants: false,
// // // // // // //     chefs: false,
// // // // // // //     tout: false,
// // // // // // //   });

// // // // // // //   const activeType = IMPORT_TYPES.find((t) => t.value === importType);

// // // // // // //   const extractNameFromEmail = (email) => {
// // // // // // //     try {
// // // // // // //       const namePart = email.split('@')[0];
// // // // // // //       const parts = namePart.split('.');
// // // // // // //       if (parts.length >= 2) {
// // // // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // // // //         return { nom, prenom };
// // // // // // //       }
// // // // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // // // //     } catch {
// // // // // // //       return { nom: email, prenom: '' };
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleSpreadsheetUpload = (file) => {
// // // // // // //     const reader = new FileReader();
// // // // // // //     reader.onload = (evt) => {
// // // // // // //       try {
// // // // // // //         const data = evt.target.result;
// // // // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // // //         const sheet = workbook.Sheets[sheetName];
// // // // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // // // //         if (rawJson.length === 0) throw new Error('Le fichier est vide.');
// // // // // // //         processSpreadsheetData(rawJson, importType);
// // // // // // //       } catch (err) {
// // // // // // //         setError(`Erreur de lecture : ${err.message}`);
// // // // // // //       }
// // // // // // //     };
// // // // // // //     reader.readAsBinaryString(file);
// // // // // // //   };

// // // // // // //   const handlePdfFilesUpload = async (filesList) => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setError(null);

// // // // // // //       const etudiantsList = await fetchEtudiants();
// // // // // // //       if (!etudiantsList || etudiantsList.length === 0) {
// // // // // // //         throw new Error("Aucun étudiant trouvé en base. Veuillez d'abord importer la liste des étudiants.");
// // // // // // //       }

// // // // // // //       const items = Array.from(filesList).map((file) => {
// // // // // // //         const fullPath = file.webkitRelativePath || file.name;
// // // // // // //         const matchedStudent = findEtudiantForDocument(fullPath, etudiantsList);
        
// // // // // // //         let folderLabel = file.name;
// // // // // // //         if (file.webkitRelativePath) {
// // // // // // //           const parts = file.webkitRelativePath.split('/');
// // // // // // //           if (parts.length >= 2) folderLabel = `📁 ${parts[parts.length - 2]} / ${file.name}`;
// // // // // // //         }

// // // // // // //         return {
// // // // // // //           file,
// // // // // // //           fileName: folderLabel,
// // // // // // //           student: matchedStudent,
// // // // // // //           matched: Boolean(matchedStudent),
// // // // // // //         };
// // // // // // //       });

// // // // // // //       setPdfItems(items);
// // // // // // //       setFileName(`${filesList.length} document(s) détecté(s) dans le dossier`);
// // // // // // //     } catch (err) {
// // // // // // //       setError(err.message || 'Erreur lors de la lecture des dossiers.');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleFileUpload = (e) => {
// // // // // // //     const files = e.target.files;
// // // // // // //     if (!files || files.length === 0) return;

// // // // // // //     setError(null);
// // // // // // //     setSuccessMsg(null);
// // // // // // //     setUploadProgress(null);

// // // // // // //     if (activeType?.isDoc) {
// // // // // // //       handlePdfFilesUpload(files);
// // // // // // //     } else {
// // // // // // //       setFileName(files[0].name);
// // // // // // //       setParsedData([]);
// // // // // // //       handleSpreadsheetUpload(files[0]);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const processSpreadsheetData = (rows, type) => {
// // // // // // //     if (rows.length < 2) throw new Error('Le fichier ne contient pas assez de lignes.');

// // // // // // //     const firstRow = rows[0];
// // // // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // // // //     let formatted = [];

// // // // // // //     if (type === 'chefs') {
// // // // // // //       formatted = dataRows.map((r) => ({
// // // // // // //         nom: String(r[0] || '').trim(),
// // // // // // //         specialite: String(r[1] || '').trim(),
// // // // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // // // //       })).filter((r) => r.email && r.nom);
// // // // // // //     } else if (type === 'etudiants') {
// // // // // // //       formatted = dataRows.map((r) => {
// // // // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // // // //         const secondCol = String(r[1] || '').trim();
// // // // // // //         const thirdCol = String(r[2] || '').trim();
// // // // // // //         const fourthCol = String(r[3] || '').trim();

// // // // // // //         if (emailOrFirst.includes('@')) {
// // // // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // // // //           return {
// // // // // // //             nom,
// // // // // // //             prenom,
// // // // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // // // //             parcours: secondCol || 'I2026',
// // // // // // //           };
// // // // // // //         }

// // // // // // //         return {
// // // // // // //           nom: emailOrFirst,
// // // // // // //           prenom: secondCol,
// // // // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // // // //           parcours: fourthCol || 'I2026',
// // // // // // //         };
// // // // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // // // //       const isMoodleSurvey = firstRow.some((col) => String(col).includes('Nom complet') || String(col).includes('courriel'));

// // // // // // //       if (isMoodleSurvey) {
// // // // // // //         const emailColIdx = firstRow.findIndex((col) => String(col).toLowerCase().includes('courriel') || String(col).toLowerCase().includes('email'));
// // // // // // //         const startOffset = type === 'aptitudes' ? 5 : 16;

// // // // // // //         formatted = dataRows.map((r) => {
// // // // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // // // //           const rowData = { adresse_email: email };
// // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // //             rowData[comp] = parseInt(r[startOffset + idx], 10) || 0;
// // // // // // //           });
// // // // // // //           return rowData;
// // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // //       } else {
// // // // // // //         formatted = dataRows.map((r) => {
// // // // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // // // //           COMPETENCES.forEach((comp, idx) => {
// // // // // // //             rowData[comp] = parseInt(r[idx + 1], 10) || 0;
// // // // // // //           });
// // // // // // //           return rowData;
// // // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // // //       }
// // // // // // //     }

// // // // // // //     setParsedData(formatted);
// // // // // // //   };

// // // // // // //   const handleImport = async () => {
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setError(null);
// // // // // // //       setSuccessMsg(null);

// // // // // // //       if (activeType?.isDoc) {
// // // // // // //         const matchedItems = pdfItems.filter((item) => item.matched && item.student);
// // // // // // //         if (matchedItems.length === 0) {
// // // // // // //           throw new Error('Aucun dossier ne correspond à un nom d’étudiant.');
// // // // // // //         }

// // // // // // //         const batchPayload = matchedItems.map((item) => ({
// // // // // // //           file: item.file,
// // // // // // //           etudiant_id: item.student.id,
// // // // // // //         }));

// // // // // // //         setUploadProgress({ current: 0, total: batchPayload.length });

// // // // // // //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// // // // // // //           setUploadProgress({ current, total });
// // // // // // //         });

// // // // // // //         setSuccessMsg(
// // // // // // //           `🎉 ${res.success} fichier(s) (${importType.toUpperCase()}) associés et stockés avec succès dans Supabase Storage !`
// // // // // // //         );
// // // // // // //         setPdfItems([]);
// // // // // // //         setFileName('');
// // // // // // //       } else {
// // // // // // //         if (parsedData.length === 0) return;

// // // // // // //         let result;
// // // // // // //         if (importType === 'chefs') {
// // // // // // //           result = await importChefsDeProjet(parsedData);
// // // // // // //         } else if (importType === 'etudiants') {
// // // // // // //           result = await importEtudiants(parsedData);
// // // // // // //         } else if (importType === 'aptitudes') {
// // // // // // //           result = await importAptitudes(parsedData);
// // // // // // //         } else if (importType === 'apetences') {
// // // // // // //           result = await importApetences(parsedData);
// // // // // // //         }

// // // // // // //         setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // // // //         setParsedData([]);
// // // // // // //         setFileName('');
// // // // // // //       }
// // // // // // //     } catch (err) {
// // // // // // //       setError(err.message || "Erreur lors de l'import.");
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleExecutePurge = async () => {
// // // // // // //     try {
// // // // // // //       setResetting(true);
// // // // // // //       setError(null);
// // // // // // //       setSuccessMsg(null);

// // // // // // //       const messages = [];

// // // // // // //       if (purgeOptions.documents || purgeOptions.tout) {
// // // // // // //         await purgeAllDocuments();
// // // // // // //         messages.push('Fichiers CV & LM supprimés du Storage.');
// // // // // // //       }

// // // // // // //       const payloadRPC = {
// // // // // // //         rendez_vous: purgeOptions.tout,
// // // // // // //         evaluations: purgeOptions.tout,
// // // // // // //         affectations: purgeOptions.tout,
// // // // // // //         selections: purgeOptions.tout,
// // // // // // //         disponibilites: purgeOptions.tout,
// // // // // // //         competences: purgeOptions.competences || purgeOptions.tout,
// // // // // // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // // // // // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // // // // // //         users: purgeOptions.tout,
// // // // // // //       };

// // // // // // //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // // // // // //       if (rpcErr) throw rpcErr;

// // // // // // //       messages.push('Tables réinitialisées.');
// // // // // // //       setSuccessMsg(`🗑️ Purge réussie : ${messages.join(' ')}`);
// // // // // // //       setShowResetModal(false);
// // // // // // //       setConfirmText('');
// // // // // // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // // // // // //     } catch (err) {
// // // // // // //       setError(err.message || 'Erreur lors de la purge.');
// // // // // // //     } finally {
// // // // // // //       setResetting(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const matchedPdfCount = pdfItems.filter((i) => i.matched).length;
// // // // // // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // // // // // //   const isButtonDisabled = resetting || (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) || (requiresConfirmText && confirmText !== 'CONFIRMER');

// // // // // // //   return (
// // // // // // //     <>
// // // // // // //       <style>{`
// // // // // // //         :root {
// // // // // // //           --canvas: #0a0e1a;
// // // // // // //           --panel: rgba(21, 27, 46, 0.86);
// // // // // // //           --panel-solid: #151b2e;
// // // // // // //           --panel-raised: #1b2338;
// // // // // // //           --border-subtle: rgba(148, 163, 184, 0.14);
// // // // // // //           --border-strong: rgba(148, 163, 184, 0.28);
// // // // // // //           --text-primary: #f4f6fb;
// // // // // // //           --text-muted: #93a0b8;
// // // // // // //           --accent-violet: #7c6cf6;
// // // // // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // // // // //           --accent-cyan: #29d3d3;
// // // // // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // // // // //           --accent-emerald: #35d0a0;
// // // // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // // // //           --accent-coral: #ff6b6b;
// // // // // // //         }

// // // // // // //         .import-page-wrapper {
// // // // // // //           max-width: 100%;
// // // // // // //           margin: 0 auto;
// // // // // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // // // // //           color: var(--text-primary);
// // // // // // //           background:
// // // // // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // // // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // // // // //             var(--canvas);
// // // // // // //           min-height: calc(100vh - 60px);
// // // // // // //         }
// // // // // // //         .import-card {
// // // // // // //           background: var(--panel);
// // // // // // //           backdrop-filter: blur(16px);
// // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // //           border-radius: 14px;
// // // // // // //         }
// // // // // // //         .btn-danger-pill {
// // // // // // //           background: rgba(239, 68, 68, 0.14) !important;
// // // // // // //           color: #f87171 !important;
// // // // // // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // // // //           border-radius: 8px !important;
// // // // // // //         }
// // // // // // //         .btn-danger-pill:hover:not(:disabled) {
// // // // // // //           background: #dc2626 !important;
// // // // // // //           color: #ffffff !important;
// // // // // // //           border-color: #dc2626 !important;
// // // // // // //         }

// // // // // // //         .import-step-label {
// // // // // // //           display: flex;
// // // // // // //           align-items: center;
// // // // // // //           gap: 0.4rem;
// // // // // // //           color: var(--text-muted);
// // // // // // //           font-weight: 700;
// // // // // // //           font-size: 0.75rem;
// // // // // // //           text-transform: uppercase;
// // // // // // //           letter-spacing: 0.5px;
// // // // // // //           margin-bottom: 0.5rem;
// // // // // // //         }
// // // // // // //         .import-step-num {
// // // // // // //           width: 20px; height: 20px;
// // // // // // //           border-radius: 50%;
// // // // // // //           background: var(--accent-violet-soft);
// // // // // // //           color: var(--accent-violet);
// // // // // // //           display: inline-flex; align-items: center; justify-content: center;
// // // // // // //           font-size: 0.7rem; font-weight: 800;
// // // // // // //         }
// // // // // // //         .import-type-options {
// // // // // // //           display: grid;
// // // // // // //           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
// // // // // // //           gap: 0.5rem;
// // // // // // //         }
// // // // // // //         .import-type-option {
// // // // // // //           display: flex;
// // // // // // //           align-items: center;
// // // // // // //           justify-content: space-between;
// // // // // // //           gap: 0.5rem;
// // // // // // //           padding: 0.6rem 0.8rem;
// // // // // // //           border-radius: 10px;
// // // // // // //           border: 1px solid var(--border-subtle);
// // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // //           cursor: pointer;
// // // // // // //           transition: all 0.15s ease;
// // // // // // //         }
// // // // // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // // // // //         .import-type-option.active {
// // // // // // //           border-color: var(--accent-cyan);
// // // // // // //           background: var(--accent-cyan-soft);
// // // // // // //         }
// // // // // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // // // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// // // // // // //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// // // // // // //         .import-dropzone {
// // // // // // //           position: relative;
// // // // // // //           border: 1.5px dashed var(--border-strong);
// // // // // // //           border-radius: 12px;
// // // // // // //           padding: 1.5rem 1rem;
// // // // // // //           text-align: center;
// // // // // // //           background: rgba(255,255,255,0.02);
// // // // // // //           transition: all 0.15s ease;
// // // // // // //         }
// // // // // // //         .import-dropzone:hover {
// // // // // // //           border-color: var(--accent-cyan);
// // // // // // //           background: var(--accent-cyan-soft);
// // // // // // //         }
// // // // // // //         .import-dropzone input[type="file"] {
// // // // // // //           position: absolute;
// // // // // // //           inset: 0;
// // // // // // //           opacity: 0;
// // // // // // //           cursor: pointer;
// // // // // // //         }
// // // // // // //         .import-dropzone .dz-icon { font-size: 1.8rem; margin-bottom: 0.35rem; }
// // // // // // //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// // // // // // //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// // // // // // //         .import-filename-chip {
// // // // // // //           display: inline-flex;
// // // // // // //           align-items: center;
// // // // // // //           gap: 0.35rem;
// // // // // // //           margin-top: 0.5rem;
// // // // // // //           padding: 0.3rem 0.75rem;
// // // // // // //           border-radius: 20px;
// // // // // // //           background: var(--panel-raised);
// // // // // // //           border: 1px solid var(--border-strong);
// // // // // // //           font-size: 0.78rem;
// // // // // // //           color: var(--text-primary);
// // // // // // //           font-weight: 600;
// // // // // // //         }

// // // // // // //         .import-submit-btn {
// // // // // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // // // // //           border: none;
// // // // // // //           color: #06231a;
// // // // // // //           font-weight: 700;
// // // // // // //           border-radius: 10px;
// // // // // // //           padding: 0.75rem 1.5rem;
// // // // // // //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// // // // // // //         }
// // // // // // //         .import-submit-btn:disabled {
// // // // // // //           background: var(--panel-raised);
// // // // // // //           color: var(--text-muted);
// // // // // // //           opacity: 1;
// // // // // // //         }

// // // // // // //         .import-preview-header {
// // // // // // //           background: var(--panel-raised);
// // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // //           padding: 0.75rem 1rem;
// // // // // // //         }
// // // // // // //         .import-preview-wrapper {
// // // // // // //           max-height: 55vh;
// // // // // // //           overflow: auto;
// // // // // // //         }
// // // // // // //         .import-preview-table {
// // // // // // //           font-size: 0.78rem;
// // // // // // //         }
// // // // // // //         .import-preview-table thead th {
// // // // // // //           position: sticky;
// // // // // // //           top: 0;
// // // // // // //           background: var(--panel-solid);
// // // // // // //           color: var(--text-muted);
// // // // // // //           font-size: 0.7rem;
// // // // // // //           text-transform: uppercase;
// // // // // // //           letter-spacing: 0.4px;
// // // // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // // // //           z-index: 2;
// // // // // // //         }
// // // // // // //         .modal-dark .modal-content {
// // // // // // //           background: #12161f !important;
// // // // // // //           border: 1px solid var(--border-strong);
// // // // // // //           border-radius: 16px;
// // // // // // //           color: var(--text-primary);
// // // // // // //         }
// // // // // // //         .modal-dark .modal-header {
// // // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // // //           background: rgba(239, 68, 68, 0.12);
// // // // // // //         }
// // // // // // //         .modal-dark .modal-footer {
// // // // // // //           border-top: 1px solid var(--border-subtle);
// // // // // // //         }
// // // // // // //       `}</style>

// // // // // // //       <Navbar />

// // // // // // //       <div className="import-page-wrapper">
// // // // // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // // // //           <div>
// // // // // // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>📥 Import &amp; Gestion des données</h2>
// // // // // // //             <small className="text-muted">
// // // // // // //               Alimentez la base avec vos fichiers CSV/Excel ou sélectionnez directement les dossiers <strong>Tout_CV</strong> et <strong>Tout_LM</strong>.
// // // // // // //             </small>
// // // // // // //           </div>

// // // // // // //           <Button
// // // // // // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // // // // // //             size="sm"
// // // // // // //             onClick={() => setShowResetModal(true)}
// // // // // // //           >
// // // // // // //             <span>🗑️</span>
// // // // // // //             <span>Zone Danger / Purge &amp; Reset</span>
// // // // // // //           </Button>
// // // // // // //         </div>

// // // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // // //         {/* Formulaire d'importation */}
// // // // // // //         <Card className="import-card mb-4 p-3 border-0">
// // // // // // //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de données</div>
// // // // // // //           <div className="import-type-options mb-4">
// // // // // // //             {IMPORT_TYPES.map((t) => (
// // // // // // //               <label
// // // // // // //                 key={t.value}
// // // // // // //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // // // // //               >
// // // // // // //                 <div>
// // // // // // //                   <div className="opt-label">{t.icon} {t.label}</div>
// // // // // // //                   <div className="opt-hint">{t.hint}</div>
// // // // // // //                 </div>
// // // // // // //                 <input
// // // // // // //                   type="radio"
// // // // // // //                   name="importType"
// // // // // // //                   value={t.value}
// // // // // // //                   checked={importType === t.value}
// // // // // // //                   onChange={(e) => {
// // // // // // //                     setImportType(e.target.value);
// // // // // // //                     setParsedData([]);
// // // // // // //                     setPdfItems([]);
// // // // // // //                     setFileName('');
// // // // // // //                     setUploadProgress(null);
// // // // // // //                   }}
// // // // // // //                 />
// // // // // // //               </label>
// // // // // // //             ))}
// // // // // // //           </div>

// // // // // // //           <Row className="g-3 align-items-center">
// // // // // // //             <Col md={8}>
// // // // // // //               <div className="import-step-label">
// // // // // // //                 <span className="import-step-num">2</span> 
// // // // // // //                 {activeType?.isDoc ? 'Sélectionnez le dossier ou les fichiers' : 'Sélectionnez le fichier CSV/Excel'}
// // // // // // //               </div>
// // // // // // //               <div className="import-dropzone">
// // // // // // //                 <input
// // // // // // //                   type="file"
// // // // // // //                   multiple
// // // // // // //                   webkitdirectory={activeType?.isDoc ? "" : undefined}
// // // // // // //                   directory={activeType?.isDoc ? "" : undefined}
// // // // // // //                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
// // // // // // //                   onChange={handleFileUpload}
// // // // // // //                   aria-label="Sélectionner le dossier ou les fichiers"
// // // // // // //                 />
// // // // // // //                 <div className="dz-icon">{activeType?.isDoc ? '📁' : '📄'}</div>
// // // // // // //                 <div className="dz-text">
// // // // // // //                   {activeType?.isDoc ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)` : 'Cliquez ou glissez votre fichier CSV / Excel'}
// // // // // // //                 </div>
// // // // // // //                 <div className="dz-sub">{activeType?.hint}</div>
// // // // // // //                 {fileName && (
// // // // // // //                   <div className="import-filename-chip">📎 {fileName}</div>
// // // // // // //                 )}
// // // // // // //               </div>
// // // // // // //             </Col>

// // // // // // //             <Col md={4} className="d-flex flex-column justify-content-center">
// // // // // // //               <div className="import-step-label"><span className="import-step-num">3</span> Lancer l'importation</div>
// // // // // // //               <Button
// // // // // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // // // // //                 onClick={handleImport}
// // // // // // //                 disabled={
// // // // // // //                   loading ||
// // // // // // //                   (activeType?.isDoc ? matchedPdfCount === 0 : parsedData.length === 0)
// // // // // // //                 }
// // // // // // //               >
// // // // // // //                 {loading ? (
// // // // // // //                   <>
// // // // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // // // //                     Téléversement en cours...
// // // // // // //                   </>
// // // // // // //                 ) : activeType?.isDoc ? (
// // // // // // //                   `Importer ${matchedPdfCount} fichier(s) (${importType.toUpperCase()})`
// // // // // // //                 ) : (
// // // // // // //                   `Importer (${parsedData.length} lignes)`
// // // // // // //                 )}
// // // // // // //               </Button>

// // // // // // //               {uploadProgress && (
// // // // // // //                 <div className="mt-3">
// // // // // // //                   <div className="d-flex justify-content-between small text-muted mb-1">
// // // // // // //                     <span>Progression du stockage Cloud :</span>
// // // // // // //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// // // // // // //                   </div>
// // // // // // //                   <ProgressBar
// // // // // // //                     animated
// // // // // // //                     variant="success"
// // // // // // //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// // // // // // //                     style={{ height: '8px' }}
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               )}
// // // // // // //             </Col>
// // // // // // //           </Row>
// // // // // // //         </Card>

// // // // // // //         {/* Prévisualisation des dossiers de CV ou LM */}
// // // // // // //         {activeType?.isDoc && pdfItems.length > 0 && (
// // // // // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // // //               <span>
// // // // // // //                 Correspondance par sous-dossier étudiant : <strong>{pdfItems.length} fichier(s) analysé(s)</strong>
// // // // // // //               </span>
// // // // // // //               <div className="d-flex gap-2">
// // // // // // //                 <Badge bg="success">{matchedPdfCount} associé(s) avec succès</Badge>
// // // // // // //                 {pdfItems.length - matchedPdfCount > 0 && (
// // // // // // //                   <Badge bg="danger">{pdfItems.length - matchedPdfCount} dossier(s) non reconnu(s)</Badge>
// // // // // // //                 )}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //             <div className="import-preview-wrapper">
// // // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // // //                 <thead>
// // // // // // //                   <tr>
// // // // // // //                     <th>#</th>
// // // // // // //                     <th>Dossier / Fichier Détecté</th>
// // // // // // //                     <th>Étudiant Correspondant dans la Base</th>
// // // // // // //                     <th>Adresse Email</th>
// // // // // // //                     <th>Statut</th>
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {pdfItems.map((item, idx) => (
// // // // // // //                     <tr key={idx}>
// // // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // // //                       <td className="fw-semibold text-white">{item.fileName}</td>
// // // // // // //                       <td>
// // // // // // //                         {item.student ? (
// // // // // // //                           <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// // // // // // //                         ) : (
// // // // // // //                           <span className="text-danger">Étudiant introuvable pour ce dossier</span>
// // // // // // //                         )}
// // // // // // //                       </td>
// // // // // // //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '—'}</td>
// // // // // // //                       <td>
// // // // // // //                         {item.matched ? (
// // // // // // //                           <Badge bg="success">Prêt à uploader</Badge>
// // // // // // //                         ) : (
// // // // // // //                           <Badge bg="danger">Nom non reconnu</Badge>
// // // // // // //                         )}
// // // // // // //                       </td>
// // // // // // //                     </tr>
// // // // // // //                   ))}
// // // // // // //                 </tbody>
// // // // // // //               </Table>
// // // // // // //             </div>
// // // // // // //           </Card>
// // // // // // //         )}

// // // // // // //         {/* Prévisualisation CSV / Excel */}
// // // // // // //         {!activeType?.isDoc && parsedData.length > 0 && (
// // // // // // //           <Card className="import-card border-0 overflow-hidden">
// // // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // // //               <span>
// // // // // // //                 Prévisualisation du tableur : <strong>{fileName}</strong>
// // // // // // //               </span>
// // // // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // // // //             </div>
// // // // // // //             <div className="import-preview-wrapper">
// // // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // // //                 <thead>
// // // // // // //                   <tr>
// // // // // // //                     <th>#</th>
// // // // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // // // //                       <th key={key}>{key}</th>
// // // // // // //                     ))}
// // // // // // //                   </tr>
// // // // // // //                 </thead>
// // // // // // //                 <tbody>
// // // // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // // // //                     <tr key={idx}>
// // // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // // // //                       ))}
// // // // // // //                     </tr>
// // // // // // //                   ))}
// // // // // // //                 </tbody>
// // // // // // //               </Table>
// // // // // // //             </div>
// // // // // // //             {parsedData.length > 50 && (
// // // // // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // // // //               </div>
// // // // // // //             )}
// // // // // // //           </Card>
// // // // // // //         )}
// // // // // // //       </div>

// // // // // // //       {/* Modale Zone Danger */}
// // // // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // // // // // //             ⚠️ Zone Danger — Purge &amp; Remise à zéro
// // // // // // //           </Modal.Title>
// // // // // // //         </Modal.Header>
// // // // // // //         <Modal.Body>
// // // // // // //           <p className="text-light small mb-3">
// // // // // // //             Cochez les éléments que vous souhaitez purger ou supprimer pour redémarrer une nouvelle campagne :
// // // // // // //           </p>

// // // // // // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // // // // // //             <Form.Check
// // // // // // //               type="checkbox"
// // // // // // //               id="purge-docs"
// // // // // // //               label="📄 Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // // // // // //               checked={purgeOptions.documents}
// // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // // // // // //               className="mb-2 text-white"
// // // // // // //             />
// // // // // // //             <Form.Check
// // // // // // //               type="checkbox"
// // // // // // //               id="purge-comp"
// // // // // // //               label="📊 Vider les Aptitudes & Appétences des étudiants"
// // // // // // //               checked={purgeOptions.competences}
// // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // // // // // //               className="mb-2 text-white"
// // // // // // //             />
// // // // // // //             <Form.Check
// // // // // // //               type="checkbox"
// // // // // // //               id="purge-etud"
// // // // // // //               label="🎓 Supprimer TOUS les Étudiants (efface aussi leurs vœux, rendez-vous et évaluations)"
// // // // // // //               checked={purgeOptions.etudiants}
// // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // // // // // //               className="mb-2 text-warning"
// // // // // // //             />
// // // // // // //             <Form.Check
// // // // // // //               type="checkbox"
// // // // // // //               id="purge-chefs"
// // // // // // //               label="👨‍🏫 Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilités et rendez-vous)"
// // // // // // //               checked={purgeOptions.chefs}
// // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // // // // // //               className="mb-2 text-warning"
// // // // // // //             />
// // // // // // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // // // // // //             <Form.Check
// // // // // // //               type="checkbox"
// // // // // // //               id="purge-tout"
// // // // // // //               label="🔥 TOUT RÉINITIALISER : Vider absolument toutes les données de campagne pour une nouvelle rentrée"
// // // // // // //               checked={purgeOptions.tout}
// // // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // // // // // //               className="text-danger fw-bold"
// // // // // // //             />
// // // // // // //           </div>

// // // // // // //           {requiresConfirmText && (
// // // // // // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // // // // // //               <Form.Label className="small text-danger fw-bold mb-1">
// // // // // // //                 Sécurité : Tapez le mot « CONFIRMER » pour débloquer la suppression :
// // // // // // //               </Form.Label>
// // // // // // //               <Form.Control
// // // // // // //                 size="sm"
// // // // // // //                 placeholder="Tapez CONFIRMER"
// // // // // // //                 value={confirmText}
// // // // // // //                 onChange={(e) => setConfirmText(e.target.value)}
// // // // // // //                 className="bg-dark text-white border-danger"
// // // // // // //               />
// // // // // // //             </div>
// // // // // // //           )}

// // // // // // //           <p className="text-muted small mb-0">
// // // // // // //             ⚠️ Les données supprimées ne pourront pas être récupérées.
// // // // // // //           </p>
// // // // // // //         </Modal.Body>
// // // // // // //         <Modal.Footer>
// // // // // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // // // //             Annuler
// // // // // // //           </Button>
// // // // // // //           <Button
// // // // // // //             variant="danger"
// // // // // // //             size="sm"
// // // // // // //             onClick={handleExecutePurge}
// // // // // // //             disabled={isButtonDisabled}
// // // // // // //           >
// // // // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Exécuter la purge sélectionnée'}
// // // // // // //           </Button>
// // // // // // //         </Modal.Footer>
// // // // // // //       </Modal>
// // // // // // //     </>
// // // // // // //   );
// // // // // // // }

// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // // // // // import * as XLSX from 'xlsx';
// // // // // // import Navbar from './Navbar';
// // // // // // import {
// // // // // //   importChefsDeProjet,
// // // // // //   importEtudiants,
// // // // // //   importAptitudes,
// // // // // //   importApetences,
// // // // // //   fetchEtudiants,
// // // // // //   fetchReferentielCompetences,
// // // // // //   findEtudiantForDocument,
// // // // // //   uploadBatchDocuments,
// // // // // //   normalizeSpecialiteKey,
// // // // // //   purgeAllDocuments,
// // // // // //   supabase,
// // // // // // } from '../services/supabase';

// // // // // // export default function ImportPage() {
// // // // // //   const [importType, setImportType] = useState('chefs');
// // // // // //   const [referentielCompetences, setReferentielCompetences] = useState([]);
// // // // // //   const [parsedData, setParsedData] = useState([]);
// // // // // //   const [pdfItems, setPdfItems] = useState([]);
// // // // // //   const [fileName, setFileName] = useState('');
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [uploadProgress, setUploadProgress] = useState(null);
// // // // // //   const [error, setError] = useState(null);
// // // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // // //   // Modale de purge / zone danger
// // // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // // //   const [resetting, setResetting] = useState(false);
// // // // // //   const [confirmText, setConfirmText] = useState('');

// // // // // //   const [purgeOptions, setPurgeOptions] = useState({
// // // // // //     documents: false,
// // // // // //     competences: false,
// // // // // //     etudiants: false,
// // // // // //     chefs: false,
// // // // // //     tout: false,
// // // // // //   });

// // // // // //   // Chargement des compétences actives de la promotion au montage
// // // // // //   useEffect(() => {
// // // // // //     fetchReferentielCompetences(true)
// // // // // //       .then((data) => setReferentielCompetences(data || []))
// // // // // //       .catch((err) => console.warn('Erreur chargement référentiel:', err));
// // // // // //   }, []);

// // // // // //   const importTypesList = [
// // // // // //     { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, spécialité, email)', icon: ' ', isDoc: false },
// // // // // //     { value: 'etudiants', label: 'Étudiants', hint: 'Fichier CSV / Excel (nom, prénom, email, parcours)', icon: ' ', isDoc: false },
// // // // // //     { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} compétences actives)`, hint: 'Questionnaire Moodle ou CSV de compétences', icon: ' ', isDoc: false },
// // // // // //     { value: 'apetences', label: `Appétences / Intérêts (${referentielCompetences.length} compétences actives)`, hint: 'Questionnaire Moodle ou CSV d’appétences', icon: ' ', isDoc: false },
// // // // // //     { value: 'cv', label: 'CV des étudiants (Dossier Tout_CV)', hint: 'Sélectionnez le dossier Tout_CV ou plusieurs fichiers PDF', icon: ' ', isDoc: true },
// // // // // //     { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Sélectionnez le dossier Tout_LM ou plusieurs fichiers PDF', icon: ' ', isDoc: true },
// // // // // //   ];

// // // // // //   const activeType = importTypesList.find((t) => t.value === importType);

// // // // // //   const extractNameFromEmail = (email) => {
// // // // // //     try {
// // // // // //       const namePart = email.split('@')[0];
// // // // // //       const parts = namePart.split('.');
// // // // // //       if (parts.length >= 2) {
// // // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // // //         return { nom, prenom };
// // // // // //       }
// // // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // // //     } catch {
// // // // // //       return { nom: email, prenom: '' };
// // // // // //     }
// // // // // //   };

// // // // // //   const handleSpreadsheetUpload = (file) => {
// // // // // //     const reader = new FileReader();
// // // // // //     reader.onload = (evt) => {
// // // // // //       try {
// // // // // //         const data = evt.target.result;
// // // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // // //         const sheetName = workbook.SheetNames[0];
// // // // // //         const sheet = workbook.Sheets[sheetName];
// // // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // // //         if (rawJson.length === 0) throw new Error('Le fichier est vide.');
// // // // // //         processSpreadsheetData(rawJson, importType);
// // // // // //       } catch (err) {
// // // // // //         setError(`Erreur de lecture : ${err.message}`);
// // // // // //       }
// // // // // //     };
// // // // // //     reader.readAsBinaryString(file);
// // // // // //   };

// // // // // //   const handlePdfFilesUpload = async (filesList) => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       setError(null);

// // // // // //       const etudiantsList = await fetchEtudiants();
// // // // // //       if (!etudiantsList || etudiantsList.length === 0) {
// // // // // //         throw new Error("Aucun étudiant trouvé en base. Veuillez d'abord importer la liste des étudiants.");
// // // // // //       }

// // // // // //       const items = Array.from(filesList).map((file) => {
// // // // // //         const fullPath = file.webkitRelativePath || file.name;
// // // // // //         const matchedStudent = findEtudiantForDocument(fullPath, etudiantsList);
        
// // // // // //         let folderLabel = file.name;
// // // // // //         if (file.webkitRelativePath) {
// // // // // //           const parts = file.webkitRelativePath.split('/');
// // // // // //           if (parts.length >= 2) folderLabel = ` ${parts[parts.length - 2]} / ${file.name}`;
// // // // // //         }

// // // // // //         return {
// // // // // //           file,
// // // // // //           fileName: folderLabel,
// // // // // //           student: matchedStudent,
// // // // // //           matched: Boolean(matchedStudent),
// // // // // //         };
// // // // // //       });

// // // // // //       setPdfItems(items);
// // // // // //       setFileName(`${filesList.length} document(s) détecté(s) dans le dossier`);
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || 'Erreur lors de la lecture des dossiers.');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleFileUpload = (e) => {
// // // // // //     const files = e.target.files;
// // // // // //     if (!files || files.length === 0) return;

// // // // // //     setError(null);
// // // // // //     setSuccessMsg(null);
// // // // // //     setUploadProgress(null);

// // // // // //     if (activeType?.isDoc) {
// // // // // //       handlePdfFilesUpload(files);
// // // // // //     } else {
// // // // // //       setFileName(files[0].name);
// // // // // //       setParsedData([]);
// // // // // //       handleSpreadsheetUpload(files[0]);
// // // // // //     }
// // // // // //   };

// // // // // //   // Traitement dynamique des données du tableur
// // // // // //   const processSpreadsheetData = (rows, type) => {
// // // // // //     if (rows.length < 2) throw new Error('Le fichier ne contient pas assez de lignes.');

// // // // // //     const firstRow = rows[0];
// // // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // // //     let formatted = [];

// // // // // //     if (type === 'chefs') {
// // // // // //       formatted = dataRows.map((r) => ({
// // // // // //         nom: String(r[0] || '').trim(),
// // // // // //         specialite: String(r[1] || '').trim(),
// // // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // // //       })).filter((r) => r.email && r.nom);
// // // // // //     } else if (type === 'etudiants') {
// // // // // //       formatted = dataRows.map((r) => {
// // // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // // //         const secondCol = String(r[1] || '').trim();
// // // // // //         const thirdCol = String(r[2] || '').trim();
// // // // // //         const fourthCol = String(r[3] || '').trim();

// // // // // //         if (emailOrFirst.includes('@')) {
// // // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // // //           return {
// // // // // //             nom,
// // // // // //             prenom,
// // // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // // //             parcours: secondCol || 'I2026',
// // // // // //           };
// // // // // //         }

// // // // // //         return {
// // // // // //           nom: emailOrFirst,
// // // // // //           prenom: secondCol,
// // // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // // //           parcours: fourthCol || 'I2026',
// // // // // //         };
// // // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // // //       const isMoodleSurvey = firstRow.some((col) =>
// // // // // //         String(col).toLowerCase().includes('courriel') ||
// // // // // //         String(col).toLowerCase().includes('email') ||
// // // // // //         String(col).toLowerCase().includes('nom complet')
// // // // // //       );

// // // // // //       const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];

// // // // // //       if (isMoodleSurvey) {
// // // // // //         const emailColIdx = firstRow.findIndex((col) =>
// // // // // //           String(col).toLowerCase().includes('courriel') ||
// // // // // //           String(col).toLowerCase().includes('email')
// // // // // //         );

// // // // // //         // Détection de décalage Moodle ou association par libellé de colonne
// // // // // //         const startOffset = type === 'aptitudes' ? 5 : (5 + activeComps.length);

// // // // // //         formatted = dataRows.map((r) => {
// // // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // // //           const rowData = { adresse_email: email };

// // // // // //           activeComps.forEach((comp, idx) => {
// // // // // //             // Tente de trouver par index ou par correspondance de titre
// // // // // //             const val = r[startOffset + idx] !== undefined ? r[startOffset + idx] : r[idx + 1];
// // // // // //             rowData[comp.code] = parseInt(val, 10) || 0;
// // // // // //           });

// // // // // //           return rowData;
// // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // //       } else {
// // // // // //         // Format direct : Colonne 1 = email, colonnes suivantes = compétences dans l'ordre du référentiel
// // // // // //         formatted = dataRows.map((r) => {
// // // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // // //           activeComps.forEach((comp, idx) => {
// // // // // //             rowData[comp.code] = parseInt(r[idx + 1], 10) || 0;
// // // // // //           });
// // // // // //           return rowData;
// // // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // // //       }
// // // // // //     }

// // // // // //     setParsedData(formatted);
// // // // // //   };

// // // // // //   const handleImport = async () => {
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       setError(null);
// // // // // //       setSuccessMsg(null);

// // // // // //       if (activeType?.isDoc) {
// // // // // //         const matchedItems = pdfItems.filter((item) => item.matched && item.student);
// // // // // //         if (matchedItems.length === 0) {
// // // // // //           throw new Error('Aucun dossier ne correspond à un nom d’étudiant.');
// // // // // //         }

// // // // // //         const batchPayload = matchedItems.map((item) => ({
// // // // // //           file: item.file,
// // // // // //           etudiant_id: item.student.id,
// // // // // //         }));

// // // // // //         setUploadProgress({ current: 0, total: batchPayload.length });

// // // // // //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// // // // // //           setUploadProgress({ current, total });
// // // // // //         });

// // // // // //         setSuccessMsg(
// // // // // //           ` ${res.success} fichier(s) (${importType.toUpperCase()}) associés et stockés avec succès dans Supabase Storage !`
// // // // // //         );
// // // // // //         setPdfItems([]);
// // // // // //         setFileName('');
// // // // // //       } else {
// // // // // //         if (parsedData.length === 0) return;

// // // // // //         let result;
// // // // // //         if (importType === 'chefs') {
// // // // // //           result = await importChefsDeProjet(parsedData);
// // // // // //         } else if (importType === 'etudiants') {
// // // // // //           result = await importEtudiants(parsedData);
// // // // // //         } else if (importType === 'aptitudes') {
// // // // // //           result = await importAptitudes(parsedData);
// // // // // //         } else if (importType === 'apetences') {
// // // // // //           result = await importApetences(parsedData);
// // // // // //         }

// // // // // //         setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // // //         setParsedData([]);
// // // // // //         setFileName('');
// // // // // //       }
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || "Erreur lors de l'import.");
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleExecutePurge = async () => {
// // // // // //     try {
// // // // // //       setResetting(true);
// // // // // //       setError(null);
// // // // // //       setSuccessMsg(null);

// // // // // //       const messages = [];

// // // // // //       if (purgeOptions.documents || purgeOptions.tout) {
// // // // // //         await purgeAllDocuments();
// // // // // //         messages.push('Fichiers CV & LM supprimés du Storage.');
// // // // // //       }

// // // // // //       const payloadRPC = {
// // // // // //         rendez_vous: purgeOptions.tout,
// // // // // //         evaluations: purgeOptions.tout,
// // // // // //         affectations: purgeOptions.tout,
// // // // // //         selections: purgeOptions.tout,
// // // // // //         disponibilites: purgeOptions.tout,
// // // // // //         competences: purgeOptions.competences || purgeOptions.tout,
// // // // // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // // // // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // // // // //         users: purgeOptions.tout,
// // // // // //       };

// // // // // //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // // // // //       if (rpcErr) throw rpcErr;

// // // // // //       messages.push('Données réinitialisées.');
// // // // // //       setSuccessMsg(`Purge réussie : ${messages.join(' ')}`);
// // // // // //       setShowResetModal(false);
// // // // // //       setConfirmText('');
// // // // // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // // // // //     } catch (err) {
// // // // // //       setError(err.message || 'Erreur lors de la purge.');
// // // // // //     } finally {
// // // // // //       setResetting(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const matchedPdfCount = pdfItems.filter((i) => i.matched).length;
// // // // // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // // // // //   const isButtonDisabled = resetting || (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) || (requiresConfirmText && confirmText !== 'CONFIRMER');

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
// // // // // //           --accent-emerald: #35d0a0;
// // // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // // //           --accent-coral: #ff6b6b;
// // // // // //         }

// // // // // //         .import-page-wrapper {
// // // // // //           max-width: 100%;
// // // // // //           margin: 0 auto;
// // // // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // // // //           color: var(--text-primary);
// // // // // //           background:
// // // // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // // // //             var(--canvas);
// // // // // //           min-height: calc(100vh - 60px);
// // // // // //         }
// // // // // //         .import-card {
// // // // // //           background: var(--panel);
// // // // // //           backdrop-filter: blur(16px);
// // // // // //           border: 1px solid var(--border-subtle);
// // // // // //           border-radius: 14px;
// // // // // //         }
// // // // // //         .btn-danger-pill {
// // // // // //           background: rgba(239, 68, 68, 0.14) !important;
// // // // // //           color: #f87171 !important;
// // // // // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // // //           border-radius: 8px !important;
// // // // // //         }
// // // // // //         .btn-danger-pill:hover:not(:disabled) {
// // // // // //           background: #dc2626 !important;
// // // // // //           color: #ffffff !important;
// // // // // //           border-color: #dc2626 !important;
// // // // // //         }

// // // // // //         .import-step-label {
// // // // // //           display: flex;
// // // // // //           align-items: center;
// // // // // //           gap: 0.4rem;
// // // // // //           color: var(--text-muted);
// // // // // //           font-weight: 700;
// // // // // //           font-size: 0.75rem;
// // // // // //           text-transform: uppercase;
// // // // // //           letter-spacing: 0.5px;
// // // // // //           margin-bottom: 0.5rem;
// // // // // //         }
// // // // // //         .import-step-num {
// // // // // //           width: 20px; height: 20px;
// // // // // //           border-radius: 50%;
// // // // // //           background: var(--accent-violet-soft);
// // // // // //           color: var(--accent-violet);
// // // // // //           display: inline-flex; align-items: center; justify-content: center;
// // // // // //           font-size: 0.7rem; font-weight: 800;
// // // // // //         }
// // // // // //         .import-type-options {
// // // // // //           display: grid;
// // // // // //           grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
// // // // // //           gap: 0.5rem;
// // // // // //         }
// // // // // //         .import-type-option {
// // // // // //           display: flex;
// // // // // //           align-items: center;
// // // // // //           justify-content: space-between;
// // // // // //           gap: 0.5rem;
// // // // // //           padding: 0.6rem 0.8rem;
// // // // // //           border-radius: 10px;
// // // // // //           border: 1px solid var(--border-subtle);
// // // // // //           background: rgba(255,255,255,0.02);
// // // // // //           cursor: pointer;
// // // // // //           transition: all 0.15s ease;
// // // // // //         }
// // // // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // // // //         .import-type-option.active {
// // // // // //           border-color: var(--accent-cyan);
// // // // // //           background: var(--accent-cyan-soft);
// // // // // //         }
// // // // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// // // // // //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// // // // // //         .import-dropzone {
// // // // // //           position: relative;
// // // // // //           border: 1.5px dashed var(--border-strong);
// // // // // //           border-radius: 12px;
// // // // // //           padding: 1.5rem 1rem;
// // // // // //           text-align: center;
// // // // // //           background: rgba(255,255,255,0.02);
// // // // // //           transition: all 0.15s ease;
// // // // // //         }
// // // // // //         .import-dropzone:hover {
// // // // // //           border-color: var(--accent-cyan);
// // // // // //           background: var(--accent-cyan-soft);
// // // // // //         }
// // // // // //         .import-dropzone input[type="file"] {
// // // // // //           position: absolute;
// // // // // //           inset: 0;
// // // // // //           opacity: 0;
// // // // // //           cursor: pointer;
// // // // // //         }
// // // // // //         .import-dropzone .dz-icon { font-size: 1.8rem; margin-bottom: 0.35rem; }
// // // // // //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// // // // // //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// // // // // //         .import-filename-chip {
// // // // // //           display: inline-flex;
// // // // // //           align-items: center;
// // // // // //           gap: 0.35rem;
// // // // // //           margin-top: 0.5rem;
// // // // // //           padding: 0.3rem 0.75rem;
// // // // // //           border-radius: 20px;
// // // // // //           background: var(--panel-raised);
// // // // // //           border: 1px solid var(--border-strong);
// // // // // //           font-size: 0.78rem;
// // // // // //           color: var(--text-primary);
// // // // // //           font-weight: 600;
// // // // // //         }

// // // // // //         .import-submit-btn {
// // // // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // // // //           border: none;
// // // // // //           color: #06231a;
// // // // // //           font-weight: 700;
// // // // // //           border-radius: 10px;
// // // // // //           padding: 0.75rem 1.5rem;
// // // // // //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// // // // // //         }
// // // // // //         .import-submit-btn:disabled {
// // // // // //           background: var(--panel-raised);
// // // // // //           color: var(--text-muted);
// // // // // //           opacity: 1;
// // // // // //         }

// // // // // //         .import-preview-header {
// // // // // //           background: var(--panel-raised);
// // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // //           padding: 0.75rem 1rem;
// // // // // //         }
// // // // // //         .import-preview-wrapper {
// // // // // //           max-height: 55vh;
// // // // // //           overflow: auto;
// // // // // //         }
// // // // // //         .import-preview-table {
// // // // // //           font-size: 0.78rem;
// // // // // //         }
// // // // // //         .import-preview-table thead th {
// // // // // //           position: sticky;
// // // // // //           top: 0;
// // // // // //           background: var(--panel-solid);
// // // // // //           color: var(--text-muted);
// // // // // //           font-size: 0.7rem;
// // // // // //           text-transform: uppercase;
// // // // // //           letter-spacing: 0.4px;
// // // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // // //           z-index: 2;
// // // // // //         }
// // // // // //         .modal-dark .modal-content {
// // // // // //           background: #12161f !important;
// // // // // //           border: 1px solid var(--border-strong);
// // // // // //           border-radius: 16px;
// // // // // //           color: var(--text-primary);
// // // // // //         }
// // // // // //         .modal-dark .modal-header {
// // // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // // //           background: rgba(239, 68, 68, 0.12);
// // // // // //         }
// // // // // //         .modal-dark .modal-footer {
// // // // // //           border-top: 1px solid var(--border-subtle);
// // // // // //         }
// // // // // //       `}</style>

// // // // // //       <Navbar />

// // // // // //       <div className="import-page-wrapper">
// // // // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // // //           <div>
// // // // // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}> Import &amp; Gestion des données</h2>
// // // // // //             <small className="text-muted">
// // // // // //               Alimentez la base avec vos fichiers CSV/Excel ou sélectionnez directement les dossiers <strong>Tout_CV</strong> et <strong>Tout_LM</strong>.
// // // // // //             </small>
// // // // // //           </div>

// // // // // //           <Button
// // // // // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // // // // //             size="sm"
// // // // // //             onClick={() => setShowResetModal(true)}
// // // // // //           >
// // // // // //             <span></span>
// // // // // //             <span>Zone Danger / Purge &amp; Reset</span>
// // // // // //           </Button>
// // // // // //         </div>

// // // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // // //         {/* Formulaire d'importation */}
// // // // // //         <Card className="import-card mb-4 p-3 border-0">
// // // // // //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de données</div>
// // // // // //           <div className="import-type-options mb-4">
// // // // // //             {importTypesList.map((t) => (
// // // // // //               <label
// // // // // //                 key={t.value}
// // // // // //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // // // //               >
// // // // // //                 <div>
// // // // // //                   <div className="opt-label">{t.icon} {t.label}</div>
// // // // // //                   <div className="opt-hint">{t.hint}</div>
// // // // // //                 </div>
// // // // // //                 <input
// // // // // //                   type="radio"
// // // // // //                   name="importType"
// // // // // //                   value={t.value}
// // // // // //                   checked={importType === t.value}
// // // // // //                   onChange={(e) => {
// // // // // //                     setImportType(e.target.value);
// // // // // //                     setParsedData([]);
// // // // // //                     setPdfItems([]);
// // // // // //                     setFileName('');
// // // // // //                     setUploadProgress(null);
// // // // // //                   }}
// // // // // //                 />
// // // // // //               </label>
// // // // // //             ))}
// // // // // //           </div>

// // // // // //           <Row className="g-3 align-items-center">
// // // // // //             <Col md={8}>
// // // // // //               <div className="import-step-label">
// // // // // //                 <span className="import-step-num">2</span> 
// // // // // //                 {activeType?.isDoc ? 'Sélectionnez le dossier ou les fichiers' : 'Sélectionnez le fichier CSV/Excel'}
// // // // // //               </div>
// // // // // //               <div className="import-dropzone">
// // // // // //                 <input
// // // // // //                   type="file"
// // // // // //                   multiple
// // // // // //                   webkitdirectory={activeType?.isDoc ? "" : undefined}
// // // // // //                   directory={activeType?.isDoc ? "" : undefined}
// // // // // //                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
// // // // // //                   onChange={handleFileUpload}
// // // // // //                   aria-label="Sélectionner le dossier ou les fichiers"
// // // // // //                 />
// // // // // //                 <div className="dz-icon">{activeType?.isDoc ? '📁' : '📄'}</div>
// // // // // //                 <div className="dz-text">
// // // // // //                   {activeType?.isDoc ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)` : 'Cliquez ou glissez votre fichier CSV / Excel'}
// // // // // //                 </div>
// // // // // //                 <div className="dz-sub">{activeType?.hint}</div>
// // // // // //                 {fileName && (
// // // // // //                   <div className="import-filename-chip">📎 {fileName}</div>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             </Col>

// // // // // //             <Col md={4} className="d-flex flex-column justify-content-center">
// // // // // //               <div className="import-step-label"><span className="import-step-num">3</span> Lancer l'importation</div>
// // // // // //               <Button
// // // // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // // // //                 onClick={handleImport}
// // // // // //                 disabled={
// // // // // //                   loading ||
// // // // // //                   (activeType?.isDoc ? matchedPdfCount === 0 : parsedData.length === 0)
// // // // // //                 }
// // // // // //               >
// // // // // //                 {loading ? (
// // // // // //                   <>
// // // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // // //                     Téléversement en cours...
// // // // // //                   </>
// // // // // //                 ) : activeType?.isDoc ? (
// // // // // //                   `Importer ${matchedPdfCount} fichier(s) (${importType.toUpperCase()})`
// // // // // //                 ) : (
// // // // // //                   `Importer (${parsedData.length} lignes)`
// // // // // //                 )}
// // // // // //               </Button>

// // // // // //               {uploadProgress && (
// // // // // //                 <div className="mt-3">
// // // // // //                   <div className="d-flex justify-content-between small text-muted mb-1">
// // // // // //                     <span>Progression du stockage Cloud :</span>
// // // // // //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// // // // // //                   </div>
// // // // // //                   <ProgressBar
// // // // // //                     animated
// // // // // //                     variant="success"
// // // // // //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// // // // // //                     style={{ height: '8px' }}
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </Col>
// // // // // //           </Row>
// // // // // //         </Card>

// // // // // //         {/* Prévisualisation des dossiers de CV ou LM */}
// // // // // //         {activeType?.isDoc && pdfItems.length > 0 && (
// // // // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // //               <span>
// // // // // //                 Correspondance par sous-dossier étudiant : <strong>{pdfItems.length} fichier(s) analysé(s)</strong>
// // // // // //               </span>
// // // // // //               <div className="d-flex gap-2">
// // // // // //                 <Badge bg="success">{matchedPdfCount} associé(s) avec succès</Badge>
// // // // // //                 {pdfItems.length - matchedPdfCount > 0 && (
// // // // // //                   <Badge bg="danger">{pdfItems.length - matchedPdfCount} dossier(s) non reconnu(s)</Badge>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             </div>
// // // // // //             <div className="import-preview-wrapper">
// // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th>#</th>
// // // // // //                     <th>Dossier / Fichier Détecté</th>
// // // // // //                     <th>Étudiant Correspondant dans la Base</th>
// // // // // //                     <th>Adresse Email</th>
// // // // // //                     <th>Statut</th>
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {pdfItems.map((item, idx) => (
// // // // // //                     <tr key={idx}>
// // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // //                       <td className="fw-semibold text-white">{item.fileName}</td>
// // // // // //                       <td>
// // // // // //                         {item.student ? (
// // // // // //                           <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// // // // // //                         ) : (
// // // // // //                           <span className="text-danger">Étudiant introuvable pour ce dossier</span>
// // // // // //                         )}
// // // // // //                       </td>
// // // // // //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '—'}</td>
// // // // // //                       <td>
// // // // // //                         {item.matched ? (
// // // // // //                           <Badge bg="success">Prêt à uploader</Badge>
// // // // // //                         ) : (
// // // // // //                           <Badge bg="danger">Nom non reconnu</Badge>
// // // // // //                         )}
// // // // // //                       </td>
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </Table>
// // // // // //             </div>
// // // // // //           </Card>
// // // // // //         )}

// // // // // //         {/* Prévisualisation CSV / Excel avec colonnes dynamiques */}
// // // // // //         {!activeType?.isDoc && parsedData.length > 0 && (
// // // // // //           <Card className="import-card border-0 overflow-hidden">
// // // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // // //               <span>
// // // // // //                 Prévisualisation du tableur : <strong>{fileName}</strong>
// // // // // //               </span>
// // // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // // //             </div>
// // // // // //             <div className="import-preview-wrapper">
// // // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // // //                 <thead>
// // // // // //                   <tr>
// // // // // //                     <th>#</th>
// // // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // // //                       <th key={key}>{key}</th>
// // // // // //                     ))}
// // // // // //                   </tr>
// // // // // //                 </thead>
// // // // // //                 <tbody>
// // // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // // //                     <tr key={idx}>
// // // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // // //                       ))}
// // // // // //                     </tr>
// // // // // //                   ))}
// // // // // //                 </tbody>
// // // // // //               </Table>
// // // // // //             </div>
// // // // // //             {parsedData.length > 50 && (
// // // // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // // //               </div>
// // // // // //             )}
// // // // // //           </Card>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* Modale Zone Danger */}
// // // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // // // // //         <Modal.Header closeButton closeVariant="white">
// // // // // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // // // // //             Zone Danger — Purge &amp; Remise à zéro
// // // // // //           </Modal.Title>
// // // // // //         </Modal.Header>
// // // // // //         <Modal.Body>
// // // // // //           <p className="text-light small mb-3">
// // // // // //             Cochez les éléments que vous souhaitez purger ou supprimer pour redémarrer une nouvelle campagne :
// // // // // //           </p>

// // // // // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // // // // //             <Form.Check
// // // // // //               type="checkbox"
// // // // // //               id="purge-docs"
// // // // // //               label="Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // // // // //               checked={purgeOptions.documents}
// // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // // // // //               className="mb-2 text-white"
// // // // // //             />
// // // // // //             <Form.Check
// // // // // //               type="checkbox"
// // // // // //               id="purge-comp"
// // // // // //               label=" Vider les Aptitudes & Appétences des étudiants"
// // // // // //               checked={purgeOptions.competences}
// // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // // // // //               className="mb-2 text-white"
// // // // // //             />
// // // // // //             <Form.Check
// // // // // //               type="checkbox"
// // // // // //               id="purge-etud"
// // // // // //               label="Supprimer TOUS les Étudiants (efface aussi leurs vœux, rendez-vous et évaluations)"
// // // // // //               checked={purgeOptions.etudiants}
// // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // // // // //               className="mb-2 text-warning"
// // // // // //             />
// // // // // //             <Form.Check
// // // // // //               type="checkbox"
// // // // // //               id="purge-chefs"
// // // // // //               label=" Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilités et rendez-vous)"
// // // // // //               checked={purgeOptions.chefs}
// // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // // // // //               className="mb-2 text-warning"
// // // // // //             />
// // // // // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // // // // //             <Form.Check
// // // // // //               type="checkbox"
// // // // // //               id="purge-tout"
// // // // // //               label=" TOUT RÉINITIALISER : Vider absolument toutes les données de campagne pour une nouvelle rentrée"
// // // // // //               checked={purgeOptions.tout}
// // // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // // // // //               className="text-danger fw-bold"
// // // // // //             />
// // // // // //           </div>

// // // // // //           {requiresConfirmText && (
// // // // // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // // // // //               <Form.Label className="small text-danger fw-bold mb-1">
// // // // // //                 Sécurité : Tapez le mot « CONFIRMER » pour débloquer la suppression :
// // // // // //               </Form.Label>
// // // // // //               <Form.Control
// // // // // //                 size="sm"
// // // // // //                 placeholder="Tapez CONFIRMER"
// // // // // //                 value={confirmText}
// // // // // //                 onChange={(e) => setConfirmText(e.target.value)}
// // // // // //                 className="bg-dark text-white border-danger"
// // // // // //               />
// // // // // //             </div>
// // // // // //           )}

// // // // // //           <p className="text-muted small mb-0">
// // // // // //              Les données supprimées ne pourront pas être récupérées.
// // // // // //           </p>
// // // // // //         </Modal.Body>
// // // // // //         <Modal.Footer>
// // // // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // // //             Annuler
// // // // // //           </Button>
// // // // // //           <Button
// // // // // //             variant="danger"
// // // // // //             size="sm"
// // // // // //             onClick={handleExecutePurge}
// // // // // //             disabled={isButtonDisabled}
// // // // // //           >
// // // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Exécuter la purge sélectionnée'}
// // // // // //           </Button>
// // // // // //         </Modal.Footer>
// // // // // //       </Modal>
// // // // // //     </>
// // // // // //   );
// // // // // // }

// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // // // // import * as XLSX from 'xlsx';
// // // // // import Navbar from './Navbar';
// // // // // import {
// // // // //   importChefsDeProjet,
// // // // //   importEtudiants,
// // // // //   importAptitudes,
// // // // //   importApetences,
// // // // //   fetchChefsDeProjet,
// // // // //   fetchEtudiants,
// // // // //   fetchReferentielCompetences,
// // // // //   findEtudiantForDocument,
// // // // //   findChefFromWishText,
// // // // //   saveSelection,
// // // // //   uploadBatchDocuments,
// // // // //   purgeAllDocuments,
// // // // //   supabase,
// // // // // } from '../services/supabase';

// // // // // export default function ImportPage() {
// // // // //   const [importType, setImportType] = useState('chefs');
// // // // //   const [referentielCompetences, setReferentielCompetences] = useState([]);
// // // // //   const [etudiantsList, setEtudiantsList] = useState([]);
// // // // //   const [chefsList, setChefsList] = useState([]);

// // // // //   const [parsedData, setParsedData] = useState([]);
// // // // //   const [wishesData, setWishesData] = useState([]); // Pour l'import des vœux Moodle
// // // // //   const [pdfItems, setPdfItems] = useState([]);
// // // // //   const [fileName, setFileName] = useState('');
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [uploadProgress, setUploadProgress] = useState(null);
// // // // //   const [error, setError] = useState(null);
// // // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // // //   // Modale de purge / zone danger
// // // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // // //   const [resetting, setResetting] = useState(false);
// // // // //   const [confirmText, setConfirmText] = useState('');

// // // // //   const [purgeOptions, setPurgeOptions] = useState({
// // // // //     documents: false,
// // // // //     competences: false,
// // // // //     etudiants: false,
// // // // //     chefs: false,
// // // // //     tout: false,
// // // // //   });

// // // // //   const loadBaseData = async () => {
// // // // //     try {
// // // // //       const [refComps, etuds, chefs] = await Promise.all([
// // // // //         fetchReferentielCompetences(true),
// // // // //         fetchEtudiants(),
// // // // //         fetchChefsDeProjet(),
// // // // //       ]);
// // // // //       setReferentielCompetences(refComps || []);
// // // // //       setEtudiantsList(etuds || []);
// // // // //       setChefsList(chefs || []);
// // // // //     } catch (err) {
// // // // //       console.warn('Erreur chargement données de base:', err);
// // // // //     }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     loadBaseData();
// // // // //   }, []);

// // // // //   const importTypesList = [
// // // // //     { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, spécialité, email)', icon: '', isDoc: false },
// // // // //     { value: 'etudiants', label: 'Étudiants', hint: 'Fichier CSV / Excel (nom, prénom, email, parcours)', icon: '', isDoc: false },
// // // // //     { value: 'voeux', label: 'Vœux réels des étudiants (1er, 2e, 3e choix Moodle)', hint: 'Fichier Moodle avec colonnes 1er, 2nd et 3eme Choix', icon: '', isDoc: false },
// // // // //     { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} compétences)`, hint: 'Questionnaire Moodle ou CSV de compétences', icon: '', isDoc: false },
// // // // //     { value: 'apetences', label: `Appétences / Intérêts (${referentielCompetences.length} compétences)`, hint: 'Questionnaire Moodle ou CSV d’appétences', icon: '', isDoc: false },
// // // // //     { value: 'cv', label: 'CV des étudiants (Dossier Tout_CV)', hint: 'Sélectionnez le dossier Tout_CV ou plusieurs fichiers PDF', icon: '📄', isDoc: true },
// // // // //     { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Sélectionnez le dossier Tout_LM ou plusieurs fichiers PDF', icon: '✉️', isDoc: true },
// // // // //   ];

// // // // //   const activeType = importTypesList.find((t) => t.value === importType);

// // // // //   const extractNameFromEmail = (email) => {
// // // // //     try {
// // // // //       const namePart = email.split('@')[0];
// // // // //       const parts = namePart.split('.');
// // // // //       if (parts.length >= 2) {
// // // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // // //         return { nom, prenom };
// // // // //       }
// // // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // // //     } catch {
// // // // //       return { nom: email, prenom: '' };
// // // // //     }
// // // // //   };

// // // // //   const handleSpreadsheetUpload = (file) => {
// // // // //     const reader = new FileReader();
// // // // //     reader.onload = (evt) => {
// // // // //       try {
// // // // //         const data = evt.target.result;
// // // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // // //         const sheetName = workbook.SheetNames[0];
// // // // //         const sheet = workbook.Sheets[sheetName];
// // // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // // //         if (rawJson.length === 0) throw new Error('Le fichier est vide.');
// // // // //         processSpreadsheetData(rawJson, importType);
// // // // //       } catch (err) {
// // // // //         setError(`Erreur de lecture : ${err.message}`);
// // // // //       }
// // // // //     };
// // // // //     reader.readAsBinaryString(file);
// // // // //   };

// // // // //   const handlePdfFilesUpload = async (filesList) => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       setError(null);

// // // // //       let currentEtudiants = etudiantsList;
// // // // //       if (!currentEtudiants || currentEtudiants.length === 0) {
// // // // //         currentEtudiants = await fetchEtudiants();
// // // // //         setEtudiantsList(currentEtudiants || []);
// // // // //       }

// // // // //       if (!currentEtudiants || currentEtudiants.length === 0) {
// // // // //         throw new Error("Aucun étudiant trouvé en base. Veuillez d'abord importer la liste des étudiants.");
// // // // //       }

// // // // //       const items = Array.from(filesList).map((file) => {
// // // // //         const fullPath = file.webkitRelativePath || file.name;
// // // // //         const matchedStudent = findEtudiantForDocument(fullPath, currentEtudiants);

// // // // //         let folderLabel = file.name;
// // // // //         if (file.webkitRelativePath) {
// // // // //           const parts = file.webkitRelativePath.split('/');
// // // // //           if (parts.length >= 2) folderLabel = `📁 ${parts[parts.length - 2]} / ${file.name}`;
// // // // //         }

// // // // //         return {
// // // // //           file,
// // // // //           fileName: folderLabel,
// // // // //           student: matchedStudent,
// // // // //           matched: Boolean(matchedStudent),
// // // // //         };
// // // // //       });

// // // // //       setPdfItems(items);
// // // // //       setFileName(`${filesList.length} document(s) détecté(s) dans le dossier`);
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'Erreur lors de la lecture des dossiers.');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleFileUpload = (e) => {
// // // // //     const files = e.target.files;
// // // // //     if (!files || files.length === 0) return;

// // // // //     setError(null);
// // // // //     setSuccessMsg(null);
// // // // //     setUploadProgress(null);

// // // // //     if (activeType?.isDoc) {
// // // // //       handlePdfFilesUpload(files);
// // // // //     } else {
// // // // //       setFileName(files[0].name);
// // // // //       setParsedData([]);
// // // // //       setWishesData([]);
// // // // //       handleSpreadsheetUpload(files[0]);
// // // // //     }
// // // // //   };

// // // // //   // Traitement dynamique des données du tableur
// // // // //   const processSpreadsheetData = (rows, type) => {
// // // // //     if (rows.length < 2) throw new Error('Le fichier ne contient pas assez de lignes.');

// // // // //     const firstRow = rows[0];
// // // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // // //     let formatted = [];

// // // // //     if (type === 'chefs') {
// // // // //       formatted = dataRows.map((r) => ({
// // // // //         nom: String(r[0] || '').trim(),
// // // // //         specialite: String(r[1] || '').trim(),
// // // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // // //       })).filter((r) => r.email && r.nom);
// // // // //       setParsedData(formatted);
// // // // //     } else if (type === 'etudiants') {
// // // // //       formatted = dataRows.map((r) => {
// // // // //         const emailOrFirst = String(r[0] || '').trim();
// // // // //         const secondCol = String(r[1] || '').trim();
// // // // //         const thirdCol = String(r[2] || '').trim();
// // // // //         const fourthCol = String(r[3] || '').trim();

// // // // //         if (emailOrFirst.includes('@')) {
// // // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // // //           return {
// // // // //             nom,
// // // // //             prenom,
// // // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // // //             parcours: secondCol || 'I2026',
// // // // //           };
// // // // //         }

// // // // //         return {
// // // // //           nom: emailOrFirst,
// // // // //           prenom: secondCol,
// // // // //           adresse_email: thirdCol.toLowerCase(),
// // // // //           parcours: fourthCol || 'I2026',
// // // // //         };
// // // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // //       setParsedData(formatted);
// // // // //     } else if (type === 'voeux') {
// // // // //       // Extraction des vœux 1er, 2e, 3e choix (Colonnes AB, AC, AD de Moodle)
// // // // //       const emailColIdx = firstRow.findIndex((col) =>
// // // // //         String(col).toLowerCase().includes('courriel') ||
// // // // //         String(col).toLowerCase().includes('email')
// // // // //       );

// // // // //       const colIdx1er = firstRow.findIndex((col) =>
// // // // //         String(col).toLowerCase().includes('1er') || String(col).toLowerCase().includes('1 er')
// // // // //       );
// // // // //       const colIdx2nd = firstRow.findIndex((col) =>
// // // // //         String(col).toLowerCase().includes('2nd') || String(col).toLowerCase().includes('2eme') || String(col).toLowerCase().includes('2e')
// // // // //       );
// // // // //       const colIdx3eme = firstRow.findIndex((col) =>
// // // // //         String(col).toLowerCase().includes('3eme') || String(col).toLowerCase().includes('3e') || String(col).toLowerCase().includes('3 eme')
// // // // //       );

// // // // //       const emailIdx = emailColIdx >= 0 ? emailColIdx : 2;
// // // // //       const idx1 = colIdx1er >= 0 ? colIdx1er : 27; // AB par défaut
// // // // //       const idx2 = colIdx2nd >= 0 ? colIdx2nd : 28; // AC par défaut
// // // // //       const idx3 = colIdx3eme >= 0 ? colIdx3eme : 29; // AD par défaut

// // // // //       const extractedWishes = [];

// // // // //       dataRows.forEach((r) => {
// // // // //         const email = String(r[emailIdx] || '').trim().toLowerCase();
// // // // //         if (!email || !email.includes('@')) return;

// // // // //         const student = etudiantsList.find((e) => e.adresse_email.toLowerCase() === email);

// // // // //         const txt1 = String(r[idx1] || '').trim();
// // // // //         const txt2 = String(r[idx2] || '').trim();
// // // // //         const txt3 = String(r[idx3] || '').trim();

// // // // //         const chef1 = findChefFromWishText(txt1, chefsList);
// // // // //         const chef2 = findChefFromWishText(txt2, chefsList);
// // // // //         const chef3 = findChefFromWishText(txt3, chefsList);

// // // // //         extractedWishes.push({
// // // // //           email,
// // // // //           student,
// // // // //           txt1,
// // // // //           txt2,
// // // // //           txt3,
// // // // //           chef1,
// // // // //           chef2,
// // // // //           chef3,
// // // // //         });
// // // // //       });

// // // // //       setWishesData(extractedWishes);
// // // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // // //       const isMoodleSurvey = firstRow.some((col) =>
// // // // //         String(col).toLowerCase().includes('courriel') ||
// // // // //         String(col).toLowerCase().includes('email') ||
// // // // //         String(col).toLowerCase().includes('nom complet')
// // // // //       );

// // // // //       const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];

// // // // //       if (isMoodleSurvey) {
// // // // //         const emailColIdx = firstRow.findIndex((col) =>
// // // // //           String(col).toLowerCase().includes('courriel') ||
// // // // //           String(col).toLowerCase().includes('email')
// // // // //         );

// // // // //         const startOffset = type === 'aptitudes' ? 5 : (5 + activeComps.length);

// // // // //         formatted = dataRows.map((r) => {
// // // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // // //           const rowData = { adresse_email: email };

// // // // //           activeComps.forEach((comp, idx) => {
// // // // //             const val = r[startOffset + idx] !== undefined ? r[startOffset + idx] : r[idx + 1];
// // // // //             rowData[comp.code] = parseInt(val, 10) || 0;
// // // // //           });

// // // // //           return rowData;
// // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // //       } else {
// // // // //         formatted = dataRows.map((r) => {
// // // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // // //           activeComps.forEach((comp, idx) => {
// // // // //             rowData[comp.code] = parseInt(r[idx + 1], 10) || 0;
// // // // //           });
// // // // //           return rowData;
// // // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // // //       }
// // // // //       setParsedData(formatted);
// // // // //     }
// // // // //   };

// // // // //   const handleImport = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       setError(null);
// // // // //       setSuccessMsg(null);

// // // // //       if (activeType?.isDoc) {
// // // // //         // Upload PDFs
// // // // //         const matchedItems = pdfItems.filter((item) => item.matched && item.student);
// // // // //         if (matchedItems.length === 0) {
// // // // //           throw new Error('Aucun dossier ne correspond à un nom d’étudiant.');
// // // // //         }

// // // // //         const batchPayload = matchedItems.map((item) => ({
// // // // //           file: item.file,
// // // // //           etudiant_id: item.student.id,
// // // // //         }));

// // // // //         setUploadProgress({ current: 0, total: batchPayload.length });

// // // // //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// // // // //           setUploadProgress({ current, total });
// // // // //         });

// // // // //         setSuccessMsg(
// // // // //           `${res.success} fichier(s) (${importType.toUpperCase()}) associés et stockés avec succès dans Supabase Storage !`
// // // // //         );
// // // // //         setPdfItems([]);
// // // // //         setFileName('');
// // // // //       } else if (importType === 'voeux') {
// // // // //         // Import des Vœux 1er, 2e, 3e choix
// // // // //         if (wishesData.length === 0) throw new Error('Aucun vœu extrait du fichier.');

// // // // //         const savePromises = [];
// // // // //         let totalSelectionsCreated = 0;

// // // // //         wishesData.forEach((w) => {
// // // // //           if (!w.student) return;
// // // // //           if (w.chef1) {
// // // // //             savePromises.push(saveSelection(w.student.id, w.chef1.id, 1));
// // // // //             totalSelectionsCreated++;
// // // // //           }
// // // // //           if (w.chef2) {
// // // // //             savePromises.push(saveSelection(w.student.id, w.chef2.id, 2));
// // // // //             totalSelectionsCreated++;
// // // // //           }
// // // // //           if (w.chef3) {
// // // // //             savePromises.push(saveSelection(w.student.id, w.chef3.id, 3));
// // // // //             totalSelectionsCreated++;
// // // // //           }
// // // // //         });

// // // // //         await Promise.all(savePromises);

// // // // //         setSuccessMsg(
// // // // //           `Vœux importés avec succès pour ${wishesData.length} étudiants (${totalSelectionsCreated} sélections créées avec les priorités 1, 2 et 3).`
// // // // //         );
// // // // //         setWishesData([]);
// // // // //         setFileName('');
// // // // //       } else {
// // // // //         // Import CSV/Excel classique
// // // // //         if (parsedData.length === 0) return;

// // // // //         let result;
// // // // //         if (importType === 'chefs') {
// // // // //           result = await importChefsDeProjet(parsedData);
// // // // //         } else if (importType === 'etudiants') {
// // // // //           result = await importEtudiants(parsedData);
// // // // //         } else if (importType === 'aptitudes') {
// // // // //           result = await importAptitudes(parsedData);
// // // // //         } else if (importType === 'apetences') {
// // // // //           result = await importApetences(parsedData);
// // // // //         }

// // // // //         setSuccessMsg(`Import réussi ! ${result?.length || parsedData.length} ligne(s) enregistrée(s) avec succès.`);
// // // // //         setParsedData([]);
// // // // //         setFileName('');
// // // // //       }
// // // // //     } catch (err) {
// // // // //       setError(err.message || "Erreur lors de l'import.");
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   const handleExecutePurge = async () => {
// // // // //     try {
// // // // //       setResetting(true);
// // // // //       setError(null);
// // // // //       setSuccessMsg(null);

// // // // //       const messages = [];

// // // // //       if (purgeOptions.documents || purgeOptions.tout) {
// // // // //         await purgeAllDocuments();
// // // // //         messages.push('Fichiers CV & LM supprimés du Storage.');
// // // // //       }

// // // // //       const payloadRPC = {
// // // // //         rendez_vous: purgeOptions.tout,
// // // // //         evaluations: purgeOptions.tout,
// // // // //         affectations: purgeOptions.tout,
// // // // //         selections: purgeOptions.tout,
// // // // //         disponibilites: purgeOptions.tout,
// // // // //         competences: purgeOptions.competences || purgeOptions.tout,
// // // // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // // // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // // // //         users: purgeOptions.tout,
// // // // //       };

// // // // //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // // // //       if (rpcErr) throw rpcErr;

// // // // //       messages.push('Données réinitialisées.');
// // // // //       setSuccessMsg(`Purge réussie : ${messages.join(' ')}`);
// // // // //       setShowResetModal(false);
// // // // //       setConfirmText('');
// // // // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // // // //     } catch (err) {
// // // // //       setError(err.message || 'Erreur lors de la purge.');
// // // // //     } finally {
// // // // //       setResetting(false);
// // // // //     }
// // // // //   };

// // // // //   const matchedPdfCount = pdfItems.filter((i) => i.matched).length;
// // // // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // // // //   const isButtonDisabled =
// // // // //     resetting ||
// // // // //     (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) ||
// // // // //     (requiresConfirmText && confirmText !== 'CONFIRMER');

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
// // // // //           --accent-emerald: #35d0a0;
// // // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // // //           --accent-coral: #ff6b6b;
// // // // //         }

// // // // //         .import-page-wrapper {
// // // // //           max-width: 100%;
// // // // //           margin: 0 auto;
// // // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // // //           color: var(--text-primary);
// // // // //           background:
// // // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // // //             var(--canvas);
// // // // //           min-height: calc(100vh - 60px);
// // // // //         }
// // // // //         .import-card {
// // // // //           background: var(--panel);
// // // // //           backdrop-filter: blur(16px);
// // // // //           border: 1px solid var(--border-subtle);
// // // // //           border-radius: 14px;
// // // // //         }
// // // // //         .btn-danger-pill {
// // // // //           background: rgba(239, 68, 68, 0.14) !important;
// // // // //           color: #f87171 !important;
// // // // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // // //           border-radius: 8px !important;
// // // // //         }
// // // // //         .btn-danger-pill:hover:not(:disabled) {
// // // // //           background: #dc2626 !important;
// // // // //           color: #ffffff !important;
// // // // //           border-color: #dc2626 !important;
// // // // //         }

// // // // //         .import-step-label {
// // // // //           display: flex;
// // // // //           align-items: center;
// // // // //           gap: 0.4rem;
// // // // //           color: var(--text-muted);
// // // // //           font-weight: 700;
// // // // //           font-size: 0.75rem;
// // // // //           text-transform: uppercase;
// // // // //           letter-spacing: 0.5px;
// // // // //           margin-bottom: 0.5rem;
// // // // //         }
// // // // //         .import-step-num {
// // // // //           width: 20px; height: 20px;
// // // // //           border-radius: 50%;
// // // // //           background: var(--accent-violet-soft);
// // // // //           color: var(--accent-violet);
// // // // //           display: inline-flex; align-items: center; justify-content: center;
// // // // //           font-size: 0.7rem; font-weight: 800;
// // // // //         }
// // // // //         .import-type-options {
// // // // //           display: grid;
// // // // //           grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
// // // // //           gap: 0.5rem;
// // // // //         }
// // // // //         .import-type-option {
// // // // //           display: flex;
// // // // //           align-items: center;
// // // // //           justify-content: space-between;
// // // // //           gap: 0.5rem;
// // // // //           padding: 0.6rem 0.8rem;
// // // // //           border-radius: 10px;
// // // // //           border: 1px solid var(--border-subtle);
// // // // //           background: rgba(255,255,255,0.02);
// // // // //           cursor: pointer;
// // // // //           transition: all 0.15s ease;
// // // // //         }
// // // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // // //         .import-type-option.active {
// // // // //           border-color: var(--accent-cyan);
// // // // //           background: var(--accent-cyan-soft);
// // // // //         }
// // // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// // // // //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// // // // //         .import-dropzone {
// // // // //           position: relative;
// // // // //           border: 1.5px dashed var(--border-strong);
// // // // //           border-radius: 12px;
// // // // //           padding: 1.5rem 1rem;
// // // // //           text-align: center;
// // // // //           background: rgba(255,255,255,0.02);
// // // // //           transition: all 0.15s ease;
// // // // //         }
// // // // //         .import-dropzone:hover {
// // // // //           border-color: var(--accent-cyan);
// // // // //           background: var(--accent-cyan-soft);
// // // // //         }
// // // // //         .import-dropzone input[type="file"] {
// // // // //           position: absolute;
// // // // //           inset: 0;
// // // // //           opacity: 0;
// // // // //           cursor: pointer;
// // // // //         }
// // // // //         .import-dropzone .dz-icon { font-size: 1.8rem; margin-bottom: 0.35rem; }
// // // // //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// // // // //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// // // // //         .import-filename-chip {
// // // // //           display: inline-flex;
// // // // //           align-items: center;
// // // // //           gap: 0.35rem;
// // // // //           margin-top: 0.5rem;
// // // // //           padding: 0.3rem 0.75rem;
// // // // //           border-radius: 20px;
// // // // //           background: var(--panel-raised);
// // // // //           border: 1px solid var(--border-strong);
// // // // //           font-size: 0.78rem;
// // // // //           color: var(--text-primary);
// // // // //           font-weight: 600;
// // // // //         }

// // // // //         .import-submit-btn {
// // // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // // //           border: none;
// // // // //           color: #06231a;
// // // // //           font-weight: 700;
// // // // //           border-radius: 10px;
// // // // //           padding: 0.75rem 1.5rem;
// // // // //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// // // // //         }
// // // // //         .import-submit-btn:disabled {
// // // // //           background: var(--panel-raised);
// // // // //           color: var(--text-muted);
// // // // //           opacity: 1;
// // // // //         }

// // // // //         .import-preview-header {
// // // // //           background: var(--panel-raised);
// // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // //           padding: 0.75rem 1rem;
// // // // //         }
// // // // //         .import-preview-wrapper {
// // // // //           max-height: 55vh;
// // // // //           overflow: auto;
// // // // //         }
// // // // //         .import-preview-table {
// // // // //           font-size: 0.78rem;
// // // // //         }
// // // // //         .import-preview-table thead th {
// // // // //           position: sticky;
// // // // //           top: 0;
// // // // //           background: var(--panel-solid);
// // // // //           color: var(--text-muted);
// // // // //           font-size: 0.7rem;
// // // // //           text-transform: uppercase;
// // // // //           letter-spacing: 0.4px;
// // // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // // //           z-index: 2;
// // // // //         }
// // // // //         .modal-dark .modal-content {
// // // // //           background: #12161f !important;
// // // // //           border: 1px solid var(--border-strong);
// // // // //           border-radius: 16px;
// // // // //           color: var(--text-primary);
// // // // //         }
// // // // //         .modal-dark .modal-header {
// // // // //           border-bottom: 1px solid var(--border-subtle);
// // // // //           background: rgba(239, 68, 68, 0.12);
// // // // //         }
// // // // //         .modal-dark .modal-footer {
// // // // //           border-top: 1px solid var(--border-subtle);
// // // // //         }
// // // // //       `}</style>

// // // // //       <Navbar />

// // // // //       <div className="import-page-wrapper">
// // // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // // //           <div>
// // // // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Import &amp; Gestion des données</h2>
// // // // //             <small className="text-muted">
// // // // //               Importez vos fichiers CSV, questionnaires Moodle (Aptitudes, Appétences, Vœux) ou téléversez directement les dossiers de CVs et LMs.
// // // // //             </small>
// // // // //           </div>

// // // // //           <Button
// // // // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // // // //             size="sm"
// // // // //             onClick={() => setShowResetModal(true)}
// // // // //           >
// // // // //             <span></span>
// // // // //             <span>Zone Danger / Purge &amp; Reset</span>
// // // // //           </Button>
// // // // //         </div>

// // // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // // //         {/* Formulaire d'importation */}
// // // // //         <Card className="import-card mb-4 p-3 border-0">
// // // // //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de données</div>
// // // // //           <div className="import-type-options mb-4">
// // // // //             {importTypesList.map((t) => (
// // // // //               <label
// // // // //                 key={t.value}
// // // // //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // // //               >
// // // // //                 <div>
// // // // //                   <div className="opt-label">{t.icon} {t.label}</div>
// // // // //                   <div className="opt-hint">{t.hint}</div>
// // // // //                 </div>
// // // // //                 <input
// // // // //                   type="radio"
// // // // //                   name="importType"
// // // // //                   value={t.value}
// // // // //                   checked={importType === t.value}
// // // // //                   onChange={(e) => {
// // // // //                     setImportType(e.target.value);
// // // // //                     setParsedData([]);
// // // // //                     setWishesData([]);
// // // // //                     setPdfItems([]);
// // // // //                     setFileName('');
// // // // //                     setUploadProgress(null);
// // // // //                   }}
// // // // //                 />
// // // // //               </label>
// // // // //             ))}
// // // // //           </div>

// // // // //           <Row className="g-3 align-items-center">
// // // // //             <Col md={8}>
// // // // //               <div className="import-step-label">
// // // // //                 <span className="import-step-num">2</span> 
// // // // //                 {activeType?.isDoc ? 'Sélectionnez le dossier ou les fichiers' : 'Sélectionnez le fichier CSV / Excel Moodle'}
// // // // //               </div>
// // // // //               <div className="import-dropzone">
// // // // //                 <input
// // // // //                   type="file"
// // // // //                   multiple
// // // // //                   webkitdirectory={activeType?.isDoc ? "" : undefined}
// // // // //                   directory={activeType?.isDoc ? "" : undefined}
// // // // //                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
// // // // //                   onChange={handleFileUpload}
// // // // //                   aria-label="Sélectionner le dossier ou les fichiers"
// // // // //                 />
// // // // //                 <div className="dz-icon">{activeType?.isDoc ? '📁' : '📄'}</div>
// // // // //                 <div className="dz-text">
// // // // //                   {activeType?.isDoc
// // // // //                     ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)`
// // // // //                     : 'Cliquez ou glissez votre fichier CSV / Excel (ex: Questionnaire MSIMSR.csv)'}
// // // // //                 </div>
// // // // //                 <div className="dz-sub">{activeType?.hint}</div>
// // // // //                 {fileName && (
// // // // //                   <div className="import-filename-chip">📎 {fileName}</div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </Col>

// // // // //             <Col md={4} className="d-flex flex-column justify-content-center">
// // // // //               <div className="import-step-label"><span className="import-step-num">3</span> Lancer l'importation</div>
// // // // //               <Button
// // // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // // //                 onClick={handleImport}
// // // // //                 disabled={
// // // // //                   loading ||
// // // // //                   (activeType?.isDoc
// // // // //                     ? matchedPdfCount === 0
// // // // //                     : importType === 'voeux'
// // // // //                     ? wishesData.length === 0
// // // // //                     : parsedData.length === 0)
// // // // //                 }
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <>
// // // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // // //                     Téléversement en cours...
// // // // //                   </>
// // // // //                 ) : activeType?.isDoc ? (
// // // // //                   `Importer ${matchedPdfCount} fichier(s) (${importType.toUpperCase()})`
// // // // //                 ) : importType === 'voeux' ? (
// // // // //                   `Importer les vœux (${wishesData.length} étudiants)`
// // // // //                 ) : (
// // // // //                   `Importer (${parsedData.length} lignes)`
// // // // //                 )}
// // // // //               </Button>

// // // // //               {uploadProgress && (
// // // // //                 <div className="mt-3">
// // // // //                   <div className="d-flex justify-content-between small text-muted mb-1">
// // // // //                     <span>Progression du stockage Cloud :</span>
// // // // //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// // // // //                   </div>
// // // // //                   <ProgressBar
// // // // //                     animated
// // // // //                     variant="success"
// // // // //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// // // // //                     style={{ height: '8px' }}
// // // // //                   />
// // // // //                 </div>
// // // // //               )}
// // // // //             </Col>
// // // // //           </Row>
// // // // //         </Card>

// // // // //         {/* Prévisualisation des Vœux Moodle (1er, 2e, 3e choix) */}
// // // // //         {importType === 'voeux' && wishesData.length > 0 && (
// // // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // //               <span>
// // // // //                 Vœux réels extraits du questionnaire : <strong>{wishesData.length} étudiants détectés</strong>
// // // // //               </span>
// // // // //               <Badge bg="info">Colonnes 1er, 2nd et 3eme Choix</Badge>
// // // // //             </div>
// // // // //             <div className="import-preview-wrapper">
// // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // //                 <thead>
// // // // //                   <tr>
// // // // //                     <th>#</th>
// // // // //                     <th>Étudiant (Email)</th>
// // // // //                     <th>1er Vœu Détecté</th>
// // // // //                     <th>2e Vœu Détecté</th>
// // // // //                     <th>3e Vœu Détecté</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {wishesData.slice(0, 50).map((w, idx) => (
// // // // //                     <tr key={idx}>
// // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // //                       <td>
// // // // //                         {w.student ? (
// // // // //                           <strong className="text-white">{w.student.nom} {w.student.prenom}</strong>
// // // // //                         ) : (
// // // // //                           <span className="text-danger font-monospace">{w.email} (non inscrit)</span>
// // // // //                         )}
// // // // //                       </td>
// // // // //                       <td>
// // // // //                         {w.chef1 ? (
// // // // //                           <Badge bg="success" className="p-1">P1: {w.chef1.nom}</Badge>
// // // // //                         ) : (
// // // // //                           <span className="text-muted small">{w.txt1 || '—'}</span>
// // // // //                         )}
// // // // //                       </td>
// // // // //                       <td>
// // // // //                         {w.chef2 ? (
// // // // //                           <Badge bg="info" className="p-1 text-dark">P2: {w.chef2.nom}</Badge>
// // // // //                         ) : (
// // // // //                           <span className="text-muted small">{w.txt2 || '—'}</span>
// // // // //                         )}
// // // // //                       </td>
// // // // //                       <td>
// // // // //                         {w.chef3 ? (
// // // // //                           <Badge bg="warning" className="p-1 text-dark">P3: {w.chef3.nom}</Badge>
// // // // //                         ) : (
// // // // //                           <span className="text-muted small">{w.txt3 || '—'}</span>
// // // // //                         )}
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </Table>
// // // // //             </div>
// // // // //           </Card>
// // // // //         )}

// // // // //         {/* Prévisualisation des dossiers de CV ou LM */}
// // // // //         {activeType?.isDoc && pdfItems.length > 0 && (
// // // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // //               <span>
// // // // //                 Correspondance par sous-dossier étudiant : <strong>{pdfItems.length} fichier(s) analysé(s)</strong>
// // // // //               </span>
// // // // //               <div className="d-flex gap-2">
// // // // //                 <Badge bg="success">{matchedPdfCount} associé(s) avec succès</Badge>
// // // // //                 {pdfItems.length - matchedPdfCount > 0 && (
// // // // //                   <Badge bg="danger">{pdfItems.length - matchedPdfCount} dossier(s) non reconnu(s)</Badge>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //             <div className="import-preview-wrapper">
// // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // //                 <thead>
// // // // //                   <tr>
// // // // //                     <th>#</th>
// // // // //                     <th>Dossier / Fichier Détecté</th>
// // // // //                     <th>Étudiant Correspondant dans la Base</th>
// // // // //                     <th>Adresse Email</th>
// // // // //                     <th>Statut</th>
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {pdfItems.map((item, idx) => (
// // // // //                     <tr key={idx}>
// // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // //                       <td className="fw-semibold text-white">{item.fileName}</td>
// // // // //                       <td>
// // // // //                         {item.student ? (
// // // // //                           <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// // // // //                         ) : (
// // // // //                           <span className="text-danger">Étudiant introuvable pour ce dossier</span>
// // // // //                         )}
// // // // //                       </td>
// // // // //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '—'}</td>
// // // // //                       <td>
// // // // //                         {item.matched ? (
// // // // //                           <Badge bg="success">Prêt à uploader</Badge>
// // // // //                         ) : (
// // // // //                           <Badge bg="danger">Nom non reconnu</Badge>
// // // // //                         )}
// // // // //                       </td>
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </Table>
// // // // //             </div>
// // // // //           </Card>
// // // // //         )}

// // // // //         {/* Prévisualisation CSV / Excel avec colonnes dynamiques */}
// // // // //         {!activeType?.isDoc && importType !== 'voeux' && parsedData.length > 0 && (
// // // // //           <Card className="import-card border-0 overflow-hidden">
// // // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // // //               <span>
// // // // //                 Prévisualisation du tableur : <strong>{fileName}</strong>
// // // // //               </span>
// // // // //               <Badge bg="info">{parsedData.length} ligne(s) détectée(s)</Badge>
// // // // //             </div>
// // // // //             <div className="import-preview-wrapper">
// // // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // // //                 <thead>
// // // // //                   <tr>
// // // // //                     <th>#</th>
// // // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // // //                       <th key={key}>{key}</th>
// // // // //                     ))}
// // // // //                   </tr>
// // // // //                 </thead>
// // // // //                 <tbody>
// // // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // // //                     <tr key={idx}>
// // // // //                       <td className="text-muted">{idx + 1}</td>
// // // // //                       {Object.values(row).map((val, cIdx) => (
// // // // //                         <td key={cIdx}>{String(val)}</td>
// // // // //                       ))}
// // // // //                     </tr>
// // // // //                   ))}
// // // // //                 </tbody>
// // // // //               </Table>
// // // // //             </div>
// // // // //             {parsedData.length > 50 && (
// // // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // // //                 Affichage des 50 premières lignes sur {parsedData.length}.
// // // // //               </div>
// // // // //             )}
// // // // //           </Card>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Modale Zone Danger */}
// // // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // // // //         <Modal.Header closeButton closeVariant="white">
// // // // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // // // //             ⚠️ Zone Danger — Purge &amp; Remise à zéro
// // // // //           </Modal.Title>
// // // // //         </Modal.Header>
// // // // //         <Modal.Body>
// // // // //           <p className="text-light small mb-3">
// // // // //             Cochez les éléments que vous souhaitez purger ou supprimer pour redémarrer une nouvelle campagne :
// // // // //           </p>

// // // // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // // // //             <Form.Check
// // // // //               type="checkbox"
// // // // //               id="purge-docs"
// // // // //               label="📄 Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // // // //               checked={purgeOptions.documents}
// // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // // // //               className="mb-2 text-white"
// // // // //             />
// // // // //             <Form.Check
// // // // //               type="checkbox"
// // // // //               id="purge-comp"
// // // // //               label="Vider les Aptitudes & Appétences des étudiants"
// // // // //               checked={purgeOptions.competences}
// // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // // // //               className="mb-2 text-white"
// // // // //             />
// // // // //             <Form.Check
// // // // //               type="checkbox"
// // // // //               id="purge-etud"
// // // // //               label="🎓 Supprimer TOUS les Étudiants (efface aussi leurs vœux, rendez-vous et évaluations)"
// // // // //               checked={purgeOptions.etudiants}
// // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // // // //               className="mb-2 text-warning"
// // // // //             />
// // // // //             <Form.Check
// // // // //               type="checkbox"
// // // // //               id="purge-chefs"
// // // // //               label="Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilités et rendez-vous)"
// // // // //               checked={purgeOptions.chefs}
// // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // // // //               className="mb-2 text-warning"
// // // // //             />
// // // // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // // // //             <Form.Check
// // // // //               type="checkbox"
// // // // //               id="purge-tout"
// // // // //               label="TOUT RÉINITIALISER : Vider absolument toutes les données de campagne pour une nouvelle rentrée"
// // // // //               checked={purgeOptions.tout}
// // // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // // // //               className="text-danger fw-bold"
// // // // //             />
// // // // //           </div>

// // // // //           {requiresConfirmText && (
// // // // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // // // //               <Form.Label className="small text-danger fw-bold mb-1">
// // // // //                 Sécurité : Tapez le mot « CONFIRMER » pour débloquer la suppression :
// // // // //               </Form.Label>
// // // // //               <Form.Control
// // // // //                 size="sm"
// // // // //                 placeholder="Tapez CONFIRMER"
// // // // //                 value={confirmText}
// // // // //                 onChange={(e) => setConfirmText(e.target.value)}
// // // // //                 className="bg-dark text-white border-danger"
// // // // //               />
// // // // //             </div>
// // // // //           )}

// // // // //           <p className="text-muted small mb-0">
// // // // //             ⚠️ Les données supprimées ne pourront pas être récupérées.
// // // // //           </p>
// // // // //         </Modal.Body>
// // // // //         <Modal.Footer>
// // // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // // //             Annuler
// // // // //           </Button>
// // // // //           <Button
// // // // //             variant="danger"
// // // // //             size="sm"
// // // // //             onClick={handleExecutePurge}
// // // // //             disabled={isButtonDisabled}
// // // // //           >
// // // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Exécuter la purge sélectionnée'}
// // // // //           </Button>
// // // // //         </Modal.Footer>
// // // // //       </Modal>
// // // // //     </>
// // // // //   );
// // // // // }

// // // // import React, { useState, useEffect } from 'react';
// // // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // // // import * as XLSX from 'xlsx';
// // // // import Navbar from './Navbar';
// // // // import {
// // // //   importChefsDeProjet,
// // // //   importEtudiants,
// // // //   importAptitudes,
// // // //   importApetences,
// // // //   fetchChefsDeProjet,
// // // //   fetchEtudiants,
// // // //   fetchReferentielCompetences,
// // // //   findEtudiantForDocument,
// // // //   findChefFromWishText,
// // // //   saveSelection,
// // // //   uploadBatchDocuments,
// // // //   purgeAllDocuments,
// // // //   supabase,
// // // // } from '../services/supabase';

// // // // export default function ImportPage() {
// // // //   const [importType, setImportType] = useState('chefs');
// // // //   const [referentielCompetences, setReferentielCompetences] = useState([]);
// // // //   const [etudiantsList, setEtudiantsList] = useState([]);
// // // //   const [chefsList, setChefsList] = useState([]);

// // // //   const [parsedData, setParsedData] = useState([]);
// // // //   const [wishesData, setWishesData] = useState([]);
// // // //   const [pdfItems, setPdfItems] = useState([]);
// // // //   const [fileName, setFileName] = useState('');
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [uploadProgress, setUploadProgress] = useState(null);
// // // //   const [error, setError] = useState(null);
// // // //   const [successMsg, setSuccessMsg] = useState(null);

// // // //   // Modale de purge / zone danger
// // // //   const [showResetModal, setShowResetModal] = useState(false);
// // // //   const [resetting, setResetting] = useState(false);
// // // //   const [confirmText, setConfirmText] = useState('');

// // // //   const [purgeOptions, setPurgeOptions] = useState({
// // // //     documents: false,
// // // //     competences: false,
// // // //     etudiants: false,
// // // //     chefs: false,
// // // //     tout: false,
// // // //   });

// // // //   const loadBaseData = async () => {
// // // //     try {
// // // //       const [refComps, etuds, chefs] = await Promise.all([
// // // //         fetchReferentielCompetences(true),
// // // //         fetchEtudiants(),
// // // //         fetchChefsDeProjet(),
// // // //       ]);
// // // //       setReferentielCompetences(refComps || []);
// // // //       setEtudiantsList(etuds || []);
// // // //       setChefsList(chefs || []);
// // // //     } catch (err) {
// // // //       console.warn('Erreur chargement donnees de base:', err);
// // // //     }
// // // //   };

// // // //   useEffect(() => {
// // // //     loadBaseData();
// // // //   }, []);

// // // //   const importTypesList = [
// // // //     { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, specialite, email)', isDoc: false },
// // // //     { value: 'etudiants', label: 'Etudiants', hint: 'Fichier CSV / Excel (nom, prenom, email, parcours)', isDoc: false },
// // // //     { value: 'voeux', label: 'Voeux reels des etudiants (1er au 10eme choix Moodle)', hint: 'Fichier Moodle avec colonnes 1er a 10eme Choix', isDoc: false },
// // // //     { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV de competences', isDoc: false },
// // // //     { value: 'apetences', label: `Appetences / Interets (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV d appetences', isDoc: false },
// // // //     { value: 'cv', label: 'CV des etudiants (Dossier Tout_CV)', hint: 'Selectionnez le dossier Tout_CV ou plusieurs fichiers PDF', isDoc: true },
// // // //     { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Selectionnez le dossier Tout_LM ou plusieurs fichiers PDF', isDoc: true },
// // // //   ];

// // // //   const activeType = importTypesList.find((t) => t.value === importType);

// // // //   const extractNameFromEmail = (email) => {
// // // //     try {
// // // //       const namePart = email.split('@')[0];
// // // //       const parts = namePart.split('.');
// // // //       if (parts.length >= 2) {
// // // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // // //         return { nom, prenom };
// // // //       }
// // // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // // //     } catch {
// // // //       return { nom: email, prenom: '' };
// // // //     }
// // // //   };

// // // //   const handleSpreadsheetUpload = (file) => {
// // // //     const reader = new FileReader();
// // // //     reader.onload = (evt) => {
// // // //       try {
// // // //         const data = evt.target.result;
// // // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // // //         const sheetName = workbook.SheetNames[0];
// // // //         const sheet = workbook.Sheets[sheetName];
// // // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // // //         if (rawJson.length === 0) throw new Error('Le fichier est vide.');
// // // //         processSpreadsheetData(rawJson, importType);
// // // //       } catch (err) {
// // // //         setError(`Erreur de lecture : ${err.message}`);
// // // //       }
// // // //     };
// // // //     reader.readAsBinaryString(file);
// // // //   };

// // // //   const handlePdfFilesUpload = async (filesList) => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);

// // // //       let currentEtudiants = etudiantsList;
// // // //       if (!currentEtudiants || currentEtudiants.length === 0) {
// // // //         currentEtudiants = await fetchEtudiants();
// // // //         setEtudiantsList(currentEtudiants || []);
// // // //       }

// // // //       if (!currentEtudiants || currentEtudiants.length === 0) {
// // // //         throw new Error("Aucun etudiant trouve en base. Veuillez d'abord importer la liste des etudiants.");
// // // //       }

// // // //       const items = Array.from(filesList).map((file) => {
// // // //         const fullPath = file.webkitRelativePath || file.name;
// // // //         const matchedStudent = findEtudiantForDocument(fullPath, currentEtudiants);

// // // //         let folderLabel = file.name;
// // // //         if (file.webkitRelativePath) {
// // // //           const parts = file.webkitRelativePath.split('/');
// // // //           if (parts.length >= 2) folderLabel = `Dossier ${parts[parts.length - 2]} / ${file.name}`;
// // // //         }

// // // //         return {
// // // //           file,
// // // //           fileName: folderLabel,
// // // //           student: matchedStudent,
// // // //           matched: Boolean(matchedStudent),
// // // //         };
// // // //       });

// // // //       setPdfItems(items);
// // // //       setFileName(`${filesList.length} document(s) detecte(s) dans le dossier`);
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la lecture des dossiers.');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleFileUpload = (e) => {
// // // //     const files = e.target.files;
// // // //     if (!files || files.length === 0) return;

// // // //     setError(null);
// // // //     setSuccessMsg(null);
// // // //     setUploadProgress(null);

// // // //     if (activeType?.isDoc) {
// // // //       handlePdfFilesUpload(files);
// // // //     } else {
// // // //       setFileName(files[0].name);
// // // //       setParsedData([]);
// // // //       setWishesData([]);
// // // //       handleSpreadsheetUpload(files[0]);
// // // //     }
// // // //   };

// // // //   // Traitement dynamique des donnees du tableur
// // // //   const processSpreadsheetData = (rows, type) => {
// // // //     if (rows.length < 2) throw new Error('Le fichier ne contient pas assez de lignes.');

// // // //     const firstRow = rows[0];
// // // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // // //     let formatted = [];

// // // //     if (type === 'chefs') {
// // // //       formatted = dataRows.map((r) => ({
// // // //         nom: String(r[0] || '').trim(),
// // // //         specialite: String(r[1] || '').trim(),
// // // //         email: String(r[2] || '').trim().toLowerCase(),
// // // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // // //       })).filter((r) => r.email && r.nom);
// // // //       setParsedData(formatted);
// // // //     } else if (type === 'etudiants') {
// // // //       formatted = dataRows.map((r) => {
// // // //         const emailOrFirst = String(r[0] || '').trim();
// // // //         const secondCol = String(r[1] || '').trim();
// // // //         const thirdCol = String(r[2] || '').trim();
// // // //         const fourthCol = String(r[3] || '').trim();

// // // //         if (emailOrFirst.includes('@')) {
// // // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // // //           return {
// // // //             nom,
// // // //             prenom,
// // // //             adresse_email: emailOrFirst.toLowerCase(),
// // // //             parcours: secondCol || 'I2026',
// // // //           };
// // // //         }

// // // //         return {
// // // //           nom: emailOrFirst,
// // // //           prenom: secondCol,
// // // //           adresse_email: thirdCol.toLowerCase(),
// // // //           parcours: fourthCol || 'I2026',
// // // //         };
// // // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // //       setParsedData(formatted);
// // // //     } else if (type === 'voeux') {
// // // //       // Detection automatique de la colonne email
// // // //       const emailColIdx = firstRow.findIndex((col) => {
// // // //         const s = String(col).toLowerCase();
// // // //         return s.includes('courriel') || s.includes('email');
// // // //       });
// // // //       const emailIdx = emailColIdx >= 0 ? emailColIdx : 2;

// // // //       // Detection des 10 colonnes de choix dans Moodle (1er au 10eme choix)
// // // //       const findChoiceColIndex = (rank) => {
// // // //         return firstRow.findIndex((col) => {
// // // //           const s = String(col).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// // // //           if (!s.includes('choix')) return false;
// // // //           if (rank === 1) return s.includes('1er') || s.includes('1 er') || s.includes('1e');
// // // //           if (rank === 2) return s.includes('2nd') || s.includes('2eme') || s.includes('2e');
// // // //           return s.includes(`${rank}eme`) || s.includes(`${rank}e`) || s.includes(`${rank} eme`);
// // // //         });
// // // //       };

// // // //       const choiceColsMap = [];
// // // //       for (let rank = 1; rank <= 10; rank++) {
// // // //         const colIdx = findChoiceColIndex(rank);
// // // //         if (colIdx >= 0) {
// // // //           choiceColsMap.push({ rank, colIdx });
// // // //         }
// // // //       }

// // // //       const extractedWishes = [];

// // // //       dataRows.forEach((r) => {
// // // //         const email = String(r[emailIdx] || '').trim().toLowerCase();
// // // //         if (!email || !email.includes('@')) return;

// // // //         const student = etudiantsList.find((e) => e.adresse_email.toLowerCase() === email);

// // // //         const choices = [];
// // // //         choiceColsMap.forEach(({ rank, colIdx }) => {
// // // //           const txt = String(r[colIdx] || '').trim();
// // // //           if (txt) {
// // // //             const chef = findChefFromWishText(txt, chefsList);
// // // //             choices.push({
// // // //               rank,
// // // //               txt,
// // // //               chef,
// // // //             });
// // // //           }
// // // //         });

// // // //         extractedWishes.push({
// // // //           email,
// // // //           student,
// // // //           choices,
// // // //         });
// // // //       });

// // // //       setWishesData(extractedWishes);
// // // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // // //       const isMoodleSurvey = firstRow.some((col) =>
// // // //         String(col).toLowerCase().includes('courriel') ||
// // // //         String(col).toLowerCase().includes('email') ||
// // // //         String(col).toLowerCase().includes('nom complet')
// // // //       );

// // // //       const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];

// // // //       if (isMoodleSurvey) {
// // // //         const emailColIdx = firstRow.findIndex((col) =>
// // // //           String(col).toLowerCase().includes('courriel') ||
// // // //           String(col).toLowerCase().includes('email')
// // // //         );

// // // //         const startOffset = type === 'aptitudes' ? 5 : (5 + activeComps.length);

// // // //         formatted = dataRows.map((r) => {
// // // //           const email = String(r[emailColIdx >= 0 ? emailColIdx : 2] || '').trim().toLowerCase();
// // // //           const rowData = { adresse_email: email };

// // // //           activeComps.forEach((comp, idx) => {
// // // //             const val = r[startOffset + idx] !== undefined ? r[startOffset + idx] : r[idx + 1];
// // // //             rowData[comp.code] = parseInt(val, 10) || 0;
// // // //           });

// // // //           return rowData;
// // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // //       } else {
// // // //         formatted = dataRows.map((r) => {
// // // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // // //           activeComps.forEach((comp, idx) => {
// // // //             rowData[comp.code] = parseInt(r[idx + 1], 10) || 0;
// // // //           });
// // // //           return rowData;
// // // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // // //       }
// // // //       setParsedData(formatted);
// // // //     }
// // // //   };

// // // //   const handleImport = async () => {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError(null);
// // // //       setSuccessMsg(null);

// // // //       if (activeType?.isDoc) {
// // // //         const matchedItems = pdfItems.filter((item) => item.matched && item.student);
// // // //         if (matchedItems.length === 0) {
// // // //           throw new Error('Aucun dossier ne correspond a un nom d etudiant.');
// // // //         }

// // // //         const batchPayload = matchedItems.map((item) => ({
// // // //           file: item.file,
// // // //           etudiant_id: item.student.id,
// // // //         }));

// // // //         setUploadProgress({ current: 0, total: batchPayload.length });

// // // //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// // // //           setUploadProgress({ current, total });
// // // //         });

// // // //         setSuccessMsg(
// // // //           `${res.success} fichier(s) (${importType.toUpperCase()}) associes et stockes avec succes dans Supabase Storage !`
// // // //         );
// // // //         setPdfItems([]);
// // // //         setFileName('');
// // // //       } else if (importType === 'voeux') {
// // // //         if (wishesData.length === 0) throw new Error('Aucun voeu extrait du fichier.');

// // // //         const savePromises = [];
// // // //         let totalSelectionsCreated = 0;

// // // //         wishesData.forEach((w) => {
// // // //           if (!w.student) return;
// // // //           w.choices.forEach(({ rank, chef }) => {
// // // //             if (chef) {
// // // //               savePromises.push(saveSelection(w.student.id, chef.id, rank));
// // // //               totalSelectionsCreated++;
// // // //             }
// // // //           });
// // // //         });

// // // //         await Promise.all(savePromises);

// // // //         setSuccessMsg(
// // // //           `Voeux importes avec succes pour ${wishesData.length} etudiants (${totalSelectionsCreated} selections enregistrees du 1er au 10eme choix).`
// // // //         );
// // // //         setWishesData([]);
// // // //         setFileName('');
// // // //       } else {
// // // //         if (parsedData.length === 0) return;

// // // //         let result;
// // // //         if (importType === 'chefs') {
// // // //           result = await importChefsDeProjet(parsedData);
// // // //         } else if (importType === 'etudiants') {
// // // //           result = await importEtudiants(parsedData);
// // // //         } else if (importType === 'aptitudes') {
// // // //           result = await importAptitudes(parsedData);
// // // //         } else if (importType === 'apetences') {
// // // //           result = await importApetences(parsedData);
// // // //         }

// // // //         setSuccessMsg(`Import reussi ! ${result?.length || parsedData.length} ligne(s) enregistree(s) avec succes.`);
// // // //         setParsedData([]);
// // // //         setFileName('');
// // // //       }
// // // //     } catch (err) {
// // // //       setError(err.message || "Erreur lors de l'import.");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const handleExecutePurge = async () => {
// // // //     try {
// // // //       setResetting(true);
// // // //       setError(null);
// // // //       setSuccessMsg(null);

// // // //       const messages = [];

// // // //       if (purgeOptions.documents || purgeOptions.tout) {
// // // //         await purgeAllDocuments();
// // // //         messages.push('Fichiers CV et LM supprimes du Storage.');
// // // //       }

// // // //       const payloadRPC = {
// // // //         rendez_vous: purgeOptions.tout,
// // // //         evaluations: purgeOptions.tout,
// // // //         affectations: purgeOptions.tout,
// // // //         selections: purgeOptions.tout,
// // // //         disponibilites: purgeOptions.tout,
// // // //         competences: purgeOptions.competences || purgeOptions.tout,
// // // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // // //         users: purgeOptions.tout,
// // // //       };

// // // //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // // //       if (rpcErr) throw rpcErr;

// // // //       messages.push('Donnees reinitialisees.');
// // // //       setSuccessMsg(`Purge reussie : ${messages.join(' ')}`);
// // // //       setShowResetModal(false);
// // // //       setConfirmText('');
// // // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // // //     } catch (err) {
// // // //       setError(err.message || 'Erreur lors de la purge.');
// // // //     } finally {
// // // //       setResetting(false);
// // // //     }
// // // //   };

// // // //   const matchedPdfCount = pdfItems.filter((i) => i.matched).length;
// // // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // // //   const isButtonDisabled =
// // // //     resetting ||
// // // //     (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) ||
// // // //     (requiresConfirmText && confirmText !== 'CONFIRMER');

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
// // // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // // //           --accent-cyan: #29d3d3;
// // // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // // //           --accent-emerald: #35d0a0;
// // // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // // //           --accent-coral: #ff6b6b;
// // // //         }

// // // //         .import-page-wrapper {
// // // //           max-width: 100%;
// // // //           margin: 0 auto;
// // // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // // //           color: var(--text-primary);
// // // //           background:
// // // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // // //             var(--canvas);
// // // //           min-height: calc(100vh - 60px);
// // // //         }
// // // //         .import-card {
// // // //           background: var(--panel);
// // // //           backdrop-filter: blur(16px);
// // // //           border: 1px solid var(--border-subtle);
// // // //           border-radius: 14px;
// // // //         }
// // // //         .btn-danger-pill {
// // // //           background: rgba(239, 68, 68, 0.14) !important;
// // // //           color: #f87171 !important;
// // // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // // //           border-radius: 8px !important;
// // // //         }
// // // //         .btn-danger-pill:hover:not(:disabled) {
// // // //           background: #dc2626 !important;
// // // //           color: #ffffff !important;
// // // //           border-color: #dc2626 !important;
// // // //         }

// // // //         .import-step-label {
// // // //           display: flex;
// // // //           align-items: center;
// // // //           gap: 0.4rem;
// // // //           color: var(--text-muted);
// // // //           font-weight: 700;
// // // //           font-size: 0.75rem;
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.5px;
// // // //           margin-bottom: 0.5rem;
// // // //         }
// // // //         .import-step-num {
// // // //           width: 20px; height: 20px;
// // // //           border-radius: 50%;
// // // //           background: var(--accent-violet-soft);
// // // //           color: var(--accent-violet);
// // // //           display: inline-flex; align-items: center; justify-content: center;
// // // //           font-size: 0.7rem; font-weight: 800;
// // // //         }
// // // //         .import-type-options {
// // // //           display: grid;
// // // //           grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
// // // //           gap: 0.5rem;
// // // //         }
// // // //         .import-type-option {
// // // //           display: flex;
// // // //           align-items: center;
// // // //           justify-content: space-between;
// // // //           gap: 0.5rem;
// // // //           padding: 0.6rem 0.8rem;
// // // //           border-radius: 10px;
// // // //           border: 1px solid var(--border-subtle);
// // // //           background: rgba(255,255,255,0.02);
// // // //           cursor: pointer;
// // // //           transition: all 0.15s ease;
// // // //         }
// // // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // // //         .import-type-option.active {
// // // //           border-color: var(--accent-cyan);
// // // //           background: var(--accent-cyan-soft);
// // // //         }
// // // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// // // //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// // // //         .import-dropzone {
// // // //           position: relative;
// // // //           border: 1.5px dashed var(--border-strong);
// // // //           border-radius: 12px;
// // // //           padding: 1.5rem 1rem;
// // // //           text-align: center;
// // // //           background: rgba(255,255,255,0.02);
// // // //           transition: all 0.15s ease;
// // // //         }
// // // //         .import-dropzone:hover {
// // // //           border-color: var(--accent-cyan);
// // // //           background: var(--accent-cyan-soft);
// // // //         }
// // // //         .import-dropzone input[type="file"] {
// // // //           position: absolute;
// // // //           inset: 0;
// // // //           opacity: 0;
// // // //           cursor: pointer;
// // // //         }
// // // //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// // // //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// // // //         .import-filename-chip {
// // // //           display: inline-flex;
// // // //           align-items: center;
// // // //           gap: 0.35rem;
// // // //           margin-top: 0.5rem;
// // // //           padding: 0.3rem 0.75rem;
// // // //           border-radius: 20px;
// // // //           background: var(--panel-raised);
// // // //           border: 1px solid var(--border-strong);
// // // //           font-size: 0.78rem;
// // // //           color: var(--text-primary);
// // // //           font-weight: 600;
// // // //         }

// // // //         .import-submit-btn {
// // // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // // //           border: none;
// // // //           color: #06231a;
// // // //           font-weight: 700;
// // // //           border-radius: 10px;
// // // //           padding: 0.75rem 1.5rem;
// // // //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// // // //         }
// // // //         .import-submit-btn:disabled {
// // // //           background: var(--panel-raised);
// // // //           color: var(--text-muted);
// // // //           opacity: 1;
// // // //         }

// // // //         .import-preview-header {
// // // //           background: var(--panel-raised);
// // // //           border-bottom: 1px solid var(--border-subtle);
// // // //           padding: 0.75rem 1rem;
// // // //         }
// // // //         .import-preview-wrapper {
// // // //           max-height: 55vh;
// // // //           overflow: auto;
// // // //         }
// // // //         .import-preview-table {
// // // //           font-size: 0.76rem;
// // // //         }
// // // //         .import-preview-table thead th {
// // // //           position: sticky;
// // // //           top: 0;
// // // //           background: var(--panel-solid);
// // // //           color: var(--text-muted);
// // // //           font-size: 0.68rem;
// // // //           text-transform: uppercase;
// // // //           letter-spacing: 0.4px;
// // // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // // //           z-index: 2;
// // // //           text-align: center;
// // // //         }
// // // //         .import-preview-table tbody td {
// // // //           vertical-align: middle;
// // // //         }
// // // //         .modal-dark .modal-content {
// // // //           background: #12161f !important;
// // // //           border: 1px solid var(--border-strong);
// // // //           border-radius: 16px;
// // // //           color: var(--text-primary);
// // // //         }
// // // //         .modal-dark .modal-header {
// // // //           border-bottom: 1px solid var(--border-subtle);
// // // //           background: rgba(239, 68, 68, 0.12);
// // // //         }
// // // //         .modal-dark .modal-footer {
// // // //           border-top: 1px solid var(--border-subtle);
// // // //         }
// // // //       `}</style>

// // // //       <Navbar />

// // // //       <div className="import-page-wrapper">
// // // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // // //           <div>
// // // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Import et Gestion des donnees</h2>
// // // //             <small className="text-muted">
// // // //               Importez vos fichiers CSV, questionnaires Moodle (Aptitudes, Appetences, Voeux du 1er au 10eme choix) ou televersez les dossiers CV et LM.
// // // //             </small>
// // // //           </div>

// // // //           <Button
// // // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // // //             size="sm"
// // // //             onClick={() => setShowResetModal(true)}
// // // //           >
// // // //             <span>Zone Danger / Purge et Reset</span>
// // // //           </Button>
// // // //         </div>

// // // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // // //         {/* Formulaire d'importation */}
// // // //         <Card className="import-card mb-4 p-3 border-0">
// // // //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de donnees</div>
// // // //           <div className="import-type-options mb-4">
// // // //             {importTypesList.map((t) => (
// // // //               <label
// // // //                 key={t.value}
// // // //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // // //               >
// // // //                 <div>
// // // //                   <div className="opt-label">{t.label}</div>
// // // //                   <div className="opt-hint">{t.hint}</div>
// // // //                 </div>
// // // //                 <input
// // // //                   type="radio"
// // // //                   name="importType"
// // // //                   value={t.value}
// // // //                   checked={importType === t.value}
// // // //                   onChange={(e) => {
// // // //                     setImportType(e.target.value);
// // // //                     setParsedData([]);
// // // //                     setWishesData([]);
// // // //                     setPdfItems([]);
// // // //                     setFileName('');
// // // //                     setUploadProgress(null);
// // // //                   }}
// // // //                 />
// // // //               </label>
// // // //             ))}
// // // //           </div>

// // // //           <Row className="g-3 align-items-center">
// // // //             <Col md={8}>
// // // //               <div className="import-step-label">
// // // //                 <span className="import-step-num">2</span> 
// // // //                 {activeType?.isDoc ? 'Selectionnez le dossier ou les fichiers' : 'Selectionnez le fichier CSV / Excel Moodle'}
// // // //               </div>
// // // //               <div className="import-dropzone">
// // // //                 <input
// // // //                   type="file"
// // // //                   multiple
// // // //                   webkitdirectory={activeType?.isDoc ? "" : undefined}
// // // //                   directory={activeType?.isDoc ? "" : undefined}
// // // //                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
// // // //                   onChange={handleFileUpload}
// // // //                   aria-label="Selectionner le dossier ou les fichiers"
// // // //                 />
// // // //                 <div className="dz-text">
// // // //                   {activeType?.isDoc
// // // //                     ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)`
// // // //                     : 'Cliquez ou glissez votre fichier CSV / Excel Moodle'}
// // // //                 </div>
// // // //                 <div className="dz-sub">{activeType?.hint}</div>
// // // //                 {fileName && (
// // // //                   <div className="import-filename-chip">Fichier : {fileName}</div>
// // // //                 )}
// // // //               </div>
// // // //             </Col>

// // // //             <Col md={4} className="d-flex flex-column justify-content-center">
// // // //               <div className="import-step-label"><span className="import-step-num">3</span> Lancer l importation</div>
// // // //               <Button
// // // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // // //                 onClick={handleImport}
// // // //                 disabled={
// // // //                   loading ||
// // // //                   (activeType?.isDoc
// // // //                     ? matchedPdfCount === 0
// // // //                     : importType === 'voeux'
// // // //                     ? wishesData.length === 0
// // // //                     : parsedData.length === 0)
// // // //                 }
// // // //               >
// // // //                 {loading ? (
// // // //                   <>
// // // //                     <Spinner size="sm" animation="border" className="me-2" />
// // // //                     Televersement en cours...
// // // //                   </>
// // // //                 ) : activeType?.isDoc ? (
// // // //                   `Importer ${matchedPdfCount} fichier(s) (${importType.toUpperCase()})`
// // // //                 ) : importType === 'voeux' ? (
// // // //                   `Importer les voeux (${wishesData.length} etudiants)`
// // // //                 ) : (
// // // //                   `Importer (${parsedData.length} lignes)`
// // // //                 )}
// // // //               </Button>

// // // //               {uploadProgress && (
// // // //                 <div className="mt-3">
// // // //                   <div className="d-flex justify-content-between small text-muted mb-1">
// // // //                     <span>Progression du stockage Cloud :</span>
// // // //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// // // //                   </div>
// // // //                   <ProgressBar
// // // //                     animated
// // // //                     variant="success"
// // // //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// // // //                     style={{ height: '8px' }}
// // // //                   />
// // // //                 </div>
// // // //               )}
// // // //             </Col>
// // // //           </Row>
// // // //         </Card>

// // // //         {/* Previsualisation des Voeux Moodle (1er au 10eme choix) */}
// // // //         {importType === 'voeux' && wishesData.length > 0 && (
// // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // //               <span>
// // // //                 Voeux reels extraits du questionnaire : <strong>{wishesData.length} etudiants detectes</strong>
// // // //               </span>
// // // //               <Badge bg="info">Choix 1 a 10 detectes</Badge>
// // // //             </div>
// // // //             <div className="import-preview-wrapper">
// // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th style={{ textAlign: 'left' }}>#</th>
// // // //                     <th style={{ textAlign: 'left' }}>Etudiant</th>
// // // //                     {Array.from({ length: 10 }, (_, i) => (
// // // //                       <th key={i + 1}>P{i + 1}</th>
// // // //                     ))}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {wishesData.slice(0, 50).map((w, idx) => (
// // // //                     <tr key={idx}>
// // // //                       <td className="text-muted">{idx + 1}</td>
// // // //                       <td>
// // // //                         {w.student ? (
// // // //                           <strong className="text-white">{w.student.nom} {w.student.prenom}</strong>
// // // //                         ) : (
// // // //                           <span className="text-danger font-monospace">{w.email} (non inscrit)</span>
// // // //                         )}
// // // //                       </td>
// // // //                       {Array.from({ length: 10 }, (_, i) => {
// // // //                         const rank = i + 1;
// // // //                         const choice = w.choices.find((c) => c.rank === rank);
// // // //                         if (!choice) return <td key={rank} className="text-center text-muted">-</td>;
// // // //                         return (
// // // //                           <td key={rank} className="text-center">
// // // //                             {choice.chef ? (
// // // //                               <Badge
// // // //                                 bg={rank === 1 ? 'success' : rank === 2 ? 'info' : rank === 3 ? 'warning' : 'secondary'}
// // // //                                 text={rank === 2 || rank === 3 ? 'dark' : 'white'}
// // // //                                 style={{ fontSize: '0.7rem' }}
// // // //                               >
// // // //                                 {choice.chef.nom}
// // // //                               </Badge>
// // // //                             ) : (
// // // //                               <span className="text-muted small" style={{ fontSize: '0.65rem' }}>
// // // //                                 Non reconnu
// // // //                               </span>
// // // //                             )}
// // // //                           </td>
// // // //                         );
// // // //                       })}
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </Table>
// // // //             </div>
// // // //             {wishesData.length > 50 && (
// // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // //                 Affichage des 50 premiers etudiants sur {wishesData.length}.
// // // //               </div>
// // // //             )}
// // // //           </Card>
// // // //         )}

// // // //         {/* Previsualisation des dossiers de CV ou LM */}
// // // //         {activeType?.isDoc && pdfItems.length > 0 && (
// // // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // //               <span>
// // // //                 Correspondance par sous-dossier etudiant : <strong>{pdfItems.length} fichier(s) analyse(s)</strong>
// // // //               </span>
// // // //               <div className="d-flex gap-2">
// // // //                 <Badge bg="success">{matchedPdfCount} associe(s) avec succes</Badge>
// // // //                 {pdfItems.length - matchedPdfCount > 0 && (
// // // //                   <Badge bg="danger">{pdfItems.length - matchedPdfCount} dossier(s) non reconnu(s)</Badge>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //             <div className="import-preview-wrapper">
// // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th>#</th>
// // // //                     <th>Dossier / Fichier Detecte</th>
// // // //                     <th>Etudiant Correspondant dans la Base</th>
// // // //                     <th>Adresse Email</th>
// // // //                     <th>Statut</th>
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {pdfItems.map((item, idx) => (
// // // //                     <tr key={idx}>
// // // //                       <td className="text-muted">{idx + 1}</td>
// // // //                       <td className="fw-semibold text-white">{item.fileName}</td>
// // // //                       <td>
// // // //                         {item.student ? (
// // // //                           <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// // // //                         ) : (
// // // //                           <span className="text-danger">Etudiant introuvable pour ce dossier</span>
// // // //                         )}
// // // //                       </td>
// // // //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '-'}</td>
// // // //                       <td>
// // // //                         {item.matched ? (
// // // //                           <Badge bg="success">Pret a uploader</Badge>
// // // //                         ) : (
// // // //                           <Badge bg="danger">Nom non reconnu</Badge>
// // // //                         )}
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </Table>
// // // //             </div>
// // // //           </Card>
// // // //         )}

// // // //         {/* Previsualisation CSV / Excel classique */}
// // // //         {!activeType?.isDoc && importType !== 'voeux' && parsedData.length > 0 && (
// // // //           <Card className="import-card border-0 overflow-hidden">
// // // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // // //               <span>
// // // //                 Previsualisation du tableur : <strong>{fileName}</strong>
// // // //               </span>
// // // //               <Badge bg="info">{parsedData.length} ligne(s) detectee(s)</Badge>
// // // //             </div>
// // // //             <div className="import-preview-wrapper">
// // // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th>#</th>
// // // //                     {Object.keys(parsedData[0]).map((key) => (
// // // //                       <th key={key}>{key}</th>
// // // //                     ))}
// // // //                   </tr>
// // // //                 </thead>
// // // //                 <tbody>
// // // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // // //                     <tr key={idx}>
// // // //                       <td className="text-muted">{idx + 1}</td>
// // // //                       {Object.values(row).map((val, cIdx) => (
// // // //                         <td key={cIdx}>{String(val)}</td>
// // // //                       ))}
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </Table>
// // // //             </div>
// // // //             {parsedData.length > 50 && (
// // // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // // //                 Affichage des 50 premieres lignes sur {parsedData.length}.
// // // //               </div>
// // // //             )}
// // // //           </Card>
// // // //         )}
// // // //       </div>

// // // //       {/* Modale Zone Danger */}
// // // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // // //         <Modal.Header closeButton closeVariant="white">
// // // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // // //             Zone Danger - Purge et Remise a zero
// // // //           </Modal.Title>
// // // //         </Modal.Header>
// // // //         <Modal.Body>
// // // //           <p className="text-light small mb-3">
// // // //             Cochez les elements que vous souhaitez purger ou supprimer pour redemarrer une nouvelle campagne :
// // // //           </p>

// // // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // // //             <Form.Check
// // // //               type="checkbox"
// // // //               id="purge-docs"
// // // //               label="Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // // //               checked={purgeOptions.documents}
// // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // // //               className="mb-2 text-white"
// // // //             />
// // // //             <Form.Check
// // // //               type="checkbox"
// // // //               id="purge-comp"
// // // //               label="Vider les Aptitudes et Appetences des etudiants"
// // // //               checked={purgeOptions.competences}
// // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // // //               className="mb-2 text-white"
// // // //             />
// // // //             <Form.Check
// // // //               type="checkbox"
// // // //               id="purge-etud"
// // // //               label="Supprimer TOUS les Etudiants (efface aussi leurs voeux, rendez-vous et evaluations)"
// // // //               checked={purgeOptions.etudiants}
// // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // // //               className="mb-2 text-warning"
// // // //             />
// // // //             <Form.Check
// // // //               type="checkbox"
// // // //               id="purge-chefs"
// // // //               label="Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilites et rendez-vous)"
// // // //               checked={purgeOptions.chefs}
// // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // // //               className="mb-2 text-warning"
// // // //             />
// // // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // // //             <Form.Check
// // // //               type="checkbox"
// // // //               id="purge-tout"
// // // //               label="TOUT REINITIALISER : Vider absolument toutes les donnees de campagne pour une nouvelle rentree"
// // // //               checked={purgeOptions.tout}
// // // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // // //               className="text-danger fw-bold"
// // // //             />
// // // //           </div>

// // // //           {requiresConfirmText && (
// // // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // // //               <Form.Label className="small text-danger fw-bold mb-1">
// // // //                 Securite : Tapez le mot « CONFIRMER » pour debloquer la suppression :
// // // //               </Form.Label>
// // // //               <Form.Control
// // // //                 size="sm"
// // // //                 placeholder="Tapez CONFIRMER"
// // // //                 value={confirmText}
// // // //                 onChange={(e) => setConfirmText(e.target.value)}
// // // //                 className="bg-dark text-white border-danger"
// // // //               />
// // // //             </div>
// // // //           )}

// // // //           <p className="text-muted small mb-0">
// // // //             Attention : Les donnees supprimees ne pourront pas etre recuperees.
// // // //           </p>
// // // //         </Modal.Body>
// // // //         <Modal.Footer>
// // // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // // //             Annuler
// // // //           </Button>
// // // //           <Button
// // // //             variant="danger"
// // // //             size="sm"
// // // //             onClick={handleExecutePurge}
// // // //             disabled={isButtonDisabled}
// // // //           >
// // // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Executer la purge selectionnee'}
// // // //           </Button>
// // // //         </Modal.Footer>
// // // //       </Modal>
// // // //     </>
// // // //   );
// // // // }


// // // import React, { useState, useEffect } from 'react';
// // // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // // import * as XLSX from 'xlsx';
// // // import Navbar from './Navbar';
// // // import {
// // //   importChefsDeProjet,
// // //   importEtudiants,
// // //   importAptitudes,
// // //   importApetences,
// // //   fetchChefsDeProjet,
// // //   fetchEtudiants,
// // //   fetchReferentielCompetences,
// // //   findEtudiantForDocument,
// // //   findChefFromWishText,
// // //   saveSelection,
// // //   saveEtudiantVoeu,
// // //   resetAllEtudiantVoeux,
// // //   uploadBatchDocuments,
// // //   purgeAllDocuments,
// // //   supabase,
// // // } from '../services/supabase';

// // // export default function ImportPage() {
// // //   const [importType, setImportType] = useState('chefs');
// // //   const [referentielCompetences, setReferentielCompetences] = useState([]);
// // //   const [etudiantsList, setEtudiantsList] = useState([]);
// // //   const [chefsList, setChefsList] = useState([]);

// // //   const [parsedData, setParsedData] = useState([]);
// // //   const [wishesData, setWishesData] = useState([]);
// // //   const [pdfItems, setPdfItems] = useState([]);
// // //   const [fileName, setFileName] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const [uploadProgress, setUploadProgress] = useState(null);
// // //   const [error, setError] = useState(null);
// // //   const [successMsg, setSuccessMsg] = useState(null);

// // //   // Modale de purge / zone danger
// // //   const [showResetModal, setShowResetModal] = useState(false);
// // //   const [resetting, setResetting] = useState(false);
// // //   const [confirmText, setConfirmText] = useState('');

// // //   const [purgeOptions, setPurgeOptions] = useState({
// // //     documents: false,
// // //     competences: false,
// // //     etudiants: false,
// // //     chefs: false,
// // //     tout: false,
// // //   });

// // //   const loadBaseData = async () => {
// // //     try {
// // //       const [refComps, etuds, chefs] = await Promise.all([
// // //         fetchReferentielCompetences(true),
// // //         fetchEtudiants(),
// // //         fetchChefsDeProjet(),
// // //       ]);
// // //       setReferentielCompetences(refComps || []);
// // //       setEtudiantsList(etuds || []);
// // //       setChefsList(chefs || []);
// // //     } catch (err) {
// // //       console.warn('Erreur chargement donnees de base:', err);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     loadBaseData();
// // //   }, []);

// // //   const importTypesList = [
// // //     { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, specialite, email)', isDoc: false },
// // //     { value: 'etudiants', label: 'Etudiants', hint: 'Fichier CSV / Excel (nom, prenom, email, parcours)', isDoc: false },
// // //     { value: 'voeux', label: 'Voeux reels des etudiants (1er au 10eme choix Moodle)', hint: 'Fichier Moodle avec colonnes 1er a 10eme Choix', isDoc: false },
// // //     { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV de competences', isDoc: false },
// // //     { value: 'apetences', label: `Appetences / Interets (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV d appetences', isDoc: false },
// // //     { value: 'cv', label: 'CV des etudiants (Dossier Tout_CV)', hint: 'Selectionnez le dossier Tout_CV ou plusieurs fichiers PDF', isDoc: true },
// // //     { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Selectionnez le dossier Tout_LM ou plusieurs fichiers PDF', isDoc: true },
// // //   ];

// // //   const activeType = importTypesList.find((t) => t.value === importType);

// // //   const extractNameFromEmail = (email) => {
// // //     try {
// // //       const namePart = email.split('@')[0];
// // //       const parts = namePart.split('.');
// // //       if (parts.length >= 2) {
// // //         const prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
// // //         const nom = parts.slice(1).join(' ').toUpperCase();
// // //         return { nom, prenom };
// // //       }
// // //       return { nom: namePart.toUpperCase(), prenom: '' };
// // //     } catch {
// // //       return { nom: email, prenom: '' };
// // //     }
// // //   };

// // //   const handleSpreadsheetUpload = (file) => {
// // //     const reader = new FileReader();
// // //     reader.onload = (evt) => {
// // //       try {
// // //         const data = evt.target.result;
// // //         const workbook = XLSX.read(data, { type: 'binary', raw: false });
// // //         const sheetName = workbook.SheetNames[0];
// // //         const sheet = workbook.Sheets[sheetName];
// // //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// // //         if (rawJson.length === 0) throw new Error('Le fichier est vide.');
// // //         processSpreadsheetData(rawJson, importType);
// // //       } catch (err) {
// // //         setError(`Erreur de lecture : ${err.message}`);
// // //       }
// // //     };
// // //     reader.readAsBinaryString(file);
// // //   };

// // //   const handlePdfFilesUpload = async (filesList) => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);

// // //       let currentEtudiants = etudiantsList;
// // //       if (!currentEtudiants || currentEtudiants.length === 0) {
// // //         currentEtudiants = await fetchEtudiants();
// // //         setEtudiantsList(currentEtudiants || []);
// // //       }

// // //       if (!currentEtudiants || currentEtudiants.length === 0) {
// // //         throw new Error("Aucun etudiant trouve en base. Veuillez d'abord importer la liste des etudiants.");
// // //       }

// // //       const items = Array.from(filesList).map((file) => {
// // //         const fullPath = file.webkitRelativePath || file.name;
// // //         const matchedStudent = findEtudiantForDocument(fullPath, currentEtudiants);

// // //         let folderLabel = file.name;
// // //         if (file.webkitRelativePath) {
// // //           const parts = file.webkitRelativePath.split('/');
// // //           if (parts.length >= 2) folderLabel = `Dossier ${parts[parts.length - 2]} / ${file.name}`;
// // //         }

// // //         return {
// // //           file,
// // //           fileName: folderLabel,
// // //           student: matchedStudent,
// // //           matched: Boolean(matchedStudent),
// // //         };
// // //       });

// // //       setPdfItems(items);
// // //       setFileName(`${filesList.length} document(s) detecte(s) dans le dossier`);
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la lecture des dossiers.');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleFileUpload = (e) => {
// // //     const files = e.target.files;
// // //     if (!files || files.length === 0) return;

// // //     setError(null);
// // //     setSuccessMsg(null);
// // //     setUploadProgress(null);

// // //     if (activeType?.isDoc) {
// // //       handlePdfFilesUpload(files);
// // //     } else {
// // //       setFileName(files[0].name);
// // //       setParsedData([]);
// // //       setWishesData([]);
// // //       handleSpreadsheetUpload(files[0]);
// // //     }
// // //   };

// // //   const processSpreadsheetData = (rows, type) => {
// // //     if (rows.length < 2) throw new Error('Le fichier ne contient pas assez de lignes.');

// // //     const firstRow = rows[0];
// // //     const dataRows = rows.slice(1).filter((r) => r.some((cell) => String(cell).trim() !== ''));

// // //     let formatted = [];

// // //     if (type === 'chefs') {
// // //       formatted = dataRows.map((r) => ({
// // //         nom: String(r[0] || '').trim(),
// // //         specialite: String(r[1] || '').trim(),
// // //         email: String(r[2] || '').trim().toLowerCase(),
// // //         max_creneaux_entretien: parseInt(r[3], 10) || 15,
// // //       })).filter((r) => r.email && r.nom);
// // //       setParsedData(formatted);
// // //     } else if (type === 'etudiants') {
// // //       formatted = dataRows.map((r) => {
// // //         const emailOrFirst = String(r[0] || '').trim();
// // //         const secondCol = String(r[1] || '').trim();
// // //         const thirdCol = String(r[2] || '').trim();
// // //         const fourthCol = String(r[3] || '').trim();

// // //         if (emailOrFirst.includes('@')) {
// // //           const { nom, prenom } = extractNameFromEmail(emailOrFirst);
// // //           return {
// // //             nom,
// // //             prenom,
// // //             adresse_email: emailOrFirst.toLowerCase(),
// // //             parcours: secondCol || 'I2026',
// // //           };
// // //         }

// // //         return {
// // //           nom: emailOrFirst,
// // //           prenom: secondCol,
// // //           adresse_email: thirdCol.toLowerCase(),
// // //           parcours: fourthCol || 'I2026',
// // //         };
// // //       }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // //       setParsedData(formatted);
// // //     } else if (type === 'voeux') {
// // //       const emailColIdx = firstRow.findIndex((col) => {
// // //         const s = String(col).toLowerCase();
// // //         return s.includes('courriel') || s.includes('email');
// // //       });
// // //       const emailIdx = emailColIdx >= 0 ? emailColIdx : 2;

// // //       const findChoiceColIndex = (rank) => {
// // //         return firstRow.findIndex((col) => {
// // //           const s = String(col).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// // //           if (!s.includes('choix')) return false;
// // //           if (rank === 1) return s.includes('1er') || s.includes('1 er') || s.includes('1e');
// // //           if (rank === 2) return s.includes('2nd') || s.includes('2eme') || s.includes('2e');
// // //           return s.includes(`${rank}eme`) || s.includes(`${rank}e`) || s.includes(`${rank} eme`);
// // //         });
// // //       };

// // //       const choiceColsMap = [];
// // //       for (let rank = 1; rank <= 10; rank++) {
// // //         const colIdx = findChoiceColIndex(rank);
// // //         if (colIdx >= 0) {
// // //           choiceColsMap.push({ rank, colIdx });
// // //         }
// // //       }

// // //       const extractedWishes = [];

// // //       dataRows.forEach((r) => {
// // //         const email = String(r[emailIdx] || '').trim().toLowerCase();
// // //         if (!email || !email.includes('@')) return;

// // //         const student = etudiantsList.find((e) => e.adresse_email.toLowerCase() === email);

// // //         const choices = [];
// // //         choiceColsMap.forEach(({ rank, colIdx }) => {
// // //           const txt = String(r[colIdx] || '').trim();
// // //           if (txt) {
// // //             const chef = findChefFromWishText(txt, chefsList);
// // //             choices.push({
// // //               rank,
// // //               txt,
// // //               chef,
// // //             });
// // //           }
// // //         });

// // //         extractedWishes.push({
// // //           email,
// // //           student,
// // //           choices,
// // //         });
// // //       });

// // //       setWishesData(extractedWishes);
// // //     } else if (type === 'aptitudes' || type === 'apetences') {
// // //       const isMoodleSurvey = firstRow.some((col) =>
// // //         String(col).toLowerCase().includes('courriel') ||
// // //         String(col).toLowerCase().includes('email') ||
// // //         String(col).toLowerCase().includes('nom complet')
// // //       );

// // //       const activeComps = referentielCompetences.length > 0 ? referentielCompetences : [];

// // //       if (isMoodleSurvey) {
// // //         const emailColIdx = firstRow.findIndex((col) =>
// // //           String(col).toLowerCase().includes('courriel') ||
// // //           String(col).toLowerCase().includes('email')
// // //         );

// // //         const startOffset = type === 'aptitudes' ? 5 : (5 + activeComps.length);

// // //         formatted = dataRows.map((r) => {
// // //           const email = String(r[emailIdx >= 0 ? emailIdx : 2] || '').trim().toLowerCase();
// // //           const rowData = { adresse_email: email };

// // //           activeComps.forEach((comp, idx) => {
// // //             const val = r[startOffset + idx] !== undefined ? r[startOffset + idx] : r[idx + 1];
// // //             rowData[comp.code] = parseInt(val, 10) || 0;
// // //           });

// // //           return rowData;
// // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // //       } else {
// // //         formatted = dataRows.map((r) => {
// // //           const rowData = { adresse_email: String(r[0] || '').trim().toLowerCase() };
// // //           activeComps.forEach((comp, idx) => {
// // //             rowData[comp.code] = parseInt(r[idx + 1], 10) || 0;
// // //           });
// // //           return rowData;
// // //         }).filter((r) => r.adresse_email && r.adresse_email.includes('@'));
// // //       }
// // //       setParsedData(formatted);
// // //     }
// // //   };

// // //   const handleImport = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setError(null);
// // //       setSuccessMsg(null);

// // //       if (activeType?.isDoc) {
// // //         const matchedItems = pdfItems.filter((item) => item.matched && item.student);
// // //         if (matchedItems.length === 0) {
// // //           throw new Error('Aucun dossier ne correspond a un nom d etudiant.');
// // //         }

// // //         const batchPayload = matchedItems.map((item) => ({
// // //           file: item.file,
// // //           etudiant_id: item.student.id,
// // //         }));

// // //         setUploadProgress({ current: 0, total: batchPayload.length });

// // //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// // //           setUploadProgress({ current, total });
// // //         });

// // //         setSuccessMsg(
// // //           `${res.success} fichier(s) (${importType.toUpperCase()}) associes et stockes avec succes dans Supabase Storage !`
// // //         );
// // //         setPdfItems([]);
// // //         setFileName('');
// // //       } else if (importType === 'voeux') {
// // //         if (wishesData.length === 0) throw new Error('Aucun voeu extrait du fichier.');

// // //         const savePromises = [];
// // //         let totalSelectionsCreated = 0;
// // //         let totalVoeuxSaved = 0;

// // //         wishesData.forEach((w) => {
// // //           if (!w.student) return;
// // //           w.choices.forEach(({ rank, chef }) => {
// // //             if (chef) {
// // //               // 1. Sauvegarde des 10 voeux complets dans la table etudiant_voeux (pour la page Evaluations)
// // //               savePromises.push(saveEtudiantVoeu(w.student.id, chef.id, rank));
// // //               totalVoeuxSaved++;

// // //               // 2. Sauvegarde STRICTEMENT des 3 premiers choix dans la table selections (pour les Entretiens)
// // //               if (rank <= 3) {
// // //                 savePromises.push(saveSelection(w.student.id, chef.id, rank));
// // //                 totalSelectionsCreated++;
// // //               }
// // //             }
// // //           });
// // //         });

// // //         await Promise.all(savePromises);

// // //         setSuccessMsg(
// // //           `Voeux importes avec succes pour ${wishesData.length} etudiants : ${totalSelectionsCreated} selections d entretien (Top 3) et ${totalVoeuxSaved} voeux complets enregistres (du 1er au 10eme choix).`
// // //         );
// // //         setWishesData([]);
// // //         setFileName('');
// // //       } else {
// // //         if (parsedData.length === 0) return;

// // //         let result;
// // //         if (importType === 'chefs') {
// // //           result = await importChefsDeProjet(parsedData);
// // //         } else if (importType === 'etudiants') {
// // //           result = await importEtudiants(parsedData);
// // //         } else if (importType === 'aptitudes') {
// // //           result = await importAptitudes(parsedData);
// // //         } else if (importType === 'apetences') {
// // //           result = await importApetences(parsedData);
// // //         }

// // //         setSuccessMsg(`Import reussi ! ${result?.length || parsedData.length} ligne(s) enregistree(s) avec succes.`);
// // //         setParsedData([]);
// // //         setFileName('');
// // //       }
// // //     } catch (err) {
// // //       setError(err.message || "Erreur lors de l'import.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleExecutePurge = async () => {
// // //     try {
// // //       setResetting(true);
// // //       setError(null);
// // //       setSuccessMsg(null);

// // //       const messages = [];

// // //       if (purgeOptions.documents || purgeOptions.tout) {
// // //         await purgeAllDocuments();
// // //         messages.push('Fichiers CV et LM supprimes du Storage.');
// // //       }

// // //       if (purgeOptions.competences || purgeOptions.tout) {
// // //         await resetAllEtudiantVoeux();
// // //         messages.push('Voeux complets etudiants supprimes.');
// // //       }

// // //       const payloadRPC = {
// // //         rendez_vous: purgeOptions.tout,
// // //         evaluations: purgeOptions.tout,
// // //         affectations: purgeOptions.tout,
// // //         selections: purgeOptions.tout,
// // //         disponibilites: purgeOptions.tout,
// // //         competences: purgeOptions.competences || purgeOptions.tout,
// // //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// // //         chefs: purgeOptions.chefs || purgeOptions.tout,
// // //         users: purgeOptions.tout,
// // //       };

// // //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// // //       if (rpcErr) throw rpcErr;

// // //       messages.push('Donnees reinitialisees.');
// // //       setSuccessMsg(`Purge reussie : ${messages.join(' ')}`);
// // //       setShowResetModal(false);
// // //       setConfirmText('');
// // //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// // //     } catch (err) {
// // //       setError(err.message || 'Erreur lors de la purge.');
// // //     } finally {
// // //       setResetting(false);
// // //     }
// // //   };

// // //   const matchedPdfCount = pdfItems.filter((i) => i.matched).length;
// // //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// // //   const isButtonDisabled =
// // //     resetting ||
// // //     (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) ||
// // //     (requiresConfirmText && confirmText !== 'CONFIRMER');

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
// // //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// // //           --accent-cyan: #29d3d3;
// // //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// // //           --accent-emerald: #35d0a0;
// // //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// // //           --accent-coral: #ff6b6b;
// // //         }

// // //         .import-page-wrapper {
// // //           max-width: 100%;
// // //           margin: 0 auto;
// // //           padding: 1.25rem 1rem 2.5rem 1rem;
// // //           color: var(--text-primary);
// // //           background:
// // //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// // //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// // //             var(--canvas);
// // //           min-height: calc(100vh - 60px);
// // //         }
// // //         .import-card {
// // //           background: var(--panel);
// // //           backdrop-filter: blur(16px);
// // //           border: 1px solid var(--border-subtle);
// // //           border-radius: 14px;
// // //         }
// // //         .btn-danger-pill {
// // //           background: rgba(239, 68, 68, 0.14) !important;
// // //           color: #f87171 !important;
// // //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// // //           border-radius: 8px !important;
// // //         }
// // //         .btn-danger-pill:hover:not(:disabled) {
// // //           background: #dc2626 !important;
// // //           color: #ffffff !important;
// // //           border-color: #dc2626 !important;
// // //         }

// // //         .import-step-label {
// // //           display: flex;
// // //           align-items: center;
// // //           gap: 0.4rem;
// // //           color: var(--text-muted);
// // //           font-weight: 700;
// // //           font-size: 0.75rem;
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.5px;
// // //           margin-bottom: 0.5rem;
// // //         }
// // //         .import-step-num {
// // //           width: 20px; height: 20px;
// // //           border-radius: 50%;
// // //           background: var(--accent-violet-soft);
// // //           color: var(--accent-violet);
// // //           display: inline-flex; align-items: center; justify-content: center;
// // //           font-size: 0.7rem; font-weight: 800;
// // //         }
// // //         .import-type-options {
// // //           display: grid;
// // //           grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
// // //           gap: 0.5rem;
// // //         }
// // //         .import-type-option {
// // //           display: flex;
// // //           align-items: center;
// // //           justify-content: space-between;
// // //           gap: 0.5rem;
// // //           padding: 0.6rem 0.8rem;
// // //           border-radius: 10px;
// // //           border: 1px solid var(--border-subtle);
// // //           background: rgba(255,255,255,0.02);
// // //           cursor: pointer;
// // //           transition: all 0.15s ease;
// // //         }
// // //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// // //         .import-type-option.active {
// // //           border-color: var(--accent-cyan);
// // //           background: var(--accent-cyan-soft);
// // //         }
// // //         .import-type-option input { accent-color: var(--accent-cyan); }
// // //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// // //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// // //         .import-dropzone {
// // //           position: relative;
// // //           border: 1.5px dashed var(--border-strong);
// // //           border-radius: 12px;
// // //           padding: 1.5rem 1rem;
// // //           text-align: center;
// // //           background: rgba(255,255,255,0.02);
// // //           transition: all 0.15s ease;
// // //         }
// // //         .import-dropzone:hover {
// // //           border-color: var(--accent-cyan);
// // //           background: var(--accent-cyan-soft);
// // //         }
// // //         .import-dropzone input[type="file"] {
// // //           position: absolute;
// // //           inset: 0;
// // //           opacity: 0;
// // //           cursor: pointer;
// // //         }
// // //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// // //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// // //         .import-filename-chip {
// // //           display: inline-flex;
// // //           align-items: center;
// // //           gap: 0.35rem;
// // //           margin-top: 0.5rem;
// // //           padding: 0.3rem 0.75rem;
// // //           border-radius: 20px;
// // //           background: var(--panel-raised);
// // //           border: 1px solid var(--border-strong);
// // //           font-size: 0.78rem;
// // //           color: var(--text-primary);
// // //           font-weight: 600;
// // //         }

// // //         .import-submit-btn {
// // //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// // //           border: none;
// // //           color: #06231a;
// // //           font-weight: 700;
// // //           border-radius: 10px;
// // //           padding: 0.75rem 1.5rem;
// // //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// // //         }
// // //         .import-submit-btn:disabled {
// // //           background: var(--panel-raised);
// // //           color: var(--text-muted);
// // //           opacity: 1;
// // //         }

// // //         .import-preview-header {
// // //           background: var(--panel-raised);
// // //           border-bottom: 1px solid var(--border-subtle);
// // //           padding: 0.75rem 1rem;
// // //         }
// // //         .import-preview-wrapper {
// // //           max-height: 55vh;
// // //           overflow: auto;
// // //         }
// // //         .import-preview-table {
// // //           font-size: 0.76rem;
// // //         }
// // //         .import-preview-table thead th {
// // //           position: sticky;
// // //           top: 0;
// // //           background: var(--panel-solid);
// // //           color: var(--text-muted);
// // //           font-size: 0.68rem;
// // //           text-transform: uppercase;
// // //           letter-spacing: 0.4px;
// // //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// // //           z-index: 2;
// // //           text-align: center;
// // //         }
// // //         .import-preview-table tbody td {
// // //           vertical-align: middle;
// // //         }
// // //         .modal-dark .modal-content {
// // //           background: #12161f !important;
// // //           border: 1px solid var(--border-strong);
// // //           border-radius: 16px;
// // //           color: var(--text-primary);
// // //         }
// // //         .modal-dark .modal-header {
// // //           border-bottom: 1px solid var(--border-subtle);
// // //           background: rgba(239, 68, 68, 0.12);
// // //         }
// // //         .modal-dark .modal-footer {
// // //           border-top: 1px solid var(--border-subtle);
// // //         }
// // //       `}</style>

// // //       <Navbar />

// // //       <div className="import-page-wrapper">
// // //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// // //           <div>
// // //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Import et Gestion des donnees</h2>
// // //             <small className="text-muted">
// // //               Importez vos fichiers CSV, questionnaires Moodle (Aptitudes, Appetences, Voeux du 1er au 10eme choix) ou televersez les dossiers CV et LM.
// // //             </small>
// // //           </div>

// // //           <Button
// // //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// // //             size="sm"
// // //             onClick={() => setShowResetModal(true)}
// // //           >
// // //             <span>Zone Danger / Purge et Reset</span>
// // //           </Button>
// // //         </div>

// // //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// // //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// // //         {/* Formulaire d'importation */}
// // //         <Card className="import-card mb-4 p-3 border-0">
// // //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de donnees</div>
// // //           <div className="import-type-options mb-4">
// // //             {importTypesList.map((t) => (
// // //               <label
// // //                 key={t.value}
// // //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// // //               >
// // //                 <div>
// // //                   <div className="opt-label">{t.label}</div>
// // //                   <div className="opt-hint">{t.hint}</div>
// // //                 </div>
// // //                 <input
// // //                   type="radio"
// // //                   name="importType"
// // //                   value={t.value}
// // //                   checked={importType === t.value}
// // //                   onChange={(e) => {
// // //                     setImportType(e.target.value);
// // //                     setParsedData([]);
// // //                     setWishesData([]);
// // //                     setPdfItems([]);
// // //                     setFileName('');
// // //                     setUploadProgress(null);
// // //                   }}
// // //                 />
// // //               </label>
// // //             ))}
// // //           </div>

// // //           <Row className="g-3 align-items-center">
// // //             <Col md={8}>
// // //               <div className="import-step-label">
// // //                 <span className="import-step-num">2</span> 
// // //                 {activeType?.isDoc ? 'Selectionnez le dossier ou les fichiers' : 'Selectionnez le fichier CSV / Excel Moodle'}
// // //               </div>
// // //               <div className="import-dropzone">
// // //                 <input
// // //                   type="file"
// // //                   multiple
// // //                   webkitdirectory={activeType?.isDoc ? "" : undefined}
// // //                   directory={activeType?.isDoc ? "" : undefined}
// // //                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
// // //                   onChange={handleFileUpload}
// // //                   aria-label="Selectionner le dossier ou les fichiers"
// // //                 />
// // //                 <div className="dz-text">
// // //                   {activeType?.isDoc
// // //                     ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)`
// // //                     : 'Cliquez ou glissez votre fichier CSV / Excel Moodle'}
// // //                 </div>
// // //                 <div className="dz-sub">{activeType?.hint}</div>
// // //                 {fileName && (
// // //                   <div className="import-filename-chip">Fichier : {fileName}</div>
// // //                 )}
// // //               </div>
// // //             </Col>

// // //             <Col md={4} className="d-flex flex-column justify-content-center">
// // //               <div className="import-step-label"><span className="import-step-num">3</span> Lancer l importation</div>
// // //               <Button
// // //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// // //                 onClick={handleImport}
// // //                 disabled={
// // //                   loading ||
// // //                   (activeType?.isDoc
// // //                     ? matchedPdfCount === 0
// // //                     : importType === 'voeux'
// // //                     ? wishesData.length === 0
// // //                     : parsedData.length === 0)
// // //                 }
// // //               >
// // //                 {loading ? (
// // //                   <>
// // //                     <Spinner size="sm" animation="border" className="me-2" />
// // //                     Televersement en cours...
// // //                   </>
// // //                 ) : activeType?.isDoc ? (
// // //                   `Importer ${matchedPdfCount} fichier(s) (${importType.toUpperCase()})`
// // //                 ) : importType === 'voeux' ? (
// // //                   `Importer les voeux (${wishesData.length} etudiants)`
// // //                 ) : (
// // //                   `Importer (${parsedData.length} lignes)`
// // //                 )}
// // //               </Button>

// // //               {uploadProgress && (
// // //                 <div className="mt-3">
// // //                   <div className="d-flex justify-content-between small text-muted mb-1">
// // //                     <span>Progression du stockage Cloud :</span>
// // //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// // //                   </div>
// // //                   <ProgressBar
// // //                     animated
// // //                     variant="success"
// // //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// // //                     style={{ height: '8px' }}
// // //                   />
// // //                 </div>
// // //               )}
// // //             </Col>
// // //           </Row>
// // //         </Card>

// // //         {/* Previsualisation des Voeux Moodle (1er au 10eme choix) */}
// // //         {importType === 'voeux' && wishesData.length > 0 && (
// // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // //               <span>
// // //                 Voeux reels extraits du questionnaire : <strong>{wishesData.length} etudiants detectes</strong>
// // //               </span>
// // //               <Badge bg="info">Choix 1 a 10 detectes</Badge>
// // //             </div>
// // //             <div className="import-preview-wrapper">
// // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // //                 <thead>
// // //                   <tr>
// // //                     <th style={{ textAlign: 'left' }}>#</th>
// // //                     <th style={{ textAlign: 'left' }}>Etudiant</th>
// // //                     {Array.from({ length: 10 }, (_, i) => (
// // //                       <th key={i + 1}>P{i + 1}</th>
// // //                     ))}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {wishesData.slice(0, 50).map((w, idx) => (
// // //                     <tr key={idx}>
// // //                       <td className="text-muted">{idx + 1}</td>
// // //                       <td>
// // //                         {w.student ? (
// // //                           <strong className="text-white">{w.student.nom} {w.student.prenom}</strong>
// // //                         ) : (
// // //                           <span className="text-danger font-monospace">{w.email} (non inscrit)</span>
// // //                         )}
// // //                       </td>
// // //                       {Array.from({ length: 10 }, (_, i) => {
// // //                         const rank = i + 1;
// // //                         const choice = w.choices.find((c) => c.rank === rank);
// // //                         if (!choice) return <td key={rank} className="text-center text-muted">-</td>;
// // //                         return (
// // //                           <td key={rank} className="text-center">
// // //                             {choice.chef ? (
// // //                               <Badge
// // //                                 bg={rank === 1 ? 'success' : rank === 2 ? 'info' : rank === 3 ? 'warning' : 'secondary'}
// // //                                 text={rank === 2 || rank === 3 ? 'dark' : 'white'}
// // //                                 style={{ fontSize: '0.7rem' }}
// // //                               >
// // //                                 {choice.chef.nom}
// // //                               </Badge>
// // //                             ) : (
// // //                               <span className="text-muted small" style={{ fontSize: '0.65rem' }}>
// // //                                 Non reconnu
// // //                               </span>
// // //                             )}
// // //                           </td>
// // //                         );
// // //                       })}
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </Table>
// // //             </div>
// // //             {wishesData.length > 50 && (
// // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // //                 Affichage des 50 premiers etudiants sur {wishesData.length}.
// // //               </div>
// // //             )}
// // //           </Card>
// // //         )}

// // //         {/* Previsualisation des dossiers de CV ou LM */}
// // //         {activeType?.isDoc && pdfItems.length > 0 && (
// // //           <Card className="import-card border-0 overflow-hidden mb-4">
// // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // //               <span>
// // //                 Correspondance par sous-dossier etudiant : <strong>{pdfItems.length} fichier(s) analyse(s)</strong>
// // //               </span>
// // //               <div className="d-flex gap-2">
// // //                 <Badge bg="success">{matchedPdfCount} associe(s) avec succes</Badge>
// // //                 {pdfItems.length - matchedPdfCount > 0 && (
// // //                   <Badge bg="danger">{pdfItems.length - matchedPdfCount} dossier(s) non reconnu(s)</Badge>
// // //                 )}
// // //               </div>
// // //             </div>
// // //             <div className="import-preview-wrapper">
// // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // //                 <thead>
// // //                   <tr>
// // //                     <th>#</th>
// // //                     <th>Dossier / Fichier Detecte</th>
// // //                     <th>Etudiant Correspondant dans la Base</th>
// // //                     <th>Adresse Email</th>
// // //                     <th>Statut</th>
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {pdfItems.map((item, idx) => (
// // //                     <tr key={idx}>
// // //                       <td className="text-muted">{idx + 1}</td>
// // //                       <td className="fw-semibold text-white">{item.fileName}</td>
// // //                       <td>
// // //                         {item.student ? (
// // //                           <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// // //                         ) : (
// // //                           <span className="text-danger">Etudiant introuvable pour ce dossier</span>
// // //                         )}
// // //                       </td>
// // //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '-'}</td>
// // //                       <td>
// // //                         {item.matched ? (
// // //                           <Badge bg="success">Pret a uploader</Badge>
// // //                         ) : (
// // //                           <Badge bg="danger">Nom non reconnu</Badge>
// // //                         )}
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </Table>
// // //             </div>
// // //           </Card>
// // //         )}

// // //         {/* Previsualisation CSV / Excel classique */}
// // //         {!activeType?.isDoc && importType !== 'voeux' && parsedData.length > 0 && (
// // //           <Card className="import-card border-0 overflow-hidden">
// // //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// // //               <span>
// // //                 Previsualisation du tableur : <strong>{fileName}</strong>
// // //               </span>
// // //               <Badge bg="info">{parsedData.length} ligne(s) detectee(s)</Badge>
// // //             </div>
// // //             <div className="import-preview-wrapper">
// // //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// // //                 <thead>
// // //                   <tr>
// // //                     <th>#</th>
// // //                     {Object.keys(parsedData[0]).map((key) => (
// // //                       <th key={key}>{key}</th>
// // //                     ))}
// // //                   </tr>
// // //                 </thead>
// // //                 <tbody>
// // //                   {parsedData.slice(0, 50).map((row, idx) => (
// // //                     <tr key={idx}>
// // //                       <td className="text-muted">{idx + 1}</td>
// // //                       {Object.values(row).map((val, cIdx) => (
// // //                         <td key={cIdx}>{String(val)}</td>
// // //                       ))}
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </Table>
// // //             </div>
// // //             {parsedData.length > 50 && (
// // //               <div className="text-muted small text-center py-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
// // //                 Affichage des 50 premieres lignes sur {parsedData.length}.
// // //               </div>
// // //             )}
// // //           </Card>
// // //         )}
// // //       </div>

// // //       {/* Modale Zone Danger */}
// // //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// // //         <Modal.Header closeButton closeVariant="white">
// // //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// // //             Zone Danger - Purge et Remise a zero
// // //           </Modal.Title>
// // //         </Modal.Header>
// // //         <Modal.Body>
// // //           <p className="text-light small mb-3">
// // //             Cochez les elements que vous souhaitez purger ou supprimer pour redemarrer une nouvelle campagne :
// // //           </p>

// // //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// // //             <Form.Check
// // //               type="checkbox"
// // //               id="purge-docs"
// // //               label="Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// // //               checked={purgeOptions.documents}
// // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// // //               className="mb-2 text-white"
// // //             />
// // //             <Form.Check
// // //               type="checkbox"
// // //               id="purge-comp"
// // //               label="Vider les Aptitudes et Appetences des etudiants"
// // //               checked={purgeOptions.competences}
// // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// // //               className="mb-2 text-white"
// // //             />
// // //             <Form.Check
// // //               type="checkbox"
// // //               id="purge-etud"
// // //               label="Supprimer TOUS les Etudiants (efface aussi leurs voeux, rendez-vous et evaluations)"
// // //               checked={purgeOptions.etudiants}
// // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// // //               className="mb-2 text-warning"
// // //             />
// // //             <Form.Check
// // //               type="checkbox"
// // //               id="purge-chefs"
// // //               label="Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilites et rendez-vous)"
// // //               checked={purgeOptions.chefs}
// // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// // //               className="mb-2 text-warning"
// // //             />
// // //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// // //             <Form.Check
// // //               type="checkbox"
// // //               id="purge-tout"
// // //               label="TOUT REINITIALISER : Vider absolument toutes les donnees de campagne pour une nouvelle rentree"
// // //               checked={purgeOptions.tout}
// // //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// // //               className="text-danger fw-bold"
// // //             />
// // //           </div>

// // //           {requiresConfirmText && (
// // //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// // //               <Form.Label className="small text-danger fw-bold mb-1">
// // //                 Securite : Tapez le mot « CONFIRMER » pour debloquer la suppression :
// // //               </Form.Label>
// // //               <Form.Control
// // //                 size="sm"
// // //                 placeholder="Tapez CONFIRMER"
// // //                 value={confirmText}
// // //                 onChange={(e) => setConfirmText(e.target.value)}
// // //                 className="bg-dark text-white border-danger"
// // //               />
// // //             </div>
// // //           )}

// // //           <p className="text-muted small mb-0">
// // //             Attention : Les donnees supprimees ne pourront pas etre recuperees.
// // //           </p>
// // //         </Modal.Body>
// // //         <Modal.Footer>
// // //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// // //             Annuler
// // //           </Button>
// // //           <Button
// // //             variant="danger"
// // //             size="sm"
// // //             onClick={handleExecutePurge}
// // //             disabled={isButtonDisabled}
// // //           >
// // //             {resetting ? <Spinner size="sm" animation="border" /> : 'Executer la purge selectionnee'}
// // //           </Button>
// // //         </Modal.Footer>
// // //       </Modal>
// // //     </>
// // //   );
// // // }

// // import React, { useState, useEffect } from 'react';
// // import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// // import * as XLSX from 'xlsx';
// // import Navbar from './Navbar';
// // import {
// //   importChefsDeProjet,
// //   importEtudiants,
// //   importAptitudes,
// //   importApetences,
// //   fetchChefsDeProjet,
// //   fetchEtudiants,
// //   fetchReferentielCompetences,
// //   importVoeuxTransaction,
// //   resetAllEtudiantVoeux,
// //   uploadBatchDocuments,
// //   purgeAllDocuments,
// //   supabase,
// // } from '../services/supabase';
// // import {
// //   findBestSheetName,
// //   validateChefsData,
// //   validateEtudiantsData,
// //   validateVoeuxData,
// //   validateCompetencesScores,
// //   validateDocumentsList,
// // } from '../services/dataValidator';

// // export default function ImportPage() {
// //   const [importType, setImportType] = useState('chefs');
// //   const [referentielCompetences, setReferentielCompetences] = useState([]);
// //   const [etudiantsList, setEtudiantsList] = useState([]);
// //   const [chefsList, setChefsList] = useState([]);

// //   // Rapport d audit du fichier depose
// //   const [validationReport, setValidationReport] = useState(null);
// //   const [confirmWarnings, setConfirmWarnings] = useState(false);

// //   const [fileName, setFileName] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [uploadProgress, setUploadProgress] = useState(null);
// //   const [error, setError] = useState(null);
// //   const [successMsg, setSuccessMsg] = useState(null);

// //   // Modale de purge / zone danger
// //   const [showResetModal, setShowResetModal] = useState(false);
// //   const [resetting, setResetting] = useState(false);
// //   const [confirmText, setConfirmText] = useState('');

// //   const [purgeOptions, setPurgeOptions] = useState({
// //     documents: false,
// //     competences: false,
// //     etudiants: false,
// //     chefs: false,
// //     tout: false,
// //   });

// //   const loadBaseData = async () => {
// //     try {
// //       const [refComps, etuds, chefs] = await Promise.all([
// //         fetchReferentielCompetences(true),
// //         fetchEtudiants(),
// //         fetchChefsDeProjet(),
// //       ]);
// //       setReferentielCompetences(refComps || []);
// //       setEtudiantsList(etuds || []);
// //       setChefsList(chefs || []);
// //     } catch (err) {
// //       console.warn('Erreur chargement donnees de base:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     loadBaseData();
// //   }, []);

// //   const importTypesList = [
// //     { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, specialite, email)', isDoc: false },
// //     { value: 'etudiants', label: 'Etudiants', hint: 'Fichier CSV / Excel (nom, prenom, email, parcours)', isDoc: false },
// //     { value: 'voeux', label: 'Voeux reels des etudiants (1er au 10eme choix Moodle)', hint: 'Fichier Moodle avec colonnes 1er a 10eme Choix', isDoc: false },
// //     { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV de competences', isDoc: false },
// //     { value: 'apetences', label: `Appetences / Interets (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV d appetences', isDoc: false },
// //     { value: 'cv', label: 'CV des etudiants (Dossier Tout_CV)', hint: 'Selectionnez le dossier Tout_CV ou plusieurs fichiers PDF', isDoc: true },
// //     { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Selectionnez le dossier Tout_LM ou plusieurs fichiers PDF', isDoc: true },
// //   ];

// //   const activeType = importTypesList.find((t) => t.value === importType);

// //   const handleSpreadsheetUpload = (file) => {
// //     const reader = new FileReader();
// //     reader.onload = (evt) => {
// //       try {
// //         const data = evt.target.result;
// //         const workbook = XLSX.read(data, { type: 'binary', raw: false });

// //         // Selection automatique de la meilleure feuille
// //         const targetKeywords =
// //           importType === 'chefs' ? ['specialite', 'email'] :
// //           importType === 'etudiants' ? ['parcours', 'email', 'courriel'] :
// //           importType === 'voeux' ? ['choix', 'courriel', 'email'] :
// //           ['courriel', 'email', 'nom'];

// //         const sheetName = findBestSheetName(workbook, targetKeywords) || workbook.SheetNames[0];
// //         const sheet = workbook.Sheets[sheetName];
// //         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// //         // Execution de la couche d audit selon le type de donnees
// //         let report = null;
// //         if (importType === 'chefs') {
// //           report = validateChefsData(rawJson);
// //         } else if (importType === 'etudiants') {
// //           report = validateEtudiantsData(rawJson);
// //         } else if (importType === 'voeux') {
// //           report = validateVoeuxData(rawJson, etudiantsList, chefsList);
// //         } else if (importType === 'aptitudes' || importType === 'apetences') {
// //           report = validateCompetencesScores(rawJson, importType, etudiantsList, referentielCompetences);
// //         }

// //         setValidationReport(report);
// //         setConfirmWarnings(false);
// //       } catch (err) {
// //         setError(`Erreur lors de l analyse du fichier : ${err.message}`);
// //       }
// //     };
// //     reader.readAsBinaryString(file);
// //   };

// //   const handlePdfFilesUpload = (filesList) => {
// //     try {
// //       setLoading(true);
// //       setError(null);
// //       const report = validateDocumentsList(filesList, etudiantsList);
// //       setValidationReport(report);
// //       setConfirmWarnings(false);
// //       setFileName(`${filesList.length} document(s) detecte(s) dans le dossier`);
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la lecture des dossiers.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleFileUpload = (e) => {
// //     const files = e.target.files;
// //     if (!files || files.length === 0) return;

// //     setError(null);
// //     setSuccessMsg(null);
// //     setUploadProgress(null);
// //     setValidationReport(null);
// //     setConfirmWarnings(false);

// //     if (activeType?.isDoc) {
// //       handlePdfFilesUpload(files);
// //     } else {
// //       setFileName(files[0].name);
// //       handleSpreadsheetUpload(files[0]);
// //     }
// //   };

// //   const handleImport = async () => {
// //     if (!validationReport || validationReport.status === 'BLOQUANT') return;
// //     if (validationReport.status === 'AVERTISSEMENT' && !confirmWarnings) {
// //       alert('Veuillez cocher la case confirmant la prise en compte des avertissements avant d importer.');
// //       return;
// //     }

// //     try {
// //       setLoading(true);
// //       setError(null);
// //       setSuccessMsg(null);

// //       if (activeType?.isDoc) {
// //         const batchPayload = validationReport.cleanPayload.map((item) => ({
// //           file: item.file,
// //           etudiant_id: item.student.id,
// //         }));

// //         setUploadProgress({ current: 0, total: batchPayload.length });

// //         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
// //           setUploadProgress({ current, total });
// //         });

// //         setSuccessMsg(
// //           `${res.success} fichier(s) (${importType.toUpperCase()}) associes et stockes avec succes dans Supabase Storage.`
// //         );
// //         setFileName('');
// //         setValidationReport(null);
// //         await loadBaseData();
// //       } else if (importType === 'voeux') {
// //         // Injection transactionnelle atomique (RPC SQL)
// //         const result = await importVoeuxTransaction(validationReport.cleanPayload);
// //         setSuccessMsg(
// //           `Voeux importes avec succes en transaction securisee : ${result.selections_enregistrees} selections d entretien (Top 3) et ${result.voeux_enregistres} voeux complets enregistres (1 a 10).`
// //         );
// //         setFileName('');
// //         setValidationReport(null);
// //       } else {
// //         let result;
// //         if (importType === 'chefs') {
// //           result = await importChefsDeProjet(validationReport.cleanPayload);
// //         } else if (importType === 'etudiants') {
// //           result = await importEtudiants(validationReport.cleanPayload);
// //         } else if (importType === 'aptitudes') {
// //           result = await importAptitudes(validationReport.cleanPayload);
// //         } else if (importType === 'apetences') {
// //           result = await importApetences(validationReport.cleanPayload);
// //         }

// //         setSuccessMsg(`Import reussi : ${result?.length || validationReport.cleanPayload.length} ligne(s) enregistree(s) avec succes.`);
// //         setFileName('');
// //         setValidationReport(null);
// //         await loadBaseData();
// //       }
// //     } catch (err) {
// //       setError(err.message || "Erreur lors de l import.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleExecutePurge = async () => {
// //     try {
// //       setResetting(true);
// //       setError(null);
// //       setSuccessMsg(null);

// //       const messages = [];

// //       if (purgeOptions.documents || purgeOptions.tout) {
// //         await purgeAllDocuments();
// //         messages.push('Fichiers CV et LM supprimes du Storage.');
// //       }

// //       if (purgeOptions.competences || purgeOptions.tout) {
// //         await resetAllEtudiantVoeux();
// //         messages.push('Voeux complets etudiants supprimes.');
// //       }

// //       const payloadRPC = {
// //         rendez_vous: purgeOptions.tout,
// //         evaluations: purgeOptions.tout,
// //         affectations: purgeOptions.tout,
// //         selections: purgeOptions.tout,
// //         disponibilites: purgeOptions.tout,
// //         competences: purgeOptions.competences || purgeOptions.tout,
// //         etudiants: purgeOptions.etudiants || purgeOptions.tout,
// //         chefs: purgeOptions.chefs || purgeOptions.tout,
// //         users: purgeOptions.tout,
// //       };

// //       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
// //       if (rpcErr) throw rpcErr;

// //       messages.push('Donnees reinitialisees.');
// //       setSuccessMsg(`Purge reussie : ${messages.join(' ')}`);
// //       setShowResetModal(false);
// //       setConfirmText('');
// //       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
// //       await loadBaseData();
// //     } catch (err) {
// //       setError(err.message || 'Erreur lors de la purge.');
// //     } finally {
// //       setResetting(false);
// //     }
// //   };

// //   const isButtonDisabled =
// //     loading ||
// //     !validationReport ||
// //     validationReport.status === 'BLOQUANT' ||
// //     (validationReport.status === 'AVERTISSEMENT' && !confirmWarnings) ||
// //     validationReport.cleanPayload.length === 0;

// //   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
// //   const isPurgeDisabled =
// //     resetting ||
// //     (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) ||
// //     (requiresConfirmText && confirmText !== 'CONFIRMER');

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
// //           --accent-violet-soft: rgba(124, 108, 246, 0.18);
// //           --accent-cyan: #29d3d3;
// //           --accent-cyan-soft: rgba(41, 211, 211, 0.16);
// //           --accent-emerald: #35d0a0;
// //           --accent-emerald-soft: rgba(53, 208, 160, 0.16);
// //           --accent-coral: #ff6b6b;
// //         }

// //         .import-page-wrapper {
// //           max-width: 100%;
// //           margin: 0 auto;
// //           padding: 1.25rem 1rem 2.5rem 1rem;
// //           color: var(--text-primary);
// //           background:
// //             radial-gradient(1100px 480px at 10% -10%, rgba(124,108,246,0.10), transparent 60%),
// //             radial-gradient(900px 480px at 100% 0%, rgba(41,211,211,0.08), transparent 55%),
// //             var(--canvas);
// //           min-height: calc(100vh - 60px);
// //         }
// //         .import-card {
// //           background: var(--panel);
// //           backdrop-filter: blur(16px);
// //           border: 1px solid var(--border-subtle);
// //           border-radius: 14px;
// //         }
// //         .btn-danger-pill {
// //           background: rgba(239, 68, 68, 0.14) !important;
// //           color: #f87171 !important;
// //           border: 1px solid rgba(239, 68, 68, 0.35) !important;
// //           border-radius: 8px !important;
// //         }
// //         .btn-danger-pill:hover:not(:disabled) {
// //           background: #dc2626 !important;
// //           color: #ffffff !important;
// //           border-color: #dc2626 !important;
// //         }

// //         .import-step-label {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.4rem;
// //           color: var(--text-muted);
// //           font-weight: 700;
// //           font-size: 0.75rem;
// //           text-transform: uppercase;
// //           letter-spacing: 0.5px;
// //           margin-bottom: 0.5rem;
// //         }
// //         .import-step-num {
// //           width: 20px; height: 20px;
// //           border-radius: 50%;
// //           background: var(--accent-violet-soft);
// //           color: var(--accent-violet);
// //           display: inline-flex; align-items: center; justify-content: center;
// //           font-size: 0.7rem; font-weight: 800;
// //         }
// //         .import-type-options {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
// //           gap: 0.5rem;
// //         }
// //         .import-type-option {
// //           display: flex;
// //           align-items: center;
// //           justify-content: space-between;
// //           gap: 0.5rem;
// //           padding: 0.6rem 0.8rem;
// //           border-radius: 10px;
// //           border: 1px solid var(--border-subtle);
// //           background: rgba(255,255,255,0.02);
// //           cursor: pointer;
// //           transition: all 0.15s ease;
// //         }
// //         .import-type-option:hover { background: rgba(255,255,255,0.05); }
// //         .import-type-option.active {
// //           border-color: var(--accent-cyan);
// //           background: var(--accent-cyan-soft);
// //         }
// //         .import-type-option input { accent-color: var(--accent-cyan); }
// //         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
// //         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

// //         .import-dropzone {
// //           position: relative;
// //           border: 1.5px dashed var(--border-strong);
// //           border-radius: 12px;
// //           padding: 1.5rem 1rem;
// //           text-align: center;
// //           background: rgba(255,255,255,0.02);
// //           transition: all 0.15s ease;
// //         }
// //         .import-dropzone:hover {
// //           border-color: var(--accent-cyan);
// //           background: var(--accent-cyan-soft);
// //         }
// //         .import-dropzone input[type="file"] {
// //           position: absolute;
// //           inset: 0;
// //           opacity: 0;
// //           cursor: pointer;
// //         }
// //         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
// //         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
// //         .import-filename-chip {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 0.35rem;
// //           margin-top: 0.5rem;
// //           padding: 0.3rem 0.75rem;
// //           border-radius: 20px;
// //           background: var(--panel-raised);
// //           border: 1px solid var(--border-strong);
// //           font-size: 0.78rem;
// //           color: var(--text-primary);
// //           font-weight: 600;
// //         }

// //         .import-submit-btn {
// //           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
// //           border: none;
// //           color: #06231a;
// //           font-weight: 700;
// //           border-radius: 10px;
// //           padding: 0.75rem 1.5rem;
// //           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
// //         }
// //         .import-submit-btn:disabled {
// //           background: var(--panel-raised);
// //           color: var(--text-muted);
// //           opacity: 0.6;
// //           box-shadow: none;
// //         }

// //         .import-preview-header {
// //           background: var(--panel-raised);
// //           border-bottom: 1px solid var(--border-subtle);
// //           padding: 0.75rem 1rem;
// //         }
// //         .import-preview-wrapper {
// //           max-height: 50vh;
// //           overflow: auto;
// //         }
// //         .import-preview-table {
// //           font-size: 0.76rem;
// //         }
// //         .import-preview-table thead th {
// //           position: sticky;
// //           top: 0;
// //           background: var(--panel-solid);
// //           color: var(--text-muted);
// //           font-size: 0.68rem;
// //           text-transform: uppercase;
// //           letter-spacing: 0.4px;
// //           border-bottom: 2px solid var(--accent-violet-soft) !important;
// //           z-index: 2;
// //           text-align: center;
// //         }
// //         .import-preview-table tbody td {
// //           vertical-align: middle;
// //         }

// //         /* Panneau de rapport d audit */
// //         .audit-panel {
// //           border-radius: 12px;
// //           border: 1px solid var(--border-strong);
// //           background: var(--panel-raised);
// //           padding: 1rem 1.25rem;
// //           margin-bottom: 1.25rem;
// //         }
// //         .audit-kpi-row {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
// //           gap: 0.65rem;
// //           margin-bottom: 0.85rem;
// //         }
// //         .audit-kpi-card {
// //           background: var(--panel-solid);
// //           border: 1px solid var(--border-subtle);
// //           border-radius: 8px;
// //           padding: 0.55rem 0.75rem;
// //           display: flex;
// //           flex-direction: column;
// //           gap: 0.2rem;
// //         }
// //         .audit-kpi-label { font-size: 0.68rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); }
// //         .audit-kpi-val { font-size: 1.25rem; font-weight: 800; font-family: monospace; }
// //         .anomalies-list-box {
// //           max-height: 180px;
// //           overflow-y: auto;
// //           background: var(--panel-solid);
// //           border: 1px solid var(--border-subtle);
// //           border-radius: 8px;
// //           padding: 0.5rem;
// //         }
// //         .anomaly-row {
// //           display: flex;
// //           align-items: center;
// //           gap: 0.6rem;
// //           padding: 0.3rem 0.5rem;
// //           border-bottom: 1px solid rgba(255, 255, 255, 0.05);
// //           font-size: 0.76rem;
// //         }
// //         .anomaly-row:last-child { border-bottom: none; }

// //         .modal-dark .modal-content {
// //           background: #12161f !important;
// //           border: 1px solid var(--border-strong);
// //           border-radius: 16px;
// //           color: var(--text-primary);
// //         }
// //         .modal-dark .modal-header {
// //           border-bottom: 1px solid var(--border-subtle);
// //           background: rgba(239, 68, 68, 0.12);
// //         }
// //         .modal-dark .modal-footer {
// //           border-top: 1px solid var(--border-subtle);
// //         }
// //       `}</style>

// //       <Navbar />

// //       <div className="import-page-wrapper">
// //         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// //           <div>
// //             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Import et Gestion des donnees</h2>
// //             <small className="text-muted">
// //               Pipeline de validation avant injection pour garantir l integrite des donnees et prevenir les erreurs.
// //             </small>
// //           </div>

// //           <Button
// //             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
// //             size="sm"
// //             onClick={() => setShowResetModal(true)}
// //           >
// //             <span>Zone Danger / Purge et Reset</span>
// //           </Button>
// //         </div>

// //         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
// //         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

// //         {/* Formulaire d importation */}
// //         <Card className="import-card mb-4 p-3 border-0">
// //           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de donnees</div>
// //           <div className="import-type-options mb-4">
// //             {importTypesList.map((t) => (
// //               <label
// //                 key={t.value}
// //                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
// //               >
// //                 <div>
// //                   <div className="opt-label">{t.label}</div>
// //                   <div className="opt-hint">{t.hint}</div>
// //                 </div>
// //                 <input
// //                   type="radio"
// //                   name="importType"
// //                   value={t.value}
// //                   checked={importType === t.value}
// //                   onChange={(e) => {
// //                     setImportType(e.target.value);
// //                     setFileName('');
// //                     setUploadProgress(null);
// //                     setValidationReport(null);
// //                     setConfirmWarnings(false);
// //                   }}
// //                 />
// //               </label>
// //             ))}
// //           </div>

// //           <Row className="g-3 align-items-center">
// //             <Col md={8}>
// //               <div className="import-step-label">
// //                 <span className="import-step-num">2</span> 
// //                 {activeType?.isDoc ? 'Selectionnez le dossier ou les fichiers' : 'Selectionnez le fichier CSV / Excel'}
// //               </div>
// //               <div className="import-dropzone">
// //                 <input
// //                   type="file"
// //                   multiple
// //                   webkitdirectory={activeType?.isDoc ? "" : undefined}
// //                   directory={activeType?.isDoc ? "" : undefined}
// //                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
// //                   onChange={handleFileUpload}
// //                   aria-label="Selectionner le dossier ou les fichiers"
// //                 />
// //                 <div className="dz-text">
// //                   {activeType?.isDoc
// //                     ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)`
// //                     : 'Cliquez ou glissez votre fichier CSV / Excel Moodle'}
// //                 </div>
// //                 <div className="dz-sub">{activeType?.hint}</div>
// //                 {fileName && (
// //                   <div className="import-filename-chip">Fichier : {fileName}</div>
// //                 )}
// //               </div>
// //             </Col>

// //             <Col md={4} className="d-flex flex-column justify-content-center">
// //               <div className="import-step-label"><span className="import-step-num">3</span> Injection en base</div>
// //               <Button
// //                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
// //                 onClick={handleImport}
// //                 disabled={isButtonDisabled}
// //               >
// //                 {loading ? (
// //                   <>
// //                     <Spinner size="sm" animation="border" className="me-2" />
// //                     Injection en cours...
// //                   </>
// //                 ) : validationReport?.status === 'BLOQUANT' ? (
// //                   'Import bloque (corriger les erreurs)'
// //                 ) : validationReport?.status === 'AVERTISSEMENT' && !confirmWarnings ? (
// //                   'Confirmer les alertes ci-dessous'
// //                 ) : validationReport?.cleanPayload ? (
// //                   `Injecter ${validationReport.cleanPayload.length} element(s) valide(s)`
// //                 ) : (
// //                   'En attente de fichier'
// //                 )}
// //               </Button>

// //               {uploadProgress && (
// //                 <div className="mt-3">
// //                   <div className="d-flex justify-content-between small text-muted mb-1">
// //                     <span>Progression du stockage Cloud :</span>
// //                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
// //                   </div>
// //                   <ProgressBar
// //                     animated
// //                     variant="success"
// //                     now={(uploadProgress.current / uploadProgress.total) * 100}
// //                     style={{ height: '8px' }}
// //                   />
// //                 </div>
// //               )}
// //             </Col>
// //           </Row>
// //         </Card>

// //         {/* Panneau d Audit et de Validation Pre-Import */}
// //         {validationReport && (
// //           <div className="audit-panel shadow-sm">
// //             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
// //               <div className="d-flex align-items-center gap-2">
// //                 <span className="fw-bold text-white fs-6">Rapport d Audit Pre-Import</span>
// //                 <Badge bg={validationReport.status === 'CONFORME' ? 'success' : validationReport.status === 'AVERTISSEMENT' ? 'warning' : 'danger'}>
// //                   Statut : {validationReport.status}
// //                 </Badge>
// //               </div>

// //               {validationReport.status === 'AVERTISSEMENT' && (
// //                 <Form.Check
// //                   type="checkbox"
// //                   id="confirm-warnings-check"
// //                   label="Je confirme avoir verifie les anomalies et je souhaite proceder a l importation"
// //                   checked={confirmWarnings}
// //                   onChange={(e) => setConfirmWarnings(e.target.checked)}
// //                   className="text-warning fw-semibold small"
// //                 />
// //               )}
// //             </div>

// //             {/* Cartes KPI du rapport */}
// //             <div className="audit-kpi-row">
// //               <div className="audit-kpi-card">
// //                 <span className="audit-kpi-label">Lignes analysees</span>
// //                 <span className="audit-kpi-val text-white">{validationReport.stats.total}</span>
// //               </div>
// //               <div className="audit-kpi-card">
// //                 <span className="audit-kpi-label">Lignes valides</span>
// //                 <span className="audit-kpi-val text-success">{validationReport.stats.valides}</span>
// //               </div>
// //               <div className="audit-kpi-card">
// //                 <span className="audit-kpi-label">Erreurs bloquantes</span>
// //                 <span className="audit-kpi-val text-danger">{validationReport.stats.bloquants}</span>
// //               </div>
// //               <div className="audit-kpi-card">
// //                 <span className="audit-kpi-label">Avertissements</span>
// //                 <span className="audit-kpi-val text-warning">{validationReport.stats.alertes}</span>
// //               </div>
// //               {validationReport.stats.nonRepondants !== undefined && (
// //                 <div className="audit-kpi-card">
// //                   <span className="audit-kpi-label">Sans voeux</span>
// //                   <span className="audit-kpi-val text-muted">{validationReport.stats.nonRepondants}</span>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Liste detaillee des anomalies */}
// //             {validationReport.anomalies.length > 0 && (
// //               <div>
// //                 <span className="small text-muted fw-bold mb-1 d-block">Detail des anomalies detectees :</span>
// //                 <div className="anomalies-list-box">
// //                   {validationReport.anomalies.map((ano, aIdx) => (
// //                     <div key={aIdx} className="anomaly-row">
// //                       <Badge bg={ano.type === 'BLOQUANT' ? 'danger' : 'warning'} style={{ minWidth: '70px' }}>
// //                         {ano.type}
// //                       </Badge>
// //                       <span className="text-muted font-monospace" style={{ minWidth: '60px' }}>
// //                         {ano.ligne > 0 ? `Ligne ${ano.ligne}` : 'Global'}
// //                       </span>
// //                       <span className="text-white flex-grow-1">{ano.message}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* Previsualisation des Voeux Moodle (1er au 10eme choix) */}
// //         {importType === 'voeux' && validationReport?.cleanPayload?.length > 0 && (
// //           <Card className="import-card border-0 overflow-hidden mb-4">
// //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// //               <span>
// //                 Voeux reels extraits du questionnaire : <strong>{validationReport.cleanPayload.length} etudiants valides</strong>
// //               </span>
// //               <Badge bg="info">Rangs 1 a 10 prets pour injection</Badge>
// //             </div>
// //             <div className="import-preview-wrapper">
// //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// //                 <thead>
// //                   <tr>
// //                     <th style={{ textAlign: 'left' }}>#</th>
// //                     <th style={{ textAlign: 'left' }}>Etudiant</th>
// //                     {Array.from({ length: 10 }, (_, i) => (
// //                       <th key={i + 1}>P{i + 1}</th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {validationReport.cleanPayload.slice(0, 50).map((w, idx) => (
// //                     <tr key={idx}>
// //                       <td className="text-muted">{idx + 1}</td>
// //                       <td>
// //                         <strong className="text-white">{w.nomComplet}</strong>
// //                       </td>
// //                       {Array.from({ length: 10 }, (_, i) => {
// //                         const rank = i + 1;
// //                         const choice = w.choices.find((c) => c.rank === rank);
// //                         if (!choice) return <td key={rank} className="text-center text-muted">-</td>;
// //                         return (
// //                           <td key={rank} className="text-center">
// //                             <Badge
// //                               bg={rank === 1 ? 'success' : rank === 2 ? 'info' : rank === 3 ? 'warning' : 'secondary'}
// //                               text={rank === 2 || rank === 3 ? 'dark' : 'white'}
// //                               style={{ fontSize: '0.7rem' }}
// //                             >
// //                               {choice.chefNom}
// //                             </Badge>
// //                           </td>
// //                         );
// //                       })}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </Table>
// //             </div>
// //           </Card>
// //         )}

// //         {/* Previsualisation des dossiers de CV ou LM */}
// //         {activeType?.isDoc && validationReport?.cleanPayload?.length > 0 && (
// //           <Card className="import-card border-0 overflow-hidden mb-4">
// //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// //               <span>
// //                 Correspondance par sous-dossier etudiant : <strong>{validationReport.cleanPayload.length} fichier(s) valide(s)</strong>
// //               </span>
// //             </div>
// //             <div className="import-preview-wrapper">
// //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// //                 <thead>
// //                   <tr>
// //                     <th>#</th>
// //                     <th>Dossier / Fichier Detecte</th>
// //                     <th>Etudiant Correspondant dans la Base</th>
// //                     <th>Adresse Email</th>
// //                     <th>Statut</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {validationReport.cleanPayload.map((item, idx) => (
// //                     <tr key={idx}>
// //                       <td className="text-muted">{idx + 1}</td>
// //                       <td className="fw-semibold text-white">{item.fileName}</td>
// //                       <td>
// //                         <strong className="text-info">{item.student.nom} {item.student.prenom}</strong>
// //                       </td>
// //                       <td className="text-muted font-monospace">{item.student?.adresse_email || '-'}</td>
// //                       <td>
// //                         <Badge bg="success">Pret a uploader</Badge>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </Table>
// //             </div>
// //           </Card>
// //         )}

// //         {/* Previsualisation CSV / Excel classique */}
// //         {!activeType?.isDoc && importType !== 'voeux' && validationReport?.cleanPayload?.length > 0 && (
// //           <Card className="import-card border-0 overflow-hidden">
// //             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
// //               <span>
// //                 Donnees verifiees et pretes a l injection : <strong>{fileName}</strong>
// //               </span>
// //               <Badge bg="info">{validationReport.cleanPayload.length} ligne(s) valide(s)</Badge>
// //             </div>
// //             <div className="import-preview-wrapper">
// //               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
// //                 <thead>
// //                   <tr>
// //                     <th>#</th>
// //                     {Object.keys(validationReport.cleanPayload[0]).map((key) => (
// //                       <th key={key}>{key}</th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {validationReport.cleanPayload.slice(0, 50).map((row, idx) => (
// //                     <tr key={idx}>
// //                       <td className="text-muted">{idx + 1}</td>
// //                       {Object.values(row).map((val, cIdx) => (
// //                         <td key={cIdx}>{String(val)}</td>
// //                       ))}
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </Table>
// //             </div>
// //           </Card>
// //         )}
// //       </div>

// //       {/* Modale Zone Danger */}
// //       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
// //         <Modal.Header closeButton closeVariant="white">
// //           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
// //             Zone Danger - Purge et Remise a zero
// //           </Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           <p className="text-light small mb-3">
// //             Cochez les elements que vous souhaitez purger ou supprimer pour redemarrer une nouvelle campagne :
// //           </p>

// //           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
// //             <Form.Check
// //               type="checkbox"
// //               id="purge-docs"
// //               label="Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
// //               checked={purgeOptions.documents}
// //               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
// //               className="mb-2 text-white"
// //             />
// //             <Form.Check
// //               type="checkbox"
// //               id="purge-comp"
// //               label="Vider les Aptitudes et Appetences des etudiants"
// //               checked={purgeOptions.competences}
// //               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
// //               className="mb-2 text-white"
// //             />
// //             <Form.Check
// //               type="checkbox"
// //               id="purge-etud"
// //               label="Supprimer TOUS les Etudiants (efface aussi leurs voeux, rendez-vous et evaluations)"
// //               checked={purgeOptions.etudiants}
// //               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
// //               className="mb-2 text-warning"
// //             />
// //             <Form.Check
// //               type="checkbox"
// //               id="purge-chefs"
// //               label="Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilites et rendez-vous)"
// //               checked={purgeOptions.chefs}
// //               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
// //               className="mb-2 text-warning"
// //             />
// //             <hr style={{ borderColor: 'var(--border-subtle)' }} />
// //             <Form.Check
// //               type="checkbox"
// //               id="purge-tout"
// //               label="TOUT REINITIALISER : Vider absolument toutes les donnees de campagne pour une nouvelle rentree"
// //               checked={purgeOptions.tout}
// //               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
// //               className="text-danger fw-bold"
// //             />
// //           </div>

// //           {requiresConfirmText && (
// //             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
// //               <Form.Label className="small text-danger fw-bold mb-1">
// //                 Securite : Tapez le mot « CONFIRMER » pour debloquer la suppression :
// //               </Form.Label>
// //               <Form.Control
// //                 size="sm"
// //                 placeholder="Tapez CONFIRMER"
// //                 value={confirmText}
// //                 onChange={(e) => setConfirmText(e.target.value)}
// //                 className="bg-dark text-white border-danger"
// //               />
// //             </div>
// //           )}

// //           <p className="text-muted small mb-0">
// //             Attention : Les donnees supprimees ne pourront pas etre recuperees.
// //           </p>
// //         </Modal.Body>
// //         <Modal.Footer>
// //           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
// //             Annuler
// //           </Button>
// //           <Button
// //             variant="danger"
// //             size="sm"
// //             onClick={handleExecutePurge}
// //             disabled={isPurgeDisabled}
// //           >
// //             {resetting ? <Spinner size="sm" animation="border" /> : 'Executer la purge selectionnee'}
// //           </Button>
// //         </Modal.Footer>
// //       </Modal>
// //     </>
// //   );
// // }


// import React, { useState, useEffect } from 'react';
// import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
// import * as XLSX from 'xlsx';
// import Navbar from './Navbar';
// import {
//   importChefsDeProjet,
//   importEtudiants,
//   importAptitudes,
//   importApetences,
//   fetchChefsDeProjet,
//   fetchEtudiants,
//   fetchReferentielCompetences,
//   importVoeuxTransaction,
//   resetAllEtudiantVoeux,
//   uploadBatchDocuments,
//   purgeAllDocuments,
//   supabase,
// } from '../services/supabase';
// import {
//   findBestSheetName,
//   validateChefsData,
//   validateEtudiantsData,
//   validateVoeuxData,
//   validateCompetencesScores,
//   validateDocumentsList,
//   hasCorruptedEncoding,
//   autoRepairMojibake,
// } from '../services/dataValidator';

// export default function ImportPage() {
//   const [importType, setImportType] = useState('chefs');
//   const [referentielCompetences, setReferentielCompetences] = useState([]);
//   const [etudiantsList, setEtudiantsList] = useState([]);
//   const [chefsList, setChefsList] = useState([]);

//   // Donnees brutes en memoire pour permettre la correction directe
//   const [rawRows, setRawRows] = useState([]);
//   const [validationReport, setValidationReport] = useState(null);
//   const [confirmWarnings, setConfirmWarnings] = useState(false);

//   // Modale de correction rapide d une ligne
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingRowIndex, setEditingRowIndex] = useState(null);
//   const [editFormData, setEditFormData] = useState({});

//   const [fileName, setFileName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(null);
//   const [error, setError] = useState(null);
//   const [successMsg, setSuccessMsg] = useState(null);

//   // Modale de purge / zone danger
//   const [showResetModal, setShowResetModal] = useState(false);
//   const [resetting, setResetting] = useState(false);
//   const [confirmText, setConfirmText] = useState('');

//   const [purgeOptions, setPurgeOptions] = useState({
//     documents: false,
//     competences: false,
//     etudiants: false,
//     chefs: false,
//     tout: false,
//   });

//   const loadBaseData = async () => {
//     try {
//       const [refComps, etuds, chefs] = await Promise.all([
//         fetchReferentielCompetences(true),
//         fetchEtudiants(),
//         fetchChefsDeProjet(),
//       ]);
//       setReferentielCompetences(refComps || []);
//       setEtudiantsList(etuds || []);
//       setChefsList(chefs || []);
//     } catch (err) {
//       console.warn('Erreur chargement donnees de base:', err);
//     }
//   };

//   useEffect(() => {
//     loadBaseData();
//   }, []);

//   const importTypesList = [
//     { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, specialite, email)', isDoc: false },
//     { value: 'etudiants', label: 'Etudiants', hint: 'Fichier CSV / Excel (nom, prenom, email, parcours)', isDoc: false },
//     { value: 'voeux', label: 'Voeux reels des etudiants (1er au 10eme choix Moodle)', hint: 'Fichier Moodle avec colonnes 1er a 10eme Choix', isDoc: false },
//     { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV de competences', isDoc: false },
//     { value: 'apetences', label: `Appetences / Interets (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV d appetences', isDoc: false },
//     { value: 'cv', label: 'CV des etudiants (Dossier Tout_CV)', hint: 'Selectionnez le dossier Tout_CV ou plusieurs fichiers PDF', isDoc: true },
//     { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Selectionnez le dossier Tout_LM ou plusieurs fichiers PDF', isDoc: true },
//   ];

//   const activeType = importTypesList.find((t) => t.value === importType);

//   // Fonction centrale pour recalculer le rapport d audit a partir des lignes en memoire
//   const runAudit = (rowsToValidate, type = importType) => {
//     let report = null;
//     if (type === 'chefs') {
//       report = validateChefsData(rowsToValidate);
//     } else if (type === 'etudiants') {
//       report = validateEtudiantsData(rowsToValidate);
//     } else if (type === 'voeux') {
//       report = validateVoeuxData(rowsToValidate, etudiantsList, chefsList);
//     } else if (type === 'aptitudes' || type === 'apetences') {
//       report = validateCompetencesScores(rowsToValidate, type, etudiantsList, referentielCompetences);
//     }
//     setValidationReport(report);
//   };

//   const handleSpreadsheetUpload = (file) => {
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       try {
//         const data = evt.target.result;
//         const workbook = XLSX.read(data, { type: 'binary', raw: false });

//         const targetKeywords =
//           importType === 'chefs' ? ['specialite', 'email'] :
//           importType === 'etudiants' ? ['parcours', 'email', 'courriel'] :
//           importType === 'voeux' ? ['choix', 'courriel', 'email'] :
//           ['courriel', 'email', 'nom'];

//         const sheetName = findBestSheetName(workbook, targetKeywords) || workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

//         setRawRows(rawJson);
//         runAudit(rawJson, importType);
//         setConfirmWarnings(false);
//       } catch (err) {
//         setError(`Erreur lors de l analyse du fichier : ${err.message}`);
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handlePdfFilesUpload = (filesList) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const report = validateDocumentsList(filesList, etudiantsList);
//       setValidationReport(report);
//       setConfirmWarnings(false);
//       setFileName(`${filesList.length} document(s) detecte(s) dans le dossier`);
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la lecture des dossiers.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     setError(null);
//     setSuccessMsg(null);
//     setUploadProgress(null);
//     setValidationReport(null);
//     setConfirmWarnings(false);

//     if (activeType?.isDoc) {
//       handlePdfFilesUpload(files);
//     } else {
//       setFileName(files[0].name);
//       handleSpreadsheetUpload(files[0]);
//     }
//   };

//   // ACTION DIRECTE : Supprimer une ligne parasite (en memoire)
//   const handleDeleteRow = (rowIndex) => {
//     if (rowIndex <= 0 || rowIndex >= rawRows.length) return;
//     const updated = rawRows.filter((_, idx) => idx !== rowIndex);
//     setRawRows(updated);
//     runAudit(updated, importType);
//   };

//   // ACTION DIRECTE : Ouvrir la modale pour modifier une ligne
//   const handleOpenEditRowModal = (rowIndex) => {
//     if (rowIndex <= 0 || rowIndex >= rawRows.length) return;
//     const r = rawRows[rowIndex] || [];
//     setEditingRowIndex(rowIndex);

//     if (importType === 'chefs') {
//       const rawNom = String(r[0] || '');
//       const rawSpec = String(r[1] || '');
//       setEditFormData({
//         nom: hasCorruptedEncoding(rawNom) ? autoRepairMojibake(rawNom) : rawNom,
//         specialite: hasCorruptedEncoding(rawSpec) ? autoRepairMojibake(rawSpec) : rawSpec,
//         email: String(r[2] || ''),
//         creneaux: String(r[3] || '15'),
//       });
//     } else if (importType === 'etudiants') {
//       const col0 = String(r[0] || '');
//       const col1 = String(r[1] || '');
//       const col2 = String(r[2] || '');
//       const col3 = String(r[3] || 'I2026');

//       if (col0.includes('@')) {
//         setEditFormData({
//           formatEmailFirst: true,
//           col0: col0,
//           col1: col1 || 'I2026',
//         });
//       } else {
//         setEditFormData({
//           formatEmailFirst: false,
//           nom: hasCorruptedEncoding(col0) ? autoRepairMojibake(col0) : col0,
//           prenom: hasCorruptedEncoding(col1) ? autoRepairMojibake(col1) : col1,
//           email: col2,
//           parcours: col3 || 'I2026',
//         });
//       }
//     }
//     setShowEditModal(true);
//   };

//   // ACTION DIRECTE : Enregistrer les modifications de la ligne
//   const handleSaveEditedRow = () => {
//     if (editingRowIndex === null) return;
//     const updated = [...rawRows];

//     if (importType === 'chefs') {
//       updated[editingRowIndex] = [
//         editFormData.nom,
//         editFormData.specialite,
//         editFormData.email,
//         editFormData.creneaux || '15',
//       ];
//     } else if (importType === 'etudiants') {
//       if (editFormData.formatEmailFirst) {
//         updated[editingRowIndex] = [
//           editFormData.col0,
//           editFormData.col1 || 'I2026',
//         ];
//       } else {
//         updated[editingRowIndex] = [
//           editFormData.nom,
//           editFormData.prenom,
//           editFormData.email,
//           editFormData.parcours || 'I2026',
//         ];
//       }
//     }

//     setRawRows(updated);
//     runAudit(updated, importType);
//     setShowEditModal(false);
//     setEditingRowIndex(null);
//   };

//   const handleImport = async () => {
//     if (!validationReport || validationReport.status === 'BLOQUANT') return;
//     if (validationReport.status === 'AVERTISSEMENT' && !confirmWarnings) {
//       alert('Veuillez cocher la case confirmant la prise en compte des avertissements.');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       setSuccessMsg(null);

//       if (activeType?.isDoc) {
//         const batchPayload = validationReport.cleanPayload.map((item) => ({
//           file: item.file,
//           etudiant_id: item.student.id,
//         }));

//         setUploadProgress({ current: 0, total: batchPayload.length });

//         const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
//           setUploadProgress({ current, total });
//         });

//         setSuccessMsg(
//           `${res.success} fichier(s) (${importType.toUpperCase()}) associes et stockes avec succes dans Supabase Storage.`
//         );
//         setFileName('');
//         setValidationReport(null);
//         await loadBaseData();
//       } else if (importType === 'voeux') {
//         const result = await importVoeuxTransaction(validationReport.cleanPayload);
//         setSuccessMsg(
//           `Voeux importes avec succes en transaction securisee : ${result.selections_enregistrees} selections d entretien (Top 3) et ${result.voeux_enregistres} voeux complets enregistres (1 a 10).`
//         );
//         setFileName('');
//         setValidationReport(null);
//       } else {
//         let result;
//         if (importType === 'chefs') {
//           result = await importChefsDeProjet(validationReport.cleanPayload);
//         } else if (importType === 'etudiants') {
//           result = await importEtudiants(validationReport.cleanPayload);
//         } else if (importType === 'aptitudes') {
//           result = await importAptitudes(validationReport.cleanPayload);
//         } else if (importType === 'apetences') {
//           result = await importApetences(validationReport.cleanPayload);
//         }

//         setSuccessMsg(`Import reussi : ${result?.length || validationReport.cleanPayload.length} ligne(s) enregistree(s) avec succes.`);
//         setFileName('');
//         setValidationReport(null);
//         await loadBaseData();
//       }
//     } catch (err) {
//       setError(err.message || "Erreur lors de l import.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExecutePurge = async () => {
//     try {
//       setResetting(true);
//       setError(null);
//       setSuccessMsg(null);

//       const messages = [];

//       if (purgeOptions.documents || purgeOptions.tout) {
//         await purgeAllDocuments();
//         messages.push('Fichiers CV et LM supprimes du Storage.');
//       }

//       if (purgeOptions.competences || purgeOptions.tout) {
//         await resetAllEtudiantVoeux();
//         messages.push('Voeux complets etudiants supprimes.');
//       }

//       const payloadRPC = {
//         rendez_vous: purgeOptions.tout,
//         evaluations: purgeOptions.tout,
//         affectations: purgeOptions.tout,
//         selections: purgeOptions.tout,
//         disponibilites: purgeOptions.tout,
//         competences: purgeOptions.competences || purgeOptions.tout,
//         etudiants: purgeOptions.etudiants || purgeOptions.tout,
//         chefs: purgeOptions.chefs || purgeOptions.tout,
//         users: purgeOptions.tout,
//       };

//       const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
//       if (rpcErr) throw rpcErr;

//       messages.push('Donnees reinitialisees.');
//       setSuccessMsg(`Purge reussie : ${messages.join(' ')}`);
//       setShowResetModal(false);
//       setConfirmText('');
//       setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
//       await loadBaseData();
//     } catch (err) {
//       setError(err.message || 'Erreur lors de la purge.');
//     } finally {
//       setResetting(false);
//     }
//   };

//   const isButtonDisabled =
//     loading ||
//     !validationReport ||
//     validationReport.status === 'BLOQUANT' ||
//     (validationReport.status === 'AVERTISSEMENT' && !confirmWarnings) ||
//     validationReport.cleanPayload.length === 0;

//   const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
//   const isPurgeDisabled =
//     resetting ||
//     (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) ||
//     (requiresConfirmText && confirmText !== 'CONFIRMER');

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
//         .btn-danger-pill {
//           background: rgba(239, 68, 68, 0.14) !important;
//           color: #f87171 !important;
//           border: 1px solid rgba(239, 68, 68, 0.35) !important;
//           border-radius: 8px !important;
//         }
//         .btn-danger-pill:hover:not(:disabled) {
//           background: #dc2626 !important;
//           color: #ffffff !important;
//           border-color: #dc2626 !important;
//         }

//         .import-step-label {
//           display: flex;
//           align-items: center;
//           gap: 0.4rem;
//           color: #e2e8f0;
//           font-weight: 700;
//           font-size: 0.78rem;
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
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
//           gap: 0.5rem;
//         }
//         .import-type-option {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 0.5rem;
//           padding: 0.6rem 0.8rem;
//           border-radius: 10px;
//           border: 1px solid var(--border-subtle);
//           background: rgba(255,255,255,0.02);
//           cursor: pointer;
//           transition: all 0.15s ease;
//         }
//         .import-type-option:hover { background: rgba(255,255,255,0.05); }
//         .import-type-option.active {
//           border-color: var(--accent-cyan);
//           background: var(--accent-cyan-soft);
//         }
//         .import-type-option input { accent-color: var(--accent-cyan); }
//         .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
//         .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

//         .import-dropzone {
//           position: relative;
//           border: 1.5px dashed var(--border-strong);
//           border-radius: 12px;
//           padding: 1.5rem 1rem;
//           text-align: center;
//           background: rgba(255,255,255,0.02);
//           transition: all 0.15s ease;
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
//         .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
//         .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
//         .import-filename-chip {
//           display: inline-flex;
//           align-items: center;
//           gap: 0.35rem;
//           margin-top: 0.5rem;
//           padding: 0.3rem 0.75rem;
//           border-radius: 20px;
//           background: var(--panel-raised);
//           border: 1px solid var(--border-strong);
//           font-size: 0.78rem;
//           color: var(--text-primary);
//           font-weight: 600;
//         }

//         .import-submit-btn {
//           background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
//           border: none;
//           color: #06231a;
//           font-weight: 700;
//           border-radius: 10px;
//           padding: 0.75rem 1.5rem;
//           box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
//         }
//         .import-submit-btn:disabled {
//           background: var(--panel-raised);
//           color: #64748b;
//           opacity: 0.7;
//           box-shadow: none;
//         }

//         /* Panneau d audit et corrections */
//         .audit-panel {
//           border-radius: 12px;
//           border: 1px solid var(--border-strong);
//           background: var(--panel-raised);
//           padding: 1.15rem 1.35rem;
//           margin-bottom: 1.25rem;
//         }
//         .audit-kpi-row {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
//           gap: 0.65rem;
//           margin-bottom: 0.85rem;
//         }
//         .audit-kpi-card {
//           background: var(--panel-solid);
//           border: 1px solid var(--border-subtle);
//           border-radius: 8px;
//           padding: 0.55rem 0.75rem;
//           display: flex;
//           flex-direction: column;
//           gap: 0.2rem;
//         }
//         .audit-kpi-label { font-size: 0.68rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; }
//         .audit-kpi-val { font-size: 1.25rem; font-weight: 800; font-family: monospace; }
        
//         .anomalies-list-box {
//           max-height: 240px;
//           overflow-y: auto;
//           background: #0d1527;
//           border: 1px solid rgba(239, 68, 68, 0.35);
//           border-radius: 8px;
//           padding: 0.5rem;
//         }
//         .anomaly-row {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           gap: 0.75rem;
//           padding: 0.5rem 0.65rem;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//           font-size: 0.82rem;
//           color: #f1f5f9;
//         }
//         .anomaly-row:last-child { border-bottom: none; }
//         .anomaly-line-badge {
//           background: rgba(45, 212, 191, 0.15);
//           border: 1px solid rgba(45, 212, 191, 0.4);
//           color: #2dd4bf;
//           font-weight: 700;
//           font-family: monospace;
//           padding: 2px 6px;
//           border-radius: 4px;
//           white-space: nowrap;
//         }

//         .btn-correct-pill {
//           background: rgba(45, 212, 191, 0.15);
//           border: 1px solid rgba(45, 212, 191, 0.4);
//           color: #2dd4bf;
//           font-size: 0.72rem;
//           font-weight: 600;
//           border-radius: 6px;
//           padding: 2px 8px;
//           cursor: pointer;
//         }
//         .btn-correct-pill:hover {
//           background: #2dd4bf;
//           color: #06201c;
//         }
//         .btn-delete-row-pill {
//           background: rgba(239, 68, 68, 0.15);
//           border: 1px solid rgba(239, 68, 68, 0.4);
//           color: #f87171;
//           font-size: 0.72rem;
//           font-weight: 600;
//           border-radius: 6px;
//           padding: 2px 8px;
//           cursor: pointer;
//         }
//         .btn-delete-row-pill:hover {
//           background: #dc2626;
//           color: #fff;
//         }

//         .modal-dark .modal-content {
//           background: #12161f !important;
//           border: 1px solid var(--border-strong);
//           border-radius: 16px;
//           color: var(--text-primary);
//         }
//         .modal-dark .modal-header {
//           border-bottom: 1px solid var(--border-subtle);
//           background: rgba(45, 212, 191, 0.08);
//         }
//         .modal-dark .modal-footer {
//           border-top: 1px solid var(--border-subtle);
//         }
//       `}</style>

//       <Navbar />

//       <div className="import-page-wrapper">
//         <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//           <div>
//             <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Import et Gestion des donnees</h2>
//             <small className="text-muted">
//               Verification des donnees avec correction directe en ligne avant toute injection en base.
//             </small>
//           </div>

//           <Button
//             className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
//             size="sm"
//             onClick={() => setShowResetModal(true)}
//           >
//             <span>Zone Danger / Purge et Reset</span>
//           </Button>
//         </div>

//         {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
//         {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

//         {/* Formulaire d importation */}
//         <Card className="import-card mb-4 p-3 border-0">
//           <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de donnees</div>
//           <div className="import-type-options mb-4">
//             {importTypesList.map((t) => (
//               <label
//                 key={t.value}
//                 className={`import-type-option ${importType === t.value ? 'active' : ''}`}
//               >
//                 <div>
//                   <div className="opt-label">{t.label}</div>
//                   <div className="opt-hint">{t.hint}</div>
//                 </div>
//                 <input
//                   type="radio"
//                   name="importType"
//                   value={t.value}
//                   checked={importType === t.value}
//                   onChange={(e) => {
//                     setImportType(e.target.value);
//                     setFileName('');
//                     setUploadProgress(null);
//                     setValidationReport(null);
//                     setConfirmWarnings(false);
//                     setRawRows([]);
//                   }}
//                 />
//               </label>
//             ))}
//           </div>

//           <Row className="g-3 align-items-center">
//             <Col md={8}>
//               <div className="import-step-label">
//                 <span className="import-step-num">2</span> 
//                 {activeType?.isDoc ? 'Selectionnez le dossier ou les fichiers' : 'Selectionnez le fichier CSV / Excel'}
//               </div>
//               <div className="import-dropzone">
//                 <input
//                   type="file"
//                   multiple
//                   webkitdirectory={activeType?.isDoc ? "" : undefined}
//                   directory={activeType?.isDoc ? "" : undefined}
//                   accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
//                   onChange={handleFileUpload}
//                   aria-label="Selectionner le dossier ou les fichiers"
//                 />
//                 <div className="dz-text">
//                   {activeType?.isDoc
//                     ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)`
//                     : 'Cliquez ou glissez votre fichier CSV / Excel'}
//                 </div>
//                 <div className="dz-sub">{activeType?.hint}</div>
//                 {fileName && (
//                   <div className="import-filename-chip">Fichier : {fileName}</div>
//                 )}
//               </div>
//             </Col>

//             <Col md={4} className="d-flex flex-column justify-content-center">
//               <div className="import-step-label"><span className="import-step-num">3</span> Injection en base</div>
//               <Button
//                 className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
//                 onClick={handleImport}
//                 disabled={isButtonDisabled}
//               >
//                 {loading ? (
//                   <>
//                     <Spinner size="sm" animation="border" className="me-2" />
//                     Injection en cours...
//                   </>
//                 ) : validationReport?.status === 'BLOQUANT' ? (
//                   'Import bloque (corriger les erreurs ci-dessous)'
//                 ) : validationReport?.status === 'AVERTISSEMENT' && !confirmWarnings ? (
//                   'Confirmer les alertes ci-dessous'
//                 ) : validationReport?.cleanPayload ? (
//                   `Injecter ${validationReport.cleanPayload.length} element(s) valide(s)`
//                 ) : (
//                   'En attente de fichier'
//                 )}
//               </Button>

//               {uploadProgress && (
//                 <div className="mt-3">
//                   <div className="d-flex justify-content-between small text-muted mb-1">
//                     <span>Progression du stockage Cloud :</span>
//                     <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
//                   </div>
//                   <ProgressBar
//                     animated
//                     variant="success"
//                     now={(uploadProgress.current / uploadProgress.total) * 100}
//                     style={{ height: '8px' }}
//                   />
//                 </div>
//               )}
//             </Col>
//           </Row>
//         </Card>

//         {/* Panneau d Audit et de Validation Pre-Import */}
//         {validationReport && (
//           <div className="audit-panel shadow-sm">
//             <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
//               <div className="d-flex align-items-center gap-2">
//                 <span className="fw-bold text-white fs-6">Rapport d Audit Pre-Import</span>
//                 <Badge bg={validationReport.status === 'CONFORME' ? 'success' : validationReport.status === 'AVERTISSEMENT' ? 'warning' : 'danger'}>
//                   Statut : {validationReport.status}
//                 </Badge>
//               </div>

//               {validationReport.status === 'AVERTISSEMENT' && (
//                 <Form.Check
//                   type="checkbox"
//                   id="confirm-warnings-check"
//                   label="Je confirme avoir verifie les anomalies et je souhaite proceder a l importation"
//                   checked={confirmWarnings}
//                   onChange={(e) => setConfirmWarnings(e.target.checked)}
//                   className="text-warning fw-semibold small"
//                 />
//               )}
//             </div>

//             {/* Cartes KPI du rapport */}
//             <div className="audit-kpi-row">
//               <div className="audit-kpi-card">
//                 <span className="audit-kpi-label">Lignes analysees</span>
//                 <span className="audit-kpi-val text-white">{validationReport.stats.total}</span>
//               </div>
//               <div className="audit-kpi-card">
//                 <span className="audit-kpi-label">Lignes valides</span>
//                 <span className="audit-kpi-val text-success">{validationReport.stats.valides}</span>
//               </div>
//               <div className="audit-kpi-card">
//                 <span className="audit-kpi-label">Erreurs bloquantes</span>
//                 <span className="audit-kpi-val text-danger">{validationReport.stats.bloquants}</span>
//               </div>
//               <div className="audit-kpi-card">
//                 <span className="audit-kpi-label">Avertissements</span>
//                 <span className="audit-kpi-val text-warning">{validationReport.stats.alertes}</span>
//               </div>
//               {validationReport.stats.nonRepondants !== undefined && (
//                 <div className="audit-kpi-card">
//                   <span className="audit-kpi-label">Sans voeux</span>
//                   <span className="audit-kpi-val text-muted">{validationReport.stats.nonRepondants}</span>
//                 </div>
//               )}
//             </div>

//             {/* Liste detaillee des anomalies avec actions directes */}
//             {validationReport.anomalies.length > 0 && (
//               <div>
//                 <span className="small text-white fw-bold mb-2 d-block">
//                   Anomalies a resoudre directement sur l ecran :
//                 </span>
//                 <div className="anomalies-list-box">
//                   {validationReport.anomalies.map((ano, aIdx) => (
//                     <div key={aIdx} className="anomaly-row">
//                       <div className="d-flex align-items-center gap-2 flex-grow-1 flex-wrap">
//                         <Badge bg={ano.type === 'BLOQUANT' ? 'danger' : 'warning'} style={{ minWidth: '75px' }}>
//                           {ano.type}
//                         </Badge>
//                         {ano.ligne > 0 && (
//                           <span className="anomaly-line-badge">
//                             Ligne {ano.ligne}
//                           </span>
//                         )}
//                         <span className="text-white">{ano.message}</span>
//                       </div>

//                       {/* Boutons d action directe */}
//                       {ano.rowIndex > 0 && (
//                         <div className="d-flex gap-2 flex-shrink-0">
//                           {(importType === 'etudiants' || importType === 'chefs') && (
//                             <button
//                               type="button"
//                               className="btn-correct-pill"
//                               onClick={() => handleOpenEditRowModal(ano.rowIndex)}
//                             >
//                               Corriger
//                             </button>
//                           )}
//                           <button
//                             type="button"
//                             className="btn-delete-row-pill"
//                             onClick={() => handleDeleteRow(ano.rowIndex)}
//                             title="Supprimer cette ligne parasite du fichier importe"
//                           >
//                             Supprimer
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Previsualisation des Voeux Moodle (1er au 10eme choix) */}
//         {importType === 'voeux' && validationReport?.cleanPayload?.length > 0 && (
//           <Card className="import-card border-0 overflow-hidden mb-4">
//             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
//               <span className="text-white">
//                 Voeux reels extraits du questionnaire : <strong>{validationReport.cleanPayload.length} etudiants valides</strong>
//               </span>
//               <Badge bg="info">Rangs 1 a 10 prets pour injection</Badge>
//             </div>
//             <div className="import-preview-wrapper">
//               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
//                 <thead>
//                   <tr>
//                     <th style={{ textAlign: 'left' }}>#</th>
//                     <th style={{ textAlign: 'left' }}>Etudiant</th>
//                     {Array.from({ length: 10 }, (_, i) => (
//                       <th key={i + 1}>P{i + 1}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {validationReport.cleanPayload.slice(0, 50).map((w, idx) => (
//                     <tr key={idx}>
//                       <td className="text-muted">{idx + 1}</td>
//                       <td>
//                         <strong className="text-white">{w.nomComplet}</strong>
//                       </td>
//                       {Array.from({ length: 10 }, (_, i) => {
//                         const rank = i + 1;
//                         const choice = w.choices.find((c) => c.rank === rank);
//                         if (!choice) return <td key={rank} className="text-center text-muted">-</td>;
//                         return (
//                           <td key={rank} className="text-center">
//                             <Badge
//                               bg={rank === 1 ? 'success' : rank === 2 ? 'info' : rank === 3 ? 'warning' : 'secondary'}
//                               text={rank === 2 || rank === 3 ? 'dark' : 'white'}
//                               style={{ fontSize: '0.7rem' }}
//                             >
//                               {choice.chefNom}
//                             </Badge>
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Card>
//         )}

//         {/* Previsualisation classique CSV / Excel */}
//         {!activeType?.isDoc && importType !== 'voeux' && validationReport?.cleanPayload?.length > 0 && (
//           <Card className="import-card border-0 overflow-hidden">
//             <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
//               <span className="text-white">
//                 Donnees verifiees et pretes a l injection : <strong>{fileName}</strong>
//               </span>
//               <Badge bg="info">{validationReport.cleanPayload.length} ligne(s) valide(s)</Badge>
//             </div>
//             <div className="import-preview-wrapper">
//               <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     {Object.keys(validationReport.cleanPayload[0]).map((key) => (
//                       <th key={key}>{key}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {validationReport.cleanPayload.slice(0, 50).map((row, idx) => (
//                     <tr key={idx}>
//                       <td className="text-muted">{idx + 1}</td>
//                       {Object.values(row).map((val, cIdx) => (
//                         <td key={cIdx} className="text-white">{String(val)}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Card>
//         )}
//       </div>

//       {/* Modale de Correction Directe d une Ligne */}
//       <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.1rem', color: '#2dd4bf', fontWeight: 700 }}>
//             Correction directe de la ligne {editingRowIndex !== null ? editingRowIndex + 1 : ''}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {importType === 'etudiants' && (
//             <>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Nom de famille</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   value={editFormData.nom !== undefined ? editFormData.nom : (editFormData.col0 || '')}
//                   onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value, col0: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Prenom</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   value={editFormData.prenom !== undefined ? editFormData.prenom : (editFormData.col1 || '')}
//                   onChange={(e) => setEditFormData({ ...editFormData, prenom: e.target.value, col1: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Adresse Email (Obligatoire)</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   type="email"
//                   placeholder="prenom.nom@2026.icam.fr"
//                   value={editFormData.email !== undefined ? editFormData.email : (editFormData.col2 || '')}
//                   onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value, col2: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Parcours</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   value={editFormData.parcours || editFormData.col3 || 'I2026'}
//                   onChange={(e) => setEditFormData({ ...editFormData, parcours: e.target.value, col3: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//             </>
//           )}

//           {importType === 'chefs' && (
//             <>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Nom du Chef de projet</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   value={editFormData.nom || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Specialite / Intitule du projet</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   value={editFormData.specialite || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, specialite: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Adresse Email</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   type="email"
//                   value={editFormData.email || ''}
//                   onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label className="small text-muted">Nombre maximal de creneaux</Form.Label>
//                 <Form.Control
//                   size="sm"
//                   type="number"
//                   value={editFormData.creneaux || '15'}
//                   onChange={(e) => setEditFormData({ ...editFormData, creneaux: e.target.value })}
//                   className="bg-dark text-white border-secondary"
//                 />
//               </Form.Group>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setShowEditModal(false)}>
//             Annuler
//           </Button>
//           <Button variant="success" size="sm" onClick={handleSaveEditedRow}>
//             Valider la correction
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Modale Zone Danger */}
//       <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
//         <Modal.Header closeButton closeVariant="white">
//           <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
//             Zone Danger - Purge et Remise a zero
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p className="text-light small mb-3">
//             Cochez les elements que vous souhaitez purger ou supprimer pour redemarrer une nouvelle campagne :
//           </p>

//           <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
//             <Form.Check
//               type="checkbox"
//               id="purge-docs"
//               label="Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
//               checked={purgeOptions.documents}
//               onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
//               className="mb-2 text-white"
//             />
//             <Form.Check
//               type="checkbox"
//               id="purge-comp"
//               label="Vider les Aptitudes et Appetences des etudiants"
//               checked={purgeOptions.competences}
//               onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
//               className="mb-2 text-white"
//             />
//             <Form.Check
//               type="checkbox"
//               id="purge-etud"
//               label="Supprimer TOUS les Etudiants (efface aussi leurs voeux, rendez-vous et evaluations)"
//               checked={purgeOptions.etudiants}
//               onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
//               className="mb-2 text-warning"
//             />
//             <Form.Check
//               type="checkbox"
//               id="purge-chefs"
//               label="Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilites et rendez-vous)"
//               checked={purgeOptions.chefs}
//               onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
//               className="mb-2 text-warning"
//             />
//             <hr style={{ borderColor: 'var(--border-subtle)' }} />
//             <Form.Check
//               type="checkbox"
//               id="purge-tout"
//               label="TOUT REINITIALISER : Vider absolument toutes les donnees de campagne pour une nouvelle rentree"
//               checked={purgeOptions.tout}
//               onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
//               className="text-danger fw-bold"
//             />
//           </div>

//           {requiresConfirmText && (
//             <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
//               <Form.Label className="small text-danger fw-bold mb-1">
//                 Securite : Tapez le mot « CONFIRMER » pour debloquer la suppression :
//               </Form.Label>
//               <Form.Control
//                 size="sm"
//                 placeholder="Tapez CONFIRMER"
//                 value={confirmText}
//                 onChange={(e) => setConfirmText(e.target.value)}
//                 className="bg-dark text-white border-danger"
//               />
//             </div>
//           )}

//           <p className="text-muted small mb-0">
//             Attention : Les donnees supprimees ne pourront pas etre recuperees.
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" size="sm" onClick={() => setShowResetModal(false)} disabled={resetting}>
//             Annuler
//           </Button>
//           <Button
//             variant="danger"
//             size="sm"
//             onClick={handleExecutePurge}
//             disabled={isPurgeDisabled}
//           >
//             {resetting ? <Spinner size="sm" animation="border" /> : 'Executer la purge selectionnee'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }


import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Spinner, Table, Badge, Row, Col, Modal, ProgressBar } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import Navbar from './Navbar';
import {
  importChefsDeProjet,
  importEtudiants,
  importAptitudes,
  importApetences,
  fetchChefsDeProjet,
  fetchEtudiants,
  fetchReferentielCompetences,
  importVoeuxTransaction,
  resetAllEtudiantVoeux,
  uploadBatchDocuments,
  purgeAllDocuments,
  supabase,
} from '../services/supabase';
import {
  findBestSheetName,
  validateChefsData,
  validateEtudiantsData,
  validateVoeuxData,
  validateCompetencesScores,
  validateDocumentsList,
  hasCorruptedEncoding,
  autoRepairMojibake,
} from '../services/dataValidator';

export default function ImportPage() {
  const [importType, setImportType] = useState('chefs');
  const [referentielCompetences, setReferentielCompetences] = useState([]);
  const [etudiantsList, setEtudiantsList] = useState([]);
  const [chefsList, setChefsList] = useState([]);

  // Donnees brutes en memoire pour permettre la correction directe
  const [rawRows, setRawRows] = useState([]);
  const [validationReport, setValidationReport] = useState(null);
  const [confirmWarnings, setConfirmWarnings] = useState(false);

  // Modale de correction rapide d une ligne
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modale de purge / zone danger
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const [purgeOptions, setPurgeOptions] = useState({
    documents: false,
    competences: false,
    etudiants: false,
    chefs: false,
    tout: false,
  });

  const loadBaseData = async () => {
    try {
      const [refComps, etuds, chefs] = await Promise.all([
        fetchReferentielCompetences(true),
        fetchEtudiants(),
        fetchChefsDeProjet(),
      ]);
      setReferentielCompetences(refComps || []);
      setEtudiantsList(etuds || []);
      setChefsList(chefs || []);
    } catch (err) {
      console.warn('Erreur chargement donnees de base:', err);
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  const importTypesList = [
    { value: 'chefs', label: 'Chefs de projet', hint: 'Fichier CSV / Excel (nom, specialite, email)', isDoc: false },
    { value: 'etudiants', label: 'Etudiants', hint: 'Fichier CSV / Excel (nom, prenom, email, parcours)', isDoc: false },
    { value: 'voeux', label: 'Voeux reels des etudiants (1er au 10eme choix Moodle)', hint: 'Fichier Moodle avec colonnes 1er a 10eme Choix', isDoc: false },
    { value: 'aptitudes', label: `Aptitudes techniques (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV de competences', isDoc: false },
    { value: 'apetences', label: `Appetences / Interets (${referentielCompetences.length} competences)`, hint: 'Questionnaire Moodle ou CSV d appetences', isDoc: false },
    { value: 'cv', label: 'CV des etudiants (Dossier Tout_CV)', hint: 'Selectionnez le dossier Tout_CV ou plusieurs fichiers PDF', isDoc: true },
    { value: 'lm', label: 'Lettres de motivation (Dossier Tout_LM)', hint: 'Selectionnez le dossier Tout_LM ou plusieurs fichiers PDF', isDoc: true },
  ];

  const activeType = importTypesList.find((t) => t.value === importType);

  // Fonction centrale pour recalculer le rapport d audit a partir des lignes en memoire
  const runAudit = (rowsToValidate, type = importType) => {
    let report = null;
    if (type === 'chefs') {
      report = validateChefsData(rowsToValidate);
    } else if (type === 'etudiants') {
      report = validateEtudiantsData(rowsToValidate);
    } else if (type === 'voeux') {
      report = validateVoeuxData(rowsToValidate, etudiantsList, chefsList);
    } else if (type === 'aptitudes' || type === 'apetences') {
      report = validateCompetencesScores(rowsToValidate, type, etudiantsList, referentielCompetences);
    }
    setValidationReport(report);
  };

  const handleSpreadsheetUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary', raw: false });

        const targetKeywords =
          importType === 'chefs' ? ['specialite', 'email'] :
          importType === 'etudiants' ? ['parcours', 'email', 'courriel'] :
          importType === 'voeux' ? ['choix', 'courriel', 'email'] :
          ['courriel', 'email', 'nom'];

        const sheetName = findBestSheetName(workbook, targetKeywords) || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        setRawRows(rawJson);
        runAudit(rawJson, importType);
        setConfirmWarnings(false);
      } catch (err) {
        setError(`Erreur lors de l analyse du fichier : ${err.message}`);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePdfFilesUpload = (filesList) => {
    try {
      setLoading(true);
      setError(null);
      const report = validateDocumentsList(filesList, etudiantsList);
      setValidationReport(report);
      setConfirmWarnings(false);
      setFileName(`${filesList.length} document(s) detecte(s) dans le dossier`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la lecture des dossiers.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccessMsg(null);
    setUploadProgress(null);
    setValidationReport(null);
    setConfirmWarnings(false);

    if (activeType?.isDoc) {
      handlePdfFilesUpload(files);
    } else {
      setFileName(files[0].name);
      handleSpreadsheetUpload(files[0]);
    }
  };

  // ACTION DIRECTE : Supprimer une ligne parasite (en memoire)
  const handleDeleteRow = (rowIndex) => {
    if (rowIndex <= 0 || rowIndex >= rawRows.length) return;
    const updated = rawRows.filter((_, idx) => idx !== rowIndex);
    setRawRows(updated);
    runAudit(updated, importType);
  };

  // ACTION DIRECTE : Ouvrir la modale pour modifier une ligne
  const handleOpenEditRowModal = (rowIndex) => {
    if (rowIndex <= 0 || rowIndex >= rawRows.length) return;
    const r = rawRows[rowIndex] || [];
    setEditingRowIndex(rowIndex);

    if (importType === 'chefs') {
      const rawNom = String(r[0] || '');
      const rawSpec = String(r[1] || '');
      setEditFormData({
        nom: hasCorruptedEncoding(rawNom) ? autoRepairMojibake(rawNom) : rawNom,
        specialite: hasCorruptedEncoding(rawSpec) ? autoRepairMojibake(rawSpec) : rawSpec,
        email: String(r[2] || ''),
        creneaux: String(r[3] || '15'),
      });
    } else if (importType === 'etudiants') {
      const col0 = String(r[0] || '');
      const col1 = String(r[1] || '');
      const col2 = String(r[2] || '');
      const col3 = String(r[3] || 'I2026');

      if (col0.includes('@')) {
        setEditFormData({
          formatEmailFirst: true,
          col0: col0,
          col1: col1 || 'I2026',
        });
      } else {
        setEditFormData({
          formatEmailFirst: false,
          nom: hasCorruptedEncoding(col0) ? autoRepairMojibake(col0) : col0,
          prenom: hasCorruptedEncoding(col1) ? autoRepairMojibake(col1) : col1,
          email: col2,
          parcours: col3 || 'I2026',
        });
      }
    }
    setShowEditModal(true);
  };

  // ACTION DIRECTE : Enregistrer les modifications de la ligne
  const handleSaveEditedRow = () => {
    if (editingRowIndex === null) return;
    const updated = [...rawRows];

    if (importType === 'chefs') {
      updated[editingRowIndex] = [
        editFormData.nom,
        editFormData.specialite,
        editFormData.email,
        editFormData.creneaux || '15',
      ];
    } else if (importType === 'etudiants') {
      if (editFormData.formatEmailFirst) {
        updated[editingRowIndex] = [
          editFormData.col0,
          editFormData.col1 || 'I2026',
        ];
      } else {
        updated[editingRowIndex] = [
          editFormData.nom,
          editFormData.prenom,
          editFormData.email,
          editFormData.parcours || 'I2026',
        ];
      }
    }

    setRawRows(updated);
    runAudit(updated, importType);
    setShowEditModal(false);
    setEditingRowIndex(null);
  };

  const handleImport = async () => {
    if (!validationReport || validationReport.status === 'BLOQUANT') return;
    if (validationReport.status === 'AVERTISSEMENT' && !confirmWarnings) {
      alert('Veuillez cocher la case confirmant la prise en compte des avertissements.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      if (activeType?.isDoc) {
        const batchPayload = validationReport.cleanPayload.map((item) => ({
          file: item.file,
          etudiant_id: item.student.id,
        }));

        setUploadProgress({ current: 0, total: batchPayload.length });

        const res = await uploadBatchDocuments(batchPayload, importType, (current, total) => {
          setUploadProgress({ current, total });
        });

        setSuccessMsg(
          `${res.success} fichier(s) (${importType.toUpperCase()}) associes et stockes avec succes dans Supabase Storage.`
        );
        setFileName('');
        setValidationReport(null);
        await loadBaseData();
      } else if (importType === 'voeux') {
        const result = await importVoeuxTransaction(validationReport.cleanPayload);
        setSuccessMsg(
          `Voeux importes avec succes en transaction securisee : ${result.selections_enregistrees} selections d entretien (Top 3) et ${result.voeux_enregistres} voeux complets enregistres (1 a 10).`
        );
        setFileName('');
        setValidationReport(null);
      } else {
        let result;
        if (importType === 'chefs') {
          result = await importChefsDeProjet(validationReport.cleanPayload);
        } else if (importType === 'etudiants') {
          result = await importEtudiants(validationReport.cleanPayload);
        } else if (importType === 'aptitudes') {
          result = await importAptitudes(validationReport.cleanPayload);
        } else if (importType === 'apetences') {
          result = await importApetences(validationReport.cleanPayload);
        }

        setSuccessMsg(`Import reussi : ${result?.length || validationReport.cleanPayload.length} ligne(s) enregistree(s) avec succes.`);
        setFileName('');
        setValidationReport(null);
        await loadBaseData();
      }
    } catch (err) {
      setError(err.message || "Erreur lors de l import.");
    } finally {
      setLoading(false);
    }
  };

  const handleExecutePurge = async () => {
    try {
      setResetting(true);
      setError(null);
      setSuccessMsg(null);

      const messages = [];

      if (purgeOptions.documents || purgeOptions.tout) {
        await purgeAllDocuments();
        messages.push('Fichiers CV et LM supprimes du Storage.');
      }

      if (purgeOptions.competences || purgeOptions.tout) {
        await resetAllEtudiantVoeux();
        messages.push('Voeux complets etudiants supprimes.');
      }

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

      const { error: rpcErr } = await supabase.rpc('reset_selective_data', { options: payloadRPC });
      if (rpcErr) throw rpcErr;

      messages.push('Donnees reinitialisees.');
      setSuccessMsg(`Purge reussie : ${messages.join(' ')}`);
      setShowResetModal(false);
      setConfirmText('');
      setPurgeOptions({ documents: false, competences: false, etudiants: false, chefs: false, tout: false });
      await loadBaseData();
    } catch (err) {
      setError(err.message || 'Erreur lors de la purge.');
    } finally {
      setResetting(false);
    }
  };

  const isButtonDisabled =
    loading ||
    !validationReport ||
    validationReport.status === 'BLOQUANT' ||
    (validationReport.status === 'AVERTISSEMENT' && !confirmWarnings) ||
    validationReport.cleanPayload.length === 0;

  const requiresConfirmText = purgeOptions.etudiants || purgeOptions.chefs || purgeOptions.tout;
  const isPurgeDisabled =
    resetting ||
    (!purgeOptions.documents && !purgeOptions.competences && !purgeOptions.etudiants && !purgeOptions.chefs && !purgeOptions.tout) ||
    (requiresConfirmText && confirmText !== 'CONFIRMER');

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
          color: #e2e8f0;
          font-weight: 700;
          font-size: 0.78rem;
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
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 0.5rem;
        }
        .import-type-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.6rem 0.8rem;
          border-radius: 10px;
          border: 1px solid var(--border-subtle);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .import-type-option:hover { background: rgba(255,255,255,0.05); }
        .import-type-option.active {
          border-color: var(--accent-cyan);
          background: var(--accent-cyan-soft);
        }
        .import-type-option input { accent-color: var(--accent-cyan); }
        .import-type-option .opt-label { font-weight: 700; font-size: 0.84rem; color: var(--text-primary); }
        .import-type-option .opt-hint { font-size: 0.7rem; color: var(--text-muted); }

        .import-dropzone {
          position: relative;
          border: 1.5px dashed var(--border-strong);
          border-radius: 12px;
          padding: 1.5rem 1rem;
          text-align: center;
          background: rgba(255,255,255,0.02);
          transition: all 0.15s ease;
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
        .import-dropzone .dz-text { font-size: 0.88rem; font-weight: 700; color: var(--text-primary); }
        .import-dropzone .dz-sub { font-size: 0.74rem; color: var(--text-muted); }
        .import-filename-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.5rem;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          background: var(--panel-raised);
          border: 1px solid var(--border-strong);
          font-size: 0.78rem;
          color: var(--text-primary);
          font-weight: 600;
        }

        .import-submit-btn {
          background: linear-gradient(135deg, var(--accent-emerald), #22b98c);
          border: none;
          color: #06231a;
          font-weight: 700;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          box-shadow: 0 4px 15px rgba(53, 208, 160, 0.3);
        }
        .import-submit-btn:disabled {
          background: var(--panel-raised);
          color: #64748b;
          opacity: 0.7;
          box-shadow: none;
        }

        /* Panneau d audit et corrections */
        .audit-panel {
          border-radius: 12px;
          border: 1px solid var(--border-strong);
          background: var(--panel-raised);
          padding: 1.15rem 1.35rem;
          margin-bottom: 1.25rem;
        }
        .audit-kpi-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 0.65rem;
          margin-bottom: 0.85rem;
        }
        .audit-kpi-card {
          background: var(--panel-solid);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .audit-kpi-label { font-size: 0.68rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; }
        .audit-kpi-val { font-size: 1.25rem; font-weight: 800; font-family: monospace; }
        
        .anomalies-list-box {
          max-height: 240px;
          overflow-y: auto;
          background: #0d1527;
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: 8px;
          padding: 0.5rem;
        }
        .anomaly-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.5rem 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.82rem;
          color: #f1f5f9;
        }
        .anomaly-row:last-child { border-bottom: none; }
        .anomaly-line-badge {
          background: rgba(45, 212, 191, 0.15);
          border: 1px solid rgba(45, 212, 191, 0.4);
          color: #2dd4bf;
          font-weight: 700;
          font-family: monospace;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .btn-correct-pill {
          background: rgba(45, 212, 191, 0.15);
          border: 1px solid rgba(45, 212, 191, 0.4);
          color: #2dd4bf;
          font-size: 0.72rem;
          font-weight: 600;
          border-radius: 6px;
          padding: 2px 8px;
          cursor: pointer;
        }
        .btn-correct-pill:hover {
          background: #2dd4bf;
          color: #06201c;
        }
        .btn-delete-row-pill {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          font-size: 0.72rem;
          font-weight: 600;
          border-radius: 6px;
          padding: 2px 8px;
          cursor: pointer;
        }
        .btn-delete-row-pill:hover {
          background: #dc2626;
          color: #fff;
        }

        .modal-dark .modal-content {
          background: #12161f !important;
          border: 1px solid var(--border-strong);
          border-radius: 16px;
          color: var(--text-primary);
        }
        .modal-dark .modal-header {
          border-bottom: 1px solid var(--border-subtle);
          background: rgba(45, 212, 191, 0.08);
        }
        .modal-dark .modal-footer {
          border-top: 1px solid var(--border-subtle);
        }
      `}</style>

      <Navbar />

      <div className="import-page-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Import et Gestion des donnees</h2>
            <small className="text-muted">
              Verification des donnees avec correction directe en ligne avant toute injection en base.
            </small>
          </div>

          <Button
            className="btn-danger-pill d-flex align-items-center gap-1 px-3 py-2 fw-semibold"
            size="sm"
            onClick={() => setShowResetModal(true)}
          >
            <span>Zone Danger / Purge et Reset</span>
          </Button>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
        {successMsg && <Alert variant="success" dismissible onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

        {/* Formulaire d importation */}
        <Card className="import-card mb-4 p-3 border-0">
          <div className="import-step-label"><span className="import-step-num">1</span> Choisissez le type de donnees</div>
          <div className="import-type-options mb-4">
            {importTypesList.map((t) => (
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
                    setFileName('');
                    setUploadProgress(null);
                    setValidationReport(null);
                    setConfirmWarnings(false);
                    setRawRows([]);
                  }}
                />
              </label>
            ))}
          </div>

          <Row className="g-3 align-items-center">
            <Col md={8}>
              <div className="import-step-label">
                <span className="import-step-num">2</span> 
                {activeType?.isDoc ? 'Selectionnez le dossier ou les fichiers' : 'Selectionnez le fichier CSV / Excel'}
              </div>
              <div className="import-dropzone">
                <input
                  type="file"
                  multiple
                  webkitdirectory={activeType?.isDoc ? "" : undefined}
                  directory={activeType?.isDoc ? "" : undefined}
                  accept={activeType?.isDoc ? undefined : '.csv, .xlsx, .xls'}
                  onChange={handleFileUpload}
                  aria-label="Selectionner le dossier ou les fichiers"
                />
                <div className="dz-text">
                  {activeType?.isDoc
                    ? `Cliquez pour choisir le dossier ${importType === 'cv' ? 'Tout_CV' : 'Tout_LM'} (ou glissez-le ici)`
                    : 'Cliquez ou glissez votre fichier CSV / Excel'}
                </div>
                <div className="dz-sub">{activeType?.hint}</div>
                {fileName && (
                  <div className="import-filename-chip">Fichier : {fileName}</div>
                )}
              </div>
            </Col>

            <Col md={4} className="d-flex flex-column justify-content-center">
              <div className="import-step-label"><span className="import-step-num">3</span> Injection en base</div>
              <Button
                className="w-100 import-submit-btn d-flex align-items-center justify-content-center"
                onClick={handleImport}
                disabled={isButtonDisabled}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Injection en cours...
                  </>
                ) : validationReport?.status === 'BLOQUANT' ? (
                  'Import bloque (corriger les erreurs ci-dessous)'
                ) : validationReport?.status === 'AVERTISSEMENT' && !confirmWarnings ? (
                  'Confirmer les alertes ci-dessous'
                ) : validationReport?.cleanPayload ? (
                  `Injecter ${validationReport.cleanPayload.length} element(s) valide(s)`
                ) : (
                  'En attente de fichier'
                )}
              </Button>

              {uploadProgress && (
                <div className="mt-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progression du stockage Cloud :</span>
                    <strong>{uploadProgress.current} / {uploadProgress.total}</strong>
                  </div>
                  <ProgressBar
                    animated
                    variant="success"
                    now={(uploadProgress.current / uploadProgress.total) * 100}
                    style={{ height: '8px' }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </Card>

        {/* Panneau d Audit et de Validation Pre-Import */}
        {validationReport && (
          <div className="audit-panel shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-white fs-6">Rapport d Audit Pre-Import</span>
                <Badge bg={validationReport.status === 'CONFORME' ? 'success' : validationReport.status === 'AVERTISSEMENT' ? 'warning' : 'danger'}>
                  Statut : {validationReport.status}
                </Badge>
              </div>

              {validationReport.status === 'AVERTISSEMENT' && (
                <Form.Check
                  type="checkbox"
                  id="confirm-warnings-check"
                  label="Je confirme avoir verifie les anomalies et je souhaite proceder a l importation"
                  checked={confirmWarnings}
                  onChange={(e) => setConfirmWarnings(e.target.checked)}
                  className="text-warning fw-semibold small"
                />
              )}
            </div>

            {/* Cartes KPI du rapport */}
            <div className="audit-kpi-row">
              <div className="audit-kpi-card">
                <span className="audit-kpi-label">Lignes analysees</span>
                <span className="audit-kpi-val text-white">{validationReport.stats.total}</span>
              </div>
              <div className="audit-kpi-card">
                <span className="audit-kpi-label">Lignes valides</span>
                <span className="audit-kpi-val text-success">{validationReport.stats.valides}</span>
              </div>
              <div className="audit-kpi-card">
                <span className="audit-kpi-label">Erreurs bloquantes</span>
                <span className="audit-kpi-val text-danger">{validationReport.stats.bloquants}</span>
              </div>
              <div className="audit-kpi-card">
                <span className="audit-kpi-label">Avertissements</span>
                <span className="audit-kpi-val text-warning">{validationReport.stats.alertes}</span>
              </div>
              {validationReport.stats.nonRepondants !== undefined && (
                <div className="audit-kpi-card">
                  <span className="audit-kpi-label">Sans voeux</span>
                  <span className="audit-kpi-val text-muted">{validationReport.stats.nonRepondants}</span>
                </div>
              )}
            </div>

            {/* Liste detaillee des anomalies avec actions directes */}
            {validationReport.anomalies.length > 0 && (
              <div>
                <span className="small text-white fw-bold mb-2 d-block">
                  Anomalies a resoudre directement sur l ecran :
                </span>
                <div className="anomalies-list-box">
                  {validationReport.anomalies.map((ano, aIdx) => (
                    <div key={aIdx} className="anomaly-row">
                      <div className="d-flex align-items-center gap-2 flex-grow-1 flex-wrap">
                        <Badge bg={ano.type === 'BLOQUANT' ? 'danger' : 'warning'} style={{ minWidth: '75px' }}>
                          {ano.type}
                        </Badge>
                        {ano.ligne > 0 && (
                          <span className="anomaly-line-badge">
                            Ligne {ano.ligne}
                          </span>
                        )}
                        <span className="text-white">{ano.message}</span>
                      </div>

                      {/* Boutons d action directe */}
                      {ano.rowIndex > 0 && (
                        <div className="d-flex gap-2 flex-shrink-0">
                          {(importType === 'etudiants' || importType === 'chefs') && (
                            <button
                              type="button"
                              className="btn-correct-pill"
                              onClick={() => handleOpenEditRowModal(ano.rowIndex)}
                            >
                              Corriger
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-delete-row-pill"
                            onClick={() => handleDeleteRow(ano.rowIndex)}
                            title="Supprimer cette ligne parasite du fichier importe"
                          >
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Previsualisation des Voeux Moodle (1er au 10eme choix) */}
        {importType === 'voeux' && validationReport?.cleanPayload?.length > 0 && (
          <Card className="import-card border-0 overflow-hidden mb-4">
            <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="text-white">
                Voeux reels extraits du questionnaire : <strong>{validationReport.cleanPayload.length} etudiants valides</strong>
              </span>
              <Badge bg="info">Rangs 1 a 10 prets pour injection</Badge>
            </div>
            <div className="import-preview-wrapper">
              <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>#</th>
                    <th style={{ textAlign: 'left' }}>Etudiant</th>
                    {Array.from({ length: 10 }, (_, i) => (
                      <th key={i + 1}>P{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validationReport.cleanPayload.slice(0, 50).map((w, idx) => (
                    <tr key={idx}>
                      <td className="text-muted">{idx + 1}</td>
                      <td>
                        <strong className="text-white">{w.nomComplet}</strong>
                      </td>
                      {Array.from({ length: 10 }, (_, i) => {
                        const rank = i + 1;
                        const choice = w.choices.find((c) => c.rank === rank);
                        if (!choice) return <td key={rank} className="text-center text-muted">-</td>;
                        return (
                          <td key={rank} className="text-center">
                            <Badge
                              bg={rank === 1 ? 'success' : rank === 2 ? 'info' : rank === 3 ? 'warning' : 'secondary'}
                              text={rank === 2 || rank === 3 ? 'dark' : 'white'}
                              style={{ fontSize: '0.7rem' }}
                            >
                              {choice.chefNom}
                            </Badge>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )}

        {/* Previsualisation classique CSV / Excel */}
        {!activeType?.isDoc && importType !== 'voeux' && validationReport?.cleanPayload?.length > 0 && (
          <Card className="import-card border-0 overflow-hidden">
            <div className="import-preview-header d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span className="text-white">
                Donnees verifiees et pretes a l injection : <strong>{fileName}</strong>
              </span>
              <Badge bg="info">{validationReport.cleanPayload.length} ligne(s) valide(s)</Badge>
            </div>
            <div className="import-preview-wrapper">
              <Table hover size="sm" className="import-preview-table mb-0 text-nowrap">
                <thead>
                  <tr>
                    <th>#</th>
                    {Object.keys(validationReport.cleanPayload[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {validationReport.cleanPayload.slice(0, 50).map((row, idx) => (
                    <tr key={idx}>
                      <td className="text-muted">{idx + 1}</td>
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="text-white">{String(val)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        )}
      </div>

      {/* Modale de Correction Directe d une Ligne */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.1rem', color: '#2dd4bf', fontWeight: 700 }}>
            Correction directe de la ligne {editingRowIndex !== null ? editingRowIndex + 1 : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {importType === 'etudiants' && (
            <>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Nom de famille</Form.Label>
                <Form.Control
                  size="sm"
                  value={editFormData.nom !== undefined ? editFormData.nom : (editFormData.col0 || '')}
                  onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value, col0: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Prenom</Form.Label>
                <Form.Control
                  size="sm"
                  value={editFormData.prenom !== undefined ? editFormData.prenom : (editFormData.col1 || '')}
                  onChange={(e) => setEditFormData({ ...editFormData, prenom: e.target.value, col1: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Adresse Email (Obligatoire)</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  placeholder="prenom.nom@2026.icam.fr"
                  value={editFormData.email !== undefined ? editFormData.email : (editFormData.col2 || '')}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value, col2: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Parcours</Form.Label>
                <Form.Control
                  size="sm"
                  value={editFormData.parcours || editFormData.col3 || 'I2026'}
                  onChange={(e) => setEditFormData({ ...editFormData, parcours: e.target.value, col3: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </>
          )}

          {importType === 'chefs' && (
            <>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Nom du Chef de projet</Form.Label>
                <Form.Control
                  size="sm"
                  value={editFormData.nom || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, nom: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Specialite / Intitule du projet</Form.Label>
                <Form.Control
                  size="sm"
                  value={editFormData.specialite || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, specialite: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Adresse Email</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small text-muted">Nombre maximal de creneaux</Form.Label>
                <Form.Control
                  size="sm"
                  type="number"
                  value={editFormData.creneaux || '15'}
                  onChange={(e) => setEditFormData({ ...editFormData, creneaux: e.target.value })}
                  className="bg-dark text-white border-secondary"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="success" size="sm" onClick={handleSaveEditedRow}>
            Valider la correction
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale Zone Danger */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} size="lg" centered className="modal-dark">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1.15rem', color: '#f87171' }}>
            Zone Danger - Purge et Remise a zero
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-light small mb-3">
            Cochez les elements que vous souhaitez purger ou supprimer pour redemarrer une nouvelle campagne :
          </p>

          <div className="p-3 rounded mb-3" style={{ background: 'var(--panel-raised)', border: '1px solid var(--border-strong)' }}>
            <Form.Check
              type="checkbox"
              id="purge-docs"
              label="Supprimer TOUS les fichiers CV et Lettres de motivation du Cloud (Storage)"
              checked={purgeOptions.documents}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, documents: e.target.checked }))}
              className="mb-2 text-white"
            />
            <Form.Check
              type="checkbox"
              id="purge-comp"
              label="Vider les Aptitudes et Appetences des etudiants"
              checked={purgeOptions.competences}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, competences: e.target.checked }))}
              className="mb-2 text-white"
            />
            <Form.Check
              type="checkbox"
              id="purge-etud"
              label="Supprimer TOUS les Etudiants (efface aussi leurs voeux, rendez-vous et evaluations)"
              checked={purgeOptions.etudiants}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, etudiants: e.target.checked }))}
              className="mb-2 text-warning"
            />
            <Form.Check
              type="checkbox"
              id="purge-chefs"
              label="Supprimer TOUS les Chefs de projet (efface aussi leurs disponibilites et rendez-vous)"
              checked={purgeOptions.chefs}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, chefs: e.target.checked }))}
              className="mb-2 text-warning"
            />
            <hr style={{ borderColor: 'var(--border-subtle)' }} />
            <Form.Check
              type="checkbox"
              id="purge-tout"
              label="TOUT REINITIALISER : Vider absolument toutes les donnees de campagne pour une nouvelle rentree"
              checked={purgeOptions.tout}
              onChange={(e) => setPurgeOptions((p) => ({ ...p, tout: e.target.checked }))}
              className="text-danger fw-bold"
            />
          </div>

          {requiresConfirmText && (
            <div className="p-3 rounded mb-3" style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <Form.Label className="small text-danger fw-bold mb-1">
                Securite : Tapez le mot « CONFIRMER » pour debloquer la suppression :
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
            Attention : Les donnees supprimees ne pourront pas etre recuperees.
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
            disabled={isPurgeDisabled}
          >
            {resetting ? <Spinner size="sm" animation="border" /> : 'Executer la purge selectionnee'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}