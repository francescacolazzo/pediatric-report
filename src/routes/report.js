import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { reportSchema } from '../schemas/report.js';
import { buildReport } from '../modules/report/reportService.js';
import { renderToHtml, renderToPdf } from '../modules/render/index.js';
import { toValidationError } from '../middleware/errorHandler.js';

export const router = Router();

// Tutti gli endpoint del report richiedono autenticazione
router.use(authenticate);

/**
 * POST /api/reports
 *
 * Valida il payload, assembla e renderizza il report.
 * - Accept: application/json  → restituisce il documento JSON
 * - Accept: text/html         → restituisce l'HTML del report
 *
 * Il rendering PDF (Fase 3, con Puppeteer) sarà aggiunto qui
 * con Accept: application/pdf.
 */
router.post('/', async (req, res, next) => {
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) return next(toValidationError(parsed.error));

  try {
    const reportDoc = buildReport(parsed.data, req.professional);

    const accept = req.headers.accept ?? '';

    // application/pdf → genera PDF con Puppeteer
    if (accept.includes('application/pdf')) {
      const pdf = await renderToPdf(reportDoc);
      res.status(201)
        .type('application/pdf')
        .set('Content-Disposition', 'inline; filename="informe-medico-pediatrico.pdf"')
        .send(pdf);
      return;
    }

    // text/html → HTML diretto (preview)
    if (accept.includes('text/html') && !accept.includes('application/json')) {
      const html = renderToHtml(reportDoc);
      return res.status(201).type('html').send(html);
    }

    // default → JSON
    return res.status(201).json(reportDoc);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reports/picklists
 *
 * Restituisce tutti i valori statici dei picklist per il front-end.
 */
router.get('/picklists', async (_req, res) => {
  const {
    COLLABORATIVENESS_VALUES,
    OTOSCOPY_RESULTS,
    TYMPANOMETRY_TYPES,
    TYMPANOMETRY_PRESSURE_MIN,
    TYMPANOMETRY_PRESSURE_MAX,
    EVOKED_POTENTIALS_DB_VALUES,
    LING_SOUNDS,
    LING_DISTANCES,
    QUESTIONNAIRE_TYPES,
    HEARING_AID_TYPES,
    EARMOLD_TYPES,
    CONCLUSION_VALUES,
  } = await import('../picklists/index.js');

  res.json({
    collaborativeness: COLLABORATIVENESS_VALUES,
    otoscopyResults: OTOSCOPY_RESULTS,
    tympanometryTypes: TYMPANOMETRY_TYPES,
    tympanometryPressure: { min: TYMPANOMETRY_PRESSURE_MIN, max: TYMPANOMETRY_PRESSURE_MAX },
    evokedPotentialsDb: EVOKED_POTENTIALS_DB_VALUES,
    lingSounds: LING_SOUNDS,
    lingDistances: LING_DISTANCES,
    questionnaireTypes: QUESTIONNAIRE_TYPES,
    hearingAidTypes: HEARING_AID_TYPES,
    earmoldTypes: EARMOLD_TYPES,
    conclusions: CONCLUSION_VALUES,
  });
});
