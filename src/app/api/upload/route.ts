import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = crypto.randomUUID() + "-" + file.name.replace(/[^a-zA-Z0-9.]/g, "");
    const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
    
    if (!fs.existsSync(/*turbopackIgnore: true*/ uploadDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ uploadDir, filename), buffer);
    
    return NextResponse.json({ path: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
