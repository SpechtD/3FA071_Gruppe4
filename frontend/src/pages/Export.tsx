
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Zap, 
  Droplet, 
  Thermometer, 
  FileJson, 
  FileText, 
  FilePlus2,
  Gauge,
  Calculator,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Mock data for meters - This matches the meter data from the Meters page
 * Each meter represents a single measurement device with its own properties
 */
const meterData = {
  electricity: [
    { id: 1, name: "M-EL-001", reading: 45720, lastUpdated: "2025-05-01", type: "electricity" },
    { id: 2, name: "M-EL-002", reading: 32150, lastUpdated: "2025-05-02", type: "electricity" },
    { id: 3, name: "M-EL-003", reading: 27860, lastUpdated: "2025-05-01", type: "electricity" },
    { id: 4, name: "M-EL-004", reading: 18940, lastUpdated: "2025-05-03", type: "electricity" },
  ],
  water: [
    { id: 5, name: "M-WA-001", reading: 3250, lastUpdated: "2025-05-01", type: "water" },
    { id: 6, name: "M-WA-002", reading: 2840, lastUpdated: "2025-05-02", type: "water" },
    { id: 7, name: "M-WA-003", reading: 1950, lastUpdated: "2025-05-01", type: "water" },
    { id: 8, name: "M-WA-004", reading: 2210, lastUpdated: "2025-05-03", type: "water" },
  ],
  heating: [
    { id: 9, name: "M-HE-001", reading: 15230, lastUpdated: "2025-05-01", type: "heating" },
    { id: 10, name: "M-HE-002", reading: 12780, lastUpdated: "2025-05-02", type: "heating" },
    { id: 11, name: "M-HE-003", reading: 9540, lastUpdated: "2025-05-01", type: "heating" },
    { id: 12, name: "M-HE-004", reading: 11320, lastUpdated: "2025-05-03", type: "heating" },
  ],
};

/**
 * Flattened list of all meters for easier selection in dropdowns
 */
const allMeters = [
  ...meterData.electricity,
  ...meterData.water,
  ...meterData.heating
];

/**
 * Export Component
 * 
 * Provides an interface for users to export various types of data:
 * - Utility Reports (Electricity, Water, Heating)
 * - Meter Reports (Readings, Performance)
 * 
 * The component manages export settings including date range selection, 
 * file format options, and meter selection (conditionally shown).
 */
