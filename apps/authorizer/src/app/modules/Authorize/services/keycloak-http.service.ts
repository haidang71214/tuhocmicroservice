import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateKeyCloakUserRequest, ExchangeClientTokenResponse } from '@common/interfaces/common/keycloak.interface';

// đóng gói các http gửi tới keycloak.
@Injectable()
export class KeyCloakHttpService {
  private readonly logger = new Logger(KeyCloakHttpService.name);
  private readonly axiosInstance: AxiosInstance;
  private realm: string;
  private clientId: string;
  private clientSecret: string;
  // tự động chạy khi nest khởi động.
  // vì mình có injectable() thế nên
  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('KEYCLOAK_CONFIG.HOST');
    const port = this.configService.get<number>('KEYCLOAK_CONFIG.PORT');

    this.axiosInstance = axios.create({
      baseURL: `${host}:${port}`,
    });
    // nạp môi trường và gán.
    this.realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM') || '';
    this.clientId = this.configService.get<string>('KEYCLOAK_CONFIG.CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CONFIG.CLIENT_SECRET') || '';
  }
  // cái này để lấy token ra ha,
  async exchangeClientToken(): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('grant_type', 'client_credentials');
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post<ExchangeClientTokenResponse>(
      `/realms/${this.realm}/protocol/openid-connect/token`,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return data;
  }

  async createUser(data: CreateKeyCloakUserRequest): Promise<string> {
    const { email, firstName, lastName, password } = data;
    const { access_token: accessToken } = await this.exchangeClientToken();

    const { headers } = await this.axiosInstance.post(
      `/admin/realms/${this.realm}/users`,
      {
        firstName,
        lastName,
        email,
        username: email,
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const userId = headers['location']?.split('/').pop();
    if (!userId) {
      throw new InternalServerErrorException('user not created');
    }
    return userId;
  }
}
