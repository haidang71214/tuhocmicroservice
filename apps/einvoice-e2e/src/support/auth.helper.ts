import { CreateUserRequestDto } from '@common/interfaces/gateway/user';
import { ROLE_ID } from '@common/constant/enum/role.enum';
import axios from 'axios';
import { LoginResponseDto, LoginRequestDto } from '@common/interfaces/gateway/authorize';

export interface TestUserCredentials {
  email: string;
  password: string;
}
export const getAccessToken = async (): Promise<{ accessToken: string; user: TestUserCredentials }> => {
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = `Pass${Date.now()}@123`;
  const testUser: CreateUserRequestDto = {
    firstName: 'test',
    lastName: 'user',
    email: testEmail,
    password: testPassword,
    // sở dĩ mình có thể lấy được id là vì mình đã hard code ở trong seed
    role: [ROLE_ID.ADMIN],
  };
  // register
  try {
    await axios.post('/user', testUser);
  } catch (error: any) {
    console.warn('Registration fails:', error.response?.data || error.message);
  }
  try {
    const res = await axios.post<{ data: LoginResponseDto }>(`/auth/login`, {
      username: testEmail,
      password: testPassword,
    });
    const accessToken = res.data.data.accessToken;

    if (!accessToken) {
      throw new Error('No access token');
    }
    console.log(accessToken);

    return { accessToken, user: { email: testEmail, password: testPassword } };
  } catch (error) {
    console.log('Login false', error.response?.data || error?.message);
    throw error;
  }
};
