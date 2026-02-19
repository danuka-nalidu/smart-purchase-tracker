import { Request, Response, NextFunction } from "express";

// Global error handler — must have 4 args so Express recognises it as an error handler
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
};
