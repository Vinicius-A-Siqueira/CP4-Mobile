import { API_ENDPOINTS, API_KEYS } from '../constants/api';

export class ApiService {

  // Função auxiliar para fazer requisições HTTP
  async fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Buscar frase motivacional do ZenQuotes
  async getMotivationalQuote() {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.QUOTES);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        return {
          text: data[0].q || data[0].quote,
          author: data[0].a || data[0].author,
          source: 'ZenQuotes'
        };
      }

      throw new Error('Formato de dados inválido');
    } catch (error) {
      console.error('Erro ao buscar frase do ZenQuotes:', error);

      // Fallback para API alternativa
      return this.getAlternativeQuote();
    }
  }

  // API alternativa para frases motivacionais
  async getAlternativeQuote() {
    try {
      const response = await this.fetchWithTimeout(API_ENDPOINTS.MOTIVATIONAL);
      const data = await response.json();

      return {
        text: data.content,
        author: data.author,
        source: 'Quotable'
      };
    } catch (error) {
      console.error('Erro ao buscar frase alternativa:', error);

      // Fallback local
      return this.getFallbackQuote();
    }
  }

  // Frases locais de fallback
  getFallbackQuote() {
    const localQuotes = [
      {
        text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
        author: "Robert Collier",
        source: "Local"
      },
      {
        text: "A persistência é o caminho do êxito.",
        author: "Charles Chaplin",
        source: "Local"
      },
      {
        text: "Não espere por uma oportunidade. Crie uma.",
        author: "George Bernard Shaw",
        source: "Local"
      },
      {
        text: "O que não começamos hoje, não terminaremos amanhã.",
        author: "Goethe",
        source: "Local"
      },
      {
        text: "A organização é a chave para a produtividade.",
        author: "Anônimo",
        source: "Local"
      }
    ];

    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    return localQuotes[randomIndex];
  }

  // Buscar dados do clima
  async getWeatherData(city = 'São Paulo') {
    try {
      const url = `${API_ENDPOINTS.WEATHER}?q=${encodeURIComponent(city)}&appid=${API_KEYS.OPENWEATHER}&units=metric&lang=pt_br`;

      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        cloudiness: data.clouds.all,
        visibility: data.visibility / 1000, // em km
        sunrise: new Date(data.sys.sunrise * 1000),
        sunset: new Date(data.sys.sunset * 1000),
      };
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
      return this.getFallbackWeather();
    }
  }

  // Dados de clima de fallback
  getFallbackWeather() {
    return {
      city: 'São Paulo',
      country: 'BR',
      temperature: 22,
      feelsLike: 24,
      description: 'parcialmente nublado',
      icon: '02d',
      humidity: 65,
      pressure: 1013,
      windSpeed: 3.5,
      cloudiness: 40,
      visibility: 10,
      sunrise: new Date(),
      sunset: new Date(),
      error: 'Dados offline'
    };
  }

  // Buscar notícias (exemplo com NewsAPI - requer chave)
  async getNews(category = 'technology') {
    try {
      // Esta é uma API de exemplo - você precisa de uma chave real
      const url = `https://newsapi.org/v2/top-headlines?country=br&category=${category}&apiKey=YOUR_NEWS_API_KEY`;

      const response = await this.fetchWithTimeout(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        return data.articles.slice(0, 10).map(article => ({
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          publishedAt: new Date(article.publishedAt),
          source: article.source.name,
        }));
      }

      throw new Error('Erro na resposta da API');
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      return [];
    }
  }

  // Validar se uma API está funcionando
  async checkApiHealth(endpoint) {
    try {
      const response = await this.fetchWithTimeout(endpoint, {}, 5000);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Obter status de todas as APIs
  async getApisStatus() {
    const checks = await Promise.allSettled([
      this.checkApiHealth(API_ENDPOINTS.QUOTES),
      this.checkApiHealth(API_ENDPOINTS.MOTIVATIONAL),
      this.checkApiHealth(`${API_ENDPOINTS.WEATHER}?q=test&appid=${API_KEYS.OPENWEATHER}`)
    ]);

    return {
      quotes: checks[0].status === 'fulfilled' && checks[0].value,
      motivational: checks[1].status === 'fulfilled' && checks[1].value,
      weather: checks[2].status === 'fulfilled' && checks[2].value,
      timestamp: new Date().toISOString()
    };
  }

  // Função genérica para retry com exponential backoff
  async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          break;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }
}

export default new ApiService();
