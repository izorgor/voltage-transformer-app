/**
 * Cross-tab state synchronization using BroadcastChannel API
 * with debounced broadcasting to prevent spam
 */

type SyncMessage<T> = {
  type: 'STATE_UPDATE';
  storeName: string;
  state: T;
  timestamp: number;
};

type BroadcastConfig = {
  channelName: string;
  storeName: string;
  debounceMs?: number;
};

/**
 * Creates a cross-tab sync handler using BroadcastChannel
 * Debounces outgoing messages, immediately processes incoming messages
 */
export function createBroadcastSync<T>(config: BroadcastConfig) {
  const { channelName, storeName, debounceMs = 300 } = config;

  let channel: BroadcastChannel | null = null;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let lastBroadcastState: string | null = null; // Store serialized for comparison
  let isProcessingIncoming = false; // Flag to prevent circular updates

  // Initialize BroadcastChannel
  const initChannel = () => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      console.warn('BroadcastChannel not supported');
      return null;
    }

    try {
      return new BroadcastChannel(channelName);
    } catch (error) {
      console.error('Failed to create BroadcastChannel:', error);
      return null;
    }
  };

  return {
    /**
     * Start listening for state updates from other tabs
     */
    subscribe: (onStateChange: (state: T) => void) => {
      channel = initChannel();
      if (!channel) return () => {};

      const handleMessage = (event: MessageEvent<SyncMessage<T>>) => {
        const message = event.data;

        // Only process messages for this store
        if (message.type === 'STATE_UPDATE' && message.storeName === storeName) {
          const incomingState = JSON.stringify(message.state);

          // Prevent circular updates by checking if state actually changed
          if (incomingState !== lastBroadcastState) {
            isProcessingIncoming = true;
            lastBroadcastState = incomingState;
            onStateChange(message.state);
            // Small delay to ensure setState completes before resetting flag
            setTimeout(() => {
              isProcessingIncoming = false;
            }, 0);
          }
        }
      };

      channel.addEventListener('message', handleMessage);

      return () => {
        if (channel) {
          channel.removeEventListener('message', handleMessage);
          channel.close();
          channel = null;
        }
        if (debounceTimer) {
          clearTimeout(debounceTimer);
          debounceTimer = null;
        }
      };
    },

    /**
     * Broadcast state change to other tabs (debounced)
     */
    broadcast: (state: T) => {
      // Skip broadcasting if this state change came from another tab
      if (isProcessingIncoming) {
        return;
      }

      if (!channel) {
        channel = initChannel();
      }
      if (!channel) return;

      const serializedState = JSON.stringify(state);

      // Skip if state hasn't actually changed
      if (serializedState === lastBroadcastState) {
        return;
      }

      // Store for circular update prevention
      lastBroadcastState = serializedState;

      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Debounce the broadcast
      debounceTimer = setTimeout(() => {
        if (channel) {
          const message: SyncMessage<T> = {
            type: 'STATE_UPDATE',
            storeName,
            state,
            timestamp: Date.now(),
          };

          try {
            channel.postMessage(message);
          } catch (error) {
            console.error('Failed to broadcast state:', error);
          }
        }
        debounceTimer = null;
      }, debounceMs);
    },

    /**
     * Cleanup resources
     */
    destroy: () => {
      if (channel) {
        channel.close();
        channel = null;
      }
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      lastBroadcastState = null;
      isProcessingIncoming = false;
    },
  };
}
