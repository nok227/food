// frontend/src/services/masterApi.js
const BASE_URL = import.meta.env.VITE_API_URL + "/api/master";

export const masterAPI = {
  // Category
  getCategories: () => fetch(`${BASE_URL}/categories`).then((r) => r.json()),
  createCategory: (name) =>
    fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),
  deleteCategory: (id) =>
    fetch(`${BASE_URL}/categories/${id}`, { method: "DELETE" }).then((r) => r.json()),

  // Size
  getSizes: () => fetch(`${BASE_URL}/sizes`).then((r) => r.json()),
  createSize: (name) =>
    fetch(`${BASE_URL}/sizes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),
  deleteSize: (id) =>
    fetch(`${BASE_URL}/sizes/${id}`, { method: "DELETE" }).then((r) => r.json()),

  // Unit
  getUnits: () => fetch(`${BASE_URL}/units`).then((r) => r.json()),
  createUnit: (name) =>
    fetch(`${BASE_URL}/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((r) => r.json()),
  deleteUnit: (id) =>
    fetch(`${BASE_URL}/units/${id}`, { method: "DELETE" }).then((r) => r.json()),
};