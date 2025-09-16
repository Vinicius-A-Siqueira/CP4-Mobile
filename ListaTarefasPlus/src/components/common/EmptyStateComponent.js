import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';

const EmptyStateComponent = ({ 
  icon = 'inbox-outline',
  title,
  message,
  actionTitle,
  onAction,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <Icon 
        name={icon} 
        size={64} 
        color={colors.onBackground + '60'} // 40% opacity
        style={styles.icon}
      />
      {title && (
        <Text style={[styles.title, { color: colors.onBackground }]}>
          {title}
        </Text>
      )}
      {message && (
        <Text style={[styles.message, { color: colors.onBackground + '80' }]}>
          {message}
        </Text>
      )}
      {actionTitle && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.actionButton}
        >
          {actionTitle}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButton: {
    marginTop: 8,
  },
});

export default EmptyStateComponent;
