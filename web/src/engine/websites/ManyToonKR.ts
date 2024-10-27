import { Tags } from '../Tags';
import icon from './ManyToonKR.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('manytoonkr', 'ManyToonKR', 'https://manytoon.club', [Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Korean, Tags.Rating.Pornographic, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manhwa-raw/[^/]+\/$`).test(url);
    }

}