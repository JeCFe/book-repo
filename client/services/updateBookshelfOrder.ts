import { getApiClient } from ".";

export const updateBookshelfOrder = getApiClient()
  .path("/action/update-bookshelf-order")
  .method("post")
  .create();
