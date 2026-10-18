export function saveAuth(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);
  localStorage.setItem("role", data.role);
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function getUsername() {
  return localStorage.getItem("username");
}
export function getRole() {
  return localStorage.getItem("role");
}