import { parseToken } from './string.util';

export function getAccessToken(request: any, keepBearer = false): string {
  const token = request.headers?.['authorization'];
  return keepBearer ? token : parseToken(token);
}
