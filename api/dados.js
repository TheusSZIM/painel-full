// ================================================================= //
// ==    Proxy Definitivo - API Nativa do Google Sheets v1.0    == //
// ==    Solução robusta e sem limites para o painel            == //
// ================================================================= //

export default async function handler(req, res) {
  // Configurações da API do Google Sheets
  const SPREADSHEET_ID = '1vmuL-OXeanaYhVFD4sKJpHWfITxSyXFixyOleMBk4RE';
  const API_KEY = 'AIzaSyD2IxYXG8vhOLgk8MWPifObs8v7a6O1LNA';
  const SHEET_NAME = 'Dados'; // Nome da aba na planilha
  
  // Habilita CORS para permitir acesso do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Responde às requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Constrói a URL da API do Google Sheets
    const range = `${SHEET_NAME}!A:Z`; // Lê todas as colunas da aba
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
    
    console.log('Fazendo requisição para:', url);
    
    // Faz a requisição para a API do Google
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro da API do Google: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Verifica se há dados na planilha
    if (!data.values || data.values.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }
    
    // Processa os dados da planilha
    const headers = data.values[0]; // Primeira linha são os cabeçalhos
    const rows = data.values.slice(1); // Demais linhas são os dados
    
    // Converte os dados para formato de objetos
    const formattedData = rows.map((row, index) => {
      const rowData = {};
      
      headers.forEach((header, columnIndex) => {
        // Normaliza o nome da coluna para facilitar o acesso
        // Remove emojis, caracteres especiais e substitui espaços por underscores
        const normalizedHeader = header.toString()
                                     .toLowerCase()
                                     .replace(/[^a-z0-9\s]/g, '') // Remove caracteres não alfanuméricos (exceto espaços)
                                     .trim()
                                     .replace(/\s+/g, '_'); // Substitui espaços por underscores
        rowData[normalizedHeader] = row[columnIndex] || '';
      });
      
      // Adiciona o índice da linha para referência
      rowData['row_index'] = index + 2; // +2 porque começamos da linha 2 (após cabeçalho)
      
      return rowData;
    });
    
    console.log(`Dados processados: ${formattedData.length} registros`);
    
    // Retorna os dados formatados
    return res.status(200).json({
      success: true,
      data: formattedData,
      total: formattedData.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro no proxy:', error);
    
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
