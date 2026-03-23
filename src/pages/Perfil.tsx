import { User, Mail, Building, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Perfil() {
  // 2. Extraímos os dados reais do usuário logado
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Cabeçalho do Perfil */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">Visualize suas informações cadastradas no sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Card Principal: Foto e Resumo */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col items-center text-center">

          {/* Avatar dinâmico com a primeira letra do nome ou o ícone */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-md text-3xl font-bold">
            {user?.nomeUsuario ? user.nomeUsuario.charAt(0).toUpperCase() : <User size={40} />}
          </div>

          <h2 className="text-xl font-bold text-gray-900">{user?.nomeUsuario || 'Carregando...'}</h2>
          <p className="text-sm font-medium text-blue-600 mb-1">Cód. Usuário: {user?.codigoUsuario}</p>
          <p className="text-xs text-gray-500">{user?.setorNome || 'Setor não identificado'}</p>
        </div>

        {/* Card de Detalhes (Ocupa 2 colunas) */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Shield size={18} className="text-blue-600" />
              Informações Corporativas
            </h3>
          </div>

          <div className="p-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <User size={14} /> Nome Completo
                </dt>
                <dd className="text-sm font-medium text-gray-900">{user?.nomeParceiro || '-'}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Mail size={14} /> E-mail Corporativo
                </dt>
                <dd className="text-sm font-medium text-gray-900">{user?.email || 'Não cadastrado'}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Building size={14} /> Setor (Centro de Custo)
                </dt>
                <dd className="text-sm font-medium text-gray-900">{user?.setorNome || '-'}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                  <Briefcase size={14} /> Código do Parceiro
                </dt>
                {/* Substituímos o cargo pelo Cód. Parceiro, pois foi o que trouxemos na query */}
                <dd className="text-sm font-medium text-gray-900">{user?.codigoParceiro || 'Não informado'}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase mb-1">Matrícula ERP (Cód. Usuário)</dt>
                <dd className="text-sm font-medium text-gray-900">{user?.codigoUsuario || '-'}</dd>
              </div>

              <div>
                <dt className="text-xs font-bold text-gray-500 uppercase mb-1">Código do Grupo</dt>
                {/* Substituímos data de admissão pelo Cód. Grupo */}
                <dd className="text-sm font-medium text-gray-900">{user?.codigoGrupo || '-'}</dd>
              </div>

            </dl>
          </div>
        </div>

      </div>
    </div>
  );
}