import { Tags } from '../Tags';
import icon from './HentaiWebtoon.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('hentaiwebtoon', 'Hentai Webtoon', 'https://hentaiwebtoon.com', [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+\/$`).test(url);
    }
}