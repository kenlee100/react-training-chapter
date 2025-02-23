import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";
import { createRequestInstance } from "@utils/request";
import { adminProducts } from "@apis/adminProducts";

import { pushMessage } from "@/redux/toastSlice";

const request = createRequestInstance(axios);
const { addProducts, getProducts, updateProduct, deleteProduct } =
  adminProducts(request);
const errorMessage = (error) => {
  return {
    text: error?.response?.data?.message || "錯誤",
    status: "failed",
  };
};
export const adminSlice = createSlice({
  name: "adminSlice",
  initialState: {
    isLoading: false,
    pageInfo: {
      total_pages: 1,
      current_page: 1,
      has_pre: false,
      has_next: true,
      category: "",
    },
    modalModifySuccess: false, // 是否新增/修改成功
    products: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setPageInfo: (state, action) => {
      state.pageInfo = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setModalModifySuccess: (state, action) => {
      state.modalModifySuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    // addMatcher：可以把多個非同步組合在一起。要搭配 isAnyOf
    // addCase：一次加一個
    // 控制 admin loading
    // builder.addMatcher(
    //   isAnyOf(
    //     asyncProductsData.fulfilled,
    //     asyncUpdateProduct.fulfilled,
    //     asyncDeleteProductData.fulfilled
    //   ),
    //   (state) => {
    //     state.isLoading = false;
    //   }
    // );
    // builder.addMatcher(
    //   isAnyOf(
    //     asyncUpdateProduct.pending,
    //     asyncProductsData.pending,
    //     asyncDeleteProductData.pending
    //   ),
    //   (state) => {
    //     state.isLoading = true;
    //   }
    // );
    // builder.addMatcher(
    //   isAnyOf(
    //     asyncUpdateProduct.rejected,
    //     asyncProductsData.rejected,
    //     asyncDeleteProductData.rejected
    //   ),
    //   (state) => {
    //     state.isLoading = false;
    //   }
    // );
  },
});

export const asyncProductsData = createAsyncThunk(
  "adminSlice/getProductsData",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await getProducts(content);
      const { products, pagination } = res;
      await dispatch(setProducts(products));
      await dispatch(setPageInfo(pagination));
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const asyncUpdateProduct = createAsyncThunk(
  "adminSlice/updateProduct",
  async (content, { dispatch }) => {
    try {
      const res = await updateProduct(content, content.data.id);
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${res.message}：${content.data?.title}`,
          status: "success",
        })
      );
      await dispatch(
        asyncProductsData({
          page: 1,
        })
      );
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    }
  }
);

export const asyncDeleteProductData = createAsyncThunk(
  "adminSlice/deleteProduct",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await deleteProduct(content.data.id);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${message}：${content.data?.title}`,
          status: "success",
        })
      );
      
      await dispatch(
        asyncProductsData({
          page: 1,
        })
      );
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const asyncAddProduct = createAsyncThunk(
  "adminSlice/addProducts",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await addProducts(content);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${message}：${content.data?.title}`,
          status: "success",
        })
      );

      await dispatch(
        asyncProductsData({
          page: 1,
        })
      );
    } catch (error) {
      await dispatch(pushMessage(errorMessage(error)));
      await dispatch(setModalModifySuccess(false));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);
export const { setProducts, setPageInfo, setIsLoading, setModalModifySuccess } =
  adminSlice.actions;

export const selectProducts = (state) => state.adminSlice.products;
export const selectPageInfo = (state) => state.adminSlice.pageInfo;
export const selectLoading = (state) => state.adminSlice.isLoading;

export const selectModalModifySuccess = (state) =>
  state.adminSlice.modalModifySuccess;
export default adminSlice.reducer;
