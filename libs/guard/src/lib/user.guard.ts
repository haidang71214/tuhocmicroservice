import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constant';
import { getAccessToken } from '@common/utils/request.util';
import { getProcessId } from '@common/utils/string.util';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { setUserData } from '@common/utils/request.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(MetadataKeys.SECURED, context.getHandler());

    const request = context.switchToHttp().getRequest();

    // Nếu không yêu cầu bảo mật (secured: false hoặc undefined), cho phép truy cập luôn
    if (!authOptions?.secured) {
      return true;
    }

    return this.verifyToken(request);
  }

  private async verifyToken(request: any): Promise<boolean> {
    try {
      const token = getAccessToken(request);
      const processId = request[MetadataKeys.PROCESS_ID] || getProcessId();
      const cacheKey = this.generateTokenCaceKey(token);

      const cacheData = await this.cacheManager.get<any>(cacheKey); // quan trọng là bước này
      if (cacheData) {
        setUserData(request, cacheData);
        return true;
      }

      const result = await this.verifyUserToken(token, processId);
      if (!result?.valid) {
        throw new UnauthorizedException('token invalid');
      }

      setUserData(request, result);
      await this.cacheManager.set(cacheKey, result); // và bước này

      return true;
    } catch (error: any) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw error instanceof UnauthorizedException ? error : new ForbiddenException(error.message);
    }
  }

  // Gửi request qua TCP tới AuthorizeService để kiểm tra token
  private async verifyUserToken(token: string, processId: string): Promise<any> {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, any>(TCP_REQUEST_MESSAGE.Authorizer.VERIFY_USER_TOKEN, {
          data: token,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  generateTokenCaceKey = (token: string) => {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return `user-hash:${hash}`;
  };
}
