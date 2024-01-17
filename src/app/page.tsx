"use client";

import { useRouter } from "next/navigation";

import { ChangeEvent, FormEvent, useState } from "react";

export default function Home() {
  const [pad, setPad] = useState<string>("");

  const router = useRouter();

  function handleNavigation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const route = ("/" + pad).trim();

    if (route === "/") return;

    router.push(route);
  }

  function handlePadChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setPad(value);
  }

  return (
    <div className="flex flex-col justify-center items-center bg-black w-svw h-svh text-white overflow-auto min-w-577 min-h-365">
      <div className="flex flex-col justify-center items-center mt-[-60px]">
        <h1 className="text-9xl bg-gradient-to-r from-purple-600 to-blue-600">
          Mpad
        </h1>
        <p>Collaborative documents in realtime</p>
      </div>

      <div className="flex flex-row items-baseline justify-center">
        <div className="mt-20 text-center p-1">
          <form onSubmit={handleNavigation}>
            <label className="max-w-fit text-end">missopad.com/</label>

            <input
              className="w-64 p-2 max-w-64 bg-[#1e1e1e] ml-2 mr-2 h-[2.25rem] border-none outline-none"
              placeholder="..."
              onChange={handlePadChange}
            />

            <button className="hover:opacity-70" type="submit">
              🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
