import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService, UserVo } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('记录人身份')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '新增记录人（首次进入选择身份）' })
  create(@Body() dto: CreateUserDto): Promise<UserVo> {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '记录人列表（前端据此选择并缓存当前身份）' })
  findAll(): Promise<UserVo[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '记录人详情' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserVo> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '修改记录人' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto): Promise<UserVo> {
    return this.userService.update(id, dto);
  }
}
