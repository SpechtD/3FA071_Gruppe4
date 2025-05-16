
import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Filter, Loader2, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { useDebounce } from "@/hooks/useDebounce";
import { useReadings } from "@/hooks/useReadings";
import { Reading } from "@/adapters/reading.adapter";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReadingTable from "@/components/ReadingTable";
import ReadingDialog from "@/components/ReadingDialog";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "sonner";
import { useCustomers } from "@/hooks/useCustomers";

/**
 * Meters Page Component
 * 
 * Main page for meter reading management with CRUD operations
 * Features include:
 * - Searchable, paginated reading table
 * - Create, update, and delete functionality
 * - Filtering by date range, meter type, and customer
 */
const MetersPage = () => {
  // State for search, filters, dialog visibility and editing
  const [searchTerm, setSearchTerm] = useState("");
  const [meterTypeFilter, setMeterTypeFilter] = useState<string | undefined>(undefined);
  const [customerFilter, setCustomerFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState<Reading | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Debounced search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get customers for filters
  const { customers } = useCustomers();
  
  // Get readings with filters
  const { useFilteredReadings } = useReadings();
  const {
    data: readings = [],
    isLoading,
    refetch,
  } = useFilteredReadings({
    kindOfMeter: meterTypeFilter,
    customer: customerFilter,
    start: dateRange?.from ? dateRange.from.toISOString().split('T')[0] : undefined,
    end: dateRange?.to ? dateRange.to.toISOString().split('T')[0] : undefined,
  });
  
  // Get CRUD mutation functions
  const {
    createReading,
    updateReading,
    deleteReading,
    createReadingLoading,
    updateReadingLoading,
    deleteReadingLoading,
  } = useReadings();

  // Filter readings based on search term (client-side)
  const filteredReadings = React.useMemo(() => {
    return readings.filter((reading) => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      
      // Search in meter id, customer name, or UUID
      const meterIdMatch = reading.meterId.toLowerCase().includes(searchLower);
      const uuidMatch = reading.uuid.toLowerCase().includes(searchLower);
      
      // Search in customer name if customer exists
      const customerMatch = reading.customer
        ? `${reading.customer.firstName} ${reading.customer.lastName}`.toLowerCase().includes(searchLower)
        : false;
      
      return meterIdMatch || uuidMatch || customerMatch;
    });
  }, [readings, debouncedSearchTerm]);

  /**
   * Handle creating a new reading
   */
  const handleCreateReading = useCallback(async (data: any) => {
    try {
      // Check if creating with new customer
      if (data.createNewCustomer) {
        // Will create customer automatically in backend
        await createReading({
          meterId: data.meterId,
          dateOfReading: new Date(data.dateOfReading),
          meterCount: Number(data.meterCount),
          kindOfMeter: data.kindOfMeter,
          substitute: data.substitute,
          comment: data.comment || null,
          customer: {
            firstName: data.customerFirstName || '',
            lastName: data.customerLastName || '',
            birthDate: new Date(data.customerBirthDate || new Date()),
            gender: data.customerGender || 'MALE',
          }
        });
        
        toast.success("Reading created with a new customer");
      } else {
        // Use existing customer
        const selectedCustomer = customers.find(c => c.uuid === data.customerId);
        
        await createReading({
          meterId: data.meterId,
          dateOfReading: new Date(data.dateOfReading),
          meterCount: Number(data.meterCount),
          kindOfMeter: data.kindOfMeter,
          substitute: data.substitute,
          comment: data.comment || null,
          customer: selectedCustomer || null,
        });
        
        toast.success("Reading created successfully");
      }
      
      setIsCreateDialogOpen(false);
      refetch(); // Refresh data after creating
      
    } catch (error) {
      console.error("Failed to create reading:", error);
      toast.error("Failed to create reading");
    }
  }, [createReading, customers, refetch]);

  /**
   * Handle opening edit dialog for a reading
   */
  const handleEditReading = useCallback((reading: Reading) => {
    setSelectedReading(reading);
    setIsEditDialogOpen(true);
  }, []);

  /**
   * Handle saving edited reading
   */
  const handleSaveReading = useCallback(async (data: any) => {
    if (!selectedReading) return;
    
    try {
      const selectedCustomer = customers.find(c => c.uuid === data.customerId);
      
      await updateReading({
        uuid: selectedReading.uuid,
        meterId: data.meterId,
        dateOfReading: new Date(data.dateOfReading),
        meterCount: Number(data.meterCount),
        kindOfMeter: data.kindOfMeter,
        substitute: data.substitute,
        comment: data.comment || null,
        customer: selectedCustomer || null,
      });
      
      setIsEditDialogOpen(false);
      toast.success("Reading updated successfully");
      refetch(); // Refresh data after updating
      
    } catch (error) {
      console.error("Failed to update reading:", error);
      toast.error("Failed to update reading");
    }
  }, [updateReading, selectedReading, customers, refetch]);

  /**
   * Handle opening delete confirmation dialog
   */
  const handleDeleteClick = useCallback((reading: Reading) => {
    setSelectedReading(reading);
    setIsDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirming reading deletion
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedReading) return;
    
    try {
      await deleteReading(selectedReading.uuid);
      setIsDeleteDialogOpen(false);
      toast.success("Reading deleted successfully");
      refetch(); // Refresh data after deleting
      
    } catch (error) {
      console.error("Failed to delete reading:", error);
      toast.error("Failed to delete reading");
    }
  }, [deleteReading, selectedReading, refetch]);

  /**
   * Reset all filters
   */
  const clearFilters = () => {
    setMeterTypeFilter(undefined);
    setCustomerFilter(undefined);
    setDateRange(undefined);
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meter Readings</h1>
        <p className="text-muted-foreground">
          Manage meter readings across all utilities
        </p>
      </div>

      {/* Meter readings management card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Readings Management</CardTitle>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Reading
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search and filter controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Search bar with debounced input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by meter ID, customer..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filters popover */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  {(meterTypeFilter || customerFilter || dateRange) && (
                    <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Readings</h4>
                  
                  {/* Meter type filter */}
                  <div className="space-y-2">
                    <Label htmlFor="meter-type">Meter Type</Label>
                    <Select 
                      value={meterTypeFilter} 
                      onValueChange={setMeterTypeFilter}
                    >
                      <SelectTrigger id="meter-type">
                        <SelectValue placeholder="All meter types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HEIZUNG">Heating</SelectItem>
                        <SelectItem value="STROM">Electricity</SelectItem>
                        <SelectItem value="WASSER">Water</SelectItem>
                        <SelectItem value="UNBEKANNT">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Customer filter */}
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select 
                      value={customerFilter} 
                      onValueChange={setCustomerFilter}
                    >
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="All customers" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.uuid} value={customer.uuid}>
                            {customer.firstName} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Date range filter */}
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                  </div>
                  
                  {/* Filter actions */}
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active filters display */}
          {(meterTypeFilter || customerFilter || dateRange) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {meterTypeFilter && (
                <Badge onDelete={() => setMeterTypeFilter(undefined)}>
                  Type: {getMeterTypeName(meterTypeFilter)}
                </Badge>
              )}
              {customerFilter && (
                <Badge onDelete={() => setCustomerFilter(undefined)}>
                  Customer: {getCustomerName(customerFilter, customers)}
                </Badge>
              )}
              {dateRange && (dateRange.from || dateRange.to) && (
                <Badge onDelete={() => setDateRange(undefined)}>
                  Date: {formatDateRangeLabel(dateRange)}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Readings data table */}
          <ReadingTable 
            readings={filteredReadings} 
            onEdit={handleEditReading}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Create reading dialog */}
      <ReadingDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateReading}
        isLoading={createReadingLoading}
        mode="create"
      />

      {/* Edit reading dialog */}
      <ReadingDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveReading}
        reading={selectedReading}
        isLoading={updateReadingLoading}
        mode="edit"
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteReadingLoading}
        title="Delete Reading"
        description="Are you sure you want to delete this meter reading? This action cannot be undone."
      />
    </div>
  );
};

/**
 * Badge component with delete button
 */
const Badge = ({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) => {
  return (
    <div className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
      {children}
      <button
        type="button"
        className="ml-1 rounded-full text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
        onClick={onDelete}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span className="sr-only">Remove filter</span>
      </button>
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
 * Get customer name from UUID
 */
const getCustomerName = (uuid: string, customers: any[]): string => {
  const customer = customers.find(c => c.uuid === uuid);
  return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown';
};

/**
 * Format date range for display
 */
const formatDateRangeLabel = (range: DateRange): string => {
  if (range.from && range.to) {
    return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
  } else if (range.from) {
    return `From ${range.from.toLocaleDateString()}`;
  } else if (range.to) {
    return `Until ${range.to.toLocaleDateString()}`;
  }
  return 'Custom range';
};

export default MetersPage;
