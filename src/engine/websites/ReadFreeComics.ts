import { Tags } from '../Tags';
import icon from './ReadFreeComics.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('readfreecomics', 'ReadFreeComics', 'https://readfreecomics.com', [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/webtoon-comic/`).test(url);
    }
}