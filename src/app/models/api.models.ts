export interface User {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    email: string;
    name: string;
  };
  token_expiration?: number; // Optional expiration time in milliseconds
}

export interface Payment {
  amount: number;
  billType: string;
  referenceNumber: string;
  customerId: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  amount: number;
  timestamp: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  amount: number;
  timestamp: string;
}
