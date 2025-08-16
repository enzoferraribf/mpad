import { ILoadingPhrases } from '../models/loading-phrases';

const LOADING_PHRASES = [
    'Results of the yearly boxing fight between SENAI CIMATEC and Harvard came back, we know who was victorious',
    'Computers are not like this',
    'Unfortunately, I was obligated to extinguish him',
    "Eren wasn't wrong",
    'It has been seven years, you are still in Uni?',
];

export function getRandomPhrase() {
    return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
}

export function LoadingPhrases({ phrase }: ILoadingPhrases) {
    const displayPhrase = phrase || getRandomPhrase();

    return (
        <div className="mt-4 flex h-6 items-center justify-center">
            <p className="text-sm text-muted-foreground">{displayPhrase}</p>
        </div>
    );
}
