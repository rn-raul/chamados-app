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

// 3. Criamos o Contexto em si
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 4. Criamos o "Provedor" (O componente que vai envolver nosso App)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Função que vai na nossa nova rota do Node.js buscar os dados
  const carregarPerfilUsuario = async (username: string) => {
    try {
      const response = await api.get(`/api/sankhya/usuario/${username}`);
      if (response.data.sucesso) {
        setUser(response.data.dados); // Salva os dados na memória global!
      }
    } catch (error) {
      console.error('Erro ao buscar perfil global do usuário:', error);
    }
  };

  // DOCUMENTAÇÃO: Limpa o estado global e remove os dados do navegador
  const limparUsuario = () => {
    setUser(null);
    // Removemos os dados do localStorage para garantir que a sessão foi encerrada
    localStorage.removeItem('@SankhyaTickets:token');
    localStorage.removeItem('@SankhyaTickets:usuario');
  };

  // Esse useEffect verifica se existe um usuário salvo no localStorage e busca os dados de novo automaticamente!
  useEffect(() => {
    const savedUsername = localStorage.getItem('@SankhyaTickets:usuario');
    const token = localStorage.getItem('@SankhyaTickets:token');
    
    if (savedUsername && token) {
      carregarPerfilUsuario(savedUsername);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, carregarPerfilUsuario, limparUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Criamos um Hook personalizado para facilitar o uso nos outros arquivos
export const useAuth = () => useContext(AuthContext);