import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { useMemo, useEffect } from "react";
import { generateBRDWord, ParsedBRD } from "@/utils/brdWordGenerator";

// Sample BRD response that simulates API response
const sampleBRDResponse = `**BUSINESS REQUIREMENTS DOCUMENT**
**Project Title:** Payments Platform Enhancement - Q4 Release
**Document Version:** 1.0  
**Document Date:** December 7, 2025  
**Document Owner:** Priya (Product Manager)
---
**1. EXECUTIVE SUMMARY**
This Business Requirements Document outlines the functional and technical requirements for the Payments Platform Enhancement release scheduled for Q4 2025. The project aims to address critical client feedback and operational issues by implementing four major capabilities: hourly settlement reporting, integrated dispute resolution, multi-currency support, and instant refunds. These enhancements will improve merchant experience, reduce support overhead, and expand market reach.
---
**2. PROJECT OVERVIEW**
**2.1 Project Background**  
The current payments platform has received consistent feedback from multiple clients regarding limitations in settlement reporting frequency, dispute resolution processes, currency support, and refund processing timelines. These limitations impact merchant operational efficiency and customer satisfaction.
**2.2 Project Purpose and Objectives**
**Purpose:**  
To enhance the payments platform capabilities by implementing near real-time reporting, streamlined dispute management, expanded currency support, and instant refund processing to improve merchant experience and operational efficiency.
**Objectives:**
- Implement near real-time settlement reporting with hourly updates
- Provide integrated dispute resolution tracking within the platform
- Expand currency support to include AUD, CAD, and SGD
- Enable instant refunds for eligible transactions through supported processors
**2.3 Project Stakeholders**
- Business Owner: Priya (Product Manager)
- Lead Developer: Rohan
- Payments Specialist: Amit
- UX Designer: Meera
- QA Lead: Sanjay
- Business Analyst: Kavita
---
**3. BUSINESS REQUIREMENTS**
**3.1 Requirement 1: Hourly Settlement Reporting**
**3.1.1 Business Need**  
Merchants currently operate on outdated financial figures due to daily batch reporting at 2 AM. They require near real-time visibility into settlement data to make informed business decisions throughout the day.
**3.1.2 Functional Requirements**
- Generate settlement reports on an hourly basis instead of daily
- Implement streaming event architecture to replace batch processing jobs
- Provide dashboard auto-refresh capability every few minutes
- Display "last updated" timestamp indicator on reporting interface
- Deliver incremental updates without table locking or processing delays
**3.1.3 Non-Functional Requirements**
- Define clear SLAs for update frequency
- Ensure database queries handle incremental updates efficiently
- Maintain system performance during continuous data streaming
**3.1.4 Acceptance Criteria**
- Settlement data updates appear within the defined hourly window
- Dashboard refreshes automatically without manual user intervention
- Last updated timestamp displays accurately
- System maintains performance under continuous update load
- QA validates continuous data flow and verifies correct reflection of updates including delayed or partially processed records
---
**3.2 Requirement 2: Integrated Dispute Resolution**
**3.2.1 Business Need**  
Current dispute resolution process requires merchants to submit forms via email, resulting in slow processing, lack of visibility, and excessive support calls for status updates.
**3.2.2 Functional Requirements**
- Build in-platform dispute management tool
- Enable merchants to submit disputes with supporting evidence
- Implement status tracking: "Received," "Under Review," "Resolved"
- Provide secure document upload capability for PDF files
- Display progress indicators with estimated resolution times
- Enable direct communication within the platform
**3.2.3 Non-Functional Requirements**
- Ensure secure document storage and transmission
- Maintain audit trail for all dispute activities
- Provide notification system for status updates
**3.2.4 Acceptance Criteria**
- Merchants can submit disputes with supporting documentation
- Status tracking accurately reflects dispute progression
- Document upload supports PDF format with appropriate security
- Support call volume for dispute status inquiries decreases
- Estimated resolution times display accurately
---
**3.3 Requirement 3: Multi-Currency Support**
**3.3.1 Business Need**  
Current platform supports only USD, EUR, and GBP, limiting merchant reach in key markets including Australia, Canada, and Singapore.
**3.3.2 Functional Requirements**
- Add support for AUD (Australian Dollar), CAD (Canadian Dollar), and SGD (Singapore Dollar)
- Integrate FX rate API with daily/hourly refresh capability
- Implement currency selector for report viewing
- Provide accurate locale-specific number and currency formatting
- Display historical exchange rate information
**3.3.3 Non-Functional Requirements**
- Ensure FX rate accuracy and reliability
- Maintain performance with additional currency processing
- Comply with local currency regulations and standards
**3.3.4 Acceptance Criteria**
- All three new currencies (AUD, CAD, SGD) are fully supported
- FX rates update according to configured refresh schedule
- Currency display and formatting matches locale standards
- Reports accurately reflect multi-currency transactions
- Historical exchange rates are accessible for auditing
---
**3.4 Requirement 4: Instant Refunds**
**3.4.1 Business Need**  
Current refund processing takes one to two days, leading to customer dissatisfaction and increased support inquiries. Instant refund capability improves customer experience and reduces operational overhead.
**3.4.2 Functional Requirements**
- Enable instant refund processing for supported payment processors
- Implement automated detection of instant refund capability
- Provide confirmation workflow for instant refunds
- Display clear messaging when instant refunds are not available
- Maintain fallback to standard refund processing when necessary
**3.4.3 Non-Functional Requirements**
- Ensure transaction security and fraud prevention
- Maintain compliance with payment processor requirements
- Provide real-time processing without system degradation
**3.4.4 Acceptance Criteria**
- Instant refunds process within defined timeframe for supported processors
- System correctly identifies instant refund eligibility
- Confirmation workflows function properly
- Clear messaging displays for non-eligible transactions
- Fallback to standard processing works seamlessly
---
**4. ASSUMPTIONS, DEPENDENCIES, AND CONSTRAINTS**
**4.1 Assumptions**
- Payment processor APIs support required instant refund functionality
- FX rate provider can deliver reliable hourly rate updates
- Current infrastructure can support streaming architecture implementation
- Merchant user base will adopt new dispute resolution workflow
**4.2 Dependencies**
- FX provider contract finalization and API access
- Payment processor certification for instant refund capability
- Infrastructure upgrades for streaming event processing
- UX design completion for dispute management interface
**4.3 Constraints**
- Q4 2025 release timeline
- Budget allocation for FX provider integration
- Existing payment processor contractual limitations
- Data retention policies for settlement reporting
---
**5. PROJECT SCOPE**
**5.1 In Scope**
- Hourly settlement reporting implementation
- Integrated dispute resolution tool
- Support for AUD, CAD, and SGD currencies
- Instant refund processing for eligible transactions
- Dashboard auto-refresh functionality
- Secure document upload capability
- FX rate integration and display
- Status tracking and notifications
**5.2 Out of Scope**
- Additional currencies beyond AUD, CAD, and SGD
- Cryptocurrency support
- Third-party dispute mediation services
- Refund reversal capability for instant refunds
- Mobile application enhancements
- Historical data migration for settlement reports beyond current data retention
---
**6. CURRENT AND TARGET STATE ANALYSIS**
**6.1 CURRENT STATE ANALYSIS**
**Settlement Reporting:**
- Reports generated once daily at 2 AM via batch processing
- Merchants operate on outdated financial figures during business hours
- No automatic dashboard refresh capability
- Delayed visibility into settlement status
**Dispute Resolution:**
- Email-based form submission process
- No visibility into dispute status
- Manual follow-up required for updates
- High volume of support calls
**Currency Support:**
- Limited to USD, EUR, and GBP
- No FX rate integration
- Restricted market reach
**Refund Processing:**
- Standard processing with one to two day delay
- No instant refund capability
- Customer dissatisfaction with refund timing
**6.2 TARGET STATE ANALYSIS**
**Settlement Reporting:**
- Hourly report generation via streaming event architecture
- Real-time operational visibility
- Auto-refresh dashboard with timestamp indicators
- Incremental updates without performance degradation
**Dispute Resolution:**
- In-platform dispute management tool
- Status tracking with "Received," "Under Review," "Resolved" stages
- Secure document upload capability
- Progress indicators with estimated resolution times
- Reduced support call volume
**Currency Support:**
- Support for USD, EUR, GBP, AUD, CAD, and SGD
- Integrated FX rate API with daily/hourly refresh
- Currency selector for report viewing
- Accurate locale-specific formatting
**Refund Processing:**
- Instant refund capability for supported processors
- Automated capability detection
- Confirmation workflows
- Improved customer satisfaction
---
**7. APPENDICES**
**Appendix I - Definitions, Acronyms, and Abbreviations**
| Term | Description |
|------|-------------|
| API | Application Programming Interface |
| AUD | Australian Dollar |
| BRD | Business Requirements Document |
| CAD | Canadian Dollar |
| EUR | Euro |
| FX | Foreign Exchange |
| GBP | British Pound Sterling |
| PDF | Portable Document Format |
| QA | Quality Assurance |
| SGD | Singapore Dollar |
| SLA | Service Level Agreement |
| UI | User Interface |
| USD | United States Dollar |
**Appendix II - Reference Material**
| Document Title | Location |
|----------------|----------|
| Client Feedback Survey Results | Internal Repository |
| Payment Processor API Documentation | Vendor Portal |
| FX Provider Integration Specifications | Pending Contract Finalization |
| Template Document | uploads\\fab-sdlc-brd-template.docx |
| Transcript File | uploads\\tmpelo751k7.txt |
---
**8. SIGN OFF / ACKNOWLEDGEMENT**
**Approval Sign-off**
| Name | Signature | Date |
|------|-----------|------|
| Business Owner: Priya (Product Manager) | | |
| Service Owner: Amit (Payments Specialist) | | |
| Delivery Head: Rohan (Lead Developer) | | |
---`;

