function fasciaOrari(inizio: string, fine: string) {
  const [oreInizio, minInizio] = inizio.split(":").map(Number);
  const [oreFine, minFine] = fine.split(":").map(Number);
  const orari: string[] = [];

  let minuti = oreInizio * 60 + minInizio;
  const minutiFine = oreFine * 60 + minFine;

  while (minuti <= minutiFine) {
    const ore = Math.floor(minuti / 60);
    const min = minuti % 60;
    orari.push(`${String(ore).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
    minuti += 15;
  }

  return orari;
}

export const ORARI_PRANZO = fasciaOrari("12:30", "14:00");
export const ORARI_CENA = fasciaOrari("19:30", "22:00");
export const ORARI_DISPONIBILI = [...ORARI_PRANZO, ...ORARI_CENA];
