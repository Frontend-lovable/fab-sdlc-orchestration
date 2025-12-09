import { useState, useEffect, useMemo } from "react";
import { BRDProgress } from "../brd/BRDProgress";
import { ChatInterface } from "../chat/ChatInterface";
import { FileUploadSection } from "../files/FileUploadSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { generateBRDWord, ParsedBRD } from "@/utils/brdWordGenerator";
import { toast } from "sonner";
const sectionContent = {
  "Executive Summary": {
    title: "Executive Summary Assistant",
    subtitle: "Get help creating a comprehensive executive summary for your BRD",
    initialMessage: "Hello! 👋 I'm here to help you create an executive summary for your Payment Gateway project.\n\nAn executive summary should provide a high-level overview including:\n• Project purpose and scope\n• Key stakeholders\n• Business value and ROI\n• Timeline and budget overview\n\nWhat specific aspect would you like to focus on first?",
    placeholder: "Ask about executive summary requirements..."
  },
  "Stakeholders": {
    title: "Stakeholder Analysis Assistant",
    subtitle: "Identify and document key stakeholders for your project",
    initialMessage: "Hello! 👋 Let's identify the key stakeholders for your Payment Gateway project.\n\nWe should document:\n• Primary stakeholders (project sponsors, end users)\n• Secondary stakeholders (IT teams, compliance)\n• External stakeholders (payment processors, banks)\n• Their roles, responsibilities, and influence levels\n\nWho are the main stakeholders you've identified so far?",
    placeholder: "Describe your stakeholders..."
  },
  "Business Objectives": {
    title: "Business Objectives Assistant",
    subtitle: "Define clear business goals and success criteria",
    initialMessage: "Hello! 👋 Let's define the business objectives for your Payment Gateway project.\n\nWe should establish:\n• Primary business goals\n• Success metrics and KPIs\n• ROI expectations\n• Risk mitigation objectives\n• Compliance requirements\n\nWhat are the main business drivers for this payment gateway?",
    placeholder: "Describe your business objectives..."
  },
  "Functional Requirements": {
    title: "Functional Requirements Assistant",
    subtitle: "Document what the system must do",
    initialMessage: "Hello! 👋 Let's document the functional requirements for your Payment Gateway.\n\nWe should cover:\n• Payment processing capabilities\n• Supported payment methods\n• User interface requirements\n• Integration requirements\n• Transaction handling\n• Reporting features\n\nWhat payment processing features are most critical for your system?",
    placeholder: "Describe functional requirements..."
  },
  "Data Requirements": {
    title: "Data Requirements Assistant",
    subtitle: "Define data storage and processing needs",
    initialMessage: "Hello! 👋 Let's define the data requirements for your Payment Gateway.\n\nWe should document:\n• Transaction data structure\n• Customer data requirements\n• Data storage and retention policies\n• Data flow between systems\n• Backup and recovery requirements\n• Data encryption needs\n\nWhat types of transaction data will your system need to handle?",
    placeholder: "Describe data requirements..."
  },
  "Security Requirements": {
    title: "Security Requirements Assistant",
    subtitle: "Ensure security and compliance standards",
    initialMessage: "Hello! 👋 Let's establish security requirements for your Payment Gateway.\n\nWe must address:\n• PCI DSS compliance\n• Data encryption standards\n• Authentication and authorization\n• Fraud detection and prevention\n• Security monitoring and logging\n• Vulnerability management\n\nWhat security standards does your organization need to comply with?",
    placeholder: "Describe security requirements..."
  }
};
interface BRDDashboardProps {
  onBack?: () => void;
  selectedProject?: any;
  selectedBRDTemplate?: string | null;
}
export const BRDDashboard = ({
  onBack,
  selectedProject,
  selectedBRDTemplate
}: BRDDashboardProps) => {
  const { 
    chatMessages, 
    setChatMessages, 
    selectedProject: contextProject, 
    selectedBRDTemplate: contextTemplate,
    pendingUploadResponse,
    setPendingUploadResponse,
    uploadedFileBatches,
    brdSections,
    setBrdSections,
    isBRDApproved,
    brdResponseData,
    setBrdResponseData
  } = useAppState();
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  
  // Auto-select first section when brdSections are loaded
  useEffect(() => {
    if (brdSections.length > 0 && !selectedSection) {
      setSelectedSection(brdSections[0].title);
    }
  }, [brdSections, selectedSection]);

  // Check for pending upload response on mount and add to chat
  useEffect(() => {
    if (pendingUploadResponse) {
      const content = pendingUploadResponse.brd_auto_generated?.content_preview || pendingUploadResponse.message || 'File uploaded successfully';
      
      // Store raw content for Word download
      setBrdResponseData({
        title: contextProject?.project_name || 'BRD Document',
        version: '1.0',
        date: new Date().toLocaleDateString(),
        owner: 'Document Owner',
        rawContent: content
      });
      
      // Parse the content to extract dynamic sections
      const parsedSections = parseBRDSections(content);
      if (parsedSections.length > 0) {
        setBrdSections(parsedSections);
      }
      
      const botMessage = {
        id: `bot-${Date.now()}`,
        content: content,
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      const currentMessages = chatMessages.brd || [];
      // Only add if not already in messages
      const messageExists = currentMessages.some(msg => msg.content === botMessage.content);
      if (!messageExists) {
        setChatMessages("brd", [...currentMessages, botMessage]);
      }
      // Clear the pending response after adding to chat
      setPendingUploadResponse(null);
    }
  }, [pendingUploadResponse, chatMessages.brd, setChatMessages, setPendingUploadResponse, setBrdSections, setBrdResponseData, contextProject]);

  // Function to parse BRD sections from API response
  const parseBRDSections = (content: string) => {
    const sections = [];
    
    // Split content by markdown headers (##)
    const lines = content.split('\n');
    let currentSection: { title: string; description: string; content: string } | null = null;
    let currentContent: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for markdown section headers (## Section Title)
      if (line.startsWith('## ')) {
        // Save previous section if it exists
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        
        // Start new section
        const title = line.replace(/^##\s*\d*\.?\s*/, '').trim(); // Remove ## and numbers
        currentSection = {
          title,
          description: '',
          content: ''
        };
        currentContent = [];
      } else if (currentSection && line) {
        // Add content to current section
        currentContent.push(line);
        
        // Use first non-empty line as description if not set
        if (!currentSection.description && line.length > 0 && !line.startsWith('#')) {
          currentSection.description = line.length > 80 ? line.substring(0, 80) + '...' : line;
        }
      }
    }
    
    // Don't forget to add the last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }
    
    // If no sections found in markdown format, return empty array
    // (Document Overview will still show as it's independent)
    return sections;
  };
  const handleSectionReviewed = () => {
    // Mark current section as completed
    if (!completedSections.includes(selectedSection)) {
      setCompletedSections([...completedSections, selectedSection]);
    }

    // Move to next section
    const currentIndex = brdSections.findIndex(s => s.title === selectedSection);
    if (currentIndex < brdSections.length - 1) {
      const nextSection = brdSections[currentIndex + 1];
      setSelectedSection(nextSection.title);
    }
  };

  const handleFileUploadSuccess = (response?: any) => {
    // Response is already handled by global state and useEffect
  };

  const handleSectionTabClick = (title: string, description: string) => {
    // Only update and add message if it's a different section
    if (selectedSection === title) {
      return;
    }
    
    // Update selected section when clicking a tab
    setSelectedSection(title);
    
    // Find the full section content from brdSections
    const section = brdSections.find(s => s.title === title);
    const fullContent = section?.content || description;
    
    const currentMessages = chatMessages.brd || [];
    const newMessage = {
      id: `section-${Date.now()}`,
      content: `**${title}**\n\n${fullContent}`,
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setChatMessages("brd", [...currentMessages, newMessage]);
  };

  const handleResponseReceived = (response: string) => {
    // Update the BRD section content with the AI response
    if (selectedSection) {
      const updatedSections = brdSections.map(section =>
        section.title === selectedSection
          ? { ...section, content: response }
          : section
      );
      setBrdSections(updatedSections);
    }
  };

  // Parse BRD content to structured format for Word generation
  const parseBRDContentForWord = (rawContent: string): ParsedBRD => {
    const titleMatch = rawContent.match(/\*\*Project Title:\*\*\s*(.+)/);
    const versionMatch = rawContent.match(/\*\*Document Version:\*\*\s*(.+)/);
    const dateMatch = rawContent.match(/\*\*Document Date:\*\*\s*(.+)/);
    const ownerMatch = rawContent.match(/\*\*Document Owner:\*\*\s*(.+)/);

    const execMatch = rawContent.match(/\*\*1\. EXECUTIVE SUMMARY\*\*\s*\n([\s\S]*?)(?=---|\*\*2\.)/);
    const executiveSummary = execMatch ? execMatch[1].trim() : '';

    const bgMatch = rawContent.match(/\*\*2\.1 Project Background\*\*\s*\n([\s\S]*?)(?=\*\*2\.2)/);
    const projectBackground = bgMatch ? bgMatch[1].trim() : '';

    const purposeMatch = rawContent.match(/\*\*Purpose:\*\*\s*\n([\s\S]*?)(?=\*\*Objectives:)/);
    const projectPurpose = purposeMatch ? purposeMatch[1].trim() : '';

    const objMatch = rawContent.match(/\*\*Objectives:\*\*\s*\n([\s\S]*?)(?=\*\*2\.3)/);
    const objectives = objMatch ? objMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

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

    const assumpMatch = rawContent.match(/\*\*4\.1 Assumptions\*\*\s*\n([\s\S]*?)(?=\*\*4\.2)/);
    const assumptions = assumpMatch ? assumpMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

    const depMatch = rawContent.match(/\*\*4\.2 Dependencies\*\*\s*\n([\s\S]*?)(?=\*\*4\.3)/);
    const dependencies = depMatch ? depMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

    const constMatch = rawContent.match(/\*\*4\.3 Constraints\*\*\s*\n([\s\S]*?)(?=---|\*\*5\.)/);
    const constraints = constMatch ? constMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

    const inScopeMatch = rawContent.match(/\*\*5\.1 In Scope\*\*\s*\n([\s\S]*?)(?=\*\*5\.2)/);
    const inScope = inScopeMatch ? inScopeMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

    const outScopeMatch = rawContent.match(/\*\*5\.2 Out of Scope\*\*\s*\n([\s\S]*?)(?=---|\*\*6\.)/);
    const outOfScope = outScopeMatch ? outScopeMatch[1].split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace(/^-\s*/, '').trim()) : [];

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
      title: titleMatch?.[1]?.trim() || contextProject?.project_name || 'Untitled BRD',
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

  const handleDownloadWord = async () => {
    if (!brdResponseData?.rawContent) {
      toast.error("No BRD content available to download");
      return;
    }
    
    try {
      const parsedBRD = parseBRDContentForWord(brdResponseData.rawContent);
      await generateBRDWord(parsedBRD);
      toast.success("BRD document downloaded successfully");
    } catch (error) {
      console.error("Error generating Word document:", error);
      toast.error("Failed to generate Word document");
    }
  };

  const canDownload = isBRDApproved && brdResponseData?.rawContent;

  return <div className="p-4 sm:p-6 lg:p-8 bg-white">
      <div className="mb-4 lg:mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2 hover:bg-accent">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold sm:text-base">{contextProject?.project_name || "No Project Selected"}</h1>
          </div>
          <Button 
            onClick={handleDownloadWord} 
            disabled={!canDownload}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download BRD Response
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#E6E6E6 transparent'
      }}>
        <div className="lg:col-span-3 order-1 lg:order-1">
          <BRDProgress 
            selectedSection={selectedSection} 
            onSectionChange={setSelectedSection} 
            completedSections={completedSections} 
            hasProjectAndTemplate={!!(contextProject && contextTemplate)} 
            disabled={uploadedFileBatches.length === 0}
            onSectionClick={handleSectionTabClick}
            showDocumentOverview={uploadedFileBatches.length > 0}
            dynamicSections={brdSections}
          />
        </div>
        
        <div className="lg:col-span-6 order-3 lg:order-2">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
            <ChatInterface 
              title={sectionContent[selectedSection as keyof typeof sectionContent]?.title || "BRD Assistant"} 
              subtitle={sectionContent[selectedSection as keyof typeof sectionContent]?.subtitle || "Discuss your business requirements"} 
              initialMessage={sectionContent[selectedSection as keyof typeof sectionContent]?.initialMessage || "Hello! 👋 I'm your BRD Assistant."} 
              placeholder={sectionContent[selectedSection as keyof typeof sectionContent]?.placeholder || "Type your message..."} 
              onReviewed={handleSectionReviewed}
              externalMessages={chatMessages.brd}
              onMessagesChange={(messages) => setChatMessages("brd", messages)}
              disabled={uploadedFileBatches.length === 0}
              sectionContext={brdSections.find(s => s.title === selectedSection)?.content}
              onResponseReceived={handleResponseReceived}
            />
          </div>
        </div>
        
        <div className="lg:col-span-3 order-2 lg:order-3">
          <FileUploadSection onUploadSuccess={handleFileUploadSuccess} />
        </div>
      </div>
    </div>;
};