import { Modal } from "@/components";
import { SetupBook } from "@/hooks";
import { useGetBook } from "@/hooks/useGetBook";
import { Spinner } from "@jecfe/react-design-system";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
import { Picture } from "../../../components/Picture";

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
  const setupBook = useMemo(() => {
    if (data === undefined) {
      return undefined;
    }
    return {
      isbn: data.isbn as string,
      name: data.name as string,
      release: data.release,
      picture: data.picture as string,
      pageCount: data.pageCount,
      authors: data.authors,
      subjects: data.subjects,
    };
  }, [data]);

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
              <Spinner className="flex" fast={isLoading} />
            </div>
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="flex" fast={isLoading} />
            </div>
          </div>
        )}

        {!isLoading && setupBook === undefined && "Unable to find that book"}
        {setupBook !== undefined && (
          <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div>
              <Picture
                size="large"
                pictureUrl={setupBook.picture}
                title={setupBook.name}
                loading={isLoading}
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
        <h2 className="mb-2 mt-2 max-w-md text-sm font-bold tracking-tight text-slate-600">
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
