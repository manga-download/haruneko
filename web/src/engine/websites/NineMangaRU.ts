import { Tags } from '../Tags';
import icon from './NineMangaRU.webp';
import { Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as TAADD from './decorators/TAADD';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowPreloadScript, FetchWindowScript } from '../platform/FetchProvider';

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
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        let request = new Request(chapterUrl, {
            headers: {
                Referer: this.URI.origin,
            }
        });

        let response = await Fetch(request);
        const serverPage = response.url;
        const buttonLink = new DOMParser().parseFromString((await response.text()), 'text/html').querySelector<HTMLAnchorElement>('a.cool-blue').href;
        const cookieValue = new URL(buttonLink, response.url).searchParams.get('cid');

        //2) get javascript redirect from page
        request = new Request(buttonLink, {
            headers: {
                Referer: serverPage,
            }
        });

        response = await Fetch(request);
        let data = await response.text();
        const lastLocation = new URL(data.match(/window\.location\.href\s*=\s*['"](.*)['"]/)[1], request.url);

        //3) forge Cookie
        const cookieName = 'lrgarden_visit_check_' + lastLocation.pathname.match(/(\d+)\.html$/)[1];
        const cookie = `${cookieName}=${cookieValue};`;

        //4) get pages
        request = new Request(lastLocation, {
            //credentials: 'include',
            headers: {
                Referer: buttonLink,
                Cookie: cookie
            }
        });
        response = await Fetch(request);
        data = await response.text();
        data = data.replaceAll(/(\r\n|\n|\r)/gm, "").match(/all_imgs_url\s*:\s*(\[[^\]]*\])/)[1];

        let result;
        const pageRegexp = /(http[^'"]+)['"]/g;
        while (result = pageRegexp.exec(data)) {
            pages.push(new Page(this, chapter, new URL(result[1]), { Referer: lastLocation.href }))
        }

        return pages;
    }

}