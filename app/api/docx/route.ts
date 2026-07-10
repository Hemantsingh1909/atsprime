import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { parseResumeText } from "@/app/utils/templates";

export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: { message: "resumeText is required." } },
        { status: 400 }
      );
    }

    // 1. Parse raw resume text into sections
    const data = parseResumeText(resumeText);

    // 2. Build the DOCX Document
    const headingBorder = {
      bottom: {
        color: "4B5563", // Slate grey line
        space: 2,
        style: BorderStyle.SINGLE,
        size: 6,
      }
    };

    const docChildren: Paragraph[] = [];

    // Header: Name (Bold, Center)
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.name,
            bold: true,
            size: 36, // 18pt
            font: "Arial"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 }
      })
    );

    // Header: Contact Details (Center)
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: data.contact,
            size: 19, // 9.5pt
            font: "Arial",
            color: "4B5563"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 }
      })
    );

    // Section Helper: Add Heading
    const addSectionHeading = (title: string) => {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 23, // 11.5pt
              font: "Arial"
            })
          ],
          heading: HeadingLevel.HEADING_2,
          border: headingBorder,
          spacing: { before: 180, after: 120 }
        })
      );
    };

    // Section: Summary
    if (data.summary) {
      addSectionHeading("Summary");
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.summary,
              size: 21, // 10.5pt
              font: "Arial"
            })
          ],
          spacing: { after: 120 }
        })
      );
    }

    // List rendering helper
    const renderListItems = (items: string[]) => {
      for (const item of items) {
        if (!item) continue;
        const line = item.trim();
        const isBullet = line.startsWith("- ") || line.startsWith("* ") || line.startsWith("• ") || line.startsWith("– ");

        if (isBullet) {
          const cleanLine = line.replace(/^[-*•–]\s*/, "");
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: cleanLine,
                  size: 21,
                  font: "Arial"
                })
              ],
              bullet: {
                level: 0
              },
              spacing: { after: 40 }
            })
          );
        } else {
          const isHeader = line.includes("|") || line.includes(" - ") || line.includes("–") || line.toUpperCase() === line;
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  bold: isHeader,
                  size: 21,
                  font: "Arial"
                })
              ],
              spacing: { before: isHeader ? 100 : 40, after: isHeader ? 40 : 80 }
            })
          );
        }
      }
    };

    // Section: Work Experience
    if (data.experience && data.experience.length > 0) {
      addSectionHeading("Work Experience");
      renderListItems(data.experience);
    }

    // Section: Projects
    if (data.projects && data.projects.length > 0) {
      addSectionHeading("Projects");
      renderListItems(data.projects);
    }

    // Section: Education
    if (data.education && data.education.length > 0) {
      addSectionHeading("Education");
      renderListItems(data.education);
    }

    // Section: Skills
    if (data.skills && data.skills.length > 0) {
      addSectionHeading("Skills");
      // Format skills as comma separated or list
      const skillsLine = data.skills.join(", ");
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: skillsLine,
              size: 21,
              font: "Arial"
            })
          ],
          spacing: { after: 120 }
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                bottom: 1440,
                left: 1440,
                right: 1440
              }
            }
          },
          children: docChildren
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    // 3. Return attachment headers
    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    headers.set("Content-Disposition", 'attachment; filename="ATSPrime_Optimized_Resume.docx"');

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers
    });
  } catch (err) {
    const error = err as Error;
    console.error("API route DOCX generation error:", error);
    return NextResponse.json(
      { error: { message: error.message || "An unexpected error occurred during DOCX generation." } },
      { status: 500 }
    );
  }
}
