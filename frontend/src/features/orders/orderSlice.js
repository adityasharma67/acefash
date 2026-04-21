import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createOrder = createAsyncThunk('orders/create', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', payload);
    return data.order;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create order');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/my-orders');
    return data.orders;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user orders');
  }
});

export const fetchAllOrders = createAsyncThunk('orders/allOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders');
    return data.orders;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin orders');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    allOrders: [],
    latestOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrderState: (state) => {
      state.latestOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.latestOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrders = action.payload;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrders = action.payload;
      });
  },
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
