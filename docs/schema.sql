-- =====================================================================
-- 宝宝成长记录服务 · PostgreSQL 数据库初始化脚本
-- 数据库: baby-db
-- 说明: 本脚本与 prisma/schema.prisma 一致，可直接执行建库。
--       生产环境推荐使用 prisma migrate deploy 管理 migrations。
-- =====================================================================

-- ===================== 枚举类型 =====================
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

CREATE TYPE "UserRole" AS ENUM ('DAD', 'MOM', 'GRANDPA_P', 'GRANDMA_P', 'GRANDMA_M', 'GRANDPA_M');

CREATE TYPE "FeedingType" AS ENUM ('BREAST_MILK', 'FORMULA', 'MIXED');

CREATE TYPE "DiaperType" AS ENUM ('PEE', 'POOP', 'BOTH');

CREATE TYPE "SleepType" AS ENUM ('DAYTIME', 'NIGHT');

-- updated_time 自动更新函数
CREATE OR REPLACE FUNCTION set_updated_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_time = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===================== baby =====================
CREATE TABLE "baby" (
  "id"                 SERIAL PRIMARY KEY,
  "name"               TEXT NOT NULL,
  "nickname"           TEXT,
  "gender"             "Gender" NOT NULL,
  "birthday"           DATE NOT NULL,
  "birth_weight"       DECIMAL(6,2),
  "birth_height"       DECIMAL(5,1),
  "head_circumference" DECIMAL(5,1),
  "birth_hospital"     TEXT,
  "remark"             TEXT,
  "created_time"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_time"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER baby_updated_time
  BEFORE UPDATE ON "baby"
  FOR EACH ROW EXECUTE FUNCTION set_updated_time();

-- ===================== user =====================
CREATE TABLE "user" (
  "id"           SERIAL PRIMARY KEY,
  "name"         TEXT NOT NULL,
  "role"         "UserRole" NOT NULL,
  "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ===================== feeding =====================
CREATE TABLE "feeding" (
  "id"               SERIAL PRIMARY KEY,
  "baby_id"          INTEGER NOT NULL,
  "feeding_time"     TIMESTAMP(3) NOT NULL,
  "feeding_type"     "FeedingType" NOT NULL,
  "amount_ml"        INTEGER,
  "duration_minutes" INTEGER,
  "remark"           TEXT,
  "creator_id"       INTEGER NOT NULL,
  "created_time"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "feeding_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "feeding_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "feeding_baby_id_feeding_time_idx" ON "feeding"("baby_id", "feeding_time");
CREATE INDEX "feeding_creator_id_idx"            ON "feeding"("creator_id");

-- ===================== diaper =====================
CREATE TABLE "diaper" (
  "id"           SERIAL PRIMARY KEY,
  "baby_id"      INTEGER NOT NULL,
  "change_time"  TIMESTAMP(3) NOT NULL,
  "type"         "DiaperType" NOT NULL,
  "remark"       TEXT,
  "creator_id"   INTEGER NOT NULL,
  "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "diaper_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "diaper_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "diaper_baby_id_change_time_idx" ON "diaper"("baby_id", "change_time");
CREATE INDEX "diaper_creator_id_idx"           ON "diaper"("creator_id");

-- ===================== sleep =====================
CREATE TABLE "sleep" (
  "id"               SERIAL PRIMARY KEY,
  "baby_id"          INTEGER NOT NULL,
  "start_time"       TIMESTAMP(3) NOT NULL,
  "end_time"         TIMESTAMP(3),                 -- 空 = 正在睡眠
  "duration_minutes" INTEGER,                      -- 结束时回填
  "sleep_type"       "SleepType" NOT NULL,
  "remark"           TEXT,
  "creator_id"       INTEGER NOT NULL,
  "created_time"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sleep_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "sleep_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "sleep_baby_id_start_time_idx" ON "sleep"("baby_id", "start_time");
CREATE INDEX "sleep_creator_id_idx"          ON "sleep"("creator_id");

-- ===================== supplement =====================
CREATE TABLE "supplement" (
  "id"           SERIAL PRIMARY KEY,
  "baby_id"      INTEGER NOT NULL,
  "name"         TEXT NOT NULL,
  "amount"       TEXT,
  "unit"         TEXT,
  "take_time"    TIMESTAMP(3) NOT NULL,
  "remark"       TEXT,
  "creator_id"   INTEGER NOT NULL,
  "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "supplement_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "supplement_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "supplement_baby_id_take_time_idx" ON "supplement"("baby_id", "take_time");
CREATE INDEX "supplement_creator_id_idx"          ON "supplement"("creator_id");

-- ===================== activity =====================
CREATE TABLE "activity" (
  "id"           SERIAL PRIMARY KEY,
  "baby_id"      INTEGER NOT NULL,
  "event_type"   TEXT NOT NULL,
  "event_time"   TIMESTAMP(3) NOT NULL,
  "description"  TEXT,
  "remark"       TEXT,
  "creator_id"   INTEGER NOT NULL,
  "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "activity_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "activity_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "activity_baby_id_event_time_idx" ON "activity"("baby_id", "event_time");
CREATE INDEX "activity_creator_id_idx"           ON "activity"("creator_id");

-- =====================================================================
-- 以下为预留扩展表（建表，对应模块后续开发）
-- =====================================================================

-- ===================== growth_record（生长曲线） =====================
CREATE TABLE "growth_record" (
  "id"                 SERIAL PRIMARY KEY,
  "baby_id"            INTEGER NOT NULL,
  "measure_time"       TIMESTAMP(3) NOT NULL,
  "weight"             DECIMAL(6,2),
  "height"             DECIMAL(5,1),
  "head_circumference" DECIMAL(5,1),
  "remark"             TEXT,
  "creator_id"         INTEGER NOT NULL,
  "created_time"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "growth_record_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "growth_record_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "growth_record_baby_id_measure_time_idx" ON "growth_record"("baby_id", "measure_time");

-- ===================== medical_record（医疗记录） =====================
CREATE TABLE "medical_record" (
  "id"           SERIAL PRIMARY KEY,
  "baby_id"      INTEGER NOT NULL,
  "record_type"  TEXT NOT NULL,                 -- 疫苗/体检/就诊/用药
  "record_time"  TIMESTAMP(3) NOT NULL,
  "title"        TEXT NOT NULL,
  "description"  TEXT,
  "remark"       TEXT,
  "creator_id"   INTEGER NOT NULL,
  "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "medical_record_baby_id_fkey"    FOREIGN KEY ("baby_id")    REFERENCES "baby"("id") ON DELETE CASCADE,
  CONSTRAINT "medical_record_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id")
);
CREATE INDEX "medical_record_baby_id_record_time_idx" ON "medical_record"("baby_id", "record_time");

-- ===================== ai_analysis（AI 分析结果） =====================
CREATE TABLE "ai_analysis" (
  "id"            SERIAL PRIMARY KEY,
  "baby_id"       INTEGER NOT NULL,
  "analysis_type" TEXT NOT NULL,                -- 喂养规律/睡眠趋势/异常提醒
  "period_start"  TIMESTAMP(3) NOT NULL,
  "period_end"    TIMESTAMP(3) NOT NULL,
  "input"         JSONB NOT NULL,
  "result"        JSONB NOT NULL,
  "model"         TEXT,
  "created_time"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_analysis_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE
);
CREATE INDEX "ai_analysis_baby_id_period_start_idx" ON "ai_analysis"("baby_id", "period_start");
