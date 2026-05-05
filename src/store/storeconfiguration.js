import { configureStore } from "@reduxjs/toolkit";

import adminAuthReducer from "./slices/adminAuthSlice";
import cityReducer from "./slices/citySlice";
import girlReducer from "./slices/girlSlice";
import stateReducer from "./slices/stateSlice";
import contactReducer from "./slices/contactSlice";
import reviewReducer from "./slices/reviewSlice";
import blogReducer from "./slices/blogSlice";
import subCityReducer from "./slices/subCitySlice";
import faqReducer from "./slices/faqSlice";

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    city: cityReducer,
    girls: girlReducer,
    states: stateReducer,
    contacts: contactReducer,
    review: reviewReducer,
    blog : blogReducer,
     subCity: subCityReducer,
     faq: faqReducer,
  },
});