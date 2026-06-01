import api from "./api";

export const scanQr = (payload) => api.post("/kehadiran/scan", payload);
export const getRiwayatKehadiran = () => api.get("/kehadiran/riwayat");
