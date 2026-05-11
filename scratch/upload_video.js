const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio-assets";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function upload() {
  const filePath = "C:\\Users\\user\\Pictures\\DESIGN.mp4";
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `portfolio/media/hero-simulation-${Date.now()}.mp4`;

  console.log(`Uploading ${filePath} to ${bucketName}/${fileName}...`);

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileBuffer, {
      contentType: 'video/mp4',
      upsert: true
    });

  if (error) {
    console.error("Upload failed:", error.message);
    process.exit(1);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  console.log("UPLOAD_SUCCESSFUL");
  console.log("URL:", publicUrlData.publicUrl);
}

upload();
