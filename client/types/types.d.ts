import { components } from "@/server-client";

export type Book = {
  book: {
    isbn: string | null;
    name: string | null;
    authors?: string[] | undefined;
    subjects: string[] | null;
    release?: string | undefined;
    picture?: string | undefined;
    pageCount: number;
  };
  id: string;
  order?: number;
  ranking?: number;
};

export type Trophy = components["schemas"]["TrophyData"];
