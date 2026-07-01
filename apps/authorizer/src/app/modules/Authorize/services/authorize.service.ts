import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyCloakHttpService } from '../../keycloak/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';

@Injectable()
export class AuthorizeService {
  private readonly logger = new Logger(AuthorizeService.name);
  private readonly jwksClient: JwksClient;

  constructor(
    private readonly keycloakConnect: KeyCloakHttpService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get('KEYCLOAK_CONFIG.HOST');
    const port = this.configService.get('KEYCLOAK_CONFIG.PORT');
    const realm = this.configService.get('KEYCLOAK_CONFIG.REALM');

    this.jwksClient = jwksRsa({
      jwksUri: `${host}:${port}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(data: LoginTcpRequest) {
    const response = await this.keycloakConnect.exchangeUserToken(data);
    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  async verifyUserToken(token: string, processId: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }
    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      this.logger.debug({ payload });

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: [],
          user: null,
          userId: null,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Invalid token');
    }
  }
}
