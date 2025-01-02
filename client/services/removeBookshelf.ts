import { getApiClient } from ".";

export const removeBookshelf = getApiClient()
  .path("/action/remove-bookshelf")
  .method("post")
  .create();
