
import { APICustomer, GenderAPI, mapGenderFromAPI, mapGenderToAPI } from "../types/api";

// Customer type from our app
export interface Customer {
  uuid: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: "MALE" | "FEMALE" | "OTHER";
}

// Adapt API customer to our app model
export const adaptCustomerFromAPI = (apiCustomer: APICustomer): Customer => {
  return {
    uuid: apiCustomer.id || crypto.randomUUID(),
    firstName: apiCustomer.firstName,
    lastName: apiCustomer.lastName,
    birthDate: apiCustomer.birthDate ? new Date(apiCustomer.birthDate) : new Date(),
    gender: mapGenderFromAPI(apiCustomer.gender as GenderAPI)
  };
};

// Adapt our app model to API customer
export const adaptCustomerToAPI = (customer: Customer): APICustomer => {
  return {
    id: customer.uuid,
    firstName: customer.firstName,
    lastName: customer.lastName,
    birthDate: customer.birthDate.toISOString().split('T')[0],
    gender: mapGenderToAPI(customer.gender as any)
  };
};

// Adapt multiple customers
export const adaptCustomersFromAPI = (apiCustomers: APICustomer[]): Customer[] => {
  return apiCustomers.map(adaptCustomerFromAPI);
};
