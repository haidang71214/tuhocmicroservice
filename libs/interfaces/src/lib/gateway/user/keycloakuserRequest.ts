import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateKeyCloakUserRequest {
  @IsNotEmpty()
  @IsString()
  userName!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
