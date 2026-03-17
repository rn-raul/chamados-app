import { useState, useEffect } from 'react';
import { 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  BarChart3, 
  Clock, 
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Tipagem básica para os dados que vêm do backend
interface RelatorioItem {
  id: string;
  dataAbertura: string;
  dataAlteracao: string;
  setor: string;
  assunto: string;
  status: string;
  problema: string;
  tempoResolucao: string;
}

export function Relatorios() {
  // Estados para os filtros
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  
  // Pegando o usuário logado para extrair o setor
  const { user } = useAuth(); 
  
  // Estados para os dados da API
  const [dados, setDados] = useState<RelatorioItem[]>([]);
  const [carregando, setCarregando] = useState(false);

  // Função para buscar os dados no Backend
  const buscarRelatorios = async () => {
    // Trava de segurança: se não tiver o setor do usuário, não faz a requisição
    if (!user?.setorId) return;

    setCarregando(true);
    try {
      // 1. Buscando o token com a chave EXATA do seu login
      const token = localStorage.getItem('@SankhyaTickets:token'); 

      if (!token) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        setCarregando(false);
        return;
      }

      // 2. Monta os parâmetros da URL dinamicamente
      const queryParams = new URLSearchParams();
      if (dataInicio) queryParams.append('dataInicio', dataInicio);
      if (dataFim) queryParams.append('dataFim', dataFim);
      if (statusFiltro) queryParams.append('statusFiltro', statusFiltro);
      
      // Enviando o setor do usuário logado para o backend (único filtro de setor válido agora)
      queryParams.append('setorUsuarioLogado', user.setorId.toString());

      // 3. Garante que a palavra "Bearer " esteja presente para a Sankhya aceitar
      const authHeader = token.startsWith('Bearer') ? token : `Bearer ${token}`;

      // 4. Chamada para a API
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/sankhya/relatorios?${queryParams.toString()}`, {
        headers: {
          'Authorization': authHeader 
        }
      });

      const json = await response.json();

      if (json.sucesso) {
        setDados(json.dados);
      } else {
        alert('Erro ao buscar relatórios: ' + json.erro);
      }
    } catch (error) {
      console.error('Falha na requisição:', error);
      alert('Falha de conexão com o servidor ao gerar relatório.');
    } finally {
      setCarregando(false);
    }
  };

  // Carrega os dados assim que a tela abre, mas SÓ QUANDO o setor do usuário estiver disponível
  useEffect(() => {
    if (user?.setorId) {
      buscarRelatorios();
    }
  }, [user?.setorId]); 

  // Disparado ao clicar em "Aplicar Filtros"
  const handleGerarRelatorio = (e: React.FormEvent) => {
    e.preventDefault();
    buscarRelatorios();
  };

  const handleExportar = (formato: string) => {
    console.log(`Exportando para ${formato}...`);
    alert(`A exportação para ${formato} será implementada em breve!`);
  };

  // ==========================================
  // CÁLCULO DOS KPIs (Métricas dos Cards)
  // ==========================================
  const totalChamados = dados.length;
  const chamadosConcluidos = dados.filter(item => item.status === 'Concluído' || item.status === 'Fechado').length;
  const taxaResolucao = totalChamados > 0 ? Math.round((chamadosConcluidos / totalChamados) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios e Métricas</h1>
          <p className="text-gray-500 mt-1">Extraia dados e analise o desempenho dos atendimentos.</p>
        </div>
        
        {/* Botões de Exportação */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExportar('Excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors"
          >
            <Download size={16} /> Excel
          </button>
          <button 
            onClick={() => handleExportar('PDF')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
          >
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      {/* Área de Filtros */}
      <form onSubmit={handleGerarRelatorio} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Filter size={18} className="text-blue-600" />
          Filtros do Relatório
        </h2>
        
        {/* Ajustado para 3 colunas já que o filtro de setor saiu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Período */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Início</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Fim</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <select 
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Todos</option>
              <option value="Aberto">Aberto</option>
              <option value="Atendimento">Em Atendimento</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            type="submit"
            disabled={carregando}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {carregando ? <Loader2 size={18} className="animate-spin" /> : 'Aplicar Filtros'}
          </button>
        </div>
      </form>

      {/* Resumo Rápido (Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><BarChart3 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total no Período</p>
            <h3 className="text-xl font-bold text-gray-900">{carregando ? '-' : totalChamados} Chamados</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Taxa de Resolução</p>
            <h3 className="text-xl font-bold text-gray-900">{carregando ? '-' : `${taxaResolucao}%`}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Clock size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tempo Médio (SLA)</p>
            <h3 className="text-xl font-bold text-gray-900">Em breve</h3>
          </div>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800">Resultados da Pesquisa</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Setor</th>
                <th className="px-6 py-3">Assunto</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {carregando ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-blue-500 mb-2" />
                    Carregando dados da Sankhya...
                  </td>
                </tr>
              ) : dados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum chamado encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                dados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.id}</td>
                    <td className="px-6 py-4">{item.dataAbertura}</td>
                    <td className="px-6 py-4">{item.setor}</td>
                    <td className="px-6 py-4 truncate max-w-[200px]" title={item.problema}>{item.assunto}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        item.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 
                        item.status === 'Aberto' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!carregando && dados.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500 bg-gray-50">
            A exibir {dados.length} registo(s).
          </div>
        )}
      </div>

    </div>
  );
}