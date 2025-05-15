
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConsumptionChart from "@/components/ConsumptionChart";

const Index = () => {
  // Mock data for our charts
  const electricityData = [
    { date: "Jan", value: 4000 },
    { date: "Feb", value: 3800 },
    { date: "Mar", value: 4200 },
    { date: "Apr", value: 3700 },
    { date: "May", value: 3900 },
    { date: "Jun", value: 4100 },
    { date: "Jul", value: 4800 },
    { date: "Aug", value: 5200 },
    { date: "Sep", value: 4600 },
    { date: "Oct", value: 4300 },
    { date: "Nov", value: 4400 },
    { date: "Dec", value: 4700 },
  ];

  const waterData = [
    { date: "Jan", value: 1200 },
    { date: "Feb", value: 1100 },
    { date: "Mar", value: 1300 },
    { date: "Apr", value: 1250 },
    { date: "May", value: 1400 },
    { date: "Jun", value: 1600 },
    { date: "Jul", value: 1900 },
    { date: "Aug", value: 2000 },
    { date: "Sep", value: 1800 },
    { date: "Oct", value: 1600 },
    { date: "Nov", value: 1400 },
    { date: "Dec", value: 1300 },
  ];

  const heatingData = [
    { date: "Jan", value: 9000 },
    { date: "Feb", value: 8500 },
    { date: "Mar", value: 7200 },
    { date: "Apr", value: 5000 },
    { date: "May", value: 2500 },
    { date: "Jun", value: 1000 },
    { date: "Jul", value: 800 },
    { date: "Aug", value: 900 },
    { date: "Sep", value: 2000 },
    { date: "Oct", value: 4500 },
    { date: "Nov", value: 7000 },
    { date: "Dec", value: 8800 },
  ];

  // Mock meter data
  const meterData = {
    electricity: [
      { id: 1, name: "M-EL-001", reading: 45720 },
      { id: 2, name: "M-EL-002", reading: 32150 },
      { id: 3, name: "M-EL-003", reading: 27860 },
      { id: 4, name: "M-EL-004", reading: 18940 },
    ],
    water: [
      { id: 5, name: "M-WA-001", reading: 3250 },
      { id: 6, name: "M-WA-002", reading: 2840 },
      { id: 7, name: "M-WA-003", reading: 1950 },
      { id: 8, name: "M-WA-004", reading: 2210 },
    ],
    heating: [
      { id: 9, name: "M-HE-001", reading: 15230 },
      { id: 10, name: "M-HE-002", reading: 12780 },
      { id: 11, name: "M-HE-003", reading: 9540 },
      { id: 12, name: "M-HE-004", reading: 11320 },
    ],
  };

  const overallStats = {
    totalMeters: Object.values(meterData).reduce((acc, arr) => acc + arr.length, 0),
    totalElectricity: meterData.electricity.reduce((acc, meter) => acc + meter.reading, 0),
    totalWater: meterData.water.reduce((acc, meter) => acc + meter.reading, 0),
    totalHeating: meterData.heating.reduce((acc, meter) => acc + meter.reading, 0)
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Dashboard header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all utility meters and their consumption
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Meters</CardTitle>
            <CardDescription>Across all utilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{overallStats.totalMeters}</div>
            <p className="text-xs text-muted-foreground">
              All meters are active and functioning
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Usage</CardTitle>
            <CardDescription>Monthly consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Electricity:</span>
                <span className="font-medium">{overallStats.totalElectricity.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Water:</span>
                <span className="font-medium">{overallStats.totalWater.toLocaleString()} m³</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Heating:</span>
                <span className="font-medium">{overallStats.totalHeating.toLocaleString()} kWh</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last Updated</CardTitle>
            <CardDescription>Utility readings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">May 12, 2025</div>
            <p className="text-xs text-muted-foreground">
              All systems up to date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consumption Trends section - moved out of tabs as requested */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Consumption Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Electricity consumption chart */}
          <ConsumptionChart
            title="Electricity Usage"
            description="Monthly consumption in kWh"
            data={electricityData}
            color={{ main: "#F59E0B", light: "#FDE68A" }}
            unit="kWh"
          />
          {/* Water consumption chart */}
          <ConsumptionChart
            title="Water Usage"
            description="Monthly consumption in m³"
            data={waterData}
            color={{ main: "#0EA5E9", light: "#BAE6FD" }}
            unit="m³"
          />
          {/* Heating consumption chart */}
          <ConsumptionChart
            title="Heating Usage"
            description="Monthly consumption in kWh"
            data={heatingData}
            color={{ main: "#EF4444", light: "#FCA5A5" }}
            unit="kWh"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
