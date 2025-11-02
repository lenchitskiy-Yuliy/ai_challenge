import ky from 'ky';

export function getBaseApiClient() {
  return ky.create({ prefixUrl: '/api' });
}
