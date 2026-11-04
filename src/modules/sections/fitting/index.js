/**
 * Section builder — Fitting Information
 * Regola tutto-o-niente per lato: null = orecchio non fittato, omesso.
 */

function renderFittingSide(side) {
  if (!side) return null;
  return {
    hearingAidLabel: side.hearingAidType,
    hearingAidCode: side.hearingAidCode,
    earmoldLabel: side.earmoldType ?? null,
    earmoldCode: side.earmoldCode ?? null,
    remRecdVerified: side.remRecdVerified ?? false,
  };
}

export function renderFitting(fitting) {
  if (!fitting) return null;
  const left = renderFittingSide(fitting.left);
  const right = renderFittingSide(fitting.right);
  if (!left && !right) return null;
  return { left, right };
}
