import { Tags } from '../Tags';
import icon from './RimacomiPlus.webp';
import { ComiciViewer } from './templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('rimacomiplus', `RimacomiPlus (リマコミ＋)`, 'https://rimacomiplus.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}(/[^/]+)?/series/[^/]+/?$`).test(url);
    }

    public override get Icon() {
        return icon;
    }
}