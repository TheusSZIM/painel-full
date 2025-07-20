const { google } = require("googleapis");

module.exports = async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const spreadsheetId = "1vmuL-OXeanaYhVFD4sKJpHWfITxSyXFixyOleMBk4RE"; // ID da sua planilha
    const range = "Dados!A:Z"; // Nome da aba e range de colunas

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const headers = rows[0].map((header) =>
      header
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove caracteres não alfanuméricos (exceto espaços)
        .trim()
        .replace(/\s+/g, "_") // Substitui espaços por underscores
    );

    const data = rows.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Erro ao buscar dados da planilha:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

