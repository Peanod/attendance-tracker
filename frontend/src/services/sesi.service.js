import api from "./api";

export const createSesi = (payload) => api.post("/sesi", payload);
export const getSesiById = (id) => api.get(`/sesi/${id}`);
export const endSesi = (id) => api.put(`/sesi/${id}/end`);