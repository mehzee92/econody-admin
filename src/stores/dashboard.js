import { create } from 'zustand';
import { getData } from '@/components/utils';

const useDashboardStore = create((set) => ({
  dashboard: [],
  isLoading: false,
  error: null,
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getData('/api/dashboard');
      set({ assets:result, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

export default useDashboardStore;
