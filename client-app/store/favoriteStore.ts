import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesState {
  favoriteItems: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  resetFavorite: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteItems: [],

      addFavorite: (product: Product) => {
        set((state) => ({
          favoriteItems: [...state.favoriteItems, product],
        }));
      },

      removeFavorite: (productId: number) => {
        set((state) => ({
          favoriteItems: state.favoriteItems.filter(
            (item) => item.id !== productId
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteItems: [] });
      },

      toggleFavorite: (product: Product) => {
        const isFav = get().isFavorite(product.id);
        if (isFav) {
          get().removeFavorite(product.id);
        } else {
          get().addFavorite(product);
        }
      },

      isFavorite: (productId: number) => {
        return get().favoriteItems.some((item) => item.id === productId);
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
