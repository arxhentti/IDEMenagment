import { http } from './http';
import type { AuthResponse, LoginInput, RegisterInput, RegisterResponse } from '../types/auth';

export const authService = {
  login: (payload: LoginInput) =>
    http.post<AuthResponse>('/auth/login', payload).then((response) => response.data),
  register: (payload: RegisterInput) =>
    http.post<RegisterResponse>('/auth/register', payload).then((response) => response.data),
  verifyEmail: (token: string) =>
    http.post('/auth/verify-email', { token }).then((response) => response.data),
  resendVerification: (email: string) =>
    http.post('/auth/resend-verification', { email }).then((response) => response.data),
};
