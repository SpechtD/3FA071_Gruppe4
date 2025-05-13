
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Upload, FileQuestion } from "lucide-react";

const Import = () => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card for importing customer data */}
        <Card>
          <CardHeader>
            <CardTitle>Import Customer Data</CardTitle>
            <CardDescription>Upload a CSV file with customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-center text-gray-500 mb-4">
                  <p>Drag and drop your customer data file here</p>
                  <p>or click to browse files</p>
                </div>
                <Input
                  id="customer-file"
                  type="file"
                  accept=".csv"
                  className="hidden"
                />
                <label htmlFor="customer-file">
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                </label>
              </div>
              <Button className="w-full">Upload Customer Data</Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Card for importing meter data */}
        <Card>
          <CardHeader>
            <CardTitle>Import Meter Readings</CardTitle>
            <CardDescription>Upload a CSV file with meter readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-center text-gray-500 mb-4">
                  <p>Drag and drop your meter readings file here</p>
                  <p>or click to browse files</p>
                </div>
                <Input
                  id="readings-file"
                  type="file"
                  accept=".csv"
                  className="hidden"
                />
                <label htmlFor="readings-file">
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                </label>
              </div>
              <Button className="w-full">Upload Meter Readings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent data imports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No import history available yet.</p>
            <p>Upload files to see your import history here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Import;
