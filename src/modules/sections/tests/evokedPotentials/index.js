/**
 * Section builder — Evoked Potentials
 * Regola tutto-o-niente per lato: null = orecchio non testato, omesso.
 */

const PERFORMER_ES = {
  ourCentre: 'Realizado por nuestro centro',
  specialist: 'Realizado por el especialista en fecha:',
};

const STANDARD_TEXT =
  'La prueba de Potenciales Evocados mide cómo el nervio auditivo y el cerebro responden ' +
  'al sonido mientras descansan tranquilamente o duermen. Es importante porque proporciona ' +
  'una visión objetiva de su salud auditiva para detectar cualquier variación de forma ' +
  'temprana. La prueba se realiza para cada oído individualmente utilizando niveles de ' +
  'sonido de 0 a 130 dB, aumentando en incrementos de 5 dB.';

function renderEarResult(ear) {
  if (!ear) return null;
  return {
    db: ear.db,
    pass: ear.pass,
    passLabel: ear.pass ? 'PASS' : 'NO PASS',
  };
}

export function renderEvokedPotentials(ep) {
  if (!ep) return null;
  return {
    standardText: STANDARD_TEXT,
    performerLabel: PERFORMER_ES[ep.performer] ?? ep.performer,
    specialistDate: ep.specialistDate ?? null,
    left: renderEarResult(ep.left),
    right: renderEarResult(ep.right),
  };
}
