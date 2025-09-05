import { Tags } from '../Tags';
import icon from './FireCross.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import * as ClipStudioReader from './decorators/ClipStudioReader';

type ChapterID = {
    id: string,
    token: string
}

type APIResponse = {
    redirect: string
}
function ChapterExtractor(element: HTMLElement) {
    const form = element.querySelector<HTMLFormElement>('form[data-Api="reader"]');
    return {
        id: JSON.stringify({
            token: form.querySelector<HTMLInputElement>('input[name="_token"]').value,
            id: form.querySelector<HTMLInputElement>('input[name="ebook_id"]').value,
        }),
        title: element.querySelector<HTMLSpanElement>('span.shop-item-info-name').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/ebook\/series\/\d+$/, 'div.ebook-series-grid-left h1.ebook-series-title')
@Common.MangasMultiPageCSS('/ebook/comics?page={page}', 'li.seriesList_item a.seriesList_itemTitle')
@Common.ChaptersSinglePageCSS('ul.shop-list li.shop-item--episode:has(form)', ChapterExtractor)
@ClipStudioReader.ImageAjax()

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://firecross.jp/api/';

    public constructor() {
        super('firecross', 'FireCross', 'https://firecross.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterID: ChapterID = JSON.parse(chapter.Identifier);
        const { redirect } = await FetchJSON<APIResponse>(new Request(new URL('reader', this.apiUrl), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams({
                _token: chapterID.token,
                ebook_id: chapterID.id,
            }).toString()
        }));

        const fakechapter = new Chapter(this, chapter.Parent as Manga, redirect, chapter.Title);
        return (await ClipStudioReader.FetchPagesSinglePageAJAX.call(this, fakechapter)).map(page => new Page(this, chapter, page.Link, page.Parameters));
    }
}
