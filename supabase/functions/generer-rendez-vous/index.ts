// // import { createClient } from "npm:@supabase/supabase-js@2";
// // import { createRemoteJWKSet, jwtVerify } from "npm:jose@5";
// // import { generateSchedule, type Selection, type SlotMap } from "./scheduler.ts";

// // const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
// // const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// // const FIREBASE_PROJECT_ID = Deno.env.get("FIREBASE_PROJECT_ID")!;

// // const JWKS = createRemoteJWKSet(
// //   new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
// // );

// // async function verifyFirebaseToken(idToken: string) {
// //   const { payload } = await jwtVerify(idToken, JWKS, {
// //     issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
// //     audience: FIREBASE_PROJECT_ID,
// //   });
// //   return payload;
// // }

// // function corsHeaders(origin: string | null) {
// //   return {
// //     "Access-Control-Allow-Origin": origin ?? "*",
// //     "Access-Control-Allow-Headers": "authorization, content-type, apikey",
// //     "Access-Control-Allow-Methods": "POST, OPTIONS",
// //   };
// // }

// // function slotsFromRow(row: Record<string, unknown>): string[] {
// //   const slots: string[] = [];
// //   for (let i = 1; i <= 40; i++) {
// //     slots.push(String(row[`slot${i}`] ?? "1"));
// //   }
// //   return slots;
// // }

// // Deno.serve(async (req: Request) => {
// //   const origin = req.headers.get("origin");

// //   if (req.method === "OPTIONS") {
// //     return new Response(null, { headers: corsHeaders(origin) });
// //   }

// //   try {
// //     // 1. Authentification Firebase
// //     const authHeader = req.headers.get("authorization") || "";
// //     if (!authHeader.startsWith("Bearer ")) {
// //       return new Response(JSON.stringify({ error: "Token d'authentification manquant." }), {
// //         status: 401,
// //         headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
// //       });
// //     }

// //     const idToken = authHeader.slice("Bearer ".length).trim();
// //     await verifyFirebaseToken(idToken);

// //     // 2. Paramètres
// //     const { date_debut, date_fin } = await req.json();
// //     if (!date_debut || !date_fin) {
// //       return new Response(JSON.stringify({ error: "date_debut et date_fin requis." }), {
// //         status: 400,
// //         headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
// //       });
// //     }

// //     const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
// //       auth: { persistSession: false },
// //     });

// //     // 3. Récupération des données
// //     const { data: selectionsData, error: selErr } = await supabase
// //       .from("selections")
// //       .select("etudiant_id, chef_de_projet_id, priorite");
// //     if (selErr) throw selErr;

// //     const { data: dispoChefsData, error: chefErr } = await supabase
// //       .from("disponibilite_binaire_chefprojet")
// //       .select("*")
// //       .gte("date", date_debut)
// //       .lte("date", date_fin);
// //     if (chefErr) throw chefErr;

// //     const { data: dispoEtudData, error: etudErr } = await supabase
// //       .from("disponibilite_binaire_etudiant")
// //       .select("*")
// //       .gte("date", date_debut)
// //       .lte("date", date_fin);
// //     if (etudErr) throw etudErr;

// //     // 4. Structuration
// //     const chefsSlots = new Map<number, SlotMap>();
// //     const allDatesSet = new Set<string>();
// //     for (const row of dispoChefsData ?? []) {
// //       if (!chefsSlots.has(row.chef_de_projet_id)) chefsSlots.set(row.chef_de_projet_id, {});
// //       chefsSlots.get(row.chef_de_projet_id)![row.date] = slotsFromRow(row);
// //       allDatesSet.add(row.date);
// //     }

// //     const etudsSlots = new Map<number, SlotMap>();
// //     for (const row of dispoEtudData ?? []) {
// //       if (!etudsSlots.has(row.etudiant_id)) etudsSlots.set(row.etudiant_id, {});
// //       etudsSlots.get(row.etudiant_id)![row.date] = slotsFromRow(row);
// //     }

// //     // 5. Calcul du planning
// //     const result = generateSchedule(
// //       (selectionsData ?? []) as Selection[],
// //       chefsSlots,
// //       etudsSlots,
// //       date_debut,
// //       date_fin,
// //       Array.from(allDatesSet)
// //     );

// //     // 6. Sauvegarde en DB
// //     if (result.rendezVous.length > 0) {
// //       const { error: insertErr } = await supabase.from("rendez_vous").upsert(
// //         result.rendezVous.map((r) => ({
// //           date: r.date,
// //           heure: r.heure_debut,
// //           heure_fin: r.heure_fin,
// //           chef_de_projet_id: r.chef_de_projet_id,
// //           etudiant_id: r.etudiant_id,
// //         })),
// //         { onConflict: "chef_de_projet_id,date,heure" }
// //       );
// //       if (insertErr) throw insertErr;
// //     }

