import jwt from 'jsonwebtoken';

export const isAdmin = (handler) => async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user is an admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    // Attach user info to the request object (optional)
    req.user = decoded;

    // Proceed to the handler
    return handler(req, res);
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
