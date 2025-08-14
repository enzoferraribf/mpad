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
        <div className="center-fullscreen-column overflow-auto surface-primary">
            <div className="center-column">
                <h1 className="brand-title">Mpad</h1>
                <p>Collaborative documents in realtime</p>
            </div>

            <div className="center-horizontal">
                <div className="section-spacing item-padding text-center">
                    <form className="content-spacing" onSubmit={handleNavigation}>
                        <label className="max-w-fit text-end">missopad.com/</label>

                        <input className="mx-2 h-[2.25rem] w-48 max-w-48 surface-input content-padding outline-none" placeholder="..." onChange={handlePadChange} />

                        <button className="hover:opacity-70" type="submit">
                            🚀
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
