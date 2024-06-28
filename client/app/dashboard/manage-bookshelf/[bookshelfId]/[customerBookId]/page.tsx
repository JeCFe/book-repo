import { useGetCustomerBook } from "@/hooks";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor } from "@jecfe/react-design-system";

type Props = {
  params: { customerBookId: string; bookshelfId: string };
};

export default withPageAuthRequired(function ManageBook({
  params,
  user,
}: Props & { user: UserProfile }) {
  const { data, isLoading } = useGetCustomerBook(
    user.sub!,
    params.customerBookId,
  );

  return (
    <div>
      <div className="flex flex-row space-x-2">
        <Anchor href="/dashboard" className="pb-6">{`< Dashboard`}</Anchor>
        <Anchor
          href={`/dashboard/manage-bookshelf/${encodeURIComponent(params.bookshelfId)}`}
          className="pb-6"
        >
          {"< Manage Bookshelf"}
        </Anchor>
        <div className="underline underline-offset-4">{"< Manage Book"}</div>
      </div>
      <h1 className="flex flex-col pb-4 text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Manage Book`}
      </h1>
    </div>
  );
});
