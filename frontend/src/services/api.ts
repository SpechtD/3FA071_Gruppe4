
import { toast } from "sonner";
import { 
  APICustomer, APICustomerList, APICustomerReading, APICustomerWrapper, 
  APIReading, APIReadingList, APIReadingWrapper, GenderAPI, KindOfMeter,
  mapGenderFromAPI, mapGenderToAPI, mapMeterTypeFromAPI, mapMeterTypeToAPI
} from "../types/api";

// API base URL
const API_BASE_URL = 'http://localhost:8080';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text();
};

// Helper function to handle API errors
const handleError = (error: Error, message: string) => {
  console.error(`${message}:`, error);
  toast.error(message);
  throw error;
};

// Customer API functions
export const getCustomers = async (): Promise<APICustomerList> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, 'Failed to fetch customers');
  }
};

export const getCustomer = async (uuid: string): Promise<APICustomerWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${uuid}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, `Failed to fetch customer with ID ${uuid}`);
  }
};

export const createCustomer = async (customer: APICustomer): Promise<APICustomerWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customer })
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, 'Failed to create customer');
  }
};

export const updateCustomer = async (customer: APICustomer): Promise<APICustomerWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customer })
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, 'Failed to update customer');
  }
};

export const deleteCustomer = async (uuid: string): Promise<APICustomerReading> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${uuid}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, `Failed to delete customer with ID ${uuid}`);
  }
};

// Reading API functions
export const getReadings = async (
  params?: {
    customer?: string;
    start?: string;
    end?: string;
    kindOfMeter?: KindOfMeter;
  }
): Promise<APIReadingList> => {
  try {
    let url = new URL(`${API_BASE_URL}/readings`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });
    }
    
    const response = await fetch(url.toString());
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, 'Failed to fetch readings');
  }
};

export const getReading = async (uuid: string): Promise<APIReadingWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readings/${uuid}`);
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, `Failed to fetch reading with ID ${uuid}`);
  }
};

export const createReading = async (reading: APIReading): Promise<APIReadingWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reading })
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, 'Failed to create reading');
  }
};

export const updateReading = async (reading: APIReading): Promise<APIReadingWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reading })
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, 'Failed to update reading');
  }
};

export const deleteReading = async (uuid: string): Promise<APIReadingWrapper> => {
  try {
    const response = await fetch(`${API_BASE_URL}/readings/${uuid}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  } catch (error) {
    return handleError(error as Error, `Failed to delete reading with ID ${uuid}`);
  }
};

// Database setup function (for testing)
export const setupDatabase = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/setupDB`, {
      method: 'DELETE'
    });
    await handleResponse(response);
    toast.success('Database setup completed');
  } catch (error) {
    handleError(error as Error, 'Failed to set up database');
  }
};
