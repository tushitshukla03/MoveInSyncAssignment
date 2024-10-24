import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default localStorage
import userReducer from './userSlice'; // Import user reducer

// Configuration for redux-persist
const persistConfig = {
  key: 'user', // The key to store this in localStorage
  storage,     // Define the storage type (localStorage by default)
};

// Wrap the user reducer with persistReducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store and include the persisted reducer
const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Persisted user reducer
  },
});

// Create the persistor, which is responsible for rehydrating state
const persistor = persistStore(store);

export { store, persistor };
