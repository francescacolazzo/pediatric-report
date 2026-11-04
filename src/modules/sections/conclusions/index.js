/**
 * Section builder — Conclusions
 */
import { getConclusionPhrase } from '../../../picklists/index.js';

export function renderConclusions(conclusions) {
  if (!conclusions) return null;
  const phrase = getConclusionPhrase(conclusions.value);
  return {
    phrase,
    documentationPending: conclusions.documentationPending,
    pendingText: conclusions.documentationPending
      ? `Documentación pendiente para realizar la adaptación: ${conclusions.pendingDocumentationText}`
      : null,
  };
}
