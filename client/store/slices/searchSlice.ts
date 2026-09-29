import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  query: string;
  selectedCategory: string;
  recentSearches: string[];
}

const initialState: SearchState = {
  query: '',
  selectedCategory: 'all',
  recentSearches: [],
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const q = action.payload.trim();
      if (q && !state.recentSearches.includes(q)) {
        state.recentSearches = [q, ...state.recentSearches].slice(0, 8);
      }
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  addRecentSearch,
  clearRecentSearches,
} = searchSlice.actions;
export default searchSlice.reducer;
