import { MetadataKeys } from '@common/constant/common.constant';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
// false public, true private
export const Authorization = ({ secured = false }: { secured?: boolean }) => {
  const setMetadata = SetMetadata(MetadataKeys.SECURED, {
    secured: true,
  });
  if (secured) {
    const decorator = [ApiBearerAuth()]; // cho phép auth trên swagger
    return applyDecorators(...decorator, setMetadata);
  }
  return setMetadata;
};
