import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; 

export const getClasses = async (req: Request, res: Response) => {
  const classes = await prisma.class.findMany({ include: { sessions: true } });
  res.json(classes);
};

export const createClass = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const newClass = await prisma.class.create({ data: { name, description } });
  res.json(newClass);
};
