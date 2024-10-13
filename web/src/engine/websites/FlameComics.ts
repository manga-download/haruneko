import { Tags } from '../Tags';
import icon from './FlameComics.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

@MangaStream.MangaCSS(/^{origin}\/series\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.postbody div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li a')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flamecomics', 'Flame Comics', 'https://flamecomics.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchCSS<HTMLDivElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.composed_figure');
        if (data.length == 0) return MangaStream.FetchPagesSinglePageCSS.call(this, chapter, [/readonflame[^.]+\.(gif|jpeg|jpg|png|avif)$/, /chevron\.png/]);

        return data.map(page => {
            const images = [...page.querySelectorAll('img')].map(image => image.getAttribute('src'));
            return new Page(this, chapter, new URL(images[0]), { secondaryPic: images[1] });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters?.secondaryPic) return Common.FetchImageAjax.call(this, page, priority, signal);

        const promises: Promise<Blob>[] = [];
        promises.push(this.FetchBlob(page.Link.href, priority, signal));
        promises.push(this.FetchBlob((page.Parameters.secondaryPic) as string, priority, signal));
        const [blobMainImage, blobSecondImage] = await Promise.all(promises);

        const b1 = await createImageBitmap(blobMainImage);
        const b2 = await createImageBitmap(blobSecondImage);
        return DeScramble(new ImageData(b1.width + b2.width, b1.height), async (_, ctx) => {
            ctx.drawImage(b1, 0, 0);
            ctx.drawImage(b2, b1.width, 0);
        });
    }

    private async FetchBlob(url: string, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(url, {
                signal,
                headers: {
                    Referer: this.URI.href
                }
            }));
            return response.blob();
        }, priority, signal);
    }
}