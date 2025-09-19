import { useState, useEffect } from "react";
import { Task } from "../types";
import { addTask as addTaskService, toggleTask as toggleTaskService, deleteTask as deleteTaskService, getTasks } from "../services/firestore";

export const useTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = getTasks(userId, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTask = async (title: string) => {
    if (!userId) return;
    await addTaskService(userId, title);
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    if (!userId) return;
    await toggleTaskService(userId, taskId, completed);
  };

  const deleteTask = async (taskId: string) => {
    if (!userId) return;
    await deleteTaskService(userId, taskId);
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
  };
};
