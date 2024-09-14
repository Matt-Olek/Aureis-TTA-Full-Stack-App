// types.ts
export interface Company {
  id: number;
  name: string;
  email: string;
  sector: string;
  codeAPE: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  link_inscription: boolean;
  registrationLink?: string;
}
