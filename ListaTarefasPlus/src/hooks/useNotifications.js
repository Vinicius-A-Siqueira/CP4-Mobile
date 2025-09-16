import { useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';

export const useNotifications = () => {
  const [permissions, setPermissions] = useState({
    status: 'undetermined',
    canAskAgain: true,
  });
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    try {
      setLoading(true);
      const isEnabled = await notificationService.areNotificationsEnabled();
      setEnabled(isEnabled);
    } catch (error) {
      console.error('Erro ao verificar status das notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = useCallback(async () => {
    try {
      const granted = await notificationService.requestPermissions();
      await checkNotificationStatus();
      return granted;
    } catch (error) {
      console.error('Erro ao solicitar permissões:', error);
      return false;
    }
  }, []);

  const toggleNotifications = useCallback(async (newEnabled) => {
    try {
      if (newEnabled && !enabled) {
        // Se está habilitando, primeiro solicita permissões
        const granted = await requestPermissions();
        if (!granted) {
          return false;
        }
      }

      const success = await notificationService.toggleNotifications(newEnabled);

      if (success) {
        setEnabled(newEnabled);
      }

      return success;
    } catch (error) {
      console.error('Erro ao alterar configuração de notificações:', error);
      return false;
    }
  }, [enabled, requestPermissions]);

  const scheduleTaskNotification = useCallback(async (task) => {
    if (!enabled) {
      console.log('Notificações desabilitadas');
      return null;
    }

    try {
      return await notificationService.scheduleTaskNotification(task);
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }, [enabled]);

  const cancelTaskNotification = useCallback(async (taskId) => {
    try {
      await notificationService.cancelTaskNotification(taskId);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }, []);

  const showImmediateNotification = useCallback(async (title, body, data = {}) => {
    if (!enabled) return null;

    try {
      return await notificationService.showImmediateNotification(title, body, data);
    } catch (error) {
      console.error('Erro ao mostrar notificação:', error);
      return null;
    }
  }, [enabled]);

  const getScheduledNotifications = useCallback(async () => {
    try {
      return await notificationService.getScheduledNotifications();
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }, []);

  const cancelAllNotifications = useCallback(async () => {
    try {
      await notificationService.cancelAllNotifications();
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }, []);

  return {
    permissions,
    enabled,
    loading,
    requestPermissions,
    toggleNotifications,
    scheduleTaskNotification,
    cancelTaskNotification,
    showImmediateNotification,
    getScheduledNotifications,
    cancelAllNotifications,
    checkNotificationStatus,
  };
};

export default useNotifications;
