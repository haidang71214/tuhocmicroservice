import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleDestination } from '@common/schemas/lib/role.schema';

@Module({
  imports: [MongooseModule.forFeature([RoleDestination])],
  exports: [MongooseModule],
})
export class RoleModule {}
