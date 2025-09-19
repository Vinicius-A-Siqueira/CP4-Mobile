import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n/i18n";

type LanguageContextType = {
  language: string;
  changeLanguage: (lang: "pt" | "en") => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState("pt");

  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem("language");
      if (storedLang) {
        setLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    })();
  }, []);

  const changeLanguage = async (lang: "pt" | "en") => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
