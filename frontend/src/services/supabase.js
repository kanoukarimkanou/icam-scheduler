// // // // // // // // import { createClient } from '@supabase/supabase-js';

// // // // // // // // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // // // // // // // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // // // // // // // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // // // // // // const emptySlots = () =>
// // // // // // // //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // // // // // // // const normalizeSlots = (slots) => {
// // // // // // // //   if (Array.isArray(slots)) {
// // // // // // // //     const obj = {};
// // // // // // // //     for (let i = 0; i < 40; i++) {
// // // // // // // //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// // // // // // // //     }
// // // // // // // //     return obj;
// // // // // // // //   }
// // // // // // // //   return slots;
// // // // // // // // };

// // // // // // // // // Normalisation des thématiques / spécialités
// // // // // // // // export const normalizeSpecialiteKey = (spec) => {
// // // // // // // //   if (!spec) return '';
// // // // // // // //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// // // // // // // //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// // // // // // // //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// // // // // // // //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// // // // // // // //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// // // // // // // //   if (clean.includes('auto')) return 'automatique_automatisme';
// // // // // // // //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// // // // // // // //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// // // // // // // //   if (clean.includes('vision')) return 'vision';
// // // // // // // //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// // // // // // // //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// // // // // // // //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// // // // // // // //   return clean.replace(/[^a-z0-9_]/g, '_');
// // // // // // // // };

// // // // // // // // // Calcul du classement des chefs pour un étudiant basé sur ses appétences
// // // // // // // // export const computeChefRanksForStudent = (etudiantAppetences, chefsList) => {
// // // // // // // //   if (!etudiantAppetences || !chefsList) return new Map();

// // // // // // // //   const scoredChefs = chefsList.map((chef) => {
// // // // // // // //     const key = normalizeSpecialiteKey(chef.specialite);
// // // // // // // //     const score = Number(etudiantAppetences[key] ?? 0);
// // // // // // // //     return {
// // // // // // // //       chef_id: chef.id,
// // // // // // // //       score,
// // // // // // // //       nom: chef.nom || '',
// // // // // // // //       specialite: chef.specialite,
// // // // // // // //     };
// // // // // // // //   });

// // // // // // // //   // Tri par appétence décroissante, puis par ordre alphabétique
// // // // // // // //   scoredChefs.sort((a, b) => {
// // // // // // // //     if (b.score !== a.score) return b.score - a.score;
// // // // // // // //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// // // // // // // //   });

// // // // // // // //   const rankMap = new Map();
// // // // // // // //   scoredChefs.forEach((sc, index) => {
// // // // // // // //     rankMap.set(sc.chef_id, {
// // // // // // // //       rank: index + 1,
// // // // // // // //       score: sc.score,
// // // // // // // //     });
// // // // // // // //   });

// // // // // // // //   return rankMap;
// // // // // // // // };

// // // // // // // // // ===== Documents (CV & Lettres de motivation) =====
// // // // // // // // export const getDocumentPublicUrl = (path) => {
// // // // // // // //   if (!path) return null;
// // // // // // // //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// // // // // // // //   return `${data.publicUrl}?t=${Date.now()}`;
// // // // // // // // };

// // // // // // // // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// // // // // // // //   if (!file) throw new Error('Aucun fichier sélectionné.');
// // // // // // // //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// // // // // // // //   const storagePath = `${type}/${etudiant_id}.pdf`;
// // // // // // // //   const { error: uploadErr } = await supabase.storage
// // // // // // // //     .from('documents')
// // // // // // // //     .upload(storagePath, file, {
// // // // // // // //       contentType: 'application/pdf',
// // // // // // // //       upsert: true,
// // // // // // // //     });
// // // // // // // //   if (uploadErr) throw uploadErr;

// // // // // // // //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// // // // // // // //   const { error: dbErr } = await supabase
// // // // // // // //     .from('etudiants')
// // // // // // // //     .update(updatePayload)
// // // // // // // //     .eq('id', etudiant_id);
// // // // // // // //   if (dbErr) throw dbErr;

// // // // // // // //   return storagePath;
// // // // // // // // };

// // // // // // // // // ===== Chefs de projet =====
// // // // // // // // export const fetchChefsDeProjet = async () => {
// // // // // // // //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // // ===== Étudiants =====
// // // // // // // // export const fetchEtudiants = async () => {
// // // // // // // //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const upsertEtudiant = async (etudiant) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('etudiants')
// // // // // // // //     .upsert(etudiant, { onConflict: 'adresse_email' })
// // // // // // // //     .select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // // ===== Aptitudes & Appétences =====
// // // // // // // // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('aptitudes')
// // // // // // // //     .select('*')
// // // // // // // //     .eq('etudiant_id', etudiant_id)
// // // // // // // //     .maybeSingle();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('apetences')
// // // // // // // //     .select('*')
// // // // // // // //     .eq('etudiant_id', etudiant_id)
// // // // // // // //     .maybeSingle();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const fetchAllApetences = async () => {
// // // // // // // //   const { data, error } = await supabase.from('apetences').select('*');
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data || [];
// // // // // // // // };

