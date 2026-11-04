import { Router } from 'express';
import { doctors, findById, search } from '../mocks/salesforce/doctors.js';
import { getCosiSessions } from '../mocks/salesforce/cosi.js';
import { generateDevToken } from '../middleware/auth.js';

export const router = Router();

// GET /mock/sf/doctors — lista tutti i dottori
router.get('/doctors', (_req, res) => {
  res.json(doctors);
});

// GET /mock/sf/doctors/search?q=term — ricerca per nome/cognome
router.get('/doctors/search', (req, res) => {
  const q = req.query.q ?? '';
  if (!q) return res.json(doctors);
  res.json(search(q));
});

// GET /mock/sf/doctors/:id — dettaglio singolo dottore
router.get('/doctors/:id', (req, res) => {
  const doctor = findById(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json(doctor);
});

// GET /mock/sf/patients/:patientId/cosi — sessioni COSI del paziente
router.get('/patients/:patientId/cosi', (req, res) => {
  const sessions = getCosiSessions(req.params.patientId);
  res.json(sessions);
});

// GET /mock/sf/token — genera token di sviluppo per la UI demo
router.get('/token', (req, res) => {
  const token = generateDevToken({
    id: 'PRO001',
    name: req.query.name ?? 'Marco',
    surname: req.query.surname ?? 'Rossi',
  });
  res.json({ token, bearer: `Bearer ${token}` });
});
