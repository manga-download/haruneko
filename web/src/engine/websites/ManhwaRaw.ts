import { Tags } from '../Tags';
import icon from './ManhwaRaw.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor () {
        super('manhwaraw', 'Manhwa Raw', 'https://manhwaraw.com', [ Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic ]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manhwa-raw/[^/]+\/$`).test(url);
    }
}