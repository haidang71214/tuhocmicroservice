import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { TypeOrmProvider } from '@common/configuration/type-orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@common/entities/product.entities';
import { ProductRepository } from './repositories/product.repositories';
@Module({
  imports: [TypeOrmProvider, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [],
})
export class ProductModule {}
