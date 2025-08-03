import { create } from 'zustand';
import { getData } from '@/components/utils';

// categories, fetchCategories, useCategoriesStore

const useCategoriesStore = create((set) => ({
  categories: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getData('/api/categories');
      set({ assets:result, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useCategoriesStore;