// //     return new Response(JSON.stringify({ success: true, ...result }), {
// //       status: 200,
// //       headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
// //     });
// //   } catch (err) {
// //     return new Response(JSON.stringify({ error: err.message || String(err) }), {
// //       status: 500,
// //       headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
// //     });
// //   }
// // });
// import { createClient } from "npm:@supabase/supabase-js@2";
// import { createRemoteJWKSet, jwtVerify } from "npm:jose@5";
// import { generateSchedule, type Selection, type SlotMap } from "./scheduler.ts";

// const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
// const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// const FIREBASE_PROJECT_ID = Deno.env.get("FIREBASE_PROJECT_ID")!;

// const JWKS = createRemoteJWKSet(
//   new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
// );

// async function verifyFirebaseToken(idToken: string) {
//   const { payload } = await jwtVerify(idToken, JWKS, {
//     issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
//     audience: FIREBASE_PROJECT_ID,
//   });
//   return payload;
// }

// function corsHeaders(origin: string | null) {
//   return {
//     "Access-Control-Allow-Origin": origin ?? "*",
//     "Access-Control-Allow-Headers": "authorization, content-type, apikey",
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//   };
// }

// function slotsFromRow(row: Record<string, unknown>): string[] {
//   const slots: string[] = [];
//   for (let i = 1; i <= 40; i++) {
//     slots.push(String(row[`slot${i}`] ?? "1"));
//   }
//   return slots;
// }

// Deno.serve(async (req: Request) => {
//   const origin = req.headers.get("origin");

//   if (req.method === "OPTIONS") {
//     return new Response(null, { headers: corsHeaders(origin) });
//   }

//   try {
//     // 1. Authentification Firebase
//     const authHeader = req.headers.get("authorization") || "";
//     if (!authHeader.startsWith("Bearer ")) {
//       return new Response(JSON.stringify({ error: "Token d'authentification manquant." }), {
//         status: 401,
//         headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
//       });
//     }

//     const idToken = authHeader.slice("Bearer ".length).trim();
//     await verifyFirebaseToken(idToken);

//     // 2. Paramètres
//     const { date_debut, date_fin } = await req.json();
//     if (!date_debut || !date_fin) {
//       return new Response(JSON.stringify({ error: "date_debut et date_fin requis." }), {
//         status: 400,
//         headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
//       });
//     }

//     const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
//       auth: { persistSession: false },
//     });

//     // 2.5 Réinitialisation (DELETE) des anciens rendez-vous sur la période
//     const { data: deletedRows, error: delErr } = await supabase
//       .from("rendez_vous")
//       .delete()
//       .gte("date", date_debut)
//       .lte("date", date_fin)
//       .select("id");

//     if (delErr) {
//       console.error("Erreur lors de la suppression des anciens rendez-vous:", delErr);
//       throw new Error(`Erreur lors du nettoyage du planning: ${delErr.message}`);
//     }

//     console.log(`Anciens rendez-vous supprimés pour [${date_debut} -> ${date_fin}] : ${deletedRows?.length ?? 0}`);

//     // 3. Récupération des données
//     const { data: selectionsData, error: selErr } = await supabase
//       .from("selections")
//       .select("etudiant_id, chef_de_projet_id, priorite");
//     if (selErr) throw selErr;

//     const { data: dispoChefsData, error: chefErr } = await supabase
//       .from("disponibilite_binaire_chefprojet")
//       .select("*")
//       .gte("date", date_debut)
//       .lte("date", date_fin);
//     if (chefErr) throw chefErr;

//     const { data: dispoEtudData, error: etudErr } = await supabase
//       .from("disponibilite_binaire_etudiant")
//       .select("*")
//       .gte("date", date_debut)
//       .lte("date", date_fin);
//     if (etudErr) throw etudErr;

//     // 4. Structuration
//     const chefsSlots = new Map<number, SlotMap>();
//     const allDatesSet = new Set<string>();
//     for (const row of dispoChefsData ?? []) {
//       if (!chefsSlots.has(row.chef_de_projet_id)) chefsSlots.set(row.chef_de_projet_id, {});
//       chefsSlots.get(row.chef_de_projet_id)![row.date] = slotsFromRow(row);
//       allDatesSet.add(row.date);
//     }

//     const etudsSlots = new Map<number, SlotMap>();
//     for (const row of dispoEtudData ?? []) {
//       if (!etudsSlots.has(row.etudiant_id)) etudsSlots.set(row.etudiant_id, {});
//       etudsSlots.get(row.etudiant_id)![row.date] = slotsFromRow(row);
//     }

