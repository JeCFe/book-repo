"use client";
import { BookLogo, JecfeLogo } from "@/assets";
import { AccordionManager } from "@/components";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Anchor, Button } from "@jecfe/react-design-system/dist/esm/";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <div className="flex min-h-screen w-full flex-col items-center pt-10 md:justify-center md:pt-0">
        <div className="pointer-events-none flex items-center justify-center pb-10 md:absolute md:right-8 md:top-8 md:pb-0">
          <BookLogo height="100" />
        </div>
        <h1 className="flex flex-row pt-0 text-center text-5xl font-bold tracking-tight text-slate-200 md:pt-20 md:text-8xl">
          The Book Repository
        </h1>
        <div className="mt-4 flex max-w-sm flex-row text-center text-xl font-bold tracking-tight text-slate-400 md:max-w-full md:text-3xl">
          Your tool for managing and exploring your reading journey.
        </div>

        <AccordionManager
          className="space-y-3 pt-12"
          accordions={[
            {
              title: "What is this?",
              children: `This is a tool that allows you to upload the books on your
                          bookshelf, your ebooks, and books you are looking to buy. Allows you
                          to organise, rate, and track what books you own.`,
            },
            {
              title: "What's the cost?",
              children: `Absolutely none! This is a tool made by a book lover for book lovers.`,
            },
            {
              title: "What if the book details are wrong?",
              children: (
                <span>
                  We are using a public open source API supplied by{" "}
                  <Anchor
                    href="https://openlibrary.org/"
                    className="font-bold"
                    target="_blank"
                  >
                    Open Library
                  </Anchor>
                  . If you run into a book that has incorrect or missing details
                  you'll be able to flag this with us and we can review and
                  update Open Library.
                </span>
              ),
            },
          ]}
        />

        <div className="flex w-full items-center justify-center">
          <Button
            onClick={() => {
              router.push("/dashboard");
            }}
            variant="primary"
            size="large"
            className="my-12"
          >
            Take me there!
          </Button>
        </div>
        <div className="pointer-events-none my-12 flex items-center justify-center pb-12 md:fixed md:bottom-8 md:left-8 md:my-0 md:pb-0">
          <JecfeLogo height="54" />
        </div>
      </div>
    </div>
  );
}
