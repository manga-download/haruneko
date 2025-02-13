import { Tags } from '../Tags';
import icon from './MangaGun.webp';
import * as Common from './decorators/Common';
import { FlatManga, ChapterScript, PageScript } from './templates/FlatManga';

@Common.ChaptersSinglePageJS(ChapterScript(), 1500)
@Common.PagesSinglePageJS(PageScript(), 1500)
export default class extends FlatManga {

    public constructor() {
        super('mangagun', 'MangaGun', 'https://mangagun.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}