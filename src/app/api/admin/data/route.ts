import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-assets";

// Create a helper to get the supabase client only when needed
const getSupabase = () => {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
};

export async function GET() {
  const DB_PATH = path.join(process.cwd(), "src/data/db.json");
  const getLocalData = () => {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    } catch {
      return { projects: [], pillars: [], reports: [], systems: [], settings: {} };
    }
  };

  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(getLocalData(), { headers: { "Cache-Control": "no-store, max-age=0" } });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(getLocalData(), { headers: { "Cache-Control": "no-store, max-age=0" } });
    }

    const { data: fileData, error } = await supabase.storage
      .from(bucketName)
      .download("db.json");

    if (error || !fileData) {
      console.warn("Supabase db download warning, serving local fallback:", error?.message);
      return NextResponse.json(getLocalData(), { headers: { "Cache-Control": "no-store, max-age=0" } });
    }

    const text = await fileData.text();
    const json = JSON.parse(text);

    return NextResponse.json(json, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error: any) {
    console.warn("GET DB fetch error, serving local fallback:", error.message);
    return NextResponse.json(getLocalData(), { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    const DB_PATH = path.join(process.cwd(), "src/data/db.json");

    // 1. Always attempt to write to local DB
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), "utf8");
    } catch (fsErr) {
      console.warn("Could not write to local db.json (read-only filesystem):", fsErr);
    }

    // 2. If Supabase credentials exist, try cloud backup gracefully
    if (supabaseUrl && supabaseKey) {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const jsonString = JSON.stringify(newData, null, 2);
          const { error } = await supabase.storage
            .from(bucketName)
            .upload("db.json", jsonString, {
              contentType: "application/json",
              upsert: true,
              cacheControl: "0",
            });
          if (error) {
            console.warn("Supabase storage upload error:", error.message);
          }
        } catch (sbErr: any) {
          console.warn("Supabase cloud backup skipped:", sbErr.message);
        }
      }
    }

    return NextResponse.json({ success: true, message: "SYNC SUCCESSFUL" });
  } catch (error: any) {
    console.error("POST DB error:", error);
    return NextResponse.json({ error: error.message || "Failed to update database" }, { status: 500 });
  }
}
