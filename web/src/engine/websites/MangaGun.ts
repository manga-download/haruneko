import { Tags } from '../Tags';
import icon from './MangaGun.webp';
import * as Common from './decorators/Common';
import { FlatManga, chapterScript, pageScript } from './templates/FlatManga';

@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageJS(pageScript, 1500)
export default class extends FlatManga {

    public constructor() {
        super('mangagun', 'MangaGun', 'https://mangagun.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}