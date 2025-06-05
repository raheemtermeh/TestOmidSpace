import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
}

interface UsersState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;  
  totalPages: number;    
  totalUsers: number;   
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  error: null,
  currentPage: 1,   
  totalPages: 1,     
  totalUsers: 0,    
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=3`, { // <--- per_page=3
        headers: {
          'x-api-key': 'reqres-free-v1',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("خطا در دریافت کاربران:", error);
      return rejectWithValue(error.message || 'خطا در دریافت کاربران');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser: NewUser, { dispatch, getState }) => {
    try {
      const response = await axios.post(
        `https://reqres.in/api/users`,
        newUser,
        {
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        }
      );
      const currentState = (getState() as any).users; // Cast to 'any' or define RootState for getState
      dispatch(fetchUsers(currentState.currentPage));
      return response.data;
    } catch (error: any) {
      console.error("خطا در ایجاد کاربر:", error);
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser: User, { dispatch, getState }) => {
    try {
      const response = await axios.put(
        `https://reqres.in/api/users/${updatedUser.id}`,
        updatedUser,
        {
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        }
      );
      const currentState = (getState() as any).users; // Cast to 'any' or define RootState for getState
      dispatch(fetchUsers(currentState.currentPage));
      return response.data;
    } catch (error: any) {
      console.error("خطا در ویرایش کاربر:", error);
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { dispatch, getState }) => {
    try {
      await axios.delete(
        `https://reqres.in/api/users/${userId}`,
        {
          headers: {
            'x-api-key': 'reqres-free-v1',
          },
        }
      );
      const currentState = (getState() as any).users; 
      let newPage = currentState.currentPage;
      if (currentState.users.length === 1 && currentState.currentPage > 1) {
          newPage = currentState.currentPage - 1;
      }
      dispatch(fetchUsers(newPage));
      return userId;
    } catch (error: any) {
      console.error("خطا در حذف کاربر:", error);
      throw error;
    }
  }
);


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.data;
        state.currentPage = action.payload.page;      
        state.totalPages = action.payload.total_pages; 
        state.totalUsers = action.payload.total;      
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'خطا در دریافت کاربران';
      })

      .addCase(createUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'خطا در ایجاد کاربر';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'خطا در ویرایش کاربر';
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'خطا در حذف کاربر';
      });
  },
});

export default usersSlice.reducer;