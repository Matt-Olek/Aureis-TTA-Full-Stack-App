import axios from 'axios';

const API_URL = 'http://localhost:8000/api/token/';

// Login service
const login = async (username, password) => {
  const response = await axios.post(API_URL, { username, password });
  if (response.data.access) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout service
const logout = () => {
  localStorage.removeItem('user');
  window.location.reload();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.access;
    };

export default {
    login,
    logout,
    getAuth,
    getCurrentUser,
  // register,
};
