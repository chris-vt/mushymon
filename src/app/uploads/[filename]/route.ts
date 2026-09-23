import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { filename: string } }) {
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "public/uploads");
  const filePath = path.join(uploadDir, params.filename);
  
  if (!fs.existsSync(filePath)) {
    return new NextResponse("Not found", { status: 404 });
  }
  
  const file = fs.readFileSync(filePath);
  
  // Simple content type detection
  const ext = path.extname(params.filename).toLowerCase();
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
