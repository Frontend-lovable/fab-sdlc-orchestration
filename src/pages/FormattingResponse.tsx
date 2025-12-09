import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { useAppState } from "@/contexts/AppStateContext";
import { useMemo } from "react";

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
  definitions: { term: string; description: string }[];
  references: { title: string; location: string }[];
  signOff: { name: string; role: string }[];
}

const parseBRDContent = (rawContent: string): ParsedBRD => {
  const lines = rawContent.split('\n');
  
  // Extract header info
  const titleMatch = rawContent.match(/\*\*Project Title:\*\*\s*(.+)/);
  const versionMatch = rawContent.match(/\*\*Document Version:\*\*\s*(.+)/);
  const dateMatch = rawContent.match(/\*\*Document Date:\*\*\s*(.+)/);
  const ownerMatch = rawContent.match(/\*\*Document Owner:\*\*\s*(.+)/);

  // Helper to extract section content
  const extractSection = (startPattern: RegExp, endPattern: RegExp): string => {
    const startIdx = lines.findIndex(l => startPattern.test(l));
    if (startIdx === -1) return '';
    const endIdx = lines.findIndex((l, i) => i > startIdx && endPattern.test(l));
    const sectionLines = lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx);
    return sectionLines.filter(l => l.trim() && !l.startsWith('---')).join('\n').trim();
  };

  // Helper to extract bullet points
  const extractBulletPoints = (content: string): string[] => {
    return content.split('\n')
      .filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'))
      .map(l => l.replace(/^[-•]\s*/, '').trim());
  };

  // Extract executive summary
  const execSummary = extractSection(/\*\*1\. EXECUTIVE SUMMARY\*\*/, /\*\*2\. PROJECT OVERVIEW\*\*/);

  // Extract project background
  const projectSection = extractSection(/\*\*2\. PROJECT OVERVIEW\*\*/, /\*\*3\. BUSINESS REQUIREMENTS\*\*/);
  const backgroundMatch = projectSection.match(/\*\*2\.1 Project Background\*\*\s*\n([\s\S]*?)(?=\*\*2\.2|$)/);
  const purposeMatch = projectSection.match(/\*\*Purpose:\*\*\s*\n([\s\S]*?)(?=\*\*Objectives:|$)/);
  const objectivesMatch = projectSection.match(/\*\*Objectives:\*\*\s*\n([\s\S]*?)(?=\*\*2\.3|$)/);
  const stakeholdersMatch = projectSection.match(/\*\*2\.3 Project Stakeholders\*\*\s*\n([\s\S]*?)$/);

  // Parse stakeholders
  const stakeholders: { role: string; name: string }[] = [];
  if (stakeholdersMatch) {
    const stakeholderLines = stakeholdersMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
    stakeholderLines.forEach(line => {
      const match = line.match(/-\s*(.+?):\s*(.+)/);
      if (match) {
        stakeholders.push({ role: match[1].trim(), name: match[2].trim() });
      }
    });
  }

  // Extract requirements
  const reqSection = extractSection(/\*\*3\. BUSINESS REQUIREMENTS\*\*/, /\*\*4\. ASSUMPTIONS/);
  const requirements: ParsedBRD['requirements'] = [];
  
  const reqMatches = reqSection.matchAll(/\*\*3\.(\d)\s+Requirement\s+\d+:\s*(.+?)\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d|$)/g);
  for (const match of reqMatches) {
    const reqContent = match[3];
    const businessNeedMatch = reqContent.match(/\*\*3\.\d\.1 Business Need\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d\.2|$)/);
    const funcReqMatch = reqContent.match(/\*\*3\.\d\.2 Functional Requirements\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d\.3|$)/);
    const nonFuncReqMatch = reqContent.match(/\*\*3\.\d\.3 Non-Functional Requirements\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d\.4|$)/);
    const acceptMatch = reqContent.match(/\*\*3\.\d\.4 Acceptance Criteria\*\*\s*\n([\s\S]*?)$/);

    requirements.push({
      id: `3.${match[1]}`,
      title: match[2].trim(),
      businessNeed: businessNeedMatch ? businessNeedMatch[1].trim() : '',
      functionalRequirements: funcReqMatch ? extractBulletPoints(funcReqMatch[1]) : [],
      nonFunctionalRequirements: nonFuncReqMatch ? extractBulletPoints(nonFuncReqMatch[1]) : [],
      acceptanceCriteria: acceptMatch ? extractBulletPoints(acceptMatch[1]) : [],
    });
  }

  // Extract assumptions, dependencies, constraints
  const adcSection = extractSection(/\*\*4\. ASSUMPTIONS, DEPENDENCIES, AND CONSTRAINTS\*\*/, /\*\*5\. PROJECT SCOPE\*\*/);
  const assumptionsMatch = adcSection.match(/\*\*4\.1 Assumptions\*\*\s*\n([\s\S]*?)(?=\*\*4\.2|$)/);
  const dependenciesMatch = adcSection.match(/\*\*4\.2 Dependencies\*\*\s*\n([\s\S]*?)(?=\*\*4\.3|$)/);
  const constraintsMatch = adcSection.match(/\*\*4\.3 Constraints\*\*\s*\n([\s\S]*?)$/);

  // Extract scope
  const scopeSection = extractSection(/\*\*5\. PROJECT SCOPE\*\*/, /\*\*6\. CURRENT AND TARGET STATE/);
  const inScopeMatch = scopeSection.match(/\*\*5\.1 In Scope\*\*\s*\n([\s\S]*?)(?=\*\*5\.2|$)/);
  const outScopeMatch = scopeSection.match(/\*\*5\.2 Out of Scope\*\*\s*\n([\s\S]*?)$/);

  // Extract definitions from appendix
  const definitions: { term: string; description: string }[] = [];
  const defTableMatch = rawContent.match(/\| Term \| Description \|[\s\S]*?(?=\*\*Appendix II|\*\*8\.)/);
  if (defTableMatch) {
    const tableRows = defTableMatch[0].split('\n').filter(l => l.startsWith('|') && !l.includes('Term') && !l.includes('---'));
    tableRows.forEach(row => {
      const cells = row.split('|').filter(c => c.trim());
      if (cells.length >= 2) {
        definitions.push({ term: cells[0].trim(), description: cells[1].trim() });
      }
    });
  }

  // Extract references
  const references: { title: string; location: string }[] = [];
  const refTableMatch = rawContent.match(/\| Document Title \| Location \|[\s\S]*?(?=\*\*8\.)/);
  if (refTableMatch) {
    const tableRows = refTableMatch[0].split('\n').filter(l => l.startsWith('|') && !l.includes('Document Title') && !l.includes('---'));
    tableRows.forEach(row => {
      const cells = row.split('|').filter(c => c.trim());
      if (cells.length >= 2) {
        references.push({ title: cells[0].trim(), location: cells[1].trim() });
      }
    });
  }

  // Extract sign-off
  const signOff: { name: string; role: string }[] = [];
  const signOffMatch = rawContent.match(/\*\*Approval Sign-off\*\*[\s\S]*?\| Name \| Signature \| Date \|[\s\S]*$/);
  if (signOffMatch) {
    const tableRows = signOffMatch[0].split('\n').filter(l => l.startsWith('|') && !l.includes('Name') && !l.includes('---'));
    tableRows.forEach(row => {
      const cells = row.split('|').filter(c => c.trim());
      if (cells.length >= 1 && cells[0].includes(':')) {
        const parts = cells[0].split(':');
        signOff.push({ role: parts[0].trim(), name: parts[1]?.trim() || '' });
      }
    });
  }

  return {
    title: titleMatch?.[1]?.trim() || 'Untitled BRD',
    version: versionMatch?.[1]?.trim() || '1.0',
    date: dateMatch?.[1]?.trim() || new Date().toLocaleDateString(),
    owner: ownerMatch?.[1]?.trim() || 'Unknown',
    executiveSummary: execSummary,
    projectBackground: backgroundMatch?.[1]?.trim() || '',
    projectPurpose: purposeMatch?.[1]?.trim() || '',
    objectives: objectivesMatch ? extractBulletPoints(objectivesMatch[1]) : [],
    stakeholders,
    requirements,
    assumptions: assumptionsMatch ? extractBulletPoints(assumptionsMatch[1]) : [],
    dependencies: dependenciesMatch ? extractBulletPoints(dependenciesMatch[1]) : [],
    constraints: constraintsMatch ? extractBulletPoints(constraintsMatch[1]) : [],
    inScope: inScopeMatch ? extractBulletPoints(inScopeMatch[1]) : [],
    outOfScope: outScopeMatch ? extractBulletPoints(outScopeMatch[1]) : [],
    definitions,
    references,
    signOff,
  };
};

