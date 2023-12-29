import { configureStore } from "@reduxjs/toolkit";
import StoreReducer from "./redux/StoreReducer";

export default configureStore({
    reducer: {
        store: StoreReducer,
    },
});
