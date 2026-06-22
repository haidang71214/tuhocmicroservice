import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class BaseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createAt!: Date;

  @ApiProperty()
  updateAt?: Date;
}
