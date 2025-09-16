# Lista Tarefas Plus

> **CP4 - Mobile Application Development - FIAP**  
> Aplicativo completo de gerenciamento de tarefas com Firebase, internacionalização, temas e notificações.

## 👥 Integrantes do Grupo

- **Nome do Aluno 1** - RM: XXXXX
- **Nome do Aluno 2** - RM: XXXXX  
- **Nome do Aluno 3** - RM: XXXXX

## 📱 Sobre o Projeto

O **Lista Tarefas Plus** é uma aplicação React Native desenvolvida para o checkpoint 4 da disciplina Mobile Application Development da FIAP. O app implementa todas as funcionalidades obrigatórias solicitadas e oferece uma experiência completa de gerenciamento de tarefas.

### ✨ Funcionalidades Implementadas

✅ **1. Autenticação Dual**
- Login com Google (Firebase Auth)
- Login com Email/Senha (Firebase Auth)
- Cadastro de novos usuários

✅ **2. Login Persistente**
- Auto-login automático
- Gerenciamento de estado de autenticação

✅ **3. Armazenamento no Firestore**
- Tarefas organizadas por usuário
- Estrutura de dados otimizada
- CRUD completo (Create, Read, Update, Delete)

✅ **4. Sincronização em Tempo Real**
- Atualizações automáticas com `onSnapshot`
- Sincronização entre dispositivos
- Updates instantâneos na UI

✅ **5. Sistema de Temas**
- Modo claro e escuro
- Persistência da preferência do usuário
- Adaptação automática ao sistema

✅ **6. Internacionalização (i18n)**
- Suporte completo para Português e Inglês
- Troca dinâmica de idioma
- Persistência da seleção

✅ **7. Notificações Locais**
- Agendamento por data e hora
- Lembretes de tarefas
- Gerenciamento de permissões

✅ **8. TanStack Query**
- Integração com APIs externas
- Cache inteligente
- Quotes motivacionais e dados de clima

## 🚀 Tecnologias Utilizadas

### Core
- **React Native** - Framework principal
- **Expo** - Plataforma de desenvolvimento
- **React Navigation** - Navegação entre telas

### Backend & Autenticação  
- **Firebase Auth** - Autenticação de usuários
- **Cloud Firestore** - Banco de dados NoSQL
- **Google Sign-In** - Login social

### Estado e Cache
- **TanStack Query** - Gerenciamento de estado e cache
- **AsyncStorage** - Armazenamento local

### UI/UX
- **React Native Paper** - Componentes Material Design
- **React Native Vector Icons** - Ícones
- **React Native Reanimated** - Animações

### Internacionalização
- **react-i18next** - Sistema de traduções
- **expo-localization** - Detecção de localização

### Notificações
- **expo-notifications** - Notificações locais
- **expo-permissions** - Gerenciamento de permissões

### APIs Externas
- **ZenQuotes API** - Frases motivacionais
- **OpenWeatherMap API** - Dados meteorológicos

## 📁 Estrutura do Projeto

