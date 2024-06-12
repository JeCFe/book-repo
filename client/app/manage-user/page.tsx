"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";

export default withPageAuthRequired(function ManageUser({ user }) {
  return (
    <>
      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        {`Manage ${user.nickname}`}
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search for the book you wish to add - these books will be added to your homeless bookshelf`}
      </div>

      <div className="flex max-w-3xl flex-col rounded border-2 border-slate-200">
        <div className="bg-slate-200 p-4 text-xl">
          Authorisation details we know about you:
        </div>
        <div className="flex flex-col space-y-2 px-4 py-2 text-lg text-slate-200">
          <div className="flex flex-row">
            <div className="font-bold">Email</div>
            <div className="flex flex-grow" />
            <div>{user.email}</div>
          </div>
          <div className="border-1 border" />
          <div className="flex flex-row">
            <div className="font-bold">Nickname</div>
            <div className="flex flex-grow" />
            <div>{user.nickname}</div>
          </div>
        </div>
      </div>
    </>
  );
});
