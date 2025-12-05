import { NextResponse } from "next/server";
import { resumeData } from "@/data/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PdfkitModule = typeof import("pdfkit");
type PdfkitImport = PdfkitModule & { default?: PdfkitModule };
let pdfkitPromise: Promise<PdfkitModule> | null = null;

const loadPdfkit = async () => {
  if (!pdfkitPromise) {
    pdfkitPromise = import("pdfkit").then((mod) => {
      const resolved = mod as PdfkitImport;
      return resolved.default ?? resolved;
    });
  }
  return pdfkitPromise;
};

const generatePdfBuffer = async () => {
  const PDFDocument = await loadPdfkit();
  const doc = new PDFDocument({ margin: 54 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk as Buffer));

  const streamClosed = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  doc.fontSize(28).text(resumeData.name, { align: "center" });
  doc
    .fontSize(16)
    .fillColor("#555555")
    .text(resumeData.role, { align: "center" })
    .moveDown();

  doc.fillColor("#111111").fontSize(12).text(resumeData.bio, { align: "left" });

  doc
    .moveDown()
    .fontSize(16)
    .fillColor("#111111")
    .text("Experience", { underline: true });

  resumeData.experience.forEach((exp) => {
    doc
      .moveDown(0.75)
      .font("Helvetica-Bold")
      .fontSize(13)
      .text(exp.position);
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#444444")
      .text(`${exp.company} • ${exp.period}`);

    exp.highlights.forEach((highlight) => {
      doc.moveDown(0.2).font("Helvetica").fillColor("#111111").text(`• ${highlight}`);
    });
  });

  if (resumeData.skills.length) {
    doc
      .moveDown()
      .fontSize(16)
      .fillColor("#111111")
      .text("Skills", { underline: true });
    doc.fontSize(12).fillColor("#111111").list(resumeData.skills, { bulletRadius: 2 });
  }

  doc
    .moveDown()
    .fontSize(16)
    .fillColor("#111111")
    .text("Contact", { underline: true });

  doc
    .fontSize(12)
    .fillColor("#111111")
    .text(`Email: ${resumeData.social.email}`)
    .text(`GitHub: ${resumeData.social.github}`)
    .text(`LinkedIn: ${resumeData.social.linkedin}`)
    .text(`Twitter: ${resumeData.social.twitter}`);

  doc.end();

  return streamClosed;
};

export async function GET() {
  try {
    const pdfBuffer = await generatePdfBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Resume PDF generation failed", error);
    return NextResponse.json(
      { error: "Failed to generate resume" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}


