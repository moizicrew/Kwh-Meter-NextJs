-- CreateTable
CREATE TABLE "MqttData" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MqttData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MqttData_topic_timestamp_idx" ON "MqttData"("topic", "timestamp");
