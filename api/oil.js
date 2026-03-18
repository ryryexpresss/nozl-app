export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const r = await fetch(
      "https://query1.finance.yahoo.com/v8/finance/chart/BZ%3DF?interval=1m&range=1d"
    );
    const d = await r.json();
    const price = d?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (price && price > 0) {
      res.json({ price: parseFloat(price.toFixed(2)) });
    } else {
      res.json({ price: 87.4 });
    }
  } catch (e) {
    console.log("Yahoo oil error:", e);
    res.json({ price: 87.4 });
  }
}
