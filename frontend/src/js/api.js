// Base URL for all API calls
const BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// ── Auth APIs ──────────────────────────────
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${BASE_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
};

// ── Journal APIs ───────────────────────────
export const createJournal = async (text) => {
  const res = await fetch(`${BASE_URL}/journal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ text }),
  });
  return res.json();
};

export const getJournals = async () => {
  const res = await fetch(`${BASE_URL}/journal`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  return res.json();
};

export const deleteJournal = async (id) => {
  const res = await fetch(`${BASE_URL}/journal/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  return res.json();
};

// ── AI APIs ────────────────────────────────
export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/ai/dashboard`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  return res.json();
};

export const getMoodStats = async () => {
  const res = await fetch(`${BASE_URL}/ai/mood-stats`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  return res.json();
};

export const sendChatMessage = async (messages) => {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ messages }),
  });
  return res.json();
};