import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MetadataKeys } from '@common/constant/common.constant';
import { PERMISSION } from '@invoce/constant';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { Permissons } from '@common/decorator/lib/permisson.decorator';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PERMISSION[]>(Permissons, context.getHandler());
    // phần này, mình sẽ bọc global, tức là mọi request nếu dính decorator PermissonGuard thì cần phải xác thực
    // nếu request không có decorator PermissionGuard thì không cần xác thực
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userData = request[MetadataKeys.USER_DATA] as AuthorizeResponse;
    const userPermissions = (userData?.metadata?.permissions || []) as PERMISSION[];
    // check xem có quyền nào không
    const isValid = requiredPermissions.every((permission) => userPermissions.includes(permission));

    if (!isValid) {
      throw new ForbiddenException('Permission denied');
    }

    return isValid;
  }
}
