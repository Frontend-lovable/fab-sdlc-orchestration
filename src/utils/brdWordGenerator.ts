import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  ImageRun,
  TableOfContents,
  ShadingType,
  VerticalAlign,
  PageNumber,
  NumberFormat,
} from "docx";
import { saveAs } from "file-saver";

interface ParsedBRD {
  title: string;
  version: string;
  date: string;
  owner: string;
  executiveSummary: string;
  projectBackground: string;
  projectPurpose: string;
  objectives: string[];
  stakeholders: { role: string; name: string }[];
  requirements: {
    id: string;
    title: string;
    businessNeed: string;
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    acceptanceCriteria: string[];
  }[];
  assumptions: string[];
  dependencies: string[];
  constraints: string[];
  inScope: string[];
  outOfScope: string[];
  currentState: { section: string; items: string[] }[];
  targetState: { section: string; items: string[] }[];
  definitions: { term: string; description: string }[];
  references: { title: string; location: string }[];
  signOff: { name: string; role: string }[];
}

// FAB Brand Colors
const FAB_BLUE = "1E3A8A";
const FAB_RED = "DC2626";
const DARK_GRAY = "3B3B3B";
const BLACK = "000000";
const TOC_GREEN = "00A651";

// Table border style
const tableBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
};

const createHeaderCell = (text: string, width?: number) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, size: 22, font: "Arial" })],
        alignment: AlignmentType.CENTER,
      }),
    ],
    shading: { fill: "E5E7EB", type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  });
};

const createCell = (text: string, width?: number) => {
  return new TableCell({
    children: [
      new Paragraph({
        children: [new TextRun({ text, size: 22, font: "Arial" })],
      }),
    ],
    verticalAlign: VerticalAlign.CENTER,
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  });
};

const createEmptyCell = (width?: number) => {
  return new TableCell({
    children: [new Paragraph({ text: "" })],
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
  });
};

