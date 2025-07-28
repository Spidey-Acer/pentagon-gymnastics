import { Request, Response } from "express";
import prisma from "../../prisma/client"; // Adjust path if needed
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });
    res.json({ message: "User created", userId: user.id });
  } catch (error) {
    res.status(400).json({ error: "User exists" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string);
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
