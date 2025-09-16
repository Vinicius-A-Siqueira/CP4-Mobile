import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Switch, Card, Button } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useAuthActions } from '../hooks/useAuth';

const SettingsScreen = ({ navigation }) => {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user } = useAuth();
  const { signOut } = useAuthActions();

  const handleThemeToggle = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    await setTheme(newTheme);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Seção do Usuário */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <List.Item
          title={user?.displayName || 'Usuário'}
          description={user?.email}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Profile')}
        />
      </Card>

      {/* Seção de Aparência */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <List.Subheader>Aparência</List.Subheader>

        <List.Item
          title="Modo Escuro"
          description="Alternar entre tema claro e escuro"
          left={(props) => <List.Icon {...props} icon="palette-outline" />}
          right={() => (
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
            />
          )}
        />
      </Card>

      {/* Seção Sobre */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <List.Subheader>Sobre</List.Subheader>

        <List.Item
          title="Versão"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information-outline" />}
        />

        <List.Item
          title="Desenvolvido para FIAP"
          description="CP4 - Mobile Application Development"
          left={(props) => <List.Icon {...props} icon="school-outline" />}
        />
      </Card>

      {/* Botão de Logout */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <List.Item
          title="Sair"
          titleStyle={{ color: colors.error }}
          left={(props) => <List.Icon {...props} icon="logout" color={colors.error} />}
          onPress={signOut}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
});

export default SettingsScreen;
