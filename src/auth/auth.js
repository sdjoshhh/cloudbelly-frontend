const getUsers = () => {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

const setCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

export const register = (email, password, name) => {
  const users = getUsers();

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = { email, password, name };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  setCurrentUser({ email, name }); // Auto login after register
}

export const login = (email, password) => {
  const users = getUsers();

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  setCurrentUser({ email: user.email, name: user.name });
}

export const logout = () => {
  localStorage.removeItem("currentUser");
}

