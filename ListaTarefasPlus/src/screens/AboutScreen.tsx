import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";

const AboutScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "white" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "black" }}>
        {t("about.title")}
      </Text>
      <Text style={{ color: "black" }}>{t("about.description")}</Text>
    </View>
  );
};

export default AboutScreen;
