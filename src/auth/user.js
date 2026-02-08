export const AUTH_USER = {
  id: "user-1",
  username: "admin",
  password: "password",
};

export function validateCredentials({ username, password }) {
  return username === AUTH_USER.username && password === AUTH_USER.password;
}
