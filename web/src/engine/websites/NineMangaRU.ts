import { Tags } from '../Tags';
import icon from './NineMangaRU.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as TAADD from './decorators/TAADDBase';
import * as Common from './decorators/Common';
import { Fetch, FetchRegex } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\.html/, 'div.manga div.ttline h1', TAADD.MangaLabelExtractor)
@Common.MangasMultiPageCSS(TAADD.mangaPath, TAADD.queryMangas)
@TAADD.ChaptersSinglePageCSS()
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {
    public constructor() {
        super('ninemanga-ru', `NineMangaRU`, 'https://ru.ninemanga.com', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages: Page[] = [];

        //1) Fetch "server page" & get GO page from button
        let response = await Fetch(this.CreateRequest(new URL(chapter.Identifier, this.URI), this.URI.href));
        const serverChoicePage = response.url; //get redirected url
        const buttonLink = new DOMParser().parseFromString(await response.text(), 'text/html').querySelector<HTMLAnchorElement>('a.cool-blue').href;
        const cookieValue = new URL(buttonLink, response.url).searchParams.get('cid');

        //2) get javascript redirect from page
        const [ nextPathname ] = await FetchRegex(this.CreateRequest(new URL(buttonLink), serverChoicePage), /window\.location\.href\s*=\s*['"](.*)['"]/g );
        const lastLocation = new URL(nextPathname, buttonLink);

        //3) forge Cookie
        const cookieName = 'lrgarden_visit_check_' + lastLocation.pathname.match(/(\d+)\.html$/).at(1);
        const cookie = `${cookieName}=${cookieValue};`;

        //4) get pages
        response = await Fetch(this.CreateRequest(lastLocation, buttonLink, cookie));
        const data = (await response.text()).replaceAll(/(\r\n|\n|\r)/gm, '').match(/all_imgs_url\s*:\s*(\[[^\]]*\])/).at(1);

        let result;
        while (result = /(http[^'"]+)['"]/g.exec(data)) {
            pages.push(new Page(this, chapter, new URL(result[1]), { Referer: lastLocation.href }));
        }
        return pages;
    }

    private CreateRequest(endpoint: URL, referer: string, cookie: string = ''): Request {
        return new Request(endpoint, {
            headers: {
                Referer: referer,
                Cookie: cookie
            }
        });
    }

}