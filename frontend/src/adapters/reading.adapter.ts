
import { adaptCustomerFromAPI, adaptCustomerToAPI } from "./customer.adapter";
import { APIReading, KindOfMeter, mapMeterTypeFromAPI, mapMeterTypeToAPI } from "../types/api";

// Reading type definition for our app
export interface Reading {
  uuid: string;
  customer: any; // Use the Customer type from customer.adapter.ts
  dateOfReading: Date;
  comment?: string | null;
  meterId: string;
  substitute: boolean;
  meterCount: number;
  kindOfMeter: string; // 'electricity', 'water', 'heating'
}

// Adapt API reading to our app model
export const adaptReadingFromAPI = (apiReading: APIReading): Reading => {
  return {
    uuid: apiReading.id || crypto.randomUUID(),
    customer: apiReading.customer ? adaptCustomerFromAPI(apiReading.customer) : null,
    dateOfReading: new Date(apiReading.dateOfReading),
    comment: apiReading.comment,
    meterId: apiReading.meterId,
    substitute: apiReading.substitute,
    meterCount: apiReading.meterCount,
    kindOfMeter: mapMeterTypeFromAPI(apiReading.kindOfMeter)
  };
};

// Adapt our app model to API reading
export const adaptReadingToAPI = (reading: Reading): APIReading => {
  return {
    id: reading.uuid,
    customer: reading.customer ? adaptCustomerToAPI(reading.customer) : null,
    dateOfReading: reading.dateOfReading.toISOString().split('T')[0],
    comment: reading.comment,
    meterId: reading.meterId,
    substitute: reading.substitute,
    meterCount: reading.meterCount,
    kindOfMeter: mapMeterTypeToAPI(reading.kindOfMeter)
  };
};

// Adapt multiple readings
export const adaptReadingsFromAPI = (apiReadings: APIReading[]): Reading[] => {
  return apiReadings.map(adaptReadingFromAPI);
};
