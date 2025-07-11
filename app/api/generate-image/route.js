import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("jsonfy");
    console.log(JSON.stringify(body));
    const res = await fetch("http://10.30.174.25:8000/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate image: ${res.status}`);
    }

    const data = await res.json();
    const base64 = data.image; // or adjust based on your API response structure

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
      },
    });
  } catch (err) {
    console.error("Image generation failed:", err);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
