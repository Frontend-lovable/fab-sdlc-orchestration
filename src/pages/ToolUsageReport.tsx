import { useState, useMemo, useCallback } from "react";
import { format, isWithinInterval } from "date-fns";
import { CalendarIcon, ChevronRight, Download, FileText, ChevronLeft, FileSpreadsheet } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Data type definition
interface ReportData {
  id: number;
  user: string;
  role: string;
  project: string;
  date: string;
  brdsGenerated: number;
  brdAvgTime: string;
  bcdsGenerated: number;
  bcdAvgTime: string;
}

// Initial dummy data as JSON
const initialData: ReportData[] = [
  {
    id: 1,
    user: "Sarah Johnson",
    role: "Product Manager",
    project: "UPI Integration",
    date: "2025-11-05",
    brdsGenerated: 8,
    brdAvgTime: "2.5",
    bcdsGenerated: 5,
    bcdAvgTime: "1.8",
  },
  {
    id: 2,
    user: "David Wilson",
    role: "Product Manager",
    project: "Payment Exchange",
    date: "2025-11-07",
    brdsGenerated: 12,
    brdAvgTime: "3.1",
    bcdsGenerated: 9,
    bcdAvgTime: "2.2",
  },
  {
    id: 3,
    user: "Emma Brown",
    role: "Product Manager",
    project: "Customer Portal",
    date: "2025-11-10",
    brdsGenerated: 6,
    brdAvgTime: "2.0",
    bcdsGenerated: 4,
    bcdAvgTime: "1.5",
  },
  {
    id: 4,
    user: "Tia Johnson",
    role: "Product Manager",
    project: "Mobile Banking",
    date: "2025-11-12",
    brdsGenerated: 15,
    brdAvgTime: "2.8",
    bcdsGenerated: 11,
    bcdAvgTime: "2.0",
  },
  {
    id: 5,
    user: "Robert Taylor",
    role: "Product Manager",
    project: "Fraud Detection",
    date: "2025-11-14",
    brdsGenerated: 9,
    brdAvgTime: "3.5",
    bcdsGenerated: 7,
    bcdAvgTime: "2.4",
  },
  {
    id: 6,
    user: "Michael Chen",
    role: "Product Manager",
    project: "UPI Integration",
    date: "2025-11-16",
    brdsGenerated: 11,
    brdAvgTime: "2.3",
    bcdsGenerated: 8,
    bcdAvgTime: "1.9",
  },
  {
    id: 7,
    user: "Jessica Lee",
    role: "Product Manager",
    project: "Payment Exchange",
    date: "2025-11-18",
    brdsGenerated: 7,
    brdAvgTime: "2.7",
    bcdsGenerated: 6,
    bcdAvgTime: "2.1",
  },
  {
    id: 8,
    user: "James Anderson",
    role: "Product Manager",
    project: "Customer Portal",
    date: "2025-11-20",
    brdsGenerated: 14,
    brdAvgTime: "3.0",
    bcdsGenerated: 10,
    bcdAvgTime: "2.3",
  },
  {
    id: 9,
    user: "Emily Davis",
    role: "Product Manager",
    project: "Mobile Banking",
    date: "2025-11-22",
    brdsGenerated: 5,
    brdAvgTime: "2.2",
    bcdsGenerated: 3,
    bcdAvgTime: "1.6",
  },
  {
    id: 10,
    user: "Christopher Martin",
    role: "Product Manager",
    project: "Fraud Detection",
    date: "2025-11-24",
    brdsGenerated: 10,
    brdAvgTime: "2.9",
    bcdsGenerated: 8,
    bcdAvgTime: "2.0",
  },
  {
    id: 11,
    user: "Amanda White",
    role: "Product Manager",
    project: "UPI Integration",
    date: "2025-11-26",
    brdsGenerated: 13,
    brdAvgTime: "3.2",
    bcdsGenerated: 9,
    bcdAvgTime: "2.5",
  },
  {
    id: 12,
    user: "Daniel Harris",
    role: "Product Manager",
    project: "Payment Exchange",
    date: "2025-11-28",
    brdsGenerated: 8,
    brdAvgTime: "2.6",
    bcdsGenerated: 6,
    bcdAvgTime: "1.7",
  },
  {
    id: 13,
    user: "Sarah Johnson",
    role: "Product Manager",
    project: "Customer Portal",
    date: "2025-11-03",
    brdsGenerated: 11,
    brdAvgTime: "2.4",
    bcdsGenerated: 7,
    bcdAvgTime: "1.9",
  },
  {
    id: 14,
    user: "David Wilson",
    role: "Product Manager",
    project: "Mobile Banking",
    date: "2025-11-08",
    brdsGenerated: 9,
    brdAvgTime: "3.3",
    bcdsGenerated: 5,
    bcdAvgTime: "2.2",
  },
  {
    id: 15,
    user: "Emma Brown",
    role: "Product Manager",
    project: "Fraud Detection",
    date: "2025-11-11",
    brdsGenerated: 7,
    brdAvgTime: "2.1",
    bcdsGenerated: 4,
    bcdAvgTime: "1.4",
  },
  {
    id: 16,
    user: "Tia Johnson",
    role: "Product Manager",
    project: "UPI Integration",
    date: "2025-11-15",
    brdsGenerated: 16,
    brdAvgTime: "2.9",
    bcdsGenerated: 12,
    bcdAvgTime: "2.1",
  },
  {
    id: 17,
    user: "Robert Taylor",
    role: "Product Manager",
    project: "Payment Exchange",
    date: "2025-11-19",
    brdsGenerated: 6,
    brdAvgTime: "3.4",
    bcdsGenerated: 5,
    bcdAvgTime: "2.6",
  },
  {
    id: 18,
    user: "Michael Chen",
    role: "Product Manager",
    project: "Customer Portal",
    date: "2025-11-21",
    brdsGenerated: 12,
    brdAvgTime: "2.5",
    bcdsGenerated: 9,
    bcdAvgTime: "1.8",
  },
  {
    id: 19,
    user: "Jessica Lee",
    role: "Product Manager",
    project: "Mobile Banking",
    date: "2025-11-23",
    brdsGenerated: 8,
    brdAvgTime: "2.8",
    bcdsGenerated: 7,
    bcdAvgTime: "2.0",
  },
  {
    id: 20,
    user: "James Anderson",
    role: "Product Manager",
    project: "Fraud Detection",
    date: "2025-11-25",
    brdsGenerated: 10,
    brdAvgTime: "3.1",
    bcdsGenerated: 8,
    bcdAvgTime: "2.4",
  },
  {
    id: 21,
    user: "Emily Davis",
    role: "Product Manager",
    project: "UPI Integration",
    date: "2025-11-27",
    brdsGenerated: 4,
    brdAvgTime: "2.0",
    bcdsGenerated: 3,
    bcdAvgTime: "1.5",
  },
  {
    id: 22,
    user: "Christopher Martin",
    role: "Product Manager",
    project: "Payment Exchange",
    date: "2025-11-29",
    brdsGenerated: 11,
    brdAvgTime: "3.0",
    bcdsGenerated: 7,
    bcdAvgTime: "2.1",
  },
  {
    id: 23,
    user: "Amanda White",
    role: "Product Manager",
    project: "Customer Portal",
    date: "2025-11-02",
    brdsGenerated: 14,
    brdAvgTime: "3.3",
    bcdsGenerated: 10,
    bcdAvgTime: "2.3",
  },
  {
    id: 24,
    user: "Daniel Harris",
    role: "Product Manager",
    project: "Mobile Banking",
    date: "2025-11-06",
    brdsGenerated: 9,
    brdAvgTime: "2.7",
    bcdsGenerated: 6,
    bcdAvgTime: "1.8",
  },
];

