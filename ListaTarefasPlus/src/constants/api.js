// URLs das APIs externas
export const API_ENDPOINTS = {
  QUOTES: 'https://zenquotes.io/api/random',
  WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
  MOTIVATIONAL: 'https://api.quotable.io/random?tags=motivational',
};

// Chaves da API (substitua pelas suas chaves reais)
export const API_KEYS = {
  OPENWEATHER: 'your-openweather-api-key',
};

// Configurações de cache do TanStack Query
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
};

// Configurações de notificação
export const NOTIFICATION_CONFIG = {
  channelId: 'task-reminders',
  channelName: 'Lembretes de Tarefas',
  channelDescription: 'Notificações para lembrar sobre tarefas pendentes',
};
