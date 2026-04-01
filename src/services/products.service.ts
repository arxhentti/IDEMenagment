import { http } from './http';
import type { Product, ProductPayload, UpdateProductPayload } from '../types/product';

export const productsService = {
  getAll: () => http.get<Product[]>('/products').then((response) => response.data),
  getById: (id: string) => http.get<Product>(`/products/${id}`).then((response) => response.data),
  create: (payload: ProductPayload) => http.post<Product>('/products', payload).then((response) => response.data),
  update: (id: string, payload: UpdateProductPayload) =>
    http.put<Product>(`/products/${id}`, payload).then((response) => response.data),
  remove: (id: string) => http.delete(`/products/${id}`),
};
