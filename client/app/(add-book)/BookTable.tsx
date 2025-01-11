import { BookRow } from "@/components";
import { filterBooks } from "@/lib";
import { Table } from "@jecfe/react-design-system";

type FilteredBooks = ReturnType<typeof filterBooks>;

type Props = {
  filteredBooks: FilteredBooks | undefined;
  saveBook: (isbn: string) => void;
};

export function BookTable({ filteredBooks, saveBook }: Props) {
  return (
    <div className="flex overflow-auto pb-4">
      <Table>
        <thead>
          <tr>
            <th className="w-[15px]">Order</th>
            <th>Title</th>
            <th>Author</th>
            <th className="min-w-[200px]">ISBN</th>
            <th className="min-w-[150px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks?.map((work, i) => (
            <BookRow
              key={`book-row.${i}`}
              work={work}
              index={i}
              saveBook={saveBook}
            />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
