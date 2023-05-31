import { useState, useMemo, useCallback } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const initialState = JSON.parse(localStorage.getItem('userInfo'));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(initialState ?? null);

  const logIn = useCallback((response) => {
    const data = JSON.stringify(response.data);
    localStorage.removeItem('userInfo');
    localStorage.setItem('userInfo', data);
    setUser(JSON.parse(data));
    setIsLoggedIn(true);
  }, []);

  const logOut = useCallback(() => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const getUserInfo = useCallback(() => user, [user]);

  const providedData = useMemo(() => ({
    isLoggedIn,
    logIn,
    logOut,
    getUserInfo,
  }), [isLoggedIn, logIn, logOut, getUserInfo]);

  return (
    <AuthContext.Provider value={providedData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
