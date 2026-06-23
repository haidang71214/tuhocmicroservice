import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
import { RequestParams } from '@common/decorator/lib/request.decorator';
import type { CreateProductTCPRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/TcpLogging.interceptor';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.Product.CREATE)
  async createProduct(@RequestParams() params: CreateProductTCPRequest): Promise<Response<ProductTcpResponse>> {
    return await this.productService.createProductService(params);
  }
  @MessagePattern(TCP_REQUEST_MESSAGE.Product.GET_ALL)
  async getAllProducts(@RequestParams() params): Promise<Response<ProductTcpResponse[]>> {
    return await this.productService.getAllProductsService();
  }
}
