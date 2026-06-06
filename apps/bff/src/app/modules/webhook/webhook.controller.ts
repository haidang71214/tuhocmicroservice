import { Controller, Headers, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { ProcessId } from '@common/decorator/lib/processId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { HTTP_MESSAGE } from '@common/constant/enum/http-message.enum';
import { StripeWebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('stripe')
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiOkResponse({
    type: ResponseDto<string>,
  })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    await this.stripeWebhookService.processWebhook({
      processId,
      rawBody: req.rawBody,
      signature,
    });
    return Response.success<string>(HTTP_MESSAGE.OK);
  }
}
