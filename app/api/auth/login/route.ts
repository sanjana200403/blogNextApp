import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/libs/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { userEmail, password } = await req.json();

    const user = await User.findOne({ userEmail });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return NextResponse.json({ message: "Invalid password" }, { status: 400 });

    const token = jwt.sign(
      { id: user._id, userEmail: user.userEmail },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          name: user.name,
          userEmail: user.userEmail,
          _id: user._id
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
