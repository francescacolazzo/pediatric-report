import { z } from 'zod';
import {
  COLLABORATIVENESS_VALUES,
  OTOSCOPY_RESULTS,
  TYMPANOMETRY_TYPES,
  TYMPANOMETRY_PRESSURE_MIN,
  TYMPANOMETRY_PRESSURE_MAX,
  EVOKED_POTENTIALS_DB_VALUES,
  LING_SOUNDS,
  LING_DISTANCES,
  QUESTIONNAIRE_TYPES,
  HEARING_AID_TYPE_KEYS,
  EARMOLD_TYPE_KEYS,
  CONCLUSION_KEYS,
} from '../picklists/index.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const dateEs = z
  .string()
  .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in dd/mm/yyyy format')
  .refine(val => {
    const [d, m, y] = val.split('/').map(Number);
    const date = new Date(y, m - 1, d);
    return date <= new Date();
  }, 'Date cannot be in the future');

// ─── Introduction ─────────────────────────────────────────────────────────────

export const introductionSchema = z
  .object({
    recipientType: z.enum(['doctor', 'genericEnt', 'professional']),
    doctorId: z.string().nullable().optional(),
    hideName: z.boolean().default(false),
  })
  .refine(
    data => data.recipientType !== 'doctor' || data.doctorId != null,
    { message: 'doctorId is required when recipientType is "doctor"', path: ['doctorId'] }
  );

// ─── Collaborativeness ────────────────────────────────────────────────────────

export const collaborativenessSchema = z.object({
  value: z.enum(COLLABORATIVENESS_VALUES),
});

// ─── Ear (Otoscopy + Tympanometry) — tutto-o-niente per lato ─────────────────

const earSideSchema = z.object({
  otoscopyResult: z.enum(OTOSCOPY_RESULTS),
  otoscopyImageUrl: z.string().url().nullable().optional(),
  tympanometryType: z.enum(TYMPANOMETRY_TYPES),
  tympanometryPressure: z
    .number()
    .int()
    .min(TYMPANOMETRY_PRESSURE_MIN)
    .max(TYMPANOMETRY_PRESSURE_MAX),
  tympanometryImageUrl: z.string().url().nullable().optional(),
});

export const earSchema = z.object({
  left: earSideSchema.nullable().optional(),
  right: earSideSchema.nullable().optional(),
});

// ─── Evoked Potentials — tutto-o-niente per lato ─────────────────────────────

const evokedEarSchema = z.object({
  db: z.number().refine(v => EVOKED_POTENTIALS_DB_VALUES.includes(v), {
    message: 'dB must be between 0 and 130 in steps of 5',
  }),
  pass: z.boolean(),
});

export const evokedPotentialsSchema = z
  .object({
    performer: z.enum(['ourCentre', 'specialist']),
    specialistDate: dateEs.nullable().optional(),
    left: evokedEarSchema.nullable().optional(),
    right: evokedEarSchema.nullable().optional(),
  })
  .refine(
    data => data.performer !== 'specialist' || data.specialistDate != null,
    { message: 'specialistDate is required when performer is "specialist"', path: ['specialistDate'] }
  )
  .refine(
    data => data.left != null || data.right != null,
    { message: 'At least one ear (left or right) must be provided' }
  );

// ─── Ling Test ────────────────────────────────────────────────────────────────

export const lingTestSchema = z
  .object({
    distances: z
      .array(z.enum(LING_DISTANCES))
      .min(1, 'At least one distance must be selected')
      .refine(arr => new Set(arr).size === arr.length, 'Distances must be unique'),
    results: z.record(
      z.enum(LING_SOUNDS),
      z.record(z.enum(LING_DISTANCES), z.boolean())
    ),
  })
  .refine(
    data => {
      // ogni suono deve avere solo le chiavi delle distanze selezionate
      for (const [, distMap] of Object.entries(data.results)) {
        for (const dist of Object.keys(distMap)) {
          if (!data.distances.includes(dist)) return false;
        }
      }
      return true;
    },
    { message: 'Results contain distances not present in the selected distances list' }
  );

// ─── Questionnaire ────────────────────────────────────────────────────────────

const cosiSchema = z.object({
  sessionDate: dateEs,
  needs: z
    .array(z.string().min(1))
    .length(3, 'COSI requires exactly 3 needs'),
});

export const questionnaireSchema = z
  .object({
    type: z.enum(QUESTIONNAIRE_TYPES),
    notes: z.string().nullable().optional(),
    cosi: cosiSchema.nullable().optional(),
  })
  .refine(
    data => data.type !== 'COSI' || data.cosi != null,
    { message: 'cosi data is required when type is "COSI"', path: ['cosi'] }
  );

// ─── Fitting — tutto-o-niente per lato ───────────────────────────────────────

const fittingSideSchema = z.object({
  hearingAidType: z.enum(HEARING_AID_TYPE_KEYS),
  hearingAidCode: z.string(), // auto-popolato; validato in service layer
  earmoldType: z.enum(EARMOLD_TYPE_KEYS).nullable().optional(),
  earmoldCode: z.string().nullable().optional(),
  remRecdVerified: z.boolean().default(false),
});

export const fittingSchema = z.object({
  left: fittingSideSchema.nullable().optional(),
  right: fittingSideSchema.nullable().optional(),
});

// ─── Conclusions ──────────────────────────────────────────────────────────────

export const conclusionsSchema = z
  .object({
    value: z.enum(CONCLUSION_KEYS),
    documentationPending: z.boolean().default(false),
    pendingDocumentationText: z.string().nullable().optional(),
  })
  .refine(
    data => !data.documentationPending || (data.pendingDocumentationText ?? '').trim().length > 0,
    { message: 'pendingDocumentationText is required when documentationPending is true', path: ['pendingDocumentationText'] }
  );

// ─── Final Notes ──────────────────────────────────────────────────────────────

export const finalNotesSchema = z.object({
  text: z.string().min(1, 'Final notes text is required'),
});

// ─── Report (schema radice) ───────────────────────────────────────────────────

export const reportSchema = z.object({
  patientId: z.string().min(1),
  introduction: introductionSchema,
  collaborativeness: collaborativenessSchema,
  ear: earSchema.optional(),
  tests: z
    .object({
      evokedPotentials: evokedPotentialsSchema.nullable().optional(),
      lingTest: lingTestSchema.nullable().optional(),
    })
    .optional(),
  questionnaire: questionnaireSchema.optional(),
  fitting: fittingSchema.optional(),
  conclusions: conclusionsSchema,
  finalNotes: finalNotesSchema,
});
