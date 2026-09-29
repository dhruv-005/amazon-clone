import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Address } from '@/types/user';

interface UserSliceState {
  addresses: Address[];
}

const initialState: UserSliceState = {
  addresses: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { setUserAddresses } = userSlice.actions;
export default userSlice.reducer;
