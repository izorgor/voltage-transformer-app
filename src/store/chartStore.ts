import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createBroadcastSync } from '@/lib/broadcastSync';

interface ChartState {
  selectedTransformers: number[];
  selectAll: boolean;

  // Actions
  toggleTransformer: (assetId: number) => void;
  setSelectedTransformers: (assetIds: number[]) => void;
  setSelectAll: (selectAll: boolean) => void;
  resetSelection: () => void;
}

type ChartSyncState = Pick<ChartState, 'selectedTransformers' | 'selectAll'>;

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      // Initial state - show all by default
      selectedTransformers: [],
      selectAll: true,

      // Toggle individual transformer
      toggleTransformer: (assetId) =>
        set((state) => {
          const isSelected = state.selectedTransformers.includes(assetId);
          const newSelected = isSelected
            ? state.selectedTransformers.filter((id) => id !== assetId)
            : [...state.selectedTransformers, assetId];

          return {
            selectedTransformers: newSelected,
            selectAll: false, // Disable "select all" when manually toggling
          };
        }),

      setSelectedTransformers: (assetIds) =>
        set({
          selectedTransformers: assetIds,
          selectAll: false,
        }),

      setSelectAll: (selectAll) =>
        set({
          selectAll,
          selectedTransformers: [], // Clear individual selections when toggling "select all"
        }),

      resetSelection: () =>
        set({
          selectedTransformers: [],
          selectAll: true,
        }),
    }),
    {
      name: 'chart-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence across tabs
    }
  )
);

// Cross-tab synchronization using BroadcastChannel
const broadcastSync = createBroadcastSync<ChartSyncState>({
  channelName: 'voltage-app-sync',
  storeName: 'chart-storage',
  debounceMs: 300, // 300ms debounce to prevent spam
});

// Subscribe to state changes and broadcast to other tabs
useChartStore.subscribe((state) => {
  broadcastSync.broadcast({
    selectedTransformers: state.selectedTransformers,
    selectAll: state.selectAll,
  });
});

// Listen for updates from other tabs
broadcastSync.subscribe((syncState) => {
  // Merge incoming state from other tabs without triggering new broadcasts
  useChartStore.setState(syncState);
});