// // // // // // // // // ===== Sélections / Vœux (Sans priorité en base) =====
// // // // // // // // export const fetchSelections = async () => {
// // // // // // // //   const { data, error } = await supabase.from('selections').select(`
// // // // // // // //     id, etudiant_id, chef_de_projet_id,
// // // // // // // //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// // // // // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // // // // //   `);
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data.map((s) => ({
// // // // // // // //     id: s.id,
// // // // // // // //     etudiant: s.etudiants?.adresse_email,
// // // // // // // //     chefDeProjet: s.chefs_de_projet?.nom,
// // // // // // // //     etudiant_id: s.etudiant_id,
// // // // // // // //     chef_de_projet_id: s.chef_de_projet_id,
// // // // // // // //   }));
// // // // // // // // };

// // // // // // // // export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('selections')
// // // // // // // //     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// // // // // // // //     .select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('selections')
// // // // // // // //     .delete()
// // // // // // // //     .match({ etudiant_id, chef_de_projet_id });
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // // ===== Disponibilités =====
// // // // // // // // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('disponibilite_binaire_chefprojet')
// // // // // // // //     .select('*')
// // // // // // // //     .match({ chef_de_projet_id, date })
// // // // // // // //     .maybeSingle();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // // // // // // // };

// // // // // // // // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// // // // // // // //   const slotPayload = normalizeSlots(slots);
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('disponibilite_binaire_chefprojet')
// // // // // // // //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// // // // // // // //     .select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('disponibilite_binaire_etudiant')
// // // // // // // //     .select('*')
// // // // // // // //     .match({ etudiant_id, date })
// // // // // // // //     .maybeSingle();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data || { etudiant_id, date, ...emptySlots() };
// // // // // // // // };

// // // // // // // // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// // // // // // // //   const slotPayload = normalizeSlots(slots);
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('disponibilite_binaire_etudiant')
// // // // // // // //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// // // // // // // //     .select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // // ===== Rendez-vous =====
// // // // // // // // export const fetchRendezVous = async (date = null) => {
// // // // // // // //   let query = supabase
// // // // // // // //     .from('rendez_vous')
// // // // // // // //     .select(
// // // // // // // //       `
// // // // // // // //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// // // // // // // //       chefs_de_projet ( id, nom ),
// // // // // // // //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// // // // // // // //     `
// // // // // // // //     )
// // // // // // // //     .order('heure', { ascending: true });

// // // // // // // //   if (date) query = query.eq('date', date);

// // // // // // // //   const { data, error } = await query;
// // // // // // // //   if (error) throw error;

// // // // // // // //   return data.map((r) => ({
// // // // // // // //     id: r.id,
// // // // // // // //     date: r.date,
// // // // // // // //     heure_debut: r.heure?.slice(0, 5) || '',
// // // // // // // //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// // // // // // // //     chef_de_projet_id: r.chef_de_projet_id,
// // // // // // // //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// // // // // // // //     chef_de_projet: r.chefs_de_projet?.nom,
// // // // // // // //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// // // // // // // //     email_etudiant: r.etudiants?.adresse_email,
// // // // // // // //     cv_path: r.etudiants?.cv_path,
// // // // // // // //     lm_path: r.etudiants?.lm_path,
// // // // // // // //   }));
// // // // // // // // };

// // // // // // // // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// // // // // // // //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// // // // // // // //     method: 'POST',
// // // // // // // //     headers: {
// // // // // // // //       'Content-Type': 'application/json',
// // // // // // // //       Authorization: `Bearer ${token}`,
// // // // // // // //     },
// // // // // // // //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// // // // // // // //   });

// // // // // // // //   if (!response.ok) {
// // // // // // // //     const err = await response.json().catch(() => ({}));
// // // // // // // //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// // // // // // // //   }
// // // // // // // //   return await response.json();
// // // // // // // // };

// // // // // // // // // ===== Évaluations =====
// // // // // // // // export const fetchEvaluations = async () => {
// // // // // // // //   const { data, error } = await supabase.from('evaluations').select(`
// // // // // // // //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// // // // // // // //     etudiants ( nom, prenom, adresse_email ),
// // // // // // // //     chefs_de_projet ( nom )
// // // // // // // //   `);
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('evaluations')
// // // // // // // //     .upsert(
// // // // // // // //       { chef_de_projet_id, etudiant_id, note, commentaire },
// // // // // // // //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// // // // // // // //     )
// // // // // // // //     .select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // // ===== Affectations finales =====
// // // // // // // // export const fetchAffectations = async () => {
// // // // // // // //   const { data, error } = await supabase.from('affectation').select(`
// // // // // // // //     id, chef_de_projet_id, etudiant_id,
// // // // // // // //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// // // // // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // // // // //   `);
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('affectation')
// // // // // // // //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// // // // // // // //     .select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const deleteAffectation = async (etudiant_id) => {
// // // // // // // //   const { data, error } = await supabase
// // // // // // // //     .from('affectation')
// // // // // // // //     .delete()
// // // // // // // //     .eq('etudiant_id', etudiant_id);
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // // ===== Imports en Masse =====
// // // // // // // // export const importChefsDeProjet = async (rows) => {
// // // // // // // //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const importEtudiants = async (rows) => {
// // // // // // // //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const importAptitudes = async (rows) => {
// // // // // // // //   const etudiants = await fetchEtudiants();
// // // // // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // // // // //   const payload = rows
// // // // // // // //     .map((r) => {
// // // // // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // // // // //       if (!etudiant_id) return null;
// // // // // // // //       const { adresse_email, ...rest } = r;
// // // // // // // //       return { etudiant_id, ...rest };
// // // // // // // //     })
// // // // // // // //     .filter(Boolean);

// // // // // // // //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // // export const importApetences = async (rows) => {
// // // // // // // //   const etudiants = await fetchEtudiants();
// // // // // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // // // // //   const payload = rows
// // // // // // // //     .map((r) => {
// // // // // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // // // // //       if (!etudiant_id) return null;
// // // // // // // //       const { adresse_email, ...rest } = r;
// // // // // // // //       return { etudiant_id, ...rest };
// // // // // // // //     })
// // // // // // // //     .filter(Boolean);

// // // // // // // //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // // // // //   if (error) throw error;
// // // // // // // //   return data;
// // // // // // // // };

// // // // // // // import { createClient } from '@supabase/supabase-js';

// // // // // // // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // // // // // // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // // // // // // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // // // // // const emptySlots = () =>
// // // // // // //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // // // // // // const normalizeSlots = (slots) => {
// // // // // // //   if (Array.isArray(slots)) {
// // // // // // //     const obj = {};
// // // // // // //     for (let i = 0; i < 40; i++) {
// // // // // // //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// // // // // // //     }
// // // // // // //     return obj;
// // // // // // //   }
// // // // // // //   return slots;
// // // // // // // };

// // // // // // // // Normalisation des thématiques / spécialités
// // // // // // // export const normalizeSpecialiteKey = (spec) => {
// // // // // // //   if (!spec) return '';
// // // // // // //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// // // // // // //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// // // // // // //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// // // // // // //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// // // // // // //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// // // // // // //   if (clean.includes('auto')) return 'automatique_automatisme';
// // // // // // //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// // // // // // //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// // // // // // //   if (clean.includes('vision')) return 'vision';
// // // // // // //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// // // // // // //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// // // // // // //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// // // // // // //   return clean.replace(/[^a-z0-9_]/g, '_');
// // // // // // // };

// // // // // // // // Calcul du classement des chefs pour un étudiant basé sur ses appétences
// // // // // // // // (version client, utilisée pour toute la page — pas d'appel réseau)
// // // // // // // export const computeChefRanksForStudent = (etudiantAppetences, chefsList) => {
// // // // // // //   if (!etudiantAppetences || !chefsList) return new Map();

// // // // // // //   const scoredChefs = chefsList.map((chef) => {
// // // // // // //     const key = normalizeSpecialiteKey(chef.specialite);
// // // // // // //     const score = Number(etudiantAppetences[key] ?? 0);
// // // // // // //     return {
// // // // // // //       chef_id: chef.id,
// // // // // // //       score,
// // // // // // //       nom: chef.nom || '',
// // // // // // //       specialite: chef.specialite,
// // // // // // //     };
// // // // // // //   });

// // // // // // //   // Tri par appétence décroissante, puis par ordre alphabétique
// // // // // // //   scoredChefs.sort((a, b) => {
// // // // // // //     if (b.score !== a.score) return b.score - a.score;
// // // // // // //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// // // // // // //   });

// // // // // // //   const rankMap = new Map();
// // // // // // //   scoredChefs.forEach((sc, index) => {
// // // // // // //     rankMap.set(sc.chef_id, {
// // // // // // //       rank: index + 1,
// // // // // // //       score: sc.score,
// // // // // // //     });
// // // // // // //   });

// // // // // // //   return rankMap;
// // // // // // // };

// // // // // // // // Classement thématique des chefs de projet pour UN étudiant, recalculé
// // // // // // // // directement depuis la base (utile pour un recalcul ponctuel côté serveur,
// // // // // // // // hors du chargement global de la page qui utilise computeChefRanksForStudent).
// // // // // // // // Retourne : [{ chef_id, chef_nom, specialite, niveau_appetence, rang }, ...]
// // // // // // // export const getClassementThematiques = async (etudiant_id) => {
// // // // // // //   const [{ data: appetence, error: apErr }, { data: chefsList, error: chefErr }] = await Promise.all([
// // // // // // //     supabase.from('apetences').select('*').eq('etudiant_id', etudiant_id).maybeSingle(),
// // // // // // //     supabase.from('chefs_de_projet').select('id, nom, specialite'),
// // // // // // //   ]);
// // // // // // //   if (apErr) throw apErr;
// // // // // // //   if (chefErr) throw chefErr;

// // // // // // //   const scored = (chefsList || []).map((chef) => ({
// // // // // // //     chef_id: chef.id,
// // // // // // //     chef_nom: chef.nom,
// // // // // // //     specialite: chef.specialite,
// // // // // // //     niveau_appetence: Number(appetence?.[normalizeSpecialiteKey(chef.specialite)] ?? 0),
// // // // // // //   }));

// // // // // // //   scored.sort((a, b) => {
// // // // // // //     if (b.niveau_appetence !== a.niveau_appetence) return b.niveau_appetence - a.niveau_appetence;
// // // // // // //     return (a.chef_nom || '').localeCompare(b.chef_nom || '', 'fr', { sensitivity: 'base' });
// // // // // // //   });

// // // // // // //   return scored.map((s, index) => ({ ...s, rang: index + 1 }));
// // // // // // // };

// // // // // // // // ===== Documents (CV & Lettres de motivation) =====
// // // // // // // export const getDocumentPublicUrl = (path) => {
// // // // // // //   if (!path) return null;
// // // // // // //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// // // // // // //   return `${data.publicUrl}?t=${Date.now()}`;
// // // // // // // };

// // // // // // // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// // // // // // //   if (!file) throw new Error('Aucun fichier sélectionné.');
// // // // // // //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// // // // // // //   const storagePath = `${type}/${etudiant_id}.pdf`;
// // // // // // //   const { error: uploadErr } = await supabase.storage
// // // // // // //     .from('documents')
// // // // // // //     .upload(storagePath, file, {
// // // // // // //       contentType: 'application/pdf',
// // // // // // //       upsert: true,
// // // // // // //     });
// // // // // // //   if (uploadErr) throw uploadErr;

// // // // // // //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// // // // // // //   const { error: dbErr } = await supabase
// // // // // // //     .from('etudiants')
// // // // // // //     .update(updatePayload)
// // // // // // //     .eq('id', etudiant_id);
// // // // // // //   if (dbErr) throw dbErr;

// // // // // // //   return storagePath;
// // // // // // // };

// // // // // // // // ===== Chefs de projet =====
// // // // // // // export const fetchChefsDeProjet = async () => {
// // // // // // //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // // ===== Étudiants =====
// // // // // // // export const fetchEtudiants = async () => {
// // // // // // //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const upsertEtudiant = async (etudiant) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('etudiants')
// // // // // // //     .upsert(etudiant, { onConflict: 'adresse_email' })
// // // // // // //     .select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // // ===== Aptitudes & Appétences =====
// // // // // // // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('aptitudes')
// // // // // // //     .select('*')
// // // // // // //     .eq('etudiant_id', etudiant_id)
// // // // // // //     .maybeSingle();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('apetences')
// // // // // // //     .select('*')
// // // // // // //     .eq('etudiant_id', etudiant_id)
// // // // // // //     .maybeSingle();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const fetchAllApetences = async () => {
// // // // // // //   const { data, error } = await supabase.from('apetences').select('*');
// // // // // // //   if (error) throw error;
// // // // // // //   return data || [];
// // // // // // // };

// // // // // // // // ===== Sélections / Vœux =====
// // // // // // // export const fetchSelections = async () => {
// // // // // // //   const { data, error } = await supabase.from('selections').select(`
// // // // // // //     id, etudiant_id, chef_de_projet_id, priorite,
// // // // // // //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// // // // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // // // //   `);
// // // // // // //   if (error) throw error;
// // // // // // //   return data.map((s) => ({
// // // // // // //     id: s.id,
// // // // // // //     etudiant: s.etudiants?.adresse_email,
// // // // // // //     chefDeProjet: s.chefs_de_projet?.nom,
// // // // // // //     etudiant_id: s.etudiant_id,
// // // // // // //     chef_de_projet_id: s.chef_de_projet_id,
// // // // // // //     priorite: s.priorite,
// // // // // // //   }));
// // // // // // // };

// // // // // // // // priorite est optionnelle (défaut 1) pour rester compatible avec tous les
// // // // // // // // appels existants qui ne la passaient pas encore (toggleSelection manuel).
// // // // // // // export const saveSelection = async (etudiant_id, chef_de_projet_id, priorite = 1) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('selections')
// // // // // // //     .upsert({ etudiant_id, chef_de_projet_id, priorite }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// // // // // // //     .select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('selections')
// // // // // // //     .delete()
// // // // // // //     .match({ etudiant_id, chef_de_projet_id });
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // // ===== Disponibilités =====
// // // // // // // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('disponibilite_binaire_chefprojet')
// // // // // // //     .select('*')
// // // // // // //     .match({ chef_de_projet_id, date })
// // // // // // //     .maybeSingle();
// // // // // // //   if (error) throw error;
// // // // // // //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // // // // // // };

// // // // // // // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// // // // // // //   const slotPayload = normalizeSlots(slots);
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('disponibilite_binaire_chefprojet')
// // // // // // //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// // // // // // //     .select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('disponibilite_binaire_etudiant')
// // // // // // //     .select('*')
// // // // // // //     .match({ etudiant_id, date })
// // // // // // //     .maybeSingle();
// // // // // // //   if (error) throw error;
// // // // // // //   return data || { etudiant_id, date, ...emptySlots() };
// // // // // // // };

// // // // // // // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// // // // // // //   const slotPayload = normalizeSlots(slots);
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('disponibilite_binaire_etudiant')
// // // // // // //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// // // // // // //     .select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // // ===== Rendez-vous =====
// // // // // // // export const fetchRendezVous = async (date = null) => {
// // // // // // //   let query = supabase
// // // // // // //     .from('rendez_vous')
// // // // // // //     .select(
// // // // // // //       `
// // // // // // //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// // // // // // //       chefs_de_projet ( id, nom ),
// // // // // // //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// // // // // // //     `
// // // // // // //     )
// // // // // // //     .order('heure', { ascending: true });

// // // // // // //   if (date) query = query.eq('date', date);

// // // // // // //   const { data, error } = await query;
// // // // // // //   if (error) throw error;

// // // // // // //   return data.map((r) => ({
// // // // // // //     id: r.id,
// // // // // // //     date: r.date,
// // // // // // //     heure_debut: r.heure?.slice(0, 5) || '',
// // // // // // //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// // // // // // //     chef_de_projet_id: r.chef_de_projet_id,
// // // // // // //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// // // // // // //     chef_de_projet: r.chefs_de_projet?.nom,
// // // // // // //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// // // // // // //     email_etudiant: r.etudiants?.adresse_email,
// // // // // // //     cv_path: r.etudiants?.cv_path,
// // // // // // //     lm_path: r.etudiants?.lm_path,
// // // // // // //   }));
// // // // // // // };

// // // // // // // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// // // // // // //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// // // // // // //     method: 'POST',
// // // // // // //     headers: {
// // // // // // //       'Content-Type': 'application/json',
// // // // // // //       Authorization: `Bearer ${token}`,
// // // // // // //     },
// // // // // // //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// // // // // // //   });

// // // // // // //   if (!response.ok) {
// // // // // // //     const err = await response.json().catch(() => ({}));
// // // // // // //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// // // // // // //   }
// // // // // // //   return await response.json();
// // // // // // // };

// // // // // // // // ===== Évaluations =====
// // // // // // // export const fetchEvaluations = async () => {
// // // // // // //   const { data, error } = await supabase.from('evaluations').select(`
// // // // // // //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// // // // // // //     etudiants ( nom, prenom, adresse_email ),
// // // // // // //     chefs_de_projet ( nom )
// // // // // // //   `);
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('evaluations')
// // // // // // //     .upsert(
// // // // // // //       { chef_de_projet_id, etudiant_id, note, commentaire },
// // // // // // //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// // // // // // //     )
// // // // // // //     .select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // // ===== Affectations finales =====
// // // // // // // export const fetchAffectations = async () => {
// // // // // // //   const { data, error } = await supabase.from('affectation').select(`
// // // // // // //     id, chef_de_projet_id, etudiant_id,
// // // // // // //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// // // // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // // // //   `);
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('affectation')
// // // // // // //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// // // // // // //     .select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const deleteAffectation = async (etudiant_id) => {
// // // // // // //   const { data, error } = await supabase
// // // // // // //     .from('affectation')
// // // // // // //     .delete()
// // // // // // //     .eq('etudiant_id', etudiant_id);
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // // ===== Imports en Masse =====
// // // // // // // export const importChefsDeProjet = async (rows) => {
// // // // // // //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const importEtudiants = async (rows) => {
// // // // // // //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const importAptitudes = async (rows) => {
// // // // // // //   const etudiants = await fetchEtudiants();
// // // // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // // // //   const payload = rows
// // // // // // //     .map((r) => {
// // // // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // // // //       if (!etudiant_id) return null;
// // // // // // //       const { adresse_email, ...rest } = r;
// // // // // // //       return { etudiant_id, ...rest };
// // // // // // //     })
// // // // // // //     .filter(Boolean);

// // // // // // //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };

// // // // // // // export const importApetences = async (rows) => {
// // // // // // //   const etudiants = await fetchEtudiants();
// // // // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // // // //   const payload = rows
// // // // // // //     .map((r) => {
// // // // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // // // //       if (!etudiant_id) return null;
// // // // // // //       const { adresse_email, ...rest } = r;
// // // // // // //       return { etudiant_id, ...rest };
// // // // // // //     })
// // // // // // //     .filter(Boolean);

// // // // // // //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // // // //   if (error) throw error;
// // // // // // //   return data;
// // // // // // // };


// // // // // // import { createClient } from '@supabase/supabase-js';

// // // // // // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // // // // // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // // // // // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // // // // const emptySlots = () =>
// // // // // //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // // // // // const normalizeSlots = (slots) => {
// // // // // //   if (Array.isArray(slots)) {
// // // // // //     const obj = {};
// // // // // //     for (let i = 0; i < 40; i++) {
// // // // // //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// // // // // //     }
// // // // // //     return obj;
// // // // // //   }
// // // // // //   return slots;
// // // // // // };

// // // // // // // Normalisation des thématiques / spécialités
// // // // // // export const normalizeSpecialiteKey = (spec) => {
// // // // // //   if (!spec) return '';
// // // // // //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// // // // // //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// // // // // //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// // // // // //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// // // // // //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// // // // // //   if (clean.includes('auto')) return 'automatique_automatisme';
// // // // // //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// // // // // //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// // // // // //   if (clean.includes('vision')) return 'vision';
// // // // // //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// // // // // //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// // // // // //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// // // // // //   return clean.replace(/[^a-z0-9_]/g, '_');
// // // // // // };

// // // // // // // Calcul du classement des chefs pour un étudiant basé sur ses appétences
// // // // // // export const computeChefRanksForStudent = (etudiantAppetences, chefsList) => {
// // // // // //   if (!etudiantAppetences || !chefsList) return new Map();

// // // // // //   const scoredChefs = chefsList.map((chef) => {
// // // // // //     const key = normalizeSpecialiteKey(chef.specialite);
// // // // // //     const score = Number(etudiantAppetences[key] ?? 0);
// // // // // //     return {
// // // // // //       chef_id: chef.id,
// // // // // //       score,
// // // // // //       nom: chef.nom || '',
// // // // // //       specialite: chef.specialite,
// // // // // //     };
// // // // // //   });

// // // // // //   // Tri par appétence décroissante, puis par ordre alphabétique
// // // // // //   scoredChefs.sort((a, b) => {
// // // // // //     if (b.score !== a.score) return b.score - a.score;
// // // // // //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// // // // // //   });

// // // // // //   const rankMap = new Map();
// // // // // //   scoredChefs.forEach((sc, index) => {
// // // // // //     rankMap.set(sc.chef_id, {
// // // // // //       rank: index + 1,
// // // // // //       score: sc.score,
// // // // // //     });
// // // // // //   });

// // // // // //   return rankMap;
// // // // // // };

// // // // // // // Classement thématique des chefs de projet pour UN étudiant
// // // // // // export const getClassementThematiques = async (etudiant_id) => {
// // // // // //   const [{ data: appetence, error: apErr }, { data: chefsList, error: chefErr }] = await Promise.all([
// // // // // //     supabase.from('apetences').select('*').eq('etudiant_id', etudiant_id).maybeSingle(),
// // // // // //     supabase.from('chefs_de_projet').select('id, nom, specialite'),
// // // // // //   ]);
// // // // // //   if (apErr) throw apErr;
// // // // // //   if (chefErr) throw chefErr;

// // // // // //   const scored = (chefsList || []).map((chef) => ({
// // // // // //     chef_id: chef.id,
// // // // // //     chef_nom: chef.nom,
// // // // // //     specialite: chef.specialite,
// // // // // //     niveau_appetence: Number(appetence?.[normalizeSpecialiteKey(chef.specialite)] ?? 0),
// // // // // //   }));

// // // // // //   scored.sort((a, b) => {
// // // // // //     if (b.niveau_appetence !== a.niveau_appetence) return b.niveau_appetence - a.niveau_appetence;
// // // // // //     return (a.chef_nom || '').localeCompare(b.chef_nom || '', 'fr', { sensitivity: 'base' });
// // // // // //   });

// // // // // //   return scored.map((s, index) => ({ ...s, rang: index + 1 }));
// // // // // // };

// // // // // // // ===== Documents (CV & Lettres de motivation) =====
// // // // // // export const getDocumentPublicUrl = (path) => {
// // // // // //   if (!path) return null;
// // // // // //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// // // // // //   return `${data.publicUrl}?t=${Date.now()}`;
// // // // // // };

// // // // // // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// // // // // //   if (!file) throw new Error('Aucun fichier sélectionné.');
// // // // // //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// // // // // //   const storagePath = `${type}/${etudiant_id}.pdf`;
// // // // // //   const { error: uploadErr } = await supabase.storage
// // // // // //     .from('documents')
// // // // // //     .upload(storagePath, file, {
// // // // // //       contentType: 'application/pdf',
// // // // // //       upsert: true,
// // // // // //     });
// // // // // //   if (uploadErr) throw uploadErr;

// // // // // //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// // // // // //   const { error: dbErr } = await supabase
// // // // // //     .from('etudiants')
// // // // // //     .update(updatePayload)
// // // // // //     .eq('id', etudiant_id);
// // // // // //   if (dbErr) throw dbErr;

// // // // // //   return storagePath;
// // // // // // };

// // // // // // // ===== Chefs de projet =====
// // // // // // export const fetchChefsDeProjet = async () => {
// // // // // //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== Étudiants =====
// // // // // // export const fetchEtudiants = async () => {
// // // // // //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const upsertEtudiant = async (etudiant) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('etudiants')
// // // // // //     .upsert(etudiant, { onConflict: 'adresse_email' })
// // // // // //     .select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== Aptitudes & Appétences =====
// // // // // // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('aptitudes')
// // // // // //     .select('*')
// // // // // //     .eq('etudiant_id', etudiant_id)
// // // // // //     .maybeSingle();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('apetences')
// // // // // //     .select('*')
// // // // // //     .eq('etudiant_id', etudiant_id)
// // // // // //     .maybeSingle();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const fetchAllApetences = async () => {
// // // // // //   const { data, error } = await supabase.from('apetences').select('*');
// // // // // //   if (error) throw error;
// // // // // //   return data || [];
// // // // // // };

// // // // // // // ===== Sélections / Vœux =====
// // // // // // export const fetchSelections = async () => {
// // // // // //   const { data, error } = await supabase.from('selections').select(`
// // // // // //     id, etudiant_id, chef_de_projet_id,
// // // // // //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// // // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // // //   `);
// // // // // //   if (error) throw error;
// // // // // //   return data.map((s) => ({
// // // // // //     id: s.id,
// // // // // //     etudiant: s.etudiants?.adresse_email,
// // // // // //     chefDeProjet: s.chefs_de_projet?.nom,
// // // // // //     etudiant_id: s.etudiant_id,
// // // // // //     chef_de_projet_id: s.chef_de_projet_id,
// // // // // //   }));
// // // // // // };

// // // // // // export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('selections')
// // // // // //     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// // // // // //     .select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('selections')
// // // // // //     .delete()
// // // // // //     .match({ etudiant_id, chef_de_projet_id });
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== Disponibilités =====
// // // // // // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('disponibilite_binaire_chefprojet')
// // // // // //     .select('*')
// // // // // //     .match({ chef_de_projet_id, date })
// // // // // //     .maybeSingle();
// // // // // //   if (error) throw error;
// // // // // //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // // // // // };

// // // // // // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// // // // // //   const slotPayload = normalizeSlots(slots);
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('disponibilite_binaire_chefprojet')
// // // // // //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// // // // // //     .select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('disponibilite_binaire_etudiant')
// // // // // //     .select('*')
// // // // // //     .match({ etudiant_id, date })
// // // // // //     .maybeSingle();
// // // // // //   if (error) throw error;
// // // // // //   return data || { etudiant_id, date, ...emptySlots() };
// // // // // // };

// // // // // // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// // // // // //   const slotPayload = normalizeSlots(slots);
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('disponibilite_binaire_etudiant')
// // // // // //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// // // // // //     .select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== Rendez-vous =====
// // // // // // export const fetchRendezVous = async (date = null) => {
// // // // // //   let query = supabase
// // // // // //     .from('rendez_vous')
// // // // // //     .select(
// // // // // //       `
// // // // // //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// // // // // //       chefs_de_projet ( id, nom ),
// // // // // //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// // // // // //     `
// // // // // //     )
// // // // // //     .order('heure', { ascending: true });

// // // // // //   if (date) query = query.eq('date', date);

// // // // // //   const { data, error } = await query;
// // // // // //   if (error) throw error;

// // // // // //   return data.map((r) => ({
// // // // // //     id: r.id,
// // // // // //     date: r.date,
// // // // // //     heure_debut: r.heure?.slice(0, 5) || '',
// // // // // //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// // // // // //     chef_de_projet_id: r.chef_de_projet_id,
// // // // // //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// // // // // //     chef_de_projet: r.chefs_de_projet?.nom,
// // // // // //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// // // // // //     email_etudiant: r.etudiants?.adresse_email,
// // // // // //     cv_path: r.etudiants?.cv_path,
// // // // // //     lm_path: r.etudiants?.lm_path,
// // // // // //   }));
// // // // // // };

// // // // // // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// // // // // //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// // // // // //     method: 'POST',
// // // // // //     headers: {
// // // // // //       'Content-Type': 'application/json',
// // // // // //       Authorization: `Bearer ${token}`,
// // // // // //     },
// // // // // //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// // // // // //   });

// // // // // //   if (!response.ok) {
// // // // // //     const err = await response.json().catch(() => ({}));
// // // // // //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// // // // // //   }
// // // // // //   return await response.json();
// // // // // // };

// // // // // // // ===== Évaluations =====
// // // // // // export const fetchEvaluations = async () => {
// // // // // //   const { data, error } = await supabase.from('evaluations').select(`
// // // // // //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// // // // // //     etudiants ( nom, prenom, adresse_email ),
// // // // // //     chefs_de_projet ( nom )
// // // // // //   `);
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('evaluations')
// // // // // //     .upsert(
// // // // // //       { chef_de_projet_id, etudiant_id, note, commentaire },
// // // // // //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// // // // // //     )
// // // // // //     .select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== Affectations finales =====
// // // // // // export const fetchAffectations = async () => {
// // // // // //   const { data, error } = await supabase.from('affectation').select(`
// // // // // //     id, chef_de_projet_id, etudiant_id,
// // // // // //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// // // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // // //   `);
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('affectation')
// // // // // //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// // // // // //     .select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const deleteAffectation = async (etudiant_id) => {
// // // // // //   const { data, error } = await supabase
// // // // // //     .from('affectation')
// // // // // //     .delete()
// // // // // //     .eq('etudiant_id', etudiant_id);
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== Imports en Masse =====
// // // // // // export const importChefsDeProjet = async (rows) => {
// // // // // //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const importEtudiants = async (rows) => {
// // // // // //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const importAptitudes = async (rows) => {
// // // // // //   const etudiants = await fetchEtudiants();
// // // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // // //   const payload = rows
// // // // // //     .map((r) => {
// // // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // // //       if (!etudiant_id) return null;
// // // // // //       const { adresse_email, ...rest } = r;
// // // // // //       return { etudiant_id, ...rest };
// // // // // //     })
// // // // // //     .filter(Boolean);

// // // // // //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // export const importApetences = async (rows) => {
// // // // // //   const etudiants = await fetchEtudiants();
// // // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // // //   const payload = rows
// // // // // //     .map((r) => {
// // // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // // //       if (!etudiant_id) return null;
// // // // // //       const { adresse_email, ...rest } = r;
// // // // // //       return { etudiant_id, ...rest };
// // // // // //     })
// // // // // //     .filter(Boolean);

// // // // // //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // // //   if (error) throw error;
// // // // // //   return data;
// // // // // // };

// // // // // // // ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

// // // // // // // 1. Vider toutes les sélections
// // // // // // export const resetAllSelections = async () => {
// // // // // //   const { error } = await supabase.from('selections').delete().neq('id', 0);
// // // // // //   if (error) throw error;
// // // // // // };

// // // // // // // 2. Vider les rendez-vous
// // // // // // export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
// // // // // //   let query = supabase.from('rendez_vous').delete();
// // // // // //   if (dateDebut && dateFin) {
// // // // // //     query = query.gte('date', dateDebut).lte('date', dateFin);
// // // // // //   } else {
// // // // // //     query = query.neq('id', 0);
// // // // // //   }
// // // // // //   const { error } = await query;
// // // // // //   if (error) throw error;
// // // // // // };

// // // // // // // 3. Vider les évaluations
// // // // // // export const resetAllEvaluations = async () => {
// // // // // //   const { error } = await supabase.from('evaluations').delete().neq('id', 0);
// // // // // //   if (error) throw error;
// // // // // // };

// // // // // // // 4. Vider les affectations finales
// // // // // // export const resetAllAffectations = async () => {
// // // // // //   const { error } = await supabase.from('affectation').delete().neq('id', 0);
// // // // // //   if (error) throw error;
// // // // // // };

// // // // // // // 5. Vider les disponibilités
// // // // // // export const resetAllDisponibilites = async (cible = 'all', date = null) => {
// // // // // //   if (cible === 'chefs' || cible === 'all') {
// // // // // //     let q = supabase.from('disponibilite_binaire_chefprojet').delete();
// // // // // //     if (date) q = q.eq('date', date);
// // // // // //     else q = q.neq('id', 0);
// // // // // //     const { error } = await q;
// // // // // //     if (error) throw error;
// // // // // //   }
// // // // // //   if (cible === 'etudiants' || cible === 'all') {
// // // // // //     let q = supabase.from('disponibilite_binaire_etudiant').delete();
// // // // // //     if (date) q = q.eq('date', date);
// // // // // //     else q = q.neq('id', 0);
// // // // // //     const { error } = await q;
// // // // // //     if (error) throw error;
// // // // // //   }
// // // // // // };

// // // // // // // 6. Purger un document unitaire (CV ou LM)
// // // // // // export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
// // // // // //   const filePath = `${type}/${etudiant_id}.pdf`;
// // // // // //   await supabase.storage.from('documents').remove([filePath]);
// // // // // //   const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
// // // // // //   const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
// // // // // //   if (error) throw error;
// // // // // // };

// // // // // // // 7. Purger TOUS les documents (CV et LM) du Storage et de la base
// // // // // // export const purgeAllDocuments = async () => {
// // // // // //   const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
// // // // // //   if (cvFiles && cvFiles.length > 0) {
// // // // // //     await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
// // // // // //   }

// // // // // //   const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
// // // // // //   if (lmFiles && lmFiles.length > 0) {
// // // // // //     await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
// // // // // //   }

// // // // // //   const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
// // // // // //   if (error) throw error;
// // // // // // };

// // // // // import { createClient } from '@supabase/supabase-js';

// // // // // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // // // // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // // // // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // // // const emptySlots = () =>
// // // // //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // // // // const normalizeSlots = (slots) => {
// // // // //   if (Array.isArray(slots)) {
// // // // //     const obj = {};
// // // // //     for (let i = 0; i < 40; i++) {
// // // // //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// // // // //     }
// // // // //     return obj;
// // // // //   }
// // // // //   return slots;
// // // // // };

// // // // // // Normalisation des thématiques / spécialités
// // // // // export const normalizeSpecialiteKey = (spec) => {
// // // // //   if (!spec) return '';
// // // // //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// // // // //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// // // // //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// // // // //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// // // // //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// // // // //   if (clean.includes('auto')) return 'automatique_automatisme';
// // // // //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// // // // //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// // // // //   if (clean.includes('vision')) return 'vision';
// // // // //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// // // // //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// // // // //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// // // // //   return clean.replace(/[^a-z0-9_]/g, '_');
// // // // // };

// // // // // // Calcul du classement des chefs pour un étudiant basé sur ses appétences
// // // // // export const computeChefRanksForStudent = (etudiantAppetences, chefsList) => {
// // // // //   if (!etudiantAppetences || !chefsList) return new Map();

// // // // //   const scoredChefs = chefsList.map((chef) => {
// // // // //     const key = normalizeSpecialiteKey(chef.specialite);
// // // // //     const score = Number(etudiantAppetences[key] ?? 0);
// // // // //     return {
// // // // //       chef_id: chef.id,
// // // // //       score,
// // // // //       nom: chef.nom || '',
// // // // //       specialite: chef.specialite,
// // // // //     };
// // // // //   });

// // // // //   // Tri par appétence décroissante, puis par ordre alphabétique
// // // // //   scoredChefs.sort((a, b) => {
// // // // //     if (b.score !== a.score) return b.score - a.score;
// // // // //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// // // // //   });

// // // // //   const rankMap = new Map();
// // // // //   scoredChefs.forEach((sc, index) => {
// // // // //     rankMap.set(sc.chef_id, {
// // // // //       rank: index + 1,
// // // // //       score: sc.score,
// // // // //     });
// // // // //   });

// // // // //   return rankMap;
// // // // // };

// // // // // // Classement thématique des chefs de projet pour UN étudiant
// // // // // export const getClassementThematiques = async (etudiant_id) => {
// // // // //   const [{ data: appetence, error: apErr }, { data: chefsList, error: chefErr }] = await Promise.all([
// // // // //     supabase.from('apetences').select('*').eq('etudiant_id', etudiant_id).maybeSingle(),
// // // // //     supabase.from('chefs_de_projet').select('id, nom, specialite'),
// // // // //   ]);
// // // // //   if (apErr) throw apErr;
// // // // //   if (chefErr) throw chefErr;

// // // // //   const scored = (chefsList || []).map((chef) => ({
// // // // //     chef_id: chef.id,
// // // // //     chef_nom: chef.nom,
// // // // //     specialite: chef.specialite,
// // // // //     niveau_appetence: Number(appetence?.[normalizeSpecialiteKey(chef.specialite)] ?? 0),
// // // // //   }));

// // // // //   scored.sort((a, b) => {
// // // // //     if (b.niveau_appetence !== a.niveau_appetence) return b.niveau_appetence - a.niveau_appetence;
// // // // //     return (a.chef_nom || '').localeCompare(b.chef_nom || '', 'fr', { sensitivity: 'base' });
// // // // //   });

// // // // //   return scored.map((s, index) => ({ ...s, rang: index + 1 }));
// // // // // };

// // // // // // ===== Documents (CV & Lettres de motivation) =====
// // // // // export const getDocumentPublicUrl = (path) => {
// // // // //   if (!path) return null;
// // // // //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// // // // //   return `${data.publicUrl}?t=${Date.now()}`;
// // // // // };

// // // // // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// // // // //   if (!file) throw new Error('Aucun fichier sélectionné.');
// // // // //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// // // // //   const storagePath = `${type}/${etudiant_id}.pdf`;
// // // // //   const { error: uploadErr } = await supabase.storage
// // // // //     .from('documents')
// // // // //     .upload(storagePath, file, {
// // // // //       contentType: 'application/pdf',
// // // // //       upsert: true,
// // // // //     });
// // // // //   if (uploadErr) throw uploadErr;

// // // // //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// // // // //   const { error: dbErr } = await supabase
// // // // //     .from('etudiants')
// // // // //     .update(updatePayload)
// // // // //     .eq('id', etudiant_id);
// // // // //   if (dbErr) throw dbErr;

// // // // //   return storagePath;
// // // // // };

// // // // // // ===== Chefs de projet =====
// // // // // export const fetchChefsDeProjet = async () => {
// // // // //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== Étudiants =====
// // // // // export const fetchEtudiants = async () => {
// // // // //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const upsertEtudiant = async (etudiant) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('etudiants')
// // // // //     .upsert(etudiant, { onConflict: 'adresse_email' })
// // // // //     .select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== Aptitudes & Appétences =====
// // // // // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('aptitudes')
// // // // //     .select('*')
// // // // //     .eq('etudiant_id', etudiant_id)
// // // // //     .maybeSingle();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('apetences')
// // // // //     .select('*')
// // // // //     .eq('etudiant_id', etudiant_id)
// // // // //     .maybeSingle();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const fetchAllApetences = async () => {
// // // // //   const { data, error } = await supabase.from('apetences').select('*');
// // // // //   if (error) throw error;
// // // // //   return data || [];
// // // // // };

// // // // // // ===== Sélections / Vœux =====
// // // // // export const fetchSelections = async () => {
// // // // //   const { data, error } = await supabase.from('selections').select(`
// // // // //     id, etudiant_id, chef_de_projet_id,
// // // // //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // //   `);
// // // // //   if (error) throw error;
// // // // //   return data.map((s) => ({
// // // // //     id: s.id,
// // // // //     etudiant: s.etudiants?.adresse_email,
// // // // //     chefDeProjet: s.chefs_de_projet?.nom,
// // // // //     etudiant_id: s.etudiant_id,
// // // // //     chef_de_projet_id: s.chef_de_projet_id,
// // // // //   }));
// // // // // };

// // // // // export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('selections')
// // // // //     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// // // // //     .select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('selections')
// // // // //     .delete()
// // // // //     .match({ etudiant_id, chef_de_projet_id });
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== Disponibilités =====
// // // // // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('disponibilite_binaire_chefprojet')
// // // // //     .select('*')
// // // // //     .match({ chef_de_projet_id, date })
// // // // //     .maybeSingle();
// // // // //   if (error) throw error;
// // // // //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // // // // };

// // // // // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// // // // //   const slotPayload = normalizeSlots(slots);
// // // // //   const { data, error } = await supabase
// // // // //     .from('disponibilite_binaire_chefprojet')
// // // // //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// // // // //     .select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('disponibilite_binaire_etudiant')
// // // // //     .select('*')
// // // // //     .match({ etudiant_id, date })
// // // // //     .maybeSingle();
// // // // //   if (error) throw error;
// // // // //   return data || { etudiant_id, date, ...emptySlots() };
// // // // // };

// // // // // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// // // // //   const slotPayload = normalizeSlots(slots);
// // // // //   const { data, error } = await supabase
// // // // //     .from('disponibilite_binaire_etudiant')
// // // // //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// // // // //     .select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== Rendez-vous =====
// // // // // export const fetchRendezVous = async (date = null) => {
// // // // //   let query = supabase
// // // // //     .from('rendez_vous')
// // // // //     .select(
// // // // //       `
// // // // //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// // // // //       chefs_de_projet ( id, nom ),
// // // // //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// // // // //     `
// // // // //     )
// // // // //     .order('heure', { ascending: true });

// // // // //   if (date) query = query.eq('date', date);

// // // // //   const { data, error } = await query;
// // // // //   if (error) throw error;

// // // // //   return data.map((r) => ({
// // // // //     id: r.id,
// // // // //     date: r.date,
// // // // //     heure_debut: r.heure?.slice(0, 5) || '',
// // // // //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// // // // //     chef_de_projet_id: r.chef_de_projet_id,
// // // // //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// // // // //     chef_de_projet: r.chefs_de_projet?.nom,
// // // // //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// // // // //     email_etudiant: r.etudiants?.adresse_email,
// // // // //     cv_path: r.etudiants?.cv_path,
// // // // //     lm_path: r.etudiants?.lm_path,
// // // // //   }));
// // // // // };

// // // // // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// // // // //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// // // // //     method: 'POST',
// // // // //     headers: {
// // // // //       'Content-Type': 'application/json',
// // // // //       Authorization: `Bearer ${token}`,
// // // // //     },
// // // // //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// // // // //   });

// // // // //   if (!response.ok) {
// // // // //     const err = await response.json().catch(() => ({}));
// // // // //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// // // // //   }
// // // // //   return await response.json();
// // // // // };

// // // // // // ===== Évaluations =====
// // // // // export const fetchEvaluations = async () => {
// // // // //   const { data, error } = await supabase.from('evaluations').select(`
// // // // //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// // // // //     etudiants ( nom, prenom, adresse_email ),
// // // // //     chefs_de_projet ( nom )
// // // // //   `);
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('evaluations')
// // // // //     .upsert(
// // // // //       { chef_de_projet_id, etudiant_id, note, commentaire },
// // // // //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// // // // //     )
// // // // //     .select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== Affectations finales =====
// // // // // export const fetchAffectations = async () => {
// // // // //   const { data, error } = await supabase.from('affectation').select(`
// // // // //     id, chef_de_projet_id, etudiant_id,
// // // // //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// // // // //     chefs_de_projet ( id, nom, specialite, email )
// // // // //   `);
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('affectation')
// // // // //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// // // // //     .select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const deleteAffectation = async (etudiant_id) => {
// // // // //   const { data, error } = await supabase
// // // // //     .from('affectation')
// // // // //     .delete()
// // // // //     .eq('etudiant_id', etudiant_id);
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== Imports en Masse =====
// // // // // export const importChefsDeProjet = async (rows) => {
// // // // //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const importEtudiants = async (rows) => {
// // // // //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const importAptitudes = async (rows) => {
// // // // //   const etudiants = await fetchEtudiants();
// // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // //   const payload = rows
// // // // //     .map((r) => {
// // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // //       if (!etudiant_id) return null;
// // // // //       const { adresse_email, ...rest } = r;
// // // // //       return { etudiant_id, ...rest };
// // // // //     })
// // // // //     .filter(Boolean);

// // // // //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // export const importApetences = async (rows) => {
// // // // //   const etudiants = await fetchEtudiants();
// // // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // // //   const payload = rows
// // // // //     .map((r) => {
// // // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // // //       if (!etudiant_id) return null;
// // // // //       const { adresse_email, ...rest } = r;
// // // // //       return { etudiant_id, ...rest };
// // // // //     })
// // // // //     .filter(Boolean);

// // // // //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // // //   if (error) throw error;
// // // // //   return data;
// // // // // };

// // // // // // ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

// // // // // // 1. Vider toutes les sélections
// // // // // export const resetAllSelections = async () => {
// // // // //   const { error } = await supabase.from('selections').delete().neq('id', 0);
// // // // //   if (error) throw error;
// // // // // };

// // // // // // 2. Vider les rendez-vous
// // // // // export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
// // // // //   let query = supabase.from('rendez_vous').delete();
// // // // //   if (dateDebut && dateFin) {
// // // // //     query = query.gte('date', dateDebut).lte('date', dateFin);
// // // // //   } else {
// // // // //     query = query.neq('id', 0);
// // // // //   }
// // // // //   const { error } = await query;
// // // // //   if (error) throw error;
// // // // // };

// // // // // // 3. Vider les évaluations
// // // // // export const resetAllEvaluations = async () => {
// // // // //   const { error } = await supabase.from('evaluations').delete().neq('id', 0);
// // // // //   if (error) throw error;
// // // // // };

// // // // // // 4. Vider les affectations finales
// // // // // export const resetAllAffectations = async () => {
// // // // //   const { error } = await supabase.from('affectation').delete().neq('id', 0);
// // // // //   if (error) throw error;
// // // // // };

// // // // // // 5. Vider les disponibilités
// // // // // export const resetAllDisponibilites = async (cible = 'all', date = null) => {
// // // // //   if (cible === 'chefs' || cible === 'all') {
// // // // //     let q = supabase.from('disponibilite_binaire_chefprojet').delete();
// // // // //     if (date) q = q.eq('date', date);
// // // // //     else q = q.neq('id', 0);
// // // // //     const { error } = await q;
// // // // //     if (error) throw error;
// // // // //   }
// // // // //   if (cible === 'etudiants' || cible === 'all') {
// // // // //     let q = supabase.from('disponibilite_binaire_etudiant').delete();
// // // // //     if (date) q = q.eq('date', date);
// // // // //     else q = q.neq('id', 0);
// // // // //     const { error } = await q;
// // // // //     if (error) throw error;
// // // // //   }
// // // // // };

// // // // // // 6. Purger un document unitaire (CV ou LM)
// // // // // export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
// // // // //   const filePath = `${type}/${etudiant_id}.pdf`;
// // // // //   await supabase.storage.from('documents').remove([filePath]);
// // // // //   const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
// // // // //   const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
// // // // //   if (error) throw error;
// // // // // };

// // // // // // 7. Purger TOUS les documents (CV et LM) du Storage et de la base
// // // // // export const purgeAllDocuments = async () => {
// // // // //   const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
// // // // //   if (cvFiles && cvFiles.length > 0) {
// // // // //     await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
// // // // //   }

// // // // //   const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
// // // // //   if (lmFiles && lmFiles.length > 0) {
// // // // //     await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
// // // // //   }

// // // // //   const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
// // // // //   if (error) throw error;
// // // // // };

// // // // // // 8. Remise à zéro TOTALE (Base de données + Storage Cloud)
// // // // // export const resetEntireDatabaseAndStorage = async () => {
// // // // //   try {
// // // // //     await purgeAllDocuments();
// // // // //   } catch (err) {
// // // // //     console.warn('Storage déjà vide ou erreur purge:', err);
// // // // //   }

// // // // //   const { data, error } = await supabase.rpc('reset_all_campaign_data');
// // // // //   if (error) {
// // // // //     // Fallback via reset_selective_data si la procédure n'a pas été nommée à l'identique
// // // // //     const { error: fallbackErr } = await supabase.rpc('reset_selective_data', {
// // // // //       options: {
// // // // //         rendez_vous: true,
// // // // //         evaluations: true,
// // // // //         affectations: true,
// // // // //         selections: true,
// // // // //         disponibilites: true,
// // // // //         competences: true,
// // // // //         etudiants: true,
// // // // //         chefs: true,
// // // // //         users: true,
// // // // //       },
// // // // //     });
// // // // //     if (fallbackErr) throw fallbackErr;
// // // // //   }
// // // // //   return data;
// // // // // };

// // // // // // 9. Nettoyage complet des données client (Cookies, localStorage, sessionStorage, caches)
// // // // // export const clearClientStorageAndCookies = () => {
// // // // //   try {
// // // // //     localStorage.clear();
// // // // //     sessionStorage.clear();

// // // // //     const cookies = document.cookie.split(';');
// // // // //     for (let i = 0; i < cookies.length; i++) {
// // // // //       const cookie = cookies[i];
// // // // //       const eqPos = cookie.indexOf('=');
// // // // //       const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
// // // // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
// // // // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
// // // // //     }

// // // // //     if (window.caches) {
// // // // //       caches.keys().then((names) => {
// // // // //         for (const name of names) caches.delete(name);
// // // // //       });
// // // // //     }
// // // // //   } catch (err) {
// // // // //     console.warn('Erreur nettoyage client:', err);
// // // // //   }
// // // // // };


// // // // import { createClient } from '@supabase/supabase-js';

// // // // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // // // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // // // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // // const emptySlots = () =>
// // // //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // // // const normalizeSlots = (slots) => {
// // // //   if (Array.isArray(slots)) {
// // // //     const obj = {};
// // // //     for (let i = 0; i < 40; i++) {
// // // //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// // // //     }
// // // //     return obj;
// // // //   }
// // // //   return slots;
// // // // };

// // // // // Normalisation des thématiques / spécialités
// // // // export const normalizeSpecialiteKey = (spec) => {
// // // //   if (!spec) return '';
// // // //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// // // //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// // // //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// // // //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// // // //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// // // //   if (clean.includes('auto')) return 'automatique_automatisme';
// // // //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// // // //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// // // //   if (clean.includes('vision')) return 'vision';
// // // //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// // // //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// // // //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// // // //   return clean.replace(/[^a-z0-9_]/g, '_');
// // // // };

// // // // // Calcul du classement des chefs pour un étudiant basé sur ses appétences
// // // // export const computeChefRanksForStudent = (etudiantAppetences, chefsList) => {
// // // //   if (!etudiantAppetences || !chefsList) return new Map();

// // // //   const scoredChefs = chefsList.map((chef) => {
// // // //     const key = normalizeSpecialiteKey(chef.specialite);
// // // //     const score = Number(etudiantAppetences[key] ?? 0);
// // // //     return {
// // // //       chef_id: chef.id,
// // // //       score,
// // // //       nom: chef.nom || '',
// // // //       specialite: chef.specialite,
// // // //     };
// // // //   });

// // // //   // Tri par appétence décroissante, puis par ordre alphabétique
// // // //   scoredChefs.sort((a, b) => {
// // // //     if (b.score !== a.score) return b.score - a.score;
// // // //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// // // //   });

// // // //   const rankMap = new Map();
// // // //   scoredChefs.forEach((sc, index) => {
// // // //     rankMap.set(sc.chef_id, {
// // // //       rank: index + 1,
// // // //       score: sc.score,
// // // //     });
// // // //   });

// // // //   return rankMap;
// // // // };

// // // // // Classement thématique des chefs de projet pour UN étudiant
// // // // export const getClassementThematiques = async (etudiant_id) => {
// // // //   const [{ data: appetence, error: apErr }, { data: chefsList, error: chefErr }] = await Promise.all([
// // // //     supabase.from('apetences').select('*').eq('etudiant_id', etudiant_id).maybeSingle(),
// // // //     supabase.from('chefs_de_projet').select('id, nom, specialite'),
// // // //   ]);
// // // //   if (apErr) throw apErr;
// // // //   if (chefErr) throw chefErr;

// // // //   const scored = (chefsList || []).map((chef) => ({
// // // //     chef_id: chef.id,
// // // //     chef_nom: chef.nom,
// // // //     specialite: chef.specialite,
// // // //     niveau_appetence: Number(appetence?.[normalizeSpecialiteKey(chef.specialite)] ?? 0),
// // // //   }));

// // // //   scored.sort((a, b) => {
// // // //     if (b.niveau_appetence !== a.niveau_appetence) return b.niveau_appetence - a.niveau_appetence;
// // // //     return (a.chef_nom || '').localeCompare(b.chef_nom || '', 'fr', { sensitivity: 'base' });
// // // //   });

// // // //   return scored.map((s, index) => ({ ...s, rang: index + 1 }));
// // // // };

// // // // // ===== Documents (CV & Lettres de motivation) =====
// // // // export const getDocumentPublicUrl = (path) => {
// // // //   if (!path) return null;
// // // //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// // // //   return `${data.publicUrl}?t=${Date.now()}`;
// // // // };

// // // // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// // // //   if (!file) throw new Error('Aucun fichier sélectionné.');
// // // //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// // // //   const storagePath = `${type}/${etudiant_id}.pdf`;
// // // //   const { error: uploadErr } = await supabase.storage
// // // //     .from('documents')
// // // //     .upload(storagePath, file, {
// // // //       contentType: 'application/pdf',
// // // //       upsert: true,
// // // //     });
// // // //   if (uploadErr) throw uploadErr;

// // // //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// // // //   const { error: dbErr } = await supabase
// // // //     .from('etudiants')
// // // //     .update(updatePayload)
// // // //     .eq('id', etudiant_id);
// // // //   if (dbErr) throw dbErr;

// // // //   return storagePath;
// // // // };

// // // // // Normalisation de texte pour la détection intelligente des étudiants (PDF)
// // // // export const cleanTextForMatching = (str) => {
// // // //   return (str || '')
// // // //     .normalize('NFD')
// // // //     .replace(/[\u0300-\u036f]/g, '')
// // // //     .toLowerCase()
// // // //     .replace(/(\.pdf|_cv|_lm|cv|lm)/gi, '')
// // // //     .replace(/[^a-z0-9]/g, '');
// // // // };

// // // // // Retrouver l'étudiant correspondant au nom d'un fichier ou d'un dossier
// // // // export const findEtudiantForDocument = (filePathOrName, etudiantsList) => {
// // // //   if (!filePathOrName || !etudiantsList || etudiantsList.length === 0) return null;

// // // //   // 1. Détection si le nom est directement l'ID (ex: "42.pdf")
// // // //   const idMatch = filePathOrName.match(/^(\d+)(\.pdf)?$/i);
// // // //   if (idMatch) {
// // // //     const id = parseInt(idMatch[1], 10);
// // // //     const foundById = etudiantsList.find((e) => e.id === id);
// // // //     if (foundById) return foundById;
// // // //   }

// // // //   // 2. Détection par email
// // // //   const cleanEmailTarget = filePathOrName.toLowerCase().trim();
// // // //   const foundByEmail = etudiantsList.find((e) =>
// // // //     e.adresse_email && cleanEmailTarget.includes(e.adresse_email.toLowerCase())
// // // //   );
// // // //   if (foundByEmail) return foundByEmail;

// // // //   // 3. Détection par Nom / Prénom / Sous-dossier
// // // //   const cleanedTarget = cleanTextForMatching(filePathOrName);
// // // //   if (!cleanedTarget) return null;

// // // //   return etudiantsList.find((e) => {
// // // //     const nom = cleanTextForMatching(e.nom);
// // // //     const prenom = cleanTextForMatching(e.prenom);
// // // //     const nomPrenom = `${nom}${prenom}`;
// // // //     const prenomNom = `${prenom}${nom}`;
// // // //     const emailPrefix = cleanTextForMatching(e.adresse_email.split('@')[0]);

// // // //     return (
// // // //       (nom && prenom && (cleanedTarget.includes(nomPrenom) || cleanedTarget.includes(prenomNom))) ||
// // // //       (nomPrenom && nomPrenom.includes(cleanedTarget)) ||
// // // //       (prenomNom && prenomNom.includes(cleanedTarget)) ||
// // // //       (emailPrefix && (cleanedTarget.includes(emailPrefix) || emailPrefix.includes(cleanedTarget)))
// // // //     );
// // // //   }) || null;
// // // // };

// // // // // Téléversement par lot de documents avec barre de progression
// // // // export const uploadBatchDocuments = async (items, type = 'cv', onProgress = null) => {
// // // //   if (!items || items.length === 0) return { success: 0, errors: [] };

// // // //   let successCount = 0;
// // // //   const errors = [];

// // // //   for (let i = 0; i < items.length; i++) {
// // // //     const { file, etudiant_id } = items[i];
// // // //     try {
// // // //       await uploadDocument(etudiant_id, file, type);
// // // //       successCount++;
// // // //     } catch (err) {
// // // //       errors.push({ file: file.name, error: err.message });
// // // //     }
// // // //     if (onProgress) {
// // // //       onProgress(i + 1, items.length);
// // // //     }
// // // //   }

// // // //   return { success: successCount, total: items.length, errors };
// // // // };

// // // // // ===== Chefs de projet =====
// // // // export const fetchChefsDeProjet = async () => {
// // // //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== Étudiants =====
// // // // export const fetchEtudiants = async () => {
// // // //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const upsertEtudiant = async (etudiant) => {
// // // //   const { data, error } = await supabase
// // // //     .from('etudiants')
// // // //     .upsert(etudiant, { onConflict: 'adresse_email' })
// // // //     .select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== Aptitudes & Appétences =====
// // // // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// // // //   const { data, error } = await supabase
// // // //     .from('aptitudes')
// // // //     .select('*')
// // // //     .eq('etudiant_id', etudiant_id)
// // // //     .maybeSingle();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// // // //   const { data, error } = await supabase
// // // //     .from('apetences')
// // // //     .select('*')
// // // //     .eq('etudiant_id', etudiant_id)
// // // //     .maybeSingle();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const fetchAllApetences = async () => {
// // // //   const { data, error } = await supabase.from('apetences').select('*');
// // // //   if (error) throw error;
// // // //   return data || [];
// // // // };

// // // // // ===== Sélections / Vœux =====
// // // // export const fetchSelections = async () => {
// // // //   const { data, error } = await supabase.from('selections').select(`
// // // //     id, etudiant_id, chef_de_projet_id,
// // // //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// // // //     chefs_de_projet ( id, nom, specialite, email )
// // // //   `);
// // // //   if (error) throw error;
// // // //   return data.map((s) => ({
// // // //     id: s.id,
// // // //     etudiant: s.etudiants?.adresse_email,
// // // //     chefDeProjet: s.chefs_de_projet?.nom,
// // // //     etudiant_id: s.etudiant_id,
// // // //     chef_de_projet_id: s.chef_de_projet_id,
// // // //   }));
// // // // };

// // // // export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
// // // //   const { data, error } = await supabase
// // // //     .from('selections')
// // // //     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// // // //     .select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// // // //   const { data, error } = await supabase
// // // //     .from('selections')
// // // //     .delete()
// // // //     .match({ etudiant_id, chef_de_projet_id });
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== Disponibilités =====
// // // // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// // // //   const { data, error } = await supabase
// // // //     .from('disponibilite_binaire_chefprojet')
// // // //     .select('*')
// // // //     .match({ chef_de_projet_id, date })
// // // //     .maybeSingle();
// // // //   if (error) throw error;
// // // //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // // // };

// // // // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// // // //   const slotPayload = normalizeSlots(slots);
// // // //   const { data, error } = await supabase
// // // //     .from('disponibilite_binaire_chefprojet')
// // // //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// // // //     .select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// // // //   const { data, error } = await supabase
// // // //     .from('disponibilite_binaire_etudiant')
// // // //     .select('*')
// // // //     .match({ etudiant_id, date })
// // // //     .maybeSingle();
// // // //   if (error) throw error;
// // // //   return data || { etudiant_id, date, ...emptySlots() };
// // // // };

// // // // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// // // //   const slotPayload = normalizeSlots(slots);
// // // //   const { data, error } = await supabase
// // // //     .from('disponibilite_binaire_etudiant')
// // // //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// // // //     .select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== Rendez-vous =====
// // // // export const fetchRendezVous = async (date = null) => {
// // // //   let query = supabase
// // // //     .from('rendez_vous')
// // // //     .select(
// // // //       `
// // // //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// // // //       chefs_de_projet ( id, nom ),
// // // //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// // // //     `
// // // //     )
// // // //     .order('heure', { ascending: true });

// // // //   if (date) query = query.eq('date', date);

// // // //   const { data, error } = await query;
// // // //   if (error) throw error;

// // // //   return data.map((r) => ({
// // // //     id: r.id,
// // // //     date: r.date,
// // // //     heure_debut: r.heure?.slice(0, 5) || '',
// // // //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// // // //     chef_de_projet_id: r.chef_de_projet_id,
// // // //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// // // //     chef_de_projet: r.chefs_de_projet?.nom,
// // // //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// // // //     email_etudiant: r.etudiants?.adresse_email,
// // // //     cv_path: r.etudiants?.cv_path,
// // // //     lm_path: r.etudiants?.lm_path,
// // // //   }));
// // // // };

// // // // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// // // //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// // // //     method: 'POST',
// // // //     headers: {
// // // //       'Content-Type': 'application/json',
// // // //       Authorization: `Bearer ${token}`,
// // // //     },
// // // //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// // // //   });

// // // //   if (!response.ok) {
// // // //     const err = await response.json().catch(() => ({}));
// // // //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// // // //   }
// // // //   return await response.json();
// // // // };

// // // // // ===== Évaluations =====
// // // // export const fetchEvaluations = async () => {
// // // //   const { data, error } = await supabase.from('evaluations').select(`
// // // //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// // // //     etudiants ( nom, prenom, adresse_email ),
// // // //     chefs_de_projet ( nom )
// // // //   `);
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// // // //   const { data, error } = await supabase
// // // //     .from('evaluations')
// // // //     .upsert(
// // // //       { chef_de_projet_id, etudiant_id, note, commentaire },
// // // //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// // // //     )
// // // //     .select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== Affectations finales =====
// // // // export const fetchAffectations = async () => {
// // // //   const { data, error } = await supabase.from('affectation').select(`
// // // //     id, chef_de_projet_id, etudiant_id,
// // // //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// // // //     chefs_de_projet ( id, nom, specialite, email )
// // // //   `);
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// // // //   const { data, error } = await supabase
// // // //     .from('affectation')
// // // //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// // // //     .select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const deleteAffectation = async (etudiant_id) => {
// // // //   const { data, error } = await supabase
// // // //     .from('affectation')
// // // //     .delete()
// // // //     .eq('etudiant_id', etudiant_id);
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== Imports en Masse =====
// // // // export const importChefsDeProjet = async (rows) => {
// // // //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const importEtudiants = async (rows) => {
// // // //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const importAptitudes = async (rows) => {
// // // //   const etudiants = await fetchEtudiants();
// // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // //   const payload = rows
// // // //     .map((r) => {
// // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // //       if (!etudiant_id) return null;
// // // //       const { adresse_email, ...rest } = r;
// // // //       return { etudiant_id, ...rest };
// // // //     })
// // // //     .filter(Boolean);

// // // //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // export const importApetences = async (rows) => {
// // // //   const etudiants = await fetchEtudiants();
// // // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // // //   const payload = rows
// // // //     .map((r) => {
// // // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // // //       if (!etudiant_id) return null;
// // // //       const { adresse_email, ...rest } = r;
// // // //       return { etudiant_id, ...rest };
// // // //     })
// // // //     .filter(Boolean);

// // // //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // // //   if (error) throw error;
// // // //   return data;
// // // // };

// // // // // ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

// // // // export const resetAllSelections = async () => {
// // // //   const { error } = await supabase.from('selections').delete().neq('id', 0);
// // // //   if (error) throw error;
// // // // };

// // // // export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
// // // //   let query = supabase.from('rendez_vous').delete();
// // // //   if (dateDebut && dateFin) {
// // // //     query = query.gte('date', dateDebut).lte('date', dateFin);
// // // //   } else {
// // // //     query = query.neq('id', 0);
// // // //   }
// // // //   const { error } = await query;
// // // //   if (error) throw error;
// // // // };

// // // // export const resetAllEvaluations = async () => {
// // // //   const { error } = await supabase.from('evaluations').delete().neq('id', 0);
// // // //   if (error) throw error;
// // // // };

// // // // export const resetAllAffectations = async () => {
// // // //   const { error } = await supabase.from('affectation').delete().neq('id', 0);
// // // //   if (error) throw error;
// // // // };

// // // // export const resetAllDisponibilites = async (cible = 'all', date = null) => {
// // // //   if (cible === 'chefs' || cible === 'all') {
// // // //     let q = supabase.from('disponibilite_binaire_chefprojet').delete();
// // // //     if (date) q = q.eq('date', date);
// // // //     else q = q.neq('id', 0);
// // // //     const { error } = await q;
// // // //     if (error) throw error;
// // // //   }
// // // //   if (cible === 'etudiants' || cible === 'all') {
// // // //     let q = supabase.from('disponibilite_binaire_etudiant').delete();
// // // //     if (date) q = q.eq('date', date);
// // // //     else q = q.neq('id', 0);
// // // //     const { error } = await q;
// // // //     if (error) throw error;
// // // //   }
// // // // };

// // // // export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
// // // //   const filePath = `${type}/${etudiant_id}.pdf`;
// // // //   await supabase.storage.from('documents').remove([filePath]);
// // // //   const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
// // // //   const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
// // // //   if (error) throw error;
// // // // };

// // // // export const purgeAllDocuments = async () => {
// // // //   const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
// // // //   if (cvFiles && cvFiles.length > 0) {
// // // //     await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
// // // //   }

// // // //   const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
// // // //   if (lmFiles && lmFiles.length > 0) {
// // // //     await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
// // // //   }

// // // //   const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
// // // //   if (error) throw error;
// // // // };

// // // // export const resetEntireDatabaseAndStorage = async () => {
// // // //   try {
// // // //     await purgeAllDocuments();
// // // //   } catch (err) {
// // // //     console.warn('Storage déjà vide ou erreur purge:', err);
// // // //   }

// // // //   const { data, error } = await supabase.rpc('reset_all_campaign_data');
// // // //   if (error) {
// // // //     const { error: fallbackErr } = await supabase.rpc('reset_selective_data', {
// // // //       options: {
// // // //         rendez_vous: true,
// // // //         evaluations: true,
// // // //         affectations: true,
// // // //         selections: true,
// // // //         disponibilites: true,
// // // //         competences: true,
// // // //         etudiants: true,
// // // //         chefs: true,
// // // //         users: true,
// // // //       },
// // // //     });
// // // //     if (fallbackErr) throw fallbackErr;
// // // //   }
// // // //   return data;
// // // // };

// // // // export const clearClientStorageAndCookies = () => {
// // // //   try {
// // // //     localStorage.clear();
// // // //     sessionStorage.clear();

// // // //     const cookies = document.cookie.split(';');
// // // //     for (let i = 0; i < cookies.length; i++) {
// // // //       const cookie = cookies[i];
// // // //       const eqPos = cookie.indexOf('=');
// // // //       const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
// // // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
// // // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
// // // //     }

// // // //     if (window.caches) {
// // // //       caches.keys().then((names) => {
// // // //         for (const name of names) caches.delete(name);
// // // //       });
// // // //     }
// // // //   } catch (err) {
// // // //     console.warn('Erreur nettoyage client:', err);
// // // //   }
// // // // };


// // // import { createClient } from '@supabase/supabase-js';

// // // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // // const emptySlots = () =>
// // //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // // const normalizeSlots = (slots) => {
// // //   if (Array.isArray(slots)) {
// // //     const obj = {};
// // //     for (let i = 0; i < 40; i++) {
// // //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// // //     }
// // //     return obj;
// // //   }
// // //   return slots;
// // // };

// // // // Normalisation des thématiques / spécialités
// // // export const normalizeSpecialiteKey = (spec) => {
// // //   if (!spec) return '';
// // //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
// // //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// // //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// // //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// // //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// // //   if (clean.includes('auto')) return 'automatique_automatisme';
// // //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// // //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// // //   if (clean.includes('vision')) return 'vision';
// // //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// // //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// // //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// // //   return clean.replace(/[^a-z0-9_]/g, '_');
// // // };

// // // // Calcul du classement des chefs pour un étudiant basé sur ses appétences
// // // export const computeChefRanksForStudent = (etudiantAppetences, chefsList) => {
// // //   if (!etudiantAppetences || !chefsList) return new Map();

// // //   const scoredChefs = chefsList.map((chef) => {
// // //     const key = normalizeSpecialiteKey(chef.specialite);
// // //     const score = Number(etudiantAppetences[key] ?? 0);
// // //     return {
// // //       chef_id: chef.id,
// // //       score,
// // //       nom: chef.nom || '',
// // //       specialite: chef.specialite,
// // //     };
// // //   });

// // //   // Tri par appétence décroissante, puis par ordre alphabétique
// // //   scoredChefs.sort((a, b) => {
// // //     if (b.score !== a.score) return b.score - a.score;
// // //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// // //   });

// // //   const rankMap = new Map();
// // //   scoredChefs.forEach((sc, index) => {
// // //     rankMap.set(sc.chef_id, {
// // //       rank: index + 1,
// // //       score: sc.score,
// // //     });
// // //   });

// // //   return rankMap;
// // // };

// // // // Classement thématique des chefs de projet pour UN étudiant
// // // export const getClassementThematiques = async (etudiant_id) => {
// // //   const [{ data: appetence, error: apErr }, { data: chefsList, error: chefErr }] = await Promise.all([
// // //     supabase.from('apetences').select('*').eq('etudiant_id', etudiant_id).maybeSingle(),
// // //     supabase.from('chefs_de_projet').select('id, nom, specialite'),
// // //   ]);
// // //   if (apErr) throw apErr;
// // //   if (chefErr) throw chefErr;

// // //   const scored = (chefsList || []).map((chef) => ({
// // //     chef_id: chef.id,
// // //     chef_nom: chef.nom,
// // //     specialite: chef.specialite,
// // //     niveau_appetence: Number(appetence?.[normalizeSpecialiteKey(chef.specialite)] ?? 0),
// // //   }));

// // //   scored.sort((a, b) => {
// // //     if (b.niveau_appetence !== a.niveau_appetence) return b.niveau_appetence - a.niveau_appetence;
// // //     return (a.chef_nom || '').localeCompare(b.chef_nom || '', 'fr', { sensitivity: 'base' });
// // //   });

// // //   return scored.map((s, index) => ({ ...s, rang: index + 1 }));
// // // };

// // // // ===== Documents (CV & Lettres de motivation) =====
// // // export const getDocumentPublicUrl = (path) => {
// // //   if (!path) return null;
// // //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// // //   return `${data.publicUrl}?t=${Date.now()}`;
// // // };

// // // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// // //   if (!file) throw new Error('Aucun fichier sélectionné.');
// // //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// // //   const storagePath = `${type}/${etudiant_id}.pdf`;
// // //   const { error: uploadErr } = await supabase.storage
// // //     .from('documents')
// // //     .upload(storagePath, file, {
// // //       contentType: 'application/pdf',
// // //       upsert: true,
// // //     });
// // //   if (uploadErr) throw uploadErr;

// // //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// // //   const { error: dbErr } = await supabase
// // //     .from('etudiants')
// // //     .update(updatePayload)
// // //     .eq('id', etudiant_id);
// // //   if (dbErr) throw dbErr;

// // //   return storagePath;
// // // };

// // // // Normalisation de texte pour la détection intelligente des étudiants
// // // export const cleanTextForMatching = (str) => {
// // //   return (str || '')
// // //     .normalize('NFD')
// // //     .replace(/[\u0300-\u036f]/g, '')
// // //     .toLowerCase()
// // //     .replace(/(\.pdf|_cv|_lm|cv|lm)/gi, '')
// // //     .replace(/[^a-z0-9]/g, '');
// // // };

// // // // Retrouver l'étudiant correspondant au nom d'un sous-dossier ou d'un fichier
// // // export const findEtudiantForDocument = (filePathOrName, etudiantsList) => {
// // //   if (!filePathOrName || !etudiantsList || etudiantsList.length === 0) return null;

// // //   // 1. PRIORITÉ ABSOLUE AU NOM DU SOUS-DOSSIER PARENT (ex: "Tout_CV/Albert COUPEY/COUPEY_Albert_CV")
// // //   let target = filePathOrName;
// // //   if (filePathOrName.includes('/')) {
// // //     const parts = filePathOrName.split('/').filter(Boolean);
// // //     if (parts.length >= 2) {
// // //       target = parts[parts.length - 2];
// // //     }
// // //   } else if (filePathOrName.includes('\\')) {
// // //     const parts = filePathOrName.split('\\').filter(Boolean);
// // //     if (parts.length >= 2) {
// // //       target = parts[parts.length - 2];
// // //     }
// // //   }

// // //   // 2. Nettoyage de la chaîne
// // //   const cleanedTarget = cleanTextForMatching(target);
// // //   if (!cleanedTarget) return null;

// // //   // 3. Correspondance intelligente avec les étudiants en base
// // //   return etudiantsList.find((e) => {
// // //     const nom = cleanTextForMatching(e.nom);
// // //     const prenom = cleanTextForMatching(e.prenom);
// // //     const nomPrenom = `${nom}${prenom}`;
// // //     const prenomNom = `${prenom}${nom}`;
// // //     const emailPrefix = cleanTextForMatching(e.adresse_email?.split('@')[0]);

// // //     return (
// // //       (nom && prenom && (cleanedTarget.includes(nomPrenom) || cleanedTarget.includes(prenomNom))) ||
// // //       (nomPrenom && nomPrenom.includes(cleanedTarget)) ||
// // //       (prenomNom && prenomNom.includes(cleanedTarget)) ||
// // //       (emailPrefix && (cleanedTarget.includes(emailPrefix) || emailPrefix.includes(cleanedTarget)))
// // //     );
// // //   }) || null;
// // // };

// // // // Téléversement par lot de documents avec barre de progression
// // // export const uploadBatchDocuments = async (items, type = 'cv', onProgress = null) => {
// // //   if (!items || items.length === 0) return { success: 0, errors: [] };

// // //   let successCount = 0;
// // //   const errors = [];

// // //   for (let i = 0; i < items.length; i++) {
// // //     const { file, etudiant_id } = items[i];
// // //     try {
// // //       await uploadDocument(etudiant_id, file, type);
// // //       successCount++;
// // //     } catch (err) {
// // //       errors.push({ file: file.name, error: err.message });
// // //     }
// // //     if (onProgress) {
// // //       onProgress(i + 1, items.length);
// // //     }
// // //   }

// // //   return { success: successCount, total: items.length, errors };
// // // };

// // // // ===== Chefs de projet =====
// // // export const fetchChefsDeProjet = async () => {
// // //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== Étudiants =====
// // // export const fetchEtudiants = async () => {
// // //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const upsertEtudiant = async (etudiant) => {
// // //   const { data, error } = await supabase
// // //     .from('etudiants')
// // //     .upsert(etudiant, { onConflict: 'adresse_email' })
// // //     .select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== Aptitudes & Appétences =====
// // // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// // //   const { data, error } = await supabase
// // //     .from('aptitudes')
// // //     .select('*')
// // //     .eq('etudiant_id', etudiant_id)
// // //     .maybeSingle();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// // //   const { data, error } = await supabase
// // //     .from('apetences')
// // //     .select('*')
// // //     .eq('etudiant_id', etudiant_id)
// // //     .maybeSingle();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const fetchAllApetences = async () => {
// // //   const { data, error } = await supabase.from('apetences').select('*');
// // //   if (error) throw error;
// // //   return data || [];
// // // };

// // // // ===== Sélections / Vœux =====
// // // export const fetchSelections = async () => {
// // //   const { data, error } = await supabase.from('selections').select(`
// // //     id, etudiant_id, chef_de_projet_id,
// // //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// // //     chefs_de_projet ( id, nom, specialite, email )
// // //   `);
// // //   if (error) throw error;
// // //   return data.map((s) => ({
// // //     id: s.id,
// // //     etudiant: s.etudiants?.adresse_email,
// // //     chefDeProjet: s.chefs_de_projet?.nom,
// // //     etudiant_id: s.etudiant_id,
// // //     chef_de_projet_id: s.chef_de_projet_id,
// // //   }));
// // // };

// // // export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
// // //   const { data, error } = await supabase
// // //     .from('selections')
// // //     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// // //     .select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// // //   const { data, error } = await supabase
// // //     .from('selections')
// // //     .delete()
// // //     .match({ etudiant_id, chef_de_projet_id });
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== Disponibilités =====
// // // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// // //   const { data, error } = await supabase
// // //     .from('disponibilite_binaire_chefprojet')
// // //     .select('*')
// // //     .match({ chef_de_projet_id, date })
// // //     .maybeSingle();
// // //   if (error) throw error;
// // //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // // };

// // // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// // //   const slotPayload = normalizeSlots(slots);
// // //   const { data, error } = await supabase
// // //     .from('disponibilite_binaire_chefprojet')
// // //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// // //     .select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// // //   const { data, error } = await supabase
// // //     .from('disponibilite_binaire_etudiant')
// // //     .select('*')
// // //     .match({ etudiant_id, date })
// // //     .maybeSingle();
// // //   if (error) throw error;
// // //   return data || { etudiant_id, date, ...emptySlots() };
// // // };

// // // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// // //   const slotPayload = normalizeSlots(slots);
// // //   const { data, error } = await supabase
// // //     .from('disponibilite_binaire_etudiant')
// // //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// // //     .select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== Rendez-vous =====
// // // export const fetchRendezVous = async (date = null) => {
// // //   let query = supabase
// // //     .from('rendez_vous')
// // //     .select(
// // //       `
// // //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// // //       chefs_de_projet ( id, nom ),
// // //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// // //     `
// // //     )
// // //     .order('heure', { ascending: true });

// // //   if (date) query = query.eq('date', date);

// // //   const { data, error } = await query;
// // //   if (error) throw error;

// // //   return data.map((r) => ({
// // //     id: r.id,
// // //     date: r.date,
// // //     heure_debut: r.heure?.slice(0, 5) || '',
// // //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// // //     chef_de_projet_id: r.chef_de_projet_id,
// // //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// // //     chef_de_projet: r.chefs_de_projet?.nom,
// // //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// // //     email_etudiant: r.etudiants?.adresse_email,
// // //     cv_path: r.etudiants?.cv_path,
// // //     lm_path: r.etudiants?.lm_path,
// // //   }));
// // // };

// // // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// // //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// // //     method: 'POST',
// // //     headers: {
// // //       'Content-Type': 'application/json',
// // //       Authorization: `Bearer ${token}`,
// // //     },
// // //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// // //   });

// // //   if (!response.ok) {
// // //     const err = await response.json().catch(() => ({}));
// // //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// // //   }
// // //   return await response.json();
// // // };

// // // // ===== Évaluations =====
// // // export const fetchEvaluations = async () => {
// // //   const { data, error } = await supabase.from('evaluations').select(`
// // //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// // //     etudiants ( nom, prenom, adresse_email ),
// // //     chefs_de_projet ( nom )
// // //   `);
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// // //   const { data, error } = await supabase
// // //     .from('evaluations')
// // //     .upsert(
// // //       { chef_de_projet_id, etudiant_id, note, commentaire },
// // //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// // //     )
// // //     .select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== Affectations finales =====
// // // export const fetchAffectations = async () => {
// // //   const { data, error } = await supabase.from('affectation').select(`
// // //     id, chef_de_projet_id, etudiant_id,
// // //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// // //     chefs_de_projet ( id, nom, specialite, email )
// // //   `);
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// // //   const { data, error } = await supabase
// // //     .from('affectation')
// // //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// // //     .select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const deleteAffectation = async (etudiant_id) => {
// // //   const { data, error } = await supabase
// // //     .from('affectation')
// // //     .delete()
// // //     .eq('etudiant_id', etudiant_id);
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== Imports en Masse =====
// // // export const importChefsDeProjet = async (rows) => {
// // //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const importEtudiants = async (rows) => {
// // //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const importAptitudes = async (rows) => {
// // //   const etudiants = await fetchEtudiants();
// // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // //   const payload = rows
// // //     .map((r) => {
// // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // //       if (!etudiant_id) return null;
// // //       const { adresse_email, ...rest } = r;
// // //       return { etudiant_id, ...rest };
// // //     })
// // //     .filter(Boolean);

// // //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // export const importApetences = async (rows) => {
// // //   const etudiants = await fetchEtudiants();
// // //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// // //   const payload = rows
// // //     .map((r) => {
// // //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// // //       if (!etudiant_id) return null;
// // //       const { adresse_email, ...rest } = r;
// // //       return { etudiant_id, ...rest };
// // //     })
// // //     .filter(Boolean);

// // //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// // //   if (error) throw error;
// // //   return data;
// // // };

// // // // ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

// // // export const resetAllSelections = async () => {
// // //   const { error } = await supabase.from('selections').delete().neq('id', 0);
// // //   if (error) throw error;
// // // };

// // // export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
// // //   let query = supabase.from('rendez_vous').delete();
// // //   if (dateDebut && dateFin) {
// // //     query = query.gte('date', dateDebut).lte('date', dateFin);
// // //   } else {
// // //     query = query.neq('id', 0);
// // //   }
// // //   const { error } = await query;
// // //   if (error) throw error;
// // // };

// // // export const resetAllEvaluations = async () => {
// // //   const { error } = await supabase.from('evaluations').delete().neq('id', 0);
// // //   if (error) throw error;
// // // };

// // // export const resetAllAffectations = async () => {
// // //   const { error } = await supabase.from('affectation').delete().neq('id', 0);
// // //   if (error) throw error;
// // // };

// // // export const resetAllDisponibilites = async (cible = 'all', date = null) => {
// // //   if (cible === 'chefs' || cible === 'all') {
// // //     let q = supabase.from('disponibilite_binaire_chefprojet').delete();
// // //     if (date) q = q.eq('date', date);
// // //     else q = q.neq('id', 0);
// // //     const { error } = await q;
// // //     if (error) throw error;
// // //   }
// // //   if (cible === 'etudiants' || cible === 'all') {
// // //     let q = supabase.from('disponibilite_binaire_etudiant').delete();
// // //     if (date) q = q.eq('date', date);
// // //     else q = q.neq('id', 0);
// // //     const { error } = await q;
// // //     if (error) throw error;
// // //   }
// // // };

// // // export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
// // //   const filePath = `${type}/${etudiant_id}.pdf`;
// // //   await supabase.storage.from('documents').remove([filePath]);
// // //   const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
// // //   const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
// // //   if (error) throw error;
// // // };

// // // export const purgeAllDocuments = async () => {
// // //   const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
// // //   if (cvFiles && cvFiles.length > 0) {
// // //     await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
// // //   }

// // //   const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
// // //   if (lmFiles && lmFiles.length > 0) {
// // //     await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
// // //   }

// // //   const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
// // //   if (error) throw error;
// // // };

// // // export const resetEntireDatabaseAndStorage = async () => {
// // //   try {
// // //     await purgeAllDocuments();
// // //   } catch (err) {
// // //     console.warn('Storage déjà vide ou erreur purge:', err);
// // //   }

// // //   const { data, error } = await supabase.rpc('reset_all_campaign_data');
// // //   if (error) {
// // //     const { error: fallbackErr } = await supabase.rpc('reset_selective_data', {
// // //       options: {
// // //         rendez_vous: true,
// // //         evaluations: true,
// // //         affectations: true,
// // //         selections: true,
// // //         disponibilites: true,
// // //         competences: true,
// // //         etudiants: true,
// // //         chefs: true,
// // //         users: true,
// // //       },
// // //     });
// // //     if (fallbackErr) throw fallbackErr;
// // //   }
// // //   return data;
// // // };

// // // export const clearClientStorageAndCookies = () => {
// // //   try {
// // //     localStorage.clear();
// // //     sessionStorage.clear();

// // //     const cookies = document.cookie.split(';');
// // //     for (let i = 0; i < cookies.length; i++) {
// // //       const cookie = cookies[i];
// // //       const eqPos = cookie.indexOf('=');
// // //       const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
// // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
// // //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
// // //     }

// // //     if (window.caches) {
// // //       caches.keys().then((names) => {
// // //         for (const name of names) caches.delete(name);
// // //       });
// // //     }
// // //   } catch (err) {
// // //     console.warn('Erreur nettoyage client:', err);
// // //   }
// // // };


// // import { createClient } from '@supabase/supabase-js';

// // const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// // const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // const emptySlots = () =>
// //   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// // const normalizeSlots = (slots) => {
// //   if (Array.isArray(slots)) {
// //     const obj = {};
// //     for (let i = 0; i < 40; i++) {
// //       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
// //     }
// //     return obj;
// //   }
// //   return slots;
// // };

// // // ============================================================================
// // // RÉFÉRENTIEL DYNAMIQUE DES COMPÉTENCES (Paramétrable par Promotion)
// // // ============================================================================

// // export const DEFAULT_COMPETENCES = [
// //   { code: 'calculs_simulation_numerique', label: 'Calculs & Simulation', ordre: 1, actif: true },
// //   { code: 'essais_caracterisation', label: 'Essais & Caractérisation', ordre: 2, actif: true },
// //   { code: 'fabrication_prototypage', label: 'Fabrication & Proto', ordre: 3, actif: true },
// //   { code: 'conception_mecanique', label: 'Conception Méca', ordre: 4, actif: true },
// //   { code: 'automatique_automatisme', label: 'Automatique', ordre: 5, actif: true },
// //   { code: 'iot_systeme_embarque', label: 'IOT & Embarqué', ordre: 6, actif: true },
// //   { code: 'robot_cobot', label: 'Robot & Cobot', ordre: 7, actif: true },
// //   { code: 'vision', label: 'Vision Industrielle', ordre: 8, actif: true },
// //   { code: 'ia', label: 'Intelligence Artificielle', ordre: 9, actif: true },
// //   { code: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile', ordre: 10, actif: true },
// //   { code: 'ethique_ergonomie', label: 'Éthique & Ergonomie', ordre: 11, actif: true },
// // ];

// // export const fetchReferentielCompetences = async (onlyActive = true) => {
// //   let query = supabase.from('referentiel_competences').select('*').order('ordre', { ascending: true });
// //   if (onlyActive) query = query.eq('actif', true);
  
// //   const { data, error } = await query;
// //   if (error) throw error;
  
// //   if (!data || data.length === 0) {
// //     return DEFAULT_COMPETENCES.map((c, idx) => ({ id: idx + 1, ...c }));
// //   }
// //   return data;
// // };

// // export const saveReferentielCompetence = async (competence) => {
// //   const payload = {
// //     code: competence.code.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
// //     label: competence.label.trim(),
// //     description: competence.description?.trim() || '',
// //     ordre: Number(competence.ordre || 1),
// //     actif: competence.actif !== undefined ? competence.actif : true,
// //   };
// //   if (competence.id) payload.id = competence.id;

// //   const { data, error } = await supabase
// //     .from('referentiel_competences')
// //     .upsert(payload, { onConflict: 'code' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const deleteReferentielCompetence = async (id) => {
// //   const { data, error } = await supabase
// //     .from('referentiel_competences')
// //     .delete()
// //     .eq('id', id);
// //   if (error) throw error;
// //   return data;
// // };

// // export const resetReferentielToDefaults = async () => {
// //   const { data, error } = await supabase
// //     .from('referentiel_competences')
// //     .upsert(DEFAULT_COMPETENCES, { onConflict: 'code' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const fetchDynamicScoresByEtudiant = async (etudiant_id) => {
// //   const { data, error } = await supabase
// //     .from('etudiant_competences')
// //     .select(`
// //       competence_id, score_aptitude, score_appetence,
// //       referentiel_competences ( id, code, label, ordre, actif )
// //     `)
// //     .eq('etudiant_id', etudiant_id);
// //   if (error) throw error;

// //   const scoresMap = {};
// //   (data || []).forEach((row) => {
// //     const comp = row.referentiel_competences;
// //     if (comp && comp.actif) {
// //       scoresMap[comp.code] = {
// //         aptitude: row.score_aptitude ?? 0,
// //         appetence: row.score_appetence ?? 0,
// //         label: comp.label,
// //         ordre: comp.ordre,
// //       };
// //     }
// //   });

// //   return scoresMap;
// // };

// // export const normalizeSpecialiteKey = (spec, customCompetences = null) => {
// //   if (!spec) return '';
// //   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

// //   if (customCompetences && Array.isArray(customCompetences)) {
// //     const found = customCompetences.find((c) => {
// //       const cLabel = c.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// //       const cCode = c.code.toLowerCase();
// //       return clean.includes(cLabel) || clean.includes(cCode) || cLabel.includes(clean);
// //     });
// //     if (found) return found.code;
// //   }

// //   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
// //   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
// //   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
// //   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
// //   if (clean.includes('auto')) return 'automatique_automatisme';
// //   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
// //   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
// //   if (clean.includes('vision')) return 'vision';
// //   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
// //   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
// //   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
// //   return clean.replace(/[^a-z0-9_]/g, '_');
// // };

// // export const computeChefRanksForStudent = (etudiantAppetences, chefsList, referentielCompetences = null) => {
// //   if (!etudiantAppetences || !chefsList) return new Map();

// //   const scoredChefs = chefsList.map((chef) => {
// //     const key = normalizeSpecialiteKey(chef.specialite, referentielCompetences);
// //     const rawVal = etudiantAppetences[key];
// //     const score = Number(typeof rawVal === 'object' && rawVal !== null ? (rawVal.appetence ?? 0) : (rawVal ?? 0));
// //     return {
// //       chef_id: chef.id,
// //       score,
// //       nom: chef.nom || '',
// //       specialite: chef.specialite,
// //     };
// //   });

// //   scoredChefs.sort((a, b) => {
// //     if (b.score !== a.score) return b.score - a.score;
// //     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
// //   });

// //   const rankMap = new Map();
// //   scoredChefs.forEach((sc, index) => {
// //     rankMap.set(sc.chef_id, {
// //       rank: index + 1,
// //       score: sc.score,
// //     });
// //   });

// //   return rankMap;
// // };

// // // ===== Documents (CV & Lettres de motivation) =====
// // export const getDocumentPublicUrl = (path) => {
// //   if (!path) return null;
// //   const { data } = supabase.storage.from('documents').getPublicUrl(path);
// //   return `${data.publicUrl}?t=${Date.now()}`;
// // };

// // export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
// //   if (!file) throw new Error('Aucun fichier sélectionné.');
// //   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
// //   const storagePath = `${type}/${etudiant_id}.pdf`;
// //   const { error: uploadErr } = await supabase.storage
// //     .from('documents')
// //     .upload(storagePath, file, {
// //       contentType: 'application/pdf',
// //       upsert: true,
// //     });
// //   if (uploadErr) throw uploadErr;

// //   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
// //   const { error: dbErr } = await supabase
// //     .from('etudiants')
// //     .update(updatePayload)
// //     .eq('id', etudiant_id);
// //   if (dbErr) throw dbErr;

// //   return storagePath;
// // };

// // export const cleanTextForMatching = (str) => {
// //   return (str || '')
// //     .normalize('NFD')
// //     .replace(/[\u0300-\u036f]/g, '')
// //     .toLowerCase()
// //     .replace(/(\.pdf|_cv|_lm|cv|lm)/gi, '')
// //     .replace(/[^a-z0-9]/g, '');
// // };

// // export const findEtudiantForDocument = (filePathOrName, etudiantsList) => {
// //   if (!filePathOrName || !etudiantsList || etudiantsList.length === 0) return null;

// //   let target = filePathOrName;
// //   if (filePathOrName.includes('/')) {
// //     const parts = filePathOrName.split('/').filter(Boolean);
// //     if (parts.length >= 2) target = parts[parts.length - 2];
// //   } else if (filePathOrName.includes('\\')) {
// //     const parts = filePathOrName.split('\\').filter(Boolean);
// //     if (parts.length >= 2) target = parts[parts.length - 2];
// //   }

// //   const cleanedTarget = cleanTextForMatching(target);
// //   if (!cleanedTarget) return null;

// //   return etudiantsList.find((e) => {
// //     const nom = cleanTextForMatching(e.nom);
// //     const prenom = cleanTextForMatching(e.prenom);
// //     const nomPrenom = `${nom}${prenom}`;
// //     const prenomNom = `${prenom}${nom}`;
// //     const emailPrefix = cleanTextForMatching(e.adresse_email?.split('@')[0]);

// //     return (
// //       (nom && prenom && (cleanedTarget.includes(nomPrenom) || cleanedTarget.includes(prenomNom))) ||
// //       (nomPrenom && nomPrenom.includes(cleanedTarget)) ||
// //       (prenomNom && prenomNom.includes(cleanedTarget)) ||
// //       (emailPrefix && (cleanedTarget.includes(emailPrefix) || emailPrefix.includes(cleanedTarget)))
// //     );
// //   }) || null;
// // };

// // export const uploadBatchDocuments = async (items, type = 'cv', onProgress = null) => {
// //   if (!items || items.length === 0) return { success: 0, errors: [] };

// //   let successCount = 0;
// //   const errors = [];

// //   for (let i = 0; i < items.length; i++) {
// //     const { file, etudiant_id } = items[i];
// //     try {
// //       await uploadDocument(etudiant_id, file, type);
// //       successCount++;
// //     } catch (err) {
// //       errors.push({ file: file.name, error: err.message });
// //     }
// //     if (onProgress) {
// //       onProgress(i + 1, items.length);
// //     }
// //   }

// //   return { success: successCount, total: items.length, errors };
// // };

// // // ===== Chefs de projet =====
// // export const fetchChefsDeProjet = async () => {
// //   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== Étudiants =====
// // export const fetchEtudiants = async () => {
// //   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
// //   if (error) throw error;
// //   return data;
// // };

// // export const upsertEtudiant = async (etudiant) => {
// //   const { data, error } = await supabase
// //     .from('etudiants')
// //     .upsert(etudiant, { onConflict: 'adresse_email' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== Aptitudes & Appétences =====
// // export const fetchAptitudesByEtudiant = async (etudiant_id) => {
// //   const { data, error } = await supabase
// //     .from('aptitudes')
// //     .select('*')
// //     .eq('etudiant_id', etudiant_id)
// //     .maybeSingle();
// //   if (error) throw error;
// //   return data;
// // };

// // export const fetchApetencesByEtudiant = async (etudiant_id) => {
// //   const { data, error } = await supabase
// //     .from('apetences')
// //     .select('*')
// //     .eq('etudiant_id', etudiant_id)
// //     .maybeSingle();
// //   if (error) throw error;
// //   return data;
// // };

// // export const fetchAllApetences = async () => {
// //   const { data, error } = await supabase.from('apetences').select('*');
// //   if (error) throw error;
// //   return data || [];
// // };

// // // ===== Sélections / Vœux =====
// // export const fetchSelections = async () => {
// //   const { data, error } = await supabase.from('selections').select(`
// //     id, etudiant_id, chef_de_projet_id,
// //     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
// //     chefs_de_projet ( id, nom, specialite, email )
// //   `);
// //   if (error) throw error;
// //   return data.map((s) => ({
// //     id: s.id,
// //     etudiant: s.etudiants?.adresse_email,
// //     chefDeProjet: s.chefs_de_projet?.nom,
// //     etudiant_id: s.etudiant_id,
// //     chef_de_projet_id: s.chef_de_projet_id,
// //   }));
// // };

// // export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
// //   const { data, error } = await supabase
// //     .from('selections')
// //     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
// //   const { data, error } = await supabase
// //     .from('selections')
// //     .delete()
// //     .match({ etudiant_id, chef_de_projet_id });
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== Disponibilités =====
// // export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
// //   const { data, error } = await supabase
// //     .from('disponibilite_binaire_chefprojet')
// //     .select('*')
// //     .match({ chef_de_projet_id, date })
// //     .maybeSingle();
// //   if (error) throw error;
// //   return data || { chef_de_projet_id, date, ...emptySlots() };
// // };

// // export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
// //   const slotPayload = normalizeSlots(slots);
// //   const { data, error } = await supabase
// //     .from('disponibilite_binaire_chefprojet')
// //     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
// //   const { data, error } = await supabase
// //     .from('disponibilite_binaire_etudiant')
// //     .select('*')
// //     .match({ etudiant_id, date })
// //     .maybeSingle();
// //   if (error) throw error;
// //   return data || { etudiant_id, date, ...emptySlots() };
// // };

// // export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
// //   const slotPayload = normalizeSlots(slots);
// //   const { data, error } = await supabase
// //     .from('disponibilite_binaire_etudiant')
// //     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== Rendez-vous =====
// // export const fetchRendezVous = async (date = null) => {
// //   let query = supabase
// //     .from('rendez_vous')
// //     .select(
// //       `
// //       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
// //       chefs_de_projet ( id, nom ),
// //       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
// //     `
// //     )
// //     .order('heure', { ascending: true });

// //   if (date) query = query.eq('date', date);

// //   const { data, error } = await query;
// //   if (error) throw error;

// //   return data.map((r) => ({
// //     id: r.id,
// //     date: r.date,
// //     heure_debut: r.heure?.slice(0, 5) || '',
// //     heure_fin: r.heure_fin?.slice(0, 5) || '',
// //     chef_de_projet_id: r.chef_de_projet_id,
// //     etudiant_id: r.etudiant_id || r.etudiants?.id,
// //     chef_de_projet: r.chefs_de_projet?.nom,
// //     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
// //     email_etudiant: r.etudiants?.adresse_email,
// //     cv_path: r.etudiants?.cv_path,
// //     lm_path: r.etudiants?.lm_path,
// //   }));
// // };

// // export const genererRendezVous = async (dateDebut, dateFin, token) => {
// //   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
// //     method: 'POST',
// //     headers: {
// //       'Content-Type': 'application/json',
// //       Authorization: `Bearer ${token}`,
// //     },
// //     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
// //   });

// //   if (!response.ok) {
// //     const err = await response.json().catch(() => ({}));
// //     throw new Error(err.error || `Erreur serveur: ${response.status}`);
// //   }
// //   return await response.json();
// // };

// // // ===== Évaluations =====
// // export const fetchEvaluations = async () => {
// //   const { data, error } = await supabase.from('evaluations').select(`
// //     id, note, commentaire, chef_de_projet_id, etudiant_id,
// //     etudiants ( nom, prenom, adresse_email ),
// //     chefs_de_projet ( nom )
// //   `);
// //   if (error) throw error;
// //   return data;
// // };

// // export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
// //   const { data, error } = await supabase
// //     .from('evaluations')
// //     .upsert(
// //       { chef_de_projet_id, etudiant_id, note, commentaire },
// //       { onConflict: 'chef_de_projet_id,etudiant_id' }
// //     )
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== Affectations finales =====
// // export const fetchAffectations = async () => {
// //   const { data, error } = await supabase.from('affectation').select(`
// //     id, chef_de_projet_id, etudiant_id,
// //     etudiants ( id, nom, prenom, adresse_email, parcours ),
// //     chefs_de_projet ( id, nom, specialite, email )
// //   `);
// //   if (error) throw error;
// //   return data;
// // };

// // export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
// //   const { data, error } = await supabase
// //     .from('affectation')
// //     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
// //     .select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const deleteAffectation = async (etudiant_id) => {
// //   const { data, error } = await supabase
// //     .from('affectation')
// //     .delete()
// //     .eq('etudiant_id', etudiant_id);
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== Imports en Masse =====
// // export const importChefsDeProjet = async (rows) => {
// //   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const importEtudiants = async (rows) => {
// //   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const importAptitudes = async (rows) => {
// //   const etudiants = await fetchEtudiants();
// //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// //   const payload = rows
// //     .map((r) => {
// //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// //       if (!etudiant_id) return null;
// //       const { adresse_email, ...rest } = r;
// //       return { etudiant_id, ...rest };
// //     })
// //     .filter(Boolean);

// //   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
// //   if (error) throw error;
// //   return data;
// // };

// // export const importApetences = async (rows) => {
// //   const etudiants = await fetchEtudiants();
// //   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

// //   const payload = rows
// //     .map((r) => {
// //       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
// //       if (!etudiant_id) return null;
// //       const { adresse_email, ...rest } = r;
// //       return { etudiant_id, ...rest };
// //     })
// //     .filter(Boolean);

// //   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
// //   if (error) throw error;
// //   return data;
// // };

// // // ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

// // export const resetAllSelections = async () => {
// //   const { error } = await supabase.from('selections').delete().neq('id', 0);
// //   if (error) throw error;
// // };

// // export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
// //   let query = supabase.from('rendez_vous').delete();
// //   if (dateDebut && dateFin) {
// //     query = query.gte('date', dateDebut).lte('date', dateFin);
// //   } else {
// //     query = query.neq('id', 0);
// //   }
// //   const { error } = await query;
// //   if (error) throw error;
// // };

// // export const resetAllEvaluations = async () => {
// //   const { error } = await supabase.from('evaluations').delete().neq('id', 0);
// //   if (error) throw error;
// // };

// // export const resetAllAffectations = async () => {
// //   const { error } = await supabase.from('affectation').delete().neq('id', 0);
// //   if (error) throw error;
// // };

// // export const resetAllDisponibilites = async (cible = 'all', date = null) => {
// //   if (cible === 'chefs' || cible === 'all') {
// //     let q = supabase.from('disponibilite_binaire_chefprojet').delete();
// //     if (date) q = q.eq('date', date);
// //     else q = q.neq('id', 0);
// //     const { error } = await q;
// //     if (error) throw error;
// //   }
// //   if (cible === 'etudiants' || cible === 'all') {
// //     let q = supabase.from('disponibilite_binaire_etudiant').delete();
// //     if (date) q = q.eq('date', date);
// //     else q = q.neq('id', 0);
// //     const { error } = await q;
// //     if (error) throw error;
// //   }
// // };

// // export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
// //   const filePath = `${type}/${etudiant_id}.pdf`;
// //   await supabase.storage.from('documents').remove([filePath]);
// //   const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
// //   const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
// //   if (error) throw error;
// // };

// // export const purgeAllDocuments = async () => {
// //   const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
// //   if (cvFiles && cvFiles.length > 0) {
// //     await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
// //   }

// //   const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
// //   if (lmFiles && lmFiles.length > 0) {
// //     await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
// //   }

// //   const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
// //   if (error) throw error;
// // };

// // export const resetEntireDatabaseAndStorage = async () => {
// //   try {
// //     await purgeAllDocuments();
// //   } catch (err) {
// //     console.warn('Storage déjà vide ou erreur purge:', err);
// //   }

// //   const { data, error } = await supabase.rpc('reset_all_campaign_data');
// //   if (error) {
// //     const { error: fallbackErr } = await supabase.rpc('reset_selective_data', {
// //       options: {
// //         rendez_vous: true,
// //         evaluations: true,
// //         affectations: true,
// //         selections: true,
// //         disponibilites: true,
// //         competences: true,
// //         etudiants: true,
// //         chefs: true,
// //         users: true,
// //       },
// //     });
// //     if (fallbackErr) throw fallbackErr;
// //   }
// //   return data;
// // };

// // export const clearClientStorageAndCookies = () => {
// //   try {
// //     localStorage.clear();
// //     sessionStorage.clear();

// //     const cookies = document.cookie.split(';');
// //     for (let i = 0; i < cookies.length; i++) {
// //       const cookie = cookies[i];
// //       const eqPos = cookie.indexOf('=');
// //       const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
// //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
// //       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
// //     }

// //     if (window.caches) {
// //       caches.keys().then((names) => {
// //         for (const name of names) caches.delete(name);
// //       });
// //     }
// //   } catch (err) {
// //     console.warn('Erreur nettoyage client:', err);
// //   }
// // };

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// const emptySlots = () =>
//   Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

// const normalizeSlots = (slots) => {
//   if (Array.isArray(slots)) {
//     const obj = {};
//     for (let i = 0; i < 40; i++) {
//       obj[`slot${i + 1}`] = String(slots[i] ?? '0');
//     }
//     return obj;
//   }
//   return slots;
// };

// // ============================================================================
// // RÉFÉRENTIEL DYNAMIQUE DES COMPÉTENCES (Paramétrable par Promotion)
// // ============================================================================

// export const DEFAULT_COMPETENCES = [
//   { code: 'calculs_simulation_numerique', label: 'Calculs & Simulation', ordre: 1, actif: true },
//   { code: 'essais_caracterisation', label: 'Essais & Caractérisation', ordre: 2, actif: true },
//   { code: 'fabrication_prototypage', label: 'Fabrication & Proto', ordre: 3, actif: true },
//   { code: 'conception_mecanique', label: 'Conception Méca', ordre: 4, actif: true },
//   { code: 'automatique_automatisme', label: 'Automatique', ordre: 5, actif: true },
//   { code: 'iot_systeme_embarque', label: 'IOT & Embarqué', ordre: 6, actif: true },
//   { code: 'robot_cobot', label: 'Robot & Cobot', ordre: 7, actif: true },
//   { code: 'vision', label: 'Vision Industrielle', ordre: 8, actif: true },
//   { code: 'ia', label: 'Intelligence Artificielle', ordre: 9, actif: true },
//   { code: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile', ordre: 10, actif: true },
//   { code: 'ethique_ergonomie', label: 'Éthique & Ergonomie', ordre: 11, actif: true },
// ];

// export const fetchReferentielCompetences = async (onlyActive = true) => {
//   let query = supabase.from('referentiel_competences').select('*').order('ordre', { ascending: true });
//   if (onlyActive) query = query.eq('actif', true);
  
//   const { data, error } = await query;
//   if (error) throw error;
  
//   if (!data || data.length === 0) {
//     return DEFAULT_COMPETENCES.map((c, idx) => ({ id: idx + 1, ...c }));
//   }
//   return data;
// };

// export const saveReferentielCompetence = async (competence) => {
//   const payload = {
//     code: competence.code.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
//     label: competence.label.trim(),
//     description: competence.description?.trim() || '',
//     ordre: Number(competence.ordre || 1),
//     actif: competence.actif !== undefined ? competence.actif : true,
//   };
//   if (competence.id) payload.id = competence.id;

//   const { data, error } = await supabase
//     .from('referentiel_competences')
//     .upsert(payload, { onConflict: 'code' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// export const deleteReferentielCompetence = async (id) => {
//   const { data, error } = await supabase
//     .from('referentiel_competences')
//     .delete()
//     .eq('id', id);
//   if (error) throw error;
//   return data;
// };

// export const resetReferentielToDefaults = async () => {
//   const { data, error } = await supabase
//     .from('referentiel_competences')
//     .upsert(DEFAULT_COMPETENCES, { onConflict: 'code' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// export const fetchDynamicScoresByEtudiant = async (etudiant_id) => {
//   const { data, error } = await supabase
//     .from('etudiant_competences')
//     .select(`
//       competence_id, score_aptitude, score_appetence,
//       referentiel_competences ( id, code, label, ordre, actif )
//     `)
//     .eq('etudiant_id', etudiant_id);
//   if (error) throw error;

//   const scoresMap = {};
//   (data || []).forEach((row) => {
//     const comp = row.referentiel_competences;
//     if (comp && comp.actif) {
//       scoresMap[comp.code] = {
//         aptitude: row.score_aptitude ?? 0,
//         appetence: row.score_appetence ?? 0,
//         label: comp.label,
//         ordre: comp.ordre,
//       };
//     }
//   });

//   return scoresMap;
// };

// export const normalizeSpecialiteKey = (spec, customCompetences = null) => {
//   if (!spec) return '';
//   const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

//   if (customCompetences && Array.isArray(customCompetences)) {
//     const found = customCompetences.find((c) => {
//       const cLabel = c.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
//       const cCode = c.code.toLowerCase();
//       return clean.includes(cLabel) || clean.includes(cCode) || cLabel.includes(clean);
//     });
//     if (found) return found.code;
//   }

//   if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
//   if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
//   if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
//   if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
//   if (clean.includes('auto')) return 'automatique_automatisme';
//   if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
//   if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
//   if (clean.includes('vision')) return 'vision';
//   if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
//   if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
//   if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
//   return clean.replace(/[^a-z0-9_]/g, '_');
// };

// export const computeChefRanksForStudent = (etudiantAppetences, chefsList, referentielCompetences = null) => {
//   if (!etudiantAppetences || !chefsList) return new Map();

//   const scoredChefs = chefsList.map((chef) => {
//     const key = normalizeSpecialiteKey(chef.specialite, referentielCompetences);
//     const rawVal = etudiantAppetences[key];
//     const score = Number(typeof rawVal === 'object' && rawVal !== null ? (rawVal.appetence ?? 0) : (rawVal ?? 0));
//     return {
//       chef_id: chef.id,
//       score,
//       nom: chef.nom || '',
//       specialite: chef.specialite,
//     };
//   });

//   scoredChefs.sort((a, b) => {
//     if (b.score !== a.score) return b.score - a.score;
//     return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
//   });

//   const rankMap = new Map();
//   scoredChefs.forEach((sc, index) => {
//     rankMap.set(sc.chef_id, {
//       rank: index + 1,
//       score: sc.score,
//     });
//   });

//   return rankMap;
// };

// // ============================================================================
// // JAUGES ET QUOTAS DE NOTATION (Par Chef de Projet)
// // ============================================================================

// export const DEFAULT_GRADE_PERCENTAGES = {
//   pourcentage_a: 25.0,
//   pourcentage_b: 25.0,
//   pourcentage_c: 25.0,
//   pourcentage_d: 25.0,
// };

// // 1. Récupérer tous les quotas configurés des chefs
// export const fetchQuotasChefs = async () => {
//   const { data, error } = await supabase.from('quotas_evaluations_chef').select('*');
//   if (error) throw error;
//   return data || [];
// };

// // 2. Enregistrer ou mettre à jour les quotas d'un chef
// export const saveQuotaChef = async (chef_de_projet_id, percentages) => {
//   const payload = {
//     chef_de_projet_id: Number(chef_de_projet_id),
//     pourcentage_a: Number(percentages.pourcentage_a ?? 25),
//     pourcentage_b: Number(percentages.pourcentage_b ?? 25),
//     pourcentage_c: Number(percentages.pourcentage_c ?? 25),
//     pourcentage_d: Number(percentages.pourcentage_d ?? 25),
//   };

//   const { data, error } = await supabase
//     .from('quotas_evaluations_chef')
//     .upsert(payload, { onConflict: 'chef_de_projet_id' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// // 3. Calculer les effectifs cibles (jauges) avec arrondi supérieur et ajustement sur C
// export const calculateChefGradeQuotas = (nbEtudiants, percentages = DEFAULT_GRADE_PERCENTAGES) => {
//   const total = Number(nbEtudiants) || 0;
//   if (total <= 0) {
//     return { maxA: 0, maxB: 0, maxC: 0, maxD: 0, total: 0 };
//   }

//   const pctA = Number(percentages.pourcentage_a ?? 25) / 100;
//   const pctB = Number(percentages.pourcentage_b ?? 25) / 100;
//   const pctD = Number(percentages.pourcentage_d ?? 25) / 100;

//   // Calcul au plus haut (arrondi standard/supérieur pour A, B, D)
//   let maxA = Math.round(total * pctA);
//   let maxB = Math.round(total * pctB);
//   let maxD = Math.round(total * pctD);

//   // Sécurité anti-dépassement global
//   if (maxA + maxB + maxD > total) {
//     maxD = Math.max(0, total - (maxA + maxB));
//   }

//   // La note C absorbe le solde restant pour que la somme fasse exactement 100% (total)
//   let maxC = Math.max(0, total - (maxA + maxB + maxD));

//   return {
//     maxA,
//     maxB,
//     maxC,
//     maxD,
//     total,
//   };
// };

// // ===== Documents (CV & Lettres de motivation) =====
// export const getDocumentPublicUrl = (path) => {
//   if (!path) return null;
//   const { data } = supabase.storage.from('documents').getPublicUrl(path);
//   return `${data.publicUrl}?t=${Date.now()}`;
// };

// export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
//   if (!file) throw new Error('Aucun fichier sélectionné.');
//   if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
//   const storagePath = `${type}/${etudiant_id}.pdf`;
//   const { error: uploadErr } = await supabase.storage
//     .from('documents')
//     .upload(storagePath, file, {
//       contentType: 'application/pdf',
//       upsert: true,
//     });
//   if (uploadErr) throw uploadErr;

//   const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
//   const { error: dbErr } = await supabase
//     .from('etudiants')
//     .update(updatePayload)
//     .eq('id', etudiant_id);
//   if (dbErr) throw dbErr;

//   return storagePath;
// };

// export const cleanTextForMatching = (str) => {
//   return (str || '')
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .toLowerCase()
//     .replace(/(\.pdf|_cv|_lm|cv|lm)/gi, '')
//     .replace(/[^a-z0-9]/g, '');
// };

// export const findEtudiantForDocument = (filePathOrName, etudiantsList) => {
//   if (!filePathOrName || !etudiantsList || etudiantsList.length === 0) return null;

//   let target = filePathOrName;
//   if (filePathOrName.includes('/')) {
//     const parts = filePathOrName.split('/').filter(Boolean);
//     if (parts.length >= 2) target = parts[parts.length - 2];
//   } else if (filePathOrName.includes('\\')) {
//     const parts = filePathOrName.split('\\').filter(Boolean);
//     if (parts.length >= 2) target = parts[parts.length - 2];
//   }

//   const cleanedTarget = cleanTextForMatching(target);
//   if (!cleanedTarget) return null;

//   return etudiantsList.find((e) => {
//     const nom = cleanTextForMatching(e.nom);
//     const prenom = cleanTextForMatching(e.prenom);
//     const nomPrenom = `${nom}${prenom}`;
//     const prenomNom = `${prenom}${nom}`;
//     const emailPrefix = cleanTextForMatching(e.adresse_email?.split('@')[0]);

//     return (
//       (nom && prenom && (cleanedTarget.includes(nomPrenom) || cleanedTarget.includes(prenomNom))) ||
//       (nomPrenom && nomPrenom.includes(cleanedTarget)) ||
//       (prenomNom && prenomNom.includes(cleanedTarget)) ||
//       (emailPrefix && (cleanedTarget.includes(emailPrefix) || emailPrefix.includes(cleanedTarget)))
//     );
//   }) || null;
// };

// export const uploadBatchDocuments = async (items, type = 'cv', onProgress = null) => {
//   if (!items || items.length === 0) return { success: 0, errors: [] };

//   let successCount = 0;
//   const errors = [];

//   for (let i = 0; i < items.length; i++) {
//     const { file, etudiant_id } = items[i];
//     try {
//       await uploadDocument(etudiant_id, file, type);
//       successCount++;
//     } catch (err) {
//       errors.push({ file: file.name, error: err.message });
//     }
//     if (onProgress) {
//       onProgress(i + 1, items.length);
//     }
//   }

//   return { success: successCount, total: items.length, errors };
// };

// // ===== Chefs de projet =====
// export const fetchChefsDeProjet = async () => {
//   const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
//   if (error) throw error;
//   return data;
// };

// // ===== Étudiants =====
// export const fetchEtudiants = async () => {
//   const { data, error } = await supabase.from('etudiants').select('*').order('nom');
//   if (error) throw error;
//   return data;
// };

// export const upsertEtudiant = async (etudiant) => {
//   const { data, error } = await supabase
//     .from('etudiants')
//     .upsert(etudiant, { onConflict: 'adresse_email' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// // ===== Aptitudes & Appétences =====
// export const fetchAptitudesByEtudiant = async (etudiant_id) => {
//   const { data, error } = await supabase
//     .from('aptitudes')
//     .select('*')
//     .eq('etudiant_id', etudiant_id)
//     .maybeSingle();
//   if (error) throw error;
//   return data;
// };

// export const fetchApetencesByEtudiant = async (etudiant_id) => {
//   const { data, error } = await supabase
//     .from('apetences')
//     .select('*')
//     .eq('etudiant_id', etudiant_id)
//     .maybeSingle();
//   if (error) throw error;
//   return data;
// };

// export const fetchAllApetences = async () => {
//   const { data, error } = await supabase.from('apetences').select('*');
//   if (error) throw error;
//   return data || [];
// };

// // ===== Sélections / Vœux =====
// export const fetchSelections = async () => {
//   const { data, error } = await supabase.from('selections').select(`
//     id, etudiant_id, chef_de_projet_id,
//     etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
//     chefs_de_projet ( id, nom, specialite, email )
//   `);
//   if (error) throw error;
//   return data.map((s) => ({
//     id: s.id,
//     etudiant: s.etudiants?.adresse_email,
//     chefDeProjet: s.chefs_de_projet?.nom,
//     etudiant_id: s.etudiant_id,
//     chef_de_projet_id: s.chef_de_projet_id,
//   }));
// };

// export const saveSelection = async (etudiant_id, chef_de_projet_id) => {
//   const { data, error } = await supabase
//     .from('selections')
//     .upsert({ etudiant_id, chef_de_projet_id }, { onConflict: 'etudiant_id,chef_de_projet_id' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
//   const { data, error } = await supabase
//     .from('selections')
//     .delete()
//     .match({ etudiant_id, chef_de_projet_id });
//   if (error) throw error;
//   return data;
// };

// // ===== Disponibilités =====
// export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
//   const { data, error } = await supabase
//     .from('disponibilite_binaire_chefprojet')
//     .select('*')
//     .match({ chef_de_projet_id, date })
//     .maybeSingle();
//   if (error) throw error;
//   return data || { chef_de_projet_id, date, ...emptySlots() };
// };

// export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
//   const slotPayload = normalizeSlots(slots);
//   const { data, error } = await supabase
//     .from('disponibilite_binaire_chefprojet')
//     .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
//   const { data, error } = await supabase
//     .from('disponibilite_binaire_etudiant')
//     .select('*')
//     .match({ etudiant_id, date })
//     .maybeSingle();
//   if (error) throw error;
//   return data || { etudiant_id, date, ...emptySlots() };
// };

// export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
//   const slotPayload = normalizeSlots(slots);
//   const { data, error } = await supabase
//     .from('disponibilite_binaire_etudiant')
//     .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// // ===== Rendez-vous =====
// export const fetchRendezVous = async (date = null) => {
//   let query = supabase
//     .from('rendez_vous')
//     .select(
//       `
//       id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
//       chefs_de_projet ( id, nom ),
//       etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
//     `
//     )
//     .order('heure', { ascending: true });

//   if (date) query = query.eq('date', date);

//   const { data, error } = await query;
//   if (error) throw error;

//   return data.map((r) => ({
//     id: r.id,
//     date: r.date,
//     heure_debut: r.heure?.slice(0, 5) || '',
//     heure_fin: r.heure_fin?.slice(0, 5) || '',
//     chef_de_projet_id: r.chef_de_projet_id,
//     etudiant_id: r.etudiant_id || r.etudiants?.id,
//     chef_de_projet: r.chefs_de_projet?.nom,
//     etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
//     email_etudiant: r.etudiants?.adresse_email,
//     cv_path: r.etudiants?.cv_path,
//     lm_path: r.etudiants?.lm_path,
//   }));
// };

// export const genererRendezVous = async (dateDebut, dateFin, token) => {
//   const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
//   });

//   if (!response.ok) {
//     const err = await response.json().catch(() => ({}));
//     throw new Error(err.error || `Erreur serveur: ${response.status}`);
//   }
//   return await response.json();
// };

// // ===== Évaluations =====
// export const fetchEvaluations = async () => {
//   const { data, error } = await supabase.from('evaluations').select(`
//     id, note, commentaire, chef_de_projet_id, etudiant_id,
//     etudiants ( nom, prenom, adresse_email ),
//     chefs_de_projet ( nom )
//   `);
//   if (error) throw error;
//   return data;
// };

// export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
//   const { data, error } = await supabase
//     .from('evaluations')
//     .upsert(
//       { chef_de_projet_id, etudiant_id, note, commentaire },
//       { onConflict: 'chef_de_projet_id,etudiant_id' }
//     )
//     .select();
//   if (error) throw error;
//   return data;
// };

// // ===== Affectations finales =====
// export const fetchAffectations = async () => {
//   const { data, error } = await supabase.from('affectation').select(`
//     id, chef_de_projet_id, etudiant_id,
//     etudiants ( id, nom, prenom, adresse_email, parcours ),
//     chefs_de_projet ( id, nom, specialite, email )
//   `);
//   if (error) throw error;
//   return data;
// };

// export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
//   const { data, error } = await supabase
//     .from('affectation')
//     .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
//     .select();
//   if (error) throw error;
//   return data;
// };

// export const deleteAffectation = async (etudiant_id) => {
//   const { data, error } = await supabase
//     .from('affectation')
//     .delete()
//     .eq('etudiant_id', etudiant_id);
//   if (error) throw error;
//   return data;
// };

// // ===== Imports en Masse =====
// export const importChefsDeProjet = async (rows) => {
//   const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
//   if (error) throw error;
//   return data;
// };

// export const importEtudiants = async (rows) => {
//   const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
//   if (error) throw error;
//   return data;
// };

// export const importAptitudes = async (rows) => {
//   const etudiants = await fetchEtudiants();
//   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

//   const payload = rows
//     .map((r) => {
//       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
//       if (!etudiant_id) return null;
//       const { adresse_email, ...rest } = r;
//       return { etudiant_id, ...rest };
//     })
//     .filter(Boolean);

//   const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
//   if (error) throw error;
//   return data;
// };

// export const importApetences = async (rows) => {
//   const etudiants = await fetchEtudiants();
//   const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

//   const payload = rows
//     .map((r) => {
//       const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
//       if (!etudiant_id) return null;
//       const { adresse_email, ...rest } = r;
//       return { etudiant_id, ...rest };
//     })
//     .filter(Boolean);

//   const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
//   if (error) throw error;
//   return data;
// };

// // ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

// export const resetAllSelections = async () => {
//   const { error } = await supabase.from('selections').delete().neq('id', 0);
//   if (error) throw error;
// };

// export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
//   let query = supabase.from('rendez_vous').delete();
//   if (dateDebut && dateFin) {
//     query = query.gte('date', dateDebut).lte('date', dateFin);
//   } else {
//     query = query.neq('id', 0);
//   }
//   const { error } = await query;
//   if (error) throw error;
// };

// export const resetAllEvaluations = async () => {
//   const { error } = await supabase.from('evaluations').delete().neq('id', 0);
//   if (error) throw error;
// };

// export const resetAllAffectations = async () => {
//   const { error } = await supabase.from('affectation').delete().neq('id', 0);
//   if (error) throw error;
// };

// export const resetAllDisponibilites = async (cible = 'all', date = null) => {
//   if (cible === 'chefs' || cible === 'all') {
//     let q = supabase.from('disponibilite_binaire_chefprojet').delete();
//     if (date) q = q.eq('date', date);
//     else q = q.neq('id', 0);
//     const { error } = await q;
//     if (error) throw error;
//   }
//   if (cible === 'etudiants' || cible === 'all') {
//     let q = supabase.from('disponibilite_binaire_etudiant').delete();
//     if (date) q = q.eq('date', date);
//     else q = q.neq('id', 0);
//     const { error } = await q;
//     if (error) throw error;
//   }
// };

// export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
//   const filePath = `${type}/${etudiant_id}.pdf`;
//   await supabase.storage.from('documents').remove([filePath]);
//   const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
//   const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
//   if (error) throw error;
// };

// export const purgeAllDocuments = async () => {
//   const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
//   if (cvFiles && cvFiles.length > 0) {
//     await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
//   }

//   const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
//   if (lmFiles && lmFiles.length > 0) {
//     await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
//   }

//   const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
//   if (error) throw error;
// };

// export const resetEntireDatabaseAndStorage = async () => {
//   try {
//     await purgeAllDocuments();
//   } catch (err) {
//     console.warn('Storage déjà vide ou erreur purge:', err);
//   }

//   const { data, error } = await supabase.rpc('reset_all_campaign_data');
//   if (error) {
//     const { error: fallbackErr } = await supabase.rpc('reset_selective_data', {
//       options: {
//         rendez_vous: true,
//         evaluations: true,
//         affectations: true,
//         selections: true,
//         disponibilites: true,
//         competences: true,
//         etudiants: true,
//         chefs: true,
//         users: true,
//       },
//     });
//     if (fallbackErr) throw fallbackErr;
//   }
//   return data;
// };

// export const clearClientStorageAndCookies = () => {
//   try {
//     localStorage.clear();
//     sessionStorage.clear();

//     const cookies = document.cookie.split(';');
//     for (let i = 0; i < cookies.length; i++) {
//       const cookie = cookies[i];
//       const eqPos = cookie.indexOf('=');
//       const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
//     }

//     if (window.caches) {
//       caches.keys().then((names) => {
//         for (const name of names) caches.delete(name);
//       });
//     }
//   } catch (err) {
//     console.warn('Erreur nettoyage client:', err);
//   }
// };


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const emptySlots = () =>
  Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`slot${i + 1}`, '0']));

