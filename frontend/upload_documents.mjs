import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. CONFIGURATION (Collez votre clé service_role ci-dessous)
const SUPABASE_URL = "https://qmyctkgvbfgcwffexkqh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteWN0a2d2YmZnY3dmZmV4a3FoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODAxNDY3MSwiZXhwIjoyMTAzNTkwNjcxfQ.1ul7exh7Gf6ID57oZoAsMoTzuQPXSf9ax4dsbwDI3a4";

// Indiquez le chemin complet vers votre dossier CV (qui contient Tout_CV et Tout_LM)
// Exemple : "C:/Users/toufik.guettari/.../backend/DataStorage/sept_2025_2/CV"
const BASE_FOLDER_PATH = "C:/authentication_app_Sept_2024-20260828T135127Z-1-001/authentication_app_Sept_2024/backend/DataStorage/sept_2025_2/CV";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// Helper pour normaliser les textes (retire accents, espaces, tirets, majuscules)
function cleanStr(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log("🚀 Démarrage de l'importation des documents vers Supabase Storage...\n");

  // 1. Récupération des étudiants depuis la base
  const { data: etudiants, error } = await supabase
    .from('etudiants')
    .select('id, nom, prenom, adresse_email');

  if (error || !etudiants || etudiants.length === 0) {
    console.error("❌ Erreur : Impossible de récupérer les étudiants de la base :", error?.message);
    return;
  }
  console.log(`📋 ${etudiants.length} étudiant(s) trouvés dans la base Supabase.\n`);

  // Map de matching intelligent
  function findEtudiantByFolderName(folderName) {
    const cleanedFolder = cleanStr(folderName);
    return etudiants.find((e) => {
      const nomPrenom = cleanStr(`${e.nom}${e.prenom}`);
      const prenomNom = cleanStr(`${e.prenom}${e.nom}`);
      const emailUser = cleanStr(e.adresse_email.split('@')[0]);

      return (
        cleanedFolder.includes(nomPrenom) ||
        cleanedFolder.includes(prenomNom) ||
        nomPrenom.includes(cleanedFolder) ||
        prenomNom.includes(cleanedFolder) ||
        cleanedFolder === emailUser
      );
    });
  }

  // Fonction pour traiter un sous-dossier (CV ou LM)
  async function processCategory(subDirName, type) {
    const targetDir = path.join(BASE_FOLDER_PATH, subDirName);
    if (!fs.existsSync(targetDir)) {
      console.warn(`⚠️ Dossier introuvable : ${targetDir}`);
      return;
    }

    const folders = fs.readdirSync(targetDir);
    console.log(`📁 Traitement de ${subDirName} (${folders.length} dossiers trouvés)...`);
    let successCount = 0;

    for (const folder of folders) {
      const studentFolder = path.join(targetDir, folder);
      if (!fs.statSync(studentFolder).isDirectory()) continue;

      const etudiant = findEtudiantByFolderName(folder);
      if (!etudiant) {
        console.warn(`   ⚠️ Aucun étudiant correspondant trouvé pour le dossier : "${folder}"`);
        continue;
      }

      // Trouver le premier fichier à l'intérieur
      const files = fs.readdirSync(studentFolder);
      if (files.length === 0) continue;
      const fileToUpload = path.join(studentFolder, files[0]);

      const fileBuffer = fs.readFileSync(fileToUpload);
      const storagePath = `${type}/${etudiant.id}.pdf`;

      // 1. Upload vers Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from('documents')
        .upload(storagePath, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadErr) {
        console.error(`   ❌ Erreur upload pour ${etudiant.nom} (${storagePath}):`, uploadErr.message);
        continue;
      }

      // 2. Mise à jour en base de données
      const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
      const { error: dbErr } = await supabase
        .from('etudiants')
        .update(updatePayload)
        .eq('id', etudiant.id);

      if (dbErr) {
        console.error(`   ❌ Erreur DB pour ${etudiant.nom}:`, dbErr.message);
      } else {
        successCount++;
        console.log(`   ✅ [${type.toUpperCase()}] ${etudiant.nom} ${etudiant.prenom} -> ${storagePath}`);
      }
    }

    console.log(`\n🎉 Fin de traitement pour ${subDirName} : ${successCount} fichier(s) uploadé(s) avec succès.\n`);
  }

  // Exécution pour Tout_CV puis Tout_LM
  await processCategory('Tout_CV', 'cv');
  await processCategory('Tout_LM', 'lm');

  console.log("🏁 Importation terminée avec succès !");
}

run();