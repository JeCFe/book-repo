import { Middleware } from "openapi-typescript-fetch";
import { getEndpoint } from "./getEndpoints";

let cachedBaseUrl: string | null = null;

export const addBaseUrl = (): Middleware => async (url, init, next) => {
  if (!cachedBaseUrl) {
    cachedBaseUrl = await getEndpoint();
  }
  return next(cachedBaseUrl.concat(url), init);
};
