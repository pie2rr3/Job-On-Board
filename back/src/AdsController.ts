import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/createads", async (req, res) => {
  const { title, shortDescription, fullDescription, place, worktime } =
    req.body;
  const wage: number = parseInt(req.body.wage as string);
  const departement: number = parseInt(req.body.department as string);
  const authorId: number = parseInt(req.body.authorId as string);
  const companyId: number = parseInt(req.body.companyId as string);

  try {
    const newAds = await prisma.advertisement.create({
      data: {
        title,
        shortDescription,
        fullDescription,
        wage,
        departement,
        place,
        workTime: worktime,
        authorId,
        companyId,
      },
    });

    res.json(newAds);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.get("/ads/:id", async (req, res) => {
  const advertisementId = parseInt(req.params.id, 10);
  try {
    const advertisement = await prisma.advertisement.findUnique({
      where: { id: advertisementId },
    });

    if (advertisement) {
      res.json(advertisement);
    } else {
      res.status(404).json({ error: "Ad not found" });
    }
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.put("/ads/:id", async (req, res) => {
  const advertisementId = parseInt(req.params.id, 10);
  let {
    id,
    title,
    shortDescription,
    fullDescription,
    wage,
    departement,
    place,
    workTime,
    companyId,
    authorId,
    createdAt,
    updatedAt,
  } = req.body;
  wage = parseInt(wage as string);
  departement = parseInt(departement as string);
  try {
    const advertisement = await prisma.advertisement.update({
      where: { id: advertisementId },
      data: {
        id,
        title,
        shortDescription,
        fullDescription,
        wage,
        departement,
        place,
        workTime,
        companyId,
        authorId,
        createdAt,
        updatedAt,
      },
    });

    if (advertisement) {
      res.send(200);
    } else {
      res.sendStatus(404).json({ error: "Ad not found" });
    }
  } catch (error) {
    console.error("Error :", error);
    res.sendStatus(500).json({ error: "Error" });
  }
});

router.post("/ads", async (req, res) => {
  const {
    title,
    shortDescription,
    fullDescription,
    place,
    workTime,
  } = req.body;
  const wage: number = parseInt(req.body.wage as string);
  const departement: number = parseInt(req.body.departement as string);
  const authorId: number = parseInt(req.body.authorId as string);
  const companyId: number = parseInt(req.body.companyId as string);
  const id: number = parseInt(req.body.id as string);

  const existingAds = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (existingAds) {
    return res.status(400).json({ error: "This advertisement already exist" });
  }
  try {
    const newAds = await prisma.advertisement.create({
      data: {
        id,
        title,
        shortDescription,
        fullDescription,
        wage,
        departement,
        place,
        workTime,
        authorId,
        companyId,
      },
    });

    res.json(newAds);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});
export default router;
