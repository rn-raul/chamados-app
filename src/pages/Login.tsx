import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 2. Inicialize o hook

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação básica de regra de negócio baseada no RBAC
    if (username.toLowerCase() === 'ti') {
      navigate('/dashboard-ti');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    // Container principal: Ocupa a tela toda, centraliza o conteúdo e tem um fundo cinza claro
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      
      {/* Card de Login: Responsivo (w-full max-w-md), com sombra e bordas arredondadas */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        
        {/* Cabeçalho do Form */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal de Chamados</h1>
          <p className="text-gray-500">Acesse com suas credenciais do Sankhya</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Campo: Usuário */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Campo: Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md focus:ring-4 focus:ring-blue-500/50"
          >
            Entrar no Sistema
          </button>

        </form>
        
        {/* Rodapé opcional para suporte */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Problemas com o acesso? <a href="#" className="text-blue-600 hover:underline">Contate a TI</a>
        </div>

      </div>
    </div>
  );
}