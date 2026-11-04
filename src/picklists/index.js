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
 * Conclusions — 4 valores con texto en español.
 */
export const CONCLUSION_VALUES = [
  {
    key: 'CONCLUSION_1',
    label: 'No necesita audífonos',
    phraseEs:
      'Tras la valoración audiológica realizada, los resultados obtenidos se encuentran dentro de los parámetros de normalidad para la edad del paciente. ' +
      'La audición bilateral es funcional y no se detectan pérdidas auditivas significativas que requieran intervención amplificadora en este momento. ' +
      'La otoscopia y la timpanometría no muestran alteraciones relevantes, y la respuesta auditiva a los estímulos evaluados es adecuada. ' +
      'Se recomienda mantener revisiones periódicas para monitorizar la evolución auditiva del paciente, especialmente durante las etapas de desarrollo del lenguaje. ' +
      'En caso de observarse cambios en la conducta auditiva o en la adquisición del habla, se aconseja consultar nuevamente con el especialista para reevaluar la necesidad de adaptación. ' +
      'No se prescribe en este momento ningún tipo de ayuda auditiva.',
  },
  {
    key: 'CONCLUSION_2',
    label: 'Necesitaría audífonos pero los rechaza',
    phraseEs:
      'Los resultados de la valoración audiológica evidencian la presencia de una pérdida auditiva bilateral que, desde el punto de vista clínico, se beneficiaría del uso de amplificación auditiva. ' +
      'Se ha informado detalladamente a la familia sobre las implicaciones de la hipoacusia en el desarrollo del lenguaje, la comunicación y el rendimiento escolar del paciente. ' +
      'No obstante, tras la exposición de las opciones disponibles, la familia ha manifestado su decisión de no proceder con la adaptación de audífonos en este momento. ' +
      'Se respeta la decisión familiar, recordando que esta postura puede revisarse en cualquier momento y que la intervención temprana resulta especialmente beneficiosa en edades pediátricas. ' +
      'Se aconseja seguimiento audiológico estrecho para evaluar la evolución de la pérdida y el impacto comunicativo en el desarrollo del niño/a. ' +
      'El centro permanece a disposición de la familia para retomar el proceso de adaptación cuando lo consideren oportuno.',
  },
  {
    key: 'CONCLUSION_3',
    label: 'Ha iniciado la prueba de audífonos',
    phraseEs:
      'La evaluación audiológica confirma una pérdida auditiva que justifica la indicación de amplificación, y el paciente ha iniciado el período de prueba con los audífonos prescritos. ' +
      'Durante esta fase se realizará un seguimiento clínico para valorar la tolerancia, el confort y el beneficio percibido tanto por el paciente como por su entorno familiar y escolar. ' +
      'Se ha procedido a la adaptación y programación inicial de los dispositivos de acuerdo con los umbrales audiométricos obtenidos, aplicando el protocolo de verificación establecido. ' +
      'La familia ha recibido instrucciones detalladas sobre el manejo, la colocación, el mantenimiento y los cuidados básicos de los audífonos. ' +
      'Se informará periódicamente del progreso durante el período de prueba y se realizarán los ajustes necesarios para optimizar el rendimiento auditivo. ' +
      'En función de los resultados del seguimiento, se determinará la conveniencia de formalizar la adaptación de forma definitiva.',
  },
  {
    key: 'CONCLUSION_4',
    label: 'Ha adquirido los audífonos',
    phraseEs:
      'Concluido satisfactoriamente el período de adaptación, el paciente ha adquirido los audífonos prescritos, mostrando una correcta tolerancia y un beneficio auditivo constatable en su vida diaria. ' +
      'Los dispositivos han sido programados y verificados mediante los protocolos de ajuste establecidos, con el objetivo de proporcionar una ganancia auditiva óptima y confortable. ' +
      'Se han llevado a cabo las sesiones de seguimiento necesarias para garantizar que la amplificación se adecúa a las necesidades comunicativas del paciente en los diferentes entornos. ' +
      'La familia ha sido formada en el uso y mantenimiento de los audífonos, así como en las estrategias de comunicación que favorecen el aprovechamiento de la ayuda auditiva. ' +
      'Se recomienda continuar con revisiones audiológicas periódicas para comprobar la evolución de la audición y el correcto funcionamiento de los dispositivos a lo largo del tiempo. ' +
      'El equipo de audiología pediátrica queda a disposición de la familia para cualquier consulta, ajuste o necesidad que pueda surgir durante el seguimiento.',
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
