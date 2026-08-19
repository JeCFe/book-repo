import { getApiClient } from ".";

export const updateComment = getApiClient()
  .path("/action/comment-customer-book")
  .method("post")
  .create();
