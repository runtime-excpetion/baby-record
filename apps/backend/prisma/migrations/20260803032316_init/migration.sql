-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('DAD', 'MOM', 'GRANDPA_P', 'GRANDMA_P', 'GRANDMA_M', 'GRANDPA_M');

-- CreateEnum
CREATE TYPE "FeedingType" AS ENUM ('BREAST_MILK', 'FORMULA', 'MIXED');

-- CreateEnum
CREATE TYPE "DiaperType" AS ENUM ('PEE', 'POOP', 'BOTH');

-- CreateEnum
CREATE TYPE "SleepType" AS ENUM ('DAYTIME', 'NIGHT');

-- CreateTable
CREATE TABLE "baby" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "gender" "Gender" NOT NULL,
    "birthday" DATE NOT NULL,
    "birth_weight" DECIMAL(6,2),
    "birth_height" DECIMAL(5,1),
    "head_circumference" DECIMAL(5,1),
    "birth_hospital" TEXT,
    "remark" TEXT,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "baby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feeding" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "feeding_time" TIMESTAMP(3) NOT NULL,
    "feeding_type" "FeedingType" NOT NULL,
    "amount_ml" INTEGER,
    "duration_minutes" INTEGER,
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diaper" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "change_time" TIMESTAMP(3) NOT NULL,
    "type" "DiaperType" NOT NULL,
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sleep" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "sleep_type" "SleepType" NOT NULL,
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sleep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplement" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" TEXT,
    "unit" TEXT,
    "take_time" TIMESTAMP(3) NOT NULL,
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "growth_record" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "measure_time" TIMESTAMP(3) NOT NULL,
    "weight" DECIMAL(6,2),
    "height" DECIMAL(5,1),
    "head_circumference" DECIMAL(5,1),
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "growth_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_record" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "record_type" TEXT NOT NULL,
    "record_time" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "remark" TEXT,
    "creator_id" INTEGER NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analysis" (
    "id" SERIAL NOT NULL,
    "baby_id" INTEGER NOT NULL,
    "analysis_type" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "input" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "model" TEXT,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feeding_baby_id_feeding_time_idx" ON "feeding"("baby_id", "feeding_time");

-- CreateIndex
CREATE INDEX "feeding_creator_id_idx" ON "feeding"("creator_id");

-- CreateIndex
CREATE INDEX "diaper_baby_id_change_time_idx" ON "diaper"("baby_id", "change_time");

-- CreateIndex
CREATE INDEX "diaper_creator_id_idx" ON "diaper"("creator_id");

-- CreateIndex
CREATE INDEX "sleep_baby_id_start_time_idx" ON "sleep"("baby_id", "start_time");

-- CreateIndex
CREATE INDEX "sleep_creator_id_idx" ON "sleep"("creator_id");

-- CreateIndex
CREATE INDEX "supplement_baby_id_take_time_idx" ON "supplement"("baby_id", "take_time");

-- CreateIndex
CREATE INDEX "supplement_creator_id_idx" ON "supplement"("creator_id");

-- CreateIndex
CREATE INDEX "activity_baby_id_event_time_idx" ON "activity"("baby_id", "event_time");

-- CreateIndex
CREATE INDEX "activity_creator_id_idx" ON "activity"("creator_id");

-- CreateIndex
CREATE INDEX "growth_record_baby_id_measure_time_idx" ON "growth_record"("baby_id", "measure_time");

-- CreateIndex
CREATE INDEX "medical_record_baby_id_record_time_idx" ON "medical_record"("baby_id", "record_time");

-- CreateIndex
CREATE INDEX "ai_analysis_baby_id_period_start_idx" ON "ai_analysis"("baby_id", "period_start");

-- AddForeignKey
ALTER TABLE "feeding" ADD CONSTRAINT "feeding_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feeding" ADD CONSTRAINT "feeding_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaper" ADD CONSTRAINT "diaper_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diaper" ADD CONSTRAINT "diaper_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep" ADD CONSTRAINT "sleep_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sleep" ADD CONSTRAINT "sleep_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplement" ADD CONSTRAINT "supplement_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplement" ADD CONSTRAINT "supplement_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity" ADD CONSTRAINT "activity_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_record" ADD CONSTRAINT "growth_record_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "growth_record" ADD CONSTRAINT "growth_record_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analysis" ADD CONSTRAINT "ai_analysis_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE;