const normalizeSlots = (slots) => {
  if (Array.isArray(slots)) {
    const obj = {};
    for (let i = 0; i < 40; i++) {
      obj[`slot${i + 1}`] = String(slots[i] ?? '0');
    }
    return obj;
  }
  return slots;
};

// ============================================================================
// RÉFÉRENTIEL DYNAMIQUE DES COMPÉTENCES (Paramétrable par Promotion)
// ============================================================================

export const DEFAULT_COMPETENCES = [
  { code: 'calculs_simulation_numerique', label: 'Calculs & Simulation', ordre: 1, actif: true },
  { code: 'essais_caracterisation', label: 'Essais & Caractérisation', ordre: 2, actif: true },
  { code: 'fabrication_prototypage', label: 'Fabrication & Proto', ordre: 3, actif: true },
  { code: 'conception_mecanique', label: 'Conception Méca', ordre: 4, actif: true },
  { code: 'automatique_automatisme', label: 'Automatique', ordre: 5, actif: true },
  { code: 'iot_systeme_embarque', label: 'IOT & Embarqué', ordre: 6, actif: true },
  { code: 'robot_cobot', label: 'Robot & Cobot', ordre: 7, actif: true },
  { code: 'vision', label: 'Vision Industrielle', ordre: 8, actif: true },
  { code: 'ia', label: 'Intelligence Artificielle', ordre: 9, actif: true },
  { code: 'ihm_appli_web_mobile', label: 'IHM & App Web/Mobile', ordre: 10, actif: true },
  { code: 'ethique_ergonomie', label: 'Éthique & Ergonomie', ordre: 11, actif: true },
];

