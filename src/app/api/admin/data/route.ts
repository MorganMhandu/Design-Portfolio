import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DB_PATH = path.join(process.cwd(), "src/data/db.json");

function readDB() {
  const data = fs.readFileSync(DB_PATH, "utf8");
  return JSON.parse(data);
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = readDB();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    writeDB(newData);
    return NextResponse.json({ success: true, message: "SYNC SUCCESSFUL" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
  }
}
