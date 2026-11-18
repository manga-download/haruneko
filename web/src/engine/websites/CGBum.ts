import { Tags } from '../Tags';
import icon from './CGBum.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';
import { RandomText } from '../Random';
import { FetchWindowPreloadScript } from '../platform/FetchProvider';

@MangaStream.MangaCSS(/^{origin}\/komik\/[^\/]+$/, 'div.comic-info h1')
@Common.MangasMultiPageCSS('article.comic-card h3.comic-card-title a', Common.PatternLinkGenerator('/daftar-komik?page={page}'))
@Common.ChaptersSinglePageCSS('div.chapter-grid a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cgbum', 'CGBum', 'https://cgbum.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const eventName = RandomText(Math.random() * 8 + 8);
        const preload = `
            const nativeJson = Response.prototype.json;
            Response.prototype.json = async function () {
                const data = await nativeJson.call(this);
                if (data?.images) {
                    debugger;
                    setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: data })), 250);
                }
                return data;
            };
        `;
        const script = `
            new Promise(resolve => {
                window.addEventListener('${eventName}', event => resolve(event.detail.images), { once: true });
            });
        `;

        const images = await FetchWindowPreloadScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), preload, script, 0, 30_000);
        return images.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }
}