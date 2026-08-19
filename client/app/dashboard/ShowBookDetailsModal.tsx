import { Modal, Picture, RenderSection, RenderStar } from "@/components";
import { useGetCustomerBook } from "@/hooks";
import { Spinner } from "@jecfe/react-design-system";
import { Dispatch, SetStateAction } from "react";

type Props = {
  passingCustomerBookId: string;
  showModal: boolean;
  userId: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setPassingCustomerBookId: Dispatch<SetStateAction<string | undefined>>;
};

export function ShowBookDetailsModal({
  setPassingCustomerBookId,
  passingCustomerBookId,
  userId,
  showModal,
  setShowModal,
}: Props) {
  const { data, isLoading } = useGetCustomerBook(userId, passingCustomerBookId);

  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setPassingCustomerBookId(undefined);
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
          <div className="flex flex-col pb-4">
            <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
              <div>
                <Picture
                  size="large"
                  pictureUrl={data.book.picture}
                  title={data.book.name ?? ""}
                  loading={isLoading}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <RenderSection title="Book Title">
                  {data.book.name}
                </RenderSection>
                <RenderSection title="Rating">
                  <RenderStar ranking={data.ranking} />
                </RenderSection>
                <RenderSection title="Release Year">
                  {data.book.release}
                </RenderSection>

                {data.book.pageCount && data.book.pageCount > 0 && (
                  <RenderSection title="Page Count">
                    <div className="max-w-sm">{data.book.pageCount}</div>
                  </RenderSection>
                )}

                {data.book.authors && data.book.authors.length > 0 && (
                  <RenderSection title="Authors">
                    <div className="max-w-sm">
                      {data.book.authors?.join(", ")}
                    </div>
                  </RenderSection>
                )}
                {data.book.subjects && data.book.subjects.length > 0 && (
                  <RenderSection title="Subjects">
                    <div className="max-w-sm">
                      {data.book.subjects?.join(", ")}
                    </div>
                  </RenderSection>
                )}
              </div>
            </div>
            <div className="mt-4 w-full">
              <RenderSection title={<div>Comment</div>}>
                {data.comment}
              </RenderSection>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
}
