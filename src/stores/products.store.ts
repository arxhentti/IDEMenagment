import { defineStore } from 'pinia';
import { productsService } from '../services/products.service';
import type { Product, ProductPayload, UpdateProductPayload } from '../types/product';

interface ProductsState {
  products: Product[];
  loading: boolean;
  saving: boolean;
  error: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const axiosLikeError = error as {
      response?: { data?: { message?: string }; statusText?: string };
      request?: unknown;
      message?: string;
    };

    if (axiosLikeError.response) {
      return axiosLikeError.response.data?.message || axiosLikeError.response.statusText || fallback;
    }

    if (axiosLikeError.request) {
      return 'Network error: backend may be unavailable.';
    }

    if (axiosLikeError.message) {
      return axiosLikeError.message;
    }
  }

  return fallback;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    loading: false,
    saving: false,
    error: '',
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      this.error = '';

      try {
        this.products = await productsService.getAll();
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load products.');
      } finally {
        this.loading = false;
      }
    },
    async createProduct(payload: ProductPayload) {
      this.saving = true;
      this.error = '';

      try {
        const product = await productsService.create(payload);
        this.products = [product, ...this.products];
        return product;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to create product.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async updateProduct(id: string, payload: UpdateProductPayload) {
      this.saving = true;
      this.error = '';

      try {
        const updatedProduct = await productsService.update(id, payload);
        this.products = this.products.map((product) =>
          product.id === id ? updatedProduct : product,
        );
        return updatedProduct;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to update product.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async deleteProduct(id: string) {
      this.error = '';

      try {
        await productsService.remove(id);
        this.products = this.products.filter((product) => product.id !== id);
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to delete product.');
        throw error;
      }
    },
  },
});
