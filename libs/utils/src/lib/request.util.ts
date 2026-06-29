import { parseToken } from './string.util';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { MetadataKeys } from '@common/constant/common.constant';
export function getAccessToken(request: any, keepBearer = false): string {
  const token = request.headers?.['authorization'];
  return keepBearer ? token : parseToken(token);
}
export function setUserData(request: any, userData: AuthorizeResponse) {
  request[MetadataKeys.USER_DATA] = userData;
}
