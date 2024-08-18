import { getApiClient } from "./getApiClient";

export const addBookshelfBook = getApiClient()
  .path("/action/add-book-shelf-book")
  .method("post")
  .create();
