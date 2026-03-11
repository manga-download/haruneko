import { Tags } from '../Tags';
import icon from './MangaHubFR.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type ProtectorData = {
    nonce?: string;
    ajax_url?: string;
    fragment_id?: string;
};

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="MANGAHUB"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahubfr', 'MangaHubFR', 'https://mangahub.fr', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const elements = await FetchCSS<HTMLDivElement | HTMLImageElement>(new Request(chapterUrl), 'div.page-break > div.manga-protected-placeholder, div.page-break img');
        if (elements.length == 0) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { ajax_url, nonce } = await FetchWindowScript<ProtectorData>(new Request(chapterUrl), 'mangaProtectorData');
        return elements.map(element => {
            if (element instanceof HTMLDivElement) {
                return new Page<ProtectorData>(this, chapter, new URL(ajax_url), { nonce, fragment_id: element.dataset.fragmentId, Referer: chapterUrl.href });
            } else return new Page(this, chapter, new URL(element.src), { Referer: chapterUrl.href });
        });
    }

    public override async FetchImage(page: Page<ProtectorData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters.nonce) return await Common.FetchImageAjax.call(this, page, priority, signal);
        return this.imageTaskPool.Add(async () => {

            const { nonce, fragment_id } = page.Parameters;
            const pattern = '1x2';

            async function LoadImage(index: number) {
                const request = new Request(new URL(page.Link), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: new URLSearchParams({
                        action: 'load_img_data',
                        fragment_id,
                        fragment_index: index.toString(),
                        total_fragments: '2',
                        pattern,
                        nonce
                    })
                });

                const response = await Fetch(request);
                return URL.createObjectURL(await response.blob()); // URL temporaire
            }

            const [img1Url, img2Url] = await Promise.all([
                LoadImage(0),
                LoadImage(1)
            ]);

            const img1 = new Image();
            const img2 = new Image();

            await Promise.all([
                new Promise(resolve => { img1.onload = resolve; img1.src = img1Url; }),
                new Promise(resolve => { img2.onload = resolve; img2.src = img2Url; })
            ]);

            return DeScramble(new ImageData(img1.width, img1.height + img2.height), async (_, ctx) => {
                ctx.drawImage(img1, 0, 0);
                ctx.drawImage(img2, 0, img1.height);

                URL.revokeObjectURL(img1Url);
                URL.revokeObjectURL(img2Url);
            });

        }, priority, signal);

    }

}