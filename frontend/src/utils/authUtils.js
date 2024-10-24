// utils/authUtils.js

import { store } from './store'; 
import { setUser, logoutUser } from '.userSlice'; 

export const refreshAccessToken = async () => {
  const state = store.getState();
  const refreshToken = state.user.refreshToken;

  if (!refreshToken) {
    return;
  }

  try {
    const response = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      store.dispatch(setUser({
        user: state.user.user, 
        access: data.access, 
        refresh: refreshToken, 
      }));
      return data.access; 
    } else {
      store.dispatch(logoutUser());
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
};
