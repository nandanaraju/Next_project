import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_jwt_secret_key"; // Replace with a secure secret key

export async function POST(req) {
  try {
    await dbConnect(); // Connect to the database

    const { email, password, role = "user" } = await req.json(); // Role defaults to "user"

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Email is already in use." }),
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role }, // Include role in the payload
      SECRET_KEY, // Secret key
      { expiresIn: "1h" } // Token expiry
    );

    return new Response(
      JSON.stringify({
        message: "Signup successful!",
        token,
        role: newUser.role, // Return the user's role
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500 }
    );
  }
}
