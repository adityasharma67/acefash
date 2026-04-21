import { createSlice } from '@reduxjs/toolkit';

const storedCart = localStorage.getItem('cart');

const initialState = {
  items: storedCart ? JSON.parse(storedCart) : [],
};

const persistCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.items.find((i) => i.productId === item.productId);

      if (exists) {
        state.items = state.items.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        state.items.push(item);
      }

      persistCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      persistCart(state.items);
    },
    updateCartQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.items = state.items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
      persistCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persistCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
