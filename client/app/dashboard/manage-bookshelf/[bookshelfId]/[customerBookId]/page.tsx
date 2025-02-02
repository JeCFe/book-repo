"use client";

import { ViewCustomerBook } from "@/app/dashboard/ViewCustomerBook";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";

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
      breadcrumbHref={`manage-bookshelf/${encodeURIComponent(params.bookshelfId)}`}
      user={user}
      breadcrumbReturn="Manage Bookshelf"
    />
  );
});
