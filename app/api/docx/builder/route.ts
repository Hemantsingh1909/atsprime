import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { ResumeData } from "@/app/types/resume";

export async function POST(request: Request) {
  try {
    const { resumeData } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: { message: "resumeData is required." } },
        { status: 400 }
      );
    }

    const headingBorder = {
      bottom: {
        color: "4B5563",
        space: 2,
        style: BorderStyle.SINGLE,
        size: 6,
      }
    };

    const docChildren: any[] = [];
    const info = resumeData.personalInfo || {};

    // Header: Name (Bold, Center)
    if (info.name) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: info.name,
              bold: true,
              size: 36, // 18pt
              font: "Arial"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 }
        })
      );
    }

    // Header: Title (Italic, Center)
    if (info.title) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: info.title,
              italics: true,
              size: 22, // 11pt
              font: "Arial",
              color: "4B5563"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 }
        })
      );
    }

    // Header: Contact details row (Email | Phone | Location etc)
    const contactParts: string[] = [];
    if (info.email) contactParts.push(info.email);
    if (info.phone) contactParts.push(info.phone);
    if (info.location) contactParts.push(info.location);
    if (info.website) contactParts.push(info.website);
    if (info.linkedin) contactParts.push(info.linkedin);

    if (contactParts.length > 0) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join("  |  "),
              size: 19, // 9.5pt
              font: "Arial",
              color: "4B5563"
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }
        })
      );
    }

    // Section Helper
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
    if (resumeData.summary) {
      addSectionHeading("Summary");
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 21,
              font: "Arial"
            })
          ],
          spacing: { after: 120 }
        })
      );
    }

    // Section: Work Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      addSectionHeading("Work Experience");
      for (const exp of resumeData.experience) {
        docChildren.push(
          new Paragraph({
            tabStops: [{ type: "right", position: 9360 }],
            children: [
              new TextRun({
                text: `${exp.position} - ${exp.company}`,
                bold: true,
                size: 21,
                font: "Arial"
              }),
              new TextRun({ text: "\t" }),
              new TextRun({
                text: `${exp.startDate} - ${exp.endDate}`,
                bold: true,
                size: 21,
                font: "Arial"
              })
            ],
            spacing: { before: 100, after: 20 }
          })
        );

        if (exp.location) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.location,
                  italics: true,
                  size: 19,
                  font: "Arial",
                  color: "6B7280"
                })
              ],
              spacing: { after: 60 }
            })
          );
        }

        if (exp.description) {
          const lines = exp.description.split("\n").map((l: string) => l.trim()).filter(Boolean);
          for (const line of lines) {
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
                bullet: { level: 0 },
                spacing: { after: 40 }
              })
            );
          }
        }
      }
    }

    // Section: Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      addSectionHeading("Projects");
      for (const proj of resumeData.projects) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: proj.name,
                bold: true,
                size: 21,
                font: "Arial"
              }),
              proj.role ? new TextRun({
                text: ` (${proj.role})`,
                italics: true,
                size: 21,
                font: "Arial"
              }) : new TextRun({ text: "" })
            ],
            spacing: { before: 100, after: 40 }
          })
        );

        if (proj.description) {
          const lines = proj.description.split("\n").map((l: string) => l.trim()).filter(Boolean);
          for (const line of lines) {
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
                bullet: { level: 0 },
                spacing: { after: 40 }
              })
            );
          }
        }
      }
    }

    // Section: Education
    if (resumeData.education && resumeData.education.length > 0) {
      addSectionHeading("Education");
      for (const edu of resumeData.education) {
        docChildren.push(
          new Paragraph({
            tabStops: [{ type: "right", position: 9360 }],
            children: [
              new TextRun({
                text: `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""} - ${edu.school}`,
                bold: true,
                size: 21,
                font: "Arial"
              }),
              new TextRun({ text: "\t" }),
              new TextRun({
                text: `${edu.startDate} - ${edu.endDate}`,
                bold: true,
                size: 21,
                font: "Arial"
              })
            ],
            spacing: { before: 100, after: 40 }
          })
        );

        if (edu.description) {
          const lines = edu.description.split("\n").map((l: string) => l.trim()).filter(Boolean);
          for (const line of lines) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 21,
                    font: "Arial"
                  })
                ],
                spacing: { after: 40 }
              })
            );
          }
        }
      }
    }

    // Section: Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      addSectionHeading("Skills");
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.skills.join(", "),
              size: 21,
              font: "Arial"
            })
          ],
          spacing: { after: 120 }
        })
      );
    }

    // Section: Certificates
    if (resumeData.certificates && resumeData.certificates.length > 0) {
      addSectionHeading("Certificates");
      for (const cert of resumeData.certificates) {
        docChildren.push(
          new Paragraph({
            tabStops: [{ type: "right", position: 9360 }],
            children: [
              new TextRun({
                text: `${cert.name} - ${cert.issuer}`,
                bold: true,
                size: 21,
                font: "Arial"
              }),
              new TextRun({ text: "\t" }),
              new TextRun({
                text: cert.date,
                bold: true,
                size: 21,
                font: "Arial"
              })
            ],
            spacing: { before: 60, after: 40 }
          })
        );
      }
    }

    // Section: Languages
    if (resumeData.languages && resumeData.languages.length > 0) {
      addSectionHeading("Languages");
      const langItems = resumeData.languages.map((l: any) => `${l.language} (${l.proficiency})`);
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: langItems.join(", "),
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
                top: 1440,
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

    const headers = new Headers();
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    headers.set("Content-Disposition", `attachment; filename="ATSPrime_Resume_${resumeData.personalInfo?.name || "Builder"}.docx"`);

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers
    });
  } catch (err: any) {
    console.error("API route DOCX builder generation error:", err);
    return NextResponse.json(
      { error: { message: err.message || "An unexpected error occurred during DOCX generation." } },
      { status: 500 }
    );
  }
}
