// Arquivo: api/dados.js

export default async function handler(req, res) {
  try {
    // SUBSTITUA PELA SUA URL REAL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyk5BI6QE-iGcyTpIYK67a7vPEaEGaRtieMAP5y9rWSMA1zdNq0ZHWh72m3W2q9f7Z-Kg/exec'; 
    
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`Erro na API do Google: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Adiciona o header CORS para permitir o acesso
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
