import { Tags } from '../Tags';
import icon from './MangaBuddy.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MadTheme from './decorators/MadTheme';
import * as Common from './decorators/Common';

@MadTheme.MangaCSS(/^https?:\/\/mangabuddy\.com/)
@MadTheme.MangasMultiPageCSS()
@MadTheme.ChaptersSinglePageCSS()
@MadTheme.PagesSinglePageJS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabuddy', 'MangaBuddy', 'https://mangabuddy.com', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}