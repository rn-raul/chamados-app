// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

// 1. Definimos o "formato" dos dados do usuário (TypeScript)
export interface User {
  nomeUsuario: string;
  codigoUsuario: string;
  codigoGrupo: string;
  codigoParceiro: string;
  email: string;
  setorId: string;
  setorNome: string;
  nomeParceiro: string; // Adicionamos o nome do parceiro para exibir no perfil
}

// 2. Definimos o que a nossa "Caixa d'água" vai guardar e disponibilizar
interface AuthContextData {
  user: User | null; // Os dados do usuário (ou null se não estiver logado)
  carregarPerfilUsuario: (username: string) => Promise<void>; // Função para buscar os dados
  limparUsuario: () => void; // Função para limpar ao sair (logout)
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const carregarPerfilUsuario = async (username: string) => {
    try {
      const response = await api.get(`/api/sankhya/usuario/${username}`);
      if (response.data.sucesso) {
        setUser(response.data.dados); 
      }
    } catch (error) {
      console.error('Erro ao buscar perfil global do usuário:', error);
    }
  };

  const limparUsuario = () => {
    setUser(null);
    localStorage.removeItem('@SankhyaTickets:token');
    localStorage.removeItem('@SankhyaTickets:usuario');
  };

  // NOVA FUNÇÃO: Faz o pedido silencioso do novo token
  const renovarTokenSilenciosamente = async () => {
    try {
      const tokenAtual = localStorage.getItem('@SankhyaTickets:token');
      // Se não tem token salvo, significa que o usuário não está logado, então não fazemos nada.
      if (!tokenAtual) return;

      const response = await api.post('/api/sankhya/refresh');
      
      if (response.data.sucesso && response.data.token) {
        // Substitui magicamente o token antigo pelo novo no navegador!
        localStorage.setItem('@SankhyaTickets:token', response.data.token);
        console.log('🔄 Token renovado com sucesso em background!');
      }
    } catch (error) {
      console.error('Falha ao tentar renovar o token:', error);
      // Se a API da Sankhya cair, você pode optar por forçar o logout chamando limparUsuario() aqui
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem('@SankhyaTickets:usuario');
    const token = localStorage.getItem('@SankhyaTickets:token');
    
    if (savedUsername && token) {
      carregarPerfilUsuario(savedUsername);
    }

    // CRONÔMETRO DE REFRESH: 4 minutos = 240.000 milissegundos
    const TEMPO_REFRESH = 240000; 

    const intervaloDeRefresh = setInterval(() => {
      // A cada 4 minutos, verifica se o cara está logado e renova o token
      if (localStorage.getItem('@SankhyaTickets:token')) {
        renovarTokenSilenciosamente();
      }
    }, TEMPO_REFRESH);

    // Função de limpeza: destrói o cronômetro caso o AuthProvider saia da tela
    return () => clearInterval(intervaloDeRefresh);
  }, []);

  return (
    <AuthContext.Provider value={{ user, carregarPerfilUsuario, limparUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Criamos um Hook personalizado para facilitar o uso nos outros arquivos
export const useAuth = () => useContext(AuthContext);