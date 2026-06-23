import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vatRate!: number;
}

export class UpdateProductRequestDto extends PartialType(CreateProductRequestDto) {}
