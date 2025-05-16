
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface BuildingData {
  id: string;
  name: string;
  units: number;
  occupancyRate: number;
  electricityUsage: number;
  waterUsage: number;
  heatingUsage: number;
}

interface BuildingOverviewProps {
  buildings: BuildingData[];
}

const BuildingOverview: React.FC<BuildingOverviewProps> = ({ buildings }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {buildings.map((building) => (
        <Card key={building.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{building.name}</CardTitle>
            <CardDescription>
              {building.units} units | {building.occupancyRate}% occupied
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Electricity</span>
                <span className="font-medium">{building.electricityUsage} kWh</span>
              </div>
              <Progress 
                value={Math.min(building.electricityUsage / 10, 100)} 
                className="h-2 bg-electricity-light" 
              />

              <div className="flex justify-between text-sm">
                <span>Water</span>
                <span className="font-medium">{building.waterUsage} m³</span>
              </div>
              <Progress 
                value={Math.min(building.waterUsage / 3, 100)} 
                className="h-2 bg-water-light" 
              />

              <div className="flex justify-between text-sm">
                <span>Heating</span>
                <span className="font-medium">{building.heatingUsage} kWh</span>
              </div>
              <Progress 
                value={Math.min(building.heatingUsage / 15, 100)} 
                className="h-2 bg-heating-light" 
              />
            </div>
          </CardContent>
          <CardFooter className="pt-1">
            <a href={`/buildings/${building.id}`} className="text-sm text-primary hover:underline">
              View details
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BuildingOverview;
