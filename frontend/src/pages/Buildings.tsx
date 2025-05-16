
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BuildingData {
  id: string;
  name: string;
  address: string;
  units: number;
  occupancyRate: number;
  constructionYear: number;
}

const Buildings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock building data
  const buildingsData: BuildingData[] = [
    {
      id: "b1",
      name: "Sunset Apartments",
      address: "123 Sunset Blvd, Los Angeles, CA",
      units: 24,
      occupancyRate: 92,
      constructionYear: 2010
    },
    {
      id: "b2",
      name: "Riverside Complex",
      address: "456 River Road, Chicago, IL",
      units: 36,
      occupancyRate: 88,
      constructionYear: 2015
    },
    {
      id: "b3",
      name: "Mountain View Residences",
      address: "789 Mountain Way, Denver, CO",
      units: 18,
      occupancyRate: 95,
      constructionYear: 2018
    },
    {
      id: "b4",
      name: "City Center Towers",
      address: "101 Main Street, New York, NY",
      units: 42,
      occupancyRate: 86,
      constructionYear: 2012
    }
  ];

  const filteredBuildings = buildingsData.filter(building => 
    building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    building.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewBuilding = (buildingId: string) => {
    toast({
      title: "Building Selected",
      description: `Viewing details for building ${buildingId}`
    });
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buildings</h1>
        <p className="text-muted-foreground">
          Manage your property portfolio
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative max-w-sm">
          <Input
            type="text"
            placeholder="Search buildings..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button>Add New Building</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBuildings.map(building => (
          <Card key={building.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{building.name}</CardTitle>
                  <CardDescription>{building.address}</CardDescription>
                </div>
                <Badge variant={building.occupancyRate > 90 ? "default" : "secondary"}>
                  {building.occupancyRate}% Occupied
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium">Total Units</p>
                  <p className="text-2xl font-bold">{building.units}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Year Built</p>
                  <p className="text-2xl font-bold">{building.constructionYear}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Manage Units</Button>
              <Button onClick={() => handleViewBuilding(building.id)}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No buildings found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new building
          </p>
        </div>
      )}
    </div>
  );
};

export default Buildings;
