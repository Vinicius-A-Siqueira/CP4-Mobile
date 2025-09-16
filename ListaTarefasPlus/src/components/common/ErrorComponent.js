import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const ErrorComponent = ({ 
  error, 
  onRetry, 
  fullScreen = false,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;
  const errorMessage = typeof error === 'string' ? error : error?.message || t('common.error');

  return (
    <View style={[containerStyle, { backgroundColor: colors.background }, style]}>
      <Icon 
        name="alert-circle-outline" 
        size={48} 
        color={colors.error} 
        style={styles.icon}
      />
      <Text style={[styles.title, { color: colors.error }]}>
        {t('common.error')}
      </Text>
      <Text style={[styles.message, { color: colors.onBackground }]}>
        {errorMessage}
      </Text>
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={styles.retryButton}
          icon="refresh"
        >
          {t('common.retry')}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 8,
  },
});

export default ErrorComponent;
