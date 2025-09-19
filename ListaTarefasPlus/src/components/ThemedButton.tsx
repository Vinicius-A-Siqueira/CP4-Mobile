import React from "react";
import { Button } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

interface Props {
  title: string;
  onPress: () => void;
}

export default function ThemedButton({ title, onPress }: Props) {
  const { isDark } = useTheme();

  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={{
        backgroundColor: isDark ? "#444" : "#2196f3",
        marginVertical: 6,
      }}
      labelStyle={{ color: "#fff" }}
    >
      {title}
    </Button>
  );
}
