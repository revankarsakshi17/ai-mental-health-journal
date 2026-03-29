// Save user data after login
export const saveAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Get logged in user
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Get token
export const getToken = () => localStorage.getItem('token');

// Check if logged in
export const isLoggedIn = () => !!localStorage.getItem('token');

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../pages/login.html';
};

// Redirect to login if not logged in
export const requireAuth = () => {
  if (!isLoggedIn()) {
    window.location.href = '../pages/login.html';
  }
};