import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/lib/api';

interface ProductState {
  products: Product[];
  totalCharges: number;
  gstTotal: number;
  totalAmount: number;
}

const initialState: ProductState = {
  products: [],
  totalCharges: 0,
  gstTotal: 0,
  totalAmount: 0,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      productSlice.caseReducers.calculateTotals(state);
    },
    updateProduct: (state, action: PayloadAction<{ index: number; product: Product }>) => {
      state.products[action.payload.index] = action.payload.product;
      productSlice.caseReducers.calculateTotals(state);
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      state.products.splice(action.payload, 1);
      productSlice.caseReducers.calculateTotals(state);
    },
    clearProducts: (state) => {
      state.products = [];
      state.totalCharges = 0;
      state.gstTotal = 0;
      state.totalAmount = 0;
    },
    calculateTotals: (state) => {
      state.totalCharges = state.products.reduce((sum, product) => {
        return sum + (product.quantity * product.rate);
      }, 0);
      state.gstTotal = state.totalCharges * 0.18; // 18% GST
      state.totalAmount = state.totalCharges + state.gstTotal;
    },
  },
});

export const { addProduct, updateProduct, removeProduct, clearProducts, calculateTotals } = productSlice.actions;
export default productSlice.reducer;
