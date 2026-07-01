import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
// file này là để đọc các trường có trong configuration
export class KeyCloakConfiguration {
  @IsNotEmpty()
  @IsString()
  HOST!: string;
  @IsNotEmpty()
  @IsNumber()
  PORT!: number;
  @IsNotEmpty()
  @IsString()
  REALM!: string;
  @IsNotEmpty()
  @IsString()
  CLIENT_ID!: string;
  @IsNotEmpty()
  @IsString()
  CLIENT_SECRET!: string;
  constructor() {
    this.HOST = process.env['KEYCLOAK_HOST'] || 'localhost';
    this.PORT = Number(process.env['KEYCLOAK_PORT']) || 2000;
    this.REALM = process.env['KEYCLOAK_REALM'] || 'Einvoice';
    this.CLIENT_ID = process.env['KEYCLOAK_CLIENT_ID'] || 'einvoice-app';
    this.CLIENT_SECRET = process.env['KEYCLOAK_CLIENT_SECRET'] || 'none';
  }
}
