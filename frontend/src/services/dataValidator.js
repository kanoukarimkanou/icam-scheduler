import * as XLSX from 'xlsx';
import { decodeHtmlEntities, findChefFromWishText, cleanTextForMatching } from './supabase';

// Nettoyage d une cellule texte (espaces, retours a la ligne, caracteres invisibles, BOM, entites HTML)
export const cleanCellString = (val) => {
  if (val === null || val === undefined) return '';
  return decodeHtmlEntities(String(val))
    .replace(/^\uFEFF/, '')
    .replace(/\u00A0/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .trim();
};

// Detection des caracteres speciaux ou mal encodes (mojibake UTF-8 / Windows-1252)
export const hasCorruptedEncoding = (str) => {
  if (!str) return false;
  const mojibakeRegex = /Ã©|Ã¨|Ã |Ãª|Ã§|Ã®|Ã´|Ã¹|Ã»|Ã¢|Ã«|Ã¯|Ã¼|Ã¶|Ã¤|Â|â€™|/i;
  return mojibakeRegex.test(str);
};

// Reparation automatique proposee en suggestion de correction
export const autoRepairMojibake = (str) => {
  if (!str) return '';
  return str
    .replace(/Ã©/g, 'e')
    .replace(/Ã¨/g, 'e')
    .replace(/Ã /g, 'a')
    .replace(/Ãª/g, 'e')
    .replace(/Ã§/g, 'c')
    .replace(/Ã®/g, 'i')
    .replace(/Ã´/g, 'o')
    .replace(/Ã¹/g, 'u')
    .replace(/Ã»/g, 'u')
    .replace(/Ã¢/g, 'a')
    .replace(/Ã«/g, 'e')
    .replace(/Ã¯/g, 'i')
    .replace(/â€™/g, "'")
    .replace(/Â/g, '')
    .replace(//g, '');
};

// Validation du format d adresse email
export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase().trim());
};

// Selection intelligente de l onglet pertinent dans un classeur Excel
export const findBestSheetName = (workbook, targetKeywords = []) => {
  if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
    return null;
  }

  if (workbook.SheetNames.length === 1) {
    return workbook.SheetNames[0];
  }

  for (const name of workbook.SheetNames) {
    const sheet = workbook.Sheets[name];
    if (!sheet) continue;
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (!json || json.length === 0) continue;

    const firstRowStr = (json[0] || []).map((c) => String(c).toLowerCase()).join(' ');
    const matches = targetKeywords.some((kw) => firstRowStr.includes(kw.toLowerCase()));
    if (matches) {
      return name;
    }
  }

  return workbook.SheetNames[0];
};

