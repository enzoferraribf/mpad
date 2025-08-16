import { LoadingPhrases } from '../components/loading-phrases';

export default function Loader() {
    return (
        <div className="center-fullscreen center-column">
            <h1 className="brand-title">Mpad</h1>
            <LoadingPhrases />
        </div>
    );
}