export const fetchReferentielCompetences = async (onlyActive = true) => {
  let query = supabase.from('referentiel_competences').select('*').order('ordre', { ascending: true });
  if (onlyActive) query = query.eq('actif', true);
  
  const { data, error } = await query;
  if (error) throw error;
  
  if (!data || data.length === 0) {
    return DEFAULT_COMPETENCES.map((c, idx) => ({ id: idx + 1, ...c }));
  }
  return data;
};

export const saveReferentielCompetence = async (competence) => {
  const payload = {
    code: competence.code.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
    label: competence.label.trim(),
    description: competence.description?.trim() || '',
    ordre: Number(competence.ordre || 1),
    actif: competence.actif !== undefined ? competence.actif : true,
  };
  if (competence.id) payload.id = competence.id;

  const { data, error } = await supabase
    .from('referentiel_competences')
    .upsert(payload, { onConflict: 'code' })
    .select();
  if (error) throw error;
  return data;
};

export const deleteReferentielCompetence = async (id) => {
  const { data, error } = await supabase
    .from('referentiel_competences')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

export const resetReferentielToDefaults = async () => {
  const { data, error } = await supabase
    .from('referentiel_competences')
    .upsert(DEFAULT_COMPETENCES, { onConflict: 'code' })
    .select();
  if (error) throw error;
  return data;
};

export const fetchDynamicScoresByEtudiant = async (etudiant_id) => {
  const { data, error } = await supabase
    .from('etudiant_competences')
    .select(`
      competence_id, score_aptitude, score_appetence,
      referentiel_competences ( id, code, label, ordre, actif )
    `)
    .eq('etudiant_id', etudiant_id);
  if (error) throw error;

  const scoresMap = {};
  (data || []).forEach((row) => {
    const comp = row.referentiel_competences;
    if (comp && comp.actif) {
      scoresMap[comp.code] = {
        aptitude: row.score_aptitude ?? 0,
        appetence: row.score_appetence ?? 0,
        label: comp.label,
        ordre: comp.ordre,
      };
    }
  });

  return scoresMap;
};

export const normalizeSpecialiteKey = (spec, customCompetences = null) => {
  if (!spec) return '';
  const clean = spec.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  if (customCompetences && Array.isArray(customCompetences)) {
    const found = customCompetences.find((c) => {
      const cLabel = c.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const cCode = c.code.toLowerCase();
      return clean.includes(cLabel) || clean.includes(cCode) || cLabel.includes(clean);
    });
    if (found) return found.code;
  }

  if (clean.includes('calcul') || clean.includes('simulation')) return 'calculs_simulation_numerique';
  if (clean.includes('essai') || clean.includes('caracterisation')) return 'essais_caracterisation';
  if (clean.includes('fab') || clean.includes('proto')) return 'fabrication_prototypage';
  if (clean.includes('conception') || clean.includes('meca')) return 'conception_mecanique';
  if (clean.includes('auto')) return 'automatique_automatisme';
  if (clean.includes('iot') || clean.includes('embarque')) return 'iot_systeme_embarque';
  if (clean.includes('robot') || clean.includes('cobot')) return 'robot_cobot';
  if (clean.includes('vision')) return 'vision';
  if (clean === 'ia' || clean.includes('intelligence')) return 'ia';
  if (clean.includes('ihm') || clean.includes('web') || clean.includes('mobile')) return 'ihm_appli_web_mobile';
  if (clean.includes('ethique') || clean.includes('ergo')) return 'ethique_ergonomie';
  return clean.replace(/[^a-z0-9_]/g, '_');
};

export const computeChefRanksForStudent = (etudiantAppetences, chefsList, referentielCompetences = null) => {
  if (!etudiantAppetences || !chefsList) return new Map();

  const scoredChefs = chefsList.map((chef) => {
    const key = normalizeSpecialiteKey(chef.specialite, referentielCompetences);
    const rawVal = etudiantAppetences[key];
    const score = Number(typeof rawVal === 'object' && rawVal !== null ? (rawVal.appetence ?? 0) : (rawVal ?? 0));
    return {
      chef_id: chef.id,
      score,
      nom: chef.nom || '',
      specialite: chef.specialite,
    };
  });

  scoredChefs.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
  });

  const rankMap = new Map();
  scoredChefs.forEach((sc, index) => {
    rankMap.set(sc.chef_id, {
      rank: index + 1,
      score: sc.score,
    });
  });

  return rankMap;
};

