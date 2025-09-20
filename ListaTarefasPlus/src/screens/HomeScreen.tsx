import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { auth } from "../services/firebase";
import { signInWithCredential, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import { getTasks, toggleTask, deleteTask } from "../services/firestore";
import { Task } from "../types";
import { useTranslation } from "react-i18next";

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "200694114878-a6fbtg27uhpaclgrm85vhlbteqdej6hr.apps.googleusercontent.com",
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true } as any),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Realiza login com Google
  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      const { idToken, accessToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      signInWithCredential(auth, credential).catch(err => console.error("Erro login Google:", err));
    }
  }, [response]);

  // Busca tarefas do usuário
  useEffect(() => {
    if (!user) return;
    const unsubscribe = getTasks(user.uid, setTasks);
    return unsubscribe;
  }, [user]);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>{t("welcome")}</Text>
        <Button
          mode="contained"
          onPress={() => promptAsync()}
          disabled={!request}
        >
          {t("loginGoogle")}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.user}>{t("hello")}, {user.displayName}</Text>
      <TaskForm userId={user.uid} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            userId={user.uid}
            toggleTask={(id, completed) => toggleTask(user.uid, id, completed)}
            deleteTask={(id) => deleteTask(user.uid, id)}
          />
        )}
      />
      <Button
        mode="outlined"
        onPress={() => signOut(auth)}
        style={{ marginTop: 16 }}
      >
        {t("logout")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  user: { fontSize: 18, marginBottom: 12 },
});
