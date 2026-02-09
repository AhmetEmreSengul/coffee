export const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied (Admin only)" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
