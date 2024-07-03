"use client";

import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { ViewCustomerBook } from "../../ViewCustomerBook";

type Props = {
  params: { customerBookId: string; bookshelfId: string };
};

export default withPageAuthRequired(function ManageBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  return (
    <ViewCustomerBook
      params={params}
      breadcrumbHref={"view-book"}
      breadcrumbReturn="View Books"
      user={user}
    />
  );
});
