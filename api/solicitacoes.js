export default async function handler(req, res) {
  const response = await fetch('https://script.google.com/macros/s/AKfycby5rUjZ3mP6lPMFn7ywEQcwxOGZ0nyznhffIctsLM2ac0NypulyrCmkHusVtl_V9caUFQ/exec
');
  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
