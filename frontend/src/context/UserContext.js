import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }

        const res = await axios.get('https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user in context:', err);
        // Clear invalid token
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};