// src/services/api.ts
import axios from 'axios';

// 1. Criamos a nossa base de conexão apontando para o seu servidor Node.js
export const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', 
});

// ==========================================
// INTERCEPTADOR DE REQUISIÇÕES
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Passo A: O interceptador "pausa" a requisição e vai procurar o token no navegador
    const token = localStorage.getItem('@SankhyaTickets:token');

    // Passo B: Se ele encontrar o token, ele adiciona no "Cabeçalho" (Headers) da viagem
    // O padrão da web é usar a palavra 'Bearer ' antes do token.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Passo C: Libera a requisição para seguir seu caminho até o servidor Node.js
    return config;
  },
  (error) => {
    // Se acontecer algum erro antes mesmo da requisição sair do navegador, nós avisamos
    return Promise.reject(error);
  }
);

export default api;