//     // 5. Calcul du planning
//     const result = generateSchedule(
//       (selectionsData ?? []) as Selection[],
//       chefsSlots,
//       etudsSlots,
//       date_debut,
//       date_fin,
//       Array.from(allDatesSet)
//     );

//     // 6. Sauvegarde en DB
//     if (result.rendezVous.length > 0) {
//       const { error: insertErr } = await supabase.from("rendez_vous").insert(
//         result.rendezVous.map((r) => ({
//           date: r.date,
//           heure: r.heure_debut,
//           heure_fin: r.heure_fin,
//           chef_de_projet_id: r.chef_de_projet_id,
//           etudiant_id: r.etudiant_id,
//         }))
//       );
//       if (insertErr) throw insertErr;
//     }

//     return new Response(JSON.stringify({ success: true, ...result }), {
//       status: 200,
//       headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     return new Response(JSON.stringify({ error: err.message || String(err) }), {
//       status: 500,
//       headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
//     });
//   }
// });

import { createClient } from "npm:@supabase/supabase-js@2";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@5";
import { generateSchedule, type Selection, type SlotMap } from "./scheduler.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIREBASE_PROJECT_ID = Deno.env.get("FIREBASE_PROJECT_ID")!;

const JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

async function verifyFirebaseToken(idToken: string) {
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID,
  });
  return payload;
}

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Headers": "authorization, content-type, apikey",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function slotsFromRow(row: Record<string, unknown>): string[] {
  const slots: string[] = [];
  for (let i = 1; i <= 40; i++) {
    slots.push(String(row[`slot${i}`] ?? "1"));
  }
  return slots;
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }

  try {
    // 1. Authentification Firebase
    const authHeader = req.headers.get("authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Token d'authentification manquant." }), {
        status: 401,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    const idToken = authHeader.slice("Bearer ".length).trim();
    await verifyFirebaseToken(idToken);

    // 2. Paramètres de dates
    const { date_debut, date_fin } = await req.json();
    if (!date_debut || !date_fin) {
      return new Response(JSON.stringify({ error: "date_debut et date_fin requis." }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // 3. Réinitialisation des anciens rendez-vous sur la période
    const { data: deletedRows, error: delErr } = await supabase
      .from("rendez_vous")
      .delete()
      .gte("date", date_debut)
      .lte("date", date_fin)
      .select("id");

    if (delErr) {
      throw new Error(`Erreur lors du nettoyage du planning: ${delErr.message}`);
    }

    console.log(`Anciens rendez-vous supprimés pour [${date_debut} -> ${date_fin}] : ${deletedRows?.length ?? 0}`);

    // 4. Récupération des données (SANS la colonne priorite)
    const { data: selectionsData, error: selErr } = await supabase
      .from("selections")
      .select("etudiant_id, chef_de_projet_id");
    if (selErr) throw selErr;

    const { data: dispoChefsData, error: chefErr } = await supabase
      .from("disponibilite_binaire_chefprojet")
      .select("*")
      .gte("date", date_debut)
      .lte("date", date_fin);
    if (chefErr) throw chefErr;

    const { data: dispoEtudData, error: etudErr } = await supabase
      .from("disponibilite_binaire_etudiant")
      .select("*")
      .gte("date", date_debut)
      .lte("date", date_fin);
    if (etudErr) throw etudErr;

    // 5. Structuration des créneaux
    const chefsSlots = new Map<number, SlotMap>();
    const allDatesSet = new Set<string>();
    for (const row of dispoChefsData ?? []) {
      if (!chefsSlots.has(row.chef_de_projet_id)) chefsSlots.set(row.chef_de_projet_id, {});
      chefsSlots.get(row.chef_de_projet_id)![row.date] = slotsFromRow(row);
      allDatesSet.add(row.date);
    }

    const etudsSlots = new Map<number, SlotMap>();
    for (const row of dispoEtudData ?? []) {
      if (!etudsSlots.has(row.etudiant_id)) etudsSlots.set(row.etudiant_id, {});
      etudsSlots.get(row.etudiant_id)![row.date] = slotsFromRow(row);
    }

    // 6. Calcul automatique du planning
    const result = generateSchedule(
      (selectionsData ?? []) as Selection[],
      chefsSlots,
      etudsSlots,
      date_debut,
      date_fin,
      Array.from(allDatesSet)
    );

    // 7. Sauvegarde en DB
    if (result.rendezVous.length > 0) {
      const { error: insertErr } = await supabase.from("rendez_vous").insert(
        result.rendezVous.map((r) => ({
          date: r.date,
          heure: r.heure_debut,
          heure_fin: r.heure_fin,
          chef_de_projet_id: r.chef_de_projet_id,
          etudiant_id: r.etudiant_id,
        }))
      );
      if (insertErr) throw insertErr;
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  }
});