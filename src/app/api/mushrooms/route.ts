import { NextResponse } from "next/server";
import { db } from "@/db";
import { mushrooms } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import crypto from "crypto";

export async function GET() {
  const allFinds = db.select().from(mushrooms).orderBy(desc(mushrooms.date)).all();
  return NextResponse.json(allFinds);
}

export async function POST(request: Request) {
  const data = await request.json();
  const newFind = {
    id: crypto.randomUUID(),
    date: new Date(),
    name: data.name || "Unknown Mushroom",
    area: data.area || "",
    plusCode: data.plusCode || "",
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    notes: data.notes || "",
    photoPath: data.photoPath || "",
    gallery: data.gallery || "[]",
    createdAt: new Date(),
  };
  db.insert(mushrooms).values(newFind).run();
  return NextResponse.json(newFind);
}

export async function PUT(request: Request) {
  const data = await request.json();
  if (!data.id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  
  const updateData = {
    name: data.name,
    area: data.area,
    plusCode: data.plusCode,
    latitude: data.latitude,
    longitude: data.longitude,
    notes: data.notes,
    photoPath: data.photoPath,
    gallery: data.gallery,
  };
  
  db.update(mushrooms).set(updateData).where(eq(mushrooms.id, data.id)).run();
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const data = await request.json();
  if (!data.id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  
  db.delete(mushrooms).where(eq(mushrooms.id, data.id)).run();
  return NextResponse.json({ success: true });
}
