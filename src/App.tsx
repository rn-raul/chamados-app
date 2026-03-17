import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { NovoChamado } from './pages/NovoChamado';
import { MeusChamados } from './pages/MeusChamados';
import { DetalhesChamado } from './pages/DetalhesChamado';
import { Relatorios } from './pages/Relatorios';
import { Perfil } from './pages/Perfil';
import { Layout } from './Layout';
import { Toaster } from 'react-hot-toast'; 
import { AuthProvider } from './contexts/AuthContext';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#334155', // Fundo escuro elegante
            color: '#fff',         // Texto branco
            borderRadius: '10px',
            fontWeight: '500',
          },
          success: {
            style: { background: '#10b981' }, // Verde para sucesso
          },
          error: {
            style: { background: '#ef4444' }, // Vermelho para erro
          },
        }} 
      />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Rotas protegidas envelopadas pelo Layout */}
        <Route element={<Layout />}>
          <Route path="/chamados" element={<MeusChamados />} />
          <Route path="/novo-chamado" element={<NovoChamado />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/chamado/:id" element={<DetalhesChamado />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
        
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;