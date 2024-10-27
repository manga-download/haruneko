import { Tags } from '../Tags';
import icon from './ManyToon.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('manytoon', 'ManyToon(.me)', 'https://manytoon.me', [Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manhwa/[^/]+\/$`).test(url);
    }
}