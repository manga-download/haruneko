import { Tags } from '../Tags';
import icon from './FreeManga.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('freemanga', 'Free Manga', 'https://freemanga.me', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English]);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+\/$`).test(url);
    }
}