import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const brdData = {
  title: "Payments Platform Enhancement - Q4 Release",
  version: "1.0",
  date: "December 7, 2025",
  owner: "Priya (Product Manager)",
  sections: {
    executiveSummary: `This Business Requirements Document outlines the functional and technical requirements for the Payments Platform Enhancement release scheduled for Q4 2025. The project aims to address critical client feedback and operational issues by implementing four major capabilities: hourly settlement reporting, integrated dispute resolution, multi-currency support, and instant refunds. These enhancements will improve merchant experience, reduce support overhead, and expand market reach.`,
    projectBackground: `The current payments platform has received consistent feedback from multiple clients regarding limitations in settlement reporting frequency, dispute resolution processes, currency support, and refund processing timelines. These limitations impact merchant operational efficiency and customer satisfaction.`,
    projectPurpose: `To enhance the payments platform capabilities by implementing near real-time reporting, streamlined dispute management, expanded currency support, and instant refund processing to improve merchant experience and operational efficiency.`,
    objectives: [
      "Implement near real-time settlement reporting with hourly updates",
      "Provide integrated dispute resolution tracking within the platform",
      "Expand currency support to include AUD, CAD, and SGD",
      "Enable instant refunds for eligible transactions through supported processors"
    ],
    stakeholders: [
      { role: "Business Owner", name: "Priya (Product Manager)" },
      { role: "Lead Developer", name: "Rohan" },
      { role: "Payments Specialist", name: "Amit" },
      { role: "UX Designer", name: "Meera" },
      { role: "QA Lead", name: "Sanjay" },
      { role: "Business Analyst", name: "Kavita" }
    ],
    requirements: [
      {
        id: "3.1",
        title: "Hourly Settlement Reporting",
        businessNeed: "Merchants currently operate on outdated financial figures due to daily batch reporting at 2 AM. They require near real-time visibility into settlement data to make informed business decisions throughout the day.",
        functionalRequirements: [
          "Generate settlement reports on an hourly basis instead of daily",
          "Implement streaming event architecture to replace batch processing jobs",
          "Provide dashboard auto-refresh capability every few minutes",
          "Display 'last updated' timestamp indicator on reporting interface",
          "Deliver incremental updates without table locking or processing delays"
        ],
        nonFunctionalRequirements: [
          "Define clear SLAs for update frequency",
          "Ensure database queries handle incremental updates efficiently",
          "Maintain system performance during continuous data streaming"
        ],
        acceptanceCriteria: [
          "Settlement data updates appear within the defined hourly window",
          "Dashboard refreshes automatically without manual user intervention",
          "Last updated timestamp displays accurately",
          "System maintains performance under continuous update load",
          "QA validates continuous data flow and verifies correct reflection of updates including delayed or partially processed records"
        ]
      },
      {
        id: "3.2",
        title: "Integrated Dispute Resolution",
        businessNeed: "Current dispute resolution process requires merchants to submit forms via email, resulting in slow processing, lack of visibility, and excessive support calls for status updates.",
        functionalRequirements: [
          "Build in-platform dispute management tool",
          "Enable merchants to submit disputes with supporting evidence",
          "Implement status tracking: 'Received,' 'Under Review,' 'Resolved'",
          "Provide secure document upload capability for PDF files",
          "Display progress indicators with estimated resolution times",
          "Enable direct communication within the platform"
        ],
        nonFunctionalRequirements: [
          "Ensure secure document storage and transmission",
          "Maintain audit trail for all dispute activities",
          "Provide notification system for status updates"
        ],
        acceptanceCriteria: [
          "Merchants can submit disputes with supporting documentation",
          "Status tracking accurately reflects dispute progression",
          "Document upload supports PDF format with appropriate security",
          "Support call volume for dispute status inquiries decreases",
          "Estimated resolution times display accurately"
        ]
      },
      {
        id: "3.3",
        title: "Multi-Currency Support",
        businessNeed: "Current platform supports only USD, EUR, and GBP, limiting merchant reach in key markets including Australia, Canada, and Singapore.",
        functionalRequirements: [
          "Add support for AUD (Australian Dollar), CAD (Canadian Dollar), and SGD (Singapore Dollar)",
          "Integrate FX rate API with daily/hourly refresh capability",
          "Implement currency selector for report viewing",
          "Provide accurate locale-specific number and currency formatting",
          "Display historical exchange rate information"
        ],
        nonFunctionalRequirements: [
          "Ensure FX rate accuracy and reliability",
          "Maintain performance with additional currency processing",
          "Comply with local currency regulations and standards"
        ],
        acceptanceCriteria: [
          "All three new currencies (AUD, CAD, SGD) are fully supported",
          "FX rates update according to configured refresh schedule",
          "Currency display and formatting matches locale standards",
          "Reports accurately reflect multi-currency transactions",
          "Historical exchange rates are accessible for auditing"
        ]
      },
      {
        id: "3.4",
        title: "Instant Refunds",
        businessNeed: "Current refund processing takes one to two days, leading to customer dissatisfaction and increased support inquiries. Instant refund capability improves customer experience and reduces operational overhead.",
        functionalRequirements: [
          "Enable instant refund processing for supported payment processors",
          "Implement automated detection of instant refund capability",
          "Provide confirmation workflow for instant refunds",
          "Display clear messaging when instant refunds are not available",
          "Maintain fallback to standard refund processing when necessary"
        ],
        nonFunctionalRequirements: [
          "Ensure transaction security and fraud prevention",
          "Maintain compliance with payment processor requirements",
          "Provide real-time processing without system degradation"
        ],
        acceptanceCriteria: [
          "Instant refunds process within defined timeframe for supported processors",
          "System correctly identifies instant refund eligibility",
          "Confirmation workflows function properly",
          "Clear messaging displays for non-eligible transactions",
          "Fallback to standard processing works seamlessly"
        ]
      }
    ],
    assumptions: [
      "Payment processor APIs support required instant refund functionality",
      "FX rate provider can deliver reliable hourly rate updates",
      "Current infrastructure can support streaming architecture implementation",
      "Merchant user base will adopt new dispute resolution workflow"
    ],
    dependencies: [
      "FX provider contract finalization and API access",
      "Payment processor certification for instant refund capability",
      "Infrastructure upgrades for streaming event processing",
      "UX design completion for dispute management interface"
    ],
    constraints: [
      "Q4 2025 release timeline",
      "Budget allocation for FX provider integration",
      "Existing payment processor contractual limitations",
      "Data retention policies for settlement reporting"
    ],
    inScope: [
      "Hourly settlement reporting implementation",
      "Integrated dispute resolution tool",
      "Support for AUD, CAD, and SGD currencies",
      "Instant refund processing for eligible transactions",
      "Dashboard auto-refresh functionality",
      "Secure document upload capability",
      "FX rate integration and display",
      "Status tracking and notifications"
    ],
    outOfScope: [
      "Additional currencies beyond AUD, CAD, and SGD",
      "Cryptocurrency support",
      "Third-party dispute mediation services",
      "Refund reversal capability for instant refunds",
      "Mobile application enhancements",
      "Historical data migration for settlement reports beyond current data retention"
    ],
    definitions: [
      { term: "API", description: "Application Programming Interface" },
      { term: "AUD", description: "Australian Dollar" },
      { term: "BRD", description: "Business Requirements Document" },
      { term: "CAD", description: "Canadian Dollar" },
      { term: "EUR", description: "Euro" },
      { term: "FX", description: "Foreign Exchange" },
      { term: "GBP", description: "British Pound Sterling" },
      { term: "PDF", description: "Portable Document Format" },
      { term: "QA", description: "Quality Assurance" },
      { term: "SGD", description: "Singapore Dollar" },
      { term: "SLA", description: "Service Level Agreement" },
      { term: "UI", description: "User Interface" },
      { term: "USD", description: "United States Dollar" }
    ],
    references: [
      { title: "Client Feedback Survey Results", location: "Internal Repository" },
      { title: "Payment Processor API Documentation", location: "Vendor Portal" },
      { title: "FX Provider Integration Specifications", location: "Pending Contract Finalization" },
      { title: "Template Document", location: "uploads\\fab-sdlc-brd-template.docx" },
      { title: "Transcript File", location: "uploads\\tmpelo751k7.txt" }
    ],
    signOff: [
      { name: "Priya (Product Manager)", role: "Business Owner" },
      { name: "Amit (Payments Specialist)", role: "Service Owner" },
      { name: "Rohan (Lead Developer)", role: "Delivery Head" }
    ]
  }
};

