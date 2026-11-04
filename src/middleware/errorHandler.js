/**
 * Central error handler — must be registered last in Express.
 * Handles Zod validation errors and generic errors.
 */
export function errorHandler(err, req, res, _next) {
  // Zod validation error (thrown manually via zodError helper)
  if (err.name === 'ZodValidationError') {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.errors,
    });
  }

  // Generic error
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  console.error(`[${status}] ${req.method} ${req.path} —`, message);
  return res.status(status).json({ error: message });
}

/**
 * Wraps a Zod parse error into a named error for the central handler.
 */
export function toValidationError(zodError) {
  const err = new Error('Validation failed');
  err.name = 'ZodValidationError';
  err.errors = zodError.errors.map(e => ({
    path: e.path.join('.'),
    message: e.message,
  }));
  return err;
}
