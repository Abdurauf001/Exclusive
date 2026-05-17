export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const config = { ...options, headers };

  let response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    const networkError = new Error(
      `Server bilan bog'lanib bo'lmadi. Backend ishga tushganini tekshiring: ${API_BASE}`
    );
    networkError.cause = error;
    networkError.isNetworkError = true;
    throw networkError;
  }
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = data?.message || response.statusText || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function get(path) {
  return request(path);
}

export function post(path, body) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function put(path, body) {
  return request(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function del(path) {
  return request(path, {
    method: "DELETE",
  });
}
