import { Middleware } from "openapi-typescript-fetch";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export const addAuth = (): Middleware => async (url, init, next) => {
  if (!cachedToken || Date.now() >= tokenExpiresAt) {
    const response = await fetch("/api/protected");
    cachedToken = await response.json();
    tokenExpiresAt = Date.now() + 55 * 60 * 1000; // cache for 55 minutes
  }
  init.headers.append("Authorization", `Bearer ${cachedToken}`);
  return next(url, init);
};
