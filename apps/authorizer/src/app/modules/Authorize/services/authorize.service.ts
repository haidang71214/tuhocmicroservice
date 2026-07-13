import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyCloakHttpService } from '../../keycloak/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import jwksRsa, { JwksClient } from 'jwks-rsa';
import { firstValueFrom, map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { TCP_REQUEST_MESSSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { User } from '@common/schemas/lib/user.schema';
import { Role } from '@common/schemas/lib/role.schema';
import { GRPC_SERVICES } from '@common/configuration/gRPC.config';
import { ClientGrpc } from '@nestjs/microservices';
import { UserAccessService } from '@common/interfaces/grpc/user-acesss.grpc.ts/user-access.request';
@Injectable()
export class AuthorizeService {
  private readonly logger = new Logger(AuthorizeService.name);
  private readonly jwksClient: JwksClient;
  private userAccessService: UserAccessService;

  constructor(
    @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
    private readonly keycloakConnect: KeyCloakHttpService,
    private readonly configService: ConfigService,
    @Inject(GRPC_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessGrpcClient: ClientGrpc,
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

  onModuleInit() {
    this.userAccessService = this.userAccessGrpcClient.getService<UserAccessService>('UserAccessService');
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
      const user = await this.validationUser(payload.sub, processId);
      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: ((user.role as unknown as Role[]) || []).flatMap((role) => role.permissions ?? []),
          user: user,
          userId: user.id,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  private async validationUser(userId: string, processId: string) {
    let user: User | null;
    try {
      user = await this.getUserByUserId(userId, processId);
    } catch (error) {
      this.logger.error(`[validationUser] TCP call failed: ${(error as any)?.message}`);
      throw new UnauthorizedException('User service unavailable');
    }

    if (!user) {
      this.logger.error(`[validationUser] No user found in DB for userId="${userId}"`);
      throw new UnauthorizedException('Invalid user');
    }
    return user;
  }

  private async getUserByUserId(userId: string, processId: string): Promise<User | null> {
    const response = await firstValueFrom(this.userAccessService.getByUserId({ id: userId, processId }));
    Logger.log('ahihi', response);
    return response.data ?? null;
  }
}
