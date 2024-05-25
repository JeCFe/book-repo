import { Modal } from "@/components";
import { SetupBook } from "@/hooks";
import { useGetBook } from "@/hooks/useGetBook";
import { Spinner } from "@jecfe/react-design-system";
import Image from "next/image";
import { Dispatch, ReactNode, SetStateAction, useEffect, useMemo } from "react";

type Props = {
  isbn?: string;
  addBook: (book: SetupBook) => void;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setPassingIsbn: Dispatch<SetStateAction<string | undefined>>;
  setCurrentIsbn: Dispatch<SetStateAction<string | undefined>>;
};

export function AddBookModal({
  isbn,
  addBook,
  showModal,
  setShowModal,
  setPassingIsbn,
  setCurrentIsbn,
}: Props) {
  const { data, isLoading } = useGetBook(isbn);
  const setupBook: SetupBook | undefined = useMemo(():
    | SetupBook
    | undefined => {
    if (data === undefined) {
      return undefined;
    }
    return {
      isbn: data.isbn as string,
      name: data.name as string,
      release: data.release as string,
      picture: data.picture as string,
      pageCount: data.pageCount,
      authors: data.authors as string[] | undefined,
      subjects: data.subjects as string[] | undefined,
    };
  }, [data]);

  useEffect(() => console.log(setupBook), [setupBook]);
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setPassingIsbn(undefined);
        setShowModal(false);
      }}
      onConfirm={() => {
        if (setupBook === undefined) {
          return;
        }
        addBook(setupBook);
        setPassingIsbn(undefined);
        setShowModal(false);
        setCurrentIsbn(undefined);
      }}
      error=""
      actioning={isLoading}
      disabled={setupBook === undefined}
    >
      <>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Is this the book?
        </h1>

        {isLoading && (
          <div className="flex flex-col items-center justify-center md:flex-row">
            <div className="flex items-center justify-center rounded border border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]">
              <Spinner className="flex" />
            </div>
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="flex" />
            </div>
          </div>
        )}

        {!isLoading && setupBook === undefined && "Unable to find that book"}
        {setupBook !== undefined && (
          <div className="mt-4 flex flex-col space-x-2 md:flex-row ">
            <div className="">
              <Image
                alt={"test"}
                src={setupBook.picture ?? ""}
                width={192}
                height={256}
                onError={() => "Oops"}
                className="flex items-center justify-center rounded border-2 border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <RenderSection title="Book Title">{setupBook.name}</RenderSection>
              <RenderSection title="Release Year">
                {setupBook.release}
              </RenderSection>

              {setupBook.pageCount && setupBook.pageCount > 0 && (
                <RenderSection title="Page Count">
                  <div className="max-w-sm">{setupBook.pageCount}</div>
                </RenderSection>
              )}

              {setupBook.authors && setupBook.authors.length > 0 && (
                <RenderSection title="Authors">
                  <div className="max-w-sm">
                    {setupBook.authors?.join(", ")}
                  </div>
                </RenderSection>
              )}
              {setupBook.subjects && setupBook.subjects.length > 0 && (
                <RenderSection title="Subjects">
                  <div className="max-w-sm">
                    {setupBook.subjects?.join(", ")}
                  </div>
                </RenderSection>
              )}
            </div>
          </div>
        )}
        <h2 className="mb-2 mt-2 text-sm font-bold tracking-tight text-slate-600">
          This data is supplied from OpenLibrary, you will be able to raise any
          inaccuracies or missing data with an admin when your account is setup.
        </h2>
      </>
    </Modal>
  );
}

function RenderSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <h4 className="text-lg font-bold tracking-tight text-slate-700">
        {title}
      </h4>
      <div className="text-sm text-slate-900">{children}</div>
    </div>
  );
}
