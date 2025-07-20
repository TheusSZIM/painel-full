export default async function handler(req, res) {
  const response = await fetch('https://script.google.com/macros/s/AKfycbxU6-kwa96BmNMv78tUJFhQhmkVGJy_yuU8E8z8eV6mTaWrFhHw/exec');
  const data = await response.json();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json(data);
}
