'use server';

export async function getICEServers() {
    const key = process.env.OPEN_RELAY_API_KEY!;

    const response = await fetch(`https://missopad.metered.live/api/v1/turn/credentials?apiKey=${key}`);

    const configuration = await response.json();

    return (
        [
            ...configuration,
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            { urls: 'stun:stun3.l.google.com:19302' },
            { urls: 'stun:stun4.l.google.com:19302' },
            { urls: 'stun:freeturn.net:5349' },
            { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' },
        ] ?? null
    );
}
