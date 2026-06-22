import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/baseResponse.dto';
import { INVOICE_STATUS } from '@common/constant/enum/invoice.enum';
export class ClientResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  address!: string;
}

export class ItemResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  quantity?: number;

  @ApiProperty()
  unitPrice!: number;

  @ApiProperty()
  vatRate!: number;

  @ApiProperty()
  total!: number;
}

export class InvoiceResponseDto extends BaseResponseDto {
  @ApiProperty({ type: ClientResponseDto })
  client!: ClientResponseDto;

  @ApiProperty({ type: [ItemResponseDto] })
  items!: ItemResponseDto[];

  @ApiProperty()
  totalAmount!: number;

  @ApiProperty()
  vatAmount!: number;

  @ApiProperty({ type: String, enum: INVOICE_STATUS })
  status!: INVOICE_STATUS;

  @ApiProperty()
  supervisorId?: string;

  @ApiProperty()
  fileUrl?: string;
}
