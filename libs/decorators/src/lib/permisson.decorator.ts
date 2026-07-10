import { PERMISSION } from '@common/constant/enum/role.enum';
import { Reflector } from '@nestjs/core';
// phần này có hơi khác, vì cái này xử lí ở thuộc tính Api, không truyền request vô
// tức là nó tạo decorator ở trên controller
export const Permissons = Reflector.createDecorator<PERMISSION[]>();
