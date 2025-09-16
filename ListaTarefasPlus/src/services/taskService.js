import firebase from './firebase';

export class TaskService {

  // Obter coleção de tarefas do usuário
  getUserTasksCollection(userId) {
    return firebase.firestore
      .collection('users')
      .doc(userId)
      .collection('tasks');
  }

  // Adicionar nova tarefa
  async addTask(userId, taskData) {
    try {
      const tasksRef = this.getUserTasksCollection(userId);

      const task = {
        title: taskData.title,
        description: taskData.description || '',
        completed: false,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        dueTime: taskData.dueTime || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await tasksRef.add(task);

      return { 
        success: true, 
        taskId: docRef.id,
        task: { ...task, id: docRef.id }
      };
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return { success: false, error: 'Erro ao adicionar tarefa' };
    }
  }

  // Atualizar tarefa
  async updateTask(userId, taskId, updates) {
    try {
      const taskRef = this.getUserTasksCollection(userId).doc(taskId);

      const updateData = {
        ...updates,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await taskRef.update(updateData);

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return { success: false, error: 'Erro ao atualizar tarefa' };
    }
  }

  // Deletar tarefa
  async deleteTask(userId, taskId) {
    try {
      await this.getUserTasksCollection(userId).doc(taskId).delete();
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return { success: false, error: 'Erro ao deletar tarefa' };
    }
  }

  // Marcar tarefa como concluída/pendente
  async toggleTaskCompletion(userId, taskId, completed) {
    try {
      await this.updateTask(userId, taskId, { completed });
      return { success: true };
    } catch (error) {
      console.error('Erro ao alterar status da tarefa:', error);
      return { success: false, error: 'Erro ao alterar status da tarefa' };
    }
  }

  // Obter tarefas em tempo real
  subscribeToTasks(userId, callback) {
    return this.getUserTasksCollection(userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Converter Timestamp para Date
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            dueDate: doc.data().dueDate?.toDate(),
          }));
          callback(tasks);
        },
        (error) => {
          console.error('Erro ao escutar mudanças das tarefas:', error);
          callback(null, error);
        }
      );
  }

  // Obter tarefas por status
  subscribeToTasksByStatus(userId, completed, callback) {
    return this.getUserTasksCollection(userId)
      .where('completed', '==', completed)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate(),
            dueDate: doc.data().dueDate?.toDate(),
          }));
          callback(tasks);
        },
        (error) => {
          console.error('Erro ao filtrar tarefas:', error);
          callback(null, error);
        }
      );
  }

  // Buscar tarefas
  async searchTasks(userId, searchTerm) {
    try {
      const snapshot = await this.getUserTasksCollection(userId)
        .where('title', '>=', searchTerm)
        .where('title', '<=', searchTerm + '\uf8ff')
        .get();

      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      }));

      return { success: true, tasks };
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      return { success: false, error: 'Erro ao buscar tarefas' };
    }
  }

  // Obter estatísticas das tarefas
  async getTaskStats(userId) {
    try {
      const allTasksSnapshot = await this.getUserTasksCollection(userId).get();
      const completedTasksSnapshot = await this.getUserTasksCollection(userId)
        .where('completed', '==', true)
        .get();

      const total = allTasksSnapshot.size;
      const completed = completedTasksSnapshot.size;
      const pending = total - completed;

      return {
        success: true,
        stats: {
          total,
          completed,
          pending,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        }
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return { success: false, error: 'Erro ao obter estatísticas' };
    }
  }

  // Obter tarefas com vencimento próximo
  async getUpcomingTasks(userId, days = 7) {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + days);

      const snapshot = await this.getUserTasksCollection(userId)
        .where('completed', '==', false)
        .where('dueDate', '>=', now)
        .where('dueDate', '<=', futureDate)
        .orderBy('dueDate', 'asc')
        .get();

      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        dueDate: doc.data().dueDate?.toDate(),
      }));

      return { success: true, tasks };
    } catch (error) {
      console.error('Erro ao obter tarefas próximas:', error);
      return { success: false, error: 'Erro ao obter tarefas próximas' };
    }
  }
}

export default new TaskService();
