import request from 'supertest';
import app from '../src/app.js';
import { generateDevToken } from '../src/middleware/auth.js';

const TOKEN = generateDevToken({ id: 'PRO001', name: 'Test', surname: 'Professional' });
const AUTH = { Authorization: `Bearer ${TOKEN}` };

// ─── Mock SF endpoints (no auth) ─────────────────────────────────────────────

describe('GET /mock/sf/doctors', () => {
  it('returns 3 doctors', async () => {
    const res = await request(app).get('/mock/sf/doctors');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });
});

describe('GET /mock/sf/doctors/search', () => {
  it('filters by surname', async () => {
    const res = await request(app).get('/mock/sf/doctors/search?q=torres');
    expect(res.status).toBe(200);
    expect(res.body[0].surname).toBe('Torres');
  });
});

describe('GET /mock/sf/doctors/:id', () => {
  it('returns doctor by id', async () => {
    const res = await request(app).get('/mock/sf/doctors/DR001');
    expect(res.status).toBe(200);
    expect(res.body.id).toBe('DR001');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/mock/sf/doctors/UNKNOWN');
    expect(res.status).toBe(404);
  });
});

describe('GET /mock/sf/patients/:patientId/cosi', () => {
  it('returns COSI sessions for known patient', async () => {
    const res = await request(app).get('/mock/sf/patients/PAT001/cosi');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('sessionDate');
    expect(res.body[0].needs).toHaveLength(3);
  });

  it('returns empty array for unknown patient', async () => {
    const res = await request(app).get('/mock/sf/patients/UNKNOWN/cosi');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

// ─── Shared payload ───────────────────────────────────────────────────────────

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

// ─── POST /api/reports — JSON ─────────────────────────────────────────────────

describe('POST /api/reports (JSON)', () => {
  it('requires authentication', async () => {
    const res = await request(app).post('/api/reports').send(minimalReport);
    expect(res.status).toBe(401);
  });

  it('creates a report with minimal required sections', async () => {
    const res = await request(app).post('/api/reports').set(AUTH).send(minimalReport);
    expect(res.status).toBe(201);
    expect(res.body.patientId).toBe('PAT001');
    expect(res.body.introduction.greeting).toBe('Estimado profesional');
    expect(res.body.professional.title).toBe('Especialista en audiología pediátrica');
  });

  it('resolves doctor greeting with name (female)', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({ ...minimalReport, introduction: { recipientType: 'doctor', doctorId: 'DR002' } });
    expect(res.status).toBe(201);
    expect(res.body.introduction.greeting).toBe('Estimada Dra. Torres');
  });

  it('resolves doctor greeting with name (male)', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({ ...minimalReport, introduction: { recipientType: 'doctor', doctorId: 'DR001' } });
    expect(res.status).toBe(201);
    expect(res.body.introduction.greeting).toBe('Estimado Dr. Mendoza');
  });

  it('returns "Estimado Doctor" for genericEnt', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({ ...minimalReport, introduction: { recipientType: 'genericEnt' } });
    expect(res.status).toBe(201);
    expect(res.body.introduction.greeting).toBe('Estimado Doctor');
  });

  it('returns "Estimado Doctor" for doctor with hideName', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({ ...minimalReport, introduction: { recipientType: 'doctor', doctorId: 'DR001', hideName: true } });
    expect(res.status).toBe(201);
    expect(res.body.introduction.greeting).toBe('Estimado Doctor');
  });

  it('returns 404 for unknown doctorId', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({ ...minimalReport, introduction: { recipientType: 'doctor', doctorId: 'UNKNOWN' } });
    expect(res.status).toBe(404);
  });

  it('returns 422 when doctorId missing for doctor type', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({ ...minimalReport, introduction: { recipientType: 'doctor' } });
    expect(res.status).toBe(422);
  });

  it('returns 422 when tympanometry pressure out of range', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({
        ...minimalReport,
        ear: { left: { otoscopyResult: 'Normal', tympanometryType: 'A', tympanometryPressure: 999 } },
      });
    expect(res.status).toBe(422);
  });

  it('auto-populates hearing aid code in fitting', async () => {
    const res = await request(app)
      .post('/api/reports').set(AUTH)
      .send({
        ...minimalReport,
        fitting: { left: { hearingAidType: 'BTE', hearingAidCode: '', remRecdVerified: false } },
      });
    expect(res.status).toBe(201);
    expect(res.body.fitting.left.hearingAidCode).toBe('PAA 010B');
  });
});

