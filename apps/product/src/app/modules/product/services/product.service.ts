import { Response } from '@common/interfaces/tcp/common/response.interface';
import { CreateProductTCPRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repositories';
import { HTTP_MESSAGE } from '@invoce/constant';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProductService(params: CreateProductTCPRequest): Promise<Response<ProductTcpResponse>> {
    const product = await this.productRepository.create(params);
    return Response.success<ProductTcpResponse>(product);
  }
  async getAllProductsService(): Promise<Response<ProductTcpResponse[]>> {
    const product = await this.productRepository.findAll();
    return Response.success<ProductTcpResponse[]>(product);
  }
}
