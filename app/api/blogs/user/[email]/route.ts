import { NextRequest, NextResponse } from "next/server";
import connectMongoDb from "@/libs/mongodb";
import Blog from "@/models/blog";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ email: string }> } // <-- make params a Promise
) {
  try {
    await connectMongoDb();

    // Await params to match the expected type
    const { email } = await context.params;

    if (!email) {
      return NextResponse.json(
        { message: "Author email is required" },
        { status: 400 }
      );
    }

    const blogs = await Blog.find({ author: email });

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
