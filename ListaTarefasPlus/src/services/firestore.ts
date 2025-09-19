import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Task } from "../types";

/**
 * Adiciona uma nova tarefa para o usuário
 */
export const addTask = async (userId: string, title: string) => {
  try {
    const docRef = await addDoc(collection(db, "users", userId, "tasks"), {
      title,
      completed: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    throw error;
  }
};

/**
 * Deleta uma tarefa específica
 */
export const deleteTask = async (userId: string, taskId: string) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
  }
};

/**
 * Marca/desmarca tarefa como concluída
 */
export const toggleTask = async (
  userId: string,
  taskId: string,
  completed: boolean
) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    await updateDoc(taskRef, { completed });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
};

/**
 * Escuta as tarefas do usuário em tempo real
 */
export const getTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  try {
    const tasksRef = collection(db, "users", userId, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasks: Task[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        tasks.push({
          id: docSnap.id,
          title: data.title,
          completed: data.completed,
          createdAt: data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(),
        });
      });
      callback(tasks);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return () => {};
  }
};
