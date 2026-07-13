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
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constant';
import { getAccessToken } from '@common/utils/request.util';
import { getProcessId } from '@common/utils/string.util';
import { setUserData } from '@common/utils/request.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { GRPC_SERVICES } from '@common/configuration/gRPC.config';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthorizerService } from '@common/interfaces/grpc/authorizer';
@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  private authorizerService!: AuthorizerService;

  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(GRPC_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerGrpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    // truyền đúng cái tên service mà file proto định nghĩa.
    this.authorizerService = this.authorizerGrpcClient.getService<AuthorizerService>('AuthorizerService');
  }

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
      // gửi token về -> lấy user data và nhét vô
      const response = await firstValueFrom(this.authorizerService.verifyUserToken({ token, processId }));
      console.log('response', response);

      const { data: result } = response;
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

  generateTokenCaceKey = (token: string) => {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return `user-hash:${hash}`;
  };
}