// ============================================================================
// JAUGES ET QUOTAS DE NOTATION (Par Chef de Projet)
// ============================================================================

export const DEFAULT_GRADE_PERCENTAGES = {
  pourcentage_a: 25.0,
  pourcentage_b: 25.0,
  pourcentage_c: 25.0,
  pourcentage_d: 25.0,
};

export const fetchQuotasChefs = async () => {
  const { data, error } = await supabase.from('quotas_evaluations_chef').select('*');
  if (error) throw error;
  return data || [];
};

export const saveQuotaChef = async (chef_de_projet_id, percentages) => {
  const payload = {
    chef_de_projet_id: Number(chef_de_projet_id),
    pourcentage_a: Number(percentages.pourcentage_a ?? 25),
    pourcentage_b: Number(percentages.pourcentage_b ?? 25),
    pourcentage_c: Number(percentages.pourcentage_c ?? 25),
    pourcentage_d: Number(percentages.pourcentage_d ?? 25),
  };

  const { data, error } = await supabase
    .from('quotas_evaluations_chef')
    .upsert(payload, { onConflict: 'chef_de_projet_id' })
    .select();
  if (error) throw error;
  return data;
};

export const calculateChefGradeQuotas = (nbEtudiants, percentages = DEFAULT_GRADE_PERCENTAGES) => {
  const total = Number(nbEtudiants) || 0;
  if (total <= 0) {
    return { maxA: 0, maxB: 0, maxC: 0, maxD: 0, total: 0 };
  }

  const pctA = Number(percentages.pourcentage_a ?? 25) / 100;
  const pctB = Number(percentages.pourcentage_b ?? 25) / 100;
  const pctD = Number(percentages.pourcentage_d ?? 25) / 100;

  let maxA = Math.round(total * pctA);
  let maxB = Math.round(total * pctB);
  let maxD = Math.round(total * pctD);

  if (maxA + maxB + maxD > total) {
    maxD = Math.max(0, total - (maxA + maxB));
  }

  let maxC = Math.max(0, total - (maxA + maxB + maxD));

  return {
    maxA,
    maxB,
    maxC,
    maxD,
    total,
  };
};

