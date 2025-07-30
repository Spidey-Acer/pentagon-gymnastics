import { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // Adjust path if needed
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, forename, surname, address, dateOfBirth, phoneNumber } = req.body;
    
    // Validate required fields
    if (!email || !password || !forename || !surname || !address || !dateOfBirth || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate age (must be at least 16)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16) {
      return res.status(400).json({ error: "You must be at least 16 years old to register" });
    }

    const hashed = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashed, 
        forename,
        surname,
        address,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber
      },
    });
    
    res.json({ 
      message: "User created successfully", 
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        forename: user.forename,
        surname: user.surname
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role || "user" }, 
      process.env.JWT_SECRET
    );
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role || "user",
        forename: user.forename,
        surname: user.surname,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { forename, surname, address, dateOfBirth, phoneNumber, email } = req.body;
    
    // Validate that the user is updating their own profile or is an admin
    const requestingUserId = (req as any).userId;
    if (parseInt(id) !== requestingUserId && (req as any).userRole !== 'admin') {
      return res.status(403).json({ error: "You can only update your own profile" });
    }

    // Validate required fields
    if (!forename || !surname || !address || !dateOfBirth || !phoneNumber || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        forename,
        surname,
        address,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber,
        email
      }
    });

    res.json({ 
      message: "Profile updated successfully", 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        forename: user.forename,
        surname: user.surname,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        phoneNumber: user.phoneNumber
      }
    });
  } catch (error: any) {
    console.error("Profile update error:", error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: "Email already exists" });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Profile update failed" });
    }
  }
};
