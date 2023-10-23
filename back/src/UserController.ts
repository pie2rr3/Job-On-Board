import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/creatuser", async (req, res) => {
  const { username, email, phone, password } = req.body;
  const departement = parseInt(req.body.departement as string);
  const existingUser = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (existingUser) {
    return res.status(400).json({ error: "This user already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: {
        name: username,
        email,
        departement,
        phone,
        password: hashedPassword,
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.get("/checkuser", async (req, res) => {
  const email: string = req.query.email as string;
  const password: string = req.query.password as string;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        company: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return res.json(user);
    } else {
      return res.status(401).json({ error: "Wrong email or password" });
    }
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      error: "Error",
    });
  }
});

router.delete("/deleteuser", async (req, res) => {
  const userId = parseInt(req.query.id as string);

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.json({ message: "User successfully deleted" });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.put("/updateuser", async (req: Request, res: Response) => {
  const userId = parseInt(req.query.id as string);
  let { name, email, phone, departement } = req.body;
  departement = parseInt(departement as string);
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { name, email, phone, departement },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({
      error: "Error",
    });
  }
});

router.get("/userapplications/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const userApplications = await prisma.advertisementApplication.findMany({
      where: {
        applicantId: userId,
      },
      include: {
        Advertisement: true,
      },
    });

    res.json(userApplications);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.get("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "Ad not found" });
    }
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

router.put("/user/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  let { id, name, email, phone, departement, role, companyId, password } =
    req.body;
  departement = parseInt(departement as string);
  companyId = parseInt(companyId as string);
  id = parseInt(id as string);

  const userOldData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  let pass = {};

  if (userOldData) {
    const passwordMatch = await bcrypt.compare(password, userOldData.password);

    if (passwordMatch) {
      pass = userOldData;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      pass = hashedPassword;
    }
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      id,
      name,
      email,
      phone,
      departement,
      role,
      companyId,
      password: pass,
    },
  });

  if (user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404).json({ error: "Ad not found" });
  }
});

router.post("/user", async (req, res) => {
  const { username, email, phone, password, role } = req.body;
  const departement = parseInt(req.body.departement as string);
  const id = parseInt(req.body.id as string);
  const companyId = parseInt(req.body.companyId as string);
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          id: id,
        },
        {
          email: email,
        },
      ],
    },
  });
  if (existingUser) {
    return res.status(400).json({ error: "This user already exist" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = await prisma.user.create({
      data: {
        id,
        name: username,
        email,
        departement,
        phone,
        password: hashedPassword,
        companyId,
        role,
      },
    });

    res.json(newUser);
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