// ============================================================================
// DÉTECTION DES DOCUMENTS ET DES VŒUX MOODLE
// ============================================================================

export const getDocumentPublicUrl = (path) => {
  if (!path) return null;
  const { data } = supabase.storage.from('documents').getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
};

export const uploadDocument = async (etudiant_id, file, type = 'cv') => {
  if (!file) throw new Error('Aucun fichier sélectionné.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Le fichier dépasse 5 Mo.');
  
  const storagePath = `${type}/${etudiant_id}.pdf`;
  const { error: uploadErr } = await supabase.storage
    .from('documents')
    .upload(storagePath, file, {
      contentType: 'application/pdf',
      upsert: true,
    });
  if (uploadErr) throw uploadErr;

  const updatePayload = type === 'cv' ? { cv_path: storagePath } : { lm_path: storagePath };
  const { error: dbErr } = await supabase
    .from('etudiants')
    .update(updatePayload)
    .eq('id', etudiant_id);
  if (dbErr) throw dbErr;

  return storagePath;
};

export const cleanTextForMatching = (str) => {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/(\.pdf|_cv|_lm|cv|lm)/gi, '')
    .replace(/[^a-z0-9]/g, '');
};

// Retrouver l'étudiant correspondant au nom d'un sous-dossier ou d'un fichier
export const findEtudiantForDocument = (filePathOrName, etudiantsList) => {
  if (!filePathOrName || !etudiantsList || etudiantsList.length === 0) return null;

  let target = filePathOrName;
  if (filePathOrName.includes('/')) {
    const parts = filePathOrName.split('/').filter(Boolean);
    if (parts.length >= 2) target = parts[parts.length - 2];
  } else if (filePathOrName.includes('\\')) {
    const parts = filePathOrName.split('\\').filter(Boolean);
    if (parts.length >= 2) target = parts[parts.length - 2];
  }

  const cleanedTarget = cleanTextForMatching(target);
  if (!cleanedTarget) return null;

  return etudiantsList.find((e) => {
    const nom = cleanTextForMatching(e.nom);
    const prenom = cleanTextForMatching(e.prenom);
    const nomPrenom = `${nom}${prenom}`;
    const prenomNom = `${prenom}${nom}`;
    const emailPrefix = cleanTextForMatching(e.adresse_email?.split('@')[0]);

    return (
      (nom && prenom && (cleanedTarget.includes(nomPrenom) || cleanedTarget.includes(prenomNom))) ||
      (nomPrenom && nomPrenom.includes(cleanedTarget)) ||
      (prenomNom && prenomNom.includes(cleanedTarget)) ||
      (emailPrefix && (cleanedTarget.includes(emailPrefix) || emailPrefix.includes(cleanedTarget)))
    );
  }) || null;
};

