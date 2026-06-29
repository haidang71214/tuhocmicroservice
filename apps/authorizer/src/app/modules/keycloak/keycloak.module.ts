import { Module } from '@nestjs/common';
import { KeyCloakHttpService } from './keycloak-http.service';
import { keycloakController } from './keycloak.controller';

@Module({
  controllers: [keycloakController],
  providers: [KeyCloakHttpService],
  exports: [KeyCloakHttpService],
})
export class keyCloakModule {}
