import {
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProductsApi,
} from "@/lib/api";
import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;

  // Products actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setCategory: (category: string | null) => Promise<void>;
  searchProducts: (query: string) => void;
  sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => void;
  searchProductsRealTime: (query: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  filteredProducts: [],
  selectedCategory: null,
  categories: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const products = await getProducts();

      set({
        products,
        filteredProducts: products,
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      const categories = await getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  setCategory: async (category: string | null) => {
    try {
      set({ selectedCategory: category, loading: true, error: null });

      if (category) {
        const products = await getProductsByCategory(category);
        set({ filteredProducts: products, loading: false });
      } else {
        set({ filteredProducts: get().products, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  searchProducts: (query: string) => {
    const searchTerm = query.toLowerCase().trim();
    const { products, selectedCategory } = get();

    let filtered = products;

    // If a category is selected, filter by category first
    if (selectedCategory) {
      filtered = products.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Then filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
    }

    set({ filteredProducts: filtered });
  },

  sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => {
    const { filteredProducts } = get();
    let sorted = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      default:
        break;
    }

    set({ filteredProducts: sorted });
  },

  searchProductsRealTime: async (query: string) => {
    try {
      set({ loading: true, error: null });

      if (!query.trim()) {
        // If query is empty, reset to all products
        set({ filteredProducts: get().products, loading: false });
        return;
      }

      // Call the API to search products
      const searchResults = await searchProductsApi(query);
      set({ filteredProducts: searchResults, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
