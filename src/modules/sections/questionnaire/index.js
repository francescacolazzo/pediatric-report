/**
 * Section builder — Questionnaire (ELF / CHILD / COSI)
 */

const TYPE_LABEL_ES = {
  ELF: 'ELF',
  CHILD: 'CHILD',
  COSI: 'COSI',
};

export function renderQuestionnaire(q) {
  if (!q) return null;

  const base = {
    type: q.type,
    typeLabel: TYPE_LABEL_ES[q.type] ?? q.type,
    sentence: `Observación basada en el Cuestionario ${TYPE_LABEL_ES[q.type] ?? q.type}`,
  };

  if (q.type === 'COSI') {
    return {
      ...base,
      cosi: {
        sessionDate: q.cosi.sessionDate,
        // needs sono già i testi modificati localmente dall'audiologo
        needs: q.cosi.needs,
      },
    };
  }

  return { ...base, notes: q.notes ?? '' };
}
