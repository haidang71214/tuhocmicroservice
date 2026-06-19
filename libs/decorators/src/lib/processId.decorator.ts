import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MetadataKeys } from '@common/constant/common.constant';
import { getProcessId } from '@common/utils/string.util';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  if (ctx.getType() === 'http') {
    const request = ctx.switchToHttp().getRequest();
    return request[MetadataKeys.PROCESS_ID] || getProcessId();
  }
  if (ctx.getType() === 'rpc') {
    const rpcData = ctx.switchToRpc().getData();
    return rpcData?.processId || getProcessId();
  }
  return getProcessId();
});
