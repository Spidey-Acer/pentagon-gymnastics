"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classController_1 = require("../controllers/classController");
const router = (0, express_1.Router)();
router.get("/", classController_1.getClasses);
router.post("/", classController_1.createClass); // Admin only, add middleware
exports.default = router;
