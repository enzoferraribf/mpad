'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ChangeEvent, FormEvent, useState } from 'react';

export default function Home() {
    const [pad, setPad] = useState<string>('');

    const router = useRouter();

    function handleNavigation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const route = ('/' + pad).trim();

        if (route === '/') return;

        router.push(route);
    }

    function handlePadChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        setPad(value);
    }

    return (
        <div className="min-w-577 min-h-365 flex h-svh w-svw flex-col items-center justify-center overflow-auto bg-background">
            <div className="mt-[-60px] flex flex-col items-center justify-center">
                <h1 className="background-animate bg-gradient-to-r  from-purple-600 via-sky-600 to-blue-600 text-9xl">Mpad</h1>
                <p>Collaborative documents in realtime</p>
            </div>

            <div className="flex flex-row items-baseline justify-center">
                <div className="mt-20 p-1 text-center">
                    <form className="mb-10" onSubmit={handleNavigation}>
                        <label className="max-w-fit text-end">missopad.com/</label>

                        <input className="ml-2 mr-2 h-[2.25rem] w-48 max-w-48 border-none bg-accent p-2 outline-none" placeholder="..." onChange={handlePadChange} />

                        <button className="hover:opacity-70" type="submit">
                            🚀
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
