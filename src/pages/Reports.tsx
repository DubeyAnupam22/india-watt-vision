
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth";
import { useWasteData } from "@/lib/calculation";
import Navbar from "@/components/Navbar";
import ReportGenerator from "@/components/ReportGenerator";
import { Clock, Download, FileText, FilterIcon, Search } from "lucide-react";

const Reports = () => {
  const { isAuthenticated, canViewReports } = useAuth();
  const navigate = useNavigate();
  const { cities } = useWasteData();
  
  const [filter, setFilter] = useState({
    search: "",
    year: "",
    reportType: "",
  });
  
  // Mock report data
  const reportData = [
    {
      id: "1",
      title: "Mumbai Waste-to-Energy Feasibility Report",
      cityId: "1",
      date: "2023-10-15",
      type: "Feasibility",
      status: "Completed",
      size: "4.2 MB",
    },
    {
      id: "2",
      title: "Delhi Monthly Waste Analysis",
      cityId: "2",
      date: "2023-11-02",
      type: "Analysis",
      status: "Completed",
      size: "3.8 MB",
    },
    {
      id: "3",
      title: "Bengaluru Implementation Strategy",
      cityId: "3",
      date: "2023-09-20",
      type: "Strategy",
      status: "Completed",
      size: "6.5 MB",
    },
    {
      id: "4",
      title: "Chennai Environmental Impact Assessment",
      cityId: "4",
      date: "2023-10-28",
      type: "Environmental",
      status: "Completed",
      size: "5.1 MB",
    },
    {
      id: "5",
      title: "Kolkata Annual Energy Potential Report",
      cityId: "5",
      date: "2023-11-10",
      type: "Annual",
      status: "Processing",
      size: "—",
    },
  ];
  
  // Filtered reports based on search filters
  const filteredReports = reportData.filter(report => {
    const matchesSearch = filter.search
      ? report.title.toLowerCase().includes(filter.search.toLowerCase())
      : true;
      
    const matchesYear = filter.year
      ? report.date.includes(filter.year)
      : true;
      
    const matchesType = filter.reportType
      ? report.type.toLowerCase() === filter.reportType.toLowerCase()
      : true;
      
    return matchesSearch && matchesYear && matchesType;
  });
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!canViewReports()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, canViewReports, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Download previously generated reports or filter by type
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search reports..."
                        className="pl-8"
                        value={filter.search}
                        onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select
                        value={filter.year}
                        onValueChange={(value) => setFilter({ ...filter, year: value })}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Years</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select
                        value={filter.reportType}
                        onValueChange={(value) => setFilter({ ...filter, reportType: value })}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="feasibility">Feasibility</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                          <SelectItem value="environmental">Environmental</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {filteredReports.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px] sm:w-auto">Report Title</TableHead>
                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                            <TableHead className="hidden sm:table-cell">Type</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">
                                <div>
                                  <div>{report.title}</div>
                                  <div className="text-xs text-gray-500 sm:hidden">
                                    {report.date} • {report.type}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {report.date}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {report.type}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center">
                                  <div 
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      report.status === "Completed" 
                                        ? "bg-green-500" 
                                        : "bg-amber-500"
                                    }`}
                                  />
                                  <span>{report.status}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 flex items-center"
                                  disabled={report.status !== "Completed"}
                                >
                                  {report.status === "Completed" ? (
                                    <>
                                      <Download className="h-3.5 w-3.5 mr-1" />
                                      <span className="hidden sm:inline">Download</span>
                                      <span className="sm:hidden">Get</span>
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      <span className="hidden sm:inline">Processing</span>
                                      <span className="sm:hidden">Wait</span>
                                    </>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-8 text-center">
                      <FileText className="mx-auto h-10 w-10 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No reports match your current filters. Try adjusting your search criteria.
                      </p>
                      <div className="mt-6">
                        <Button
                          onClick={() => setFilter({ search: "", year: "", reportType: "" })}
                          variant="outline"
                        >
                          <FilterIcon className="h-4 w-4 mr-2" />
                          Clear Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>
                  Standard report templates for different purposes
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Feasibility Report",
                      description: "Comprehensive analysis of WtE potential",
                      icon: "📊",
                    },
                    {
                      title: "Environmental Impact",
                      description: "Emissions and environmental benefits",
                      icon: "🌱",
                    },
                    {
                      title: "Financial Analysis",
                      description: "Cost-benefit and ROI calculations",
                      icon: "💰",
                    },
                    {
                      title: "Executive Summary",
                      description: "Concise overview for stakeholders",
                      icon: "📝",
                    },
                    {
                      title: "Implementation Plan",
                      description: "Step-by-step implementation guide",
                      icon: "🔨",
                    },
                    {
                      title: "Technical Specifications",
                      description: "Detailed technical requirements",
                      icon: "⚙️",
                    },
                  ].map((template, index) => (
                    <Card key={index} className="bg-white">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="text-3xl mb-2">
                          {template.icon}
                        </div>
                        <h3 className="font-medium text-sm">{template.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {template.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-3 text-xs h-7"
                        >
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ReportGenerator cities={cities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
