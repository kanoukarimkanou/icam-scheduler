// export type SlotMap = Record<string, string[]>;

// export interface Selection {
//   etudiant_id: number;
//   chef_de_projet_id: number;
//   priorite: number;
// }

// export interface RendezVous {
//   date: string;
//   heure_debut: string;
//   heure_fin: string;
//   chef_de_projet_id: number;
//   etudiant_id: number;
// }

// export interface RdvEchec {
//   etudiant_id: number;
//   chef_de_projet_id: number;
//   raison: string;
// }

// export interface ScheduleResult {
//   rendezVous: RendezVous[];
//   rdvNonProgrammes: RdvEchec[];
//   stats: { totalSelections: number; rdvProgrammes: number; rdvNonProgrammes: number };
// }

// function slotToTime(slotIdx: number, heureDebut: string, dureeSlotMin: number): [string, string] {
//   const [h, m] = heureDebut.split(":").map(Number);
//   const baseMinutes = h * 60 + m;
//   const startMinutes = baseMinutes + slotIdx * dureeSlotMin;
//   const endMinutes = startMinutes + dureeSlotMin;
//   const fmt = (mins: number) => {
//     const hh = Math.floor(mins / 60) % 24;
//     const mm = mins % 60;
//     return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
//   };
//   return [fmt(startMinutes), fmt(endMinutes)];
// }

// export function generateSchedule(
//   selections: Selection[],
//   chefsSlots: Map<number, SlotMap>,
//   etudsSlots: Map<number, SlotMap>,
//   dateDebut: string,
//   dateFin: string,
//   allDates: string[],
//   heureDebut = "08:00",
//   nbSlots = 40,
//   dureeSlotMin = 15,
// ): ScheduleResult {
//   const nbCreneauxLibres = (etudId: number): number => {
//     const slotsParDate = etudsSlots.get(etudId);
//     if (!slotsParDate) return 0;
//     let total = 0;
//     for (const slots of Object.values(slotsParDate)) {
//       total += slots.filter((s) => s === "0").length;
//     }
//     return total;
//   };

//   let remaining = [...selections].sort((a, b) => {
//     const prioDiff = (a.priorite ?? 999) - (b.priorite ?? 999);
//     if (prioDiff !== 0) return prioDiff;
//     return nbCreneauxLibres(a.etudiant_id) - nbCreneauxLibres(b.etudiant_id);
//   });

//   const rendezVous: RendezVous[] = [];
//   const datesTriees = allDates.filter((d) => d >= dateDebut && d <= dateFin).sort();

//   for (const date of datesTriees) {
//     for (let slotIdx = 0; slotIdx < nbSlots; slotIdx++) {
//       const fulfilledIdx = new Set<number>();

//       for (let i = 0; i < remaining.length; i++) {
//         const sel = remaining[i];
//         const chefSlots = chefsSlots.get(sel.chef_de_projet_id)?.[date];
//         const etudSlots = etudsSlots.get(sel.etudiant_id)?.[date];

//         if (chefSlots && etudSlots && chefSlots[slotIdx] === "0" && etudSlots[slotIdx] === "0") {
//           const [debut, fin] = slotToTime(slotIdx, heureDebut, dureeSlotMin);
//           rendezVous.push({
//             date,
//             heure_debut: debut,
//             heure_fin: fin,
//             chef_de_projet_id: sel.chef_de_projet_id,
//             etudiant_id: sel.etudiant_id,
//           });

//           // Verrouillage immédiat anti-conflit
//           chefSlots[slotIdx] = "1";
//           etudSlots[slotIdx] = "1";
//           fulfilledIdx.add(i);
//         }
//       }

//       if (fulfilledIdx.size > 0) {
//         remaining = remaining.filter((_, idx) => !fulfilledIdx.has(idx));
//       }
//     }
//   }

//   const rdvNonProgrammes: RdvEchec[] = remaining.map((sel) => ({
//     etudiant_id: sel.etudiant_id,
//     chef_de_projet_id: sel.chef_de_projet_id,
//     raison: !chefsSlots.has(sel.chef_de_projet_id)
//       ? "Chef sans disponibilités."
//       : !etudsSlots.has(sel.etudiant_id)
//       ? "Étudiant sans disponibilités."
//       : "Aucun créneau commun libre disponible.",
//   }));

