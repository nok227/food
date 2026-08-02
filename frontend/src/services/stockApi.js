const BASE_URL = import.meta.env.VITE_API_URL + "/api/stocks";

export const stockAPI = {
  getStocks: () => fetch(BASE_URL).then((r) => r.json()),
  importStock: (stockId, quantity, note) =>
    fetch(`${BASE_URL}/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockId, quantity, note }),
    }).then((r) => r.json()),
  saveRecipe: (menuId, items) =>
    fetch(`${BASE_URL}/recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuId, items }),
    }).then((r) => r.json()),
  createOrderAndDeductStock: (customer, items) =>
    fetch(`${BASE_URL}/order-with-deduction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, items }),
    }).then((r) => r.json()),
  getImportHistory: () => fetch(`${BASE_URL}/imports`).then((r) => r.json()),
};