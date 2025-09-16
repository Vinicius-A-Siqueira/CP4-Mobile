import firebase from './firebase';
import { Alert } from 'react-native';

export class AuthService {

  // Cadastro com email e senha
  async signUpWithEmailAndPassword(email, password, name) {
    try {
      const userCredential = await firebase.auth.createUserWithEmailAndPassword(email, password);

      // Atualizar o perfil com o nome
      await userCredential.user.updateProfile({
        displayName: name,
      });

      // Criar documento do usuário no Firestore
      await this.createUserDocument(userCredential.user);

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login com email e senha
  async signInWithEmailAndPassword(email, password) {
    try {
      const userCredential = await firebase.auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login com Google
  async signInWithGoogle() {
    try {
      // Fazer login com Google
      await firebase.googleSignIn.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await firebase.googleSignIn.signIn();

      // Criar credencial do Firebase
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(idToken);

      // Fazer login no Firebase
      const userCredential = await firebase.auth.signInWithCredential(googleCredential);

      // Criar documento do usuário se for novo
      await this.createUserDocument(userCredential.user);

      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Logout
  async signOut() {
    try {
      await firebase.auth.signOut();

      // Fazer logout do Google também
      if (await firebase.googleSignIn.isSignedIn()) {
        await firebase.googleSignIn.signOut();
      }

      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  }

  // Resetar senha
  async resetPassword(email) {
    try {
      await firebase.auth.sendPasswordResetEmail(email);
      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Criar documento do usuário no Firestore
  async createUserDocument(user) {
    try {
      const userRef = firebase.firestore.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        await userRef.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Erro ao criar documento do usuário:', error);
    }
  }

  // Traduzir códigos de erro do Firebase
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está em uso',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Conta desativada',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet',
      'auth/invalid-credential': 'Credenciais inválidas',
    };

    return errorMessages[errorCode] || 'Erro inesperado. Tente novamente';
  }

  // Obter usuário atual
  getCurrentUser() {
    return firebase.getCurrentUser();
  }

  // Listener para mudanças de autenticação
  onAuthStateChanged(callback) {
    return firebase.onAuthStateChanged(callback);
  }
}

export default new AuthService();
