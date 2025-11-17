import { Tags } from '../Tags';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import type { Priority } from '../taskpool/TaskPool';
import DeScramble from '../transformers/ImageDescrambler';
import icon from './MangaPro.webp';
import * as Common from './decorators/Common';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    id: number;
    title: string;
    slug: string;
    type: string;
};

type ImagesData = {
    images: string[];
    maps: MappedImage[];
}

type MappedImage = {
    mode: string;
    order: number[];
    pieces: string[];
    dim: number[];//[width, height]
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/series\/[^/]+\/\d+\/[^/]+$/, 'meta[property="og:image:alt"]')
@Common.ChaptersSinglePageCSS('div.space-y-2 a[href^="/series"]', undefined, Common.AnchorInfoExtractor(false, 'span[class]'))
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://prochan.net/api/public/';

    public constructor() {
        super('mangapro', 'Pro Chan', 'https://prochan.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await this.FetchAPI<APIResult<APIManga[]>>('./series/search?limit=9999&page=1&sort=latest');
        return data.map(({ id, title, type, slug }) => new Manga(this, provider, `/series/${type}/${id}/${slug}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<MappedImage>[]> {
        const { images, maps } = await FetchNextJS<ImagesData>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data);
        const pages = images.map(image => new Page<MappedImage>(this, chapter, new URL(image, this.URI)));

        for (let mappedImage of maps) {
            const page = new Page<MappedImage>(this, chapter, this.URI, { ...mappedImage });
            pages.push(page);
        };
        return pages;
    }

    public override async FetchImage(page: Page<MappedImage>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (!page.Parameters?.mode) return Common.FetchImageAjax.call(this, page, priority, signal, true);
        return this.imageTaskPool.Add(async () => {

            const { dim, mode, order, pieces } = page.Parameters;
            const [puzzleMode, layout] = mode.split('_');

            return DeScramble(new ImageData(dim[0], dim[1]), async (_, ctx) => {
                function loadImage(src: string): Promise<HTMLImageElement> {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                        img.src = src;
                    });
                }

                const orderedPieces = order.map(index => pieces[index]);
                const images = await Promise.all(orderedPieces.map(loadImage));

                switch (puzzleMode) {
                    case 'vertical': {
                        let x = 0;
                        for (const img of images) {
                            ctx.drawImage(img, x, 0);
                            x += img.width;
                        }
                    };
                    case 'grid': {
                        const [cols, rows] = layout.split('x').map(value => parseInt(value));

                        let y = 0;
                        for (let r = 0; r < rows; r++) {
                            let x = 0;
                            for (let c = 0; c < cols; c++) {
                                const index = r * cols + c;
                                if (index < images.length) {
                                    const img = images[index];
                                    ctx.drawImage(img, x, y, img.width, img.height);
                                    x += img.width;
                                }
                            }
                            const rowImages = images.slice(r * cols, (r + 1) * cols);
                            const rowHeight = Math.max(...rowImages.map(i => i.height));
                            y += rowHeight;
                        }
                    };
                }

            });
        }, priority, signal);
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string): Promise<T> {
        return await FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl)));
    }
}