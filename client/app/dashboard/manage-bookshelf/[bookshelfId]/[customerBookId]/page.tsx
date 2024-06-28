import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0/client";

type Props = {
  params: { customerBookId: string };
};

export default withPageAuthRequired(function ManageBook({
  params,
  user,
}: Props & { user: UserProfile }) {});
