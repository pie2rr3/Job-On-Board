import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

//Login
router.post("/companies/login", async (req, res) => {
  const name: string = req.body.name as string;
  const password: string = req.body.password as string;
  const userId: number = req.body.userId;

  try {
    const company = await prisma.company.findUnique({
      where: {
        name,
      },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const passwordMatch = await bcrypt.compare(password, company.password);

    if (passwordMatch) {
      try {
        const user = await prisma.user.update({
          data: {
            companyId: company.id,
          },
          where: {
            id: userId,
          },
        });
        const Data = {
          company: company,
          user: user,
        };
        return res.json(Data);
      } catch (error) {
        console.error("Error :", error);
        return res.status(500).json({
          error: "Error",
        });
      }
    } else {
      return res.status(401).json({ error: "Wrong name or password" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

//Create
router.post("/companies", async (req, res) => {
  const name: string = req.body.name as string;
  const departement: number = parseInt(req.body.departement as string);
  const password: string = req.body.password as string;

  const userId: number = parseInt(req.body.userId as string);

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user?.companyId) {
      return res.status(401).json({ error: "User already has a company" });
    }

    const existingCompany = await prisma.company.findUnique({
      where: {
        name: name,
      },
    });

    if (existingCompany) {
      return res.status(401).json({ error: "Company already exists" });
    }

    const company = await prisma.company.create({
      data: {
        name,
        departement,
        password: await bcrypt.hash(password, 10),
      },
    });

    await prisma.user.update({
      data: {
        companyId: company.id,
      },
      where: {
        id: userId,
      },
    });

    res.json(company);
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

//Update
router.put("/companies/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);
  const name: string = req.body.name as string;
  const departement: number = parseInt(req.body.departement as string);

  try {
    const company = await prisma.company.update({
      data: {
        name,
        departement,
      },
      where: {
        id,
      },
    });

    res.json(company);
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

//Delete
router.delete("/companies/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);

  try {
    await prisma.company.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

router.get("/companiesAds/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  try {
    const companyAds = await prisma.advertisement.findMany({
      where: {
        companyId: id,
      },
      include: {
        AdvertisementApplication: true,
      },
    });

    res.json(companyAds);
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

//Delete
router.delete("/companiesads/:id", async (req, res) => {
  const id: number = parseInt(req.params.id);

  try {
    await prisma.advertisement.delete({
      where: {
        id,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

router.get("/companiesEdit/:id", async (req, res) => {
  const companyId = parseInt(req.params.id, 10);
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ error: "Ad not found" });
    }
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.put("/companiesEdit/:id", async (req, res) => {
  const companyId = parseInt(req.params.id, 10);
  let { id, name, departement, password } = req.body;
  departement = parseInt(departement as string);
  id = parseInt(id as string);

  const companyOldData = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  let pass = {};

  if (companyOldData) {
    const passwordMatch = await bcrypt.compare(
      password,
      companyOldData.password
    );

    if (passwordMatch) {
      pass = companyOldData;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      pass = hashedPassword;
    }
  }

  const company = await prisma.company.update({
    where: { id: companyId },
    data: {
      id,
      name,
      departement,
      password: pass,
    },
  });

  if (company) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404).json({ error: "Ad not found" });
  }
});

router.post("/companiesEdit", async (req, res) => {
  const id: number = parseInt(req.body.id as string);
  const name: string = req.body.name as string;
  const departement: number = parseInt(req.body.departement as string);
  const password: string = req.body.password as string;

  try {
    const existingCompany = await prisma.company.findUnique({
      where: {
        name: name,
      },
    });

    if (existingCompany) {
      return res.status(401).json({ error: "Company already exists" });
    }

    const company = await prisma.company.create({
      data: {
        id,
        name,
        departement,
        password: await bcrypt.hash(password, 10),
      },
    });

    res.json(company);
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

router.get("/companyapplications/:companyId", async (req, res) => {
  const companyId = parseInt(req.params.companyId);

  try {
    const companyApplications = await prisma.advertisementApplication.findMany({
      where: {
        Advertisement: {
          companyId: companyId,
        },
      },
      include: {
        Advertisement: true,
      },
    });

    res.json(companyApplications);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
