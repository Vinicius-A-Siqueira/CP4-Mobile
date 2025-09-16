import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { 
  Searchbar, 
  SegmentedButtons, 
  FAB, 
  Text,
} from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorComponent from '../components/common/ErrorComponent';
import EmptyStateComponent from '../components/common/EmptyStateComponent';

const TasksScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { tasks, loading, error } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  // Filtros
  const filterOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'completed', label: 'Concluídas' },
  ];

  // Filtrar tarefas
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Aplicar filtro de busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query)
      );
    }

    // Aplicar filtro de status
    if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tasks, searchQuery, filter]);

  const renderTask = ({ item }) => (
    <View style={[styles.taskItem, { backgroundColor: colors.surface }]}>
      <Text style={[styles.taskTitle, { color: colors.onSurface }]}>
        {item.title}
      </Text>
      {item.description && (
        <Text style={[styles.taskDescription, { color: colors.onSurface + '80' }]}>
          {item.description}
        </Text>
      )}
    </View>
  );

  const handleAddTask = () => {
    navigation.navigate('AddTask');
  };

  if (loading && tasks.length === 0) {
    return <LoadingComponent fullScreen />;
  }

  if (error) {
    return <ErrorComponent error={error} fullScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header com busca e filtros */}
      <View style={styles.header}>
        <Searchbar
          placeholder="Buscar tarefas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { backgroundColor: colors.surface }]}
        />

        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          buttons={filterOptions}
          style={styles.filterButtons}
        />
      </View>

      {/* Lista de tarefas */}
      {filteredTasks.length === 0 ? (
        <EmptyStateComponent
          icon="clipboard-text-outline"
          title="Nenhuma tarefa encontrada"
          message="Comece adicionando uma nova tarefa!"
          actionTitle="Adicionar Tarefa"
          onAction={handleAddTask}
        />
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* FAB para adicionar tarefa */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleAddTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  searchbar: {
    marginBottom: 16,
  },
  filterButtons: {
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 100,
  },
  taskItem: {
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TasksScreen;
