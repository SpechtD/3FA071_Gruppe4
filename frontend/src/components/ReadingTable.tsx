
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Pagination, PaginationContent, PaginationItem, PaginationLink, 
  PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Reading } from '@/adapters/reading.adapter';

/**
 * Props for ReadingTable component
 */
interface ReadingTableProps {
  readings: Reading[];
  onEdit: (reading: Reading) => void;
  onDelete: (reading: Reading) => void;
  isLoading: boolean;
}

/**
 * Utility function to get friendly name for meter type
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
 * Utility function to get appropriate badge color for meter type
 */
const getMeterTypeBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (type) {
    case 'HEIZUNG': return 'default';
    case 'STROM': return 'secondary';
    case 'WASSER': return 'outline';
    default: return 'default';
  }
};

/**
 * ReadingTable Component
 * 
 * Displays meter reading data in a paginated table with edit/delete actions
 */
const ReadingTable: React.FC<ReadingTableProps> = ({ 
  readings, 
  onEdit, 
  onDelete,
  isLoading 
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination details
  const totalPages = Math.ceil(readings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReadings = readings.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Calculate range of pages to display
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if end range is maxed out
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Generate page links
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="space-y-4">
      {/* Reading table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Meter Type</TableHead>
              <TableHead>Meter ID</TableHead>
              <TableHead>Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReadings.length > 0 ? (
              paginatedReadings.map((reading) => (
                <TableRow key={reading.uuid}>
                  <TableCell>{reading.dateOfReading.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {reading.customer ? (
                      `${reading.customer.firstName} ${reading.customer.lastName}`
                    ) : (
                      <span className="text-muted-foreground italic">No customer</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getMeterTypeBadgeVariant(reading.kindOfMeter)}>
                      {getMeterTypeName(reading.kindOfMeter)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{reading.meterId}</span>
                  </TableCell>
                  <TableCell>{reading.meterCount}</TableCell>
                  <TableCell>
                    {reading.substitute ? (
                      <Badge variant="outline">Substitute</Badge>
                    ) : (
                      <Badge variant="default">Regular</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(reading)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(reading)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  ) : (
                    "No readings found."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage - 1);
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(currentPage + 1);
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ReadingTable;
