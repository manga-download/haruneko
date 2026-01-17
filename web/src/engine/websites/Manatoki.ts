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

const chapterScript = `
    new Promise (resolve => {

        function debloat(element) {
            while (element.querySelector('span')) {
                element.removeChild(element.querySelector('span'));
            }
        }

        resolve ([...document.querySelectorAll("div.serial-list ul li a.item-subject")].map( element => {
            debloat(element);
            return {
                id: element.pathname,
                title : element.textContent.trim()
            };
        }));
    });
`;

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
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, 'ul#webtoon-list-all div.list-item a:has(span.title)', Common.PatternLinkGenerator('/webtoon/p{page}')),
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, 'ul#webtoon-list-all div.list-item a:has(span.title)', Common.PatternLinkGenerator('/comic/p{page}'))
        ];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const url = new URL(manga.Identifier, this.URI);
        return (await Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                url.searchParams.set('spage', page.toString());
                const chaptersData = await FetchWindowScript<{ id: string, title: string }[]>(new Request(url), chapterScript, 500);
                const chapters = chaptersData.map(({id, title }) => new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || title));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this))).distinct();
    }
}