import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { 
  TextInput, 
  Button, 
  SegmentedButtons, 
  Card,
  Text,
  Switch,
  TouchableRipple
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const TaskForm = ({ 
  task = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate) : null,
    dueTime: task?.dueTime || '',
    hasReminder: !!(task?.dueDate && task?.dueTime),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      dueDate: formData.hasReminder ? formData.dueDate : null,
      dueTime: formData.hasReminder ? formData.dueTime : null,
    };

    onSubmit(taskData);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dueDate: selectedDate }));
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = format(selectedTime, 'HH:mm');
      setFormData(prev => ({ ...prev, dueTime: timeString }));
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <TextInput
            label={t('tasks.title')}
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            mode="outlined"
            style={styles.input}
            error={!formData.title.trim()}
          />

          <TextInput
            label={t('tasks.description')}
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Text style={[styles.label, { color: colors.onSurface }]}>
            {t('tasks.priority')}
          </Text>
          <SegmentedButtons
            value={formData.priority}
            onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
            buttons={priorityOptions}
            style={styles.priorityButtons}
          />

          <TouchableRipple
            onPress={() => setFormData(prev => ({ ...prev, hasReminder: !prev.hasReminder }))}
            style={styles.switchContainer}
          >
            <View style={styles.switchRow}>
              <Text style={[styles.label, { color: colors.onSurface }]}>
                Definir lembrete
              </Text>
              <Switch
                value={formData.hasReminder}
                onValueChange={(value) => setFormData(prev => ({ ...prev, hasReminder: value }))}
              />
            </View>
          </TouchableRipple>

          {formData.hasReminder && (
            <View style={styles.reminderContainer}>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
                icon="calendar"
              >
                {formData.dueDate 
                  ? format(formData.dueDate, 'dd/MM/yyyy', { locale: ptBR })
                  : 'Selecionar Data'
                }
              </Button>

              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.timeButton}
                icon="clock-outline"
              >
                {formData.dueTime || 'Selecionar Hora'}
              </Button>
            </View>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={formData.dueDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.cancelButton}
          disabled={loading}
        >
          {t('common.cancel')}
        </Button>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={loading}
          disabled={loading}
        >
          {isEditing ? t('common.save') : t('common.add')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  priorityButtons: {
    marginBottom: 16,
  },
  switchContainer: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reminderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
  },
  timeButton: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});

export default TaskForm;
