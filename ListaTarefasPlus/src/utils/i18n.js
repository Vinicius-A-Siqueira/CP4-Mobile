import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar traduções
import ptBR from '../../assets/locales/pt-BR.json';
import enUS from '../../assets/locales/en-US.json';

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      // Primeiro, tenta buscar o idioma salvo
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (savedLanguage) {
        return callback(savedLanguage);
      }

      // Se não encontrar, usa o idioma do sistema
      const systemLocale = Localization.locale;
      const supportedLocales = ['pt-BR', 'en-US'];

      // Verifica se o locale do sistema é suportado
      const matchedLocale = supportedLocales.find(locale => 
        systemLocale.startsWith(locale.split('-')[0])
      );

      callback(matchedLocale || 'pt-BR');
    } catch (error) {
      console.warn('Erro ao detectar idioma:', error);
      callback('pt-BR');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      await AsyncStorage.setItem('user-language', language);
    } catch (error) {
      console.warn('Erro ao salvar idioma:', error);
    }
  }
};

const resources = {
  'pt-BR': { translation: ptBR },
  'en-US': { translation: enUS },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt-BR',
    debug: __DEV__, // Debug apenas em desenvolvimento

    interpolation: {
      escapeValue: false, // React já faz escape dos valores
    },

    react: {
      useSuspense: false, // Importante para React Native
    },

    // Configurações de detecção
    detection: {
      // Cache do idioma selecionado
      caches: ['localStorage'],
    },
  });

export default i18n;

// Hook personalizado para mudança de idioma
export const changeLanguage = async (language) => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem('user-language', language);
  } catch (error) {
    console.error('Erro ao alterar idioma:', error);
  }
};

// Função para obter idiomas suportados
export const getSupportedLanguages = () => [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (USA)', flag: '🇺🇸' },
];
