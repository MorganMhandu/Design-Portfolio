import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-assets";

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseKey) {
      // Fallback to local DB if Supabase isn't configured yet
      const DB_PATH = path.join(process.cwd(), "src/data/db.json");
      const data = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }

    const { data: fileData, error } = await supabase.storage
      .from(bucketName)
      .download("db.json");

    if (error) {
      if (error.message.includes("Object not found") || error.message.includes("not found")) {
        // Seed the bucket with local file
        const DB_PATH = path.join(process.cwd(), "src/data/db.json");
        const localData = fs.readFileSync(DB_PATH, "utf8");
        
        await supabase.storage.from(bucketName).upload("db.json", localData, {
          contentType: "application/json",
          upsert: true,
        });
        
        return NextResponse.json(JSON.parse(localData), { headers: { "Cache-Control": "no-store, max-age=0" } });
      }
      throw new Error(`Failed to download db.json from Supabase: ${error.message}`);
    }

    const text = await fileData.text();
    const json = JSON.parse(text);

    return NextResponse.json(json, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error: any) {
    console.error("GET DB error:", error);
    return NextResponse.json({ error: error.message || "Failed to read database" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();

    if (!supabaseUrl || !supabaseKey) {
      // Fallback to local DB
      const DB_PATH = path.join(process.cwd(), "src/data/db.json");
      fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), "utf8");
      return NextResponse.json({ success: true, message: "SYNC SUCCESSFUL (LOCAL)" });
    }

    const jsonString = JSON.stringify(newData, null, 2);
    const { error } = await supabase.storage
      .from(bucketName)
      .upload("db.json", jsonString, {
        contentType: "application/json",
        upsert: true,
        cacheControl: '0'
      });

    if (error) {
      throw new Error(`Failed to upload db.json to Supabase: ${error.message}`);
    }

    return NextResponse.json({ success: true, message: "SYNC SUCCESSFUL (CLOUD)" });
  } catch (error: any) {
    console.error("POST DB error:", error);
    return NextResponse.json({ error: error.message || "Failed to update database" }, { status: 500 });
  }
}
