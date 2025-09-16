import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

const LoadingComponent = ({ 
  size = 'large', 
  message, 
  fullScreen = false,
  style,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={[containerStyle, { backgroundColor: colors.background }, style]}>
      <ActivityIndicator 
        size={size} 
        color={colors.primary} 
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, { color: colors.onBackground }]}>
          {message}
        </Text>
      )}
      {!message && (
        <Text style={[styles.message, { color: colors.onBackground }]}>
          {t('common.loading')}
        </Text>
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
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LoadingComponent;
