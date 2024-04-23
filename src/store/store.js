import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./global/globalReducer";

export default configureStore({
  reducer: { global: globalReducer },
});