export const generateBRDWord = async (parsedBRD: ParsedBRD, logoBase64?: string) => {
  // Cover Page Section
  const coverPageChildren = [
    // Logo placeholder area - spacing for logo
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: logoBase64
        ? [
            new ImageRun({
              data: logoBase64,
              transformation: { width: 200, height: 80 },
              type: "jpg",
            }),
          ]
        : [
            new TextRun({
              text: "FAB | Grow Stronger",
              bold: true,
              size: 36,
              color: FAB_BLUE,
              font: "Arial",
            }),
          ],
    }),
    new Paragraph({ spacing: { after: 1200 } }),
    new Paragraph({ spacing: { after: 1200 } }),
    // Project Name in Italics
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `"${parsedBRD.title}"`,
          italics: true,
          size: 48,
          font: "Times New Roman",
          color: DARK_GRAY,
        }),
      ],
      spacing: { after: 400 },
    }),
    // Business Requirements Document title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Business Requirements Document",
          bold: true,
          size: 44,
          font: "Arial",
          color: DARK_GRAY,
        }),
      ],
      spacing: { after: 2400 },
    }),
    new Paragraph({ spacing: { after: 2400 } }),
    new Paragraph({ spacing: { after: 2400 } }),
    // Document Version
    new Paragraph({
      children: [
        new TextRun({
          text: `Document Version: ${parsedBRD.version}`,
          size: 22,
          font: "Arial",
        }),
      ],
      spacing: { after: 100 },
    }),
    // Date of submission
    new Paragraph({
      children: [
        new TextRun({
          text: `Date of submission: ${parsedBRD.date}`,
          size: 22,
          font: "Arial",
        }),
      ],
      spacing: { after: 400 },
    }),
    new Paragraph({ spacing: { after: 2000 } }),
    // Classification footer
    new Paragraph({
      children: [
        new TextRun({
          text: "Classified: Internal | FAB Internal",
          size: 18,
          font: "Arial",
          color: "666666",
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Page i", size: 18, font: "Arial" }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Confidential", size: 18, font: "Arial", color: "666666" }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // Statement of Confidentiality Section
  const confidentialitySection = [
    new Paragraph({
      text: "Statement of Confidentiality",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "The information contained in this document and related artefacts constitute confidential information of First Abu Dhabi Bank (FAB) and intended for internal usage purposes only. In consideration of receipt of this document, the recipient agrees to maintain such information as confidential and not to reproduce or otherwise disclose this information to any person outside the group directly responsible for evaluation of its contents, unless otherwise authorized by FAB in writing.",
          size: 22,
          font: "Arial",
        }),
      ],
      spacing: { after: 600 },
    }),
    // Revision Sheet
    new Paragraph({
      text: "Revision Sheet",
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Change Record", bold: true, size: 24, font: "Arial" })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Note:",
          bold: true,
          underline: {},
          size: 22,
          font: "Arial",
        }),
      ],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Version should start with 0.1 and increment by 0.1 for all drafts. The published version should be 1.0, In case of any changes post sign off, the version number should start with 1.1 and published version must be 2.0 or the next available sequence.",
          italics: true,
          size: 20,
          font: "Arial",
        }),
      ],
      spacing: { after: 300 },
    }),
    // Revision table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            createHeaderCell("Date", 20),
            createHeaderCell("Author", 25),
            createHeaderCell("Version", 15),
            createHeaderCell("Change Description", 40),
          ],
        }),
        ...Array(5)
          .fill(null)
          .map(
            () =>
              new TableRow({
                children: [
                  createEmptyCell(20),
                  createEmptyCell(25),
                  createEmptyCell(15),
                  createEmptyCell(40),
                ],
              })
          ),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // Helper function to create TOC entry with dot leaders - matching template format
  const createTocEntry = (
    number: string,
    title: string,
    pageNum: string,
    isMainSection: boolean = true,
    indent: number = 0
  ) => {
    // Create dot leaders that span to align with page numbers
    const dotCount = isMainSection ? 70 - title.length : 60 - title.length;
    const dotLeader = ".".repeat(Math.max(dotCount, 10));
    
    return new Paragraph({
      children: [
        new TextRun({
          text: number,
          bold: isMainSection,
          italics: isMainSection,
          size: 22,
          font: "Arial",
          color: TOC_GREEN,
        }),
        new TextRun({
          text: isMainSection ? " " : "  ",
          size: 22,
        }),
        new TextRun({
          text: title,
          bold: isMainSection,
          italics: isMainSection,
          size: 22,
          font: "Arial",
          color: TOC_GREEN,
        }),
        new TextRun({
          text: dotLeader,
          size: 22,
          font: "Arial",
          color: TOC_GREEN,
        }),
        new TextRun({
          text: pageNum,
          size: 22,
          font: "Arial",
          color: TOC_GREEN,
        }),
      ],
      indent: { left: indent },
      spacing: { after: 140 },
    });
  };

  // Table of Contents Section
  const tocSection = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "Table of Contents",
          bold: true,
          size: 32,
          font: "Arial",
          color: TOC_GREEN,
        }),
      ],
      spacing: { before: 400, after: 600 },
    }),
    // Main sections
    createTocEntry("1", "Business Requirements", "1"),
    createTocEntry("2", "Purpose", "2"),
    createTocEntry("3", "Overview", "3"),
    createTocEntry("3.1", "Requesting Line of Business", "3", false, 720),
    createTocEntry("3.2", "Stakeholders", "3", false, 720),
    createTocEntry("3.3", "Description", "4", false, 720),
    createTocEntry("3.4", "Assumptions", "4", false, 720),
    createTocEntry("3.5", "Dependencies", "4", false, 720),
    createTocEntry("4", ". Scope", "6"),
    createTocEntry("5", "Current and Target State Analysis", "7"),
    createTocEntry("6", "Appendices", "8"),
    createTocEntry("6.1", "Appendix I -Definitions, Acronyms, and Abbreviations", "8", false, 720),
    createTocEntry("6.2", "Appendix II –Reference Material", "8", false, 720),
    createTocEntry("7", "Approvals & Acknowledgments", "9"),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 1. Business Requirements Section
  const businessReqSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "1. BUSINESS REQUIREMENTS",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "(This is a listing of all business requirements such as: processes requirements, products requirements, services requirements, reporting Requirements, security requirements and workflow requirements where applicable.)",
          italics: true,
          size: 20,
          font: "Arial",
        }),
      ],
      spacing: { after: 400 },
    }),
    // Requirements table
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            createHeaderCell("Req. ID", 15),
            createHeaderCell("Category", 20),
            createHeaderCell("Req. Description", 45),
            createHeaderCell("Priority", 20),
          ],
        }),
        ...parsedBRD.requirements.flatMap((req, index) => [
          new TableRow({
            children: [
              createCell(`REQ_${index + 1}.01`, 15),
              createCell("1. Functional", 20),
              createCell(req.title, 45),
              createCell("Must have", 20),
            ],
          }),
        ]),
        // Add empty rows
        ...Array(3)
          .fill(null)
          .map(() =>
            new TableRow({
              children: [
                createEmptyCell(15),
                createEmptyCell(20),
                createEmptyCell(45),
                createEmptyCell(20),
              ],
            })
          ),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 2. Executive Summary (Purpose section in template)
  const executiveSummarySection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "2. EXECUTIVE SUMMARY",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [new TextRun({ text: parsedBRD.executiveSummary, size: 22, font: "Arial" })],
      spacing: { after: 400 },
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 3. Project Overview Section
  const overviewSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "3. PROJECT OVERVIEW",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    // 3.1 Project Background
    new Paragraph({
      children: [
        new TextRun({
          text: "3.1 Project Background",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: parsedBRD.projectBackground, size: 22, font: "Arial" })],
      spacing: { after: 300 },
    }),
    // 3.2 Project Purpose and Objectives
    new Paragraph({
      children: [
        new TextRun({
          text: "3.2 Project Purpose and Objectives",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Purpose:", bold: true, size: 22, font: "Arial" })],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: parsedBRD.projectPurpose, size: 22, font: "Arial" })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: "Objectives:", bold: true, size: 22, font: "Arial" })],
      spacing: { after: 100 },
    }),
    ...parsedBRD.objectives.map(
      (obj) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${obj}`, size: 22, font: "Arial" })],
          indent: { left: 360 },
          spacing: { after: 50 },
        })
    ),
    // 3.3 Project Stakeholders
    new Paragraph({
      children: [
        new TextRun({
          text: "3.3 Project Stakeholders",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 200 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [createHeaderCell("Role", 40), createHeaderCell("Name", 60)],
        }),
        ...parsedBRD.stakeholders.map(
          (s) =>
            new TableRow({
              children: [createCell(s.role, 40), createCell(s.name, 60)],
            })
        ),
      ],
    }),
    // 3.4 Detailed Requirements
    new Paragraph({
      children: [
        new TextRun({
          text: "3.4 Detailed Business Requirements",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    ...parsedBRD.requirements.flatMap((req) => [
      new Paragraph({
        children: [
          new TextRun({
            text: `${req.id} ${req.title}`,
            bold: true,
            size: 22,
            font: "Arial",
          }),
        ],
        spacing: { before: 300, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${req.id}.1 Business Need`,
            bold: true,
            size: 20,
            font: "Arial",
          }),
        ],
        spacing: { before: 150 },
      }),
      new Paragraph({
        children: [new TextRun({ text: req.businessNeed, size: 22, font: "Arial" })],
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${req.id}.2 Functional Requirements`,
            bold: true,
            size: 20,
            font: "Arial",
          }),
        ],
      }),
      ...req.functionalRequirements.map(
        (fr) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${fr}`, size: 22, font: "Arial" })],
            indent: { left: 360 },
          })
      ),
      new Paragraph({
        children: [
          new TextRun({
            text: `${req.id}.3 Non-Functional Requirements`,
            bold: true,
            size: 20,
            font: "Arial",
          }),
        ],
        spacing: { before: 150 },
      }),
      ...req.nonFunctionalRequirements.map(
        (nfr) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${nfr}`, size: 22, font: "Arial" })],
            indent: { left: 360 },
          })
      ),
      new Paragraph({
        children: [
          new TextRun({
            text: `${req.id}.4 Acceptance Criteria`,
            bold: true,
            size: 20,
            font: "Arial",
          }),
        ],
        spacing: { before: 150 },
      }),
      ...req.acceptanceCriteria.map(
        (ac) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${ac}`, size: 22, font: "Arial" })],
            indent: { left: 360 },
          })
      ),
    ]),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 4. Assumptions, Dependencies, and Constraints
  const assumptionsSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "4. ASSUMPTIONS, DEPENDENCIES, AND CONSTRAINTS",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "4.1 Assumptions",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    ...parsedBRD.assumptions.map(
      (a) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${a}`, size: 22, font: "Arial" })],
          indent: { left: 360 },
        })
    ),
    new Paragraph({
      children: [
        new TextRun({
          text: "4.2 Dependencies",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 100 },
    }),
    ...parsedBRD.dependencies.map(
      (d) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${d}`, size: 22, font: "Arial" })],
          indent: { left: 360 },
        })
    ),
    new Paragraph({
      children: [
        new TextRun({
          text: "4.3 Constraints",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 100 },
    }),
    ...parsedBRD.constraints.map(
      (c) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${c}`, size: 22, font: "Arial" })],
          indent: { left: 360 },
        })
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 5. Project Scope
  const scopeSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "5. PROJECT SCOPE",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "5.1 In Scope",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    ...parsedBRD.inScope.map(
      (s) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${s}`, size: 22, font: "Arial" })],
          indent: { left: 360 },
        })
    ),
    new Paragraph({
      children: [
        new TextRun({
          text: "5.2 Out of Scope",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 100 },
    }),
    ...parsedBRD.outOfScope.map(
      (s) =>
        new Paragraph({
          children: [new TextRun({ text: `• ${s}`, size: 22, font: "Arial" })],
          indent: { left: 360 },
        })
    ),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 6. Current and Target State Analysis
  const stateAnalysisSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "6. CURRENT AND TARGET STATE ANALYSIS",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "6.1 Current State Analysis",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 200, after: 100 },
    }),
    ...parsedBRD.currentState.flatMap((cs) => [
      new Paragraph({
        children: [new TextRun({ text: `${cs.section}:`, bold: true, size: 22, font: "Arial" })],
        spacing: { before: 150 },
      }),
      ...cs.items.map(
        (item) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${item}`, size: 22, font: "Arial" })],
            indent: { left: 360 },
          })
      ),
    ]),
    new Paragraph({
      children: [
        new TextRun({
          text: "6.2 Target State Analysis",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 300, after: 100 },
    }),
    ...parsedBRD.targetState.flatMap((ts) => [
      new Paragraph({
        children: [new TextRun({ text: `${ts.section}:`, bold: true, size: 22, font: "Arial" })],
        spacing: { before: 150 },
      }),
      ...ts.items.map(
        (item) =>
          new Paragraph({
            children: [new TextRun({ text: `• ${item}`, size: 22, font: "Arial" })],
            indent: { left: 360 },
          })
      ),
    ]),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 7. Appendices
  const appendicesSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "7. APPENDICES",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "7.1 Appendix I - Definitions, Acronyms, and Abbreviations",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 200, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "This subsection provides the definitions of all terms, acronyms, and abbreviations required to properly interpret the BRD.",
          italics: true,
          size: 20,
          font: "Arial",
        }),
      ],
      spacing: { after: 200 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [createHeaderCell("Term", 30), createHeaderCell("Description", 70)],
        }),
        ...parsedBRD.definitions.map(
          (def) =>
            new TableRow({
              children: [createCell(def.term, 30), createCell(def.description, 70)],
            })
        ),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "7.2 Appendix II - Reference Material",
          bold: true,
          size: 24,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 200 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [createHeaderCell("Document Title", 50), createHeaderCell("Location", 50)],
        }),
        ...parsedBRD.references.map(
          (ref) =>
            new TableRow({
              children: [createCell(ref.title, 50), createCell(ref.location, 50)],
            })
        ),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];

  // 8. Sign Off / Acknowledgement
  const signOffSection = [
    new Paragraph({
      children: [
        new TextRun({
          text: "8. SIGN OFF / ACKNOWLEDGEMENT",
          bold: true,
          size: 28,
          color: BLACK,
          font: "Arial",
        }),
      ],
      spacing: { before: 400, after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Approval Sign-off",
          bold: true,
          size: 24,
          font: "Arial",
        }),
      ],
      spacing: { after: 200 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: tableBorders,
      rows: [
        new TableRow({
          children: [
            createHeaderCell("Name", 40),
            createHeaderCell("Signature", 30),
            createHeaderCell("Date", 30),
          ],
        }),
        ...parsedBRD.signOff.map(
          (s) =>
            new TableRow({
              children: [
                createCell(`${s.role}: ${s.name}`, 40),
                createEmptyCell(30),
                createEmptyCell(30),
              ],
            })
        ),
      ],
    }),
  ];

  // Create the document
  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: {
            size: 28,
            bold: true,
            color: BLACK,
            font: "Arial",
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        heading2: {
          run: {
            size: 24,
            bold: true,
            color: BLACK,
            font: "Arial",
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Classified: Internal | FAB Internal",
                    size: 16,
                    color: "666666",
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                  insideHorizontal: { style: BorderStyle.NONE },
                  insideVertical: { style: BorderStyle.NONE },
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: parsedBRD.title,
                                italics: true,
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                        width: { size: 33, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: "Confidential",
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                        width: { size: 34, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: "Business Requirements Document",
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                        width: { size: 33, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...coverPageChildren,
          ...confidentialitySection,
          ...tocSection,
          ...businessReqSection,
          ...executiveSummarySection,
          ...overviewSection,
          ...assumptionsSection,
          ...scopeSection,
          ...stateAnalysisSection,
          ...appendicesSection,
          ...signOffSection,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `BRD_${parsedBRD.title.replace(/\s+/g, "_")}.docx`;
  saveAs(blob, fileName);
};

export type { ParsedBRD };
