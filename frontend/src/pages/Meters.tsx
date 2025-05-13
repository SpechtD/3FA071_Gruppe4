
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Zap, Droplet, Thermometer, Search, Filter } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Mock data for meters
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

// Get unit by meter type
const getMeterUnit = (meterType: string) => {
  switch (meterType) {
    case "electricity":
      return "kWh";
    case "water":
      return "m³";
    case "heating":
      return "kWh";
    default:
      return "";
  }
};

// Get icon by meter type
const getMeterIcon = (meterType: string) => {
  switch (meterType) {
    case "electricity":
      return <Zap className="text-yellow-500" size={16} />;
    case "water":
      return <Droplet className="text-blue-500" size={16} />;
    case "heating":
      return <Thermometer className="text-red-500" size={16} />;
    default:
      return null;
  }
};

const Meters = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "electricity", "water", "heating"
  ]); // Default to all types selected

  // Get all meters in a flat array for unified view
  const allMeters = useMemo(() => {
    const meters = [
      ...meterData.electricity,
      ...meterData.water,
      ...meterData.heating
    ];
    return meters;
  }, []);
  
  // Calculate totals for each meter type
  const totals = useMemo(() => ({
    electricity: meterData.electricity.reduce((sum, meter) => sum + meter.reading, 0),
    water: meterData.water.reduce((sum, meter) => sum + meter.reading, 0),
    heating: meterData.heating.reduce((sum, meter) => sum + meter.reading, 0),
  }), []);

  // Filter meters based on search term and selected types
  const filteredMeters = useMemo(() => {
    return allMeters.filter(meter => {
      // Filter by selected types
      if (!selectedTypes.includes(meter.type)) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !meter.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [allMeters, searchTerm, selectedTypes]);

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Utility Meters</h1>
        <p className="text-muted-foreground">
          Manage and monitor all utility meters across buildings
        </p>
      </div>

      {/* Unified search and filter bar */}
      <Card className="border-dashed">
        <CardContent className="p-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all meters by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          
          {/* Type filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Filter by type:</span>
            </div>
            <ToggleGroup type="multiple" value={selectedTypes} onValueChange={(value) => {
              // Prevent deselecting all options
              if (value.length > 0) {
                setSelectedTypes(value);
              }
            }} className="justify-start">
              <ToggleGroupItem value="electricity" aria-label="Toggle electricity" className="gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="hidden sm:inline">Electricity</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="water" aria-label="Toggle water" className="gap-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span className="hidden sm:inline">Water</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="heating" aria-label="Toggle heating" className="gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="hidden sm:inline">Heating</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Only show the summary cards for the selected types */}
        {selectedTypes.includes("electricity") && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Electricity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.electricity.toLocaleString()} kWh</div>
              <p className="text-xs text-muted-foreground">
                {meterData.electricity.length} meters
              </p>
            </CardContent>
          </Card>
        )}
        
        {selectedTypes.includes("water") && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Droplet className="text-blue-500" />
                Water
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.water.toLocaleString()} m³</div>
              <p className="text-xs text-muted-foreground">
                {meterData.water.length} meters
              </p>
            </CardContent>
          </Card>
        )}
        
        {selectedTypes.includes("heating") && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="text-red-500" />
                Heating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totals.heating.toLocaleString()} kWh</div>
              <p className="text-xs text-muted-foreground">
                {meterData.heating.length} meters
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Unified meters list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeters.length > 0 ? (
          filteredMeters.map((meter) => (
            <Card key={meter.id}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  {getMeterIcon(meter.type)}
                  <CardTitle className="text-lg">{meter.name}</CardTitle>
                </div>
                <span className="text-xs text-muted-foreground uppercase">{meter.type}</span>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Reading:</span>
                  <span className="font-mono font-medium text-lg">
                    {meter.reading.toLocaleString()} {getMeterUnit(meter.type)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span>{meter.lastUpdated}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="text-xs">Update Reading</Button>
                <Button variant="ghost" size="sm" className="text-xs">View History</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No meters found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => {
                setSearchTerm("");
                setSelectedTypes(["electricity", "water", "heating"]);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meters;
