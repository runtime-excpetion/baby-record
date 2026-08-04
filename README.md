# 宝宝成长记录系统 · Monorepo

> pnpm workspace 管理：NestJS 后端 + Vue3 前端 + 共享类型包

## 结构

```
baby-record-system
├── apps
│   ├── backend      NestJS 后端（不修改业务逻辑）
│   └── frontend     Vue3 前端
├── packages
│   └── shared       前后端复用类型
└── package.json
```

## 快速开始

```bash
# 安装全部依赖
pnpm install

# 启动前端
pnpm dev            # 即 pnpm dev:frontend

# 启动后端（需先配置 apps/backend/.env 与数据库）
pnpm dev:backend

# 后端数据库迁移与种子
pnpm --filter @baby-record/backend prisma:migrate
pnpm --filter @baby-record/backend prisma:seed
```

## 说明

- 后端文档见 `apps/backend/README.md` 与 `apps/backend/docs/`
- 前端默认通过 `VITE_API_BASE_URL` 调用后端，见 `apps/frontend/.env.example`
- 前后端共享类型在 `packages/shared`