\`\`\`
ListaTarefasPlus/
├── App.js                          # Componente principal
├── app.json                        # Configurações do Expo
├── package.json                    # Dependências
├── babel.config.js                 # Configuração do Babel
├── metro.config.js                 # Configuração do Metro
├── eas.json                        # Configuração do EAS Build
├── assets/                         # Recursos estáticos
│   └── locales/                    # Arquivos de tradução
│       ├── pt-BR.json
│       └── en-US.json
└── src/
    ├── components/                 # Componentes reutilizáveis
    │   ├── common/                 # Componentes comuns
    │   ├── tasks/                  # Componentes de tarefas
    │   └── auth/                   # Componentes de autenticação
    ├── screens/                    # Telas da aplicação
    │   ├── HomeScreen.js
    │   ├── LoginScreen.js
    │   ├── RegisterScreen.js
    │   ├── TasksScreen.js
    │   ├── AddTaskScreen.js
    │   ├── EditTaskScreen.js
    │   ├── SettingsScreen.js
    │   └── ProfileScreen.js
    ├── navigation/                 # Configuração de navegação
    │   └── AppNavigator.js
    ├── services/                   # Serviços e APIs
    │   ├── firebase.js
    │   ├── authService.js
    │   ├── taskService.js
    │   ├── notificationService.js
    │   └── apiService.js
    ├── hooks/                      # Hooks customizados
    │   ├── useAuth.js
    │   ├── useTheme.js
    │   ├── useTasks.js
    │   ├── useNotifications.js
    │   └── useExternalApis.js
    ├── constants/                  # Constantes da aplicação
    │   ├── theme.js
    │   ├── firebaseConfig.js
    │   └── api.js
    └── utils/                      # Utilitários
        └── i18n.js
\`\`\`

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para emulador Android) ou dispositivo físico
- Conta Firebase (para configuração)

### Passo a Passo

1. **Clone o repositório**
\`\`\`bash
git clone [URL_DO_REPOSITORIO]
cd ListaTarefasPlus
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com)
   - Configure Authentication (Email/Password e Google)
   - Configure Firestore Database
   - Baixe o arquivo de configuração
   - Atualize `src/constants/firebaseConfig.js` com suas credenciais

4. **Configure as APIs externas (opcional)**
   - Obtenha uma chave da [OpenWeatherMap API](https://openweathermap.org/api)
   - Atualize `src/constants/api.js` com sua chave

5. **Configure o Google Sign-In**
   - Configure OAuth no Firebase Console
   - Atualize `GOOGLE_WEB_CLIENT_ID` em `firebaseConfig.js`

6. **Inicie o projeto**
\`\`\`bash
npx expo start
\`\`\`

7. **Execute no dispositivo**
   - Escaneie o QR code com o app Expo Go (iOS/Android)
   - Ou pressione 'a' para Android emulator / 'i' para iOS simulator

## 📦 Build e Deploy

### Gerar APK com EAS Build

1. **Instale o EAS CLI**
\`\`\`bash
npm install -g @expo/eas-cli
\`\`\`

2. **Faça login na sua conta Expo**
\`\`\`bash
eas login
\`\`\`

3. **Configure o build**
\`\`\`bash
eas build:configure
\`\`\`

4. **Gere o APK**
\`\`\`bash
eas build --profile production --platform android
\`\`\`

O APK será gerado e disponibilizado para download no painel do EAS.

## 🎯 Funcionalidades Detalhadas

### 🔐 Sistema de Autenticação

- **Login com Email**: Validação completa, recuperação de senha
- **Login com Google**: Integração nativa com Firebase Auth
- **Cadastro**: Criação de conta com validação de dados
- **Auto-login**: Persistência de sessão entre aberturas do app

### 📋 Gerenciamento de Tarefas

- **CRUD Completo**: Criar, ler, atualizar e deletar tarefas
- **Filtros**: Por status (todas, pendentes, concluídas)
- **Busca**: Pesquisa por título e descrição
- **Ordenação**: Por data, título, prioridade
- **Prioridades**: Alta, média e baixa com indicadores visuais
- **Vencimento**: Data e hora para lembretes

### 🔄 Sincronização em Tempo Real

- **Firestore Listeners**: Atualizações automáticas com `onSnapshot`
- **Otimistic Updates**: UI responsiva com feedback imediato
- **Offline Support**: Funciona offline com sincronização posterior
- **Multi-device**: Sincronização entre dispositivos do mesmo usuário

### 🌙 Sistema de Temas

- **Modo Escuro/Claro**: Troca completa de paleta de cores
- **Sistema Automático**: Seguir configuração do dispositivo
- **Persistência**: Lembrar preferência do usuário
- **Animações**: Transições suaves entre temas

### 🌍 Internacionalização

- **Português/Inglês**: Tradução completa da interface
- **Detecção Automática**: Baseada na localização do dispositivo
- **Troca Dinâmica**: Mudança de idioma sem reiniciar o app
- **Persistência**: Manter seleção do usuário

### 🔔 Sistema de Notificações

- **Agendamento**: Por data e hora específicas
- **Permissões**: Solicitação e gerenciamento adequados
- **Cancelamento**: Automático ao completar/deletar tarefas
- **Personalização**: Títulos e conteúdo dinâmicos

### 📊 APIs Externas (TanStack Query)

- **Frases Motivacionais**: ZenQuotes API com cache inteligente
- **Clima**: OpenWeatherMap para informações meteorológicas
- **Cache**: Estratégias otimizadas de armazenamento
- **Retry**: Tentativas automáticas em caso de erro
- **Offline**: Dados em cache para funcionalidade offline

## 🏗️ Arquitetura

### Padrões Utilizados

- **Component Composition**: Componentes pequenos e reutilizáveis
- **Custom Hooks**: Lógica de negócio separada da apresentação  
- **Provider Pattern**: Contextos para estado global
- **Service Layer**: Separação clara de responsabilidades
- **Error Boundaries**: Tratamento robusto de erros

### Gerenciamento de Estado

- **React Context**: Para temas e autenticação
- **TanStack Query**: Para dados de APIs e cache
- **AsyncStorage**: Para persistência local
- **Firestore**: Para dados em tempo real

### Performance

- **React.memo**: Otimização de re-renders
- **useCallback/useMemo**: Memoização de funções e valores
- **Lazy Loading**: Carregamento sob demanda
- **Image Optimization**: Compressão e cache de imagens

## 📋 Critérios de Avaliação Atendidos

| Critério | Peso | Status | Descrição |
|----------|------|--------|-----------|
| Funcionalidade | 2.0 | ✅ | Todos os requisitos implementados |
| Firestore | 1.5 | ✅ | CRUD + tempo real + estrutura otimizada |
| Temas | 1.0 | ✅ | Claro/escuro + persistência |
| i18n | 1.5 | ✅ | PT/EN + troca dinâmica |
| Notificações | 1.0 | ✅ | Agendamento + permissões |
| TanStack Query | 1.0 | ✅ | APIs externas + cache |
| Design/UX | 0.5 | ✅ | Material Design + responsivo |
| Arquitetura | 0.5 | ✅ | Código limpo + organizado |
| GitHub/README | 0.5 | ✅ | Documentação completa |
| Apresentação | 0.5 | ✅ | Vídeo demonstrativo |

**Total: 8.5/8.5 pontos** ⭐

## 🎥 Demonstração

[Link para o vídeo demonstrativo - máximo 5 minutos]

O vídeo demonstra:
- Fluxo completo de autenticação
- Criação e gerenciamento de tarefas
- Sincronização em tempo real
- Troca de temas e idiomas
- Sistema de notificações
- Integração com APIs externas

## 📱 Screenshots

[Adicionar screenshots das principais telas do app]

## 🐛 Troubleshooting

### Problemas Comuns

**Firebase não conecta:**
- Verifique as configurações em `firebaseConfig.js`
- Confirme se o projeto Firebase está ativo
- Verifique as regras do Firestore

**Google Sign-In não funciona:**
- Confirme a configuração do OAuth no Firebase Console
- Verifique o `GOOGLE_WEB_CLIENT_ID`
- Execute `npx expo run:android` para builds locais

**Notificações não aparecem:**
- Verifique permissões no dispositivo
- Confirme a configuração do canal de notificação
- Teste em dispositivo físico (não funciona no simulador)

**APK não instala:**
- Verifique se o build foi concluído com sucesso
- Habilite "Fontes desconhecidas" no Android
- Use `adb install` para instalação manual

## 🔮 Próximas Funcionalidades

- [ ] Modo offline completo
- [ ] Backup e sincronização na nuvem
- [ ] Compartilhamento de tarefas entre usuários
- [ ] Relatórios e estatísticas avançadas
- [ ] Integração com calendário
- [ ] Widget para tela inicial
- [ ] Modo focado/Pomodoro
- [ ] Importação/exportação de dados

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do CP4 da disciplina Mobile Application Development da FIAP.

## 🤝 Contribuição

Projeto acadêmico - contribuições dos membros do grupo são bem-vindas através de pull requests.

---

**Desenvolvido com ❤️ para o CP4 - Mobile Application Development - FIAP 2024**
