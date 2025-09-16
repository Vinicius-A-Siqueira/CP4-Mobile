import React, { useState, useEffect, useContext, createContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../constants/theme';

// Contexto do tema
const ThemeContext = createContext(null);

// Provider do contexto de tema
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState('system');
  const [loading, setLoading] = useState(true);

  // Determinar o tema atual baseado na preferência do usuário
  const getCurrentTheme = () => {
    if (theme === 'system') {
      return systemTheme || 'light';
    }
    return theme;
  };

  const currentTheme = getCurrentTheme();
  const themeColors = colors[currentTheme];

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app-theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Erro ao carregar tema salvo:', error);
    } finally {
      setLoading(false);
    }
  };

  const setAppTheme = async (newTheme) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('app-theme', newTheme);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    await setAppTheme(newTheme);
  };

  const value = {
    theme,
    currentTheme,
    colors: themeColors,
    setTheme: setAppTheme,
    toggleTheme,
    loading,
    isDark: currentTheme === 'dark',
    isLight: currentTheme === 'light',
    isSystem: theme === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para usar o contexto de tema
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }

  return context;
};

// Hook para criar estilos baseados no tema
export const useThemedStyles = (stylesFunction) => {
  const { colors, isDark } = useTheme();

  return stylesFunction(colors, isDark);
};

export default useTheme;
