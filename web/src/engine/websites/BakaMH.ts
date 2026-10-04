import { Tags } from '../Tags';
import icon from './BakaMH.webp';
import { Exception } from '../Error';
import { FetchCSS, FetchHTML } from '../platform/FetchProvider';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchChaptersCSS, type MangaID } from './decorators/WordPressMadara';
import * as Madara from './decorators/WordPressMadara';

@Madara.MangasMultiPageAJAX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bakamh', 'BakaMH', 'https://bakamh.com', Tags.Media.Manhwa, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`${this.URI.origin}/manga/[^/]+/$`).test(url);
    }

    public async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const data = await FetchHTML(new Request(uri, {
            headers: {
                'Sec-Fetch-Mode': 'navigate'
            }
        }));
        return new Manga(this, provider, JSON.stringify({
            post: data.querySelector<HTMLInputElement>('input.rating-post-id').value,
            slug: uri.pathname
        }), data.querySelector<HTMLElement>('ol.breadcrumb li:last-of-type a').textContent.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { slug } = JSON.parse(manga.Identifier) as MangaID;
        const chapters = await FetchChaptersCSS.call(this, manga, new Request(new URL(slug, this.URI), {
            headers: {
                'Sec-Fetch-Mode': 'navigate'
            }
        }), 'div.listing-chapters_main li a');
        if (!chapters.length) {
            throw new Exception(R.Plugin_Common_Chapter_InvalidError);
        } else {
            return chapters;
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const elements = await FetchCSS<HTMLImageElement>(new Request(new URL(chapter.Identifier, this.URI), {
            headers: {
                'Sec-Fetch-Mode': 'navigate',
            }
        }), 'div.reading-content div.page-break img');
        return elements.map(element => new Page(this, chapter, new URL(element.dataset.mangaSrc.trim(), this.URI), { Referer: this.URI.href }));
    }
}