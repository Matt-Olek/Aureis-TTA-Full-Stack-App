export interface Offer {
  id?: number;
  title: string;
  same_entity_location: boolean;
  location: string;
  contract_type: string;
  target_educational_level: string;
  description: string;
  skills: string[];
  is_active: boolean;
  token: string;
  created_at?: string;
}

export interface Applicant {
  id?: number;
  resume?: string | null;
  formation: number | null;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  country: string;
  phone: string;
  diploma: string;
  target_educational_level: string;
  duration: string;
  contract_type: string;
  sector: number[];
  location: string;
  kilometers_away: number;
  skills: number[];
  created_at?: string;
  updated_at?: string;
  link_inscription?: string;
  token?: string;
}

export interface Sector {
  id: number;
  name: string;
}

export interface Application {
  applicant: Applicant;
  created_at: string;
  is_active: boolean;
}

export interface Match {
  offer: Offer;
  id: number;
  application: Application;
  score: number;
  industry_score: number;
  test_score: number;
  geographic_score: number;
  resume_score: number;
  status: number; // Corresponds to STATUS_CHOICES in Django model
  created_at: string;
  status_description: string; // Human-readable status description
}

export interface Formation {
  id: number;
  name: string;
  level: string;
}

export const STATUS_MAP: Record<string, string> = {
  "0": "En attente",
  "1": "Accepté par l'entreprise",
  "2": "En file d'attente par l'entreprise",
  "-1": "Annulé par l'entreprise",
  "-2": "Annulé par le candidat",
  "3": "Entièrement accepté",
  "4": "Inscription finalisée",
};

// Function to get the status description based on the status code
export const getStatusDescription = (status: number): string => {
  return STATUS_MAP[status.toString()] || "Statut inconnu"; // Default case for unknown status
};

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
