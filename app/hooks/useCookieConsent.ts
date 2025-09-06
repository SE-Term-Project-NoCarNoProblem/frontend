export type ConsentStatus = "accepted" | "denied" | null;

export function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cookieConsent") as ConsentStatus;
}

export function setStoredConsent(status: ConsentStatus) {
  if (typeof window === "undefined" || !status) return;
  localStorage.setItem("cookieConsent", status);
}
