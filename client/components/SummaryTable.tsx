type Props = {
  title: string;
  rows: { title: string; content: string }[];
};

export function SummaryTable({ title, rows }: Props) {
  return (
    <div className="flex max-w-3xl flex-col rounded border-2 border-slate-200">
      <div className="bg-slate-200 p-4 text-xl">{title}</div>
      <div className="flex flex-col space-y-2 px-4 py-2 text-lg text-slate-200">
        {rows.map((row, index) => (
          <>
            <div className="flex flex-row">
              <div className="font-bold">{row.title}</div>
              <div className="flex flex-grow" />
              <div>{row.content}</div>
            </div>
            {index + 1 !== rows.length && <div className="border-1 border" />}
          </>
        ))}
      </div>
    </div>
  );
}
