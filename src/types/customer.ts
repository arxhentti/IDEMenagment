export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  instagramUsername?: string | null;
  whatsAppNumber?: string | null;
  notes?: string | null;
  ordersCount: number;
}

export interface CustomerPayload {
  fullName: string;
  phoneNumber: string;
  instagramUsername?: string | null;
  whatsAppNumber?: string | null;
  notes?: string | null;
}
