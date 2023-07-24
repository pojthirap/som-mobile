import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const devMiddleware = [];

const store = configureStore({
  reducer: rootReducer,
  // middleware: getDefaultMiddleware().concat(devMiddleware),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});

export default store;
