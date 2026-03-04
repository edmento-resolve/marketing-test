// lib/axios.ts
import axios from 'axios';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});


/**
 * Forcefully clears all authentication related data from the browser
 */
const clearAuthSession = () => {
  if (typeof window === 'undefined') return;

  // 1. Clear common cookies using js-cookie
  const cookieNames = ['sessionId', 'role', 'reset_email'];
  cookieNames.forEach(name => {
    Cookies.remove(name, { path: '/' });
    Cookies.remove(name);
  });

  // 2. Fallback: Manual document.cookie clearing for all paths
  cookieNames.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });


};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Check if error logging should be suppressed
    if (error.config && (error.config as any)._suppressLog) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      // 0. Skip redirect for login requests to allow LoginForm to handle errors locally
      if (error.config?.url?.includes('/api/v1/auth/login')) {
        return Promise.reject(error);
      }

      console.warn('Unauthorized! Redirecting to login...');

      if (typeof window !== 'undefined') {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

        // Define cleanup and redirect - to be called after API or timeout
        const finalizeLogout = () => {
          clearAuthSession();
          window.location.href = '/auth/login?expired=1';
        };

        if (baseURL) {
          // Call logout API FIRST so the server sees the cookies and can invalidate them
          axios.post(`${baseURL}/api/v1/auth/logout`, {}, { withCredentials: true })
            .catch((logoutError) => {
              console.error("Logout API failed on 401:", logoutError);
            })
            .finally(() => {
              finalizeLogout();
            });

          // Safety timeout: if the logout API hangs, redirect anyway after 2 seconds
          setTimeout(finalizeLogout, 2000);
        } else {
          finalizeLogout();
        }
      } else {
        redirect('/auth/login');
      }
    }
    console.error('API Response Error:', error.response || error.message);
    return Promise.reject(error);
  }
);