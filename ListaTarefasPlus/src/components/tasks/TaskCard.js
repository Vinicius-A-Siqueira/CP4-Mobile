import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, IconButton, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const TaskCard = ({ 
  task, 
  onPress, 
  onToggleComplete, 
  onEdit, 
  onDelete 
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleDelete = () => {
    Alert.alert(
      t('tasks.deleteTask'),
      'Tem certeza que deseja excluir esta tarefa?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => onDelete(task.id)
        }
      ]
    );
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    let color = colors.onSurface;
    let icon = 'calendar-outline';
    let label = format(dueDate, 'dd/MM/yyyy', { locale: ptBR });

    if (isPast(dueDate) && !task.completed) {
      color = colors.error;
      icon = 'calendar-alert';
      label = 'Atrasada';
    } else if (isToday(dueDate)) {
      color = colors.primary;
      icon = 'calendar-today';
      label = t('common.today');
    } else if (isTomorrow(dueDate)) {
      color = colors.secondary;
      icon = 'calendar-tomorrow';
      label = t('common.tomorrow');
    }

    return { color, icon, label };
  };

  const dueDateInfo = getDueDateInfo();
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed;

  return (
    <Card 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.surface,
          borderLeftColor: task.completed ? colors.secondary : colors.primary,
          opacity: task.completed ? 0.7 : 1,
        },
        isOverdue && { borderLeftColor: colors.error }
      ]}
      elevation={2}
    >
      <TouchableOpacity onPress={() => onPress(task)} activeOpacity={0.7}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => onToggleComplete(task.id)}
              style={styles.checkboxContainer}
            >
              <Icon
                name={task.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                size={24}
                color={task.completed ? colors.secondary : colors.primary}
              />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text 
                style={[
                  styles.title, 
                  { color: colors.onSurface },
                  task.completed && styles.completedTitle
                ]}
                numberOfLines={2}
              >
                {task.title}
              </Text>

              {task.description && (
                <Text 
                  style={[
                    styles.description, 
                    { color: colors.onSurface + '80' },
                    task.completed && styles.completedText
                  ]}
                  numberOfLines={2}
                >
                  {task.description}
                </Text>
              )}
            </View>

            <View style={styles.actions}>
              <IconButton
                icon="pencil-outline"
                size={20}
                onPress={() => onEdit(task)}
                iconColor={colors.onSurface + '80'}
              />
              <IconButton
                icon="delete-outline"
                size={20}
                onPress={handleDelete}
                iconColor={colors.error}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.tags}>
              {task.priority && (
                <Chip 
                  mode="outlined" 
                  compact 
                  style={[
                    styles.priorityChip,
                    { 
                      borderColor: getPriorityColor(task.priority, colors),
                    }
                  ]}
                  textStyle={{
                    color: getPriorityColor(task.priority, colors),
                    fontSize: 12,
                  }}
                >
                  {getPriorityLabel(task.priority)}
                </Chip>
              )}

              {dueDateInfo && (
                <View style={[styles.dueDateContainer, { backgroundColor: dueDateInfo.color + '20' }]}>
                  <Icon name={dueDateInfo.icon} size={14} color={dueDateInfo.color} />
                  <Text style={[styles.dueDateText, { color: dueDateInfo.color }]}>
                    {dueDateInfo.label}
                  </Text>
                  {task.dueTime && (
                    <Text style={[styles.dueTimeText, { color: dueDateInfo.color }]}>
                      {task.dueTime}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};

const getPriorityColor = (priority, colors) => {
  switch (priority) {
    case 'high':
      return colors.error;
    case 'medium':
      return '#FF9800'; // Orange
    case 'low':
      return colors.secondary;
    default:
      return colors.onSurface;
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Média';
    case 'low':
      return 'Baixa';
    default:
      return priority;
  }
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
    borderLeftWidth: 4,
  },
  content: {
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  actions: {
    flexDirection: 'row',
  },
  footer: {
    marginTop: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityChip: {
    height: 24,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dueTimeText: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default TaskCard;
