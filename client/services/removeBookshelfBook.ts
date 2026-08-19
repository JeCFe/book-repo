import { getApiClient } from ".";

export const removeBookshelfBook = getApiClient()
  .path("/action/remove-bookshelf-book")
  .method("post")
  .create();
