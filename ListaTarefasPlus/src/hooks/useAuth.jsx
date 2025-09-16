import React, { useState, useEffect, useContext, createContext } from 'react';
import authService from '../services/authService';

// Contexto de autenticação
const AuthContext = createContext(null);

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = () => {
      unsubscribe = authService.onAuthStateChanged((user) => {
        setUser(user);
        setLoading(false);
        setInitialized(true);
      });
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    loading,
    initialized,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};

// Hook para operações de autenticação
export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signUp = async (email, password, name) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signUpWithEmailAndPassword(email, password, name);

      if (!result.success) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Erro inesperado no cadastro');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithEmailAndPassword(email, password);

      if (!result.success) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Erro inesperado no login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signInWithGoogle();

      if (!result.success) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Erro inesperado no login com Google');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.signOut();

      if (!result.success) {
        setError(result.error || 'Erro ao fazer logout');
        return false;
      }

      return true;
    } catch (err) {
      setError('Erro inesperado no logout');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.resetPassword(email);

      if (!result.success) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError('Erro inesperado ao resetar senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    loading,
    error,
    clearError,
  };
};

export default useAuth;
