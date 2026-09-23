import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
  const filePath = path.join(/*turbopackIgnore: true*/ uploadDir, filename);
  
  if (!fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }
  
  const file = fs.readFileSync(/*turbopackIgnore: true*/ filePath);
  
  // Simple content type detection
  const ext = path.extname(filename).toLowerCase();
  const mime = ext === '.png' ? 'image/png' : 
               ext === '.gif' ? 'image/gif' : 
               ext === '.webp' ? 'image/webp' : 
               'image/jpeg';
               
  return new NextResponse(file, { 
    headers: { 
      "Content-Type": mime,
      "Cache-Control": "public, max-age=31536000"
    } 
  });
}
