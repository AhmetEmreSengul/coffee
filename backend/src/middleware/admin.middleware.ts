import type { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied (Admin only)" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", (error as Error).message);
    res.status(500).json({ message: "Internal server error" });
  }
};
