import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/libs/mongodb";
import User from "@/models/User";


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const { name, userEmail, password } = await req.json();

    const userExists = await User.findOne({ userEmail });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userEmail,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Registered successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
