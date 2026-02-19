import { Router } from "express";
import {
  createCalculation,
  getCalculationsByDate,
  deleteCalculation,
  getDailySummary,
  getHistory,
  getSpecialCalculations,
} from "../controllers/calculationController";

const router = Router();

router.get("/summary", getDailySummary);
router.get("/history", getHistory);
router.get("/special", getSpecialCalculations);

router.get("/", getCalculationsByDate);
router.post("/", createCalculation);
router.delete("/:id", deleteCalculation);

export default router;
