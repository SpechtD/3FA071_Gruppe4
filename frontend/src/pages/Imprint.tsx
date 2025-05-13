
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Imprint Component
 * 
 * Displays legal information and contact details about the company.
 * This is a legal requirement in many European countries (especially Germany)
 * where websites must contain publisher information.
 */
const Imprint = () => {
  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Imprint</h1>
        <p className="text-muted-foreground">
          Legal information and contact details
        </p>
      </div>

      {/* Company Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Legal details about the company</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Company Name */}
          <div>
            <h3 className="font-medium">Gruppe 4</h3>
            <p className="text-sm text-muted-foreground">
              Sebastian Wirth <br />
              David Specht <br /> 
              Amelie Roduner <br />
              Michaela Kappelmeier
            </p>
          </div>
          
          {/* Physical Address */}
          <div>
            <h3 className="font-medium">Address</h3>
            <address className="not-italic text-sm text-muted-foreground">
              Walter-Sedlmayr-Platz 6<br />
              80995 Munich<br />  
              Germany
            </address>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-medium">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: davidspecht@protonmail.com
              phone: tbt
            </p>
          </div>
          
          {/* Responsible Person */}
          <div>
            <h3 className="font-medium">Responsible for Content</h3>
            <p className="text-sm text-muted-foreground">
              Sebastian Wirth<br />
              Managing Director
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Policy Card */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>Information about data processing</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our privacy policy explains how we collect, use, and protect your personal information.
            For details, please visit our privacy policy page or contact our data protection officer at privacy@aptmanager.com.
          </p>
        </CardContent>
      </Card>
      
      {/* Legal Disclaimer */}
      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Despite careful content control, we assume no liability for the content of external links.
            The operators of the linked pages are solely responsible for their content.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Imprint;
