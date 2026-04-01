import { http } from './http';
import type { Customer, CustomerPayload } from '../types/customer';

export const customersService = {
  getAll: () => http.get<Customer[]>('/customers').then((response) => response.data),
  getById: (id: string) => http.get<Customer>(`/customers/${id}`).then((response) => response.data),
  create: (payload: CustomerPayload) => http.post<Customer>('/customers', payload).then((response) => response.data),
  update: (id: string, payload: CustomerPayload) =>
    http.put<Customer>(`/customers/${id}`, payload).then((response) => response.data),
  remove: (id: string) => http.delete(`/customers/${id}`),
};
