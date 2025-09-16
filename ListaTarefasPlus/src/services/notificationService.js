import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NOTIFICATION_CONFIG } from '../constants/api';

// Configurar como as notificações devem ser tratadas quando recebidas
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {

  constructor() {
    this.initializeNotifications();
  }

  // Inicializar serviço de notificações
  async initializeNotifications() {
    try {
      // Criar canal de notificação no Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(NOTIFICATION_CONFIG.channelId, {
          name: NOTIFICATION_CONFIG.channelName,
          description: NOTIFICATION_CONFIG.channelDescription,
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6200EE',
        });
      }

      // Solicitar permissões
      await this.requestPermissions();
    } catch (error) {
      console.error('Erro ao inicializar notificações:', error);
    }
  }

  // Solicitar permissões de notificação
  async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissão de Notificação',
          'Para receber lembretes das suas tarefas, habilite as notificações nas configurações do app.'
        );
        return false;
      }

      // Salvar que as permissões foram concedidas
      await AsyncStorage.setItem('notifications-enabled', 'true');
      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }

  // Verificar se as notificações estão habilitadas
  async areNotificationsEnabled() {
    try {
      const enabled = await AsyncStorage.getItem('notifications-enabled');
      const { status } = await Notifications.getPermissionsAsync();
      return enabled === 'true' && status === 'granted';
    } catch (error) {
      console.error('Erro ao verificar status das notificações:', error);
      return false;
    }
  }

  // Agendar notificação para uma tarefa
  async scheduleTaskNotification(task) {
    try {
      const enabled = await this.areNotificationsEnabled();
      if (!enabled) {
        console.log('Notificações desabilitadas');
        return null;
      }

      if (!task.dueDate || !task.dueTime) {
        console.log('Tarefa sem data/hora definida');
        return null;
      }

      // Criar data da notificação
      const notificationDate = new Date(task.dueDate);
      const [hours, minutes] = task.dueTime.split(':');
      notificationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Verificar se a data não é no passado
      if (notificationDate <= new Date()) {
        console.log('Data da notificação no passado');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Tarefa 📝',
          body: task.title,
          data: { taskId: task.id, type: 'task-reminder' },
          categoryIdentifier: 'task-reminder',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationDate,
          channelId: NOTIFICATION_CONFIG.channelId,
        },
      });

      // Salvar ID da notificação para poder cancelar depois
      await AsyncStorage.setItem(`notification-${task.id}`, notificationId);

      console.log(`Notificação agendada: ${notificationId} para ${notificationDate}`);
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  // Cancelar notificação de uma tarefa
  async cancelTaskNotification(taskId) {
    try {
      const notificationId = await AsyncStorage.getItem(`notification-${taskId}`);
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        await AsyncStorage.removeItem(`notification-${taskId}`);
        console.log(`Notificação cancelada: ${notificationId}`);
      }
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  // Reagendar notificação quando tarefa for atualizada
  async rescheduleTaskNotification(task) {
    try {
      // Primeiro cancela a notificação existente
      await this.cancelTaskNotification(task.id);

      // Depois agenda uma nova
      return await this.scheduleTaskNotification(task);
    } catch (error) {
      console.error('Erro ao reagendar notificação:', error);
      return null;
    }
  }

  // Mostrar notificação imediata
  async showImmediateNotification(title, body, data = {}) {
    try {
      const enabled = await this.areNotificationsEnabled();
      if (!enabled) return null;

      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          categoryIdentifier: 'immediate',
        },
        trigger: null, // Mostrar imediatamente
      });
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      return null;
    }
  }

  // Obter todas as notificações agendadas
  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }

  // Cancelar todas as notificações agendadas
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Limpar IDs salvos no AsyncStorage
      const keys = await AsyncStorage.getAllKeys();
      const notificationKeys = keys.filter(key => key.startsWith('notification-'));
      if (notificationKeys.length > 0) {
        await AsyncStorage.multiRemove(notificationKeys);
      }

      console.log('Todas as notificações foram canceladas');
    } catch (error) {
      console.error('Erro ao cancelar notificações:', error);
    }
  }

  // Habilitar/desabilitar notificações
  async toggleNotifications(enabled) {
    try {
      await AsyncStorage.setItem('notifications-enabled', enabled ? 'true' : 'false');

      if (!enabled) {
        await this.cancelAllNotifications();
      }

      return true;
    } catch (error) {
      console.error('Erro ao alterar status das notificações:', error);
      return false;
    }
  }

  // Listener para notificações recebidas
  addNotificationReceivedListener(listener) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  // Listener para quando o usuário toca na notificação
  addNotificationResponseReceivedListener(listener) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Remover listeners
  removeNotificationSubscription(subscription) {
    if (subscription) {
      subscription.remove();
    }
  }
}

export default new NotificationService();
