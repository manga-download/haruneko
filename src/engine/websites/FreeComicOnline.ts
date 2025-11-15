import { Tags } from '../Tags';
import icon from './FreeComicOnline.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('freecomiconline', 'Free Comic Online', 'https://freecomiconline.me', [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica]);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+\/$`).test(url);
    }

    public override get Icon() {
        return icon;
    }
}