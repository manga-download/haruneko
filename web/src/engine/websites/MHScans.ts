import { Tags } from '../Tags';
import icon from './MHScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS, FetchHTML, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APITokenResult = {
    data: {
        token: string;
        reader_url: string;
        sso_jwt: string;
    };
};

@Madara.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private ReaderKnight = { nonce: '', ajaxUrl: '' };

    public constructor() {
        super('mhscans', 'MHScans', 'https://mh.inventariooculto.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.ReaderKnight = await FetchWindowScript<{ nonce: string, ajaxUrl: string }>(new Request(this.URI), `RK`, 750);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const chapterId = doc.querySelector<HTMLElement>("#wp-manga-current-chap")?.dataset.id;
        const mangaId = doc.querySelector<HTMLElement>("#manga-reading-nav-head")?.dataset.id;
        if (!chapterId || !mangaId) return Madara.FetchPagesSinglePageCSS.call(this, chapter);

        //Request Token
        const { data: { token, reader_url, sso_jwt } } = await FetchJSON<APITokenResult>(new Request(new URL(this.ReaderKnight.ajaxUrl), {
            method: 'POST',
            body: new URLSearchParams({
                action: 'rk_get_token',
                nonce: this.ReaderKnight.nonce,
                chapter_id: chapterId,
                manga_id: mangaId
            })
        }));

        //Request html page using POST
        const pages = await FetchCSS<HTMLImageElement>(new Request(new URL(reader_url), {
            method: 'POST',
            body: new URLSearchParams({
                rt: token,
                chapter_id: chapterId,
                manga_id: mangaId,
                ...sso_jwt && { sso_jwt }
            })
        }), 'div.rk-page-wrap img');

        return pages.map(page => new Page(this, chapter, new URL(page.dataset?.src || page.src )));
    }
}