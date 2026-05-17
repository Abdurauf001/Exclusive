const STORAGE_KEY = "exclusive.currentUser";
const GUEST_SCOPE = "guest";

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.id || !parsed.email || !parsed.fullName) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getCurrentUserId() {
  return getCurrentUser()?.id || null;
}

export function getScopedStorageKey(baseKey, userId = getCurrentUserId()) {
  return `${baseKey}:${userId || GUEST_SCOPE}`;
}

export function readScopedItems(baseKey, userId = getCurrentUserId()) {
  try {
    const raw = localStorage.getItem(getScopedStorageKey(baseKey, userId));
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeScopedItems(baseKey, items, userId = getCurrentUserId()) {
  localStorage.setItem(getScopedStorageKey(baseKey, userId), JSON.stringify(Array.isArray(items) ? items : []));
  try {
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

export function clearScopedItems(baseKey, userId = getCurrentUserId()) {
  localStorage.removeItem(getScopedStorageKey(baseKey, userId));
  try {
    window.dispatchEvent(new Event("storage"));
  } catch {
    // ignore
  }
}

export function setCurrentUser(user) {
  const payload = {
    id: user.id,
    fullName: user.fullName || user.title || user.name,
    email: user.email,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    address: user.address || "",
    password: user.password || "",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  try {
    window.dispatchEvent(new Event("exclusive:auth"));
  } catch {
    // ignore
  }
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY);
  try {
    window.dispatchEvent(new Event("exclusive:auth"));
  } catch {
    // ignore
  }
}
