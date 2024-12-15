import { Tags } from '../Tags';
import icon from './Futabanet.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { SpeedBindVersion } from './decorators/SpeedBinb';

@Common.MangaCSS(/^https:\/\/gaugau\.futabane(t|x)\.jp\/list\/work\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('/list/works?page={page}', 'div.works__grid div.list__box h4 a')

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('futabanet', `がうがうモンスター (Futabanet Monster)`, 'https://gaugau.futabanet.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.URI.origin}${manga.Identifier}/episodes`);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.episode__grid a');
        return data.filter(chapter => !chapter.pathname.endsWith('/app'))
            .map(chapter => {
                const epnum = chapter.querySelector('.episode__num').textContent.trim();
                const title = chapter.querySelector('.episode__title').textContent.trim();
                return new Chapter(this, manga, chapter.pathname, title ? [epnum, title].join(' - ') : epnum);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> { //Not sure if needed anymore
        let pages: Page[] = await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div.works_tateyomi__img img');
        pages = pages?.map(page => new Page(this, chapter, page.Link, { useCommon: true }));
        return pages?.length > 0 ? pages : await SpeedBinb.FetchPagesSinglePageAjax.call(this, chapter, SpeedBindVersion.v016130);
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> { //Not sure if needed anymore
        return page.Parameters?.useCommon ? Common.FetchImageAjax.call(this, page, priority, signal) : SpeedBinb.FetchImageAjax.call(this, page, priority, signal);
    }
}