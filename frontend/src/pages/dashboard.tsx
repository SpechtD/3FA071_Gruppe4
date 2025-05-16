
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '@/hooks/useCustomers';
import { useReadings } from '@/hooks/useReadings';
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { format, subDays } from "date-fns";

/**
 * Dashboard Page Component
 * 
 * Displays an overview of customer and reading data with summary metrics
 * and quick links to manage data
 */
const Dashboard = () => {
  const navigate = useNavigate();
  
  // Set default date range to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  // Get customers and readings data
  const { customers, isLoading: customersLoading } = useCustomers();
  const { useFilteredReadings } = useReadings();
  const { data: readings = [], isLoading: readingsLoading } = useFilteredReadings({
    start: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    end: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
  });

  // Calculate summary metrics
  const customerCount = customers.length;
  const readingCount = readings.length;
  
  // Count meter types
  const meterTypeCounts = readings.reduce((acc, reading) => {
    acc[reading.kindOfMeter] = (acc[reading.kindOfMeter] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate recent activity
  const recentReadings = [...readings]
    .sort((a, b) => b.dateOfReading.getTime() - a.dateOfReading.getTime())
    .slice(0, 5);

  // Calculate average readings per customer
  const readingsPerCustomer = customerCount > 0 
    ? (readingCount / customerCount).toFixed(1) 
    : 0;

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your utility management system
        </p>
      </div>

      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Date Range:</span>
        </div>
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customersLoading ? 
                <div className="h-8 w-16 rounded-md bg-muted animate-pulse" /> : 
                customerCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active customer accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readingsLoading ? 
                <div className="h-8 w-16 rounded-md bg-muted animate-pulse" /> : 
                readingCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For the selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Readings per Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customersLoading || readingsLoading ?
                <div className="h-8 w-16 rounded-md bg-muted animate-pulse" /> :
                readingsPerCustomer}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average readings per customer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Common Meter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {readingsLoading ? 
                <div className="h-8 w-24 rounded-md bg-muted animate-pulse" /> : 
                getMostCommonMeterType(meterTypeCounts)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {readingsLoading ? "Loading..." : 
                `${getMostCommonMeterTypeCount(meterTypeCounts)} readings`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data tabs and quick actions */}
      <div className="grid gap-4 md:grid-cols-7">
        <Tabs defaultValue="customers" className="col-span-7 md:col-span-4 lg:col-span-5">
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="readings">Readings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="border rounded-md p-4 mt-2">
            <h3 className="text-lg font-medium mb-4">Recent Customers</h3>
            {customersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : customers.length > 0 ? (
              <div className="space-y-2">
                {customers.slice(0, 5).map((customer) => (
                  <div key={customer.uuid} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                    <div>
                      <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                      <p className="text-xs text-muted-foreground">{customer.gender}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/customers')}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No customers found.</p>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/customers')}>
                View All Customers
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="readings" className="border rounded-md p-4 mt-2">
            <h3 className="text-lg font-medium mb-4">Recent Readings</h3>
            {readingsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
                ))}
              </div>
            ) : recentReadings.length > 0 ? (
              <div className="space-y-2">
                {recentReadings.map((reading) => (
                  <div key={reading.uuid} className="flex justify-between items-center p-2 hover:bg-muted rounded-md">
                    <div>
                      <p className="font-medium">
                        {reading.customer 
                          ? `${reading.customer.firstName} ${reading.customer.lastName}`
                          : "No customer"}
                      </p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{getMeterTypeName(reading.kindOfMeter)}</span>
                        <span>•</span>
                        <span>{reading.dateOfReading.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/meters')}>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No readings found.</p>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => navigate('/meters')}>
                View All Readings
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick actions card */}
        <Card className="col-span-7 md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/customers')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Add Customer
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/meters')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
              </svg>
              New Reading
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/export')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Data
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/import')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Import Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

/**
 * Get friendly name for meter type
 */
const getMeterTypeName = (type: string): string => {
  switch (type) {
    case 'HEIZUNG': return 'Heating';
    case 'STROM': return 'Electricity';
    case 'WASSER': return 'Water';
    default: return 'Unknown';
  }
};

/**
 * Get the most common meter type from counts
 */
const getMostCommonMeterType = (counts: Record<string, number>): string => {
  if (Object.keys(counts).length === 0) return "None";
  
  const mostCommonType = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0][0];
    
  return getMeterTypeName(mostCommonType);
};

/**
 * Get the count of the most common meter type
 */
const getMostCommonMeterTypeCount = (counts: Record<string, number>): number => {
  if (Object.keys(counts).length === 0) return 0;
  
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])[0][1];
};

export default Dashboard;
