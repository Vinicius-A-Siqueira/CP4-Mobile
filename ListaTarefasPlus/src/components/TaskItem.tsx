import React from "react";
import { View, StyleSheet } from "react-native";
import { Checkbox, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { toggleTask, deleteTask } from "../services/firestore";
import { Task } from "../types";

interface Props {
  task: Task;
  userId: string;
  toggleTask: (taskId: string, completed: boolean) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}


export default function TaskItem({ task, userId }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Checkbox
        status={task.completed ? "checked" : "unchecked"}
        onPress={() => toggleTask(userId, task.id, !task.completed)}
      />
      <Text style={[styles.text, task.completed && styles.completed]}>
        {task.title}
      </Text>
      <IconButton
        icon="delete"
        onPress={() => deleteTask(userId, task.id)}
        accessibilityLabel={t("deleteTask")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});