// Extraire le chef de projet depuis un texte de vœu Moodle (ex: "Conception... [M. BONNAL]")
// export const findChefFromWishText = (wishText, chefsList) => {
//   if (!wishText || !chefsList || chefsList.length === 0) return null;

//   const raw = String(wishText).trim();

//   // 1. Détection prioritaire du texte entre crochets [M. BONNAL] ou [T. GUETTARI]
//   const bracketMatch = raw.match(/\[([^\]]+)\]/);
//   const target = bracketMatch ? bracketMatch[1] : raw;

//   const cleanedTarget = cleanTextForMatching(target);
//   if (!cleanedTarget) return null;

//   // 2. Correspondance par nom de famille du chef
//   const found = chefsList.find((c) => {
//     const nomComplet = cleanTextForMatching(c.nom);
//     const parts = c.nom.toLowerCase().split(/\s+/).filter(Boolean);
//     const nomDeFamille = cleanTextForMatching(parts[parts.length - 1] || ''); // ex: "bonnal", "guettari"

//     return (
//       (nomComplet && (cleanedTarget.includes(nomComplet) || nomComplet.includes(cleanedTarget))) ||
//       (nomDeFamille && (cleanedTarget.includes(nomDeFamille) || nomDeFamille.includes(cleanedTarget)))
//     );
//   });

