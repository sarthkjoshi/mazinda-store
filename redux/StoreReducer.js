import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Action
export const fetchStoreData = createAsyncThunk("fetchStore", async () => {
  const { data } = await axios.get("/api/fetch-store");
  const product_response = await axios.get("/api/product/fetch-store-products");

  return { store: data.store, products: product_response.data.products };
});

export const StoreSlice = createSlice({
  name: "store",
  initialState: {
    isLoading: false,
    isError: false,
    store_token: null,
    store: {},
    products: [],
  },
  prepare: async () => {
    const { user } = await getServerSession(authOptions);
    return { payload: user || null };
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStoreData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchStoreData.fulfilled, (state, action) => {
      (state.isLoading = false),
        (state.store = action.payload.store),
        (state.products = action.payload.products);
    });
    builder.addCase(fetchStoreData.rejected, (state, action) => {
      (state.isLoading = false), (state.isError = true);
    });
  },
});

export default StoreSlice.reducer;
