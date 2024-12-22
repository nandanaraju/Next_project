import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_jwt_secret_key"; // Replace with a secure secret key

export async function POST(req) {
  try {
    const url = req.url;

    // Handle logout route
    if (url.endsWith("/logout")) {
      // This is a simple logout endpoint. The client should handle JWT removal (e.g., from localStorage or cookies).
      return new Response(
        JSON.stringify({ message: "Logout successful!" }),
        { status: 200 }
      );
    }

    // Handle login route
    await dbConnect(); // Connect to the database

    const { email, password } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ message: "No user found with this email." }),
        { status: 400 }
      );
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Incorrect password." }),
        { status: 400 }
      );
    }

    // Generate a JWT token with user type (admin or user)
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Include role in the payload
      SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiry
    );

    return new Response(
      JSON.stringify({
        message: "Login successful!",
        token,
        role: user.role, // Return the user's role
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
    });
  }
}
