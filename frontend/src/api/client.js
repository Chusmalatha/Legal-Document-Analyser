import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function sendChatMessage(message) {
  const response = await axios.post(`${API_BASE_URL}/chat`, {
    question: message,
  });

  return response.data.answer;
}