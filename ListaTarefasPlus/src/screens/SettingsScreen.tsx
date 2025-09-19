import React from "react";
import { View, StyleSheet, Text, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-paper";

const SettingsScreen: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <Text style={[styles.label, { color: isDark ? "#fff" : "#000" }]}>
        {t("theme")}
      </Text>
      <Switch value={isDark} onValueChange={toggleTheme} />

      <Text style={[styles.label, { color: isDark ? "#fff" : "#000", marginTop: 16 }]}>
        {t("language")} ({language.toUpperCase()})
      </Text>

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={() => changeLanguage("pt")}>PT</Button>
        <Button mode="outlined" onPress={() => changeLanguage("en")}>EN</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
});

export default SettingsScreen;
