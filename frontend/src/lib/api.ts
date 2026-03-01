import { useAuthStore } from "@/store/useAuthStore";

// lib/api.ts
export async function apiFetch(url: string, options: RequestInit = {}) {
  // read the current auth state directly from the store (not via hook)
  // using the hook outside of a React component violates the rules of hooks and
  // was causing the access token to be `null` on every request; as a result the
  // backend always treated the client as a guest.
  const { accessToken, setAccessToken, clearAccessToken } =
    useAuthStore.getState();

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    // token expired, ask backend for a new one using the refresh cookie
    const refreshResponse = await fetch("http://localhost:4000/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      // refresh failed – clear stored token and force login
      clearAccessToken();
      window.location.href = "/login";
      return response; // still return the 401 response so callers can handle it
    }

    const data = await refreshResponse.json();
    setAccessToken(data.accessToken);

    // retry the original request with the new token
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
      credentials: "include",
    });
  }

  return response;
}
