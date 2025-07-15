// Script.js funcional com fallback para dados locais
// URL do backend
const BACKEND_URL = 'https://empilhadeira-backend.onrender.com';

// Variáveis globais
let solicitacoes = [];
let statusData = {};

// Dados de fallback (caso backend não responda)
const dadosFallback = [
    {
        id: 'EMP002',
        timestamp: '21/06/2025, 14:39:55',
        solicitante: 'Matheus',
        area: '🚚Logística',
        tipoOperacao: '📦Entrega',
        codigoItem: '161.100.002',
        local: '',
        observacao: '',
        tempoAtendimento: '🚨00:15 (Urgente)',
        status: 'pendente',
        operador: '',
        horarioInicio: '',
        horarioConclusao: '',
        observacaoOperador: '',
        row_index: 2
    },
    {
        id: 'EMP003',
        timestamp: '21/06/2025, 17:30:43',
        solicitante: 'Matheus',
        area: '🏭Injeção de Alumínio',
        tipoOperacao: '📦Entrega',
        codigoItem: '100.011.724',
        local: '',
        observacao: '',
        tempoAtendimento: '🚨00:15 (Urgente)',
        status: 'pendente',
        operador: '',
        horarioInicio: '',
        horarioConclusao: '',
        observacaoOperador: '',
        row_index: 3
    },
    {
        id: 'EMP004',
        timestamp: '21/06/2025, 17:31:25',
        solicitante: 'Carlos',
        area: '🚚Logística',
        tipoOperacao: '🔒Guarda',
        codigoItem: 'Caixa 37',
        local: '',
        observacao: '',
        tempoAtendimento: '🟡00:30 (Moderado)',
        status: 'pendente',
        operador: '',
        horarioInicio: '',
        horarioConclusao: '',
        observacaoOperador: '',
        row_index: 4
    },
    {
        id: 'EMP005',
        timestamp: '21/06/2025, 17:35:03',
        solicitante: 'Bigode',
        area: '⚙️Usinagem',
        tipoOperacao: '📦Entrega',
        codigoItem: '16.110.1750',
        local: '',
        observacao: '',
        tempoAtendimento: '🟡00:30 (Moderado)',
        status: 'pendente',
        operador: '',
        horarioInicio: '',
        horarioConclusao: '',
        observacaoOperador: '',
        row_index: 5
    },
    {
        id: 'EMP006',
        timestamp: '21/06/2025, 21:19:19',
        solicitante: 'THEUS',
        area: '🚚Logística',
        tipoOperacao: '✔️Validação',
        codigoItem: '16.110.0004',
        local: '',
        observacao: '',
        tempoAtendimento: '🚨00:15 (Urgente)',
        status: 'pendente',
        operador: '',
        horarioInicio: '',
        horarioConclusao: '',
        observacaoOperador: '',
        row_index: 6
    },
    {
        id: 'EMP007',
        timestamp: '22/06/2025, 11:41:08',
        solicitante: 'Thiago',
        area: '🧪Injeção PPS',
        tipoOperacao: '📦Entrega',
        codigoItem: 'Pps branco',
        local: 'I5-10',
        observacao: '',
        tempoAtendimento: '🟡00:30 (Moderado)',
        status: 'pendente',
        operador: '',
        horarioInicio: '',
        horarioConclusao: '',
        observacaoOperador: '',
        row_index: 7
    }
];

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Função para tentar carregar do backend
async function tentarCarregarBackend() {
    try {
        console.log('Tentando conectar com backend...');
        const response = await fetch(`${BACKEND_URL}/api/sheets/read-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.data) {
            console.log('Backend conectado com sucesso!');
            showNotification('Dados carregados do servidor!', 'success');
            return data.data;
        } else {
            throw new Error('Dados inválidos do backend');
        }
    } catch (error) {
        console.log('Erro ao conectar com backend:', error);
        return null;
    }
}

// Função principal para carregar dados
async function carregarDados() {
    console.log('Inicializando carregamento de dados...');
    
    // Mostrar loading
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
    
    // Tentar carregar do backend primeiro
    const dadosBackend = await tentarCarregarBackend();
    
    if (dadosBackend) {
        // Usar dados do backend
        solicitacoes = dadosBackend;
        showNotification('Conectado ao servidor - dados em tempo real!', 'success');
    } else {
        // Usar dados de fallback
        solicitacoes = [...dadosFallback];
        showNotification('Usando dados locais - funcionalidade limitada', 'info');
    }
    
    // Carregar status salvos localmente
    const statusSalvos = localStorage.getItem('empilhadeira_status');
    if (statusSalvos) {
        statusData = JSON.parse(statusSalvos);
        
        // Aplicar status salvos
        solicitacoes.forEach(solicitacao => {
            if (statusData[solicitacao.id]) {
                const savedStatus = statusData[solicitacao.id];
                solicitacao.status = savedStatus.status || solicitacao.status;
                solicitacao.observacaoOperador = savedStatus.observacaoOperador || '';
                solicitacao.horarioInicio = savedStatus.horarioInicio || '';
                solicitacao.horarioConclusao = savedStatus.horarioConclusao || '';
                solicitacao.operador = savedStatus.operador || '';
            }
        });
    }
    
    // Esconder loading
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    console.log('Dados carregados:', solicitacoes.length, 'solicitações');
    atualizarInterface();
}

// Função para salvar status localmente
function salvarStatusLocal(requestId, status, observacao = '', horarioInicio = null, horarioConclusao = null) {
    if (!statusData) statusData = {};
    
    statusData[requestId] = {
        status: status,
        observacaoOperador: observacao,
        horarioInicio: horarioInicio,
        horarioConclusao: horarioConclusao,
        operador: 'Operador Local',
        timestamp: new Date().toLocaleString('pt-BR')
    };
    
    localStorage.setItem('empilhadeira_status', JSON.stringify(statusData));
    
    // Atualizar dados locais
    const solicitacao = solicitacoes.find(s => s.id === requestId);
    if (solicitacao) {
        solicitacao.status = status;
        solicitacao.observacaoOperador = observacao;
        solicitacao.horarioInicio = horarioInicio || solicitacao.horarioInicio;
        solicitacao.horarioConclusao = horarioConclusao || solicitacao.horarioConclusao;
        solicitacao.operador = 'Operador Local';
    }
    
    showNotification('Status salvo localmente!', 'success');
    atualizarInterface();
}

// Função para atualizar interface
function atualizarInterface() {
    if (!solicitacoes || solicitacoes.length === 0) {
        console.log('Nenhuma solicitação para exibir');
        return;
    }
    
    // Atualizar contadores
    atualizarContadores();
    
    // Atualizar lista
    atualizarListaSolicitacoes();
}

// Função para atualizar contadores
function atualizarContadores() {
    const pendentes = solicitacoes.filter(s => s.status === 'pendente').length;
    const emAndamento = solicitacoes.filter(s => s.status === 'em_andamento').length;
    const concluidos = solicitacoes.filter(s => s.status === 'concluido').length;
    
    const contadorPendentes = document.getElementById('contador-pendentes');
    const contadorAndamento = document.getElementById('contador-andamento');
    const contadorConcluidos = document.getElementById('contador-concluidos');
    
    if (contadorPendentes) contadorPendentes.textContent = pendentes;
    if (contadorAndamento) contadorAndamento.textContent = emAndamento;
    if (contadorConcluidos) contadorConcluidos.textContent = concluidos;
}

// Função para atualizar lista de solicitações
function atualizarListaSolicitacoes() {
    const container = document.getElementById('solicitacoes-container');
    if (!container) {
        console.log('Container de solicitações não encontrado');
        return;
    }
    
    container.innerHTML = '';
    
    // Aplicar filtros
    const filtroStatus = document.getElementById('filtro-status')?.value || 'todos';
    const filtroArea = document.getElementById('filtro-area')?.value || 'todas';
    const filtroData = document.getElementById('filtro-data')?.value || '';
    
    let solicitacoesFiltradas = solicitacoes.filter(solicitacao => {
        let passaFiltro = true;
        
        if (filtroStatus !== 'todos') {
            if (filtroStatus === 'pendentes' && solicitacao.status !== 'pendente') passaFiltro = false;
            if (filtroStatus === 'andamento' && solicitacao.status !== 'em_andamento') passaFiltro = false;
            if (filtroStatus === 'concluidos' && solicitacao.status !== 'concluido') passaFiltro = false;
        }
        
        if (filtroArea !== 'todas' && !solicitacao.area.toLowerCase().includes(filtroArea.toLowerCase())) {
            passaFiltro = false;
        }
        
        if (filtroData && !solicitacao.timestamp.includes(filtroData)) {
            passaFiltro = false;
        }
        
        return passaFiltro;
    });
    
    // Criar cards das solicitações
    solicitacoesFiltradas.forEach(solicitacao => {
        const card = criarCardSolicitacao(solicitacao);
        container.appendChild(card);
    });
    
    if (solicitacoesFiltradas.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhuma solicitação encontrada com os filtros aplicados.</p>';
    }
}

// Função para criar card de solicitação
function criarCardSolicitacao(solicitacao) {
    const card = document.createElement('div');
    card.className = `solicitacao-card status-${solicitacao.status}`;
    
    const statusClass = {
        'pendente': 'pendente',
        'em_andamento': 'andamento',
        'concluido': 'concluido'
    };
    
    const statusText = {
        'pendente': 'Pendente',
        'em_andamento': 'Em Andamento',
        'concluido': 'Concluído'
    };
    
    card.innerHTML = `
        <div class="card-header">
            <span class="solicitacao-id">${solicitacao.id}</span>
            <span class="status-badge ${statusClass[solicitacao.status]}">${statusText[solicitacao.status]}</span>
        </div>
        <div class="card-content">
            <div class="info-row">
                <strong>Solicitante:</strong> ${solicitacao.solicitante}
            </div>
            <div class="info-row">
                <strong>Área:</strong> ${solicitacao.area}
            </div>
            <div class="info-row">
                <strong>Operação:</strong> ${solicitacao.tipoOperacao}
            </div>
            <div class="info-row">
                <strong>Item:</strong> ${solicitacao.codigoItem}
            </div>
            <div class="info-row">
                <strong>Tempo:</strong> ${solicitacao.tempoAtendimento}
            </div>
            <div class="info-row">
                <strong>Data:</strong> ${solicitacao.timestamp}
            </div>
            ${solicitacao.local ? `<div class="info-row"><strong>Local:</strong> ${solicitacao.local}</div>` : ''}
            ${solicitacao.observacao ? `<div class="info-row"><strong>Observação:</strong> ${solicitacao.observacao}</div>` : ''}
            ${solicitacao.observacaoOperador ? `<div class="info-row"><strong>Obs. Operador:</strong> ${solicitacao.observacaoOperador}</div>` : ''}
            ${solicitacao.horarioInicio ? `<div class="info-row"><strong>Iniciado:</strong> ${solicitacao.horarioInicio}</div>` : ''}
            ${solicitacao.horarioConclusao ? `<div class="info-row"><strong>Concluído:</strong> ${solicitacao.horarioConclusao}</div>` : ''}
        </div>
        <div class="card-actions">
            ${criarBotoesAcao(solicitacao)}
        </div>
    `;
    
    return card;
}

// Função para criar botões de ação
function criarBotoesAcao(solicitacao) {
    if (solicitacao.status === 'pendente') {
        return `<button class="btn-iniciar" onclick="iniciarAtendimento('${solicitacao.id}')">Iniciar Atendimento</button>`;
    } else if (solicitacao.status === 'em_andamento') {
        return `
            <button class="btn-observacao" onclick="adicionarObservacao('${solicitacao.id}')">Adicionar Observação</button>
            <button class="btn-concluir" onclick="concluirAtendimento('${solicitacao.id}')">Concluir</button>
        `;
    } else {
        return `<span class="status-concluido">✅ Concluído</span>`;
    }
}

// Funções de ação
function iniciarAtendimento(requestId) {
    const horarioInicio = new Date().toLocaleString('pt-BR');
    salvarStatusLocal(requestId, 'em_andamento', '', horarioInicio, null);
}

function adicionarObservacao(requestId) {
    const observacao = prompt('Digite sua observação:');
    if (observacao) {
        const solicitacao = solicitacoes.find(s => s.id === requestId);
        if (solicitacao) {
            salvarStatusLocal(requestId, 'em_andamento', observacao, solicitacao.horarioInicio, null);
        }
    }
}

function concluirAtendimento(requestId) {
    const horarioConclusao = new Date().toLocaleString('pt-BR');
    const solicitacao = solicitacoes.find(s => s.id === requestId);
    if (solicitacao) {
        salvarStatusLocal(requestId, 'concluido', solicitacao.observacaoOperador, solicitacao.horarioInicio, horarioConclusao);
    }
}

// Função para aplicar filtros
function aplicarFiltros() {
    atualizarListaSolicitacoes();
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de empilhadeira...');
    
    // Configurar event listeners para filtros
    const filtroStatus = document.getElementById('filtro-status');
    const filtroArea = document.getElementById('filtro-area');
    const filtroData = document.getElementById('filtro-data');
    const btnAtualizar = document.getElementById('btn-atualizar');
    
    if (filtroStatus) filtroStatus.addEventListener('change', aplicarFiltros);
    if (filtroArea) filtroArea.addEventListener('change', aplicarFiltros);
    if (filtroData) filtroData.addEventListener('change', aplicarFiltros);
    if (btnAtualizar) btnAtualizar.addEventListener('click', carregarDados);
    
    // Carregar dados iniciais
    carregarDados();
});

// Função para atualizar dados manualmente
function atualizarDados() {
    carregarDados();
}

