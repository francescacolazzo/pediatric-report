/**
 * Section builder — Ear (Otoscopy + Tympanometry)
 * Regola tutto-o-niente: se un lato è null viene omesso.
 */

const OTOSCOPY_ES = {
  Normal: 'Otoscopia Normal',
  Altered: 'Otoscopia Alterada',
  AlteredENTRef: 'Otoscopia Alterada, recomendación de valoración por un profesional ORL',
  WaxBlockage: 'Posible tapón de cera',
};

const TYMPANOMETRY_ES = {
  A: 'A - Movilidad normal',
  As: 'As - Baja movilidad',
  Ad: 'Ad - Movilidad muy alta',
  B: 'B - Sin movilidad',
  C: 'C - Movilidad variable, Disfunción de la trompa de Eustaquio',
};

function renderEarSide(side) {
  if (!side) return null;
  return {
    otoscopyLabel: OTOSCOPY_ES[side.otoscopyResult] ?? side.otoscopyResult,
    otoscopyImageUrl: side.otoscopyImageUrl ?? null,
    tympanometryLabel: TYMPANOMETRY_ES[side.tympanometryType] ?? side.tympanometryType,
    tympanometryPressure: side.tympanometryPressure,
    tympanometryImageUrl: side.tympanometryImageUrl ?? null,
  };
}

export function renderEar(ear) {
  if (!ear) return null;
  const left = renderEarSide(ear.left);
  const right = renderEarSide(ear.right);
  if (!left && !right) return null;
  return { left, right };
}
