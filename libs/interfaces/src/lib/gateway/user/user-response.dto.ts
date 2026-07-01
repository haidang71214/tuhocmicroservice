import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/baseResponse.dto';

export class UserResponseDto extends BaseResponseDto {
  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty({ type: [String] })
  role!: string[];
}
