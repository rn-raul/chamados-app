import { useState, useEffect } from 'react';
import { Ticket, Clock, AlertCircle, Search, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; 

interface Chamado {
  idChamado: number;
  contato: string;
  dataAbertura: string;
  prioridade: string;
  problema: string;
  nomeAssunto: string;
  nomeStatus: string;
  idStatus: string;
  codUsuInc: string;
  idSetorDestino: string;
  setorOrigem: string; 
}

// Tipo para o nosso novo filtro
type FiltroTipo = 'TODOS' | 'RECEBIDOS' | 'ENVIADOS';

const formatarComoTitulo = (texto?: string) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export function MeusChamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  
  // Novo estado para controlar o tipo de filtro
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('TODOS');
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const codigoUsuario = user?.codigoUsuario;

  useEffect(() => {
    const buscarChamados = async () => {
      if (!user?.setorId || !codigoUsuario) return; 

      try {
        setLoading(true);
        const response = await api.get('/api/sankhya/chamados', {
          params: {
            setorDestino: user.setorId,
            codUsuInc: codigoUsuario 
          }
        });
        
        if (response.data.sucesso) {
          setChamados(response.data.dados);
        }
      } catch (error) {
        console.error('Erro ao buscar chamados:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarChamados();
  }, [user, codigoUsuario]);

  // Sempre que mudar a busca ou o filtro de tipo, volta para a página 1
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca, filtroTipo]);

  // Aplicando a busca de texto E o filtro de tipo (Aba)
  const chamadosFiltrados = chamados.filter(chamado => {
    // 1. Filtro de texto
    const textoMatch = chamado.idChamado.toString().includes(busca) ||
                       chamado.nomeAssunto.toLowerCase().includes(busca.toLowerCase()) ||
                       chamado.contato.toLowerCase().includes(busca.toLowerCase());

    // 2. Filtro de tipo (Recebido vs Enviado)
    let tipoMatch = true;
    const abertoPorMim = chamado.codUsuInc === codigoUsuario?.toString();
    const paraMeuSetor = chamado.idSetorDestino === user?.setorId?.toString();

    if (filtroTipo === 'ENVIADOS') {
      tipoMatch = abertoPorMim;
    } else if (filtroTipo === 'RECEBIDOS') {
      tipoMatch = paraMeuSetor;
    }

    return textoMatch && tipoMatch;
  });

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const chamadosPagina = chamadosFiltrados.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(chamadosFiltrados.length / itensPorPagina);

  const renderStatusBadge = (status: string, nome: string) => {
    switch (status) {
      case '0': return <span className="px-2.5 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold rounded-full">{nome}</span>;
      case '1': return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-full">{nome}</span>;
      case '2': return <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold rounded-full">{nome}</span>;
      case '3': return <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold rounded-full">{nome}</span>;
      default: return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-full">{nome}</span>;
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">

      <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5 tracking-tight">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Ticket size={24} strokeWidth={2.5} />
              </div>
              Meus Chamados
            </h1>
            <p className="text-slate-500 mt-1.5 text-sm ml-12">
              Gerencie solicitações da sua fila e abertas por você.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar ID, Nome ou Assunto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl w-full sm:w-72 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Abas de Filtro */}
        <div className="flex items-center gap-2 mt-2 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
          <Filter size={16} className="text-slate-400 mr-2 shrink-0" />
          <button
            onClick={() => setFiltroTipo('TODOS')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${filtroTipo === 'TODOS' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Todos os Chamados
          </button>
          <button
            onClick={() => setFiltroTipo('RECEBIDOS')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${filtroTipo === 'RECEBIDOS' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <ArrowDownLeft size={16} /> Para minha fila
          </button>
          <button
            onClick={() => setFiltroTipo('ENVIADOS')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${filtroTipo === 'ENVIADOS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <ArrowUpRight size={16} /> Abertos por mim
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
            <p className="font-medium">Sincronizando fila com a Sankhya...</p>
          </div>
        ) : chamadosFiltrados.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <Ticket size={48} className="text-slate-200 mb-4" />
            <p className="font-medium text-lg text-slate-700">Fila Limpa ou sem resultados!</p>
            <p className="text-sm mt-1">Nenhum chamado pendente encontrado para este filtro.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tipo</th>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Solicitante</th>
                  <th className="px-6 py-4 font-semibold">Setor</th>
                  <th className="px-6 py-4 font-semibold">Assunto / Problema</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Prioridade</th>
                  <th className="px-6 py-4 font-semibold">Abertura</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {chamadosPagina.map((chamado) => {
                  const abertoPorMim = chamado.codUsuInc === codigoUsuario?.toString();
                  const paraMeuSetor = chamado.idSetorDestino === user?.setorId?.toString();

                  return (
                    <tr
                      key={chamado.idChamado}
                      onClick={() => navigate(`/chamado/${chamado.idChamado}`)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        {abertoPorMim && !paraMeuSetor ? (
                          <span title="Aberto por mim" className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 w-fit">
                            <ArrowUpRight size={14} /> Enviado
                          </span>
                        ) : (
                          <span title="Para meu setor" className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100 w-fit">
                            <ArrowDownLeft size={14} /> Recebido
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        #{chamado.idChamado}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {chamado.contato}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {chamado.setorOrigem}
                      </td>
                      <td className="px-6 py-4 max-w-xs" title={chamado.problema}>
                        <span className="font-semibold text-slate-800 block truncate">{chamado.nomeAssunto}</span>
                        <span className="text-xs text-slate-500 truncate block mt-0.5">{chamado.problema || 'Sem descrição'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(chamado.idStatus, chamado.nomeStatus)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1.5 font-medium ${chamado.prioridade?.toUpperCase() === 'URGENTE' ? 'text-red-600' : 'text-slate-600'}`}>
                          {chamado.prioridade?.toUpperCase() === 'URGENTE' && <AlertCircle size={16} />}
                          {formatarComoTitulo(chamado.prioridade)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {chamado.dataAbertura}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Paginação */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/80 bg-slate-50/50 text-sm">
              <span className="text-slate-500 font-medium">
                Página <strong className="text-slate-700">{totalPaginas === 0 ? 0 : paginaAtual}</strong> de <strong className="text-slate-700">{totalPaginas || 0}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  disabled={paginaAtual === 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaginaAtual((p) => p - 1);
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-sm"
                >
                  Anterior
                </button>
                <button
                  disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPaginaAtual((p) => p + 1);
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed shadow-sm"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}