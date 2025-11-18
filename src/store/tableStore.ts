import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createBroadcastSync } from '@/lib/broadcastSync';

interface TableState {
  searchQuery: string;
  regionFilter: string;
  healthFilter: string;

  // Actions
  setSearchQuery: (query: string) => void;
  setRegionFilter: (region: string) => void;
  setHealthFilter: (health: string) => void;
  resetFilters: () => void;
}

type TableSyncState = Pick<TableState, 'searchQuery' | 'regionFilter' | 'healthFilter'>;

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      // Initial state
      searchQuery: '',
      regionFilter: '',
      healthFilter: '',

      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),

      setRegionFilter: (region) => set({ regionFilter: region }),

      setHealthFilter: (health) => set({ healthFilter: health }),

      resetFilters: () =>
        set({
          searchQuery: '',
          regionFilter: '',
          healthFilter: '',
        }),
    }),
    {
      name: 'table-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence across tabs
    }
  )
);

// Cross-tab synchronization using BroadcastChannel
const broadcastSync = createBroadcastSync<TableSyncState>({
  channelName: 'voltage-app-sync',
  storeName: 'table-storage',
  debounceMs: 300,
});

// Subscribe to state changes and broadcast to other tabs
useTableStore.subscribe((state) => {
  broadcastSync.broadcast({
    searchQuery: state.searchQuery,
    regionFilter: state.regionFilter,
    healthFilter: state.healthFilter,
  });
});

// Listen for updates from other tabs
broadcastSync.subscribe((syncState) => {
  // Merge incoming state from other tabs without triggering new broadcasts
  useTableStore.setState(syncState);
});
