import { findById } from '../../mocks/salesforce/doctors.js';
import { getHearingAidCode, getEarmoldCode, CLOSING_FORMULA } from '../../picklists/index.js';

/**
 * Risolve il saluto ES in base alla scelta dell'audiologo.
 */
export function resolveGreeting(introduction, doctor) {
  switch (introduction.recipientType) {
    case 'professional':
      return 'Estimado profesional';
    case 'genericEnt':
      return 'Estimado Doctor';
    case 'doctor': {
      if (introduction.hideName) return 'Estimado Doctor';
      const isFemale = doctor.gender === 'F';
      const salutation = isFemale ? 'Estimada' : 'Estimado';
      const title = isFemale ? 'Dra.' : 'Dr.';
      return `${salutation} ${title} ${doctor.surname}`;
    }
  }
}

/**
 * Arricchisce il fitting auto-popolando i codici hearing aid ed earmold.
 */
function enrichFittingSide(side) {
  if (!side) return null;
  return {
    ...side,
    hearingAidCode: getHearingAidCode(side.hearingAidType),
    earmoldCode: side.earmoldType ? getEarmoldCode(side.earmoldType) : null,
  };
}

/**
 * Assembla il documento del report pronto per il renderer.
 * Esegue la business logic che non è esprimibile in Zod.
 *
 * @param {object} data   - payload validato dallo schema Zod
 * @param {object} professional - payload JWT del professionista loggato
 * @returns {object} reportDocument
 */
export function buildReport(data, professional) {
  // Lookup dottore SF (solo se recipientType === 'doctor')
  let doctor = null;
  if (data.introduction.recipientType === 'doctor') {
    doctor = findById(data.introduction.doctorId);
    if (!doctor) {
      const err = new Error('Doctor not found in Salesforce');
      err.status = 404;
      throw err;
    }
  }

  const greeting = resolveGreeting(data.introduction, doctor);

  return {
    patientId: data.patientId,
    generatedAt: new Date().toISOString(),
    professional: {
      id: professional.id,
      fullName: `${professional.name} ${professional.surname}`,
      title: 'Especialista en audiología pediátrica',
    },
    introduction: {
      greeting,
      doctorId: doctor?.id ?? null,
    },
    collaborativeness: data.collaborativeness,
    ear: data.ear ?? null,
    tests: data.tests ?? null,
    questionnaire: data.questionnaire ?? null,
    fitting: data.fitting
      ? {
          left: enrichFittingSide(data.fitting.left),
          right: enrichFittingSide(data.fitting.right),
        }
      : null,
    conclusions: data.conclusions,
    finalNotes: {
      text: data.finalNotes.text,
      closingFormula: CLOSING_FORMULA,
      signature: `${professional.name} ${professional.surname}`,
    },
  };
}
