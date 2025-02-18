export const login = async (username: string, password: string) => {
  const response = await fetch("http://localhost:8000/api/employee/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const data = await response.json()
  localStorage.setItem("token", data.token)
  return data
}

export const logout = () => {
  localStorage.removeItem("token")
}

export const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}

export const getToken = () => {
  return localStorage.getItem("token")
}
