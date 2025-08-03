import { apiUrl } from '@/components/utils';
import { create } from 'zustand'

const useUserStore = create((set, get) => ({
  user: {
    username: 'Ali Khan',
    role: 'admin',
    permissions: {
      assets: {
        view: true,
        create: true,
        edit: true,
        delete: true
      },
      listing: {
        view: true,
        create: true,
        edit: true,
        delete: true
      },
      vesting: {
        view: true,
        create: true,
        edit: true,
        delete: true
      },
    },
    image: '',
  },

  isLoggedIn: false,

  login: ({ username, role }) =>
    set({
      user: {
        username,
        role
      },
      isLoggedIn: true,
    }),


    

    logout: () => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      set({
        user: {
          username: '',
          role: '',
          permissions: {},
          image: '',
        },
        isLoggedIn: false,
      });
    },    


  getFreshToken: async () => {
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error("No refresh token found in sessionStorage");
      return null;
    }
    try {
      const response = await fetch(apiUrl+'/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }
      const data = await response.json();
      const newAccessToken = data.accessToken;

      if (newAccessToken) {
        sessionStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      } else {
        console.error("No access token received in response");
        return null;
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  }
}));



export default useUserStore;
