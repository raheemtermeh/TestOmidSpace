import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// تعریف نوع (Type) کاربر
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

// تعریف نوع State
interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // currentPage و totalPages رو حذف می‌کنیم چون دیگه pagination نداریم
  // currentPage: number;
  // totalPages: number;
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
  // currentPage و totalPages رو حذف می‌کنیم
  // currentPage: 1,
  // totalPages: 1,
};

// Async Thunk برای دریافت کاربران - حالا بدون پارامتر page
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => { 
    try {

      const response = await axios.get(`https://reqres.in/api/users`,
        {
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        });
        console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }
);

// Slice اصلی کاربران
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // اینجا می‌تونیم Reducerهای Sync دیگه رو اضافه کنیم
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data;
        // currentPage و totalPages رو دیگه ست نمی‌کنیم
        // state.currentPage = action.payload.page;
        // state.totalPages = action.payload.total_pages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      });
  },
});

export default usersSlice.reducer;