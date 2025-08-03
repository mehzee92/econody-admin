import { create } from 'zustand';
import { getData } from '@/components/utils';

const useListingsStore = create((set) => ({
  listings: [],
  isLoading: false,
  error: null,
  fetchAssets: async(querySting) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getData('/api/listings?'+querySting);
      set({ assets:result, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));


export default useListingsStore;
