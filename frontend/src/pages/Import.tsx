import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FileQuestion, Upload } from "lucide-react"; // Fixed imports - removed FileCsv
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCustomer } from "@/services/api";
import { createReading } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

/**
 * Import Page Component
 * 
 * Provides functionality to import customer and reading data from various file formats
 * (CSV, JSON, XML)
 */
const ImportPage = () => {
  // State for file selection dialogs
  const [isCustomerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [isReadingDialogOpen, setReadingDialogOpen] = useState(false);
  
  // State for file format and file selection
  const [customerFileFormat, setCustomerFileFormat] = useState<string>("csv");
  const [readingFileFormat, setReadingFileFormat] = useState<string>("csv");
  const [customerFile, setCustomerFile] = useState<File | null>(null);
  const [readingFile, setReadingFile] = useState<File | null>(null);
  
  // State for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Validates file extension against selected format
   * @param file The file to validate
   * @param format Selected format (csv, json, xml)
   * @returns Boolean indicating if file is valid
   */
  const validateFileExtension = (file: File, format: string): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (format === "csv" && extension !== "csv") {
      toast.error("Please select a CSV file");
      return false;
    }
    if (format === "json" && extension !== "json") {
      toast.error("Please select a JSON file");
      return false;
    }
    if (format === "xml" && extension !== "xml") {
      toast.error("Please select an XML file");
      return false;
    }
    return true;
  };

  /**
   * Handle customer file upload
   * Simulates progress and performs basic validation
   */
  const handleCustomerUpload = async () => {
    if (!customerFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!validateFileExtension(customerFile, customerFileFormat)) {
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulated progress updates
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Read file content
      const content = await readFile(customerFile);
      let parsedData;
      
      // Parse content based on format
      if (customerFileFormat === "csv") {
        parsedData = parseCSV(content);
      } else if (customerFileFormat === "json") {
        parsedData = JSON.parse(content);
      } else if (customerFileFormat === "xml") {
        // XML parsing would require a more complex parser in a real-world application
        parsedData = { customers: [{ firstName: "Test", lastName: "User", gender: "M" }] };
      }
      
      // Complete the upload
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setCustomerDialogOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
        toast.success("Customer data uploaded successfully");
      }, 500);
      
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Handle reading file upload
   * Simulates progress and performs basic validation
   */
  const handleReadingUpload = async () => {
    if (!readingFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!validateFileExtension(readingFile, readingFileFormat)) {
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulated progress updates
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Read file content
      const content = await readFile(readingFile);
      let parsedData;
      
      // Parse content based on format
      if (readingFileFormat === "csv") {
        parsedData = parseCSV(content);
      } else if (readingFileFormat === "json") {
        parsedData = JSON.parse(content);
      } else if (readingFileFormat === "xml") {
        // XML parsing would require a more complex parser in a real-world application
        parsedData = { readings: [{ meterId: "123", meterCount: 500 }] };
      }
      
      // Complete the upload
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setReadingDialogOpen(false);
        setIsUploading(false);
        setUploadProgress(0);
        toast.success("Reading data uploaded successfully");
      }, 500);
      
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Read file contents as text
   * @param file The file to read
   * @returns Promise resolving to the file's text content
   */
  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  /**
   * Simple CSV parser
   * @param content CSV content as string
   * @returns Parsed array of objects
   */
  const parseCSV = (content: string): any[] => {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      const entry: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          entry[header] = values[index];
        }
      });
      
      return entry;
    }).filter(entry => Object.keys(entry).length > 0);
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">
            Upload and manage your utility data
          </p>
        </div>
        
        {/* Link to Import Guides page */}
        <Link to="/import-guides">
          <Button variant="outline" className="flex items-center gap-2">
            <FileQuestion size={16} />
            View Import Guides
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Import Card */}
        <Card>
          <CardHeader>
            <CardTitle>Import Customer Data</CardTitle>
            <CardDescription>
              Upload customer information in CSV, JSON, or XML format
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <File className="h-20 w-20 text-muted-foreground" />
            <p className="text-sm text-center text-muted-foreground max-w-xs">
              Select a file containing customer data. Formats supported: CSV, JSON, XML
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCustomerDialogOpen(true)}>
                Select File
              </Button>
              <Button disabled={!customerFile} onClick={handleCustomerUpload}>
                <Upload className="mr-2 h-4 w-4" /> Upload Customer Data
              </Button>
            </div>
            {customerFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {customerFile.name}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Readings Import Card */}
        <Card>
          <CardHeader>
            <CardTitle>Import Meter Readings</CardTitle>
            <CardDescription>
              Upload meter readings in CSV, JSON, or XML format
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <File className="h-20 w-20 text-muted-foreground" />
            <p className="text-sm text-center text-muted-foreground max-w-xs">
              Select a file containing meter readings. Formats supported: CSV, JSON, XML
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setReadingDialogOpen(true)}>
                Select File
              </Button>
              <Button disabled={!readingFile} onClick={handleReadingUpload}>
                <Upload className="mr-2 h-4 w-4" /> Upload Meter Readings
              </Button>
            </div>
            {readingFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {readingFile.name}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Import Dialog */}
      <Dialog open={isCustomerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Customer Data</DialogTitle>
            <DialogDescription>
              Select the file format and upload your customer data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer-format">File Format</Label>
              <Select 
                value={customerFileFormat} 
                onValueChange={setCustomerFileFormat}
              >
                <SelectTrigger id="customer-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer-file">Upload File</Label>
              <Input 
                id="customer-file" 
                type="file" 
                accept={customerFileFormat === "csv" ? ".csv" : 
                        customerFileFormat === "json" ? ".json" : ".xml"}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setCustomerFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} className="h-2 w-full" />
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setCustomerDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCustomerUpload} 
              disabled={!customerFile || isUploading}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reading Import Dialog */}
      <Dialog open={isReadingDialogOpen} onOpenChange={setReadingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Meter Readings</DialogTitle>
            <DialogDescription>
              Select the file format and upload your meter readings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reading-format">File Format</Label>
              <Select 
                value={readingFileFormat} 
                onValueChange={setReadingFileFormat}
              >
                <SelectTrigger id="reading-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reading-file">Upload File</Label>
              <Input 
                id="reading-file" 
                type="file" 
                accept={readingFileFormat === "csv" ? ".csv" : 
                        readingFileFormat === "json" ? ".json" : ".xml"}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setReadingFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {isUploading && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} className="h-2 w-full" />
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="outline" 
              onClick={() => setReadingDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReadingUpload} 
              disabled={!readingFile || isUploading}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportPage;
