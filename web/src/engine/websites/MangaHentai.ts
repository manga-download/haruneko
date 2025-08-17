import { Tags } from '../Tags';
import icon from './MangaHentai.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('mangahentai', 'Manga Hentai', 'https://mangahentai.me', [Tags.Media.Manga, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga-hentai/[^/]+\/$`).test(url);
    }
}