//   if (found) return found;

//   // 3. Fallback : correspondance par spécialité du projet
//   return chefsList.find((c) => {
//     const spec = cleanTextForMatching(c.specialite);
//     return spec && cleanTextForMatching(raw).includes(spec);
//   }) || null;
// };


// // Décodage HTML et nettoyage robuste pour Moodle
// export const decodeHtmlEntities = (str) => {
//   return (str || '')
//     .replace(/&#039;/g, "'")
//     .replace(/&amp;/g, '&')
//     .replace(/&quot;/g, '"')
//     .replace(/&lt;/g, '<')
//     .replace(/&gt;/g, '>');
// };

// export const findChefFromWishText = (wishText, chefsList) => {
//   if (!wishText || !chefsList || chefsList.length === 0) return null;

//   const raw = decodeHtmlEntities(String(wishText)).trim();

//   // 1. Détection prioritaire du texte entre crochets [M. BONNAL] ou [T. GUETTARI]
//   const bracketMatch = raw.match(/\[([^\]]+)\]/);
//   const target = bracketMatch ? bracketMatch[1] : raw;

//   const cleanedTarget = cleanTextForMatching(target);
//   if (!cleanedTarget) return null;

//   // 2. Correspondance par nom de famille du chef
//   const found = chefsList.find((c) => {
//     const nomComplet = cleanTextForMatching(c.nom);
//     const parts = c.nom.toLowerCase().split(/\s+/).filter(Boolean);
//     const nomDeFamille = cleanTextForMatching(parts[parts.length - 1] || '');

//     return (
//       (nomComplet && (cleanedTarget.includes(nomComplet) || nomComplet.includes(cleanedTarget))) ||
//       (nomDeFamille && (cleanedTarget.includes(nomDeFamille) || nomDeFamille.includes(cleanedTarget)))
//     );
//   });

//   if (found) return found;

//   // 3. Fallback : correspondance par spécialité
//   return chefsList.find((c) => {
//     const spec = cleanTextForMatching(c.specialite);
//     return spec && cleanTextForMatching(raw).includes(spec);
//   }) || null;
// };

// Décodage HTML et nettoyage robuste pour Moodle
export const decodeHtmlEntities = (str) => {
  return (str || '')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/Ã©/gi, 'e')
    .replace(/Ã¨/gi, 'e')
    .replace(/Ã/gi, 'a');
};

export const findChefFromWishText = (wishText, chefsList) => {
  if (!wishText || !chefsList || chefsList.length === 0) return null;

  const raw = decodeHtmlEntities(String(wishText)).trim();

  // 1. Détection du texte entre crochets [M. BONNAL], [O. QUENARD], [S. LOUIS]
  const bracketMatch = raw.match(/\[([^\]]+)\]/);
  const target = bracketMatch ? bracketMatch[1] : raw;

  const cleanedTarget = cleanTextForMatching(
    decodeHtmlEntities(target)
  );
  if (!cleanedTarget) return null;

  // Cas spécifique 1 : [S. LOUIS] correspond à Louis SAGE
  if (cleanedTarget.includes('louis') || cleanedTarget.includes('slouis')) {
    const sageChef = chefsList.find((c) => {
      const nom = cleanTextForMatching(decodeHtmlEntities(c.nom));
      return nom.includes('sage') || nom.includes('louis');
    });
    if (sageChef) return sageChef;
  }

  // Cas spécifique 2 : [O. QUENARD] correspond à Olivier Quénard
  if (cleanedTarget.includes('quenard') || cleanedTarget.includes('quanard')) {
    const quenardChef = chefsList.find((c) => {
      const nom = cleanTextForMatching(decodeHtmlEntities(c.nom));
      return nom.includes('quenard') || nom.includes('quanard');
    });
    if (quenardChef) return quenardChef;
  }

  // 2. Correspondance générale (Nom complet, Nom de famille ou Prénom)
  const found = chefsList.find((c) => {
    const nomClean = cleanTextForMatching(decodeHtmlEntities(c.nom));
    const parts = decodeHtmlEntities(c.nom).toLowerCase().split(/\s+/).filter(Boolean);
    const nomDeFamille = cleanTextForMatching(parts[parts.length - 1] || '');
    const prenom = cleanTextForMatching(parts[0] || '');

    return (
      (nomClean && (cleanedTarget.includes(nomClean) || nomClean.includes(cleanedTarget))) ||
      (nomDeFamille && nomDeFamille.length >= 3 && (cleanedTarget.includes(nomDeFamille) || nomDeFamille.includes(cleanedTarget))) ||
      (prenom && prenom.length >= 4 && cleanedTarget.includes(prenom))
    );
  });

  if (found) return found;

  // 3. Fallback par spécialité
  return chefsList.find((c) => {
    const spec = cleanTextForMatching(decodeHtmlEntities(c.specialite || ''));
    return spec && spec.length >= 4 && cleanTextForMatching(raw).includes(spec);
  }) || null;
};

export const uploadBatchDocuments = async (items, type = 'cv', onProgress = null) => {
  if (!items || items.length === 0) return { success: 0, errors: [] };

  let successCount = 0;
  const errors = [];

  for (let i = 0; i < items.length; i++) {
    const { file, etudiant_id } = items[i];
    try {
      await uploadDocument(etudiant_id, file, type);
      successCount++;
    } catch (err) {
      errors.push({ file: file.name, error: err.message });
    }
    if (onProgress) {
      onProgress(i + 1, items.length);
    }
  }

  return { success: successCount, total: items.length, errors };
};

// ===== Chefs de projet =====
export const fetchChefsDeProjet = async () => {
  const { data, error } = await supabase.from('chefs_de_projet').select('*').order('nom');
  if (error) throw error;
  return data;
};

// ===== Étudiants =====
export const fetchEtudiants = async () => {
  const { data, error } = await supabase.from('etudiants').select('*').order('nom');
  if (error) throw error;
  return data;
};

export const upsertEtudiant = async (etudiant) => {
  const { data, error } = await supabase
    .from('etudiants')
    .upsert(etudiant, { onConflict: 'adresse_email' })
    .select();
  if (error) throw error;
  return data;
};

// ===== Aptitudes & Appétences =====
export const fetchAptitudesByEtudiant = async (etudiant_id) => {
  const { data, error } = await supabase
    .from('aptitudes')
    .select('*')
    .eq('etudiant_id', etudiant_id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const fetchApetencesByEtudiant = async (etudiant_id) => {
  const { data, error } = await supabase
    .from('apetences')
    .select('*')
    .eq('etudiant_id', etudiant_id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const fetchAllApetences = async () => {
  const { data, error } = await supabase.from('apetences').select('*');
  if (error) throw error;
  return data || [];
};

// ===== Sélections / Vœux avec Priorité (1er, 2e, 3e choix) =====
export const fetchSelections = async () => {
  const { data, error } = await supabase.from('selections').select(`
    id, etudiant_id, chef_de_projet_id, priorite,
    etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path ),
    chefs_de_projet ( id, nom, specialite, email )
  `);
  if (error) throw error;
  return data.map((s) => ({
    id: s.id,
    etudiant: s.etudiants?.adresse_email,
    chefDeProjet: s.chefs_de_projet?.nom,
    etudiant_id: s.etudiant_id,
    chef_de_projet_id: s.chef_de_projet_id,
    priorite: s.priorite || 1,
  }));
};

export const saveSelection = async (etudiant_id, chef_de_projet_id, priorite = 1) => {
  const { data, error } = await supabase
    .from('selections')
    .upsert(
      { etudiant_id, chef_de_projet_id, priorite: Number(priorite) || 1 },
      { onConflict: 'etudiant_id,chef_de_projet_id' }
    )
    .select();
  if (error) throw error;
  return data;
};

export const deleteSelection = async (etudiant_id, chef_de_projet_id) => {
  const { data, error } = await supabase
    .from('selections')
    .delete()
    .match({ etudiant_id, chef_de_projet_id });
  if (error) throw error;
  return data;
};

// ===== Disponibilités =====
export const fetchDisponibiliteChef = async (chef_de_projet_id, date) => {
  const { data, error } = await supabase
    .from('disponibilite_binaire_chefprojet')
    .select('*')
    .match({ chef_de_projet_id, date })
    .maybeSingle();
  if (error) throw error;
  return data || { chef_de_projet_id, date, ...emptySlots() };
};

export const saveDisponibiliteChef = async (chef_de_projet_id, date, slots) => {
  const slotPayload = normalizeSlots(slots);
  const { data, error } = await supabase
    .from('disponibilite_binaire_chefprojet')
    .upsert({ chef_de_projet_id, date, ...slotPayload }, { onConflict: 'chef_de_projet_id,date' })
    .select();
  if (error) throw error;
  return data;
};

export const fetchDisponibiliteEtudiant = async (etudiant_id, date) => {
  const { data, error } = await supabase
    .from('disponibilite_binaire_etudiant')
    .select('*')
    .match({ etudiant_id, date })
    .maybeSingle();
  if (error) throw error;
  return data || { etudiant_id, date, ...emptySlots() };
};

export const saveDisponibiliteEtudiant = async (etudiant_id, date, slots) => {
  const slotPayload = normalizeSlots(slots);
  const { data, error } = await supabase
    .from('disponibilite_binaire_etudiant')
    .upsert({ etudiant_id, date, ...slotPayload }, { onConflict: 'etudiant_id,date' })
    .select();
  if (error) throw error;
  return data;
};

// ===== Rendez-vous =====
export const fetchRendezVous = async (date = null) => {
  let query = supabase
    .from('rendez_vous')
    .select(
      `
      id, date, heure, heure_fin, chef_de_projet_id, etudiant_id,
      chefs_de_projet ( id, nom ),
      etudiants ( id, nom, prenom, adresse_email, cv_path, lm_path )
    `
    )
    .order('heure', { ascending: true });

  if (date) query = query.eq('date', date);

  const { data, error } = await query;
  if (error) throw error;

  return data.map((r) => ({
    id: r.id,
    date: r.date,
    heure_debut: r.heure?.slice(0, 5) || '',
    heure_fin: r.heure_fin?.slice(0, 5) || '',
    chef_de_projet_id: r.chef_de_projet_id,
    etudiant_id: r.etudiant_id || r.etudiants?.id,
    chef_de_projet: r.chefs_de_projet?.nom,
    etudiant: `${r.etudiants?.nom || ''} ${r.etudiants?.prenom || ''}`.trim(),
    email_etudiant: r.etudiants?.adresse_email,
    cv_path: r.etudiants?.cv_path,
    lm_path: r.etudiants?.lm_path,
  }));
};

export const genererRendezVous = async (dateDebut, dateFin, token) => {
  const response = await fetch(`${supabaseUrl}/functions/v1/generer-rendez-vous`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ date_debut: dateDebut, date_fin: dateFin }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Erreur serveur: ${response.status}`);
  }
  return await response.json();
};

// ===== Évaluations =====
export const fetchEvaluations = async () => {
  const { data, error } = await supabase.from('evaluations').select(`
    id, note, commentaire, chef_de_projet_id, etudiant_id,
    etudiants ( nom, prenom, adresse_email ),
    chefs_de_projet ( nom )
  `);
  if (error) throw error;
  return data;
};

export const saveEvaluation = async (chef_de_projet_id, etudiant_id, note, commentaire = '') => {
  const { data, error } = await supabase
    .from('evaluations')
    .upsert(
      { chef_de_projet_id, etudiant_id, note, commentaire },
      { onConflict: 'chef_de_projet_id,etudiant_id' }
    )
    .select();
  if (error) throw error;
  return data;
};

// ===== Affectations finales =====
export const fetchAffectations = async () => {
  const { data, error } = await supabase.from('affectation').select(`
    id, chef_de_projet_id, etudiant_id,
    etudiants ( id, nom, prenom, adresse_email, parcours ),
    chefs_de_projet ( id, nom, specialite, email )
  `);
  if (error) throw error;
  return data;
};

export const saveAffectation = async (chef_de_projet_id, etudiant_id) => {
  const { data, error } = await supabase
    .from('affectation')
    .upsert({ chef_de_projet_id, etudiant_id }, { onConflict: 'etudiant_id' })
    .select();
  if (error) throw error;
  return data;
};

export const deleteAffectation = async (etudiant_id) => {
  const { data, error } = await supabase
    .from('affectation')
    .delete()
    .eq('etudiant_id', etudiant_id);
  if (error) throw error;
  return data;
};

// ===== Imports en Masse =====
export const importChefsDeProjet = async (rows) => {
  const { data, error } = await supabase.from('chefs_de_projet').upsert(rows, { onConflict: 'email' }).select();
  if (error) throw error;
  return data;
};

export const importEtudiants = async (rows) => {
  const { data, error } = await supabase.from('etudiants').upsert(rows, { onConflict: 'adresse_email' }).select();
  if (error) throw error;
  return data;
};

export const importAptitudes = async (rows) => {
  const etudiants = await fetchEtudiants();
  const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

  const payload = rows
    .map((r) => {
      const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
      if (!etudiant_id) return null;
      const { adresse_email, ...rest } = r;
      return { etudiant_id, ...rest };
    })
    .filter(Boolean);

  const { data, error } = await supabase.from('aptitudes').upsert(payload, { onConflict: 'etudiant_id' }).select();
  if (error) throw error;
  return data;
};

export const importApetences = async (rows) => {
  const etudiants = await fetchEtudiants();
  const emailToId = new Map(etudiants.map((e) => [e.adresse_email.toLowerCase().trim(), e.id]));

  const payload = rows
    .map((r) => {
      const etudiant_id = emailToId.get(String(r.adresse_email || '').toLowerCase().trim());
      if (!etudiant_id) return null;
      const { adresse_email, ...rest } = r;
      return { etudiant_id, ...rest };
    })
    .filter(Boolean);

  const { data, error } = await supabase.from('apetences').upsert(payload, { onConflict: 'etudiant_id' }).select();
  if (error) throw error;
  return data;
};

// ===== FONCTIONS DE REMISE À ZÉRO CIBLÉES (Admin) =====

export const resetAllSelections = async () => {
  const { error } = await supabase.from('selections').delete().neq('id', 0);
  if (error) throw error;
};

export const resetAllRendezVous = async (dateDebut = null, dateFin = null) => {
  let query = supabase.from('rendez_vous').delete();
  if (dateDebut && dateFin) {
    query = query.gte('date', dateDebut).lte('date', dateFin);
  } else {
    query = query.neq('id', 0);
  }
  const { error } = await query;
  if (error) throw error;
};

export const resetAllEvaluations = async () => {
  const { error } = await supabase.from('evaluations').delete().neq('id', 0);
  if (error) throw error;
};

export const resetAllAffectations = async () => {
  const { error } = await supabase.from('affectation').delete().neq('id', 0);
  if (error) throw error;
};

export const resetAllDisponibilites = async (cible = 'all', date = null) => {
  if (cible === 'chefs' || cible === 'all') {
    let q = supabase.from('disponibilite_binaire_chefprojet').delete();
    if (date) q = q.eq('date', date);
    else q = q.neq('id', 0);
    const { error } = await q;
    if (error) throw error;
  }
  if (cible === 'etudiants' || cible === 'all') {
    let q = supabase.from('disponibilite_binaire_etudiant').delete();
    if (date) q = q.eq('date', date);
    else q = q.neq('id', 0);
    const { error } = await q;
    if (error) throw error;
  }
};

export const deleteSingleDocument = async (etudiant_id, type = 'cv') => {
  const filePath = `${type}/${etudiant_id}.pdf`;
  await supabase.storage.from('documents').remove([filePath]);
  const updatePayload = type === 'cv' ? { cv_path: null } : { lm_path: null };
  const { error } = await supabase.from('etudiants').update(updatePayload).eq('id', etudiant_id);
  if (error) throw error;
};

export const purgeAllDocuments = async () => {
  const { data: cvFiles } = await supabase.storage.from('documents').list('cv');
  if (cvFiles && cvFiles.length > 0) {
    await supabase.storage.from('documents').remove(cvFiles.map((f) => `cv/${f.name}`));
  }

  const { data: lmFiles } = await supabase.storage.from('documents').list('lm');
  if (lmFiles && lmFiles.length > 0) {
    await supabase.storage.from('documents').remove(lmFiles.map((f) => `lm/${f.name}`));
  }

  const { error } = await supabase.from('etudiants').update({ cv_path: null, lm_path: null }).neq('id', 0);
  if (error) throw error;
};

export const resetEntireDatabaseAndStorage = async () => {
  try {
    await purgeAllDocuments();
  } catch (err) {
    console.warn('Storage déjà vide ou erreur purge:', err);
  }

  const { data, error } = await supabase.rpc('reset_all_campaign_data');
  if (error) {
    const { error: fallbackErr } = await supabase.rpc('reset_selective_data', {
      options: {
        rendez_vous: true,
        evaluations: true,
        affectations: true,
        selections: true,
        disponibilites: true,
        competences: true,
        etudiants: true,
        chefs: true,
        users: true,
      },
    });
    if (fallbackErr) throw fallbackErr;
  }
  return data;
};

export const clearClientStorageAndCookies = () => {
  try {
    localStorage.clear();
    sessionStorage.clear();

    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    }

    if (window.caches) {
      caches.keys().then((names) => {
        for (const name of names) caches.delete(name);
      });
    }
  } catch (err) {
    console.warn('Erreur nettoyage client:', err);
  }
};