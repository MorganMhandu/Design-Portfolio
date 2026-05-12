import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-assets";

let supabase: ReturnType<typeof createClient> | null = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "portfolio/media";
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!supabase || !supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase credentials missing from environment" }, { status: 500 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename to prevent collisions
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${folder}/${uniqueSuffix}-${file.name.replace(/\s+/g, "_")}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filename, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return NextResponse.json({ urls: uploadedUrls, message: "UPLOAD SUCCESSFUL" });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
