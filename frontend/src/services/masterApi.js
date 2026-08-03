// frontend/src/services/masterApi.js
const BASE_URL = import.meta.env.VITE_API_URL + "/api/master";

export const masterAPI = {
  getMaterials: () => fetch(`${BASE_URL}/materials`).then((r) => r.json()),
  
  // 🟢 ปรับให้ส่งชื่อ และ URL รูปภาพไปยัง Backend
  createMaterial: (name, imageUrl) =>
    fetch(`${BASE_URL}/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, imageUrl }),
    }).then((r) => r.json()),

  deleteMaterial: (id) =>
    fetch(`${BASE_URL}/materials/${id}`, { method: "DELETE" }).then((r) => r.json()),

  // Category
  getCategories: (materialId) => {
    const url = materialId ? `${BASE_URL}/categories?materialId=${materialId}` : `${BASE_URL}/categories`;
    return fetch(url).then((r) => r.json());
  },
  createCategory: (name, materialId) =>
    fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, materialId }),
    }).then((r) => r.json()),
  deleteCategory: (id) =>
    fetch(`${BASE_URL}/categories/${id}`, { method: "DELETE" }).then((r) => r.json()),

  // Size
  getSizes: (categoryId) => {
    const url = categoryId ? `${BASE_URL}/sizes?categoryId=${categoryId}` : `${BASE_URL}/sizes`;
    return fetch(url).then((r) => r.json());
  },
  createSize: (name, categoryId) =>
    fetch(`${BASE_URL}/sizes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, categoryId }),
    }).then((r) => r.json()),
  deleteSize: (id) =>
    fetch(`${BASE_URL}/sizes/${id}`, { method: "DELETE" }).then((r) => r.json()),

  // Unit
  getUnits: (categoryId, sizeId) => {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (sizeId) params.append("sizeId", sizeId);
    return fetch(`${BASE_URL}/units?${params.toString()}`).then((r) => r.json());
  },
  createUnit: (name, categoryId, sizeId) =>
    fetch(`${BASE_URL}/units`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, categoryId, sizeId }),
    }).then((r) => r.json()),
  deleteUnit: (id) =>
    fetch(`${BASE_URL}/units/${id}`, { method: "DELETE" }).then((r) => r.json()),
};