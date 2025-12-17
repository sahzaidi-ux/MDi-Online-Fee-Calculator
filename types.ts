export interface FeeStructure {
  currency: string;
  initialPayment: number;
  monthlyInstallment: number;
  numberOfInstallments: number;
}

export interface Degree {
  id: string;
  name: string;
  fees: FeeStructure;
}

export interface University {
  id: string;
  name: string;
  degrees: Degree[];
}

export interface LeadFormData {
  name: string;
  email: string;
  mobile: string;
  city: string;
}