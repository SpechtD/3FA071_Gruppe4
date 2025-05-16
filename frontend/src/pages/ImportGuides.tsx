
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileType2, FileUp, CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ImportGuides = () => {
  // Guide sections for different data types
  const guides = [
    {
      title: "Customer Data Format",
      description: "How to format customer data for import",
      icon: FileType2,
      content: [
        "File must be in CSV format with UTF-8 encoding",
        "Required columns: firstName, lastName, birthDate, gender",
        "birthDate format should be YYYY-MM-DD",
        "gender values should be: MALE, FEMALE, or OTHER",
        "First row should contain column headers"
      ]
    },
    {
      title: "Meter Data Format",
      description: "How to format meter readings for import",
      icon: FileUp,
      content: [
        "File must be in CSV format with UTF-8 encoding",
        "Required columns: meterId, kindOfMeter, dateOfReading, meterCount",
        "kindOfMeter values: ELECTRICITY, WATER, HEATING",
        "dateOfReading format should be YYYY-MM-DD",
        "meterCount should be a number with decimal point (if needed)",
        "First row should contain column headers"
      ]
    },
    {
      title: "Support",
      description: "Need more help? Contact support",
      icon: CircleHelp,
      content: [
        "For additional help, contact: support@aptmanager.com",
        "Our support team is available Monday-Friday, 9am-5pm"
      ]
    }
  ];

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex items-center gap-2">
        <Link to="/import">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Guides</h1>
          <p className="text-muted-foreground">
            Learn how to properly format your data for import
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((guide, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <guide.icon className="h-5 w-5 text-primary" />
                <CardTitle>{guide.title}</CardTitle>
              </div>
              <CardDescription>{guide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {guide.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="rounded-full w-1.5 h-1.5 bg-primary mt-2"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Example File Section */}
      <Card>
        <CardHeader>
          <CardTitle>Example Files</CardTitle>
          <CardDescription>Download example files to see the correct format</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button className="flex items-center gap-2">
            <FileType2 className="h-4 w-4" />
            Download Customer Example
          </Button>
          <Button className="flex items-center gap-2">
            <FileType2 className="h-4 w-4" />
            Download Meter Example
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportGuides;
