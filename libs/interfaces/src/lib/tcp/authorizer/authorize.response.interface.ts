import { User } from '@common/schemas/lib/user.schema';
import { LoginResponseDto } from '../../gateway/authorize/authorize.response.dto';
import { PERMISSION } from '@common/constant/enum/role.enum';
import { JwtPayload } from 'jsonwebtoken';
export type LoginTcpResponse = LoginResponseDto;

// AuthorizedMetadata đại diện cho 1 phiên đăng nhập
// metadata này sẽ được lưu trong cache memory để tránh gọi database
export class AuthorizedMetadata {
  userId: string | undefined;
  user: User | undefined;
  permissions: PERMISSION[] | undefined;
  jwt: JwtPayload | undefined;

  constructor(payload?: Partial<AuthorizedMetadata>) {
    Object.assign(this, payload);
  }
}

export class AuthorizeResponse {
  valid = false;
  metadata = new AuthorizedMetadata();

  constructor(payload?: Partial<AuthorizeResponse>) {
    Object.assign(this, payload);
  }
}
