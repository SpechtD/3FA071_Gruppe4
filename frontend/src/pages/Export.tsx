
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download, File, FileText } from "lucide-react"; // Fixed imports - removed FileJson and FileCsv
import { toast } from "sonner";
import { useCustomers } from "@/hooks/useCustomers";
import { useReadings } from "@/hooks/useReadings";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { adaptCustomerToAPI } from "@/adapters/customer.adapter";
import { adaptReadingToAPI } from "@/adapters/reading.adapter";

/**
 * Export Page Component
 * 
 * Provides functionality to export customer and reading data in various formats (CSV, JSON, XML)
 * Allows filtering by date range and meter type for readings
 */
const ExportPage = () => {
  // State for tracking export options
  const [dataType, setDataType] = useState<string | undefined>(undefined);
  const [meterType, setMeterType] = useState<string | undefined>(undefined);
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  // Fetch data using hooks
  const { customers } = useCustomers();
  const { useFilteredReadings } = useReadings();
  
  // Get readings with optional filters
  const { data: readings = [] } = useFilteredReadings({
    kindOfMeter: meterType,
    start: date?.from ? date.from.toISOString().split('T')[0] : undefined,
    end: date?.to ? date.to.toISOString().split('T')[0] : undefined
  });

  /**
   * Generate CSV content from data array
   * @param data Array of objects to convert to CSV
   * @returns CSV formatted string
   */
  const generateCSV = (data: any[]): string => {
    if (data.length === 0) return '';
    
    // Extract headers from first item
    const headers = Object.keys(data[0]);
    
    // Build CSV header row
    let csv = headers.join(',') + '\n';
    
    // Build data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header];
        
        // Handle different types of values
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'object') {
          if (value instanceof Date) {
            return value.toISOString().split('T')[0];
          } else {
            // Return stringified version wrapped in quotes
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
        }
        
        // Convert to string and handle commas
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',');
      
      csv += row + '\n';
    });
    
    return csv;
  };

  /**
   * Generate XML data from object array
   * @param data Array of objects to convert to XML
   * @param rootElement Name of the root XML element
   * @param itemElement Name of each item element
   * @returns XML formatted string
   */
  const generateXML = (data: any[], rootElement: string, itemElement: string): string => {
    if (data.length === 0) return `<?xml version="1.0" encoding="UTF-8"?><${rootElement}></${rootElement}>`;
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n`;
    
    data.forEach(item => {
      xml += `  <${itemElement}>\n`;
      
      // Process each property
      Object.entries(item).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          xml += `    <${key}></${key}>\n`;
        } else if (typeof value === 'object') {
          if (value instanceof Date) {
            xml += `    <${key}>${value.toISOString().split('T')[0]}</${key}>\n`;
          } else {
            // For nested objects, stringify them (simplification)
            xml += `    <${key}>${JSON.stringify(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>\n`;
          }
        } else {
          // Escape XML special characters
          const stringValue = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          xml += `    <${key}>${stringValue}</${key}>\n`;
        }
      });
      
      xml += `  </${itemElement}>\n`;
    });
    
    xml += `</${rootElement}>`;
    
    return xml;
  };

  /**
   * Handle export data based on selected options
   * Creates and downloads the export file
   */
  const handleExport = () => {
    try {
      let exportData: any[] = [];
      let filename = '';
      let rootElement = '';
      let itemElement = '';
      
      // Prepare data based on selection
      if (dataType === 'customers') {
        exportData = customers.map(customer => adaptCustomerToAPI(customer));
        filename = 'customers';
        rootElement = 'customers';
        itemElement = 'customer';
      } else if (dataType === 'readings') {
        exportData = readings.map(reading => adaptReadingToAPI(reading));
        filename = 'readings';
        rootElement = 'readings';
        itemElement = 'reading';
        
        // If meter type is specified, add to filename
        if (meterType) {
          filename += `_${meterType}`;
        }
      } else {
        toast.error("Please select a data type to export");
        return;
      }
      
      // Add date range to filename if available
      if (date?.from) {
        const dateStr = date.from.toISOString().split('T')[0];
        filename += `_${dateStr}`;
        
        if (date.to) {
          const toStr = date.to.toISOString().split('T')[0];
          filename += `_to_${toStr}`;
        }
      }
      
      let content: string;
      let mimeType: string;
      
      // Generate content based on format
      if (exportFormat === 'csv') {
        content = generateCSV(exportData);
        mimeType = 'text/csv';
        filename += '.csv';
      } else if (exportFormat === 'json') {
        content = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
        filename += '.json';
      } else if (exportFormat === 'xml') {
        content = generateXML(exportData, rootElement, itemElement);
        mimeType = 'text/xml';
        filename += '.xml';
      } else {
        toast.error("Unsupported export format");
        return;
      }
      
      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success(`Successfully exported ${exportData.length} records`);
      
    } catch (error: any) {
      toast.error(`Export failed: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
        <p className="text-muted-foreground">
          Download your utility data in various formats
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Configure your export parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="data-type">Data Type</Label>
            <Select 
              value={dataType} 
              onValueChange={setDataType}
            >
              <SelectTrigger id="data-type">
                <SelectValue placeholder="Select data to export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customers">Customers</SelectItem>
                <SelectItem value="readings">Meter Readings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Meter Type Selection - Only shown when readings selected */}
          {dataType === 'readings' && (
            <div className="space-y-2">
              <Label htmlFor="meter-type">Meter Type (Optional)</Label>
              <Select 
                value={meterType} 
                onValueChange={setMeterType}
              >
                <SelectTrigger id="meter-type">
                  <SelectValue placeholder="All meter types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HEIZUNG">Heating</SelectItem>
                  <SelectItem value="STROM">Electricity</SelectItem>
                  <SelectItem value="WASSER">Water</SelectItem>
                  <SelectItem value="UNBEKANNT">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Date Range Selection */}
          <div className="space-y-2">
            <Label>Date Range (Optional)</Label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>

          {/* Export Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="export-format">Export Format</Label>
            <div className="flex space-x-2 py-2">
              <Button 
                variant={exportFormat === 'csv' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setExportFormat('csv')}
              >
                <File className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button 
                variant={exportFormat === 'json' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setExportFormat('json')}
              >
                <File className="mr-2 h-4 w-4" /> JSON
              </Button>
              <Button 
                variant={exportFormat === 'xml' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setExportFormat('xml')}
              >
                <FileText className="mr-2 h-4 w-4" /> XML
              </Button>
            </div>
          </div>

          {/* Export Button */}
          <Button 
            className="w-full" 
            onClick={handleExport}
            disabled={!dataType}
          >
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </CardContent>
      </Card>

      {/* Export Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Export Templates</CardTitle>
          <CardDescription>
            Quick access to commonly used export configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => {
              setDataType('customers');
              setExportFormat('csv');
              toast.success("Template applied: All Customers");
            }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <File className="mr-2 h-4 w-4" /> All Customers (CSV)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Export all customer data in CSV format.
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => {
              setDataType('readings');
              setMeterType('STROM');
              setExportFormat('json');
              toast.success("Template applied: Electricity Readings");
            }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <File className="mr-2 h-4 w-4" /> Electricity Readings (JSON)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Export all electricity meter readings in JSON format.
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:bg-muted/50" onClick={() => {
              setDataType('readings');
              setExportFormat('xml');
              toast.success("Template applied: All Readings (XML)");
            }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-4 w-4" /> All Readings (XML)
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Export all meter readings in XML format.
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportPage;
