export const AUTH_LOGGED_IN_KEY = "auth.loggedIn";

export function markLoggedIn() {
  try {
    localStorage.setItem(AUTH_LOGGED_IN_KEY, "true");
    // Backward-compat with older code paths in this repo.
    localStorage.setItem("logged in", "true");
  } catch {
    // ignore storage errors (private mode, full quota, etc.)
  }
}

export function clearClientAuth() {
  try {
    localStorage.removeItem(AUTH_LOGGED_IN_KEY);
    localStorage.removeItem("logged in");
  } catch {
    // ignore
  }
}

