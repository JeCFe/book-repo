import { SetupBook } from "@/hooks";
import { Button } from "@jecfe/react-design-system";
import { Dispatch, SetStateAction } from "react";
import { AddBookModal } from "../setup/books/AddBookModal";

type Props = {
  passingIsbn: string | undefined;
  setPassingIsbn: Dispatch<SetStateAction<string | undefined>>;
  currentIsbn: string | undefined;
  setCurrentIsbn: Dispatch<SetStateAction<string | undefined>>;
  addBook: (book: SetupBook) => Promise<void>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function AddBookByIsbn({
  passingIsbn,
  setPassingIsbn,
  currentIsbn,
  setCurrentIsbn,
  addBook,
  open,
  setOpen,
}: Props) {
  return (
    <>
      <AddBookModal
        isbn={passingIsbn as string}
        addBook={addBook}
        showModal={open}
        setShowModal={setOpen}
        setPassingIsbn={setPassingIsbn}
        setCurrentIsbn={setCurrentIsbn}
      />

      <h1 className="flex flex-col text-5xl font-bold tracking-tight text-slate-200 md:text-8xl">
        Add Book
      </h1>
      <div className="mt-4 flex max-w-sm flex-row text-xl font-bold tracking-tight text-slate-400 md:max-w-4xl md:text-3xl">
        {`Search for the book you wish to add with the ISBN`}
      </div>

      <div className="mt-10">
        <div className="mb-4 text-xl text-slate-300">{`Enter the book's ISBN`}</div>
        <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <input
            type="text"
            value={currentIsbn ?? ""}
            onChange={(e) => {
              setCurrentIsbn(e.target.value);
            }}
            placeholder="Enter ISBN..."
            className="flex w-full max-w-sm space-y-2 rounded-lg border border-black bg-slate-100 p-2.5 text-slate-900 md:max-w-xl"
          />
          <Button
            size="large"
            variant="primary"
            onClick={() => {
              setPassingIsbn(currentIsbn);
              setOpen(true);
            }}
            type="button"
            disabled={currentIsbn === undefined || currentIsbn === ""}
          >
            Lookup Book
          </Button>
        </div>
      </div>
    </>
  );
}
