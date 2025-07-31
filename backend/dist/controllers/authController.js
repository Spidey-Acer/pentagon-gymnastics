"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.updateProfile = exports.login = exports.register = void 0;
const prisma_1 = require("../lib/prisma"); // Adjust path if needed
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const hashed = yield bcryptjs_1.default.hash(password, 10);
        const user = yield prisma_1.prisma.user.create({
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
    }
    catch (error) {
        console.error("Registration error:", error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: "Email already exists" });
        }
        else {
            res.status(500).json({ error: "Registration failed" });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return res.status(500).json({ error: "Server configuration error" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role || "user" }, process.env.JWT_SECRET);
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
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.login = login;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { forename, surname, address, dateOfBirth, phoneNumber, email } = req.body;
        // Validate that the user is updating their own profile or is an admin
        const requestingUserId = req.userId;
        if (parseInt(id) !== requestingUserId && req.userRole !== 'admin') {
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
        const user = yield prisma_1.prisma.user.update({
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
    }
    catch (error) {
        console.error("Profile update error:", error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: "Email already exists" });
        }
        else if (error.code === 'P2025') {
            res.status(404).json({ error: "User not found" });
        }
        else {
            res.status(500).json({ error: "Profile update failed" });
        }
    }
});
exports.updateProfile = updateProfile;
// Validate token endpoint
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If the middleware passed, the token is valid
        // Return user info from the token
        const user = req.user;
        res.json({ valid: true, user });
    }
    catch (error) {
        console.error("Token validation error:", error);
        res.status(401).json({ error: "Invalid token" });
    }
});
exports.validateToken = validateToken;
