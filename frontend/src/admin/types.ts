export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  message?: string;
  yearsOfExperience?: string;
  linkedinProfile?: string;
  status: 'NEW' | 'QUALIFIED' | 'NOT_QUALIFIED' | 'OPPORTUNITY' | 'CONVERTED';
  notes?: string;
  createdAt: string;
}

export interface LeadStatsResponse {
  success: boolean;
  stats: {
    total: number;
    NEW: number;
    QUALIFIED: number;
    NOT_QUALIFIED: number;
    OPPORTUNITY: number;
    CONVERTED: number;
  };
}
