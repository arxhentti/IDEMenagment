export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductPayload {
  name: string;
  description?: string | null;
  price: number;
  stockQuantity: number;
}

export interface UpdateProductPayload extends ProductPayload {
  isActive: boolean;
}
