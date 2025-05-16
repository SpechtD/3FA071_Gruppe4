
// Gender enums - map between our app's values and the API values
export enum GenderApp {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export enum GenderAPI {
  M = "M",
  W = "W",
  D = "D",
  U = "U"
}

// Type for API meter kinds
export enum KindOfMeter {
  HEIZUNG = "HEIZUNG",
  STROM = "STROM",
  WASSER = "WASSER",
  UNBEKANNT = "UNBEKANNT"
}

// Map our app meter types to API meter types
export const mapMeterTypeToAPI = (type: string): KindOfMeter => {
  switch (type.toLowerCase()) {
    case 'electricity':
      return KindOfMeter.STROM;
    case 'water':
      return KindOfMeter.WASSER;
    case 'heating':
      return KindOfMeter.HEIZUNG;
    default:
      return KindOfMeter.UNBEKANNT;
  }
};

export const mapMeterTypeFromAPI = (type: KindOfMeter): string => {
  switch (type) {
    case KindOfMeter.STROM:
      return 'electricity';
    case KindOfMeter.WASSER:
      return 'water';
    case KindOfMeter.HEIZUNG:
      return 'heating';
    default:
      return 'unknown';
  }
};

// Map our app gender to API gender
export const mapGenderToAPI = (gender: GenderApp): GenderAPI => {
  switch (gender) {
    case GenderApp.MALE:
      return GenderAPI.M;
    case GenderApp.FEMALE:
      return GenderAPI.W;
    case GenderApp.OTHER:
      return GenderAPI.D;
    default:
      return GenderAPI.U;
  }
};

// Map API gender to our app gender
export const mapGenderFromAPI = (gender: GenderAPI): GenderApp => {
  switch (gender) {
    case GenderAPI.M:
      return GenderApp.MALE;
    case GenderAPI.W:
      return GenderApp.FEMALE;
    case GenderAPI.D:
    case GenderAPI.U:
      return GenderApp.OTHER;
    default:
      return GenderApp.OTHER;
  }
};

// API Customer types
export interface APICustomer {
  id?: string | null;
  firstName: string;
  lastName: string;
  birthDate?: string | null;
  gender: GenderAPI;
}

export interface APICustomerWrapper {
  customer: APICustomer;
}

export interface APICustomerList {
  customers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string | null;
    gender: GenderAPI;
  }>;
}

// API Reading types
export interface APIReading {
  id?: string | null;
  customer: APICustomer | null;
  dateOfReading: string;
  comment?: string | null;
  meterId: string;
  substitute: boolean;
  meterCount: number;
  kindOfMeter: KindOfMeter;
}

export interface APIReadingWrapper {
  reading: APIReading;
}

export interface APIReadingList {
  readings: APIReading[];
}

export interface APICustomerReading {
  customer: APICustomer;
  readings: APIReading[];
}
