import { AuthorizeResponse } from '../../tcp/authorizer';

export type VerifyUserTokenResponse = {
  code: string;
  data?: AuthorizeResponse;
  error: string;
};
