import { Tags } from '../Tags';
import { FetchWindowScript } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import icon from './Turktoon.webp';
import * as Common from './decorators/Common';
import { ZeistManga } from './templates/ZeistManga';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1.entry-title')
export default class extends ZeistManga {

    public constructor() {
        super('turktoon', 'Turktoon', 'https://www.turktoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
        this.WithMangaSlugScript('document.querySelector("div#bookmarkData").dataset.path;');
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages : string[]= await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), () => {
            const elements = [...document.querySelectorAll("[data-post-body]")];
            const chapterImages = [];
            for (const element of elements) {
                const doc = new DOMParser().parseFromString(JSON.parse("\"" + element['dataset']['postBody'] + "\""), 'text/html');
                const imageData = doc.querySelector('script')?.textContent?.match(/\[(?:\s*"https?:\/\/[^"]+"\s*,?)+\]/)?.at(0);
                const images = imageData ? JSON.parse(imageData) : [...doc.querySelectorAll('img')].map(img => img.src);
                chapterImages.push(...images.map(image => image.replace(/\/s\d+[^/]*(\/[^/]+$)/, '/s0$1')));
            }
            return chapterImages;
        }, 1500);
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}