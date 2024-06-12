"use client";
import { Checkbox, SummaryTable } from "@/components";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Anchor, Button } from "@jecfe/react-design-system";

export default withPageAuthRequired(function ManageUser({ user }) {
  return (
    <>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Manage ${user.nickname}`}
      </h1>
      <div className="mt-4 flex max-w-sm flex-row pb-10 text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Here you can view and manage the customer details we have about you. Both authentication account detail and details held in our databases.`}
      </div>

      <div className="flex max-w-3xl flex-row  space-x-4 py-4">
        <Button variant="primary" size="large">
          Edit nickname
        </Button>
        <div className="flex flex-grow" />
        <Button variant="destructive" size="large">
          Forget me
        </Button>
      </div>
      <SummaryTable
        title="Authorisation details we know about you:"
        rows={[
          {
            title: "Nickname",
            content: user.nickname ?? "Missing data",
          },
          {
            title: "Email",
            content: user.email ?? "Missing data",
          },
          {
            title: "User Id",
            content: user.sub ?? "Missing data",
          },
          {
            title: "Last updated",
            content: user.updated_at ?? "Missing data",
          },
        ]}
      />
      <div className="flex flex-col space-y-4 py-4">
        <Checkbox theme="dark" size="large">
          Download authorisation data
        </Checkbox>
        <Checkbox theme="dark" size="large">
          Download database data
        </Checkbox>
      </div>

      <div className="flex w-fit flex-col space-y-2 pb-20 text-lg">
        <Anchor href="/dashboard">Go to Dashboard</Anchor>
        <Anchor href="/">Go to Home</Anchor>
      </div>
    </>
  );
});
