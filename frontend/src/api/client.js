const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const apiRequest = async (path, options = {}, token) => {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message ?? "Request failed");
    }

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();
    return payload?.data ?? payload;
  } catch (error) {
    throw new Error(error.message ?? "Unable to reach LifeLink services");
  }
};

export { API_URL };
