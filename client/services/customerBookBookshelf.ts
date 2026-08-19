import { getApiClient } from ".";

export const addCustomerBookBookshelf = getApiClient()
  .path("/action/add-customer-book-bookshelf")
  .method("post")
  .create();
