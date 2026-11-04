/**
 * Test di integrazione per il rendering PDF.
 * Puppeteer lancia un browser headless reale — timeout esteso.
 */
import request from 'supertest';
import app from '../src/app.js';
import { generateDevToken } from '../src/middleware/auth.js';

const TOKEN = generateDevToken({ id: 'PRO001', name: 'Test', surname: 'Professional' });
const AUTH = { Authorization: `Bearer ${TOKEN}` };

const minimalReport = {
  patientId: 'PAT001',
  introduction: { recipientType: 'professional' },
  collaborativeness: { value: 'Collaborative' },
  ear: {
    left: {
      otoscopyResult: 'Normal',
      tympanometryType: 'A',
      tympanometryPressure: 10,
    },
  },
  conclusions: { value: 'CONCLUSION_1', documentationPending: false },
  finalNotes: { text: 'Sin observaciones adicionales.' },
};

describe('POST /api/reports (PDF)', () => {
  it(
    'returns a valid PDF buffer when Accept: application/pdf',
    async () => {
      const res = await request(app)
        .post('/api/reports')
        .set({ ...AUTH, Accept: 'application/pdf' })
        .send(minimalReport);

      expect(res.status).toBe(201);
      expect(res.type).toMatch(/pdf/);
      // Verifica magic bytes %PDF
      expect(res.body.slice(0, 4).toString()).toBe('%PDF');
    },
    60_000 // timeout 60s per il browser headless
  );
});
