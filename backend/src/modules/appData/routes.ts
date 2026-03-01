import { authMiddleware } from "../../middleware/authMiddleware";
import express from "express";
import { appDataController } from "./controllers";

const router = express.Router();

// Require auth so controller receives req.userId; frontend sends Bearer token
router.get("/", authMiddleware, appDataController);

export default router;