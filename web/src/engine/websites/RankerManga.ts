import { Tags } from '../Tags';
import icon from './RankerManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import type { JSImageData, ImageData } from './MangaKimi';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div.series-title')
@Common.MangasMultiPageCSS('div.flexbox4-side div.title a', Common.PatternLinkGenerator('/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.series-chapterlist li div.flexch-infoz a', undefined, Common.AnchorInfoExtractor(false, 'span.date'))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rankermanga', 'Ranker-Manga', 'https://www.ranker-manga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator, Tags.Language.Thai);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowScript<JSImageData[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise( resolve => {
                const nodes = [...document.querySelectorAll('div.reader-area :is(img, canvas)')];

                if (nodes.every(node => node instanceof HTMLImageElement)) {
                    resolve(nodes.map(node => ({ url : node.src })));
                };

                window.addEventListener('rocket-allScriptsLoaded', (e => {
                    processImages();
                }));

                new RocketLazyLoadScripts()._triggerListener(); //force script loading

                function processImages() {
                    const images = nodes.map(node => {
                        if (node instanceof HTMLImageElement) return { url: node.src };

                        eval(node.nextElementSibling.text);

                        const prefix = node.id.replace('image', '').replace(/\\d+$/, '');
                        const imageKey = Object.keys(window).find(key=> key.startsWith(prefix) && window[key] instanceof HTMLImageElement);
                        const func = window[imageKey].onload.toString();
                        const sovleImage = JSON.parse(func.match(/var sovleImage=(\\[.*?\\]);/).at(1));

                        const pieces = sovleImage.map(piece => {
                            return {
                                destX: parseFloat(piece[0]),
                                destY: parseFloat(piece[1]),
                                srcX: parseFloat(piece[2]),
                                srcY: parseFloat(piece[3]),
                            }
                        });
                        return {
                            url: node.dataset.url,
                            pieces
                        };
                    });
                    resolve(images);
                }
            })
        `, 1500);
        return images.map(({ url, pieces }) => new Page<ImageData>(this, chapter, new URL(url), { pieces }));
    }

    public override async FetchImage(page: Page<ImageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return !page.Parameters?.pieces ? blob : DeScramble(blob, async (image, ctx) => {
            const pieceWidth = image.width / 2;
            const pieceHeight = image.height / 5;
            for (const { destX, destY, srcX, srcY } of page.Parameters.pieces) {
                ctx.drawImage(image, srcX, srcY, pieceWidth, pieceHeight, destX, destY, pieceWidth, pieceHeight);
            }
        });
    }

}