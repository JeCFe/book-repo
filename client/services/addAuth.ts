import { Middleware } from "openapi-typescript-fetch";

export const addAuth = (): Middleware => async (url, init, next) => {
  const response = await fetch("/api/protected");
  const tokenData = await response.json();
  init.headers.append("Authorization", `Bearer ${tokenData}`);
  return next(url, init);
};
