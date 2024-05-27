import { Fetcher } from "openapi-typescript-fetch";
import { addAuth, addBaseUrl } from ".";
import { paths } from "../server-client";

export const getApiClient = () => {
  const client = Fetcher.for<paths>();
  client.configure({
    use: [addBaseUrl(), addAuth()],
  });
  return client;
};
