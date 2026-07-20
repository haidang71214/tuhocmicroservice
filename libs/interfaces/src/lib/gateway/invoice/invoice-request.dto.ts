import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ClientRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address!: string;
}

class ItemRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  quantity!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitPrice!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vatRate!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  total!: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class InvoiceRequestDto {
  @ApiProperty({ type: ClientRequestDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientRequestDto)
  client!: ClientRequestDto;

  @ApiProperty({ type: [ItemRequestDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ItemRequestDto)
  items!: ItemRequestDto[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  vatAmount!: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  supervisorId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fileUrl?: string;
}
