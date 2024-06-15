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
        super('flamecomics', 'Flame Comics', 'https://flamecomics.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchCSS<HTMLDivElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.composed_figure');
        if (data.length == 0) return MangaStream.FetchPagesSinglePageCSS.call(this, chapter, [/readonflamescans\.png/]);

        return data.map(page => {
            const images = [...page.querySelectorAll('img')].map(image => image.getAttribute('src'));
            return new Page(this, chapter, new URL(images[0]), { secondaryPic: images[1] });
        });
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blobMainImage = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters?.secondaryPic) return blobMainImage;
        const pageUrl = (page.Parameters.secondaryPic) as string;
        const request = new Request(pageUrl, { headers: { Referer: this.URI.href } });
        const response = await Fetch(request);
        const b1 = await createImageBitmap(blobMainImage);
        const b2 = await createImageBitmap(await response.blob());
        return DeScramble(new ImageData(b1.width + b2.width, b1.height), async (_, ctx) => {
            ctx.drawImage(b1, 0, 0);
            ctx.drawImage(b2, b1.width, 0);
        });
    }

}