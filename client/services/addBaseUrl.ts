import { Middleware } from "openapi-typescript-fetch";
import { getEndpoint } from "./getEndpoints";

export const addBaseUrl = (): Middleware => async (url, init, next) => {
  const baseurl = await getEndpoint();
  return next(baseurl.concat(url), init);
};
