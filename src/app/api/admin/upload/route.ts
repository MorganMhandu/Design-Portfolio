import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const relativePath = `/assets/projects/${filename}`;
      const absolutePath = path.join(process.cwd(), "public", relativePath);

      fs.writeFileSync(absolutePath, buffer);
      uploadedUrls.push(relativePath);
    }

    return NextResponse.json({ urls: uploadedUrls, message: "UPLOAD SUCCESSFUL" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
