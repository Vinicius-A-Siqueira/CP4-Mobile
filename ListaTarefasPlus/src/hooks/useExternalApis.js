import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';
import { QUERY_CONFIG } from '../constants/api';

// Hook para frases motivacionais
export const useMotivationalQuote = () => {
  return useQuery({
    queryKey: ['motivationalQuote'],
    queryFn: apiService.getMotivationalQuote,
    staleTime: QUERY_CONFIG.staleTime,
    cacheTime: QUERY_CONFIG.cacheTime,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: 1000 * 60 * 30, // Refetch a cada 30 minutos
  });
};

// Hook para dados do clima
export const useWeatherData = (city = 'São Paulo') => {
  return useQuery({
    queryKey: ['weather', city],
    queryFn: () => apiService.getWeatherData(city),
    staleTime: QUERY_CONFIG.staleTime,
    cacheTime: QUERY_CONFIG.cacheTime,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // Refetch a cada 15 minutos
    enabled: !!city, // Só executa se a cidade for fornecida
  });
};

// Hook para notícias
export const useNews = (category = 'technology') => {
  return useQuery({
    queryKey: ['news', category],
    queryFn: () => apiService.getNews(category),
    staleTime: QUERY_CONFIG.staleTime,
    cacheTime: QUERY_CONFIG.cacheTime,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 60, // Refetch a cada hora
    enabled: false, // Desabilitado por padrão (requer chave de API)
  });
};

// Hook para status das APIs
export const useApiStatus = () => {
  return useQuery({
    queryKey: ['apiStatus'],
    queryFn: apiService.getApisStatus,
    staleTime: 1000 * 60 * 5, // 5 minutos
    cacheTime: 1000 * 60 * 10, // 10 minutos
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Hook para múltiplas APIs (dashboard)
export const useDashboardData = () => {
  const queryClient = useQueryClient();

  const quote = useMotivationalQuote();
  const weather = useWeatherData();
  const apiStatus = useApiStatus();

  // Função para refazer fetch de todos os dados
  const refetchAll = async () => {
    await Promise.all([
      queryClient.invalidateQueries(['motivationalQuote']),
      queryClient.invalidateQueries(['weather']),
      queryClient.invalidateQueries(['apiStatus']),
    ]);
  };

  // Função para limpar cache
  const clearCache = () => {
    queryClient.clear();
  };

  // Estado combinado
  const isLoading = quote.isLoading || weather.isLoading || apiStatus.isLoading;
  const hasError = quote.isError || weather.isError || apiStatus.isError;

  const errors = {
    quote: quote.error,
    weather: weather.error,
    apiStatus: apiStatus.error,
  };

  return {
    // Dados individuais
    quote: {
      data: quote.data,
      isLoading: quote.isLoading,
      isError: quote.isError,
      error: quote.error,
      refetch: quote.refetch,
    },
    weather: {
      data: weather.data,
      isLoading: weather.isLoading,
      isError: weather.isError,
      error: weather.error,
      refetch: weather.refetch,
    },
    apiStatus: {
      data: apiStatus.data,
      isLoading: apiStatus.isLoading,
      isError: apiStatus.isError,
      error: apiStatus.error,
      refetch: apiStatus.refetch,
    },

    // Estados combinados
    isLoading,
    hasError,
    errors,

    // Ações
    refetchAll,
    clearCache,
  };
};

// Hook personalizado para retry manual
export const useRetryableQuery = (queryKey, queryFn, options = {}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn,
    retry: false, // Desabilita retry automático
    ...options,
  });

  const manualRetry = async () => {
    await queryClient.invalidateQueries(queryKey);
    return query.refetch();
  };

  return {
    ...query,
    manualRetry,
  };
};

// Hook para gerenciar cache de forma inteligente
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  const getCacheSize = () => {
    const cache = queryClient.getQueryCache();
    return cache.getAll().length;
  };

  const clearOldCache = (olderThanMinutes = 60) => {
    const cache = queryClient.getQueryCache();
    const cutoffTime = Date.now() - (olderThanMinutes * 60 * 1000);

    cache.getAll().forEach(query => {
      if (query.state.dataUpdatedAt < cutoffTime) {
        queryClient.removeQueries(query.queryKey);
      }
    });
  };

  const getCacheStats = () => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const stats = {
      total: queries.length,
      fresh: 0,
      stale: 0,
      error: 0,
      loading: 0,
    };

    queries.forEach(query => {
      switch (query.state.status) {
        case 'success':
          if (query.isStale()) {
            stats.stale++;
          } else {
            stats.fresh++;
          }
          break;
        case 'error':
          stats.error++;
          break;
        case 'loading':
          stats.loading++;
          break;
      }
    });

    return stats;
  };

  const prefetchData = async () => {
    // Pre-carregar dados importantes
    await Promise.allSettled([
      queryClient.prefetchQuery(['motivationalQuote'], apiService.getMotivationalQuote),
      queryClient.prefetchQuery(['weather', 'São Paulo'], () => apiService.getWeatherData('São Paulo')),
    ]);
  };

  return {
    getCacheSize,
    clearOldCache,
    getCacheStats,
    prefetchData,
    queryClient,
  };
};

export default {
  useMotivationalQuote,
  useWeatherData,
  useNews,
  useApiStatus,
  useDashboardData,
  useRetryableQuery,
  useCacheManager,
};
