import { Module } from '@nestjs/common';
import { AppController } from './controllers/authorize.controller';
import { KeyCloakHttpService } from './services/keycloak-http.service';

@Module({
  controllers: [AppController],
  providers: [KeyCloakHttpService],
})
export class AuthorizeModule {}
