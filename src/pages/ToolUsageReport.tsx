import { useState, useMemo } from "react";
import { format, isWithinInterval, parse } from "date-fns";
import { CalendarIcon, ChevronRight, Download, FileText, ChevronLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Dummy data
const generateDummyData = () => {
  const users = [
    "Sarah Johnson",
    "David Wilson",
    "Emma Brown",
    "Tia Johnson",
    "Robert Taylor",
    "Michael Chen",
    "Jessica Lee",
    "James Anderson",
    "Emily Davis",
    "Christopher Martin",
    "Amanda White",
    "Daniel Harris",
  ];

  const projects = [
    "UPI Integration",
    "Payment Exchange",
    "Customer Portal",
    "Mobile Banking",
    "Fraud Detection",
  ];

  const data = [];
  const startDate = new Date(2025, 10, 1); // November 1, 2025

  for (let i = 0; i < 24; i++) {
    const recordDate = new Date(startDate);
    recordDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));

    data.push({
      id: i + 1,
      user: users[Math.floor(Math.random() * users.length)],
      role: "Product Manager",
      project: projects[Math.floor(Math.random() * projects.length)],
      brdsGenerated: Math.floor(Math.random() * 15) + 1,
      brdAvgTime: (Math.random() * 3 + 1).toFixed(1),
      bcdsGenerated: Math.floor(Math.random() * 12) + 1,
      bcdAvgTime: (Math.random() * 2 + 1).toFixed(1),
      startDate: recordDate,
      endDate: new Date(recordDate.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000),
    });
  }

  return data;
};

const allData = generateDummyData();

const ToolUsageReport = () => {
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedBrdBcd, setSelectedBrdBcd] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [brdBcdDropdownOpen, setBrdBcdDropdownOpen] = useState(false);
  
  const itemsPerPage = 8;

  // Get unique values for filters
  const uniqueManagers = [...new Set(allData.map((d) => d.user))];
  const uniqueProjects = [...new Set(allData.map((d) => d.project))];
  const brdBcdOptions = ["BRD", "BCD"];

  const hasFiltersApplied = useMemo(() => {
    return (
      fromDate !== undefined ||
      toDate !== undefined ||
      selectedManagers.length > 0 ||
      selectedProjects.length > 0 ||
      selectedBrdBcd.length > 0
    );
  }, [fromDate, toDate, selectedManagers, selectedProjects, selectedBrdBcd]);

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...allData];

    // Date range filter
    if (fromDate && toDate) {
      result = result.filter((item) => {
        return isWithinInterval(item.startDate, { start: fromDate, end: toDate });
      });
    } else if (fromDate) {
      result = result.filter((item) => item.startDate >= fromDate);
    } else if (toDate) {
      result = result.filter((item) => item.startDate <= toDate);
    }

    // Manager filter
    if (selectedManagers.length > 0) {
      result = result.filter((item) => selectedManagers.includes(item.user));
    }

    // Project filter
    if (selectedProjects.length > 0) {
      result = result.filter((item) => selectedProjects.includes(item.project));
    }

    return result;
  }, [fromDate, toDate, selectedManagers, selectedProjects]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedManagers([]);
    setSelectedProjects([]);
    setSelectedBrdBcd([]);
    setCurrentPage(1);
  };

  const handleManagerToggle = (manager: string) => {
    setSelectedManagers((prev) =>
      prev.includes(manager)
        ? prev.filter((m) => m !== manager)
        : [...prev, manager]
    );
  };

  const handleProjectToggle = (project: string) => {
    setSelectedProjects((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project]
    );
  };

  const handleBrdBcdToggle = (option: string) => {
    setSelectedBrdBcd((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const getFilterLabel = (selected: string[], placeholder: string) => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return selected[0];
    return selected.join(", ");
  };

  return (
    <MainLayout>
      <div className="flex-1 p-6 bg-background overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-foreground">Tool Usage Report</h1>
            <p className="text-sm text-muted-foreground">Monitor tool usage and user activity</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* From Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[130px] justify-between text-left font-normal",
                  !fromDate && "text-muted-foreground"
                )}
              >
                {fromDate ? format(fromDate, "dd/MM/yy") : "From Date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card z-50" align="start">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* To Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[130px] justify-between text-left font-normal",
                  !toDate && "text-muted-foreground"
                )}
              >
                {toDate ? format(toDate, "dd/MM/yy") : "To Date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card z-50" align="start">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Product Manager Multi-select */}
          <Popover open={managerDropdownOpen} onOpenChange={setManagerDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[160px] justify-between text-left font-normal"
              >
                <span className="truncate max-w-[120px]">
                  {getFilterLabel(selectedManagers, "Product Manager")}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2 bg-card z-50" align="start">
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {uniqueManagers.map((manager) => (
                  <label
                    key={manager}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedManagers.includes(manager)}
                      onCheckedChange={() => handleManagerToggle(manager)}
                    />
                    <span className="text-sm">{manager}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* All Projects Multi-select */}
          <Popover open={projectDropdownOpen} onOpenChange={setProjectDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[140px] justify-between text-left font-normal"
              >
                <span className="truncate max-w-[100px]">
                  {getFilterLabel(selectedProjects, "All Projects")}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2 bg-card z-50" align="start">
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {uniqueProjects.map((project) => (
                  <label
                    key={project}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedProjects.includes(project)}
                      onCheckedChange={() => handleProjectToggle(project)}
                    />
                    <span className="text-sm">{project}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* BRD, BCD Multi-select */}
          <Popover open={brdBcdDropdownOpen} onOpenChange={setBrdBcdDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[120px] justify-between text-left font-normal"
              >
                <span className="truncate max-w-[80px]">
                  {getFilterLabel(selectedBrdBcd, "BRD, BCD")}
                </span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-2 bg-card z-50" align="start">
              <div className="space-y-2">
                {brdBcdOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedBrdBcd.includes(option)}
                      onCheckedChange={() => handleBrdBcdToggle(option)}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Reset Filters Button - Only show when filters applied */}
          {hasFiltersApplied && (
            <Button
              onClick={handleResetFilters}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="font-medium text-foreground" rowSpan={2}>User</TableHead>
                  <TableHead className="font-medium text-foreground" rowSpan={2}>Role</TableHead>
                  <TableHead className="font-medium text-foreground" rowSpan={2}>Project</TableHead>
                  <TableHead className="font-medium text-foreground text-center border-l" colSpan={2}>
                    BRD Assistant
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-center border-l" colSpan={2}>
                    BCD Assistant
                  </TableHead>
                </TableRow>
                <TableRow className="bg-primary/5">
                  <TableHead className="font-medium text-foreground text-center border-l">BRDs Generated</TableHead>
                  <TableHead className="font-medium text-foreground text-center">Avg. Time Taken</TableHead>
                  <TableHead className="font-medium text-foreground text-center border-l">BCDs Generated</TableHead>
                  <TableHead className="font-medium text-foreground text-center">Avg. Time Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.user}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded bg-muted text-muted-foreground text-xs font-medium">
                        {row.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {row.project}
                      </div>
                    </TableCell>
                    <TableCell className="text-center border-l font-medium">{row.brdsGenerated}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{row.brdAvgTime} mins</TableCell>
                    <TableCell className="text-center border-l font-medium">{row.bcdsGenerated}</TableCell>
                    <TableCell className="text-center text-muted-foreground">{row.bcdAvgTime} mins</TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No data found matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end mt-4 gap-4">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ToolUsageReport;
