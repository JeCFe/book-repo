import { Anchor } from "@jecfe/react-design-system";

type Props = {
  crumbs: {
    display: string;
    href?: string;
  }[];
};

export function Breadcrumb({ crumbs }: Props) {
  return (
    <nav>
      <ol className="mb-6 flex flex-row space-x-2">
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.display}.${index}`}>
            {crumb.href ? (
              <Anchor href={crumb.href}>{`< ${crumb.display}`}</Anchor>
            ) : (
              <span className="text-slate-400 underline underline-offset-4">
                {"< Choose how to add"}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
