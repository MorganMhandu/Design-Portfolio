import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-assets";

export async function POST(request: Request) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Supabase credentials missing" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const body = await request.json();
    const { filename } = body;

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // createSignedUploadUrl generates a pre-signed URL for direct upload
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(filename);

    if (error) {
      throw new Error(error.message);
    }

    // Also get the public URL that it will be available at once uploaded
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      publicUrl: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate presigned URL" }, { status: 500 });
  }
}
