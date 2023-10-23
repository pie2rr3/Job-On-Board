-- DropForeignKey
ALTER TABLE "AdvertisementApplication" DROP CONSTRAINT "AdvertisementApplication_advertisementId_fkey";

-- AddForeignKey
ALTER TABLE "AdvertisementApplication" ADD CONSTRAINT "AdvertisementApplication_advertisementId_fkey" FOREIGN KEY ("advertisementId") REFERENCES "Advertisement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
