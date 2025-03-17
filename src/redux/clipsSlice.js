import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClipsPage } from '../services/kickApi';

export const fetchChannelClips = createAsyncThunk(
    'clips/fetchChannel',
    async ({ channelName, cursor = 0, sortBy = 'date', timeFilter = 'all' }) => {
      return await fetchClipsPage(channelName, cursor, sortBy, timeFilter);
    }
  );

const clipsSlice = createSlice({
  name: 'clips',
  initialState: {
    channelName: '',
    items: [],
    cursor: 0,
    loading: false,
    hasMore: true,
    error: null
  },
  reducers: {
    setChannel: (state, action) => {
      state.channelName = action.payload;
      state.items = [];
      state.cursor = 0;
      state.hasMore = true;
      state.error = null;
    },
    clearClips: (state) => {
      state.items = [];
      state.cursor = 0;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannelClips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannelClips.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.clips?.length) {
          state.items = [...state.items, ...action.payload.clips];
          state.cursor = action.payload.cursor || state.cursor;
          state.hasMore = !!action.payload.cursor && action.payload.cursor !== state.cursor;
        } else {
          state.hasMore = false;
        }
      })
      .addCase(fetchChannelClips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setChannel, clearClips } = clipsSlice.actions;
export default clipsSlice.reducer;
