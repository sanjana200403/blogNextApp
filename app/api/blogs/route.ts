import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";
import connectMongoDb from "../../../libs/mongodb";
import Blog from "@/models/blog";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDb();

    const blogs = await Blog.find().sort({ createdAt: -1 }); // latest first
    return NextResponse.json(blogs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectMongoDb();

    const body = await req.json();
    const newBlog = new Blog(body);

    await newBlog.save();

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
