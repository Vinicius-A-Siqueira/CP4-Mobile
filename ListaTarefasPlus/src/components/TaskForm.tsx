// src/components/TaskForm.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { addTask } from "../services/firestore";

interface Props {
  userId: string;
}

export default function TaskForm({ userId }: Props) {
  const [title, setTitle] = useState("");
  const { t } = useTranslation();

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTask(userId, title);
    setTitle("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        label={t("newTask")}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Button mode="contained" onPress={handleAdd}>
        {t("add")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 8, alignItems: "center" },
  input: { flex: 1, marginRight: 8 },
});
