import { NextResponse } from "next/server";
import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";
import { storeDocument } from "@/lib/rag";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No PDF file was uploaded.",
        },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          error: "Only PDF files are supported.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({
      data: buffer,
      CanvasFactory,
    });

    const result = await parser.getText();

    await parser.destroy();

    return NextResponse.json({
      success: true,
      fileName: file.name,
      text: result.text,
    });
  } catch (error) {
    console.error("PDF PROCESSING ERROR:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}