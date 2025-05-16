
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "../services/api";
import { Customer } from "../adapters/customer.adapter";
import { adaptCustomerFromAPI, adaptCustomersFromAPI, adaptCustomerToAPI } from "../adapters/customer.adapter";
import { toast } from "sonner";

export const useCustomers = () => {
  const queryClient = useQueryClient();

  // Query to fetch all customers
  const {
    data: customers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await getCustomers();
      return adaptCustomersFromAPI(response.customers);
    },
  });

  // Query to fetch a single customer
  const useCustomer = (uuid: string) => {
    return useQuery({
      queryKey: ["customer", uuid],
      queryFn: async () => {
        const response = await getCustomer(uuid);
        return adaptCustomerFromAPI(response.customer);
      },
      enabled: !!uuid,
    });
  };

  // Mutation to create a customer
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: Omit<Customer, "uuid">) => {
      // Creating a temporary UUID for the customer
      const tempCustomer = {
        ...customerData,
        uuid: crypto.randomUUID(),
      } as Customer;

      const apiCustomer = adaptCustomerToAPI(tempCustomer);
      const response = await createCustomer(apiCustomer);
      return adaptCustomerFromAPI(response.customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create customer: ${error.message}`);
    },
  });

  // Mutation to update a customer
  const updateCustomerMutation = useMutation({
    mutationFn: async (customerData: Customer) => {
      const apiCustomer = adaptCustomerToAPI(customerData);
      const response = await updateCustomer(apiCustomer);
      return adaptCustomerFromAPI(response.customer);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.uuid] });
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update customer: ${error.message}`);
    },
  });

  // Mutation to delete a customer
  const deleteCustomerMutation = useMutation({
    mutationFn: async (uuid: string) => {
      await deleteCustomer(uuid);
      return uuid;
    },
    onSuccess: (uuid) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", uuid] });
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete customer: ${error.message}`);
    },
  });

  return {
    customers,
    isLoading,
    error,
    useCustomer,
    createCustomer: createCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
    createCustomerLoading: createCustomerMutation.isPending,
    updateCustomerLoading: updateCustomerMutation.isPending,
    deleteCustomerLoading: deleteCustomerMutation.isPending,
  };
};