const FormattingResponse = () => {
  const handleDownloadWord = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              children: [new TextRun({ text: "BUSINESS REQUIREMENTS DOCUMENT", bold: true, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `Project Title: ${brdData.title}`, bold: true, size: 24 })],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `Document Version: ${brdData.version}`, size: 22 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Document Date: ${brdData.date}`, size: 22 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Document Owner: ${brdData.owner}`, size: 22 })],
              spacing: { after: 400 }
            }),

            // Section 1
            new Paragraph({
              text: "1. EXECUTIVE SUMMARY",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: brdData.sections.executiveSummary, size: 22 })],
              spacing: { after: 300 }
            }),

            // Section 2
            new Paragraph({
              text: "2. PROJECT OVERVIEW",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "2.1 Project Background",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: brdData.sections.projectBackground, size: 22 })],
              spacing: { after: 200 }
            }),
            new Paragraph({
              text: "2.2 Project Purpose and Objectives",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Purpose:", bold: true, size: 22 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: brdData.sections.projectPurpose, size: 22 })],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Objectives:", bold: true, size: 22 })],
            }),
            ...brdData.sections.objectives.map(obj => 
              new Paragraph({
                children: [new TextRun({ text: `• ${obj}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
            new Paragraph({
              text: "2.3 Project Stakeholders",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 }
            }),
            ...brdData.sections.stakeholders.map(s => 
              new Paragraph({
                children: [new TextRun({ text: `• ${s.role}: ${s.name}`, size: 22 })],
                indent: { left: 360 }
              })
            ),

            // Section 3
            new Paragraph({
              text: "3. BUSINESS REQUIREMENTS",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...brdData.sections.requirements.flatMap(req => [
              new Paragraph({
                text: `${req.id} Requirement: ${req.title}`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 100 }
              }),
              new Paragraph({
                children: [new TextRun({ text: `${req.id}.1 Business Need`, bold: true, size: 22 })],
                spacing: { before: 200 }
              }),
              new Paragraph({
                children: [new TextRun({ text: req.businessNeed, size: 22 })],
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [new TextRun({ text: `${req.id}.2 Functional Requirements`, bold: true, size: 22 })],
              }),
              ...req.functionalRequirements.map(fr => 
                new Paragraph({
                  children: [new TextRun({ text: `• ${fr}`, size: 22 })],
                  indent: { left: 360 }
                })
              ),
              new Paragraph({
                children: [new TextRun({ text: `${req.id}.3 Non-Functional Requirements`, bold: true, size: 22 })],
                spacing: { before: 200 }
              }),
              ...req.nonFunctionalRequirements.map(nfr => 
                new Paragraph({
                  children: [new TextRun({ text: `• ${nfr}`, size: 22 })],
                  indent: { left: 360 }
                })
              ),
              new Paragraph({
                children: [new TextRun({ text: `${req.id}.4 Acceptance Criteria`, bold: true, size: 22 })],
                spacing: { before: 200 }
              }),
              ...req.acceptanceCriteria.map(ac => 
                new Paragraph({
                  children: [new TextRun({ text: `• ${ac}`, size: 22 })],
                  indent: { left: 360 }
                })
              ),
            ]),

            // Section 4
            new Paragraph({
              text: "4. ASSUMPTIONS, DEPENDENCIES, AND CONSTRAINTS",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "4.1 Assumptions",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...brdData.sections.assumptions.map(a => 
              new Paragraph({
                children: [new TextRun({ text: `• ${a}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
            new Paragraph({
              text: "4.2 Dependencies",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...brdData.sections.dependencies.map(d => 
              new Paragraph({
                children: [new TextRun({ text: `• ${d}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
            new Paragraph({
              text: "4.3 Constraints",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...brdData.sections.constraints.map(c => 
              new Paragraph({
                children: [new TextRun({ text: `• ${c}`, size: 22 })],
                indent: { left: 360 }
              })
            ),

            // Section 5
            new Paragraph({
              text: "5. PROJECT SCOPE",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "5.1 In Scope",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...brdData.sections.inScope.map(s => 
              new Paragraph({
                children: [new TextRun({ text: `• ${s}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
            new Paragraph({
              text: "5.2 Out of Scope",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            ...brdData.sections.outOfScope.map(s => 
              new Paragraph({
                children: [new TextRun({ text: `• ${s}`, size: 22 })],
                indent: { left: 360 }
              })
            ),

            // Section 7 - Appendices
            new Paragraph({
              text: "7. APPENDICES",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              text: "Appendix I - Definitions, Acronyms, and Abbreviations",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 100 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Term", bold: true })] })],
                      width: { size: 30, type: WidthType.PERCENTAGE }
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })],
                      width: { size: 70, type: WidthType.PERCENTAGE }
                    })
                  ]
                }),
                ...brdData.sections.definitions.map(def => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: def.term })] })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: def.description })] })]
                      })
                    ]
                  })
                )
              ]
            }),

            // Section 8 - Sign Off
            new Paragraph({
              text: "8. SIGN OFF / ACKNOWLEDGEMENT",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Approval Sign-off", bold: true, size: 24 })],
              spacing: { after: 200 }
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Name", bold: true })] })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Signature", bold: true })] })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ children: [new TextRun({ text: "Date", bold: true })] })]
                    })
                  ]
                }),
                ...brdData.sections.signOff.map(s => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ children: [new TextRun({ text: `${s.role}: ${s.name}` })] })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "" })]
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: "" })]
                      })
                    ]
                  })
                )
              ]
            })
          ]
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "BRD_Payments_Platform_Enhancement.docx");
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Helvetica Neue', color: '#3B3B3B' }}>
            Formatting Response
          </h1>
          <Button onClick={handleDownloadWord} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download BRD Response
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
          {/* Document Header */}
          <div className="text-center mb-8 pb-6 border-b border-border">
            <h2 className="text-xl font-bold mb-4" style={{ fontFamily: 'Helvetica Neue', color: '#3B3B3B' }}>
              BUSINESS REQUIREMENTS DOCUMENT
            </h2>
            <div className="space-y-1 text-sm" style={{ color: '#3B3B3B' }}>
              <p><strong>Project Title:</strong> {brdData.title}</p>
              <p><strong>Document Version:</strong> {brdData.version}</p>
              <p><strong>Document Date:</strong> {brdData.date}</p>
              <p><strong>Document Owner:</strong> {brdData.owner}</p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              1. EXECUTIVE SUMMARY
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3B3B3B' }}>
              {brdData.sections.executiveSummary}
            </p>
          </section>

          {/* Section 2: Project Overview */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              2. PROJECT OVERVIEW
            </h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>2.1 Project Background</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#3B3B3B' }}>
                {brdData.sections.projectBackground}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>2.2 Project Purpose and Objectives</h4>
              <p className="text-sm mb-2"><strong>Purpose:</strong></p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#3B3B3B' }}>
                {brdData.sections.projectPurpose}
              </p>
              <p className="text-sm mb-2"><strong>Objectives:</strong></p>
              <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                {brdData.sections.objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>2.3 Project Stakeholders</h4>
              <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                {brdData.sections.stakeholders.map((s, idx) => (
                  <li key={idx}><strong>{s.role}:</strong> {s.name}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3: Business Requirements */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              3. BUSINESS REQUIREMENTS
            </h3>
            
            {brdData.sections.requirements.map((req) => (
              <div key={req.id} className="mb-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3" style={{ color: '#3B3B3B' }}>
                  {req.id} Requirement: {req.title}
                </h4>
                
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">{req.id}.1 Business Need</p>
                  <p className="text-sm" style={{ color: '#3B3B3B' }}>{req.businessNeed}</p>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">{req.id}.2 Functional Requirements</p>
                  <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                    {req.functionalRequirements.map((fr, idx) => (
                      <li key={idx}>{fr}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">{req.id}.3 Non-Functional Requirements</p>
                  <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                    {req.nonFunctionalRequirements.map((nfr, idx) => (
                      <li key={idx}>{nfr}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">{req.id}.4 Acceptance Criteria</p>
                  <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                    {req.acceptanceCriteria.map((ac, idx) => (
                      <li key={idx}>{ac}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>

          {/* Section 4: Assumptions, Dependencies, and Constraints */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              4. ASSUMPTIONS, DEPENDENCIES, AND CONSTRAINTS
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>4.1 Assumptions</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                  {brdData.sections.assumptions.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>4.2 Dependencies</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                  {brdData.sections.dependencies.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>4.3 Constraints</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                  {brdData.sections.constraints.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Project Scope */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              5. PROJECT SCOPE
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">5.1 In Scope</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                  {brdData.sections.inScope.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400">5.2 Out of Scope</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                  {brdData.sections.outOfScope.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Appendices */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              7. APPENDICES
            </h3>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>Appendix I - Definitions, Acronyms, and Abbreviations</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Term</th>
                      <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brdData.sections.definitions.map((def, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                        <td className="border border-border p-2 font-medium" style={{ color: '#3B3B3B' }}>{def.term}</td>
                        <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{def.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>Appendix II - Reference Material</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Document Title</th>
                      <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brdData.sections.references.map((ref, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                        <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{ref.title}</td>
                        <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{ref.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 8: Sign Off */}
          <section>
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              8. SIGN OFF / ACKNOWLEDGEMENT
            </h3>
            <p className="text-sm font-semibold mb-2" style={{ color: '#3B3B3B' }}>Approval Sign-off</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Name</th>
                    <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Signature</th>
                    <th className="border border-border p-2 text-left font-semibold" style={{ color: '#3B3B3B' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {brdData.sections.signOff.map((s, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                      <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{s.role}: {s.name}</td>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default FormattingResponse;
