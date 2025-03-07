import express from "express";
import { insertLayout } from "../controllers/layoutController";

const router = express.Router();

router.post("/", insertLayout);

export default router;
