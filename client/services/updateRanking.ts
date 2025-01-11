import { getApiClient } from ".";

export const updateRanking = getApiClient()
  .path("/action/rate-customer-book")
  .method("post")
  .create();
