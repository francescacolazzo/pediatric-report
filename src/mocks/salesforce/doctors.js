/**
 * Mock Salesforce — Doctors
 *
 * 3 record di test che coprono i 4 casi logici di Introduction:
 *   DR001 — Doctor con nome visibile (Specialist ENT)
 *   DR002 — Doctor con nome visibile (Pediatrician)
 *   DR003 — Doctor il cui nome può essere nascosto (Audiologist)
 *
 * "Generic ENT" e "Another Professional" non sono record SF:
 * sono opzioni UI gestite lato client senza lookup.
 */
export const doctors = [
  {
    id: 'DR001',
    name: 'Carlos',
    surname: 'Mendoza',
    specialty: 'ENT Specialist',
    isGenericEnt: false,
    gender: 'M', // M → Dr.  F → Dra.
  },
  {
    id: 'DR002',
    name: 'Ana',
    surname: 'Torres',
    specialty: 'Pediatrician',
    isGenericEnt: false,
    gender: 'F',
  },
  {
    id: 'DR003',
    name: 'Javier',
    surname: 'Ruiz',
    specialty: 'Audiologist',
    isGenericEnt: false,
    gender: 'M',
  },
];

export function findById(id) {
  return doctors.find(d => d.id === id) ?? null;
}

export function search(q) {
  const term = q.toLowerCase();
  return doctors.filter(
    d =>
      d.name.toLowerCase().includes(term) ||
      d.surname.toLowerCase().includes(term)
  );
}
