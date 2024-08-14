import { Tags } from '../Tags';
import icon from './MangaNeloMe.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Zbulu from './decorators/WordPressZbulu';
import { FetchCSS } from '../platform/FetchProvider';

const chapterScript = `
    [...document.querySelectorAll('div#chapterList div.chapters-wrapper a.chap')].map(chapter =>  {
        return {
            id : chapter.pathname, 
            title :chapter.textContent.trim()
        }
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, Zbulu.queryManga, Zbulu.MangaLabelExtractor)
@Zbulu.MangasMultiPageCSS('/popular-manga?page={page}')
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganelome', `MangaNeloMe`, 'https://manganelo.me', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [data] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), 'div.container-chap p#arraydata');
        return data.textContent.split(',').map(link => new Page(this, chapter, new URL(link)));
    }

}