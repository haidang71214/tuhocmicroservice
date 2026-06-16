import { Logger } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

export class BaseConfiguration {
  @IsString()
  NODE_ENV: string;
  @IsBoolean()
  IS_DEV: boolean;

  @IsString()
  @IsNotEmpty()
  GLOBAL_PREFIX: string;

  constructor() {
    this.NODE_ENV = process.env['NODE_ENV'] || 'development';
    this.IS_DEV = this.NODE_ENV === 'development';
    this.GLOBAL_PREFIX = process.env['GLOBAL_PREFIX'] || '';
  }
  validate() {
    const errors = validateSync(this);
    if (errors.length > 0) {
      Logger.error('❌ Configuration validation failed!');

      // Hàm đệ quy để map lỗi mà không kèm thuộc tính "target" (tránh Circular JSON)
      const formatErrors = (validationErrors: any[]): any[] => {
        return validationErrors.map((err) => ({
          property: err.property,
          constraints: err.constraints,
          // Nếu có con (nested), đệ quy để format tiếp
          children: err.children && err.children.length > 0 ? formatErrors(err.children) : undefined,
        }));
      };

      const formatted = formatErrors(errors);

      // Log ra console dạng bảng/JSON đẹp mắt
      console.log(JSON.stringify(formatted, null, 2));

      throw new Error('Configuration Error: ' + JSON.stringify(formatted));
    }
  }
}
