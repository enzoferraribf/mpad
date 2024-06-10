'use server';

export async function getICEServers() {
    const key = process.env.OPEN_RELAY_API_KEY!;

    const response = await fetch(`https://missopad.metered.live/api/v1/turn/credentials?apiKey=${key}`);

    const configuration = await response.json();

    return configuration ?? null;
}
