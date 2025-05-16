
import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/adapters/customer.adapter";
import CustomerTable from "@/components/CustomerTable";
import CustomerDialog from "@/components/CustomerDialog";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { toast } from "sonner";

/**
 * Customers Page Component
 * 
 * Main page for customer management with CRUD operations
 * Features include:
 * - Searchable, paginated customer table
 * - Create, update, and delete functionality
 * - Debounced search for better performance
 */
const CustomersPage = () => {
  // State for search, dialog visibility and editing
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Debounced search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get customers and mutation functions from hook
  const { 
    customers,
    isLoading, 
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createCustomerLoading,
    updateCustomerLoading,
    deleteCustomerLoading
  } = useCustomers();

  // Filter customers based on search term
  const filteredCustomers = React.useMemo(() => {
    return customers.filter(customer => {
      const searchLower = debouncedSearchTerm.toLowerCase();
      return (
        customer.uuid.toLowerCase().includes(searchLower) ||
        customer.firstName.toLowerCase().includes(searchLower) ||
        customer.lastName.toLowerCase().includes(searchLower)
      );
    });
  }, [customers, debouncedSearchTerm]);

  /**
   * Handle creating a new customer
   */
  const handleCreateCustomer = useCallback(async (data: any) => {
    try {
      await createCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
        gender: data.gender
      });
      setIsCreateDialogOpen(false);
      toast.success("Customer created successfully");
    } catch (error) {
      console.error("Failed to create customer:", error);
      toast.error("Failed to create customer");
    }
  }, [createCustomer]);

  /**
   * Handle opening edit dialog for a customer
   */
  const handleEditCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  }, []);

  /**
   * Handle saving edited customer
   */
  const handleSaveCustomer = useCallback(async (data: any) => {
    if (!selectedCustomer) return;
    
    try {
      await updateCustomer({
        uuid: selectedCustomer.uuid,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
        gender: data.gender
      });
      setIsEditDialogOpen(false);
      toast.success("Customer updated successfully");
    } catch (error) {
      console.error("Failed to update customer:", error);
      toast.error("Failed to update customer");
    }
  }, [updateCustomer, selectedCustomer]);

  /**
   * Handle opening delete confirmation dialog
   */
  const handleDeleteClick = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  }, []);

  /**
   * Handle confirming customer deletion
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedCustomer) return;
    
    try {
      await deleteCustomer(selectedCustomer.uuid);
      setIsDeleteDialogOpen(false);
      toast.success("Customer deleted successfully");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("Failed to delete customer");
    }
  }, [deleteCustomer, selectedCustomer]);

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer information
        </p>
      </div>

      {/* Customer management card */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle>Customer Management</CardTitle>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </CardHeader>
        <CardContent>
          {/* Search bar with debounced input */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by UUID, name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Search updates after typing pauses (300ms debounce)
            </p>
          </div>

          {/* Customer data table */}
          <CustomerTable 
            customers={filteredCustomers} 
            onEdit={handleEditCustomer}
            onDelete={handleDeleteClick}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Create customer dialog */}
      <CustomerDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateCustomer}
        isLoading={createCustomerLoading}
        mode="create"
      />

      {/* Edit customer dialog */}
      <CustomerDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
        isLoading={updateCustomerLoading}
        mode="edit"
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmation
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteCustomerLoading}
        title="Delete Customer"
        description="Are you sure you want to delete this customer? Customer readings will remain in the database even after deletion."
      />
    </div>
  );
};

export default CustomersPage;
