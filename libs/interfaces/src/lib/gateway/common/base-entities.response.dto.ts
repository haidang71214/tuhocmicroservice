import { ApiProperty } from '@nestjs/swagger';

export class BaseEntitiesResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt?: Date;
}
