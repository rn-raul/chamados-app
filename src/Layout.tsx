import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Ticket, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  Bell,
  User,
  X,
  Headset // <-- Adicionamos o ícone de Helpdesk aqui
} from 'lucide-react';

import api from './services/api';
import { useAuth } from './contexts/AuthContext';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const { user, limparUsuario } = useAuth();

  const menuItems = [
    { title: 'Chamados', icon: <Ticket size={20} />, path: '/chamados' },
    { title: 'Novo Chamado', icon: <PlusCircle size={20} />, path: '/novo-chamado' },
    { title: 'Relatórios', icon: <BarChart3 size={20} />, path: '/relatorios' },
  ];

  const handleLogout = async () => {
    try {
      await api.post('/api/sankhya/logout');
    } catch (error) {
      console.error('Erro ao comunicar logout ao servidor', error);
    } finally {
      localStorage.removeItem('@SankhyaTickets:token');
      localStorage.removeItem('@SankhyaTickets:usuario');
      limparUsuario(); 
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Overlay para Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================== */}
      {/* MENU LATERAL (SIDEBAR) */}
      {/* ========================================== */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-slate-900 text-slate-300 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:block shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Área da Logo - Agora com ícone e texto TicketGo */}
        <div className="h-20 flex items-center px-6 bg-slate-950/50 border-b border-slate-800 justify-between lg:justify-center">
          
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/50">
              <Headset className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Ticket<span className="text-blue-500">Go</span>
            </h1>
          </div>

          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">
            Menu Principal
          </p>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ========================================== */}
      {/* CONTEÚDO PRINCIPAL (DIREITA) */}
      {/* ========================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* CABEÇALHO SUPERIOR (HEADER) */}
        <header className="h-20 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 relative z-10">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="hidden lg:block text-xl font-semibold text-slate-800 tracking-tight">
              {menuItems.find(item => item.path === location.pathname)?.title || 'Portal de Chamados'}
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full relative transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            {/* ÁREA DO PERFIL DO USUÁRIO */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full transition-all border border-transparent hover:bg-slate-50 hover:border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white">
                  {user?.nomeUsuario ? user.nomeUsuario.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-slate-700 leading-tight">{user?.nomeUsuario || 'Carregando...'}</p>
                  <p className="text-xs font-medium text-slate-500">{user?.setorNome || 'Aguarde...'}</p>
                </div>
              </button>

              {/* Menu Suspenso (Dropdown) */}
              {isProfileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsProfileMenuOpen(false)}
                  ></div>
                  
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-20 py-2 ring-1 ring-slate-900/5 transform opacity-100 scale-100 transition-all">
                    <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                      <p className="text-sm font-bold text-slate-800">{user?.nomeUsuario}</p>
                      <p className="text-xs font-medium text-slate-500">{user?.setorNome}</p>
                    </div>
                    
                    <Link 
                      to="/perfil" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <User size={18} className="text-slate-400" /> Meu Perfil
                    </Link>
                    <Link 
                      to="/configuracoes" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings size={18} className="text-slate-400" /> Configurações
                    </Link>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={18} className="text-red-500" /> Sair do sistema
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ========================================== */}
        {/* ÁREA DE RENDERIZAÇÃO DAS PÁGINAS (OUTLET) */}
        {/* ========================================== */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 relative z-0">
          <Outlet /> 
        </main>
        
      </div>
    </div>
  );
}