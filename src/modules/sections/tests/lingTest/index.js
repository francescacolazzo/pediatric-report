/**
 * Section builder — Ling Test
 * Le distanze non selezionate non compaiono nella tabella.
 */

const STANDARD_TEXT =
  'La Prueba de los Seis Sonidos de Ling mide la capacidad de su hijo/a para escuchar ' +
  'el espectro completo del lenguaje cotidiano usando seis sonidos específicos: ' +
  '/m/, /u/, /a/, /i/, /sh/ y /s/. Es una comprobación diaria importante porque ' +
  'verifica rápidamente que sus audífonos o implantes cocleares funcionan correctamente ' +
  'en todos los tonos del habla.';

const SOUNDS = ['/m/', '/u/', '/a/', '/i/', '/sh/', '/s/'];

/**
 * Costruisce la griglia per il template:
 * rows = [ { sound, cells: [ { distance, heard } ] } ]
 */
export function renderLingTest(ling) {
  if (!ling) return null;

  const rows = SOUNDS.map(sound => ({
    sound,
    cells: ling.distances.map(dist => ({
      distance: dist,
      heard: ling.results[sound]?.[dist] ?? null, // null = non misurato (non dovrebbe accadere)
    })),
  }));

  return {
    standardText: STANDARD_TEXT,
    distances: ling.distances,
    rows,
  };
}