const FormattingResponse = () => {
  const { brdResponseData } = useAppState();

  const parsedBRD = useMemo(() => {
    if (!brdResponseData?.rawContent) return null;
    return parseBRDContent(brdResponseData.rawContent);
  }, [brdResponseData]);

  const handleDownloadWord = async () => {
    if (!parsedBRD) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: "BUSINESS REQUIREMENTS DOCUMENT", bold: true, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `Project Title: ${parsedBRD.title}`, bold: true, size: 24 })],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `Document Version: ${parsedBRD.version}`, size: 22 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Document Date: ${parsedBRD.date}`, size: 22 })],
            }),
            new Paragraph({
              children: [new TextRun({ text: `Document Owner: ${parsedBRD.owner}`, size: 22 })],
              spacing: { after: 400 }
            }),
            new Paragraph({
              text: "1. EXECUTIVE SUMMARY",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: parsedBRD.executiveSummary, size: 22 })],
              spacing: { after: 300 }
            }),
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
              children: [new TextRun({ text: parsedBRD.projectBackground, size: 22 })],
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
              children: [new TextRun({ text: parsedBRD.projectPurpose, size: 22 })],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Objectives:", bold: true, size: 22 })],
            }),
            ...parsedBRD.objectives.map(obj => 
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
            ...parsedBRD.stakeholders.map(s => 
              new Paragraph({
                children: [new TextRun({ text: `• ${s.role}: ${s.name}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
            new Paragraph({
              text: "3. BUSINESS REQUIREMENTS",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            ...parsedBRD.requirements.flatMap(req => [
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
            ...parsedBRD.assumptions.map(a => 
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
            ...parsedBRD.dependencies.map(d => 
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
            ...parsedBRD.constraints.map(c => 
              new Paragraph({
                children: [new TextRun({ text: `• ${c}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
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
            ...parsedBRD.inScope.map(s => 
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
            ...parsedBRD.outOfScope.map(s => 
              new Paragraph({
                children: [new TextRun({ text: `• ${s}`, size: 22 })],
                indent: { left: 360 }
              })
            ),
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
                ...parsedBRD.definitions.map(def => 
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
                ...parsedBRD.signOff.map(s => 
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
    const fileName = `BRD_${parsedBRD.title.replace(/\s+/g, '_')}.docx`;
    saveAs(blob, fileName);
  };

  if (!brdResponseData || !parsedBRD) {
    return (
      <MainLayout>
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Helvetica Neue', color: '#3B3B3B' }}>
            Formatting Response
          </h1>
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">
              No BRD response available. Please generate a BRD from the BRD Assistant first.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

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
              <p><strong>Project Title:</strong> {parsedBRD.title}</p>
              <p><strong>Document Version:</strong> {parsedBRD.version}</p>
              <p><strong>Document Date:</strong> {parsedBRD.date}</p>
              <p><strong>Document Owner:</strong> {parsedBRD.owner}</p>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <section className="mb-8">
            <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
              1. EXECUTIVE SUMMARY
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#3B3B3B' }}>
              {parsedBRD.executiveSummary}
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
                {parsedBRD.projectBackground}
              </p>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>2.2 Project Purpose and Objectives</h4>
              <p className="text-sm mb-2"><strong>Purpose:</strong></p>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#3B3B3B' }}>
                {parsedBRD.projectPurpose}
              </p>
              {parsedBRD.objectives.length > 0 && (
                <>
                  <p className="text-sm mb-2"><strong>Objectives:</strong></p>
                  <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                    {parsedBRD.objectives.map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {parsedBRD.stakeholders.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>2.3 Project Stakeholders</h4>
                <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                  {parsedBRD.stakeholders.map((s, idx) => (
                    <li key={idx}><strong>{s.role}:</strong> {s.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Section 3: Business Requirements */}
          {parsedBRD.requirements.length > 0 && (
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
                3. BUSINESS REQUIREMENTS
              </h3>
              
              {parsedBRD.requirements.map((req) => (
                <div key={req.id} className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3" style={{ color: '#3B3B3B' }}>
                    {req.id} Requirement: {req.title}
                  </h4>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">{req.id}.1 Business Need</p>
                    <p className="text-sm" style={{ color: '#3B3B3B' }}>{req.businessNeed}</p>
                  </div>

                  {req.functionalRequirements.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">{req.id}.2 Functional Requirements</p>
                      <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                        {req.functionalRequirements.map((fr, idx) => (
                          <li key={idx}>{fr}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {req.nonFunctionalRequirements.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">{req.id}.3 Non-Functional Requirements</p>
                      <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                        {req.nonFunctionalRequirements.map((nfr, idx) => (
                          <li key={idx}>{nfr}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {req.acceptanceCriteria.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">{req.id}.4 Acceptance Criteria</p>
                      <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                        {req.acceptanceCriteria.map((ac, idx) => (
                          <li key={idx}>{ac}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Section 4: Assumptions, Dependencies, and Constraints */}
          {(parsedBRD.assumptions.length > 0 || parsedBRD.dependencies.length > 0 || parsedBRD.constraints.length > 0) && (
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
                4. ASSUMPTIONS, DEPENDENCIES, AND CONSTRAINTS
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {parsedBRD.assumptions.length > 0 && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>4.1 Assumptions</h4>
                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                      {parsedBRD.assumptions.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedBRD.dependencies.length > 0 && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>4.2 Dependencies</h4>
                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                      {parsedBRD.dependencies.map((d, idx) => (
                        <li key={idx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedBRD.constraints.length > 0 && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: '#3B3B3B' }}>4.3 Constraints</h4>
                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                      {parsedBRD.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section 5: Project Scope */}
          {(parsedBRD.inScope.length > 0 || parsedBRD.outOfScope.length > 0) && (
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
                5. PROJECT SCOPE
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {parsedBRD.inScope.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold mb-2 text-green-700 dark:text-green-400">5.1 In Scope</h4>
                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                      {parsedBRD.inScope.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {parsedBRD.outOfScope.length > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold mb-2 text-red-700 dark:text-red-400">5.2 Out of Scope</h4>
                    <ul className="list-disc list-inside text-sm space-y-1" style={{ color: '#3B3B3B' }}>
                      {parsedBRD.outOfScope.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section 7: Appendices */}
          {(parsedBRD.definitions.length > 0 || parsedBRD.references.length > 0) && (
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
                7. APPENDICES
              </h3>
              
              {parsedBRD.definitions.length > 0 && (
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
                        {parsedBRD.definitions.map((def, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                            <td className="border border-border p-2 font-medium" style={{ color: '#3B3B3B' }}>{def.term}</td>
                            <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{def.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {parsedBRD.references.length > 0 && (
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
                        {parsedBRD.references.map((ref, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-card' : 'bg-muted/30'}>
                            <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{ref.title}</td>
                            <td className="border border-border p-2" style={{ color: '#3B3B3B' }}>{ref.location}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Section 8: Sign Off */}
          {parsedBRD.signOff.length > 0 && (
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
                    {parsedBRD.signOff.map((s, idx) => (
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
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default FormattingResponse;
