import React from "react";

import dynamic from "next/dynamic";

import { getInitialPageContent } from "@/app/actions";

import Header from "@/app/components/header";

const Pad = dynamic(() => import("@/app/components/pad"), { ssr: false });

interface IPageProps {
  params: { slug: string[] };
}

function joinSlug(slug: string[]) {
  return "/" + slug.join("/");
}

export default async function Page({ params }: IPageProps) {
  const slug = joinSlug(params.slug);

  const { buffer, lastUpdate } = await getInitialPageContent(slug);

  return (
    <main className="grid grid-rows-13 grid-cols-8 gap-4 h-svh w-svw overflow-hidden p-4">
      <div className="col-span-8 row-span-2">
        <Header />
      </div>

      <div className="col-span-8 row-span-8">
        <Pad
          pathname={slug}
          initialChangeSet={buffer}
          initialLastUpdate={lastUpdate}
        />
      </div>
    </main>
  );
}
