import { Module } from '@nestjs/common';
import { KeyCloakHttpService } from './keycloak-http.service';

@Module({
  providers: [KeyCloakHttpService],
  exports: [KeyCloakHttpService],
})
export class keyCloakModule {}
