import { PrismaClient, UserRole, Gender } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 初始化种子数据：
 * 1. 6 个默认记录人身份（爸爸/妈妈/爷爷/奶奶/姥姥/姥爷）
 * 2. 一个示例宝宝（便于首次进入系统即有数据可看）
 *
 * 运行：npm run prisma:seed
 */
async function main() {
  // 1. 记录人身份
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    await prisma.user.createMany({
      data: [
        { name: '爸爸', role: UserRole.DAD },
        { name: '妈妈', role: UserRole.MOM },
        { name: '爷爷', role: UserRole.GRANDPA_P },
        { name: '奶奶', role: UserRole.GRANDMA_P },
        { name: '姥姥', role: UserRole.GRANDMA_M },
        { name: '姥爷', role: UserRole.GRANDPA_M },
      ],
    });
    console.log('✅ 已初始化 6 个记录人身份');
  }

  // 2. 示例宝宝
  const babyCount = await prisma.baby.count();
  if (babyCount === 0) {
    await prisma.baby.create({
      data: {
        name: '小宝',
        nickname: '豆豆',
        gender: Gender.MALE,
        birthday: new Date('2026-04-01'),
        birthWeight: 3.5,
        birthHeight: 50.0,
        headCircumference: 34.0,
        birthHospital: '市妇幼保健院',
        remark: '示例宝宝数据',
      },
    });
    console.log('✅ 已创建示例宝宝');
  }

  console.log('🌱 种子数据初始化完成');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
