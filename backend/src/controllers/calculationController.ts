import { Request, Response, NextFunction } from "express";
import { Calculation } from "../models/Calculation";

// POST /api/calculations
export const createCalculation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expression, result, date, time, isSpecial } = req.body;

    // Basic validation
    if (!expression || result === undefined || !date || !time) {
      res.status(400).json({ success: false, message: "expression, result, date and time are required" });
      return;
    }

    const calc = await Calculation.create({ expression, result, date, time, isSpecial: isSpecial ?? false });
    res.status(201).json({ success: true, data: calc });
  } catch (err) {
    next(err);
  }
};

// GET /api/calculations?date=YYYY-MM-DD
export const getCalculationsByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      res.status(400).json({ success: false, message: "date query param is required (YYYY-MM-DD)" });
      return;
    }

    // Sort by time descending (latest first)
    const calculations = await Calculation.find({ date }).sort({ time: -1 });
    res.json({ success: true, data: calculations });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/calculations/:id
export const deleteCalculation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await Calculation.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: "Calculation not found" });
      return;
    }

    res.json({ success: true, message: "Calculation deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/calculations/summary?date=YYYY-MM-DD
export const getDailySummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.query;

    if (!date || typeof date !== "string") {
      res.status(400).json({ success: false, message: "date query param is required (YYYY-MM-DD)" });
      return;
    }

    const calculations = await Calculation.find({ date });
    const total = calculations.reduce((sum, c) => sum + c.result, 0);

    res.json({
      success: true,
      data: {
        date,
        total: Math.round(total * 100) / 100,
        count: calculations.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/calculations/history
// Returns all calculations sorted by date desc, then time desc
export const getHistory = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const calculations = await Calculation.find().sort({ date: -1, time: -1 });
    res.json({ success: true, data: calculations });
  } catch (err) {
    next(err);
  }
};

// GET /api/calculations/special
// Returns only special-customer calculations sorted by date desc, then time desc
export const getSpecialCalculations = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const calculations = await Calculation.find({ isSpecial: true }).sort({ date: -1, time: -1 });
    res.json({ success: true, data: calculations });
  } catch (err) {
    next(err);
  }
};
