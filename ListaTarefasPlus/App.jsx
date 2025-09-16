import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Lista Tarefas Plus</Text>
        <Text style={styles.subtitle}>Projeto CP4 - FIAP</Text> 
        <Text style={styles.description}>
          ✅ React Native funcionando{'\n'}
          ✅ Expo funcionando{'\n'}
          ✅ Paper UI funcionando{'\n'}
          ⏳ Firebase será configurado em seguida
        </Text>
        <Button 
          mode="contained" 
          onPress={() => alert('App funcionando!')}
          style={styles.button}
        >
          Testar App
        </Button>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6200EE',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    marginTop: 20,
  },
});
