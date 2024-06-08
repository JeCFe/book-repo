import { cva } from "class-variance-authority";
import { HTMLAttributes, ReactNode } from "react";
import styles from "./table.module.css";

const table = cva(`${styles.table}`);

type Props = {
  caption?: ReactNode;
  children?: ReactNode | ReactNode[];
} & HTMLAttributes<HTMLTableElement>;

export function Table({ caption, children, className, ...props }: Props) {
  return (
    <table className={table({ className })} {...props}>
      {caption && <caption>{caption}</caption>}
      {children}
    </table>
  );
}
