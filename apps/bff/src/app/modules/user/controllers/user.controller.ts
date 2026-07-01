import { Body, Controller, Delete, Get, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interfaces';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto } from '@common/interfaces/gateway/user';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { CreateUserTCPRequest, UpdateUserTCPRequest, UserTcpResponse } from '@common/interfaces/tcp/user';
import { TCP_REQUEST_MESSAGE } from '@common/constant/enum/tcp-invoice.enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<UserResponseDto> })
  @ApiOperation({ summary: 'Create user' })
  async createUser(@Body() data: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserTcpResponse, CreateUserTCPRequest>(TCP_REQUEST_MESSAGE.User.CREATE, {
        data,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get()
  @ApiOkResponse({ type: ResponseDto<UserResponseDto[]> })
  @ApiOperation({ summary: 'Get all users' })
  async getAllUsers(@ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserTcpResponse[], string>(TCP_REQUEST_MESSAGE.User.GET_ALL, { processId })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Get(':id')
  @ApiOkResponse({ type: ResponseDto<UserResponseDto> })
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserTcpResponse, { id: string }>(TCP_REQUEST_MESSAGE.User.GET_BY_ID, {
        data: { id },
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Put(':id')
  @ApiOkResponse({ type: ResponseDto<UserResponseDto> })
  @ApiOperation({ summary: 'Update user by ID' })
  async updateUser(@Param('id') id: string, @Body() data: UpdateUserRequestDto, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<UserTcpResponse, { id: string; data: UpdateUserTCPRequest }>(TCP_REQUEST_MESSAGE.User.UPDATE_BY_ID, {
        data: { id, data },
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Delete(':id')
  @ApiOkResponse({ type: ResponseDto<any> })
  @ApiOperation({ summary: 'Delete user by ID' })
  async deleteUser(@Param('id') id: string, @ProcessId() processId: string) {
    return this.userAccessClient
      .send<any, { id: string }>(TCP_REQUEST_MESSAGE.User.DELETE_BY_ID, {
        data: { id },
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
