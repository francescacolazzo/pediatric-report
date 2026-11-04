import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

/**
 * Middleware: verifica JWT nell'header Authorization: Bearer <token>
 * Popola req.professional con il payload decodificato.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.professional = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Helper: genera un token di test per sviluppo locale.
 * Usage: node -e "import('./src/middleware/auth.js').then(m => console.log(m.generateDevToken()))"
 */
export function generateDevToken(professional = {}) {
  return jwt.sign(
    {
      id: professional.id ?? 'PRO001',
      name: professional.name ?? 'Dr. Test Professional',
      surname: professional.surname ?? 'Tester',
      ...professional,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}
