/**
 * Mock Salesforce — COSI sessions
 *
 * Ogni paziente può avere più sessioni COSI (esigenze raccolte in date diverse).
 * Ogni sessione ha: sessionDate (dd/mm/yyyy) + needs (3 frasi).
 *
 * Le frasi sono read-only da SF: il sistema le mostra in textbox modificabili
 * ma non le riscrive mai su Salesforce. Le modifiche vivono solo nella sessione
 * corrente di compilazione del report.
 */
export const cosiByPatient = {
  PAT001: [
    {
      sessionDate: '15/03/2026',
      needs: [
        'Escuchar mejor en clase durante las explicaciones del profesor',
        'Poder hablar con amigos sin pedir que repitan',
        'Oír la televisión a volumen normal con la familia',
      ],
    },
    {
      sessionDate: '10/09/2026',
      needs: [
        'Mejorar la comprensión en entornos ruidosos como el patio',
        'Participar en actividades grupales sin dificultad',
        'Escuchar música con claridad',
      ],
    },
  ],
  PAT002: [
    {
      sessionDate: '02/06/2026',
      needs: [
        'Entender al profesor sin leer los labios',
        'Comunicarse con los compañeros durante el recreo',
        'Escuchar cuando le llaman desde otra habitación',
      ],
    },
  ],
};

export function getCosiSessions(patientId) {
  return cosiByPatient[patientId] ?? [];
}
