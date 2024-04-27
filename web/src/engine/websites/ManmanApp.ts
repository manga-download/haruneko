import { Tags } from '../Tags';
import icon from './ManmanApp.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapter = {
    code: number,
    data: {
        id: string,
        title: string
    }[]
}

function ChapterExtractor(element: HTMLLIElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector('h3').textContent.trim(),
    };
}

@Common.MangaCSS(/^{origin}\/comic-[\d]+\.html$/, 'div.cartoon li.title', Common.ElementLabelExtractor('span'))
@Common.MangasMultiPageCSS('/comic/category_{page}.html', 'div.classification li.title a')
@Common.PagesSinglePageCSS('img.man_img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manmanapp', `Manman Comic 漫漫漫画`, 'https://www.manmanapp.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // The Ajax call doesnt work with page 1, so we have to fetch page 1 manually
        const chapterslist = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'ul.comic_list li', ChapterExtractor);
        for (let page = 2, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;
    }

    private async GetChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const mangaId = manga.Identifier.match(/(\d+).html/)[1];
        const request = new Request(new URL('/works/comic-list-ajax.html', this.URI).href, {
            method: 'POST',
            body: new URLSearchParams({ id: mangaId, sort: '0', page: String(page) }).toString(),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        });
        const data = await FetchJSON<APIChapter>(request);
        return data.code == 1 ? data.data.map(element => new Chapter(this, manga, `/comic/detail-${element.id}.html`, element.title.trim())) : [];
    }
}