// ============================================================================
// 1. VALIDATION DES CHEFS DE PROJET
// ============================================================================
export const validateChefsData = (rows) => {
  const anomalies = [];
  const validRows = [];
  const seenEmails = new Set();

  if (!rows || rows.length < 2) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'fichier', message: 'Le fichier est vide ou ne contient pas de donnees.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const dataRows = rows.slice(1);

  dataRows.forEach((r, idx) => {
    const ligneNum = idx + 2;
    const rowIndex = idx + 1;
    const nom = cleanCellString(r[0]);
    const specialite = cleanCellString(r[1]);
    const email = cleanCellString(r[2]).toLowerCase();
    const rawCreneaux = parseInt(cleanCellString(r[3]), 10);
    const creneaux = !isNaN(rawCreneaux) && rawCreneaux > 0 ? rawCreneaux : 15;

    if (!nom && !specialite && !email) {
      return;
    }

    let isRowBlocked = false;

    if (!nom) {
      anomalies.push({ ligne: ligneNum, rowIndex, type: 'BLOQUANT', champ: 'nom', message: 'Le nom du chef de projet est obligatoire.', rawRow: r });
      isRowBlocked = true;
    } else if (hasCorruptedEncoding(nom)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'nom',
        message: `Caractere mal encode detecte dans le nom "${nom}". Suggestion : "${autoRepairMojibake(nom)}".`,
        rawRow: r,
      });
    }

    if (!specialite) {
      anomalies.push({ ligne: ligneNum, rowIndex, type: 'AVERTISSEMENT', champ: 'specialite', message: 'Specialite non renseignee. La valeur "Generaliste" sera attribuee.', rawRow: r });
    } else if (hasCorruptedEncoding(specialite)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'specialite',
        message: `Caractere mal encode detecte dans la specialite "${specialite}". Suggestion : "${autoRepairMojibake(specialite)}".`,
        rawRow: r,
      });
    }

    if (!email) {
      anomalies.push({ ligne: ligneNum, rowIndex, type: 'BLOQUANT', champ: 'email', message: `L adresse email est obligatoire pour "${nom || 'Intervenant inconnu'}".`, rawRow: r });
      isRowBlocked = true;
    } else if (!isValidEmail(email)) {
      anomalies.push({ ligne: ligneNum, rowIndex, type: 'BLOQUANT', champ: 'email', message: `Format d adresse email invalide : ${email}`, rawRow: r });
      isRowBlocked = true;
    } else if (seenEmails.has(email)) {
      anomalies.push({ ligne: ligneNum, rowIndex, type: 'BLOQUANT', champ: 'email', message: `Adresse email en doublon dans le fichier : ${email}`, rawRow: r });
      isRowBlocked = true;
    } else {
      seenEmails.add(email);
    }

    if (!isRowBlocked) {
      validRows.push({
        nom,
        specialite: specialite || 'Generaliste',
        email,
        max_creneaux_entretien: creneaux,
      });
    }
  });

  const bloquants = anomalies.filter((a) => a.type === 'BLOQUANT').length;
  const alertes = anomalies.filter((a) => a.type === 'AVERTISSEMENT').length;

  return {
    status: bloquants > 0 ? 'BLOQUANT' : alertes > 0 ? 'AVERTISSEMENT' : 'CONFORME',
    stats: { total: dataRows.length, valides: validRows.length, bloquants, alertes },
    anomalies,
    cleanPayload: validRows,
  };
};

// ============================================================================
// 2. VALIDATION DES ETUDIANTS
// ============================================================================
export const validateEtudiantsData = (rows) => {
  const anomalies = [];
  const validRows = [];
  const seenEmails = new Set();

  if (!rows || rows.length < 2) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'fichier', message: 'Le fichier ne contient pas de donnees.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const dataRows = rows.slice(1);

  dataRows.forEach((r, idx) => {
    const ligneNum = idx + 2;
    const rowIndex = idx + 1;
    const col0 = cleanCellString(r[0]);
    const col1 = cleanCellString(r[1]);
    const col2 = cleanCellString(r[2]);
    const col3 = cleanCellString(r[3]);

    if (!col0 && !col1 && !col2) return;

    let nom = '';
    let prenom = '';
    let email = '';
    let parcours = col3 || 'I2026';
    let isRowBlocked = false;

    if (col0.includes('@')) {
      email = col0.toLowerCase();
      parcours = col1 || 'I2026';
      const namePart = email.split('@')[0];
      const parts = namePart.split('.');
      if (parts.length >= 2) {
        prenom = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        nom = parts.slice(1).join(' ').toUpperCase();
      } else {
        nom = namePart.toUpperCase();
        prenom = '';
      }
    } else {
      nom = col0;
      prenom = col1;
      email = col2.toLowerCase();
    }

    if (!email) {
      const info = (nom || prenom) ? ` (Texte detecte : "${nom} ${prenom}". S agit-il d une ligne parasite ?)` : '';
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'BLOQUANT',
        champ: 'email',
        message: `Adresse email absente${info}`,
        rawRow: r,
      });
      isRowBlocked = true;
    } else if (!isValidEmail(email)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'BLOQUANT',
        champ: 'email',
        message: `Format d email invalide : "${email}" pour ${nom} ${prenom}`,
        rawRow: r,
      });
      isRowBlocked = true;
    } else if (seenEmails.has(email)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'BLOQUANT',
        champ: 'email',
        message: `Adresse email en doublon dans le fichier : "${email}"`,
        rawRow: r,
      });
      isRowBlocked = true;
    } else {
      seenEmails.add(email);
    }

    if (!nom) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'BLOQUANT',
        champ: 'nom',
        message: `Nom de famille manquant (Email : "${email}")`,
        rawRow: r,
      });
      isRowBlocked = true;
    } else if (hasCorruptedEncoding(nom)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'nom',
        message: `Caractere mal encode detecte dans le nom "${nom}". Suggestion : "${autoRepairMojibake(nom)}".`,
        rawRow: r,
      });
    }

    if (prenom && hasCorruptedEncoding(prenom)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'prenom',
        message: `Caractere mal encode detecte dans le prenom "${prenom}". Suggestion : "${autoRepairMojibake(prenom)}".`,
        rawRow: r,
      });
    }

    if (!isRowBlocked) {
      validRows.push({
        nom,
        prenom: prenom || '',
        adresse_email: email,
        parcours,
      });
    }
  });

  const bloquants = anomalies.filter((a) => a.type === 'BLOQUANT').length;
  const alertes = anomalies.filter((a) => a.type === 'AVERTISSEMENT').length;

  return {
    status: bloquants > 0 ? 'BLOQUANT' : alertes > 0 ? 'AVERTISSEMENT' : 'CONFORME',
    stats: { total: dataRows.length, valides: validRows.length, bloquants, alertes },
    anomalies,
    cleanPayload: validRows,
  };
};

