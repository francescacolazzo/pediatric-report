import path from 'path';
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks';
import puppeteer from 'puppeteer';
import { renderIntroduction } from '../sections/introduction/index.js';
import { renderCollaborativeness } from '../sections/collaborativeness/index.js';
import { renderEar } from '../sections/ear/index.js';
import { renderEvokedPotentials } from '../sections/tests/evokedPotentials/index.js';
import { renderLingTest } from '../sections/tests/lingTest/index.js';
import { renderQuestionnaire } from '../sections/questionnaire/index.js';
import { renderFitting } from '../sections/fitting/index.js';
import { renderConclusions } from '../sections/conclusions/index.js';
import { renderFinalNotes } from '../sections/finalNotes/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, 'templates');

const env = nunjucks.configure(TEMPLATES_DIR, { autoescape: true });

// Helper per formattare la data ISO in formato leggibile
env.addFilter('formatDate', (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

/**
 * Assembla il contesto per il template partendo dal reportDocument
 * prodotto da reportService.buildReport().
 */
function buildTemplateContext(doc) {
  return {
    patientId: doc.patientId,
    generatedAt: new Date(doc.generatedAt).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }),
    introduction:     renderIntroduction(doc.introduction),
    collaborativeness: renderCollaborativeness(doc.collaborativeness),
    ear:              renderEar(doc.ear),
    tests: doc.tests ? {
      evokedPotentials: renderEvokedPotentials(doc.tests.evokedPotentials),
      lingTest:         renderLingTest(doc.tests.lingTest),
    } : null,
    questionnaire:    renderQuestionnaire(doc.questionnaire),
    fitting:          renderFitting(doc.fitting),
    conclusions:      renderConclusions(doc.conclusions),
    finalNotes:       renderFinalNotes(doc.finalNotes),
  };
}

/**
 * Renderizza il report come stringa HTML.
 * @param {object} reportDocument - output di reportService.buildReport()
 * @returns {string} HTML
 */
export function renderToHtml(reportDocument) {
  const context = buildTemplateContext(reportDocument);
  return nunjucks.render('report.njk', context);
}

/**
 * Renderizza il report come Buffer PDF usando Puppeteer.
 * Apre un browser headless, carica l'HTML in memoria e stampa in PDF.
 *
 * @param {object} reportDocument - output di reportService.buildReport()
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function renderToPdf(reportDocument) {
  const html = renderToHtml(reportDocument);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
      printBackground: true,
    });
    return pdf;
  } finally {
    await browser.close();
  }
}
