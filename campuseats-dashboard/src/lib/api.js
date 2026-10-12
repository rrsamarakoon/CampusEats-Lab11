// One place for the backend address. Change it in .env.development.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5243";

export const MENU_URL = `${API_URL}/api/menu`;
