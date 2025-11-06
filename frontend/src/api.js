import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const getConversations = () => axios.get(`${API_BASE}/conversations/`);
export const createConversation = (title) =>
  axios.post(`${API_BASE}/conversations/`, { title });
export const getMessages = (id) =>
  axios.get(`${API_BASE}/conversations/${id}/`);
export const sendMessage = (id, content) =>
  axios.post(`${API_BASE}/conversations/${id}/messages/`, { content, sender: "user" });
export const endConversation = (id) =>
  axios.post(`${API_BASE}/conversations/${id}/end/`);

