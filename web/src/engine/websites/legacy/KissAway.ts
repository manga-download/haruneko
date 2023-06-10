import { Tags } from '../../Tags';
import icon from './KissAway.webp';
import { type Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as FlatManga from '../decorators/FlatManga';
import { FetchRequest, FetchWindowScript } from '../../FetchProvider';

//TODO Implement at request level a BYPASS for this DDOSS protection
//its not triggered on main page but on manga page

let ddosProtectionPassed = false;

@Common.MangaCSS(/^https?:\/\/klz9\.com\/\S+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasSinglePageCSS(FlatManga.pathSinglePageManga, FlatManga.queryMangas)
@FlatManga.PagesSinglePageCSS()
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kissaway', `KLManga`, 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (!ddosProtectionPassed) {
            await FetchWindowScript(new FetchRequest(new URL(manga.Identifier, this.URI).href), '', 5000);
            ddosProtectionPassed = true;
        }
        const chapters = await FlatManga.FetchChaptersSinglePageCSS.call(this, manga, FlatManga.queryChapters);
        //dupe example : https://klz9.com/ybed-29-years-old-bachelor-was-brought-to-a-different-world-to-live-freely-raw.html
        const uniqueChapters = chapters.filter(
            (obj, index) =>
                chapters.findIndex((item) => item.Identifier === obj.Identifier) === index
        );
        return uniqueChapters;
    }
}
