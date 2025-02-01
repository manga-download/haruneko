import { Tags } from '../Tags';
import icon from './Manatoki.webp';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`
        function CleanPage() {
            document.querySelector('[style="margin-bottom: 20px;"].row.row-15')?.style.setProperty('display', 'none');
            [...document.querySelectorAll('.board-tail-banner')].map(element=> element.style = 'display: none !important');
            return true;
        }
        const result = document.querySelector('div.form-box form[name="fcaptcha"][action*="/bbs/captcha_check.php"') && true || false;
        result ? CleanPage() : false;
    `);
    return result ? FetchRedirection.Interactive : undefined;
});

export const pageScript = `
    new Promise( resolve => {
        html_encoder(html_data);
        resolve([...document.querySelectorAll('img[src*="/img/loading-image.gif"]')].map(image => Object.values(image.dataset).at(0) ));
    });
`;

@Common.MangaCSS(/^https:\/\/manatoki\d+\.net\/(webtoon\/\d+\/[^/]+|comic\/\d+)$/, 'div.page-title span.page-desc')
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    protected urlPrefix = 'https://manatoki';

    public constructor(id = 'manatoki', label = 'Manatoki', url = 'https://manatoki468.net', tags = [Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation]) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = (await FetchCSS<HTMLAnchorElement>(new Request('https://t.me/s/newtoki5'), `a[href^="${this.urlPrefix}"]`)).at(-1)?.origin ?? this.URI.href;
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);

        //trigger Cloudflare turnstile
        await FetchWindowScript(new Request(new URL('/webtoon', this.URI)), '');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, '/webtoon/p{page}', 'ul#webtoon-list-all div.list-item a:has(span.title)'),
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, '/comic/p{page}', 'ul#webtoon-list-all div.list-item a:has(span.title)')
        ];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList : Chapter[]= [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        url.searchParams.set('spage', page.toString());
        const chapters = await FetchCSS<HTMLAnchorElement>(new Request(url), 'div.serial-list ul li a.item-subject');
        const extractor = Common.AnchorInfoExtractor(false, 'span');
        return chapters.map(chapter => {
            const { id, title } = extractor.call(this, chapter);
            return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title);
        });
    }
}