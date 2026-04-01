export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id?: string | number;
  fullName?: string;
  businessName?: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  userId: string;
  email: string;
  fullName?: string;
  businessName?: string;
}

export interface RegisterResponse {
  requiresEmailVerification: boolean;
  email: string;
  message: string;
}
