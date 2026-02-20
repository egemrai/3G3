
import { configureStore } from "@reduxjs/toolkit"
import counterReducer from "./features/counter/counterSlice"
import filterReducer from "./features/filter/filterSlice"
import sortReducer from "./features/sort/sortSlice"
import pageReducer from "./features/page/pageSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    filter: filterReducer,
    sort: sortReducer,
    page: pageReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch