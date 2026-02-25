import express from "express";
import { refreshTokenHandler } from "./token.controller";

const router = express.Router();

router.post("/", refreshTokenHandler);

export default router;