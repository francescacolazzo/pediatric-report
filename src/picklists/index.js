/**
 * Picklist statici — valori fissi del dominio.
 * I valori TBD (M5, M6) hanno placeholder espliciti da sostituire.
 */

export const COLLABORATIVENESS_VALUES = ['Collaborative', 'Not Collaborative'];

export const OTOSCOPY_RESULTS = [
  'Normal',
  'Altered',
  'AlteredENTRef',
  'WaxBlockage',
];

export const TYMPANOMETRY_TYPES = ['A', 'As', 'Ad', 'B', 'C'];

export const TYMPANOMETRY_PRESSURE_MIN = -400;
export const TYMPANOMETRY_PRESSURE_MAX = 200;

// Evoked Potentials: 0–130 dB step 5
export const EVOKED_POTENTIALS_DB_VALUES = Array.from(
  { length: 27 },
  (_, i) => i * 5
); // [0, 5, 10, ..., 130]

export const LING_SOUNDS = ['/m/', '/u/', '/a/', '/i/', '/sh/', '/s/'];
export const LING_DISTANCES = ['1m', '2m', '3-6m'];

export const QUESTIONNAIRE_TYPES = ['ELF', 'CHILD', 'COSI'];

/**
 * Hearing aid types con codici (Fitting Information).
 * Fonte: BRD tbl[8]
 */
export const HEARING_AID_TYPES = [
  { type: 'IIC',            code: 'PAA 000A', label: 'Audífono intra-auricular IIC' },
  { type: 'CIC',            code: 'PAA 000B', label: 'Audífono intra-auricular CIC' },
  { type: 'ITC',            code: 'PAA 000C', label: 'Audífono intra-auricular ITC' },
  { type: 'ITE',            code: 'PAA 000D', label: 'Audífono intra-auricular ITE' },
  { type: 'RITE_RIC',       code: 'PAA 010A', label: 'Audífono retro-auricular RITE/RIC' },
  { type: 'BTE',            code: 'PAA 010B', label: 'Audífono retro-auricular BTE' },
  { type: 'BTE_SUPER',      code: 'PAA 010C', label: 'Audífono retro-auricular BTE superpotente' },
  { type: 'BICROSS_ITE',    code: 'PAA 020A', label: 'Sistema bi-cross de audífono intraauricular' },
  { type: 'BICROSS_BTE',    code: 'PAA 020B', label: 'Sistema bi-cross de audífono retroauricular' },
];

export const HEARING_AID_TYPE_KEYS = HEARING_AID_TYPES.map(h => h.type);

export function getHearingAidCode(type) {
  return HEARING_AID_TYPES.find(h => h.type === type)?.code ?? null;
}

/**
 * Earmold types — M5 TBD: lista completa da ricevere dal team Product.
 * Attualmente solo PAM 000A come placeholder.
 */
export const EARMOLD_TYPES = [
  { type: 'BTE_EARMOLD', code: 'PAM 000A', label: 'Molde adaptador para audífono retroauricular BTE/BTE superpotente (unidad)' },
  // TODO M5: aggiungere ulteriori tipi di molde quando disponibili
];

export const EARMOLD_TYPE_KEYS = EARMOLD_TYPES.map(e => e.type);

export function getEarmoldCode(type) {
  return EARMOLD_TYPES.find(e => e.type === type)?.code ?? null;
}

/**
 * Conclusions — M6 TBD: 4 valori con testi ES da ricevere dal team Product.
 * Attualmente 4 placeholder.
 */
export const CONCLUSION_VALUES = [
  {
    key: 'CONCLUSION_1',
    // TODO M6: sostituire con frase ES reale
    phraseEs: '[PLACEHOLDER_CONCLUSION_1 — testo da fornire dal team Product]',
  },
  {
    key: 'CONCLUSION_2',
    phraseEs: '[PLACEHOLDER_CONCLUSION_2 — testo da fornire dal team Product]',
  },
  {
    key: 'CONCLUSION_3',
    phraseEs: '[PLACEHOLDER_CONCLUSION_3 — testo da fornire dal team Product]',
  },
  {
    key: 'CONCLUSION_4',
    phraseEs: '[PLACEHOLDER_CONCLUSION_4 — testo da fornire dal team Product]',
  },
];

export const CONCLUSION_KEYS = CONCLUSION_VALUES.map(c => c.key);

export function getConclusionPhrase(key) {
  return CONCLUSION_VALUES.find(c => c.key === key)?.phraseEs ?? null;
}

/**
 * Formula di chiusura standard — M7 TBD: testo ES da ricevere dal team Product.
 */
export const CLOSING_FORMULA =
  '[PLACEHOLDER_CLOSING_FORMULA — testo da fornire dal team Product]';
