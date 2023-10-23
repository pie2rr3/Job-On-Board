import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/apply", async (req: Request, res: Response) => {
  try {
    const { advertisementId, message, userId } = req.body;

    const application = await prisma.advertisementApplication.create({
      data: {
        advertisementId: advertisementId,
        message: message,
        status: "PENDING",
        applicantId: userId,
      },
    });

    res.json({ success: true, application });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while submitting the application.",
    });
  }
});

router.get("/adsApply/:id", async (req, res) => {
  const adsApplyId = parseInt(req.params.id, 10);
  try {
    const adsApply = await prisma.advertisementApplication.findUnique({
      where: { id: adsApplyId },
    });

    if (adsApply) {
      res.json(adsApply);
    } else {
      res.status(404).json({ error: "Ad not found" });
    }
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.put("/adsApply/:id", async (req, res) => {
  const adsApplyId = parseInt(req.params.id, 10);
  let { id, message, status, createdAt, advertisementId, applicantId } =
    req.body;
  id = parseInt(id as string);
  advertisementId = parseInt(advertisementId as string);
  applicantId = parseInt(applicantId as string);

  const adsApply = await prisma.advertisementApplication.update({
    where: { id: adsApplyId },
    data: {
      id,
      message,
      status,
      createdAt,
      advertisementId,
      applicantId,
    },
  });

  if (adsApply) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404).json({ error: "Ad not found" });
  }
});

router.post("/adsApply", async (req: Request, res: Response) => {
  try {
    let { id, message, status, advertisementId, applicantId } = req.body;
    id = parseInt(id as string);
    advertisementId = parseInt(advertisementId as string);
    applicantId = parseInt(applicantId as string);

    const application = await prisma.advertisementApplication.create({
      data: {
        id,
        message,
        status,
        advertisementId,
        applicantId,
      },
    });

    res.json({ success: true, application });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while submitting the application.",
    });
  }
});

router.put("/updateApply/:id", async (req, res) => {
  const adsApplyId = parseInt(req.params.id, 10);
  let { status } = req.body;

  const adsApply = await prisma.advertisementApplication.update({
    where: { id: adsApplyId },
    data: {
      status,
    },
  });

  if (adsApply) {
    res.json({ success: true });
  } else {
    res.json({ error: "Ad not found" });
  }
});

export default router;
