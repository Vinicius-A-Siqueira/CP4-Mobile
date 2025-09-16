import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import notificationService from '../services/notificationService';
import { useAuth } from './useAuth';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Inscrever-se para mudanças em tempo real
    const unsubscribe = taskService.subscribeToTasks(
      user.uid,
      (tasksData, error) => {
        if (error) {
          setError('Erro ao carregar tarefas');
          console.error(error);
        } else {
          setTasks(tasksData || []);
          setError(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Adicionar nova tarefa
  const addTask = useCallback(async (taskData) => {
    if (!user?.uid) return { success: false, error: 'Usuário não autenticado' };

    try {
      const result = await taskService.addTask(user.uid, taskData);

      if (result.success) {
        // Agendar notificação se a tarefa tem data/hora
        if (taskData.dueDate && taskData.dueTime) {
          await notificationService.scheduleTaskNotification(result.task);
        }
      }

      return result;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return { success: false, error: 'Erro ao adicionar tarefa' };
    }
  }, [user?.uid]);

  // Atualizar tarefa
  const updateTask = useCallback(async (taskId, updates) => {
    if (!user?.uid) return { success: false, error: 'Usuário não autenticado' };

    try {
      const result = await taskService.updateTask(user.uid, taskId, updates);

      if (result.success) {
        // Reagendar notificação se mudou data/hora
        if (updates.dueDate !== undefined || updates.dueTime !== undefined) {
          const updatedTask = { ...tasks.find(t => t.id === taskId), ...updates };
          await notificationService.rescheduleTaskNotification(updatedTask);
        }

        // Cancelar notificação se tarefa foi concluída
        if (updates.completed === true) {
          await notificationService.cancelTaskNotification(taskId);
        }
      }

      return result;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return { success: false, error: 'Erro ao atualizar tarefa' };
    }
  }, [user?.uid, tasks]);

  // Deletar tarefa
  const deleteTask = useCallback(async (taskId) => {
    if (!user?.uid) return { success: false, error: 'Usuário não autenticado' };

    try {
      const result = await taskService.deleteTask(user.uid, taskId);

      if (result.success) {
        // Cancelar notificação
        await notificationService.cancelTaskNotification(taskId);
      }

      return result;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return { success: false, error: 'Erro ao deletar tarefa' };
    }
  }, [user?.uid]);

  // Alternar conclusão da tarefa
  const toggleTaskCompletion = useCallback(async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { success: false, error: 'Tarefa não encontrada' };

    const newStatus = !task.completed;
    return await updateTask(taskId, { completed: newStatus });
  }, [tasks, updateTask]);

  // Obter estatísticas
  const getStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [tasks]);

  // Filtrar tarefas
  const getTasksByStatus = useCallback((completed) => {
    return tasks.filter(task => task.completed === completed);
  }, [tasks]);

  // Buscar tarefas
  const searchTasks = useCallback((searchTerm) => {
    if (!searchTerm.trim()) return tasks;

    const term = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description?.toLowerCase().includes(term)
    );
  }, [tasks]);

  // Tarefas próximas do vencimento
  const getUpcomingTasks = useCallback((days = 7) => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return tasks.filter(task =>
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate) >= now &&
      new Date(task.dueDate) <= futureDate
    ).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  // Tarefas atrasadas
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Começar do início do dia

    return tasks.filter(task =>
      !task.completed &&
      task.dueDate &&
      new Date(task.dueDate) < now
    );
  }, [tasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getStats,
    getTasksByStatus,
    searchTasks,
    getUpcomingTasks,
    getOverdueTasks,
    // Dados derivados
    completedTasks: getTasksByStatus(true),
    pendingTasks: getTasksByStatus(false),
    stats: getStats(),
    upcomingTasks: getUpcomingTasks(),
    overdueTasks: getOverdueTasks(),
  };
};

export default useTasks;
