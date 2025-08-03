import { create } from 'zustand';
import { getData } from '@/components/utils';

const useAssetsStore = create((set) => ({
  assets: [],
  isLoading: false,
  error: null,

  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getData('/api/assets');
      set({ assets:result, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useAssetsStore;
