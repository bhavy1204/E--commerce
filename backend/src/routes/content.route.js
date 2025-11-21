import express from "express";
import { getSiteContent, updateSiteContent } from "../controllers/content.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getSiteContent);
router.put("/", verifyJWT, isAdmin, updateSiteContent);

export default router;


