-- CreateTable
CREATE TABLE "SimulatedCard" (
    "id" SERIAL NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardholderName" TEXT NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "cvv" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 10000.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimulatedCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SimulatedPayment" (
    "id" SERIAL NOT NULL,
    "cardId" INTEGER NOT NULL,
    "subscriptionId" INTEGER,
    "gearOrderId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'gbp',
    "status" TEXT NOT NULL,
    "paymentType" TEXT NOT NULL,
    "description" TEXT,
    "failureReason" TEXT,
    "simulatedDelay" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SimulatedPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SimulatedCard_cardNumber_key" ON "SimulatedCard"("cardNumber");

-- AddForeignKey
ALTER TABLE "SimulatedPayment" ADD CONSTRAINT "SimulatedPayment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "SimulatedCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatedPayment" ADD CONSTRAINT "SimulatedPayment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SimulatedPayment" ADD CONSTRAINT "SimulatedPayment_gearOrderId_fkey" FOREIGN KEY ("gearOrderId") REFERENCES "GearOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
