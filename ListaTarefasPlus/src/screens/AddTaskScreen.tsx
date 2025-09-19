import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { addTask } from "../services/firestore";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import * as Notifications from "expo-notifications";

interface Props {
  userId: string;
}

const AddTaskScreen: React.FC<Props> = ({ userId }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null); 

  const handleAddTask = async () => {
    if (!title.trim()) {
      Alert.alert(t("error"), t("addTask.emptyTitle"));
      return;
    }

    await addTask(userId, title);

    if (date) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: t("notification.title"),
          body: title,
          sound: true,
        },
        trigger: date,
      });
    }

    setTitle("");
    setDate(null);
    Alert.alert(t("success"), t("addTask.success"));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <TextInput
        label={t("addTask.title")}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* Aqui você pode adicionar um DatePicker para data */}
      {/* Ex: <DateTimePicker value={date || new Date()} onChange={setDate} /> */}

      <Button mode="contained" onPress={handleAddTask} style={styles.button}>
        {t("add")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { marginBottom: 16 },
  button: { marginTop: 8 },
});

export default AddTaskScreen;
