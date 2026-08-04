import { Tags } from '../Tags';
import icon from './AstreaScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type PagesData = {
    nonce: string;
    chapter_id: number;
    page_token: string;
    load_time: number;
};

type APIPages = {
    data: {
        urls: string[];
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'main.hs-main h1.hs-title')
@Common.MangasMultiPageCSS('div.manga-card-v2 .mc-title a', Common.PatternLinkGenerator('/manga/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.ch-list-item', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.dataset.title.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('astreascans', 'Astrea Scans', 'https://astreascans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter_id, nonce, page_token, load_time } = await FetchWindowScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise ( resolve => {
                const { chapter_id, page_token, load_time }= window.astreaChapterData;
                resolve({
                    nonce: astrea_ajax_vars.nonce,
                    chapter_id,
                    page_token,
                    load_time
                });
            });
        `, 1500);

        const body = new FormData();
        body.set('action', 'astrea_get_chapter_images');
        body.set('nonce', nonce);
        body.set('chapter_id', `${chapter_id}`);
        body.set('load_time', `${load_time}`);
        body.set('page_token', page_token);

        const { data: { urls } } = await FetchJSON<APIPages>(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
            credentials: 'same-origin',
            method: 'POST',
            body
        }));
        return urls.map(url => new Page(this, chapter, new URL(url, this.URI), { Referer: this.URI.href }));
    }
}