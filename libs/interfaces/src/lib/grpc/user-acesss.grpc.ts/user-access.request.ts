import { User } from '@common/schemas/lib/user.schema';
import { Observable } from 'rxjs';

export type userAcessRequest = {
  id: string;
  processId: string;
};
export type userAcessResponse = {
  code: string;
  data: User;
  error: string;
  statusCode?: number;
};
export interface UserAccessService {
  getByUserId(params: userAcessRequest): Observable<userAcessResponse>;
}
