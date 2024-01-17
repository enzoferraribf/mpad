import dynamic from "next/dynamic";

const Pad = dynamic(() => import("@/app/components/pad"), { ssr: false });

export default function Page() {
  return <Pad />;
}
