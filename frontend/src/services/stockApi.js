const BASE_URL = import.meta.env.VITE_API_URL + "/api/stocks";

// Helper function សម្រាប់ handle response ໃຫ້ປອດໄພຂຶ້ນ
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່");
  }
  return data;
};

export const stockAPI = {
  getStocks: () => fetch(BASE_URL).then(handleResponse),

  createStock: (data) =>
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),

  deleteStock: (id) =>
    fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    }).then(handleResponse),

  importStock: (stockId, quantity, note) =>
    fetch(`${BASE_URL}/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockId, quantity, note }),
    }).then(handleResponse),

  saveRecipe: (menuId, items) =>
    fetch(`${BASE_URL}/recipe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuId, items }),
    }).then(handleResponse),

  createOrderAndDeductStock: (customer, items) =>
    fetch(`${BASE_URL}/order-with-deduction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, items }),
    }).then(handleResponse),

  getImportHistory: () => fetch(`${BASE_URL}/imports`).then(handleResponse),
};