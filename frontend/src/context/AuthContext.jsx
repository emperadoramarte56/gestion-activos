import { createContext, useContext, useState } from 'react';
import { apiLogin } from '../services/api'; // Importamos la función de login

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      // 1. Llamamos a la API real
      const data = await apiLogin(email, password);
      
      // 2. Guardamos el token en localStorage (esto soluciona el 403 Forbidden)
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // 3. Guardamos el usuario en el estado
      setUser(data.user);
      
      // 4. Retornamos el éxito para que Login.jsx pueda navegar
      return { ok: true, user: data.user };
    } catch (err) {
      // Retornamos el error para que Login.jsx lo muestre
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);