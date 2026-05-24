import { Fetcher } from "openapi-typescript-fetch";
import { addAuth, addBaseUrl } from ".";
import { paths } from "../server-client";

const apiClient = Fetcher.for<paths>();
apiClient.configure({
  use: [addAuth(), addBaseUrl()],
});

export const getApiClient = () => apiClient;
