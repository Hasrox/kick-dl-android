import { createSlice } from '@reduxjs/toolkit';

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState: {
    items: [],
    inProgress: [],
  },
  reducers: {
    addDownload: (state, action) => {
      state.items.push(action.payload);
    },
    removeDownload: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    startDownload: (state, action) => {
      state.inProgress.push(action.payload);
    },
    completeDownload: (state, action) => {
      state.inProgress = state.inProgress.filter(id => id !== action.payload);
    }
  }
});

export const { addDownload, removeDownload, startDownload, completeDownload } = downloadsSlice.actions;
export default downloadsSlice.reducer;
