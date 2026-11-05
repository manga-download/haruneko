import { Tags } from '../Tags';
import icon from './LxHentai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';

type PagesData = {
    actionToken: string;
    pages: string[];
};

type Token = {
    Token: string;
};

@Common.MangaCSS(/^{origin}\/truyen\/[^/]+/, 'ol li div.flex.items-center span')
@Common.MangasMultiPageCSS('div.w-full.relative div.p-2.w-full.truncate a.text-ellipsis', Common.PatternLinkGenerator('/danh-sach?page={page}'), 300)
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.justify-between ul.overflow-y-auto a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.text-ellipsis').textContent.trim()
}))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lxhentai', `LxHentai (Hentai LXX)`, 'https://lxmanga.space', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<Token>[]> {
        const pageScript = `
            new Promise(resolve => {
                const pages = [...document.querySelectorAll('div#image-container.lazy')].map(image => image.dataset.src);
                resolve ( { pages, actionToken });
            })
        `;

        const { actionToken, pages } = await FetchWindowScript<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 10000);
        return pages.map(page => new Page<Token>(this, chapter, new URL(page), { Token: actionToken }));
    }

    public override async FetchImage(page: Page<Token>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, {
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.origin,
                    Token: page.Parameters.Token
                }
            }));
            return GetTypedData(await response.arrayBuffer());
        }, priority, signal);
    }
}