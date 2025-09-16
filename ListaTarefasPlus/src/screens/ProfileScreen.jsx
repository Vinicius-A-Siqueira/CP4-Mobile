import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text
            size={80}
            label={user?.displayName?.charAt(0) || 'U'}
            style={{ backgroundColor: colors.primary }}
          />
          <Text style={[styles.userName, { color: colors.onSurface }]}>
            {user?.displayName || 'Usuário'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.onSurface + '80' }]}>
            {user?.email}
          </Text>
        </Card.Content>
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
  profileContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 16,
    marginTop: 4,
  },
});

export default ProfileScreen;
