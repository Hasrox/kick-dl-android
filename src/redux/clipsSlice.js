import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClipsPage } from '../services/kickApi';

export const fetchChannelClips = createAsyncThunk(
  'clips/fetchChannel',
  async ({ channelName, cursor = null, sortBy = 'view', timeFilter = 'all' }, { rejectWithValue }) => {
    try {
      const result = await fetchClipsPage(channelName, cursor, sortBy, timeFilter);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const clipsSlice = createSlice({
  name: 'clips',
  initialState: {
    channelName: '',
    items: [],
    seenIds: [], // Track seen clip IDs to avoid duplicates
    cursor: null,
    loading: false,
    hasMore: true,
    error: null,
    retryCount: 0
  },
  reducers: {
    setChannel: (state, action) => {
      state.channelName = action.payload;
      state.items = [];
      state.seenIds = [];
      state.cursor = null;
      state.hasMore = true;
      state.error = null;
      state.retryCount = 0;
    },
    clearClips: (state) => {
      state.items = [];
      state.seenIds = [];
      state.cursor = null;
      state.hasMore = true;
      state.error = null;
      state.retryCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelClips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelClips.fulfilled, (state, action) => {
        state.loading = false;
        state.retryCount = 0;
        
        if (action.payload.clips?.length) {
          // Filter out any duplicates
          const newClips = action.payload.clips.filter(clip => !state.seenIds.includes(clip.id));
          
          // Add new clip IDs to seen set
          state.seenIds = [...state.seenIds, ...newClips.map(clip => clip.id)];
          
          // Add new clips to existing clips
          state.items = [...state.items, ...newClips];
          
          console.log(`Added ${newClips.length} new clips (filtered ${action.payload.clips.length - newClips.length} duplicates)`);
          
          // Check for nextCursor in the response
          if (action.payload.nextCursor && action.payload.nextCursor !== action.meta.arg.cursor) {
            state.cursor = action.payload.nextCursor;
            state.hasMore = true;
            console.log(`Updated cursor to ${state.cursor}, hasMore=true`);
          } else {
            state.hasMore = false;
            console.log('No more clips to load (no new nextCursor)');
          }
        } else {
          state.hasMore = false;
          console.log('No more clips to load (empty response)');
        }
      })
      .addCase(fetchChannelClips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch clips';
        
        // Increment retry count but don't stop trying until multiple failures
        state.retryCount += 1;
        if (state.retryCount >= 3) {
          state.hasMore = false;
          console.log('Stopped trying after multiple failures');
        }
      });
  }
});

export const { setChannel, clearClips } = clipsSlice.actions;
export default clipsSlice.reducer;
