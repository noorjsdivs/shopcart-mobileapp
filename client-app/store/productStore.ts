import { getCategories, getProducts } from "@/lib/api";
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

  // Products actions
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],
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
    }),
    {
      name: "products-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
