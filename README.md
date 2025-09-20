# CP 4 - Mobile

## Integrantes do grupo
- Vinicius Alves Siqueira | RM: 551939  
- Kauan Felipe de Souza | RM: 557954  
- Gabriel Camargo Ravanhani | RM: 557879  

Link do Video: https://youtu.be/SjsWpOLKv5M?si=lcocOqFt95n3qPYr 

---

## Descrição do projeto
O **ListaTarefasPlus** é um aplicativo móvel desenvolvido com **React Native e Expo**, integrado ao **Firebase**, que permite aos usuários:

- Fazer login com **Google Authentication**.
- Criar, visualizar, atualizar e excluir tarefas.
- Marcar tarefas como concluídas ou pendentes.
- Sincronizar tarefas em tempo real com **Firestore**.
- Suporte a múltiplos idiomas com **i18next**.
- Experiência visual consistente com **React Native Paper** e suporte a tema claro/escuro.

O app foi desenvolvido como parte do CP4 da disciplina de Desenvolvimento de Aplicações Móveis.

---

## Tecnologias utilizadas
- **React Native / Expo**
- **TypeScript**
- **Firebase Authentication**
- **Firestore (Realtime Database)**
- **React Native Paper** (UI Components)
- **i18next** (Tradução/Internacionalização)
- **React Query** (Gerenciamento de estado e cache)
- **Expo Auth Session** (Login Google)
- **AsyncStorage** (Armazenamento local, se necessário)

---

## Estrutura do projeto

```
ListaTarefasPlus/
│
├── assets/                 # Imagens, ícones e splash screen
├── src/
│   ├── components/         # Componentes reutilizáveis (TaskItem, TaskForm, etc.)
│   ├── context/            # Contextos para tema e idioma
│   ├── navigation/         # Stack e Tabs de navegação
│   ├── screens/            # Telas (HomeScreen, AboutScreen, LoginScreen, etc.)
│   ├── services/           # Firebase e Firestore services
│   ├── types/              # Tipos TypeScript
│   └── i18n/               # Configuração de tradução
├── App.tsx                 # Componente principal do app
└── package.json
```

---

## Como executar o projeto

### Pré-requisitos
- Node.js >= 18
- Expo CLI
- Conta Firebase configurada

### Passos
1. Clonar o repositório:

```bash
git clone https://github.com/Vinicius-A-Siqueira/CP4-Mobile.git
cd CP4-Mobile/ListaTarefasPlus
```

2. Instalar dependências:

```bash
npm install
# ou
yarn install
```

3. Configurar Firebase:
   - Criar um projeto no [Firebase](https://console.firebase.google.com/).
   - Habilitar **Authentication (Google)**.
   - Criar coleção **users** no Firestore.
   - Substituir as credenciais no arquivo `src/services/firebase.ts`.

4. Executar o app:

```bash
npx expo start
```

5. Abrir no **Expo Go** ou em um emulador.

---

## Observações
- Para o login Google no **Expo Go**, use a opção de proxy (`useProxy: true`) ao gerar o redirect URI.
- A funcionalidade de Analytics funciona apenas em builds nativos (iOS/Android), não no Expo Go.
- Certifique-se de adicionar as URIs corretas de redirecionamento no console do Google Cloud.

---

## Funcionalidades futuras
- Filtros de tarefas (por status: concluída/pendente)
- Notificações push
- Sincronização offline
- Integração com outras redes sociais para login

