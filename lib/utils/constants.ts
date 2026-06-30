export const APP_TITLE = "InvestPrep";
export const APP_DESCRIPTION =
  "Track stock intentions and keep personal notes alongside real-time data.";

// Query param that opens the auth modal on the landing page, e.g. /?auth=login
export const AUTH_PARAM = "auth";
export type AuthMode = "login" | "register";
export const AUTH_MODES: readonly AuthMode[] = ["login", "register"];
