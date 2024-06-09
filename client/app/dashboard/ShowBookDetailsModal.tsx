import { Modal, Picture } from "@/components";

import { useGetBook } from "@/hooks";
import { Spinner } from "@jecfe/react-design-system";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";

type Props = {
  passingIsbn: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setPassingIsbn: Dispatch<SetStateAction<string | undefined>>;
};

export function ShowBookDetailsModal({
  setPassingIsbn,
  passingIsbn,
  showModal,
  setShowModal,
}: Props) {
  const { data, isLoading } = useGetBook(passingIsbn);

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setPassingIsbn(undefined);
        setShowModal(false);
      }}
      error=""
      actioning={isLoading}
      disabled={false}
    >
      <>
        {isLoading || !data ? (
          <div className="flex flex-col items-center justify-center md:flex-row">
            <div className="flex items-center justify-center rounded border border-cyan-500 shadow-2xl md:min-h-[256px] md:min-w-[192px]">
              <Spinner className="flex" fast={isLoading} />
            </div>
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="flex" fast={isLoading} />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div>
              <Picture
                size="large"
                pictureUrl={data.picture}
                title={data.name ?? ""}
                loading={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <RenderSection title="Book Title">{data.name}</RenderSection>
              <RenderSection title="Release Year">{data.release}</RenderSection>

              {data.pageCount && data.pageCount > 0 && (
                <RenderSection title="Page Count">
                  <div className="max-w-sm">{data.pageCount}</div>
                </RenderSection>
              )}

              {data.authors && data.authors.length > 0 && (
                <RenderSection title="Authors">
                  <div className="max-w-sm">{data.authors?.join(", ")}</div>
                </RenderSection>
              )}
              {data.subjects && data.subjects.length > 0 && (
                <RenderSection title="Subjects">
                  <div className="max-w-sm">{data.subjects?.join(", ")}</div>
                </RenderSection>
              )}
            </div>
          </div>
        )}
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