// ─── POST /api/reports — HTML renderer ───────────────────────────────────────

describe('POST /api/reports (HTML)', () => {
  it('returns HTML when Accept: text/html', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(minimalReport);
    expect(res.status).toBe(201);
    expect(res.type).toMatch(/html/);
    expect(res.text).toContain('Informe Médico Pediátrico');
    expect(res.text).toContain('Estimado profesional');
    expect(res.text).toContain('Durante la valoración');
  });

  it('HTML contains tympanometry data', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(minimalReport);
    expect(res.text).toContain('A - Movilidad normal');
    expect(res.text).toContain('10'); // tympanometry pressure
  });

  it('HTML contains evoked potentials section', async () => {
    const payload = {
      ...minimalReport,
      tests: {
        evokedPotentials: {
          performer: 'ourCentre',
          left: { db: 30, pass: true },
          right: { db: 40, pass: false },
        },
      },
    };
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.text).toContain('Potenciales Evocados');
    expect(res.text).toContain('30 dB');
    expect(res.text).toContain('PASS');
    expect(res.text).toContain('NO PASS');
  });

  it('HTML contains ling test with selected distances only', async () => {
    const payload = {
      ...minimalReport,
      tests: {
        lingTest: {
          distances: ['1m', '2m'],
          results: {
            '/m/': { '1m': true, '2m': false },
            '/u/': { '1m': true, '2m': true },
            '/a/': { '1m': false, '2m': false },
            '/i/': { '1m': true, '2m': true },
            '/sh/': { '1m': false, '2m': true },
            '/s/': { '1m': false, '2m': false },
          },
        },
      },
    };
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.text).toContain('Test de Ling');
    expect(res.text).toContain('1m');
    expect(res.text).toContain('2m');
    expect(res.text).not.toContain('3-6m'); // distanza non selezionata
  });

  it('HTML contains COSI questionnaire', async () => {
    const payload = {
      ...minimalReport,
      questionnaire: {
        type: 'COSI',
        cosi: {
          sessionDate: '15/03/2026',
          needs: ['Necesidad 1', 'Necesidad 2', 'Necesidad 3'],
        },
      },
    };
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.text).toContain('Cuestionario COSI');
    expect(res.text).toContain('Necesidad 1');
    expect(res.text).toContain('15/03/2026');
  });

  it('HTML contains fitting section with auto-code', async () => {
    const payload = {
      ...minimalReport,
      fitting: {
        left: { hearingAidType: 'RITE_RIC', hearingAidCode: '', remRecdVerified: true },
      },
    };
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.text).toContain('Información de Adaptación');
    expect(res.text).toContain('PAA 010A');
    expect(res.text).toContain('REM/RECD');
  });

  it('HTML contains documentation pending note', async () => {
    const payload = {
      ...minimalReport,
      conclusions: {
        value: 'CONCLUSION_1',
        documentationPending: true,
        pendingDocumentationText: 'Falta informe ORL',
      },
    };
    const res = await request(app)
      .post('/api/reports')
      .set({ ...AUTH, Accept: 'text/html' })
      .send(payload);
    expect(res.status).toBe(201);
    expect(res.text).toContain('Documentación pendiente');
    expect(res.text).toContain('Falta informe ORL');
  });
});

// ─── GET /api/reports/picklists ───────────────────────────────────────────────

describe('GET /api/reports/picklists', () => {
  it('returns all picklist data', async () => {
    const res = await request(app).get('/api/reports/picklists').set(AUTH);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('hearingAidTypes');
    expect(res.body).toHaveProperty('conclusions');
    expect(res.body.tympanometryTypes).toContain('A');
  });
});