// ============================================================================
// 3. VALIDATION DES VOEUX MOODLE (Choix 1 a 10)
// ============================================================================
export const validateVoeuxData = (rows, etudiantsList = [], chefsList = []) => {
  const anomalies = [];
  const cleanPayload = [];

  if (!etudiantsList || etudiantsList.length === 0) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'prerequis', message: 'La table des etudiants est vide. Veuillez importer les etudiants avant d importer les voeux.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  if (!chefsList || chefsList.length === 0) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'prerequis', message: 'La table des chefs de projet est vide. Veuillez importer les chefs de projet avant les voeux.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  if (!rows || rows.length < 2) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'fichier', message: 'Le fichier ne contient aucune donnee.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const firstRow = rows[0];
  const dataRows = rows.slice(1);

  const emailColIdx = firstRow.findIndex((col) => {
    const s = cleanCellString(col).toLowerCase();
    return s.includes('courriel') || s.includes('email');
  });

  if (emailColIdx === -1) {
    return {
      status: 'BLOQUANT',
      stats: { total: dataRows.length, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'structure', message: 'Colonne "adresse de courriel" introuvable dans la premiere ligne du fichier.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const findChoiceColIndex = (rank) => {
    return firstRow.findIndex((col) => {
      const s = cleanCellString(col).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (!s.includes('choix')) return false;
      if (rank === 1) return s.includes('1er') || s.includes('1 er') || s.includes('1e');
      if (rank === 2) return s.includes('2nd') || s.includes('2eme') || s.includes('2e');
      return s.includes(`${rank}eme`) || s.includes(`${rank}e`) || s.includes(`${rank} eme`);
    });
  };

  const choiceColsMap = [];
  for (let rank = 1; rank <= 10; rank++) {
    const colIdx = findChoiceColIndex(rank);
    if (colIdx >= 0) {
      choiceColsMap.push({ rank, colIdx });
    }
  }

  if (choiceColsMap.length === 0) {
    return {
      status: 'BLOQUANT',
      stats: { total: dataRows.length, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'structure', message: 'Aucune colonne de choix (1er Choix, 2nd Choix, etc.) n a ete reconnue dans l entete.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const etudiantsByEmail = new Map(etudiantsList.map((e) => [e.adresse_email.toLowerCase().trim(), e]));
  const seenEmailsInFile = new Map();
  const respondentsEmailSet = new Set();

  dataRows.forEach((r, idx) => {
    const ligneNum = idx + 2;
    const rowIndex = idx + 1;
    const email = cleanCellString(r[emailColIdx]).toLowerCase();

    if (!email) return;

    if (!isValidEmail(email)) {
      anomalies.push({ ligne: ligneNum, rowIndex, type: 'BLOQUANT', champ: 'email', message: `Adresse email invalide : ${email}`, rawRow: r });
      return;
    }

    if (seenEmailsInFile.has(email)) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'doublon',
        message: `Reponse multiple detectee pour ${email}. La ligne ${ligneNum} ecrasera la ligne precedente ${seenEmailsInFile.get(email)}.`,
        rawRow: r,
      });
    }
    seenEmailsInFile.set(email, ligneNum);
    respondentsEmailSet.add(email);

    const student = etudiantsByEmail.get(email);
    if (!student) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'etudiant',
        message: `L etudiant ${email} n est pas enregistre dans la base. Ses voeux ne pourront pas etre injectes.`,
        rawRow: r,
      });
      return;
    }

    const choices = [];
    const selectedChefsForStudent = new Set();

    choiceColsMap.forEach(({ rank, colIdx }) => {
      const txt = cleanCellString(r[colIdx]);
      if (!txt) return;

      const chef = findChefFromWishText(txt, chefsList);

      if (!chef) {
        anomalies.push({
          ligne: ligneNum,
          rowIndex,
          type: 'AVERTISSEMENT',
          champ: `choix_${rank}`,
          message: `Choix ${rank} non reconnu pour ${student.nom} ${student.prenom} : "${txt}"`,
          rawRow: r,
        });
        return;
      }

      if (selectedChefsForStudent.has(chef.id)) {
        anomalies.push({
          ligne: ligneNum,
          rowIndex,
          type: 'AVERTISSEMENT',
          champ: `choix_${rank}`,
          message: `Le chef ${chef.nom} a ete selectionne plusieurs fois par ${student.nom} ${student.prenom}. Seul le rang le plus prioritaire sera conserve.`,
          rawRow: r,
        });
        return;
      }

      selectedChefsForStudent.add(chef.id);
      choices.push({ rank, chefId: chef.id, chefNom: chef.nom });
    });

    const top3Count = choices.filter((c) => c.rank <= 3).length;
    if (top3Count < 3) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'top3',
        message: `L etudiant ${student.nom} ${student.prenom} n a formule que ${top3Count} choix valide(s) sur les 3 requis pour les entretiens.`,
        rawRow: r,
      });
    }

    if (choices.length > 0) {
      cleanPayload.push({
        etudiantId: student.id,
        nomComplet: `${student.nom} ${student.prenom}`.trim(),
        email,
        choices,
      });
    }
  });

  const nonRespondents = etudiantsList.filter((e) => !respondentsEmailSet.has(e.adresse_email.toLowerCase().trim()));
  if (nonRespondents.length > 0) {
    anomalies.push({
      ligne: 0,
      rowIndex: -1,
      type: 'AVERTISSEMENT',
      champ: 'non_repondants',
      message: `${nonRespondents.length} etudiant(s) inscrit(s) n ont formule aucun voeu : ${nonRespondents.map((e) => `${e.nom} ${e.prenom}`).join(', ')}.`,
      rawRow: [],
    });
  }

  const bloquants = anomalies.filter((a) => a.type === 'BLOQUANT').length;
  const alertes = anomalies.filter((a) => a.type === 'AVERTISSEMENT').length;

  return {
    status: bloquants > 0 ? 'BLOQUANT' : alertes > 0 ? 'AVERTISSEMENT' : 'CONFORME',
    stats: {
      total: dataRows.length,
      valides: cleanPayload.length,
      nonRepondants: nonRespondents.length,
      bloquants,
      alertes,
    },
    anomalies,
    cleanPayload,
  };
};

