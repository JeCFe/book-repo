import { addAuth, addBaseUrl } from ".";
import { paths } from "../server-client";
import { Fetcher } from "openapi-typescript-fetch";

export const getApiClient = () => {
  const client = Fetcher.for<paths>();
  client.configure({
    use: [addBaseUrl(), addAuth()],
  });
  return client;
};
