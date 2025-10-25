import {createSlice} from '@reduxjs/toolkit';
import {UIState} from '../../types/movie';

const initialState: UIState = {
  isCategoryDropdownOpen: false,
  isSortDropdownOpen: false,
  isLoading: false,
  error: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCategoryDropdown: state => {
      state.isCategoryDropdownOpen = !state.isCategoryDropdownOpen;
      state.isSortDropdownOpen = false; // Close other dropdown
    },
    toggleSortDropdown: state => {
      state.isSortDropdownOpen = !state.isSortDropdownOpen;
      state.isCategoryDropdownOpen = false; // Close other dropdown
    },
    closeBothDropdowns: state => {
      state.isCategoryDropdownOpen = false;
      state.isSortDropdownOpen = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  toggleCategoryDropdown,
  toggleSortDropdown,
  closeBothDropdowns,
  setLoading,
  setError,
  clearError,
} = uiSlice.actions;

export default uiSlice.reducer;