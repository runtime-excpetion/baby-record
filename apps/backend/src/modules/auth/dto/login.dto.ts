import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '部署时配置的访问密码', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  password: string;
}
