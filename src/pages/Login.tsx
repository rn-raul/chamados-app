import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Headset, User, Lock, Eye, EyeOff } from 'lucide-react'; // Adicionamos mais ícones aqui

export function Login() {
  const { carregarPerfilUsuario } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Novo estado para ver a senha
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/sankhya/login', {
        usuario: username,
        senha: password
      });

      const token = response.data.token; 

      if (token) {
        localStorage.setItem('@SankhyaTickets:token', token);
        localStorage.setItem('@SankhyaTickets:usuario', username.toUpperCase());
        await carregarPerfilUsuario(username.toUpperCase());
        toast.success('Login realizado com sucesso!');
        navigate('/chamados');
      }

    } catch (error: any) {
      const mensagemErro = error.response?.data?.erro || 'Erro ao conectar no servidor.';
      toast.error(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fundo com um gradiente super suave para dar um ar mais premium
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4 font-sans">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
        
        {/* Cabeçalho do Login com a Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
              <Headset className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
              Ticket<span className="text-blue-600">Go</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">Acesse o portal de atendimento</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Campo: Usuário */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Usuário
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                disabled={loading}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 font-medium text-slate-700"
                required
              />
            </div>
          </div>

          {/* Campo: Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Senha
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 font-medium text-slate-700"
                required
              />
              {/* Botão de Mostrar/Ocultar Senha */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/30 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Autenticando...
              </>
            ) : (
              'Entrar no sistema'
            )}
          </button>

        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
          Problemas com o acesso? <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors">Contate a TI</a>
        </div>

      </div>
    </div>
  );
}