// ============================================================================
// 4. VALIDATION DU QUESTIONNAIRE APTITUDES / APPETENCES
// ============================================================================
export const validateCompetencesScores = (rows, type = 'aptitudes', etudiantsList = [], referentielCompetences = []) => {
  const anomalies = [];
  const cleanPayload = [];

  if (!etudiantsList || etudiantsList.length === 0) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'prerequis', message: 'La table des etudiants est vide. Veuillez importer les etudiants d abord.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  if (!referentielCompetences || referentielCompetences.length === 0) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'prerequis', message: 'Aucune competence active dans le referentiel. Veuillez configurer le referentiel d abord.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  if (!rows || rows.length < 2) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'fichier', message: 'Le fichier ne contient aucune donnee.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const firstRow = rows[0];
  const dataRows = rows.slice(1);

  const emailColIdx = firstRow.findIndex((col) => {
    const s = cleanCellString(col).toLowerCase();
    return s.includes('courriel') || s.includes('email');
  });

  if (emailColIdx === -1) {
    return {
      status: 'BLOQUANT',
      stats: { total: dataRows.length, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 1, rowIndex: 0, type: 'BLOQUANT', champ: 'structure', message: 'Colonne email/courriel introuvable.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const etudiantsByEmail = new Map(etudiantsList.map((e) => [e.adresse_email.toLowerCase().trim(), e]));
  const startOffset = type === 'aptitudes' ? 5 : (5 + referentielCompetences.length);

  dataRows.forEach((r, idx) => {
    const ligneNum = idx + 2;
    const rowIndex = idx + 1;
    const email = cleanCellString(r[emailColIdx]).toLowerCase();
    if (!email) return;

    const student = etudiantsByEmail.get(email);
    if (!student) {
      anomalies.push({
        ligne: ligneNum,
        rowIndex,
        type: 'AVERTISSEMENT',
        champ: 'etudiant',
        message: `Ligne ignoree : ${email} n est pas enregistre dans la table des etudiants.`,
        rawRow: r,
      });
      return;
    }

    const scores = { adresse_email: email, etudiant_id: student.id };
    referentielCompetences.forEach((comp, cIdx) => {
      const cellVal = r[startOffset + cIdx] !== undefined ? r[startOffset + cIdx] : r[cIdx + 1];
      const parsed = parseInt(cleanCellString(cellVal), 10);
      scores[comp.code] = !isNaN(parsed) && parsed >= 0 ? parsed : 0;
    });

    cleanPayload.push(scores);
  });

  const bloquants = anomalies.filter((a) => a.type === 'BLOQUANT').length;
  const alertes = anomalies.filter((a) => a.type === 'AVERTISSEMENT').length;

  return {
    status: bloquants > 0 ? 'BLOQUANT' : alertes > 0 ? 'AVERTISSEMENT' : 'CONFORME',
    stats: { total: dataRows.length, valides: cleanPayload.length, bloquants, alertes },
    anomalies,
    cleanPayload,
  };
};

// ============================================================================
// 5. VALIDATION DES DOCUMENTS (CV et Lettres de motivation)
// ============================================================================
export const validateDocumentsList = (filesList, etudiantsList = []) => {
  const anomalies = [];
  const cleanItems = [];

  if (!etudiantsList || etudiantsList.length === 0) {
    return {
      status: 'BLOQUANT',
      stats: { total: 0, valides: 0, bloquants: 1, alertes: 0 },
      anomalies: [{ ligne: 0, rowIndex: 0, type: 'BLOQUANT', champ: 'prerequis', message: 'La table des etudiants est vide. Impossible de rapprocher les documents.', rawRow: [] }],
      cleanPayload: [],
    };
  }

  const filesArray = Array.from(filesList || []);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  filesArray.forEach((file, idx) => {
    const fullPath = file.webkitRelativePath || file.name;
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

    let folderLabel = file.name;
    if (file.webkitRelativePath) {
      const parts = file.webkitRelativePath.split('/');
      if (parts.length >= 2) {
        folderLabel = `Dossier ${parts[parts.length - 2]} / ${file.name}`;
      }
    }

    if (!isPdf) {
      anomalies.push({
        ligne: idx + 1,
        rowIndex: idx,
        type: 'BLOQUANT',
        champ: 'format',
        message: `Fichier rejete : "${file.name}" n est pas un fichier PDF.`,
        rawRow: [file.name],
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      anomalies.push({
        ligne: idx + 1,
        rowIndex: idx,
        type: 'BLOQUANT',
        champ: 'taille',
        message: `Fichier trop volumineux : "${file.name}" depasse 5 Mo (${(file.size / (1024 * 1024)).toFixed(1)} Mo).`,
        rawRow: [file.name],
      });
      return;
    }

    const matchedStudent = findEtudiantForDocument(fullPath, etudiantsList);

    if (!matchedStudent) {
      anomalies.push({
        ligne: idx + 1,
        rowIndex: idx,
        type: 'AVERTISSEMENT',
        champ: 'etudiant',
        message: `Etudiant introuvable pour le document : "${folderLabel}". Verifiez l orthographe du dossier.`,
        rawRow: [folderLabel],
      });
      return;
    }

    cleanItems.push({
      file,
      fileName: folderLabel,
      student: matchedStudent,
      matched: true,
    });
  });

  const bloquants = anomalies.filter((a) => a.type === 'BLOQUANT').length;
  const alertes = anomalies.filter((a) => a.type === 'AVERTISSEMENT').length;

  return {
    status: bloquants > 0 ? 'BLOQUANT' : alertes > 0 ? 'AVERTISSEMENT' : 'CONFORME',
    stats: { total: filesArray.length, valides: cleanItems.length, bloquants, alertes },
    anomalies,
    cleanPayload: cleanItems,
  };
};