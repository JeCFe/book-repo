"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function ManageBookshelf({
  params,
}: {
  params: { bookshelfId: string };
}) {
  const { bookshelfId } = params;

  console.log(bookshelfId);

  return <>{bookshelfId}</>;
}
