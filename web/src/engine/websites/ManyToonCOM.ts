import { Tags } from '../Tags';
import icon from './ManyToonCOM.webp';
import ManhwaHentaiMe from './ManhwaHentaiMe';

export default class extends ManhwaHentaiMe {

    public constructor() {
        super('manytooncom', 'ManyToon', 'https://manytoon.com', [Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic]);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/comic/[^/]+\/$`).test(url);
    }

    public override get Icon() {
        return icon;
    }
}