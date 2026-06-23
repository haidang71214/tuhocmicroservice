import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { CreateProductRequestDto, ProductResponseDto } from '@common/interfaces/gateway/product';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { CreateProductTCPRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productTCPName: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'create product' })
  async createProduct(@Body() data: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productTCPName
      .send<ProductTcpResponse, CreateProductTCPRequest>(TCP_REQUEST_MESSAGE.Product.CREATE, {
        data,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get('')
  @ApiOkResponse({ type: ResponseDto<ProductResponseDto[]> })
  @ApiOperation({ summary: 'get all products' })
  async getAllProducts(@ProcessId() processId: string) {
    return this.productTCPName.send<ProductResponseDto[], string>(TCP_REQUEST_MESSAGE.Product.GET_ALL, { processId });
  }
}
