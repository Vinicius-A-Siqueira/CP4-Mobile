import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { useTasks } from '../hooks/useTasks';
import { useDashboardData } from '../hooks/useExternalApis';
import LoadingComponent from '../components/common/LoadingComponent';
import ErrorComponent from '../components/common/ErrorComponent';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { stats, upcomingTasks, overdueTasks, loading: tasksLoading } = useTasks();
  const { quote, weather, isLoading, refetchAll } = useDashboardData();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const userName = user?.displayName?.split(' ')[0] || 'Usuário';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetchAll}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header com saudação */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.onBackground }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.userName, { color: colors.primary }]}>
            {userName}! 👋
          </Text>
        </View>
      </View>

      {/* Estatísticas das tarefas */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
            📊 Resumo das Tarefas
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {stats.total}
              </Text>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>
                Total
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.secondary }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>
                Concluídas
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#FF9800' }]}>
                {stats.pending}
              </Text>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>
                Pendentes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.error }]}>
                {overdueTasks.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.onSurface }]}>
                Atrasadas
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Frase motivacional */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: colors.onSurface }]}>
            💭 Motivação Diária
          </Text>
          {quote.isLoading && <LoadingComponent message="Carregando frase inspiradora..." />}
          {quote.isError && (
            <ErrorComponent 
              error="Erro ao carregar frase" 
              onRetry={quote.refetch}
            />
          )}
          {quote.data && (
            <View>
              <Text style={[styles.quoteText, { color: colors.onSurface }]}>
                "{quote.data.text}"
              </Text>
              <Text style={[styles.quoteAuthor, { color: colors.onSurface + '80' }]}>
                — {quote.data.author}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Ação rápida */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Tasks', { screen: 'AddTask' })}
            icon="plus"
            style={styles.quickActionButton}
          >
            Adicionar Nova Tarefa
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    opacity: 0.8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.7,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    textAlign: 'right',
  },
  quickActionButton: {
    marginTop: 8,
  },
});

export default HomeScreen;
