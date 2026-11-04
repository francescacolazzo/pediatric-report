/**
 * Section builder — Collaborativeness
 */

const ES_VALUES = {
  Collaborative: 'colaborativo',
  'Not Collaborative': 'no colaborativo',
};

export function renderCollaborativeness({ value }) {
  const valueEs = ES_VALUES[value] ?? value;
  return {
    sentence: `Durante la valoración, el niño/a se ha mostrado ${valueEs}.`,
  };
}