//   return {
//     rendezVous,
//     rdvNonProgrammes,
//     stats: {
//       totalSelections: selections.length,
//       rdvProgrammes: rendezVous.length,
//       rdvNonProgrammes: rdvNonProgrammes.length,
//     },
//   };
// }


export type SlotMap = Record<string, string[]>;

export interface Selection {
  etudiant_id: number;
  chef_de_projet_id: number;
}

export interface RendezVous {
  date: string;
  heure_debut: string;
  heure_fin: string;
  chef_de_projet_id: number;
  etudiant_id: number;
}

export interface RdvEchec {
  etudiant_id: number;
  chef_de_projet_id: number;
  raison: string;
}

export interface ScheduleResult {
  rendezVous: RendezVous[];
  rdvNonProgrammes: RdvEchec[];
  stats: { totalSelections: number; rdvProgrammes: number; rdvNonProgrammes: number };
}

function slotToTime(slotIdx: number, heureDebut: string, dureeSlotMin: number): [string, string] {
  const [h, m] = heureDebut.split(":").map(Number);
  const baseMinutes = h * 60 + m;
  const startMinutes = baseMinutes + slotIdx * dureeSlotMin;
  const endMinutes = startMinutes + dureeSlotMin;
  const fmt = (mins: number) => {
    const hh = Math.floor(mins / 60) % 24;
    const mm = mins % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };
  return [fmt(startMinutes), fmt(endMinutes)];
}

export function generateSchedule(
  selections: Selection[],
  chefsSlots: Map<number, SlotMap>,
  etudsSlots: Map<number, SlotMap>,
  dateDebut: string,
  dateFin: string,
  allDates: string[],
  heureDebut = "08:00",
  nbSlots = 40,
  dureeSlotMin = 15,
): ScheduleResult {
  const nbCreneauxLibres = (etudId: number): number => {
    const slotsParDate = etudsSlots.get(etudId);
    if (!slotsParDate) return 0;
    let total = 0;
    for (const slots of Object.values(slotsParDate)) {
      total += slots.filter((s) => s === "0").length;
    }
    return total;
  };

  // Tri par contrainte : les étudiants ayant le moins de créneaux libres sont placés en priorité
  let remaining = [...selections].sort((a, b) => {
    return nbCreneauxLibres(a.etudiant_id) - nbCreneauxLibres(b.etudiant_id);
  });

  const rendezVous: RendezVous[] = [];
  const datesTriees = allDates.filter((d) => d >= dateDebut && d <= dateFin).sort();

  for (const date of datesTriees) {
    for (let slotIdx = 0; slotIdx < nbSlots; slotIdx++) {
      const fulfilledIdx = new Set<number>();

      for (let i = 0; i < remaining.length; i++) {
        const sel = remaining[i];
        const chefSlots = chefsSlots.get(sel.chef_de_projet_id)?.[date];
        const etudSlots = etudsSlots.get(sel.etudiant_id)?.[date];

        if (chefSlots && etudSlots && chefSlots[slotIdx] === "0" && etudSlots[slotIdx] === "0") {
          const [debut, fin] = slotToTime(slotIdx, heureDebut, dureeSlotMin);
          rendezVous.push({
            date,
            heure_debut: debut,
            heure_fin: fin,
            chef_de_projet_id: sel.chef_de_projet_id,
            etudiant_id: sel.etudiant_id,
          });

          // Verrouillage immédiat anti-conflit
          chefSlots[slotIdx] = "1";
          etudSlots[slotIdx] = "1";
          fulfilledIdx.add(i);
        }
      }

      if (fulfilledIdx.size > 0) {
        remaining = remaining.filter((_, idx) => !fulfilledIdx.has(idx));
      }
    }
  }

  const rdvNonProgrammes: RdvEchec[] = remaining.map((sel) => ({
    etudiant_id: sel.etudiant_id,
    chef_de_projet_id: sel.chef_de_projet_id,
    raison: !chefsSlots.has(sel.chef_de_projet_id)
      ? "Chef sans disponibilités."
      : !etudsSlots.has(sel.etudiant_id)
      ? "Étudiant sans disponibilités."
      : "Aucun créneau commun libre disponible.",
  }));

  return {
    rendezVous,
    rdvNonProgrammes,
    stats: {
      totalSelections: selections.length,
      rdvProgrammes: rendezVous.length,
      rdvNonProgrammes: rdvNonProgrammes.length,
    },
  };
}