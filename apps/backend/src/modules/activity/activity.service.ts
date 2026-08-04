import { Injectable } from '@nestjs/common';
import { Activity, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessException } from '../../common/exceptions/business.exception';
import { ErrorCode } from '../../common/enums/error-code.enum';
import { DateRangeUtil } from '../../common/utils/date-range.util';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';

export interface ActivityVo {
  id: number;
  babyId: number;
  eventType: string;
  eventTime: string;
  description: string | null;
  remark: string | null;
  creatorId: number;
  createdTime: string;
}

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateActivityDto): Promise<ActivityVo> {
    await this.ensureRefs(dto.babyId, dto.creatorId);
    const activity = await this.prisma.activity.create({
      data: {
        babyId: dto.babyId,
        eventType: dto.eventType,
        eventTime: new Date(dto.eventTime),
        description: dto.description,
        remark: dto.remark,
        creatorId: dto.creatorId,
      },
    });
    return this.toVo(activity);
  }

  async update(id: number, dto: UpdateActivityDto): Promise<ActivityVo> {
    await this.findOne(id);
    const activity = await this.prisma.activity.update({
      where: { id },
      data: {
        ...(dto.eventType !== undefined && { eventType: dto.eventType }),
        ...(dto.eventTime !== undefined && { eventTime: new Date(dto.eventTime) }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.remark !== undefined && { remark: dto.remark }),
      },
    });
    return this.toVo(activity);
  }

  async findAll(query: QueryActivityDto): Promise<PaginatedResult<ActivityVo>> {
    const where = this.buildWhere(query);
    const [list, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        orderBy: { eventTime: 'desc' },
        skip: query.skip,
        take: query.take,
      }),
      this.prisma.activity.count({ where }),
    ]);
    return new PaginatedResult(list.map((a) => this.toVo(a)), total, query.page, query.pageSize);
  }

  async findOne(id: number): Promise<ActivityVo> {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new BusinessException(ErrorCode.RECORD_NOT_FOUND);
    return this.toVo(activity);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.activity.delete({ where: { id } });
  }

  async findByRange(babyId: number, start: Date, end: Date): Promise<Activity[]> {
    return this.prisma.activity.findMany({
      where: { babyId, eventTime: { gte: start, lte: end } },
      orderBy: { eventTime: 'desc' },
    });
  }

  private buildWhere(query: QueryActivityDto): Prisma.ActivityWhereInput {
    const where: Prisma.ActivityWhereInput = { babyId: query.babyId };
    if (query.eventType) where.eventType = { contains: query.eventType };
    if (query.startDate || query.endDate) {
      const range = DateRangeUtil.resolve('custom', query.startDate, query.endDate);
      where.eventTime = { gte: range.start, lte: range.end };
    }
    return where;
  }

  private async ensureRefs(babyId: number, creatorId: number): Promise<void> {
    const baby = await this.prisma.baby.findUnique({ where: { id: babyId }, select: { id: true } });
    if (!baby) throw new BusinessException(ErrorCode.BABY_NOT_FOUND);
    const user = await this.prisma.user.findUnique({ where: { id: creatorId }, select: { id: true } });
    if (!user) throw new BusinessException(ErrorCode.USER_NOT_FOUND);
  }

  private toVo(a: Activity): ActivityVo {
    return {
      id: a.id,
      babyId: a.babyId,
      eventType: a.eventType,
      eventTime: a.eventTime.toISOString(),
      description: a.description,
      remark: a.remark,
      creatorId: a.creatorId,
      createdTime: a.createdTime.toISOString(),
    };
  }
}
