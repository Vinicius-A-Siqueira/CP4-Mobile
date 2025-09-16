import firebaseConfig, { GOOGLE_WEB_CLIENT_ID } from '../constants/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

class FirebaseService {
  constructor() {
    this.initializeFirebase();
    this.initializeGoogleSignIn();
  }

  initializeFirebase() {
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
      console.log('Firebase inicializado');
    } else {
      getApp();
    }
  }

  initializeGoogleSignIn() {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });
  }

  get auth() {
    return auth();
  }

  get firestore() {
    return firestore();
  }

  get googleSignIn() {
    return GoogleSignin;
  }

  // Verificar se o usuário está autenticado
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // Listener para mudanças no estado de autenticação
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }
}

// Exportar instância única (Singleton)
export default new FirebaseService();
