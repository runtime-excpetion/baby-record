-- Persist custom baby avatars and temperature measurements.
ALTER TABLE "baby" ADD COLUMN IF NOT EXISTS "avatar" TEXT;

CREATE TABLE IF NOT EXISTS "temperature" (
  "id" SERIAL NOT NULL,
  "baby_id" INTEGER NOT NULL,
  "temperature" DECIMAL(4,1) NOT NULL,
  "measure_time" TIMESTAMP(3) NOT NULL,
  "remark" TEXT,
  "creator_id" INTEGER NOT NULL,
  "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "temperature_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "temperature_baby_id_fkey" FOREIGN KEY ("baby_id") REFERENCES "baby"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "temperature_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "temperature_value_range" CHECK ("temperature" >= 36.0 AND "temperature" <= 41.0)
);

CREATE INDEX IF NOT EXISTS "temperature_baby_id_measure_time_idx" ON "temperature"("baby_id", "measure_time");

ALTER TABLE "feeding" ADD COLUMN IF NOT EXISTS "updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "diaper" ADD COLUMN IF NOT EXISTS "updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "sleep" ADD COLUMN IF NOT EXISTS "updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "supplement" ADD COLUMN IF NOT EXISTS "updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "activity" ADD COLUMN IF NOT EXISTS "updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "temperature" ADD COLUMN IF NOT EXISTS "updated_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