const Export = () => {
  // State hooks for export settings
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedMeter, setSelectedMeter] = useState<string>("all");
  const [fileFormat, setFileFormat] = useState<string>("json");
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("utilities");
  const { toast } = useToast();

  /**
   * Returns the appropriate icon component based on selected file format
   */
  const getFormatIcon = () => {
    switch (fileFormat) {
      case "json": return <FileJson className="h-5 w-5" />;
      case "xml": return <FileText className="h-5 w-5" />;
      case "csv": return <FilePlus2 className="h-5 w-5" />;
      default: return null;
    }
  };
  
  /**
   * Returns file extension for the selected format
   */
  const getFileExtension = () => {
    return `.${fileFormat}`;
  };

  /**
   * Handles the export action for a specific data type
   * @param {string} type - The type of data being exported (e.g., "Electricity", "Water")
   */
  const handleExport = (type: string) => {
    // Validate that both start and end dates are selected before proceeding
    if (!startDate || !endDate) {
      toast({
        title: "Date range required",
        description: "Please select both start and end dates",
        variant: "destructive"
      });
      return;
    }
    
    // Set exporting state to show loading indicator
    setExporting(true);
    
    // Simulate export process with timeout
    setTimeout(() => {
      setExporting(false);
      toast({
        title: "Export successful",
        description: `${type} data exported as ${fileFormat.toUpperCase()} successfully`
      });
    }, 1500);
  };

  /**
   * Helper function to get the appropriate icon based on meter type
   * @param {string} type - The type of meter (electricity, water, heating)
   * @returns React component representing the icon
   */
  const getMeterIcon = (type: string) => {
    switch (type) {
      case "electricity": return <Zap className="h-4 w-4 text-yellow-500" />;
      case "water": return <Droplet className="h-4 w-4 text-blue-500" />;
      case "heating": return <Thermometer className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Page header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
        <p className="text-muted-foreground">
          Generate and download reports from your data
        </p>
      </div>

      {/* Export Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>
            Configure your export parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date Selector */}
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date Selector */}
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Meter Selector - Only visible/enabled for meter reports */}
            <div>
              <label className="text-sm font-medium">Meter</label>
              {activeTab === "meters" ? (
                <Select value={selectedMeter} onValueChange={setSelectedMeter}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select meter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Meters</SelectItem>
                    {/* Map through individual meters from our shared meter data */}
                    {allMeters.map((meter) => (
                      <SelectItem key={meter.id} value={meter.id.toString()}>
                        <div className="flex items-center gap-2">
                          {getMeterIcon(meter.type)}
                          <span>{meter.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mt-1">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal opacity-50 cursor-not-allowed"
                          disabled
                        >
                          <span className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Not applicable
                          </span>
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Meter selection is available in Meter Reports only</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* File Format Selector */}
            <div>
              <label className="text-sm font-medium">File Format</label>
              <Select value={fileFormat} onValueChange={setFileFormat}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">
                    <div className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      <span>JSON (.json)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="xml">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>XML (.xml)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FilePlus2 className="h-4 w-4" />
                      <span>CSV (.csv)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* File format info box */}
          {fileFormat && (
            <div className="mt-4 bg-muted/50 p-3 rounded-md flex items-center gap-2">
              {getFormatIcon()}
              <div className="text-sm">
                Selected output format: <span className="font-medium">{fileFormat.toUpperCase()}</span>
                <p className="text-xs text-muted-foreground">Files will be downloaded with {getFileExtension()} extension</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Options Tabs */}
      <Tabs 
        defaultValue="utilities" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="utilities" className="flex items-center gap-1">
            <Calculator className="h-4 w-4" /> Utility Reports
          </TabsTrigger>
          <TabsTrigger value="meters" className="flex items-center gap-1">
            <Gauge className="h-4 w-4" /> Meter Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Utility Reports Tab Content */}
        <TabsContent value="utilities" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Electricity Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-electricity" /> Electricity Report
                </CardTitle>
                <CardDescription>
                  Export electricity consumption data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Includes daily and monthly usage statistics, peak consumption periods, and cost breakdowns.
                </p>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium mr-2">Format:</span>
                  <span className="flex items-center gap-1">
                    {getFormatIcon()}
                    {fileFormat.toUpperCase()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-electricity"
                  onClick={() => handleExport("Electricity")}
                  disabled={exporting}
                >
                  {exporting ? "Exporting..." : "Export"}
                </Button>
              </CardFooter>
            </Card>

            {/* Water Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="text-water" /> Water Report
                </CardTitle>
                <CardDescription>
                  Export water consumption data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Includes daily and monthly usage statistics, consumption trends, and cost breakdowns.
                </p>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium mr-2">Format:</span>
                  <span className="flex items-center gap-1">
                    {getFormatIcon()}
                    {fileFormat.toUpperCase()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-water"
                  onClick={() => handleExport("Water")}
                  disabled={exporting}
                >
                  {exporting ? "Exporting..." : "Export"}
                </Button>
              </CardFooter>
            </Card>

            {/* Heating Report Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="text-heating" /> Heating Report
                </CardTitle>
                <CardDescription>
                  Export heating consumption data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Includes daily and monthly usage statistics, seasonal trends, and cost breakdowns.
                </p>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium mr-2">Format:</span>
                  <span className="flex items-center gap-1">
                    {getFormatIcon()}
                    {fileFormat.toUpperCase()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-heating"
                  onClick={() => handleExport("Heating")}
                  disabled={exporting}
                >
                  {exporting ? "Exporting..." : "Export"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Combined Utilities Report Card */}
          <Card>
            <CardHeader>
              <CardTitle>Combined Utilities Report</CardTitle>
              <CardDescription>
                Export comprehensive data for all utilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This report combines electricity, water, and heating data in a single export file.
                Useful for overall building performance analysis and cost management.
              </p>
              <div className="mt-3 flex items-center text-xs text-muted-foreground">
                <span className="font-medium mr-2">Format:</span>
                <span className="flex items-center gap-1">
                  {getFormatIcon()}
                  {fileFormat.toUpperCase()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleExport("Combined Utilities")}
                disabled={exporting}
              >
                {exporting ? "Exporting..." : "Export Combined Report"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Meter Reports Tab Content */}
        <TabsContent value="meters" className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meter Readings Card */}
            <Card>
              <CardHeader>
                <CardTitle>Meter Readings</CardTitle>
                <CardDescription>
                  Export all meter reading data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Includes all meter readings for the selected period, with meter IDs, timestamps, and values.
                </p>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium mr-2">Format:</span>
                  <span className="flex items-center gap-1">
                    {getFormatIcon()}
                    {fileFormat.toUpperCase()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleExport("Meter Readings")}
                  disabled={exporting}
                >
                  {exporting ? "Exporting..." : "Export Readings"}
                </Button>
              </CardFooter>
            </Card>

            {/* Meter Performance Card */}
            <Card>
              <CardHeader>
                <CardTitle>Meter Performance</CardTitle>
                <CardDescription>
                  Export meter performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Includes meter reliability metrics, calibration status, and maintenance history.
                </p>
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <span className="font-medium mr-2">Format:</span>
                  <span className="flex items-center gap-1">
                    {getFormatIcon()}
                    {fileFormat.toUpperCase()}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleExport("Meter Performance")}
                  disabled={exporting}
                >
                  {exporting ? "Exporting..." : "Export Performance"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Export;
