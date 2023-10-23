import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/users", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      company: true,
    },
  });
  res.json(users);
});

router.get("/companies", async (req: Request, res: Response) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

router.get("/ads", async (req: Request, res: Response) => {
  const advertisements = await prisma.advertisement.findMany();
  res.json(advertisements);
});

router.get("/adsApply", async (req: Request, res: Response) => {
  const advertisementsApplication =
    await prisma.advertisementApplication.findMany();
  res.json(advertisementsApplication);
});

router.delete("/deletecompany", async (req, res) => {
  const companyId = parseInt(req.query.id as string);

  try {
    const deletedCompany = await prisma.company.delete({
      where: {
        id: companyId,
      },
    });

    res.json({ message: "Company successfully deleted" });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.delete("/deleteadvertisement", async (req, res) => {
  const advertisementId = parseInt(req.query.id as string);

  try {
    const deletedAdvertisement = await prisma.advertisement.delete({
      where: {
        id: advertisementId,
      },
    });

    res.json({ message: "Advertisement successfully deleted" });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.delete("/deleteadvertisementApply", async (req, res) => {
  const advertisementApplyId = parseInt(req.query.id as string);

  try {
    const deletedAdvertisement = await prisma.advertisementApplication.delete({
      where: {
        id: advertisementApplyId,
      },
    });

    res.json({ message: "Advertisement Application successfully deleted" });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});
export default router;
