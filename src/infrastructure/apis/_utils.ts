export const BASE_URL = `${process.env.BASE_ROUTE}`;
export const BASE_CADIDATE_ID = `${process.env.CANDIDATE_ID}`;
export const URL_POLYANETS = `${BASE_URL}/api/polyanets`;
export const URL_SOLOONS = `${BASE_URL}/api/soloons`;
export const URL_COMETH = `${BASE_URL}/api/comeths`;
export const URL_GOAL = `${BASE_URL}/api/map/${BASE_CADIDATE_ID}/goal`;

export const getHeaders = () => ({
  'Content-Type': 'application/json',
});
