export const isBanned = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.isBanned) {
      return res.status(403).json({ message: "Access denied (Banned user)" });
    }

    next();
  } catch (error) {
    console.error("Error in isBanned middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
