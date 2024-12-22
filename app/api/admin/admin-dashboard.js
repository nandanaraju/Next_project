import { isAdmin } from "../../lib/auth";

const handler = async (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard!",
    user: req.user, // Optional: Send user info
  });
};

// Protect the admin dashboard route using the isAdmin middleware
export default isAdmin(handler);
