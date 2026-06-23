import { ApiProperty } from '@nestjs/swagger';
import { BaseEntitiesResponseDto } from '../common/base-entities.response.dto';

export class ProductResponseDto extends BaseEntitiesResponseDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  sku!: string;

  @ApiProperty()
  unit!: string;

  @ApiProperty()
  price!: number;

  @ApiProperty()
  vatRate!: number;
}
