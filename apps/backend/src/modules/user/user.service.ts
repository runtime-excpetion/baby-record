import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface UserVo {
  id: number;
  name: string;
  role: string;
  createdTime: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserVo> {
    const user = await this.prisma.user.create({ data: { name: dto.name, role: dto.role } });
    return this.toVo(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserVo> {
    await this.findOne(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.role !== undefined && { role: dto.role }),
      },
    });
    return this.toVo(user);
  }

  async findAll(): Promise<UserVo[]> {
    const list = await this.prisma.user.findMany({ orderBy: { id: 'asc' } });
    return list.map((u) => this.toVo(u));
  }

  async findOne(id: number): Promise<UserVo> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new BusinessException(ErrorCode.USER_NOT_FOUND);
    return this.toVo(user);
  }

  /** 确保记录人存在（供其他模块校验 creatorId） */
  async ensureExists(id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true } });
    if (!user) throw new BusinessException(ErrorCode.USER_NOT_FOUND);
  }

  private toVo(user: User): UserVo {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      createdTime: user.createdTime.toISOString(),
    };
  }
}
