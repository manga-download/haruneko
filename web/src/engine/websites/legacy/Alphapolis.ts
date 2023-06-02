import { Tags } from '../../Tags';
import icon from './Alphapolis.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import { FetchCSS, FetchRequest } from '../../FetchProvider';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('.title').textContent.replace('[R18]', '').trim();
    return { id, title };
}

function ChaptersExtractor(element: HTMLDivElement) {
    const id = element.querySelector<HTMLAnchorElement>('a.read-episode').pathname;
    const title = element.querySelector<HTMLDivElement>('div.title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/www\.alphapolis\.co\.jp\/manga\/official\/\d+/, 'div.manga-detail-description > div.title')
@Common.MangasMultiPageCSS(`/manga/official/search?page={page}`, 'div.official-manga-panel > a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.episode-unit', ChaptersExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphapolis', `ALPHAPOLIS (アルファポリス)`, 'https://www.alphapolis.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchCSS(request, 'viewer-manga-horizontal');
        try {
            const pages = JSON.parse(data[0].getAttribute('v-bind:pages'));
            return pages.filter(element => typeof element != 'object' && !element.match('white_page')).map(element => new Page(this, chapter, new URL(element.replace(/\/[0-9]+x[0-9]+.([\w]+)/, '/1080x1536.$1'))));
        } catch (error) {
            throw new Error(`The chapter '${chapter.Title}' is neither public, nor purchased!`);
        }
    }
}