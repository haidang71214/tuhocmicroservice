import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@common/schemas/lib/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTCPRequest } from '@common/interfaces/tcp/user';
import { createUserRequestMapping } from '../mapper';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { CreateKeyCloakTcpReq } from '@common/interfaces/tcp/authorizer/authorizer-request.tcp';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    // import 2 giao thức tcp
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly TcpClient: TcpClient,
  ) {}

  getAll() {
    return this.userRepository.getAll();
  }

  async create(data: CreateUserTCPRequest, processId: string) {
    const mapped = createUserRequestMapping(data);
    let userId: string;
    try {
      userId = await this.createKeyCloakUser(
        {
          email: mapped.email!,
          firstName: mapped.firstName!,
          lastName: mapped.lastName!,
          password: data.password,
        },
        processId,
      );
    } catch (error: any) {
      Logger.error(`[UserService.create] createKeyCloakUser failed: ${JSON.stringify(error)}`, error?.stack);
      throw error;
    }
    mapped.userId = userId;
    return this.userRepository.create(mapped);
  }

  getById(id: string) {
    return this.userRepository.getById(id);
  }
  // cái này get cho keycloak
  getByUserId(userId: string) {
    return this.userRepository.getByUserId(userId);
  }

  getByEmail(email: string) {
    return this.userRepository.getByEmail(email);
  }

  exists(email: string) {
    return this.userRepository.exists(email);
  }

  createKeyCloakUser(data: CreateKeyCloakTcpReq, @ProcessId() processId: string) {
    return firstValueFrom(
      this.TcpClient.send(TCP_REQUEST_MESSAGE.KeyCloak.CREATE_USER, {
        data,
        processId,
      }).pipe(map((data) => data.data)),
    );
  }
}