interface AppliedFilters {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  managers: string[];
  projects: string[];
  brdBcd: string[];
}

const ToolUsageReport = () => {
  // Store all data in useState
  const [allData] = useState<ReportData[]>(initialData);

  // Pending filter states (for selection before applying)
  const [pendingFromDate, setPendingFromDate] = useState<Date | undefined>(undefined);
  const [pendingToDate, setPendingToDate] = useState<Date | undefined>(undefined);
  const [pendingManagers, setPendingManagers] = useState<string[]>([]);
  const [pendingProjects, setPendingProjects] = useState<string[]>([]);
  const [pendingBrdBcd, setPendingBrdBcd] = useState<string[]>([]);

  // Applied filter state (only updates on Apply button click)
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    fromDate: undefined,
    toDate: undefined,
    managers: [],
    projects: [],
    brdBcd: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [managerDropdownOpen, setManagerDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [brdBcdDropdownOpen, setBrdBcdDropdownOpen] = useState(false);

  const itemsPerPage = 8;

  // Get unique values for filters
  const uniqueManagers = [...new Set(allData.map((d) => d.user))] as string[];
  const uniqueProjects = [...new Set(allData.map((d) => d.project))] as string[];
  const brdBcdOptions = ["BRD", "BCD"];

  // Check if any pending filters are selected
  const hasPendingFilters = useMemo(() => {
    return (
      pendingFromDate !== undefined ||
      pendingToDate !== undefined ||
      pendingManagers.length > 0 ||
      pendingProjects.length > 0 ||
      pendingBrdBcd.length > 0
    );
  }, [pendingFromDate, pendingToDate, pendingManagers, pendingProjects, pendingBrdBcd]);

  // Check if any filters are currently applied
  const hasAppliedFilters = useMemo(() => {
    return (
      appliedFilters.fromDate !== undefined ||
      appliedFilters.toDate !== undefined ||
      appliedFilters.managers.length > 0 ||
      appliedFilters.projects.length > 0 ||
      appliedFilters.brdBcd.length > 0
    );
  }, [appliedFilters]);

  // Filter data based on APPLIED filters only
  const filteredData = useMemo(() => {
    let result = [...allData];

    // Date range filter
    if (appliedFilters.fromDate && appliedFilters.toDate) {
      result = result.filter((item) => {
        const itemDate = new Date(item.date);
        return isWithinInterval(itemDate, {
          start: appliedFilters.fromDate!,
          end: appliedFilters.toDate!,
        });
      });
    } else if (appliedFilters.fromDate) {
      result = result.filter((item) => new Date(item.date) >= appliedFilters.fromDate!);
    } else if (appliedFilters.toDate) {
      result = result.filter((item) => new Date(item.date) <= appliedFilters.toDate!);
    }

    // Manager filter
    if (appliedFilters.managers.length > 0) {
      result = result.filter((item) => appliedFilters.managers.includes(item.user));
    }

    // Project filter
    if (appliedFilters.projects.length > 0) {
      result = result.filter((item) => appliedFilters.projects.includes(item.project));
    }

    // BRD/BCD filter - show only rows that have data for selected options
    if (appliedFilters.brdBcd.length > 0) {
      result = result.filter((item) => {
        if (appliedFilters.brdBcd.includes("BRD") && item.brdsGenerated > 0) return true;
        if (appliedFilters.brdBcd.includes("BCD") && item.bcdsGenerated > 0) return true;
        return false;
      });
    }

    return result;
  }, [appliedFilters, allData]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleApplyFilters = () => {
    setAppliedFilters({
      fromDate: pendingFromDate,
      toDate: pendingToDate,
      managers: pendingManagers,
      projects: pendingProjects,
      brdBcd: pendingBrdBcd,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    // Reset pending filters
    setPendingFromDate(undefined);
    setPendingToDate(undefined);
    setPendingManagers([]);
    setPendingProjects([]);
    setPendingBrdBcd([]);
    // Reset applied filters
    setAppliedFilters({
      fromDate: undefined,
      toDate: undefined,
      managers: [],
      projects: [],
      brdBcd: [],
    });
    setCurrentPage(1);
  };

  const handleManagerToggle = (manager: string) => {
    setPendingManagers((prev) => (prev.includes(manager) ? prev.filter((m) => m !== manager) : [...prev, manager]));
  };

  const handleProjectToggle = (project: string) => {
    setPendingProjects((prev) => (prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]));
  };

  const handleBrdBcdToggle = (option: string) => {
    setPendingBrdBcd((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
  };

  const getFilterLabel = (selected: string[], placeholder: string) => {
    if (selected.length === 0) return placeholder;
    if (selected.length === 1) return selected[0];
    return selected.join(", ");
  };

  // Export functionality
  const exportToCSV = useCallback(() => {
    const headers = [
      "User",
      "Role",
      "Project",
      "Date",
      "BRDs Generated",
      "BRD Avg Time",
      "BCDs Generated",
      "BCD Avg Time",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.user,
          row.role,
          row.project,
          format(new Date(row.date), "dd/MM/yyyy"),
          row.brdsGenerated,
          `${row.brdAvgTime} mins`,
          row.bcdsGenerated,
          `${row.bcdAvgTime} mins`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tool_usage_report_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
  }, [filteredData]);

  const exportToExcel = useCallback(() => {
    // For Excel, we create a simple HTML table that Excel can open
    const headers = [
      "User",
      "Role",
      "Project",
      "Date",
      "BRDs Generated",
      "BRD Avg Time",
      "BCDs Generated",
      "BCD Avg Time",
    ];
    const tableContent = `
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${filteredData
            .map(
              (row) => `
            <tr>
              <td>${row.user}</td>
              <td>${row.role}</td>
              <td>${row.project}</td>
              <td>${format(new Date(row.date), "dd/MM/yyyy")}</td>
              <td>${row.brdsGenerated}</td>
              <td>${row.brdAvgTime} mins</td>
              <td>${row.bcdsGenerated}</td>
              <td>${row.bcdAvgTime} mins</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    `;

    const blob = new Blob([tableContent], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tool_usage_report_${format(new Date(), "yyyy-MM-dd")}.xls`;
    link.click();
  }, [filteredData]);

  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="px-6 pt-6 border-b border-[#CCCCCC] mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-foreground">Tool Usage Report</h1>
              <p className="text-sm text-[#3B3B3B]">Monitor tool usage and user activity</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={!hasAppliedFilters}>
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card">
                <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer gap-2">
                  <FileText className="h-4 w-4" />
                  CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel} className="cursor-pointer gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 m-6 p-6 bg-[#F6F6F6] border border-[#D0D0D0] rounded-lg">
          {/* From Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[130px] justify-between text-left font-normal",
                  !pendingFromDate && "text-[#3B3B3B] bg-white",
                )}
              >
                {pendingFromDate ? format(pendingFromDate, "dd/MM/yy") : "From Date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card z-50" align="start">
              <Calendar
                mode="single"
                selected={pendingFromDate}
                onSelect={setPendingFromDate}
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
                  !pendingToDate && "text-[#3B3B3B] bg-white",
                )}
              >
                {pendingToDate ? format(pendingToDate, "dd/MM/yy") : "To Date"}
                <CalendarIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card z-50" align="start">
              <Calendar
                mode="single"
                selected={pendingToDate}
                onSelect={setPendingToDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* Product Manager Multi-select */}
          <Popover open={managerDropdownOpen} onOpenChange={setManagerDropdownOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[160px] justify-between text-left font-normal bg-white">
                <span className="truncate max-w-[120px]">{getFilterLabel(pendingManagers, "Product Manager")}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2 bg-card z-50" align="start">
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {uniqueManagers.map((manager) => (
                  <label key={manager} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <Checkbox
                      checked={pendingManagers.includes(manager)}
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
              <Button variant="outline" className="min-w-[140px] justify-between text-left font-normal bg-white">
                <span className="truncate max-w-[100px]">{getFilterLabel(pendingProjects, "All Projects")}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2 bg-card z-50" align="start">
              <div className="space-y-2 max-h-[200px] overflow-auto">
                {uniqueProjects.map((project) => (
                  <label key={project} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <Checkbox
                      checked={pendingProjects.includes(project)}
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
              <Button variant="outline" className="min-w-[120px] justify-between text-left font-normal bg-white">
                <span className="truncate max-w-[80px]">{getFilterLabel(pendingBrdBcd, "BRD, BCD")}</span>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-2 bg-card z-50" align="start">
              <div className="space-y-2">
                {brdBcdOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                    <Checkbox
                      checked={pendingBrdBcd.includes(option)}
                      onCheckedChange={() => handleBrdBcdToggle(option)}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Spacer to push buttons to the end */}
          <div className="flex-1" />

          {/* Reset Filters Button - Only show when filters applied */}
          {hasAppliedFilters && (
            <Button onClick={handleResetFilters} variant="outline">
              Reset Filters
            </Button>
          )}

          {/* Apply Filter Button */}
          <Button
            onClick={handleApplyFilters}
            disabled={!hasPendingFilters}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Apply Filter
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border overflow-hidden m-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F0F5FE]">
                  <TableHead className="font-medium text-foreground" rowSpan={2}>
                    User
                  </TableHead>
                  <TableHead className="font-medium text-foreground" rowSpan={2}>
                    Role
                  </TableHead>
                  <TableHead className="font-medium text-foreground" rowSpan={2}>
                    Project
                  </TableHead>
                  <TableHead className="font-medium text-foreground" rowSpan={2}>
                    Date
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-center border-l bg-[#E8F1FE]" colSpan={2}>
                    BRD Assistant
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-center border-l bg-[#E8F1FE]" colSpan={2}>
                    BCD Assistant
                  </TableHead>
                </TableRow>
                <TableRow className="bg-[#F0F5FE]">
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
                      <span className="inline-flex items-center p-2 rounded text-[#3B3B3B] text-xs font-medium bg-[#EBEBEB]">
                        {row.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#3B3B3B] " />
                        {row.project}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(row.date), "dd/MM/yyyy")}</TableCell>
                    <TableCell className="text-center border-l font-bold">{row.brdsGenerated}</TableCell>
                    <TableCell className="text-center text-[#3B3B3B]">{row.brdAvgTime} mins</TableCell>
                    <TableCell className="text-center border-l font-bold">{row.bcdsGenerated}</TableCell>
                    <TableCell className="text-center text-[#3B3B3B]">{row.bcdAvgTime} mins</TableCell>
                  </TableRow>
                ))}
                {paginatedData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-[#3B3B3B]">
                      No data found matching the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end mt-4 gap-4 mb-6 px-6">
          <span className="text-sm text-[#3B3B3B]">
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