// Using ParsedBRD type from brdWordGenerator utility

const parseBRDContent = (rawContent: string): ParsedBRD => {
  // Extract header info
  const titleMatch = rawContent.match(/\*\*Project Title:\*\*\s*(.+)/);
  const versionMatch = rawContent.match(/\*\*Document Version:\*\*\s*(.+)/);
  const dateMatch = rawContent.match(/\*\*Document Date:\*\*\s*(.+)/);
  const ownerMatch = rawContent.match(/\*\*Document Owner:\*\*\s*(.+)/);

  // Extract executive summary
  const execMatch = rawContent.match(/\*\*1\. EXECUTIVE SUMMARY\*\*\s*\n([\s\S]*?)(?=---|\*\*2\.)/);
  const executiveSummary = execMatch ? execMatch[1].trim() : '';

  // Extract project background
  const bgMatch = rawContent.match(/\*\*2\.1 Project Background\*\*\s*\n([\s\S]*?)(?=\*\*2\.2)/);
  const projectBackground = bgMatch ? bgMatch[1].trim() : '';

  // Extract purpose
  const purposeMatch = rawContent.match(/\*\*Purpose:\*\*\s*\n([\s\S]*?)(?=\*\*Objectives:)/);
  const projectPurpose = purposeMatch ? purposeMatch[1].trim() : '';

  // Extract objectives
  const objMatch = rawContent.match(/\*\*Objectives:\*\*\s*\n([\s\S]*?)(?=\*\*2\.3)/);
  const objectives = objMatch ? objMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

  // Extract stakeholders
  const stakeholderMatch = rawContent.match(/\*\*2\.3 Project Stakeholders\*\*\s*\n([\s\S]*?)(?=---|\*\*3\.)/);
  const stakeholders: { role: string; name: string }[] = [];
  if (stakeholderMatch) {
    const lines = stakeholderMatch[1].split('\n').filter(l => l.trim().startsWith('-'));
    lines.forEach(line => {
      const match = line.match(/-\s*(.+?):\s*(.+)/);
      if (match) {
        stakeholders.push({ role: match[1].trim(), name: match[2].trim() });
      }
    });
  }

  // Extract requirements
  const requirements: ParsedBRD['requirements'] = [];
  const reqPattern = /\*\*3\.(\d) Requirement \d+: (.+?)\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d Requirement|\*\*4\.)/g;
  let reqMatch;
  while ((reqMatch = reqPattern.exec(rawContent)) !== null) {
    const reqContent = reqMatch[3];
    const id = `3.${reqMatch[1]}`;
    const title = reqMatch[2].trim();
    
    const bnMatch = reqContent.match(/\*\*3\.\d\.1 Business Need\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d\.2)/);
    const frMatch = reqContent.match(/\*\*3\.\d\.2 Functional Requirements\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d\.3)/);
    const nfrMatch = reqContent.match(/\*\*3\.\d\.3 Non-Functional Requirements\*\*\s*\n([\s\S]*?)(?=\*\*3\.\d\.4)/);
    const acMatch = reqContent.match(/\*\*3\.\d\.4 Acceptance Criteria\*\*\s*\n([\s\S]*?)(?=---|$)/);

    requirements.push({
      id,
      title,
      businessNeed: bnMatch ? bnMatch[1].trim() : '',
      functionalRequirements: frMatch ? frMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [],
      nonFunctionalRequirements: nfrMatch ? nfrMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [],
      acceptanceCriteria: acMatch ? acMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [],
    });
  }

  // Extract assumptions
  const assumpMatch = rawContent.match(/\*\*4\.1 Assumptions\*\*\s*\n([\s\S]*?)(?=\*\*4\.2)/);
  const assumptions = assumpMatch ? assumpMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

  // Extract dependencies
  const depMatch = rawContent.match(/\*\*4\.2 Dependencies\*\*\s*\n([\s\S]*?)(?=\*\*4\.3)/);
  const dependencies = depMatch ? depMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

  // Extract constraints
  const constMatch = rawContent.match(/\*\*4\.3 Constraints\*\*\s*\n([\s\S]*?)(?=---|\*\*5\.)/);
  const constraints = constMatch ? constMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

  // Extract in scope
  const inScopeMatch = rawContent.match(/\*\*5\.1 In Scope\*\*\s*\n([\s\S]*?)(?=\*\*5\.2)/);
  const inScope = inScopeMatch ? inScopeMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

  // Extract out of scope
  const outScopeMatch = rawContent.match(/\*\*5\.2 Out of Scope\*\*\s*\n([\s\S]*?)(?=---|\*\*6\.)/);
  const outOfScope = outScopeMatch ? outScopeMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

  // Extract current state
  const currentState: { section: string; items: string[] }[] = [];
  const currentStateMatch = rawContent.match(/\*\*6\.1 CURRENT STATE ANALYSIS\*\*\s*\n([\s\S]*?)(?=\*\*6\.2)/);
  if (currentStateMatch) {
    const sections = currentStateMatch[1].split(/\*\*([^*]+):\*\*/);
    for (let i = 1; i < sections.length; i += 2) {
      const sectionName = sections[i].trim();
      const items = sections[i + 1]?.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) || [];
      if (sectionName && items.length > 0) {
        currentState.push({ section: sectionName, items });
      }
    }
  }

  // Extract target state
  const targetState: { section: string; items: string[] }[] = [];
  const targetStateMatch = rawContent.match(/\*\*6\.2 TARGET STATE ANALYSIS\*\*\s*\n([\s\S]*?)(?=---|\*\*7\.)/);
  if (targetStateMatch) {
    const sections = targetStateMatch[1].split(/\*\*([^*]+):\*\*/);
    for (let i = 1; i < sections.length; i += 2) {
      const sectionName = sections[i].trim();
      const items = sections[i + 1]?.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) || [];
      if (sectionName && items.length > 0) {
        targetState.push({ section: sectionName, items });
      }
    }
  }

  // Extract definitions
  const definitions: { term: string; description: string }[] = [];
  const defMatch = rawContent.match(/\| Term \| Description \|\s*\n\|[-|]+\|\s*\n([\s\S]*?)(?=\*\*Appendix II)/);
  if (defMatch) {
    const rows = defMatch[1].split('\n').filter(l => l.trim().startsWith('|'));
    rows.forEach(row => {
      const cells = row.split('|').filter(c => c.trim());
      if (cells.length >= 2) {
        definitions.push({ term: cells[0].trim(), description: cells[1].trim() });
      }
    });
  }

  // Extract references
  const references: { title: string; location: string }[] = [];
  const refMatch = rawContent.match(/\| Document Title \| Location \|\s*\n\|[-|]+\|\s*\n([\s\S]*?)(?=---|\*\*8\.)/);
  if (refMatch) {
    const rows = refMatch[1].split('\n').filter(l => l.trim().startsWith('|'));
    rows.forEach(row => {
      const cells = row.split('|').filter(c => c.trim());
      if (cells.length >= 2) {
        references.push({ title: cells[0].trim(), location: cells[1].trim() });
      }
    });
  }

  // Extract sign-off
  const signOff: { name: string; role: string }[] = [];
  const signMatch = rawContent.match(/\| Name \| Signature \| Date \|\s*\n\|[-|]+\|\s*\n([\s\S]*?)(?=---|$)/);
  if (signMatch) {
    const rows = signMatch[1].split('\n').filter(l => l.trim().startsWith('|'));
    rows.forEach(row => {
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
    executiveSummary,
    projectBackground,
    projectPurpose,
    objectives,
    stakeholders,
    requirements,
    assumptions,
    dependencies,
    constraints,
    inScope,
    outOfScope,
    currentState,
    targetState,
    definitions,
    references,
    signOff,
  };
};

const FormattingResponse = () => {
  const { brdResponseData, setBrdResponseData } = useAppState();

  // Simulate API response on mount - in real scenario, this would come from an actual API
  useEffect(() => {
    if (!brdResponseData) {
      // Simulate receiving response from API
      setBrdResponseData({
        title: "Payments Platform Enhancement - Q4 Release",
        version: "1.0",
        date: "December 7, 2025",
        owner: "Priya (Product Manager)",
        rawContent: sampleBRDResponse
      });
    }
  }, [brdResponseData, setBrdResponseData]);

  const parsedBRD = useMemo(() => {
    if (!brdResponseData?.rawContent) return null;
    return parseBRDContent(brdResponseData.rawContent);
  }, [brdResponseData]);

  const handleDownloadWord = async () => {
    if (!parsedBRD) return;
    await generateBRDWord(parsedBRD);
  };

  if (!parsedBRD) {
    return (
      <MainLayout>
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Helvetica Neue', color: '#3B3B3B' }}>
            Formatting Response
          </h1>
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <p className="text-muted-foreground">Loading BRD response...</p>
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

          {/* Section 6: Current and Target State */}
          {(parsedBRD.currentState.length > 0 || parsedBRD.targetState.length > 0) && (
            <section className="mb-8">
              <h3 className="text-lg font-bold mb-3 text-primary" style={{ fontFamily: 'Helvetica Neue' }}>
                6. CURRENT AND TARGET STATE ANALYSIS
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {parsedBRD.currentState.length > 0 && (
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold mb-3 text-orange-700 dark:text-orange-400">6.1 Current State</h4>
                    {parsedBRD.currentState.map((cs, idx) => (
                      <div key={idx} className="mb-3">
                        <p className="text-sm font-medium mb-1" style={{ color: '#3B3B3B' }}>{cs.section}:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2" style={{ color: '#3B3B3B' }}>
                          {cs.items.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {parsedBRD.targetState.length > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-3 text-blue-700 dark:text-blue-400">6.2 Target State</h4>
                    {parsedBRD.targetState.map((ts, idx) => (
                      <div key={idx} className="mb-3">
                        <p className="text-sm font-medium mb-1" style={{ color: '#3B3B3B' }}>{ts.section}:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 ml-2" style={{ color: '#3B3B3B' }}>
                          {ts.items.map((item, iIdx) => (
                            <li key={iIdx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
