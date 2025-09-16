# 🔧 Configurações Importantes

## ⚠️ ANTES DE EXECUTAR O PROJETO

### 1. Configuração do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Configure Authentication:
   - Vá para Authentication > Sign-in method
   - Habilite Email/Password
   - Habilite Google
   - Adicione domínios autorizados se necessário

4. Configure Firestore:
   - Vá para Firestore Database
   - Crie banco de dados
   - Configure regras iniciais:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /tasks/{taskId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```

5. Obtenha as configurações:
   - Vá para Project Settings > Your apps
   - Adicione um app web
   - Copie as configurações

6. Atualize `src/constants/firebaseConfig.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "SUA_API_KEY",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto-id",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

### 2. Configuração do Google Sign-In

1. No Firebase Console, vá para Authentication > Sign-in method > Google
2. Copie o Web client ID
3. Atualize `GOOGLE_WEB_CLIENT_ID` em `firebaseConfig.js`

### 3. APIs Externas (Opcional)

#### OpenWeatherMap API
1. Registre-se em [OpenWeatherMap](https://openweathermap.org/api)
2. Obtenha sua API key gratuita
3. Atualize `API_KEYS.OPENWEATHER` em `src/constants/api.js`

### 4. Comandos Essenciais

```bash
# Instalar dependências
npm install

# Instalar CLI do EAS
npm install -g @expo/eas-cli

# Iniciar desenvolvimento
npx expo start

# Build APK para produção
eas login
eas build --profile production --platform android

# Executar no emulador Android
npx expo run:android

# Limpar cache
npx expo start --clear
```

### 5. Estrutura de Dados Firestore

```
users/
  {userId}/
    - uid: string
    - email: string
    - displayName: string
    - createdAt: timestamp
    - updatedAt: timestamp

    tasks/
      {taskId}/
        - title: string
        - description: string
        - completed: boolean
        - priority: 'low' | 'medium' | 'high'
        - dueDate: timestamp | null
        - dueTime: string | null
        - createdAt: timestamp
        - updatedAt: timestamp
```

### 6. Variáveis de Ambiente

Crie um arquivo `.env` na raiz (opcional):
```
EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
EXPO_PUBLIC_OPENWEATHER_API_KEY=sua-weather-key
```

### 7. Permissões Android

Verifique se estas permissões estão no `app.json`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "NOTIFICATIONS",
        "SCHEDULE_EXACT_ALARM",
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

### 8. Build Profiles (eas.json)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## 🚨 Troubleshooting Comum

### Firebase não conecta
- Verifique se as configurações estão corretas
- Confirme se o projeto Firebase está ativo
- Verifique se Authentication e Firestore estão habilitados

### Google Sign-In falha
- Confirme o Web Client ID
- Verifique se o Google Sign-In está habilitado no Firebase
- Execute `npx expo run:android` para builds com credenciais nativas

### Notificações não funcionam
- Teste sempre em dispositivo físico
- Verifique permissões no dispositivo
- Confirme configuração do canal de notificação

### Build falha
- Verifique se todas as dependências estão instaladas
- Confirme configurações do EAS
- Verifique logs detalhados com `eas build --profile production --platform android --verbose`

### Erros de dependências
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Metro
npx expo start --clear
```

## 📱 Testes

### Dispositivos Testados
- Android 8.0+ (API 26+)
- iOS 12.0+ (via Expo Go)

### Funcionalidades a Testar
- [ ] Login com email/senha
- [ ] Login com Google  
- [ ] Criação de tarefas
- [ ] Edição de tarefas
- [ ] Exclusão de tarefas
- [ ] Sincronização tempo real
- [ ] Troca de temas
- [ ] Troca de idiomas
- [ ] Notificações (dispositivo físico)
- [ ] APIs externas (quotes/weather)

## 🎯 Lista de Verificação Final

- [ ] Firebase configurado
- [ ] Google Sign-In funcionando
- [ ] Firestore regras configuradas
- [ ] APIs externas configuradas
- [ ] Tradução PT/EN completa
- [ ] Temas claro/escuro funcionando
- [ ] Notificações testadas em dispositivo físico
- [ ] Build APK gerado com sucesso
- [ ] README atualizado com nomes dos integrantes
- [ ] Vídeo demonstrativo gravado (máx. 5 min)

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do console
2. Consulte a documentação oficial do Expo/Firebase
3. Verifique issues conhecidas no GitHub
4. Teste em dispositivo físico se for problema do simulador

---
**Boa sorte com o CP4! 🚀**
