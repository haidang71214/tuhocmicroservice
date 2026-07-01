import { Module } from '@nestjs/common';
import { AppController } from './controllers/authorize.controller';
import { AuthorizeService } from './services/authorize.service';
import { keyCloakModule } from '../keycloak/keycloak.module';

@Module({
  imports: [keyCloakModule],
  controllers: [AppController],
  providers: [AuthorizeService],
})
export class AuthorizeModule {}
